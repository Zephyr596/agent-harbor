# Claude 凭据服务与浏览器跳转

Claude 的 Linux PRoot 层默认没有 Secret Service，源机日志记录了 `safeStorage.isEncryptionAvailable=false` / `backend=basic_text`。维护时分别验证了加密凭据、外部浏览器跳转与连接器服务；钥匙串缺失不是当次 Notion 连接失败的直接结论。

## 安装与启动

可选包安装脚本在普通桌面用户的可写 Debian trixie rootfs 中运行，PRoot `-0` 只模拟 UID，不赋予宿主或容器 root：

```sh
sudo docker exec -u abc -i sandbox-webtop /bin/bash -s < tools/install-secret-service.sh
```

现有 HOME 需备份后合并以下种子文件，不要重新覆盖个人配置：

- `.local/bin/sandbox-secret-service`（可执行）
- `.local/lib/sandbox-links/xdg-open`（可执行，复制到 Claude rootfs 的 `/usr/bin/xdg-open`）
- `.local/share/dbus-1/services/org.freedesktop.secrets.service`
- `.local/share/dbus-1/services/org.gnome.keyring.SystemPrompter.service`
- `.local/bin/sandbox-claude-desktop`
- `.local/share/applications/sandbox-browser.desktop`

服务由原有桌面会话 DBus 按需激活。守护进程和密码对话框都运行在普通桌面用户下的 Debian PRoot 内；没有新增监听端口或特权，也没有另起会话总线。这样仍使用原有通知总线和通知桥接。

启动器在已安装组件且具有会话 DBus 环境时选择 `--password-store=gnome-libsecret`。直接维护时应从桌面终端运行；不要复制某台机器的临时 DBus 地址。修改后需正常退出并重开 Claude。

首次存储时，由用户在远程桌面的钥匙串对话框设置**非空密码**。不能用明文后端、空密码或脚本内保存密码来跳过；后续桌面会话可能需要再次解锁。钥匙串位于持久的 `/config/.local/share/keyrings/`，应随个人备份保管，但不能提交 Git。加密后端变化可能要求 Claude / Claude Code 重新登录一次。

安装脚本针对源 rootfs 出现的 dpkg 文档/locale 重命名冲突，使用仅本次生效的路径排除，并从同版本 Debian 包恢复 copyright；没有全局修改 dpkg 策略。包版本固定，依赖仍由配置的 Debian 仓库解析，尚不是离线包镜像。

## 外部链接与回调

在**远程桌面的终端**中设置默认处理器：

```sh
xdg-settings set default-web-browser sandbox-browser.desktop
xdg-mime default sandbox-browser.desktop x-scheme-handler/http x-scheme-handler/https
xdg-mime default claude-pa.desktop x-scheme-handler/claude
```

Claude PRoot 的 `xdg-open` 通过既有应用 socket 转给外层桌面；修订的 shim 使用 Bash `printf %q` 对每个参数引用，防止 OAuth URL 的 `&`、引号被 shell 解析。该文件的上游原件保留为 `xdg-open.before-agent-harbor`，HTTP/HTTPS 再进入 `sandbox-browser`，保留代理和语言参数。OAuth 应在远程浏览器完成，回调返回远程 Claude；在 Mac 本机浏览器登录不等价于此流程。授权具体 Notion 工作区和页面的最终确认由部署者完成。

参考：[Electron safeStorage](https://github.com/electron/electron/blob/main/docs/api/safe-storage.md)、[Chromium Linux password storage](https://chromium.googlesource.com/chromium/src.git/+/master/docs/linux/password_storage.md)、[GNOME keyring daemon](https://wiki.gnome.org/Projects/GnomeKeyring/RunningDaemon)。

## 源机验收与限制（2026-11-13）

- 普通用户 Secret Service 写入、读取并清理合成值成功；用户自行设置非空密码，文件为 GNOME 加密钥匙串格式、0600。应用切换后端后重新认证一次，随后多次正常退出重开保留登录，新启动日志不再报告 safeStorage 不可用。
- 通过真实 Claude PRoot → socket → 外层 `xdg-open` → 远程 Chrome 打开测试 URL，地址栏保留完整 `?agent-harbor=link&part=two`；回归测试还覆盖引号、命令替换字符及换行参数。
- Notion 目录添加仍失败；同一账号在独立 Chrome 的官方网页入口复现同样错误，控制台明确记录 `503 POST /api/organizations/{id}/mcp/remote_servers overloaded_error`。因此当次“无法清理旧凭据”的提示不能归咎于容器或跳转。官方状态页当时正在调查 claude.ai / API / Code 服务故障；这与实测一致，但未独立证明该事件覆盖所有连接器失败。没有实际完成 Notion 授权或读取 Notion 数据。见 [Claude 官方状态](https://status.claude.com/)。
- 整机重启、新桌面总线的解锁、第二台机器全流程，以及合并后的安装脚本在全新 rootfs 的一次性执行尚未验证。已在源机逐步执行相同包安装、许可恢复及服务配置，并完成 `dpkg --audit`。
