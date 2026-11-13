/* Agent Harbor, MIT: notifications for an open, authorized Webtop page. */
(() => {
  if (document.getElementById("sandbox-notifications")) return;
  const base = new URL("api/desktop-notifications/", document.baseURI);
  const key = "agent-harbor.desktop-notifications";
  let source = null;
  let reconnect = null;
  let shown = 0;
  let attentionTimer = null;
  const clientId = crypto.randomUUID();
  let windowFocused = document.hasFocus();
  function sendAttention(release = false) {
    if (!release && (!enabled() || !source || source.readyState !== EventSource.OPEN)) return;
    const active = document.visibilityState === "visible" && windowFocused;
    button.dataset.desktopAttention = String(active);
    fetch(new URL("attention", base), {
      method: "POST", credentials: "same-origin", keepalive: true,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({client: clientId, active, release}),
    }).then(response => {
      button.dataset.attentionStatus = String(response.status);
      if (!response.ok) console.warn("Desktop attention request rejected", response.status);
    }).catch(error => {
      button.dataset.attentionStatus = "unavailable";
      console.warn("Desktop attention request unavailable", error.name);
    });
  }
  let receivedCount = 0;
  let displayedCount = 0;
  const seen = new Set();
  const button = document.createElement("button");
  button.id = "sandbox-notifications";
  button.className = "allow-native-input";
  button.type = "button";
  button.textContent = "🔔 开启桌面通知";
  button.style.cssText = "position:fixed;right:16px;bottom:44px;z-index:2147483000;padding:7px 11px;border:1px solid #8b91a0;border-radius:8px;background:#20242c;color:#fff;font:13px sans-serif;cursor:pointer";
  ["pointerdown", "pointerup", "mousedown", "mouseup"].forEach(type => {
    button.addEventListener(type, event => event.stopPropagation());
  });
  const supported = window.isSecureContext && "Notification" in window;
  function enabled() {
    try { return localStorage.getItem(key) === "enabled"; } catch { return false; }
  }
  function remember(value) {
    try { localStorage.setItem(key, value); } catch { /* No persistence required. */ }
  }
  function stop(release = true) {
    clearTimeout(reconnect);
    clearInterval(attentionTimer);
    attentionTimer = null;
    if (release) sendAttention(true);
    reconnect = null;
    if (source) source.close();
    source = null;
  }
  function start() {
    stop(false);
    if (!supported || Notification.permission !== "granted" || !enabled()) return;
    button.textContent = "🔔 通知连接中…";
    attentionTimer = setInterval(sendAttention, 20000);
    const eventsUrl = new URL("events", base);
    eventsUrl.searchParams.set("client", clientId);
    source = new EventSource(eventsUrl, {withCredentials: true});
    source.addEventListener("health", event => {
      const health = JSON.parse(event.data);
      sendAttention();
      button.textContent = health.listener ? "🔔 桌面通知已开启" : "🔔 等待通知服务…";
      button.title = "点击关闭。仅在此页面保持连接时接收应用通知。";
    });
    source.addEventListener("notification", event => {
      if (Notification.permission !== "granted" || !enabled()) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (seen.has(data.id)) return;
      seen.add(data.id);
      if (seen.size > 200) seen.delete(seen.values().next().value);
      // Bound a burst independently of the server and let equivalent notices replace.
      const now = Date.now();
      if (now - shown < 500) return;
      shown = now;
      const notice = new Notification(`${data.app}: ${data.summary}`, {
        body: data.body, tag: `sandbox:${data.app}:${data.summary}`,
      });
      receivedCount += 1;
      button.dataset.received = String(receivedCount);
      button.dataset.lastVisibility = document.visibilityState;
      notice.onshow = () => {
        displayedCount += 1;
        button.dataset.displayed = String(displayedCount);
      };
      notice.onclick = () => { window.focus(); notice.close(); };
    });
    source.onerror = () => {
      button.textContent = "🔔 通知重连中…";
      if (source && source.readyState === EventSource.CLOSED) {
        reconnect = setTimeout(start, 5000);
      }
    };
  }
  button.addEventListener("click", async event => {
    event.stopPropagation();
    if (!supported) {
      button.textContent = "通知需要 HTTPS 和支持的浏览器";
      return;
    }
    if (enabled() && Notification.permission === "granted") {
      remember("disabled"); stop();
      button.textContent = "🔕 桌面通知已关闭";
      return;
    }
    try {
      const status = await fetch(new URL("status", base), {credentials:"same-origin", cache:"no-store"});
      if (!status.ok) {
        button.textContent = [401, 403].includes(status.status)
          ? "此会话没有桌面通知权限" : "通知服务尚未就绪";
        return;
      }
    } catch {
      button.textContent = "通知服务尚未连接";
      return;
    }
    const permission = Notification.permission === "default"
      ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") {
      button.textContent = "请在浏览器站点设置中允许通知";
      return;
    }
    remember("enabled"); start();
  });
  function mount() {
    document.body.appendChild(button);
    if (!supported) button.title = "请使用支持通知的浏览器，通过 HTTPS 打开桌面。";
    else if (enabled()) start();
  }
  window.addEventListener("pagehide", () => stop());
  window.addEventListener("blur", () => { windowFocused = false; button.dataset.attentionEvent = "blur"; sendAttention(); });
  window.addEventListener("focus", () => { windowFocused = true; button.dataset.attentionEvent = "focus"; sendAttention(); });
  document.addEventListener("visibilitychange", () => sendAttention());
  window.addEventListener("pageshow", () => { if (enabled()) start(); });
  window.addEventListener("storage", event => {
    if (event.key === key) enabled() ? start() : stop();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
})();
