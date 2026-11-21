"""Controller-only, fixed desktop actions. Runs with the Selkies desktop UID."""
import asyncio
import fcntl
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ACTIONS = {'open-browser', 'open-claude', 'open-terminal', 'workspace-browser',
           'workspace-claude', 'install-chrome', 'install-claude', 'setup-keyring', 'update-claude'}
HOME = Path('/config')
STATE = HOME / '.local/state/sandbox-controls'
LIB = HOME / '.local/lib/sandbox'
APP_CLASSES = {'chrome': 'Google-chrome', 'claude': 'com.anthropic.Claude'}


def desktop_env():
    env = dict(os.environ)
    # i3 owns the actual session bus; Selkies can start before the desktop does.
    for path in Path('/proc').glob('[0-9]*/comm'):
        try:
            if path.stat().st_uid != os.getuid() or path.read_text().strip() != 'i3':
                continue
            values = dict(item.split('=', 1) for item in (path.parent / 'environ').read_text().split('\0') if '=' in item)
            for key in ('DISPLAY', 'XAUTHORITY', 'DBUS_SESSION_BUS_ADDRESS', 'XDG_RUNTIME_DIR', 'I3SOCK'):
                if key in values:
                    env[key] = values[key]
            break
        except (OSError, ValueError):
            pass
    env.update(HOME=str(HOME), PATH='/config/.local/bin:/usr/local/bin:/usr/bin:/bin',
               HTTP_PROXY='http://127.0.0.1:2080', HTTPS_PROXY='http://127.0.0.1:2080',
               http_proxy='http://127.0.0.1:2080', https_proxy='http://127.0.0.1:2080')
    return env


def classes(node):
    result = {node.get('window_properties', {}).get('class')} if node.get('window') else set()
    for child in node.get('nodes', []) + node.get('floating_nodes', []):
        result.update(classes(child))
    return result


def tree():
    output = subprocess.run(['i3-msg', '-t', 'get_tree'], env=desktop_env(),
                            capture_output=True, text=True, check=True, timeout=3)
    return classes(json.loads(output.stdout))


def i3(command):
    result = subprocess.run(['i3-msg', command], env=desktop_env(), check=True,
                            capture_output=True, text=True, timeout=5)
    if not all(item.get('success') for item in json.loads(result.stdout)):
        raise RuntimeError('桌面未接受操作，请检查 i3 状态。')


def state_dir():
    STATE.mkdir(parents=True, exist_ok=True, mode=0o700)
    STATE.chmod(0o700)


def write_job(value):
    temporary = STATE / 'job.tmp'
    temporary.write_text(json.dumps(value, ensure_ascii=False))
    temporary.replace(STATE / 'job.json')


def busy():
    state_dir()
    with (STATE / 'action.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return True
    return False


def status():
    state_dir()
    try:
        windows, ready = tree(), True
    except (OSError, ValueError, subprocess.SubprocessError):
        windows, ready = set(), False
    apps = {}
    for name in ('chrome', 'claude'):
        root = HOME / ('proot-apps/ghcr.io_linuxserver_proot-apps_' + name)
        marker = root / 'SHALAYER'
        installed = marker.is_file() and marker.stat().st_size > 0 and not (root / 'DOWNLOADING').exists()
        version = None
        # Read dpkg's plain status database without starting an application/PRoot.
        try:
            package = 'claude-desktop' if name == 'claude' else 'google-chrome-stable'
            for paragraph in (root / 'var/lib/dpkg/status').read_text().split('\n\n'):
                fields = dict(line.split(': ', 1) for line in paragraph.splitlines() if ': ' in line and not line.startswith(' '))
                if fields.get('Package') == package:
                    version = fields.get('Version')
                    break
        except OSError:
            pass
        recovery = name == 'claude' and (HOME / '.local/state/sandbox-apps/claude.updating').exists()
        apps[name] = {'installed': bool(installed), 'present': root.exists(), 'recovery': recovery,
                      'running': APP_CLASSES[name] in windows, 'version': version}
    root = HOME / 'proot-apps/ghcr.io_linuxserver_proot-apps_claude'
    try:
        target = json.loads((HOME / '.local/share/sandbox/claude-update.lock.json').read_text())['version']
    except (OSError, ValueError, KeyError):
        target = None
    try:
        job = json.loads((STATE / 'job.json').read_text())
    except (OSError, ValueError):
        job = None
    active = busy()
    if job and job['state'] == 'running' and not active:
        job['state'] = 'interrupted'
        job['message'] = '操作中断，请查看日志后处理；不会自动重试。'
    try:
        with (STATE / 'action.log').open('rb') as log:
            log.seek(0, 2)
            log.seek(max(0, log.tell() - 6000))
            tail = log.read().decode('utf-8', errors='replace')
    except OSError:
        tail = ''
    return {'desktop_ready': ready, 'apps': apps, 'target_version': target,
            'keyring': (root / 'usr/bin/gnome-keyring-daemon').exists(),
            'busy': active, 'job': job, 'log': tail}


def start(action):
    if action not in ACTIONS:
        raise ValueError('Unknown desktop action')
    if os.geteuid() == 0:
        raise ValueError('Desktop actions must run as the ordinary desktop user')
    state_dir()
    lock = (STATE / 'action.lock').open('a')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        os.chmod(lock.name, 0o600)
        write_job({'action': action, 'state': 'running', 'started': int(time.time()), 'message': '正在执行…'})
        with (STATE / 'action.log').open('w') as output:
            os.chmod(output.name, 0o600)
            subprocess.Popen([sys.executable, str(Path(__file__).resolve()), action, str(lock.fileno())],
                             env=desktop_env(), stdin=subprocess.DEVNULL, stdout=output, stderr=output,
                             start_new_session=True, pass_fds=(lock.fileno(),))
    except BlockingIOError:
        raise RuntimeError('已有操作正在执行，请等待完成。') from None
    finally:
        lock.close()


def perform(action):
    if action in {'open-browser', 'open-claude'}:
        name = 'chrome' if action == 'open-browser' else 'claude'
        current = status()
        if not current['apps'][name]['installed']:
            raise ValueError('请先完成应用安装；已有不完整目录需管理员检查。')
        if current['apps'][name]['recovery']:
            raise ValueError('Claude 更新尚未完成，请先查看日志并恢复。')
        if APP_CLASSES[name] in tree():
            i3('[class="^' + APP_CLASSES[name].replace('.', '[.]') + '$"] focus')
        else:
            launcher = 'sandbox-browser' if name == 'chrome' else 'sandbox-claude-desktop'
            i3('exec --no-startup-id /config/.local/bin/' + launcher)
    elif action == 'open-terminal':
        i3('exec --no-startup-id /config/.local/bin/sandbox-terminal')
    elif action.startswith('workspace-'):
        i3('workspace number ' + ('1' if action == 'workspace-browser' else '2'))
    elif action in {'install-chrome', 'install-claude'}:
        name = action.removeprefix('install-')
        subprocess.run(['/usr/bin/python3', str(LIB / 'install-proot-app.py'), name], check=True)
        if name == 'claude':
            subprocess.run(['/bin/bash', str(LIB / 'install-secret-service.sh')], check=True)
    elif action == 'setup-keyring':
        app = status()['apps']['claude']
        if not app['installed'] or app['running'] or app['recovery']:
            raise ValueError('先完成 Claude 安装/恢复并正常退出应用，再配置钥匙串。')
        subprocess.run(['/bin/bash', str(LIB / 'install-secret-service.sh')], check=True)
    elif action == 'update-claude':
        subprocess.run(['/usr/bin/python3', str(LIB / 'update-claude.py')], check=True)
    else:
        raise ValueError('Unknown desktop action')


def install(app, supervisor, api_prefix):
    from aiohttp import web

    def guard(request, mutation=False):
        if supervisor._viewer_ceiling(request):
            raise web.HTTPForbidden(text='需要桌面控制权限')
        if request.headers.get('Sec-Fetch-Site') in {'cross-site', 'same-site'}:
            raise web.HTTPForbidden(text='需要同源访问')
        if mutation and (request.headers.get('X-Harbor-Action') != '1' or request.content_type != 'application/json'):
            raise web.HTTPForbidden(text='需要面板操作请求')

    async def get_status(request):
        guard(request)
        return web.json_response(await asyncio.to_thread(status), headers={'Cache-Control': 'no-store'})

    async def action(request):
        guard(request, mutation=True)
        data = await request.content.read(257)
        if len(data) > 256:
            raise web.HTTPBadRequest(text='请求过大')
        try:
            value = json.loads(data)
            if not isinstance(value, dict) or set(value) != {'action'} or not isinstance(value['action'], str) or value['action'] not in ACTIONS:
                raise ValueError()
        except (ValueError, UnicodeError):
            raise web.HTTPBadRequest(text='未知操作')
        try:
            await asyncio.to_thread(start, value['action'])
        except RuntimeError as error:
            raise web.HTTPConflict(text=str(error))
        except (ValueError, OSError):
            raise web.HTTPServiceUnavailable(text='无法启动操作，请检查桌面用户和安装工具。')
        return web.json_response({'accepted': True}, status=202, headers={'Cache-Control': 'no-store'})

    app.router.add_get(api_prefix + '/api/desktop-controls/status', get_status)
    app.router.add_post(api_prefix + '/api/desktop-controls/action', action)


if __name__ == '__main__':
    # The inherited fd holds the operation lock even if Selkies restarts.
    os.umask(0o077)
    action, descriptor = sys.argv[1:]
    with os.fdopen(int(descriptor), 'a'):
        job = {'action': action, 'state': 'running', 'started': int(time.time())}
        try:
            if os.geteuid() == 0:
                raise ValueError('Run as the ordinary desktop user')
            perform(action)
            job.update(state='succeeded', message='操作完成。打开应用后请检查界面。')
        except Exception as error:
            print(str(error), flush=True)
            job.update(state='failed', message='操作失败，请查看日志；不会自动重试。')
        write_job(job)
