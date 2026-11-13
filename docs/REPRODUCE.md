# Agent Harbor 复刻指南

更新：2026-11-13。目标平台：**Ubuntu 24.04 / x86_64，Mac 作为操作端**。

这份交付包含当前环境的配置模板、最终桌面/输入补丁和干净的用户目录种子，供另一个 agent 在新主机上复刻。它不是个人桌面备份：**代理密码、浏览器 Cookie、Claude 登录态、SSH 私钥和 Tailscale 身份均未包含**。

本文中的 shell 命令均从仓库根目录执行。先读本文，再读 [源机版本记录](../CURRENT-ENVIRONMENT.md)。实际文件和镜像摘要比旧对话、旧报告及可变的 `latest` 标签更可靠。

## 1. 交付后的目标状态

| 项目 | 目标 |
| --- | --- |
| 桌面 | LinuxServer Webtop Ubuntu+i3，Selkies 远程画面 |
| 本地端口 | Ubuntu 仅发布 `127.0.0.1:3001` |
| 访问 A | Mac 用户登录后，launchd 持久 SSH 转发；打开 `https://localhost:3001/` |
| 访问 B | Ubuntu 上 Tailscale Serve 后台提供 `https://节点名.自己的-tailnet.ts.net/` |
| 访问范围 | SSH / tailnet 管理通道；**没有启用 Funnel，也不直接发布到 LAN/公网** |
| 公网出口 | 唯一允许的新建外部连接是配置的 Shadowsocks 服务器 TCP 端口 |
| DNS | 经同一代理访问配置的 TCP DNS 上游；无本地后备 |
| 桌面用户 | `abc`，默认 UID/GID 1000；禁用 sudo，启用 NoNewPrivs |
| 时区 / 语言 | `SANDBOX_TZ` 控制容器时区，默认 `Etc/UTC`；Chrome 仅 `en-US` |
| 显示 | 动态分辨率、Retina；不强制降为 1024×768 |
| 输入 | Mac 简体拼音候选框及单字提交补丁；应用 Command 操作与桌面 Control 前缀分离 |
| 应用 | PRoot Chrome；可选 Claude Desktop、Claude Code |
| 数据 | 项目内 `webtop-data/` 持久保存；配置和补丁也在项目内 |

这套桌面是**容器隔离的交互工作区**。Chrome 与 Claude Desktop 当前的上游 PRoot 入口使用 `--no-sandbox`，**Chromium 自身进程沙箱没有修好**。详细边界见第 11 节。

## 2. 访问通道与出网通道必须分开理解

```text
Mac ──SSH 持久转发──────────────────┐
                                  ▼
Mac / 其他获授权 tailnet 客户端 ── Tailscale Serve :443
                                  │  HTTPS 入口 / 管理通道
                                  ▼
                        Ubuntu 127.0.0.1:3001
                                  │ Docker 端口映射
        ┌─────────────────────────┴──────────────────────────┐
        │ 共享同一个网络命名空间                              │
        │ firewall ← singbox ← webtop / Chrome / Claude       │
        │ OUTPUT DROP    本地代理 127.0.0.1:2080              │
        └───────────────┬────────────────────────────────────┘
                        │ 只允许配置的代理 IP:端口 / TCP
                        ▼
                 配置的 Shadowsocks 服务器
                   ├── 目标网站
                   └── 配置的 TCP DNS 上游（经隧道）
```

Tailscale 用于进入桌面，**不是此方案的出口节点**。Mac 的物理位置、桌面访问链路和 Ubuntu 宿主机的其他程序不会因此都切到所选代理出口。`127.0.0.1:2080` 是容器共享命名空间里的代理，不是宿主机代理。

## 3. 文件布局与前置输入

```text
compose.yaml                       # 已改为从 .env 读取摘要固定的镜像
.env.example                       # 唯一需要复制并填写的参数文件
images.observed.json                # 源机实际运行镜像的 ID / RepoDigest
apps.lock.json                      # Chrome、Claude 的 PRoot rootfs 层摘要
firewall/                           # OUTPUT DROP 出站白名单
config/sing-box.template.json        # 代理和隧道 DNS 模板；不含真实密码
desktop/svc-de-run                  # 启动等待超时、动态分辨率补丁
desktop/ime/                        # 与固定镜像匹配的前后端补丁及两个入口
seed/home/                          # 干净 i3、启动器、Xresources、英语首选项
policies/chrome-managed.json         # 显式代理、关闭独立 DoH、限制 WebRTC UDP
tools/                              # 准备配置、安装固定应用、Mac 转发、验收
server/                             # Shadowsocks 服务端参考；需独立部署
examples/                           # 可选部署预设，例如 AWS 东京
checksums.sha256                     # 交付文件完整性清单
```

需要接手 agent 从部署者取得或确认：

1. 一台新 Ubuntu 主机及有 Docker 管理权限的**宿主管理员**。不要为了安装方便把普通 Agent 用户加入 `docker` 组或给它 sudo。
2. 所选代理服务器的**固定 IPv4、TCP 端口、Shadowsocks-2022 方法及密码**。客户端和服务端必须一致。
3. 一个有权限加入的 tailnet；Mac 和 Ubuntu 分别认证成为自己的节点。
4. Mac 到 Ubuntu 的 SSH 认证和已核验的 host key。源机使用 1Password SSH agent，复刻时可以沿用部署者已有的 SSH agent。
5. 足够磁盘容纳两个 rootfs、下载缓存和用户数据。大型应用的下载与解压空间不能只按压缩包大小估算。

源机版本见 `CURRENT-ENVIRONMENT.md`。具体机器地址和节点名已移除；新机器使用自己的 SSH 和 Tailscale 身份。

## 4. Ubuntu 干净复刻

### 4.1 安装宿主依赖

安装 Docker Engine、Docker Compose 插件、Python 3、OpenSSH Server、Tailscale。CPU 基线不需要 NVIDIA Container Toolkit；可选开发工具及 NVIDIA 原生 CDI 透传见 [开发工具与 GPU](DEVTOOLS-GPU.md)。

使用各项目官方安装说明：[Docker / Ubuntu](https://docs.docker.com/engine/install/ubuntu/)、[Tailscale / Linux](https://tailscale.com/download/linux)。已有安装不要重复替换。

```bash
sudo systemctl enable --now docker
sudo systemctl enable --now tailscaled
docker compose version
```

本方案不修改宿主时区、默认路由、Mihomo/Clash、主机 DNS 或防火墙全局策略。若主机已经加入 tailnet，保留现有 Tailscale 参数，不要无条件执行 `tailscale up --reset`。

### 4.2 放置交付目录并填写参数

将整个交付目录放在例如 `/home/<operator>/browser-sandbox`。后续 Ubuntu 命令均在该目录执行。

```bash
cd /home/<operator>/browser-sandbox
cp .env.example .env
chmod 600 .env
```

编辑 `.env`：

- `EGRESS_SERVER_IP` 必须是代理服务器的**IPv4 字面量**，避免建立隧道前还要依赖外部 DNS。
- `EGRESS_SERVER_PORT` 默认 28443，必须与服务端监听一致。
- `DNS_UPSTREAM_IP` / `DNS_UPSTREAM_PORT` 指定代理服务器能通过 TCP 访问的解析器，默认 `1.1.1.1:53`。解析流量经代理隧道，地址不要求位于宿主所在地。
- `SANDBOX_TZ` 是 IANA 时区，默认 `Etc/UTC`。它独立于代理位置，程序不会根据 GeoIP 自动猜测。
- `EXPECTED_EGRESS_IP` 可选，用来断言公开检测到的出口；代理地址和最终公网出口可能不同，空值只验证代理返回有效公网 IPv4。
- AWS 东京示例可手动合并 `examples/aws-tokyo.env.example` 的时区和 DNS 字段；非 AWS 环境不能使用其中 link-local DNS。
- `SS_PASSWORD` 是服务端现有密码；新建服务时，`2022-blake3-aes-128-gcm` 使用编码后为 Base64 的 16 字节密钥，例如在自己的终端生成 `openssl rand -base64 16`。不要把真实值写进公开交接文档。
- `SANDBOX_UID` / `SANDBOX_GID` 对应持久目录的拥有者，默认 1000。
- `FILE_MANAGER_PATH` 是浏览器文件管理根目录，默认 `/config/projects`，必须位于 `/config/` 下。文件操作和在线桌面通知见 [使用指南](FILES-NOTIFICATIONS.md)。
- 保留三个 `*_IMAGE` 摘要。不要改回 `latest` 或自动升级 Webtop。

源机原 Compose 使用可变标签；本交付将**当时实际运行的镜像摘要**固定下来。`browser-sandbox-firewall` 是本地构建镜像，不能把其本地镜像 ID 当作可从公共仓库下载的制品；它由 `firewall/Dockerfile` 重建。

### 4.3 生成配置和干净 HOME

```bash
python3 tools/prepare.py
sudo docker compose config --quiet
```

`prepare.py` 只生成代理配置、复制不含身份的种子和辅助工具；不启动服务。它验证代理/DNS IPv4、端口、IANA 时区、UID 和密钥格式；遇到非空 `webtop-data/` 会拒绝覆盖。

确认目录权限：

```bash
chmod 700 webtop-data
# 仅当文件拥有者与 .env 的 UID/GID 不一致时执行：
sudo chown -R <SANDBOX_UID>:<SANDBOX_GID> webtop-data
```

生成的 `config/sing-box.json` 和 `.env` 应保持 600。不要把整个项目目录再挂载进 Webtop，否则可能把代理凭据和运维文件暴露给桌面用户。

### 4.4 启动

```bash
sudo docker compose pull singbox webtop
sudo docker compose build firewall
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs --tail=80 firewall singbox webtop
```

firewall 先设置规则，singbox 等待 firewall 健康，Webtop 与二者共享网络命名空间。端口映射在 **firewall** 服务上，不要在 webtop 上再加一个 LAN 监听。

基础镜像会在首次初始化时把 PRoot 管理工具复制到 `/config/.local/bin`。等待桌面初始化完成：

```bash
sudo docker exec sandbox-webtop test -x /config/.local/bin/proot
sudo docker exec sandbox-webtop test -x /config/.local/bin/proot-apps
curl -kI https://127.0.0.1:3001/
```

这里只在 CLI 检查回环自签名后端时使用 `curl -k`。不要据此关闭浏览器的证书校验。

## 5. Tailscale：持久 HTTPS 入口

### 5.1 两台设备分别加入 tailnet

Ubuntu 首次加入时由管理者完成认证：

```bash
sudo tailscale up --hostname=<new-node-name>
tailscale status
```

Mac 使用已安装的 Tailscale 客户端加入同一个 tailnet。**不要复制原机器的 `/var/lib/tailscale/tailscaled.state` 或复用节点私钥来克隆身份。**

在 tailnet 管理设置里按官方流程启用 MagicDNS / HTTPS 证书和 Serve，并确认访问策略只允许应当进入这个桌面的主体。若节点已有其他 Serve 配置，先检查，避免覆盖同一个 443 路径。

### 5.2 在 Ubuntu 配置 Serve

```bash
sudo tailscale serve --bg --https=443 https+insecure://127.0.0.1:3001
tailscale serve status
tailscale serve status --json
```

使用该命令输出的节点 HTTPS URL。`--bg` 把 Serve 配置留给 tailscaled 持续提供服务，不依赖 SSH 会话；Docker 与 tailscaled 的系统服务也需要保持启用。[官方 Serve 文档](https://tailscale.com/docs/reference/tailscale-cli/serve)。

`https+insecure` 只跳过 **tailscaled 到本机回环后端** 的自签名证书校验。浏览器到 `*.ts.net` 入口仍使用正常 HTTPS 证书。Mac 是访问客户端，无需再运行一次 Serve。

**不执行 `tailscale funnel`，不把 Docker 端口改为 `0.0.0.0:3001`。** 当前方案没有设置 Webtop 的独立 Basic Auth，授权边界主要是 SSH / tailnet 访问控制及本机权限；能进入该桌面的人相当于获得这套桌面会话的操作权。[LinuxServer 访问边界说明](https://docs.linuxserver.io/selkies/user-guide/security/)。

维护命令：

```bash
systemctl is-enabled tailscaled
tailscale serve status
# 只有明确要撤销这个 443 Serve 时才执行，不会停止 Docker：
sudo tailscale serve --https=443 off
```

## 6. Mac：持久 localhost SSH 转发

这个通道直接走 Mac 到 Ubuntu 的 LAN SSH，与 Tailscale 入口独立。先确保 Ubuntu 地址固定，例如通过路由器 DHCP reservation 固定 LAN IP。

先手动建立 SSH 连接，核对 host key 并完成已有 SSH agent 授权：

```bash
ssh <operator>@<UBUNTU_LAN_IP>
```

不要使用 `StrictHostKeyChecking=no`；不要为此复制私钥或开启 agent forwarding。源机的 1Password SSH agent 仍需要用户登录并解锁/授权；launchd 不是绕过认证的机制。

在 Mac 的交付目录执行，Python 3 需已安装：

```bash
# 先查看生成文件，不安装服务：
python3 tools/install-mac-tunnel.py --target <operator>@<UBUNTU_LAN_IP> --output mac/webtop-ssh-tunnel.plist
plutil -lint mac/webtop-ssh-tunnel.plist

# 确认目标正确后，安装到当前用户 LaunchAgents 并加载：
python3 tools/install-mac-tunnel.py --target <operator>@<UBUNTU_LAN_IP> --install
```

最终参数等价于：

```bash
ssh -N -T -o BatchMode=yes -o StrictHostKeyChecking=yes \
  -o ExitOnForwardFailure=yes -o ServerAliveInterval=20 \
  -o ServerAliveCountMax=3 -o ForwardAgent=no \
  -L 127.0.0.1:3001:127.0.0.1:3001 <operator>@<UBUNTU_LAN_IP>
```

访问 `https://localhost:3001/`。后端原为自签名证书；SSH 加密不会自动让此证书成为浏览器可信证书。需要受信 HTTPS 时优先使用 Tailscale URL，或单独配置受信本机证书。

服务：`~/Library/LaunchAgents/com.example.webtop-ssh-tunnel.plist`；日志：`~/Library/Logs/WebtopTunnel/`。它在**该 Mac 用户登录后**运行，失败按 KeepAlive 重试，不是登录前的系统服务。

```bash
launchctl print gui/$(id -u)/com.example.webtop-ssh-tunnel
# 停用当前用户的转发：
launchctl bootout gui/$(id -u)/com.example.webtop-ssh-tunnel
```

工具使用通用服务标签，遇到同名已有服务会拒绝覆盖；迁移时先检查当前 LaunchAgents。

## 7. 安装浏览器和 Claude 应用

应用的二进制和 rootfs 未打包，交付包只记录源机 rootfs 层的 SHA-256。安装在 Webtop 内以普通用户运行，下载也经过配置的代理。

```bash
sudo docker exec -u abc sandbox-webtop \
  python3 /config/.local/lib/sandbox/install-proot-app.py chrome

# 可选：Claude Desktop
sudo docker exec -u abc sandbox-webtop \
  python3 /config/.local/lib/sandbox/install-proot-app.py claude
```

这个辅助程序从公开 GHCR 获取 `apps.lock.json` 中指定的层，分段下载并支持续传，合并后核对完整 SHA-256，再在暂存目录解压、验证 Bash / dpkg 包，最后发布应用目录。现有目录默认拒绝覆盖；确需修复时加 `--replace`，旧目录会改名保留。

它会安装应用图标、Chrome 策略和显式代理启动入口。不要在下载尚未完成、存在 `DOWNLOADING` 或缺少 `SHALAYER` 时启动应用。上游普通更新流程会先移除应用根再流式解压，中断时可能出现：

```text
SHALAYER: No such file or directory
proot: ... /usr/bin/bash: cannot open its interpreter (errno 2)
```

这可能是动态加载器尚未解压，不代表应当给桌面增加 root 权限。[PRoot Apps 实现](https://github.com/linuxserver/proot-apps)。如果固定层已被仓库清理，不要静默切换最新层；记录版本变化后重新验收，或使用部署者私下保存的固定制品。

### Claude Code，可选

在 Webtop 终端中使用官方安装器，先下载再运行：

```bash
mkdir -p ~/.cache/claude-install
curl -fsSL https://claude.ai/install.sh -o ~/.cache/claude-install/install.sh
# 检查来源后安装源机记录的版本；是否改 stable 由部署者决定。
bash ~/.cache/claude-install/install.sh 2.1.311
claude --version
```

登录由使用者重新完成，不迁移旧 token。需要把 HTTP/HTTPS 代理写入 Claude Code 设置时，只合并相应 `env` 字段，不能整份覆盖已有配置。源机使用 `http://127.0.0.1:2080` 和 stable 更新通道。[官方安装](https://code.claude.com/docs/en/setup)、[网络配置](https://code.claude.com/docs/en/network-config)。

### 应用入口

- 浏览器：`sandbox-browser`。
- Claude Desktop：`sandbox-claude-desktop`，带显式代理、英文、X11、`--disable-gpu` 和 `--disable-http2`。软件渲染用于源机白屏兼容；HTTP/1.1 用于缓解源机代理链路上的资源冷加载延迟，不能推导所有网络都更快。
- CLI：`claude`。它与桌面包内自带的 Claude Code 组件不是同一个安装入口。
- 启动器是 xterm + Python curses 的小菜单，**不是自动扫描所有 .desktop 的完整桌面菜单**。现有四项：浏览器、终端、运行命令、Claude Desktop。新增应用可先选第 3 项运行命令，再修改 `sandbox-app-menu.py` 加入固定入口。

Claude Desktop 的系统钥匙串在当前环境中缺失，日志显示会话持久化受限；重启后可能需要重新登录。没有用明文持久化绕过这个问题。能打开聊天界面也不表示 Cowork、虚拟机、GPU、全部 Code/宿主能力都已在 PRoot 中验收。

### 桌面工作区自动恢复

种子 i3 配置在桌面登录时运行 `sandbox-session-restore`，并按窗口 class 将 Chrome 放到工作区 1、Claude Desktop 放到工作区 2。浏览器启动时传入 `--restore-last-session`；Claude 使用自己保留的会话数据。

恢复脚本只启动完整安装、尚未运行的应用，不自动下载软件，不重启已有应用。普通 i3 `reload` 不会重跑此启动项。可以在桌面终端运行 `sandbox-session-restore --dry-run` 查看计划，或不带参数补开缺少的应用。

这是固定应用工作区的重建，不恢复未保存内容、正在执行的终端命令、后台 Agent 任务或任意自定义窗口布局。新机器上尚未安装的可选 Claude 会被跳过；安装后可以手动运行恢复脚本。现有 HOME 不要重跑 `prepare.py`；应备份后仅合并新的 i3 配置段、恢复脚本和 Claude 启动器。详情及验收范围见 [桌面恢复与加载优化](DESKTOP-RECOVERY.md)。

## 8. 显示、中文输入和快捷键

`desktop/svc-de-run` 给 X readiness 检查加了超时，并在动态尺寸模式下取消强制 1024×768。Compose 开启 resize、关闭固定手动尺寸和 CSS 降采样；不要再加 `--force-device-scale-factor=1` 来“修复”清晰度。

`.Xresources` 的 192 DPI 是源 Mac 2× Retina 的快照，Selkies 会按客户端处理显示密度。换到非 Retina 客户端时根据实际输出验收，不要把物理输出固定为某一张截图的尺寸。

IME 补丁：Mac 拼音 preedit 保留在本地，提交后只向远端发送一次完整文本；候选框锚定点击位置；X11 Unicode 提交使用已有的剪贴板注入，避免“他”等单字因临时键码丢失。补丁针对当前固定镜像和 Python 3.14 路径；升级镜像前必须重新比较，不能把旧大文件覆盖到不同版本后端上。

**干净启动检查发现的挂载修正：** 上游 `init-nginx` 每次会删除并从 `selkies-dashboard` 重建 `/usr/share/selkies/web`。直接 bind-mount `web/index.html` 或 `web/selkies-core.js` 会使删除报 `Device or resource busy`，导致 HTTPS 入口无法就绪。本包因此只挂载物理 `selkies-dashboard` 下的两个资源，让启动脚本复制补丁到 `web`；`index-web.html` 保留作快照，不直接挂载。原机正在运行的容器此前使用原地文件补丁，所以未暴露此重建问题。2026-11-13 获授权的文件/通知维护已同步删除生产 Compose 中这两个旧声明；没有重建生产容器。不能直接套用 `reference/compose.source.sanitized.yaml`。

**桌面前缀：同时按 Control+Return，松开全部按键，再按下一键。** 底栏出现 `remote` 代表模式已进入，操作完成后返回普通模式。

| 操作 | 按键 |
| --- | --- |
| 应用复制 / 粘贴 / 剪切 / 全选 / 撤销 | Command+C / V / X / A / Z，转换为对应 Linux Ctrl 操作 |
| 桌面模式入口 | 仅 Control+Return；Command+Return 留给应用 |
| 直接打开终端 | Control+Shift+Return |
| 应用菜单 | 前缀，`d`；菜单内 `1` 浏览器、`2` 终端、`3` 命令、`4` Claude Desktop |
| 打开浏览器 / 终端 | 前缀，`b` / `t` |
| 关闭当前窗口 | 前缀，`q` |
| 全屏 / 退出全屏 | 前缀，`f`；全屏时 i3 状态栏隐藏是正常行为 |
| 切换工作区 | 前缀，`1`–`9`、`0` |
| 移动窗口到工作区 | 前缀，Shift+数字 |
| 移动焦点 | 前缀，方向键 / Tab / Shift+Tab |
| 浮动 / 平铺 | 前缀，空格 |
| 取消模式 | Esc |
| xterm 复制 / 粘贴 | Control+Shift+C / V |

Ctrl+V 作为 Linux 应用原生粘贴仍可能可用，是同一动作的别名，不表示执行两次。最终补丁去掉 Command 的临时 Alt 点击，并排除 Return 的 Ctrl 转换；i3 的 Super+Return 终端绑定与 F8 备用入口已取消。**不要重新套用旧的“Command 全局等于 Control”补丁。**

## 9. 网络与 DNS：必须保留的约束

防火墙只在自己的网络命名空间配置 `OUTPUT`，没有改 Ubuntu 宿主全局规则。关键顺序：

1. IPv4 OUTPUT 默认 DROP。
2. 先拒绝 UDP/TCP 53 和 Docker DNS `127.0.0.11`，再允许回环通信。
3. 允许已有连接的响应。
4. 唯一允许的新外连是配置的代理 IP:端口的 TCP。
5. IPv6 OUTPUT DROP。

sing-box 只有 `egress` Shadowsocks outbound；DNS 使用 `proxy-dns`，通过同一 outbound 的 detour 访问配置的 TCP DNS 上游。不能把 DNS detour 改为 direct，也不能添加“断了就直连”的 fallback。上游地址可以更换，但传输路径必须继续经过代理。[sing-box TCP DNS](https://sing-box.sagernet.org/configuration/dns/server/tcp/)。

默认公共解析器与代理出口的地理定位不一定相同。“DNS 经代理”不等于“解析器必定位于指定城市”；如有地域要求，部署者需选择出口可达、位置符合需求的解析器并实测。AWS VPC 示例见下文。
Chrome 同时通过启动参数、managed policy 和英语首选项配置代理，关闭独立 DoH，限制非代理 WebRTC UDP。环境变量只能帮助会主动遵守它们的应用，不能代替防火墙。

如果换了代理服务器 IP/端口，需要同步修改 `.env`、重新生成代理配置，并重新建立共享 namespace 的整组容器。**不要只重建 firewall 后让两个 sidecar 继续使用旧 namespace。** 在维护窗口执行：

```bash
python3 tools/prepare.py --config-only
sudo docker compose down
sudo docker compose up -d --build
```

此操作会中断桌面并结束容器内应用，数据目录保留。单纯修改 sing-box 文件时保持挂载文件 inode，使用原地写入；不要在运行时通过“删除再重命名”更新单文件 bind mount。

### 代理服务端前置条件

首版只实现 Shadowsocks-2022 `2022-blake3-aes-128-gcm` / IPv4 TCP 后端。`server/sing-box.shadowsocks.example.json` 是匹配客户端的协议参考，不是完整的一键服务端部署或生产加固方案。服务端地域由部署者选择，东京不是依赖。

服务端需固定公网地址、正确监听/安全组、能访问目标网站及配置的 TCP DNS 上游。采用匹配的 sing-box 版本，使用同一密钥。可以按官方说明将其作为 systemd 或容器服务运行；不要向桌面挂载 Docker socket。

**可选 AWS 东京预设：** 实例位于 `ap-northeast-1`，DNS 可设置为 `169.254.169.253:53/TCP` 并经加密隧道访问。此 link-local 地址依赖 AWS VPC 环境，不适用于普通 VPS；确认 VPC DNS 与 TCP 可达，不要向公网开放 DNS 53。[AWS VPC DNS](https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html)。

服务端对 metadata / 其他内网目标的限制需独立配置和审核；客户端白名单不能替代服务端隔离。最初东京实例未在这次文档整理中重新审计，参考配置不代表该服务器已完成安全检查。

## 10. 验收与日常运维

先检查交付文件完整性：

```bash
python3 tools/verify.py --static
```

新主机全部部署完成后：

```bash
sudo python3 tools/verify.py
```

运行验收只读检查容器、权限、端口、防火墙、隧道 DNS 配置、代理出口、直连拦截和 Tailscale Serve，不停止任何服务、不输出密码。它会向公开的 IP 查询站发一次请求，并做一次不经代理的 TCP 连接负向测试。

还必须做真人/浏览器验收，不能只看脚本 PASS：

- 在 Tailscale URL 打开桌面；Ubuntu 的 3001 不应从 LAN 直接连通。
- Mac 调整窗口大小，清晰度及布局跟随；检查浏览器 `Intl.DateTimeFormat().resolvedOptions().timeZone` 与 `SANDBOX_TZ` 对应（UTC 别名可能规范化）、`navigator.languages` 为 `["en-US"]`。
- 在网页与 Claude 输入框用 Mac 拼音输入“他 他他 你好 他在这里”；完整、无重复，候选框位置正常。
- Control+Return 能进入模式，Command+Return 不进入；Command+V 在浏览器和 Claude 中能粘贴且不弹菜单。
- 使用可信检测站核对公网 IP 和 DNS，并与部署目标比较。DNS 公网出口地址可以与代理服务器不同，不能仅凭地址不相等判断泄漏；要结合 DNS detour、直连阻断及必要的抓包。
- 维护窗口可停止 singbox 做 fail-closed 验收：代理和直连都应失败，然后**立即恢复 singbox**。不要让验证脚本异常后把代理留在停止状态。
- 分别测试 SSH 进程退出后的 launchd 自动恢复，以及整机重启后的服务恢复。

最初交付基线已通过 Compose 配置、sing-box 客户端/服务端参考配置语法、固定应用层可取性检查，以及**全新 HOME、无外网、无宿主端口发布**的 Webtop 启动测试：i3 / Selkies 就绪、HTTPS 与四项前端资源均返回 200、最终补丁摘要一致。详见 [交付验证记录](../validation/DELIVERY-VALIDATION.md)。大型应用没有在此测试中重新完整下载，Tailscale 新节点认证也没有代替部署者执行。

源机已做过代理失效、直连公网/LAN、外部与 Docker DNS 阻断、DNS 不回退、英语与历史东京预设时区、IME 和原生键盘模式检查。**本交付未在第二台空白机器完整重放安装流程，也没有做断电启动全过程抓包。** `depends_on` 主要作用于 Compose 启动，不能仅凭 `restart: unless-stopped` 宣称所有宿主重启竞态都已经验收。

常用诊断：

```bash
sudo docker compose ps
sudo docker compose logs --tail=100 singbox webtop
sudo docker exec sandbox-firewall iptables -S OUTPUT
sudo docker exec sandbox-firewall ip6tables -S OUTPUT
tailscale serve status
```

连接后黑屏且应用仍在时，优先检查传输和日志；必要时仅重启传输服务：

```bash
sudo docker exec sandbox-webtop s6-svc -r /run/service/svc-selkies
sudo docker exec sandbox-webtop s6-svstat /run/service/svc-selkies
```

然后刷新客户端页面。它与重启整个 Webtop 容器不同；后者会结束应用。源机曾验证传输服务重启保留 Chrome / Claude / i3 等 29 个进程，但不要把这个结果当作任意故障下的保证。

## 11. 安全边界与明确未解决项

- **Chromium/Electron 进程沙箱未启用。** 外层 Docker 默认 seccomp/AppArmor、NoNewPrivs、网络隔离不能替代它。
- firewall 单独拥有 NET_ADMIN；webtop 丢弃 NET_ADMIN/NET_RAW、非 privileged、禁用 sudo。没有挂载 Docker socket、宿主 HOME 或 SSH agent；基础配置不传 GPU，可选 GPU override 会增加对应设备/驱动接口。
- `/config` 可被桌面用户读写；同一个 X11 桌面里的应用、剪贴板和浏览器登录态不是互相隔离的安全域。
- 白名单允许访问代理，代理之后的最终网站不是 allowlist；它不能阻止经允许代理进行的数据外传。
- 没有配置多租户、独立 Agent 身份授权或 root capability broker；这些不属于本次沙箱复刻。
- Tailscale Serve 不是 Webtop 内部的细粒度权限系统；控制谁能连到 443 就是在控制谁能操作桌面。
- 时区、英语和所选出口只说明配置及检测结果，不保证任意网站的 GeoIP 判断，也不把机房 IP 变成住宅 IP。
- Claude Desktop 钥匙串、完整 Chromium 沙箱、严格冷启动网络竞态及全部 Cowork/Code 能力仍需独立验收。

不得为“让它启动”而添加 privileged、SYS_ADMIN、unconfined、任意 sudo、host network 或禁用宿主安全策略。

## 12. 持久化、迁移和升级

### 干净复刻与个人数据迁移分开

本仓库用于干净复刻。源机完整 `webtop-data/` 包含 Cookie、账号、下载和应用状态，`config/sing-box.json`、`.env`、历史备份也可能包含凭据；它们只能进入部署者自己的私密备份渠道，不能提交到仓库或混入公开制品。

需要迁移同一个人的桌面时：先在维护窗口停止整组容器，备份项目目录并保留权限，私密传输到新机；恢复时核对 UID/GID、固定镜像摘要、本包中的补丁挂载集合和服务启动文件。**不要对恢复后的非空 HOME 再运行种子覆盖，也不要拿历史 Compose 整份覆盖后续配置。**

重建 Webtop 会保留 `/config`，但镜像内部临时安装的系统包未必保留。当前可迁移应用主要放在 `/config/proot-apps` 和 `/config/.local`；未来新增原生 apt 包应做成明确镜像构建或初始化步骤。

Docker 镜像、PRoot rootfs 层依赖上游制品持续可取；需要长期离线迁移时，另行私下保存这些固定制品和摘要。镜像不可取时不要直接切新版本碰运气。

Tailscale 在新机器上重新认证、重新配置 Serve；Mac LaunchAgent 用新 SSH 目标重新生成。不要复制旧节点身份，也不要把旧 LAN IP、host key 或 tailnet URL 当成新主机身份。

### 升级

先备份，单独验证新镜像的启动脚本、Selkies 路径/版本、补丁差异和网络策略，再更新摘要。特别是 `/lsiopy/lib/python3.14/...` 和整个前端 bundle 都与记录版本绑定；不能在自动升级时盲目覆盖。

## 13. 给接手 agent 的任务说明

```text
按 README 和 docs/REPRODUCE.md 在目标 Ubuntu 复刻，先核对 CURRENT-ENVIRONMENT、images.observed、apps.lock 和文件摘要。
先区分干净部署还是私密数据迁移。所有真实密钥、Tailscale 登录和 SSH 认证由部署者提供；不要从旧聊天或个人 HOME 抽取并打包凭据。
保留共享 firewall namespace、仅 loopback 发布、代理 DNS detour、NoNewPrivs、禁用 sudo，以及最终 Command/Control 分离规则。
不要运行历史诊断目录里的旧修复脚本，不要自动升级固定基础镜像，不要放宽容器或宿主权限。
先完成静态检查和基础启动，再配置 Tailscale Serve、Mac tunnel、固定应用，最后做真人输入/显示及网络失效验收。
报告实际通过与未验证项目；不能把模板生成或 docker compose config 成功当成整套复刻成功。
```

第三方源码、授权与补丁来源见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。


本项目原创工具与文档采用 [MIT](../LICENSE)；第三方补丁和源码保留各自许可。
