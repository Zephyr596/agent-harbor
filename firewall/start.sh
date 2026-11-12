#!/bin/sh
set -eu

EGRESS_SERVER_IP="${EGRESS_SERVER_IP:?EGRESS_SERVER_IP must be an IPv4 literal}"
EGRESS_SERVER_PORT="${EGRESS_SERVER_PORT:-28443}"

# 默认拒绝全部 IPv4 出站
iptables -P OUTPUT DROP
iptables -F OUTPUT

# 禁止 DNS 直接出站，包括 Docker 内置 DNS
iptables -A OUTPUT -p udp --dport 53 -j REJECT
iptables -A OUTPUT -p tcp --dport 53 -j REJECT
iptables -A OUTPUT -d 127.0.0.11/32 -j REJECT

# 允许本机回环：浏览器与 sing-box 通信
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立连接的响应
iptables -A OUTPUT -m conntrack \
  --ctstate ESTABLISHED,RELATED -j ACCEPT

# 唯一允许的新建外部连接
iptables -A OUTPUT \
  -d "$EGRESS_SERVER_IP/32" \
  -p tcp --dport "$EGRESS_SERVER_PORT" \
  -j ACCEPT

# 禁止 IPv6 出站
ip6tables -P OUTPUT DROP
ip6tables -F OUTPUT

echo "Egress firewall initialized"
iptables -S OUTPUT

exec sleep infinity
