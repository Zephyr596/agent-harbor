#!/usr/bin/env python3
"""Install a pinned public LinuxServer PRoot app as abc, through its existing proxy.

No application account state is copied. Downloads are resumable; installation is
staged and verified before replacing an application root.
"""
import argparse,concurrent.futures,hashlib,json,os,shutil,subprocess,time
import urllib.request
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('app',choices=['chrome','claude'])
    ap.add_argument('--workers',type=int,default=16)
    ap.add_argument('--replace',action='store_true',help='Back up an existing app root and replace it')
    ap.add_argument('--check-source',action='store_true',help='Read registry metadata/range support only; do not write or install')
    ap.add_argument('--lock',type=Path,default=Path('/config/.local/share/sandbox/apps.lock.json'))
    args=ap.parse_args()
    if os.geteuid()==0:raise SystemExit('Run as the non-root desktop user abc')
    if not 1<=args.workers<=48:raise SystemExit('workers must be between 1 and 48')
    if not args.check_source and not Path('/config/.local/bin/proot').is_file():raise SystemExit('Wait for Webtop first-boot PRoot initialization')
    if not os.environ.get('HTTPS_PROXY') and not os.environ.get('https_proxy'):
        raise SystemExit('The configured HTTP proxy environment is required')
    spec=json.loads(args.lock.read_text())[args.app]
    assert spec['repository']=='linuxserver/proot-apps' and spec['architecture']=='amd64'
    digest=spec['layer_digest'];assert digest.startswith('sha256:') and len(digest)==71
    root=Path('/config/proot-apps')/('ghcr.io_linuxserver_proot-apps_'+args.app)
    if not args.check_source and root.exists() and not args.replace:raise SystemExit('App root already exists; inspect it, or use --replace to preserve a backup')
    cache=Path('/config/.cache/sandbox-apps')/(args.app+'-'+digest[7:19])
    token=json.load(urllib.request.urlopen('https://ghcr.io/token?service=ghcr.io&scope=repository:linuxserver/proot-apps:pull',timeout=45))['token']
    url='https://ghcr.io/v2/linuxserver/proot-apps/blobs/'+digest
    def request(start,end):
        req=urllib.request.Request(url,headers={'Range':'bytes=%d-%d'%(start,end)})
        # Do not forward the registry bearer header to a redirected blob host.
        req.add_unredirected_header('Authorization','Bearer '+token)
        return urllib.request.urlopen(req,timeout=60)
    with request(0,0) as resp:
        if resp.status!=206:raise RuntimeError('This pinned download requires HTTP range support')
        size=int(resp.headers['Content-Range'].rsplit('/',1)[1]);resp.read(1)
    if 'layer_size' in spec and spec['layer_size']!=size:raise RuntimeError('Unexpected layer size')
    if args.check_source:
        print(json.dumps({'app':args.app,'layer_digest':digest,'layer_size':size,'range_supported':True,'installed':False}));return
    cache.mkdir(parents=True,exist_ok=True,mode=0o700)
    parts=cache/'parts';parts.mkdir(exist_ok=True)
    chunk=4*1024*1024;n=(size+chunk-1)//chunk
    print('Downloading pinned',args.app,'layer;',round(size/1048576,1),'MiB',flush=True)
    def fetch(i):
        start,end=i*chunk,min(size,(i+1)*chunk)-1;p=parts/str(i)
        for attempt in range(6):
            have=p.stat().st_size if p.exists() else 0
            if have==end-start+1:return
            if have>end-start+1:raise RuntimeError('Invalid cached range')
            try:
                with request(start+have,end) as resp:
                    if resp.status!=206 or not resp.headers['Content-Range'].startswith('bytes %d-%d/'%(start+have,end)):
                        raise RuntimeError('Wrong content range')
                    with p.open('ab') as f:
                        for b in iter(lambda:resp.read(256*1024),b''):f.write(b)
                if p.stat().st_size!=end-start+1:raise RuntimeError('Incomplete range')
                return
            except Exception:
                if attempt==5:raise RuntimeError('Range %d failed; rerun to resume'%i) from None
                time.sleep(min(2**attempt,15))
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        pending={pool.submit(fetch,i) for i in range(n)}
        while pending:
            done,pending=concurrent.futures.wait(pending,timeout=10,return_when=concurrent.futures.FIRST_EXCEPTION)
            for f in done:f.result()
            print('Downloaded %.1f / %.1f MiB'%(sum(p.stat().st_size for p in parts.iterdir())/1048576,size/1048576),flush=True)
    archive=cache/'app.tar.gz';h=hashlib.sha256()
    with archive.open('wb') as out:
        for i in range(n):
            with (parts/str(i)).open('rb') as f:
                for b in iter(lambda:f.read(1024*1024),b''):out.write(b);h.update(b)
    if archive.stat().st_size!=size or 'sha256:'+h.hexdigest()!=digest:
        raise RuntimeError('Layer checksum failed; nothing was installed')
    stage=cache/'rootfs-staging'
    if stage.exists():raise SystemExit('A previous staging directory exists. Inspect it before removing/retrying.')
    stage.mkdir();subprocess.run(['tar','--no-same-owner','-xzf',str(archive),'-C',str(stage)],check=True)
    proot='/config/.local/bin/proot';pkg='google-chrome-stable' if args.app=='chrome' else 'claude-desktop'
    subprocess.run([proot,'-R',str(stage),'/usr/bin/bash','-lc','test -x /usr/bin/bash'],check=True,timeout=30)
    version=subprocess.run([proot,'-R',str(stage),'/usr/bin/dpkg-query','-W',pkg],check=True,capture_output=True,text=True,timeout=30).stdout.strip()
    (stage/'SHALAYER').write_text(digest+'\n');root.parent.mkdir(parents=True,exist_ok=True)
    backup=None
    if root.exists():
        backup=root.with_name(root.name+'.backup-'+str(int(time.time())));root.rename(backup)
    stage.rename(root)
    # The vendor hook installs icons and desktop entries; it does not copy any account data.
    subprocess.run([proot,'-R',str(root),'/install'],check=True,timeout=45)
    bins=Path('/config/.local/bin');bins.mkdir(parents=True,exist_ok=True)
    if args.app=='chrome':
        policy=root/'etc/opt/chrome/policies/managed/sandbox-proxy.json';policy.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2('/config/.local/share/sandbox/chrome-managed.json',policy)
        wrapper=bins/'chrome-pa';wrapper.write_text('#!/bin/sh\nexec /config/.local/bin/proot-apps run ghcr.io/linuxserver/proot-apps:chrome "$@"\n');wrapper.chmod(0o755)
    else:
        wrapper=bins/'claude-pa';wrapper.write_text('#!/bin/sh\nexec /config/.local/bin/sandbox-claude-desktop "$@"\n');wrapper.chmod(0o755)
        for p in [Path('/config/.local/share/applications/claude-pa.desktop'),Path('/config/Desktop/claude-pa.desktop')]:
            p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2('/config/.local/share/sandbox/claude-pa.desktop',p);p.chmod(0o755)
    receipt=Path('/config/.local/state/sandbox-apps');receipt.mkdir(parents=True,exist_ok=True)
    (receipt/(args.app+'.json')).write_text(json.dumps({'app':args.app,'layer_digest':digest,'layer_size':size,'package':version,'backup':str(backup) if backup else None},indent=2)+'\n')
    print('Installed',version,'with verified digest',digest)

if __name__=='__main__':main()
