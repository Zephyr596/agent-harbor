"""Optional realtime desktop notifications inside Selkies' authenticated API.

Original Agent Harbor code, MIT. No notification history or body logging.
"""
import asyncio
import html
import json
import logging
import os
from pathlib import Path
import re
import socket
import time
import uuid

MAX_PACKET = 16384
MAX_CLIENTS = 16


def clean_text(value, limit):
    if not isinstance(value, str):
        return ""
    value = html.unescape(re.sub(r"<[^>]*>", "", value))
    return "".join(c for c in value if c in "\n\t" or ord(c) >= 32)[:limit]


def decode_notice(data):
    if len(data) > MAX_PACKET:
        return None
    try:
        raw = json.loads(data)
    except (ValueError, UnicodeError):
        return None
    if not isinstance(raw, dict):
        return None
    if raw.get("kind") == "heartbeat":
        return {"kind": "heartbeat"}
    summary = clean_text(raw.get("summary"), 200)
    if not summary:
        return None
    return {"kind": "notification", "app": clean_text(raw.get("app"), 100) or "Sandbox",
            "summary": summary, "body": clean_text(raw.get("body"), 1000),
            "id": uuid.uuid4().hex}


class AttentionState:
    def __init__(self):
        self.clients = {}

    def update(self, client, active, now, release=False):
        if release:
            self.clients.pop(client, None)
        else:
            self.clients[client] = (active, now)
        return self.current(now)

    def current(self, now):
        self.clients = {key: value for key, value in self.clients.items() if now - value[1] < 130}
        return not self.clients or any(value[0] for value in self.clients.values())


class Bridge(asyncio.DatagramProtocol):
    def __init__(self):
        self.clients = set()
        self.last_heartbeat = 0
        self.accepted = 0
        self.received_at = []

    def datagram_received(self, data, address):
        notice = decode_notice(data)
        if notice is None:
            return
        now = time.monotonic()
        if notice["kind"] == "heartbeat":
            self.last_heartbeat = now
            self.broadcast("health", {"listener": True})
            return
        self.received_at = [t for t in self.received_at if now - t < 1]
        if len(self.received_at) >= 10:
            return
        self.received_at.append(now)
        self.accepted += 1
        self.broadcast("notification", notice)

    def broadcast(self, event, payload):
        frame = ("event: " + event + "\ndata: " + json.dumps(payload, ensure_ascii=False) + "\n\n").encode()
        for queue in tuple(self.clients):
            if queue.full():
                queue.get_nowait()
            queue.put_nowait(frame)


def install(app, supervisor, api_prefix):
    # Import lazily so protocol tests have no third-party dependency.
    from aiohttp import web
    bridge = Bridge()
    state = Path.home() / ".local/state/sandbox-notifications"
    path = state / "events.sock"
    receiver = None
    receiver_inode = None
    available = False
    attention_state = AttentionState()
    attention_subscribers = {}
    last_attention = None

    def forward_attention(active, force=False):
        nonlocal last_attention
        if receiver and (force or active != last_attention):
            try:
                receiver.sendto(json.dumps({"active": active}).encode(), str(state / "attention.sock"))
                last_attention = active
                return True
            except OSError:
                return False
        return active == last_attention

    def guard(request):
        if supervisor._viewer_ceiling(request):
            raise web.HTTPForbidden(text="Desktop notifications require controller access")
        if request.headers.get("Sec-Fetch-Site") in {"cross-site", "same-site"}:
            raise web.HTTPForbidden(text="Same-origin access required")

    async def startup(unused_app):
        nonlocal receiver, receiver_inode, available
        try:
            state.mkdir(parents=True, exist_ok=True, mode=0o700)
            state.chmod(0o700)
            if path.exists():
                if not path.is_socket():
                    raise RuntimeError("Notification socket path is not a socket")
                path.unlink()
            receiver = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
            receiver.bind(str(path))
            receiver_inode = path.stat().st_ino
            receiver.setblocking(False)
            path.chmod(0o600)

            def readable():
                # Bound each callback so a local sender cannot monopolize streaming.
                for unused in range(32):
                    try:
                        data = receiver.recv(MAX_PACKET + 1)
                    except BlockingIOError:
                        return
                    bridge.datagram_received(data, None)
                    if bridge.last_heartbeat:
                        forward_attention(attention_state.current(time.monotonic()))

            # uvloop does not accept AF_UNIX local_addr in create_datagram_endpoint.
            asyncio.get_running_loop().add_reader(receiver.fileno(), readable)
            available = True
        except Exception as error:
            if receiver:
                receiver.close()
                receiver = None
            logging.getLogger(__name__).warning("Notification receiver disabled: %s", type(error).__name__)

    async def cleanup(unused_app):
        if receiver:
            asyncio.get_running_loop().remove_reader(receiver.fileno())
            receiver.close()
        if path.is_socket() and path.stat().st_ino == receiver_inode:
            path.unlink()

    async def shutdown(unused_app):
        for queue in tuple(bridge.clients):
            if queue.full():
                queue.get_nowait()
            queue.put_nowait(None)

    async def status(request):
        guard(request)
        return web.json_response({"available": available,
                                  "listener": time.monotonic() - bridge.last_heartbeat < 30,
                                  "subscribers": len(bridge.clients), "accepted": bridge.accepted,
                                  "attention_clients": len(attention_state.clients),
                                  "desktop_active": attention_state.current(time.monotonic()),
                                  "focus_synchronized": last_attention},
                                 status=200 if available else 503,
                                 headers={"Cache-Control": "no-store"})

    async def attention(request):
        guard(request)
        if request.content_type != "application/json":
            raise web.HTTPUnsupportedMediaType()
        data = await request.content.read(513)
        if len(data) > 512:
            raise web.HTTPRequestEntityTooLarge(max_size=512, actual_size=len(data))
        try:
            value = json.loads(data)
        except (ValueError, UnicodeError):
            raise web.HTTPBadRequest()
        if (not isinstance(value, dict) or not isinstance(value.get("client"), str)
                or not re.fullmatch(r"[a-zA-Z0-9-]{16,64}", value["client"])
                or type(value.get("active")) is not bool
                or type(value.get("release", False)) is not bool):
            raise web.HTTPBadRequest()
        if not value.get("release") and value["client"] not in attention_subscribers.values():
            raise web.HTTPConflict(text="Connect the notification stream first")
        if value["client"] not in attention_state.clients and len(attention_state.clients) >= 64:
            raise web.HTTPTooManyRequests()
        active = attention_state.update(value["client"], value["active"], time.monotonic(), value.get("release", False))
        return web.json_response({"synchronized": forward_attention(active, force=True)}, headers={"Cache-Control": "no-store"})

    async def events(request):
        guard(request)
        if not available:
            raise web.HTTPServiceUnavailable(text="Desktop notification receiver unavailable")
        if len(bridge.clients) >= MAX_CLIENTS:
            raise web.HTTPTooManyRequests(text="Too many notification subscribers")
        response = web.StreamResponse(headers={"Content-Type": "text/event-stream",
            "Cache-Control": "no-store", "X-Accel-Buffering": "no"})
        await response.prepare(request)
        queue = asyncio.Queue(maxsize=32)
        client_id = request.query.get("client", "")
        bridge.clients.add(queue)
        attention_subscribers[queue] = client_id
        try:
            ready = json.dumps({"listener": time.monotonic() - bridge.last_heartbeat < 30})
            await response.write(("event: health\ndata: " + ready + "\n\n").encode())
            while True:
                try:
                    frame = await asyncio.wait_for(queue.get(), timeout=10)
                except asyncio.TimeoutError:
                    frame = b": keepalive\n\n"
                if frame is None:
                    break
                await response.write(frame)
        except (ConnectionError, asyncio.CancelledError):
            pass
        finally:
            bridge.clients.discard(queue)
            attention_subscribers.pop(queue, None)
            if client_id and client_id not in attention_subscribers.values():
                active = attention_state.update(client_id, True, time.monotonic(), release=True)
                forward_attention(active)
        return response

    app.on_startup.append(startup)
    app.on_shutdown.append(shutdown)
    app.on_cleanup.append(cleanup)
    app.router.add_post(api_prefix + "/api/desktop-notifications/attention", attention)
    app.router.add_get(api_prefix + "/api/desktop-notifications/status", status)
    app.router.add_get(api_prefix + "/api/desktop-notifications/events", events)
