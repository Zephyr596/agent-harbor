/* Agent Harbor, MIT: fixed desktop actions inside the native Selkies sidebar. */
(() => {
  if (document.getElementById('harbor-controls')) return;
  const base = new URL('api/desktop-controls/', document.baseURI);
  const key = 'agent-harbor.controls-sidebar-collapsed';
  const root = document.createElement('section');
  root.id = 'harbor-controls';
  root.className = 'sidebar-section allow-native-input';
  root.hidden = true;
  root.setAttribute('aria-label', 'Harbor 桌面操作');
  root.innerHTML = `
    <style>
      #harbor-controls{position:static;width:100%;max-width:100%;min-width:0;font:13px/1.5 system-ui,sans-serif;color:inherit;margin-bottom:10px;overflow:hidden}
      #harbor-controls *{box-sizing:border-box}#harbor-controls [hidden]{display:none!important}
      #harbor-controls button{font:inherit;cursor:pointer;color:inherit}
      #harbor-controls button:focus-visible,#harbor-controls summary:focus-visible{outline:2px solid #75d6be;outline-offset:-3px}
      #harbor-controls button:disabled{opacity:.45;cursor:default}
      #harbor-controls .harbor-toggle{display:flex;align-items:center;gap:8px;width:100%;text-align:left}
      #harbor-controls .harbor-mark{color:#7de0c4;font-weight:800}#harbor-controls .harbor-chevron{margin-left:auto}
      #harbor-controls .harbor-body{padding:10px;min-width:0}
      #harbor-controls .harbor-caption{opacity:.75;font-size:12px;margin:0 0 10px}
      #harbor-controls .harbor-app{border:1px solid color-mix(in srgb,currentColor 20%,transparent);border-radius:8px;padding:9px;margin-bottom:10px}
      #harbor-controls h3{font-size:13px;margin:0 0 3px}#harbor-controls .harbor-status{font-size:12px;opacity:.8;margin-bottom:10px;overflow-wrap:anywhere}
      #harbor-controls .harbor-row{display:flex;gap:8px;flex-wrap:wrap}
      #harbor-controls .harbor-action{border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:6px;background:color-mix(in srgb,currentColor 8%,transparent);padding:6px 8px}
      #harbor-controls .harbor-primary{background:#8ae5cd;color:#102d2a;border-color:#8ae5cd;font-weight:650}
      #harbor-controls .harbor-note{font-size:12px;opacity:.8;margin:10px 0 0;overflow-wrap:anywhere}
      #harbor-controls .harbor-message{font-size:12px;margin:12px 0 0;white-space:pre-wrap}
      #harbor-controls details{font-size:12px;margin-top:12px}#harbor-controls summary{cursor:pointer}
      #harbor-controls pre{max-height:160px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.5 monospace}
      #harbor-controls .harbor-confirm{padding:12px;border:1px solid #b6a072;border-radius:10px;margin-top:12px}
      #harbor-controls .harbor-confirm p{margin:0 0 10px;font-size:12px}
    </style>
    <button type="button" class="harbor-toggle sidebar-section-header" aria-expanded="false" aria-controls="harbor-body"><span class="harbor-mark" aria-hidden="true">◈</span><strong>Harbor 常用操作</strong><span class="harbor-chevron" aria-hidden="true">+</span></button>
    <div class="harbor-body" id="harbor-body">
      <p class="harbor-caption">你的远程工作台 · 常用操作一处打开</p>
      <div class="harbor-app"><h3>Claude Desktop</h3><div class="harbor-status" data-status="claude">正在连接桌面…</div><div class="harbor-row">
        <button type="button" class="harbor-action harbor-primary" data-action="open-claude" disabled>打开 Claude</button>
        <button type="button" class="harbor-action" data-action="install-claude" hidden>安装 Claude</button>
        <button type="button" class="harbor-action" data-action="update-claude" disabled>更新 Claude</button>
        <button type="button" class="harbor-action" data-action="setup-keyring" hidden>配置钥匙串</button>
      </div></div>
      <div class="harbor-app"><h3>Chrome 浏览器</h3><div class="harbor-status" data-status="chrome">正在检查安装…</div><div class="harbor-row">
        <button type="button" class="harbor-action harbor-primary" data-action="open-browser" disabled>打开浏览器</button>
        <button type="button" class="harbor-action" data-action="install-chrome" hidden>安装浏览器</button>
      </div></div>
      <div class="harbor-row"><button type="button" class="harbor-action" data-action="open-terminal" disabled>终端</button><button type="button" class="harbor-action" data-action="workspace-browser" disabled>工作区 1</button><button type="button" class="harbor-action" data-action="workspace-claude" disabled>工作区 2</button></div>
      <p class="harbor-note" data-target></p>
      <div class="harbor-confirm" hidden><p></p><div class="harbor-row"><button type="button" class="harbor-action harbor-primary" data-confirm>确认继续</button><button type="button" class="harbor-action" data-cancel>取消</button></div></div>
      <p class="harbor-message" role="status" aria-live="polite">正在连接…</p>
      <details><summary>操作日志</summary><pre data-log></pre></details>
      <details><summary>第一次使用</summary><p>先安装浏览器，再安装可选的 Claude。安装可能需要几分钟，刷新页面后可继续查看进度。</p><p>Claude 首次登录时，请在远程桌面设置非空钥匙串密码。项目放在 /config/projects，可通过 Selkies 文件管理器上传。</p><p>打开应用会切换到已有窗口。更新前请从 Claude 菜单正常退出；更新不会结束正在运行的任务。</p><p>快捷键备用：Control+Return，松开后按 d 打开菜单；按 1 / 2 切换工作区。</p></details>
    </div>`;
  const $ = selector => root.querySelector(selector);
  const toggle = $('.harbor-toggle'), body = $('#harbor-body');
  const message = $('.harbor-message'), confirmation = $('.harbor-confirm');
  const buttons = [...root.querySelectorAll('[data-action]')];
  let collapsed = true, pending = null, state = null, sending = false, timer = null;
  try { collapsed = localStorage.getItem(key) !== 'false'; } catch { /* Optional preference. */ }
  function collapse(value) {
    collapsed = value;
    root.dataset.collapsed = String(value);
    body.hidden = value;
    toggle.setAttribute('aria-expanded', String(!value));
    $('.harbor-chevron').textContent = value ? '+' : '−';
    try { localStorage.setItem(key, String(value)); } catch { /* Optional preference. */ }
  }
  function render() {
    const busy = sending || !state || state.busy;
    for (const button of buttons) button.disabled = busy || !state?.desktop_ready;
    if (!state) return;
    for (const name of ['chrome', 'claude']) {
      const app = state.apps[name];
      $(`[data-status="${name}"]`).textContent = app.installed
        ? `${app.running ? '已打开' : '已安装'}${app.version ? ' · ' + app.version : ''}`
        : app.present ? '安装未完成，请查看日志或联系管理员' : '尚未安装 · 点击下方按钮开始';
      const open = $(`[data-action="${name === 'chrome' ? 'open-browser' : 'open-claude'}"]`);
      const install = $(`[data-action="install-${name}"]`);
      open.hidden = !app.installed; install.hidden = app.installed;
      open.disabled = busy || !state.desktop_ready || app.recovery;
      if (app.recovery) $(`[data-status="${name}"]`).textContent = '更新未完成，请查看日志和备份后恢复';
      install.disabled = busy || !state.desktop_ready || app.present;
    }
    const claude = state.apps.claude;
    const update = $('[data-action="update-claude"]');
    update.hidden = !claude.installed;
    update.disabled = busy || !state.desktop_ready || claude.running || claude.recovery || !state.target_version || claude.version === state.target_version;
    update.title = claude.running ? '请先从 Claude 菜单正常退出' : '更新到仓库验证版本';
    const keyring = $('[data-action="setup-keyring"]');
    keyring.hidden = !claude.installed || state.keyring;
    keyring.disabled = busy || claude.running || claude.recovery || !state.desktop_ready;
    $('[data-target]').textContent = claude.running ? '更新前请先从 Claude 菜单正常退出应用。' : `Claude 更新目标：${state.target_version || '未配置'}（仓库验证版本）`;
    $('[data-log]').textContent = state.log || '还没有操作记录。';
    if (!pending) message.textContent = state.busy ? '操作正在执行，可收起面板或刷新页面。' : state.job?.message || (state.desktop_ready ? '桌面已连接，选择一个操作开始。' : '桌面尚未就绪，稍后自动重试。');
    $('[data-confirm]').disabled = busy || !state.desktop_ready;
  }
  async function refresh() {
    clearTimeout(timer);
    try {
      const response = await fetch(new URL('status', base), {credentials: 'same-origin', cache: 'no-store'});
      if (!response.ok) throw new Error([401, 403].includes(response.status) ? '此会话需要桌面控制权限。' : '操作服务尚未就绪。');
      state = await response.json(); render();
    } catch (error) {
      state = null; render();
      message.textContent = error.message || '暂时无法连接，正在重试。';
    }
    timer = setTimeout(refresh, state?.busy ? 2000 : 10000);
  }
  async function send(action) {
    sending = true; pending = null; confirmation.hidden = true; render();
    message.textContent = '正在提交操作…';
    try {
      const response = await fetch(new URL('action', base), {method: 'POST', credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'X-Harbor-Action': '1'}, body: JSON.stringify({action})});
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      // A lost response may already have started the operation. Never auto-retry POST.
      message.textContent = '提交未确认，请刷新状态或查看日志后再操作：' + error.message;
      sending = false;
      // Leave the message visible until the next status refresh.
      timer = setTimeout(refresh, 3000);
      return;
    }
    sending = false; await refresh();
  }
  for (const button of buttons) button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action.startsWith('install-') || action === 'setup-keyring' || action === 'update-claude') {
      pending = action; confirmation.hidden = false;
      confirmation.querySelector('p').textContent = action === 'update-claude'
        ? `更新到 ${state.target_version}：校验官方安装包，备份应用层与个人状态，再原地更新。备份包含登录凭据，仅保存在此桌面。需要足够磁盘空间；请先退出 Claude。`
        : action === 'setup-keyring' ? '在现有 Claude 应用层内安装固定版本的钥匙串组件。请先退出 Claude；不会修改宿主机。'
        : `下载仓库锁定的${action === 'install-chrome' ? '浏览器' : 'Claude 和钥匙串组件'}，使用当前代理安装。不会覆盖已有应用目录。`;
      message.textContent = '确认后开始，可在操作日志中查看进度。';
      $('[data-confirm]').focus();
    } else send(action);
  });
  $('[data-confirm]').addEventListener('click', () => { if (pending) send(pending); });
  $('[data-cancel]').addEventListener('click', () => { pending = null; confirmation.hidden = true; render(); });
  toggle.addEventListener('click', () => collapse(!collapsed));
  root.addEventListener('keydown', event => { if (event.key === 'Escape') { collapse(true); toggle.focus(); } });
  // Keep browser controls out of the remote X11 input stream.
  for (const type of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'wheel', 'keydown', 'keyup', 'keypress', 'touchstart', 'touchend']) {
    root.addEventListener(type, event => event.stopPropagation());
  }
  function mount() {
    function dock() {
      const host = document.querySelector('#dashboard-root .sidebar');
      if (host) {
        const anchor = host.querySelector(':scope > .sidebar-section:not(#harbor-controls)')
          || host.querySelector(':scope > .sidebar-footer');
        if (root.parentElement !== host || root.nextElementSibling !== anchor) host.insertBefore(root, anchor);
      }
      // Never fall back to a floating desktop overlay while React changes layouts.
      root.hidden = !host;
    }
    collapse(collapsed);
    new MutationObserver(dock).observe(document.body, {childList: true, subtree: true});
    dock();
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once: true});
  else mount();
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', () => refresh());
})();
