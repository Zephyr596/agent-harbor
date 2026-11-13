#!/usr/bin/env python3
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
"""Install a bounded hook into the digest-pinned Selkies image, without services."""
import hashlib
import os
from pathlib import Path
import shutil

ORIGINAL_SHA256 = "82cf2855de173bd8e7e3e90f544c1486a0c327771c1d275998e212ff7a7738cb"
ANCHOR = "        self.app.add_routes(routes)\n"
HOOK = '''
        # AGENT_HARBOR_DESKTOP_NOTIFICATIONS
        try:
            from importlib.util import spec_from_file_location, module_from_spec
            spec = spec_from_file_location("agent_harbor_notifications", "/opt/agent-harbor/notifications/server.py")
            bridge_module = module_from_spec(spec)
            spec.loader.exec_module(bridge_module)
            bridge_module.install(self.app, self, api_prefix)
        except Exception as error:
            logger.warning("Desktop notifications unavailable: %s", type(error).__name__)
'''


def patched_source(source):
    original = source.replace(HOOK, "", 1)
    if hashlib.sha256(original.encode()).hexdigest() != ORIGINAL_SHA256:
        raise ValueError("Selkies stream_server.py does not match the recorded image")
    if HOOK in source:
        return source
    if original.count(ANCHOR) != 1:
        raise ValueError("Expected exactly one API registration hook")
    result = original.replace(ANCHOR, ANCHOR + HOOK, 1)
    compile(result, "stream_server.py", "exec")
    return result


def main():
    env = Path("/run/s6/container_environment")
    if env.is_dir():
        (env / "FILE_MANAGER_PATH").write_text(os.environ.get("FILE_MANAGER_PATH", "/config/projects"))
    target = Path("/lsiopy/lib/python3.14/site-packages/selkies/stream_server.py")
    try:
        result = patched_source(target.read_text())
    except ValueError as error:
        print("Notification extension skipped: " + str(error))
        return
    # Keep existing bind-mount inodes intact.
    target.write_text(result)
    source = Path(__file__).parent / "client.js"
    for folder in [Path("/usr/share/selkies/selkies-dashboard"), Path("/usr/share/selkies/web")]:
        if folder.is_dir():
            shutil.copy2(source, folder / "desktop-notifications.js")
    print("Desktop notifications hook and file-manager environment prepared")


if __name__ == "__main__":
    main()
