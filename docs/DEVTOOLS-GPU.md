# 持久开发工具与可选 NVIDIA GPU

更新：2026-11-13。已在原实例的 Ubuntu 24.04 宿主、Docker 29 / Compose 5、RTX 4060 Laptop 上验证。GPU 是可选功能，基础 Compose 保持不传 GPU；CPU 实例不需要 NVIDIA 工具包。

## 两层环境

Webtop 基础镜像是 Ubuntu 26.04，`/lsiopy/bin/python3` 属于桌面服务的 Python 3.14 环境。Claude Desktop 的 PRoot rootfs 是 Debian 13，拥有另一套 `/usr/bin` 和包数据库。因此，在外层找到 Python 并不意味着 Claude 的命令工具能找到它。

用户工具装入持久的 `/config/.local/share/sandbox-devtools/`，入口位于 `/config/.local/bin`；安装时可额外把入口放入指定 PRoot 的 `/usr/local/bin`，兼容不读取交互 shell 配置的子进程。Python 入口用 shell 启动器执行虚拟环境中的绝对路径，避免 PRoot 下外部符号链接丢失 `pyvenv.cfg` 查找位置。保留系统 Python，避免破坏 Selkies、D-Bus 和通知桥。

当前锁定：Python 3.12.16、uv 0.13.8、pip 26.3、Node 26.13.1（含 npm/npx）、pypdf 7.0.1。`devtools.lock.json` 记录 uv / Node / wheel 的官方下载地址和 SHA-256；Python 下载使用固定 uv 版本内置的发行版 URL / 校验信息。不是自动追踪 latest 的安装器。

## 安装用户工具

以下命令从**宿主仓库根目录**执行。工具下载发生在现有 Webtop 中，使用现有代理及出站策略；不需要给桌面用户 sudo。

```bash
sudo docker exec -u abc sandbox-webtop mkdir -p /config/.local/share/agent-harbor
sudo docker cp tools/install-devtools.py sandbox-webtop:/config/.local/share/agent-harbor/
sudo docker cp devtools.lock.json sandbox-webtop:/config/.local/share/agent-harbor/
sudo docker cp tools/check-gpu.py sandbox-webtop:/config/.local/share/agent-harbor/
sudo docker cp tools/install-guest-tools.sh sandbox-webtop:/config/.local/share/agent-harbor/
sudo docker exec -u abc sandbox-webtop /usr/bin/python3 \
  /config/.local/share/agent-harbor/install-devtools.py \
  --guest-root /config/proot-apps/ghcr.io_linuxserver_proot-apps_claude
```

未安装 Claude 时省略 `--guest-root`，安装完成后再补跑。脚本拒绝覆盖已有的其他工具入口；遇到冲突先检查，不要强行删除。相同版本可重复运行。

终端可执行：

```bash
. /config/.local/share/sandbox-devtools/env.sh
python3 --version
python3 -m pip --version
uv --version
node --version
```

Claude 启动器也会加载此环境文件。安装后重启 Claude，让新子进程继承环境；不要通过发送模型任务来完成软件安装验证。Node 启动器设置 `NODE_USE_ENV_PROXY=1`，让支持它的 Node HTTP 客户端使用现有 `HTTP_PROXY` / `HTTPS_PROXY`；自定义 socket、第三方自行创建的网络代理仍需各自配置，防火墙不会因此放宽。[Node 官方说明](https://nodejs.org/api/cli.html#node_use_env_proxy1)

pypdf 用于纯 Python PDF 读取；SQLite 已随该 Python 的标准库提供。项目依赖应装到项目自己的 `.venv`，不要把它们堆入共享工具环境。

## Debian PRoot 的命令行文件工具

```bash
sudo docker exec -u abc sandbox-webtop /bin/bash \
  /config/.local/share/agent-harbor/install-guest-tools.sh
```

安装 sqlite3、unzip、poppler-utils（含 pdftotext），使用 Debian 签名索引及记录的包版本。脚本只接受 Debian trixie 根目录；旧包版本在镜像站不可用时，应核对 Debian 更新后有意调整版本，不能关闭签名验证。

`proot -0` 只在用户拥有的 rootfs 中模拟 UID 0，让 dpkg 写入它的文件与数据库。实际进程仍是容器普通用户；没有给予 sudo、Docker socket 或宿主 root。增量包安装也持久化在 `/config/proot-apps/`，但重装/升级 PRoot 应用层可能覆盖这些增量，需要重新运行两项安装工具。`apps.lock.json` 固定的是上游原始层，不包含这些可变增量。

## NVIDIA 宿主准备

已有 NVIDIA 驱动时先用宿主 `nvidia-smi` 验证，不要为此替换驱动。按 [NVIDIA 官方安装指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)配置其签名软件源，然后只安装 CDI 所需的基础包：

```bash
sudo apt-get install --no-install-recommends nvidia-container-toolkit-base=1.20.1-1
sudo systemctl enable --now nvidia-cdi-refresh.path
sudo systemctl restart nvidia-cdi-refresh.service
nvidia-ctk cdi list
docker info --format '{{json .CDISpecDirs}}'
```

原实例采用 Docker 29 原生 CDI，未更改 Docker daemon 配置或重启 daemon。必须先确认目标 Docker 能读取 CDI，不能把本实例的版本验证直接推广到更早版本。

NVIDIA 的 refresh 服务在驱动/工具包变化和开机时重新生成 `/var/run/cdi/nvidia.yaml`；不要复制旧主机生成的这个文件作为迁移配置。原生 CDI 使用基础包即可，不需要混用 legacy OCI hook 或 `NVIDIA_VISIBLE_DEVICES`。[NVIDIA CDI 文档](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html)

## 启用与持久化

```bash
# 不覆盖已有 override；已有文件应人工合并 devices 配置。
test ! -e compose.override.yaml && cp compose.gpu.yaml compose.override.yaml
sudo docker compose config --quiet
# 会中断桌面；先保存工作。只重建 Webtop，保留代理和防火墙容器。
sudo docker compose up -d --no-deps --force-recreate webtop
```

`compose.override.yaml` 会由默认的 `docker compose` 自动加载，后续无需每次手写额外命令。也可始终使用 `-f compose.yaml -f compose.gpu.yaml`；该方式的每次操作都必须包含两份文件。不要将运行实例自己的 override 或 `.env` 提交进公共仓库。

默认 `GPU_DEVICE=nvidia.com/gpu=all`；可在 `.env` 中选择 `nvidia.com/gpu=0` 或本机 CDI 清单中的特定设备名。[Compose 的 CDI devices 语法](https://docs.docker.com/reference/compose-file/services/#devices)

基础出站 namespace、loopback 入口、NoNewPrivs、禁用 sudo 保持不变。GPU 透传会增加可访问的设备和驱动接口；它是新增硬件能力，不是 Chromium 进程沙箱的修复。没有使用 privileged、SYS_ADMIN、host network、unconfined 或 Docker socket。

## 验收与恢复

```bash
sudo docker exec -u abc sandbox-webtop nvidia-smi
sudo docker exec -u abc sandbox-webtop /config/.local/bin/python3 \
  /config/.local/share/agent-harbor/check-gpu.py
```

测试直接使用 CUDA Driver API，编译并运行一个写入 42 的 PTX 内核，再把值读回 CPU。只看到设备名称不足以证明计算可用。验证不安装完整 CUDA SDK、PyTorch 或本地模型；这些依赖应按具体项目单独选择兼容版本。

记录的 PRoot Apps 0.5.10 自带 NVIDIA 库、SONAME 和 nvidia-smi 转发。外层有 GPU 后，重新启动的应用才能获取这些绑定。原实例还用与该管理器相同的绑定逻辑在 Debian PRoot 中通过了相同内核测试。应用自己的嵌套容器或虚拟机不在此验证范围内。Claude 的 `--disable-gpu` 软件渲染参数继续保留，它与命令行 CUDA 计算是不同路径。

GPU 启用后基础镜像会自动探测 DRI/NVENC；这是上游行为，也需要检查客户端画面及动态分辨率。首次生产重建暴露了 PulseAudio 偶发启动挂起：现在用户身份的启动监控会在健康检查超时后让 s6 重启音频进程，Selkies 的音频探测与 sink 创建也有超时，避免阻塞桌面。`PULSE_SERVER=unix:/defaults/native` 固定容器内部音频端点。未确定最初挂起的底层原因，不把这个恢复措施描述为根因修复。

撤销 GPU 时，从运行实例的 override 中移除 `devices`（保留其其他设置），再仅重建 Webtop。`/config` 内工具、项目和应用数据会保留。宿主重启后的全流程验收仍需部署者安排；目前实际验证包括临时容器、正式容器重建及 PRoot 计算，没有重启物理宿主。
