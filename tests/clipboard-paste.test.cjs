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
      events.push([event.type, event.code, event.ctrlKey]);
    },
  };
  const body = { tagName: 'BODY' };
  const local = { id: 'user-search', tagName: 'INPUT' };
  const overlay = { id: 'overlayInput', tagName: 'TEXTAREA', focus() { document.activeElement = overlay; } };
  const document = {
    body,
    activeElement: focus === 'overlayInput' ? overlay : focus === 'body' ? body : local,
    hasFocus: () => true,
    getElementById: id => id === 'overlayInput' ? overlay : null,
  };
  const context = {
    L: { isMac: () => mac },
    window,
    document,
    KeyboardEvent: class {
      constructor(type, init) {
        Object.assign(this, init, { type });
      }
    },
    performance,
    setTimeout: () => {},
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
      target: document.activeElement,
      preventDefault() { this.prevented = true; },
      stopImmediatePropagation() { this.stopped = true; },
      ...props,
    };
    handlers.get(type)?.(event);
    return event;
  }

  return { events, fire, document, local };
}

const idle = () => new Promise(resolve => setImmediate(resolve));
const remotePaste = [['keydown', 'KeyV', true], ['keyup', 'KeyV', true]];

test('Mac Command+V forwards the full native payload before replay, even if the OS clipboard is restored', async () => {
  let finishSend;
  const deferred = new Promise(resolve => { finishSend = resolve; });
  const { fire, events } = setup({ onSend: () => deferred });
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
  await idle();
  assert.deepEqual(events, [['send', text, 'text/plain']]);
  finishSend();
  await idle();
  assert.deepEqual(events, [['send', text, 'text/plain'], ...remotePaste]);
});

test('Mac paste trusts a native paste on the desktop even without a matching keydown', async () => {
  const { fire, events } = setup();
  const text = '人工合成的长文本 😀\n'.repeat(5000) + '结尾';
  const paste = fire('paste', { clipboardData: { getData: () => text } });
  await idle();
  assert.equal(paste.prevented, true);
  assert.deepEqual(events, [
    ['send', text, 'text/plain'],
    ...remotePaste,
  ]);
});

test('explicit paste resends cached text as complete UTF-8 WebSocket frames', async () => {
  const extract = (from, to) => bundle.slice(bundle.indexOf(from), bundle.indexOf(to, bundle.indexOf(from)));
  const frames = [];
  const { sendExplicit: send } = vm.runInNewContext(
    extract('async function An(', 'var Mn=') + extract('async function vc(', 'function yc(') +
    extract('function nn(', 'function rn(') + '\n' + extract('nr=nn({', ';let o=()=>nr.readAndSend()').slice(3),
    {
      window: { clipboard_enabled: true },
      Kn: true,
      _n: true,
      u: { readyState: 1, bufferedAmount: 0, send: frame => frames.push(frame) },
      WebSocket: { OPEN: 1 },
      qn: { shouldSend: () => false, markSynced: () => {}, noteExplicit: () => {} },
      Un: { encodeBinary: async bytes => ({ result: Buffer.from(bytes).toString('base64') }) },
      Hn: 0,
      kn: 5381,
      TextEncoder,
    },
  );
  const text = '跨多个分片的测试段落 😀\n'.repeat(12000) + '完整结束';
  const skipped = [];
  await send(text, 'text/plain', (_, reason) => skipped.push(reason));
  assert.deepEqual(skipped, ['clipboardSkipUnchanged']);
  assert.deepEqual(frames, []);

  await send(text, 'text/plain', (_, reason) => assert.fail(reason), true);
  assert.equal(frames[0], 'cws,1,' + Buffer.byteLength(text));
  assert.equal(frames.at(-1), 'cwe,1');
  const chunks = frames.slice(1, -1).map(frame => {
    assert.ok(frame.startsWith('cwd,1,'));
    return Buffer.from(frame.slice('cwd,1,'.length), 'base64');
  });
  assert.equal(Buffer.concat(chunks).toString('utf8'), text);
});

test('Mac Paste can restore desktop focus from the document body', async () => {
  const { fire, events, document } = setup({ focus: 'body' });
  fire('paste', { clipboardData: { getData: () => '菜单粘贴' } });
  assert.equal(document.activeElement.id, 'overlayInput');
  document.activeElement = document.body;
  assert.equal(fire('keydown', { code: 'KeyV', metaKey: true }).stopped, true);
  assert.equal(document.activeElement.id, 'overlayInput');
  fire('paste', { clipboardData: { getData: () => '焦点恢复' } });
  await idle();
  assert.deepEqual(events, [
    ['send', '菜单粘贴', 'text/plain'], ...remotePaste,
    ['send', '焦点恢复', 'text/plain'], ...remotePaste,
  ]);
});

test('native pastes are sent in order and a focus change cancels the replay', async () => {
  let finishSend;
  const deferred = new Promise(resolve => { finishSend = resolve; });
  const { fire, events, document, local } = setup({ onSend: () => deferred });
  fire('paste', { clipboardData: { getData: () => '第一段' } });
  fire('paste', { clipboardData: { getData: () => '第二段' } });
  await idle();
  assert.deepEqual(events, [['send', '第一段', 'text/plain']]);
  finishSend();
  await idle();
  assert.deepEqual(events, [
    ['send', '第一段', 'text/plain'], ...remotePaste,
    ['send', '第二段', 'text/plain'], ...remotePaste,
  ]);

  fire('paste', { clipboardData: { getData: () => '切走之后' } });
  document.activeElement = local;
  await idle();
  assert.equal(events.length, 6);
});

test('missing or skipped native paste does not replay a paste from the old remote clipboard', async () => {
  const missing = setup();
  missing.fire('keydown', { code: 'KeyV', metaKey: true });
  await idle();
  assert.deepEqual(missing.events, []);

  const skipped = setup({ onSend: skip => skip('disconnected', 'clipboardSkipSendFailed') });
  skipped.fire('keydown', { code: 'KeyV', metaKey: true });
  skipped.fire('paste', { clipboardData: { getData: () => '完整的内容' } });
  await idle();
  assert.deepEqual(skipped.events, [['send', '完整的内容', 'text/plain']]);
});

test('real browser fields stay local and non-Mac Ctrl+V uses the previous clipboard path', async () => {
  const local = setup({ focus: 'user-search' });
  assert.equal(local.fire('keydown', { code: 'KeyV', metaKey: true }).stopped, undefined);
  assert.equal(local.fire('paste', { clipboardData: { getData: () => 'local' } }).prevented, undefined);
  const fake = setup();
  fake.fire('paste', { isTrusted: false, clipboardData: { getData: () => 'untrusted' } });
  await idle();
  assert.deepEqual(local.events, []);
  assert.deepEqual(fake.events, []);

  const linux = setup({ mac: false });
  assert.equal(linux.fire('keydown', { code: 'KeyV', ctrlKey: true }).prevented, true);
  await idle();
  assert.deepEqual(linux.events, [['async-read', '看看'], ['keydown', 'KeyV', true]]);
});
