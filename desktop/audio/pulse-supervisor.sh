#!/bin/bash
# A stalled PulseAudio startup must not leave the desktop waiting indefinitely.
set -u
if [ "$(id -u)" = 0 ]; then
  echo 'Pulse supervisor must run as the desktop user' >&2
  exit 1
fi
pulseaudio --log-level=0 --log-target=stderr --exit-idle-time=-1 >/dev/null 2>&1 &
pulse_pid=$!
stop() {
  trap - TERM INT HUP
  kill -TERM "$pulse_pid" 2>/dev/null || true
  for _ in $(seq 1 10); do
    kill -0 "$pulse_pid" 2>/dev/null || break
    sleep .1
  done
  kill -KILL "$pulse_pid" 2>/dev/null || true
  wait "$pulse_pid" 2>/dev/null || true
  exit 0
}
trap stop TERM INT HUP
for _ in $(seq 1 10); do
  if ! kill -0 "$pulse_pid" 2>/dev/null; then
    wait "$pulse_pid"
    exit $?
  fi
  if timeout 2s pactl info >/dev/null 2>&1; then
    wait "$pulse_pid"
    exit $?
  fi
  sleep .5
done
echo '[pulse-supervisor] Startup health check timed out; restarting via s6' >&2
kill -KILL "$pulse_pid" 2>/dev/null || true
wait "$pulse_pid" 2>/dev/null || true
exit 1
