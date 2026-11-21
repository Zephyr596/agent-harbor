const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const bundle = fs.readFileSync(require.resolve('../desktop/ime/selkies-core.js'), 'utf8');
const start = bundle.indexOf('function fn({');
const end = bundle.indexOf('function pn(){', start);

function setup({ mac = true, focus = 'overlayInput', onSend } = {}) {
  const handlers = new Map();
  const events = [];
  const window = {
    addEventListener(type, handler) {
      handlers.set(type, handler);
    },
    dispatchEvent(event) {
      events.push([event.type, event.code]);
    },
  };
  let now = 0;
  const timers = [];
  const context = {
    L: { isMac: () => mac },
    window,
    document: { activeElement: { id: focus, tagName: 'INPUT' } },
    KeyboardEvent: class {
      constructor(type, init) {
        Object.assign(this, init, { type });
      }
    },
    performance: { now: () => now },
    setTimeout: (fn, delay) => timers.push({ fn, at: now + delay }),
  };
  const makeHandler = vm.runInNewContext('(' + bundle.slice(start, end) + ')', context);
  makeHandler({
    isChromium: true,
    canSync: () => true,
    canRead: () => true,
    binaryEnabled: () => false,
    getSendInFlight: () => null,
    readLocalClipboard: async () => events.push(['async-read', '看看']),
    sendNativeClipboard: async (text, mime, onSkip) => {
      events.push(['send', text, mime]);
      await onSend?.(onSkip);
    },
  }).wire();

  function fire(type, props) {
    const event = {
      type,
      isTrusted: true,
      preventDefault() { this.prevented = true; },
      stopImmediatePropagation() { this.stopped = true; },
      ...props,
    };
    handlers.get(type)?.(event);
    return event;
  }

  async function runNextTimer() {
    timers.sort((a, b) => a.at - b.at);
    const next = timers.shift();
    now = next.at;
    next.fn();
    await new Promise(resolve => setImmediate(resolve));
  }

  return { events, fire, runNextTimer };
}

test('Mac Command+V forwards the full native payload before replay, even if the OS clipboard is restored', async () => {
  let finishSend;
  const deferred = new Promise(resolve => { finishSend = resolve; });
  const { fire, runNextTimer, events } = setup({ onSend: () => deferred });
  const text = '段落 😀 中文\n'.repeat(600) + '结束';
  let clipboard = text;
  const chord = fire('keydown', { code: 'KeyV', metaKey: true });
  assert.equal(chord.stopped, true);
  assert.equal(chord.prevented, undefined);
  const paste = fire('paste', { clipboardData: { getData: () => clipboard } });
  clipboard = '看看';
  assert.equal(paste.prevented, true);
  fire('keyup', { code: 'KeyV', metaKey: true });
  fire('keyup', { code: 'MetaLeft' });
  await runNextTimer();
  assert.deepEqual(events, [['send', text, 'text/plain']]);
  finishSend();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(events, [
    ['send', text, 'text/plain'],
    ['keydown', 'KeyV'],
    ['keyup', 'KeyV'],
    ['keyup', 'MetaLeft'],
  ]);
});

test('missing or skipped native paste does not replay a paste from the old remote clipboard', async () => {
  const missing = setup();
  missing.fire('keydown', { code: 'KeyV', metaKey: true });
  for (let i = 0; i < 19; i++) await missing.runNextTimer();
  assert.deepEqual(missing.events, []);

  const skipped = setup({ onSend: skip => skip('disconnected', 'clipboardSkipSendFailed') });
  skipped.fire('keydown', { code: 'KeyV', metaKey: true });
  skipped.fire('paste', { clipboardData: { getData: () => '完整的内容' } });
  await skipped.runNextTimer();
  assert.deepEqual(skipped.events, [['send', '完整的内容', 'text/plain']]);
});

test('real browser fields stay local and non-Mac Ctrl+V uses the previous clipboard path', async () => {
  const local = setup({ focus: 'user-search' });
  assert.equal(local.fire('keydown', { code: 'KeyV', metaKey: true }).stopped, undefined);
  assert.equal(local.fire('paste', { clipboardData: { getData: () => 'local' } }).prevented, undefined);
  assert.deepEqual(local.events, []);

  const linux = setup({ mac: false });
  assert.equal(linux.fire('keydown', { code: 'KeyV', ctrlKey: true }).prevented, true);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(linux.events, [['async-read', '看看'], ['keydown', 'KeyV']]);
});
