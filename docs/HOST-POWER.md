# 笔记本宿主机的合盖策略

Ubuntu 宿主机进入挂起时，Docker 桌面和 Tailscale 管理通道会一起暂停。Serve 持久配置不能让已挂起的机器继续提供服务。这项可选配置让笔记本接电合盖时继续运行，使用电池时保留正常合盖挂起；不需要进入 Windows。

## 显式启用

在 Ubuntu 宿主机的仓库根目录执行。先确认正在操作宿主机，而非 Webtop 容器：

```sh
hostname
pwd
systemd-analyze cat-config systemd/logind.conf
systemd-inhibit --list --no-pager
```

检查现有 drop-in，备份任何同名文件，并确认没有更晚加载的配置覆盖它。桌面电源管理器如果持有 `handle-lid-switch` inhibitor，会自行接管合盖处理，此时需要检查该桌面管理器的策略。

```sh
sudo install -o root -g root -m 0644 -D examples/logind-ac-lid.conf \
  /etc/systemd/logind.conf.d/90-agent-harbor-lid.conf
# 在确认 CanReload=yes 的系统上热重载，无需重启桌面或容器。
systemctl show systemd-logind.service -p CanReload
sudo systemctl reload systemd-logind.service
```

`HandleLidSwitch=suspend` 是一般合盖动作，`HandleLidSwitchExternalPower=ignore` 是接电例外。没有改动电源键、低电量保护、空闲挂起或底座/外接多显示器策略；后者仍由系统的 `HandleLidSwitchDocked` 决定。接电运行时保持散热通畅。

## 验收与回滚

检查服务实际加载的值，而不只查看磁盘文件：

```sh
busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
  org.freedesktop.login1.Manager HandleLidSwitch
busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
  org.freedesktop.login1.Manager HandleLidSwitchExternalPower
busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
  org.freedesktop.login1.Manager OnExternalPower
journalctl -u systemd-logind.service --since '5 minutes ago' --no-pager
```

预期前两项分别为 `s "suspend"`、`s "ignore"`。物理验收需保持接电，合盖后从另一台设备检查 SSH 和 Tailscale HTTPS，再开盖检查日志；不要在有任务运行时测试电池合盖挂起。

若安装前没有同名 drop-in，可仅删除此文件再重载以撤销；若原来有同名文件，恢复备份后重载。不要修改或删除其他电源配置。

```sh
sudo rm /etc/systemd/logind.conf.d/90-agent-harbor-lid.conf
sudo systemctl reload systemd-logind.service
```

## 源机记录（2026-11-17）

Ubuntu 24.04 / systemd 255 的日志显示 00:07:17 合盖后挂起，10:31:52 开盖后恢复。这次维护由用户明确授权，新增 root:root / 0644 的独立 drop-in，并成功热重载。DBus 实际值已验证为 `suspend` / `ignore`，接电状态为 true；logind PID 保持不变，Tailscale HTTPS 返回 200。未重启主机、容器或应用；配置后的真实合盖、电池模式及整机重启尚未验收。

参考：[systemd logind.conf](https://www.freedesktop.org/software/systemd/man/latest/logind.conf.html#HandleLidSwitchExternalPower=)。该配置不由 `prepare.py` 或 Compose 自动安装。
