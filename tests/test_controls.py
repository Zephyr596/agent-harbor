"""Panel permission boundary, operation locks and conservative package preflight."""
import asyncio
import importlib.util
import json
import os
from pathlib import Path
import sys
import subprocess
import tarfile
import tempfile
import types
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


CONTROLS = load('controls_tests', 'desktop/notifications/controls.py')
UPDATE = load('update_tests', 'tools/update-claude.py')
INSTALL = load('controls_install_tests', 'tools/install-controls.py')


class PackagePreflight(unittest.TestCase):
    def simulate_update(self, home, fail_install=False):
        root = home / 'proot-apps/ghcr.io_linuxserver_proot-apps_claude'
        root.mkdir(parents=True)
        (root / 'SHALAYER').write_text('synthetic layer')
        public = home / '.local/share/sandbox'
        public.mkdir(parents=True)
        (public / 'claude-update.lock.json').write_text(json.dumps({
            'version': '6.0', 'architecture': 'amd64', 'filename': 'pool/test.deb',
            'size': 4, 'sha256': '0' * 64}))
        real_run = subprocess.run
        installed = [False]

        def fake_run(*args, **kwargs):
            if args[0] == '/usr/bin/dpkg-query':
                return types.SimpleNamespace(stdout='6.0' if installed[0] else '5.0')
            if args[0] == '/usr/bin/dpkg-deb':
                if args[1] == '-f':
                    return types.SimpleNamespace(stdout='Package: claude-desktop\nVersion: 6.0\nArchitecture: amd64\n')
                Path(args[-1]).mkdir()
            if args[0] == '/usr/bin/apt-get':
                return types.SimpleNamespace(stdout='Inst claude-desktop [5.0] (6.0 local [amd64])\nConf claude-desktop (6.0 local [amd64])')
            if args[:3] == ('/usr/bin/dpkg', '--force-confold', '-i'):
                backup = home / '.local/state/sandbox-backups'
                archives = list(backup.glob('*.tar.gz'))
                self.assertEqual(len(archives), 1)
                with tarfile.open(archives[0]) as archive:
                    self.assertIn(str((root / 'SHALAYER').relative_to(home)), archive.getnames())
                self.assertEqual(archives[0].stat().st_mode & 0o777, 0o600)
                self.assertTrue((home / '.local/state/sandbox-apps/claude.updating').exists())
                if fail_install:
                    raise subprocess.CalledProcessError(1, 'synthetic dpkg')
                installed[0] = True
            return types.SimpleNamespace(stdout='')

        def process(args, **kwargs):
            if args[0] == 'tar':
                return real_run(args, **kwargs)
            return types.SimpleNamespace(returncode=1)

        with patch.object(UPDATE, 'HOME', home), patch.object(UPDATE, 'ROOT', root), \
                patch.object(UPDATE.os, 'geteuid', return_value=1000), \
                patch.dict(os.environ, {'HTTPS_PROXY': 'http://127.0.0.1:2080'}), \
                patch.object(UPDATE, 'claude_running', return_value=False), \
                patch.object(UPDATE, 'download', side_effect=lambda spec, target: target.write_bytes(b'test')), \
                patch.object(UPDATE, 'run', side_effect=fake_run), \
                patch.object(UPDATE.subprocess, 'run', side_effect=process):
            UPDATE.main()

    def test_private_backup_precedes_install_and_success_clears_marker(self):
        with tempfile.TemporaryDirectory() as temp:
            home = Path(temp)
            self.simulate_update(home)
            self.assertFalse((home / '.local/state/sandbox-apps/claude.updating').exists())

    def test_failed_install_keeps_backup_and_recovery_marker(self):
        with tempfile.TemporaryDirectory() as temp:
            home = Path(temp)
            with self.assertRaises(subprocess.CalledProcessError):
                self.simulate_update(home, fail_install=True)
            marker = home / '.local/state/sandbox-apps/claude.updating'
            self.assertTrue(Path(marker.read_text().strip()).is_file())

    def test_dependency_changes_and_removals_are_refused(self):
        UPDATE.validate_plan('Inst claude-desktop [5.0] (6.0 local-deb [amd64])\nConf claude-desktop (6.0 local-deb [amd64])')
        for plan in ('', 'Inst other-package (1.0)', 'Inst claude-desktop (6.0)\nRemv important-package [1.0]',
                     'Inst claude-desktop (6.0)\nInst dependency (1.0)'):
            with self.subTest(plan=plan), self.assertRaises(ValueError):
                UPDATE.validate_plan(plan)

    def test_changed_maintainer_scripts_require_review(self):
        with tempfile.TemporaryDirectory() as temp:
            root, control = Path(temp) / 'root', Path(temp) / 'control'
            old = root / 'var/lib/dpkg/info'
            old.mkdir(parents=True)
            control.mkdir()
            (old / 'claude-desktop.postinst').write_text('original')
            (control / 'postinst').write_text('original')
            with patch.object(UPDATE, 'ROOT', root):
                UPDATE.compare_scripts(control)
                (control / 'postinst').write_text('unexpected change')
                with self.assertRaises(ValueError):
                    UPDATE.compare_scripts(control)

    def test_bad_download_does_not_leave_installable_package(self):
        import io
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp) / 'package.deb'
            with patch.object(UPDATE.urllib.request, 'urlopen', return_value=io.BytesIO(b'incorrect')):
                with self.assertRaises(ValueError):
                    UPDATE.download({'filename': 'pool/test.deb', 'size': 9, 'sha256': '0' * 64}, target)
            self.assertFalse(target.exists())


class OperationState(unittest.TestCase):
    def test_unknown_command_cannot_spawn(self):
        with patch.object(CONTROLS.subprocess, 'Popen') as spawn:
            for action in ('exec id', 'open-browser;id', 'install-chrome --replace'):
                with self.assertRaises(ValueError):
                    CONTROLS.start(action)
            spawn.assert_not_called()

    def test_lock_excludes_second_request_and_survives_missing_job_process(self):
        import fcntl
        with tempfile.TemporaryDirectory() as temp, patch.object(CONTROLS, 'STATE', Path(temp)):
            with (Path(temp) / 'action.lock').open('a') as lock:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                self.assertTrue(CONTROLS.busy())
                with patch.object(CONTROLS.os, 'geteuid', return_value=1000), self.assertRaises(RuntimeError):
                    CONTROLS.start('open-terminal')
            self.assertFalse(CONTROLS.busy())
            CONTROLS.write_job({'state': 'running', 'action': 'update-claude'})
            with patch.object(CONTROLS, 'HOME', Path(temp)), patch.object(CONTROLS, 'tree', return_value=set()):
                value = CONTROLS.status()
            self.assertEqual(value['job']['state'], 'interrupted')

    def test_update_recovery_prevents_launch(self):
        with patch.object(CONTROLS, 'status', return_value={'apps': {'claude': {'installed': True, 'recovery': True}}}), patch.object(CONTROLS, 'i3') as ipc:
            with self.assertRaises(ValueError):
                CONTROLS.perform('open-claude')
            ipc.assert_not_called()


class HelperInstallation(unittest.TestCase):
    def test_upgrade_backs_up_helpers_and_preserves_personal_data(self):
        with tempfile.TemporaryDirectory() as temp:
            home = Path(temp)
            bins = home / '.local/bin'
            bins.mkdir(parents=True)
            (bins / 'sandbox-launcher').write_text('launcher')
            (bins / 'sandbox-claude-desktop').write_text('old launcher')
            (home / 'personal').write_text('private sentinel')
            INSTALL.install(ROOT, home)
            self.assertEqual((home / 'personal').read_text(), 'private sentinel')
            backups = list((home / '.local/state/sandbox-controls-template-backups').glob('*/.local/bin/sandbox-claude-desktop'))
            self.assertEqual(backups[0].read_text(), 'old launcher')
            self.assertEqual((bins / 'sandbox-launcher').read_text(), 'launcher')
            for name in ('apps.lock.json', 'chrome-managed.json', 'claude-pa.desktop'):
                self.assertTrue((home / '.local/share/sandbox' / name).is_file())

    def test_symlink_destination_is_refused_before_writing(self):
        with tempfile.TemporaryDirectory() as temp:
            home = Path(temp) / 'home'
            (home / '.local/bin').mkdir(parents=True)
            (home / '.local/bin/sandbox-launcher').write_text('launcher')
            external = Path(temp) / 'external'
            external.mkdir()
            (home / '.local/lib').symlink_to(external)
            with self.assertRaises(ValueError):
                INSTALL.install(ROOT, home)
            self.assertEqual(list(external.iterdir()), [])


class ApiBoundary(unittest.TestCase):
    def test_requests_require_controller_same_origin_header_and_allowlisted_action(self):
        class HttpError(Exception):
            def __init__(self, **kwargs):
                pass
        web = types.SimpleNamespace(**{name: HttpError for name in (
            'HTTPForbidden', 'HTTPBadRequest', 'HTTPConflict', 'HTTPServiceUnavailable')},
            json_response=lambda value, **kwargs: value)
        routes = {}
        router = types.SimpleNamespace(add_get=lambda path, handler: routes.update({path: handler}),
                                       add_post=lambda path, handler: routes.update({path: handler}))
        viewer = [False]
        with patch.dict(sys.modules, {'aiohttp': types.SimpleNamespace(web=web)}):
            CONTROLS.install(types.SimpleNamespace(router=router),
                             types.SimpleNamespace(_viewer_ceiling=lambda request: viewer[0]), '')
        handler = routes['/api/desktop-controls/action']

        def request(headers=None, payload=None):
            async def read(size):
                return json.dumps(payload or {'action': 'open-terminal'}).encode()[:size]
            return types.SimpleNamespace(headers=headers or {}, content_type='application/json',
                                         content=types.SimpleNamespace(read=read))

        with patch.object(CONTROLS, 'start') as start:
            for headers, payload, is_viewer in [({}, None, False),
                    ({'X-Harbor-Action': '1', 'Sec-Fetch-Site': 'cross-site'}, None, False),
                    ({'X-Harbor-Action': '1'}, None, True),
                    ({'X-Harbor-Action': '1'}, {'action': 'exec arbitrary'}, False),
                    ({'X-Harbor-Action': '1'}, {'action': 'open-terminal', 'command': 'id'}, False)]:
                viewer[0] = is_viewer
                with self.assertRaises(HttpError):
                    asyncio.run(handler(request(headers, payload)))
            start.assert_not_called()
            viewer[0] = False
            result = asyncio.run(handler(request({'X-Harbor-Action': '1', 'Sec-Fetch-Site': 'same-origin'})))
            self.assertTrue(result['accepted'])
            start.assert_called_once_with('open-terminal')


if __name__ == '__main__':
    unittest.main()
