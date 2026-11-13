# macOS 连续滚动映射

2026-11-13 的实体设备采样发现：MX Master 3S 和 Mac 触控板通过 Chrome 都会产生整数形式的 `deltaMode=0` 像素滚动。触控板采样约每 8 ms 一次，距离包含 4、15、50 px 等；MX Master 包含 12、103、205 px 等。整数不代表机械滚轮的一格。

原 Selkies bundle 的 `_isDetentWheel` 会把这些事件逐个转换成一整格，丢失速度、减速和距离差异；触控板 1 px 的横向偏移也会变成整格横滚。

本包在 `_mouseWheelWrapper` 的 pinch 检查后、detent 检查前，为 Mac 像素事件增加独立路径：支持服务端 finger scroll 时沿用该通道，否则通过 `_addWheelNotches(deltaY / 100, deltaX / 100)` 累积距离。100 CSS px 转换成一格是本包的 X11 折中映射，沿用上游连续滚动路径的比例。余量留到后续事件，同轴反向时清除旧方向余量；不把每次事件强行放大为一格，也不使用最小采样值重新学习速度。Ctrl+触控板缩放、非 Mac 与非像素滚轮保留原路径。

修改位于 `desktop/ime/selkies-core.js`；两个 HTML 快照中的 `scrollfix=macpixels1` 使刷新后重新加载 bundle。`tests/wheel-input.test.cjs` 从交付的 bundle 提取真实方法，检查距离、加速、小数、横向偏移、反向、缩放与旧路径。

这项修复减少异常跳跃，**不提供 X11 的像素级滚动注入**。当前后端最终仍注入 XTest 4/5/6/7 按钮，动画平滑度还依赖远端应用、编码与网络。要实现端到端触控板精细滚动，需要另行验证支持 finger-scroll 的 Wayland 桌面，不能仅给当前 i3 会话打开一个开关。

部署时先备份，保留现有 IME/快捷键/通知补丁，并核对 bundle 版本。宿主机持久的 `desktop/ime` 文件需要原地更新以保留 bind mount 的 inode；同时同步已运行容器的 `/usr/share/selkies/web/` 副本。只刷新本机 Webtop 页面即可，无需重启桌面或结束 Claude。回退时恢复备份并再次刷新。
