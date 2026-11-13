#!/bin/bash
# Run as the ordinary Webtop user. PRoot -0 simulates UID 0 inside a writable
# user-owned rootfs; it does not grant host/container root, sudo or capabilities.
set -euo pipefail
ROOT=${1:-/config/proot-apps/ghcr.io_linuxserver_proot-apps_claude}
if [ "$(id -u)" = 0 ]; then
  echo 'Run with docker exec -u abc, not as root' >&2
  exit 1
fi
if ! grep -q '^VERSION_CODENAME=trixie$' "$ROOT/etc/os-release"; then
  echo 'This package set requires the recorded Debian trixie PRoot app' >&2
  exit 1
fi
PROOT=/config/.local/bin/proot
export DEBIAN_FRONTEND=noninteractive
"$PROOT" -0 -R "$ROOT" /usr/bin/apt-get update
"$PROOT" -0 -R "$ROOT" /usr/bin/apt-get install -y --no-install-recommends \
  sqlite3=3.46.1-7+deb13u2 unzip=6.0-29+deb13u1 poppler-utils=25.03.0-5+deb13u4
