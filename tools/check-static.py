#!/usr/bin/env python3
"""Parse repository Python/JSON and check local documentation links, without services."""
import ast
import json
import re
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    names = [line.split('  ', 1)[1] for line in (root / 'checksums.sha256').read_text().splitlines()]
    for name in names:
        path = root / name
        if path.suffix == '.py':
            ast.parse(path.read_text(), filename=name)
        elif path.suffix == '.json':
            json.loads(path.read_text())
        elif path.suffix == '.md':
            for ref in re.findall(r'\]\(([^)]+)\)', path.read_text()):
                if ':' not in ref and not ref.startswith('#'):
                    target = path.parent / ref.split('#', 1)[0]
                    if not target.exists():
                        raise SystemExit('Broken link in ' + name + ': ' + ref)
    print('Python/JSON syntax and local Markdown targets passed')


if __name__ == '__main__':
    main()
