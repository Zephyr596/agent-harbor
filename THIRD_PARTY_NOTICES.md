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
dynamic-resolution mode.

Third-party licenses continue to apply to their respective files and container
images. No proprietary Chrome/Claude executables or personal application data are
redistributed in this package; installation downloads the recorded public
upstream artifacts separately.

The root MIT LICENSE covers original Agent Harbor tools and documentation; it does not relicense the third-party sources or modifications above. No Claude-Cage code has been imported.
