"""Exercise bounded notification data and version-gated patching, without a desktop."""
import asyncio
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


SERVER = load('notification_server_tests', ROOT / 'desktop/notifications/server.py')
INSTALL = load('notification_install_tests', ROOT / 'desktop/notifications/install.py')


class NotificationProtocolTests(unittest.TestCase):
    def packet(self, **values):
        return json.dumps({'app':'Test app', 'summary':'Done', 'body':'<b>你好</b>', **values}).encode()

    def test_text_is_plain_and_bounded(self):
        result = SERVER.decode_notice(self.packet(body='<b>你好</b>\x00' + 'x' * 2000))
        self.assertEqual(len(result['body']), 1000)
        self.assertTrue(result['body'].startswith('你好'))
        self.assertNotIn('\x00', result['body'])

    def test_invalid_or_empty_notifications_are_ignored(self):
        for packet in [b'not json', b'[]', b'x' * (SERVER.MAX_PACKET + 1), self.packet(summary='')]:
            self.assertIsNone(SERVER.decode_notice(packet))

    def test_notifications_are_not_replayed_to_later_subscribers(self):
        bridge = SERVER.Bridge()
        bridge.datagram_received(self.packet(), None)
        queue = asyncio.Queue(maxsize=2)
        bridge.clients.add(queue)
        self.assertTrue(queue.empty())
        bridge.datagram_received(self.packet(summary='Next'), None)
        self.assertIn(b'Next', queue.get_nowait())

    def test_slow_subscribers_keep_a_bounded_queue(self):
        bridge = SERVER.Bridge()
        queue = asyncio.Queue(maxsize=2)
        bridge.clients.add(queue)
        for i in range(5):
            bridge.datagram_received(self.packet(summary=str(i)), None)
        self.assertEqual(queue.qsize(), 2)
        self.assertIn(b'"summary": "3"', queue.get_nowait())
        self.assertIn(b'"summary": "4"', queue.get_nowait())


class NotificationInstallTests(unittest.TestCase):
    def test_unknown_upstream_is_refused(self):
        with self.assertRaises(ValueError):
            INSTALL.patched_source('unexpected upstream')

    def test_patch_is_idempotent_and_preserves_existing_routes(self):
        fixture = 'class Server:\n    def start(self):\n' + INSTALL.ANCHOR
        old = INSTALL.ORIGINAL_SHA256
        self.addCleanup(setattr, INSTALL, 'ORIGINAL_SHA256', old)
        INSTALL.ORIGINAL_SHA256 = hashlib.sha256(fixture.encode()).hexdigest()
        result = INSTALL.patched_source(fixture)
        self.assertEqual(INSTALL.patched_source(result), result)
        self.assertEqual(result.count(INSTALL.ANCHOR), 1)
        self.assertEqual(result.count('AGENT_HARBOR_DESKTOP_NOTIFICATIONS'), 1)




class AttentionTests(unittest.TestCase):
    def test_any_active_controller_keeps_desktop_active(self):
        state = SERVER.AttentionState()
        self.assertFalse(state.update('first', False, 10))
        self.assertTrue(state.update('second', True, 10))
        self.assertFalse(state.update('second', True, 11, release=True))
        self.assertTrue(state.current(150))

    def test_background_heartbeat_renews_lease(self):
        state = SERVER.AttentionState()
        state.update('first', False, 10)
        self.assertFalse(state.update('first', False, 120))
        self.assertFalse(state.current(200))
        self.assertTrue(state.current(251))


if __name__ == "__main__":
    unittest.main()
