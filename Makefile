.PHONY: check

export PYTHONDONTWRITEBYTECODE := 1

check:
	python3 tools/update-checksums.py --check
	python3 tools/verify.py --static
	python3 tools/check-static.py
	python3 -m unittest discover -s tests -v
	node --input-type=module --check < desktop/ime/selkies-core.js
	sh -n firewall/start.sh
	bash -n desktop/svc-de-run
