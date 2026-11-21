# Harbor 常用操作面板

打开远程桌面后，点击 Selkies 的侧边栏把手，在原生设置列表顶部展开 **Harbor 常用操作**。Harbor 默认折叠，浏览器会记住选择；按 Esc 可折叠这一节。关闭 Selkies 侧边栏时，Harbor 一起隐藏，桌面上不保留悬浮按钮。内容随原生侧边栏滚动；若使用其他工具栏布局，先在 Selkies 布局菜单切回侧边栏。

面板提供：

| 操作 | 行为 |
| --- | --- |
| 打开 Claude / 浏览器 | 切换到已有窗口；没有窗口时用项目的代理启动器打开 |
| 安装 Claude / 浏览器 | 未安装时展示；下载并校验 `apps.lock.json` 的固定应用层，不覆盖已有目录 |
| 配置钥匙串 | 已装 Claude 缺少 keyring 时展示；调用项目的固定版本安装脚本 |
| 更新 Claude | 更新到 `claude-update.lock.json` 记录的验证版本，保留现有 PRoot 中的后装组件 |
| 终端、工作区 1 / 2 | 打开终端，或切换到浏览器 / Claude 工作区 |
| 操作日志、第一次使用 | 查看进度、错误与新手提示 |

操作通过当前桌面的控制权限执行，不需要桌面 sudo 或宿主 Docker 权限。只读 viewer 无法调用这些操作。面板独立于通知开关，无需开启浏览器通知。

## 新用户第一次使用

1. 管理员按[复刻指南](REPRODUCE.md)填写自己的代理参数，运行 `prepare.py`，启动容器并配置自己的 SSH / Tailscale 访问。面板不负责主机依赖、代理服务器或 tailnet 登录。
2. 用管理员给出的 HTTPS 桌面地址进入。打开 Selkies 侧边栏，展开 **Harbor 常用操作**，点 **安装浏览器**，确认后等待完成。下载走桌面既有代理；面板与脚本都不会建立直连后备。
3. 点 **打开浏览器**。需要 Claude 时再点 **安装 Claude**，其中包含钥匙串组件安装。首次安装仍是固定的 PRoot 基线；需要增量更新时另点 **更新 Claude**。
4. 打开 Claude，按远程桌面提示设置非空钥匙串密码，然后自行登录。退出再打开，检查登录状态。完整宿主重启后的钥匙串解锁仍待验收。
5. 项目放在 `/config/projects`；上传、下载见[文件管理器](FILES-NOTIFICATIONS.md)。面板展开状态保存在访问端浏览器，应用和项目状态保存在远程 `/config`。

大型应用下载、校验和解压可能需要较长时间。面板一次执行一个操作，刷新页面或收起面板不会主动停止后台任务。连接丢失后先查看状态与日志，不要反复点安装。已有不完整应用目录不会自动覆盖，应由管理员检查原安装器日志和暂存目录。

## Claude 更新与失败恢复

Linux 的 Claude Desktop 通过软件包更新；[官方说明](https://code.claude.com/docs/en/desktop-linux#update)不提供应用内自动更新。这里的按钮只安装仓库审核过的明确版本，不自动追踪上游最新包，不更新 Webtop 镜像或重建 rootfs。

更新前先从 Claude 菜单正常退出应用，保存任务，并为完整应用层与个人状态备份留出磁盘空间。面板不会杀进程。更新器会：

1. 下载官方 `.deb`，核对锁定大小、SHA-256、包名、版本和架构。
2. 拒绝降级、未完成的 dpkg 状态、维护脚本变化，以及需要安装/移除其他包的依赖计划。这些情况需单独维护，不能靠强制忽略依赖继续。
3. 将现有 Claude rootfs、配置、钥匙串、启动器、D-Bus 和默认浏览器配置备份到 `/config/.local/state/sandbox-backups/`。目录 0700、归档 0600；备份含账号状态，绝不能提交仓库或公开分享。
4. 在现有 PRoot 中安装增量包，检查 dpkg audit 和最终版本，保留项目代理 / 授权跳转入口。更新成功后手动打开应用，检查界面和登录状态。

进入备份阶段后会写入 `/config/.local/state/sandbox-apps/claude.updating`，项目启动器和桌面自动恢复会阻止 Claude 打开。更新失败或中断时保留该标记与备份，按钮不会自动重试。应用自身或用户绕过启动器运行二进制不受此标记约束；维护期间不要另外启动 Claude，也不要同时运行其他应用安装/升级命令。

操作日志位于 `/config/.local/state/sandbox-controls/action.log`；下一次操作会覆盖，处理故障前先私下保存。若只在下载/校验/依赖检查时失败，应用层尚未开始更新，修复网络或由管理员检查后再操作。若已开始备份或安装：

1. 管理员确认后台操作已结束、Claude 已退出。读取 `claude.updating` 中的备份路径；用 `tar -tzf <具体归档>` 检查归档完整，备份阶段磁盘耗尽产生的不完整归档不能用于恢复。
2. 在私密暂存目录解压完整归档。保留失败的 `proot-apps/ghcr.io_linuxserver_proot-apps_claude` 和 `.config/Claude`，再从暂存恢复同名目录及归档中其他路径，保留所有权与权限。不要直接把旧 rootfs 叠加解压到新 rootfs，也不要上传归档求助。
3. 检查恢复后的 `dpkg --audit`、启动器与 keyring。确认恢复完成后移除 `claude.updating`，再打开旧版本验收。若只是备份失败、尚未执行 dpkg，管理员确认原应用层未变后，可处理残缺归档并移除标记。

不做自动回滚，以免用旧个人状态覆盖用户后来保存的数据。版本记录与手工升级流程见 [Claude 更新](CLAUDE-UPDATES.md)。

## 已有部署接入

**以下命令由部署管理员在自己的 Ubuntu 仓库目录按维护窗口执行。本次仓库开发没有在现有安装上运行它们。** 先备份自己的运行数据并检查 Git 差异，不要对非空 HOME 重跑 `prepare.py`。

```sh
# 仅复制面板工具与更新锁、合并后的 Claude 启动器和恢复脚本。
# 被覆盖的旧工具另存于 webtop-data/.local/state/sandbox-controls-template-backups/。
sudo python3 tools/install-controls.py --home webtop-data
```

此工具不修改应用 rootfs、i3 配置、浏览器配置、`.env` 或访问通道。它会替换两个项目启动脚本；已有自定义逻辑时，先比较备份并合并。旧版 i3 配置仍需具备[工作区 1 / 2 分配](DESKTOP-RECOVERY.md)。

使用当前 Compose 的部署已挂载 `desktop/notifications`。若容器已存在匹配的通知初始化挂载，可由管理员仅更新前端资源并重启传输服务：

```sh
sudo docker exec sandbox-webtop python3 /opt/agent-harbor/notifications/install.py
sudo docker exec sandbox-webtop s6-svc -r /run/service/svc-selkies
sudo docker exec sandbox-webtop s6-svstat /run/service/svc-selkies
```

然后重新加载客户端页面。不要仅凭命令成功认定已接入：在浏览器检查 `desktop-controls.js` 返回 200，`api/desktop-controls/status` 对 controller 返回状态，对 viewer 拒绝访问。若初始化器报告上游摘要不匹配，应停止接入并比较固定版本，不要绕过检查。

缺少这些挂载的旧部署，应先核对当前 Compose 模板；在明确维护窗口重建 Webtop 才能应用新增挂载，这会结束容器内应用。管理地址、Tailscale 设置与 Mac 转发不需要改动。

## 验证范围

仓库自动测试覆盖操作白名单、controller / 同源限制、并发锁、操作中断检测、模板接入保留个人文件，以及更新包校验和保守依赖检查。前端另以本地模拟 API 验证按钮与状态；模拟页面不代表真实 Claude 已安装或更新。

开发时运行 `make check`。可选的真实 Chrome 交互回归使用 Playwright，不需要现有桌面：

```sh
npm install --prefix /tmp/harbor-browser-check playwright
NODE_PATH=/tmp/harbor-browser-check/node_modules node tools/check-controls-browser.cjs
```

这需要本机已安装 Chrome；测试只拦截本地模拟请求，不访问账号或部署地址。

首次开发验证仅使用本地模拟环境。2026-11-21 后续经用户明确授权，已通过固定的 Termius 会话将面板接入现有安装，仅重启 Selkies 传输服务。当前桌面页面实际显示展开的 Harbor 面板，状态 API 返回 200，并识别已运行的 Chrome、Claude 和钥匙串。核对 PID 与进程启动时间，i3、Chrome 和 Claude 主进程均保留；原有粘贴补丁也保留。

接入前已备份受影响的入口与扩展代码；没有重建容器、执行应用包升级或改变访问和出网配置。接入时发现旧部署缺少固定安装器的公开资源，`install-controls.py` 现会补齐缺少的应用锁、Chrome 策略与 Claude 桌面入口，保留已有文件。

同日按用户反馈将悬浮面板移入 Selkies 原生侧边栏设置列表顶部，并再次同步现有环境。这次仅更新前端资源和入口缓存标记，没有重启服务。在当前用户桌面页验证了 Harbor 展开及实时应用状态；关闭原生侧边栏后，Harbor 和原先的悬浮入口均不再显示。真实 Chrome 的本地回归还覆盖了原生侧边栏隐藏、React 容器重建和窄屏布局。

真实应用下载、PRoot 安装、面板触发的增量升级、登录持久性、完整重启和第二台机器端到端安装仍未在本轮验证。

本地交互与 API 观测记录见 [validation/desktop-controls.json](../validation/desktop-controls.json)。
