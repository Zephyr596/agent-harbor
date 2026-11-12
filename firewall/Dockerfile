ARG BASE_IMAGE
FROM ${BASE_IMAGE}

RUN apk add --no-cache iptables
COPY start.sh /start.sh
RUN chmod 755 /start.sh
ENTRYPOINT ["/start.sh"]
