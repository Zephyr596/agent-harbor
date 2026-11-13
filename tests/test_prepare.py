"""Exercise deployment preparation in disposable directories, without Docker or a proxy."""
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1]


class PreparationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'deployment'
        shutil.copytree(SOURCE, self.root, ignore=shutil.ignore_patterns('.git', '__pycache__', 'webtop-data'))
        self.env = (self.root / '.env.example').read_text().replace(
            'REPLACE_PROXY_IPV4', '192.0.2.10'
        ).replace('REPLACE_WITH_16_BYTE_BASE64_KEY', 'AAAAAAAAAAAAAAAAAAAAAA==')
        self.write_env()

    def write_env(self, replacements=None):
        env = self.env
        for before, after in (replacements or {}).items():
            env = env.replace(before, after)
        (self.root / '.env').write_text(env)

    def prepare(self, *args):
        return subprocess.run(
            [sys.executable, str(self.root / 'tools/prepare.py'), *args],
            capture_output=True, text=True,
        )

    def test_generic_and_optional_regional_configuration(self):
        result = self.prepare()
        self.assertEqual(result.returncode, 0, result.stderr)
        target = self.root / 'config/sing-box.json'
        config = json.loads(target.read_text())
        self.assertEqual(config['outbounds'][0]['server'], '192.0.2.10')
        self.assertEqual(config['dns']['servers'][0]['server'], '1.1.1.1')
        self.assertEqual(config['dns']['servers'][0]['detour'], 'egress')
        self.assertEqual(len(config['outbounds']), 1)
        self.assertEqual(len(config['dns']['servers']), 1)
        self.assertEqual(target.stat().st_mode & 0o777, 0o600)
        self.assertTrue((self.root / 'webtop-data/.local/bin/sandbox-notification-listener').is_file())
        self.assertTrue((self.root / 'webtop-data/.local/lib/sandbox-notifications/listener.py').is_file())
        self.assertTrue((self.root / 'webtop-data/projects').is_dir())
        inode = target.stat().st_ino
        self.write_env({'DNS_UPSTREAM_IP=1.1.1.1': 'DNS_UPSTREAM_IP=169.254.169.253',
                        'SANDBOX_TZ=Etc/UTC': 'SANDBOX_TZ=Asia/Tokyo'})
        result = self.prepare('--config-only')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(target.stat().st_ino, inode)
        self.assertEqual(json.loads(target.read_text())['dns']['servers'][0]['server'], '169.254.169.253')

    def test_existing_desktop_is_not_overwritten(self):
        home = self.root / 'webtop-data'
        home.mkdir()
        sentinel = home / 'operator-file'
        sentinel.write_text('preserve this')
        result = self.prepare()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(sentinel.read_text(), 'preserve this')
        self.assertFalse((self.root / 'config/sing-box.json').exists())

    def test_invalid_parameters_do_not_create_runtime_files(self):
        for replacements in [
            {'DNS_UPSTREAM_PORT=53': 'DNS_UPSTREAM_PORT=0'},
            {'SANDBOX_TZ=Etc/UTC': 'SANDBOX_TZ=NoSuch/Timezone'},
            {'EGRESS_SERVER_IP=192.0.2.10': 'EGRESS_SERVER_IP=proxy.invalid'},
            {'FILE_MANAGER_PATH=/config/projects': 'FILE_MANAGER_PATH=/etc'},
            {'FILE_MANAGER_PATH=/config/projects': 'FILE_MANAGER_PATH=/config/../etc'},
        ]:
            with self.subTest(replacements=replacements):
                self.write_env(replacements)
                self.assertNotEqual(self.prepare().returncode, 0)
                self.assertFalse((self.root / 'config/sing-box.json').exists())
                self.assertFalse((self.root / 'webtop-data').exists())


if __name__ == '__main__':
    unittest.main()
