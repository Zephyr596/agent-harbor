# 桌面恢复与 Claude 加载优化

更新：2026-11-12，Asia/Shanghai。

## Claude Desktop

启动入口保留显式本地代理、英文、X11 和软件渲染，增加 Chromium 的 `--disable-http2`，让嵌入网页使用 HTTP/1.1。TLS 及代理出口不变，不关闭证书验证，不增加容器权限。[Chromium 开关定义](https://chromium.googlesource.com/chromium/src/+/HEAD/components/network_session_configurator/common/network_switch_list.h)。

源机同一版本应用、同一代理链路的串行观测如下。冷加载时把 HTTP Cache 改名保留，保留账号、会话和 Code Cache；测试后恢复原 HTTP Cache。不是宿主机冷启动测试，也不是严格控制网络波动的 benchmark。

| 条件 | 页面 DOM 就绪 | Code 侧栏绘制 | 网络下载 |
| --- | --- | --- | --- |
| HTTP/2，无 HTTP 缓存对照 | 84.7 秒 | 94.8 秒 | 约 6.9 MB |
| HTTP/1.1，无 HTTP 缓存 | 16.4 秒 | 21.2 秒 | 约 7.3 MB |
| 最终 HTTP/1.1，恢复原缓存 | 1.1 秒 | 2.0 秒 | 命中缓存 |

HTTP/2 热缓存对照同样约 2 秒，所以不能把热缓存提速本身归因于协议修改。实际验证了 Code 新建页、已有本地会话打开；没有为验收发送模型任务。系统 keyring / safeStorage 警告仍未解决；Cookie 能保持登录不代表所有 Code 密钥均能跨重启保存。

其他网络如果无此问题，可在备份后去掉启动器的 `--disable-http2`，重新比较冷、热加载。不要为提速关闭代理、DNS 隧道或 TLS 检查。

## 固定工作区重建

`seed/home/.config/i3/config` 包含：

```i3
assign [class="^Google-chrome$"] 1
assign [class="^com[.]anthropic[.]Claude$"] 2
exec --no-startup-id /config/.local/bin/sandbox-session-restore
```

恢复脚本在 i3 登录时运行；普通 reload 不会重复执行。它等待桌面 IPC、短暂等待本地代理监听，再对已完整安装的应用执行：

- Chrome：通过 `sandbox-browser --restore-last-session` 重开到工作区 1。
- Claude Desktop：通过优化后的启动器重开到工作区 2。
- 已有窗口或相应进程时跳过；`DOWNLOADING`、缺少完成标记或可执行入口时跳过。

脚本使用锁避免并发启动；不会安装软件、修改网络或结束现有应用。日志在 `/config/.local/state/sandbox-session/restore.log`。

```bash
# 桌面终端内，只查看，不启动应用：
sandbox-session-restore --dry-run

# 补开缺失的已安装应用：
sandbox-session-restore
```

新部署由 `prepare.py` 复制这些干净文件。对已有个人 HOME，先备份，再仅复制新恢复脚本、合并上述 i3 段及 Claude 启动器；不要覆盖整个配置目录，不要在非空 HOME 重跑 prepare。

恢复范围是两个应用工作区，不包括任意窗口几何布局、未保存内容、运行中的终端进程、远程任务续跑。应用自己的历史和登录能否恢复仍由其存储机制决定。缺少窗口的空工作区会被 i3 隐藏；保留数字本身并不等于恢复应用。

## 验收边界

模板检查和状态决策测试不启动服务。本次源机维护在用户授权范围内完成了 i3 配置校验及 reload：退出 Claude 后，恢复脚本成功将其重新打开到工作区 2；Chrome 保留原进程及工作区 1；再次运行恢复脚本，两者进程均不变。模板 `make check` 及 8 项测试通过，结构化记录见 [验证结果](../validation/desktop-recovery.json)。完整宿主机再次关机开机的验收仍需下一次实际重启确认；不能把配置 reload 或脚本运行成功当作整机重启验收。
