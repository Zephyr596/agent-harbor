/* Optional smoke test: npm-installed playwright + local Chrome, no live desktop. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1100, height: 820}});
    const failures = [], actions = [];
    page.on('pageerror', error => failures.push(error.message));
    let status = {desktop_ready: true, busy: false, keyring: true, target_version: '6.28899.2', job: null, log: '',
      apps: {claude: {installed: true, present: true, running: false, recovery: false, version: '5.1231.0'},
             chrome: {installed: true, present: true, running: false, recovery: false, version: '157.0.8103.78'}}};
    let offline = false, rejectAction = false, viewer = false;
    await page.route('http://harbor.test/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/desktop-controls.js') {
        return route.fulfill({contentType: 'application/javascript', body: fs.readFileSync(path.join(__dirname, '../desktop/notifications/controls.js'), 'utf8')});
      }
      if (url.pathname.endsWith('/status')) {
        if (offline) return route.abort('failed');
        return route.fulfill({status: viewer ? 403 : 200, json: status});
      }
      if (url.pathname.endsWith('/action')) {
        assert.equal(route.request().headers()['x-harbor-action'], '1');
        actions.push(route.request().postDataJSON());
        if (rejectAction) return route.abort('failed');
        status.job = {state: 'succeeded', message: '模拟操作完成。'};
        return route.fulfill({status: 202, json: {accepted: true}});
      }
      return route.fulfill({contentType: 'text/html', body: `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Harbor 本地交互预览</title>
        <style>body{margin:0;background:#0d1420;color:#a8b8cf;font:14px system-ui}.sidebar{box-sizing:border-box;position:fixed;inset:0 auto 0 0;width:280px;max-width:100vw;padding:18px;background:#192334;overflow:auto;transform:translateX(-100%)}.sidebar.is-open{transform:none}.sidebar-section{border:1px solid #40516b;border-radius:8px}.sidebar-section-header{padding:10px;border:0;background:transparent}.native-toggle{position:fixed;right:16px;top:16px}</style>
        <body><p style="padding:32px 320px">本地交互预览 · 模拟桌面状态</p><button class="native-toggle" onclick="document.querySelector('.sidebar').classList.toggle('is-open')">切换侧边栏</button>
        <div id="dashboard-root"><aside class="sidebar is-open"><header>Selkies</header><div class="sidebar-section">原生设置</div><footer class="sidebar-footer">通知</footer></aside></div><script src="/desktop-controls.js"></script></body></html>`});
    });
    const load = async () => {
      await page.goto('http://harbor.test/');
      await page.locator('#dashboard-root .sidebar #harbor-controls').waitFor();
      if (await page.locator('.harbor-toggle').getAttribute('aria-expanded') === 'false') await page.locator('.harbor-toggle').click();
      await page.getByText('桌面已连接，选择一个操作开始。').waitFor();
    };
    const button = name => page.getByRole('button', {name, exact: true});
    await load();
    assert.equal(await page.locator('#harbor-controls').evaluate(el => getComputedStyle(el).position), 'static');
    await button('切换侧边栏').click();
    const hiddenBounds = await page.locator('#harbor-controls').boundingBox();
    assert.ok(hiddenBounds.x + hiddenBounds.width <= 0, 'Native sidebar hides Harbor completely');
    assert.equal(await page.locator('body > #harbor-controls').count(), 0);
    await button('切换侧边栏').click();
    await page.evaluate(() => document.querySelector('#dashboard-root .sidebar').remove());
    await page.waitForFunction(() => !document.querySelector('#harbor-controls'));
    assert.equal(await page.locator('body > #harbor-controls').count(), 0);
    await page.evaluate(() => { document.querySelector('#dashboard-root').innerHTML = '<aside class="sidebar is-open"><header>Selkies</header><div class="sidebar-section">原生设置</div><footer class="sidebar-footer">通知</footer></aside>'; });
    await page.locator('#dashboard-root .sidebar #harbor-controls').waitFor();
    if (process.env.HARBOR_PREVIEW_PATH) {
      await page.locator('#harbor-controls').screenshot({path: process.env.HARBOR_PREVIEW_PATH});
    }
    const toggle = page.locator('.harbor-toggle');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await page.reload();
    await page.locator('.harbor-toggle').waitFor();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await toggle.click();
    await button('打开浏览器').click();
    await page.getByText('模拟操作完成。').waitFor();
    assert.deepEqual(actions.at(-1), {action: 'open-browser'});
    await button('更新 Claude').click();
    assert.match(await page.locator('.harbor-confirm').innerText(), /6.28899.2.*备份/s);
    await button('取消').click();
    assert.equal(actions.length, 1);
    await button('更新 Claude').click();
    await button('确认继续').click();
    await page.locator('.harbor-confirm').waitFor({state: 'hidden'});
    await page.getByText('模拟操作完成。').waitFor();
    assert.deepEqual(actions.at(-1), {action: 'update-claude'});

    status.job = null;
    status.apps.claude.running = true;
    await load();
    assert.equal(await button('更新 Claude').isDisabled(), true);
    status.apps.claude.running = false;
    status.apps.claude.recovery = true;
    await load();
    assert.equal(await button('打开 Claude').isDisabled(), true);
    assert.equal(await button('更新 Claude').isDisabled(), true);

    status.apps.claude = {installed: false, present: false, running: false};
    status.apps.chrome = {installed: false, present: false, running: false};
    status.keyring = false;
    await load();
    await button('安装 Claude').click();
    await button('确认继续').click();
    await page.getByText('模拟操作完成。').waitFor();
    assert.deepEqual(actions.at(-1), {action: 'install-claude'});
    status.job = null;
    status.apps.claude.present = true;
    await load();
    assert.equal(await button('安装 Claude').isDisabled(), true);

    status.busy = true;
    await page.reload();
    if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
    await page.getByText('操作正在执行，可收起面板或刷新页面。').waitFor();
    assert.equal(await button('终端').isDisabled(), true);
    status.busy = false;
    await load();
    rejectAction = true;
    const previous = actions.length;
    await button('终端').click();
    await page.getByText(/提交未确认/).waitFor();
    assert.equal(actions.length, previous + 1);
    rejectAction = false;

    offline = true;
    await page.reload();
    if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
    await page.getByText(/Failed to fetch|暂时无法连接/).waitFor();
    assert.equal(await button('终端').isDisabled(), true);
    offline = false; viewer = true;
    await page.reload();
    if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
    await page.getByText('此会话需要桌面控制权限。').waitFor();
    assert.equal(await button('终端').isDisabled(), true);
    viewer = false;
    await page.setViewportSize({width: 375, height: 667});
    await load();
    const bounds = await page.locator('#harbor-controls').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 375 && bounds.y >= 0);
    await toggle.focus();
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(failures, []);
    console.log('Chrome sidebar smoke passed: native close hides Harbor, no desktop overlay, React remount, collapse persistence, dispatch, confirmation, install states, recovery, busy, lost response, offline, viewer, narrow layout and Escape.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
