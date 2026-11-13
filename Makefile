.PHONY: check

export PYTHONDONTWRITEBYTECODE := 1

check:
	python3 tools/update-checksums.py --check
	python3 tools/verify.py --static
	python3 tools/check-static.py
	python3 -m unittest discover -s tests -v
	node --input-type=module --check < desktop/ime/selkies-core.js
	node --check desktop/notifications/client.js
	node --test tests/notifications-client.test.cjs
	sh -n firewall/start.sh
	bash -n desktop/svc-de-run
	bash -n desktop/svc-selkies-run
	bash -n desktop/svc-pulseaudio-run
	bash -n desktop/audio/pulse-supervisor.sh
	bash -n tools/install-guest-tools.sh
	bash -n desktop/notifications/init.sh
