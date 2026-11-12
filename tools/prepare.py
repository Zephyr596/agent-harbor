#!/usr/bin/env python3
"""Render a new deployment without starting services or copying private state."""
import argparse,base64,ipaddress,json,os,re,shutil
from pathlib import Path
from zoneinfo import ZoneInfo

def read_env(p):
    result={}
    for line in p.read_text().splitlines():
        line=line.strip()
        if not line or line.startswith('#'):continue
        if '=' not in line:raise ValueError('Expected KEY=value in .env')
        k,v=line.split('=',1)
        if not re.fullmatch(r'[A-Z][A-Z0-9_]*',k):raise ValueError('Invalid environment key')
        if len(v)>1 and v[0]==v[-1] and v[0] in '\"\'':v=v[1:-1]
        result[k]=v
    return result

def main():
    a=argparse.ArgumentParser(description=__doc__)
    a.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    a.add_argument('--config-only',action='store_true',help='Render proxy configuration without seeding a new home')
    args=a.parse_args();root=args.root.resolve();env=read_env(root/'.env')
    ip=str(ipaddress.IPv4Address(env['EGRESS_SERVER_IP']))
    if not 1<=int(env['EGRESS_SERVER_PORT'])<=65535:raise ValueError('Invalid TCP port')
    if env.get('SS_METHOD')!='2022-blake3-aes-128-gcm':raise ValueError('This recipe expects the recorded Shadowsocks-2022 method')
    if len(base64.b64decode(env['SS_PASSWORD'],validate=True))!=16:raise ValueError('SS_PASSWORD must encode exactly 16 bytes')
    dns_ip=str(ipaddress.IPv4Address(env['DNS_UPSTREAM_IP']))
    dns_port=int(env['DNS_UPSTREAM_PORT'])
    if not 1<=dns_port<=65535:raise ValueError('Invalid DNS TCP port')
    ZoneInfo(env['SANDBOX_TZ'])
    if env.get('EXPECTED_EGRESS_IP'):ipaddress.IPv4Address(env['EXPECTED_EGRESS_IP'])
    uid,gid=int(env['SANDBOX_UID']),int(env['SANDBOX_GID'])
    if uid<=0 or gid<=0:raise ValueError('Desktop UID/GID must be non-root')
    for key in ['WEBTOP_IMAGE','SINGBOX_IMAGE','FIREWALL_BASE_IMAGE']:
        if not re.search(r'@sha256:[0-9a-f]{64}$',env[key]):raise ValueError(key+' must be digest-pinned')
    data=root/'webtop-data'
    if not args.config_only and data.exists() and any(data.iterdir()):
        raise ValueError('webtop-data is not empty; refusing to overwrite an existing desktop. Use --config-only only for a deliberate proxy edit.')
    cfg=json.loads((root/'config/sing-box.template.json').read_text())
    outbound=cfg['outbounds'][0]
    outbound.update(server=ip,server_port=int(env['EGRESS_SERVER_PORT']),method=env['SS_METHOD'],password=env['SS_PASSWORD'])
    cfg['dns']['servers'][0].update(server=dns_ip,server_port=dns_port)
    target=root/'config/sing-box.json'
    # Keep the inode stable when this file is already bind-mounted.
    target.parent.mkdir(exist_ok=True);target.write_text(json.dumps(cfg,indent=2)+'\n');target.chmod(0o600)
    (root/'.env').chmod(0o600)
    if not args.config_only:
        data.mkdir(mode=0o700,exist_ok=True)
        shutil.copytree(root/'seed/home',data,dirs_exist_ok=True)
        public=data/'.local/share/sandbox';public.mkdir(parents=True,exist_ok=True)
        for src in [root/'apps.lock.json',root/'policies/chrome-managed.json']:
            shutil.copy2(src,public/src.name)
        shutil.copy2(root/'seed/home/.local/share/applications/claude-pa.desktop',public/'claude-pa.desktop')
        lib=data/'.local/lib/sandbox';lib.mkdir(parents=True,exist_ok=True)
        shutil.copy2(root/'tools/install-proot-app.py',lib/'install-proot-app.py')
        for p in (data/'.local/bin').iterdir():p.chmod(0o755)
        (root/'desktop/svc-de-run').chmod(0o755)
        (root/'firewall/start.sh').chmod(0o755)
        if os.geteuid()==0:
            for parent,dirs,files in os.walk(data):
                os.chown(parent,uid,gid)
                for name in files:os.chown(Path(parent)/name,uid,gid)
        elif os.getuid()!=uid:
            print('Before startup, set webtop-data ownership to UID %d GID %d.'%(uid,gid))
    print('Prepared configuration. No services were started; no secret values were printed.')

if __name__=='__main__':main()
