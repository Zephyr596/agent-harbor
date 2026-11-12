# Agent Harbor

可持久运行、可由其他 agent 复刻的远程桌面沙箱。基于 **Ubuntu + Docker Webtop / i3 + sing-box**，通过 **Tailscale Serve** 或 **Mac 持久 SSH 转发**访问。

出口服务器、DNS 上游与时区由部署参数决定。东京是最初运行实例和一个可选预设，不是方案依赖。首版支持 Shadowsocks-2022 / IPv4 TCP 后端；其他代理类型尚未实现。

**状态：实验性复刻基线。** 已有运行实例和隔离启动验证，尚未完成第二台空白机器的全流程重放。Chrome / Electron 的 `--no-sandbox` 和 Claude Desktop 钥匙串仍是已知缺口，不能把它当成完整的浏览器进程沙箱或多租户系统。

[完整复刻指南](docs/REPRODUCE.md) · [验证记录](validation/DELIVERY-VALIDATION.md) · [后续路线图](docs/ROADMAP.md) · [贡献](CONTRIBUTING.md)

## 已有能力

| 范围 | 当前实现 |
| --- | --- |
| 桌面 | Webtop / Selkies / i3；用户数据持久化到项目目录 |
| 出站 | 三个容器共享 firewall namespace；只允许连接配置的代理 IPv4/TCP；拒绝直接 DNS 与 IPv6 出站 |
| DNS | 配置的 TCP DNS 上游，经同一加密代理访问，无本地直连后备 |
| 访问 | Ubuntu 仅发布 loopback；Tailscale Serve 持久 HTTPS；Mac launchd 持久 SSH 隧道 |
| 可复刻性 | 镜像摘要与 PRoot 应用层锁定，干净 HOME 种子，安装和只读验收工具 |
| 交互 | 动态分辨率、Mac 拼音提交与候选框补丁、Command 编辑与 Control 桌面控制分离 |
| 应用 | Chrome；可选 Claude Desktop / Claude Code，由用户重新认证 |
| 会话恢复 | 桌面启动后重开已安装应用：工作区 1 Chrome、工作区 2 Claude；跳过已有进程 |

Tailscale 是进入桌面的管理通道，公网出站走所配置的代理；两条路径分开配置。首版不提供图形安装器，也没有自动根据出口切换时区、通用代理订阅管理或完整 VM 隔离。

Claude Desktop 启动器保留软件渲染，并使用 `--disable-http2` 缓解源机代理链路上的冷加载延迟。工作区恢复及本机加载对照结果见 [桌面恢复与加载优化](docs/DESKTOP-RECOVERY.md)；这不是运行中进程或任意窗口布局的快照。

## 从这里开始

目标平台：Ubuntu 24.04 / x86_64；Mac 为已验证的操作端。需要 Docker Compose、Python 3、Tailscale，以及自己的兼容代理服务器。

```bash
git clone https://github.com/Zephyr596/agent-harbor.git
cd agent-harbor
python3 tools/verify.py --static
cp .env.example .env
chmod 600 .env
# 编辑 .env：代理地址/密钥、DNS、时区、UID/GID。
python3 tools/prepare.py
sudo docker compose config --quiet
```

以上只准备配置；启动、Tailscale Serve、Mac 隧道和应用安装步骤见 [复刻指南](docs/REPRODUCE.md)。不要直接启动 `reference/` 下的历史 Compose。

默认 `SANDBOX_TZ=Etc/UTC`、`DNS_UPSTREAM_IP=1.1.1.1`。DNS 查询经代理传输；解析器地理位置需按部署需求独立确认。需要 AWS 东京设置时，可手动合并 [可选预设](examples/aws-tokyo.env.example)，不要把 AWS link-local DNS 用于普通 VPS。

## 仓库结构

- `compose.yaml`、`firewall/`、`config/`：参数化网络与桌面服务。
- `tools/`：配置准备、固定应用层安装、Mac 服务安装、完整性与运行验收。
- `desktop/`、`seed/`、`policies/`：版本绑定的桌面补丁、干净用户目录和浏览器策略。
- `server/`、`examples/`：服务端协议参考及可选预设。
- `validation/`、`CURRENT-ENVIRONMENT.md`：实际验证范围与最初实例的版本记录。
- `docs/`：复刻步骤、相关项目和逐步工具化路线图。

仓库不包含真实代理密钥、浏览器 Cookie、Claude 登录态、SSH 私钥或 Tailscale 节点身份。不要上传运行后的 `.env`、`config/sing-box.json` 或 `webtop-data/`。

## 相关项目与许可

[Claude-Cage](https://github.com/Lee-xeo/Claude-Cage) 是后续工作台和部署体验的参考项目；本仓库独立整理已有 Webtop 方案，目前没有引入其代码。组件来源与设计关系见 [相关项目](docs/RELATED-PROJECTS.md)。

原创工具与文档采用 [MIT](LICENSE)。第三方源码与补丁保留各自许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
