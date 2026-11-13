const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const code = fs.readFileSync(path.join(__dirname, '../desktop/notifications/client.js'), 'utf8');

function fixture() {
  const events = new Map(), docEvents = new Map(), requests = [], intervals = [];
  const button = {dataset:{}, style:{}, addEventListener(){}, setAttribute(){}};
  const document = {
    baseURI:'https://sandbox.example/', readyState:'complete', visibilityState:'visible',
    // Some capture/automation environments retain this value during blur.
    hasFocus:()=>true, getElementById:()=>null, createElement:()=>button,
    addEventListener:(name, fn)=>docEvents.set(name, fn), body:{appendChild(){}},
  };
  const streams = [];
  const host = {prepend(element) {element.parentElement = host;}};
  document.querySelector = () => host;
  class EventSource {
    static OPEN = 1; static CLOSED = 2;
    constructor() { this.readyState = 1; this.events = new Map(); streams.push(this); }
    addEventListener(name, fn) { this.events.set(name, fn); }
    close() { this.readyState = 2; }
  }
  class Notification { static permission = 'granted'; }
  const sandbox = {
    document, window:{isSecureContext:true, Notification, addEventListener:(name, fn)=>events.set(name, fn)},
    MutationObserver:class {observe(){}},
    EventSource, Notification, URL, crypto:{randomUUID:()=> 'test-controller-0001'},
    localStorage:{getItem:()=> 'enabled', setItem(){}},
    fetch:(url, options)=>{requests.push(JSON.parse(options.body));return Promise.resolve({ok:true,status:200});},
    setInterval:fn=>{intervals.push(fn);return intervals.length;}, clearInterval(){},
    setTimeout(){}, clearTimeout(){}, console,
  };
  vm.runInNewContext(code, sandbox);
  streams.at(-1).events.get('health')({data:JSON.stringify({listener:true})});
  return {events, docEvents, document, requests, intervals, streams, button, host};
}

test('blur remains inactive through heartbeats even when hasFocus is stale', () => {
  const f = fixture();
  assert.equal(f.requests.at(-1).active, true);
  f.events.get('blur')();
  assert.equal(f.requests.at(-1).active, false);
  f.intervals.at(-1)();
  assert.equal(f.requests.at(-1).active, false);
  f.events.get('focus')();
  assert.equal(f.requests.at(-1).active, true);
});

test('hidden pages are inactive and page close releases its lease', () => {
  const f = fixture();
  f.document.visibilityState = 'hidden';
  f.docEvents.get('visibilitychange')();
  assert.equal(f.requests.at(-1).active, false);
  f.events.get('pagehide')();
  assert.equal(f.requests.at(-1).release, true);
});

test('initial connection does not race an unnecessary release request', () => {
  const f = fixture();
  assert.equal(f.requests.some(request=>request.release), false);
  assert.equal(f.streams.length, 1);
});

// The notification control must not cover application toasts or the composer.
test('notification toggle docks inside the Selkies sidebar', () => {
  const f = fixture();
  assert.equal(f.button.parentElement, f.host);
  assert.equal(f.button.hidden, false);
  assert.match(f.button.style.cssText, /position:static/);
  assert.doesNotMatch(f.button.style.cssText, /position:fixed|z-index/);
});
