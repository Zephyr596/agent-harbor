#!/usr/bin/env python3
"""Install pinned user tools under /config; run as the desktop user, not root.

Copy this script and devtools.lock.json together into the container (or pass --lock).
Uses the existing HTTP(S) proxy. Does not change system Python or grant privileges.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import shlex
import subprocess
import tarfile
import tempfile
import urllib.request


def run(*args, env=None):
    subprocess.run([str(a) for a in args], check=True, env=env)


def download(item, cache):
    target = cache / item['url'].rsplit('/', 1)[-1]
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == item['sha256']:
        return target
    part = target.with_suffix(target.suffix + '.part')
    with urllib.request.urlopen(item['url'], timeout=120) as response, part.open('wb') as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    if hashlib.sha256(part.read_bytes()).hexdigest() != item['sha256']:
        raise ValueError('Checksum mismatch: ' + target.name)
    part.replace(target)
    return target


def archive(item, prefix, cache):
    dest = prefix / (('uv-' if 'uv-' in item['url'] else 'node-') + item['version'])
    if not dest.exists():
        with tempfile.TemporaryDirectory(dir=prefix) as stage:
            with tarfile.open(download(item, cache)) as source:
                source.extractall(stage, filter='data')
            children = list(Path(stage).iterdir())
            if len(children) != 1 or not children[0].is_dir():
                raise ValueError('Expected one archive root')
            children[0].rename(dest)
    return dest


def link(target, path, prefix):
    if path.is_symlink():
        current = path.resolve()
        if current == target.resolve():
            return
        if not current.is_relative_to(prefix):
            raise ValueError('Refusing to replace existing link: ' + str(path))
    elif path.exists():
        raise ValueError('Refusing to replace existing file: ' + str(path))
    temporary = path.with_name(path.name + '.agent-harbor-new')
    temporary.symlink_to(target)
    temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    default_lock = Path(__file__).resolve().parent / 'devtools.lock.json'
    if not default_lock.exists():
        default_lock = Path(__file__).resolve().parents[1] / 'devtools.lock.json'
    parser.add_argument('--lock', type=Path, default=default_lock)
    parser.add_argument('--home', type=Path, default=Path('/config'))
    parser.add_argument('--guest-root', type=Path, help='Also expose tools in this existing PRoot /usr/local/bin')
    args = parser.parse_args()
    if os.getuid() == 0:
        raise SystemExit('Run as the desktop user (docker exec -u abc), not root')
    if platform.system() != 'Linux' or platform.machine() != 'x86_64':
        raise SystemExit('This lock supports Linux x86_64 only')
    lock = json.loads(args.lock.read_text())
    prefix = args.home / '.local/share/sandbox-devtools'
    cache = args.home / '.cache/sandbox-devtools'
    bins = args.home / '.local/bin'
    for folder in (prefix, cache, bins):
        folder.mkdir(parents=True, exist_ok=True)
    publish_bins = [bins]
    if args.guest_root:
        guest_bin = args.guest_root / 'usr/local/bin'
        if not (args.guest_root / 'etc/os-release').is_file():
            raise SystemExit('Guest root does not contain etc/os-release')
        if not guest_bin.resolve().is_relative_to(args.guest_root.resolve()):
            raise SystemExit('Guest bin escapes the supplied root')
        guest_bin.mkdir(parents=True, exist_ok=True)
        publish_bins.append(guest_bin)
    # Preflight before lengthy downloads or publication. Existing unrelated tools win.
    names = ['uv', 'uvx', 'python', 'python3', 'pip', 'pip3', 'node', 'npm', 'npx']
    for directory in publish_bins:
        for name in names:
            path = directory / name
            if path.is_symlink() and path.resolve().is_relative_to(prefix):
                continue
            if path.exists() or path.is_symlink():
                raise SystemExit('Existing tool; inspect before replacing: ' + str(path))
    uvroot = archive(lock['uv'], prefix, cache)
    uv = uvroot / 'uv'
    env = dict(os.environ, UV_PYTHON_INSTALL_DIR=str(prefix / 'python-runtimes'),
               UV_PYTHON_BIN_DIR=str(prefix / 'python-bin'), UV_CACHE_DIR=str(cache / 'uv'),
               UV_PYTHON_DOWNLOADS='automatic', UV_NO_PROGRESS='1')
    # The pinned uv binary carries the Python build URLs and checksums.
    run(uv, 'python', 'install', lock['python'], env=env)
    venv = prefix / ('python-' + lock['python'])
    if not venv.exists():
        run(uv, 'venv', '--python', lock['python'], '--managed-python', venv, env=env)
    wheel_files = [download(wheel, cache) for wheel in lock['wheels']]
    run(uv, 'pip', 'install', '--python', venv / 'bin/python', '--no-index', *wheel_files, env=env)
    node = archive(lock['node'], prefix, cache)
    targets = {name: uvroot / name for name in ['uv', 'uvx']}
    # A symlink outside a venv can lose pyvenv.cfg discovery under PRoot.
    # Exec the venv path explicitly so Python imports the installed packages.
    wrappers = prefix / 'bin'
    wrappers.mkdir(exist_ok=True)
    for name in ['python', 'python3']:
        wrapper = wrappers / name
        wrapper.write_text('#!/bin/sh\nexec ' + shlex.quote(str(venv / 'bin/python')) + ' \"$@\"\n')
        wrapper.chmod(0o755)
        targets[name] = wrapper
    targets.update({name: venv / 'bin' / name for name in ['pip', 'pip3']})
    wrapper = wrappers / 'node'
    wrapper.write_text('#!/bin/sh\nexport NODE_USE_ENV_PROXY=1\nexec ' + shlex.quote(str(node / 'bin/node')) + ' \"$@\"\n')
    wrapper.chmod(0o755)
    targets['node'] = wrapper
    targets.update({name: node / 'bin' / name for name in ['npm', 'npx']})
    for name, target in targets.items():
        if not target.exists():
            raise ValueError('Missing tool: ' + str(target))
        for directory in publish_bins:
            link(target, directory / name, prefix)
    (prefix / 'env.sh').write_text(
        'export PATH=' + shlex.quote(str(bins)) + ':"$PATH"\n'
        'export UV_PYTHON_INSTALL_DIR=' + shlex.quote(str(prefix / 'python-runtimes')) + '\n'
        'export UV_PYTHON_BIN_DIR=' + shlex.quote(str(prefix / 'python-bin')) + '\n'
        'export UV_CACHE_DIR=' + shlex.quote(str(cache / 'uv')) + '\n')
    (prefix / 'installed.lock.json').write_text(json.dumps(lock, indent=2) + '\n')
    print('Installed persistent tools. Add /config/.local/bin to PATH in every execution context.')


if __name__ == '__main__':
    main()
