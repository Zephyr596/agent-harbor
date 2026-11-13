const assert = require('node:assert/strict');
const {test} = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const bundle = fs.readFileSync(path.join(__dirname, '../desktop/ime/selkies-core.js'), 'utf8');

// Exercise the methods actually shipped to browsers, without loading a video session.
function method(name, next) {
  const start = bundle.indexOf('}' + name + '(') + 1;
  assert(start > 0);
  const end = bundle.indexOf('}' + next + '(', start) + 1;
  assert(end > start);
  return bundle.slice(start, end);
}
function fixture({mac = true, finger = false} = {}) {
  const source = [
    method('_mouseWheelWrapper', '_wheelNotches'),
    method('_addWheelNotches', '_resetWheelLearning'),
    method('_emitWheelY', '_emitWheelX'),
    method('_emitWheelX', '_pinchWheel'),
  ].join('');
  const Type = vm.runInNewContext('(class {' + source + '})', {
    performance:{now:()=>10}, L:{isMacDesktop:()=>mac},
    F:{XK_Control_L:65507, XK_Control_R:65508},
  });
  const input = new Type(), pulses = [], calls = [];
  Object.assign(input, {
    _lastWheelEventTs:0, _wheelAccumX:0, _wheelAccumY:0, _scrollMagnitude:64,
    _keysymHeld:()=>false, _isFingerScroll:()=>finger,
    _fingerScroll:e=>calls.push(['finger',e.deltaY]),
    _isDetentWheel:()=>true,
    _triggerMouseWheel:(dir,n)=>pulses.push(['y',dir,n]),
    _triggerHorizontalMouseWheel:(dir,n)=>pulses.push(['x',dir,n]),
    _pinchWheel:()=>calls.push(['pinch']),
  });
  function wheel(y, x = 0, extra = {}) {
    let prevented = false;
    input._mouseWheelWrapper({deltaMode:0,deltaY:y,deltaX:x,ctrlKey:false,
      preventDefault(){prevented = true;},...extra});
    assert(prevented);
  }
  return {input,pulses,calls,wheel};
}

test('tiny Mac integer deltas accumulate, instead of one notch per event', () => {
  const f = fixture();
  for (let i = 0; i < 100; i++) f.wheel(1);
  assert.equal(f.pulses.reduce((sum,p)=>sum+p[2],0),8);
});
test('accelerated MX Master deltas keep their relative travel and remainder', () => {
  const f = fixture();
  [12,13,103,103,205].forEach(y=>f.wheel(y));
  assert.equal(f.pulses.reduce((sum,p)=>sum+p[2],0),6);
  assert(Math.abs(f.input._wheelAccumY - 0.11) < 1e-8);
});
test('subpixel movement accumulates and diagonal touchpad noise does not jump sideways', () => {
  const f = fixture();
  for (let i = 0; i < 404; i++) f.wheel(0.25,0.01);
  assert.equal(f.pulses.reduce((sum,p)=>sum+p[2],0),8);
  assert(f.pulses.every(p=>p[0] === 'y'));
});
test('reversing direction cancels the previous fractional movement', () => {
  const f = fixture();
  f.wheel(3); f.wheel(-6); f.wheel(-6);
  assert.deepEqual(f.pulses, [['y','up',1]]);
});
test('pinch zoom remains separate and a supported finger-scroll path is preserved', () => {
  const f = fixture({finger:true});
  f.wheel(-4); f.wheel(5,0,{ctrlKey:true});
  assert.deepEqual(f.calls, [['finger',-4],['pinch']]);
  assert.deepEqual(f.pulses, []);
});
test('non-Mac detent wheels retain the upstream path', () => {
  const f = fixture({mac:false}); f.wheel(4);
  assert.deepEqual(f.pulses, [['y','down',1]]);
});

test('a slow MX Master step and a short gentle trackpad stroke respond promptly', () => {
  const mouse = fixture(); mouse.wheel(12);
  assert.deepEqual(mouse.pulses, [['y','down',1]]);
  const trackpad = fixture(); [4,4,4].forEach(y=>trackpad.wheel(y));
  assert.deepEqual(trackpad.pulses, [['y','down',1]]);
});
test('fast scrolling retains the previous high-speed distance scale', () => {
  const f = fixture(); [100,205,505].forEach(y=>f.wheel(y));
  assert.equal(f.pulses.reduce((sum,p)=>sum+p[2],0),8);
  assert(Math.abs(f.input._wheelAccumY - 0.1) < 1e-8);
});
