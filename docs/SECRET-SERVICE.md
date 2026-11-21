# Claude 凭据服务与浏览器跳转

Claude 的 Linux PRoot 层默认没有 Secret Service，源机日志记录了 `safeStorage.isEncryptionAvailable=false` / `backend=basic_text`。维护时分别验证了加密凭据、外部浏览器跳转与连接器服务；钥匙串缺失不是当次 Notion 连接失败的直接结论。

## 安装与启动

出现 **No system keyring is available** 时，先退出 Claude。若尚未安装钥匙串，从 Ubuntu 宿主机的仓库根目录运行以下命令。脚本在 Claude 自己的 Debian trixie PRoot 内安装包，使用普通桌面用户和 PRoot 模拟 UID 0。宿主机里的 GNOME Keyring 属于另一套桌面会话。

```sh
sudo docker exec -u abc -i sandbox-webtop /bin/bash -s < tools/install-secret-service.sh
```

新部署的 `prepare.py` 已复制以下种子文件。若桌面目录早于钥匙串配置，先备份再补齐或合并这些文件，保留个人配置。从旧目录合并时，先补好种子文件再运行上面的安装脚本，使脚本能找到 `xdg-open` 修补。

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

## 检查钥匙串

如果重开后仍有提示，在 **Webtop 桌面终端**运行以下命令。第一个检查守护进程已安装，第二个检查当前桌面 D-Bus 能否启动它。

```sh
ROOT=/config/proot-apps/ghcr.io_linuxserver_proot-apps_claude
PROOT=/config/.local/bin/proot
test -x "$ROOT/usr/bin/gnome-keyring-daemon" && echo 'GNOME Keyring 已安装'
test -n "${DBUS_SESSION_BUS_ADDRESS:-}" && \
  "$PROOT" -R "$ROOT" /usr/bin/dbus-send --session --print-reply \
    --dest=org.freedesktop.DBus /org/freedesktop/DBus \
    org.freedesktop.DBus.StartServiceByName string:org.freedesktop.secrets uint32:0
```

- 第一条无输出时，先完成包安装。第二条如报 `ServiceUnknown`，检查两个 `.service` 文件和它们调用的 `sandbox-secret-service` 是否已合并到 `/config`。如果当前终端没有会话 D-Bus 地址，从 Webtop 的应用菜单重新打开桌面终端。
- `uint32 1` 或 `uint32 2` 表示服务已启动。要检查存取和解锁，可在同一个终端用合成值做一次写入、读回和清理。弹出对话框时，按提示设置或解锁钥匙串。

```sh
probe="agent-harbor-keyring-check-$$"
printf '%s' "$probe" | "$PROOT" -R "$ROOT" /usr/bin/secret-tool store \
  --label='Agent Harbor keyring check' agent-harbor-check "$probe" &&
  test "$("$PROOT" -R "$ROOT" /usr/bin/secret-tool lookup agent-harbor-check "$probe")" = "$probe" &&
  "$PROOT" -R "$ROOT" /usr/bin/secret-tool clear agent-harbor-check "$probe" &&
  echo '钥匙串存取通过'
```

通过后，用 `sandbox-claude-desktop` 重开 Claude。改用钥匙串后，原登录可能需要重新完成一次。再次正常退出重开，确认登录保留。完整宿主重启后的解锁仍需现场验收。见 [Anthropic 的 Linux 钥匙串排查](https://code.claude.com/docs/en/desktop-linux#your-sign-in-wont-be-saved-on-this-device)。

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
