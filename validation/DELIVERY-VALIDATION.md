# 交付验证记录

日期：2026-11-12。验证对象：首次交付基线的复刻模板与固定镜像，不是第二台主机的完整部署。

| 检查 | 结果与范围 |
| --- | --- |
| 配置生成 | 使用文档保留地址 192.0.2.10 和公开测试密钥生成成功；非空 HOME 覆盖被拒绝；config-only 保持文件 inode |
| Python / Shell / JS | 辅助 Python 可编译；启动脚本语法通过；前端 bundle 的 ES module 语法通过 |
| Mac 转发 | 只生成测试 plist，plutil 检查通过；未安装或替换当前 Mac 的 LaunchAgent |
| Compose | 更新挂载后的部署模板通过 docker compose config --quiet；未启动另一套生产网络栈 |
| sing-box | 固定镜像在无网络的临时容器中通过客户端配置和 AWS 服务端参考配置语法检查 |
| 上游资源 | 固定 Webtop 镜像原始文件摘要已记录，补丁与对应版本绑定 |
| 应用层可取性 | Chrome / Claude 固定层均支持 Range 请求，大小与锁文件一致；只读取探测字节，没有重新安装大型应用 |
| 全新 Webtop 启动 | 独立空 HOME、network=none、无宿主端口发布；i3、Selkies 正常；HTTPS 200；核心 JS、入口 JS、CSS、manifest 均 200；补丁摘要一致；临时容器已移除 |
| 完整性 | checksums.sha256 覆盖交付文件；使用 tools/verify.py --static 检查 |
| 凭据排查 | 未包含真实代理密钥、SSH 私钥、Tailscale 节点状态、浏览器 Cookie 或 Claude 账号数据 |

机器可读结果见 [template-validation.json](template-validation.json) 和 [isolated-startup.json](isolated-startup.json)。隔离启动仅验证基础桌面和 HTTPS 资源就绪，不代表浏览器渲染、真实键盘或出网已在新节点验收。

发现并修正：直接将文件 bind-mount 到 `/usr/share/selkies/web` 会与 init-nginx 删除/重建目录冲突。部署模板仅挂载 `selkies-dashboard` 的源资源，再由 init-nginx 复制到 web。源机生产 Compose 未在此任务中改动。

尚未执行：第二台空白 Ubuntu 的完整重放、完整应用重新下载/安装、新 tailnet 节点认证、Mac 新服务实际安装、宿主冷启动竞态抓包及新节点真人验收。AWS 服务端未重新登录审计，提供的是匹配协议的参考配置。不要把这些项目报告为已通过。

## 通用化版本的验证范围

仓库版本随后把出口、TCP DNS 上游和时区改为参数。历史 JSON 保留原始记录，不能视为所有新参数组合的运行验收。新增的本地检查覆盖默认配置、AWS 预设、非空 HOME 拒绝覆盖、config-only 保持 inode，以及无效参数在写入前拒绝。`make check` 运行这些检查，不启动容器或调用外部网络。公开发布前须检查 CI 的实际结果；新出口部署仍需按复刻指南做网络验收。
