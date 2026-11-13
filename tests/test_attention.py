"""Focus restoration must not overwrite another controller's focus or stale windows."""
import importlib.util
from pathlib import Path
import unittest

path = Path(__file__).resolve().parents[1] / 'seed/home/.local/lib/sandbox-notifications/attention.py'
spec = importlib.util.spec_from_file_location('desktop_attention_test', path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class FakeX:
    def __init__(self):
        self.focus = 42
        self.live = {42}
        self.calls = []

    def XSetInputFocus(self, display, window, revert, time):
        self.calls.append(window)
        self.focus = window

    def XFlush(self, display):
        pass

    def XGetWindowAttributes(self, display, window, attributes):
        return window in self.live


class AttentionTests(unittest.TestCase):
    def setUp(self):
        self.target = module.DesktopAttention.__new__(module.DesktopAttention)
        self.target.x = FakeX()
        self.target.display = None
        self.target.saved = None
        self.target.current = lambda: self.target.x.focus

    def test_background_then_foreground_restores_original(self):
        self.target.set_active(False)
        self.target.set_active(False)
        self.assertEqual(self.target.x.focus, 0)
        self.target.set_active(True)
        self.assertEqual(self.target.x.calls, [0, 42])
        self.assertIsNone(self.target.saved)

    def test_other_controller_focus_is_preserved(self):
        self.target.set_active(False)
        self.target.x.focus = 99
        self.target.set_active(True)
        self.assertEqual(self.target.x.focus, 99)
        self.assertIsNone(self.target.saved)

    def test_closed_window_is_not_restored(self):
        self.target.set_active(False)
        self.target.x.live.clear()
        self.target.set_active(True)
        self.assertEqual(self.target.x.calls, [0])
