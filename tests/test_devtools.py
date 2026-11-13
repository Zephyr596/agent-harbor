"""Protect existing tools and exercise real child-process startup recovery."""
import importlib.util
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('install_devtools', ROOT / 'tools/install-devtools.py')
INSTALL = importlib.util.module_from_spec(spec)
spec.loader.exec_module(INSTALL)


class ToolPublicationTests(unittest.TestCase):
    def test_user_tool_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            prefix = root / 'managed'
            prefix.mkdir()
            target = prefix / 'python'
            target.write_text('managed')
            existing = root / 'python'
            existing.write_text('user data')
            with self.assertRaises(ValueError):
                INSTALL.link(target, existing, prefix)
            self.assertEqual(existing.read_text(), 'user data')
            unrelated = root / 'other'
            unrelated.write_text('external')
            alias = root / 'alias'
            alias.symlink_to(unrelated)
            with self.assertRaises(ValueError):
                INSTALL.link(target, alias, prefix)
            self.assertEqual(alias.resolve(), unrelated.resolve())


@unittest.skipIf(os.geteuid() == 0, 'Pulse supervisor intentionally refuses root')
class PulseStartupTests(unittest.TestCase):
    def test_unresponsive_daemon_is_reaped_for_supervisor_restart(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            (folder / 'pulseaudio').write_text('#!/bin/sh\necho $$ > "$PULSE_TEST_PID"\nexec sleep 60\n')
            (folder / 'pactl').write_text('#!/bin/sh\nexit 1\n')
            (folder / 'timeout').write_text('#!/bin/sh\nshift\nexec \"$@\"\n')
            for name in ['pulseaudio', 'pactl', 'timeout']:
                (folder / name).chmod(0o755)
            env = dict(os.environ, PATH=str(folder) + os.pathsep + os.environ['PATH'],
                       PULSE_TEST_PID=str(folder / 'pid'))
            process = subprocess.Popen(['bash', str(ROOT / 'desktop/audio/pulse-supervisor.sh')],
                                       env=env, start_new_session=True, stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE)
            try:
                _, error = process.communicate(timeout=12)
                self.assertEqual(process.returncode, 1)
                self.assertIn(b'Startup health check timed out', error)
                daemon = int((folder / 'pid').read_text())
                with self.assertRaises(ProcessLookupError):
                    os.kill(daemon, 0)
            finally:
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                process.wait()


if __name__ == '__main__':
    unittest.main()
