#!/bin/bash
# Ordinary desktop user only; PRoot's fake UID 0 grants no real privileges.
set -euo pipefail
ROOT=${1:-/config/proot-apps/ghcr.io_linuxserver_proot-apps_claude}
if [ "$(id -u)" = 0 ]; then
  echo 'Run as the ordinary Webtop user, not root' >&2
  exit 1
fi
if ! grep -q '^VERSION_CODENAME=trixie$' "$ROOT/etc/os-release"; then
  echo 'Requires the recorded Debian trixie app layer' >&2
  exit 1
fi
PROOT=/config/.local/bin/proot
export DEBIAN_FRONTEND=noninteractive
"$PROOT" -0 -R "$ROOT" /usr/bin/apt-get update
# PRoot's rename handling failed on these documentation/locale paths in the
# source rootfs. Exclusions are per invocation; restore the package copyright.
"$PROOT" -0 -R "$ROOT" /usr/bin/apt-get install -y --no-install-recommends \
  '-oDpkg::Options::=--path-exclude=/usr/share/locale/*' \
  '-oDpkg::Options::=--path-exclude=/usr/share/doc/libgcr-base-3-1' \
  '-oDpkg::Options::=--path-exclude=/usr/share/doc/libgcr-base-3-1/*' \
  gnome-keyring=48.0-1 gcr=3.41.2-3 libsecret-tools=0.21.7-1 libgcr-base-3-1=3.41.2-3
"$PROOT" -0 -R "$ROOT" /bin/sh -eu -c '
  scratch=$(mktemp -d)
  trap '\''rm -rf "$scratch"'\'' EXIT
  cd "$scratch"
  apt-get download libgcr-base-3-1=3.41.2-3
  mkdir -p /usr/share/doc/libgcr-base-3-1
  dpkg-deb --fsys-tarfile ./*.deb | tar -x -C / ./usr/share/doc/libgcr-base-3-1/copyright
  dpkg --audit
'
echo 'Secret Service packages installed. Merge the user DBus services and launcher from seed/home.'
LINK_SHIM=/config/.local/lib/sandbox-links/xdg-open
if [ -f "$LINK_SHIM" ]; then
  if [ ! -f "$ROOT/usr/bin/xdg-open.before-agent-harbor" ]; then
    cp -p "$ROOT/usr/bin/xdg-open" "$ROOT/usr/bin/xdg-open.before-agent-harbor"
  fi
  cp "$LINK_SHIM" "$ROOT/usr/bin/xdg-open"
  chmod 755 "$ROOT/usr/bin/xdg-open"
fi
