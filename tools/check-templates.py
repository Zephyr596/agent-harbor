#!/usr/bin/env python3
"""Validate rendered templates with Docker, synthetic inputs and no host services."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from prepare import read_env


def main():
    source = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix='agent-harbor-template-') as temp:
        root = Path(temp) / 'deployment'
        shutil.copytree(source, root, ignore=shutil.ignore_patterns('.git', '__pycache__', 'webtop-data', '.env', 'sing-box.json'))
        env_text = (root / '.env.example').read_text().replace('REPLACE_PROXY_IPV4', '192.0.2.10').replace(
            'REPLACE_WITH_16_BYTE_BASE64_KEY', 'AAAAAAAAAAAAAAAAAAAAAA==')
        (root / '.env').write_text(env_text)
        subprocess.run([sys.executable, str(root / 'tools/prepare.py')], check=True)
        subprocess.run(['docker', 'compose', '--project-directory', str(root), 'config', '--quiet'], check=True)
        env = read_env(root / '.env')
        server = json.loads((root / 'server/sing-box.shadowsocks.example.json').read_text())
        server['inbounds'][0]['password'] = 'AAAAAAAAAAAAAAAAAAAAAA=='
        server_path = root / 'server.validation.json'
        server_path.write_text(json.dumps(server))
        server_path.chmod(0o600)
        for path in [root / 'config/sing-box.json', server_path]:
            subprocess.run([
                'docker', 'run', '--rm', '--network', 'none', '--cap-drop', 'ALL',
                '--security-opt', 'no-new-privileges:true', '--read-only',
                '--user', str(os.getuid()) + ':' + str(os.getgid()),
                '--mount', 'type=bind,src=' + str(path) + ',dst=/config.json,readonly',
                env['SINGBOX_IMAGE'], '-c', '/config.json', 'check',
            ], check=True)
        print('Compose and sing-box client/server template syntax passed')


if __name__ == '__main__':
    main()
