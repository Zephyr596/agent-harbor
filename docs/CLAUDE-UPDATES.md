# Claude Desktop 原地升级

维护已有沙盒时，优先更新现有 Debian PRoot 内的官方 `claude-desktop` 包。不要直接运行 `proot-apps update claude`：上游流程会先删除应用 rootfs，再下载新层，可能丢失后装的 Secret Service、开发工具入口和 `xdg-open` 修补。固定安装器的 `--replace` 也不是查找新版；它仍安装 `apps.lock.json` 中指定的层。

## 维护步骤

1. 从 [Anthropic stable amd64 Packages](https://downloads.claude.ai/claude-desktop/apt/stable/dists/stable/main/binary-amd64/Packages) 选择明确版本，记录 `Filename`、`Size` 和 `SHA256`。经沙盒既有代理下载对应 `.deb`，核对大小和 SHA-256 后再安装。
2. 在普通 Webtop 用户的桌面终端，用现有 PRoot 执行 `apt-get -s --no-install-recommends install /config/…/claude-desktop.deb`，检查依赖计划。比较新包的维护脚本与已装版本；出现意外系统更改时先检查原因。
3. 正常退出 Claude，确认主进程退出。私下备份完整 Claude rootfs、`/config/.config/Claude/`、`/config/.local/share/keyrings/`、启动器、DBus 激活服务和默认浏览器配置。备份含账号状态，目录应为 0700，归档应为 0600，不能提交仓库。
4. 依赖已满足时，在普通桌面用户下执行下列命令；`DEB` 必须指向刚刚校验的具体制品：

   ```sh
   ROOT=/config/proot-apps/ghcr.io_linuxserver_proot-apps_claude
   DEB=/config/path/to/verified/claude-desktop.deb
   export DEBIAN_FRONTEND=noninteractive
   /config/.local/bin/proot -0 -R "$ROOT" \
     /usr/bin/dpkg --force-confold -i "$DEB"
   /config/.local/bin/proot -R "$ROOT" /usr/bin/dpkg --audit
   /config/.local/bin/proot -R "$ROOT" \
     /usr/bin/dpkg-query -W claude-desktop
   ```

   `-0` 只在用户可写 rootfs 中模拟 UID 0；不需要向桌面提供真实 sudo、Docker socket 或宿主权限。若依赖未满足，先处理模拟安装报告的问题，不要强制忽略依赖。
5. 对比更新前后的 `usr/bin/xdg-open` 和 `/config/.local/bin/sandbox-claude-desktop`，检查钥匙串、DBus 服务与开发工具。软件包可能恢复原生 `.desktop` 文件；日常仍使用 `sandbox-claude-desktop` 的代理与钥匙串入口。
6. 在桌面会话中运行 `sandbox-claude-desktop`，确认界面、登录状态和版本。额外验收授权跳转与通知时，不自动授权连接器、不发送真实模型任务。失败则关闭新进程，恢复先前备份的 rootfs 和个人状态，再用原启动器打开。

## 版本记录

2026-11-14 对已有源机执行增量包升级：

| 项目 | 值 |
| --- | --- |
| 旧版 | 5.1231.0 |
| 新版 | 5.11492.5 / amd64 |
| 官方相对路径 | `pool/main/c/claude-desktop/claude-desktop_5.11492.5_amd64.deb` |
| SHA-256 | `b96208b207e450b740f7dbe304f6077fed80e7f3d37ddd545991c4e8201564cf` |

安装前依赖模拟仅升级一个包，没有新装或移除其他包；新旧 `postinst` 相同。已备份完整应用环境、个人配置和钥匙串。安装成功，`dpkg --audit` 无输出，授权跳转 shim 与外层启动器校验保持一致，GNOME keyring、Python、Node 入口仍在。已从新版正常打开界面，并观察到原账号保持登录。未发送模型任务；本轮未重新完成 Notion 授权、真实任务通知或 Passkey 登录验收。

`apps.lock.json` 继续描述原始 PRoot 层；增量 `.deb` 是独立版本记录，不能把其 SHA-256 写成 rootfs 层摘要。克隆仓库仍会安装基线版本，需按上述步骤另行应用增量包。没有重建 Webtop、改动出站隔离或验证完整宿主机重启。
