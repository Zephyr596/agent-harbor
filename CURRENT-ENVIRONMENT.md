# Source environment snapshot (2026-11-12)

- Ubuntu 24.04, x86_64, ThinkBook 16p; GPU is not passed into this desktop stack.
- Source project: `/home/<operator>/browser-sandbox`, desktop data: `webtop-data/`.
- Source LAN address and SSH identity omitted; use the replica operator and host address.
- Source tailnet hostname omitted; authenticate the replica as its own node and use its own HTTPS URL.
- Source egress was an AWS Tokyo TCP endpoint; use your own fixed endpoint and credentials.
- Docker 29.9.3; Compose v5.7.1; Tailscale 1.104.6.
- Webtop `40ce2d52-ls300`; Selkies 2.2.1; i3 4.25.1; sing-box 1.14.4.
- PRoot Apps manager 0.5.10, copied from `/proot-apps/` by the pinned Webtop image on first boot.
- Chrome 157.0.8103.78-1; Claude Desktop 5.1231.0; standalone Claude Code 2.1.311.
- Final keyboard resource: `shortcutfix=separated1`; frontend SHA-256 `54390230482730af4403b6fd727dd5926c273d1391bcd36b45b0b6da6e99caae`.
- Production Compose was observed using mutable tags. This delivery pins their currently running image digests in `.env.example`.
- Production Compose declares IME mounts, but its `/usr/share/selkies/web` child-file mounts were not active in the running container. A clean-start test found that these mounts conflict with init-nginx, which deletes/recreates that directory. The delivery Compose omits those two dynamic-web mounts, mounts the physical `selkies-dashboard` files, and lets init-nginx copy them to `web`. The running production Compose was not changed by this documentation task. Its sanitized snapshot is under `reference/`, and is not the deployable template.
- Host timezone remains Asia/Shanghai; the desktop container uses Asia/Tokyo.

This delivery contains no browser profile migration, session tokens, SSH private keys, Tailscale state or real Shadowsocks password. The AWS server was not re-audited in this documentation pass because its SSH signing agent was unavailable; `server/` is a reference template, not an exported live server configuration.

The repository now parameterizes egress endpoint, tunneled DNS upstream and display timezone. The generic default is Etc/UTC with DNS 1.1.1.1 via the proxy. The observations above describe the historical Tokyo instance; they are not deployment defaults or evidence for every region. Production was not changed while preparing this repository.
