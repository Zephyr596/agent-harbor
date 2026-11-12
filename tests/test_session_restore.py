"""Check startup decisions without launching a desktop or contacting a proxy."""
from pathlib import Path
import runpy
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1]
RESTORE = runpy.run_path(str(SOURCE / 'seed/home/.local/bin/sandbox-session-restore'))


class SessionRestoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name)

    def install(self, name):
        app = next(app for app in RESTORE['APPS'] if app['name'] == name)
        root = self.home / 'proot-apps' / ('ghcr.io_linuxserver_proot-apps_' + name)
        root.mkdir(parents=True)
        (root / 'SHALAYER').write_text('sha256:test-fixture\n')
        launcher = self.home / '.local/bin' / app['launcher']
        launcher.parent.mkdir(parents=True, exist_ok=True)
        launcher.write_text('#!/bin/sh\nexit 99\n')
        launcher.chmod(0o755)
        return root

    def plan(self, classes=(), processes=()):
        return {p['app']: p for p in RESTORE['make_plan'](self.home, set(classes), set(processes))}

    def test_uninstalled_optional_apps_are_skipped(self):
        self.assertEqual(self.plan()['claude']['action'], 'not-installed')

    def test_installed_apps_launch_with_browser_session_restore(self):
        self.install('chrome')
        self.install('claude')
        plan = self.plan()
        self.assertEqual(plan['chrome']['action'], 'launch')
        self.assertIn('--restore-last-session', plan['chrome']['command'])
        self.assertEqual(plan['claude']['action'], 'launch')

    def test_existing_or_initializing_apps_are_not_duplicated(self):
        self.install('chrome')
        self.install('claude')
        plan = self.plan(classes=['Google-chrome'], processes=['claude-desktop'])
        self.assertEqual(plan['chrome']['action'], 'already-running')
        self.assertEqual(plan['claude']['action'], 'already-running')

    def test_partial_install_is_never_started(self):
        root = self.install('claude')
        (root / 'DOWNLOADING').touch()
        self.assertEqual(self.plan()['claude']['action'], 'installation-in-progress')
        (root / 'DOWNLOADING').unlink()
        (root / 'SHALAYER').write_text('')
        self.assertEqual(self.plan()['claude']['action'], 'not-installed')

    def test_floating_windows_count_as_existing_apps(self):
        tree = {'floating_nodes': [{'nodes': [{'window': 123,
                 'window_properties': {'class': 'com.anthropic.Claude'}}]}]}
        self.assertIn('com.anthropic.Claude', RESTORE['window_classes'](tree))


if __name__ == '__main__':
    unittest.main()
