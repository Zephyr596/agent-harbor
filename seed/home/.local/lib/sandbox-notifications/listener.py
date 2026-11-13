#!/usr/bin/env python3
"""Observe this desktop session's Notify calls without replacing its daemon."""
import fcntl
import json
from pathlib import Path
import socket
import sys


def main():
    import dbus
    from dbus.mainloop.glib import DBusGMainLoop
    from gi.repository import GLib
    state = Path.home() / ".local/state/sandbox-notifications"
    state.mkdir(parents=True, exist_ok=True, mode=0o700)
    lock = (state / "listener.lock").open("a+")
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        return
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    sock.settimeout(0.2)

    def send(payload):
        packet = json.dumps(payload, ensure_ascii=False).encode()
        if len(packet) <= 16384:
            try:
                sock.sendto(packet, str(state / "events.sock"))
            except OSError:
                pass

    def heartbeat():
        send({"kind": "heartbeat"})
        return True

    def observe(connection, message):
        if message.get_interface() != "org.freedesktop.Notifications" or message.get_member() != "Notify":
            return
        if message.get_type() != dbus.lowlevel.MESSAGE_TYPE_METHOD_CALL:
            return
        try:
            args = message.get_args_list()
            if len(args) == 8:
                send({"app": str(args[0])[:100], "summary": str(args[3])[:500],
                      "body": str(args[4])[:2000]})
        except (ValueError, TypeError):
            pass

    DBusGMainLoop(set_as_default=True)
    bus = dbus.SessionBus()
    bus.add_message_filter(observe)
    bus.add_match_string("type='method_call',interface='org.freedesktop.Notifications',member='Notify',eavesdrop='true'")
    heartbeat()
    GLib.timeout_add_seconds(10, heartbeat)
    # Keep all state alive for the lifetime of the GLib loop.
    GLib.MainLoop().run()


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Notification listener failed: " + type(error).__name__, file=sys.stderr)
        raise SystemExit(1)
