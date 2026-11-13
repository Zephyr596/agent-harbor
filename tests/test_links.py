import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

class LinkArguments(unittest.TestCase):
    def test_oauth_query_is_one_literal_argument(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            nc = folder / "nc"
            nc.write_text("#!/bin/sh\ncat\n")
            nc.chmod(0o755)
            args = ["https://example.invalid/oauth?state=one&redirect_uri=https%3A%2F%2Fexample.invalid%2Fcb", "https://example.invalid/?x='quote'&y=\"double\"&z=$(false)", "https://example.invalid/#line\nnext"]
            command = subprocess.check_output(["bash", str(ROOT / "seed/home/.local/lib/sandbox-links/xdg-open"), *args], env={**os.environ, "PATH": str(folder) + os.pathsep + os.environ["PATH"]}, text=True)
            # Execute only the generated command, with a synthetic destination.
            probe = "xdg-open() { python3 -c 'import json,sys;print(json.dumps(sys.argv[1:]))' \"$@\"; }; "
            output = subprocess.check_output(["bash", "-c", probe + command], text=True)
            self.assertEqual(json.loads(output), args)
            self.assertEqual(command.count("\n"), 1)
