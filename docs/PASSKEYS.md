# 远程浏览器的 Passkey

Selkies 传送桌面画面和输入；当前交付没有把 Mac 的 Touch ID、iCloud 钥匙串、USB 安全密钥或 WebAuthn 请求转发给远程 Chrome。Tailscale 和代理出口也不提供这些硬件能力。Claude 使用的 GNOME Secret Service 是另一项凭据服务，不会自动同步个人 Passkey。

## 1Password 路径

如果目标网站的 Passkey 已存在于 1Password，可在**沙盒里的 Chrome**安装 [官方扩展](https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa)，扩展 ID 为 `aeblfdkhhhdcdjpifhhbdiojplfjncoa`。登录完成并解锁后，从 Google 等网站的 Passkey 登录流程选择 1Password 提供的项目。该路径不需要手机蓝牙扫码。[官方使用说明](https://support.1password.com/save-use-passkeys/)。

安装与登录必须由部署者授权：扩展具有读取/修改网站数据等权限，账号下可访问的保险库数据会进入这个浏览器配置。账号登录、Secret Key、解锁和真实网站的身份验证由用户自己完成，不通过聊天索取，也不从 Mac 导出。不要把浏览器保险库数据、账号配置或凭据加入公开复刻制品。

扩展及其个人状态随 `webtop-data/.config/google-chrome/` 持久保存；它们不属于 Git 中的干净种子。新机器需重新安装官方扩展并认证，不应复制他人的保险库状态。不能把“Mac 上安装了 1Password”视为“远程 Chrome 已配置 1Password”。

## 手机扫码路径

手机跨设备 Passkey 使用蓝牙验证近距离；手机要靠近**运行远程 Chrome 的 Ubuntu 主机**，靠近 Mac 并不等价。[Google 官方说明](https://developers.google.com/identity/passkeys/use-cases)。即使浏览器显示二维码，也不表示这条链路已经具备蓝牙条件。

当前 Compose 没有传入宿主系统 DBus 或蓝牙设备。2026-11-14 源机只读检查确认：宿主存在 `hci0`、Bluetooth 服务 active，但 `Powered: no`；远程 Chrome 的 `chrome://bluetooth-internals` 显示 `Present=false`。没有为此开启蓝牙、添加容器特权或挂载整个宿主系统总线。蓝牙接入需要单独设计权限边界，并用真实手机验收；目前不是已实现能力。

## 当前验证范围

2026-11-14：部署者审阅 Chrome 权限窗口后批准安装官方 1Password 扩展，已确认版本 `8.12.44.33` 存在于持久浏览器配置，并打开账号登录页。账号认证及真实 Google Passkey 登录尚待用户完成，不能把扩展安装成功当成登录验收通过。
