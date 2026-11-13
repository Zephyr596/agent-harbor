# Third-party code and provenance

The `desktop/ime/` files contain modified Selkies frontend/backend code. The Python
file retains its Mozilla Public License 2.0 notice and incorporated Apache 2.0
notice. The Selkies license is included in `licenses/Selkies-LICENSE`; the incorporated Apache text is included in `licenses/Apache-2.0-LICENSE`.

- Upstream source: https://github.com/selkies-project/selkies
- Upstream license: https://github.com/selkies-project/selkies/blob/main/LICENSE
- Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
- Webtop image/source: https://github.com/linuxserver/docker-webtop
- Selkies base-image source: https://github.com/linuxserver/docker-baseimage-selkies
- PRoot Apps source: https://github.com/linuxserver/proot-apps

The LinuxServer Webtop and Selkies base-image GPL-3.0 license texts are included
in `licenses/LinuxServer-Webtop-LICENSE` and
`licenses/LinuxServer-Selkies-Base-LICENSE`. The modified startup script remains
covered by its upstream license.

The runtime and base-image revisions/digests are recorded in
`images.observed.json` and `CURRENT-ENVIRONMENT.md`. The IME backend modification
routes committed Unicode through the existing clipboard injector; the frontend
modifications keep macOS preedit local, position the candidate anchor, deduplicate
commits, remove the transient Alt tap, and exclude Enter from the Command-to-Ctrl
application mapping. `desktop/svc-de-run` is a small modification of the pinned
LinuxServer startup script: bounded X readiness probes and no forced 1024x768 in
dynamic-resolution mode. `desktop/svc-selkies-run` modifies the same pinned base image's script to bound audio readiness/sink probes; its original SHA-256 is `a06cf2ba7e3df663c0f93c89216478c442a16d541ebc8e79cbcef449534a4797` and its upstream GPL-3.0 license continues to apply.

Third-party licenses continue to apply to their respective files and container
images. No proprietary Chrome/Claude executables or personal application data are
redistributed in this package; installation downloads the recorded public
upstream artifacts separately.

`desktop/notifications/install.py` (MPL-2.0) generates a small modification of
Selkies `stream_server.py` and preserves its upstream notices. The accepted base
SHA-256 is `82cf2855de173bd8e7e3e90f544c1486a0c327771c1d275998e212ff7a7738cb`;
the installer includes the complete generated hook source. The independent
notification server, browser client and user-session listener are original MIT
code. The existing Selkies MPL text in `licenses/Selkies-LICENSE` applies to the
generated upstream-file modification.

The root MIT LICENSE covers original Agent Harbor tools and documentation; it does not relicense the third-party sources or modifications above. No Claude-Cage code has been imported.
