#!/usr/bin/env python3
"""Apply the repository-reviewed Claude package inside the existing user PRoot.

No rootfs replacement, automatic latest-version lookup, or real root required.
"""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import urllib.request

HOME = Path('/config')
ROOT = HOME / 'proot-apps/ghcr.io_linuxserver_proot-apps_claude'
PROOT = str(HOME / '.local/bin/proot')


def run(*args, **kwargs):
    return subprocess.run([PROOT, '-0', '-R', str(ROOT), *args], check=True, **kwargs)


def claude_running():
    for entry in Path('/proc').glob('[0-9]*/comm'):
        try:
            if entry.stat().st_uid == os.getuid() and entry.read_text().strip() == 'claude-desktop':
                return True
        except OSError:
            pass
    return False


def validate_plan(plan):
    """apt's machine-oriented simulation lines must change only Claude."""
    changes = [line.split() for line in plan.splitlines() if line.startswith(('Inst ', 'Remv ', 'Conf '))]
    if not any(row[0] == 'Inst' and row[1] in {'claude-desktop', 'claude-desktop:amd64'} for row in changes):
        raise ValueError('模拟安装没有升级 Claude；请检查日志。')
    if any(row[0] == 'Remv' or row[1] not in {'claude-desktop', 'claude-desktop:amd64'} for row in changes):
        raise ValueError('依赖计划需要更改其他软件包，请由管理员检查；未安装更新。')


def download(spec, target):
    url = 'https://downloads.claude.ai/claude-desktop/apt/stable/' + spec['filename']
    digest = hashlib.sha256()
    total = 0
    with urllib.request.urlopen(url, timeout=60) as response, target.open('wb') as output:
        for block in iter(lambda: response.read(1024 * 1024), b''):
            total += len(block)
            if total > spec['size']:
                raise ValueError('安装包超过锁定大小。')
            output.write(block)
            digest.update(block)
    if total != spec['size'] or digest.hexdigest() != spec['sha256']:
        target.unlink()
        raise ValueError('安装包校验失败；未安装更新。')


def compare_scripts(control):
    for name in ('preinst', 'postinst', 'prerm', 'postrm', 'config', 'triggers'):
        old = ROOT / ('var/lib/dpkg/info/claude-desktop.' + name)
        new = control / name
        if (old.read_bytes() if old.exists() else b'') != (new.read_bytes() if new.exists() else b''):
            raise ValueError('维护脚本变化：' + name + '；需要单独审核，未安装更新。')


def main():
    if os.geteuid() == 0:
        raise SystemExit('Run as the ordinary Webtop user, not root')
    os.umask(0o077)
    os.environ.update(DEBIAN_FRONTEND='noninteractive', LC_ALL='C')
    if not os.environ.get('HTTPS_PROXY') and not os.environ.get('https_proxy'):
        raise SystemExit('The configured HTTP proxy environment is required')
    if not (ROOT / 'SHALAYER').is_file() or (ROOT / 'DOWNLOADING').exists():
        raise SystemExit('先完成 Claude 基线安装。')
    marker = HOME / '.local/state/sandbox-apps/claude.updating'
    if marker.exists():
        raise SystemExit('上次更新尚未完成；请先检查日志和备份，按指南恢复。')
    cache = HOME / '.cache/sandbox-claude-update'
    cache.mkdir(parents=True, exist_ok=True, mode=0o700)
    cache.chmod(0o700)
    with (cache / 'update.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        if claude_running():
            raise SystemExit('请在 Claude 菜单中正常退出应用，再更新。不会自动结束应用。')
        spec = json.loads((HOME / '.local/share/sandbox/claude-update.lock.json').read_text())
        current = run('/usr/bin/dpkg-query', '-W', '-f=${Version}', 'claude-desktop', capture_output=True, text=True).stdout
        if current == spec['version']:
            print('已经是仓库验证版本 ' + current, flush=True)
            return
        newer = subprocess.run([PROOT, '-R', str(ROOT), '/usr/bin/dpkg', '--compare-versions', current, 'gt', spec['version']])
        if newer.returncode == 0:
            raise SystemExit('当前版本更新；不会降级到仓库验证版本。')
        if newer.returncode != 1:
            raise SystemExit('无法比较版本，未更新。')
        with tempfile.TemporaryDirectory(prefix='package-', dir=cache) as temporary:
            folder = Path(temporary)
            deb = folder / 'claude-desktop.deb'
            print('下载并校验 Claude ' + spec['version'] + '…', flush=True)
            download(spec, deb)
            fields = run('/usr/bin/dpkg-deb', '-f', str(deb), 'Package', 'Version', 'Architecture', capture_output=True, text=True).stdout
            expected = {'Package: claude-desktop', 'Version: ' + spec['version'], 'Architecture: ' + spec['architecture']}
            if set(fields.strip().splitlines()) != expected:
                raise ValueError('安装包身份与锁定版本不一致。')
            control = folder / 'control'
            run('/usr/bin/dpkg-deb', '-e', str(deb), str(control))
            compare_scripts(control)
            audit = run('/usr/bin/dpkg', '--audit', capture_output=True, text=True).stdout
            if audit.strip():
                raise ValueError('应用层已有未完成的软件包操作，请先检查 dpkg --audit。')
            plan = run('/usr/bin/apt-get', '-s', '--no-install-recommends', 'install', str(deb), capture_output=True, text=True).stdout
            print(plan, flush=True)
            validate_plan(plan)
            if claude_running():
                raise ValueError('Claude 已重新打开；请退出后重试。')
            backups = HOME / '.local/state/sandbox-backups'
            backups.mkdir(parents=True, exist_ok=True, mode=0o700)
            backups.chmod(0o700)
            backup = backups / ('claude-' + time.strftime('%Y%m%d-%H%M%S') + '.tar.gz')
            paths = [ROOT.relative_to(HOME), Path('.config/Claude'), Path('.local/share/keyrings'),
                     Path('.local/bin/sandbox-claude-desktop'), Path('.local/share/dbus-1/services'),
                     Path('.local/share/applications'), Path('.config/mimeapps.list')]
            paths = [str(path) for path in paths if (HOME / path).exists()]
            marker.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            marker.write_text(str(backup) + '\n')
            if claude_running():
                marker.unlink()
                raise ValueError('Claude 已重新打开；请退出后重试。')
            # Reserve the private archive exclusively; never overwrite an earlier backup.
            with backup.open('xb') as output:
                print('备份现有应用层和个人状态：' + str(backup), flush=True)
                subprocess.run(['tar', '-czf', '-', '-C', str(HOME), *paths], stdout=output, check=True)
            backup.chmod(0o600)
            protected = [ROOT / 'usr/bin/xdg-open', HOME / '.local/bin/sandbox-claude-desktop']
            before = {path: path.read_bytes() for path in protected if path.exists()}
            print('备份完成。安装增量包；失败时请保留备份并按使用指南恢复。', flush=True)
            run('/usr/bin/dpkg', '--force-confold', '-i', str(deb))
            audit = run('/usr/bin/dpkg', '--audit', capture_output=True, text=True).stdout
            if audit.strip():
                raise ValueError('安装后 dpkg audit 异常，请检查日志和备份。')
            for path, data in before.items():
                if path.read_bytes() != data:
                    path.write_bytes(data)
                    print('已恢复代理/授权跳转入口：' + str(path), flush=True)
            installed = run('/usr/bin/dpkg-query', '-W', '-f=${Version}', 'claude-desktop', capture_output=True, text=True).stdout
            if installed != spec['version']:
                raise ValueError('安装版本不符，请检查备份。')
            marker.unlink()
            print('更新完成：' + installed + '。可点击打开 Claude，检查登录状态。', flush=True)


if __name__ == '__main__':
    main()
