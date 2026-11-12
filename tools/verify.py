#!/usr/bin/env python3
"""Read-only artifact and runtime checks; never stops services or prints secrets."""
import argparse,hashlib,ipaddress,json,os,subprocess,sys
from pathlib import Path
from prepare import read_env

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--static',action='store_true');a=ap.parse_args()
    root=Path(__file__).resolve().parents[1];checks={}
    for line in (root/'checksums.sha256').read_text().splitlines():
        expected,rel=line.split('  ',1);p=root/rel
        checks['file:'+rel]=p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==expected
    if not a.static:
        env=read_env(root/'.env');prefix=['docker'] if os.geteuid()==0 else ['sudo','-n','docker']
        def d(*args,timeout=20):
            p=subprocess.run(prefix+list(args),capture_output=True,text=True,timeout=timeout)
            if p.returncode:raise RuntimeError('Docker diagnostic failed: '+str(args[:2]))
            return p.stdout
        def inspect(n):return json.loads(d('inspect',n))[0]
        fw,sb,wt=[inspect(n) for n in ['sandbox-firewall','sandbox-singbox','sandbox-webtop']]
        checks['all_containers_running']=all(c['State']['Running'] for c in [fw,sb,wt])
        checks['webtop_image_pinned']=wt['Config']['Image']==env['WEBTOP_IMAGE']
        checks['singbox_image_pinned']=sb['Config']['Image']==env['SINGBOX_IMAGE']
        ports=fw['NetworkSettings']['Ports'].get('3001/tcp') or []
        checks['loopback_publish_only']=bool(ports) and all(p['HostIp']=='127.0.0.1' for p in ports)
        checks['shared_firewall_netns']=all(c['HostConfig']['NetworkMode']=='container:'+fw['Id'] for c in [sb,wt])
        checks['not_privileged']=not wt['HostConfig']['Privileged']
        checks['no_new_privileges']='no-new-privileges:true' in (wt['HostConfig'].get('SecurityOpt') or [])
        rules=d('exec','sandbox-firewall','iptables','-S','OUTPUT')
        checks['output_default_drop']='-P OUTPUT DROP' in rules
        checks['docker_dns_block']='127.0.0.11/32' in rules and '-j REJECT' in rules
        accepts=[line for line in rules.splitlines() if '-j ACCEPT' in line]
        checks['only_configured_proxy_new_connection']=len(accepts)==3 and any('-o lo ' in line for line in accepts) and any('ESTABLISHED' in line and 'RELATED' in line for line in accepts) and any(('-d '+env['EGRESS_SERVER_IP']+'/32') in line and ('--dport '+env['EGRESS_SERVER_PORT']) in line for line in accepts)
        checks['dns_53_rejected']=all(any(('-p '+proto+' ') in line and '--dport 53' in line and '-j REJECT' in line for line in rules.splitlines()) for proto in ['tcp','udp'])
        checks['no_docker_socket_mount']=not any(m['Destination'].endswith('docker.sock') or m['Source'].endswith('docker.sock') for m in wt['Mounts'])
        checks['ipv6_output_drop']='-P OUTPUT DROP' in d('exec','sandbox-firewall','ip6tables','-S','OUTPUT')
        checks['configured_timezone']=d('exec','sandbox-webtop','printenv','TZ').strip()==env['SANDBOX_TZ']
        status=d('exec','-u','abc','sandbox-webtop','cat','/proc/self/status')
        checks['desktop_nnp_1']='NoNewPrivs:\t1' in status
        sudo=subprocess.run(prefix+['exec','-u','abc','sandbox-webtop','sudo','-n','true'],capture_output=True,timeout=8)
        checks['desktop_sudo_denied']=sudo.returncode!=0
        cfg=json.loads((root/'config/sing-box.json').read_text())
        checks['dns_no_fallback']=len(cfg['dns']['servers'])==1 and cfg['dns']['servers'][0]['server']==env['DNS_UPSTREAM_IP'] and cfg['dns']['servers'][0]['server_port']==int(env['DNS_UPSTREAM_PORT']) and cfg['dns']['servers'][0]['detour']=='egress'
        egress=d('exec','-u','abc','sandbox-webtop','curl','-fsS','--max-time','20','-x','http://127.0.0.1:2080','https://api.ipify.org',timeout=25).strip()
        checks['proxy_returns_public_ipv4']=ipaddress.IPv4Address(egress).is_global
        if env.get('EXPECTED_EGRESS_IP'):checks['expected_public_egress']=egress==env['EXPECTED_EGRESS_IP']
        probe='import socket; s=socket.socket();s.settimeout(3);r=s.connect_ex(("1.1.1.1",443));s.close();print("blocked" if r else "reachable")'
        checks['direct_public_blocked']=d('exec','-u','abc','sandbox-webtop','python3','-c',probe).strip()=='blocked'
        ts=subprocess.run(['tailscale','serve','status','--json'],capture_output=True,text=True,timeout=10)
        if ts.returncode==0:
            serve=json.loads(ts.stdout);web=serve.get('Web',{})
            checks['tailscale_https']=serve.get('TCP',{}).get('443',{}).get('HTTPS') is True
            checks['tailscale_loopback_backend']=any(v.get('Handlers',{}).get('/',{}).get('Proxy')=='https+insecure://127.0.0.1:3001' for v in web.values())
            checks['funnel_not_enabled']=not any(serve.get('AllowFunnel',{}).values())
        else:checks['tailscale_status_available']=False
    for k,v in checks.items():print(('PASS ' if v else 'FAIL ')+k)
    print(json.dumps({'passed':all(checks.values()),'checks':len(checks),'mode':'static' if a.static else 'runtime'}))
    return 0 if all(checks.values()) else 1

if __name__=='__main__':
    try:sys.exit(main())
    except Exception as e:print('Verification stopped:',type(e).__name__,str(e));sys.exit(2)
