#!/usr/bin/env python3
"""Update/check the repository manifest without including ignored runtime data."""
import argparse
import hashlib
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    paths = subprocess.run(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        cwd=root, check=True, capture_output=True,
    ).stdout.decode().split('\0')
    lines = []
    for name in sorted(set(paths) - {'', 'checksums.sha256'}):
        path = root / name
        if path.is_symlink() or not path.is_file():
            raise SystemExit('Manifest requires an ordinary file: ' + name)
        lines.append(hashlib.sha256(path.read_bytes()).hexdigest() + '  ' + name + '\n')
    result = ''.join(lines)
    manifest = root / 'checksums.sha256'
    if args.check:
        if not manifest.exists() or manifest.read_text() != result:
            raise SystemExit('Manifest differs; inspect changes, then run tools/update-checksums.py')
        print('Manifest matches repository files')
    else:
        manifest.write_text(result)
        print('Recorded', len(lines), 'files')


if __name__ == '__main__':
    main()
