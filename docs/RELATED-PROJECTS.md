# 相关项目与来源

- [LinuxServer Webtop](https://github.com/linuxserver/docker-webtop)、[Selkies base image](https://github.com/linuxserver/docker-baseimage-selkies)：当前桌面容器及初始化基础。
- [Selkies](https://github.com/selkies-project/selkies)：远程画面与输入；本仓库携带与固定版本匹配的前后端修改。
- [LinuxServer PRoot Apps](https://github.com/linuxserver/proot-apps)：当前 Chrome / Claude Desktop 应用 rootfs 和启动机制。
- [sing-box](https://github.com/SagerNet/sing-box)：当前代理与经代理 DNS 实现。
- [Tailscale](https://tailscale.com/docs/reference/tailscale-cli/serve)：宿主上的持久私网 HTTPS 入口，不作为容器的公网出口。

用户在已有 Webtop 方案交接后提出 [Claude-Cage](https://github.com/Lee-xeo/Claude-Cage)，作为后续项目化的参考。它的 README 描述虚拟机工作台、网络检查、远程部署与 Tailscale 集成。可以借鉴把零散运维流程变成用户可理解工作台的方向；具体代码复用或集成需要另行比较实现、许可和边界。

Agent Harbor 的初始代码来自此前实际搭建的 Webtop 环境，目前未复制 Claude-Cage 的代码，也不宣称具备其虚拟机、手机接续、多账号或跨平台客户端能力。首次阅读参考项目：2026-11-12；该项目后续能力以其自身文档为准。

组件许可见 [第三方说明](../THIRD_PARTY_NOTICES.md)。
