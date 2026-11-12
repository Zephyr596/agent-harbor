#!/usr/bin/env python3
"""Render, or explicitly install, a per-login launchd SSH tunnel on macOS."""
import argparse,os,platform,plistlib,re,subprocess
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--target',required=True,help='Existing SSH alias, or user@LAN-IP')
    ap.add_argument('--label',default='com.example.webtop-ssh-tunnel')
    ap.add_argument('--output',type=Path,default=Path('webtop-ssh-tunnel.plist'))
    ap.add_argument('--install',action='store_true',help='Write into this user’s LaunchAgents and load it')
    args=ap.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.@:-]*',args.target):raise SystemExit('Invalid SSH target')
    if not re.fullmatch(r'[A-Za-z0-9_.-]+',args.label):raise SystemExit('Invalid launchd label')
    home=Path.home();logs=home/'Library/Logs/WebtopTunnel'
    p={'Label':args.label,'ProgramArguments':['/usr/bin/ssh','-N','-T','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=10','-o','ConnectionAttempts=1','-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=20','-o','ServerAliveCountMax=3','-o','ForwardAgent=no','-L','127.0.0.1:3001:127.0.0.1:3001',args.target],
       'RunAtLoad':True,'KeepAlive':True,'ThrottleInterval':20,'ProcessType':'Background',
       'StandardOutPath':str(logs/'stdout.log'),'StandardErrorPath':str(logs/'stderr.log')}
    output=args.output
    if args.install:
        if platform.system()!='Darwin':raise SystemExit('--install is only available on macOS')
        output=home/'Library/LaunchAgents'/(args.label+'.plist')
        if output.exists():raise SystemExit('LaunchAgent already exists. Inspect/unload it before replacing it.')
        logs.mkdir(parents=True,exist_ok=True);output.parent.mkdir(parents=True,exist_ok=True)
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_bytes(plistlib.dumps(p));output.chmod(0o644)
    print('Wrote',output)
    if args.install:
        subprocess.run(['launchctl','bootstrap','gui/'+str(os.getuid()),str(output)],check=True)
        print('Loaded per-login tunnel. SSH authentication still uses your existing agent/configuration.')

if __name__=='__main__':main()
