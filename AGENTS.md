# Agent working agreement

Read README.md, docs/REPRODUCE.md and CURRENT-ENVIRONMENT.md before changing deployment behavior.

- Work on repository templates. Do not SSH to an existing installation, restart its services, modify Tailscale settings, or install a Mac LaunchAgent merely to validate a patch.
- Never commit runtime .env files, generated sing-box credentials, webtop-data, browser/account profiles, SSH keys or Tailscale state. Use documentation-range IPs and synthetic keys in tests.
- Keep management access separate from application egress. Preserve loopback publication, the shared firewall namespace, tunneled DNS without direct fallback, disabled desktop sudo and NoNewPrivs.
- Do not add privileged, SYS_ADMIN, host networking, unconfined security profiles, Docker sockets or broad sudo to make an application start.
- Egress region, proxy endpoint, DNS resolver and display timezone are deployment choices. Do not hard-code a city or a production machine identity. Record backend limitations explicitly.
- The first backend is Shadowsocks-2022 / IPv4 TCP. Other backends and VM support are roadmap items, not existing features.
- Keep image/app digests pinned. The full Selkies JS/Python patches depend on the recorded base version; compare upstream files before upgrading.
- Report observed validation separately from untested deployment claims. Chromium/Electron process sandboxing and Desktop keyring persistence remain unresolved.
- Run `make check` for repository changes. After intentional file changes, run `python3 tools/update-checksums.py`, then `make check`. Do not regenerate checksums to hide unexplained changes.

Third-party files keep their original licensing; project MIT licensing applies to original code and documentation.
