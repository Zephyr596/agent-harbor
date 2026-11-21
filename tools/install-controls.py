#!/usr/bin/env python3
"""Install panel helpers into an existing desktop HOME; never start services."""
import argparse
import os
from pathlib import Path
import shutil
import tempfile


def install(source, home):
    if not home.is_dir() or not (home / '.local/bin/sandbox-launcher').is_file():
        raise ValueError('Expected an existing Agent Harbor desktop HOME; new deployments use prepare.py')
    files = {source / 'tools' / name: home / '.local/lib/sandbox' / name
             for name in ('install-proot-app.py', 'install-secret-service.sh', 'update-claude.py')}
    files[source / 'claude-update.lock.json'] = home / '.local/share/sandbox/claude-update.lock.json'
    # Older live installations predate prepare.py's public installer assets.
    for src in [source / 'apps.lock.json', source / 'policies/chrome-managed.json',
                source / 'seed/home/.local/share/applications/claude-pa.desktop']:
        target = home / '.local/share/sandbox' / src.name
        if not target.exists():
            files[src] = target
    for name in ('sandbox-claude-desktop', 'sandbox-session-restore'):
        files[source / 'seed/home/.local/bin' / name] = home / '.local/bin' / name
    # Refuse symlink destinations, including their parents, before writing anything.
    backup_root = home / '.local/state/sandbox-controls-template-backups'
    for target in [*files.values(), backup_root]:
        for path in (target, *target.parents):
            if path.is_symlink():
                raise ValueError('Refusing symlink destination: ' + str(path))
            if path == home:
                break
    ownership = home.stat()
    backup_root.mkdir(parents=True, exist_ok=True, mode=0o700)
    backup_root.chmod(0o700)
    backup = Path(tempfile.mkdtemp(prefix='before-panel-', dir=backup_root))
    for src, target in files.items():
        if target.exists():
            copy = backup / target.relative_to(home)
            copy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, copy)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)
        target.chmod(0o755 if target.parent.name == 'bin' else 0o644)
    if os.geteuid() == 0:
        managed = set(files.values()) | {backup_root, backup, *backup.rglob('*')}
        for target in [*files.values(), backup_root]:
            managed.update(p for p in target.parents if p.is_relative_to(home / '.local'))
        for path in managed:
            os.chown(path, ownership.st_uid, ownership.st_gid)
    print('Panel helpers installed. Previous templates:', backup)
    print('No services or application roots were changed. See docs/DESKTOP-CONTROLS.md for activation.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--home', required=True, type=Path, help='Existing deployment webtop-data directory')
    args = parser.parse_args()
    install(Path(__file__).resolve().parents[1], args.home.absolute())


if __name__ == '__main__':
    main()
