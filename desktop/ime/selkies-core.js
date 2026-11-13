(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={1:`h264`,2:`vp8`,3:`vp9`,4:`av1`,5:`h265`},t={jpeg:`jpeg`,h264enc:`h264`,"h264enc-striped":`h264`,h265enc:`h265`,vp8enc:`vp8`,vp9enc:`vp9`,av1enc:`av1`},n=t=>e[t>>4]||`h264`,r=e=>(e&15)==1,i=e=>t[e]||`h264`,a=e=>e===`h264`||e===`h265`||e===`vp9`,o=e=>e===`h264`||e===`h265`||e===`vp9`||e===`av1`,s=e=>{let t=[],n=e.length,r=-1;for(let i=0;i+2<n;i++)if(e[i]===0&&e[i+1]===0&&e[i+2]===1){if(r>=0){let n=i;for(;n>r&&e[n-1]===0;)n--;n>r&&t.push(e.subarray(r,n))}r=i+3,i+=2}return r>=0&&r<n&&t.push(e.subarray(r,n)),t},c=(e,t,n,r=!1)=>{let i=[],a=0;for(let o=t;o<e.length&&i.length<n;o++){let t=e[o];!r&&a>=2&&t===3?a=0:(a=t===0?a+1:0,i.push(t))}let o=0;return{u:e=>{let t=0;for(let n=0;n<e;n++){let e=i[o>>3],n=e===void 0?0:e>>7-(o&7)&1;t=t*2+n,o++}return t},skip:e=>{o+=e}}},l=e=>{if(!e||e.length<5)return null;let t=e=>e.toString(16).toUpperCase().padStart(2,`0`);for(let n of s(e))if(!(n[0]&128)&&(n[0]&31)==7)return n.length<4?null:`avc1.${t(n[1])}${t(n[2])}${t(n[3])}`;return null},u=e=>{if(!e||e.length<5)return null;for(let t of s(e)){if((t[0]>>1&63)!=33||t.length<16)continue;let e=c(t,2,32);e.skip(8);let n=e.u(2),r=e.u(1),i=e.u(5),a=0;for(let t=0;t<32;t++)a|=e.u(1)<<t;let o=[];for(let t=0;t<6;t++)o.push(e.u(8));let s=e.u(8);for(;o.length>1&&o[o.length-1]===0;)o.pop();let l=[``,`A`,`B`,`C`][n],u=(a>>>0).toString(16).toUpperCase(),d=o.map(e=>e.toString(16).toUpperCase()).join(`.`);return`hev1.${l}${i}.${u}.${r?`H`:`L`}${s}.${d}`}return null},d=e=>{if(!e||e.length<2)return null;let t=0;for(;t<e.length;){let n=e[t],r=n>>3&15,i=!!(n&4),a=!!(n&2),o=t+1+ +!!i,s=e.length-o;if(a){s=0;let t=0;for(;;){if(o>=e.length||t>28)return null;let n=e[o++];if(s+=(n&127)*2**t,!(n&128))break;t+=7}}if(r===1){let t=c(e,o,s,!0),n=t.u(3);t.skip(1);let r=t.u(1),i,a=0;if(r)i=t.u(5);else{let e=t.u(1),n=0,r=0;if(e){if(t.skip(64),t.u(1)){let e=0;for(;t.u(1)===0&&e<32;)e++;t.skip(e)}n=t.u(1),n&&(r=t.u(5)+1,t.skip(42))}let o=t.u(1),s=t.u(5)+1;for(let e=0;e<s;e++){t.skip(12);let s=t.u(5),c=s>7?t.u(1):0;e===0&&(i=s,a=c),n&&t.u(1)&&t.skip(r*2+1),o&&t.u(1)&&t.skip(4)}}let l=t.u(4)+1,u=t.u(4)+1;t.skip(l+u);let d;r?t.skip(3):(t.u(1)&&t.skip(7),t.skip(7),d=t.u(1),d&&t.skip(2),(t.u(1)?2:t.u(1))>0&&!t.u(1)&&t.skip(1),d&&t.skip(3)),t.skip(3);let f=t.u(1)?n===2&&t.u(1)?12:10:8;return`av01.${n}.${String(i).padStart(2,`0`)}${a?`H`:`M`}.${String(f).padStart(2,`0`)}`}t=o+s}return null},f=e=>{if(!e||e.length<1)return 0;let t=e[0];return t>>5&1|(t>>4&1)<<1},p=e=>{let t=f(e);if(t<2||!e||e.length<5)return 8;let n=c(e,0,8);return n.skip(t===3?5:4),n.u(1)||n.u(1)?10:(n.skip(26),n.u(1)?12:10)},m=(e,t,n)=>{let r=e*t,i=r*(n>0?n:60);for(let[e,t,n]of[[`10`,829440,36864],[`11`,2764800,73728],[`20`,4608e3,122880],[`21`,9216e3,245760],[`30`,20736e3,552960],[`31`,36864e3,983040],[`40`,83558400,2228224],[`41`,160432128,2228224],[`50`,311951360,8912896],[`51`,588251136,8912896],[`52`,1176502272,8912896],[`60`,1176502272,35651584],[`61`,2353004544,35651584],[`62`,4706009088,35651584]])if(i<=t&&r<=n)return e;return`62`},h=(e,t,n)=>{let r=e*t,i=r*(n>0?n:60);for(let[n,a,o,s,c]of[[8,2359296,6144,3456,70778880],[9,2359296,6144,3456,141557760],[12,8912896,8192,4352,267386880],[13,8912896,8192,4352,534773760],[14,8912896,8192,4352,1069547520],[15,8912896,8192,4352,1069547520],[16,35651584,16384,8704,1069547520],[17,35651584,16384,8704,2139095040],[18,35651584,16384,8704,4278190080],[19,35651584,16384,8704,4278190080]])if(r<=a&&e<=o&&t<=s&&i<=c)return n;return 19},g=(e,t,n)=>{let r=Math.ceil(e/16)*Math.ceil(t/16),i=r*Math.max(n>0?n:60,60);for(let[e,t,n]of[[41,8192,245760],[42,8704,522240],[50,22080,589824],[51,36864,983040],[52,36864,2073600],[60,139264,4177920],[61,139264,8355840],[62,139264,16711680]])if(r<=t&&i<=n)return e.toString(16).toUpperCase().padStart(2,`0`);return`3E`},_=(e,t,n,r,i)=>i?`avc1.${n?`F400`:`6400`}${g(e,t,r)}`:`avc1.42E01E`,ee=(e,t,n,r,i,a,o)=>{switch(e){case`h265`:return t&&u(t)||(a?`hev1.4.10.L153.9E.8`:`hev1.1.6.L153.B0`);case`vp8`:return`vp8`;case`vp9`:return`vp09.0${t?f(t):0}.${m(n,r,i)}.${String(t?p(t):8).padStart(2,`0`)}`;case`av1`:return t&&d(t)||`av01.0.${String(h(n,r,i)).padStart(2,`0`)}M.08`;default:return t&&l(t)||_(n,r,a,i,o)}},te=(e,t=!1)=>{let n=e===`vp8`;return{primaries:`bt709`,transfer:`bt709`,matrix:n?`smpte170m`:`bt709`,fullRange:!n&&!!t}},v=`AAAAAWdCwArd7ARAAAADAEAAAA8DxIngAAAAAWjOD8gAAAABZYiEOiYoDg==`,ne=e=>{let t=null,n=null;for(let r of s(e)){let e=r[0]&31;e===7&&!t?t=r:e===8&&!n&&(n=r)}if(!t||!n)return null;let r=new Uint8Array(11+t.length+n.length);return r.set([1,t[1],t[2],t[3],255,225,t.length>>8,t.length&255],0),r.set(t,8),r.set([1,n.length>>8,n.length&255],8+t.length),r.set(n,11+t.length),r},re=e=>{let t=s(e).filter(e=>{let t=e[0]&31;return t!==7&&t!==8&&t!==9}),n=0;for(let e of t)n+=4+e.length;let r=new Uint8Array(n),i=0;for(let e of t)r[i]=e.length>>>24,r[i+1]=e.length>>>16&255,r[i+2]=e.length>>>8&255,r[i+3]=e.length&255,r.set(e,i+4),i+=4+e.length;return r},ie=(e,t)=>{if(!e||!t)return!e&&!t;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0},ae={h264:`avc1.42E01E`,h265:`hev1.1.6.L93.B0`,vp8:`vp8`,vp9:`vp09.00.31.08`,av1:`av01.0.05M.08`},y={h264:`AAAAAWduAA2mzZQUH7ARAAADAAEAAAMAPA8UKZYAAAABaOvjyyLAAAABZYiEADf//vbw/gNCUJcRzeidMx+/Fbi6NDe9zgACrU8Qb7gsE2lPYBBAAAGfEd0SuCykEBAvSus=`,h264444:`AAAAAWf0AA2Q2bKCg/YCIAAAAwAgAAAHgeKFMsAAAAABaOvjxEhEAAABZYiEADf//vaH+A0Lun/9P+C6zp85f52wAAq0QAbCNhAp8AAAAwAAAwAAAwACNw==`,h265:`AAAAAUABDAH//wIgAAADAJAAAAMAAAMAPJWYCQAAAAFCAQECIAAAAwCQAAADAAADADygCggPE2WVmkkyvAWgIAAAAwAgAAADA8EAAAABRAHBcrQiQAAAASgBrwhg+Snjmyr/oamsIyBbC7MwAAADAAADAAADAAADAAADAPSA`,h265444:`AAAAAUABDAH//wQIAAADAJwIAAADAAA8lZgJAAAAAUIBAQQIAAADAJwIAAADAAA8kAFBAeJssrNJJleAtAQAAAMABAAAAwB4IAAAAAFEAcFyhgxCJAAAASgBrwhg+Snjmyr/oamsIyBbC7MwAAADAAADAAADAAADAAADAPSA`,vp9:`kkmDQgAJ+Ad7ABwSDgxJAAAYYAAAZzaRO7i1N12+muU5wAA=`,vp9444:`sSTBoQAAn4B3sAHBIODEkAABgGAAAGc2kOnpLRNlZkoaQGA=`,av1:`EgAKCwAAAAQ8/7xq+cBAMhcQAJEAhBAggIAAAgF1u6aQC9g5Dyf14A==`},b={h264:`avc1.F4001E`,h265:`hev1.4.10.L93.9E.8`,vp9:`vp09.01.10.08.03`},x=class{constructor(...e){this.items=[],this.enqueue(...e)}enqueue(...e){e.forEach(e=>this.items.push(e))}dequeue(e=1){return this.items.splice(0,e)[0]}size(){return this.items.length}isEmpty(){return this.items.length===0}toArray(){return[...this.items]}remove(e){var t=this.items.indexOf(e);this.items.splice(t,1)}find(e){return this.items.indexOf(e)!=-1}clear(){this.items.length=0}},S={websockets:`WebSockets`,webrtc:`WebRTC`,h264enc:`H.264`,h265enc:`H.265`,vp8enc:`VP8`,vp9enc:`VP9`,av1enc:`AV1`,"h264enc-striped":`H.264 (Striped)`,jpeg:`JPEG (Striped)`,cbr:`CBR (Constant Bitrate)`,crf:`CRF (Constant Quality)`,auto:`Auto`,h264:`H.264`,h265:`H.265`,vp8:`VP8`,vp9:`VP9`,av1:`AV1`,mjpeg:`MJPEG`},oe=e=>S[e]??e,se=1e4;async function ce(e,t,n){if(typeof VideoDecoder>`u`)return!1;for(let r of[void 0,`prefer-software`])try{let i={codec:e,codedWidth:t,codedHeight:n};r&&(i.hardwareAcceleration=r);let a=await Promise.race([VideoDecoder.isConfigSupported(i),new Promise(e=>setTimeout(e,se))]);if(a&&a.supported)return!0;if(a===void 0)return null}catch{}return!1}var le=null;(async()=>{let e={};for(let[t,n]of Object.entries(ae))e[t]=await ce(n,1280,720);return le=e,e})();var ue=(async()=>{if(typeof VideoDecoder>`u`)return`annexb`;let e=Uint8Array.from(atob(v),e=>e.charCodeAt(0)),t=await new Promise(t=>{let n=null,r=e=>{if(t(e),n)try{n.terminate()}catch{}},i=setTimeout(()=>r(`annexb`),5e3);try{n=new Worker(URL.createObjectURL(new Blob([`self.onmessage = async (e) => {
        let outputs = 0;
        try {
            const dec = new VideoDecoder({ output: (f) => { outputs++; f.close(); }, error: () => {} });
            dec.configure({ codec: 'avc1.42000A', codedWidth: 16, codedHeight: 16, optimizeForLatency: true });
            dec.decode(new EncodedVideoChunk({ type: 'key', timestamp: 0, data: e.data }));
            await dec.flush();
            dec.close();
        } catch (err) { /* refused: the count says so */ }
        self.postMessage(outputs > 0 ? 'annexb' : 'avcc');
    };`],{type:`text/javascript`}))),n.onmessage=e=>{clearTimeout(i),r(e.data)},n.onerror=()=>{clearTimeout(i),r(`annexb`)},n.postMessage(e.buffer,[e.buffer])}catch{clearTimeout(i),r(`annexb`)}});return de=t,t})(),de=`annexb`,fe=()=>de,pe=e=>e===`jpeg`?!0:typeof VideoDecoder>`u`?!1:le===null||le[i(e)]!==!1,me={h264enc:`video/h264`,h265enc:`video/h265`,vp8enc:`video/vp8`,vp9enc:`video/vp9`,av1enc:`video/av1`},he=e=>{let t=me[e];if(!t)return!1;try{let e=RTCRtpReceiver.getCapabilities(`video`);return!e||!Array.isArray(e.codecs)||e.codecs.some(e=>typeof e.mimeType==`string`&&e.mimeType.toLowerCase()===t)}catch{return!0}},ge={};function _e(e=`h264`){let t=b[e];return t?(ge[e]||(ge[e]=ce(t,320,240).then(t=>{let n=t===!0;return ve[e]=n,n})),ge[e]):Promise.resolve(!1)}var ve={},ye=e=>ve[e],be={},xe={},Se=(e,t=!1)=>`${e}${t?`444`:``}`;function Ce(e,t=!1){let n=Se(e,t),r=y[n];return!r||typeof VideoDecoder>`u`?Promise.resolve(!1):(be[n]||(be[n]=(async()=>{let i=Uint8Array.from(atob(r),e=>e.charCodeAt(0)),a=0,o=null;try{o=new VideoDecoder({output:e=>{a++,e.close()},error:()=>{}}),o.configure({codec:ee(e,i,320,240,30,t,!0),codedWidth:320,codedHeight:240,optimizeForLatency:!0}),o.decode(new EncodedVideoChunk({type:`key`,timestamp:0,data:i})),await Promise.race([o.flush(),new Promise(e=>setTimeout(e,se))])}catch{}try{o&&o.state!==`closed`&&o.close()}catch{}return xe[n]=a>0,a>0})()),be[n])}var we=(e,t=!1)=>xe[Se(e,t)];function Te(){let e=window.location.pathname;return e.substring(0,e.lastIndexOf(`/`)+1).replace(/\/$/,``)}var C=5e3;async function Ee(e,t){try{let n=typeof AbortSignal.timeout==`function`?AbortSignal.timeout(C):void 0,r=await fetch(e,{cache:`no-store`,headers:t,signal:n});return[502,503,504].includes(r.status)?null:r}catch{return null}}async function De(e){try{let t=typeof AbortSignal.timeout==`function`?AbortSignal.timeout(C):void 0,n=await fetch(window.location.href,{method:`HEAD`,cache:`no-store`,headers:e,signal:t});return n.ok?`${n.headers.get(`etag`)||``}|${n.headers.get(`last-modified`)||``}`:null}catch{return null}}function Oe(){return typeof window>`u`?``:(window.location.origin+window.location.pathname).replace(/[^a-zA-Z0-9._-]/g,`_`)}function ke(){if(typeof navigator>`u`)return!1;let e=navigator.platform||navigator.userAgentData&&navigator.userAgentData.platform||``;return/^mac/i.test(e)&&(navigator.maxTouchPoints||0)<=1}function w(){let e=`selkies_tab_id`;try{let t=window.sessionStorage.getItem(e);return t||(t=window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():`${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,window.sessionStorage.setItem(e,t)),t}catch{return null}}var T=864e5;function E(e){return`${Oe()}_cc_start${e&&e!==`primary`?`_${e}`:``}`}function Ae(e,t){if(!(!Number.isFinite(t)||t<=0))try{window.localStorage.setItem(E(e),JSON.stringify({kbps:Math.round(t),at:Date.now()}))}catch{}}function D(e){try{let t=JSON.parse(window.localStorage.getItem(E(e))||`null`);if(t&&Number.isFinite(t.kbps)&&t.kbps>0&&Date.now()-t.at<T)return t.kbps}catch{}return null}function je(e){try{window.localStorage.removeItem(E(e))}catch{}}function O(e,t){return/AppleWebKit\//.test(e||``)&&!/Chrom(e|ium)\/|Edg\/|OPR\//.test(e||``)&&/^Linux/.test(t||``)}var Me=typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(pointer: coarse)`).matches;function Ne(e){let t=e&&e.name;return t===`NotAllowedError`||t===`SecurityError`||t===`NotSupportedError`}var Pe=``;function Fe(){document.title=`Selkies`,fetch(`manifest.json`).then(e=>e.json()).then(e=>{e.name&&!Pe&&(document.title=e.name)}).catch(()=>{})}function Ie(e){let t=e.ui_title;t&&t.overridden&&t.value&&(Pe=String(t.value),document.title=Pe)}function k(e,t){let n=e=>e.split(/(?=^m=)/m),r=n(e),i=n(t);if(r.length!==i.length)return t;for(let e=1;e<r.length;e++){let t=r[e];if(!t.startsWith(`m=audio`)||/^a=recvonly/m.test(t))continue;let n=t.match(/^a=rtpmap:(\d+) multiopus\//m);if(!n)continue;let a=n[1],o=RegExp(`^a=(rtpmap|fmtp|rtcp-fb):${a} `),s=t.split(/\r?\n/).filter(e=>o.test(e)),c=i[e].split(`\r
`),l=c[0].split(` `);if(l[1]===`0`||l.slice(3).includes(a))continue;c[0]=[...l.slice(0,3),a,...l.slice(3)].join(` `);let u=c.findIndex(e=>e.startsWith(`a=rtpmap:`));c.splice(u<0?c.length-1:u,0,...s),i[e]=c.join(`\r
`)}return i.join(``)}var Le=class{constructor(e,t,n){this.signaling=e,this.element=t,this.peer_id=n,this.forceTurn=!1,this.rtcPeerConfig={lifetimeDuration:`86400s`,iceServers:[{urls:[`stun:stun.l.google.com:19302`]}],blockStatus:`NOT_BLOCKED`,iceTransportPolicy:`all`},this.peerConnection=null,this._micTransceiver=null,this._micStream=null,this._micPending=null,this._webcamTransceiver=null,this._webcamStream=null,this._webcamPending=null,this.onstatus=null,this.ondebug=null,this.onerror=null,this.onconnectionstatechange=null,this.ondatachannelopen=null,this.ondatachannelclose=null,this.onstreaminfo=null,this.onlatencymeasurement=null,this.onplaystreamrequired=null,this.onclipboardcontent=null,this.onsystemaction=null,this.oncursorchange=null,this.cursor_cache=new Map,this.onstreamstats=null,this.onconnection=null,this.signaling.onsdp=this._onSDP.bind(this),this.signaling.onice=this._onSignalingICE.bind(this),this._connected=!1,this._send_channel=null,this._motion_channel=null,this._gzTx=!1,this._sendQueue=Promise.resolve(),this._recvQueue=Promise.resolve(),this.input=null,this.clipboardcontent=[],this.onserversettings=null,this.ondisplaysettings=null,this.onpagevisibility=null,this.ondisplayconfig=null,this.onprintdocument=null,this.onccrate=null}_setStatus(e){this.onstatus!==null&&this.onstatus(e)}_setDebug(e){this.ondebug!==null&&this.ondebug(e)}_setError(e){this.onerror!==null&&this.onerror(e)}_setConnectionState(e){this.onconnectionstatechange!==null&&this.onconnectionstatechange(e)}_onSignalingICE(e){this._setDebug(`received ice candidate from signaling server: `+JSON.stringify(e)),this.forceTurn&&JSON.stringify(e).indexOf(`relay`)<0?this._setDebug(`Rejecting non-relay ICE candidate: `+JSON.stringify(e)):this.peerConnection.addIceCandidate(e).catch(this._setError)}_onPeerICE(e){e.candidate===null?this._setStatus(`Completed ICE candidates from peer connection`):this.signaling.sendICE(e.candidate)}_onSDP(e){e.type==`offer`?(console.log(`Received remote SDP`,e),this.peerConnection.setRemoteDescription(e).then(()=>{this._setDebug(`received SDP offer, creating answer`),this._prepareUplinkTransceivers(e.sdp),this.peerConnection.createAnswer().then(t=>{if(!/[^-]sps-pps-idr-in-keyframe=1[^\d]/gm.test(t.sdp)&&/[^-]packetization-mode=/gm.test(t.sdp)&&(console.log(`Overriding WebRTC SDP to include sps-pps-idr-in-keyframe=1`),t.sdp=/[^-]sps-pps-idr-in-keyframe=\d+/gm.test(t.sdp)?t.sdp.replace(/sps-pps-idr-in-keyframe=\d+/gm,`sps-pps-idr-in-keyframe=1`):t.sdp.replace(`packetization-mode=`,`sps-pps-idr-in-keyframe=1;packetization-mode=`)),t.sdp.indexOf(`multiopus`)===-1){!/[^-]stereo=1[^\d]/gm.test(t.sdp)&&/[^-]useinbandfec=/gm.test(t.sdp)&&(console.log(`Overriding WebRTC SDP to allow stereo audio`),t.sdp=/[^-]stereo=\d+/gm.test(t.sdp)?t.sdp.replace(/stereo=\d+/gm,`stereo=1`):t.sdp.replace(`useinbandfec=`,`stereo=1;useinbandfec=`));let n=e.sdp.match(/^a=ptime:(\d+)/m),r=Math.max(3,Math.min(10,n?parseInt(n[1],10):10));!RegExp(`[^-]minptime=`+r+`[^\\d]`,`gm`).test(t.sdp)&&/[^-]useinbandfec=/gm.test(t.sdp)&&(console.log(`Overriding WebRTC SDP to allow low-latency audio packet (minptime=`+r+`)`),t.sdp=/[^-]minptime=\d+/gm.test(t.sdp)?t.sdp.replace(/minptime=\d+/gm,`minptime=`+r):t.sdp.replace(`useinbandfec=`,`minptime=`+r+`;useinbandfec=`))}console.log(`Created local SDP`,t);let n=t.sdp,r=k(e.sdp,n),i=e=>this.peerConnection.setLocalDescription({type:`answer`,sdp:e}),a=()=>this.peerConnection.getReceivers().some(e=>e.track&&e.track.kind===`audio`&&e.getParameters().codecs.some(e=>/multiopus/i.test(e.mimeType)));(r===n?i(n):i(r).catch(()=>i(n))).then(()=>{this._setDebug(`Sending SDP answer`);let e=this.peerConnection.localDescription,t=e.sdp!==n&&e.sdp.indexOf(`multiopus`)!==-1;this.signaling.sendSDP(t&&!a()?{type:`answer`,sdp:n}:e)}).catch(e=>{this._setError(`Error setting local description: `+e)})}).catch(()=>{this._setError(`Error creating local SDP`)})}).catch(e=>{this._setError(`Error setting remote description: `+e)})):this._setError(`received SDP was not type offer.`)}_prepareUplinkTransceivers(e){if(this._micTransceiver=null,this._webcamTransceiver=null,!e||!this.peerConnection)return;let t={audio:null,video:null},n=null,r=null,i=!1,a=()=>{r&&i&&n!==null&&t[r]===null&&Object.prototype.hasOwnProperty.call(t,r)&&(t[r]=n)};for(let t of e.split(/\r?\n/))t.startsWith(`m=`)?(a(),r=t.slice(2).split(` `)[0],n=null,i=!1):t.startsWith(`a=mid:`)?n=t.slice(6).trim():t.trim()===`a=recvonly`&&(i=!0);a();let o=this.peerConnection.getTransceivers(),s=e=>{if(e===null)return null;let t=o.find(t=>t.mid===e);if(t)try{t.direction=`sendonly`}catch{}return t||null};this._micTransceiver=s(t.audio),this._webcamTransceiver=s(t.video)}async setMicrophone(e,t=null){if(e){if(!this._micTransceiver)throw Error(`Microphone is disabled on this server.`);if(this._micStream||this._micPending)return!0;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return!1;let e={channelCount:1,sampleRate:24e3,echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0};t&&(e.deviceId={exact:t});let n=this._micPending={withdrawn:!1},r;try{r=await navigator.mediaDevices.getUserMedia({audio:e,video:!1})}finally{this._micPending=null}if(n.withdrawn)return r.getTracks().forEach(e=>e.stop()),null;this._micStream=r;let i=this._micStream.getAudioTracks()[0];return this._micTransceiver&&this._micTransceiver.sender&&i&&await this._micTransceiver.sender.replaceTrack(i),!0}if(this._micPending&&(this._micPending.withdrawn=!0),this._micTransceiver&&this._micTransceiver.sender)try{await this._micTransceiver.sender.replaceTrack(null)}catch{}return this._micStream&&=(this._micStream.getTracks().forEach(e=>e.stop()),null),!0}async setWebcam(e,t=null,{width:n=1280,height:r=720,fps:i=30,codec:a=`auto`}={}){if(e){if(!this._webcamTransceiver)throw Error(`Webcam is disabled on this server.`);if(this._webcamStream||this._webcamPending)return!0;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return!1;let e={width:{ideal:n},height:{ideal:r},frameRate:{ideal:i}};t&&(e.deviceId={exact:t});let o=this._webcamPending={withdrawn:!1},s;try{s=await navigator.mediaDevices.getUserMedia({video:e,audio:!1})}finally{this._webcamPending=null}if(o.withdrawn)return s.getTracks().forEach(e=>e.stop()),null;let c=s.getVideoTracks()[0];try{c&&(await this._setSenderActive(this._webcamTransceiver.sender,!0),await this._webcamTransceiver.sender.replaceTrack(c))}catch(e){throw s.getTracks().forEach(e=>e.stop()),e}return this._webcamStream=s,await this.setWebcamCodec(a),!0}if(this._webcamPending&&(this._webcamPending.withdrawn=!0),this._webcamTransceiver&&this._webcamTransceiver.sender){await this._setSenderActive(this._webcamTransceiver.sender,!1);try{await this._webcamTransceiver.sender.replaceTrack(null)}catch{}}return this._webcamStream&&=(this._webcamStream.getTracks().forEach(e=>e.stop()),null),!0}async setWebcamCodec(e){let t=this._webcamTransceiver&&this._webcamTransceiver.sender;if(!t||!t.track)return!1;let n=`video/${String(e||`auto`).toLowerCase()}`;try{let e=t.getParameters();if(!e.encodings||e.encodings.length===0)return!1;let r=(e.codecs||[]).find(e=>e.mimeType.toLowerCase()===n)||null,i=e.encodings[0].codec||null;if(r){if(i&&i.mimeType.toLowerCase()===n)return!0;e.encodings[0].codec={mimeType:r.mimeType,clockRate:r.clockRate,sdpFmtpLine:r.sdpFmtpLine}}else{if(!i)return!1;delete e.encodings[0].codec}return await t.setParameters(e),!!r}catch(e){return console.warn(`Webcam codec not applied to the sender:`,e),!1}}async _setSenderActive(e,t){try{let n=e.getParameters();if(!n.encodings||n.encodings.length===0)return;let r=!1;n.encodings.forEach(e=>{e.active!==t&&(e.active=t,r=!0)}),r&&await e.setParameters(n)}catch(e){console.warn(`Sender encoding activation not applied:`,e)}}get webcamTrack(){return this._webcamStream&&this._webcamStream.getVideoTracks()[0]||null}_onLocalSDP(e){this._setDebug(`Created local SDP: `+JSON.stringify(e))}_ontrack(e){this._setStatus(`Received incoming `+e.track.kind+` stream from peer`),this.streams||=[],this.streams.push([e.track.kind,e.streams]),e.track.kind===`video`&&(this.element.srcObject=e.streams[0],this.playStream())}_onPeerdDataChannel(e){this._setStatus(`Peer data channel created: `+e.channel.label),e.channel.label===`pointer`?this._motion_channel=e.channel:(this._send_channel=e.channel,this._send_channel.binaryType=`arraybuffer`,this._send_channel.onmessage=this._onPeerDataChannelMessage.bind(this),this._send_channel.onopen=()=>{typeof CompressionStream<`u`&&this._send_channel.send(`_gz,1`),this.ondatachannelopen!==null&&this.ondatachannelopen()},this._send_channel.onclose=()=>{this.ondatachannelclose!==null&&this.ondatachannelclose()},this._send_channel.onerror=e=>{this._setError(`Unexpected error, data channel closed, ${e.error||`unknown error`}`)})}_onPeerDataChannelMessage(e){if(e.data instanceof ArrayBuffer){let t=new Uint8Array(e.data,0,Math.min(2,e.data.byteLength));if(t[0]===31&&t[1]===139){let t=(async()=>{let t=await new Response(new Blob([e.data]).stream().pipeThrough(new DecompressionStream(`gzip`))).text(),n=this._parseDataChannelMessage(t);return n===null||this._requiresOrderedDelivery(n)?n:(this._routeDataChannelMessage(n),null)})().catch(e=>(this._setError(`failed to decompress data channel message: `+e),null));this._recvQueue=this._recvQueue.then(async()=>{let e=await t;if(e!==null)return this._routeDataChannelMessage(e)}).catch(e=>this._setError(`failed to handle data channel message: `+e));return}this._setError(`unexpected binary data channel message`);return}if(e.data===`_gz,1`){this._gzTx=!0;return}let t=this._parseDataChannelMessage(e.data);if(t!==null){if(this._requiresOrderedDelivery(t))this._recvQueue=this._recvQueue.then(()=>this._routeDataChannelMessage(t)).catch(e=>this._setError(`failed to handle data channel message: `+e));else try{this._routeDataChannelMessage(t)}catch(e){this._setError(`failed to handle data channel message: `+e)}}}_requiresOrderedDelivery(e){return typeof e.type==`string`&&(e.type.startsWith(`clipboard-msg`)||e.type===`server_settings`||e.type===`display_settings`)}_parseDataChannelMessage(e){var t;try{t=JSON.parse(e)}catch(t){return t instanceof SyntaxError?this._setError(`error parsing data channel message as JSON: `+e):this._setError(`failed to parse data channel message: `+e),null}return this._setDebug(`data channel message: `+e),t}_routeDataChannelMessage(e){if(e.type===`pipeline`)this._setStatus(e.data.status);else if(e.type===`stream_info`)this.onstreaminfo!==null&&this.onstreaminfo(e.data);else if(e.type===`stream_stats`)this.onstreamstats!==null&&this.onstreamstats(e.data);else if(e.type===`connection`)this.onconnection!==null&&this.onconnection(!!(e.data&&e.data.poor));else if(typeof e.type==`string`&&e.type.startsWith(`clipboard-msg`)){if(typeof this.onclipboardcontent==`function`)return this.onclipboardcontent(e)}else if(e.type===`cursor`){if(this.oncursorchange!==null&&e.data!==null){let t={curdata:e.data.curdata,width:e.data.width,height:e.data.height,hotx:e.data.hotx,hoty:e.data.hoty,handle:e.data.handle};this._setDebug(`received new cursor contents, ${JSON.stringify(t)}`),this.oncursorchange(t)}}else if(e.type===`system`){if(e.data!=null&&e.data.action!=null){var t=e.data.action;this._setDebug(`received system msg, action: `+t),this.onsystemaction!==null&&this.onsystemaction(t)}}else e.type===`ping`?(this._setDebug(`received server ping: `+JSON.stringify(e.data)),this.sendDataChannelMessage(`pong,`+new Date().getTime()/1e3)):e.type===`latency_measurement`?this.onlatencymeasurement!==null&&this.onlatencymeasurement(e.data.latency_ms):e.type===`server_settings`?this.onserversettings!==null&&this.onserversettings(e.data):e.type===`display_settings`?this.ondisplaysettings!==null&&this.ondisplaysettings(e.data):e.type===`page_visibility`?this.onpagevisibility!==null&&this.onpagevisibility():e.type===`display_config_update`?this.ondisplayconfig!==null&&this.ondisplayconfig(e.data):e.type===`print_document`?this.onprintdocument!==null&&this.onprintdocument(e.data):e.type===`cc_rate`?this.onccrate!==null&&e.data&&this.onccrate(e.data.kbps):this._setError(`Unhandled message received: `+e.type)}_handleConnectionStateChange(e){switch(e){case`connected`:this._setStatus(`Connection complete`),this._connected=!0;break;case`disconnected`:this._setError(`Peer connection disconnected`),this._send_channel!==null&&this._send_channel.readyState===`open`&&this._send_channel.close(),this.element.load();break;case`failed`:this._setError(`Peer connection failed`),this.element.load()}}dataChannelBufferedAmount(){return this._send_channel&&this._send_channel.readyState===`open`?this._send_channel.bufferedAmount:0}dataChannelOpen(){return this._send_channel!==null&&this._send_channel.readyState===`open`}async waitForDataChannelDrain(e=1048576){if(this._sendQueue)try{await this._sendQueue}catch{}let t=this._send_channel;!t||t.readyState!==`open`||t.bufferedAmount<=e||(t.bufferedAmountLowThreshold=e,await new Promise(n=>{let r=()=>{t.removeEventListener(`bufferedamountlow`,r),n()};t.addEventListener(`bufferedamountlow`,r),(t.readyState!==`open`||t.bufferedAmount<=e)&&r()}))}motionBufferedAmount(){let e=this._motion_channel;return e!==null&&e.readyState===`open`?e.bufferedAmount:this.dataChannelBufferedAmount()}sendMotionMessage(e){let t=this._motion_channel;t!==null&&t.readyState===`open`?t.send(e):this.sendDataChannelMessage(e)}sendDataChannelMessage(e){this._send_channel!==null&&this._send_channel.readyState===`open`&&(this._gzTx?this._sendQueue=typeof e==`string`&&e.length>=512?this._sendQueue.then(async()=>{let t=await new Response(new Blob([e]).stream().pipeThrough(new CompressionStream(`gzip`))).arrayBuffer();this._send_channel&&this._send_channel.readyState===`open`&&this._send_channel.send(t)}).catch(()=>{}):this._sendQueue.then(()=>{this._send_channel&&this._send_channel.readyState===`open`&&this._send_channel.send(e)}).catch(()=>{}):this._send_channel.send(e))}onGamepadDisconnect(e){this._setStatus(`gamepad: `+e+`, disconnected`)}getConnectionStats(){var e=this.peerConnection,t={general:{bytesReceived:0,bytesSent:0,connectionType:`NA`,currentRoundTripTime:null,availableReceiveBandwidth:0},video:{bytesReceived:0,decoder:`NA`,frameHeight:0,frameWidth:0,framesPerSecond:0,packetsReceived:0,packetsLost:0,codecName:`NA`,jitterBufferDelay:0,jitterBufferEmittedCount:0},audio:{bytesReceived:0,packetsReceived:0,packetsLost:0,codecName:`NA`,jitterBufferDelay:0,jitterBufferEmittedCount:0,concealedSamples:0,concealmentEvents:0,totalSamplesReceived:0,packetsDiscarded:0},data:{bytesReceived:0,bytesSent:0,messagesReceived:0,messagesSent:0}};return new Promise(function(n,r){e.getStats().then(e=>{var r={transports:{},candidatePairs:{},selectedCandidatePairId:null,remoteCandidates:{},localCandidates:{},outbound:{},codecs:{},videoRTP:null,videoTrack:null,audioRTP:null,audioTrack:null,dataChannel:null},i=[];e.forEach(e=>{i.push(e),e.type===`transport`?r.transports[e.id]=e:e.type===`candidate-pair`?(r.candidatePairs[e.id]=e,e.selected===!0&&(r.selectedCandidatePairId=e.id)):e.type===`inbound-rtp`?e.kind===`video`?r.videoRTP=e:e.kind===`audio`&&(r.audioRTP=e):e.type===`track`?e.kind===`video`?r.videoTrack=e:e.kind===`audio`&&(r.audioTrack=e):e.type===`data-channel`?r.dataChannel=e:e.type===`remote-candidate`?r.remoteCandidates[e.id]=e:e.type===`local-candidate`?r.localCandidates[e.id]=e:e.type===`outbound-rtp`?r.outbound[e.kind]=e:e.type===`codec`&&(r.codecs[e.id]=e)});var a=r.videoRTP;if(a!==null){t.video.bytesReceived=a.bytesReceived,t.video.decoder=a.decoderImplementation||`unknown`,t.video.frameHeight=a.frameHeight,t.video.frameWidth=a.frameWidth,t.video.framesPerSecond=a.framesPerSecond,t.video.packetsReceived=a.packetsReceived,t.video.packetsLost=a.packetsLost;let e=r.codecs[a.codecId];e!==void 0&&(t.video.codecName=e.mimeType.split(`/`)[1].toUpperCase())}var o=r.audioRTP;if(o!==null){t.audio.bytesReceived=o.bytesReceived,t.audio.packetsReceived=o.packetsReceived,t.audio.packetsLost=o.packetsLost,o.concealedSamples!==void 0&&(t.audio.concealedSamples=o.concealedSamples),o.concealmentEvents!==void 0&&(t.audio.concealmentEvents=o.concealmentEvents),o.totalSamplesReceived!==void 0&&(t.audio.totalSamplesReceived=o.totalSamplesReceived),o.packetsDiscarded!==void 0&&(t.audio.packetsDiscarded=o.packetsDiscarded);let e=r.codecs[o.codecId];e!==void 0&&(t.audio.codecName=e.mimeType.split(`/`)[1].toUpperCase())}var s=r.dataChannel;if(s!==null&&(t.data.bytesReceived=s.bytesReceived,t.data.bytesSent=s.bytesSent,t.data.messagesReceived=s.messagesReceived,t.data.messagesSent=s.messagesSent),Object.keys(r.transports).length>0){var c=r.transports[Object.keys(r.transports)[0]];t.general.bytesReceived=c.bytesReceived,t.general.bytesSent=c.bytesSent,r.selectedCandidatePairId=c.selectedCandidatePairId}else r.selectedCandidatePairId!==null&&(t.general.bytesReceived=r.candidatePairs[r.selectedCandidatePairId].bytesReceived,t.general.bytesSent=r.candidatePairs[r.selectedCandidatePairId].bytesSent);if(r.selectedCandidatePairId!==null){var l=r.candidatePairs[r.selectedCandidatePairId];if(l!==void 0){l.availableIncomingBitrate!==void 0&&(t.general.availableReceiveBandwidth=l.availableIncomingBitrate),l.currentRoundTripTime!==void 0&&(t.general.currentRoundTripTime=l.currentRoundTripTime);var u=r.remoteCandidates[l.remoteCandidateId];u!==void 0&&(t.general.connectionType=u.candidateType)}}t.general.packetsReceived=t.video.packetsReceived+t.audio.packetsReceived,t.general.packetsLost=t.video.packetsLost+t.audio.packetsLost,r.videoRTP!==null&&(t.video.jitterBufferDelay=r.videoRTP.jitterBufferDelay,t.video.jitterBufferEmittedCount=r.videoRTP.jitterBufferEmittedCount),r.audioRTP!==null&&(t.audio.jitterBufferDelay=r.audioRTP.jitterBufferDelay,t.audio.jitterBufferEmittedCount=r.audioRTP.jitterBufferEmittedCount),t.reports=r,t.allReports=i,n(t)}).catch(e=>r(e))})}playStream(){this.element.load();var e=this.element.play();e!==void 0&&e.then(()=>{this._setDebug(`Stream is playing.`)}).catch(()=>{this.onplaystreamrequired===null?this._setDebug(`Stream play failed and no onplaystreamrequired was bound.`):this.onplaystreamrequired()})}connect(){if(this.peerConnection=new RTCPeerConnection(this.rtcPeerConfig),this.peerConnection.ontrack=this._ontrack.bind(this),this.peerConnection.onicecandidate=this._onPeerICE.bind(this),this.peerConnection.ondatachannel=this._onPeerdDataChannel.bind(this),this.peerConnection.onconnectionstatechange=()=>{this._handleConnectionStateChange(this.peerConnection.connectionState),this._setConnectionState(this.peerConnection.connectionState)},this.forceTurn){this._setStatus(`forcing use of TURN server`);let e=this.peerConnection.getConfiguration();e.iceTransportPolicy=`relay`,this.peerConnection.setConfiguration(e)}this.signaling.peer_id=this.peer_id,this.signaling.connect()}reset(){this.cursor_cache=new Map;var e=this.peerConnection.signalingState;this._send_channel!==null&&this._send_channel.readyState===`open`&&this._send_channel.close(),this.peerConnection!==null&&this.peerConnection.close(),e===`stable`?this.connect():setTimeout(()=>{this.connect()},3e3)}};function Re(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),e=>e.toString(16).padStart(2,`0`)).join(``)}var ze=400,Be=1e3,Ve=class{constructor(e,t,n,r,i,a,o){this._server=e,this.capabilities=null,this.tenBitCapabilities=null,this.pageSize=null,this.peer_id=1,this._ws_conn=null,this.onstatus=null,this.onfatalretry=null,this.onerror=null,this.ondebug=null,this.onice=null,this.onsdp=null,this.ondisconnect=null,this.resumable=null,this.onresumed=null,this.resume_key=Re(),this._resuming=!1,this._resume_lines=[],this.state=`disconnected`,this.retry_count=0,this._retry_timer=null,this._backoff=0,this._forget_socket=()=>{},window.addEventListener(`online`,()=>{this._retry_timer&&(clearTimeout(this._retry_timer),this._retry_timer=null,this._backoff=0,this.retry_count--,this._scheduleRetry())}),this._intentional_close=!1,this.currRes=null,this.peer_type=`client`,this.client_type=t,this.server_peer_id=null,this.client_slot=n,this.client_strict_viewer=r,this.client_token=i,this.display_id=a||`primary`,this.display_position=o||`right`,this.onshowalert=null}_setStatus(e){this.onstatus!==null&&this.onstatus(e)}_setDebug(e){this.ondebug!==null&&this.ondebug(e)}_setError(e){this.onerror!==null&&this.onerror(e)}_setSDP(e){this.onsdp!==null&&this.onsdp(e)}_setICE(e){this.onice!==null&&this.onice(e)}async _onServerOpen(){this.state=`connected`;let e={client_type:this.client_type,client_slot:this.client_slot,client_strict_viewer:this.client_strict_viewer,client_token:this.client_token,display_id:this.display_id,display_position:this.display_position,client_tab_id:w(),cc_start_kbps:D(this.display_id),resume_key:this.resume_key};if(this.capabilities)try{e.fullcolor_codecs=await this.capabilities()}catch{}if(this.tenBitCapabilities)try{e.tenbit_codecs=await this.tenBitCapabilities()}catch{}if(this.pageSize)try{let t=this.pageSize();t&&(e.page_size=t)}catch{}this._ws_conn&&this._ws_conn.readyState===WebSocket.OPEN&&(this._ws_conn.send(`HELLO ${this.peer_type} ${JSON.stringify(e)}`),this._setStatus(`Registering with server, peer type: `+this.peer_type+`, client type: `+this.client_type),this.retry_count=0,this._backoff=0)}_scheduleRetry(){if(this._retry_timer)return;this.retry_count++;let e=Math.min(ze*2**this._backoff,Be);this._backoff++,this._retry_timer=setTimeout(()=>{this._retry_timer=null,this.retry_count>3?this.onfatalretry===null?window.location.reload():this.onfatalretry():this.connect()},e)}retry(){this.retry_count=0,this._scheduleRetry()}_onServerError(){this._setStatus(`Connection error, retrying.`),this._ws_conn.readyState===this._ws_conn.CLOSED&&this._scheduleRetry()}_setupCall(){this._setStatus(`Initiating session with server.`),this._ws_conn.send(`SESSION server`)}_onServerMessage(e){if(this._setDebug(`server message: `+e.data),e.data===`HELLO`){if(this._resuming){this._setStatus(`Session not resumed; starting a new one.`),this.reconnect();return}this._setStatus(`Registered with server.`),this._setupCall()}else if(e.data.startsWith(`RESUMED `)){this._setStatus(`Session resumed.`),this.server_peer_id=e.data.split(` `)[1],this._resuming=!1;for(let e of this._resume_lines.splice(0))this._ws_conn.send(e);this.onresumed!==null&&this.onresumed()}else if(e.data.startsWith(`SESSION_OK`))this._setStatus(`Session established with server.`),this.server_peer_id=e.data.split(` `)[1];else if(e.data.startsWith(`ERROR`))e.data===`ERROR peer server not found`&&(this._setError(`Server not found. Retrying...`),setTimeout(()=>{this._setupCall()},1e3));else{var t;try{t=e.data.substring(e.data.indexOf(` `)+1),t=JSON.parse(t)}catch(t){t instanceof SyntaxError?this._setError(`error parsing message as JSON: `+e.data):this._setError(`failed to parse message: `+e.data);return}if(t.sdp!=null)this._setSDP(new RTCSessionDescription(t.sdp));else if(t.ice!=null){var n=new RTCIceCandidate(t.ice);this._setICE(n)}else this._setError(`unhandled JSON message: `+t)}}_onServerClose(e){if(this.state===`connecting`){this.state=`disconnected`,this._scheduleRetry();return}this.state=`disconnected`,this._setError(`Server closed connection.`);let t=this._intentional_close;this._intentional_close=!1,this.ondisconnect!==null&&(e.code===4e3?this.onshowalert!==null&&this.onshowalert(e.reason):e.code===4001?this.onshowalert!==null&&this.onshowalert(e.reason||`Session superseded by a new connection. Reload to take over.`):(e.code===1e3||e.code===1001)&&t?this.ondisconnect(!1):this.resumable!==null&&this.resumable()?(console.log(`Signaling socket cut; resuming the session.`),this._resuming=!0,this.connect()):(console.log(`Reconnecting due to server-side connection closure.`),this.resume_key=Re(),this.ondisconnect(!0)))}connect(){this.state=`connecting`,this._setStatus(`Connecting to server.`),this._ws_conn=new WebSocket(this._server);let e=!0;this._forget_socket=()=>{e=!1};let t=t=>n=>{e&&t.call(this,n)};this._ws_conn.addEventListener(`open`,t(this._onServerOpen)),this._ws_conn.addEventListener(`error`,t(this._onServerError)),this._ws_conn.addEventListener(`message`,t(this._onServerMessage)),this._ws_conn.addEventListener(`close`,t(this._onServerClose))}reconnect(){this._forget_socket(),this._retry_timer&&=(clearTimeout(this._retry_timer),null),this.resume_key=Re(),this._resuming=!1,this._resume_lines=[];try{this._ws_conn&&this._ws_conn.close()}catch{}this.state=`disconnected`,this.ondisconnect!==null&&this.ondisconnect(!0)}disconnect(){this._intentional_close=!0,this._ws_conn.close()}sendICE(e){this._setDebug(`sending ice candidate: `+JSON.stringify(e)),this._send(`${this.server_peer_id} ${JSON.stringify({ice:e})}`)}sendSDP(e){this._setDebug(`sending local sdp: `+JSON.stringify(e)),this._send(`${this.server_peer_id} ${JSON.stringify({sdp:e})}`)}_send(e){this._resuming?this._resume_lines.push(e):this._ws_conn.send(e)}},He={buttons:{a:0,b:1,x:2,y:3,leftshoulder:4,rightshoulder:5,lefttrigger:6,righttrigger:7,back:8,start:9,leftstick:10,rightstick:11,dpup:12,dpdown:13,dpleft:14,dpright:15,guide:16},axes:{leftx:0,lefty:1,rightx:2,righty:3}},Ue=4,We=.05,Ge=[[0,1],[2,3]],A=.5,Ke=24,qe=()=>({12:!1,13:!1,14:!1,15:!1}),Je=5e3,Ye=(()=>{let e=typeof navigator<`u`&&navigator.userAgent||``;return/iPhone|iPad|iPod/i.test(e)?`ios`:/Android/i.test(e)?`android`:/Windows/i.test(e)?`windows`:/Macintosh|Mac OS X/i.test(e)?`mac`:`linux`})(),Xe=class{constructor(e,t,n,r,i){this.gamepad=e,this.onButton=t,this.onAxis=n,this.onHeld=r||null,this.onActive=i||null,this.drivers=[null],this._takenUpAt={},this._usedAt={},this._tick=0,this._lastHeldBeat=0,this.state={},this._active=!0,this.interval=setInterval(()=>{this._poll()},4),this._onTouchInput=()=>this._poll(),window.addEventListener(`touchgamepadinput`,this._onTouchInput),this.rumbleEnabled=!0,this._rumbling={}}get active(){return this.drivers[0]}setSlotCount(e){let t=Math.max(1,e|0);for(;this.drivers.length>t;){let e=this.drivers.length-1;this.drivers[e]!==null&&this._setDriver(e,null,null),this.drivers.pop()}for(;this.drivers.length<t;)this.drivers.push(null)}drivenPosition(e){return this.drivers.indexOf(e)}enable(){this._active||(this._active=!0,console.log(`GamepadManager polling activated.`))}disable(){this._active&&(this._active=!1,this.stopRumble(),console.log(`GamepadManager polling deactivated.`))}async _loadRemapProfile(e,t){t.loadingProfile=!0;let n=`jsdb/${Ye}/${e}.json`;try{console.log(`Attempting to load mapping for ${e} from ${n}`);let r=await fetch(n);if(!r.ok){r.status===404?console.log(`No custom mapping file found for ${e}. Using browser default.`):console.warn(`Failed to load mapping for ${e} (HTTP Status: ${r.status})`),t.remapProfile=null;return}let i=await r.json();console.log(`Successfully loaded and applying custom mapping for: ${e}`);let a={buttons:{},axes:{}};for(let e in i){let t=i[e];if(t.type===`button`){let n=He.buttons[e];n!==void 0&&(a.buttons[t.index]=n)}else if(t.type===`axis`){let n=He.axes[e];n!==void 0&&(a.axes[t.index]=n)}}t.remapProfile=a}catch(n){console.error(`Error fetching or parsing mapping file for ${e}:`,n),t.remapProfile=null}}_poll(){if(!this._active)return;let e=navigator.getGamepads();this._choose(e);for(let t=0;t<Ue;t++){let n=e[t];if(n){let e=this.state[t];if(!e&&(e=this.state[t]={axes:Array(n.axes.length).fill(0),buttons:Array(n.buttons.length).fill(0),dpadAxisState:qe(),remapProfile:null,loadingProfile:!1},n.mapping!==`standard`)){let t=n.id.match(/Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})/i);if(t&&!e.loadingProfile){let n=`${t[1].toLowerCase()}-${t[2].toLowerCase()}`;this._loadRemapProfile(n,e)}}if(this.drivers.indexOf(t)<0)continue;e.buttons.length!==n.buttons.length&&(e.buttons=Array(n.buttons.length).fill(0)),e.axes.length!==n.axes.length&&(e.axes=Array(n.axes.length).fill(0));for(let r=0;r<n.buttons.length;r++){if(n.buttons[r]===void 0)continue;let i=n.buttons[r].value,a=n.buttons[r].pressed,o=r;if(n.mapping!==`standard`&&navigator.userAgent.includes(`Firefox`)&&(r===2?o=3:r===3&&(o=2)),e.buttons[r]!==i){if(e.remapProfile){let t=e.remapProfile.buttons[o];if(t!==void 0)o=t;else continue}this.onButton(t,o,i,a),e.buttons[r]=i}}let r=this._deadzone(n,e);for(let i=0;i<n.axes.length;i++){if(n.axes[i]===void 0)continue;let a=r[i];if(e.axes[i]!==a){if(n.mapping===`standard`||i!==4&&i!==5){let n=i;e.remapProfile&&e.remapProfile.axes[i]!==void 0&&(n=e.remapProfile.axes[i]),this.onAxis(t,n,a)}e.axes[i]=a}}if(n.mapping!==`standard`&&n.axes.length>=6){let r=.5,i={up:n.axes[5]<-.5,down:n.axes[5]>r,left:n.axes[4]<-.5,right:n.axes[4]>r};i.up!==e.dpadAxisState[12]&&(this.onButton(t,12,+!!i.up,i.up),e.dpadAxisState[12]=i.up),i.down!==e.dpadAxisState[13]&&(this.onButton(t,13,+!!i.down,i.down),e.dpadAxisState[13]=i.down),i.left!==e.dpadAxisState[14]&&(this.onButton(t,14,+!!i.left,i.left),e.dpadAxisState[14]=i.left),i.right!==e.dpadAxisState[15]&&(this.onButton(t,15,+!!i.right,i.right),e.dpadAxisState[15]=i.right)}}else this.state[t]&&delete this.state[t]}if(this.onHeld&&this._anyHeld()){let e=Date.now();e-this._lastHeldBeat>=100&&(this._lastHeldBeat=e,this.onHeld())}}_choose(e){this._tick++;let t=[],n=[];for(let r=0;r<Ue;r++){let i=e[r];if(!i){delete this._takenUpAt[r],delete this._usedAt[r];continue}t.push(r);let a=this._takenUp(i);a&~(this._takenUpAt[r]||0)&&(this._usedAt[r]=this._tick,this.drivers.indexOf(r)<0&&n.push(r)),this._takenUpAt[r]=a}for(let t=0;t<this.drivers.length;t++){let n=this.drivers[t];n!==null&&!e[n]&&this._setDriver(t,null,null)}let r=t.length<=this.drivers.length?t.filter(e=>this.drivers.indexOf(e)<0):n,i=new Set;for(let t of r){let n=this.drivers.indexOf(null);if(n<0){let e=1/0;for(let t=0;t<this.drivers.length;t++){let r=this._usedAt[this.drivers[t]]||0;!i.has(t)&&r<e&&(e=r,n=t)}}if(n<0)break;i.add(n),this._setDriver(n,t,e[t])}}_takenUp(e){let t=0;for(let n=0;n<e.buttons.length&&n<Ke;n++){let r=e.buttons[n];r&&r.value>=A&&(t|=1<<n)}if(e.mapping===`standard`)for(let n=0;n<4&&n<e.axes.length;n++)Math.abs(e.axes[n]||0)>=A&&(t|=1<<Ke+n);return t}_setDriver(e,t,n){let r=this.drivers[e],i=r!==null;for(let e of[r,t])this._unreport(e);this.drivers[e]=t,this.onActive&&this.onActive(n,i,e)}_unreport(e){let t=e===null?null:this.state[e];t&&(t.buttons.fill(0),t.axes.fill(0),t.dpadAxisState=qe())}padGone(e){delete this._takenUpAt[e],delete this._usedAt[e],delete this.state[e];let t=this.drivers.indexOf(e);t>=0&&this._setDriver(t,null,null)}reannounce(){let e;try{e=navigator.getGamepads()}catch{return}for(let t=0;t<this.drivers.length;t++){let n=this.drivers[t],r=n===null?null:e[n];r&&(this._unreport(n),this.onActive&&this.onActive(r,!1,t))}}_deadzone(e,t){let n=t.deadzoned||=[];n.length=e.axes.length;for(let t=0;t<e.axes.length;t++){let r=e.axes[t];n[t]=r===void 0||Math.abs(r)<We?0:r}for(let[r,i]of Ge){let a=this._rawAxis(e,t,r),o=this._rawAxis(e,t,i);if(a<0||o<0)continue;let s=Math.hypot(e.axes[a]||0,e.axes[o]||0)<We;n[a]=s?0:e.axes[a]||0,n[o]=s?0:e.axes[o]||0}return n}_rawAxis(e,t,n){if(e.mapping===`standard`)return n<e.axes.length?n:-1;if(!t.remapProfile)return-1;for(let e in t.remapProfile.axes)if(t.remapProfile.axes[e]===n)return Number(e);return-1}_anyHeld(){for(let e in this.state){let t=this.state[e];if(t.buttons.some(e=>e!==0)||t.axes.some(e=>e!==0))return!0}return!1}rumble(e,t,n,r=null){let i=!(e>0||t>0)||!this.rumbleEnabled||!this._active,a=r===null?`all`:r;if(i&&!this._rumbling[a])return;this._rumbling[a]=!i,n=Math.min(Je,Math.max(0,n||0));let o;try{o=Array.from(navigator.getGamepads())}catch{return}for(let a of o){if(!a||!a.connected||r!==null&&a.index!==r)continue;let o=a.vibrationActuator;if(o&&typeof o.playEffect==`function`){let r=i&&typeof o.reset==`function`?o.reset():o.playEffect(`dual-rumble`,{startDelay:0,duration:i?0:n,strongMagnitude:i?0:e,weakMagnitude:i?0:t});r&&typeof r.catch==`function`&&r.catch(()=>{});continue}let s=a.hapticActuators&&a.hapticActuators[0];if(s&&typeof s.pulse==`function`){let r=s.pulse(i?0:Math.max(e,t),i?0:n);r&&typeof r.catch==`function`&&r.catch(()=>{})}}}stopRumble(){for(let e of Object.keys(this._rumbling))this.rumble(0,0,0,e===`all`?null:Number(e))}setRumbleEnabled(e){this.rumbleEnabled=!!e,this.rumbleEnabled||this.stopRumble()}destroy(){this.stopRumble(),clearInterval(this.interval),window.removeEventListener(`touchgamepadinput`,this._onTouchInput),this.state={},console.log(`GamepadManager destroyed.`)}};function j(e){"@babel/helpers - typeof";return j=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},j(e)}function Ze(e,t){if(j(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(j(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Qe(e){var t=Ze(e,`string`);return j(t)==`symbol`?t:t+``}function $e(e,t,n){return(t=Qe(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var M=`allow-native-input`,et=2,tt=16384,nt=300,rt=30,it=180,at=200,N=750,ot=.15,st=25,ct=.25,lt=4,ut=80,P=40,dt=120,ft=200,pt=2e3,mt=256;function ht(e){let t=Math.min(1,Math.max(0,(e-ot)/1.05));return 1+2*t*t*(3-2*t)}function gt(e){let t=(Array.isArray(e)?e:e==null?[]:[e]).map(Number).filter(e=>Number.isInteger(e)&&e>=1);return t.length?t:null}var _t=50,vt=10,yt=1.14,bt=40;function xt(e){return e&-7|(e&2)<<1|(e&4)>>1}var St={ShiftLeft:`Shift`,ShiftRight:`Shift`,ControlLeft:`Control`,ControlRight:`Control`,AltLeft:`Alt`,AltRight:`Alt`,MetaLeft:`Meta`,MetaRight:`Meta`};function Ct(e){return!!e.altKey||typeof e.getModifierState==`function`&&e.getModifierState(`AltGraph`)}function wt(e,t){return t?t===`Alt`?Ct(e):e.getModifierState(t):!1}function Tt(e){if(typeof e!=`string`||[...e].length!==1)return!1;let t=e.codePointAt(0);return t>=32&&t!==127}function Et(e){return e.isTrusted!==!1||e.__selkiesClipReplay===!0}var F={XK_VoidSymbol:16777215,XK_BackSpace:65288,XK_Tab:65289,XK_Linefeed:65290,XK_Clear:65291,XK_Return:65293,XK_Pause:65299,XK_Scroll_Lock:65300,XK_Sys_Req:65301,XK_Escape:65307,XK_Delete:65535,XK_Multi_key:65312,XK_Codeinput:65335,XK_SingleCandidate:65340,XK_MultipleCandidate:65341,XK_PreviousCandidate:65342,XK_Kanji:65313,XK_Muhenkan:65314,XK_Henkan_Mode:65315,XK_Henkan:65315,XK_Romaji:65316,XK_Hiragana:65317,XK_Katakana:65318,XK_Hiragana_Katakana:65319,XK_Zenkaku:65320,XK_Hankaku:65321,XK_Zenkaku_Hankaku:65322,XK_Touroku:65323,XK_Massyo:65324,XK_Kana_Lock:65325,XK_Kana_Shift:65326,XK_Eisu_Shift:65327,XK_Eisu_toggle:65328,XK_Kanji_Bangou:65335,XK_Zen_Koho:65341,XK_Mae_Koho:65342,XK_Home:65360,XK_Left:65361,XK_Up:65362,XK_Right:65363,XK_Down:65364,XK_Prior:65365,XK_Page_Up:65365,XK_Next:65366,XK_Page_Down:65366,XK_End:65367,XK_Begin:65368,XK_Select:65376,XK_Print:65377,XK_Execute:65378,XK_Insert:65379,XK_Undo:65381,XK_Redo:65382,XK_Menu:65383,XK_Find:65384,XK_Cancel:65385,XK_Help:65386,XK_Break:65387,XK_Mode_switch:65406,XK_script_switch:65406,XK_Num_Lock:65407,XK_KP_Space:65408,XK_KP_Tab:65417,XK_KP_Enter:65421,XK_KP_F1:65425,XK_KP_F2:65426,XK_KP_F3:65427,XK_KP_F4:65428,XK_KP_Home:65429,XK_KP_Left:65430,XK_KP_Up:65431,XK_KP_Right:65432,XK_KP_Down:65433,XK_KP_Prior:65434,XK_KP_Page_Up:65434,XK_KP_Next:65435,XK_KP_Page_Down:65435,XK_KP_End:65436,XK_KP_Begin:65437,XK_KP_Insert:65438,XK_KP_Delete:65439,XK_KP_Equal:65469,XK_KP_Multiply:65450,XK_KP_Add:65451,XK_KP_Separator:65452,XK_KP_Subtract:65453,XK_KP_Decimal:65454,XK_KP_Divide:65455,XK_KP_0:65456,XK_KP_1:65457,XK_KP_2:65458,XK_KP_3:65459,XK_KP_4:65460,XK_KP_5:65461,XK_KP_6:65462,XK_KP_7:65463,XK_KP_8:65464,XK_KP_9:65465,XK_F1:65470,XK_F2:65471,XK_F3:65472,XK_F4:65473,XK_F5:65474,XK_F6:65475,XK_F7:65476,XK_F8:65477,XK_F9:65478,XK_F10:65479,XK_F11:65480,XK_L1:65480,XK_F12:65481,XK_L2:65481,XK_F13:65482,XK_L3:65482,XK_F14:65483,XK_L4:65483,XK_F15:65484,XK_L5:65484,XK_F16:65485,XK_L6:65485,XK_F17:65486,XK_L7:65486,XK_F18:65487,XK_L8:65487,XK_F19:65488,XK_L9:65488,XK_F20:65489,XK_L10:65489,XK_F21:65490,XK_R1:65490,XK_F22:65491,XK_R2:65491,XK_F23:65492,XK_R3:65492,XK_F24:65493,XK_R4:65493,XK_F25:65494,XK_R5:65494,XK_F26:65495,XK_R6:65495,XK_F27:65496,XK_R7:65496,XK_F28:65497,XK_R8:65497,XK_F29:65498,XK_R9:65498,XK_F30:65499,XK_R10:65499,XK_F31:65500,XK_R11:65500,XK_F32:65501,XK_R12:65501,XK_F33:65502,XK_R13:65502,XK_F34:65503,XK_R14:65503,XK_F35:65504,XK_R15:65504,XK_Shift_L:65505,XK_Shift_R:65506,XK_Control_L:65507,XK_Control_R:65508,XK_Caps_Lock:65509,XK_Shift_Lock:65510,XK_Meta_L:65511,XK_Meta_R:65512,XK_Alt_L:65513,XK_Alt_R:65514,XK_Super_L:65515,XK_Super_R:65516,XK_Hyper_L:65517,XK_Hyper_R:65518,XK_ISO_Level3_Shift:65027,XK_ISO_Next_Group:65032,XK_ISO_Prev_Group:65034,XK_ISO_First_Group:65036,XK_ISO_Last_Group:65038,XK_space:32,XK_exclam:33,XK_quotedbl:34,XK_numbersign:35,XK_dollar:36,XK_percent:37,XK_ampersand:38,XK_apostrophe:39,XK_quoteright:39,XK_parenleft:40,XK_parenright:41,XK_asterisk:42,XK_plus:43,XK_comma:44,XK_minus:45,XK_period:46,XK_slash:47,XK_0:48,XK_1:49,XK_2:50,XK_3:51,XK_4:52,XK_5:53,XK_6:54,XK_7:55,XK_8:56,XK_9:57,XK_colon:58,XK_semicolon:59,XK_less:60,XK_equal:61,XK_greater:62,XK_question:63,XK_at:64,XK_A:65,XK_B:66,XK_C:67,XK_D:68,XK_E:69,XK_F:70,XK_G:71,XK_H:72,XK_I:73,XK_J:74,XK_K:75,XK_L:76,XK_M:77,XK_N:78,XK_O:79,XK_P:80,XK_Q:81,XK_R:82,XK_S:83,XK_T:84,XK_U:85,XK_V:86,XK_W:87,XK_X:88,XK_Y:89,XK_Z:90,XK_bracketleft:91,XK_backslash:92,XK_bracketright:93,XK_asciicircum:94,XK_underscore:95,XK_grave:96,XK_quoteleft:96,XK_a:97,XK_b:98,XK_c:99,XK_d:100,XK_e:101,XK_f:102,XK_g:103,XK_h:104,XK_i:105,XK_j:106,XK_k:107,XK_l:108,XK_m:109,XK_n:110,XK_o:111,XK_p:112,XK_q:113,XK_r:114,XK_s:115,XK_t:116,XK_u:117,XK_v:118,XK_w:119,XK_x:120,XK_y:121,XK_z:122,XK_braceleft:123,XK_bar:124,XK_braceright:125,XK_asciitilde:126,XK_nobreakspace:160,XK_exclamdown:161,XK_cent:162,XK_sterling:163,XK_currency:164,XK_yen:165,XK_brokenbar:166,XK_section:167,XK_diaeresis:168,XK_copyright:169,XK_ordfeminine:170,XK_guillemotleft:171,XK_notsign:172,XK_hyphen:173,XK_registered:174,XK_macron:175,XK_degree:176,XK_plusminus:177,XK_twosuperior:178,XK_threesuperior:179,XK_acute:180,XK_mu:181,XK_paragraph:182,XK_periodcentered:183,XK_cedilla:184,XK_onesuperior:185,XK_masculine:186,XK_guillemotright:187,XK_onequarter:188,XK_onehalf:189,XK_threequarters:190,XK_questiondown:191,XK_Agrave:192,XK_Aacute:193,XK_Acircumflex:194,XK_Atilde:195,XK_Adiaeresis:196,XK_Aring:197,XK_AE:198,XK_Ccedilla:199,XK_Egrave:200,XK_Eacute:201,XK_Ecircumflex:202,XK_Ediaeresis:203,XK_Igrave:204,XK_Iacute:205,XK_Icircumflex:206,XK_Idiaeresis:207,XK_ETH:208,XK_Eth:208,XK_Ntilde:209,XK_Ograve:210,XK_Oacute:211,XK_Ocircumflex:212,XK_Otilde:213,XK_Odiaeresis:214,XK_multiply:215,XK_Oslash:216,XK_Ooblique:216,XK_Ugrave:217,XK_Uacute:218,XK_Ucircumflex:219,XK_Udiaeresis:220,XK_Yacute:221,XK_THORN:222,XK_Thorn:222,XK_ssharp:223,XK_agrave:224,XK_aacute:225,XK_acircumflex:226,XK_atilde:227,XK_adiaeresis:228,XK_aring:229,XK_ae:230,XK_ccedilla:231,XK_egrave:232,XK_eacute:233,XK_ecircumflex:234,XK_ediaeresis:235,XK_igrave:236,XK_iacute:237,XK_icircumflex:238,XK_idiaeresis:239,XK_eth:240,XK_ntilde:241,XK_ograve:242,XK_oacute:243,XK_ocircumflex:244,XK_otilde:245,XK_odiaeresis:246,XK_division:247,XK_oslash:248,XK_ooblique:248,XK_ugrave:249,XK_uacute:250,XK_ucircumflex:251,XK_udiaeresis:252,XK_yacute:253,XK_thorn:254,XK_ydiaeresis:255,XK_Hangul:65329,XK_Hangul_Hanja:65332,XK_Hangul_Jeonja:65336,XF86XK_ModeLock:269025025,XF86XK_MonBrightnessUp:269025026,XF86XK_MonBrightnessDown:269025027,XF86XK_KbdLightOnOff:269025028,XF86XK_KbdBrightnessUp:269025029,XF86XK_KbdBrightnessDown:269025030,XF86XK_Standby:269025040,XF86XK_AudioLowerVolume:269025041,XF86XK_AudioMute:269025042,XF86XK_AudioRaiseVolume:269025043,XF86XK_AudioPlay:269025044,XF86XK_AudioStop:269025045,XF86XK_AudioPrev:269025046,XF86XK_AudioNext:269025047,XF86XK_HomePage:269025048,XF86XK_Mail:269025049,XF86XK_Start:269025050,XF86XK_Search:269025051,XF86XK_AudioRecord:269025052,XF86XK_Calculator:269025053,XF86XK_Memo:269025054,XF86XK_ToDoList:269025055,XF86XK_Calendar:269025056,XF86XK_PowerDown:269025057,XF86XK_ContrastAdjust:269025058,XF86XK_RockerUp:269025059,XF86XK_RockerDown:269025060,XF86XK_RockerEnter:269025061,XF86XK_Back:269025062,XF86XK_Forward:269025063,XF86XK_Stop:269025064,XF86XK_Refresh:269025065,XF86XK_PowerOff:269025066,XF86XK_WakeUp:269025067,XF86XK_Eject:269025068,XF86XK_ScreenSaver:269025069,XF86XK_WWW:269025070,XF86XK_Sleep:269025071,XF86XK_Favorites:269025072,XF86XK_AudioPause:269025073,XF86XK_AudioMedia:269025074,XF86XK_MyComputer:269025075,XF86XK_VendorHome:269025076,XF86XK_LightBulb:269025077,XF86XK_Shop:269025078,XF86XK_History:269025079,XF86XK_OpenURL:269025080,XF86XK_AddFavorite:269025081,XF86XK_HotLinks:269025082,XF86XK_BrightnessAdjust:269025083,XF86XK_Finance:269025084,XF86XK_Community:269025085,XF86XK_AudioRewind:269025086,XF86XK_BackForward:269025087,XF86XK_Launch0:269025088,XF86XK_Launch1:269025089,XF86XK_Launch2:269025090,XF86XK_Launch3:269025091,XF86XK_Launch4:269025092,XF86XK_Launch5:269025093,XF86XK_Launch6:269025094,XF86XK_Launch7:269025095,XF86XK_Launch8:269025096,XF86XK_Launch9:269025097,XF86XK_LaunchA:269025098,XF86XK_LaunchB:269025099,XF86XK_LaunchC:269025100,XF86XK_LaunchD:269025101,XF86XK_LaunchE:269025102,XF86XK_LaunchF:269025103,XF86XK_ApplicationLeft:269025104,XF86XK_ApplicationRight:269025105,XF86XK_Book:269025106,XF86XK_CD:269025107,XF86XK_Calculater:269025108,XF86XK_Clear:269025109,XF86XK_Close:269025110,XF86XK_Copy:269025111,XF86XK_Cut:269025112,XF86XK_Display:269025113,XF86XK_DOS:269025114,XF86XK_Documents:269025115,XF86XK_Excel:269025116,XF86XK_Explorer:269025117,XF86XK_Game:269025118,XF86XK_Go:269025119,XF86XK_iTouch:269025120,XF86XK_LogOff:269025121,XF86XK_Market:269025122,XF86XK_Meeting:269025123,XF86XK_MenuKB:269025125,XF86XK_MenuPB:269025126,XF86XK_MySites:269025127,XF86XK_New:269025128,XF86XK_News:269025129,XF86XK_OfficeHome:269025130,XF86XK_Open:269025131,XF86XK_Option:269025132,XF86XK_Paste:269025133,XF86XK_Phone:269025134,XF86XK_Q:269025136,XF86XK_Reply:269025138,XF86XK_Reload:269025139,XF86XK_RotateWindows:269025140,XF86XK_RotationPB:269025141,XF86XK_RotationKB:269025142,XF86XK_Save:269025143,XF86XK_ScrollUp:269025144,XF86XK_ScrollDown:269025145,XF86XK_ScrollClick:269025146,XF86XK_Send:269025147,XF86XK_Spell:269025148,XF86XK_SplitScreen:269025149,XF86XK_Support:269025150,XF86XK_TaskPane:269025151,XF86XK_Terminal:269025152,XF86XK_Tools:269025153,XF86XK_Travel:269025154,XF86XK_UserPB:269025156,XF86XK_User1KB:269025157,XF86XK_User2KB:269025158,XF86XK_Video:269025159,XF86XK_WheelButton:269025160,XF86XK_Word:269025161,XF86XK_Xfer:269025162,XF86XK_ZoomIn:269025163,XF86XK_ZoomOut:269025164,XF86XK_Away:269025165,XF86XK_Messenger:269025166,XF86XK_WebCam:269025167,XF86XK_MailForward:269025168,XF86XK_Pictures:269025169,XF86XK_Music:269025170,XF86XK_Battery:269025171,XF86XK_Bluetooth:269025172,XF86XK_WLAN:269025173,XF86XK_UWB:269025174,XF86XK_AudioForward:269025175,XF86XK_AudioRepeat:269025176,XF86XK_AudioRandomPlay:269025177,XF86XK_Subtitle:269025178,XF86XK_AudioCycleTrack:269025179,XF86XK_CycleAngle:269025180,XF86XK_FrameBack:269025181,XF86XK_FrameForward:269025182,XF86XK_Time:269025183,XF86XK_Select:269025184,XF86XK_View:269025185,XF86XK_TopMenu:269025186,XF86XK_Red:269025187,XF86XK_Green:269025188,XF86XK_Yellow:269025189,XF86XK_Blue:269025190,XF86XK_Suspend:269025191,XF86XK_Hibernate:269025192,XF86XK_TouchpadToggle:269025193,XF86XK_TouchpadOn:269025200,XF86XK_TouchpadOff:269025201,XF86XK_AudioMicMute:269025202,XF86XK_Switch_VT_1:269024769,XF86XK_Switch_VT_2:269024770,XF86XK_Switch_VT_3:269024771,XF86XK_Switch_VT_4:269024772,XF86XK_Switch_VT_5:269024773,XF86XK_Switch_VT_6:269024774,XF86XK_Switch_VT_7:269024775,XF86XK_Switch_VT_8:269024776,XF86XK_Switch_VT_9:269024777,XF86XK_Switch_VT_10:269024778,XF86XK_Switch_VT_11:269024779,XF86XK_Switch_VT_12:269024780,XF86XK_Ungrab:269024800,XF86XK_ClearGrab:269024801,XF86XK_Next_VMode:269024802,XF86XK_Prev_VMode:269024803,XF86XK_LogWindowTree:269024804,XF86XK_LogGrabInfo:269024805},I={256:960,257:992,258:451,259:483,260:417,261:433,262:454,263:486,264:710,265:742,266:709,267:741,268:456,269:488,270:463,271:495,272:464,273:496,274:938,275:954,278:972,279:1004,280:458,281:490,282:460,283:492,284:728,285:760,286:683,287:699,288:725,289:757,290:939,291:955,292:678,293:694,294:673,295:689,296:933,297:949,298:975,299:1007,302:967,303:999,304:681,305:697,308:684,309:700,310:979,311:1011,312:930,313:453,314:485,315:934,316:950,317:421,318:437,321:419,322:435,323:465,324:497,325:977,326:1009,327:466,328:498,330:957,331:959,332:978,333:1010,336:469,337:501,338:5052,339:5053,340:448,341:480,342:931,343:947,344:472,345:504,346:422,347:438,348:734,349:766,350:426,351:442,352:425,353:441,354:478,355:510,356:427,357:443,358:940,359:956,360:989,361:1021,362:990,363:1022,364:733,365:765,366:473,367:505,368:475,369:507,370:985,371:1017,376:5054,377:428,378:444,379:431,380:447,381:430,382:446,402:2294,466:16777681,711:439,728:418,729:511,731:434,733:445,901:1966,902:1953,904:1954,905:1955,906:1956,908:1959,910:1960,911:1963,912:1974,913:1985,914:1986,915:1987,916:1988,917:1989,918:1990,919:1991,920:1992,921:1993,922:1994,923:1995,924:1996,925:1997,926:1998,927:1999,928:2e3,929:2001,931:2002,932:2004,933:2005,934:2006,935:2007,936:2008,937:2009,938:1957,939:1961,940:1969,941:1970,942:1971,943:1972,944:1978,945:2017,946:2018,947:2019,948:2020,949:2021,950:2022,951:2023,952:2024,953:2025,954:2026,955:2027,956:2028,957:2029,958:2030,959:2031,960:2032,961:2033,962:2035,963:2034,964:2036,965:2037,966:2038,967:2039,968:2040,969:2041,970:1973,971:1977,972:1975,973:1976,974:1979,1025:1715,1026:1713,1027:1714,1028:1716,1029:1717,1030:1718,1031:1719,1032:1720,1033:1721,1034:1722,1035:1723,1036:1724,1038:1726,1039:1727,1040:1761,1041:1762,1042:1783,1043:1767,1044:1764,1045:1765,1046:1782,1047:1786,1048:1769,1049:1770,1050:1771,1051:1772,1052:1773,1053:1774,1054:1775,1055:1776,1056:1778,1057:1779,1058:1780,1059:1781,1060:1766,1061:1768,1062:1763,1063:1790,1064:1787,1065:1789,1066:1791,1067:1785,1068:1784,1069:1788,1070:1760,1071:1777,1072:1729,1073:1730,1074:1751,1075:1735,1076:1732,1077:1733,1078:1750,1079:1754,1080:1737,1081:1738,1082:1739,1083:1740,1084:1741,1085:1742,1086:1743,1087:1744,1088:1746,1089:1747,1090:1748,1091:1749,1092:1734,1093:1736,1094:1731,1095:1758,1096:1755,1097:1757,1098:1759,1099:1753,1100:1752,1101:1756,1102:1728,1103:1745,1105:1699,1106:1697,1107:1698,1108:1700,1109:1701,1110:1702,1111:1703,1112:1704,1113:1705,1114:1706,1115:1707,1116:1708,1118:1710,1119:1711,1168:1725,1169:1709,1488:3296,1489:3297,1490:3298,1491:3299,1492:3300,1493:3301,1494:3302,1495:3303,1496:3304,1497:3305,1498:3306,1499:3307,1500:3308,1501:3309,1502:3310,1503:3311,1504:3312,1505:3313,1506:3314,1507:3315,1508:3316,1509:3317,1510:3318,1511:3319,1512:3320,1513:3321,1514:3322,1548:1452,1563:1467,1567:1471,1569:1473,1570:1474,1571:1475,1572:1476,1573:1477,1574:1478,1575:1479,1576:1480,1577:1481,1578:1482,1579:1483,1580:1484,1581:1485,1582:1486,1583:1487,1584:1488,1585:1489,1586:1490,1587:1491,1588:1492,1589:1493,1590:1494,1591:1495,1592:1496,1593:1497,1594:1498,1600:1504,1601:1505,1602:1506,1603:1507,1604:1508,1605:1509,1606:1510,1607:1511,1608:1512,1609:1513,1610:1514,1611:1515,1612:1516,1613:1517,1614:1518,1615:1519,1616:1520,1617:1521,1618:1522,3585:3489,3586:3490,3587:3491,3588:3492,3589:3493,3590:3494,3591:3495,3592:3496,3593:3497,3594:3498,3595:3499,3596:3500,3597:3501,3598:3502,3599:3503,3600:3504,3601:3505,3602:3506,3603:3507,3604:3508,3605:3509,3606:3510,3607:3511,3608:3512,3609:3513,3610:3514,3611:3515,3612:3516,3613:3517,3614:3518,3615:3519,3616:3520,3617:3521,3618:3522,3619:3523,3620:3524,3621:3525,3622:3526,3623:3527,3624:3528,3625:3529,3626:3530,3627:3531,3628:3532,3629:3533,3630:3534,3631:3535,3632:3536,3633:3537,3634:3538,3635:3539,3636:3540,3637:3541,3638:3542,3639:3543,3640:3544,3641:3545,3642:3546,3647:3551,3648:3552,3649:3553,3650:3554,3651:3555,3652:3556,3653:3557,3654:3558,3655:3559,3656:3560,3657:3561,3658:3562,3659:3563,3660:3564,3661:3565,3664:3568,3665:3569,3666:3570,3667:3571,3668:3572,3669:3573,3670:3574,3671:3575,3672:3576,3673:3577,8194:2722,8195:2721,8196:2723,8197:2724,8199:2725,8200:2726,8201:2727,8202:2728,8210:2747,8211:2730,8212:2729,8213:1967,8215:3295,8216:2768,8217:2769,8218:2813,8220:2770,8221:2771,8222:2814,8224:2801,8225:2802,8226:2790,8229:2735,8230:2734,8240:2773,8242:2774,8243:2775,8248:2812,8254:1150,8361:3839,8364:8364,8453:2744,8470:1712,8471:2811,8478:2772,8482:2761,8531:2736,8532:2737,8533:2738,8534:2739,8535:2740,8536:2741,8537:2742,8538:2743,8539:2755,8540:2756,8541:2757,8542:2758,8592:2299,8593:2300,8594:2301,8595:2302,8658:2254,8660:2253,8706:2287,8711:2245,8728:3018,8730:2262,8733:2241,8734:2242,8743:2270,8744:2271,8745:2268,8746:2269,8747:2239,8756:2240,8764:2248,8771:2249,8773:16785992,8800:2237,8801:2255,8804:2236,8805:2238,8834:2266,8835:2267,8866:3068,8867:3036,8868:3010,8869:3022,8968:3027,8970:3012,8981:2810,8992:2212,8993:2213,9109:3020,9115:2219,9117:2220,9118:2221,9120:2222,9121:2215,9123:2216,9124:2217,9126:2218,9128:2223,9132:2224,9143:2209,9146:2543,9147:2544,9148:2546,9149:2547,9225:2530,9226:2533,9227:2537,9228:2531,9229:2532,9251:2732,9252:2536,9472:2211,9474:2214,9484:2210,9488:2539,9492:2541,9496:2538,9500:2548,9508:2549,9516:2551,9524:2550,9532:2542,9618:2529,9642:2791,9643:2785,9644:2779,9645:2786,9646:2783,9647:2767,9650:2792,9651:2787,9654:2781,9655:2765,9660:2793,9661:2788,9664:2780,9665:2764,9670:2528,9675:2766,9679:2782,9702:2784,9734:2789,9742:2809,9747:2762,9756:2794,9758:2795,9792:2808,9794:2807,9827:2796,9829:2798,9830:2797,9837:2806,9839:2805,10003:2803,10007:2804,10013:2777,10016:2800,10216:2748,10217:2750,12289:1188,12290:1185,12300:1186,12301:1187,12443:1246,12444:1247,12449:1191,12450:1201,12451:1192,12452:1202,12453:1193,12454:1203,12455:1194,12456:1204,12457:1195,12458:1205,12459:1206,12461:1207,12463:1208,12465:1209,12467:1210,12469:1211,12471:1212,12473:1213,12475:1214,12477:1215,12479:1216,12481:1217,12483:1199,12484:1218,12486:1219,12488:1220,12490:1221,12491:1222,12492:1223,12493:1224,12494:1225,12495:1226,12498:1227,12501:1228,12504:1229,12507:1230,12510:1231,12511:1232,12512:1233,12513:1234,12514:1235,12515:1196,12516:1236,12517:1197,12518:1237,12519:1198,12520:1238,12521:1239,12522:1240,12523:1241,12524:1242,12525:1243,12527:1244,12530:1190,12531:1245,12539:1189,12540:1200},Dt={lookup:function(e){if(e>=32&&e<=255)return e;let t=I[e];return t===void 0?16777216|e:t}},Ot={};(function(){function e(e,t){if(t===void 0)throw Error(`Undefined keysym for key "`+e+`"`);if(e in Ot)throw Error(`Duplicate entry for key "`+e+`"`);Ot[e]=[t,t,t,t]}function t(e,t,n){if(t===void 0||n===void 0)throw Error(`Undefined keysym for key "`+e+`"`);if(e in Ot)throw Error(`Duplicate entry for key "`+e+`"`);Ot[e]=[t,t,n,t]}function n(e,t,n){if(t===void 0||n===void 0)throw Error(`Undefined keysym for key "`+e+`"`);if(e in Ot)throw Error(`Duplicate entry for key "`+e+`"`);Ot[e]=[t,t,t,n]}t(`Alt`,F.XK_Alt_L,F.XK_Alt_R),e(`AltGraph`,F.XK_ISO_Level3_Shift),e(`CapsLock`,F.XK_Caps_Lock),t(`Control`,F.XK_Control_L,F.XK_Control_R),t(`Meta`,F.XK_Super_L,F.XK_Super_R),e(`NumLock`,F.XK_Num_Lock),e(`ScrollLock`,F.XK_Scroll_Lock),t(`Shift`,F.XK_Shift_L,F.XK_Shift_R),n(`Enter`,F.XK_Return,F.XK_KP_Enter),e(`Tab`,F.XK_Tab),n(` `,F.XK_space,F.XK_KP_Space),n(`ArrowDown`,F.XK_Down,F.XK_KP_Down),n(`ArrowLeft`,F.XK_Left,F.XK_KP_Left),n(`ArrowRight`,F.XK_Right,F.XK_KP_Right),n(`ArrowUp`,F.XK_Up,F.XK_KP_Up),n(`End`,F.XK_End,F.XK_KP_End),n(`Home`,F.XK_Home,F.XK_KP_Home),n(`PageDown`,F.XK_Next,F.XK_KP_Next),n(`PageUp`,F.XK_Prior,F.XK_KP_Prior),e(`Backspace`,F.XK_BackSpace),n(`Clear`,F.XK_Clear,F.XK_KP_Begin),e(`Copy`,F.XF86XK_Copy),e(`Cut`,F.XF86XK_Cut),n(`Delete`,F.XK_Delete,F.XK_KP_Delete),n(`Insert`,F.XK_Insert,F.XK_KP_Insert),e(`Paste`,F.XF86XK_Paste),e(`Redo`,F.XK_Redo),e(`Undo`,F.XK_Undo),e(`Cancel`,F.XK_Cancel),e(`ContextMenu`,F.XK_Menu),e(`Escape`,F.XK_Escape),e(`Execute`,F.XK_Execute),e(`Find`,F.XK_Find),e(`Help`,F.XK_Help),e(`Pause`,F.XK_Pause),e(`Select`,F.XK_Select),e(`ZoomIn`,F.XF86XK_ZoomIn),e(`ZoomOut`,F.XF86XK_ZoomOut),e(`BrightnessDown`,F.XF86XK_MonBrightnessDown),e(`BrightnessUp`,F.XF86XK_MonBrightnessUp),e(`Eject`,F.XF86XK_Eject),e(`LogOff`,F.XF86XK_LogOff),e(`Power`,F.XF86XK_PowerOff),e(`PowerOff`,F.XF86XK_PowerDown),e(`PrintScreen`,F.XK_Print),e(`Hibernate`,F.XF86XK_Hibernate),e(`Standby`,F.XF86XK_Standby),e(`WakeUp`,F.XF86XK_WakeUp),e(`AllCandidates`,F.XK_MultipleCandidate),e(`Alphanumeric`,F.XK_Eisu_toggle),e(`CodeInput`,F.XK_Codeinput),e(`Compose`,F.XK_Multi_key),e(`Convert`,F.XK_Henkan),e(`GroupFirst`,F.XK_ISO_First_Group),e(`GroupLast`,F.XK_ISO_Last_Group),e(`GroupNext`,F.XK_ISO_Next_Group),e(`GroupPrevious`,F.XK_ISO_Prev_Group),e(`NonConvert`,F.XK_Muhenkan),e(`PreviousCandidate`,F.XK_PreviousCandidate),e(`SingleCandidate`,F.XK_SingleCandidate),e(`HangulMode`,F.XK_Hangul),e(`HanjaMode`,F.XK_Hangul_Hanja),e(`JunjaMode`,F.XK_Hangul_Jeonja),e(`Eisu`,F.XK_Eisu_toggle),e(`Hankaku`,F.XK_Hankaku),e(`Hiragana`,F.XK_Hiragana),e(`HiraganaKatakana`,F.XK_Hiragana_Katakana),e(`KanaMode`,F.XK_Kana_Shift),e(`KanjiMode`,F.XK_Kanji),e(`Katakana`,F.XK_Katakana),e(`Romaji`,F.XK_Romaji),e(`Zenkaku`,F.XK_Zenkaku),e(`ZenkakuHankaku`,F.XK_Zenkaku_Hankaku),e(`F1`,F.XK_F1),e(`F2`,F.XK_F2),e(`F3`,F.XK_F3),e(`F4`,F.XK_F4),e(`F5`,F.XK_F5),e(`F6`,F.XK_F6),e(`F7`,F.XK_F7),e(`F8`,F.XK_F8),e(`F9`,F.XK_F9),e(`F10`,F.XK_F10),e(`F11`,F.XK_F11),e(`F12`,F.XK_F12),e(`F13`,F.XK_F13),e(`F14`,F.XK_F14),e(`F15`,F.XK_F15),e(`F16`,F.XK_F16),e(`F17`,F.XK_F17),e(`F18`,F.XK_F18),e(`F19`,F.XK_F19),e(`F20`,F.XK_F20),e(`F21`,F.XK_F21),e(`F22`,F.XK_F22),e(`F23`,F.XK_F23),e(`F24`,F.XK_F24),e(`F25`,F.XK_F25),e(`F26`,F.XK_F26),e(`F27`,F.XK_F27),e(`F28`,F.XK_F28),e(`F29`,F.XK_F29),e(`F30`,F.XK_F30),e(`F31`,F.XK_F31),e(`F32`,F.XK_F32),e(`F33`,F.XK_F33),e(`F34`,F.XK_F34),e(`F35`,F.XK_F35),e(`Close`,F.XF86XK_Close),e(`MailForward`,F.XF86XK_MailForward),e(`MailReply`,F.XF86XK_Reply),e(`MailSend`,F.XF86XK_Send),e(`MediaFastForward`,F.XF86XK_AudioForward),e(`MediaPause`,F.XF86XK_AudioPause),e(`MediaPlay`,F.XF86XK_AudioPlay),e(`MediaRecord`,F.XF86XK_AudioRecord),e(`MediaRewind`,F.XF86XK_AudioRewind),e(`MediaStop`,F.XF86XK_AudioStop),e(`MediaTrackNext`,F.XF86XK_AudioNext),e(`MediaTrackPrevious`,F.XF86XK_AudioPrev),e(`New`,F.XF86XK_New),e(`Open`,F.XF86XK_Open),e(`Print`,F.XK_Print),e(`Save`,F.XF86XK_Save),e(`SpellCheck`,F.XF86XK_Spell),e(`AudioVolumeDown`,F.XF86XK_AudioLowerVolume),e(`AudioVolumeUp`,F.XF86XK_AudioRaiseVolume),e(`AudioVolumeMute`,F.XF86XK_AudioMute),e(`MicrophoneVolumeMute`,F.XF86XK_AudioMicMute),e(`LaunchApplication1`,F.XF86XK_MyComputer),e(`LaunchApplication2`,F.XF86XK_Calculator),e(`LaunchCalendar`,F.XF86XK_Calendar),e(`LaunchMail`,F.XF86XK_Mail),e(`LaunchMediaPlayer`,F.XF86XK_AudioMedia),e(`LaunchMusicPlayer`,F.XF86XK_Music),e(`LaunchPhone`,F.XF86XK_Phone),e(`LaunchScreenSaver`,F.XF86XK_ScreenSaver),e(`LaunchSpreadsheet`,F.XF86XK_Excel),e(`LaunchWebBrowser`,F.XF86XK_WWW),e(`LaunchWebCam`,F.XF86XK_WebCam),e(`LaunchWordProcessor`,F.XF86XK_Word),e(`BrowserBack`,F.XF86XK_Back),e(`BrowserFavorites`,F.XF86XK_Favorites),e(`BrowserForward`,F.XF86XK_Forward),e(`BrowserHome`,F.XF86XK_HomePage),e(`BrowserRefresh`,F.XF86XK_Refresh),e(`BrowserSearch`,F.XF86XK_Search),e(`BrowserStop`,F.XF86XK_Stop),e(`Dimmer`,F.XF86XK_BrightnessAdjust),e(`MediaAudioTrack`,F.XF86XK_AudioCycleTrack),e(`RandomToggle`,F.XF86XK_AudioRandomPlay),e(`SplitScreenToggle`,F.XF86XK_SplitScreen),e(`Subtitle`,F.XF86XK_Subtitle),e(`VideoModeNext`,F.XF86XK_Next_VMode),n(`=`,F.XK_equal,F.XK_KP_Equal),n(`+`,F.XK_plus,F.XK_KP_Add),n(`-`,F.XK_minus,F.XK_KP_Subtract),n(`*`,F.XK_asterisk,F.XK_KP_Multiply),n(`/`,F.XK_slash,F.XK_KP_Divide),n(`.`,F.XK_period,F.XK_KP_Decimal),n(`,`,F.XK_comma,F.XK_KP_Separator),n(`0`,F.XK_0,F.XK_KP_0),n(`1`,F.XK_1,F.XK_KP_1),n(`2`,F.XK_2,F.XK_KP_2),n(`3`,F.XK_3,F.XK_KP_3),n(`4`,F.XK_4,F.XK_KP_4),n(`5`,F.XK_5,F.XK_KP_5),n(`6`,F.XK_6,F.XK_KP_6),n(`7`,F.XK_7,F.XK_KP_7),n(`8`,F.XK_8,F.XK_KP_8),n(`9`,F.XK_9,F.XK_KP_9)})();var kt={8:`Backspace`,9:`Tab`,10:`NumpadClear`,13:`Enter`,16:`ShiftLeft`,17:`ControlLeft`,18:`AltLeft`,19:`Pause`,20:`CapsLock`,21:`Lang1`,25:`Lang2`,27:`Escape`,28:`Convert`,29:`NonConvert`,32:`Space`,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,41:`Select`,44:`PrintScreen`,45:`Insert`,46:`Delete`,47:`Help`,48:`Digit0`,49:`Digit1`,50:`Digit2`,51:`Digit3`,52:`Digit4`,53:`Digit5`,54:`Digit6`,55:`Digit7`,56:`Digit8`,57:`Digit9`,91:`MetaLeft`,92:`MetaRight`,93:`ContextMenu`,95:`Sleep`,96:`Numpad0`,97:`Numpad1`,98:`Numpad2`,99:`Numpad3`,100:`Numpad4`,101:`Numpad5`,102:`Numpad6`,103:`Numpad7`,104:`Numpad8`,105:`Numpad9`,106:`NumpadMultiply`,107:`NumpadAdd`,108:`NumpadDecimal`,109:`NumpadSubtract`,110:`NumpadDecimal`,111:`NumpadDivide`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,124:`F13`,125:`F14`,126:`F15`,127:`F16`,128:`F17`,129:`F18`,130:`F19`,131:`F20`,132:`F21`,133:`F22`,134:`F23`,135:`F24`,144:`NumLock`,145:`ScrollLock`,166:`BrowserBack`,167:`BrowserForward`,168:`BrowserRefresh`,169:`BrowserStop`,170:`BrowserSearch`,171:`BrowserFavorites`,172:`BrowserHome`,173:`AudioVolumeMute`,174:`AudioVolumeDown`,175:`AudioVolumeUp`,176:`MediaTrackNext`,177:`MediaTrackPrevious`,178:`MediaStop`,179:`MediaPlayPause`,180:`LaunchMail`,181:`MediaSelect`,182:`LaunchApp1`,183:`LaunchApp2`,225:`AltRight`},At={Backspace:`Backspace`,AltLeft:`Alt`,AltRight:`Alt`,CapsLock:`CapsLock`,ContextMenu:`ContextMenu`,ControlLeft:`Control`,ControlRight:`Control`,Enter:`Enter`,MetaLeft:`Meta`,MetaRight:`Meta`,ShiftLeft:`Shift`,ShiftRight:`Shift`,Tab:`Tab`,Delete:`Delete`,End:`End`,Help:`Help`,Home:`Home`,Insert:`Insert`,PageDown:`PageDown`,PageUp:`PageUp`,ArrowDown:`ArrowDown`,ArrowLeft:`ArrowLeft`,ArrowRight:`ArrowRight`,ArrowUp:`ArrowUp`,NumLock:`NumLock`,NumpadBackspace:`Backspace`,NumpadClear:`Clear`,Escape:`Escape`,F1:`F1`,F2:`F2`,F3:`F3`,F4:`F4`,F5:`F5`,F6:`F6`,F7:`F7`,F8:`F8`,F9:`F9`,F10:`F10`,F11:`F11`,F12:`F12`,F13:`F13`,F14:`F14`,F15:`F15`,F16:`F16`,F17:`F17`,F18:`F18`,F19:`F19`,F20:`F20`,F21:`F21`,F22:`F22`,F23:`F23`,F24:`F24`,F25:`F25`,F26:`F26`,F27:`F27`,F28:`F28`,F29:`F29`,F30:`F30`,F31:`F31`,F32:`F32`,F33:`F33`,F34:`F34`,F35:`F35`,PrintScreen:`PrintScreen`,ScrollLock:`ScrollLock`,Pause:`Pause`,BrowserBack:`BrowserBack`,BrowserFavorites:`BrowserFavorites`,BrowserForward:`BrowserForward`,BrowserHome:`BrowserHome`,BrowserRefresh:`BrowserRefresh`,BrowserSearch:`BrowserSearch`,BrowserStop:`BrowserStop`,Eject:`Eject`,LaunchApp1:`LaunchMyComputer`,LaunchApp2:`LaunchCalendar`,LaunchMail:`LaunchMail`,MediaPlayPause:`MediaPlay`,MediaStop:`MediaStop`,MediaTrackNext:`MediaTrackNext`,MediaTrackPrevious:`MediaTrackPrevious`,Power:`Power`,Sleep:`Sleep`,AudioVolumeDown:`AudioVolumeDown`,AudioVolumeMute:`AudioVolumeMute`,AudioVolumeUp:`AudioVolumeUp`,WakeUp:`WakeUp`},L={isMac:function(){return/Mac|iPod|iPhone|iPad/.test(navigator.platform)},isIOS:function(){return/iPod|iPhone|iPad/.test(navigator.platform)},isWindows:function(){return/Win/.test(navigator.platform)},isLinux:function(){return/Linux/.test(navigator.platform)},isMacDesktop:ke,hasTextInput:function(){return typeof window.TextEvent==`function`},isChrome:function(){return(navigator.userAgentData&&navigator.userAgentData.brands||[]).some(e=>/Chromium|Google Chrome/.test(e.brand))?!0:!!window.chrome&&(!!window.chrome.webstore||!!window.chrome.runtime)},isSafari:function(){return/Safari/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)},isFirefox:function(){return/Firefox\//.test(navigator.userAgent)}},R=[`ControlLeft`,`ControlRight`,`MetaLeft`,`MetaRight`];function jt(e){return e===F.XK_Control_L||e===F.XK_Control_R||e===F.XK_Alt_L||e===F.XK_Alt_R||e===F.XK_Super_L||e===F.XK_Super_R||e===F.XK_Meta_L||e===F.XK_Meta_R}var Mt={[F.XK_Shift_L]:`Shift`,[F.XK_Shift_R]:`Shift`,[F.XK_Control_L]:`Control`,[F.XK_Control_R]:`Control`,[F.XK_Alt_L]:`Alt`,[F.XK_Alt_R]:`Alt`,[F.XK_Meta_L]:`Meta`,[F.XK_Meta_R]:`Meta`,[F.XK_Super_L]:`Meta`,[F.XK_Super_R]:`Meta`,[F.XK_ISO_Level3_Shift]:`Alt`,[F.XK_Mode_switch]:`Alt`},Nt={[F.XK_KP_Space]:F.XK_space,[F.XK_KP_Enter]:F.XK_Return,[F.XK_KP_Equal]:F.XK_equal,[F.XK_KP_Multiply]:F.XK_asterisk,[F.XK_KP_Add]:F.XK_plus,[F.XK_KP_Separator]:F.XK_comma,[F.XK_KP_Subtract]:F.XK_minus,[F.XK_KP_Decimal]:F.XK_period,[F.XK_KP_Divide]:F.XK_slash,[F.XK_KP_0]:F.XK_0,[F.XK_KP_1]:F.XK_1,[F.XK_KP_2]:F.XK_2,[F.XK_KP_3]:F.XK_3,[F.XK_KP_4]:F.XK_4,[F.XK_KP_5]:F.XK_5,[F.XK_KP_6]:F.XK_6,[F.XK_KP_7]:F.XK_7,[F.XK_KP_8]:F.XK_8,[F.XK_KP_9]:F.XK_9},Pt={[F.XK_KP_Home]:F.XK_Home,[F.XK_KP_Up]:F.XK_Up,[F.XK_KP_Page_Up]:F.XK_Page_Up,[F.XK_KP_Prior]:F.XK_Prior,[F.XK_KP_Left]:F.XK_Left,[F.XK_KP_Begin]:F.XK_Clear,[F.XK_KP_Right]:F.XK_Right,[F.XK_KP_End]:F.XK_End,[F.XK_KP_Down]:F.XK_Down,[F.XK_KP_Page_Down]:F.XK_Page_Down,[F.XK_KP_Next]:F.XK_Next,[F.XK_KP_Insert]:F.XK_Insert,[F.XK_KP_Delete]:F.XK_Delete,[F.XK_KP_Enter]:F.XK_Return},z={getKeyCode:function(e){if(e.code){switch(e.code){case`OSLeft`:return`MetaLeft`;case`OSRight`:return`MetaRight`}return e.code}if(e.keyCode in kt){let t=kt[e.keyCode];if(L.isMac()&&t===`ContextMenu`&&(t=`MetaRight`),e.location===2)switch(t){case`ShiftLeft`:return`ShiftRight`;case`ControlLeft`:return`ControlRight`;case`AltLeft`:return`AltRight`}if(e.location===3)switch(t){case`Delete`:return`NumpadDecimal`;case`Insert`:return`Numpad0`;case`End`:return`Numpad1`;case`ArrowDown`:return`Numpad2`;case`PageDown`:return`Numpad3`;case`ArrowLeft`:return`Numpad4`;case`ArrowRight`:return`Numpad6`;case`Home`:return`Numpad7`;case`ArrowUp`:return`Numpad8`;case`PageUp`:return`Numpad9`;case`Enter`:return`NumpadEnter`}return t}return`Unidentified`},getKey:function(e){if(e.key!==void 0&&e.key!==`Unidentified`&&e.key!==`Dead`){switch(e.key){case`OS`:return`Meta`;case`LaunchMyComputer`:return`LaunchApplication1`;case`LaunchCalculator`:return`LaunchApplication2`;case`UIKeyInputUpArrow`:return`ArrowUp`;case`UIKeyInputDownArrow`:return`ArrowDown`;case`UIKeyInputLeftArrow`:return`ArrowLeft`;case`UIKeyInputRightArrow`:return`ArrowRight`;case`UIKeyInputEscape`:return`Escape`}return e.key===`\0`&&z.getKeyCode(e)===`NumpadDecimal`?`Delete`:e.key}let t=z.getKeyCode(e);return t in At?At[t]:e.charCode?String.fromCharCode(e.charCode):`Unidentified`},getKeysym:function(e){let t=z.getKey(e);if(t===`Unidentified`)return null;if(t in Ot){let n=e.location;if((L.isSafari()&&t===`Meta`&&n===0||L.isChrome()&&t===`Meta`&&n===0&&z.getKeyCode(e)===`MetaRight`)&&(n=2),t===`Clear`&&n===3&&z.getKeyCode(e)===`NumLock`&&(n=0),(n===void 0||n>3)&&(n=0),t===`Meta`&&(L.isMac()||L.isIOS())){let t=z.getKeyCode(e);if(t===`AltLeft`)return F.XK_Meta_L;if(t===`AltRight`)return F.XK_Meta_R}if(t===`Clear`&&z.getKeyCode(e)===`NumLock`)return F.XK_Num_Lock;if(L.isWindows())switch(t){case`Zenkaku`:case`Hankaku`:return F.XK_Zenkaku_Hankaku;case`Romaji`:case`KanaMode`:return F.XK_Romaji}return Ot[t][n]}if(t.length!==1)return null;let n=t.charCodeAt();return n?Dt.lookup(n):null},getKeysymFromCode:function(e){if(!e)return null;if(/^Key[A-Z]$/.test(e))return Dt.lookup(e.charCodeAt(3)+32);if(/^Digit[0-9]$/.test(e))return Dt.lookup(e.charCodeAt(5));let t=/^F([1-9]|1[0-2])$/.exec(e);if(t)return F.XK_F1+(parseInt(t[1],10)-1);let n={Minus:45,Equal:61,BracketLeft:91,BracketRight:93,Backslash:92,Semicolon:59,Quote:39,Backquote:96,Comma:44,Period:46,Slash:47,Space:32};if(e in n)return Dt.lookup(n[e]);let r={Tab:F.XK_Tab,Enter:F.XK_Return,Backspace:F.XK_BackSpace,Delete:F.XK_Delete,Escape:F.XK_Escape,Insert:F.XK_Insert,Home:F.XK_Home,End:F.XK_End,PageUp:F.XK_Page_Up,PageDown:F.XK_Page_Down,ArrowUp:F.XK_Up,ArrowDown:F.XK_Down,ArrowLeft:F.XK_Left,ArrowRight:F.XK_Right};return e in r?r[e]:null}},B=function(e){e.stopPropagation(),e.preventDefault()},Ft=class e{constructor(t,n,r=!1,i=0,a=!1,o=null){this.element=t,this.send=n,this.sendMotion=null,this.motionBacklog=null,this._pointerSeq=0,this._isSidebarOpen=!1,this.isSharedMode=r,this.controllerSlots=gt(o),this.playerIndex=i,this.cursorDiv=document.createElement(`canvas`),this.cursorDiv.style.position=`fixed`,this.cursorDiv.style.pointerEvents=`none`,this.cursorDiv.style.zIndex=`999999`,this.cursorDiv.style.display=`none`,this.cursorDiv.style.left=`0px`,this.cursorDiv.style.top=`0px`,this.cursorDiv.style.willChange=`transform`,this.cursorImg=this.cursorDiv.getContext(`2d`),document.body.appendChild(this.cursorDiv),this.cursorHotspot={x:0,y:0},this._cursorImageBitmap=null,this._rawHotspotX=0,this._rawHotspotY=0,this.use_browser_cursors=!1,this._latestMouseX=0,this._latestMouseY=0,this.displayId=`primary`,this._echo=null,this._echoDeltas=[],this._echoComposited=!1,this.fingerScroll=!1,this._fingerScrollTimer=null,this._echoTimer=null,this._echoAsking=!1,this.useCssScaling=a,this._streamDensity=null,this.m=null,this._layout=null,this._anchorX=null,this._anchorY=null,this._chromeInsetX=null,this._chromeInsetY=null,this._sampleClientX=-1e9,this._sampleClientY=-1e9,this._sampleAnchorX=NaN,this._sampleAnchorY=NaN,this._geometryTimer=null,this.buttonMask=0,this.gamepadManager=null,this._gamepadAnnounced={},this.gamepadRumble=!0,this.x=0,this.y=0,this._relCarryX=0,this._relCarryY=0,this._pointerScaleFrame=null,this._pendingMove=null,this._moveFlushScheduled=!1,this._lastMotionSend=-1/0,this._rawMotionSeen=!1,this.onmenuhotkey=null,this.gamingMode=!1,this._fullscreenKeyboardLock=!1,this.shortcutsEnabled=!0,this._escapePresses=0,this._lastEscapeAt=0,this.ongamingmode=null,this.onnotice=null,this.onfullscreenhotkey=this.enterFullscreen,this.ongaminghotkey=this.toggleGamingMode,this.ongamepadhotkey=null,this.ongamepadconnected=null,this.ongamepaddisconnected=null,this.listeners=[],this.listeners_context=[],this._queue=new x,this._primaryAsSecondary=!1,this._allowThreshold=!0,this._wheelClassified=!1,this._smallestDeltaY=1e4,this._smallestLineDeltaY=1e4,this._scrollMagnitude=10,this._wheelAccumY=0,this._wheelDirY=null,this._wheelAccumX=0,this._wheelDirX=null,this._pinchCarry=0,this._lastWheelEventTs=0,this.cursorScaleFactor=null,this._cursorBase64Data=null,this._guacKeyboardID=e._nextGuacID++,this._EVENT_MARKER=`_GUAC_KEYBOARD_HANDLED_BY_`+this._guacKeyboardID,this._keyDownList={},this._keyHeartbeatTimer=null,this._KEY_HEARTBEAT_INTERVAL=100,this._altGrArmed=!1,this._altGrTimeout=null,this._altGrCtrlTime=0,this._isSynth=!1,this._altKeysymByCode=new Map,this.isComposing=!1,this.compositionString=``,this._pendingChord=null,this._momentaryChordMods=new Set,this._momentaryChordModsTimer=null,this._chordKeySent=!1,this._lastTextInputCommit=null,this.keyboardInputAssist=document.getElementById(`keyboard-input-assist`),this._assistTyped=``,this._assistComposing=!1,this._activeTouches=new Map,this._activeTouchIdentifier=null,this._isTwoFingerGesture=!1,this._twoFinger=null,this._TAP_THRESHOLD_DISTANCE_SQ=100,this._TAP_MAX_DURATION=250,this._trackpadMode=!1,this._trackpadTouches=new Map,this._trackpadGestureMode=null,this._trackpadReleaseTimer=null,this._trackpadHandoffAt=-1/0,this.trackpadSpeed=1,this.inputAttached=!1}setSharedMode(e){this.isSharedMode=!!e}updateControllerSlot(e){let t=gt(e);String(t)!==String(this.controllerSlots)&&(console.log(`Input class: Controller slots updated to: ${t}`),this.controllerSlots=t,this.gamepadManager&&(this.gamepadManager.setSlotCount(t?t.length:1),this.gamepadManager.reannounce()))}_handleVisibilityMessage(e){if(e.origin!==window.location.origin)return;let t=e.data;typeof t==`object`&&t&&t.type===`sidebarVisibilityChanged`&&(this._isSidebarOpen=!!t.isOpen)}static _asksRawMotion(){return e.rawPointerMotion&&!e._rawMotionRefused}static _viewportSettled(){let e=window.mozInnerScreenX,t=window.mozInnerScreenY;return typeof e!=`number`||typeof t!=`number`||Math.abs(e-window.screenX)<1&&Math.abs(t-window.screenY)<1}_drawAndScaleCursor(){if(!this._cursorImageBitmap)return;let e=this._cursorDensity(),t=this._cursorImageBitmap;this.cursorDiv.width=t.width,this.cursorDiv.height=t.height,this.cursorDiv.style.width=`${t.width/e}px`,this.cursorDiv.style.height=`${t.height/e}px`,this.cursorImg.clearRect(0,0,t.width,t.height),this.cursorImg.drawImage(t,0,0),this.cursorHotspot.x=this._rawHotspotX/e,this.cursorHotspot.y=this._rawHotspotY/e,this._trackpadMode?this._placeEchoCursor():this._updateCursorPosition(this._latestMouseX,this._latestMouseY)}_handleOutsideClick(e){this.use_browser_cursors||this._trackpadMode||this.element.contains(e.target)||(this.cursorDiv.style.display=`none`)}_updateCursorPosition(e,t){if(this.cursorDiv.style.display!==`none`){let n=e-this.cursorHotspot.x,r=t-this.cursorHotspot.y;this.cursorDiv.style.transform=`translate(${n}px, ${r}px)`}}_cursorImageSetFunction(){if(e._cursorImageSetFn===void 0&&(e._cursorImageSetFn=null,typeof CSS<`u`&&CSS.supports)){for(let t of[`image-set`,`-webkit-image-set`])if(CSS.supports(`cursor`,`${t}(url("data:image/png;base64,") 2x) 0 0, default`)){e._cursorImageSetFn=t;break}}return e._cursorImageSetFn}_updateBrowserCursor(){if(!this._cursorBase64Data){this.element.style.setProperty(`cursor`,`none`,`important`);return}let e=`url("data:image/png;base64,${this._cursorBase64Data}")`,t=this._cursorDensity(),n=`${e} ${this._rawHotspotX} ${this._rawHotspotY}, default`,r=t===1?null:this._cursorImageSetFunction();r&&(n=`${r}(${e} ${t}x) ${Math.round(this._rawHotspotX/t)} ${Math.round(this._rawHotspotY/t)}, default`),this.element.style.setProperty(`cursor`,n,`important`)}_cursorBitmapFromBase64(e){let t=Uint8Array.from(atob(e),e=>e.charCodeAt(0));return createImageBitmap(new Blob([t],{type:`image/png`}))}async updateServerCursor(e){!e.curdata||parseInt(e.handle,10)===0?(this._cursorImageBitmap=null,this._cursorBase64Data=null,this.cursorDiv.style.display=`none`,this.use_browser_cursors&&this.element.style.setProperty(`cursor`,`none`,`important`)):(this._rawHotspotX=parseInt(e.hotx)||0,this._rawHotspotY=parseInt(e.hoty)||0,this._cursorBase64Data=e.curdata,this._cursorImageBitmap=null,this.inputAttached?this._trackpadMode?(this._cursorImageBitmap=await this._cursorBitmapFromBase64(this._cursorBase64Data),this._drawAndScaleCursor()):this.use_browser_cursors?(this.cursorDiv.style.display=`none`,this._updateBrowserCursor()):(this._cursorImageBitmap=await this._cursorBitmapFromBase64(this._cursorBase64Data),this.element.style.setProperty(`cursor`,`none`,`important`),this.cursorDiv.style.display=`block`,this._drawAndScaleCursor()):(this.cursorDiv.style.display=`none`,this.element.style.cursor=`auto`))}setSynth(e){console.log(`Input: Synthetic mode ${e?`enabled`:`disabled`}.`),this._isSynth=e}updateCssScaling(e){this.useCssScaling!==e&&(console.log(`Input: Updating useCssScaling from ${this.useCssScaling} to ${e}`),this.useCssScaling=e,this._windowMath(),this._refreshCursorScale())}_sendKeyEvent(e,t,n){if(e===null)return;let r=e;if(Object.prototype.hasOwnProperty.call(Nt,e)?r=Nt[e]:Object.prototype.hasOwnProperty.call(Pt,e)&&(r=Pt[e]),n)this._keyDownList[t]=r;else{if(!(t in this._keyDownList))return;r=this._keyDownList[t],delete this._keyDownList[t]}this.send((n?`kd,`:`ku,`)+r),n?(this._noteChordKey(r),this._startKeyHeartbeat()):Object.keys(this._keyDownList).length===0&&this._stopKeyHeartbeat()}_startKeyHeartbeat(){this._keyHeartbeatTimer===null&&(this._keyHeartbeatTimer=setInterval(()=>{let e=Object.values(this._keyDownList);e.length===0?this._stopKeyHeartbeat():this.send(`kh,`+e.join(`,`))},this._KEY_HEARTBEAT_INTERVAL))}_stopKeyHeartbeat(){this._keyHeartbeatTimer!==null&&(clearInterval(this._keyHeartbeatTimer),this._keyHeartbeatTimer=null)}_sendMomentaryKey(e){e!==null&&(this._noteChordKey(e),this.send(`kd,`+e),this.send(`ku,`+e))}_noteChordKey(e){!jt(e)&&this._chordModifierHeld()&&(this._chordKeySent=!0)}_positionImeAnchor(e){
 if(!L.isMac()||!this.element)return;
 const box=this.element.getBoundingClientRect();
 if(box.width<24||box.height<24)return;
 if(e&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY))this._macImeAnchor={x:Math.max(0,Math.min(1,(e.clientX-box.left)/box.width)),y:Math.max(0,Math.min(1,(e.clientY-box.top)/box.height))};
 const anchor=this._macImeAnchor;if(!anchor)return;
 const x=Math.max(0,Math.min(box.width-24,anchor.x*box.width));
 const top=Math.max(0,Math.min(box.height-22,anchor.y*box.height-11));
 Object.assign(this.element.style,{boxSizing:'border-box',lineHeight:'22px',fontSize:'16px',textAlign:'left',paddingLeft:x+'px',paddingRight:'0px',paddingTop:top+'px',paddingBottom:Math.max(0,box.height-top-22)+'px'});
 this.element.scrollLeft=0;
}_focusCompositionHost(){let e=this.element;if(!e||typeof e.focus!=`function`)return;let t=document.activeElement;if(!t||t===document.body||t===e||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable)try{e.focus({preventScroll:!0})}catch{}}_releaseDesyncedModifiers(e){if(!(typeof e.getModifierState!=`function`||this._isSynth)&&!(this.isComposing||e.isComposing||e.keyCode===229||e.key===`Process`)){Ct(e)||this._altKeysymByCode.clear();for(let t in this._keyDownList){let n=this._keyDownList[t],r=St[t],i=Mt[n];(r||i)&&(wt(e,r)||wt(e,i)||this._releaseLostKey(t))}}}_releaseLostKey(e){this._sendKeyEvent(this._keyDownList[e],e,!1),L.isMac()&&St[e]===`Meta`&&this._releaseUnderCommand()}_releaseUnderCommand(){for(let e of Object.keys(this._keyDownList))St[e]||(console.log(`macOS: Force-releasing stuck key: ${e}`),this._sendKeyEvent(this._keyDownList[e],e,!1))}resetKeyboard(){this._stopKeyHeartbeat(),clearTimeout(this._altGrTimeout),this._altGrArmed=!1;for(let e in this._keyDownList)this._sendKeyEvent(this._keyDownList[e],e,!1);this._keyDownList={},this._altKeysymByCode.clear()}releaseInput(){this.resetKeyboard(),this._resetPointerState()}_resetPointerState(){this._activeTouches&&this._activeTouches.clear(),this._activeTouchIdentifier=null,this._isTwoFingerGesture=!1,this._twoFinger=null,this._longPressTimer&&(clearTimeout(this._longPressTimer),this._longPressTimer=null,this._longPressTouchIdentifier=null),clearTimeout(this._trackpadReleaseTimer),this._trackpadReleaseTimer=null,this._trackpadTouches&&this._trackpadTouches.clear(),this._trackpadGestureMode=null,this.buttonMask!==0&&(this.buttonMask=0,this._sendMouseState())}_forgetLiftedTouches(e,t){if(!e||!t.touches)return;let n=new Set(Array.from(t.touches,e=>e.identifier)),r=new Set(Array.from(t.changedTouches||[],e=>e.identifier));for(let t of e.keys())if(!n.has(t)&&!r.has(t)){this._resetPointerState();return}}_onVisibilityChange(){document.visibilityState===`hidden`&&this.releaseInput()}_guac_markEvent(e){return!e[this._EVENT_MARKER]&&(e[this._EVENT_MARKER]=!0,!0)}_handleKeyDown(t){if(this._escapeHatch(t)){B(t);return}if(t.ctrlKey&&t.shiftKey&&this.shortcutsEnabled){let e=null;if(t.code===`KeyM`&&!this.gamingMode?e=this.onmenuhotkey:t.code===`KeyF`&&document.fullscreenElement===null?e=this.onfullscreenhotkey:t.code===`KeyX`?e=this.ongaminghotkey:t.code===`KeyG`&&(e=this.ongamepadhotkey),e!==null&&this._guac_markEvent(t)){e.call(this),B(t);return}}if(this._targetHasClass(t.target,M)||!this._guac_markEvent(t))return;this._chordKeySent=!1,this._releaseDesyncedModifiers(t);let n=z.getKeyCode(t);if(n===`CapsLock`&&z.getKey(t)===`CapsLock`){B(t);return}if(n in this._keyDownList){if(t.repeat){B(t);return}this._releaseLostKey(n)}if(this.isComposing||t.isComposing||t.keyCode===229){let e=this._altGrArmed;if((t.ctrlKey||t.altKey||t.metaKey||e)&&t.key!==`Dead`&&!this._composesText(t)){let n=z.getKeysymFromCode(t.code);if(n){if(this.isComposing||t.isComposing)this._pendingChord={keysym:n,ctrl:t.ctrlKey||e,alt:t.altKey,meta:t.metaKey,shift:t.shiftKey,at:performance.now()};else{this._altGrArmed&&(this._altGrArmed=!1,clearTimeout(this._altGrTimeout));let r=this._missingChordModifiers({ctrl:t.ctrlKey||e,alt:t.altKey,meta:t.metaKey,shift:t.shiftKey});this._noteMomentaryChordMods(r);for(let e of r)this.send(`kd,`+e);this._sendMomentaryKey(n);for(let e of r.reverse())this.send(`ku,`+e)}}}B(t);return}let r=z.getKeyCode(t),i=z.getKeysym(t);if(this._altGrArmed&&(this._altGrArmed=!1,clearTimeout(this._altGrTimeout),r===`AltRight`&&t.timeStamp-this._altGrCtrlTime<50?i=F.XK_ISO_Level3_Shift:this._sendKeyEvent(F.XK_Control_L,`ControlLeft`,!0)),i!==null&&!this._composesText(t)&&(t.ctrlKey||t.metaKey||t.altKey)){let e=z.getKey(t);if(typeof e==`string`&&[...e].length===1&&e.codePointAt(0)>127){let e=z.getKeysymFromCode(t.code);e&&(i=e)}}if(r===`Unidentified`&&i){this._sendMomentaryKey(i),B(t);return}if(L.isMac()&&e.macCmdAsCtrl&&Et(t)&&(r===`Enter`||r===`NumpadEnter`)&&t.metaKey&&!t.ctrlKey&&!t.altKey&&this._commandIsControl()){
 for(const commandCode of [`MetaLeft`,`MetaRight`]){
  if(this._keyDownList[commandCode]===F.XK_Control_L){
   this._sendKeyEvent(F.XK_Control_L,commandCode,false);
   this._sendKeyEvent(F.XK_Super_L,commandCode,true);
  }
 }
}if(L.isMac()&&e.macCmdAsCtrl&&Et(t)&&!St[r]&&r!==`Enter`&&r!==`NumpadEnter`&&t.metaKey&&!t.ctrlKey&&!t.altKey&&!this._commandIsControl()){if(this._keyDownList.MetaLeft||this._keyDownList.MetaRight){console.log(`macOS: Cmd+key detected for code '${r}'. Remapping Cmd to Ctrl.`);let e=this._keyDownList.MetaLeft?`MetaLeft`:`MetaRight`;this._keyDownList.MetaLeft&&this._sendKeyEvent(this._keyDownList.MetaLeft,`MetaLeft`,!1),this._keyDownList.MetaRight&&this._sendKeyEvent(this._keyDownList.MetaRight,`MetaRight`,!1),this._sendKeyEvent(F.XK_Control_L,e,!0)}else this._sendKeyEvent(F.XK_Control_L,`MetaLeft`,!0)}if((L.isMac()||L.isIOS())&&Et(t))switch(i){case F.XK_Super_L:e.macCmdAsCtrl&&(i=F.XK_Super_L);break;case F.XK_Super_R:i=F.XK_Super_L;break;case F.XK_Alt_L:i=F.XK_Mode_switch;break;case F.XK_Alt_R:i=F.XK_ISO_Level3_Shift}if(St[r]===`Alt`&&this._altKeysymByCode.set(r,i),(L.isMac()||L.isIOS())&&Et(t)&&i===F.XK_ISO_Level3_Shift){console.log(`macOS: AltRight pressed, sending ISO_Level3_Shift momentarily`),this._sendMomentaryKey(F.XK_ISO_Level3_Shift),B(t);return}r in this._keyDownList&&(i=this._keyDownList[r]);let a=[F.XK_Zenkaku_Hankaku,F.XK_Eisu_toggle,F.XK_Katakana,F.XK_Hiragana,F.XK_Romaji];if(L.isWindows()&&a.includes(i)){this._sendMomentaryKey(i),B(t);return}if((L.isChrome()||r!==`KeyV`||!t.ctrlKey&&!t.metaKey||t.altKey||this.isComposing)&&B(t),r===`ControlLeft`&&L.isWindows()&&Et(t)&&!(r in this._keyDownList)){this._altGrArmed=!0,this._altGrCtrlTime=t.timeStamp,this._altGrTimeout=setTimeout(()=>{this._altGrArmed=!1,this._sendKeyEvent(F.XK_Control_L,`ControlLeft`,!0)},100);return}let o=L.isMac()&&t.metaKey&&Et(t)&&i!==null&&!St[r];if(i!==null&&!St[r]&&(t.ctrlKey||t.altKey||t.metaKey)&&!this._composesText(t)){let e=this._missingChordModifiers({ctrl:t.ctrlKey,alt:t.altKey,meta:t.metaKey&&!this._commandIsControl(),shift:t.shiftKey});if(e.length>0){this._noteMomentaryChordMods(e);for(let t of e)this.send(`kd,`+t);this._sendKeyEvent(i,r,!0),o&&this._sendKeyEvent(i,r,!1);for(let t of e.reverse())this.send(`ku,`+t);return}}this._sendKeyEvent(i,r,!0),o&&this._sendKeyEvent(i,r,!1)}_escapeHatch(e){if(!this.gamingMode||e.repeat)return!1;let t=performance.now();return(e.code!==`Escape`||t-this._lastEscapeAt>1e3)&&(this._escapePresses=0),this._lastEscapeAt=t,e.code!==`Escape`||(this._escapePresses+=1,this._escapePresses<3)?!1:(this._escapePresses=0,this.toggleGamingMode(),!0)}_handleKeyUp(e){if(this._targetHasClass(e.target,M)){let t=z.getKeyCode(e);t in this._keyDownList&&this._releaseLostKey(t);return}if(!this._guac_markEvent(e))return;B(e);let t=z.getKeyCode(e);if(t===`CapsLock`&&z.getKey(e)===`CapsLock`)return;L.isMac()&&(t===`MetaLeft`||t===`MetaRight`)&&(console.log(`macOS: Command key ('${t}') released. Cleaning up potentially stuck keys.`),this._releaseUnderCommand()),this._altGrArmed&&(this._altGrArmed=!1,clearTimeout(this._altGrTimeout),this._sendKeyEvent(F.XK_Control_L,`ControlLeft`,!0)),this._altKeysymByCode.delete(t);let n=this._keyDownList[t];this._sendKeyEvent(n,t,!1),L.isWindows()&&(t===`ShiftLeft`||t===`ShiftRight`)&&(`ShiftRight`in this._keyDownList&&this._sendKeyEvent(this._keyDownList.ShiftRight,`ShiftRight`,!1),`ShiftLeft`in this._keyDownList&&this._sendKeyEvent(this._keyDownList.ShiftLeft,`ShiftLeft`,!1))}_updateCompositionText(e){this.compositionString=this._streamTextDiff(this.compositionString,e||``,!0)}_streamTextDiff(e,t,n=!1){let r=Array.from(e),i=Array.from(t),a=0;for(;a<r.length&&a<i.length&&r[a]===i[a];)a++;let o=r.length-a;for(let e=0;e<o;e++)this._sendMomentaryKey(F.XK_BackSpace);let s=[];for(let e=a;e<i.length;e++){let t=Dt.lookup(i[e].codePointAt(0));t&&s.push([i[e],t])}if(!n||!this._sendAsCommit(s))for(let[,e]of s)this._sendMomentaryKey(e);return t}_sendAsCommit(e){return e.length<1||!e.some(([,e])=>e>=16777216)||this._chordModifierHeld()?!1:(this.send(`co,end,`+e.map(([e])=>e).join(``)),!0)}_compositionStart(e){this._guac_markEvent(e)&&(this.isComposing=!0,this._macImeCommit=null,this._positionImeAnchor(),this.compositionString=``,this._lastTextInputCommit=null,this._pendingChord=null)}_flushPendingChord(){let e=this._pendingChord;if(this._pendingChord=null,e===null||performance.now()-e.at>500)return;let t=[];e.ctrl&&t.push(F.XK_Control_L),e.alt&&t.push(F.XK_Alt_L),e.meta&&t.push(F.XK_Super_L),e.shift&&t.push(F.XK_Shift_L),this._noteMomentaryChordMods(t);for(let e of t)this.send(`kd,`+e);this.send(`kd,`+e.keysym),this.send(`ku,`+e.keysym);for(let e of t.reverse())this.send(`ku,`+e)}_compositionUpdate(e){this._guac_markEvent(e)&&this.isComposing&&!L.isMac()&&this._updateCompositionText(e.data)}_compositionEnd(e){if(!this._guac_markEvent(e)||!this.isComposing)return;if(L.isMac()){
 if(this._pendingChord!==null)setTimeout(()=>this._flushPendingChord(),0);
 const text=e.data||'';this.isComposing=false;this.compositionString='';
 if(text){this.send('co,end,'+text);this._macImeCommit={data:text,at:performance.now()};}
 this._clearCompositionHostSoon();return;
}this._pendingChord!==null&&setTimeout(()=>this._flushPendingChord(),0);let t=this._lastTextInputCommit,n=t!==null&&t.data===e.data&&performance.now()-t.at<400;L.isLinux()&&L.hasTextInput()||!e.data||n?(this._updateCompositionText(``),this.isComposing=!1,this.compositionString=``,this._clearCompositionHostSoon()):(this._updateCompositionText(e.data),this.isComposing=!1,this.compositionString=``,this._clearCompositionHostSoon())}_clearCompositionHostSoon(){setTimeout(()=>{if(this.isComposing)return;let e=this.element;e&&e.tagName===`INPUT`&&e.value&&(e.value=``),this._resetAssist()},0)}_resetAssist(){let e=this.keyboardInputAssist;e&&e.value&&(e.value=``),this._assistTyped=``}_assistCompositionStart(e){this._guac_markEvent(e)&&(this.isComposing=!0,this._assistComposing=!0,this._lastTextInputCommit=null,this._pendingChord=null)}_assistCompositionEnd(e){this._guac_markEvent(e)&&this._assistComposing&&(this._pendingChord!==null&&setTimeout(()=>this._flushPendingChord(),0),this.isComposing=!1,this._assistComposing=!1,this._assistTyped=this._streamTextDiff(this._assistTyped,e.target.value||``),this._clearCompositionHostSoon())}_assistFocusChange(){this._assistComposing&&(this._assistComposing=!1,this.isComposing=!1),this._assistTyped=``}_typeText(e){let t=[];for(let n of e){let e=Dt.lookup(n.codePointAt(0));e&&t.push([n,e])}if(!this._sendAsCommit(t))for(let[,e]of t)this.send(`kd,`+e),this.send(`ku,`+e)}_handleTextInput(e){if(L.isMac()){
 if(this.isComposing)return;
 const commit=this._macImeCommit;
 if(commit&&commit.data===e.data&&performance.now()-commit.at<400){this._macImeCommit=null;return;}
 this._macImeCommit=null;
}e.data&&(this._chordEchoPending()||(this.isComposing&&this.compositionString===e.data?this.compositionString=``:(this.isComposing&&this._updateCompositionText(``),this._typeText(e.data)),this._lastTextInputCommit={data:e.data,at:performance.now()},this._clearCompositionHostSoon()))}_chordModifierHeld(){if(this._momentaryChordMods.size>0)return!0;for(let e in this._keyDownList)if(jt(this._keyDownList[e]))return!0;return!1}_chordEchoPending(){return!this._chordModifierHeld()||!this._chordKeySent?!1:(this._chordKeySent=!1,!0)}_missingChordModifiers({ctrl:e,alt:t,meta:n,shift:r}){let i=[];return e&&!this._keysymHeld(F.XK_Control_L,F.XK_Control_R)&&i.push(F.XK_Control_L),t&&!this._keysymHeld(F.XK_Alt_L,F.XK_Alt_R)&&i.push(F.XK_Alt_L),n&&!this._keysymHeld(F.XK_Super_L,F.XK_Super_R,F.XK_Meta_L,F.XK_Meta_R)&&i.push(F.XK_Super_L),r&&!this._keysymHeld(F.XK_Shift_L,F.XK_Shift_R)&&i.push(F.XK_Shift_L),i}_noteMomentaryChordMods(e){for(let t of e)this._momentaryChordMods.add(t);clearTimeout(this._momentaryChordModsTimer),this._momentaryChordModsTimer=setTimeout(()=>this._momentaryChordMods.clear(),250)}_composesText(e){if(!Tt(z.getKey(e)))return!1;for(let e of R)if(e in this._keyDownList)return!1;return(e.ctrlKey||e.metaKey)&&!(typeof e.getModifierState==`function`&&e.getModifierState(`AltGraph`))?!1:Ct(e)&&this._altShiftsLevel(e)}_altShiftsLevel(e){if(this._altKeysymByCode.size===0)return typeof e.getModifierState==`function`&&e.getModifierState(`AltGraph`);for(let e of this._altKeysymByCode.values())if(e===F.XK_Alt_L||e===F.XK_Alt_R)return!1;return!0}_keysymHeld(...e){for(let t in this._keyDownList)if(e.includes(this._keyDownList[t]))return!0;return!1}_commandIsControl(){return this._keyDownList.MetaLeft===F.XK_Control_L||this._keyDownList.MetaRight===F.XK_Control_L}_handleMobileInput(e){let t=e.target;if(this._chordEchoPending()){this._resetAssist();return}let n=t.value||``;(!this.isComposing||n)&&(this._assistTyped=this._streamTextDiff(this._assistTyped,n),this.isComposing||this._resetAssist())}_pressedButton(e,t){return e.button===2?(t&&(this._primaryAsSecondary=e.ctrlKey&&(e.buttons&3)==1),this._primaryAsSecondary?(t||(this._primaryAsSecondary=!1),0):2):e.button}_mouseButtonMovement(e){let t=e.type===`pointerrawupdate`,n=!t&&this._rawMotionSeen&&(e.type===`mousemove`||e.type===`pointermove`);if(e.type===`mousemove`&&(this._rawMotionSeen=!1),this.buttonMask===0&&e.target!==this.element)return;if(this._noteScreenAnchor(e),!t){this.inputAttached&&!this.use_browser_cursors&&!this._trackpadMode&&(this.cursorDiv.style.display=`block`,this.element.style.setProperty(`cursor`,`none`,`important`));let t=e.clientX,n=e.clientY;if(e.getPredictedEvents&&typeof e.getPredictedEvents==`function`){let r=e.getPredictedEvents();if(r.length>0){let e=r[r.length-1];t=e.clientX,n=e.clientY}}this.inputAttached&&!this.use_browser_cursors&&!this._trackpadMode&&this._updateCursorPosition(t,n),this._latestMouseX=t,this._latestMouseY=n}if(this._trackpadMode||n)return;let r=this._inputDpr(),i=+(e.type===`mousedown`||e.type===`pointerdown`);i&&this._releaseDesyncedModifiers(e),i&&e.button===0&&this._positionImeAnchor(e),i&&e.target===this.element&&document.activeElement!==this.element&&this._focusCompositionHost();var a=`m`;let o=0,s=0,c=document.getElementById(`videoCanvas`),l=document.getElementById(`stream`);if((e.type===`mousedown`||e.type===`mouseup`||e.type===`pointerdown`||e.type===`pointerup`||e.type===`pointercancel`)&&(e.button===1&&e.preventDefault(),(e.button===3||e.button===4)&&e.preventDefault()),i&&e.button===0&&e.ctrlKey&&e.shiftKey&&this.shortcutsEnabled){let t=this._streamLockTargets().includes(e.target)?e.target:this.element,n=()=>this._requestPointerLock(t,n,e=>console.error(`Pointer lock failed:`,e));n(),e.preventDefault();return}if(i&&e.button===0&&this.gamingMode&&this._armPointerLock(),this._isStreamLocked())a=`m2`,o=e.movementX||0,s=e.movementY||0;else if((e.type===`mousemove`||e.type===`pointermove`||t||e.type===`mousedown`||e.type===`mouseup`||e.type===`pointerdown`||e.type===`pointerup`)&&!this._applySinkCoordinates(e.clientX,e.clientY,c,l,e.screenX,e.screenY)){if(this.m||this._windowMath(),this.m){let t=this._clientToServerX(e.clientX)*r,n=this._clientToServerY(e.clientY)*r;this._mapToLayout(t,n,this.m.mouseMultiX*r,this.m.mouseMultiY*r,e.screenX,e.screenY)||(this.x=Math.round(t),this.y=Math.round(n))}else this.x=0,this.y=0}if(e.type===`mousedown`||e.type===`mouseup`||(e.type===`pointerdown`||e.type===`pointerup`)&&e.button>=0){var u=1<<this._pressedButton(e,i);i?this.buttonMask|=u:this.buttonMask&=~u}else e.target===this.element&&(this.buttonMask=xt(e.buttons));let d=a===`m2`?o:this.x,f=a===`m2`?s:this.y;if(e.type===`mousemove`||e.type===`pointermove`||t)this._queueCoalescedMouseMove(a,d,f,this.buttonMask);else if(this._flushCoalescedMouseMove(),a===`m2`){let e=this._relativeToServer(d,f);this._sendPointer([`m2`,e[0],e[1],this.buttonMask,0],!1)}else this._sendPointer([`m`,d,f,this.buttonMask,0],!1)}_queueCoalescedMouseMove(e,t,n,r){if(e===`m2`?this._pendingMove&&this._pendingMove.mtype===`m2`?(this._pendingMove.x+=t,this._pendingMove.y+=n,this._pendingMove.buttonMask=r):(this._flushCoalescedMouseMove(),this._pendingMove={mtype:`m2`,x:t,y:n,buttonMask:r}):(this._pendingMove&&this._pendingMove.mtype!==`m`&&this._flushCoalescedMouseMove(),this._pendingMove={mtype:`m`,x:t,y:n,buttonMask:r}),this._moveFlushScheduled)return;let i=et-(performance.now()-(this._lastMotionSend||0)),a=typeof this.motionBacklog==`function`&&this.motionBacklog()>tt;if(i<=0&&!a){this._flushCoalescedMouseMove();return}this._moveFlushScheduled=!0;let o=()=>{this._moveFlushScheduled=!1,this._flushCoalescedMouseMove()};a&&window.requestAnimationFrame?window.requestAnimationFrame(o):setTimeout(o,Math.max(0,i))}_flushCoalescedMouseMove(){let e=this._pendingMove;if(e){if(this._pendingMove=null,e.mtype===`m2`){let t=this._relativeToServer(e.x,e.y);if(t[0]===0&&t[1]===0)return;this._sendPointer([e.mtype,t[0],t[1],e.buttonMask,0],!0)}else this._sendPointer([e.mtype,e.x,e.y,e.buttonMask,0],!0);this._lastMotionSend=performance.now()}}_handleRawPointerUpdate(e){e.pointerType===`touch`?this._trackpadRawUpdate(e):(e.pointerType===`mouse`||e.pointerType===`pen`)&&(this._rawMotionSeen=!0,this._sendCoalescedContact(e),this._mouseButtonMovement(e))}_sendCoalescedContact(e){if(e.buttons===0||typeof e.getCoalescedEvents!=`function`||this._isStreamLocked())return;let t=e.getCoalescedEvents(),n=this._moveFlushScheduled,r=this._lastMotionSend;this._moveFlushScheduled=!0;let i=-1/0;for(let e=0;e+1<t.length;e++)t[e].timeStamp-i<et||(i=t[e].timeStamp,this._mouseButtonMovement(t[e]),this._flushCoalescedMouseMove());this._moveFlushScheduled=n,this._lastMotionSend=r}_sendPointer(e,t){this._pointerSeq+=1;let n=e.join(`,`)+`,`+this._pointerSeq;if((t&&this.sendMotion||this.send)(n),this._trackpadMode&&!this._echoComposited&&e[0]===`m2`&&(e[1]!==0||e[2]!==0)){if(this._echoDeltas.push([this._pointerSeq,e[1],e[2]]),this._echoDeltas.length>mt){let[,e,t]=this._echoDeltas.shift();this._echo&&([this._echo.x,this._echo.y]=this._echoStep(this._echo.x,this._echo.y,e,t))}this._placeEchoCursor()}}_handlePointerDown(e){e.pointerType===`pen`&&(e.preventDefault(),this._mouseButtonMovement(e))}_handlePointerMove(e){e.pointerType===`pen`&&(this._rawMotionSeen||this._sendCoalescedContact(e),this._mouseButtonMovement(e))}_handlePointerUp(e){e.pointerType===`pen`&&this._mouseButtonMovement(e)}_handleTrackpadEvent(e){if(this._targetHasClass(e.target,M))return;e.preventDefault(),e.stopPropagation();let t=e.type,n=e.changedTouches;if(t===`touchstart`){this._forgetLiftedTouches(this._trackpadTouches,e);for(let t of n)this._trackpadTouches.set(t.identifier,{id:t.identifier,startT:e.timeStamp,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,lastT:e.timeStamp,speed:null,moved:!1});let t=this._trackpadTouches.size;if(t===1)this._trackpadReleaseTimer===null?this._trackpadGestureMode=`moving`:(clearTimeout(this._trackpadReleaseTimer),this._trackpadReleaseTimer=null,this._trackpadGestureMode=`dragging`);else if(t===2){this._trackpadReleaseButton(),this._trackpadGestureMode=`scrolling`;let[e,t]=this._trackpadTouches.values();this._twoFingerStart(e.lastX,e.lastY,t.lastX,t.lastY)}else this._trackpadReleaseButton(),this._trackpadGestureMode=t===3?`three`:`completed`,this._twoFinger=null}else if(t===`touchmove`){for(let e of this._trackpadTouches.values())if(!e.moved){let t=Array.from(n).find(t=>t.identifier===e.id)||e,r=t.clientX-e.startX,i=t.clientY-e.startY;r*r+i*i>this._TAP_THRESHOLD_DISTANCE_SQ&&(e.moved=!0)}if(this._trackpadGestureMode===`moving`||this._trackpadGestureMode===`dragging`){let t=this._trackpadTouches.values().next().value,r=t&&Array.from(n).find(e=>e.identifier===t.id);r&&this._trackpadMove(t,r.clientX,r.clientY,e.timeStamp)}else{for(let e of n){let t=this._trackpadTouches.get(e.identifier);t&&(t.lastX=e.clientX,t.lastY=e.clientY)}if(this._trackpadGestureMode===`scrolling`&&this._trackpadTouches.size===2){let[e,t]=this._trackpadTouches.values();this._twoFingerMove(e.lastX,e.lastY,t.lastX,t.lastY)}}}else if(t===`touchend`||t===`touchcancel`){let r=this._trackpadTouches.size,i=t===`touchend`&&!Array.from(this._trackpadTouches.values()).some(e=>e.moved),a=this._trackpadGestureMode,o=r===1&&a===`moving`&&i&&e.timeStamp-this._trackpadTouches.values().next().value.startT>=N;if((r===2||r===3)&&i&&a!==`completed`||o){let e=r===3?2:4;this.buttonMask|=e,this._sendPointer([`m2`,0,0,this.buttonMask,0],!1),setTimeout(()=>{this.buttonMask&=~e,this._sendPointer([`m2`,0,0,this.buttonMask,0],!1)},50),this._trackpadGestureMode=`completed`}else r===1&&a===`moving`&&i?(this.buttonMask|=1,this._sendPointer([`m2`,0,0,this.buttonMask,0],!1),this._trackpadReleaseTimer=setTimeout(()=>{this._trackpadReleaseTimer=null,this._trackpadReleaseButton()},it)):r===1&&a===`dragging`&&(this._trackpadReleaseButton(),i&&(this.buttonMask|=1,this._sendPointer([`m2`,0,0,this.buttonMask,0],!1),this._trackpadReleaseButton()));for(let e of n)this._trackpadTouches.delete(e.identifier);if(this._trackpadTouches.size===0)this._trackpadGestureMode=null,this._twoFinger=null;else if(this._trackpadTouches.size===1&&r>1){let[e]=this._trackpadTouches.values();e.moved=!0,this._trackpadGestureMode=`moving`,this._trackpadHandoffAt=performance.now(),this._twoFinger=null}}}_trackpadRawUpdate(e){let t=this._trackpadGestureMode;!this._trackpadMode||this._trackpadTouches.size!==1||t!==`moving`&&t!==`dragging`||this._trackpadMove(this._trackpadTouches.values().next().value,e.clientX,e.clientY,e.timeStamp)}_trackpadMove(e,t,n,r){let i=t-e.lastX,a=n-e.lastY,o=r-e.lastT;if(o>0&&(i!==0||a!==0)){let t=Math.hypot(i,a)/o;e.speed=e.speed===null?t:e.speed+(1-Math.exp(-o/st))*(t-e.speed),e.lastT=r}if(performance.now()-this._trackpadHandoffAt>=at){let t=ht(e.speed||0)*this.trackpadSpeed,n=this._relativeToServer(i*t,a*t);(n[0]!==0||n[1]!==0)&&this._sendPointer([`m2`,n[0],n[1],this.buttonMask,0],!0)}e.lastX=t,e.lastY=n}setTrackpadSpeed(e){let t=Number(e);Number.isFinite(t)&&(this.trackpadSpeed=Math.min(lt,Math.max(ct,t)))}_trackpadReleaseButton(){this._trackpadReleaseTimer!==null&&(clearTimeout(this._trackpadReleaseTimer),this._trackpadReleaseTimer=null),this.buttonMask&1&&(this.buttonMask&=-2,this._sendPointer([`m2`,0,0,this.buttonMask,0],!1))}_sinkBox(e,t,n=!1){let r=(n||window.manual_resolution||this.isSharedMode||window.streamResolutionDiverged)&&e?e:(n||window.manualResolution||window.streamResolutionDiverged)&&t?t:null;if(!r||n&&r.tagName===`VIDEO`&&!(r.videoWidth>0&&r.videoHeight>0))return null;let i=r.getBoundingClientRect();if(!(i.width>0&&i.height>0)){this._sinkMirrors||={};for(let e of[`videoStream`,`videoWorkerCanvas`]){let t=this._sinkMirrors[e];if(t&&t.isConnected||(t=document.getElementById(e),this._sinkMirrors[e]=t),!t)continue;let n=t.getBoundingClientRect();if(n.width>0&&n.height>0){i=n;break}}}!(i.width>0&&i.height>0)&&this._lastSinkRect&&(i=this._lastSinkRect);let a=r.videoWidth||r.width,o=r.videoHeight||r.height;if(i.width>0&&i.height>0&&a>0&&o>0){this._lastSinkRect=i;let e=i.left,t=i.top,n=i.width,s=i.height;if(r.tagName===`VIDEO`&&(r.style.objectFit||`contain`)!==`fill`){let r=Math.min(i.width/a,i.height/o);n=a*r,s=o*r,e+=(i.width-n)/2,t+=(i.height-s)/2}return{boxLeft:e,boxTop:t,boxW:n,boxH:s,sinkW:a,sinkH:o}}return null}_noteScreenAnchor(e){let t=e.screenX,n=e.screenY;if(!Number.isFinite(t)||!Number.isFinite(n)||Math.abs(e.clientX-this._sampleClientX)+Math.abs(e.clientY-this._sampleClientY)<8)return;let r=t-e.clientX,i=n-e.clientY,a=r===this._sampleAnchorX&&i===this._sampleAnchorY;this._sampleClientX=e.clientX,this._sampleClientY=e.clientY,this._sampleAnchorX=r,this._sampleAnchorY=i,!(!a||r===this._anchorX&&i===this._anchorY)&&(this._anchorX=r,this._anchorY=i,this._chromeInsetX=r-(window.screenX||0),this._chromeInsetY=i-(window.screenY||0),this._publishScreenGeometry())}_streamBox(){let e=this._sinkBox(document.getElementById(`videoCanvas`),document.getElementById(`stream`));if(e)return{left:e.boxLeft,top:e.boxTop,width:e.boxW,height:e.boxH,scaleX:e.sinkW/e.boxW,scaleY:e.sinkH/e.boxH};if(this.m||this._windowMath(),!this.m)return null;let t=this._inputDpr();return{left:this.m.elementClientX+this.m.mouseOffsetX,top:this.m.elementClientY+this.m.mouseOffsetY,width:this.m.frameW/this.m.mouseMultiX,height:this.m.frameH/this.m.mouseMultiY,scaleX:this.m.mouseMultiX*t,scaleY:this.m.mouseMultiY*t}}_screenStreamBox(){if(this._chromeInsetX==null)return null;let e=this._streamBox();return!e||!(e.scaleX>0)||!(e.scaleY>0)?null:{originX:(window.screenX||0)+this._chromeInsetX+e.left,originY:(window.screenY||0)+this._chromeInsetY+e.top,scaleX:e.scaleX,scaleY:e.scaleY}}_publishScreenGeometry(){if(!this._layout||this.isSharedMode)return;let e=this._screenStreamBox();if(!e)return;let t=this._layout.own;Math.abs(t.originX-e.originX)<1&&Math.abs(t.originY-e.originY)<1&&Math.abs(t.scaleX-e.scaleX)<.001&&Math.abs(t.scaleY-e.scaleY)<.001||this.send(`vp,${e.originX.toFixed(2)},${e.originY.toFixed(2)},${e.scaleX.toFixed(4)},${e.scaleY.toFixed(4)}`)}_watchScreenGeometry(e){e&&!this._geometryTimer?(this._geometryTimer=setInterval(()=>this._publishScreenGeometry(),1e3),this._publishScreenGeometry()):!e&&this._geometryTimer&&(clearInterval(this._geometryTimer),this._geometryTimer=null)}_applySinkCoordinates(e,t,n,r,i,a){let o=this._sinkBox(n,r);if(!o)return!1;let s=o.sinkW/o.boxW,c=o.sinkH/o.boxH,l=(e-o.boxLeft)*s,u=(t-o.boxTop)*c;return this._mapToLayout(l,u,s,c,i,a)||(this.x=Math.max(0,Math.min(o.sinkW,Math.round(l))),this.y=Math.max(0,Math.min(o.sinkH,Math.round(u)))),!0}setDisplayLayouts(e,t){if(this._layout=null,!e||typeof e!=`object`){this._watchScreenGeometry(!1);return}let n=[],r=null;for(let i in e){let a=e[i];if(!a)continue;let o=Number(a.x),s=Number(a.y),c=Number(a.w),l=Number(a.h);if(!Number.isFinite(o)||!Number.isFinite(s)||!(c>0)||!(l>0))continue;let u=Number(a.scale),d={x:o,y:s,w:c,h:l,scale:Number.isFinite(u)&&u>0?u:0,originX:0,originY:0,scaleX:0,scaleY:0},f=Number(a.originX),p=Number(a.originY),m=Number(a.scaleX),h=Number(a.scaleY);Number.isFinite(f)&&Number.isFinite(p)&&m>0&&h>0&&(d.originX=f,d.originY=p,d.scaleX=m,d.scaleY=h),n.push(d),i===t&&(r=d)}if(!r||n.length<2)this._watchScreenGeometry(!1);else{for(let e=0;e<n.length;e++){let t=n[e];t.crossable=t!==r&&!this._boxesOverlap(r,t)}this._layout={own:r,rects:n,ownX:r.x,ownY:r.y,ownW:r.w,ownH:r.h},this._watchScreenGeometry(!0)}}_boxesOverlap(e,t){return!(e.scaleX>0)||!(e.scaleY>0)||!(t.scaleX>0)||!(t.scaleY>0)?!1:e.originX+1<t.originX+t.w/t.scaleX&&t.originX+1<e.originX+e.w/e.scaleX&&e.originY+1<t.originY+t.h/t.scaleY&&t.originY+1<e.originY+e.h/e.scaleY}_overNeighbor(e,t,n){return!e.crossable||!(e.scaleX>0)||!(e.scaleY>0)||!Number.isFinite(t)||!Number.isFinite(n)?!1:t>=e.originX&&t<=e.originX+e.w/e.scaleX&&n>=e.originY&&n<=e.originY+e.h/e.scaleY}_mapToLayout(e,t,n,r,i,a){let o=this._layout;if(!o||e>=0&&e<=o.ownW&&t>=0&&t<=o.ownH)return!1;let s=o.ownX+e,c=o.ownY+t,l=null,u=1/0;for(let e=0;e<o.rects.length;e++){let t=o.rects[e];if(t===o.own)continue;let n=s<t.x?t.x-s:s>t.x+t.w?s-(t.x+t.w):0,r=c<t.y?t.y-c:c>t.y+t.h?c-(t.y+t.h):0,i=n*n+r*r;i<u&&(u=i,l=t)}if(l&&this._overNeighbor(l,i,a))s=l.x+(i-l.originX)*l.scaleX,c=l.y+(a-l.originY)*l.scaleY;else if(l&&l.scale>0&&n>0&&r>0){let i=l.scale/n,a=l.scale/r;e>o.ownW?s=o.ownX+o.ownW+(e-o.ownW)*i:e<0&&(s=o.ownX+e*i),t>o.ownH?c=o.ownY+o.ownH+(t-o.ownH)*a:t<0&&(c=o.ownY+t*a)}let d=s,f=c;u=1/0;for(let e=0;e<o.rects.length;e++){let t=o.rects[e],n=t.x+t.w-1,r=t.y+t.h-1,i=s<t.x?t.x:s>n?n:s,a=c<t.y?t.y:c>r?r:c,l=s-i,p=c-a,m=l*l+p*p;m<u&&(u=m,d=i,f=a)}return this.x=Math.round(d-o.ownX),this.y=Math.round(f-o.ownY),!0}_inputDpr(){return window.manual_resolution||window.manualResolution||this.isSharedMode?1:this._streamDensity||(this.useCssScaling?1:window.devicePixelRatio||1)}_cursorDensity(){let e=this._sinkBox(document.getElementById(`videoCanvas`),document.getElementById(`stream`),!0);return e?Math.max(e.sinkW/e.boxW,e.sinkH/e.boxH):this._streamDensity?this._streamDensity:this.useCssScaling?1:window.devicePixelRatio||1}_refreshCursorScale(){let e=this._cursorDensity();e!==this._lastCursorDensity&&(this._lastCursorDensity=e,this.inputAttached&&(this.use_browser_cursors&&!this._trackpadMode?this._updateBrowserCursor():this._drawAndScaleCursor()))}_watchCursorScale(){typeof ResizeObserver<`u`&&(this._cursorResizeObserver=new ResizeObserver(()=>this._refreshCursorScale()),this._cursorResizeObserver.observe(this.element)),typeof MutationObserver<`u`&&(this._cursorMutationObserver=new MutationObserver(()=>this._refreshCursorScale())),this.listeners.push(V(window,`resize`,this._refreshCursorScale,this));for(let e of[`stream`,`videoCanvas`]){let t=document.getElementById(e);t&&(this._cursorResizeObserver&&this._cursorResizeObserver.observe(t),this._cursorMutationObserver&&this._cursorMutationObserver.observe(t,{attributes:!0,attributeFilter:[`width`,`height`,`style`]}),this.listeners.push(V(t,`resize`,this._refreshCursorScale,this)),this.listeners.push(V(t,`loadedmetadata`,this._refreshCursorScale,this)))}this._refreshCursorScale()}setStreamDensity(e){let t=Number.isFinite(e)&&e>0?e:null;this._streamDensity!==t&&(this._streamDensity=t,this._windowMath(),this._refreshCursorScale())}_pointerScale(){if(this._pointerScaleFrame)return this._pointerScaleFrame;let e=this._streamBox(),t=e?{x:e.scaleX,y:e.scaleY}:{x:this._inputDpr(),y:this._inputDpr()};return typeof window.requestAnimationFrame==`function`&&(this._pointerScaleFrame=t,window.requestAnimationFrame(()=>{this._pointerScaleFrame=null})),t}_quantizeRelative(e,t){if(this._relCarryX+=e,this._relCarryY+=t,!Number.isFinite(this._relCarryX)||!Number.isFinite(this._relCarryY))return this._relCarryX=0,this._relCarryY=0,[0,0];let n=Math.round(this._relCarryX),r=Math.round(this._relCarryY);return this._relCarryX-=n,this._relCarryY-=r,[n,r]}_relativeToServer(e,t){let n=this._pointerScale();return this._quantizeRelative(e*n.x,t*n.y)}_calculateTouchCoordinates(e){this._noteScreenAnchor(e),this._updateCursorPosition(e.clientX,e.clientY),this._latestMouseX=e.clientX,this._latestMouseY=e.clientY;let t=this._inputDpr(),n=document.getElementById(`videoCanvas`),r=document.getElementById(`stream`);if(!this._applySinkCoordinates(e.clientX,e.clientY,n,r,e.screenX,e.screenY)){if(this.m||this._windowMath(),this.m){let n=this._clientToServerX(e.clientX)*t,r=this._clientToServerY(e.clientY)*t;this._mapToLayout(n,r,this.m.mouseMultiX*t,this.m.mouseMultiY*t,e.screenX,e.screenY)||(this.x=Math.round(n),this.y=Math.round(r))}else this.x=Math.round(e.clientX*t),this.y=Math.round(e.clientY*t)}}_sendMouseState(){this._flushCoalescedMouseMove(),this._isStreamLocked()?this._sendPointer([`m2`,0,0,this.buttonMask,0],!1):this._sendPointer([`m`,this.x,this.y,this.buttonMask,0],!1)}setTrackpadMode(e){let t=!!e;this._trackpadMode!==t&&(console.log(`Input: Trackpad mode ${t?`enabled`:`disabled`}.`),this._trackpadMode=t,t?this._startPointerEcho():this._stopPointerEcho(),this._resetPointerState(),this._trackpadMode?(this.element.style.setProperty(`cursor`,`none`,`important`),this.element.style.cursor=`default`):this.use_browser_cursors?(this.cursorDiv.style.display=`none`,this._updateBrowserCursor()):(this.element.style.setProperty(`cursor`,`none`,`important`),this.cursorDiv.style.display=`none`))}resumePointerEcho(){this._trackpadMode&&this._startPointerEcho()}_startPointerEcho(){this._echo=null,this._echoDeltas=[],this._placeEchoCursor(),!this._echoAsking&&(this._echoAsking=!0,queueMicrotask(()=>{this._echoAsking=!1,this._trackpadMode&&(this.send(`_pointer_echo,1`),clearTimeout(this._echoTimer),this._echoTimer=setTimeout(()=>{this._echoTimer=null,this._trackpadMode&&!this._echo&&this._compositeCursor()},pt),!this._cursorImageBitmap&&this._cursorBase64Data&&this._cursorBitmapFromBase64(this._cursorBase64Data).then(e=>{!this._cursorImageBitmap&&this._trackpadMode&&(this._cursorImageBitmap=e,this._drawAndScaleCursor())},()=>{}))}))}_stopPointerEcho(){clearTimeout(this._echoTimer),this._echoTimer=null,this._echo=null,this._echoDeltas=[],this.send(`_pointer_echo,0`),this._echoComposited&&(this._echoComposited=!1,this.send(`SET_NATIVE_CURSOR_RENDERING,0`))}_compositeCursor(){this._echoComposited=!0,this._echoDeltas=[],this.send(`SET_NATIVE_CURSOR_RENDERING,1`),this._placeEchoCursor()}onPointerEcho(e){if(!this._trackpadMode)return;let t=e.split(`,`);if(t[1]===`none`){clearTimeout(this._echoTimer),this._echoTimer=null,this._compositeCursor();return}let[n,r,i,a]=t.slice(2,6).map(Number);t.length<6||![n,r,i,a].every(Number.isFinite)||(clearTimeout(this._echoTimer),this._echoTimer=null,this._echoComposited&&(this._echoComposited=!1,this.send(`SET_NATIVE_CURSOR_RENDERING,0`)),this._echo={display:t[1],x:n,y:r,scale:i>0?i:1,seq:a,maxX:1/0,maxY:1/0},this._echoDeltas=this._echoDeltas.filter(e=>e[0]>a),this._placeEchoCursor())}_echoStep(e,t,n,r){let i=this._echo;return[Math.min(Math.max(e+n*i.scale,0),i.maxX),Math.min(Math.max(t+r*i.scale,0),i.maxY)]}_placeEchoCursor(){let e=this._echo,t=this._trackpadMode&&e&&!this._echoComposited&&this.inputAttached&&this._cursorImageBitmap&&e.display===this.displayId?this._streamBox():null;if(!t||!(t.scaleX>0)||!(t.scaleY>0)){this.cursorDiv.style.display!==`none`&&(this.cursorDiv.style.display=`none`);return}e.maxX=Math.max(0,t.width*t.scaleX-1),e.maxY=Math.max(0,t.height*t.scaleY-1);let n=e.x,r=e.y;for(let[,e,t]of this._echoDeltas)[n,r]=this._echoStep(n,r,e,t);this.cursorDiv.style.display!==`block`&&(this.cursorDiv.style.display=`block`),this._updateCursorPosition(t.left+n/t.scaleX,t.top+r/t.scaleY)}setRawPointerMotion(t){let n=!!t;if(e.rawPointerMotion===n||(e.rawPointerMotion=n,console.log(`Input: Raw pointer motion ${n?`enabled`:`disabled`}.`),typeof document>`u`||!this._isStreamLocked()))return;let r=document.pointerLockElement;this._requestPointerLock(r,()=>{document.pointerLockElement===r&&this._requestPointerLock(r,()=>{},()=>{})},e=>{console.warn(`Input: pointer lock did not take the raw motion change:`,e)})}setShortcutsEnabled(e){this.shortcutsEnabled=!!e}setMacCmdAsCtrl(t){let n=!!t;if(e.macCmdAsCtrl!==n){e.macCmdAsCtrl=n,console.log(`Input: macOS Command sent as ${n?`Control`:`Super`}.`);for(let e of[`MetaLeft`,`MetaRight`])this._keyDownList[e]===F.XK_Control_L&&this._sendKeyEvent(F.XK_Control_L,e,!1)}}async setUseBrowserCursors(e){let t=!!e;this.use_browser_cursors!==t&&(console.log(`Input: Use browser cursors ${t?`enabled`:`disabled`}.`),this.use_browser_cursors=t,this._trackpadMode?this.element.style.setProperty(`cursor`,`none`,`important`):this.use_browser_cursors?(this.cursorDiv.style.display=`none`,this._updateBrowserCursor()):(this.element.style.setProperty(`cursor`,`none`,`important`),this._cursorBase64Data&&!this._cursorImageBitmap&&(this._cursorImageBitmap=await this._cursorBitmapFromBase64(this._cursorBase64Data)),this._cursorImageBitmap?(this.cursorDiv.style.display=`block`,this._drawAndScaleCursor()):this.cursorDiv.style.display=`none`))}_handleTouchEvent(e){if(this._trackpadMode){this._handleTrackpadEvent(e);return}if(this._targetHasClass(e.target,M))return;if(It(e.changedTouches)){this.element.contains(e.target)&&e.preventDefault();return}if(!this._guac_markEvent(e))return;let t=e.type,n=Date.now(),r=!1,i=!1,a=this._TAP_THRESHOLD_DISTANCE_SQ;if(t===`touchstart`){this._forgetLiftedTouches(this._activeTouches,e),this.use_browser_cursors||(this.cursorDiv.style.display=`block`);for(let t=0;t<e.changedTouches.length;t++){let r=e.changedTouches[t];this._activeTouches.has(r.identifier)||(this._activeTouches.set(r.identifier,{startX:r.clientX,startY:r.clientY,currentX:r.clientX,currentY:r.clientY,startTime:n,identifier:r.identifier,longPressCompleted:!1}),t===0&&this._calculateTouchCoordinates(r))}let t=this._activeTouches.size;if(t===1&&!this._isTwoFingerGesture){r=!0;let[e]=this._activeTouches.keys(),t=this._activeTouches.get(e),n={clientX:t.currentX,clientY:t.currentY};this._calculateTouchCoordinates(n);let i=this.x,a=this.y;t&&!t.longPressCompleted&&(this._longPressTouchIdentifier=e,this._longPressTimer&&clearTimeout(this._longPressTimer),this._longPressTimer=setTimeout(()=>{let e=this._activeTouches.get(this._longPressTouchIdentifier);if(e&&this._activeTouches.size===1&&this._longPressTouchIdentifier===e.identifier&&!this._isTwoFingerGesture&&this._activeTouchIdentifier===null&&!e.longPressCompleted){let t=e.currentX-e.startX,n=e.currentY-e.startY;t*t+n*n<225&&(e.longPressCompleted=!0,this.x=i,this.y=a,this.buttonMask|=4,this._sendMouseState(),setTimeout(()=>{this.buttonMask&4&&(this.buttonMask&=-5,this._sendMouseState())},50))}this._longPressTimer=null},N))}else{if(this._longPressTimer&&=(clearTimeout(this._longPressTimer),null),t===2){this.use_browser_cursors||(this.cursorDiv.style.visibility=`hidden`),this._isTwoFingerGesture=!0,this._activeTouchIdentifier=null;let[e,t]=this._activeTouches.values();this._twoFingerStart(e.currentX,e.currentY,t.currentX,t.currentY),(this.buttonMask&1)==1&&(this.buttonMask&=-2),r=!0}else t>2&&(this._isTwoFingerGesture&&=!1,this._activeTouchIdentifier!==null&&(this.buttonMask&=-2,this._sendMouseState(),this._activeTouchIdentifier=null));t!==1&&(this._longPressTouchIdentifier=null)}}else if(t===`touchmove`)for(let t=0;t<e.changedTouches.length;t++){let n=e.changedTouches[t],r=this._activeTouches.get(n.identifier);if(r&&(r.currentX=n.clientX,r.currentY=n.clientY,this._longPressTimer&&n.identifier===this._longPressTouchIdentifier)){let e=r.currentX-r.startX,t=r.currentY-r.startY;e*e+t*t>=225&&(clearTimeout(this._longPressTimer),this._longPressTimer=null)}}if(this._isTwoFingerGesture&&this._activeTouches.size===2){r=!0;let[e,t]=this._activeTouches.values();this._twoFingerMove(e.currentX,e.currentY,t.currentX,t.currentY)}else if(this._activeTouches.size===1){let[e]=this._activeTouches.keys(),t=this._activeTouches.get(e);if(this._activeTouchIdentifier===e)this._calculateTouchCoordinates({clientX:t.currentX,clientY:t.currentY}),this._sendMouseState(),i=!0,r=!0;else if(this._activeTouchIdentifier===null&&!t.longPressCompleted){let n=t.currentX-t.startX,o=t.currentY-t.startY;n*n+o*o>=a&&(this._longPressTimer&&e===this._longPressTouchIdentifier&&(clearTimeout(this._longPressTimer),this._longPressTimer=null),this._activeTouchIdentifier=e,this._calculateTouchCoordinates({clientX:t.currentX,clientY:t.currentY}),this.buttonMask|=1,this._sendMouseState(),i=!0),r=!0}}if(this._activeTouchIdentifier!==null&&!i&&this._activeTouches.size>0)r=!0;else if(t===`touchend`||t===`touchcancel`){let t=e.changedTouches;for(let e=0;e<t.length;e++){let i=t[e],o=i.identifier,s=this._activeTouches.get(o);if(!s)continue;if(this._longPressTimer&&o===this._longPressTouchIdentifier&&(clearTimeout(this._longPressTimer),this._longPressTimer=null),s.longPressCompleted){this._activeTouches.delete(o),o===this._longPressTouchIdentifier&&(this._longPressTouchIdentifier=null),r=!0;continue}s.currentX=i.clientX,s.currentY=i.clientY;let c=n-s.startTime,l=s.currentX-s.startX,u=s.currentY-s.startY,d=l*l+u*u;this._isTwoFingerGesture||(this._activeTouchIdentifier===null&&this._activeTouches.size===1&&this._activeTouches.has(o)?c<this._TAP_MAX_DURATION&&d<a&&(this._calculateTouchCoordinates(i),this.buttonMask|=1,this._sendMouseState(),r=!0,setTimeout(()=>{this.buttonMask&=-2,this._sendMouseState()},10)):o===this._activeTouchIdentifier&&(this._calculateTouchCoordinates(i),this.buttonMask&=-2,this._sendMouseState(),this._activeTouchIdentifier=null,r=!0)),this._activeTouches.delete(o),o===this._longPressTouchIdentifier&&(this._longPressTouchIdentifier=null)}{let e=this._activeTouches.size;if(this._isTwoFingerGesture&&e<2&&(!this._trackpadMode&&!this.use_browser_cursors&&(this.cursorDiv.style.visibility=`visible`),this._isTwoFingerGesture=!1,this._twoFinger=null),e===0&&(this._activeTouchIdentifier=null,this._isTwoFingerGesture=!1,this._twoFinger=null,this._longPressTimer&&=(clearTimeout(this._longPressTimer),null),this._longPressTouchIdentifier=null),e>0&&this._longPressTouchIdentifier&&!this._activeTouches.has(this._longPressTouchIdentifier)&&(this._longPressTimer&&clearTimeout(this._longPressTimer),this._longPressTimer=null,this._longPressTouchIdentifier=null),e===1){let[e]=this._activeTouches.keys();if(this._longPressTouchIdentifier!==e){this._longPressTimer&&clearTimeout(this._longPressTimer),this._longPressTimer=null,this._longPressTouchIdentifier=null;let t=this._activeTouches.get(e);if(t&&!t.longPressCompleted){let n={clientX:t.currentX,clientY:t.currentY,identifier:e};this._calculateTouchCoordinates(n);let r=this.x,i=this.y;this._longPressTouchIdentifier=e,this._longPressTimer=setTimeout(()=>{let e=this._activeTouches.get(this._longPressTouchIdentifier);if(e&&this._activeTouches.size===1&&this._longPressTouchIdentifier===e.identifier&&!this._isTwoFingerGesture&&this._activeTouchIdentifier===null&&!e.longPressCompleted){let t=e.currentX-e.startX,n=e.currentY-e.startY;t*t+n*n<225&&(e.longPressCompleted=!0,this.x=r,this.y=i,this.buttonMask|=4,this._sendMouseState(),setTimeout(()=>{this.buttonMask&4&&(this.buttonMask&=-5,this._sendMouseState())},50))}this._longPressTimer=null},N)}}}else e!==1&&(this._longPressTimer&&clearTimeout(this._longPressTimer),this._longPressTimer=null,this._longPressTouchIdentifier=null)}}r&&this.element.contains(e.target)&&e.preventDefault()}_twoFingerStart(e,t,n,r){let i=(e+n)/2,a=(t+r)/2,o=Math.hypot(e-n,t-r);this._twoFinger={x:i,y:a,x0:i,y0:a,span:o,span0:o,kind:null,rail:null,accX:0,accY:0,zoom:0}}_twoFingerMove(e,t,n,r){let i=this._twoFinger;if(!i)return;let a=(e+n)/2,o=(t+r)/2,s=Math.hypot(e-n,t-r);if(i.kind===null){let e=Math.abs(a-i.x0),t=Math.abs(o-i.y0),n=Math.hypot(e,t),r=Math.abs(s-i.span0);if(Math.max(n,r)<vt)return;r>n?i.kind=`pinch`:(i.kind=`scroll`,i.rail=t>=2*e?`y`:e>=2*t?`x`:`xy`)}if(i.kind===`pinch`){i.span>0&&s>0&&(i.zoom+=Math.log(s/i.span)/Math.log(yt)),i.span=s;let e=Math.trunc(i.zoom);i.zoom-=e,this._sendZoomNotches(e)}else i.rail!==`x`&&(i.accY+=i.y-o),i.rail!==`y`&&(i.accX+=i.x-a),i.x=a,i.y=o,i.accY=this._drainScrollNotches(i.accY,!0),i.accX=this._drainScrollNotches(i.accX,!1)}_drainScrollNotches(e,t){let n=Math.trunc(e/_t);if(n===0)return e;let r=e-n*_t,i=t?n>0?`down`:`up`:n>0?`right`:`left`;for(n=Math.abs(n);n>0;){let e=Math.min(n,this._scrollMagnitude);t?this._triggerMouseWheel(i,e):this._triggerHorizontalMouseWheel(i,e),n-=e}return r}_sendZoomNotches(e){if(e===0)return;let t=F.XK_Control_L,n=!this._keysymHeld(t,F.XK_Control_R);n&&this.send(`kd,`+t);let r=Math.abs(e);for(;r>0;){let t=Math.min(r,this._scrollMagnitude);this._triggerMouseWheel(e>0?`up`:`down`,t),r-=t}n&&this.send(`ku,`+t)}_triggerMouseWheel(e,t){t=Math.max(1,Math.round(t));let n=1<<(e===`up`?4:3),r=this.buttonMask&~n;this._sendPointer([`m2`,0,0,r,t],!1),this._sendPointer([`m2`,0,0,r|n,t],!1),this._sendPointer([`m2`,0,0,this.buttonMask,t],!1)}_triggerHorizontalMouseWheel(e,t){t=Math.max(1,Math.round(t));let n=1<<(e===`left`?6:7);this._sendPointer([`m2`,0,0,this.buttonMask|n,t],!1),this._sendPointer([`m2`,0,0,this.buttonMask,t],!1)}_isDiscreteWheel(){for(var e=[];!this._queue.isEmpty();){var t=this._queue.dequeue();t>0&&e.push(t)}if(e.length<2)return!0;var n=Math.min.apply(null,e);if(n<ut)return!1;for(var r=0;r<e.length;r++){var i=e[r]/n;if(Math.abs(i-Math.round(i))>.15)return!1}return!0}_isDetentWheel(e){return L.isMacDesktop()?e.deltaMode===0?L.isFirefox()?!1:Number.isInteger(e.deltaX)&&Number.isInteger(e.deltaY)?e.shiftKey&&e.deltaY===0&&e.deltaX!==0&&e.deltaX%P===0:!0:e.deltaMode===1:!1}_webKitGtkWheelNotches(e){if(e.deltaMode!==0||!L.isSafari()||!L.isLinux())return null;let t=[window.innerHeight,window.innerWidth].map(e=>Math.floor(e**(2/3))),n=(e,n)=>{if(!e&&!n)return 0;if(!e||!n||Math.sign(e)===Math.sign(n))return null;let r=Math.abs(n)/dt,i=Math.abs(e)/r;return t.some(e=>e>0&&Math.abs(i-e)<=1)?Math.sign(e)*r:null},r=n(e.deltaY,e.wheelDeltaY),i=n(e.deltaX,e.wheelDeltaX);return i===null||r===null||!i&&!r?null:{x:i,y:r}}_addWheelNotches(e,t){if(e){let t=e<0?`up`:`down`;t!==this._wheelDirY&&(this._wheelAccumY=0,this._wheelDirY=t),this._wheelAccumY+=Math.abs(e),this._emitWheelY()}if(t){let e=t<0?`left`:`right`;e!==this._wheelDirX&&(this._wheelAccumX=0,this._wheelDirX=e),this._wheelAccumX+=Math.abs(t),this._emitWheelX()}}_resetWheelLearning(){for(this._smallestDeltaY=1e4,this._smallestLineDeltaY=1e4,this._allowThreshold=!0,this._wheelClassified=!1;!this._queue.isEmpty();)this._queue.dequeue();this._wheelAccumY=0,this._wheelDirY=null,this._wheelAccumX=0,this._wheelDirX=null,this._pinchCarry=0}_mouseWheelWrapper(e){let t=performance.now();if(t-this._lastWheelEventTs>1e3&&this._resetWheelLearning(),this._lastWheelEventTs=t,e.ctrlKey&&!this._keysymHeld(F.XK_Control_L,F.XK_Control_R)){this._pinchWheel(e),e.preventDefault();return}if(L.isMacDesktop()&&e.deltaMode===0){this._isFingerScroll(e)?this._fingerScroll(e):this._addWheelNotches(e.deltaY/100,e.deltaX/100),e.preventDefault();return}if(this._isDetentWheel(e)){e.deltaY!==0&&this._triggerMouseWheel(e.deltaY<0?`up`:`down`,1),e.deltaX!==0&&this._triggerHorizontalMouseWheel(e.deltaX<0?`left`:`right`,1),e.preventDefault();return}let n=this._webKitGtkWheelNotches(e);if(n)this._addWheelNotches(n.y,n.x),e.preventDefault();else if(e.deltaMode!==0)this._mouseWheel(e),e.preventDefault();else{var r=Math.trunc(Math.abs(e.deltaY));r!==0&&this._queue.size()<4&&this._queue.enqueue(r),this._queue.size()==4&&(this._allowThreshold=!this._isDiscreteWheel(),this._wheelClassified=!0),this._mouseWheel(e),e.preventDefault()}}_wheelNotches(e,t){let n=Math.abs(Math.trunc(e));return n===0?0:t===1?(n<this._smallestLineDeltaY&&(this._smallestLineDeltaY=n),n/this._smallestLineDeltaY):t===2?Math.max(1,n):(n<this._smallestDeltaY&&(this._smallestDeltaY=n),this._allowThreshold?n/100:n/this._smallestDeltaY)}_wheelNotchesX(e,t){let n=Math.abs(e);return n===0?0:t===0?n/100:n}_accumulateWheelY(e){if(e.deltaY===0)return;let t=e.deltaY<0?`up`:`down`;t!==this._wheelDirY&&(this._wheelAccumY=0,this._wheelDirY=t),this._wheelAccumY+=this._wheelNotches(e.deltaY,e.deltaMode)}_accumulateWheelX(e){if(e.deltaX===0)return;let t=e.deltaX<0?`left`:`right`;t!==this._wheelDirX&&(this._wheelAccumX=0,this._wheelDirX=t),this._wheelAccumX+=this._wheelNotchesX(e.deltaX,e.deltaMode)}_emitWheelY(){let e=Math.floor(this._wheelAccumY);if(!(e<1))for(this._wheelAccumY-=e;e>0;){let t=Math.min(e,this._scrollMagnitude);this._triggerMouseWheel(this._wheelDirY,t),e-=t}}_emitWheelX(){let e=Math.floor(this._wheelAccumX);if(!(e<1))for(this._wheelAccumX-=e;e>0;){let t=Math.min(e,this._scrollMagnitude);this._triggerHorizontalMouseWheel(this._wheelDirX,t),e-=t}}_pinchWheel(e){let t;if(e.deltaMode===0&&Math.abs(e.deltaY)<bt)this._pinchCarry+=-e.deltaY/(100*Math.log(yt)),t=Math.trunc(this._pinchCarry),this._pinchCarry-=t;else{let n=this._wheelNotches(e.deltaY,e.deltaMode);t=-Math.sign(e.deltaY)*Math.max(1,Math.round(n))}this._sendZoomNotches(t)}setFingerScroll(e){let t=!!e;this.fingerScroll!==t&&(t||this._endFingerScroll(),this.fingerScroll=t)}_fingerScroll(e){let t=this._pointerScale(),n=e.deltaX*t.x,r=e.deltaY*t.y;(n!==0||r!==0)&&(this.send(`sf,${n.toFixed(2)},${r.toFixed(2)}`),clearTimeout(this._fingerScrollTimer),this._fingerScrollTimer=setTimeout(()=>this._endFingerScroll(),ft))}_endFingerScroll(){this._fingerScrollTimer!==null&&(clearTimeout(this._fingerScrollTimer),this._fingerScrollTimer=null,this.send(`sfe`))}_isFingerScroll(e){return!this.fingerScroll||e.deltaMode!==0?!1:this._fingerScrollTimer===null?this._wheelClassified?this._allowThreshold:Math.abs(e.deltaX)<ut&&Math.abs(e.deltaY)<ut:!0}_mouseWheel(e){this._isFingerScroll(e)?this._fingerScroll(e):(this._accumulateWheelY(e),this._emitWheelY(),this._accumulateWheelX(e),this._emitWheelX())}_contextMenu(e){this.element.contains(e.target)&&e.preventDefault()}_streamLockTargets(){let e=[`videoCanvas`,`videoWorkerCanvas`,`videoStream`,`stream`].map(e=>document.getElementById(e));return e.push(this.element),e.filter(e=>e!=null)}_isStreamLocked(){let e=document.pointerLockElement;return e==null?!1:e===this.element||this._streamLockTargets().includes(e)}_pointerLock(){this._relCarryX=0,this._relCarryY=0,this._isStreamLocked()?(this.send(`p,1`),this.send(`SET_NATIVE_CURSOR_RENDERING,1`),this.cursorDiv.style.visibility=`hidden`):(this.send(`p,0`),this.send(`SET_NATIVE_CURSOR_RENDERING,0`),this.resetKeyboard(),this.cursorDiv.style.visibility=`visible`)}_windowMath(){this._pointerScaleFrame=null;let e=this.element.getBoundingClientRect(),t=e.width,n=e.height,r=this.element.offsetWidth,i=this.element.offsetHeight;if(t<=0||n<=0||r<=0||i<=0){this.m=null;return}let a=t/r,o=n/i,s=Math.min(a,o),c=r*s,l=i*s,u=(t-c)/2,d=(n-l)/2,f=c>0?r/c:1,p=l>0?i/l:1;this.m={mouseMultiX:f,mouseMultiY:p,mouseOffsetX:u,mouseOffsetY:d,elementClientX:e.left,elementClientY:e.top,frameW:r,frameH:i}}_clientToServerX(e){return this.m?(e-this.m.elementClientX-this.m.mouseOffsetX)*this.m.mouseMultiX:0}_clientToServerY(e){return this.m?(e-this.m.elementClientY-this.m.mouseOffsetY)*this.m.mouseMultiY:0}_encodeGamepadId(e){let t=String(e||`Gamepad`).replace(/[\u0100-\uffff]/g,`?`);try{return btoa(t)}catch{return btoa(`Gamepad`)}}_gamepadIndex(e=0){let t=this.controllerSlots,n=t?t[e]-1:e===0?this.playerIndex:null;return Number.isInteger(n)&&n>=0?n:null}_gamepadIndexOf(e){let t=this.gamepadManager?this.gamepadManager.drivenPosition(e):0;return t<0?null:this._gamepadIndex(t)}_gamepadConnected(e){this._gamepadIndex()!==null&&(this.gamepadManager||(this.gamepadManager=new Xe(e.gamepad,this._gamepadButton.bind(this),this._gamepadAxis.bind(this),this._gamepadHeartbeat.bind(this),this._gamepadActive.bind(this)),this.gamepadManager.setSlotCount(this.controllerSlots?this.controllerSlots.length:1),this.gamepadManager.setRumbleEnabled(this.gamepadRumble)),this.ongamepadconnected!==null&&this.ongamepadconnected(e.gamepad.id))}_gamepadActive(e,t,n=0){let r=this._gamepadIndex(n),i=this._gamepadAnnounced[n];delete this._gamepadAnnounced[n],i!==void 0&&(t||!e||i!==r)&&this.send(`js,d,`+i),e&&r!==null&&(this.send(`js,c,`+r+`,`+this._encodeGamepadId(e.id)+`,`+e.axes.length+`,`+e.buttons.length),this._gamepadAnnounced[n]=r)}_gamepadDisconnect(e){this.ongamepaddisconnected!==null&&this.ongamepaddisconnected(),this.gamepadManager&&e&&e.gamepad&&this.gamepadManager.padGone(e.gamepad.index)}_gamepadButton(e,t,n){let r=this._gamepadIndexOf(e);r!==null&&(this.send(`js,b,`+r+`,`+t+`,`+n),this._isSidebarOpen&&window.postMessage({type:`gamepadButtonUpdate`,gamepadIndex:r,buttonIndex:t,value:n},window.location.origin))}rumble(e,t,n,r){if(!this.gamepadManager)return;let i=this.controllerSlots;if(i&&i.length>1){let a=this.gamepadManager.drivers[i.indexOf(e+1)];a!=null&&this.gamepadManager.rumble(t,n,r,a)}else e===this._gamepadIndex()&&this.gamepadManager.rumble(t,n,r)}setGamepadRumble(e){this.gamepadRumble=!!e,this.gamepadManager&&this.gamepadManager.setRumbleEnabled(this.gamepadRumble)}stopRumble(){this.gamepadManager&&this.gamepadManager.stopRumble()}_gamepadHeartbeat(){let e=this.gamepadManager?this.gamepadManager.drivers.length:1;for(let t=0;t<e;t++){if(t>0&&this.gamepadManager.drivers[t]===null)continue;let e=this._gamepadIndex(t);e!==null&&this.send(`js,h,`+e)}}_gamepadAxis(e,t,n){let r=this._gamepadIndexOf(e);if(r!==null){if(navigator.userAgent.toLowerCase().includes(`firefox`)){if(t===4){let e=(n+1)/2;this.send(`js,b,`+r+`,6,`+e);return}if(t===5){let e=(n+1)/2;this.send(`js,b,`+r+`,7,`+e);return}}this.send(`js,a,`+r+`,`+t+`,`+n),this._isSidebarOpen&&window.postMessage({type:`gamepadAxisUpdate`,gamepadIndex:r,axisIndex:t,value:n},window.location.origin)}}_isStreamFullscreen(){let e=document.fullscreenElement;return e!==null&&e.contains(this.element)}_requestPointerLock(t,n,r){let i=e._asksRawMotion(),a=i?t.requestPointerLock({unadjustedMovement:!0}):t.requestPointerLock();a&&typeof a.catch==`function`&&a.catch(t=>{t&&t.name===`NotSupportedError`&&i?(e._rawMotionRefused=!0,n()):r(t)})}_armPointerLock(t=0,n=0){this.inputAttached&&this.gamingMode&&this._isStreamFullscreen()&&(this._isStreamLocked()||(n<rt&&!e._viewportSettled()?requestAnimationFrame(()=>this._armPointerLock(t,n+1)):this._requestPointerLock(this.element,()=>this._armPointerLock(t,n),e=>{t<5?setTimeout(()=>this._armPointerLock(t+1,n),60):console.warn(`Pointer lock failed on fullscreen:`,e)})))}_onFullscreenChange(){this._isStreamFullscreen()?this.inputAttached&&this.gamingMode&&(this._armPointerLock(),this.requestKeyboardLock()):(this._fullscreenKeyboardLock=!1,this._setGamingMode(!1),this._isStreamLocked()&&document.exitPointerLock()),this.send(`kr`),this.resetKeyboard()}_targetHasClass(e,t){let n=e;for(;n&&n.classList;){if(n.classList.contains(t))return!0;n=n.parentElement}return!1}getWindowResolution(){let e=document.body?document.body.offsetWidth:window.innerWidth,t=document.body?document.body.offsetHeight:window.innerHeight,n=window.devicePixelRatio||1,r=e*n,i=t*n;return[Math.max(1,parseInt(r-r%2)),Math.max(1,parseInt(i-i%2))]}resize(){this._windowMath()}isInputAttached(){return this.inputAttached}attach(){if(e._attachedInstance&&e._attachedInstance!==this)try{e._attachedInstance.detach()}catch{}if(e._attachedInstance=this,this._watchCursorScale(),this._focusCompositionHost(),this.listeners.push(V(this.element,`resize`,this._windowMath,this)),this.listeners.push(V(document,`pointerlockchange`,this._pointerLock,this)),this.listeners.push(V(document,`fullscreenchange`,this._onFullscreenChange,this)),this.listeners.push(V(window,`resize`,this._windowMath,this)),this.listeners.push(V(window,`resize`,this._placeEchoCursor,this)),this.listeners.push(V(window,`gamepadconnected`,this._gamepadConnected,this)),this.listeners.push(V(window,`gamepaddisconnected`,this._gamepadDisconnect,this)),this.listeners.push(V(window,`message`,this._handleVisibilityMessage,this)),this.listeners.push(V(window,`orientationchange`,()=>{setTimeout(()=>this._windowMath(),200),setTimeout(()=>this._windowMath(),500)},this)),!this.isSharedMode)this.attach_context();else{let e=e=>e.preventDefault();this.listeners.push(V(this.element,`touchstart`,e,this)),this.listeners.push(V(this.element,`touchend`,e,this)),this.listeners.push(V(this.element,`touchmove`,e,this)),this.listeners.push(V(this.element,`touchcancel`,e,this))}this.resyncGamepads()}attach_context(){if(this.inputAttached)return;this._windowMath(),this.element.style.setProperty(`cursor`,`none`,`important`),(this._cursorImageBitmap||this._cursorBase64Data)&&(this.use_browser_cursors?this._updateBrowserCursor():(this.cursorDiv.style.display=`block`,this._drawAndScaleCursor())),this.listeners_context.push(V(window,`keydown`,this._handleKeyDown,this,!0)),this.listeners_context.push(V(window,`keyup`,this._handleKeyUp,this,!0)),this.listeners_context.push(V(window,`blur`,this.releaseInput,this)),this.listeners_context.push(V(document,`visibilitychange`,this._onVisibilityChange,this)),this.listeners_context.push(V(window,`pagehide`,this.releaseInput,this)),this.listeners_context.push(V(document,`freeze`,this.resetKeyboard,this)),this.listeners_context.push(V(this.keyboardInputAssist,`input`,this._handleMobileInput,this)),this.listeners_context.push(V(this.keyboardInputAssist,`compositionstart`,this._assistCompositionStart,this)),this.listeners_context.push(V(this.keyboardInputAssist,`compositionend`,this._assistCompositionEnd,this)),this.listeners_context.push(V(this.keyboardInputAssist,`focus`,this._assistFocusChange,this)),this.listeners_context.push(V(this.keyboardInputAssist,`blur`,this._assistFocusChange,this)),this.listeners_context.push(V(document,`mousedown`,this._handleOutsideClick,this,!0)),this.listeners_context.push(V(document,`touchstart`,this._handleOutsideClick,this,!0)),this.listeners_context.push(V(this.element,`wheel`,this._mouseWheelWrapper,this)),this.listeners_context.push(V(this.element,`contextmenu`,this._contextMenu,this));let e=this.element;this.listeners_context.push(V(e,`compositionstart`,this._compositionStart,this)),this.listeners_context.push(V(e,`compositionupdate`,this._compositionUpdate,this)),this.listeners_context.push(V(e,`compositionend`,this._compositionEnd,this)),this.listeners_context.push(V(this.element,`textInput`,this._handleTextInput,this)),this.listeners_context.push(V(this.element,`pointerdown`,this._handlePointerDown,this)),this.listeners_context.push(V(this.element,`pointermove`,this._handlePointerMove,this)),this.listeners_context.push(V(this.element,`pointerup`,this._handlePointerUp,this)),this.listeners_context.push(V(this.element,`pointercancel`,this._handlePointerUp,this)),`ontouchstart`in window&&(this.listeners_context.push(V(this.element,`touchstart`,this._handleTouchEvent,this,!1)),this.listeners_context.push(V(this.element,`touchend`,this._handleTouchEvent,this,!1)),this.listeners_context.push(V(this.element,`touchmove`,this._handleTouchEvent,this,!1)),this.listeners_context.push(V(this.element,`touchcancel`,this._handleTouchEvent,this,!1))),this.listeners_context.push(V(this.element,`mousedown`,this._mouseButtonMovement,this)),`onpointerrawupdate`in window&&this.listeners_context.push(V(window,`pointerrawupdate`,this._handleRawPointerUpdate,this)),this.listeners_context.push(V(window,`mousemove`,this._mouseButtonMovement,this)),this.listeners_context.push(V(window,`mouseup`,this._mouseButtonMovement,this)),this.inputAttached=!0,this._isStreamFullscreen()&&this.gamingMode?(this._armPointerLock(),this.requestKeyboardLock()):this._isStreamLocked()&&this._pointerLock(),this._windowMath(),this._placeEchoCursor()}resyncGamepads(){if(this.gamepadManager){this._gamepadAnnounced={},this.gamepadManager.reannounce();return}let e;try{e=navigator.getGamepads?Array.from(navigator.getGamepads()):[]}catch{return}for(let t of e)if(t&&t.connected){this._gamepadConnected({gamepad:t});break}}detach(){e._attachedInstance===this&&(e._attachedInstance=null),this._cursorResizeObserver&&this._cursorResizeObserver.disconnect(),this._cursorMutationObserver&&this._cursorMutationObserver.disconnect(),this._lastCursorDensity=null,Lt(this.listeners),this.listeners=[],this.gamepadManager&&=(this.gamepadManager.destroy(),null),this._gamepadAnnounced={},this._watchScreenGeometry(!1),this.detach_context()}detach_context(){this._stopKeyHeartbeat(),Lt(this.listeners_context),this.listeners_context=[],this.element.style.cursor=`auto`,this.cursorDiv.style.display=`none`,this.send(`kr`),this.resetKeyboard(),this._activeTouches.clear(),this._activeTouchIdentifier=null,this._isTwoFingerGesture=!1,clearTimeout(this._trackpadReleaseTimer),this._trackpadReleaseTimer=null,this._trackpadTouches.clear(),this._trackpadGestureMode=null,this._pendingMove=null,this._rawMotionSeen=!1,this._endFingerScroll(),this._relCarryX=0,this._relCarryY=0,(this.buttonMask&1)==1&&(this.buttonMask&=-2,this._sendMouseState()),this.inputAttached=!1,this._exitPointerLock()}_exitPointerLock(){this._isStreamLocked()&&(document.exitPointerLock(),this.send(`p,0`),console.log(`remote pointer visibility to: False`))}enterFullscreen(){document.fullscreenElement===null&&document.documentElement.requestFullscreen().catch(e=>console.error(`Fullscreen request failed:`,e))}toggleGamingMode(){this.gamingMode?document.fullscreenElement===null?this._setGamingMode(!1):document.exitFullscreen().catch(e=>console.error(`Fullscreen exit failed:`,e)):this.enterGamingMode()}enterGamingMode(){if(this._setGamingMode(!0),this._focusStream(),document.fullscreenElement===null){let e=()=>{this.gamingMode&&document.fullscreenElement===null&&document.documentElement.requestFullscreen(this._gamingFullscreenOptions()).catch(e=>{console.error(`Fullscreen request failed:`,e),this._setGamingMode(!1)})};L.isFirefox()?e():this._lockOnGesture(e)}else this._armPointerLock(),navigator.keyboard&&`lock`in navigator.keyboard||document.fullscreenElement.requestFullscreen(this._gamingFullscreenOptions()).catch(()=>{this._fullscreenKeyboardLock=!1,this.requestKeyboardLock()}),this.requestKeyboardLock()}_lockOnGesture(t){let n=!1,r=()=>{n||(n=!0,t())};setTimeout(r,nt);let i=this.element;if(!this.inputAttached||!i||this._isStreamLocked()){r();return}let a=t=>{let n;try{n=t?i.requestPointerLock({unadjustedMovement:!0}):i.requestPointerLock()}catch{r();return}!n||typeof n.then!=`function`?r():n.then(()=>{this.gamingMode||this._exitPointerLock(),r()},n=>{t&&n&&n.name===`NotSupportedError`?(e._rawMotionRefused=!0,a(!1)):r()})};a(e._asksRawMotion())}_focusStream(){let e=this.element;if(!e||typeof e.focus!=`function`)return;let t=document.activeElement;t&&t!==e&&t!==document.body&&typeof t.blur==`function`&&t.blur();try{e.focus({preventScroll:!0})}catch{}}_gamingFullscreenOptions(){this._fullscreenKeyboardLock=!1;let e=this;return{get keyboardLock(){return e._fullscreenKeyboardLock=!0,`browser`}}}_setGamingMode(e){this.gamingMode!==e&&(this.gamingMode=e,e||(this.releaseKeyboardLock(),this._exitPointerLock()),this.ongamingmode&&this.ongamingmode(e))}requestKeyboardLock(){this.gamingMode&&document.fullscreenElement&&(navigator.keyboard&&`lock`in navigator.keyboard?navigator.keyboard.lock().catch(e=>{e&&e.name===`AbortError`||console.warn(`Input: the keyboard lock was refused, so Alt+Tab and the browser's shortcuts stay outside the session:`,e)}):this._fullscreenKeyboardLock||this._noticeKeyboardLockUnavailable())}_noticeKeyboardLockUnavailable(){if(e._keyboardLockNoticed)return;e._keyboardLockNoticed=!0;let t=typeof navigator<`u`&&!!navigator.brave,n=t?`keyboardLockBlockedByShields`:`keyboardLockUnavailable`,r=t?`Brave's Shields block the keyboard lock, so a single Escape leaves gaming mode. Allow the keyboard API for this site under the Shields fingerprinting controls to hold Escape instead.`:`This browser offers no keyboard lock, so a single Escape leaves gaming mode instead of reaching the session.`;console.warn(`Input: `+r),this.onnotice&&this.onnotice(n,r)}releaseKeyboardLock(){if(navigator.keyboard&&`unlock`in navigator.keyboard)try{navigator.keyboard.unlock()}catch{}}};$e(Ft,`_nextGuacID`,0),$e(Ft,`rawPointerMotion`,!L.isMacDesktop()),$e(Ft,`macCmdAsCtrl`,!0),$e(Ft,`_rawMotionRefused`,!1),$e(Ft,`_keyboardLockNoticed`,!1),$e(Ft,`_cursorImageSetFn`,void 0);function It(e){if(!e||e.length===0)return!1;for(let t=0;t<e.length;t++)if(e[t].touchType!==`stylus`)return!1;return!0}function V(e,t,n,r,i=!1){if(!e||typeof e.addEventListener!=`function`)return console.error(`addListener: Invalid target object`,e),null;let a=r?n.bind(r):n,o={capture:i,passive:!1};return e.addEventListener(t,a,o),[e,t,a,o]}function Lt(e){for(let t of e)t&&t[0]&&typeof t[0].removeEventListener==`function`&&t[0].removeEventListener(t[1],t[2],t[3]);e.length=0}function Rt({useCssScaling:e,localScale:t,manual:n,displayId:r,layouts:i,shared:a,wayland:o}){let s=window.devicePixelRatio||1,c=e&&!n?s/(Number.isFinite(t)&&t>0?t:1):s;if(o||a||n||!r||r===`primary`)return c;let l=Number(i&&i.primary&&i.primary.scale);return!(l>0)||l>=c?c:Math.round(l*100)/100}var zt=[96,120,144,168,192,216,240,264,288],Bt=1080;function H(e){return zt.reduce((t,n)=>Math.abs(n-e)<Math.abs(t-e)?n:t)}function Vt(){let e=window.devicePixelRatio||1;return H(Math.round(e*4)*24)}function Ht(e,t){let n=Math.min(Number(e)||0,Number(t)||0);return n>0?H(96*n/Bt):Vt()}function Ut({stream:e,css:t,realized:n,density:r}){return!e||!t||!n||!(t[0]>0)||!(t[1]>0)||e[0]!==n[0]||e[1]!==n[1]?r:Math.max(e[0]/t[0],e[1]/t[1])}function Wt(e,t){return{__clipDigest:!0,byteLength:e,hash:t}}async function Gt(e){let t=await createImageBitmap(e);try{let e=document.createElement(`canvas`);return e.width=t.width,e.height=t.height,e.getContext(`2d`).drawImage(t,0,0),await new Promise((t,n)=>e.toBlob(e=>e?t(e):n(Error(`PNG encode failed`)),`image/png`))}finally{t.close()}}function Kt(){return typeof navigator<`u`&&navigator.clipboard?null:typeof window<`u`&&window.isSecureContext===!1?`this page is not a secure context, so the browser exposes no clipboard (serve it over https, or from localhost)`:`this browser exposes no clipboard API`}var qt=`application/x-selkies-clipboard-flavours`;function U({html:e,text:t}){let n={"text/html":e};return t&&(n[`text/plain`]=t),new TextEncoder().encode(JSON.stringify(n)).buffer}function W(e){let t=JSON.parse(new TextDecoder().decode(e));return{html:t[`text/html`]||``,text:t[`text/plain`]||``}}function Jt(e){try{return new DOMParser().parseFromString(e,`text/html`).body.textContent||``}catch{return``}}async function Yt(e){let t=async()=>{let e=await navigator.clipboard.readText().catch(()=>``);return e?{kind:`text`,text:e}:null};if(!e){let e=await navigator.clipboard.readText();return e?{kind:`text`,text:e}:null}let n;try{n=await navigator.clipboard.read()}catch(e){if(e&&e.name===`DataError`)return t();throw e}if(!n||n.length===0)return null;let r=n[0],i=r.types.find(e=>e.startsWith(`image/`));try{let e=r.types.includes(`text/html`)?await(await r.getType(`text/html`)).text():``;if(i&&!Jt(e).trim())return{kind:`image`,blob:await r.getType(i),mime:i};if(e)return{kind:`flavours`,html:e,text:r.types.includes(`text/plain`)?await(await r.getType(`text/plain`)).text():``};if(r.types.includes(`text/plain`)){let e=await(await r.getType(`text/plain`)).text();return e?{kind:`text`,text:e}:null}}catch(e){if(e&&e.name===`DataError`)return t();throw e}return null}function Xt(e){let t=null,n=null,r=0,i=0,a=!1;function o(e){if(!e)return 0;let t=e.endsWith(`==`)?2:+!!e.endsWith(`=`);return e.length/4*3-t}function s(){t=null,n=null,r=0,i=0,a=!1}return{begin(i,o){this.reset(),n=i,r=o,t=e(i),a=!0},push(e){a&&(t.push(e),i+=o(e))},finish(){if(!a)return Promise.reject(Error(`no transfer in progress`));let e=t.finish();return s(),e},reset(){t&&t.abort(),s()},get inProgress(){return a},get mimeType(){return n},get totalSize(){return r},get receivedSize(){return i}}}function Zt(){let e=0,t=!1,n=!1;return{arm(){t=!0,n=!0,e=0},armLegacyWindow(t){e=Date.now()+t},consume(){if(n)return n=!1,!0;if(t||!e)return!1;let r=Date.now()<e;return e=0,r}}}var Qt=1e3,$t=Symbol(`predates an explicit push`),en=1e4,tn=3e4;function nn({isChromium:e,isSharedMode:t,canSync:n,canRead:r,binaryEnabled:i,sendClipboardData:a,clipboardSync:o,getDeferredWriteInFlight:s=null}){let c=null,l=!1,u=!1,d=0,f=-1/0;function p(){return d>0||Date.now()-f<Qt}async function m(e){let t,n=new Promise(e=>{t=e});c=n;try{await e}finally{t(),c===n&&(c=null)}}async function h(){if(window.isSecureContext&&navigator.clipboard&&!t()&&n()&&r()){if(s){let e=Date.now()+en;for(let t=0;t<2;t++){let t=s(),n=e-Date.now();if(!t||n<=0||(await Promise.race([t.catch(()=>{}),new Promise(e=>setTimeout(e,n))]),!s()))break}}await m((async()=>{try{let e=await Yt(i());if(!e)return;let t=e.text,n=`text/plain`;e.kind===`image`?(t=await e.blob.arrayBuffer(),n=e.mime):e.kind===`flavours`&&(t=U(e),n=qt);let r=await o.localSig(t,n);if(!o.noteLocal(r)||p()||e.kind!==`image`&&o.echoes(e.text))return;let s=null;if(await a(t,n,(e,t)=>{s=t||e}),s===`clipboardSkipNotConnected`||s===`clipboardSkipSendFailed`){o.forgetLocal(r),u=!0;return}if(s)return;console.log(`Sent the local clipboard (${n}) to the session`)}catch(e){e.name!==`NotFoundError`&&e.name!==`DataError`&&e.name!==`NotAllowedError`&&!(e.message&&e.message.includes(`not focused`))&&console.warn(`Could not read clipboard: ${e.name} - ${e.message}`)}})())}}async function g(e,t,n){d++,o.noteExplicit(),await m((async()=>{try{await a(e&&typeof e.arrayBuffer==`function`?await e.arrayBuffer():e,t,n)}finally{d--,f=Date.now()}})())}async function _(){if((!l||u)&&(l=!0,u=!1,e&&!t()&&document.hasFocus()&&navigator.permissions&&navigator.permissions.query))try{(await navigator.permissions.query({name:`clipboard-read`})).state===`granted`&&h()}catch{}}return{readAndSend:h,sendExplicit:g,maybeInitial:_,getSendInFlight:()=>c}}function rn(){let e=null,t=0,n=null;function r(e){return!!e&&(e.name===`NotAllowedError`||e.name===`SecurityError`)}function i(e,t){let r={promise:e,settled:!t.settled};t.settled&&t.settled.then(()=>{r.settled=!0},()=>{r.settled=!0}),n=r,e.finally(()=>{n===r&&(n=null)})}function a(n){return Promise.resolve().then(()=>n.attempt()).then(()=>Promise.resolve(n.onSuccess&&n.onSuccess()).then(()=>!0,()=>!0),i=>r(i)?(n.seq===t&&(e=n),!1):(n.onFailure&&!(i&&i.name===`AbortError`)&&n.onFailure(i),!1))}function o(){let t=e;t&&(e=null,i(a(t),t))}for(let e of[`pointerdown`,`keydown`,`focus`])window.addEventListener(e,o,!0);document.addEventListener(`visibilitychange`,()=>{document.hidden||o()},!0);function s(n,{onSuccess:r,onFailure:o,settled:s}={}){let c={attempt:n,onSuccess:r,onFailure:o,settled:s,seq:++t};e=null;let l=a(c);return i(l,c),l}return{write:s,flush:o,getInFlight:()=>n?n.promise:null,getLanding:()=>n&&n.settled?n.promise:null,hasPending:()=>!!e||!!n,issued:()=>t}}var an=6e4;function on({isChromium:e,writer:t,onCleared:n}){let r=null;async function i(){let e=r;if(e&&e.due&&!e.busy){e.busy=!0;try{for(let e=t.getInFlight();e;e=t.getInFlight())await e.catch(()=>{});if(r!==e||t.hasPending()||!document.hasFocus())return;let i=await navigator.permissions.query({name:`clipboard-read`});if(i.state===`denied`&&(r=null),r!==e||i.state!==`granted`)return;let a=t.issued(),o=await navigator.clipboard.readText();if(r!==e)return;if(o!==e.text){r=null;return}if(t.issued()!==a)return;await navigator.clipboard.writeText(``),r===e&&(r=null),n()}catch{}finally{e.busy=!1}}}function a(e){clearTimeout(e.timer),e.due=!0,setTimeout(i,0)}return e&&typeof window<`u`&&window.addEventListener(`focus`,()=>{r&&r.due&&i()}),{landed(t){if(!e)return;r&&clearTimeout(r.timer);let n={text:t,due:!1,busy:!1,timer:null};n.timer=setTimeout(()=>a(n),an),r=n},holds:e=>!!r&&r.text===e,retract(){r&&a(r)}}}function sn({worker:e,clipboardSync:t,writer:n,toPng:r,canWriteLocal:i,binaryEnabled:a,onPreview:o,onImageWritten:s,onImageWriteFailed:c,isChromium:l=!1}){let u=Xt(t=>e.decodeStream(t)),d=null,f=0,p=null,m=null,h=!1,g=null,_=on({isChromium:l,writer:n,onCleared:()=>t.forget()});function ee(){clearTimeout(m),m=setTimeout(()=>{d&&=(console.warn(`Session clipboard transfer stalled; dropping it.`),ae(d.landing,`stalled`),u.reset(),null)},tn)}function te(e){return e===`text/plain`?`text`:e===`application/x-selkies-clipboard-flavours`?`flavours`:typeof e==`string`&&e.startsWith(`image/`)?`image`:null}function v(e,t){return!t&&i()&&(e!==`image`||a())}function ne(){return typeof ClipboardItem<`u`&&typeof navigator<`u`&&!!navigator.clipboard&&!!navigator.clipboard.write}function re(e){return new DOMException(e,`AbortError`)}function ie(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.catch(()=>{}),{promise:n,resolve:e,reject:t}}function ae(e,t){if(!(!e||e.settled||e.withdrawn)){e.withdrawn=!0;for(let n of Object.values(e.parts))n.reject(re(t))}}function y(e,r,i){ae(p,`superseded`);let a=e===`image`?[`image/png`]:e===`text`?[`text/plain`]:[`text/html`,`text/plain`],o={parts:{},settled:!1,withdrawn:!1,failed:null,localSig:null};for(let e of a)o.parts[e]=ie();let l=Promise.all(a.map(e=>o.parts[e].promise));return l.then(()=>{o.settled=!0},()=>{}),p=o,n.write(async()=>{let e={};for(let t of a)e[t]=o.parts[t].promise;try{await navigator.clipboard.write([new ClipboardItem(e)])}catch(e){throw o.withdrawn?re(`withdrawn`):o.failed?o.failed:e}},{settled:l,onSuccess:e===`image`?()=>s(r):()=>{t.noteLocal(o.localSig),i&&_.landed(o.text)},onFailure:e===`image`?c:e=>console.error(`Could not copy the session clipboard to the local one: ${e&&e.name} - ${e&&e.message}`)}),o}function b(e,n,i){if(n===`image`){let t=e.parts[`image/png`];i.mime===`image/png`?t.resolve(i.blob):r(i.blob).catch(()=>Gt(i.blob)).then(t.resolve,n=>{e.failed=n,t.reject(n)})}else n===`text`?(e.localSig=t.sig(i.text),e.text=i.text,e.parts[`text/plain`].resolve(new Blob([i.text],{type:`text/plain`}))):(e.parts[`text/html`].resolve(new Blob([i.html],{type:`text/html`})),e.parts[`text/plain`].resolve(new Blob([i.text||Jt(i.html)],{type:`text/plain`})))}function x(e,n){if(e.gen!==f&&e.landing&&e.landing.withdrawn)return;let r,i;if(e.kind===`text`){let a=n.result;if(r=t.shouldSend(a,`text/plain`),t.resolveServer(a,null,`text/plain`),g=e.secret&&a?a:null,o(a,!!g),i={text:a},_.holds(a)&&e.secret?r||_.landed(a):_.retract(),e.secret&&!a){ae(e.landing,`retracted`);return}}else{g=null,_.retract();let a=Wt(n.byteLength,n.hash);if(r=t.shouldSend(a,e.mime),e.kind===`flavours`){let r=W(n.result);t.resolveServer(r.text||r.html,null,e.mime,a),o(r.text||r.html),i=r}else{let r=new Blob([n.result],{type:e.mime});t.resolveServer(void 0,r,e.mime,a),i={blob:r,mime:e.mime}}}!r||!v(e.kind,e.cacheOnly)?ae(e.landing,`unchanged`):e.landing?b(e.landing,e.kind,i):ne()?b(y(e.kind,e.mime,e.secret),e.kind,i):e.kind===`image`?c(Error(`the local clipboard takes no images here`)):typeof navigator<`u`&&navigator.clipboard&&S(e.kind===`text`?i.text:i.text||i.html,e.secret)}function S(e,r){return n.write(()=>navigator.clipboard.writeText(e),{onSuccess:()=>{t.noteLocal(t.sig(e)),r&&_.landed(e)},onFailure:e=>console.error(`Could not copy the session clipboard to the local one: ${e&&e.name}`)})}function oe(e,t,n){let r=h;h=!1,d&&=(ae(d.landing,`superseded`),u.reset(),null);let i=te(e);return!i||i===`image`&&!a()?null:{kind:i,mime:e,cacheOnly:t,secret:i===`text`&&!!(n||r),gen:++f,landing:null}}return{begin(e,t,n,r){let i=oe(e,n,r);i&&(u.begin(e,t),v(i.kind,n)&&ne()&&(!i.secret||t)&&(i.landing=y(i.kind,e,i.secret)),d=i,ee())},push(e){d&&(u.push(e),ee())},finish(){let e=d;if(d=null,clearTimeout(m),!e||!u.inProgress)return;let t=u.totalSize;u.receivedSize===t?u.finish().then(n=>{n.byteLength===t?x(e,n):ae(e.landing,`incomplete`)}).catch(t=>{ae(e.landing,`undecodable`),console.error(`Error assembling final clipboard content:`,t)}):(console.error(`Multipart clipboard size mismatch: received ${u.receivedSize} of ${t} bytes.`),u.reset(),ae(e.landing,`incomplete`))},single(t,n,r,i){let a=oe(t,r,i);a&&e.decode(n,a.kind===`text`?`text/plain`:t).then(e=>x(a,e),e=>console.error(`Error processing clipboard data from the session:`,e))},markSecret(){h=!0},copySecret(){return!g||typeof navigator>`u`||!navigator.clipboard?Promise.resolve(!1):S(g,!0)},reset(){d&&ae(d.landing,`dropped`),h=!1,clearTimeout(m),u.reset(),d=null}}}var cn=262144;function ln(e,t=!1){let n=!t&&e.length>262144;return{type:`clipboardContentUpdate`,text:t?``:n?e.slice(0,cn):e,truncated:n,totalLength:t?0:e.length,secret:t}}function un(e){return e.replace(/\r\n?/g,`
`)}function dn({sendRequest:e,digestBytes:t,isChromium:n=!0,canRead:r=()=>!0}){let i=``,a=null,o=`text/plain`,s=null,c=null,l=null,u=null,d=[];function f(e,t=null){s=e,c=null,u=typeof t==`string`&&t?un(t):null}function p(e,t){for(let n=0;n<t.length;n++)e=(e<<5)+e+t[n]|0;return e}function m(e,t){if(typeof e==`string`){let t=un(e),n=5381;for(let e=0;e<t.length;e++)n=(n<<5)+n+t.charCodeAt(e)|0;return{full:`t:${t.length}:${n}`,legacy:null}}if(e&&e.__clipDigest){let n=t||``;return{full:`b:${n}:${e.byteLength}:${e.hash}`,legacy:`b:${n}:${e.byteLength}`}}let n=null;e instanceof Uint8Array?n=[e]:e instanceof ArrayBuffer?n=[new Uint8Array(e)]:Array.isArray(e)&&(n=e.map(e=>e instanceof Uint8Array?e:new Uint8Array(e)));let r=t||``;if(n){let e=5381,t=0;for(let r of n)t+=r.length,e=p(e,r);return{full:`b:${r}:${t}:${e}`,legacy:`b:${r}:${t}`}}return{full:`b:${r}:${e&&(e.byteLength===void 0?e.size:e.byteLength)}`,legacy:null}}function h(e,t){return m(e,t).full}function g(e,t){let{full:n,legacy:r}=m(e,t);return n===s||n===c?!1:r===null||r!==s&&r!==c}function _(e,t){f(h(e,t),typeof e==`string`?e:null)}function ee(e){return typeof e==`string`&&!!e&&u!==null&&un(e)===u}async function te(e,n){return h(typeof e==`string`||!t?e:await t(e.slice(0)),n)}function v(e){let t=l!==$t&&(e===null||e!==l);return l=e,t}function ne(){l=$t}function re(){f(null),l=null}function ie(e){l===e&&(l=null)}function ae(e,t,n,r){if(typeof e==`string`&&(i=e,f(h(e),e)),t&&(a=t,f(h(r??t,n||t.type))),n&&(o=n),d.length===0)return;let s=d;d=[];for(let n of s)if(!n.settled)try{n.wantBinary?t&&t!==n.baselineBlob?n.resolve(t):d.push(n):typeof e==`string`&&e!==n.baselineText?n.resolve(e):d.push(n)}catch{}}async function y(){if(!n||!r())return;let e=s;try{let n=await navigator.clipboard.read();for(let r of n){let n=r.types.find(e=>e!==`text/plain`);if(!n)continue;let i=await(await r.getType(n)).arrayBuffer(),a=h((t?await t(i):null)||new Uint8Array(i),n);s===e&&(c=a,l=a);return}}catch{}}function b(t){try{e()}catch{}return new Promise((e,n)=>{let r={wantBinary:!!t,resolve:e,settled:!1,baselineText:i,baselineBlob:a},o=(e,t)=>{if(r.settled)return;r.settled=!0;let n=d.indexOf(r);n!==-1&&d.splice(n,1),e(t)};r.resolve=t=>o(e,t),d.push(r),setTimeout(()=>{t&&a&&a!==r.baselineBlob?o(e,a):!t&&i&&i!==r.baselineText?o(e,i):o(n,Error(`Server clipboard request timed out with no fresh value`))},2e3)})}async function x(e){let t;try{t=await e}catch{return}if(typeof t!=`string`||!t)return;let n=document.createElement(`textarea`);n.value=t,n.setAttribute(`readonly`,``),n.style.position=`fixed`,n.style.top=`-9999px`,n.style.left=`-9999px`,n.style.opacity=`0`,document.body.appendChild(n);try{n.focus(),n.select(),n.setSelectionRange(0,n.value.length),document.execCommand(`copy`)||console.warn(`execCommand("copy") fallback returned false.`)}catch(e){console.warn(`execCommand("copy") fallback threw: ${e&&e.name} - ${e&&e.message}`)}finally{document.body.removeChild(n)}}return{sig:h,shouldSend:g,markSynced:_,localSig:te,noteLocal:v,noteExplicit:ne,forget:re,forgetLocal:ie,resolveServer:ae,captureLocalImageSig:y,request:b,copyViaExecCommand:x,get lastText(){return i},echoes:ee,get lastBlob(){return a},get lastMime(){return o}}}function fn({isChromium:e,clipboardSync:t,sendClipboardData:n,canSync:r,canRead:i,canWrite:a,binaryEnabled:o,getSendInFlight:s,getDeferredWriteLanding:c,hasPendingServerWrite:l,readLocalClipboard:u}){function d(){let e=document.activeElement;return!(!e||e.id===`overlayInput`||e.tagName!==`INPUT`&&e.tagName!==`TEXTAREA`&&e.tagName!==`SELECT`&&!e.isContentEditable)}let f=[],p=!1,m=null,h=-1/0,g=null;function _(){p=!1;for(let e of f.splice(0))try{let t=new KeyboardEvent(e.type,e);Object.defineProperty(t,"__selkiesClipReplay",{value:!0}),window.dispatchEvent(t)}catch{}}function ee(){for(let e=f.length-1;e>=0;e--)f[e].type===`keydown`&&f.splice(e,1);_()}let te=[`ControlLeft`,`ControlRight`,`MetaLeft`,`MetaRight`];function v(t){if(t.__selkiesClipReplay)return;let n=p&&t.type===`keyup`&&te.includes(t.code);if(t.code!==`KeyV`&&!n)return;let a=(t.ctrlKey||t.metaKey)&&!t.altKey,o=c?c():null,l=a&&t.type===`keydown`&&!t.isComposing&&r()&&i()&&!d(),v=!e&&l;if(e&&l&&!t.repeat&&u){let e=u().catch(()=>{});g=e,e.then(()=>{g===e&&(g=null)})}if((n||t.code===`KeyV`&&(a&&(s()||o||v||g)||p))&&(e&&t.preventDefault(),t.stopImmediatePropagation(),f.push(t),!p)){p=!0;let e=performance.now(),t=()=>{if(v&&h<e&&performance.now()-e<100){setTimeout(t,10);return}let n=[],r=s();r&&n.push(r),m&&n.push(m),g&&n.push(g);let i=c?c():null;if(i&&n.push(i),n.length===0){_();return}let a=1e4-(performance.now()-e);a<=0?ee():Promise.race([Promise.all(n).then(()=>`settled`,()=>`failed`),new Promise(e=>setTimeout(()=>e(`timeout`),a))]).then(e=>{e===`settled`?t():ee()})};v?setTimeout(t,0):t()}}function ne(e){if(r()&&(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.repeat&&!d()&&(e.key||``).toLowerCase()===`c`&&a()){let e=t.request(!1),n={"text/plain":e.then(e=>new Blob([typeof e==`string`?e:t.lastText||``],{type:`text/plain`}))},r=null;try{r=navigator.clipboard.write([new ClipboardItem(n)])}catch(n){console.warn(`navigator.clipboard.write unavailable on Ctrl+C, using execCommand: ${n&&n.name}`),t.copyViaExecCommand(e)}r&&r.catch&&r.catch(n=>{console.warn(`navigator.clipboard.write rejected on Ctrl+C, using execCommand: ${n&&n.name} - ${n&&n.message}`),t.copyViaExecCommand(e)})}}function re(e){if(h=performance.now(),!r()||!i()||d()||(e.preventDefault(),l&&l()))return;let a=e.clipboardData;if(!a)return;let s=null;if(o()&&a.items)for(let e=0;e<a.items.length&&!s;e++){let t=a.items[e],n=t.kind===`file`&&t.type&&t.type.startsWith(`image/`)?t.getAsFile():null;n&&(s=n.arrayBuffer().then(e=>[e,n.type||t.type]))}if(!s){let e=a.getData(`text/plain`);if(!e)return;s=Promise.resolve([e,`text/plain`])}let c=s.then(async([e,r])=>{t.noteLocal(await t.localSig(e,r))&&(typeof e==`string`&&t.echoes(e)||await n(e,r))}).catch(e=>console.warn(`Paste could not reach the session: ${e&&e.name}`));m=c,c.finally(()=>{m===c&&(m=null)})}function ie(){window.addEventListener(`keydown`,v,!0),window.addEventListener(`keyup`,v,!0),e||(window.addEventListener(`keydown`,ne,!0),window.addEventListener(`paste`,re,!0))}function ae(){window.removeEventListener(`keydown`,v,!0),window.removeEventListener(`keyup`,v,!0),e||(window.removeEventListener(`keydown`,ne,!0),window.removeEventListener(`paste`,re,!0))}return{wire:ie,unwire:ae}}function pn(){let e=``,t=``;if(typeof window>`u`||!window.location)return{keyword:e,token:t};let n=String(window.location.hash||``).replace(/^#/,``);for(let r of n.split(`&`))if(r.startsWith(`token=`)){if(!t)try{t=new URLSearchParams(r).get(`token`)||``}catch{}}else!e&&r&&(e=`#${r}`);return{keyword:e,token:t}}function mn(){return pn().keyword}var hn=`selkies_token`,gn=`selkies`,_n=`selkies.token.`;function vn(){let e=pn().token;if(e)return e;if(typeof window>`u`||!window.location)return``;try{return new URLSearchParams(window.location.search).get(`token`)||``}catch{return``}}function yn(e){let t=Object.assign({},e||{}),n=vn();return n&&!(`Authorization`in t)&&(t.Authorization=`Bearer ${n}`),t}function bn(e){let t=``;for(let n of new TextEncoder().encode(e))t+=String.fromCharCode(n);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function xn(){let{token:e}=pn();return e?[gn,_n+bn(e)]:[]}function Sn(){let e=vn();if(!e||typeof document>`u`)return;let t=[`path=${Te()}/api/`,`SameSite=Strict`];window.location.protocol===`https:`&&t.push(`Secure`);try{document.cookie=`${hn}=${encodeURIComponent(e)}; ${t.join(`; `)}`}catch{}}var Cn=67108864;function wn({canUpload:e=()=>!0}={}){let t=!1,n=``;function r(e){window.postMessage({type:`fileUpload`,payload:e},window.location.origin)}function i(){return t?(console.warn(`Simultaneous uploading of files with distinct upload operations is not supported yet`),r({status:`warning`,fileName:`_N/A_`,message:`Please let the ongoing upload complete.`}),!1):(t=!0,!0)}function a(e,t,n,r,i){return new Promise((a,o)=>{let s=new XMLHttpRequest;s.open(`POST`,e,!0),s.withCredentials=!0,s.setRequestHeader(`Content-Type`,`application/octet-stream`),s.setRequestHeader(`X-Upload-Path`,encodeURIComponent(t));for(let[e,t]of Object.entries(yn(r)))s.setRequestHeader(e,t);s.upload.onprogress=i,s.onload=()=>{s.status>=200&&s.status<300?a():o(Error(`upload failed (${s.status}): ${String(s.responseText||``).slice(0,160)}`))},s.onerror=()=>{o(Error(`network error uploading ${t}`))},s.send(n)})}async function o(e,t){r({status:`start`,fileName:t,fileSize:e.size});let n=(n,i)=>r({status:n,fileName:t,fileSize:e.size,...i}),i=t=>e.size>0?Math.min(100,Math.round(t/e.size*100)):0;try{let r=new URL(`api/upload`,window.location.href).href;if(e.size<=Cn)await a(r,t,e,null,t=>{let r=t.lengthComputable&&e.size>0?Math.min(100,Math.round(t.loaded/t.total*100)):0;n(`progress`,{progress:r})});else{let o=window.crypto&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;for(let s=0;s<e.size;){let c=Math.min(s+Cn,e.size),l={"X-Upload-Id":o,"X-Upload-Offset":String(s),"X-Upload-Total":String(e.size)};c>=e.size&&(l[`X-Upload-Final`]=`1`);let u=s;await a(r,t,e.slice(s,c),l,e=>{e.lengthComputable&&n(`progress`,{progress:i(u+e.loaded)})}),s=c,n(`progress`,{progress:i(s)})}}n(`progress`,{progress:100}),n(`end`)}catch(e){throw n(`error`,{message:e&&e.message?e.message:`error during upload of ${t}: ${e}`}),e}}function s(e){return new Promise((t,n)=>e.file(t,n))}async function c(e,t=``){let n;if(e.fullPath&&typeof e.fullPath==`string`&&e.fullPath!==e.name&&(e.fullPath.includes(`/`)||e.fullPath.includes(`\\`))?(n=e.fullPath,n.startsWith(`/`)&&(n=n.substring(1))):n=t?`${t}/${e.name}`:e.name,e.isFile)try{await o(await s(e),n)}catch(e){console.error(`Error processing file ${n}: ${e}`),r({status:`error`,fileName:n,message:`Error processing file: ${e.message||e}`})}else if(e.isDirectory){let t=e.createReader(),r;do{r=await new Promise((e,n)=>t.readEntries(e,n));for(let e of r)await c(e,n)}while(r.length>0)}}function l(t){if(!e()){console.log(`File upload blocked (shared/viewer session).`);return}let r=t?.detail?.directory;n=typeof r==`string`?r.replace(/^\/+|\/+$/g,``):``;let i=document.getElementById(`globalFileInput`);i?i.click():console.error(`Global file input not found!`)}async function u(a){let s=a.target.files,c=n;if(n=``,!e()||!s||s.length===0)a.target.value=null;else if(!i())a.target.value=null;else{console.log(`File input changed, processing ${s.length} files sequentially.`);try{for(let e=0;e<s.length;e++){let t=s[e];await o(t,c?`${c}/${t.name}`:t.name)}}catch(e){let t=`An error occurred during the file input upload process: ${e.message||e}`;console.error(t),r({status:`error`,fileName:`N/A`,message:t})}finally{a.target.value=null,t=!1}}}function d(t){t.preventDefault(),t.dataTransfer.dropEffect=e()?`copy`:`none`}async function f(n){if(n.preventDefault(),n.stopPropagation(),!e())console.log(`File upload via drag-drop blocked (shared/viewer session).`);else if(i())try{let e=[];if(n.dataTransfer.items)for(let t=0;t<n.dataTransfer.items.length;t++){let r=n.dataTransfer.items[t];if(r.kind!==`file`)continue;let i=null;typeof r.webkitGetAsEntry==`function`?i=r.webkitGetAsEntry():typeof r.getAsEntry==`function`&&(i=r.getAsEntry()),i&&e.push(i)}else if(n.dataTransfer.files.length>0){for(let e=0;e<n.dataTransfer.files.length;e++)await o(n.dataTransfer.files[e],n.dataTransfer.files[e].name);return}try{for(let t of e)await c(t)}catch(e){r({status:`error`,fileName:`N/A`,message:`Error during sequential upload: ${e.message||e}`})}}finally{t=!1}}return{uploadFileObject:o,handleRequestFileUpload:l,handleFileInputChange:u,handleDragOver:d,handleDrop:f}}var Tn="const e=32768,t=5381;function n(e,t){for(let n=0;n<t.length;n++)e=(e<<5)+e+t[n]|0;return e}function r(t){let n=new TextEncoder().encode(t),r=``;for(let t=0;t<n.length;t+=e){let i=n.subarray(t,t+e);r+=String.fromCharCode.apply(null,i)}return btoa(r)}function i(e){let t=atob(e),n=t.length,r=new Uint8Array(n);for(let e=0;e<n;e++)r[e]=t.charCodeAt(e);return{text:new TextDecoder().decode(r),byteLength:n}}function a(e){let t=atob(e),n=t.length,r=new Uint8Array(n);for(let e=0;e<n;e++)r[e]=t.charCodeAt(e);return r}function o(t){let n=``;for(let r=0;r<t.length;r+=e){let i=t.subarray(r,r+e);n+=String.fromCharCode.apply(null,i)}return btoa(n)}function s(e,t){let r=e.remainder+t,i=r.length-r.length%4;if(e.remainder=r.slice(i),!i)return;let o=a(r.slice(0,i));e.parts.push(o),e.bytes+=o.length,e.hash=n(e.hash,o)}function c(e){if(e.remainder){let t=a(e.remainder);e.parts.push(t),e.bytes+=t.length,e.hash=n(e.hash,t),e.remainder=``}let t=new Uint8Array(e.bytes),r=0;for(let n of e.parts)t.set(n,r),r+=n.length;return e.parts=[],t}const l=/* @__PURE__ */ new Map;async function u(e,t){let n=null;try{n=await createImageBitmap(t);let r=new OffscreenCanvas(n.width,n.height);r.getContext(`2d`).drawImage(n,0,0);let i=await r.convertToBlob({type:`image/png`});self.postMessage({id:e,success:!0,result:i,mimeType:`image/png`,byteLength:i.size})}catch(t){self.postMessage({id:e,success:!1,error:t.message})}finally{n&&n.close()}}self.onmessage=function(e){let{id:d,action:f,payload:p,mimeType:m}=e.data;try{if(f===`DECODE_BEGIN`){l.set(d,{mimeType:m,parts:[],remainder:``,bytes:0,hash:t});return}if(f===`DECODE_CHUNK`){let e=l.get(d);e&&s(e,p);return}if(f===`DECODE_ABORT`){l.delete(d);return}if(f===`DECODE_END`){let e=l.get(d);if(l.delete(d),!e){self.postMessage({id:d,success:!1,error:`no transfer in progress`});return}let t=c(e);e.mimeType===`text/plain`?self.postMessage({id:d,success:!0,mimeType:e.mimeType,result:new TextDecoder().decode(t),byteLength:t.byteLength,hash:e.hash}):self.postMessage({id:d,success:!0,mimeType:e.mimeType,result:t.buffer,byteLength:t.byteLength,hash:e.hash},[t.buffer]);return}if(f===`HASH_BYTES`){let e=new Uint8Array(p);self.postMessage({id:d,success:!0,byteLength:e.byteLength,hash:n(t,e)});return}if(f===`REENCODE_PNG`){u(d,p);return}if(f===`ENCODE_BINARY_TO_B64`){let r=new Uint8Array(p),i=o(r);self.postMessage({id:d,success:!0,result:i,byteLength:r.byteLength,hash:n(e.data.hash===void 0?t:e.data.hash,r)})}else if(f===`ENCODE_TEXT_TO_B64`){let e=r(p);self.postMessage({id:d,success:!0,result:e})}else if(f===`DECODE_FROM_B64`){if(m===`text/plain`){let{text:e,byteLength:t}=i(p);self.postMessage({id:d,success:!0,result:e,mimeType:m,byteLength:t})}else{let e=a(p);self.postMessage({id:d,success:!0,result:e.buffer,mimeType:m,byteLength:e.byteLength,hash:n(t,e)},[e.buffer])}}else self.postMessage({id:d,success:!1,error:`Unknown action: ${f}`})}catch(e){self.postMessage({id:d,success:!1,error:e.message})}};",En=typeof self<`u`&&self.Blob&&new Blob([`URL.revokeObjectURL(import.meta.url);`,Tn],{type:`text/javascript;charset=utf-8`});function Dn(e){let t;try{if(t=En&&(self.URL||self.webkitURL).createObjectURL(En),!t)throw``;let n=new Worker(t,{type:`module`,name:e?.name});return n.addEventListener(`error`,()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker(`data:text/javascript;charset=utf-8,`+encodeURIComponent(Tn),{type:`module`,name:e?.name})}}var On=class{constructor(){this.worker=null,this.callbacks=new Map,this.msgId=0}init(){this.worker||(this.worker=new Dn,this.worker.onmessage=e=>{let{id:t,success:n,result:r,error:i,mimeType:a,byteLength:o,hash:s}=e.data,c=this.callbacks.get(t);c&&(this.callbacks.delete(t),n?c.resolve({result:r,mimeType:a,byteLength:o,hash:s}):c.reject(Error(i)))},console.log(`Clipboard Web Worker initialized.`))}terminate(){if(!this.worker)return;this.worker.terminate(),this.worker=null;let e=Array.from(this.callbacks.values());this.callbacks.clear();for(let{reject:t}of e){let e=Error(`Worker Terminated`);e.name=`AbortError`,t(e)}console.log(`Clipboard Web Worker terminated and pending operations aborted.`)}async encodeText(e){return this.init(),new Promise((t,n)=>{let r=++this.msgId;this.callbacks.set(r,{resolve:t,reject:n}),this.worker.postMessage({id:r,action:`ENCODE_TEXT_TO_B64`,payload:e})})}async encodeBinary(e,t){return this.init(),new Promise((n,r)=>{let i=++this.msgId;this.callbacks.set(i,{resolve:n,reject:r}),this.worker.postMessage({id:i,action:`ENCODE_BINARY_TO_B64`,payload:e,hash:t},[e])})}async hashBytes(e){return this.init(),new Promise((t,n)=>{let r=++this.msgId;this.callbacks.set(r,{resolve:t,reject:n}),this.worker.postMessage({id:r,action:`HASH_BYTES`,payload:e},[e])})}async reencodePng(e){return this.init(),new Promise((t,n)=>{let r=++this.msgId;this.callbacks.set(r,{resolve:t,reject:n}),this.worker.postMessage({id:r,action:`REENCODE_PNG`,payload:e})})}async decode(e,t){return this.init(),new Promise((n,r)=>{let i=++this.msgId;this.callbacks.set(i,{resolve:n,reject:r}),this.worker.postMessage({id:i,action:`DECODE_FROM_B64`,payload:e,mimeType:t})})}decodeStream(e){this.init();let t=++this.msgId;return this.worker.postMessage({id:t,action:`DECODE_BEGIN`,mimeType:e}),{push:e=>{this.worker&&this.worker.postMessage({id:t,action:`DECODE_CHUNK`,payload:e})},finish:()=>new Promise((e,n)=>{this.worker?(this.callbacks.set(t,{resolve:e,reject:n}),this.worker.postMessage({id:t,action:`DECODE_END`})):n(Error(`Worker Terminated`))}),abort:()=>{this.worker&&this.worker.postMessage({id:t,action:`DECODE_ABORT`})}}}},kn=5381;async function An(e,t,n){try{let r=t.slice(),i=await e.encodeBinary(r.buffer,n);return{b64:i.result,hash:i.hash}}catch(e){console.warn(`Clipboard worker encode failed; falling back to main thread:`,e);let n=``;for(let e=0;e<t.length;e+=32768)n+=String.fromCharCode.apply(null,t.subarray(e,e+32768));return{b64:btoa(n),hash:void 0}}}async function jn(e,t,{worker:n,send:r,waitDrain:i,chunkRawBytes:a,nextTid:o}){let s=t===`text/plain`,c=e.byteLength;if(c<a){let{b64:i,hash:a}=await An(n,e,kn);return r(s?`cw,${i}`:`cb,${t},${i}`),a}let l=o();r(s?`cws,${l},${c}`:`cbs,${l},${t},${c}`);let u=kn;for(let t=0;t<c;t+=a){if(i&&await i()===!1)return;let o=await An(n,e.subarray(t,t+a),u);u=o.hash,r(s?`cwd,${l},${o.b64}`:`cbd,${l},${o.b64}`)}return r(s?`cwe,${l}`:`cbe,${l}`),u}var Mn={de:`de`,fr:`fr`,es:`es`,it:`it`,pt:`pt`,ru:`ru`,pl:`pl`,cs:`cz`,sk:`sk`,hu:`hu`,tr:`tr`,da:`dk`,sv:`se`,nb:`no`,nn:`no`,no:`no`,fi:`fi`,nl:`nl`,ja:`jp`,ko:`kr`,el:`gr`,he:`il`,uk:`ua`,en:`us`},Nn={GB:`gb`,BR:`br`,CH:`ch`,BE:`be`};function Pn(e){if(!e||typeof e!=`string`)return null;let[t,n]=e.split(`-`);if(n){let e=Nn[n.toUpperCase()];if(e)return e}return Mn[t.toLowerCase()]||null}async function Fn(){try{let e=navigator.keyboard;if(e&&typeof e.getLayoutMap==`function`){let t=await e.getLayoutMap();if(t&&t.size){let e=e=>(t.get(e)||``).toLowerCase();if(e(`KeyY`)===`z`&&e(`KeyZ`)===`y`)return e(`Minus`)===`ß`?`de`:Pn(navigator.language)||`de`;if(e(`KeyQ`)===`a`&&e(`KeyA`)===`q`)return`fr`;if(e(`Semicolon`)===`ñ`)return`es`;if(e(`Semicolon`)===`ò`)return`it`;if(e(`KeyY`)===`y`&&e(`KeyQ`)===`q`){if(e(`Backslash`)===`#`)return`gb`;if(e(`Semicolon`)===`;`)return`us`}}}}catch{}return Pn(navigator.language)}var In=!1;function Ln(){if(In||typeof window>`u`)return;In=!0;let e=window.fetch.bind(window),t=`__selkiesAuthReloadChain`,n=()=>{try{let e=JSON.parse(sessionStorage.getItem(t)||`null`);if(e)return e}catch{}try{let e=window.history.state;if(e&&typeof e==`object`&&e[t])return e[t]}catch{}return null},r=e=>{let n=!1;try{sessionStorage.setItem(t,JSON.stringify(e)),n=!0}catch{}if(!n)try{let n=window.history.state;(n==null||typeof n==`object`&&!Array.isArray(n))&&window.history.replaceState(Object.assign({},n||{},{[t]:e}),``)}catch{}},i=0,a=n();a&&Date.now()-a.at<3e4&&(i=a.n|0);let o=!1,s=!1,c=()=>{o||i>=2?!o&&!s&&(s=!0,console.warn(`auth-guard: 401 persists after reloads; leaving the page as-is instead of looping.`)):(o=!0,r({at:Date.now(),n:i+1}),window.location.reload())},l=e=>{try{let t=typeof e==`string`||e instanceof URL?String(e):e.url;return new URL(t,window.location.href).origin===window.location.origin}catch{return!0}},u=e=>{try{return/^Bearer realm="Selkies/i.test(e.headers.get(`WWW-Authenticate`)||``)}catch{return!1}};window.__selkiesAuthReload=c,window.fetch=async(...t)=>{let n=await e(...t);return n.status===401&&l(t[0])&&!u(n)&&c(),n},window.__selkiesAuthProbe=()=>{try{window.fetch(new Request(window.location.href,{method:`HEAD`,cache:`no-store`,credentials:`same-origin`})).catch(()=>{})}catch{}}}function Rn(e,t,n,r){if(e===`jpeg`||!t)return null;let a=t[i(e)];if(!a||!a.ten_bit)return null;let o=e=>{let t=a.ten_bit[e],n=!!(r&&a.fullcolor&&a.fullcolor[e]);return t&&t[n?`444`:`420`]?{fullcolor:n,software:e===`software`}:null};return n||e===`h264enc-striped`||!a.hardware||r&&a.fullcolor&&a.fullcolor.hardware===!1&&a.fullcolor.software?o(`software`):o(`hardware`)||o(`software`)}function zn({server:e,stored:t,parse:n=e=>e,conditional:r,isValid:i}){let a=e=>e!=null&&(!i||i(e));if(e&&e.locked)return e.value;if(t!=null){let e=n(t);if(a(e))return e}if(e&&e.overridden&&a(e.value))return e.value;let o=r?r():void 0;return a(o)?o:e?e.value:void 0}function Bn(e,t,n,r){let i=zn({server:t?t[e.serverKey]:void 0,stored:r(e.storageKey),parse:e.parse,conditional:e.conditional?()=>e.conditional(n):void 0,isValid:e.isValid?t=>e.isValid(t,n):void 0})??e.fallback;return e.toUi?e.toUi(i):i}var Vn={id:`hidpi`,serverKey:`use_css_scaling`,storageKey:`useCssScaling`,parse:e=>e===`true`,conditional:e=>e.manualActive?!0:void 0,fallback:!1,toUi:e=>!e,toServer:e=>!e,serialize:e=>String(!e),propagate:(e,t,n)=>n.postToCore({type:`setUseCssScaling`,value:e})},Hn={id:`rate_control_mode`,serverKey:`rate_control_mode`,storageKey:`rate_control_mode`,isValid:(e,t)=>t.allowedRateControl.includes(e),fallback:`cbr`,propagate:(e,t,n)=>n.postSetting({rate_control_mode:e})};function Un(e,t,n){return{id:e,serverKey:e,storageKey:e,parse:e=>e===`true`,fallback:t,propagate:n}}var Wn=Un(`use_browser_cursors`,!1,(e,t,n)=>n.postToCore({type:`setUseBrowserCursors`,value:e})),Gn=Un(`video_fullcolor`,!1,(e,t,n)=>n.postSetting({video_fullcolor:e})),Kn=Un(`video_10bit`,!1,(e,t,n)=>n.postSetting({video_10bit:e})),qn=Un(`video_streaming_mode`,!1,(e,t,n)=>n.postSetting({video_streaming_mode:e})),Jn={...Un(`use_paint_over_quality`,!0,(e,t,n)=>n.postSetting({use_paint_over_quality:e})),conditional:e=>e.videoStreamingMode===void 0?void 0:e.encoder===`jpeg`||!e.videoStreamingMode},Yn=Un(`use_cpu`,!1,(e,t,n)=>n.postSetting({use_cpu:e})),Xn=Un(`cpu_encode_threading`,!0,(e,t,n)=>n.postSetting({cpu_encode_threading:e})),Zn=Un(`force_aligned_resolution`,!1,(e,t,n)=>n.postSetting({force_aligned_resolution:e})),Qn={...Un(`raw_pointer_motion`,!0,(e,t,n)=>n.postToCore({type:`setRawPointerMotion`,value:e})),conditional:e=>!e.macDesktop&&void 0},$n=Un(`mac_cmd_as_ctrl`,!0,(e,t,n)=>n.postToCore({type:`setMacCmdAsCtrl`,value:e})),er=[Vn,Hn,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n].reduce((e,t)=>(t.storageKey!==t.serverKey&&(e[t.serverKey]=t.storageKey),e),{});function tr(e){return er[e]||e}var nr=`keyboard-input-assist`;function rr(){let e=document.getElementById(nr);return e||(e=document.createElement(`input`),e.type=`search`,e.id=nr,Object.assign(e.style,{position:`absolute`,left:`-9999px`,top:`-9999px`,width:`1px`,height:`1px`,opacity:`0`,border:`0`,padding:`0`,caretColor:`transparent`}),e.setAttribute(`aria-hidden`,`true`),e.setAttribute(`autocomplete`,`off`),e.setAttribute(`autocorrect`,`off`),e.setAttribute(`autocapitalize`,`off`),e.setAttribute(`spellcheck`,`false`),document.body.appendChild(e),e)}function ir(e){let t=document.getElementById(nr);if(!t)return!1;let n=typeof navigator<`u`?navigator.virtualKeyboard:void 0,r=!!n&&typeof n.show==`function`;if(t.removeAttribute(`aria-hidden`),t.value=``,r&&t.setAttribute(`virtualkeyboardpolicy`,`manual`),t.focus({preventScroll:!0}),r)try{n.show()}catch(e){console.warn(`The on-screen keyboard was not shown:`,e)}return t.addEventListener(`blur`,()=>{if(t.setAttribute(`aria-hidden`,`true`),r&&typeof n.hide==`function`)try{n.hide()}catch{}},{once:!0}),e&&e.addEventListener(`touchstart`,()=>{document.activeElement===t&&t.blur()},{once:!0,passive:!0}),!0}var ar=[{id:1,name:`h264`,codec:`avc1.42E01F`,extra:{avc:{format:`annexb`}}},{id:2,name:`vp8`,codec:`vp8`,extra:{}},{id:3,name:`vp9`,codec:`vp09.00.31.08`,extra:{}},{id:4,name:`av1`,codec:`av01.0.05M.08`,extra:{}},{id:5,name:`h265`,codec:`hev1.1.6.L93.B0`,extra:{hevc:{format:`annexb`}}}],or=4e3,sr=2,cr=[`auto`,`h264`,`h265`,`vp8`,`vp9`,`av1`,`mjpeg`],lr=1/6;function ur(){let e=0,t=0;return{note(n){e++,n&&t++},tooSlow(){if(e<60)return!1;let n=t/e>lr;return e=0,t=0,n},behindRatio(){return e?t/e:0},reset(){e=0,t=0}}}function dr(e){let t=15e3/(e>0?e:30),n=[];return{budgetMs:t,sent(e,t){n.push({timestamp:e,wall:t})},answered(e){for(;n.length&&n[0].timestamp<=e;)n.shift()},lagMs(e){return n.length?e-n[0].wall:0},reset(){n=[]}}}var fr=e=>{e&&typeof e.close==`function`&&e.close()},pr=2,G=typeof VideoFrame<`u`&&typeof VideoFrame.prototype==`object`&&`rotation`in VideoFrame.prototype,mr=-90,hr={rotation:0,flip:!1},gr=()=>((window.orientation-mr)%360+360)%360,_r=()=>!G&&typeof window.orientation==`number`,vr=`
let reader = null, track = null, inFlight = 0;
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === 'ack') { if (inFlight > 0) inFlight--; return; }
  if (m.type === 'stop') { try { reader && reader.cancel(); } catch (err) {} try { track && track.stop(); } catch (err) {} reader = null; return; }
  if (m.type !== 'source') return;
  track = m.track;
  try { reader = new MediaStreamTrackProcessor({ track }).readable.getReader(); }
  catch (err) { self.postMessage({ type: 'failed' }); return; }
  self.postMessage({ type: 'ready' });
  for (;;) {
    let r;
    try { r = await reader.read(); } catch (err) { break; }
    if (r.done) break;
    if (inFlight >= ${pr}) { r.value.close(); continue; }
    inFlight++;
    self.postMessage({ type: 'frame', frame: r.value }, [r.value]);
  }
  self.postMessage({ type: 'end' });
};
`,yr=`
let CANDIDATES = ${JSON.stringify(ar)};
const PACE_MIN_SAMPLES = 60;
const PACE_BEHIND_RATIO = ${lr};
const PACE_LAG_INTERVALS = 15;
const PROBE_COLOR_TOLERANCE = 48;
const createLagGauge = ${dr.toString()};
const KEYFRAME_INTERVAL_MS = ${or};
const HAS_FRAME_ORIENTATION = ${G};
// Frames taken from the camera to measure the candidates with, how long to wait
// for them, and the time one candidate may spend on them. Synthetic content
// cannot stand in: a codec costs what the lens shows, at the size it shows it.
const PROBE_SOURCE_FRAMES = 8;
const PROBE_WAIT_MS = 2500;
const PROBE_BUDGET_MS = 400;
// Share of the asked rate a candidate must clearly reach to start on: a few
// frames either way is noise, and the watchdog judges what the camera then
// does to it on real frames.
const PROBE_RATE_MARGIN = 0.9;
let encoder = null, candIndex = 0, cand = null, configuring = false, active = true;
let wirePort = null;
// Camera frames held while probing; during the measurement itself further
// frames are dropped, so nothing reaches the wire unvetted.
let probing = false, measuring = false, probeFrames = [], probeTimer = null;
let fps = 30, bitrate = 2500000, encodedSize = null, forceKeyframe = true, lastKeyframeMs = 0;
let trackReader = null, trackRef = null;
// The pace window (see createEncodePace) and the staleness gauge that
// catches an encoder holding frames off-queue.
let paceOffered = 0, paceBehind = 0, lag = null;
// The upright transform every chunk is stamped with, and the one the encoder
// latched: they differ where the page derives what the frames do not carry, and
// then no rebuild is owed for a turn the encoder never sees.
let orientation = { rotation: 0, flip: false }, derived = null;

function encoderConfig(c, w, h) {
  return { codec: c.codec, width: w, height: h, bitrate, framerate: fps, latencyMode: 'realtime', ...c.extra };
}

async function makeEncoder(w, h, latched) {
  configuring = true;
  while (candIndex < CANDIDATES.length) {
    cand = CANDIDATES[candIndex];
    let support = null;
    try { support = await VideoEncoder.isConfigSupported(encoderConfig(cand, w, h)); } catch (err) { support = null; }
    if (!active) { configuring = false; return false; }
    if (!support || !support.supported) { candIndex++; continue; }
    try {
      const enc = new VideoEncoder({
        output: (chunk) => {
          if (lag) lag.answered(chunk.timestamp);
          if (!active) return;
          const buf = new ArrayBuffer(chunk.byteLength);
          chunk.copyTo(new Uint8Array(buf));
          const framed = { codecId: cand.id, keyframe: chunk.type === 'key', buffer: buf,
                           rotation: orientation.rotation, flip: orientation.flip };
          if (wirePort) wirePort.postMessage(framed, [buf]);
          else self.postMessage({ type: 'chunk', ...framed }, [buf]);
        },
        error: (err) => { try { encoder && encoder.close(); } catch (x) {} encoder = null; encodedSize = null; lag = null; candIndex++; },
      });
      enc.configure(support.config || encoderConfig(cand, w, h));
      encoder = enc; encodedSize = { w: w, h: h, rotation: latched.rotation, flip: latched.flip };
      lag = createLagGauge(fps);
      forceKeyframe = true; configuring = false;
      self.postMessage({ type: 'ready', codec: cand.name });
      return true;
    } catch (err) { candIndex++; }
  }
  encoder = null; encodedSize = null; configuring = false;
  self.postMessage({ type: 'unsupported' });
  return false;
}

function encodeWith(frame, w, h) {
  if (!encoder || encoder.state !== 'configured' || !active) { frame.close(); return; }
  const now = performance.now();
  // A visible queue and stale output both count as behind.
  const behind = encoder.encodeQueueSize > 1 || (lag !== null && lag.lagMs(now) > lag.budgetMs);
  paceOffered++;
  if (behind) paceBehind++;
  if (paceOffered >= PACE_MIN_SAMPLES) {
    const slow = paceBehind / paceOffered > PACE_BEHIND_RATIO;
    paceOffered = 0; paceBehind = 0;
    // Dropping or delaying this much of the camera is what a codec this
    // engine cannot encode in real time looks like: a core at full tilt and
    // a receiver falling behind. Take the next rung; the page takes the JPEG
    // one when this list runs out.
    if (slow) {
      self.postMessage({ type: 'slow', codec: cand ? cand.name : '' });
      try { if (encoder && encoder.state !== 'closed') encoder.close(); } catch (err) {}
      encoder = null; encodedSize = null; lag = null; candIndex++;
      if (candIndex >= CANDIDATES.length) self.postMessage({ type: 'exhausted' });
      frame.close();
      return;
    }
  }
  // The encoder is behind: drop this input frame (never an encoded output) so no
  // reference chain breaks; a worker rarely reaches this, which is the point.
  if (behind) { frame.close(); return; }
  const keyFrame = forceKeyframe || now - lastKeyframeMs >= KEYFRAME_INTERVAL_MS;
  try {
    encoder.encode(frame, { keyFrame: keyFrame });
    if (lag) lag.sent(frame.timestamp, now);
    if (keyFrame) { lastKeyframeMs = now; forceKeyframe = false; }
  } catch (err) { try { encoder.close(); } catch (x) {} encoder = null; encodedSize = null; lag = null; candIndex++; }
  frame.close();
}

function orientationOf(frame) {
  return HAS_FRAME_ORIENTATION
    ? { rotation: frame.rotation || 0, flip: !!frame.flip }
    : { rotation: 0, flip: false };
}

function handleFrame(frame, label) {
  if (!active) { frame.close(); return; }
  const w = frame.displayWidth || frame.codedWidth;
  const h = frame.displayHeight || frame.codedHeight;
  const latched = orientationOf(frame);
  orientation = label || (HAS_FRAME_ORIENTATION ? latched : (derived || orientation));
  if (probing) {
    if (measuring || probeFrames.length >= PROBE_SOURCE_FRAMES) { frame.close(); return; }
    // The window belongs to the camera once it is delivering. A device chosen
    // from several starts late, and a window spent waiting for it would expire
    // holding too few frames to measure anything.
    if (!probeFrames.length && probeTimer !== null) {
      clearTimeout(probeTimer);
      probeTimer = setTimeout(() => { if (probing) runProbe(w, h); }, PROBE_WAIT_MS);
    }
    probeFrames.push(frame);
    if (probeFrames.length >= PROBE_SOURCE_FRAMES) runProbe(w, h);
    return;
  }
  if (configuring) { frame.close(); return; }
  // A spent ladder was announced once; later frames are not a fresh verdict.
  if (!encoder && candIndex >= CANDIDATES.length) { frame.close(); return; }
  if (!encoder || !encodedSize || encodedSize.w !== w || encodedSize.h !== h ||
      encodedSize.rotation !== latched.rotation || encodedSize.flip !== latched.flip) {
    makeEncoder(w, h, latched).then(() => { if (encoder) encodeWith(frame, w, h); else frame.close(); });
    return;
  }
  encodeWith(frame, w, h);
}

// Frames per second one candidate sustains on the camera's own frames, or 0 if
// it cannot encode them.
async function measure(c, w, h, frames) {
  const out = { rate: 0, colErr: -1 };
  let support = null;
  try { support = await VideoEncoder.isConfigSupported(encoderConfig(c, w, h)); } catch (err) { return out; }
  if (!support || !support.supported) return out;
  let encoded = 0, failed = false;
  const chunks = [];
  const enc = new VideoEncoder({
    output: (chunk) => {
      encoded++;
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      chunks.push({ key: chunk.type === 'key', ts: chunk.timestamp, data });
    },
    error: () => { failed = true; },
  });
  try { enc.configure(support.config || encoderConfig(c, w, h)); } catch (err) { return out; }
  const started = performance.now();
  // The frames stay open: each candidate encodes the same ones, and the probe
  // closes them once the last candidate has had its turn.
  for (let i = 0; i < frames.length && !failed; i++) {
    try { enc.encode(frames[i], { keyFrame: i === 0 }); } catch (err) { failed = true; }
  }
  await Promise.race([
    enc.flush().catch(() => { failed = true; }),
    new Promise((r) => setTimeout(r, PROBE_BUDGET_MS)),
  ]);
  const rate = encoded / ((performance.now() - started) / 1000);
  try { enc.close(); } catch (err) { /* already closed */ }
  if (failed) return out;
  out.rate = rate;
  out.colErr = await colorError(frames[0], chunks, c);
  return out;
}

// Largest per-channel difference between region means of the first probe frame
// and its own decoded output, or -1 when there is nothing to judge with (an
// unjudged candidate passes). Drawn unscaled over a coarse grid: means converge
// however lossily grain encodes while false chroma moves whole regions, and
// drawImage downscaling point-samples on some engines.
async function colorError(frame, chunks, c) {
  if (typeof OffscreenCanvas === 'undefined' || typeof VideoDecoder === 'undefined' || !chunks.length) return -1;
  const cells = 4;
  const regionMeans = (source, w, h) => {
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, 0, 0);
    const d = ctx.getImageData(0, 0, w, h).data;
    const sums = new Float64Array(cells * cells * 3);
    const counts = new Float64Array(cells * cells);
    for (let y = 0; y < h; y++) {
      const rowCell = (((y * cells) / h) | 0) * cells;
      for (let x = 0; x < w; x++) {
        const cell = rowCell + (((x * cells) / w) | 0);
        const i = (y * w + x) * 4;
        sums[cell * 3] += d[i];
        sums[cell * 3 + 1] += d[i + 1];
        sums[cell * 3 + 2] += d[i + 2];
        counts[cell]++;
      }
    }
    for (let cell = 0; cell < counts.length; cell++) {
      sums[cell * 3] /= counts[cell];
      sums[cell * 3 + 1] /= counts[cell];
      sums[cell * 3 + 2] /= counts[cell];
    }
    return sums;
  };
  const decoded = [];
  try {
    const w = frame.displayWidth || frame.codedWidth;
    const h = frame.displayHeight || frame.codedHeight;
    const want = regionMeans(frame, w, h);
    let failed = false;
    const dec = new VideoDecoder({ output: (f) => decoded.push(f), error: () => { failed = true; } });
    dec.configure({ codec: c.codec });
    for (let i = 0; i < chunks.length; i++) {
      dec.decode(new EncodedVideoChunk({ type: chunks[i].key ? 'key' : 'delta', timestamp: chunks[i].ts, data: chunks[i].data }));
    }
    await dec.flush();
    let err = -1;
    if (decoded.length && !failed) {
      const got = regionMeans(decoded[decoded.length - 1], w, h);
      err = 0;
      for (let i = 0; i < want.length; i++) err = Math.max(err, Math.abs(want[i] - got[i]));
    }
    try { dec.close(); } catch (e2) { /* already closed */ }
    for (let i = 0; i < decoded.length; i++) { try { decoded[i].close(); } catch (e2) {} }
    return err;
  } catch (err) {
    for (let i = 0; i < decoded.length; i++) { try { decoded[i].close(); } catch (e2) {} }
    return -1;
  }
}

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === 'frame') { handleFrame(m.frame, { rotation: m.rotation, flip: m.flip }); return; }
  // The page derives what a track this worker reads cannot tell it: no window here.
  if (m.type === 'orientation') { derived = { rotation: m.rotation, flip: m.flip }; return; }
  if (m.type === 'track') {
    // Combined read+encode: read the transferred camera track in this worker, so
    // frames never reach the page thread. Needs a worker MediaStreamTrackProcessor.
    if (typeof MediaStreamTrackProcessor === 'undefined') { self.postMessage({ type: 'track_unsupported' }); return; }
    try { trackReader = new MediaStreamTrackProcessor({ track: m.track }).readable.getReader(); }
    catch (err) { self.postMessage({ type: 'track_unsupported' }); return; }
    trackRef = m.track;
    self.postMessage({ type: 'track_reading' });
    (async () => {
      for (;;) {
        let r;
        try { r = await trackReader.read(); } catch (err) { break; }
        if (r.done || !active) { if (r.value) r.value.close(); break; }
        handleFrame(r.value);
      }
    })();
    return;
  }
  if (m.type === 'keyframe') { forceKeyframe = true; return; }
  if (m.type === 'wirePort') {
    // Encoded frames then go straight to the transport; the receiver answers
    // {needKeyframe:true} when a send gap broke the delta chain.
    wirePort = m.port;
    wirePort.onmessage = (ev) => { if (ev.data && ev.data.needKeyframe) forceKeyframe = true; };
    return;
  }
  if (m.type === 'config') { if (m.fps) fps = m.fps; if (m.bitrate) bitrate = m.bitrate; return; }
  if (m.type === 'stop') {
    active = false;
    try { trackReader && trackReader.cancel(); } catch (x) {}
    try { trackRef && trackRef.stop(); } catch (x) {}
    trackReader = null; trackRef = null;
    try { encoder && encoder.close(); } catch (x) {} encoder = null;
    return;
  }
  if (m.type === 'probe') {
    fps = m.fps || 30; bitrate = m.bitrate || 2500000;
    if (Array.isArray(m.candidates) && m.candidates.length) CANDIDATES = m.candidates;
    if (typeof VideoEncoder === 'undefined') { self.postMessage({ type: 'unsupported' }); return; }
    probing = true; probeFrames = [];
    // A camera that never delivers must not hold the uplink: rank on whatever
    // arrived, and if nothing did, open on the first candidate and leave the
    // watchdog to answer for it.
    probeTimer = setTimeout(() => {
      if (probing) runProbe(m.width || 1280, m.height || 720);
    }, PROBE_WAIT_MS);
  }
};

// Ranks the candidates on the held camera frames and commits to one, or hands
// the page the JPEG rung when none of them keeps up with what the lens is
// showing at the size it is showing it.
async function runProbe(w, h) {
  if (!probing || measuring) return;
  measuring = true;
  if (probeTimer !== null) { clearTimeout(probeTimer); probeTimer = null; }
  const frames = probeFrames;
  probeFrames = [];
  // A partial set is no measurement: a few frames carry the keyframe and the
  // flush and read low enough to reject a codec that keeps up, so open on
  // the first candidate and let the watchdog answer for it.
  if (frames.length < PROBE_SOURCE_FRAMES) {
    probing = false; measuring = false;
    for (let i = 0; i < frames.length; i++) { try { frames[i].close(); } catch (err) {} }
    if (!active) return;
    self.postMessage({ type: 'probed', codec: CANDIDATES[0].name });
    return;
  }
  let best = -1, bestRate = 0, wrongColor = false;
  for (let i = 0; i < CANDIDATES.length; i++) {
    const m = await measure(CANDIDATES[i], w, h, frames);
    // Wrong colors are out however fast; the JPEG rung draws through the
    // reference's own path.
    if (m.colErr > PROBE_COLOR_TOLERANCE) {
      wrongColor = true;
      self.postMessage({ type: 'wrongcolor', codec: CANDIDATES[i].name, colErr: Math.round(m.colErr) });
      continue;
    }
    if (m.rate > bestRate) { best = i; bestRate = m.rate; }
    if (m.rate >= fps) break;
  }
  probing = false; measuring = false;
  for (let i = 0; i < frames.length; i++) { try { frames[i].close(); } catch (err) {} }
  if (!active) return;
  if (best < 0) {
    candIndex = CANDIDATES.length;
    self.postMessage({ type: wrongColor ? 'exhausted' : 'unsupported' });
    return;
  }
  // Nothing near the asked rate: starting anyway spends a core to send a
  // fraction of the camera, which the JPEG rung exists to avoid. Merely-near
  // is taken; the watchdog answers for it.
  if (bestRate < fps * PROBE_RATE_MARGIN) {
    candIndex = CANDIDATES.length;
    self.postMessage({ type: 'exhausted', codec: CANDIDATES[best].name, rate: bestRate.toFixed(1) });
    return;
  }
  candIndex = best;
  self.postMessage({ type: 'probed', codec: CANDIDATES[best].name, rate: Math.round(bestRate) });
}
`,br=class{constructor(e){this._sendFrame=e.sendFrame,this._onStateChange=e.onStateChange||(()=>{}),this._onError=e.onError||(()=>{}),this._canSend=e.canSend||(()=>!0),this.width=e.width||1280,this.height=e.height||720,this.fps=e.fps||30,this.bitrate=e.bitrate||25e5,this.quality=e.quality||.8,this.encoderPreference=cr.indexOf(e.encoderPreference)>=0?e.encoderPreference:`auto`,this._encoderCandidates=ar.some(e=>e.name===this.encoderPreference)?ar.filter(e=>e.name===this.encoderPreference):ar,this._stream=null,this._track=null,this._source=null,this._establishing=!1,this._encoder=null,this._encoderCodec=null,this._candidateIndex=0,this._encodedSize=null,this._forceKeyframe=!0,this._chainBroken=!1,this._lastKeyframeMs=0,this._lastFrameMs=0,this._frameCredit=0,this._canvas=null,this._ctx=null,this._jpegBusy=!1,this._pace=ur(),this._configuring=!1,this._deriveOrientation=!1,this._orientation=hr,this._orientationWatch=null,this._active=!1,this._generation=0,this._encodeWorker=null,this._wireProvider=null,this._workerTrackUnsupported=!1,this._settleEncodeWorker=null,this._workerIsSource=!1,this._encoderCodecName=null}get active(){return this._active}get codec(){return this._encoderCodecName?this._encoderCodecName:this._encoderCodec?this._encoderCodec.name:this._active?`mjpeg`:null}_logPath(e){this._loggedPaths||=new Set,!this._loggedPaths.has(e)&&(this._loggedPaths.add(e),console.info(`[Webcam] ${e}`))}async start(e){if(this._active)return;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){let e=Error(`getUserMedia unavailable`);e.name=`NotSupportedError`,this._onError(e);return}let t={width:{ideal:this.width},height:{ideal:this.height},frameRate:{ideal:this.fps}};e&&(t.deviceId={exact:e});let n=++this._generation,r;try{r=await navigator.mediaDevices.getUserMedia({video:t,audio:!1})}catch(e){this._generation===n&&this._onError(e);return}if(this._generation!==n){r.getTracks().forEach(e=>e.stop());return}let i=r.getVideoTracks()[0];if(!i){r.getTracks().forEach(e=>e.stop()),this._onError(Error(`no video track`));return}this._stream=r,this._track=i,this._active=!0,this._forceKeyframe=!0,this._chainBroken=!1,this._lastFrameMs=0,this._frameCredit=0;let a=++this._generation;i.addEventListener(`ended`,()=>{this._generation===a&&this.stop()}),this._onStateChange(!0),this._source=await this._openCapture(i,a),this._generation===a?this._source||(this._onError(Error(`no frame source for the camera track`)),this.stop()):this._source&&this._source.close()}requestKeyframe(){if(this._forceKeyframe=!0,this._encodeWorker)try{this._encodeWorker.postMessage({type:`keyframe`})}catch{}}stop(){if(this._generation++,this._active||this._stream){if(this._active=!1,this._stopEncodeWorker(),this._source&&=(this._source.close(),null),this._encoder){try{this._encoder.close()}catch{}this._encoder=null,this._encoderCodec=null}this._configuring=!1,this._deriveOrientation=!1,this._orientation=hr,this._unwatchOrientation(),this._stream&&(this._stream.getTracks().forEach(e=>{try{e.stop()}catch{}}),this._stream=null,this._track=null),this._canvas=null,this._ctx=null,this._encodedSize=null,this._candidateIndex=0,this._encoderCodecName=null,this._chainBroken=!1,this._lastFrameMs=0,this._frameCredit=0,this._onStateChange(!1)}}async _openCapture(e,t){this._establishing=!0,this.encoderPreference===`mjpeg`&&(this._candidateIndex=this._encoderCandidates.length,this._encoderCodecName=`mjpeg`,this._logPath(`encode: JPEG (webcam_encoder is mjpeg)`));let n=this._openEncodeWorker(t);try{let r=null,i=!1;return this._encodeWorker&&(r=await this._tryCombinedWorker(e,t),i=!!r,this._generation!==t)||(r||=await this._openSource(e,t),this._generation!==t)||(await n,this._generation!==t)||i&&!this._encodeWorker&&(r=await this._openSource(e,t),this._generation!==t)?(r&&r.close(),null):r}finally{this._establishing=!1}}_tryCombinedWorker(e,t){let n=this._encodeWorker;if(!n)return Promise.resolve(null);let r;try{r=e.clone()}catch{return Promise.resolve(null)}return new Promise(e=>{let i=!1,a=t=>{i||(i=!0,n.removeEventListener(`message`,o),clearTimeout(s),e(t))},o=e=>{let i=e.data;if(i.type===`track_reading`)this._generation===t&&(this._workerIsSource=!0,this._deriveOrientation=_r(),this._watchOrientation(),this._logPath(`capture+encode: camera read and encoded in a worker`)),a({close:()=>{this._encodeWorker===n&&this._stopEncodeWorker()}});else if(i.type===`track_unsupported`){this._workerTrackUnsupported=!0;try{r.stop()}catch{}a(null)}},s=setTimeout(()=>{try{r.stop()}catch{}a(null)},2e3);n.addEventListener(`message`,o);try{n.postMessage({type:`track`,track:r},[r])}catch{try{r.stop()}catch{}a(null)}})}setWireProvider(e){this._wireProvider=e}_openEncodeWorker(e){if(typeof VideoEncoder>`u`||typeof Worker>`u`||this._candidateIndex>=this._encoderCandidates.length)return Promise.resolve();let t;try{let e=URL.createObjectURL(new Blob([yr],{type:`text/javascript`}));t=new Worker(e),URL.revokeObjectURL(e)}catch{return Promise.resolve()}return new Promise(n=>{let r=!1,i=()=>{r||(r=!0,this._settleEncodeWorker===a&&(this._settleEncodeWorker=null),n())},a=()=>{clearTimeout(s),i()},o=n=>{console.warn(`[Webcam] encode-worker unavailable, encoding on the page:`,n);let r=this._workerIsSource;this._encodeWorker===t&&(this._encodeWorker=null),this._workerIsSource=!1;try{t.terminate()}catch{}i(),r&&!this._establishing&&this._active&&this._generation===e&&(this._source=null,this._openSource(this._track,e).then(t=>{this._generation===e?(this._source=t,t||this._onError(Error(`no frame source for the camera track`))):t&&t.close()}))},s=setTimeout(()=>o(`probe timeout`),8e3);t.onmessage=n=>{let r=n.data;if(r.type===`probed`){if(clearTimeout(s),this._encodeWorker=t,this._wireProvider)try{let e=this._wireProvider();e&&t.postMessage({type:`wirePort`,port:e},[e])}catch{}this._encoderCodecName=r.codec,this._logPath(r.rate===void 0?`encode: ${r.codec} in a worker, unmeasured (no camera frames to rank on)`:`encode: ${r.codec} in a worker, ${r.rate} fps measured against ${this.fps} asked for`),i()}else r.type===`ready`?this._encoderCodecName=r.codec:r.type===`chunk`?this._active&&this._generation===e&&this._deliverEncoded(r.codecId,r.keyframe,new Uint8Array(r.buffer),r.rotation,r.flip):r.type===`slow`?this._logPath(`encode: ${r.codec} could not keep up with the camera; taking the next rung`):r.type===`wrongcolor`?this._logPath(`encode: ${r.codec} decodes to the wrong colors on this engine (mean channel error ${r.colErr}); skipping it`):r.type===`exhausted`?(clearTimeout(s),this._logPath(r.rate===void 0?`encode: no codec kept up with the camera; encoding JPEG instead`:`encode: no codec kept up with the camera (${r.codec} reached ${r.rate} fps against ${this.fps} asked for); encoding JPEG instead`),this._stopEncodeWorker(),this._candidateIndex=this._encoderCandidates.length,this._encoderCodecName=`mjpeg`,i()):(r.type===`unsupported`||r.type===`error`)&&(clearTimeout(s),o(r.type))},t.onerror=e=>{clearTimeout(s),o(`worker.onerror: `+(e&&e.message))},this._encodeWorker=t,this._settleEncodeWorker=a;try{t.postMessage({type:`probe`,width:this.width,height:this.height,fps:this.fps,bitrate:this.bitrate,candidates:this._encoderCandidates})}catch(e){clearTimeout(s),o(`probe postMessage threw: `+e)}})}_watchOrientation(){if(!this._deriveOrientation||this._orientationWatch)return;let e=()=>this._pushOrientation();this._orientationWatch=e,window.addEventListener(`orientationchange`,e),screen.orientation&&screen.orientation.addEventListener&&screen.orientation.addEventListener(`change`,e),e()}_unwatchOrientation(){let e=this._orientationWatch;this._orientationWatch=null,e&&(window.removeEventListener(`orientationchange`,e),screen.orientation&&screen.orientation.removeEventListener&&screen.orientation.removeEventListener(`change`,e))}_pushOrientation(){if(this._encodeWorker){this._orientation={rotation:gr(),flip:!1};try{this._encodeWorker.postMessage({type:`orientation`,...this._orientation})}catch{}}}_stopEncodeWorker(){let e=this._encodeWorker,t=this._settleEncodeWorker;if(this._encodeWorker=null,this._settleEncodeWorker=null,this._workerIsSource=!1,e){e.onmessage=null;try{e.postMessage({type:`stop`})}catch{}setTimeout(()=>{try{e.terminate()}catch{}},100)}t&&t()}async _openSource(e,t){if(!this._workerTrackUnsupported){let n=await this._workerSource(e,t);if(n)return this._deriveOrientation=_r(),this._logPath(`capture: MediaStreamTrackProcessor in a worker`),n;if(this._generation!==t)return null}if(typeof MediaStreamTrackProcessor<`u`)try{let n=new MediaStreamTrackProcessor({track:e});return this._logPath(`capture: MediaStreamTrackProcessor on the page`),this._readerSource(n.readable.getReader(),t)}catch{}return typeof VideoFrame>`u`?this._pinJpegRung(`no VideoFrame constructor`):this.encoderPreference===`auto`||this.encoderPreference===`mjpeg`?this._pinJpegRung(`webcam_encoder is ${this.encoderPreference}`):this._logPath(`capture: <video> element sampled with requestVideoFrameCallback`),this._videoSource(e,t)}_pinJpegRung(e){this._stopEncodeWorker(),this._candidateIndex=this._encoderCandidates.length,this._encoderCodecName=`mjpeg`,this._logPath(`capture: <video> element sampled with requestVideoFrameCallback (JPEG: ${e})`)}_readerSource(e,t){return(async()=>{for(;;){let n;try{n=await e.read()}catch{break}if(n.done||this._generation!==t){n.value&&n.value.close();break}this._handleFrame(n.value)}})(),{close:()=>{try{e.cancel()}catch{}}}}_workerSource(e,t){return new Promise(n=>{let r;try{r=e.clone()}catch{n(null);return}let i;try{let e=URL.createObjectURL(new Blob([vr],{type:`text/javascript`}));i=new Worker(e),URL.revokeObjectURL(e)}catch{try{r.stop()}catch{}n(null);return}let a=!1,o=e=>{a||(a=!0,n(e))},s=setTimeout(()=>{i.terminate();try{r.stop()}catch{}o(null)},3e3),c={close:()=>{try{i.postMessage({type:`stop`})}catch{}setTimeout(()=>i.terminate(),100)}};i.onerror=()=>{clearTimeout(s),i.terminate();try{r.stop()}catch{}o(null)},i.onmessage=e=>{let n=e.data;if(n){if(n.type===`ready`)clearTimeout(s),o(c);else if(n.type===`failed`){clearTimeout(s),i.terminate();try{r.stop()}catch{}o(null)}else if(n.type===`frame`){if(i.postMessage({type:`ack`}),this._generation!==t){n.frame.close();return}this._handleFrame(n.frame)}else n.type===`end`&&i.terminate()}};try{i.postMessage({type:`source`,track:r},[r])}catch{clearTimeout(s),i.terminate();try{r.stop()}catch{}o(null)}})}_videoSource(e,t){let n=document.createElement(`video`);n.muted=!0,n.playsInline=!0,n.autoplay=!0,n.style.cssText=`position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;`,document.body.appendChild(n),n.srcObject=new MediaStream([e]);let r=null,i=null,a=null,o=null,s=0,c=()=>{let e=Math.round(performance.now()*1e3);try{return new VideoFrame(n,{timestamp:e})}catch{}try{return a||(a=document.createElement(`canvas`),o=a.getContext(`2d`,{alpha:!1,desynchronized:!0})),(a.width!==n.videoWidth||a.height!==n.videoHeight)&&(a.width=n.videoWidth,a.height=n.videoHeight),o.drawImage(n,0,0),new VideoFrame(a,{timestamp:e})}catch{return null}},l=()=>{if(this._generation===t){if(n.readyState>=2&&n.videoWidth>0){if(typeof VideoFrame<`u`&&this._candidateIndex<this._encoderCandidates.length){let e=c();e?(s=0,this._handleFrame(e)):++s>this.fps&&this._pinJpegRung(`VideoFrames cannot be built from the element`)}else this._handleFrame(n)}n.requestVideoFrameCallback&&(r=n.requestVideoFrameCallback(l))}},u=n.play();return u&&u.catch&&u.catch(()=>{}),n.requestVideoFrameCallback?r=n.requestVideoFrameCallback(l):i=setInterval(l,1e3/this.fps),{close:()=>{if(r!==null&&n.cancelVideoFrameCallback)try{n.cancelVideoFrameCallback(r)}catch{}i!==null&&clearInterval(i);try{n.srcObject=null}catch{}n.remove()}}}_handleFrame(e){if(!this._active||!this._canSend()){fr(e);return}let t=performance.now();if(!this._admit(t)){fr(e);return}if(this._encodeWorker)try{let t=this._frameOrientation(e);this._encodeWorker.postMessage({type:`frame`,frame:e,...t},[e]);return}catch{this._stopEncodeWorker(),fr(e);return}if(typeof VideoEncoder>`u`||this._candidateIndex>=this._encoderCandidates.length){this._encodeJpeg(e);return}let n=e.displayWidth||e.codedWidth,r=e.displayHeight||e.codedHeight,i={rotation:e.rotation||0,flip:!!e.flip};this._orientation=this._frameOrientation(e);let a=this._encodedSize;if(!this._encoder||!a||a.w!==n||a.h!==r||a.rotation!==i.rotation||a.flip!==i.flip){if(this._configuring){e.close();return}this._configuring=!0,this._configureEncoder(n,r,i.rotation,i.flip).then(()=>this._encodeWith(e,n,r,t)).finally(()=>{this._configuring=!1})}else this._encodeWith(e,n,r,t)}_admit(e){let t=1e3/this.fps,n=this._lastFrameMs?e-this._lastFrameMs:t;return this._lastFrameMs=e,this._frameCredit=Math.min(this._frameCredit+n,t*sr),this._frameCredit<t?!1:(this._frameCredit-=t,!0)}_frameOrientation(e){return this._deriveOrientation?{rotation:gr(),flip:!1}:{rotation:e.rotation||0,flip:!!e.flip}}_encodeWith(e,t,n,r){let i=this._encoder;if(!i||i.state!==`configured`||!this._active){e.close();return}let a=i.encodeQueueSize>1;if(this._pace.note(a),this._pace.tooSlow()){this._onEncoderTooSlow(),e.close();return}if(a){e.close();return}let o=this._forceKeyframe||r-this._lastKeyframeMs>=or;try{i.encode(e,{keyFrame:o}),o&&(this._lastKeyframeMs=r,this._forceKeyframe=!1)}catch(e){this._onEncoderFailure(e)}e.close()}async _configureEncoder(e,t,n=0,r=!1){let i=this._generation;if(this._encoder){try{this._encoder.close()}catch{}this._encoder=null,this._encoderCodec=null}for(;this._candidateIndex<this._encoderCandidates.length;){let a=this._encoderCandidates[this._candidateIndex],o={codec:a.codec,width:e,height:t,bitrate:this.bitrate,framerate:this.fps,latencyMode:`realtime`,...a.extra},s;try{s=await VideoEncoder.isConfigSupported(o)}catch{s=null}if(this._generation!==i)return;if(!s||!s.supported)this._candidateIndex++;else try{let c=new VideoEncoder({output:e=>this._onChunk(a,e,i),error:e=>this._onEncoderFailure(e)});c.configure(s.config||o),this._encoder=c,this._encoderCodec=a,this._encodedSize={w:e,h:t,rotation:n,flip:r},this._forceKeyframe=!0,this._logPath(`encoder: ${a.name} (${a.codec}) at ${e}x${t}`);return}catch{this._candidateIndex++}}this._encodedSize=null}_deliverEncoded(e,t,n,r,i){this._canSend()?this._chainBroken&&!t?this.requestKeyframe():(this._sendFrame(e,t,n,r,i),t&&(this._chainBroken=!1)):this._chainBroken=!0}_onChunk(e,t,n){if(this._generation!==n||!this._active)return;let r=new Uint8Array(t.byteLength);t.copyTo(r),this._deliverEncoded(e.id,t.type===`key`,r,this._orientation.rotation,this._orientation.flip)}_onEncoderTooSlow(){let e=this._encoderCodec?this._encoderCodec.name:`the encoder`;if(this._encoder){try{this._encoder.close()}catch{}this._encoder=null,this._encoderCodec=null}this._candidateIndex++,this._encodedSize=null,this._pace.reset(),this._logPath(this._candidateIndex>=this._encoderCandidates.length?`encode: ${e} could not keep up with the camera; encoding JPEG instead`:`encode: ${e} could not keep up with the camera; taking the next rung`)}_onEncoderFailure(e){if(console.warn(`Webcam encoder failed, trying the next codec:`,e),this._encoder){try{this._encoder.close()}catch{}this._encoder=null,this._encoderCodec=null}this._candidateIndex++,this._encodedSize=null}_encodeJpeg(e){if(this._jpegBusy){fr(e);return}let t=this._deriveOrientation?gr():0,n=t%180==90,r=e.displayWidth||e.codedWidth||e.videoWidth,i=e.displayHeight||e.codedHeight||e.videoHeight,a=n?i:r,o=n?r:i;this._canvas?(this._canvas.width!==a||this._canvas.height!==o)&&(this._canvas.width=a,this._canvas.height=o):(typeof OffscreenCanvas<`u`?(this._logPath(`encoder: JPEG through OffscreenCanvas`),this._canvas=new OffscreenCanvas(a,o)):(this._logPath(`encoder: JPEG through a page canvas`),this._canvas=document.createElement(`canvas`),this._canvas.width=a,this._canvas.height=o),this._ctx=this._canvas.getContext(`2d`,{alpha:!1,desynchronized:!0}));try{t?(this._ctx.save(),this._ctx.translate(a/2,o/2),this._ctx.rotate(t*Math.PI/180),this._ctx.drawImage(e,-r/2,-i/2,r,i),this._ctx.restore()):this._ctx.drawImage(e,0,0,a,o)}catch{fr(e);return}fr(e),this._jpegBusy=!0;let s=this._generation,c=this._canvas;(c.convertToBlob?c.convertToBlob({type:`image/jpeg`,quality:this.quality}):new Promise((e,t)=>c.toBlob(n=>n?e(n):t(Error(`the canvas gave no JPEG`)),`image/jpeg`,this.quality))).then(e=>e.arrayBuffer()).then(e=>{this._active&&this._generation===s&&this._sendFrame(0,!0,new Uint8Array(e))}).catch(e=>this._onError(e)).finally(()=>{this._jpegBusy=!1})}};function xr(e){if(Me){window.open(e,`_blank`);return}let t=document.createElement(`iframe`);t.style.cssText=`position:fixed;right:0;bottom:0;width:0;height:0;border:0`,t.addEventListener(`load`,()=>{let n=t.contentWindow;n.addEventListener(`afterprint`,()=>t.remove(),{once:!0});try{n.focus(),n.print()}catch{t.remove(),window.open(e,`_blank`)}}),t.src=e,document.body.appendChild(t)}function Sr({automatic:e}){let t=!!e;return{async announce(e,n){let r=new URL(`api/print/`+encodeURIComponent(e),window.location.href).href,i;try{let e=await fetch(r,{headers:yn(),credentials:`same-origin`});if(!e.ok)throw Error(`HTTP ${e.status}`);i=await e.blob()}catch(t){console.warn(`Printed document ${e} (${n} bytes) was not fetched: ${t.message}`);return}let a=URL.createObjectURL(new Blob([i],{type:`application/pdf`}));window.postMessage({type:`printDocument`,name:e,size:i.size,url:a},window.location.origin),t&&!Me&&xr(a)},setAutomatic(e){t=!!e}}}var Cr=`selkies-stream-stats`,wr=3e3;function Tr(e){return e===void 0?`unknown`:e===null||e===`NV12`?`hardware`:/^I4/.test(e)?`software`:`unknown`}var Er=e=>`${e===null?`Opaque`:e} frames`;function Dr(e,t,n,r=`hardware_available`){return{decoder:e,decoder_evidence:t,hardware_expected:n,decoder_reason:e===`software`&&n?r:``}}function Or(e,t){return e===!0?Dr(`hardware`,`A hardware decoder is available`,!0):e===!1?Dr(`software`,`No hardware decoder for this stream`,!1):Dr(`unknown`,t,!1)}var kr=class{constructor(){this.key=``,this.efficient=null}ask(e,t){t!==this.key&&(this.key=t,this.efficient=null,navigator.mediaCapabilities&&navigator.mediaCapabilities.decodingInfo&&navigator.mediaCapabilities.decodingInfo(e).then(e=>{this.key===t&&(this.efficient=e.supported?!!e.powerEfficient:null)}).catch(()=>{}))}};function Ar({forcedSoftware:e,hardwareSupported:t,format:n,capable:r}){if(e)return Dr(`software`,``,!0,`software_preferred`);if(t===!1)return Dr(`software`,`No hardware decoder for this stream`,!1);let i=Tr(n);return i===`unknown`?Or(r,n===void 0?``:Er(n)):Dr(i,Er(n),r===!0)}function jr({implementation:e,powerEfficient:t,trackFormat:n,elementFormat:r,capable:i}){let a=e&&e!==`unknown`?e:``,o=i===!0;if(typeof t==`boolean`)return Dr(t?`hardware`:`software`,a,o);if(a)return Dr(/libvpx|ffmpeg|dav1d|openh264|libaom/i.test(a)?`software`:`hardware`,a,o);let s=Tr(n);return s===`unknown`?Tr(r)===`software`?Dr(`software`,Er(r),o):Or(i,``):Dr(s,Er(n),o)}var Mr=class{constructor({transport:e,send:t,isViewer:n,onOpenChange:r}){this._send=t,this._isViewer=n,this._onOpenChange=r||(()=>{}),this._open=!1,this._subscribed=!1,this._server={},this._serverAt=-1/0,this._bytes=0,this._bytesAt=performance.now(),this._received=0,this._announcing=!1,this._client={transport:e,decoder:`unknown`,decoder_evidence:``,hardware_expected:!1,decoder_reason:``,codec:``,resolution:``,path:``,sink:``,decode_path:``,connection:`ok`},window.stream_info=null,window.stream_client=this._client,window.stream_stats={open:!1,latest:null,history:[]}}get open(){return this._open}_changed(){this._announcing||typeof window.dispatchEvent!=`function`||(this._announcing=!0,queueMicrotask(()=>{this._announcing=!1,window.dispatchEvent(new Event(Cr))}))}setOpen(e){e=!!e,e!==this._open&&(this._open=e,this._bytes=0,this._bytesAt=performance.now(),this._received=0,window.stream_stats={open:e,latest:null,history:[]},this.subscribe(),this._onOpenChange(e),this._changed())}subscribe(){let e=this._open&&!this._isViewer();if(e||this._subscribed){this._subscribed=e;try{this._send(`_stats,${+!!e}`)}catch{this._subscribed=!1}}}disconnected(){this._subscribed=!1,this.setConnection(!1)}setConnection(e){this.setClient({connection:e?`poor`:`ok`})}setInfo(e){window.stream_info=e||null,this._changed()}setClient(e){let t=this._client;Object.keys(e).every(n=>t[n]===e[n])||(Object.assign(t,e),this._changed())}serverSample(e){this._server=e||{},this._serverAt=performance.now();let t=window.stream_stats.latest;this._open&&t&&!t.server&&(Object.assign(t,this._server,{server:!0}),this._changed())}noteBytes(e){this._bytes+=e,this._received+=e}clientSample(e){if(!this._open)return;let t=performance.now(),n=(t-this._bytesAt)/1e3,r=t-this._serverAt<=wr,i=Object.assign({t:Date.now(),server:r},r?this._server:{},e);i.mbps===void 0&&n>0&&(i.mbps=Math.round(this._bytes*8/1e6/n*100)/100),i.received_mb=Math.round(this._received/1e4)/100,this._bytes=0,this._bytesAt=t;let a=window.stream_stats;a.latest=i,a.history.push(i),a.history.length>600&&a.history.shift(),this._changed()}};function Nr(e){let t=()=>performance.timeOrigin+performance.now(),n=0,r=0,i=0,a=0,o=0,s=0,c=NaN,l=!1,u=(e,t)=>{n+=e,t>=0&&(r+=t,i++)},d=()=>{l=!1,s&&=(u(1,t()-c),a+=s-1,0)};return{drawn(t){s++,c=t,e?l||(l=!0,e(d)):d()},land:d,presented:u,superseded(e){a+=e},refused(){o++},take(){let e={presented:n,delaySum:r,delays:i,superseded:a,refused:o};return n=0,r=0,i=0,a=0,o=0,e},reset(){n=0,r=0,i=0,a=0,o=0,s=0}}}function Pr(e,t,n){let r=()=>typeof e.getVideoPlaybackQuality==`function`?e.getVideoPlaybackQuality():{totalVideoFrames:0,droppedVideoFrames:0},i=typeof e.requestVideoFrameCallback==`function`,a=r(),o=a.totalVideoFrames,s=a.droppedVideoFrames,c=0,l=0,u=-1,d=0,f=0,p=!1,m=!1,h=()=>{l=0,c=e.requestVideoFrameCallback(g)},g=(e,i)=>{d+=u>=0&&i.presentedFrames>u?i.presentedFrames-u:1,u=i.presentedFrames,p=!0,t.presented(0,n(i)),m||=r().totalVideoFrames!==a.totalVideoFrames,m?l=setTimeout(h,100):h()};return i&&h(),{reported:()=>p,stop:()=>{clearTimeout(l),i&&e.cancelVideoFrameCallback(c)},read(){let e=r(),t=e.totalVideoFrames<o||e.droppedVideoFrames<s,n=t?e.totalVideoFrames:e.totalVideoFrames-o,i=t?e.droppedVideoFrames:e.droppedVideoFrames-s;o=e.totalVideoFrames,s=e.droppedVideoFrames;let a=d-f;return f=d,{shown:n>0?Math.max(0,n-i):a,dropped:i}}}}var Fr=`display`,Ir=2e3,Lr=8,Rr=1e3,zr=.4,Br=.8,Vr=.15,Hr=5e-4,Ur=250;function Wr(e){let t=[];for(let n=1;n<e.length;n++){let r=e[n]-e[n-1];r>0&&r<250&&t.push(r)}if(t.length<30)return null;let n=t.slice().sort((e,t)=>e-t),r=n.filter(e=>e<=1.5*n[Math.floor(n.length/10)]),i=r[r.length>>1];for(let n=0;n<2;n++)if(!(i>=1e3/Rr&&i<=1e3/Lr)||(i=Gr(e,i,t.length),i===null))return null;let a=1e3/i;return a>=Lr&&a<=Rr?a:null}function Gr(e,t,n){let r=[],i=[[0,e[0]]],a=0;for(let n=1;n<e.length;n++){let o=e[n]-e[n-1],s=Math.round(o/t);o<=0||o>=250||s<1||Math.abs(o-s*t)>zr*t?(r.push(i),i=[[0,e[n]]]):(i.push([i[i.length-1][0]+s,e[n]]),a++)}if(r.push(i),a<Br*n)return null;let o=r.filter(e=>e.length>=3).map(e=>({r:e,n:e.reduce((e,t)=>e+t[0],0)/e.length,t:e.reduce((e,t)=>e+t[1],0)/e.length})),s=0,c=0,l=0;for(let{r:e,n:t,t:n}of o){for(let[r,i]of e)s+=(r-t)*(i-n),c+=(r-t)*(r-t);l+=e[e.length-1][0]}if(l<30||c===0)return null;let u=s/c,d=0,f=0;for(let{r:e,n:t,t:n}of o)for(let[r,i]of e)d+=(i-n-(r-t)*u)**2,f++;let p=Math.sqrt(d/f);return p>Vr*u||p/Math.sqrt(c)>1e-4*u?null:u}function Kr(e){let t=Math.round(e),n=Math.round(e*1.001)*1e3/1001,r=Math.abs(n-e)<Math.abs(t-e)?n:t;return Math.abs(r-e)<=.001*r?r:Math.round(e*100)/100}function qr(e,t,n){for(let r=1;e/r>=t;r++)if(e/r<=n)return e/r;return e<t?t:n}function Jr(e,t){return e===`display`&&!(t&&t.min===t.max)}function Yr(e,t,n){if(e!==null&&e!==`display`){let t=parseFloat(e);return Number.isFinite(t)?t:null}return!n||!t||!Jr(e,n)?null:qr(t,n.min,n.max)}function Xr(e){let t=null,n=[],r=0,i=!1,a=Ir,o=null,s=r=>{if(i=!1,n=[],r===null)return;let a=Kr(r);(t===null||Math.abs(a-t)>Hr*t)&&(t=a,e(t))},c=e=>{if(!i)return;n.push(e);let t=e-n[0];if(t>=a){a=t+Ur;let e=Wr(n);if(e!==null||t>=8e3){s(e);return}}r=requestAnimationFrame(c)},l=()=>{i||document.visibilityState!==`visible`||(i=!0,n=[],a=Ir,r=requestAnimationFrame(c))},u=()=>{document.visibilityState===`visible`?l():i&&(cancelAnimationFrame(r),i=!1,n=[])},d=()=>{o=window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`),o.addEventListener(`change`,f,{once:!0})},f=()=>{d(),l()},p=window.screen,m=!!(p&&typeof p.addEventListener==`function`);return document.addEventListener(`visibilitychange`,u),document.addEventListener(`fullscreenchange`,l),m&&p.addEventListener(`change`,l),d(),l(),{rate:()=>t,measure:l,stop(){i&&cancelAnimationFrame(r),i=!1,document.removeEventListener(`visibilitychange`,u),document.removeEventListener(`fullscreenchange`,l),m&&p.removeEventListener(`change`,l),o.removeEventListener(`change`,f)}}}var Zr=[`encoder`,`framerate`,`video_crf`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`jpeg_quality`,`paint_over_jpeg_quality`,`use_paint_over_quality`,`video_paintover_crf`,`video_paintover_burst_frames`,`video_bitrate`,`rate_control_mode`,`use_cpu`,`cpu_encode_threading`,`audio_bitrate`],Qr={video_fullcolor:`false`,video_10bit:`false`,framerate:`60`,video_crf:`25`,manual_resolution:`false`,manual_width:null,manual_height:null},$r=[...new Set([...Object.keys(Qr),...Zr.filter(e=>e!==`encoder`)])],ei=(e,t)=>({encoderPick:`${e(`encoder`)}_pick`,fallbackTab:`${e(`encoder`)}_pick_tab`,displayTab:`${t}_display_settings_tab`}),ti=(e,t)=>`${e(t)}_pick`;function ni(e,t){let n=ei(e,t);try{if(window.sessionStorage.getItem(n.fallbackTab)!==null||window.sessionStorage.getItem(n.displayTab)!==null)return;for(let t of[`encoder`,...$r]){let n=e(t),r=window.localStorage.getItem(ti(e,t));r!==null&&(r===``?window.localStorage.removeItem(n):window.localStorage.setItem(n,r),window.localStorage.removeItem(ti(e,t)))}}catch{}}function ri(e,t,n,r){let i={};try{for(let t of Zr){if(n[t]===void 0||n[t]===null)continue;let r=e(t),a=String(n[t]);if(window.localStorage.getItem(r)===a)continue;let o=ti(e,t);window.localStorage.getItem(o)===null&&window.localStorage.setItem(o,window.localStorage.getItem(r)??``),window.localStorage.setItem(r,a),i[t]=n[t]}Object.keys(i).length>0&&window.sessionStorage.setItem(ei(e,t).displayTab,r)}catch{}return i}function ii(e,t){try{for(let n of t)(n===`encoder`||$r.includes(n))&&window.localStorage.removeItem(ti(e,n))}catch{}}Ln(),Sn();var ai=null,K=!1,oi=null;Fn().then(e=>{if(ai=e,e&&K&&oi)try{oi.sendDataChannelMessage(`SETTINGS,${JSON.stringify({keyboardLayout:e})}`)}catch{}});var si=0,ci=!0;function li(){let e=document.createElement(`style`);e.textContent=`
	body {
		background-color: #000000;
		font-family: sans-serif;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: #000;
		color: #fff;
	}

	#app {
		display: flex;
		flex-direction: column;
		height: calc(var(--vh, 1vh) * 100);
		width: 100%;
	}

	.video-container {
		flex-grow: 1;
		flex-shrink: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.video-container video,
	.video-container #overlayInput{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.video-container video {
		max-width: none;
		max-height: none;
		object-fit: contain;
	}

	.video-container #overlayInput {
		opacity: 0;
		z-index: 3;
		caret-color: transparent;
		background-color: transparent;
		color: transparent;
		pointer-events: auto;
		-webkit-user-select: none;
		border: none;
		outline: none;
		padding: 0;
		margin: 0;
	}

	.video-container #playButton {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	.video-container .status-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 5px;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		text-align: center;
		z-index: 5;
	}

	.loading-text {
		margin-top: 1em;
	}

	.hidden {
		display: none !important;
	}

	#playButton {
		padding: 15px 30px;
		font-size: 1.5em;
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 3px;
		backdrop-filter: blur(5px);
	`,document.head.appendChild(e)}function ui(){let e,t=25,n=8e3,r=60,s=null,c=null,l=null,u=128e3,d=!1,f=!1,p=!1,m=(e,t)=>{e.push(t),e.length>1e3&&e.shift()},h=[],g=[];window.selkiesLogs={log:h,debug:g};let _=`connecting`,ee=`disabled`,te=!0,v=!0,ne=!0,re=[],ie=``,ae=`cbr`,y={gamepadState:`disconnected`,gamepadName:`none`},b={connectionStatType:`unknown`,connectionLatency:0,connectionVideoLatency:0,connectionAudioLatency:0,connectionAudioCodecName:`NA`,connectionAudioBitrate:0,connectionPacketsReceived:0,connectionPacketsLost:0,connectionBytesReceived:0,connectionBytesSent:0,connectionCodec:`unknown`,connectionVideoDecoder:`unknown`,connectionResolution:``,connectionFrameRate:0,connectionVideoBitrate:0,connectionAvailableBandwidth:0};var x=null;let S=!1,se=null,ce=0,le=!1,ue=!1;var de=null;let fe=null,pe=null,me=null,ge=0,ve=!1,ye=!1,be=!1,xe=!1,we=null,C=null,w=null,T=500,E=!1,D,O=0;window.manualResolution=!1,window.fps=0,window.currentAudioBufferSize=0;let Me=!1;var Pe=``,Fe=!1,k=null;let Re=null,ze=new kr,Be={key:``,track:void 0,element:void 0,current:!1,reading:!1},He=Nr(null),Ue=null,We=0,Ge=new Mr({transport:`webrtc`,send:e=>{let t=k&&k._send_channel;if(!t||t.readyState!==`open`)throw Error(`not connected`);k.sendDataChannelMessage(e)},isViewer:()=>I,onOpenChange:e=>{Re=null,Ue&&Ue.stop(),Ue=null,e&&(Be.current=!1,di())}});var A=null;let Ke=null,qe=null,Je=null,Ye=!1,Xe=96,j=!0,Ze=!0,Qe=new Set,$e=!1,M=!1,et=!1,tt=!1,nt=!1,rt=!1,it=`auto`,at=!0,N=()=>{let e=k!==void 0&&k&&k.peerConnection&&k.peerConnection.sctp&&k.peerConnection.sctp.maxMessageSize||0;return(e>0?Math.min(e,1048576):262144)-512},ot=`controller`,st=`viewer`,ct=null,lt=0,ut=null,P=null,dt=!0,ft=!1,pt=!0,mt=!0,ht=!1,gt=!1,_t=!0,vt=new On,yt=Zt(),bt=()=>yt.arm(),xt=()=>yt.consume(),St=e=>vt.reencodePng(e).then(e=>e.result).catch(()=>Gt(e)),Ct=(()=>{let e=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform===`MacIntel`&&navigator.maxTouchPoints>1,t=/Firefox|FxiOS/.test(navigator.userAgent),n=/CriOS/.test(navigator.userAgent);return((navigator.userAgentData&&navigator.userAgentData.brands||[]).some(e=>/Chromium|Google Chrome/.test(e.brand))||window.chrome!==void 0)&&!e&&!t&&!n})(),wt=dn({isChromium:Ct,canRead:()=>!!te,sendRequest:()=>k.sendDataChannelMessage(`REQUEST_CLIPBOARD`),digestBytes:async e=>{let{byteLength:t,hash:n}=await vt.hashBytes(e);return Wt(t,n)}}),Tt=rn(),Et=sn({worker:vt,clipboardSync:wt,writer:Tt,toPng:St,canWriteLocal:()=>ne&&ee===`enabled`&&v,binaryEnabled:()=>_t,isChromium:Ct,onPreview:(e,t)=>window.postMessage(ln(e,t),window.location.origin),onImageWritten:e=>(console.log(`Successfully wrote image (${e}) from server to local clipboard.`),window.postMessage({type:`clipboardContentUpdate`,text:`Image (${e}) received from session and copied to clipboard.`},window.location.origin),wt.captureLocalImageSig()),onImageWriteFailed:e=>yi(e)}),F=mn();if(F===`#shared`)ut=st,P=-1,ct=`shared`,lt=void 0;else if(F.startsWith(`#player`)){ut=st;let e=parseInt(F.substring(7),10);P=e||null,e>=2&&e<=4&&(ct=`player${e}`,lt=e-1)}else ut=ot,P=1,lt=0;let I=ct!==null,Dt=ct===`shared`,Ot=!1,kt=Oe(),At=null,L=(e,t)=>{try{window.localStorage.setItem(e,t)}catch(t){console.warn(`Selkies: could not persist '${e}' to localStorage:`,t)}},R=mn().startsWith(`#display2`)?`display2`:`primary`,jt=null,Mt=!1,Nt=!1;function Pt(){return Rt({useCssScaling:Ye,localScale:Xe/96,manual:window.manualResolution,displayId:R,layouts:jt,shared:I,wayland:Mt})}let z=0,B=0,It=0;function V(){let e=Pt();A&&A.setStreamDensity&&A.setStreamDensity(e);let t=z>0&&Math.abs(e-z)>1e-6;z=e,t&&R!==`primary`&&!window.manualResolution&&(console.log(`Stream density changed: ${e}.`),Or())}let Lt=[`framerate`,`video_crf`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`use_cpu`,`cpu_encode_threading`,`video_paintover_crf`,`video_paintover_burst_frames`,`use_paint_over_quality`,`manual_resolution`,`manual_width`,`manual_height`,`encoder`,`scaleLocallyManual`,`use_browser_cursors`,`rate_control_mode`,`video_bitrate`,`force_aligned_resolution`,`scaling_dpi`],zt=e=>{let t=`${kt}_${e}`;return R===`display2`&&Lt.includes(e)?`${t}_${R}`:t};ni(zt,kt);let Bt=(e,t)=>{let n=zt(e),r=window.localStorage.getItem(n);return r==null?t:parseInt(r)},H=(e,t)=>{let n=zt(e),r=window.localStorage.getItem(n),i=parseFloat(r);return r==null||isNaN(i)?t:i},qt=(e,t)=>{let n=zt(e);t==null?window.localStorage.removeItem(n):L(n,t.toString())},U=(e,t)=>{let n=zt(e),r=window.localStorage.getItem(n);return r===null?t:r.toString().toLowerCase()===`true`},W=(e,t)=>{let n=zt(e);t==null?window.localStorage.removeItem(n):L(n,t.toString())},Jt=(e,t)=>{let n=zt(e);return window.localStorage.getItem(n)??t},Yt=(e,t)=>{let n=zt(e);t==null?window.localStorage.removeItem(n):L(n,t.toString())};var Xt=e=>{var t=new Date;return`[`+(t.getHours()+`:`+t.getMinutes()+`:`+t.getSeconds())+`] `+e};let Qt=e=>{let t=gt?16:2;return Math.floor(e/t)*t};function $t(){let e=pt,t=mn().startsWith(`#display2`)||ht,n=t?!0:e;A&&typeof A.setUseBrowserCursors==`function`&&(console.log(`Applying effective cursor setting. Multi-monitor: ${t}, User Pref: ${e}, Final: ${n}`),A.setUseBrowserCursors(n));try{window.postMessage({type:`effectiveCursorState`,value:n},window.location.origin)}catch{}}function en(){A&&typeof A.setRawPointerMotion==`function`&&A.setRawPointerMotion(mt)}let tn=1;function an(){A&&typeof A.setTrackpadSpeed==`function`&&A.setTrackpadSpeed(tn)}let on=!0;function cn(){A&&typeof A.setGamepadRumble==`function`&&A.setGamepadRumble(on)}let un=!0;function pn(){A&&typeof A.setMacCmdAsCtrl==`function`&&A.setMacCmdAsCtrl(un)}let hn=!0,gn=null;function _n(){A&&typeof A.setShortcutsEnabled==`function`&&A.setShortcutsEnabled(hn)}function bn(e){return Bn(Qn,e,{macDesktop:ke()},e=>Jt(e,null))}function xn(e){return Bn($n,e,{macDesktop:ke()},e=>Jt(e,null))}function Sn(e){let t=zt(`useCssScaling`),n=window.localStorage.getItem(`${t}_explicit_choice`)===`true`,r=Bn(Vn,e,{manualActive:!!window.manual_resolution||window.manual_width>0},()=>n?window.localStorage.getItem(t):null);return Vn.toServer(r)}function Cn(){d=!1,we&&we.classList.add(`hidden`),k.playStream(),Tn()}let Tn=async()=>{if(fe===null){if(`wakeLock`in navigator)try{fe=await navigator.wakeLock.request(`screen`),fe.addEventListener(`release`,()=>{console.log(`Screen Wake Lock was released automatically.`),fe=null}),console.log(`Screen Wake Lock is active.`)}catch(e){console.warn(`Could not acquire Wake Lock: ${e.name}, ${e.message}`)}else console.warn(`Wake Lock API is not supported by this browser.`)}},En=async()=>{fe!==null&&(await fe.release(),fe=null)},Dn=null,kn=!1,An=!1,Mn=()=>{if(An&&k)try{k.sendDataChannelMessage(document.hidden?`PAGE_HIDDEN`:`PAGE_SHOWN`)}catch{}},Nn=null,Pn=0;function Fn(){Nn!==null&&(clearTimeout(Nn),Nn=null),Pn=0}function In(){Nn!==null&&clearTimeout(Nn);let e=x?x.currentTime:0;Nn=setTimeout(()=>Ln(e),3e3)}function Ln(e){if(Nn=null,document.hidden||!k||Hn||d||!j)Pn=0;else if(x&&x.currentTime>e&&x.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA)Pn=0;else if(x&&x.paused&&x.play().catch(()=>{}),Pn++,Pn<=3){console.warn(`No video after connecting or resuming; resend attempt ${Pn}/3.`);try{k.sendDataChannelMessage(`START_VIDEO`)}catch{}In()}else Pn=0,S||typeof window<`u`&&window.__selkiesModeSwitching||(console.warn(`[webrtc] no video after connecting or resuming; reconnecting in place.`),k.signaling.reconnect())}async function Rn(){if(Mn(),document.hidden)Fn(),Dn===null&&(Dn=setTimeout(()=>{if(Dn=null,document.hidden&&!kn&&k&&j){kn=!0;try{k.sendDataChannelMessage(`STOP_VIDEO`)}catch{}console.log(`Tab hidden: sent STOP_VIDEO to pause this peer's feed.`)}},250));else{if(Dn!==null&&(clearTimeout(Dn),Dn=null),kn){if(kn=!1,k)try{k.sendDataChannelMessage(`START_VIDEO`)}catch{}console.log(`Tab visible: sent START_VIDEO to resume this peer's feed.`),In()}else x&&x.paused&&x.play().catch(()=>{});fe===null&&await Tn()}}async function zn(){if(pe&&x){if(!(`setSinkId`in HTMLMediaElement.prototype)||typeof x.setSinkId!=`function`)console.warn(`setSinkId not supported; cannot select audio output device.`);else try{await x.setSinkId(pe),console.log(`Playback output set to device: ${pe}`)}catch(e){console.error(`Failed to set audio output device: ${e.name}, ${e.message}`)}}}let Hn=!1;function Un(){C&&!Hn&&(C.textContent=_&&_.charAt(0).toUpperCase()+_.slice(1),_==`connected`&&(C.classList.add(`hidden`),we&&d&&we.classList.remove(`hidden`)))}function Wn(){if(!x)return;if(!dt){x.style.imageRendering!==`pixelated`&&(x.style.imageRendering=`pixelated`);return}let e=window.devicePixelRatio||1,t=x.getBoundingClientRect();Ct&&Math.abs(x.videoWidth-t.width*e)<=16&&Math.abs(x.videoHeight-t.height*e)<=16?x.style.imageRendering!==`pixelated`&&(console.log(`Setting video rendering to 'pixelated' for sharp display.`),x.style.imageRendering=`pixelated`):x.style.imageRendering!==`auto`&&(console.log(`Setting video rendering to 'auto' for smooth upscaling.`),x.style.imageRendering=`auto`)}function Gn(e){console.log(`Sanitizing and storing settings based on server payload.`);let t={};for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let r=e[n],i=tr(n),a=zt(i),o=window.localStorage.getItem(a)===null;if(r.min!==void 0&&r.max!==void 0){let e=H(i,r.default);o?window[n]=e:e<r.min||e>r.max?(console.log(`Sanitizing '${n}': stored value ${e} out of range [${r.min}-${r.max}]. Reverting to server default ${r.default}.`),window.localStorage.removeItem(a),window[n]=r.default,t[n]=r.default):window[n]=e}else if(r.allowed!==void 0){let e=!isNaN(parseFloat(r.allowed[0])),s=e?Bt(i,parseInt(r.value,10)).toString():Jt(i,r.value),c=t=>{window[n]=e?parseInt(t,10):t};o?c(r.value):r.allowed.includes(s)?(c(s),e?qt(i,parseInt(s,10)):Yt(i,s)):(console.log(`Sanitizing '${n}': stored "${s}" not in allowed [${r.allowed.join(`, `)}]. Reverting to server default "${r.value}".`),window.localStorage.removeItem(a),c(r.value),t[n]=r.value)}else if(typeof r.value==`boolean`){let e=r.value;if(r.locked){let r=U(i,!e);r!==e&&(console.log(`Sanitizing '${n}': setting is locked by server. Client value ${r} is being overwritten with ${e}.`),t[n]=e),window[n]=e}else if(o)window[n]=e,r.overridden&&(t[n]=e);else{let t=U(i,e);window[n]=t,W(i,t)}}else r.value!==void 0&&(window[n]=r.value)}return t}function Kn(){try{return RTCRtpReceiver.getCapabilities(`video`).codecs.some(e=>/^video\/vp9$/i.test(e.mimeType)&&/(^|;)profile-id=1(;|$)/.test(e.sdpFmtpLine||``))}catch{return!1}}async function qn(){let e=i(ie);a(e)&&!await Jn(e)&&U(`video_fullcolor`,!1)&&(console.warn(`[Selkies] full color (4:4:4) is off: this browser decodes ${e} 4:2:0 only over WebRTC.`),W(`video_fullcolor`,!1))}async function Jn(e){return e===`vp9`?Kn():await _e(e)}let Yn=!1;async function Xn(){if(!window.video_fullcolor||I)return;let e=i(ie);a(e)&&!await Jn(e)&&window.video_fullcolor&&(Yn?console.error(`This session streams ${e} 4:4:4, which this browser cannot decode over WebRTC.`):(console.warn(`[Selkies] full color (4:4:4) is off: this browser decodes ${e} 4:2:0 only over WebRTC.`),window.video_fullcolor=!1,W(`video_fullcolor`,!1),Hr({video_fullcolor:!1},!1)))}function Zn(e,t){let n=RegExp(`^video/${e}$`,`i`),r=RegExp(`(^|;)profile-id=${t}(;|$)`);try{return RTCRtpReceiver.getCapabilities(`video`).codecs.some(e=>n.test(e.mimeType)&&r.test(e.sdpFmtpLine||``))}catch{return!1}}async function er(e,t){if(e===`av1`&&Ct)return!1;if(e===`vp9`)return Zn(`vp9`,t?3:2);if(e===`h265`&&!t)return Zn(`h265`,2);if(e===`h264`&&!t)try{return RTCRtpReceiver.getCapabilities(`video`).codecs.some(e=>/^video\/h264$/i.test(e.mimeType)&&/profile-level-id=6e/i.test(e.sdpFmtpLine||``))}catch{return!1}return await Ce(e,t)}let nr=e=>!!window.video_fullcolor&&a(e);async function ar(){let e=i(ie);o(e)&&U(`video_10bit`,!1)&&(await er(e,U(`video_fullcolor`,!1)&&a(e))||(console.warn(`[Selkies] 10-bit is off: this browser decodes ${e} at 8 bits only over WebRTC.`),W(`video_10bit`,!1)))}let or=!1;async function sr(){if(!window.video_10bit||I)return;let e=i(ie);o(e)&&!await er(e,nr(e))&&window.video_10bit&&(or?console.error(`This session streams 10-bit ${e}, which this browser cannot decode over WebRTC.`):(console.warn(`[Selkies] 10-bit is off: this browser decodes ${e} at 8 bits only over WebRTC.`),window.video_10bit=!1,W(`video_10bit`,!1),Hr({video_10bit:!1},!1)))}function lr(){let e=x?x.getBoundingClientRect():null,t=(jt||{})[R];return Ut({stream:x&&x.videoWidth>0?[x.videoWidth,x.videoHeight]:null,css:e&&e.width>0?[e.width,e.height]:null,realized:t?[t.w,t.h]:null,density:Pt()})}function ur(){return Yr(window.localStorage.getItem(zt(`framerate`)),c?c.rate():null,s)}function dr(){let e=ur();e!==null&&e!==l&&K&&(r=l=e,k.sendDataChannelMessage(`_arg_fps,${e}`))}function fr(){if(I){console.log(`Skipping sending client persisted settings in shared mode.`);return}let e=`${kt}_`,t={};B=Pt();let n=[`encoder`,`manual_resolution`,`audio_bitrate`,`video_bitrate`,`scaling_dpi`,`enable_binary_clipboard`,`rate_control_mode`,`video_crf`,`use_cpu`,`cpu_encode_threading`,`force_aligned_resolution`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`use_paint_over_quality`,`video_paintover_crf`,`video_paintover_burst_frames`],r=[`manual_resolution`,`enable_binary_clipboard`,`use_cpu`,`cpu_encode_threading`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`use_paint_over_quality`,`force_aligned_resolution`],i=[`audio_bitrate`,`scaling_dpi`,`video_crf`,`video_paintover_crf`,`video_paintover_burst_frames`,`video_bitrate`];for(let a in localStorage)if(Object.hasOwnProperty.call(localStorage,a)&&a.startsWith(e)){let o=a.substring(e.length),s=o;if(o.endsWith(`_display2`)){if(R!==`display2`)continue;s=o.slice(0,-9)}else if(R===`display2`&&Lt.includes(o))continue;if(n.includes(s)){if((s===`use_paint_over_quality`||s===`cpu_encode_threading`)&&localStorage.getItem(`${a}_explicit_choice`)!==`true`)continue;let e=localStorage.getItem(a);if(r.includes(s))e=e===`true`;else if(i.includes(s)&&(e=parseInt(e,10),isNaN(e)))continue;t[s]=e}}t.encoder!==void 0&&!he(t.encoder)&&(console.log(`Not asking for ${t.encoder}: this browser receives no such WebRTC codec.`),delete t.encoder),window.manualResolution&&D!=null&&O!=null&&(t.manual_resolution=!0,t.manual_width=Qt(D),t.manual_height=Qt(O)),t.scaling_dpi===void 0&&(t.scaling_dpi=hr()),l=ur(),l!==null&&(t.framerate=l),ai&&(t.keyboardLayout=ai),t.useCssScaling=Ye,t.displayScale=It=lr();try{let e=JSON.stringify(t);k.sendDataChannelMessage(`SETTINGS,${e}`),K=!0,console.log(`Sent initial settings to server:`,t)}catch(e){console.error(`Error constructing or sending initial settings:`,e)}}function pr(e,t,n){if(e<=0||t<=0){console.log(`Invalid target height or width`);return}let r=window.manualResolution?1:Pt(),i=Qt(e*r),a=Qt(t*r);console.log(`applyManualStyle logicalWidth: ${i} logicalHeight: ${a}`),(x.width!==i||x.height!==a)&&(x.width=i,x.height=a,console.log(`Video Element set to: ${e}x${t}`));let o=x.parentElement,s=o.clientWidth,c=o.clientHeight;if(n){let n=e/t,r=s/c,i,a;n>r?(i=s,a=s/n):(a=c,i=c*n);let o=(c-a)/2,l=(s-i)/2;x.style.position=`absolute`,x.style.width=`${i}px`,x.style.height=`${a}px`,x.style.top=`${o}px`,x.style.left=`${l}px`,x.style.objectFit=`contain`,console.log(`Applied manual style (Scaled): CSS ${i}x${a}, Pos ${l},${o}`)}else{let n=window.devicePixelRatio||1,r=e/n,i=t/n,a=(c-i)/2,o=(s-r)/2;x.style.position=`absolute`,x.style.width=`${r}px`,x.style.height=`${i}px`,x.style.top=`${a}px`,x.style.left=`${o}px`,x.style.objectFit=`fill`,console.log(`Applied manual style (Exact): CSS ${r}x${i}, Pos ${o},${a}`)}Wn()}function G(e,t){if(!x)return;let n=Pt(),r=Qt(e*n),i=Qt(t*n);console.log(`resetToWinRes logicalWidth: ${r} logicalHeight: ${i}`),(x.width!==r||x.height!==i)&&(x.width=r,x.height=i,console.log(`Video Element set to: ${r}x${i}`)),x.style.position=`absolute`,x.style.width=`${Math.round(e)}px`,x.style.height=`${Math.round(t)}px`,x.style.top=`0px`,x.style.left=`0px`,x.style.objectFit=`fill`,Wn(),console.log(`Resized to window resolution: ${r}x${i} (css ${e}x${t})`)}function mr(){return window.manualResolution?Ht(D,O):Vt()}function hr(){return Ye&&!window.manualResolution?96:Xe}function gr(){try{k.sendDataChannelMessage(`s,${hr()}`)}catch{}}function _r(e){if(I||Jt(`scaling_dpi`,null)!==null)return!1;let t=mr();return t!==Xe&&(Xe=t,console.log(`DPI follows ${e}: scaling_dpi -> ${t}.`),window.postMessage({type:`scalingDpiFollowed`,value:t},window.location.origin),!0)}let vr=window.devicePixelRatio||1;function yr(){let e=window.devicePixelRatio||1;e!==vr&&(vr=e,_r(`devicePixelRatio changed`)&&gr(),I||Wn())}function br(e,t){let n=window.manualResolution?1:Pt();return[Math.min(Qt(e*n),4080),Math.min(Qt(t*n),4080),n]}function Cr(e,t){if(I){console.log(`Skipping sending resolution in shared mode.`);return}let[n,r,i]=br(e,t);window.manualResolution||(z=i,B>0&&Math.abs(i-B)>1e-6&&setTimeout(()=>fr(),0));let a=`${n}x${r}`;de=[n,r],console.log(`Sending resolution to server: ${a}, Pixel Ratio Used: ${i}, useCssScaling: ${Ye}`),k.sendDataChannelMessage(`r,${a}`)}function wr(){window.addEventListener(`resize`,Er)}function Tr(){window.removeEventListener(`resize`,Er)}window.addEventListener(`resize`,()=>{window.manualResolution&&!I&&D>0&&O>0&&x&&x.parentElement&&pr(D,O,ye)});function Er(){yr(),w=new Date,E===!1&&(E=!0,setTimeout(()=>{Dr()},T))}function Dr(){new Date-w<T?setTimeout(()=>{Dr()},T):(E=!1,Or())}function Or(){if(window.manualResolution||window.enable_resize===!1&&R!==`display2`)return;re=A.getWindowResolution();let e=Pt();z=e,A&&A.setStreamDensity&&A.setStreamDensity(e),re[0]*e>4080&&(re[0]=Math.floor(4080/e)),re[1]*e>4080&&(re[1]=Math.floor(4080/e)),Cr(re[0],re[1]),G(re[0],re[1])}(()=>{let e=null,t=()=>{yr(),!window.manualResolution&&!I&&Er(),n()},n=()=>{if(e)try{e.removeEventListener(`change`,t)}catch{}let n=window.devicePixelRatio||1;e=window.matchMedia(`(resolution: ${n}dppx)`),e.addEventListener(`change`,t,{once:!0})};n(),setInterval(()=>{(window.devicePixelRatio||1)!==vr&&t()},1e3)})();function Ar(){if(I)console.log(`Skipping loading last session settings in shared mode.`);else if(k&&gr(),A&&A.resumePointerEcho(),window.manualResolution&&D&&O)console.log(`Applying manual resolution: ${D}x${O}`),pr(D,O,ye),mn().startsWith(`#display2`)&&Cr(D,O);else{console.log(`Applying window resolution`);let e=A.getWindowResolution();G(...e),(window.enable_resize!==!1||R===`display2`)&&Cr(e[0],e[1]),wr()}}function Ir(){let e={type:`sidebarButtonStatusUpdate`,video:j,audio:Ze,microphone:M,webcam:et,gamepad:at};console.log(`Posting sidebarButtonStatusUpdate:`,e),window.postMessage(e,window.location.origin)}function Lr(e,t=!1){k.setMicrophone(e,me).then(t=>{M=e&&t===!0,Ir()}).catch(n=>{console.error(`Microphone toggle failed:`,n),M=!1,e&&t&&Ne(n)&&(nt=!0),Ir()})}async function Rr(e=!1){if(!(I||!k||et||tt)){tt=!0;try{let t=await k.setWebcam(!0,null,{codec:it});if(t){let e=k.webcamTrack;e&&e.addEventListener(`ended`,()=>{et&&zr()}),et=!0}else et=!1,t===!1&&e&&(rt=!0)}catch(t){console.error(`Webcam capture error:`,t),et=!1,e&&Ne(t)&&(rt=!0)}finally{tt=!1}Ir()}}function zr(){k&&k.setWebcam(!1).catch(()=>{}),et&&(et=!1,Ir())}function Br(){if(A&&A.gamepadManager){if(I)return A.gamepadManager.enable(),console.log(`Shared mode: Gamepad control message received, ensuring its GamepadManager remains active for polling.`),!0;if(at)return A.gamepadManager.enable(),console.log(`Primary mode: Gamepad toggle ON. Enabling GamepadManager polling.`),!0;A.gamepadManager.disable(),console.log(`Primary mode: Gamepad toggle OFF. Disabling GamepadManager polling.`)}else console.warn(`Client: input.gamepadManager not found in 'gamepadControl' message handler`);return!1}function Vr(e){if(e.origin!==window.location.origin){console.warn(`Received message from unexpected origin`);return}let t=e.data;switch(t.type){case`statsOpen`:Ge.setOpen(t.open);break;case`setScaleLocally`:if(I)break;typeof t.value==`boolean`?(ye=t.value,W(`scaleLocallyManual`,ye),console.log(`Set scaleLocallyManual to ${ye} and persisted.`),window.manualResolution&&D&&O&&pr(D,O,ye)):console.warn(`Invalid value received for setScaleLocally:`,t.value);break;case`resetResolutionToWindow`:if(I)break;console.log(`Resetting to window size`),window.manualResolution=!1,O=D=0,qt(`manual_width`,null),qt(`manual_height`,null),W(`manual_resolution`,!1),_r(`manual resolution cleared`),wr(),Or(),gr();break;case`setManualResolution`:{if(I)break;if(window.enable_resize===!1&&R!==`display2`){console.log(`setManualResolution ignored: the server keeps this display's size (enable_resize=false).`);break}let e=parseInt(t.width,10),n=parseInt(t.height,10);if(isNaN(e)||e<=0||isNaN(n)||n<=0){console.error(`Received invalid width/height for setManualResolution:`,t);break}console.log(`Setting manual resolution: ${e}x${n}`),window.manualResolution=!0,D=e,O=n,qt(`manual_width`,D),qt(`manual_height`,O),W(`manual_resolution`,!0),Tr(),_r(`manual resolution set`),Cr(D,O),gr(),pr(D,O,ye);break}case`setUseCssScaling`:if(I)break;if(typeof t.value==`boolean`){let e=Ye!==t.value;if(Ye=t.value,t.persist!==!1&&W(`useCssScaling`,Ye),console.log(`Set useCssScaling to ${Ye}${t.persist===!1?`.`:` and persisted.`}`),A&&typeof A.updateCssScaling==`function`&&A.updateCssScaling(Ye),e){if(Wn(),window.manualResolution&&D!=null&&O!=null)Cr(D,O),pr(D,O,ye);else if(!I&&A&&(window.enable_resize!==!1||R===`display2`)){let e=A.getWindowResolution(),t=Qt(e[0]),n=Qt(e[1]);Cr(t,n),G(t,n)}gr()}}else console.warn(`Invalid value received for setUseCssScaling:`,t.value);break;case`settings`:console.log(`Received settings msg from dashboard:`,t.settings),Hr(t.settings);break;case`command`:if(I)break;if(!ci){console.log(`Command sending suppressed: server has command_enabled=false; not sending 'cmd,'.`);break}if(t.value!==null&&t.value!==void 0){let e=t.value;console.log(`Received 'command' message with value: "${e}"`),k.sendDataChannelMessage(`cmd,${e}`)}else console.warn(`Received invalid command from dashboard: ${t.value}`);break;case`pipelineControl`:if(t.pipeline===`microphone`&&I){console.log(`Shared mode: Microphone control blocked.`);break}if(t.pipeline===`microphone`&&k&&typeof k.setMicrophone==`function`)Qe.add(`microphone`),nt=!1,Lr(!!t.enabled);else if(t.pipeline===`video`&&I){console.log(`Shared mode: Video pipelineControl blocked.`);break}else if(t.pipeline===`video`&&k){Qe.add(`video`);let e=!!t.enabled;try{k.sendDataChannelMessage(e?`START_VIDEO`:`STOP_VIDEO`),j=e,window.postMessage({type:`pipelineStatusUpdate`,video:e},window.location.origin),Ir()}catch(e){console.error(`Video toggle failed:`,e)}}else if(t.pipeline===`audio`){if(Qe.add(`audio`),!x)break;let e=!!t.enabled;if(x.muted=!e,Ze=e,k)try{k.sendDataChannelMessage(e?`START_AUDIO`:`STOP_AUDIO`)}catch(e){console.error(`Audio toggle failed:`,e)}window.postMessage({type:`pipelineStatusUpdate`,audio:e},window.location.origin),Ir()}else if(t.pipeline===`webcam`){if(I){console.log(`Shared mode: Webcam control blocked.`);break}Qe.add(`webcam`),rt=!1,t.enabled?Rr():zr()}break;case`gamepadControl`:{console.log(`Received gamepad control message: enabled=${t.enabled}`);let e=t.enabled;Qe.add(`gamepad`),at!==e&&(at=e,W(`isGamepadEnabled`,at),Ir(),Br());break}case`clipboardUpdateFromUI`:if(console.log(`Received clipboardUpdateFromUI message.`),I){console.log(`Shared mode: Clipboard write to server blocked.`);break}fi.sendExplicit(t.text);break;case`printRequest`:xr(t.url);break;case`clipboardCopySecret`:Et.copySecret();break;case`clipboardImageUpdate`:if(I){console.log(`Shared mode: Clipboard image write to server blocked.`),vi(`viewers cannot set the clipboard`,`clipboardSkipReadonly`);break}if(!t.imageBlob){vi(`no image selected`,`clipboardSkipNoImage`);break}if(!_t){vi(`image clipboard is disabled on the server (enable_binary_clipboard)`,`clipboardSkipBinaryDisabled`);break}fi.sendExplicit(t.imageBlob,t.imageBlob.type||`image/png`,vi).catch(e=>{console.warn(`Failed to send uploaded clipboard image:`,e),vi(`send failed: `+e.message,`clipboardSkipSendFailed`)});break;case`audioDeviceSelected`:t.context===`output`&&t.deviceId?(pe=t.deviceId,zn()):t.context===`input`&&t.deviceId&&(me=t.deviceId,M&&k&&typeof k.setMicrophone==`function`&&k.setMicrophone(!1).then(()=>k.setMicrophone(!0,me)).catch(e=>{console.error(`Microphone device switch failed:`,e),M=!1,Ir()}));break;case`requestFullscreen`:case`requestGamingMode`:{let e=t.type===`requestGamingMode`;p=e,A&&e&&typeof A.enterGamingMode==`function`?A.enterGamingMode():A?A.enterFullscreen():document.fullscreenElement===null&&document.documentElement.requestFullscreen(e?{keyboardLock:`browser`}:void 0).catch(()=>{});break}case`setSynth`:A&&typeof A.setSynth==`function`&&A.setSynth(t.value);break;case`showVirtualKeyboard`:if(I)break;ir(document.getElementById(`overlayInput`));break;case`setAntiAliasing`:typeof t.value==`boolean`?(dt=t.value,W(`antiAliasingEnabled`,dt),Wn()):console.warn(`Invalid value received for setAntiAliasing:`,t.value);break;case`setUseBrowserCursors`:typeof t.value==`boolean`?(pt=t.value,W(`use_browser_cursors`,t.value),$t()):console.warn(`Invalid value received for setUseBrowserCursors:`,t.value);break;case`setRawPointerMotion`:typeof t.value==`boolean`?(mt=t.value,W(`raw_pointer_motion`,t.value),en()):console.warn(`Invalid value received for setRawPointerMotion:`,t.value);break;case`setTrackpadSpeed`:typeof t.value==`number`&&Number.isFinite(t.value)?(tn=t.value,Yt(`trackpad_speed`,String(t.value)),an()):console.warn(`Invalid value received for setTrackpadSpeed:`,t.value);break;case`setGamepadRumble`:typeof t.value==`boolean`?(on=t.value,W(`gamepad_rumble`,t.value),cn()):console.warn(`Invalid value received for setGamepadRumble:`,t.value);break;case`setMacCmdAsCtrl`:typeof t.value==`boolean`?(un=t.value,W(`mac_cmd_as_ctrl`,t.value),pn()):console.warn(`Invalid value received for setMacCmdAsCtrl:`,t.value);break;case`touchinput:trackpad`:A&&typeof A.setTrackpadMode==`function`&&(ft=!0,W(`trackpadMode`,!0),A.setTrackpadMode(!0));break;case`touchinput:touch`:A&&typeof A.setTrackpadMode==`function`&&(ft=!1,W(`trackpadMode`,!1),A.setTrackpadMode(!1))}}function Hr(e,i){let a=i?()=>{}:qt,o=i?()=>{}:W,s=i?()=>{}:Yt;if(i||ii(zt,Object.keys(e)),e.webcam_encoder!==void 0){let t=String(e.webcam_encoder);cr.includes(t)&&t!==it&&(it=t,s(`webcam_encoder`,t),k&&et&&k.setWebcamCodec(t).catch(()=>{}))}if(e.debug!==void 0){be=e.debug,W(`debug`,be),console.log(`Applied debug setting: ${be}. Reloading...`),setTimeout(()=>{window.location.reload()},700);return}let c={};if(e.video_fullcolor!==void 0&&(c.video_fullcolor=!!e.video_fullcolor),e.video_10bit!==void 0&&(c.video_10bit=!!e.video_10bit),e.video_streaming_mode!==void 0&&(c.video_streaming_mode=!!e.video_streaming_mode),e.use_paint_over_quality!==void 0&&(c.use_paint_over_quality=!!e.use_paint_over_quality),e.video_paintover_crf!==void 0&&(c.video_paintover_crf=parseInt(e.video_paintover_crf,10)),e.video_paintover_burst_frames!==void 0&&(c.video_paintover_burst_frames=parseInt(e.video_paintover_burst_frames,10)),e.force_aligned_resolution!==void 0&&(c.force_aligned_resolution=!!e.force_aligned_resolution),e.use_cpu!==void 0&&(c.use_cpu=!!e.use_cpu),e.cpu_encode_threading!==void 0&&(c.cpu_encode_threading=!!e.cpu_encode_threading),e.encoder!==void 0&&(c.encoder=e.encoder),e.displayPosition!==void 0&&(c.displayPosition=e.displayPosition),e.video_bitrate!==void 0&&(n=parseInt(e.video_bitrate,10),k.sendDataChannelMessage(`vb,${n}`),a(`video_bitrate`,n),i||je(R)),e.framerate!==void 0){let t=e.framerate===Fr;s(`framerate`,t?Fr:String(parseFloat(e.framerate)));let n=t?ur():parseFloat(e.framerate);Number.isFinite(n)&&(r=l=n,k.sendDataChannelMessage(`_arg_fps,${n}`))}if(e.audio_bitrate!==void 0&&(u=parseInt(e.audio_bitrate),k.sendDataChannelMessage(`ab,${u}`),a(`audio_bitrate`,u)),e.encoder!==void 0&&(ie=e.encoder,s(`encoder`,ie),console.log(`Encoder switched to:`,ie)),e.scaling_dpi!==void 0){let t=parseInt(e.scaling_dpi,10);!isNaN(t)&&t>0&&(Xe=t,gr(),Ye&&!window.manualResolution&&!I&&Or())}if(e.enable_binary_clipboard!==void 0&&(_t=!!e.enable_binary_clipboard,k.sendDataChannelMessage(`_ebc,${_t}`),o(`enable_binary_clipboard`,_t),console.log(`Binary clipboard support ${_t?`enabled`:`disabled`}`)),e.keyboard_shortcuts!==void 0&&(hn=!!e.keyboard_shortcuts,o(`keyboard_shortcuts`,hn),_n()),e.print_auto!==void 0&&gn&&(gn.setAutomatic(e.print_auto),o(`print_auto`,!!e.print_auto)),e.clipboard_seamless!==void 0&&(ne=!!e.clipboard_seamless,o(`clipboard_seamless`,ne)),e.clipboard_in_enabled!==void 0&&(te=!!e.clipboard_in_enabled,o(`clipboard_in_enabled`,te)),e.clipboard_out_enabled!==void 0&&(v=!!e.clipboard_out_enabled,o(`clipboard_out_enabled`,v)),e.use_css_scaling!==void 0&&Vr({origin:window.location.origin,data:{type:`setUseCssScaling`,value:!!e.use_css_scaling,persist:!i}}),e.use_browser_cursors!==void 0&&(pt=!!e.use_browser_cursors,$t()),e.raw_pointer_motion!==void 0&&(mt=!!e.raw_pointer_motion,en()),e.mac_cmd_as_ctrl!==void 0&&(un=!!e.mac_cmd_as_ctrl,pn()),e.rate_control_mode!==void 0&&(ae=e.rate_control_mode,k.sendDataChannelMessage(`_rc,${ae}`),Wr(ae),s(`rate_control_mode`,ae),console.log(`Rate control mode set to ${ae}`)),e.video_crf!==void 0&&(t=parseInt(e.video_crf,10),k.sendDataChannelMessage(`_crf,${t}`),a(`video_crf`,t),console.log(`Video CRF set to ${t}`)),e.force_aligned_resolution!==void 0){if(gt=!!e.force_aligned_resolution,o(`force_aligned_resolution`,gt),window.manualResolution&&D!=null&&O!=null)Cr(D,O);else if(!I&&A&&(window.enable_resize!==!1||R===`display2`)){let e=A.getWindowResolution();Cr(e[0],e[1])}}if(!i){let i=Object.keys(e).filter(e=>Zr.includes(e)),a={framerate:r,video_bitrate:n,audio_bitrate:u,video_crf:t,rate_control_mode:ae};for(let e of i)c[e]===void 0&&a[e]!==void 0&&(c[e]=a[e]);i.length>0&&(c.picked=i)}Object.keys(c).length>0&&k.sendDataChannelMessage(`SETTINGS,${JSON.stringify(c)}`)}function Ur(e){if(I)return;let i=ri(zt,kt,e,`${new Date().toISOString()} the settings of a display it shares`);if(Object.keys(i).length===0)return;console.log(`[display] Streaming with what the display does:`,i);for(let[e,t]of Object.entries(i))window[e]=t;i.encoder!==void 0&&(ie=i.encoder),i.video_crf!==void 0&&(t=parseInt(i.video_crf,10)),i.video_bitrate!==void 0&&(n=parseInt(i.video_bitrate,10)),i.audio_bitrate!==void 0&&(u=parseInt(i.audio_bitrate,10)),i.rate_control_mode!==void 0&&(ae=i.rate_control_mode);let a=parseFloat(i.framerate);Number.isFinite(a)&&(r=l=a),At&&window.postMessage({type:`serverSettings`,payload:{...At}},window.location.origin)}function Wr(e){e===`cbr`?k.sendDataChannelMessage(`vb,${n}`):e===`crf`&&k.sendDataChannelMessage(`_crf,${t}`)}let Gr=wn({canUpload:()=>!I}),Kr=Gr.handleRequestFileUpload,qr=Gr.handleFileInputChange,Jr=Gr.handleDragOver,Qr=Gr.handleDrop;function $r(e){if(Be.reading||Be.current&&Be.key===e)return;let t=k&&k.element,n=t&&t.srcObject&&t.srcObject.getVideoTracks()[0];if(!n||n.readyState!==`live`)return;e!==Be.key&&(Be={key:e,track:void 0,element:void 0,current:!1,reading:!1});try{let e=new VideoFrame(t);Be.element=e.format,e.close()}catch{}if(typeof MediaStreamTrackProcessor!=`function`){Be.current=Be.element!==void 0;return}let r=n.clone(),i=new MediaStreamTrackProcessor({track:r}).readable.getReader();Be.reading=!0,Promise.race([i.read(),new Promise(e=>setTimeout(e,2e3))]).then(t=>{let n=t&&t.value;n&&(Be.key===e&&(Be.track=n.format,Be.current=!0),n.close())}).catch(()=>{}).finally(()=>{Be.reading=!1,i.cancel().catch(()=>{}),r.stop()})}function ei(e){let t=e.reports.videoRTP||{},n=e.reports.candidatePairs[e.reports.selectedCandidatePairId]||{},r=e.reports.localCandidates[n.localCandidateId]||{},i=e.reports.remoteCandidates[n.remoteCandidateId]||{},a=e.video.codecName===`NA`?``:e.video.codecName,o=e.video.frameWidth,s=e.video.frameHeight,c=((e.reports.codecs[t.codecId]||{}).sdpFmtpLine||``).replace(/\s/g,``),l=`video/${a}${c?`;${c}`:``}`,u=`${l}:${o}x${s}`;if(a&&o>0){let t=e.video.framesPerSecond;ze.ask({type:`webrtc`,video:{contentType:l,width:o,height:s,bitrate:8e6,framerate:t>0?t:60}},u),$r(u)}let d=Be.key===u?Be:{},f=r.candidateType===`relay`||i.candidateType===`relay`?`relay`:i.candidateType;Ge.setClient(Object.assign({sink:`<video> element`,codec:a,resolution:o>0?`${o}x${s}`:``,path:f?`${f} ${r.relayProtocol||r.protocol||``}`.trim():``},jr({implementation:t.decoderImplementation,powerEfficient:t.powerEfficientDecoder,trackFormat:d.track,elementFormat:d.element,capable:ze.efficient})))}function ti(e,t,n){let r=e.reports.videoRTP||{},i=e.reports.audioRTP||{},a={at:performance.now(),bytes:(r.bytesReceived||0)+(i.bytesReceived||0),framesDecoded:r.framesDecoded||0,totalDecodeTime:r.totalDecodeTime||0,jitterBufferDelay:r.jitterBufferDelay||0,jitterBufferEmittedCount:r.jitterBufferEmittedCount||0,audioJitterBufferDelay:i.jitterBufferDelay||0,audioJitterBufferEmittedCount:i.jitterBufferEmittedCount||0,micBytes:(e.reports.outbound.audio||{}).bytesSent||0,webcamBytes:(e.reports.outbound.video||{}).bytesSent||0},o={framesDropped:r.framesDropped||0,nack:r.nackCount||0,pli:r.pliCount||0,freezes:r.freezeCount||0,received:(r.packetsReceived||0)+(i.packetsReceived||0),lost:(r.packetsLost||0)+(i.packetsLost||0)},s=Re,c=!!s&&s.pc!==n,l=s?c?Object.fromEntries(Object.keys(o).map(e=>[e,s.opened[e]-s.counts[e]])):s.opened:o;if(Re=Object.assign({pc:n,counts:o,opened:l},a),!s){!Ue&&x&&(He.reset(),We=0,Ue=Pr(x,He,e=>typeof e.receiveTime==`number`?e.presentationTime-e.receiveTime:NaN));return}if(Ge.noteBytes(c?a.bytes:Math.max(0,a.bytes-s.bytes)),c){He.take(),Ue&&(We+=Ue.read().dropped);return}let u=(a.at-s.at)/1e3,d=(e,t)=>t>0?Math.round(1e3*e/t*100)/100:0,f=(e,t)=>t>0?Math.round(100*e/t*100)/100:0,p=e=>u>0?Math.round(e*8/1e3/u):0,m=o.lost-l.lost,h=He.take(),g=Ue?Ue.read():{shown:0,dropped:0};We+=g.dropped;let _={fps:Ue&&Ue.reported()&&u>0?Math.round(g.shown/u*10)/10:e.video.framesPerSecond||0,rtt_ms:Math.round(t*10)/10,decode_ms:d(a.totalDecodeTime-s.totalDecodeTime,a.framesDecoded-s.framesDecoded),jitter_buffer_ms:d(a.jitterBufferDelay-s.jitterBufferDelay,a.jitterBufferEmittedCount-s.jitterBufferEmittedCount),audio_buffer_ms:d(a.audioJitterBufferDelay-s.audioJitterBufferDelay,a.audioJitterBufferEmittedCount-s.audioJitterBufferEmittedCount),packet_loss_percent:f(m,o.received-l.received+m),frames_dropped:o.framesDropped-l.framesDropped,frames_not_shown:We,nacks:o.nack-l.nack,keyframe_requests:o.pli-l.pli,freezes:o.freezes-l.freezes};h.delays>0&&(_.present_ms=Math.round(h.delaySum/h.delays*100)/100),e.reports.outbound.audio&&a.micBytes>s.micBytes&&(_.mic=`Opus, ${p(a.micBytes-s.micBytes)} kbps`);let ee=e.reports.outbound.video;if(ee&&a.webcamBytes>s.webcamBytes){let e=ee.qualityLimitationReason&&ee.qualityLimitationReason!==`none`?`, limited by ${ee.qualityLimitationReason}`:``;_.webcam=`${ee.frameWidth||0}x${ee.frameHeight||0} at ${Math.round(ee.framesPerSecond||0)} fps, ${p(a.webcamBytes-s.webcamBytes)} kbps${e}`}Ge.clientSample(_)}function ui(){if(I){console.log(`Shared mode detected, skipping stats watch setup.`);return}var e=0,t=0,n=0,r=0,i=0,a=0,o=new Date().getTime()/1e3;if(qe!==null)return;Fe=!0;let s=!1,c=async()=>{if(Ke=null,s)return;s=!0;let l=!1;var u=new Date().getTime()/1e3;try{let s=k.peerConnection,c=await k.getConnectionStats();b={};let d=c.general.currentRoundTripTime===null?ge:c.general.currentRoundTripTime*1e3;b.connectionPacketsReceived=c.general.packetsReceived,b.connectionPacketsLost=c.general.packetsLost,b.connectionStatType=c.general.connectionType,b.connectionBytesReceived=(c.general.bytesReceived*1e-6).toFixed(2)+` MBytes`,b.connectionBytesSent=(c.general.bytesSent*1e-6).toFixed(2)+` MBytes`,b.connectionAvailableBandwidth=(parseInt(c.general.availableReceiveBandwidth)/1e6).toFixed(2)+` mbps`,b.connectionCodec=c.video.codecName,b.connectionVideoDecoder=c.video.decoder,b.connectionResolution=c.video.frameWidth+`x`+c.video.frameHeight,b.connectionFrameRate=c.video.framesPerSecond,b.connectionVideoBitrate=((c.video.bytesReceived-e)/(u-o)*8/1e6).toFixed(2),e=c.video.bytesReceived,b.connectionAudioCodecName=c.audio.codecName,b.connectionAudioBitrate=((c.audio.bytesReceived-t)/(u-o)*8/1e3).toFixed(2),t=c.audio.bytesReceived,b.connectionAudioConcealedSamples=c.audio.concealedSamples,b.connectionAudioConcealmentEvents=c.audio.concealmentEvents,b.connectionAudioTotalSamplesReceived=c.audio.totalSamplesReceived,b.connectionAudioPacketsDiscarded=c.audio.packetsDiscarded,o=u,b.connectionVideoLatency=parseInt(Math.round(d+(1e3*(c.video.jitterBufferDelay-n)/(c.video.jitterBufferEmittedCount-r)||0))),n=c.video.jitterBufferDelay,r=c.video.jitterBufferEmittedCount,b.connectionAudioLatency=parseInt(Math.round(d+(1e3*(c.audio.jitterBufferDelay-i)/(c.audio.jitterBufferEmittedCount-a)||0)));let f=1e3*(c.audio.jitterBufferDelay-i)/(c.audio.jitterBufferEmittedCount-a)||0;window.currentAudioBufferSize=Math.max(0,Math.round(f/20)),i=c.audio.jitterBufferDelay,a=c.audio.jitterBufferEmittedCount,b.connectionLatency=Math.max(b.connectionVideoLatency,b.connectionAudioLatency),window.fps=b.connectionFrameRate,ei(c),Ge.open&&(l=Re===null,ti(c,d,s)),Me&&k.sendDataChannelMessage(`_stats_video,${JSON.stringify(c.allReports)}`)}catch(e){k!==null&&console.warn(`Error collecting connection stats:`,e)}finally{if(s=!1,qe===c&&Ke===null){let e=Me?1e3:5e3;Ge.open&&(e=Re===null?0:l?500:1e3),Ke=setTimeout(c,e)}}};qe=c,Ke=setTimeout(c,1e3)}function di(){qe!==null&&(Ke!==null&&(clearTimeout(Ke),Ke=null),qe())}let fi=nn({isChromium:Ct,getDeferredWriteInFlight:()=>Tt.getInFlight(),isSharedMode:()=>I,canSync:()=>ee===`enabled`&&!!window.clipboard_enabled&&ne,canRead:()=>!!te,binaryEnabled:()=>!!_t,sendClipboardData:(e,t,n)=>bi(e,t,n),clipboardSync:wt}),pi=()=>fi.readAndSend(),mi=()=>fi.maybeInitial(),hi=fn({isChromium:Ct,clipboardSync:wt,sendClipboardData:(e,t)=>bi(e,t),canSync:()=>!I&&ee===`enabled`&&!!window.clipboard_enabled&&ne,canRead:()=>!!te,canWrite:()=>!!v,binaryEnabled:()=>!!_t,getSendInFlight:()=>fi.getSendInFlight(),getDeferredWriteLanding:()=>Tt.getLanding(),hasPendingServerWrite:()=>Tt.hasPending(),readLocalClipboard:pi});async function gi(){k.sendDataChannelMessage(`kr`),Ct&&pi()}function _i(){k.sendDataChannelMessage(`kr`)}function vi(e,t){console.warn(`Clipboard image upload skipped: `+e),window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`clipboard-image`,message:e,code:t}},window.location.origin)}function yi(e){let t=Kt()||e&&e.message||String(e);console.error(`Failed to write the session image to the local clipboard:`,e),window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`clipboard-image`,message:t,code:`clipboardImageWriteFailed`}},window.location.origin)}async function bi(e,t=`text/plain`,n=null){let r=(e,t)=>{n&&n(e,t)};if(e==null){r(`nothing to send`,`clipboardSkipNoImage`);return}if(ee!==`enabled`||window.clipboard_enabled===void 0){r(`the session has not reported its clipboard policy yet`,`clipboardSkipNotConnected`);return}if(!window.clipboard_enabled){r(`the server has the clipboard turned off`,`clipboardSkipDisabled`);return}if(!te){r(`the client-to-session clipboard is turned off`,`clipboardSkipInDisabled`);return}if(!k||!k.dataChannelOpen()){r(`not connected`,`clipboardSkipNotConnected`);return}let i=e instanceof ArrayBuffer||e instanceof Uint8Array,a;i?a=e instanceof Uint8Array?e:new Uint8Array(e):(a=new TextEncoder().encode(e),t=`text/plain`);let o=e;if(i)try{let{byteLength:e,hash:t}=await vt.hashBytes(a.slice().buffer);o=Wt(e,t)}catch{}if(!wt.shouldSend(o,t))r(`already the current clipboard`,`clipboardSkipUnchanged`);else try{if(await jn(a,t,{worker:vt,send:e=>k.sendDataChannelMessage(e),waitDrain:async()=>(k.waitForDataChannelDrain&&await k.waitForDataChannelDrain(65536),!0),chunkRawBytes:Math.min(16383,Math.max(1,Math.floor(N()*3/4))),nextTid:()=>++si}),!k.dataChannelOpen()){r(`connection lost during send`,`clipboardSkipSendFailed`);return}wt.markSynced(o,t)}catch(e){console.error(`Error sending clipboard data:`,e),r(`send failed: `+(e&&e.message?e.message:e),`clipboardSkipSendFailed`)}}return{initialize(){li();let i=document.getElementById(`app`),o=document.createElement(`div`);o.className=`video-container`,we=document.createElement(`button`),we.id=`playButton`,we.textContent=`Play Stream`,we.classList.add(`hidden`),we.addEventListener(`click`,Cn),C=document.createElement(`div`),C.id=`status-display`,C.className=`status-bar`,C.textContent=`Connecting...`;let l=document.createElement(`input`);l.type=`search`,l.readOnly=!1,l.autocomplete=`off`,l.inputMode=`none`,l.virtualKeyboardPolicy=`manual`,l.setAttribute(`autocorrect`,`off`),l.setAttribute(`autocapitalize`,`off`),l.setAttribute(`spellcheck`,`false`),l.id=`overlayInput`,x=document.createElement(`video`),x.id=`stream`,x.className=`video`,x.autoplay=!0,x.playsInline=!0,x.addEventListener(`resize`,()=>{let e=x.videoWidth,t=x.videoHeight;e>0&&t>0&&de&&(window.streamResolutionDiverged=e!==de[0]||t!==de[1]),I||Wn(),K&&!I&&It>0&&Math.abs(lr()-It)>1e-6&&fr()});let fe=document.createElement(`input`);fe.type=`file`,fe.id=`globalFileInput`,fe.multiple=!0,fe.style.display=`none`,document.body.appendChild(fe),fe.addEventListener(`change`,qr),o.appendChild(x),o.appendChild(we),o.appendChild(C),o.appendChild(l),i.appendChild(o),rr(),e=`webrtc`,be=U(`debug`,!1),xe=U(`turn_switch`,!1),ve=U(`resize_remote`,ve),ye=U(`scaleLocallyManual`,!ve),n=Bt(`video_bitrate`,n),r=H(`framerate`,r),u=Bt(`audio_bitrate`,u),!I&&!c&&(window.displayRefreshRate=null,c=Xr(e=>{window.displayRefreshRate=e,window.postMessage({type:`displayRefresh`,rate:e},window.location.origin),dr()})),window.manualResolution=U(`manual_resolution`,!1),at=U(`isGamepadEnabled`,!0),D=Bt(`manual_width`,null),O=Bt(`manual_height`,null),ie=Jt(`encoder`,`h264enc`),ae=Jt(`rate_control_mode`,`cbr`),Ye=U(`useCssScaling`,!1),Xe=Jt(`scaling_dpi`,null)===null?mr():Bt(`scaling_dpi`,96),_t=U(`enable_binary_clipboard`,_t),te=U(`clipboard_in_enabled`,te),v=U(`clipboard_out_enabled`,v),ne=U(`clipboard_seamless`,ne),hn=U(`keyboard_shortcuts`,hn),gn=Sr({automatic:U(`print_auto`,!0)}),t=Bt(`video_crf`,t),dt=U(`antiAliasingEnabled`,!0),ft=U(`trackpadMode`,!1),pt=U(`use_browser_cursors`,!0),mt=U(`raw_pointer_motion`,Ft.rawPointerMotion),tn=H(`trackpad_speed`,1),on=U(`gamepad_rumble`,!0),gt=U(`force_aligned_resolution`,!1),I||(window.addEventListener(`message`,Vr),window.addEventListener(`requestFileUpload`,Kr),l.addEventListener(`dragover`,Jr),l.addEventListener(`drop`,Qr)),document.addEventListener(`visibilitychange`,Rn);let pe=F.startsWith(`#display2`)?`display2`:`primary`,me=`right`;if(pe===`display2`){let e=F.match(/^#display2-(right|left|up|down)/);e&&(me=e[1])}jt=null;var he=Te()+`/`,_e=location.protocol==`http:`?`ws://`:`wss://`,Ce=new URL(_e+window.location.host+he+`api/`+e+`/signaling/`),Oe=vn()||void 0;S=!1;let ke=null;var w=new Ve(Ce,ut,P,Dt,Oe,pe,me);w.capabilities=async()=>{let e=[];for(let t of[`h264`,`h265`,`vp9`])await Jn(t)&&e.push(t);return e},w.pageSize=()=>{if(I||window.manualResolution||R===`display2`||!A)return null;let[e,t]=br(...A.getWindowResolution());return[e,t]},w.tenBitCapabilities=async()=>{let e=[];for(let t of[`h264`,`h265`,`vp9`,`av1`])for(let n of[!1,!0])(!n||a(t))&&await er(t,n)&&e.push(Se(t,n));return e},w.onfatalretry=async()=>{let e=new URL(Ce.href);e.protocol=location.protocol===`http:`?`http:`:`https:`;let t=await Ee(e.href,yn());if(!t){w.retry();return}let n=null;try{n=sessionStorage.getItem(`selkies_mode_flip`)}catch{}if(!n&&t.status===409){try{sessionStorage.setItem(`selkies_mode_flip`,`1`)}catch{}Yt(`stream_mode`,`websockets`),console.warn(`[signaling] Server is serving WebSockets (endpoint 409); switching stored mode.`)}location.reload()},k=new Le(w,x,1),An=!1,oi=k,A=new Ft(l,e=>{I&&Dt&&!Ot||k.sendDataChannelMessage(e)},I,lt,Ye),A.displayId=pe,A.setFingerScroll(Nt),A.sendMotion=e=>{I&&Dt&&!Ot||k.sendMotionMessage(e)},A.motionBacklog=()=>k.motionBufferedAmount(),A.setShortcutsEnabled(hn),A.setDisplayLayouts(jt,pe),A.ongamepadconnected=e=>{Br()&&(y.gamepadState=`connected`,y.gamepadName=e,k._setStatus(`Gamepad connected: `+e))},A.ongamepaddisconnected=()=>{y.gamepadState=`disconnected`,y.gamepadName=`none`,k._setStatus(`Gamepad disconnected`)},I||(window.addEventListener(`focus`,gi),window.addEventListener(`blur`,_i),hi.wire()),A.attach(),A.getWindowResolution=()=>{let e=x&&x.parentElement;if(!e)return[window.innerWidth,window.innerHeight];let t=e.getBoundingClientRect();return[t.width,t.height]},window.webrtcInput=A,ft&&A.setTrackpadMode(!0),$t(),en(),pn(),an(),cn(),window.postMessage({type:`trackpadModeUpdate`,enabled:ft},window.location.origin),window.postMessage({type:`clientRoleUpdate`,role:ut},window.location.origin),w.onstatus=e=>{m(h,Xt(`[signaling] `+e)),console.log(`[signaling] `+e)},w.onerror=e=>{m(h,Xt(`[signaling] [ERROR] `+e)),console.log(`[signaling ERROR] `+e)},w.ondisconnect=e=>{ke!==null&&(clearTimeout(ke),ke=null),x.style.cursor=`auto`,Et.reset(),En(),A&&A.stopRumble(),window.__selkiesAuthProbe&&window.__selkiesAuthProbe(),e?(_=`connecting`,Qe.clear(),$e=!1,j=!0,Ze=!0,x.muted=!1,k.reset()):_=`disconnected`,Un()},w.resumable=()=>!S&&!window.__selkiesModeSwitching&&!!k.peerConnection&&k.peerConnection.connectionState===`connected`,w.onresumed=()=>{k.peerConnection.connectionState!==`connected`&&w.reconnect()},w.onshowalert=e=>{S=!0,alert(`Disconnected: `+e+` Please try again.`)},k.onstatus=e=>{m(h,Xt(`[webrtc] `+e)),console.log(`[webrtc] `+e)},k.onerror=e=>{m(h,Xt(`[webrtc] [ERROR] `+e)),console.log(`[webrtc] [ERROR] `+e)},be&&(w.ondebug=e=>{m(g,`[signaling] `+e)},k.ondebug=e=>{m(g,Xt(`[webrtc] `+e))}),k.onstreaminfo=e=>Ge.setInfo(e),k.onstreamstats=e=>Ge.serverSample(e),k.onconnection=e=>Ge.setConnection(e),k.onconnectionstatechange=e=>{if(Pe=e,Pe===`connected`){_=e,ce=0,le=!0,ue&&(ue=!1,window.postMessage({type:`transportAdvice`,offer:null},window.location.origin));try{sessionStorage.removeItem(`selkies_mode_flip`)}catch{}De(yn()).then(e=>{e!==null&&(se===null?se=e:e!==se&&location.reload())}),ke!==null&&(clearTimeout(ke),ke=null),Fe||ui(),Tn(),zn(),In()}else(e===`failed`||e===`disconnected`)&&(A&&A.stopRumble(),e===`failed`&&!S&&w.state===`connected`&&!window.__selkiesModeSwitching&&(ce++,!ue&&ce>=(le?2:1)&&(ue=!0,console.warn(`[webrtc] ${ce} session(s) failed with signaling up; offering WebSockets.`),window.postMessage({type:`transportAdvice`,offer:`websockets`},window.location.origin))),!S&&ke===null&&(ke=setTimeout(()=>{ke=null;let e=k.peerConnection&&k.peerConnection.connectionState;e===`connected`||S||typeof window<`u`&&window.__selkiesModeSwitching||w.state===`connected`&&(console.warn(`[webrtc] connection ${e}; reconnecting in place.`),w.reconnect())},e===`failed`?400:8e3)));Un()},k.ondatachannelopen=()=>{console.log(`Data channel opened`),Ge.subscribe();try{yt.armLegacyWindow(5e3),k.sendDataChannelMessage(`cr`)}catch(e){console.warn(`Failed to send initial clipboard request (cr):`,e)}A&&A.resyncGamepads(),I?console.log(`Shared mode: skipping loading of last session settings and sending persisted settings to server`):(Ar(),qn().then(ar).then(fr),Je!==null&&clearInterval(Je),Je=setInterval(async()=>{b.connectionFrameRate===parseInt(b.connectionFrameRate,10)&&k.sendDataChannelMessage(`_f,${b.connectionFrameRate}`),b.connectionLatency===parseInt(b.connectionLatency,10)&&k.sendDataChannelMessage(`_l,${b.connectionLatency}`)},5e3))},A.onmenuhotkey=()=>{f=!f,window.postMessage({type:`toggleDashboard`},window.location.origin)},A.ongamepadhotkey=()=>{window.postMessage({type:`toggleTouchGamepad`},window.location.origin)},A.gamingMode=p,A.ongamingmode=e=>{p=e,window.postMessage({type:`gamingModeUpdate`,active:e},window.location.origin)},A.onnotice=(e,t)=>{window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:e,message:t,code:e}},window.location.origin)},k.onplaystreamrequired=()=>{d=!0},k.onclipboardcontent=e=>{if(!e.data)console.warn(`Received clipboard message with null data`);else if(e.data.reply_to===`cr`&&bt(),!I)switch(e.type){case`clipboard-msg`:Et.single(e.data.mime_type||`text/plain`,e.data.content,xt(),e.data.secret===!0);break;case`clipboard-msg-start`:Et.begin(e.data.mime_type,e.data.total_size,xt(),e.data.secret===!0);break;case`clipboard-msg-data`:Et.push(e.data.content);break;case`clipboard-msg-end`:Et.finish();break;default:console.warn(`Unknown clipboard cmd received`)}},k.oncursorchange=e=>{A.updateServerCursor(e)},k.ondisplayconfig=e=>{let t=e&&e.displays||[];jt=e&&e.layouts||null,Mt=!!(e&&e.wayland),Nt=!!(e&&e.finger_scroll),A&&A.setFingerScroll&&A.setFingerScroll(Nt),A&&A.setDisplayLayouts&&A.setDisplayLayouts(jt,pe),V();let n=t.some(e=>e!==`primary`);ht!==n&&(console.log(`Secondary display connection status changed to: ${n}`),ht=n,$t())},k.onccrate=e=>Ae(R,e),k.onprintdocument=e=>{gn&&!mn().startsWith(`#display2`)&&gn.announce(e.name,e.size_bytes)},k.onsystemaction=e=>{if(e.startsWith(`rumble,`)){let[t,n,r,i]=e.split(`,`).slice(1).map(Number);A&&A.rumble(t,n,r,i)}else if(e.startsWith(`pointer,`))A&&A.onPointerEcho(e);else if(e.startsWith(`video_declined,`)){let t=e.slice(15).split(`/`).pop().toLowerCase();Hn=!0,console.error(`This session streams ${t}, which this browser cannot decode.`),C&&(C.textContent=`Error: This session streams ${oe(t)} video, which this browser cannot decode.`,C.classList.remove(`hidden`))}else if(k._setStatus(`Executing system action: `+e),e===`reload`)setTimeout(()=>{w.disconnect()},700);else if(e.startsWith(`mk_access,`)){let t=e.slice(10)===`1`;Ot=t,A&&(t?A.isInputAttached()||(console.log(`Collab access granted: attaching input context.`),A.attach_context()):(console.log(`Collab access revoked: detaching input context.`),A.detach_context()))}else if(e.startsWith(`command_error,`)&&!I)window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`command`,message:e.slice(14),code:`commandFailed`}},window.location.origin);else if(e.startsWith(`command_done,`)&&!I)window.postMessage({type:`commandDone`,command:e.slice(13)},window.location.origin);else if(e.startsWith(`apps_installed,`)&&!I)window.postMessage({type:`appsInstalled`,apps:JSON.parse(e.slice(15))},window.location.origin);else if(e.startsWith(`auth_success,`)||e.startsWith(`role_update,`)){let t=e.slice(e.indexOf(`,`)+1),n;try{n=JSON.parse(t)}catch(e){console.error(`Failed to parse role verdict:`,e);return}let r=e.startsWith(`role_update,`),i=P;ut=n.role===ot?ot:st,P=n.slot===null||n.slot===void 0?null:n.slot;let a=Array.isArray(P)?P[0]:P;lt=a!==null&&a>0?a-1:void 0,console.log(`Server role verdict: role=${ut}, slot=${P}`),A&&(A.updateControllerSlot(P),ut===st&&A.setSharedMode(!0),r&&A.gamepadManager&&(i!==null&&P===null?A.gamepadManager.disable():i===null&&P!==null&&at&&A.gamepadManager.enable())),window.postMessage({type:`clientRoleUpdate`,role:ut},window.location.origin)}else if(e.startsWith(`capture_demand,`)&&!I){let[t,n]=e.slice(15).split(`,`);t===`webcam`&&!Qe.has(`webcam`)?n===`1`?rt||Rr(!0):zr():t===`microphone`&&!Qe.has(`microphone`)&&k&&typeof k.setMicrophone==`function`&&(n===`1`?nt||Lr(!0,!0):Lr(!1))}else if(e.startsWith(`resolution,`)){let t=e.slice(11).split(`x`),n=parseInt(t[0],10),r=parseInt(t[1],10);n>0&&r>0&&window.manualResolution&&(D!==n||O!==r)&&(D=n,O=r,qt(`manual_width`,n),qt(`manual_height`,r),pr(D,O,ye))}else k._setStatus(`Server sent acknowledgment for `+e)},k.onlatencymeasurement=e=>{ge=e*2};let T=e=>{if(I||pe!==`primary`)return;let t=t=>e&&e[t]||null,n=(e,n)=>{let r=t(e);return r&&typeof r.value==`boolean`?r.value:n},r=e=>{let n=t(e);return!!(n&&n.value===!1&&n.locked)},i=e=>!Qe.has(e),a=!1;i(`video`)&&!n(`video_on_start`,!0)&&j&&(j=!1,window.postMessage({type:`pipelineStatusUpdate`,video:!1},window.location.origin),a=!0);let o=n(`audio_enabled`,!0)===!1;i(`audio`)&&!n(`audio_on_start`,!0)&&!o&&Ze&&(Ze=!1,x&&(x.muted=!0),window.postMessage({type:`pipelineStatusUpdate`,audio:!1},window.location.origin),a=!0),i(`microphone`)&&!n(`microphone_on_demand`,!1)&&n(`microphone_on_start`,!1)&&!r(`microphone_enabled`)&&!M&&k&&typeof k.setMicrophone==`function`&&Lr(!0),i(`webcam`)&&!n(`webcam_on_demand`,!1)&&n(`webcam_on_start`,!1)&&!r(`webcam_enabled`)&&Rr();let s=window.localStorage.getItem(zt(`isGamepadEnabled`))!==null;if(i(`gamepad`)&&!s){let e=n(`gamepad_on_start`,!0);at!==e&&(at=e,Br(),a=!0)}a&&Ir()};k.ondisplaysettings=e=>Ur(e&&e.settings||{}),k.onpagevisibility=()=>{An=!0,Mn()},k.onserversettings=e=>{if(e.settings===void 0||e.settings===null){console.warn(`Received invalid server settings paylod`);return}console.log(`Received server settings payload:`,e.settings),At=e.settings;let r=Gn(e.settings);Number.isFinite(window.video_crf)&&(t=Math.round(window.video_crf)),Number.isFinite(window.video_bitrate)&&(n=Math.round(window.video_bitrate));let i=e.settings.framerate;s=i&&i.min!==void 0?{min:i.min,max:i.max}:null,dr();let a=e.settings&&e.settings.video_fullcolor;Yn=!!(a&&a.locked),a&&Xn();let o=e.settings&&e.settings.video_10bit;or=!!(o&&o.locked),o&&sr();let c=e.settings&&e.settings.webcam_encoder;if(c&&cr.includes(c.value)){let e=Jt(`webcam_encoder`,c.value);it=c.locked||!cr.includes(e)?c.value:e,k&&et&&k.setWebcamCodec(it).catch(()=>{})}let l=e.settings&&e.settings.command_enabled;ci=l&&typeof l.value==`boolean`?l.value:!0,$e||($e=!0,T(e.settings));let u=e.settings&&e.settings.enable_resize;u&&typeof u.value==`boolean`&&(window.enable_resize=u.value);let d=e.settings&&e.settings.clipboard_in_enabled;d&&typeof d.value==`boolean`&&(te=d.value);let f=e.settings&&e.settings.clipboard_out_enabled;f&&typeof f.value==`boolean`&&(v=f.value);let p=e.settings&&e.settings.enable_binary_clipboard;p&&typeof p.value==`boolean`&&(_t=p.locked?p.value:U(`enable_binary_clipboard`,p.value));let m=bn(e.settings);m!==mt&&(mt=m,en());let h=xn(e.settings);h!==un&&(un=h,pn());let g=Sn(e.settings);if(g!==Ye&&window.postMessage({type:`setUseCssScaling`,value:g},window.location.origin),mi(),Ie(e.settings),window.postMessage({type:`serverSettings`,payload:e.settings},window.location.origin),Object.keys(r).length>0&&(console.log(`Client settings were sanitized by server rules. Sending updates back to server:`,r),Hr(r,!0)),e.settings.manual_resolution&&e.settings.manual_resolution.value===!0){console.log(`Server settings payload confirms manual mode. Switching to manual resize handlers.`);let t=e.settings.manual_width?parseInt(e.settings.manual_width.value,10):0,n=e.settings.manual_height?parseInt(e.settings.manual_height.value,10):0;t>0&&n>0?(console.log(`Applying server-enforced manual resolution: ${t}x${n}`),window.manualResolution=!0,D=t,O=n,pr(D,O,ye),_r(`server resolution`)&&gr()):console.warn(`Server dictated manual mode but did not provide valid dimensions.`),Tr()}else{if(I){console.log(`Shared mode detected, skipping auto resize enablement.`);return}console.log(`Server settings payload confirms auto mode. Switching to auto resize handlers.`),wr()}e.settings.enable_webrtc_statistics&&e.settings.enable_webrtc_statistics.value===!0&&(Me=!0)},window.isSecureContext&&navigator.clipboard&&(ee=`enabled`);let E=e=>{k.forceTurn=xe,re=A.getWindowResolution(),w.currRes=re,ye===!1&&(k.element.style.width=re[0]+`px`,k.element.style.height=re[1]+`px`),e.iceServers&&e.iceServers.length>1?m(g,Xt(`using TURN servers: `+e.iceServers[1].urls.join(`, `))):m(g,Xt(`no TURN servers found.`)),k.rtcPeerConfig=e,k.connect()};fetch(Te()+`/api/turn`,{headers:yn()}).then(function(e){if(!e.ok)throw Error(`Status: ${e.status}`);return e.json()}).then(e=>{E(e)}).catch(e=>{m(g,Xt(`TURN config unavailable (${e}); connecting without TURN.`)),console.warn(`Failed to fetch TURN server details (${e}); continuing without TURN.`),E({iceServers:[]})})},cleanup(){window.manualResolution=!1,window.fps=0,zr(),window.removeEventListener(`message`,Vr),window.removeEventListener(`resize`,Er),window.removeEventListener(`requestFileUpload`,Kr),window.removeEventListener(`focus`,gi),window.removeEventListener(`blur`,_i),document.removeEventListener(`visibilitychange`,Rn),En(),pe=null,hi.unwire();try{vt.terminate()}catch(e){if(e.name===`AbortError`)return;console.error(e)}vt=null,e=null,n=8e3,r=60,c&&c.stop(),c=s=l=null,u=128e3,d=!1,f=!1,h=[],g=[],_=`connecting`,ee=`disabled`,re=[],ie=``,y={gamepadState:`disconnected`,gamepadName:`none`},b={connectionStatType:`unknown`,connectionLatency:0,connectionVideoLatency:0,connectionAudioLatency:0,connectionAudioCodecName:`NA`,connectionAudioBitrate:0,connectionPacketsReceived:0,connectionPacketsLost:0,connectionBytesReceived:0,connectionBytesSent:0,connectionCodec:`unknown`,connectionVideoDecoder:`unknown`,connectionResolution:``,connectionFrameRate:0,connectionVideoBitrate:0,connectionAvailableBandwidth:0},ge=0,ve=!1,ye=!1,be=!1,xe=!1,we=null,C=null,w=null,T=500,E=!1,D=0,O=0,at=!0,Qe.clear(),$e=!1,Pe=``,Fe=!1,Ge.disconnected(),Re=null,qe=null,Ke!==null&&(clearTimeout(Ke),Ke=null),Je!==null&&(clearInterval(Je),Je=null),Fn(),k=null,oi=null,A=null,Ye=!1,ct=null,lt=0,Me=!1,_t=!0,ci=!0,Et.reset()}}}var di=`/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * What the video wire says about its codec, and the WebCodecs codec string a
 * stream's own key frame declares.
 *
 * A \`0x04\` frame's type byte carries the frame kind in its low nibble (\`1\` = a
 * decode entry point) and the codec id in its high nibble. The codec string a
 * \`VideoDecoder\` is configured with is read from the key frame's parameter sets
 * wherever the codec has them (the H.264 SPS, the H.265 SPS, the AV1 sequence
 * header), so it always matches the bitstream; VP8 has one string, and VP9's
 * level, which its bitstream never carries, is derived from the geometry.
 *
 * Every function here is also injected into the video worker by \`toString()\`,
 * so they reference nothing but each other and stay free of module state.
 */

/** Codec names by wire id. */
export const WIRE_CODECS = { 1: 'h264', 2: 'vp8', 3: 'vp9', 4: 'av1', 5: 'h265' };

/** Encoder wire values and the codec each streams. */
export const ENCODER_CODECS = {
  jpeg: 'jpeg',
  h264enc: 'h264',
  'h264enc-striped': 'h264',
  h265enc: 'h265',
  vp8enc: 'vp8',
  vp9enc: 'vp9',
  av1enc: 'av1',
};

/**
 * @param {number} typeByte The second byte of a video frame's wire header.
 * @returns {string} The codec name; an id no codec has reads as H.264.
 */
export const wireCodecName = (typeByte) => WIRE_CODECS[typeByte >> 4] || 'h264';

/**
 * @param {number} typeByte The second byte of a video frame's wire header.
 * @returns {boolean} Whether the frame is a decode entry point.
 */
export const wireFrameIsKey = (typeByte) => (typeByte & 0x0f) === 0x01;

/**
 * @param {string} encoder An encoder wire value.
 * @returns {string} The codec it streams; an unknown encoder reads as H.264.
 */
export const codecOfEncoder = (encoder) => ENCODER_CODECS[encoder] || 'h264';

/**
 * @param {string} codec A codec name.
 * @returns {boolean} Whether the codec can carry 4:4:4 chroma.
 */
export const codecCarriesFullColor = (codec) => codec === 'h264' || codec === 'h265' || codec === 'vp9';

/**
 * Whether a codec has a 10-bit profile the server's encoders emit (H.264 High 10
 * and High 4:4:4 Predictive, H.265 Main 10 and Main 4:4:4 10, VP9 profiles 2
 * and 3, AV1).
 * @param {string} codec The codec name.
 * @returns {boolean}
 */
export const codecCarriesTenBit = (codec) => codec === 'h264' || codec === 'h265' || codec === 'vp9' || codec === 'av1';

/**
 * The NAL units of an Annex-B buffer, each without its start code.
 * @param {Uint8Array} bytes
 * @returns {Uint8Array[]}
 */
export const annexbNals = (bytes) => {
  const nals = [];
  const n = bytes.length;
  let start = -1;
  for (let i = 0; i + 2 < n; i++) {
    if (bytes[i] === 0 && bytes[i + 1] === 0 && bytes[i + 2] === 1) {
      if (start >= 0) {
        let end = i;
        while (end > start && bytes[end - 1] === 0) end--;
        if (end > start) nals.push(bytes.subarray(start, end));
      }
      start = i + 3;
      i += 2;
    }
  }
  if (start >= 0 && start < n) nals.push(bytes.subarray(start, n));
  return nals;
};

/**
 * A bit reader over an RBSP: \`bytes\` from \`offset\` with emulation prevention
 * bytes removed, \`limit\` bytes at most; \`raw\` reads them as they stand, for
 * AV1, which has none.
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @param {number} limit
 * @param {boolean} [raw]
 * @returns {{u: (n: number) => number, skip: (n: number) => void}}
 */
export const rbspReader = (bytes, offset, limit, raw = false) => {
  const data = [];
  let zeros = 0;
  for (let i = offset; i < bytes.length && data.length < limit; i++) {
    const b = bytes[i];
    if (!raw && zeros >= 2 && b === 3) { zeros = 0; continue; }
    zeros = b === 0 ? zeros + 1 : 0;
    data.push(b);
  }
  let pos = 0;
  const u = (n) => {
    let v = 0;
    for (let i = 0; i < n; i++) {
      const byte = data[pos >> 3];
      const bit = byte === undefined ? 0 : (byte >> (7 - (pos & 7))) & 1;
      v = v * 2 + bit;
      pos++;
    }
    return v;
  };
  return { u, skip: (n) => { pos += n; } };
};

/**
 * \`avc1.PPCCLL\` from the first SPS of an H.264 Annex-B key frame.
 * @param {Uint8Array} bytes
 * @returns {string|null} \`null\` when no SPS is found.
 */
export const parseAvcCodecFromAnnexB = (bytes) => {
  if (!bytes || bytes.length < 5) return null;
  const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, '0');
  for (const nal of annexbNals(bytes)) {
    if ((nal[0] & 0x80) === 0 && (nal[0] & 0x1f) === 7) {
      // profile_idc, constraint flags, and level_idc are the first three RBSP
      // bytes and, with profile_idc always >= 66, never need emulation prevention.
      if (nal.length < 4) return null;
      return \`avc1.\${hex2(nal[1])}\${hex2(nal[2])}\${hex2(nal[3])}\`;
    }
  }
  return null;
};

/**
 * \`hev1.P.C.TL.CC\` from the first SPS of an H.265 Annex-B key frame: the
 * general profile, its compatibility flags as the reversed-bit hexadecimal the
 * codecs registration specifies, the tier and level, and the constraint bytes
 * with trailing zero bytes dropped.
 * @param {Uint8Array} bytes
 * @returns {string|null} \`null\` when no SPS is found.
 */
export const parseHevcCodecFromAnnexB = (bytes) => {
  if (!bytes || bytes.length < 5) return null;
  for (const nal of annexbNals(bytes)) {
    if (((nal[0] >> 1) & 0x3f) !== 33 || nal.length < 16) continue;
    const r = rbspReader(nal, 2, 32);
    r.skip(4 + 3 + 1);
    const profileSpace = r.u(2);
    const tier = r.u(1);
    const profile = r.u(5);
    let compat = 0;
    for (let j = 0; j < 32; j++) compat |= r.u(1) << j;
    const constraints = [];
    for (let j = 0; j < 6; j++) constraints.push(r.u(8));
    const level = r.u(8);
    while (constraints.length > 1 && constraints[constraints.length - 1] === 0) constraints.pop();
    const space = ['', 'A', 'B', 'C'][profileSpace];
    const flags = (compat >>> 0).toString(16).toUpperCase();
    const bytesHex = constraints.map((b) => b.toString(16).toUpperCase()).join('.');
    return \`hev1.\${space}\${profile}.\${flags}.\${tier ? 'H' : 'L'}\${level}.\${bytesHex}\`;
  }
  return null;
};

/**
 * \`av01.P.LLT.DD\` from the sequence header of an AV1 temporal unit: the profile,
 * the first operating point's level and tier, and the bit depth its color
 * configuration declares. Every operating point is read past, and the header
 * as it stands, since AV1 has no emulation prevention.
 * @param {Uint8Array} bytes
 * @returns {string|null} \`null\` when no sequence header is found.
 */
export const parseAv1CodecFromObus = (bytes) => {
  if (!bytes || bytes.length < 2) return null;
  let pos = 0;
  while (pos < bytes.length) {
    const header = bytes[pos];
    const obuType = (header >> 3) & 0x0f;
    const hasExtension = (header & 0x04) !== 0;
    const hasSize = (header & 0x02) !== 0;
    let i = pos + 1 + (hasExtension ? 1 : 0);
    let size = bytes.length - i;
    if (hasSize) {
      size = 0;
      let shift = 0;
      for (;;) {
        if (i >= bytes.length || shift > 28) return null;
        const b = bytes[i++];
        size += (b & 0x7f) * (2 ** shift);
        if ((b & 0x80) === 0) break;
        shift += 7;
      }
    }
    if (obuType === 1) {
      const r = rbspReader(bytes, i, size, true);
      const profile = r.u(3);
      r.skip(1);
      const reduced = r.u(1);
      let level;
      let tier = 0;
      if (reduced) {
        level = r.u(5);
      } else {
        const timingInfo = r.u(1);
        let decoderModel = 0;
        let bufferDelayBits = 0;
        if (timingInfo) {
          r.skip(64);
          if (r.u(1)) {
            let leading = 0;
            while (r.u(1) === 0 && leading < 32) leading++;
            r.skip(leading);
          }
          decoderModel = r.u(1);
          if (decoderModel) {
            bufferDelayBits = r.u(5) + 1;
            r.skip(32 + 5 + 5);
          }
        }
        const displayDelay = r.u(1);
        const points = r.u(5) + 1;
        for (let op = 0; op < points; op++) {
          r.skip(12);
          const opLevel = r.u(5);
          const opTier = opLevel > 7 ? r.u(1) : 0;
          if (op === 0) {
            level = opLevel;
            tier = opTier;
          }
          if (decoderModel && r.u(1)) r.skip(bufferDelayBits * 2 + 1);
          if (displayDelay && r.u(1)) r.skip(4);
        }
      }
      const widthBits = r.u(4) + 1;
      const heightBits = r.u(4) + 1;
      r.skip(widthBits + heightBits);
      let orderHint;
      if (!reduced) {
        if (r.u(1)) r.skip(4 + 3);
        r.skip(3 + 4);
        orderHint = r.u(1);
        if (orderHint) r.skip(2);
        const screenContent = r.u(1) ? 2 : r.u(1);
        if (screenContent > 0 && !r.u(1)) r.skip(1);
        if (orderHint) r.skip(3);
      } else {
        r.skip(3);
      }
      r.skip(3);
      const depth = r.u(1) ? ((profile === 2 && r.u(1)) ? 12 : 10) : 8;
      return \`av01.\${profile}.\${String(level).padStart(2, '0')}\${tier ? 'H' : 'M'}.\${String(depth).padStart(2, '0')}\`;
    }
    pos = i + size;
  }
  return null;
};

/**
 * The VP9 profile a frame's uncompressed header declares.
 * @param {Uint8Array} bytes
 * @returns {number}
 */
export const parseVp9Profile = (bytes) => {
  if (!bytes || bytes.length < 1) return 0;
  const b = bytes[0];
  return ((b >> 5) & 1) | (((b >> 4) & 1) << 1);
};

/**
 * The bit depth a VP9 key frame's uncompressed header declares: 8 for profiles 0
 * and 1, 10 or 12 by the flag that follows the sync code for profiles 2 and 3.
 * @param {Uint8Array} bytes
 * @returns {number}
 */
export const parseVp9BitDepth = (bytes) => {
  const profile = parseVp9Profile(bytes);
  if (profile < 2 || !bytes || bytes.length < 5) return 8;
  const r = rbspReader(bytes, 0, 8);
  r.skip(profile === 3 ? 5 : 4);
  // A shown existing frame or a predicted one carries no color configuration.
  if (r.u(1) || r.u(1)) return 10;
  r.skip(2 + 24);
  return r.u(1) ? 12 : 10;
};

/**
 * The lowest VP9 level whose luma sample rate and picture size admit a stream,
 * as the two digits of the codec string.
 * @param {number} width
 * @param {number} height
 * @param {number} fps
 * @returns {string}
 */
export const vp9Level = (width, height, fps) => {
  const size = width * height;
  const rate = size * (fps > 0 ? fps : 60);
  const levels = [
    ['10', 829440, 36864], ['11', 2764800, 73728], ['20', 4608000, 122880],
    ['21', 9216000, 245760], ['30', 20736000, 552960], ['31', 36864000, 983040],
    ['40', 83558400, 2228224], ['41', 160432128, 2228224], ['50', 311951360, 8912896],
    ['51', 588251136, 8912896], ['52', 1176502272, 8912896], ['60', 1176502272, 35651584],
    ['61', 2353004544, 35651584], ['62', 4706009088, 35651584],
  ];
  for (const [level, maxRate, maxSize] of levels) {
    if (rate <= maxRate && size <= maxSize) return level;
  }
  return '62';
};

/**
 * The lowest AV1 level admitting a stream, as \`seq_level_idx\`; used only when a
 * key frame's sequence header is unreadable. MaxPicSize is its own Annex A limit,
 * far below the product of the axis maxima, since no level admits a picture that
 * is both its widest and its tallest.
 * @param {number} width
 * @param {number} height
 * @param {number} fps
 * @returns {number}
 */
export const av1LevelIdx = (width, height, fps) => {
  const size = width * height;
  const rate = size * (fps > 0 ? fps : 60);
  const levels = [
    [8, 2359296, 6144, 3456, 70778880], [9, 2359296, 6144, 3456, 141557760],
    [12, 8912896, 8192, 4352, 267386880], [13, 8912896, 8192, 4352, 534773760],
    [14, 8912896, 8192, 4352, 1069547520], [15, 8912896, 8192, 4352, 1069547520],
    [16, 35651584, 16384, 8704, 1069547520], [17, 35651584, 16384, 8704, 2139095040],
    [18, 35651584, 16384, 8704, 4278190080], [19, 35651584, 16384, 8704, 4278190080],
  ];
  for (const [idx, maxSize, maxW, maxH, maxRate] of levels) {
    if (size <= maxSize && width <= maxW && height <= maxH && rate <= maxRate) return idx;
  }
  return 19;
};

/**
 * Pre-stream guess of the H.264 codec string. Decoder creation re-derives the
 * exact codec from the first key frame's SPS, and outside Chromium only a
 * conservative baseline is guessed because Safari rejects a stream whose real
 * profile or level exceeds the configured one.
 * @param {number} width
 * @param {number} height
 * @param {boolean} is444 Whether the stream is 4:4:4 full-color.
 * @param {number} fps
 * @param {boolean} chromium Whether the engine takes a High profile guess.
 * @returns {string}
 */
/**
 * The \`level_idc\`, as a two-hex-digit string, an H.264 stream of this geometry declares, floored
 * across the common frame rates like the encoder's own ladder so a rate change moves nothing.
 * Mirrors \`h264_level\` in pixelflux \`codec.rs\`.
 * @param {number} width
 * @param {number} height
 * @param {number} fps
 * @returns {string}
 */
export const h264LevelIdc = (width, height, fps) => {
  const mbs = Math.ceil(width / 16) * Math.ceil(height / 16);
  const mbps = mbs * Math.max(fps > 0 ? fps : 60, 60);
  const levels = [
    [0x29, 8192, 245760], [0x2A, 8704, 522240], [0x32, 22080, 589824], [0x33, 36864, 983040],
    [0x34, 36864, 2073600], [0x3C, 139264, 4177920], [0x3D, 139264, 8355840], [0x3E, 139264, 16711680],
  ];
  for (const [idc, maxFs, maxMbps] of levels) {
    if (mbs <= maxFs && mbps <= maxMbps) return idc.toString(16).toUpperCase().padStart(2, '0');
  }
  return '3E';
};

export const guessAvcCodec = (width, height, is444, fps, chromium) => {
  if (!chromium) return 'avc1.42E01E';
  // The encoders' emitted profile_idc: High (0x64) for 4:2:0, High 4:4:4 (0xF4) for 4:4:4. The
  // level matches the encoder's per-geometry choice (floored across the common rates), so the
  // decoder configured before the first key frame does not reconfigure when its SPS arrives.
  const profile = is444 ? 'F400' : '6400';
  return \`avc1.\${profile}\${h264LevelIdc(width, height, fps)}\`;
};

/**
 * The WebCodecs codec string of a stream, from its key frame where the codec
 * declares it and from the geometry otherwise.
 * @param {string} codec The wire codec name.
 * @param {Uint8Array|null} keyframe The key frame's payload, or \`null\` for a delta.
 * @param {number} width
 * @param {number} height
 * @param {number} fps
 * @param {boolean} is444
 * @param {boolean} chromium
 * @returns {string}
 */
export const codecStringFor = (codec, keyframe, width, height, fps, is444, chromium) => {
  switch (codec) {
    case 'h265':
      return (keyframe && parseHevcCodecFromAnnexB(keyframe)) ||
        (is444 ? 'hev1.4.10.L153.9E.8' : 'hev1.1.6.L153.B0');
    case 'vp8':
      return 'vp8';
    case 'vp9':
      return \`vp09.0\${keyframe ? parseVp9Profile(keyframe) : 0}.\${vp9Level(width, height, fps)}.\${
        String(keyframe ? parseVp9BitDepth(keyframe) : 8).padStart(2, '0')}\`;
    case 'av1':
      return (keyframe && parseAv1CodecFromObus(keyframe)) ||
        \`av01.0.\${String(av1LevelIdx(width, height, fps)).padStart(2, '0')}M.08\`;
    default:
      return (keyframe && parseAvcCodecFromAnnexB(keyframe)) ||
        guessAvcCodec(width, height, is444, fps, chromium);
  }
};

/**
 * The color space a decoder is told to assume, which is every session's: no
 * engine reads it out of an H.264 bitstream. Chromium and Firefox both report
 * \`bt709\` at limited range for a stream whose VUI says otherwise, so a full
 * range session rendered without this hint is wrong by up to eight levels a
 * channel, and both honor the hint exactly. VP8 is held to BT.601 whatever the
 * session converted with, the one value its bitstream can name, because Firefox
 * reads that bit and ignores this; VP9 is told BT.709 because Chromium's
 * decoder does not read the matrix from the frame header.
 * @param {string} codec The wire codec name or WebCodecs codec string.
 * @param {boolean} [fullRange] Whether the session converted at full range.
 * @returns {VideoColorSpaceInit}
 */
export const decoderColorSpace = (codec, fullRange = false) => {
  const vp8 = codec === 'vp8';
  const matrix = vp8 ? 'smpte170m' : 'bt709';
  return { primaries: 'bt709', transfer: 'bt709', matrix, fullRange: !vp8 && !!fullRange };
};

/**
 * Representative decoder configurations, one per codec at the profile and
 * level the encoders emit for a 720p stream, for asking an engine what it can
 * decode before any stream exists.
 */
/**
 * A 16x16 Baseline key frame in Annex B form, for asking a decoder whether it
 * takes H.264 without an \`avcC\` description.
 */
export const H264_ANNEXB_SAMPLE = 'AAAAAWdCwArd7ARAAAADAEAAAA8DxIngAAAAAWjOD8gAAAABZYiEOiYoDg==';

/**
 * The \`avcC\` record of an Annex B key frame's SPS and PPS, for a decoder that
 * takes H.264 only with a description; null when either is missing.
 * @param {Uint8Array} bytes
 * @returns {Uint8Array|null}
 */
export const avcDescription = (bytes) => {
  let sps = null;
  let pps = null;
  for (const nal of annexbNals(bytes)) {
    const type = nal[0] & 0x1f;
    if (type === 7 && !sps) sps = nal;
    else if (type === 8 && !pps) pps = nal;
  }
  if (!sps || !pps) return null;
  const out = new Uint8Array(11 + sps.length + pps.length);
  out.set([1, sps[1], sps[2], sps[3], 0xff, 0xe1, sps.length >> 8, sps.length & 0xff], 0);
  out.set(sps, 8);
  out.set([1, pps.length >> 8, pps.length & 0xff], 8 + sps.length);
  out.set(pps, 11 + sps.length);
  return out;
};

/**
 * An Annex B access unit as length-prefixed NAL units, the framing an \`avcC\`
 * description implies, without its parameter sets and delimiters.
 * @param {Uint8Array} bytes
 * @returns {Uint8Array}
 */
export const annexbToAvcc = (bytes) => {
  const nals = annexbNals(bytes).filter((nal) => {
    const type = nal[0] & 0x1f;
    return type !== 7 && type !== 8 && type !== 9;
  });
  let size = 0;
  for (const nal of nals) size += 4 + nal.length;
  const out = new Uint8Array(size);
  let pos = 0;
  for (const nal of nals) {
    out[pos] = nal.length >>> 24;
    out[pos + 1] = (nal.length >>> 16) & 0xff;
    out[pos + 2] = (nal.length >>> 8) & 0xff;
    out[pos + 3] = nal.length & 0xff;
    out.set(nal, pos + 4);
    pos += 4 + nal.length;
  }
  return out;
};

/**
 * @param {Uint8Array|null} a
 * @param {Uint8Array|null} b
 * @returns {boolean} Whether both are absent or byte-for-byte equal.
 */
export const sameBytes = (a, b) => {
  if (!a || !b) return !a && !b;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

export const PROBE_CODEC_STRINGS = {
  h264: 'avc1.42E01E',
  h265: 'hev1.1.6.L93.B0',
  vp8: 'vp8',
  vp9: 'vp09.00.31.08',
  av1: 'av01.0.05M.08',
};

/**
 * One 10-bit key frame of each format, 320x240 of flat gray, for asking a
 * decoder for a picture rather than for its word: a codec name is its 4:2:0,
 * the name with \`444\` after it its 4:4:4. An engine can accept a 10-bit
 * configuration and then fail the frame, which only decoding one shows.
 * @type {Object<string, string>}
 */
export const TEN_BIT_SAMPLES = {
  h264: 'AAAAAWduAA2mzZQUH7ARAAADAAEAAAMAPA8UKZYAAAABaOvjyyLAAAABZYiEADf//vbw/gNCUJcRzeidMx+/Fbi6NDe9zgACrU8Qb7gsE2lPYBBAAAGfEd0SuCykEBAvSus=',
  h264444: 'AAAAAWf0AA2Q2bKCg/YCIAAAAwAgAAAHgeKFMsAAAAABaOvjxEhEAAABZYiEADf//vaH+A0Lun/9P+C6zp85f52wAAq0QAbCNhAp8AAAAwAAAwAAAwACNw==',
  h265: 'AAAAAUABDAH//wIgAAADAJAAAAMAAAMAPJWYCQAAAAFCAQECIAAAAwCQAAADAAADADygCggPE2WVmkkyvAWgIAAAAwAgAAADA8EAAAABRAHBcrQiQAAAASgBrwhg+Snjmyr/oamsIyBbC7MwAAADAAADAAADAAADAAADAPSA',
  h265444: 'AAAAAUABDAH//wQIAAADAJwIAAADAAA8lZgJAAAAAUIBAQQIAAADAJwIAAADAAA8kAFBAeJssrNJJleAtAQAAAMABAAAAwB4IAAAAAFEAcFyhgxCJAAAASgBrwhg+Snjmyr/oamsIyBbC7MwAAADAAADAAADAAADAAADAPSA',
  vp9: 'kkmDQgAJ+Ad7ABwSDgxJAAAYYAAAZzaRO7i1N12+muU5wAA=',
  vp9444: 'sSTBoQAAn4B3sAHBIODEkAABgGAAAGc2kOnpLRNlZkoaQGA=',
  av1: 'EgAKCwAAAAQ8/7xq+cBAMhcQAJEAhBAggIAAAgF1u6aQC9g5Dyf14A==',
};

/** The 4:4:4 configurations, at the profiles the encoders emit (VP9 profile 1). */
export const PROBE_FULLCOLOR_STRINGS = {
  h264: 'avc1.F4001E',
  h265: 'hev1.4.10.L93.9E.8',
  vp9: 'vp09.01.10.08.03',
};
`,fi=`/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * What a decoder should do with each frame that arrives, so a decoder that
 * falls behind costs the stream as little as possible.
 *
 * A decoder given more than it can decode has to let something go, and what it
 * lets go breaks the frames that predict from it. Where the encoder says what
 * each frame predicts from, the cheapest repair is to drop the frame, tell the
 * server which one went, and hold back only what predicts from it: the encoder
 * predicts past it and decoding resumes on its next frame, no key frame on the
 * wire. Where the encoder says nothing -- a stripe of a striped stream, a codec
 * whose session does not track its references -- the only repair is a key
 * frame, so the gate asks for one instead. A run of drops that the encoder
 * never predicts past is the same case and ends in that request too. A key
 * frame that finds the decoder behind is decoded in place of everything queued
 * ahead of it, all of which predicts from before it and would only be shown
 * late: without that, a decoder slower than the stream falls further behind at
 * every key frame, since each one starts the hold over while the backlog stays.
 *
 * @module
 */

/** Frames of decode backlog that count as falling behind. */
export const OVERLOAD_QUEUE = 6;
/** How long that backlog must stand before a frame is let go, in ms. */
export const OVERLOAD_HOLD_MS = 250;
/** How long frames may go undecodable before a key frame is asked for, in ms. */
export const LOST_RECOVERY_MS = 1000;
/** How many dropped frame ids are remembered. A frame predicts from one of the
 * last few its encoder produced, so nothing is lost by forgetting an older one. */
export const LOST_MEMORY = 64;
/** How far behind the frame being decided a remembered id is forgotten. Frame ids
 * are 16-bit and recur every 65536 frames, which an infinite GOP outlasts; half
 * the id space is far past any reference or frame in flight, and well short of
 * the id coming round again. */
export const LOST_HORIZON = 0x8000;

/**
 * @typedef {'decode'|'flush'|'lost'|'no_key'|'overload'} Decision What to do
 *     with a frame: decode it, decode it after dropping the decoder's backlog
 *     (a key frame behind more than OVERLOAD_QUEUE frames), let it go and report
 *     it lost, or ask for a key frame because none has been decoded yet or
 *     because dropping more would not help.
 */

export class DecodeGate {
  /**
   * @param {object} [options]
   * @param {() => number} [options.now] Monotonic clock in ms.
   */
  constructor({ now = () => performance.now() } = {}) {
    this._now = now;
    this._lost = [];
    this._lostSince = 0;
    this._overloadSince = 0;
    this._haveKey = false;
    this._needKey = false;
  }

  /** The decoder was (re)built, so it needs a key frame before anything else. */
  configured() {
    this._haveKey = false;
    this._needKey = true;
    this._reset();
  }

  /** Nothing decoded so far is usable, so only a key frame is. */
  invalidated() {
    this._needKey = true;
  }

  _reset() {
    this._lost.length = 0;
    this._lostSince = 0;
    this._overloadSince = 0;
  }

  /**
   * @param {boolean} key Whether the frame decodes on its own.
   * @param {number} frameId The frame's own id.
   * @param {number|undefined} reference The id of the frame it predicts from;
   *     its own id, or undefined, where the encoder does not say.
   * @param {number} queueSize Frames the decoder has yet to decode.
   * @returns {Decision}
   */
  decide(key, frameId, reference, queueSize) {
    if (key) {
      this._haveKey = true;
      this._needKey = false;
      this._reset();
      return queueSize > OVERLOAD_QUEUE ? 'flush' : 'decode';
    }
    if (!this._haveKey || this._needKey) return 'no_key';
    const tracked = reference !== undefined && reference !== frameId;
    const now = this._now();
    while (this._lost.length && ((frameId - this._lost[0]) & 0xFFFF) >= LOST_HORIZON) this._lost.shift();
    if (tracked && this._lost.includes(reference)) {
      this._remember(frameId);
      if (now - this._lostSince > LOST_RECOVERY_MS) {
        this._needKey = true;
        return 'overload';
      }
      return 'lost';
    }
    if (queueSize > OVERLOAD_QUEUE) {
      if (!this._overloadSince) this._overloadSince = now;
      else if (now - this._overloadSince > OVERLOAD_HOLD_MS) {
        if (!tracked) {
          this._needKey = true;
          return 'overload';
        }
        this._remember(frameId);
        if (!this._lostSince) this._lostSince = now;
        return 'lost';
      }
      return 'decode';
    }
    this._overloadSince = 0;
    this._lostSince = 0;
    return 'decode';
  }

  _remember(frameId) {
    this._lost.push(frameId);
    if (this._lost.length > LOST_MEMORY) this._lost.shift();
  }
}
`,pi=`/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * The frame rate a decoder that cannot keep up asks the server for.
 *
 * A decoder slower than the stream keeps a backlog, which the decode gate
 * (lib/decode-gate.js) answers by letting frames go: each backlog frame is
 * latency on the screen, and each drop a repair on the wire. Asking the server
 * for fewer frames removes both. Once the decoder has stood behind for
 * ENGAGE_S seconds in a row, the pace is CAP_SHARE of the frames it turned out
 * over them, never under CAP_FLOOR, and falls again the same way while it
 * stays behind. After a wait of LIFT_S seconds keeping up the pace rises by
 * LIFT_STEP, and falling behind within REGRET_S of a rise takes the rise back
 * and doubles the wait before the next. A pace rising to CAP_CEILING asks for
 * nothing. A second without frames, a still screen's, counts neither way.
 * @module
 */

/** Mean frames of decode backlog over a second that count as behind. */
export const BEHIND_QUEUE = 4;
/** Seconds behind in a row before the pace falls. */
export const ENGAGE_S = 3;
/** Share of the frames the decoder turned out that the pace asks for. */
export const CAP_SHARE = 0.93;
/** The lowest pace, in frames per second. */
export const CAP_FLOOR = 10;
/** Seconds keeping up before the pace rises, doubled at each regret. */
export const LIFT_S = 20;
/** How far each rise goes. */
export const LIFT_STEP = 1.1;
/** How soon after a rise falling behind takes it back, in seconds. */
export const REGRET_S = 10;
/** A pace rising this high asks for nothing: no display the page follows runs faster. */
export const CAP_CEILING = 240;

export class DecodePace {
  constructor() {
    this.reset();
  }

  /** A new decoder or stream, or a rate the user chose: the pace asks for nothing. */
  reset() {
    /** @type {?number} The frames per second asked for, null for none. */
    this.cap = null;
    this._frames = 0;
    this._decisions = 0;
    this._backlog = 0;
    this._drops = 0;
    this._behind = 0;
    this._behindFrames = 0;
    this._keeping = 0;
    this._wait = LIFT_S;
    this._second = 0;
    this._raisedAt = -Infinity;
    this._beforeRise = null;
  }

  /**
   * A frame the gate decided on.
   * @param {number} backlog Frames the decoder had yet to decode then.
   * @param {boolean} dropped Whether the gate let it, or the backlog, go.
   */
  decided(backlog, dropped) {
    this._decisions++;
    this._backlog += backlog;
    if (dropped) this._drops++;
  }

  /** A frame the decoder turned out. */
  decoded() {
    this._frames++;
  }

  /**
   * Closes a second of the stream.
   * @returns {?number|undefined} The new pace where it changed (null: ask for
   *     nothing), undefined where it stayed.
   */
  second() {
    const now = ++this._second;
    const frames = this._frames;
    const decisions = this._decisions;
    const behind = this._drops > 0 || (decisions > 0 && this._backlog / decisions > BEHIND_QUEUE);
    this._frames = 0;
    this._decisions = 0;
    this._backlog = 0;
    this._drops = 0;
    if (!decisions) return undefined;
    const was = this.cap;
    if (behind) {
      this._keeping = 0;
      this._behindFrames += frames;
      if (++this._behind >= ENGAGE_S) {
        const pace = Math.max(CAP_FLOOR, Math.floor(CAP_SHARE * this._behindFrames / this._behind));
        this._behind = 0;
        this._behindFrames = 0;
        if (this._beforeRise !== null && now - this._raisedAt <= REGRET_S) {
          this.cap = this._beforeRise;
          this._wait *= 2;
        } else if (this.cap === null || pace < this.cap) {
          this.cap = pace;
        }
        this._beforeRise = null;
      }
    } else {
      this._behind = 0;
      this._behindFrames = 0;
      if (this.cap !== null && ++this._keeping >= this._wait) {
        this._keeping = 0;
        const raised = Math.ceil(this.cap * LIFT_STEP);
        this._beforeRise = this.cap;
        this._raisedAt = now;
        this.cap = raised >= CAP_CEILING ? null : raised;
      }
    }
    return this.cap !== was ? this.cap : undefined;
  }
}
`;function mi(e){let t=e||(()=>performance.now()),n=-1/0,r=-1,i=0,a=0,o=()=>i>a?i:a;return{note(e){let o=t();if(e===r){let e=o-n;e>a&&(a=e)}else i=Math.max(a,i*.9),a=0,r=e;n=o},settled:()=>t()-n>=2+o(),waveGapMs:o,settleWaitMs:()=>2+o()}}function hi(e){let t=e||(()=>performance.now()),n=-1/0;return()=>n=Math.max(Math.trunc(t()*1e3),n+1)}function gi(e){let t=e,n=null,r=()=>{try{let e=new OffscreenCanvas(2,4),t=e.getContext(`2d`);t.fillStyle=`#000`,t.fillRect(0,0,2,2),t.fillStyle=`#fff`,t.fillRect(0,2,2,2);let n=new VideoFrame(e,{timestamp:0}),r=new VideoFrame(n,{visibleRect:{x:0,y:0,width:2,height:2}});n.close();let i=new OffscreenCanvas(2,2).getContext(`2d`,{willReadFrequently:!0});return i.drawImage(r,0,0),r.close(),i.getImageData(0,1,1,1).data[0]<128}catch{return!0}};return(e,i,a)=>{let o=e.visibleRect;if(!o||o.width<i||o.height<a||o.width===i&&o.height===a)return e;try{t===void 0&&(t=r());let s;return t?s=new VideoFrame(e,{visibleRect:{x:o.x,y:o.y,width:i,height:a},displayWidth:i,displayHeight:a}):(n&&n.width===i&&n.height===a||(n=new OffscreenCanvas(i,a)),n.getContext(`2d`).drawImage(e,0,0,e.displayWidth,e.displayHeight),s=new VideoFrame(n,{timestamp:e.timestamp,...e.duration?{duration:e.duration}:{}})),e.close(),s}catch{return e}}}var _i=.93,vi=1.1,yi=class{constructor(){this.reset()}reset(){this.cap=null,this._frames=0,this._decisions=0,this._backlog=0,this._drops=0,this._behind=0,this._behindFrames=0,this._keeping=0,this._wait=20,this._second=0,this._raisedAt=-1/0,this._beforeRise=null}decided(e,t){this._decisions++,this._backlog+=e,t&&this._drops++}decoded(){this._frames++}second(){let e=++this._second,t=this._frames,n=this._decisions,r=this._drops>0||n>0&&this._backlog/n>4;if(this._frames=0,this._decisions=0,this._backlog=0,this._drops=0,!n)return;let i=this.cap;if(r){if(this._keeping=0,this._behindFrames+=t,++this._behind>=3){let t=Math.max(10,Math.floor(_i*this._behindFrames/this._behind));this._behind=0,this._behindFrames=0,this._beforeRise!==null&&e-this._raisedAt<=10?(this.cap=this._beforeRise,this._wait*=2):(this.cap===null||t<this.cap)&&(this.cap=t),this._beforeRise=null}}else if(this._behind=0,this._behindFrames=0,this.cap!==null&&++this._keeping>=this._wait){this._keeping=0;let t=Math.ceil(this.cap*vi);this._beforeRise=this.cap,this._raisedAt=e,this.cap=t>=240?null:t}return this.cap===i?void 0:this.cap}},bi=class{constructor({now:e=()=>performance.now()}={}){this._now=e,this._lost=[],this._lostSince=0,this._overloadSince=0,this._haveKey=!1,this._needKey=!1}configured(){this._haveKey=!1,this._needKey=!0,this._reset()}invalidated(){this._needKey=!0}_reset(){this._lost.length=0,this._lostSince=0,this._overloadSince=0}decide(e,t,n,r){if(e)return this._haveKey=!0,this._needKey=!1,this._reset(),r>6?`flush`:`decode`;if(!this._haveKey||this._needKey)return`no_key`;let i=n!==void 0&&n!==t,a=this._now();for(;this._lost.length&&(t-this._lost[0]&65535)>=32768;)this._lost.shift();if(i&&this._lost.includes(n))return this._remember(t),a-this._lostSince>1e3?(this._needKey=!0,`overload`):`lost`;if(r>6){if(!this._overloadSince)this._overloadSince=a;else if(a-this._overloadSince>250)return i?(this._remember(t),this._lostSince||=a,`lost`):(this._needKey=!0,`overload`);return`decode`}return this._overloadSince=0,this._lostSince=0,`decode`}_remember(e){this._lost.push(e),this._lost.length>64&&this._lost.shift()}};Ln(),Sn();var xi=null,Si=!1,Ci=Fn().then(e=>(xi=e,e)),wi=null,Ti=128;function Ei(e,t){let n=e-t>>>0;return n!==0&&n<2147483648}function Di(e){let t=new Uint8Array(e);if(e.byteLength<=2)return[];let n=t[1]&-129;if(!n)return wi=null,[e.slice(2)];if(e.byteLength<6+n*4+1)return wi=null,[];let r=(t[2]<<24|t[3]<<16|t[4]<<8|t[5])>>>0,i=6,a=[],o=[];for(let e=0;e<n;e++){let e=t[i+1]<<16|t[i+2]<<8|t[i+3];a.push(e>>10&16383),o.push(e&1023),i+=4}i+=1;let s=i;for(let e=0;e<n;e++)s+=o[e];if(s>e.byteLength)return wi=null,[];let c=[];for(let t=0;t<n;t++)c.push({ts:r-a[t]>>>0,buf:e.slice(i,i+o[t])}),i+=o[t];if(c.push({ts:r,buf:e.slice(i)}),wi===null)return wi=r,[c[c.length-1].buf];let l=[],u=wi;for(let e of c)Ei(e.ts,u)&&(l.push(e.buf),u=e.ts);return wi=u,l}function Oi(){let e=!1,t=null,s=null,c=null,l=null,u,d=null,f=null,p=null,m=!1,h,g,_,v=1,y;window.currentAudioBufferSize=0,window.currentAudioUnderrunSamples=0,window.currentAudioWorkletDropped=0,window.currentAudioDropped=0;let x=null,S=null,se=null,ce=!1,le=null,de=0,me=!1,he=!1,ge=0,ve=!1,be=!0,xe=[],Se=0,C=!0,T=!0,E=!1,Me=!1,Pe,Fe=-1,k=0,Le=-1,Re=0,ze=0,Be=0,Ve=0,He=4e3,Ue=0,We=!1,Ge=!0,A=new Set,Ke=!1,qe=null,Je=!1,Ye=!0,Xe=!0,j=null,Ze=!1,Qe=!1;Object.defineProperty(window,"webcamCodec",{configurable:!0,get:()=>j?j.codec:null});let $e=`auto`,M=`primary`,et=`right`,tt=[`use_paint_over_quality`,`cpu_encode_threading`],nt=new Set,rt=[`framerate`,`video_crf`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`jpeg_quality`,`paint_over_jpeg_quality`,`use_cpu`,`cpu_encode_threading`,`video_paintover_crf`,`video_paintover_burst_frames`,`use_paint_over_quality`,`manual_resolution`,`manual_width`,`manual_height`,`encoder`,`scaleLocallyManual`,`use_browser_cursors`,`rate_control_mode`,`video_bitrate`,`force_aligned_resolution`,`scaling_dpi`],it=null,at=null,N=null,ot=null,st=null,ct=null,lt=32e3,ut=``,P=null,dt=null,ft=null,pt=null,mt=null,ht=!1,gt=0,_t=0,vt=0,yt=null,bt=null,xt=!1,St=!1,Ct=null,wt=null,Tt=[],Et=0,F=2e3,I=null,Dt=0,Ot=3e3,kt=null,At=!1,L=0,R=0,jt=0,Mt=3e3,Nt=e=>`data:text/javascript;charset=utf-8,${encodeURIComponent(e)}`,Pt=1e3;window.manual_resolution=!1;let z=null,B=null,It=null,V=null,Lt={},zt={},Bt=null,H=`h264enc-striped`,Gt=e=>e!==`jpeg`&&e!==`h264enc-striped`,qt=e=>e!==`jpeg`,U=!1,W=!1,Jt=!1;function Yt(){return Rt({useCssScaling:U,localScale:an/96,manual:window.manual_resolution,displayId:M,layouts:t,shared:G,wayland:W})}let Xt=0,Qt=0,$t=null;function en(){let e=Yt();window.webrtcInput&&window.webrtcInput.setStreamDensity&&window.webrtcInput.setStreamDensity(e);let t=Xt>0&&Math.abs(e-Xt)>1e-6;Xt=e,t&&M!==`primary`&&!window.manual_resolution&&V&&(console.log(`Stream density changed: ${e}.`),V())}let tn=!1,an=96;function on(){return window.manual_resolution?Ht(z,B):Vt()}function cn(){return U&&!window.manual_resolution?96:an}function un(e){if(G||ua(`scaling_dpi`,null)!==null)return!1;let t=on();return t!==an&&(an=t,console.log(`DPI follows ${e}: scaling_dpi -> ${t}.`),window.postMessage({type:`scalingDpiFollowed`,value:t},window.location.origin),!0)}let pn=window.devicePixelRatio||1;function hn(){let e=window.devicePixelRatio||1;e!==pn&&(pn=e,un(`devicePixelRatio changed`)&&Qo(`devicePixelRatio changed`))}let gn=!0,_n=!0,bn=!0,Sn=!0,Cn=!0;function Tn(){let t=Cn,n=M===`display2`||M===`primary`&&e,r=n?!0:t;window.webrtcInput&&typeof window.webrtcInput.setUseBrowserCursors==`function`&&(console.log(`Applying effective cursor setting. Multi-monitor: ${n}, User Pref: ${t}, Final: ${r}`),window.webrtcInput.setUseBrowserCursors(r));try{window.postMessage({type:`effectiveCursorState`,value:r},window.location.origin)}catch{}}let En=!0;function Dn(){window.webrtcInput&&typeof window.webrtcInput.setRawPointerMotion==`function`&&window.webrtcInput.setRawPointerMotion(En)}let kn=1;function An(){window.webrtcInput&&typeof window.webrtcInput.setTrackpadSpeed==`function`&&window.webrtcInput.setTrackpadSpeed(kn)}let Mn=!0;function Nn(){window.webrtcInput&&typeof window.webrtcInput.setGamepadRumble==`function`&&window.webrtcInput.setGamepadRumble(Mn)}let Pn=!0;function Fn(){window.webrtcInput&&typeof window.webrtcInput.setMacCmdAsCtrl==`function`&&window.webrtcInput.setMacCmdAsCtrl(Pn)}let In=!0;function Ln(){window.webrtcInput&&typeof window.webrtcInput.setShortcutsEnabled==`function`&&window.webrtcInput.setShortcutsEnabled(In)}function zn(){let e=window.innerHeight*.01;document.documentElement.style.setProperty(`--vh`,`${e}px`)}let Hn=0,Un=new On,Wn=e=>Un.reencodePng(e).then(e=>e.result),Gn=!0,Kn=(()=>{let e=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform===`MacIntel`&&navigator.maxTouchPoints>1,t=/Firefox|FxiOS/.test(navigator.userAgent),n=/CriOS/.test(navigator.userAgent),r=(navigator.userAgentData&&navigator.userAgentData.brands||[]).some(e=>/Chromium|Google Chrome/.test(e.brand)),i=window.chrome!==void 0;return(r||i)&&!e&&!t&&!n})(),qn=dn({isChromium:Kn,canRead:()=>!!_n,sendRequest:()=>{u&&u.readyState===WebSocket.OPEN&&u.send(`REQUEST_CLIPBOARD`)},digestBytes:async e=>{let{byteLength:t,hash:n}=await Un.hashBytes(e);return Wt(t,n)}}),Jn=rn(),Yn=sn({worker:Un,clipboardSync:qn,writer:Jn,toPng:Wn,canWriteLocal:()=>bn&&Sn,binaryEnabled:()=>Gn,isChromium:Kn,onPreview:(e,t)=>window.postMessage(ln(e,t),window.location.origin),onImageWritten:e=>(console.log(`Successfully wrote image (${e}) from server to local clipboard.`),window.postMessage({type:`clipboardContentUpdate`,text:`Image (${e}) received from session and copied to clipboard.`},window.location.origin),qn.captureLocalImageSig()),onImageWriteFailed:e=>_c(e)}),Xn=Zt(),Zn=()=>Xn.arm(),er=()=>Xn.consume(),nr=null;function ar(e,t,n){return nr?nr.sendExplicit(e,t,n):(n&&n(`not connected`,`clipboardSkipNotConnected`),Promise.resolve())}let or=null,sr=0,lr=new URLSearchParams(window.location.search),ur=vn(),dr=mn();if(dr.startsWith(`#display2`)){M=`display2`;let e=dr.split(`-`);if(e.length>1){let t=e[1];[`left`,`right`,`up`,`down`].includes(t)&&(et=t)}}ur?(m=!0,console.log(`Client is running in Token Authentication mode.`)):dr===`#shared`?(or=`shared`,sr=void 0):dr===`#player2`?(or=`player2`,sr=1):dr===`#player3`?(or=`player3`,sr=2):dr===`#player4`&&(or=`player4`,sr=3);let fr=`idle`,pr=!1,G=or!==null,mr=!0;G&&console.log(`Client is running in ${or} mode.`),M===`display2`&&console.log(`Client is running in Secondary Display mode.`),window.onload=()=>{};let hr=Oe(),gr=(e,t)=>{try{window.localStorage.setItem(e,t)}catch(t){console.warn(`Selkies: could not persist '${e}' to localStorage:`,t)}},_r=`${hr}_prefer_software_decode`,vr=e=>`${new Date().toISOString()} ${e}`,yr=e=>{let t=/^(\S+) (.+)$/s.exec(e||``);return t?`since ${t[1]}: ${t[2]}`:`since an earlier load`},Cr=!1;try{Cr=window.sessionStorage.getItem(_r)!==null}catch(e){console.warn(`Selkies: could not read the software-decode preference:`,e)}let wr=Cr,Tr=-1/0,Er=3e3,Dr=Cr?0:-1/0,Or=!1,jr=e=>{let t=!!(e&&e.full_range);if(t!==Or&&(Or=t,$))try{$.postMessage({type:`wireHints`,fullRange:t})}catch{}},Ir=(e,t=``)=>{if($)try{$.postMessage({type:`wireHints`,software:e})}catch{}Cr=e;try{e?window.sessionStorage.setItem(_r,vr(t)):window.sessionStorage.removeItem(_r)}catch(e){console.warn(`Selkies: could not store the software-decode preference:`,e)}},Lr=e=>Cr?{...e,hardwareAcceleration:`prefer-software`}:e;async function Rr(e){if((await VideoDecoder.isConfigSupported(e)).supported)return e;if(e.hardwareAcceleration!==`prefer-software`)return null;let t={...e};return delete t.hardwareAcceleration,(await VideoDecoder.isConfigSupported(t)).supported?(Cr&&(console.warn(`[decode] This browser has no software decoder for ${e.codec}; leaving the choice of decoder to it.`),Ir(!1)),t):null}let zr=`${hr}_crash_count`,Br=!1,Vr=()=>{if(!(Br||G)&&!(!(window.fps>0)||!qt(H)||performance.now()<6e4)){Br=!0;try{window.localStorage.removeItem(zr)}catch(e){console.warn(`Selkies: could not clear the decoder crash count:`,e)}}};function Hr(){let e=wr&&performance.now()-Tr<Er;if(document.hidden||G||window.isFallingBack||e||Io||!C||H===`jpeg`||typeof VideoDecoder>`u`){Ve=0;return}let t=performance.now();if(t-Ue<1e4&&Object.values(Lt).some(e=>e&&e.decoder.state===`unconfigured`)){Ve=0;return}let n=t-Be<He,r=Be-ze>He;!n||!r?Ve=0:Ve===0?Ve=t:t-Ve>=He&&(Ve=0,Xc(Error(`decoder produced no output while chunks arrived`),`no_output`))}let Ur=60,Wr=null,Gr=null,Kr=null,qr=null,Jr=new yi,Zr=new bi;function $r(){u&&u.readyState===WebSocket.OPEN&&u.send(`DECODE_PACE ${qr||0}`)}function ti(e){qr=e,console.info(e===null?`[decode] the decoder keeps up; the frame rate is the chosen one again.`:`[decode] the decoder keeps up with ${e} fps; asking for that.`),$r()}setInterval(()=>{if(za||!Gt(H))return;let e=Jr.second();e!==void 0&&ti(e)},1e3);let ai=25,K=!1,oi=!1,si=!1,ci=60,li=90,ui=!1,_i=!0,vi=18,wi=5,Ei=!0,Oi=32e4,ki=8e3,Ai=!1,ji=`connecting`,Mi=``,Ni={format:void 0,hardware:null},q={starts:new Map,arrivals:new Map,decodeMs:0,frames:0,format:void 0,hardware:null,probed:``,config:null},Pi=new kr,Fi={keyframes:0,lost:0,keyframesAtOpen:0,lostAtOpen:0},Ii=Nr(e=>requestAnimationFrame(e)),Li=null,Ri=0,zi=0;function Bi(e){let t=q.arrivals.get(e);return q.arrivals.delete(e),t>0?t:NaN}let Vi=e=>performance.timeOrigin+e.presentationTime-Bi(Math.round(e.mediaTime*1e6));function Hi(e){let t=q.starts.get(e.timestamp);t!==void 0&&(q.starts.delete(e.timestamp),q.decodeMs+=performance.now()-t,q.frames++)}function Ui(e){let t=`${e.codec}:${e.codedWidth}x${e.codedHeight}`;t!==q.probed&&(q.probed=t,VideoDecoder.isConfigSupported({...e,hardwareAcceleration:`prefer-hardware`}).then(e=>{q.probed===t&&(q.hardware=!!e.supported,Gi())}).catch(()=>{}))}let Wi=null,J=new Mr({transport:`websockets`,send:e=>{if(u&&u.readyState===WebSocket.OPEN)u.send(e);else throw Error(`not connected`)},isViewer:()=>G||f===`viewer`,onOpenChange:e=>{if(q.starts.clear(),q.arrivals.clear(),q.decodeMs=0,q.frames=0,Fi.keyframesAtOpen=Fi.keyframes,Fi.lostAtOpen=Fi.lost,$)try{$.postMessage({type:`statsOpen`,open:e})}catch{}if(u&&typeof u.setStats==`function`&&u.setStats(e),Ii.reset(),zi=0,Li&&Li.stop(),Li=null,clearTimeout(Wi),Wi=null,!e)return;Ri=performance.now(),x&&(Li=Pr(x,Ii,Vi)),Gi();let t=e=>{Wi=setTimeout(()=>{Ki(),t(1e3)},e)};t(500)}});function Gi(){let e=Ga?Ni:q,t=H===`jpeg`,n=i(H),r=K&&b[n]||ae[n];r&&c&&c.width>0&&Pi.ask({type:`file`,video:{contentType:`video/${n===`vp8`?`webm`:`mp4`}; codecs="${r}"`,width:c.width,height:c.height,bitrate:ki*1e3,framerate:Ur||60}},`${r}:${c.width}x${c.height}`),J.setClient(Object.assign({codec:i(H)||H,resolution:c&&c.width>0?`${c.width}x${c.height}`:``,sink:ut.split(/ \u2014 |; /)[0].replace(/\.$/,``),decode_path:t?po():``},Ar({forcedSoftware:Cr&&!t,hardwareSupported:t?null:e.hardware,format:t?void 0:e.format,capable:t?null:Pi.efficient})))}function Ki(){if($&&Na)try{$.postMessage({type:`decodeStats`});return}catch{}qi(null)}function qi(e){let t=e&&(e.frames>0||e.bytes>0)?e:{...q};q.decodeMs=0,q.frames=0,q.starts.size>64&&q.starts.clear(),q.arrivals.size>256&&q.arrivals.clear(),t.bytes&&J.noteBytes(t.bytes),Gi();let n=performance.now(),r=(n-Ri)/1e3;Ri=n;let i=[Ii.take(),e&&e.shown].filter(Boolean),a=e=>i.reduce((t,n)=>t+n[e],0),o=Li?Li.read():{shown:0,dropped:0};zi+=a(`superseded`)+a(`refused`)+o.dropped;let s={fps:Li&&!Li.reported()&&(ce||Pa===`vtg`)||!(r>0)?window.fps:Math.round((a(`presented`)+o.shown)/r*10)/10,lost_frames:Fi.lost-Fi.lostAtOpen,frames_not_shown:zi,keyframe_requests:Fi.keyframes-Fi.keyframesAtOpen};a(`delays`)>0&&(s.present_ms=Math.round(a(`delaySum`)/a(`delays`)*100)/100),T&&(s.audio_buffer_ms=Math.round(window.currentAudioBufferDuration||0)),E&&(s.mic=`Opus, 32 kbps`),Me&&j&&(s.webcam=`${String(j.codec||``).toUpperCase()} ${j.width}x${j.height} at ${j.fps} fps`),t.frames>0&&(s.decode_ms=Math.round(t.decodeMs/t.frames*100)/100),J.clientSample(s)}let Ji=!1,Yi=!1,Xi=null,Zi=!1,Qi;window.fps=0,window.videoChunksReceived=0,window.videoDivertOn=!1,window.videoStripeRows={};let $i=0,ea=new Set,ta=performance.now(),na=performance.now(),Y,ra,X,ia=`cbr`,aa=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`);let i=window.localStorage.getItem(r);return i==null?t:parseInt(i)},oa=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`);let i=window.localStorage.getItem(r),a=parseFloat(i);return i==null||isNaN(a)?t:a},sa=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`),t==null?window.localStorage.removeItem(r):gr(r,t.toString())},ca=e=>{let t=`${hr}_${e}`;return M===`display2`&&rt.includes(e)?`${t}_${M}`:t},Z=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`);let i=window.localStorage.getItem(r);return i===null?t:i.toString().toLowerCase()===`true`},la=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`),t==null?window.localStorage.removeItem(r):gr(r,t.toString())},ua=(e,t)=>{let n=`${hr}_${e}`,r=n;return M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`),window.localStorage.getItem(r)??t},da=(e,t)=>{let n=`${hr}_${e}`,r=n;M===`display2`&&rt.includes(e)&&(r=`${n}_${M}`),t==null?window.localStorage.removeItem(r):gr(r,t.toString())},fa=ei(ca,hr),pa=fa.encoderPick,ma=fa.fallbackTab;function ha(){try{return window.localStorage.getItem(pa)!==null}catch{return!1}}function ga(e,t){try{window.localStorage.getItem(pa)===null&&gr(pa,ua(`encoder`,``)),window.sessionStorage.setItem(ma,vr(t))}catch{}da(`encoder`,e)}function _a(e){da(`encoder`,e);try{window.localStorage.removeItem(pa),window.sessionStorage.removeItem(ma)}catch{}}function va(e){try{for(let[e,t]of Object.entries(Qr)){let n=ca(e);window.localStorage.getItem(`${n}_pick`)===null&&gr(`${n}_pick`,window.localStorage.getItem(n)??``),t===null?window.localStorage.removeItem(n):gr(n,t)}window.sessionStorage.setItem(ma,vr(e))}catch{}}ni(ca,hr);try{let e=window.sessionStorage.getItem(ma),t=window.localStorage.getItem(pa),n=[t===null?``:`the ${ua(`encoder`,``)} encoder (in place of ${t||`the server's`})`,/decoder crash/.test(e||``)?`on a decoder crash's safe settings`:``].filter(Boolean).join(` `);e!==null&&n&&console.warn(`[fallback] This tab streams ${n} ${yr(e)}. A new tab or visit puts the picks back.`);let r=window.sessionStorage.getItem(fa.displayTab);r!==null&&console.warn(`[display] This tab streams with what its display does ${yr(r)}. A new tab or visit puts the picks back.`);let i=window.sessionStorage.getItem(_r);i!==null&&console.warn(`[fallback] This tab decodes video in software ${yr(i)}.`);let a=Number(window.localStorage.getItem(zr))||0;a>0&&console.warn(`[fallback] Decoder crashes in this browser since its last healthy session: ${a}; from the third on, a crash takes the jpeg encoder.`)}catch{}function ya(e){let t=ca(`useCssScaling`),n=window.localStorage.getItem(`${t}_explicit_choice`)===`true`,r=Bn(Vn,e,{manualActive:!!window.manual_resolution||z>0},()=>n?window.localStorage.getItem(t):null);return Vn.toServer(r)}function ba(e){return Bn(Qn,e,{macDesktop:ke()},e=>ua(e,null))}function xa(e){return Bn($n,e,{macDesktop:ke()},e=>ua(e,null))}function Sa(e){console.log(`Sanitizing and storing settings based on server payload.`);let t={},n=e=>{let t=`${hr}_${e}`;return M===`display2`&&rt.includes(e)?`${t}_${M}`:t};for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=e[r],a=tr(r),o=n(a),s=window.localStorage.getItem(o)===null;if(i.min!==void 0&&i.max!==void 0){let e=oa(a,i.default);s?window[r]=e:e<i.min||e>i.max?(console.log(`Sanitizing '${r}': stored value ${e} out of range [${i.min}-${i.max}]. Reverting to server default ${i.default}.`),window.localStorage.removeItem(o),window[r]=i.default,t[r]=i.default):window[r]=e}else if(i.allowed!==void 0){let e=!isNaN(parseFloat(i.allowed[0])),n=e?aa(a,parseInt(i.value,10)).toString():ua(a,i.value),c=t=>{window[r]=e?parseInt(t,10):t};s?c(i.value):i.allowed.includes(n)?(c(n),e?sa(a,parseInt(n,10)):da(a,n)):(console.log(`Sanitizing '${r}': stored "${n}" not in allowed [${i.allowed.join(`, `)}]. Reverting to server default "${i.value}".`),window.localStorage.removeItem(o),c(i.value),t[r]=i.value)}else if(typeof i.value==`boolean`){let e=i.value;if(i.locked){let n=Z(a,!e);n!==e&&(console.log(`Sanitizing '${r}': setting is locked by server. Client value ${n} is being overwritten with ${e}.`),t[r]=e),window[r]=e}else if(s)window[r]=e,i.overridden&&(t[r]=e);else{let t=Z(a,e);window[r]=t,la(a,t)}}else i.value!==void 0&&(window[r]=i.value)}return t}Ur=oa(`framerate`,Ur),ai=aa(`video_crf`,ai),K=Z(`video_fullcolor`,K),oi=Z(`video_10bit`,oi),si=Z(`video_streaming_mode`,si),ci=aa(`jpeg_quality`,ci),li=aa(`paint_over_jpeg_quality`,li),ui=Z(`use_cpu`,ui),_i=Z(`cpu_encode_threading`,_i),vi=aa(`video_paintover_crf`,vi),wi=aa(`video_paintover_burst_frames`,wi),Ei=Z(`use_paint_over_quality`,Ei),Oi=aa(`audio_bitrate`,Oi),Ji=Z(`debug`,Ji),H=ua(`encoder`,`h264enc`),$e=ua(`webcam_encoder`,`auto`),Qi=Z(`scaleLocallyManual`,!0),window.manual_resolution=Z(`manual_resolution`,!1),Pe=Z(`isGamepadEnabled`,!0),U=Z(`useCssScaling`,!1),tn=Z(`trackpadMode`,!1),ia=ua(`rate_control_mode`,ia),ki=aa(`video_bitrate`,ki),gn=Z(`antiAliasingEnabled`,!0),Cn=Z(`use_browser_cursors`,!0),En=Z(`raw_pointer_motion`,Ft.rawPointerMotion),kn=oa(`trackpad_speed`,1),Mn=Z(`gamepad_rumble`,!0),Gn=Z(`enable_binary_clipboard`,Gn),_n=Z(`clipboard_in_enabled`,!0),Sn=Z(`clipboard_seamless`,!0),In=Z(`keyboard_shortcuts`,!0),bn=Z(`clipboard_out_enabled`,!0);let Ca=Sr({automatic:Z(`print_auto`,!0)});Ai=Z(`force_aligned_resolution`,Ai),G?(z=1280,B=720,console.log(`Shared mode: Initialized manual_width/Height to ${z}x${B}`)):(z=aa(`manual_width`,null),B=aa(`manual_height`,null)),an=ua(`scaling_dpi`,null)===null?on():aa(`scaling_dpi`,96);let wa=!1,Ta=e=>{wa=!!e;let t=window.webrtcInput;t&&e&&typeof t.enterGamingMode==`function`?t.enterGamingMode():t&&typeof t.enterFullscreen==`function`?t.enterFullscreen():document.fullscreenElement===null&&document.documentElement.requestFullscreen(e?{keyboardLock:`browser`}:void 0).catch(()=>{})},Ea=()=>{ra&&ra.classList.add(`hidden`),Y&&Y.classList.add(`hidden`),Zs(),console.log(`playStream called in WebSocket mode - UI elements hidden.`)},Da=()=>{if(Y){let e=Mi||ji;Y.textContent=e&&e.charAt(0).toUpperCase()+e.slice(1)}};window.applyTimestamp=e=>{let t=new Date;return`[${`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`}] ${e}`};let Q=e=>{let t=Ai?16:2;return Math.floor(e/t)*t},Oa=typeof MediaStreamTrackGenerator<`u`,ka=!1,$=null,Aa=null,ja=!0,Ma=!1,Na=!1,Pa=null,Fa=null,Ia=!1,La=null,Ra=0,za=!1,Ba=null,Va=0,Ha=0,Ua=null,Wa=!1,Ga=!1,Ka=!1,qa=0,Ja=!1,Ya=!1,Xa=0,Za=!1,Qa=0;function $a(){if(!(Pa===`canvas`&&he&&Aa&&c&&c.width>=640&&Aa.width<640)){Qa=0;return}let e=performance.now();Qa?e-Qa>1500&&(Za=!0,console.info(`[Selkies] worker canvas placeholder never took a committed frame; presenting on the page canvas instead.`),go()):Qa=e}let eo=`
${fi.replace(/^export /gm,``)}
${pi.replace(/^export /gm,``)}
// Video sink and optional in-worker decoder. The sink is a worker-only
// VideoTrackGenerator (its track transferred to the page for <video>.srcObject) or a
// transferred OffscreenCanvas. Encoded chunks are decoded here so no decoded frame
// crosses the thread boundary; a frame transferred in (m.frame) is the warm-up path.
let mode = null, oc = null, ctx = null, writer = null, closed = false, presented = false;
let dec = null, decConfig = null;
const gate = new DecodeGate();
// The frame rate the page asks the server for while the decoder cannot keep up (lib/decode-pace.js).
const pace = new DecodePace();
function resetPace() {
  const was = pace.cap;
  pace.reset();
  if (was !== null) self.postMessage({ type: 'decodePace', fps: null });
}
// Decode figures, gathered only while the page has its stats open and posted as it samples.
let statsOpen = false, statsBytes = 0, statsDecodeMs = 0, statsFrames = 0;
// What reaches the screen from here (lib/present-meter.js): a canvas draw lands
// at this thread's next animation frame, and the arrival the socket's thread
// dated a frame with is kept by its decode timestamp until then. WebKit's Linux
// ports commit a worker canvas by a task queued behind the draw and run a busy
// worker's animation frames only once its queue drains, which would fold draws
// it committed one by one into one; there a draw lands at the next task.
const createPresentMeter = ${Nr.toString()};
const isSkiaWebKit = ${O.toString()};
const shown = createPresentMeter(typeof requestAnimationFrame !== 'function' ? null
  : isSkiaWebKit(navigator.userAgent, navigator.platform) ? (land) => setTimeout(land, 0)
  : (land) => requestAnimationFrame(land));
const arrivedAt = new Map();
let compositeArrival = -Infinity;
const arrivalOf = (timestamp) => {
  const at = arrivedAt.get(timestamp);
  arrivedAt.delete(timestamp);
  return at > 0 ? at : NaN;
};
// What the decoder turns out, told to the page whenever it changes (tellFacts).
let statsFormat, statsHardware = null, statsProbed = null, toldFormat, toldHardware = null;
const decodeStarts = new Map();
function noteDecoded(f) {
  const started = decodeStarts.get(f.timestamp);
  if (started === undefined) return;
  decodeStarts.delete(f.timestamp);
  statsDecodeMs += performance.now() - started;
  statsFrames++;
}
// Whether the engine has a hardware decoder for the configured stream, asked once per configuration.
function probeHardware(codec, w, h) {
  const probed = codec + ':' + w + 'x' + h;
  if (probed === statsProbed || typeof VideoDecoder === 'undefined') return;
  statsProbed = probed;
  VideoDecoder.isConfigSupported({ codec: codec, codedWidth: w, codedHeight: h, hardwareAcceleration: 'prefer-hardware' })
    .then((r) => { if (statsProbed === probed) { statsHardware = !!r.supported; tellFacts(); } })
    .catch(() => {});
}
// Tells the page, once per change, the pixel format of the decoder's frames and
// whether the engine has a hardware decoder for its configuration.
function tellFacts() {
  if (statsFormat === toldFormat && statsHardware === toldHardware) return;
  toldFormat = statsFormat; toldHardware = statsHardware;
  self.postMessage({ type: 'decodeFacts', format: statsFormat, hardware: statsHardware });
}
function setStatsOpen(open) {
  statsOpen = open;
  decodeStarts.clear();
  statsBytes = 0; statsDecodeMs = 0; statsFrames = 0;
  shown.reset(); arrivedAt.clear(); compositeArrival = -Infinity;
}
// The figures since the page's last sample, posted when it takes the next.
function postDecodeStats() {
  self.postMessage({ type: 'decodeStats', bytes: statsBytes, decodeMs: statsDecodeMs, frames: statsFrames, shown: shown.take() });
  statsBytes = 0; statsDecodeMs = 0; statsFrames = 0;
  if (decodeStarts.size > 64) decodeStarts.clear();
  if (arrivedAt.size > 64) arrivedAt.clear();
}
// Consecutive backpressure drops; a stalled consumer never resumes on its own.
let sinkDrops = 0;
// Keyframe-request throttle while decode is backed up.
let lastNeedKey = 0;
const sendNeedKey = (reason) => {
  const now = Date.now();
  if (now - lastNeedKey < 800) return;
  lastNeedKey = now;
  self.postMessage({ type: 'needKeyframe', reason });
};
const ack = () => self.postMessage({ ack: true });
// The decoded frame waiting for the canvas and when it arrived, and when the
// canvas last finished a draw and how long that draw took.
let waiting = null, waitingAt = NaN, drawQueued = false, drawnAt = -Infinity, drawCost = 0;

// Present one decoded VideoFrame on the active sink, which consumes it; at is
// when it arrived, NaN where unknown. While this thread keeps up with the
// canvas, that is, has been free of drawing for as long as its last draw took,
// a frame is drawn at once, since a timer would only add its own delay.
// Otherwise the canvas takes only the newest frame, drawn by a zero-delay
// timer once the work queued ahead of it has run (WebKit fires a worker's
// timers only while no message waits): a drawImage of a VideoFrame costs
// WebKit 5 to 25 ms and at times over 100, so drawing every frame saturates
// this thread, whose timers then starve while the decode queue grows until
// the gate drops frames. A frame replaced before its draw is closed and
// counted as not shown.
function present(f, at) {
  presentedFrames++;
  if (statsOpen) noteDecoded(f);
  if (mode === 'vtg' && writer && !closed) {
    // Drop on sink backpressure.
    if (writer.desiredSize !== null && writer.desiredSize <= 0) {
      f.close();
      if (statsOpen) shown.refused();
      if (++sinkDrops >= 30) { closed = true; self.postMessage({ type: 'error' }); }
      return;
    }
    sinkDrops = 0;
    // write() consumes/closes f on success; on reject (writable errored) it does NOT, so close it here to avoid leaking the frame.
    writer.write(f).catch(() => { try { f.close(); } catch (_) {} closed = true; self.postMessage({ type: 'error' }); });
    return;
  }
  if (!ctx) { f.close(); return; }
  dropWaiting();
  waiting = f;
  waitingAt = at;
  if (drawQueued) return;
  if (performance.now() - drawnAt >= drawCost) { drawWaiting(); return; }
  drawQueued = true;
  setTimeout(drawWaiting, 0);
}

// Closes the frame waiting for the canvas, replaced by a newer one or left
// behind by the decoder that made it.
function dropWaiting() {
  if (!waiting) return;
  waiting.close();
  waiting = null;
  if (statsOpen) shown.superseded(1);
}

function drawWaiting() {
  drawQueued = false;
  const f = waiting, at = waitingAt;
  if (!f) return;
  waiting = null;
  try {
    if (oc.width !== f.displayWidth || oc.height !== f.displayHeight) { oc.width = f.displayWidth; oc.height = f.displayHeight; }
    const start = performance.now();
    ctx.drawImage(f, 0, 0);
    drawnAt = performance.now();
    drawCost = drawnAt - start;
    if (statsOpen) shown.drawn(at);
    // Tell the page the OffscreenCanvas has real content so it can hide the
    // main canvas (hiding it before this point flashes black).
    if (!presented) { presented = true; self.postMessage({ type: 'presented' }); }
  } finally { f.close(); }
}

function closeDecoder() {
  dropWaiting();
  if (dec) { try { if (dec.state !== 'closed') dec.close(); } catch (_) {} dec = null; }
  gate.configured();
  wireCodec = null; wireW = 0; wireH = 0; wireDesc = null;
}

function configureDecoder(codec, w, h, software, description) {
  // Another picture size costs the decoder another rate; a new codec string
  // alone, such as the level a lower rate declares, does not.
  if (decConfig && (decConfig.codedWidth !== w || decConfig.codedHeight !== h)) resetPace();
  closeDecoder();
  try {
    dec = new VideoDecoder({ output: (f) => {
                               pace.decoded(); statsFormat = f.format; tellFacts();
                               const at = statsOpen ? arrivalOf(f.timestamp) : NaN;
                               present(decConfig ? fitFrameToStream(f, decConfig.codedWidth, decConfig.codedHeight) : f, at);
                             },
                             error: () => { closeDecoder(); self.postMessage({ type: 'decoderError' }); } });
    // configure() is synchronous, so the next chunk decodes without an async gap and
    // an unsupported config surfaces via error(). The page owns the acceleration
    // preference; unset, the UA default takes a hardware decoder where there is one,
    // and the pinned SPS level keeps it from re-initializing mid-stream.
    const cfg = { codec: codec, codedWidth: w, codedHeight: h, optimizeForLatency: true };
    if (software) cfg.hardwareAcceleration = 'prefer-software';
    if (description) cfg.description = description;
    cfg.colorSpace = decoderColorSpace(codec, wireFullRange);
    dec.configure(cfg);
    decConfig = cfg;
    probeHardware(codec, w, h);
    // A keyframe is required after (re)configure.
    gate.configured();
    return true;
  } catch (err) { closeDecoder(); self.postMessage({ type: 'decoderError' }); return false; }
}

// frameId and reference come off the wire header; a frame that names itself
// predicts from nothing the encoder can say (DecodeGate).
function decodeChunk(key, data, timestamp, frameId, reference, at) {
  if (!dec || dec.state !== 'configured') return;
  const decision = gate.decide(key, frameId, reference, dec.decodeQueueSize);
  pace.decided(dec.decodeQueueSize, decision !== 'decode');
  if (decision === 'lost') { self.postMessage({ type: 'lostFrame', id: frameId }); return; }
  if (decision === 'flush') {
    try { dec.reset(); dec.configure(decConfig); }
    catch (err) { closeDecoder(); self.postMessage({ type: 'decoderError' }); return; }
  } else if (decision !== 'decode') { sendNeedKey(decision); return; }
  if (statsOpen) {
    decodeStarts.set(timestamp, performance.now());
    if (at > 0) arrivedAt.set(Math.trunc(timestamp), at);
  }
  try { dec.decode(new EncodedVideoChunk({ type: key ? 'key' : 'delta', timestamp: timestamp, data: data })); }
  catch (err) { closeDecoder(); self.postMessage({ type: 'decoderError' }); }
}

// Raw stripes routed straight from the socket worker, so decode and
// presentation never touch the page. The header is parsed here and the codec
// is derived from each keyframe's SPS; hints carry the page's fallback guess
// and acceleration preference. Wire stats go up once a second for the page's
// counters, watchdogs, and fps, with the row layout this side is decoding.
let wireCodec = null, wireW = 0, wireH = 0, wireHint = null, wireSoftware = false, wireChromium = false;
// The range the session converted at, and the one each decoder was configured
// with: a decoder outlives the report that names the range, so a change has to
// reach it as a reconfigure rather than only the next configure.
let wireFullRange = false, wireRange = false;
// H.264 as this engine takes it: Annex B as sent, or length-prefixed NAL units
// behind the key frame's avcC description where Annex B is refused.
let wireAvcc = false, wireDesc = null;
const avcFramed = (codec) => wireAvcc && typeof codec === 'string' && codec.startsWith('avc1');
// The codec the page's encoder streams; frames of another are the stream it
// just left, still in flight, and must not build (and lose) a decoder here.
let wireExpect = null;
let wireChunks = 0, wireFrames = 0, wireLastId = -1, wireStatsTimer = null, wireGen = 0;
// The codec helpers by source: a bundler renames the module bindings they
// share, which a stringified function would carry in here unresolved.
${di.replace(/^export /gm,``)}

// The striped modes (h264enc-striped, jpeg) decode, composite, and present in
// here: a VideoDecoder per row offset or an in-worker JPEG decode, drawn onto
// a persistent back-buffer so undamaged rows survive, presented by the page's
// rule -- last row landed, or the socket and decoders proven quiet (the
// stripe clock), else at the frame-id boundary -- with the presented id going
// back over the wire port so the server paces against what reached the screen.
const createStripeClock = ${mi.toString()};
const createChunkStamp = ${hi.toString()};
const createFrameFit = ${gi.toString()};
const fitFrameToStream = createFrameFit();
const chunkStamp = createChunkStamp();
const STRIPE_DECODE_QUEUE_LIMIT = 8;
const JPEG_STRIPE_REORDER_WINDOW = 256;
let stripedOn = false, wirePort = null;
let stripeDecs = {}, jpegLastRowId = {}, jpegRowHeights = {}, jpegPending = 0;
let stripeBack = null, stripeBackCtx = null;
let stripeGeomW = 0, stripeGeomH = 0, stripeGeomKnown = false;
let stripePendingId = null, stripeDirty = false, stripeBottom = false;
let stripeSoftErrors = 0, stripeSoftWindowStart = 0, settleTimer = null;
let presentedFrames = 0, wireDimsW = 0, wireDimsH = 0;
const stripeClock = createStripeClock();

function closeStripeState() {
  for (const y in stripeDecs) {
    const info = stripeDecs[y];
    try { if (info.dec.state !== 'closed') info.dec.close(); } catch (err) {}
  }
  stripeDecs = {}; jpegLastRowId = {}; jpegRowHeights = {}; jpegPending = 0;
  stripePendingId = null; stripeDirty = false; stripeBottom = false;
  if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
}

// Grows to cover every stripe seen; an explicit geometry change rebuilds it.
function stripeEnsureBack(minW, minH) {
  const w = Math.max(stripeGeomW, minW), h = Math.max(stripeGeomH, minH);
  if (!(w > 0) || !(h > 0)) return false;
  if (!stripeBack) {
    stripeBack = new OffscreenCanvas(w, h);
    stripeBackCtx = stripeBack.getContext('2d', { desynchronized: true, alpha: false });
  } else if (stripeBack.width < w || stripeBack.height < h) {
    const old = stripeBack;
    stripeBack = new OffscreenCanvas(Math.max(old.width, w), Math.max(old.height, h));
    stripeBackCtx = stripeBack.getContext('2d', { desynchronized: true, alpha: false });
    try { stripeBackCtx.drawImage(old, 0, 0); } catch (err) {}
  }
  return true;
}

function stripeDrained() {
  if (jpegPending > 0) return false;
  for (const y in stripeDecs) { if (stripeDecs[y].meta.length > 0) return false; }
  return true;
}

function stripePresent() {
  if (!stripeBack || !stripeDirty) return;
  stripeDirty = false; stripeBottom = false;
  presentedFrames++;
  const at = compositeArrival > 0 ? compositeArrival : NaN;
  compositeArrival = -Infinity;
  if (stripePendingId !== null && wirePort) {
    try { wirePort.postMessage({ presentedId: stripePendingId }); } catch (err) {}
  }
  // A shared viewer learns striped geometry from the composite itself.
  if (!stripeGeomKnown && (stripeBack.width !== wireDimsW || stripeBack.height !== wireDimsH)) {
    wireDimsW = stripeBack.width; wireDimsH = stripeBack.height;
    self.postMessage({ type: 'wireDims', w: wireDimsW, h: wireDimsH });
  }
  if (mode === 'vtg' && writer && !closed) {
    let f = null;
    try { f = new VideoFrame(stripeBack, { timestamp: performance.now() * 1000 }); }
    catch (err) { return; }
    present(f, at);
    return;
  }
  if (ctx) {
    if (oc.width !== stripeBack.width || oc.height !== stripeBack.height) {
      oc.width = stripeBack.width; oc.height = stripeBack.height;
    }
    try { ctx.drawImage(stripeBack, 0, 0); } catch (err) {}
    if (statsOpen) shown.drawn(at);
    if (!presented) { presented = true; self.postMessage({ type: 'presented' }); }
  }
}

function stripeScheduleSettle() {
  if (settleTimer) return;
  const wait = Math.max(1, Math.ceil(stripeClock.settleWaitMs()));
  settleTimer = setTimeout(() => {
    settleTimer = null;
    if (!stripeDirty) return;
    if (stripeDrained() && stripeClock.settled()) { stripePresent(); return; }
    stripeScheduleSettle();
  }, wait);
}

// A new frame id proves the previous frame complete, so it goes up first
// unless quiet already presented it.
function stripeBoundary(frameId) {
  if (stripePendingId !== null && frameId !== stripePendingId && stripeDirty &&
      !(stripeDrained() && stripeClock.settled())) {
    stripePresent();
  }
  stripePendingId = frameId;
}

function stripeMaybePresent() {
  if (!stripeDirty) return;
  if (stripeDrained() && (stripeBottom || stripeClock.settled())) { stripePresent(); return; }
  stripeScheduleSettle();
}

// Draws one decoded stripe at its row offset; always consumes the image. at is
// when the stripe arrived; the composite dates from its newest.
function stripeCompose(image, y, h, frameId, at) {
  const w = image.displayWidth !== undefined ? image.displayWidth : image.width;
  if (!stripeEnsureBack(w, y + h)) { try { image.close(); } catch (err) {} return; }
  stripeBoundary(frameId);
  if (at > compositeArrival) compositeArrival = at;
  try { stripeBackCtx.drawImage(image, 0, y); stripeDirty = true; } catch (err) {}
  try { image.close(); } catch (err) {}
  if (stripeGeomKnown && y + h >= stripeGeomH) stripeBottom = true;
  stripeMaybePresent();
}

function onStripeError(y) {
  const info = stripeDecs[y];
  if (info) {
    try { if (info.dec.state !== 'closed') info.dec.close(); } catch (err) {}
    delete stripeDecs[y];
  }
  const now = Date.now();
  if (now - stripeSoftWindowStart > 10000) { stripeSoftWindowStart = now; stripeSoftErrors = 0; }
  // A burst of failures says decode should leave the worker for the page ladder.
  if (++stripeSoftErrors > 12) { self.postMessage({ type: 'decoderError' }); return; }
  sendNeedKey('stripe_error');
}

function onH264Stripe(buffer, at) {
  if (buffer.byteLength < 13) return;
  const head = new Uint8Array(buffer, 0, 12);
  const key = wireFrameIsKey(head[1]);
  const frameId = (head[2] << 8) | head[3];
  const y = (head[4] << 8) | head[5];
  const w = (head[6] << 8) | head[7];
  const h = (head[8] << 8) | head[9];
  wireChunks++;
  if (frameId !== wireLastId) { wireFrames++; wireLastId = frameId; }
  stripeClock.note(frameId);
  const payload = buffer.slice(12);
  if (payload.byteLength === 0) return;
  let info = stripeDecs[y];
  let codec = info ? info.codec : null;
  const bytes = new Uint8Array(payload);
  if (key) codec = codecStringFor(wireCodecName(head[1]), bytes, w, h, 0, false, wireChromium);
  else if (!codec) codec = wireHint;
  if (!codec) { sendNeedKey('no_codec'); return; }
  const framed = avcFramed(codec);
  const desc = key && framed ? avcDescription(bytes) : (info ? info.desc : null);
  if (!info || info.dec.state !== 'configured' || info.w !== w || info.h !== h || info.codec !== codec
      || info.range !== wireFullRange || (key && framed && !sameBytes(desc, info.desc))) {
    // Only a keyframe may (re)configure a row: deltas against a lost state are noise.
    if (!key) { sendNeedKey('no_key'); return; }
    if (info) { try { if (info.dec.state !== 'closed') info.dec.close(); } catch (err) {} }
    const rowY = y;
    const dec = new VideoDecoder({
      output: (f) => {
        // The row decoder's own frame says what made it; the composite it joins is canvas-backed.
        statsFormat = f.format;
        tellFacts();
        const rowInfo = stripeDecs[rowY];
        const meta = rowInfo && rowInfo.meta.length ? rowInfo.meta.shift() : null;
        stripeCompose(f, rowY, f.displayHeight, meta ? meta.frameId : wireLastId, meta ? meta.at : NaN);
      },
      error: () => onStripeError(rowY),
    });
    try {
      const cfg = { codec: codec, codedWidth: w, codedHeight: h, optimizeForLatency: true };
      if (wireSoftware) cfg.hardwareAcceleration = 'prefer-software';
      if (desc) cfg.description = desc;
      cfg.colorSpace = decoderColorSpace(codec, wireFullRange);
      dec.configure(cfg);
    } catch (err) {
      try { if (dec.state !== 'closed') dec.close(); } catch (e2) {}
      onStripeError(y);
      return;
    }
    info = stripeDecs[y] = { dec: dec, w: w, h: h, codec: codec, desc: desc,
                             range: wireFullRange, gotKey: false, meta: [] };
    probeHardware(codec, w, h);
  }
  if (!key && !info.gotKey) { sendNeedKey('no_key'); return; }
  if (!key && info.dec.decodeQueueSize > STRIPE_DECODE_QUEUE_LIMIT) {
    // Deltas behind a backlog only deepen it; the row is gated until its next IDR.
    info.gotKey = false;
    sendNeedKey('overload');
    return;
  }
  try {
    info.meta.push({ frameId: frameId, at: at });
    const data = framed ? annexbToAvcc(bytes) : payload;
    info.dec.decode(new EncodedVideoChunk({ type: key ? 'key' : 'delta', timestamp: chunkStamp(), data: data }));
    if (key) info.gotKey = true;
  } catch (err) {
    info.meta.pop();
    onStripeError(y);
  }
}

function onJpegStripe(buffer, at) {
  if (buffer.byteLength < 7) return;
  const head = new Uint8Array(buffer, 0, 6);
  const frameId = (head[2] << 8) | head[3];
  const y = (head[4] << 8) | head[5];
  wireChunks++;
  if (frameId !== wireLastId) { wireFrames++; wireLastId = frameId; }
  stripeClock.note(frameId);
  const data = buffer.slice(6);
  if (data.byteLength === 0) return;
  const done = (image) => {
    jpegPending--;
    if (!image) { stripeMaybePresent(); return; }
    const last = jpegLastRowId[y];
    if (last !== undefined) {
      const behindBy = (last - frameId) & 0xFFFF;
      if (behindBy > 0 && behindBy <= JPEG_STRIPE_REORDER_WINDOW) {
        try { image.close(); } catch (err) {}
        stripeMaybePresent();
        return;
      }
    }
    jpegLastRowId[y] = frameId;
    const h = image.displayHeight !== undefined ? image.displayHeight : image.height;
    jpegRowHeights[y] = h;
    stripeCompose(image, y, h, frameId, at);
  };
  if (typeof ImageDecoder !== 'undefined') {
    let d = null;
    try { d = new ImageDecoder({ data: data, type: 'image/jpeg' }); }
    catch (err) { return; }
    jpegPending++;
    d.decode().then((r) => { try { d.close(); } catch (err) {} done(r.image); })
      .catch(() => { try { d.close(); } catch (err) {} done(null); });
  } else if (typeof createImageBitmap === 'function') {
    jpegPending++;
    createImageBitmap(new Blob([data], { type: 'image/jpeg' })).then(done).catch(() => done(null));
  }
}

// A wire message is the bytes, or while the page has its stats open, the bytes
// with the arrival the socket's thread dated them with.
function onWire(message) {
  const buffer = message instanceof ArrayBuffer ? message : message && message.buffer;
  const at = message instanceof ArrayBuffer ? NaN : message && message.at;
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 1) return;
  statsBytes += buffer.byteLength;
  if (stripedOn) {
    const type = new Uint8Array(buffer, 0, 1)[0];
    if (type === 0x03) onJpegStripe(buffer, at);
    else if (type === 0x04) onH264Stripe(buffer, at);
    return;
  }
  if (buffer.byteLength < 13) return;
  const head = new Uint8Array(buffer, 0, 12);
  if (wireExpect && wireCodecName(head[1]) !== wireExpect) return;
  const key = wireFrameIsKey(head[1]);
  const frameId = (head[2] << 8) | head[3];
  const w = (head[6] << 8) | head[7];
  const h = (head[8] << 8) | head[9];
  const reference = (head[10] << 8) | head[11];
  wireChunks++;
  if (frameId !== wireLastId) { wireFrames++; wireLastId = frameId; }
  const payload = buffer.slice(12);
  const bytes = new Uint8Array(payload);
  let codec = wireCodec;
  if (key) codec = codecStringFor(wireCodecName(head[1]), bytes, w, h, 0, false, wireChromium);
  else if (!codec) codec = wireHint;
  if (!codec) { sendNeedKey('no_codec'); return; }
  const framed = avcFramed(codec);
  const desc = key && framed ? avcDescription(bytes) : wireDesc;
  if (!dec || dec.state !== 'configured' || codec !== wireCodec || w !== wireW || h !== wireH
      || wireRange !== wireFullRange || (key && framed && !sameBytes(desc, wireDesc))) {
    // Only a keyframe may (re)configure: deltas against a lost state are noise.
    if (!key) { sendNeedKey('no_key'); return; }
    if (!configureDecoder(codec, w, h, wireSoftware, desc)) return;
    wireCodec = codec; wireW = w; wireH = h; wireDesc = desc; wireRange = wireFullRange;
    self.postMessage({ type: 'wireDims', w: w, h: h });
  }
  decodeChunk(key, framed ? annexbToAvcc(bytes) : payload, chunkStamp(), frameId, reference, at);
}

const stripedCaps = {
  stripedDecode: typeof VideoDecoder !== 'undefined',
  jpegDecode: typeof ImageDecoder !== 'undefined' || typeof createImageBitmap === 'function',
};
if (typeof VideoTrackGenerator !== 'undefined') {
  try {
    const g = new VideoTrackGenerator();
    writer = g.writable.getWriter();
    mode = 'vtg';
    self.postMessage(Object.assign({ type: 'mode', mode: 'vtg', track: g.track }, stripedCaps), [g.track]);
  } catch (e) { self.postMessage(Object.assign({ type: 'mode', mode: 'canvas' }, stripedCaps)); }
} else {
  self.postMessage(Object.assign({ type: 'mode', mode: 'canvas' }, stripedCaps));
}

self.onmessage = (e) => {
  const m = e.data;
  // WebKit's Skia ports race the page's paint on an accelerated worker canvas and crash
  // the web process; an unaccelerated one stays out of the race.
  if (m.canvas) {
    oc = m.canvas;
    ctx = oc.getContext('2d', { desynchronized: true, willReadFrequently: isSkiaWebKit(navigator.userAgent, navigator.platform) });
    if (!mode) mode = 'canvas';
    return;
  }
  if (m.type === 'decoderConfig') { configureDecoder(m.codec, m.codedWidth, m.codedHeight, m.software, m.description || null); return; }
  if (m.type === 'closeDecoder') { closeDecoder(); return; }
  if (m.type === 'decodePaceReset') { pace.reset(); return; }
  if (m.type === 'statsOpen') { setStatsOpen(!!m.open); return; }
  if (m.type === 'decodeStats') { postDecodeStats(); return; }
  if (m.type === 'chunk') {
    // Not ready yet; the page will resend a keyframe.
    decodeChunk(m.key, m.data, m.timestamp, m.frameId, m.reference, m.at);
    return;
  }
  if (m.type === 'wireIn') {
    if (m.codecHint) wireHint = m.codecHint;
    wireSoftware = !!m.software;
    wireChromium = !!m.chromium;
    wireAvcc = !!m.avcc;
    wireFullRange = !!m.fullRange;
    // Another socket: the last one's port is let go, its frames stale, and the
    // counts start over under the page's generation for this wiring.
    if (wirePort && wirePort !== m.port) wirePort.onmessage = null;
    wireGen = m.gen || 0;
    wireChunks = 0; wireFrames = 0; wireLastId = -1; presentedFrames = 0;
    wirePort = m.port;
    m.port.onmessage = (ev) => onWire(ev.data);
    if (!wireStatsTimer) {
      wireStatsTimer = setInterval(() => {
        if (!wireChunks && !presentedFrames) return;
        const rows = {};
        if (stripedOn) {
          for (const y in stripeDecs) rows[y] = stripeDecs[y].h;
          for (const y in jpegRowHeights) if (!(y in rows)) rows[y] = jpegRowHeights[y];
        } else if (dec && wireH > 0) {
          rows[0] = wireH;
        }
        self.postMessage({ type: 'wireStats', gen: wireGen, chunks: wireChunks, frames: wireFrames, lastId: wireLastId, presents: presentedFrames, rows: rows });
        wireChunks = 0; wireFrames = 0; presentedFrames = 0;
        if (!stripedOn && dec) {
          const fps = pace.second();
          if (fps !== undefined) self.postMessage({ type: 'decodePace', fps: fps });
        }
      }, 1000);
    }
    return;
  }
  if (m.type === 'wireMode') {
    const striped = !!m.striped;
    wireExpect = m.codec || null;
    if (striped !== stripedOn) {
      stripedOn = striped;
      // The sink re-announces in the new mode, so the page re-hides its
      // canvas even when the old mode had already consumed 'presented'.
      presented = false;
      if (striped) closeDecoder(); else closeStripeState();
    }
    return;
  }
  if (m.type === 'wireGeom') {
    const know = m.w > 0 && m.h > 0;
    if (know && (m.w !== stripeGeomW || m.h !== stripeGeomH)) {
      stripeGeomW = m.w; stripeGeomH = m.h;
      if (stripeBack && (stripeBack.width !== m.w || stripeBack.height !== m.h)) {
        // A real geometry change; the server keyframes it, so stale rows go.
        stripeBack = null; stripeBackCtx = null;
        stripeDirty = false; stripePendingId = null;
        jpegLastRowId = {}; jpegRowHeights = {};
      }
    }
    stripeGeomKnown = stripeGeomKnown || know;
    return;
  }
  if (m.type === 'wireHints') {
    if (m.codecHint) wireHint = m.codecHint;
    if (m.software !== undefined) wireSoftware = !!m.software;
    if (m.fullRange !== undefined && !!m.fullRange !== wireFullRange) {
      wireFullRange = !!m.fullRange;
      if (dec || Object.keys(stripeDecs).length) sendNeedKey('color_range');
    }
    if (m.chromium !== undefined) wireChromium = !!m.chromium;
    if (m.avcc !== undefined) wireAvcc = !!m.avcc;
    return;
  }
  // Fallback: a main-thread-decoded frame transferred in.
  if (m.frame) {
    present(m.frame, m.at);
    ack();
  }
};`;function to(){try{if(typeof MediaStreamTrackGenerator<`u`){let e=new MediaStreamTrackGenerator({kind:`video`});return{track:e,writable:e.writable}}}catch(e){console.warn(`MediaStreamTrackGenerator unavailable, using canvas:`,e)}return null}function no(){if(!x||!x.paused||!x.srcObject)return;let e=x.play();e&&e.catch&&e.catch(e=>{x.paused&&!ve&&(ve=!0,console.warn(`Video playback refused (${e&&e.name}): the browser waits for a user gesture; the next press or key starts it.`))})}function ro(){if(x&&x.paused&&x.srcObject){let e=x.play();e&&e.then&&e.then(()=>{ve&&(ve=!1,console.log(`Video playback started on a user gesture.`))},()=>{})}h&&h.state===`suspended`&&h.resume().catch(()=>{})}function io(){if(S)return!0;if(!x)return!1;let e=to();if(!e)return!1;se=e.track;try{S=e.writable.getWriter()}catch(e){console.warn(`track writer failed:`,e);try{se.stop()}catch{}return se=null,!1}if(S.closed&&S.closed.catch){let e=S;S.closed.catch(()=>{S===e&&Co()})}try{x.srcObject=new MediaStream([se])}catch(e){console.warn(`srcObject failed:`,e);try{S.close()}catch{}S=null;try{se.stop()}catch{}return se=null,!1}return no(),!0}function ao(){if(S){try{S.close()}catch{}S=null}if(se){try{se.stop()}catch{}se=null}if(x)try{x.srcObject=null}catch{}}function oo(e){if(!io())return!1;if(!ce&&(ce=!0,le=null,me=!1,Ma&&Pa!==`vtg`&&Aa&&(Ma=!1,he=!1,Aa.style.display=`none`),x)){if(x.style.display=`block`,x.style.objectFit=`fill`,no(),typeof x.requestVideoFrameCallback==`function`){let e=++ge;x.requestVideoFrameCallback(()=>{e===ge&&ce&&(me=!0,c&&(c.style.display=`none`))})}else me=!0}if(c&&x&&(me&&c.style.display!==`none`&&(c.style.display=`none`),(be||le===null)&&(le=c.style.cssText,x.style.cssText=le,x.style.display=`block`,x.style.objectFit=`fill`,be=!1)),!me&&c&&l&&c.width>0&&c.height>0)try{l.drawImage(e,0,0)}catch{}if(S.desiredSize!==null&&S.desiredSize<=0)return e.close(),J.open&&Ii.refused(),++de>=30&&(console.warn(`Video track sink stalled (${de} consecutive drops); rebuilding it.`),Co()),!0;de=0;let t=S;return S.write(e).catch(()=>{try{e.close()}catch{}S===t&&Co()}),!0}function so(){if($&&c&&c.width>0&&c.height>0)try{$.postMessage({type:`wireGeom`,w:c.width,h:c.height})}catch{}}let co=0;function lo(){if(!$||!u||typeof u.connectVideo!=`function`)return;let e=new MessageChannel;try{$.postMessage({type:`wireIn`,port:e.port1,gen:++co,codecHint:Ua,software:Cr,chromium:Kn,avcc:fe()===`avcc`,fullRange:Or},[e.port1]);let t=$;ue.then(e=>{if($===t)try{t.postMessage({type:`wireHints`,avcc:e===`avcc`})}catch{}}),u.connectVideo(e.port2)}catch(e){console.warn(`Could not connect the socket worker to the video worker:`,e)}so(),uo(!0)}function uo(e){_s();let t=H===`h264enc-striped`||H===`jpeg`,n=ka&&Na&&(H===`jpeg`?Ya:Ja),r=!!(u&&typeof u.setVideoDivert==`function`&&Na&&!Wa&&(t?n:za&&Gt(H)));if($)try{$.postMessage({type:`wireMode`,striped:t,codec:t?null:i(H)})}catch{}(r!==Ga||t!==Ka||e)&&(Ga=r,Ka=t,window.videoDivertOn=r,r||(window.videoStripeRows={}),u&&typeof u.setVideoDivert==`function`&&u.setVideoDivert(r,t?`present`:`receive`),r&&(t&&(fs(),Ac()),so(),_o()))}let fo=new Set;function po(){let e=Ma&&Ya?` in the video worker`:` on the page`;return typeof ImageDecoder<`u`?`ImageDecoder${e}`:typeof createImageBitmap==`function`?`createImageBitmap${e}`:``}function mo(e){ut=e,!fo.has(e)&&(fo.add(e),console.info(`[Selkies] video sink: ${e}`))}function ho(){if(Za)return!1;if(Na)return!0;if($)return!1;try{let e=URL.createObjectURL(new Blob([eo],{type:`text/javascript`}));return Xa++,$=new Worker(e),URL.revokeObjectURL(e),J.open&&$.postMessage({type:`statsOpen`,open:!0}),Ra=0,lo(),$.onerror=e=>{console.warn(`video worker error:`,e&&e.message),go()},$.onmessage=e=>{let t=e.data;if(t){if(t.ack)Ra>0&&Ra--;else if(t.type===`error`)go();else if(t.type===`presented`)Io&&Zo(),he=!0,Ma&&c&&(c.style.display=`none`);else if(t.type===`needKeyframe`)console.info(`[VideoWorker] keyframe requested: ${t.reason}`),Jc();else if(t.type===`lostFrame`)Kc(t.id);else if(t.type===`decodePace`)ti(t.fps);else if(t.type===`decoderError`)Wa=!0,Ba=null,Va=0,Ha=0,Ua=null,uo(),Jc();else if(t.type===`decodeStats`)qi(t);else if(t.type===`decodeFacts`)Ni.format=t.format,Ni.hardware=t.hardware,Gi();else if(t.type===`wireStats`)window.videoChunksReceived+=t.chunks,t.chunks>0&&(Be=performance.now()),H===`h264enc-striped`||H===`jpeg`?$i+=t.presents||0:qa+=t.frames,(t.presents||0)>0&&(ze=performance.now()),t.lastId>=0&&(Fe=t.lastId,k=performance.now()),t.rows&&(window.videoStripeRows=t.rows),G&&t.chunks>0&&(L=performance.now()),!Yi&&t.gen===co&&t.frames>0&&sc(),Ga&&(_o(),$a());else if(t.type===`wireDims`)G&&t.w>0&&t.h>0&&(z!==t.w||B!==t.h)&&(z=t.w,B=t.h,console.log(`Shared mode: stream is ${z}x${B} (physical).`),as(z,B,!0));else if(t.type===`mode`){if(Ja=!!t.stripedDecode,Ya=!!t.jpegDecode,t.mode===`vtg`&&t.track){if(!x){go();return}Pa=`vtg`,Fa=t.track;try{x.srcObject=new MediaStream([t.track]),no()}catch(e){console.warn(`VTG srcObject failed:`,e),go();return}mo(`VideoTrackGenerator in the video worker.`),za=!0,Na=!0,Xa=0,so(),uo()}else if(Oa&&Gt(H)){mo(`MediaStreamTrackGenerator on the page — this browser exposes no VideoTrackGenerator to a worker.`),go();return}else{if(Pa=`canvas`,mo(Oa?`OffscreenCanvas in the video worker for the striped codecs; full-frame H.264 presents through the page MediaStreamTrackGenerator.`:`OffscreenCanvas in the video worker — this browser exposes no VideoTrackGenerator to a worker and no MediaStreamTrackGenerator on the page, so frames are composited rather than handed to a <video> element.`),!Aa){go();return}try{let e=Aa.transferControlToOffscreen();Ia=!0,$.postMessage({canvas:e},[e])}catch(e){console.warn(`OffscreenCanvas transfer failed:`,e),go();return}za=!Oa,Na=!0,Xa=0,so(),uo()}}}},!1}catch(e){return console.warn(`video worker init failed, using main canvas:`,e),go(),!1}}function go(){let e=Pa===`vtg`;mo(Oa?`MediaStreamTrackGenerator on the page.`:`2D canvas on the page — no video worker sink.`);let t=Ia;if(Ma=!1,Na=!1,Pa=null,za=!1,Ja=!1,Ya=!1,Qa=0,uo(),Ra=0,Ia=!1,he=!1,ge++,Ba=null,Va=0,Ha=0,Ua=null,$){try{$.terminate()}catch{}$=null}if(e){if(Fa){try{Fa.stop()}catch{}Fa=null}if(x){try{x.srcObject=null}catch{}x.style.display=`none`}}if(t&&Aa){let e=Aa.parentNode,t=document.createElement(`canvas`);t.id=Aa.id,t.style.display=`none`,e&&e.replaceChild(t,Aa),Aa=t}else Aa&&(Aa.style.display=`none`);c&&(c.style.display=`block`)}function _o(){let e=Pa===`vtg`?x:Aa;if(!e)return!1;if(!Ma&&(Ma=!0,La=null,he=!1,e!==x&&(ce?Co():x&&(x.style.display=`none`)),e.style.display=`block`,e.style.objectFit=`fill`,Pa===`vtg`)){if(no(),typeof e.requestVideoFrameCallback==`function`){let t=++ge;e.requestVideoFrameCallback(()=>{t===ge&&Ma&&(he=!0,c&&(c.style.display=`none`))})}else he=!0}return c&&(he&&c.style.display!==`none`&&(c.style.display=`none`),(be||La===null)&&(La=c.style.cssText,e.style.cssText=La,e.style.display=`block`,e.style.objectFit=`fill`,be=!1)),!0}function vo(e){if(!ho()||!_o()||($a(),Za))return!1;if(Ra>=3){try{e.close()}catch{}return J.open&&Ii.refused(),!0}try{$.postMessage({frame:e,at:J.open?Bi(e.timestamp):NaN},[e]),Ra++}catch{try{e.close()}catch{}return go(),!0}return!0}let yo=-1/0,bo=0;function xo(e,t,n){let r=performance.now();if(r-yo>=5e3){let i=bo>0?` (+${bo} suppressed)`:``;console.info(`[VideoWorker] decoder (re)configure: codec=${e} ${t}x${n}${Ba?` (was ${Ba} ${Va}x${Ha})`:``}${i}`),yo=r,bo=0}else bo++}function So(e,t,n,r,i,a,o,s){if(Wa||!ho()||!_o())return!1;let c=fe()===`avcc`&&i.startsWith(`avc1`);if(i!==Ba||n!==Va||r!==Ha){if(c&&!e)return Jc(),!0;xo(i,n,r);let a=c?ne(new Uint8Array(t)):null;try{$.postMessage({type:`decoderConfig`,codec:i,codedWidth:n,codedHeight:r,software:Cr,description:a})}catch{return!1}Ba=i,Va=n,Ha=r,Jc()}let l=c?re(new Uint8Array(t)).buffer:t;try{$.postMessage({type:`chunk`,key:e,data:l,timestamp:Ts(),frameId:a,reference:o,at:s},[l])}catch{return!1}return!0}function Co(){ce&&(ce=!1,de=0,me=!1,ge++,x&&(x.style.display=`none`),c&&(c.style.display=``),ao())}let wo=(e,t,i,a)=>{let o=t&&r(e)&&t.byteLength?new Uint8Array(t):null;return ee(n(e),o,i,a,Ur,K,Kn)},To=()=>{if(!c)return;if(be=!0,!gn){c.style.imageRendering!==`pixelated`&&(console.log(`Anti-aliasing disabled by setting. Forcing 'pixelated' rendering.`),c.style.imageRendering=`pixelated`,c.style.setProperty(`image-rendering`,`crisp-edges`,``));return}let e=window.devicePixelRatio||1;G||window.manual_resolution||Math.abs(Yt()-e)>1e-6?c.style.imageRendering!==`auto`&&(console.log(`Smoothing enabled for manual resolution, high-DPR scaling, or shared mode.`),c.style.imageRendering=`auto`):c.style.imageRendering!==`pixelated`&&(console.log(`Setting canvas rendering to 'pixelated' for 1:1 display.`),c.style.imageRendering=`pixelated`,c.style.setProperty(`image-rendering`,`crisp-edges`,``))},Eo=()=>{let e=document.createElement(`style`);e.textContent=`
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
  color: #fff;
}
#app {
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
}
.video-container {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.video-container video,
.video-container canvas,
.video-container #overlayInput {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.video-container video {
  max-width: none;
  max-height: none;
  object-fit: contain;
  display: none;
}
.video-container #videoCanvas {
    z-index: 2;
    pointer-events: none;
    display: block;
}
.video-container #overlayInput {
    opacity: 0;
    z-index: 3;
    caret-color: transparent;
    background-color: transparent;
    color: transparent;
    pointer-events: auto;
    -webkit-user-select: none;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
}
.video-container #playButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.hidden {
  display: none !important;
}
.video-container .status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  z-index: 5;
}
#playButton {
  padding: 15px 30px;
  font-size: 1.5em;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  backdrop-filter: blur(5px);
}
.video-container.shared-user-mode #overlayInput {
  cursor: default !important;
}
  `,document.head.appendChild(e)};async function Do(){for(let e of[`h264`,`h265`,`vp9`])_e(e);let e=i(H);a(e)&&(await _e(e)||Z(`video_fullcolor`,!1)&&(console.warn(`[Selkies] full color (4:4:4) is off: this browser decodes ${e} 4:2:0 only.`),K=!1,la(`video_fullcolor`,!1)))}let Oo=!1;async function ko(e){if(!K||Oo||G)return!1;let t=i(H);return!a(t)||Vo(t)===!1||await _e(t)||!K?!1:(console.warn(`[Selkies] full color (4:4:4) is off: this browser decodes ${t} 4:2:0 only.`),K=!1,la(`video_fullcolor`,!1),Qo(e),!0)}async function Ao(){let e=i(H);o(e)&&Z(`video_10bit`,!1)&&(!await Ce(e,!1)||K&&a(e)&&!await Ce(e,!0))&&(console.warn(`[Selkies] 10-bit is off: this browser shows no 10-bit ${e} picture.`),oi=!1,la(`video_10bit`,!1))}let jo=!1;function Mo(e=H){return Rn(e,Bo,ui,K)}async function No(e){if(!oi||jo||G)return!1;let t=i(H),n=Mo();return!o(t)||!n||await Ce(t,n.fullcolor)||!oi?!1:(console.warn(`[Selkies] 10-bit is off: this browser shows no 10-bit ${t} picture.`),oi=!1,la(`video_10bit`,!1),Qo(e),!0)}let Po=e=>/^(avc1\.F4|hev1\.4\.|vp09\.01)/i.test(e),Fo=null,Io=!1,Lo=null,Ro=!1,zo=null,Bo=null;function Vo(e){let t=Bo&&Bo[e];if(!t||!t.fullcolor)return null;let n=ui||!t.hardware||t.hardware===`vaapi`&&t.fullcolor.hardware===!1&&t.fullcolor.software===!0,r=t.fullcolor[n?`software`:`hardware`];return typeof r==`boolean`?r:null}let Ho=new Set,Uo=[`h264enc`,`av1enc`,`vp8enc`,`h265enc`,`vp9enc`,`h264enc-striped`,`jpeg`],Wo=[`av1enc`,`h265enc`,`vp9enc`,`h264enc`,`vp8enc`];function Go(e,t=H){e&&Ho.add(e);let n=Array.isArray(zo)&&zo.length?zo:Uo,r=Uo.filter(e=>n.includes(e)),s=e=>Gt(e)&&!!(Bo&&(Bo[i(e)]||{}).hardware),c=Wo.filter(e=>r.includes(e)&&s(e));for(let e of[...c,...r.filter(e=>!s(e))]){if(e===t)continue;if(e===`jpeg`)return e;let n=i(e);if(!Ho.has(n)&&pe(e)&&!(Oo&&K&&a(n)&&Vo(n)!==!1&&ye(n)===!1)){if(jo&&oi&&o(n)){let t=Mo(e);if(t&&we(n,t.fullcolor)===!1)continue}return e}}return null}let Ko=e=>Go(i(e),e)||`jpeg`;function qo(e,t){Io||Fo||(oi&&!jo&&!G&&o(t)?No(`no decoder for ${e}`).then(n=>{n||Jo(e,t)}):Jo(e,t))}function Jo(e,t){if(!(Io||Fo)){if(Po(e)&&!Oo&&!G){if(!K)return;ko(`no decoder for ${e}`).then(n=>{n||Yo(e,t)})}else Yo(e,t)}}function Yo(e,t){if(Io||Fo)return;let n=!G&&!Ro&&H!==`jpeg`?Go(t):null;n?(Fo=n,console.warn(`This browser has no decoder for ${e}; switching to the ${n} encoder.`),H=n,ga(n,`no decoder for ${e}`),Wa=!1,Ba=null,Va=0,Ha=0,Ua=null,uo(),Qo(`no decoder for ${e}`)):(Io=!0,Lo={encoder:H,fullcolor:K},console.error(`This session streams ${e}, which this browser cannot decode.`),Y&&(Y.textContent=`Error: This session streams ${oe(t)} video, which this browser cannot decode.`,Y.classList.remove(`hidden`)))}function Xo(e,t){Ro=!!(t&&(t.locked||Array.isArray(t.allowed)&&t.allowed.length===1)),zo=t&&Array.isArray(t.allowed)?t.allowed.slice():null,Fo&&=(e!==Fo&&(Ro=!0),null),pe(e)?Io&&(e!==Lo.encoder||K!==Lo.fullcolor)&&Zo():qo(e,i(e))}function Zo(){Io=!1,Y&&Y.classList.add(`hidden`)}function Qo(e,t=null){if(!G&&Si){if(u&&u.readyState===WebSocket.OPEN){let n=ns();t&&t.length>0&&(n.picked=t);let r=`SETTINGS,${JSON.stringify(n)}`;u.send(r),console.log(`[websockets] Sent full settings update. Reason: ${e}`)}else console.warn(`[websockets] Cannot send full settings update. Reason: ${e}. WebSocket not open.`)}}Ci.then(e=>{e&&Si&&!G&&u&&u.readyState===WebSocket.OPEN&&u.send(`SETTINGS,${JSON.stringify({keyboardLayout:e})}`)});function $o(e){let n=document.getElementById(`videoCanvas`),r=null;for(let e of[`videoCanvas`,`videoStream`,`videoWorkerCanvas`]){let t=document.getElementById(e),n=t&&t.getBoundingClientRect?t.getBoundingClientRect():null;if(n&&n.width>0){r=[n.width,n.height];break}}let i=(t||{})[M];return Ut({stream:n&&n.width>0?[n.width,n.height]:null,css:r,realized:i?[i.w,i.h]:null,density:e})}function es(){return Yr(window.localStorage.getItem(ca(`framerate`)),Gr?Gr.rate():null,Wr)}function ts(e){let t=es();t!==null&&t!==Kr&&(Ur=t,Qo(e))}function ns(){let e={},t=Yt();Qt=t;let n=e=>{let t=`${hr}_${e}`;return M===`display2`&&rt.includes(e)&&(t=`${t}_${M}`),t},r=e=>window.localStorage.getItem(n(e))!==null&&(!tt.includes(e)||nt.has(e)||window.localStorage.getItem(`${n(e)}_explicit_choice`)===`true`),i=[[`video_crf`,()=>aa(`video_crf`,25)],[`encoder`,()=>ua(`encoder`,`h264enc`)],[`manual_resolution`,()=>Z(`manual_resolution`,!1)],[`audio_bitrate`,()=>aa(`audio_bitrate`,32e4)],[`video_fullcolor`,()=>Z(`video_fullcolor`,!1)],[`video_10bit`,()=>Z(`video_10bit`,!1)],[`video_streaming_mode`,()=>Z(`video_streaming_mode`,!1)],[`jpeg_quality`,()=>aa(`jpeg_quality`,60)],[`paint_over_jpeg_quality`,()=>aa(`paint_over_jpeg_quality`,90)],[`use_cpu`,()=>Z(`use_cpu`,!1)],[`cpu_encode_threading`,()=>Z(`cpu_encode_threading`,!0)],[`video_paintover_crf`,()=>aa(`video_paintover_crf`,18)],[`video_paintover_burst_frames`,()=>aa(`video_paintover_burst_frames`,5)],[`use_paint_over_quality`,()=>Z(`use_paint_over_quality`,!0)],[`scaling_dpi`,()=>aa(`scaling_dpi`,96)],[`enable_binary_clipboard`,()=>Z(`enable_binary_clipboard`,!1)],[`rate_control_mode`,()=>ua(`rate_control_mode`,`cbr`)],[`video_bitrate`,()=>aa(`video_bitrate`,8e3)],[`force_aligned_resolution`,()=>Z(`force_aligned_resolution`,!1)]];for(let[t,n]of i)r(t)&&(e[t]=n());if(e.encoder!==void 0&&ha()&&(e.encoderFallback=!0),Kr=es(),Kr!==null&&(e.framerate=Kr),e.scaling_dpi=cn(),xi&&(e.keyboardLayout=xi),window.manual_resolution&&z!=null&&B!=null)e.manual_resolution=!0,e.manual_width=Q(z),e.manual_height=Q(B);else{let n=document.querySelector(`.video-container`),r=n?n.getBoundingClientRect():{width:window.innerWidth,height:window.innerHeight};e.manual_resolution=!1;let i=Q(r.width*t),a=Q(r.height*t);i>4080&&(i=4080),a>4080&&(a=4080),e.initialClientWidth=i,e.initialClientHeight=a}e.useCssScaling=U,e.displayId=M,e.tabId=w();let a=D(M);return a!==null&&(e.ccStartKbps=a),e.displayScale=$o(t),M===`display2`&&(e.displayPosition=et),e.audioRedundancy=!0,e}function rs(e,t){if(G){console.log(`Shared mode: Resolution sending to server is blocked.`);return}let n,r,i=1;window.manual_resolution?(n=Q(e),r=Q(t)):(i=Yt(),Xt=i,window.webrtcInput&&window.webrtcInput.setStreamDensity&&window.webrtcInput.setStreamDensity(i),n=Q(e*i),r=Q(t*i),Qt>0&&Math.abs(i-Qt)>1e-6&&setTimeout(()=>Qo(`stream density`),0));let a=n>4080||r>4080;n>4080&&(n=4080),r>4080&&(r=4080),$t=window.manual_resolution||a?null:[n,r,e,t];let o=`${n}x${r}`;console.log(`Sending resolution to server: ${o}, DisplayID: ${M}, Manual Mode: ${window.manual_resolution}, Pixel Ratio Used: ${i}, useCssScaling: ${U}`),u&&u.readyState===WebSocket.OPEN?u.send(`r,${o},${M}`):console.warn(`Cannot send resolution via WebSocket: Connection not open.`)}function is(){if(!c)return;let e=null,t=!1,n=!1;if(ce&&x?(e=x,t=me,n=!0):Ma&&(e=Pa===`vtg`?x:Aa,t=he),!e)return;let r=c.style.cssText;e.style.cssText=r,e.style.display=`block`,e.style.objectFit=`fill`,n?le=r:La=r,be=!1,t&&(c.style.display=`none`)}function as(e,t,n){if(!c||!c.parentElement){console.error(`Cannot apply manual canvas style: Canvas or parent container not found.`);return}if(e<=0||t<=0){console.warn(`Cannot apply manual canvas style: Invalid target dimensions ${e}x${t}`);return}be=!0,Rs={};let r=G||window.manual_resolution?1:Yt(),i=Q(e*r),a=Q(t*r);(c.width!==i||c.height!==a)&&(c.width=i,c.height=a,console.log(`Canvas internal buffer set to: ${i}x${a}`),so());let o=c.parentElement,s=o.clientWidth,l=o.clientHeight,u,d,f,p;if(n){let n=e/t,r=s/l,o,m;n>r?(o=s,m=s/n):(m=l,o=l*n);let h=(l-m)/2,g=(s-o)/2;u=`${o}px`,d=`${m}px`,f=`${h}px`,p=`${g}px`,c.style.position=`absolute`,c.style.width=u,c.style.height=d,c.style.top=f,c.style.left=p,c.style.objectFit=`contain`,console.log(`Applied manual style (Scaled): CSS ${o.toFixed(2)}x${m.toFixed(2)}, Buffer ${i}x${a}, Pos ${g.toFixed(2)},${h.toFixed(2)}`)}else{let n=window.devicePixelRatio||1,r=e/n,o=t/n;u=`${r}px`,d=`${o}px`;let m=(l-o)/2,h=(s-r)/2;f=`${m}px`,p=`${h}px`,c.style.position=`absolute`,c.style.width=u,c.style.height=d,c.style.top=f,c.style.left=p,c.style.objectFit=`fill`,console.log(`Applied manual style (Exact): CSS ${r.toFixed(2)}x${o.toFixed(2)}, Buffer ${i}x${a}, Pos ${h.toFixed(2)},${m.toFixed(2)}`)}c.style.display=`block`,To(),is();let m=document.getElementById(`overlayInput`);m&&(m.style.position=`absolute`,m.style.width=u,m.style.height=d,m.style.top=f,m.style.left=p),window.webrtcInput&&typeof window.webrtcInput.resize==`function`&&window.webrtcInput.resize()}function os(e,t){if(!c)return;if(e<=0||t<=0){console.warn(`Cannot reset canvas style: Invalid stream dimensions ${e}x${t}`);return}Rs={},be=!0;let n=Yt(),r=Q(e*n),i=Q(t*n);(c.width!==r||c.height!==i)&&(c.width=r,c.height=i,console.log(`Canvas internal buffer reset to: ${r}x${i}`),so());let a=`${e}px`,o=`${t}px`;c.style.width=a,c.style.height=o;let s=document.getElementById(`overlayInput`);s&&(s.style.width=a,s.style.height=o,s.style.position=`absolute`);let l=c.parentElement;if(l){let n=l.clientWidth,a=l.clientHeight,o=Math.floor((n-e)/2),u=Math.floor((a-t)/2);c.style.position=`absolute`,c.style.top=`${u}px`,c.style.left=`${o}px`,s&&(s.style.top=`${u}px`,s.style.left=`${o}px`),console.log(`Reset canvas CSS to ${e}px x ${t}px, Pos ${o},${u}, object-fit: fill. Buffer: ${r}x${i}`)}else c.style.position=`absolute`,c.style.top=`0px`,c.style.left=`0px`,s&&(s.style.top=`0px`,s.style.left=`0px`),console.log(`Reset canvas CSS to ${e}px x ${t}px, Pos 0,0 (no parent metrics), object-fit: fill. Buffer: ${r}x${i}`);c.style.objectFit=`fill`,c.style.display=`block`,To(),is(),window.webrtcInput&&typeof window.webrtcInput.resize==`function`&&window.webrtcInput.resize()}function ss(){cs&&(console.log(`Switching to Auto Mode: Removing direct manual local scaling listener.`),window.removeEventListener(`resize`,cs)),It?(console.log(`Switching to Auto Mode: Adding original (auto) debounced resize listener.`),window.removeEventListener(`resize`,It),window.addEventListener(`resize`,It),typeof V==`function`?(console.log(`Triggering immediate auto-resize calculation for auto mode.`),V()):console.warn(`handleResizeUI function not directly callable from enableAutoResize. Auto-resize will occur on next event.`)):console.warn(`Cannot enable auto-resize: originalWindowResizeHandler not found.`)}let cs=()=>{window.manual_resolution&&!G&&z!=null&&B!=null&&z>0&&B>0&&as(z,B,Qi)};function ls(){It&&(console.log(`Switching to Manual Mode Local Scaling: Removing original (auto) resize listener.`),window.removeEventListener(`resize`,It)),console.log(`Switching to Manual Mode Local Scaling: Adding direct manual scaling listener.`),window.removeEventListener(`resize`,cs),window.addEventListener(`resize`,cs),window.manual_resolution&&!G&&z!=null&&B!=null&&z>0&&B>0&&(console.log(`Applying current manual canvas style after enabling direct manual resize handler.`),as(z,B,Qi))}function us(){if(!G)return;let e=document.querySelector(`.video-container`);e&&(e.classList.add(`shared-user-mode`),console.log(`Shared mode: Added 'shared-user-mode' class to video container.`));let t=document.getElementById(`globalFileInput`);t&&(t.disabled=!0,console.log(`Shared mode: Disabled globalFileInput.`))}let ds=()=>{Eo(),zn(),window.addEventListener(`resize`,zn),window.addEventListener(`requestFileUpload`,qs);let e=document.getElementById(`app`);if(!e){console.error(`FATAL: Could not find #app element.`);return}let t=document.createElement(`div`);t.className=`video-container`,Y=document.createElement(`div`),Y.id=`status-display`,Y.className=`status-bar`,Y.textContent=`Connecting...`,t.appendChild(Y),X=document.createElement(`input`),X.type=`search`,X.readOnly=!1,X.autocomplete=`off`,X.inputMode=`none`,X.virtualKeyboardPolicy=`manual`,X.setAttribute(`autocorrect`,`off`),X.setAttribute(`autocapitalize`,`off`),X.setAttribute(`spellcheck`,`false`),X.id=`overlayInput`,t.appendChild(X),c=document.getElementById(`videoCanvas`),c||(c=document.createElement(`canvas`),c.id=`videoCanvas`),t.appendChild(c);let n=lr.get(`offscreen_worker`),r=n===null?Z(`offscreen_worker`,!0):n.toLowerCase()===`true`;ka=r,ja=r,!ka&&Oa?mo(`MediaStreamTrackGenerator on the page.`):ka||mo(`2D canvas on the page — `+(r?`no MediaStreamTrackGenerator in this browser and no video worker.`:`the video worker is disabled (offscreen_worker=false).`)+` Every frame is drawn by hand, which costs more CPU than a <video> sink.`),(Oa||ka)&&(x=document.getElementById(`videoStream`),x||(x=document.createElement(`video`),x.id=`videoStream`,x.autoplay=!0,x.muted=!0,x.playsInline=!0,x.disableRemotePlayback=!0),x.style.display=`none`,t.appendChild(x));for(let e of[`pointerdown`,`pointerup`,`touchend`,`keydown`,`click`])window.addEventListener(e,ro,{capture:!0,passive:!0});ka&&(Aa=document.getElementById(`videoWorkerCanvas`),Aa||(Aa=document.createElement(`canvas`),Aa.id=`videoWorkerCanvas`),Aa.style.display=`none`,t.appendChild(Aa)),ka&&ho(),G?((!z||z<=0||!B||B<=0)&&(z=1280,B=720),as(z,B,!0),window.addEventListener(`resize`,()=>{G&&z&&B&&z>0&&B>0&&as(z,B,!0)}),console.log(`Initialized UI in Shared Mode: Canvas buffer target ${z}x${B} (logical), will scale to fit viewport.`)):window.manual_resolution&&z!=null&&B!=null&&z>0&&B>0?(as(z,B,Qi),ls(),console.log(`Initialized UI in Manual Resolution Mode: ${z}x${B} (logical), ScaleLocally: ${Qi}`)):(os(1024,768),console.log(`Initialized UI in Auto Resolution Mode (defaulting to 1024x768 logical for now)`)),l=c.getContext(`2d`,{desynchronized:!0}),l||console.error(`Failed to get 2D rendering context`),ra=document.createElement(`button`),ra.id=`playButton`,ra.textContent=`Play Stream`,t.appendChild(ra),ra.classList.add(`hidden`),Y.classList.remove(`hidden`);let i=document.createElement(`div`);i.id=`dev-sidebar`;let a=document.createElement(`input`);a.type=`file`,a.id=`globalFileInput`,a.multiple=!0,a.style.display=`none`,document.body.appendChild(a),a.addEventListener(`change`,Js),rr(),e.appendChild(t),Da(),ra.addEventListener(`click`,Ea),G&&us()};function fs(){console.log(`Clearing all VNC stripe decoders.`);for(let e in Lt)if(Object.prototype.hasOwnProperty.call(Lt,e)){let t=Lt[e];if(t.decoder&&t.decoder.state!==`closed`)try{t.decoder.close(),console.log(`Closed VNC stripe decoder for Y=${e}`)}catch(t){console.error(`Error closing VNC stripe decoder for Y=${e}:`,t)}}Lt={},zt={},console.log(`All VNC stripe decoders and metadata cleared.`)}function ps(e,t){if(za&&!Wa&&Gt(H)){let n=performance.now(),r=zt[t],i=r&&n-r.last<=1e4?r.count+1:1;if(zt[t]={count:i,last:n},i<=12){console.warn(`stripe decoder error on Y=${t} (worker path healthy; soft ${i}/12):`,e&&e.name);let n=Lt[t];if(n){try{n.decoder.close()}catch{}delete Lt[t]}Jc();return}}Xc(e,`stripe_decoder_Y=${t}`)}function ms(){for(let e in Lt){let t=Lt[e];if(t&&t.decoder&&(t.decoder.decodeQueueSize>0||t.pendingChunks&&t.pendingChunks.length>0))return!1}return!0}function hs(e){let t=Lt[e];if(t&&t.decoder.state===`configured`&&t.pendingChunks)for(console.log(`Processing ${t.pendingChunks.length} pending chunks for stripe Y=${e}`);t.pendingChunks.length>0;){let n=t.pendingChunks.shift(),r=new EncodedVideoChunk({type:n.type,timestamp:n.timestamp,data:n.data});try{t.decoder.decode(r)}catch(t){console.error(`Error decoding pending chunk for stripe Y=${e}:`,t,r)}}}let gs=[],_s=()=>{},vs=null,ys=null,bs=null,xs=!1,Ss=null,Cs=0,ws=mi(),Ts=hi(),Es=gi();function Ds(){return c?(vs||(vs=document.createElement(`canvas`),ys=vs.getContext(`2d`,{desynchronized:!0})),(vs.width!==c.width||vs.height!==c.height)&&(vs.width=c.width,vs.height=c.height,bs=null,xs=!1),ys):null}let Os=null,ks=!1,As=0,js=0;function Ms(){if(Os){try{Os.terminate()}catch{}Os=null}ks=!1,As=0,js=0}function Ns(){if(Os)return!0;if(!ja||typeof Worker>`u`||typeof OffscreenCanvas>`u`||typeof createImageBitmap!=`function`)return!1;try{let e=URL.createObjectURL(new Blob([`
let back = null, bctx = null;
function ensureBack(w, h) {
  if (!back || back.width !== w || back.height !== h) {
    back = new OffscreenCanvas(w, h);
    bctx = back.getContext('2d', { desynchronized: true, alpha: false });
  }
}
self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'resize') { ensureBack(m.width, m.height); return; }
  if (m.type === 'stripe') {
    if (bctx) { try { bctx.drawImage(m.frame, 0, m.yPos); } catch (err) {} }
    try { m.frame.close(); } catch (err) {}
    return;
  }
  if (m.type === 'commit') {
    if (!back) return;
    createImageBitmap(back).then((bitmap) => { self.postMessage({ type: 'frame', bitmap: bitmap, at: m.at }, [bitmap]); }).catch(() => {});
    return;
  }
};
`],{type:`text/javascript`}));Os=new Worker(e),URL.revokeObjectURL(e)}catch{return Os=null,!1}return console.info(`[Selkies] striped codecs: compositing on an OffscreenCanvas in a worker.`),Os.onerror=()=>Ms(),Os.onmessage=e=>{let t=e.data;if(t&&t.type===`frame`){if(l&&c&&c.width>0&&c.height>0){try{l.drawImage(t.bitmap,0,0)}catch{}J.open&&Ii.drawn(t.at)}try{t.bitmap.close()}catch{}}},As=0,js=0,!0}function Ps(){return Ns()?(ks=!0,c.width>0&&c.height>0&&(As!==c.width||js!==c.height)&&(Os.postMessage({type:`resize`,width:c.width,height:c.height}),As=c.width,js=c.height,bs=null,xs=!1)):(ks=!1,Ds()),!!(c&&c.width>0&&c.height>0)}function Fs(e,t){if(ks&&Os)try{Os.postMessage({type:`stripe`,frame:e,yPos:t},[e]);return}catch{}else if(ys)try{ys.drawImage(e,0,t)}catch{}try{e.close()}catch{}}function Is(){$i++,ze=performance.now(),Ss=bs,Cs=performance.now();let e=Ls>0?Ls:NaN;if(Ls=-1/0,ks&&Os)try{Os.postMessage({type:`commit`,at:e})}catch{}else l&&c.width>0&&c.height>0&&(l.drawImage(vs,0,0),J.open&&Ii.drawn(e))}let Ls=-1/0,Rs={};function zs(){I!==null&&(clearTimeout(I),I=null),Dt=0}function Bs(){if(G)return;let e=window.videoChunksReceived;Jc(),setTimeout(()=>{if(!(document.hidden||window.videoChunksReceived!==e)&&C&&u&&u.readyState===WebSocket.OPEN){console.warn(`No video since the tab came back; restarting the stream.`);try{u.send(`START_VIDEO`)}catch{return}Hs()}},2500)}function Vs(){if(I=null,document.hidden)Dt=0;else if(!u||u.readyState!==WebSocket.OPEN)Dt=0;else if(Dt++,Dt<=3){console.warn(`No video after START_VIDEO; resend attempt ${Dt}/3.`);try{u.send(`START_VIDEO`)}catch{}I=setTimeout(Vs,Ot)}else{console.warn(`START_VIDEO watchdog exhausted; forcing websocket reconnect.`),Dt=0;try{u.close()}catch{}}}function Hs(){I!==null&&clearTimeout(I),Dt=0,I=setTimeout(Vs,Ot)}function Us(){kt!==null&&(clearInterval(kt),kt=null),R=0,jt=0}function Ws(){G&&kt===null&&(L=performance.now(),R=0,jt=0,kt=setInterval(()=>{if(document.hidden||pr||fr!==`ready`){L=performance.now();return}if(!u||u.readyState!==WebSocket.OPEN)return;let e=performance.now(),t=e-L;if(t<Mt||e<jt)return;R++;let n=Math.min(Mt*2**(R-1),3e4);jt=e+n,console.warn(`Shared mode: no video chunk for ${Math.round(t)}ms; resending START_VIDEO (attempt ${R}, next retry in ${n}ms).`);try{u.send(`START_VIDEO`)}catch{}},1e3))}function Gs(e,t){if(Io&&Zo(),q.format=t.format,J.open&&Hi(t),Gt(H)&&e===0){if(Jr.decoded(),document.hidden||d===`websockets`&&!G&&!C){try{t.close()}catch{}return}if(gs.length>0){for(let e of gs)try{e.frame.close()}catch{}J.open&&Ii.superseded(gs.length),gs.length=0}let e=Lt[0];if(e&&(t=Es(t,e.width,e.height)),!(Oa&&oo(t))&&!(ka&&vo(t))){c&&l&&c.width>0&&c.height>0&&(l.drawImage(t,0,0),J.open&&Ii.drawn(Bi(t.timestamp)));try{t.close()}catch{}}ze=performance.now(),Yi||sc()}else gs.push({yPos:e,frame:t,frameId:t.timestamp,at:J.open?q.arrivals.get(t.timestamp):NaN}),_s()}let Ks=wn({canUpload:()=>!G}),qs=Ks.handleRequestFileUpload,Js=Ks.handleFileInputChange,Ys=Ks.handleDragOver,Xs=Ks.handleDrop,Zs=async()=>{if(Bt===null){if(`wakeLock`in navigator)try{Bt=await navigator.wakeLock.request(`screen`),Bt.addEventListener(`release`,()=>{console.log(`Screen Wake Lock was released automatically.`),Bt=null}),console.log(`Screen Wake Lock is active.`)}catch(e){console.warn(`Could not acquire Wake Lock: ${e.name}, ${e.message}`)}else console.warn(`Wake Lock API is not supported by this browser.`)}},Qs=()=>{Zs()},$s=e=>{e.preventDefault()},ec=async()=>{Bt!==null&&(await Bt.release(),Bt=null)};function tc(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{e.apply(this,r)},t)}}function nc(){Y&&Y.classList.add(`hidden`),ra&&ra.classList.add(`hidden`)}function rc(e){if(!Et||typeof e!=`string`)return!1;let t=performance.now();if(t-Et>F)return!1;if(e.startsWith(`kh,`)||e.startsWith(`js,h`))return!0;let n=Tt[Tt.length-1];if(n&&(e.startsWith(`m,`)||e.startsWith(`m2,`))){let r=n.message.split(`,`),i=e.split(`,`);if(r[0]===i[0]&&r[3]===i[3]&&r[4]===i[4]&&!(Number(i[3])&248))return i[0]===`m2`&&(i[1]=String(Number(r[1])+Number(i[1])),i[2]=String(Number(r[2])+Number(i[2]))),n.message=i.join(`,`),n.at=t,!0}return Tt.push({message:e,at:t}),!0}function ic(){let e=Tt;Tt=[],Et=0;let t=performance.now();for(let{message:n,at:r}of e)t-r>F&&!n.startsWith(`ku,`)||u.send(n)}function ac(){xt=!1,Ct!==null&&clearTimeout(Ct),Ct=null}function oc(){let e=wt;wt=null,e&&!G&&(e.toggled.has(`video`)&&!e.video&&u&&u.readyState===WebSocket.OPEN&&u.send(`STOP_VIDEO`),e.microphone&&zc(),e.webcam&&Hc())}let sc=()=>{Yi||xt&&!St||(Yi=!0,ac(),nc(),console.log(`Stream started (UI elements hidden).`))},cc=()=>{if(Zi){console.log(`Input already initialized. Skipping.`);return}p!==null&&p>0&&(sr=p-1,console.log(`Input Initialization: Applying server-provided slot ${p}. Gamepad will target index ${sr}.`)),Zi=!0,console.log(`Initializing Input system...`);let e,n=e=>{rc(e)||(u&&u.readyState===WebSocket.OPEN?u.send(e):console.warn(`initializeInput: WebSocket not open, cannot send input message:`,e))};if(!X){console.error(`initializeInput: overlayInput element not found. Cannot initialize input handling.`),Zi=!1;return}if(e=new Ft(X,n,G,sr,U,p),e.displayId=M,e.setFingerScroll(Jt),e.motionBacklog=()=>u?u.bufferedAmount:0,e.setShortcutsEnabled(In),e.onmenuhotkey=()=>{window.postMessage({type:`toggleDashboard`},window.location.origin)},e.ongamepadhotkey=()=>{window.postMessage({type:`toggleTouchGamepad`},window.location.origin)},e.gamingMode=wa,e.ongamingmode=e=>{wa=e,window.postMessage({type:`gamingModeUpdate`,active:e},window.location.origin)},e.onnotice=(e,t)=>{window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:e,message:t,code:e}},window.location.origin)},e.getWindowResolution=()=>{let e=document.querySelector(`.video-container`);if(!e)return console.warn(`initializeInput: .video-container not found, using window inner dimensions for resolution calculation.`),[window.innerWidth,window.innerHeight];let t=e.getBoundingClientRect();return[t.width,t.height]},e.ongamepadconnected=t=>{console.log(`Client: Gamepad "${t}" connected. isSharedMode: ${G}, isGamepadEnabled (global toggle): ${Pe}`);let n=e.gamepadManager;n?G?(n.enable(),console.log(`Shared mode: Gamepad connected, ensuring its GamepadManager is active for polling.`)):Pe?(n.enable(),console.log(`Primary mode: Gamepad connected, master gamepad toggle is ON. Ensuring its GamepadManager is active.`)):(n.disable(),console.log(`Primary mode: Gamepad connected, but master gamepad toggle is OFF. Disabling its GamepadManager.`)):console.warn(`Client: gamepadManager not found in ongamepadconnected. Cannot control its polling state.`)},e.ongamepaddisconnected=()=>{console.log(`Gamepad disconnected.`)},e.attach(),f===`viewer`){let t=p===null?`(no slot)`:`(gamepad-only slot ${p})`;console.log(`Role is 'viewer' ${t}. Detaching context to disable mouse/keyboard/touch.`),e.detach_context()}window.webrtcInput=e,e.setDisplayLayouts(t,M),Tn(),Dn(),Fn(),An(),Nn(),X&&(X.addEventListener(`pointerdown`,Qs),X.addEventListener(`contextmenu`,$s));let r=()=>{if(!We)return;if(G){console.log(`Shared mode: handleResizeUI (auto-resize logic) skipped.`),z&&B&&z>0&&B>0&&as(z,B,!0);return}if(window.manual_resolution){console.log(`handleResizeUI: Auto-resize skipped, manual resolution mode is active.`);return}if(window.enable_resize===!1&&M!==`display2`){console.log(`handleResizeUI: Auto-resize skipped, dynamic resizing is disabled.`);return}console.log(`handleResizeUI: Auto-resize triggered (e.g., by window resize event).`);let t=e.getWindowResolution(),n=Q(t[0]),r=Q(t[1]),i=Yt();Xt=i,e&&e.setStreamDensity&&e.setStreamDensity(i);let a=4080;n*i>a&&(n=Math.floor(a/i),n=Q(n)),r*i>a&&(r=Math.floor(a/i),r=Q(r)),n<=0||r<=0?console.warn(`handleResizeUI: Calculated invalid dimensions (${n}x${r}). Skipping resize send.`):(fs(),window.streamResolutionDiverged=!1,rs(n,r),os(n,r))};if(V=r,It=tc(()=>{hn(),r()},500),(()=>{let e=null,t=()=>{hn(),typeof V==`function`&&V(),n()},n=()=>{if(e)try{e.removeEventListener(`change`,t)}catch{}let n=window.devicePixelRatio||1;e=window.matchMedia(`(resolution: ${n}dppx)`),e.addEventListener(`change`,t,{once:!0})};n(),setInterval(()=>{(window.devicePixelRatio||1)!==pn&&t()},1e3)})(),G)console.log(`Shared mode: Auto-resize event listener (originalWindowResizeHandler) NOT attached.`);else if(window.manual_resolution)console.log(`initializeInput: Manual resolution mode active. Initial resolution already sent by onopen.`),z!=null&&B!=null&&z>0&&B>0?ls():console.warn(`initializeInput: Manual mode is set, but manual_width/Height are invalid. Canvas might not display correctly.`);else{console.log(`initializeInput: Auto-resolution mode. Attaching 'resize' event listener for subsequent changes.`),window.addEventListener(`resize`,It);let e=document.querySelector(`.video-container`),t,n;if(e){let r=e.getBoundingClientRect();t=Q(r.width),n=Q(r.height)}else t=Q(window.innerWidth),n=Q(window.innerHeight);(t<=0||n<=0)&&(console.warn(`initializeInput: Current auto-calculated dimensions are invalid (${t}x${n}). Defaulting canvas style to 1024x768 (logical) for initial setup. The resolution sent by onopen should prevail on the server.`),t=1024,n=768),os(t,n),console.log(`initializeInput: Canvas style reset to reflect current auto-dimensions: ${t}x${n} (logical). Initial resolution was already sent by onopen.`)}X&&!G?(X.addEventListener(`dragover`,Ys),X.addEventListener(`drop`,Xs)):X&&G?console.log(`Shared mode: Drag/drop file upload listeners NOT attached to overlayInput.`):console.warn(`initializeInput: overlayInput not found, cannot attach drag/drop listeners.`),console.log(`Input system initialized.`)},lc=null;function uc(){if(lc){try{lc.element.pause()}catch{}lc.element.srcObject=null,lc=null}}async function dc(){let e=dt&&dt!=="default";if(!(typeof AudioContext<`u`&&`setSinkId`in AudioContext.prototype)){if(lc&&lc.context!==h&&uc(),!h||!_)return;if(!e){lc&&(_.disconnect(),_.connect(h.destination),uc());return}if(typeof HTMLMediaElement>`u`||!(`setSinkId`in HTMLMediaElement.prototype)){console.warn(`Browser does not support setSinkId, cannot apply output device preference.`);return}try{if(!lc){let e=h.createMediaStreamDestination();try{e.channelCount=Nc()}catch{}let t=new Audio;t.srcObject=e.stream,lc={context:h,destination:e,element:t}}await lc.element.setSinkId(dt),_.disconnect(),_.connect(lc.destination),await lc.element.play(),console.log(`Playback output set to device: ${dt} (through a media element)`)}catch(e){console.error(`Error routing playback to output device (ID: ${dt}): ${e.name}`,e),h&&_&&(_.disconnect(),_.connect(h.destination)),uc()}}else if(!e)console.log(`No preferred output device set, using default.`);else if(h){if(h.state===`running`)try{await h.setSinkId(dt),console.log(`Playback AudioContext output set to device: ${dt}`)}catch(e){console.error(`Error setting sinkId on Playback AudioContext (ID: ${dt}): ${e.name}`,e)}else console.warn(`Playback AudioContext not running (state: ${h.state}), cannot set sinkId yet.`)}else console.log(`Playback AudioContext doesn't exist yet, sinkId will be applied on initialization.`)}window.addEventListener(`message`,hc,!1);function fc(){let e=window.webrtcInput&&window.webrtcInput.gamepadManager;e?G||Pe?(e.enable(),console.log(G?`Shared mode: GamepadManager polling stays active.`:`Gamepad toggle ON. Enabling GamepadManager polling.`)):(e.disable(),console.log(`Gamepad toggle OFF. Disabling GamepadManager polling.`)):console.warn(`Client: window.webrtcInput.gamepadManager not found; cannot apply the gamepad toggle.`)}function pc(e){if(G||M!==`primary`)return;let t=t=>e&&e[t]||null,n=(e,n)=>{let r=t(e);return r&&typeof r.value==`boolean`?r.value:n},r=e=>{let n=t(e);return!!(n&&n.value===!1&&n.locked)},i=e=>!A.has(e),a=!1;i(`video`)&&!n(`video_on_start`,!0)&&C&&(C=!1,nc(),window.postMessage({type:`pipelineStatusUpdate`,video:!1},window.location.origin),a=!0);let o=n(`audio_enabled`,!0)===!1;i(`audio`)&&!n(`audio_on_start`,!0)&&!o&&T&&(T=!1,window.postMessage({type:`pipelineStatusUpdate`,audio:!1},window.location.origin),s&&s.postMessage({type:`updatePipelineStatus`,data:{isActive:!1}}),u&&u.setAudioActive&&u.setAudioActive(!1),a=!0),i(`microphone`)&&!n(`microphone_on_demand`,!1)&&n(`microphone_on_start`,!1)&&Ye&&!r(`microphone_enabled`)&&zc(),i(`webcam`)&&!n(`webcam_on_demand`,!1)&&n(`webcam_on_start`,!1)&&Xe&&!r(`webcam_enabled`)&&Hc();let c=window.localStorage.getItem(`${hr}_isGamepadEnabled`)!==null;if(i(`gamepad`)&&!c){let e=n(`gamepad_on_start`,!0);Pe!==e&&(Pe=e,fc(),a=!0)}a&&mc()}function mc(){let e={type:`sidebarButtonStatusUpdate`,video:C,audio:T,microphone:E,webcam:Me,gamepad:Pe};console.log(`Posting sidebarButtonStatusUpdate:`,e),window.postMessage(e,window.location.origin)}function hc(e){if(e.origin!==window.location.origin){console.warn(`Received message from unexpected origin: ${e.origin}. Expected ${window.location.origin}. Ignoring.`);return}let t=e.data;if(typeof t!=`object`||!t)console.warn(`Received non-object message via window.postMessage:`,t);else if(!t.type)console.warn(`Received message without a type property:`,t);else switch(t.type){case`setVolume`:typeof t.value==`number`&&_&&(v=Math.max(0,Math.min(1,t.value)),_.gain.setValueAtTime(v,h.currentTime));break;case`setMute`:typeof t.value==`boolean`&&_&&(t.value===!0?_.gain.setValueAtTime(0,h.currentTime):_.gain.setValueAtTime(v,h.currentTime));break;case`sidebarVisibilityChanged`:break;case`statsOpen`:J.setOpen(t.open);break;case`setScaleLocally`:if(G){console.log(`Shared mode: setScaleLocally message ignored (forced true behavior).`);break}typeof t.value==`boolean`?(Qi=t.value,la(`scaleLocallyManual`,Qi),console.log(`Set scaleLocallyManual to ${Qi} and persisted.`),window.manual_resolution&&z!==null&&B!==null&&(console.log(`Applying new scaling style in manual mode.`),as(z,B,Qi))):console.warn(`Invalid value received for setScaleLocally:`,t.value);break;case`setSynth`:window.webrtcInput&&typeof window.webrtcInput.setSynth==`function`&&window.webrtcInput.setSynth(t.value);break;case`showVirtualKeyboard`:if(G){console.log(`Shared mode: showVirtualKeyboard message ignored.`);break}ir(document.getElementById(`overlayInput`))||console.error(`Could not find #keyboard-input-assist element to focus.`);break;case`setUseCssScaling`:if(typeof t.value==`boolean`){let e=U!==t.value;if(U=t.value,t.persist!==!1&&la(`useCssScaling`,U),console.log(`Set useCssScaling to ${U}${t.persist===!1?`.`:` and persisted.`}`),window.webrtcInput&&typeof window.webrtcInput.updateCssScaling==`function`&&window.webrtcInput.updateCssScaling(U),en(),e){if(To(),window.manual_resolution&&z!=null&&B!=null)rs(z,B),as(z,B,Qi);else if(G)z&&B&&as(z,B,!0);else if(window.enable_resize!==!1||M===`display2`){let e=window.webrtcInput?window.webrtcInput.getWindowResolution():[window.innerWidth,window.innerHeight],t=Q(e[0]),n=Q(e[1]);rs(t,n),os(t,n)}Qo(`useCssScaling changed`)}}else console.warn(`Invalid value received for setUseCssScaling:`,t.value);break;case`setAntiAliasing`:if(typeof t.value==`boolean`){let e=gn!==t.value;gn=t.value,la(`antiAliasingEnabled`,gn),console.log(`Set antiAliasingEnabled to ${gn} and persisted.`),e&&(To(),is())}else console.warn(`Invalid value received for setAntiAliasing:`,t.value);break;case`setUseBrowserCursors`:typeof t.value==`boolean`?(Cn=t.value,la(`use_browser_cursors`,Cn),console.log(`Set use_browser_cursors to ${Cn} and persisted.`),Tn()):console.warn(`Invalid value received for setUseBrowserCursors:`,t.value);break;case`setRawPointerMotion`:typeof t.value==`boolean`?(En=t.value,la(`raw_pointer_motion`,En),console.log(`Set raw_pointer_motion to ${En} and persisted.`),Dn()):console.warn(`Invalid value received for setRawPointerMotion:`,t.value);break;case`setTrackpadSpeed`:typeof t.value==`number`&&Number.isFinite(t.value)?(kn=t.value,da(`trackpad_speed`,String(kn)),An()):console.warn(`Invalid value received for setTrackpadSpeed:`,t.value);break;case`setGamepadRumble`:typeof t.value==`boolean`?(Mn=t.value,la(`gamepad_rumble`,Mn),Nn()):console.warn(`Invalid value received for setGamepadRumble:`,t.value);break;case`setMacCmdAsCtrl`:typeof t.value==`boolean`?(Pn=t.value,la(`mac_cmd_as_ctrl`,Pn),console.log(`Set mac_cmd_as_ctrl to ${Pn} and persisted.`),Fn()):console.warn(`Invalid value received for setMacCmdAsCtrl:`,t.value);break;case`setManualResolution`:{if(G){console.log(`Shared mode: setManualResolution message ignored.`);break}if(window.enable_resize===!1&&M!==`display2`){console.log(`setManualResolution ignored: the server keeps this display's size (enable_resize=false).`);break}let e=parseInt(t.width,10),n=parseInt(t.height,10);if(isNaN(e)||e<=0||isNaN(n)||n<=0){console.error(`Received invalid width/height for setManualResolution:`,t);break}console.log(`Setting manual resolution: ${e}x${n} (logical)`),window.manual_resolution=!0,z=Q(e),B=Q(n),console.log(`Rounded logical resolution to even numbers: ${z}x${B}`),ii(ca,[`manual_resolution`,`manual_width`,`manual_height`]),sa(`manual_width`,z),sa(`manual_height`,B),la(`manual_resolution`,!0),ls(),un(`manual resolution set`),rs(z,B),Qo(`manual resolution set`),as(z,B,Qi),qt(H)&&(console.log(`Clearing VNC stripe decoders due to manual resolution change.`),fs(),l&&l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height));break}case`resetResolutionToWindow`:if(G){console.log(`Shared mode: resetResolutionToWindow message ignored.`);break}if(console.log(`Resetting resolution to window size.`),window.manual_resolution=!1,z=null,B=null,ii(ca,[`manual_resolution`,`manual_width`,`manual_height`]),sa(`manual_width`,null),sa(`manual_height`,null),la(`manual_resolution`,!1),window.enable_resize!==!1||M===`display2`){let e=window.webrtcInput?window.webrtcInput.getWindowResolution():[window.innerWidth,window.innerHeight];os(Q(e[0]),Q(e[1])),qt(H)&&(console.log(`Clearing VNC stripe decoders due to resolution reset to window.`),fs(),l&&l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height))}un(`manual resolution cleared`),ss(),Qo(`manual resolution cleared`);break;case`settings`:console.log(`Received settings message:`,t.settings),yc(t.settings);break;case`getStats`:console.log(`Received getStats message.`),Sc();break;case`clipboardUpdateFromUI`:if(console.log(`Received clipboardUpdateFromUI message.`),G){console.log(`Shared mode: Clipboard write to server blocked.`);break}ar(t.text);break;case`printRequest`:xr(t.url);break;case`clipboardCopySecret`:Yn.copySecret();break;case`clipboardImageUpdate`:if(G){console.log(`Shared mode: Clipboard image write to server blocked.`),gc(`viewers cannot set the clipboard`,`clipboardSkipReadonly`);break}if(!t.imageBlob){gc(`no image selected`,`clipboardSkipNoImage`);break}if(!Gn){gc(`image clipboard is disabled on the server (enable_binary_clipboard)`,`clipboardSkipBinaryDisabled`);break}ar(t.imageBlob,t.imageBlob.type||`image/png`,gc).catch(e=>{console.warn(`Failed to send uploaded clipboard image:`,e),gc(`send failed: `+e.message,`clipboardSkipSendFailed`)});break;case`pipelineStatusUpdate`:{console.log(`Received pipelineStatusUpdate message:`,t);let e=!1;t.video!==void 0&&C!==t.video&&(C=t.video,e=!0),t.audio!==void 0&&T!==t.audio&&(T=t.audio,e=!0),t.microphone!==void 0&&E!==t.microphone&&(E=t.microphone,e=!0),t.gamepad!==void 0&&Pe!==t.gamepad&&(Pe=t.gamepad,e=!0),e&&mc();break}case`pipelineControl`:{console.log(`Received pipeline control message: pipeline=${t.pipeline}, enabled=${t.enabled}`);let e=t.pipeline,n=t.enabled,r=``;if(e===`video`){if(G){console.log(`Shared mode: Video pipelineControl blocked.`);break}if(A.add(`video`),C!==n){if(C=n,r=n?`START_VIDEO`:`STOP_VIDEO`,!n){if(console.log(`Client: STOP_VIDEO requested via pipelineControl. Clearing canvas visually. Server will send PIPELINE_RESETTING for full state reset.`),l&&c)try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)}catch(e){console.error(`Error clearing canvas on STOP_VIDEO request:`,e)}}else if(console.log(`Client: START_VIDEO requested via pipelineControl. Clearing canvas visually. Server will send PIPELINE_RESETTING for full state reset.`),l&&c)try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)}catch(e){console.error(`Error clearing canvas on START_VIDEO request:`,e)}}}else if(e===`audio`){if(G){console.log(`Shared mode: Audio pipeline control blocked.`);break}if(M!==`primary`){console.log(`Secondary display: Audio control blocked.`);break}if(!Ge){console.log(`Audio is disabled. Audio pipeline control blocked.`);break}A.add(`audio`),T!==n&&(T=n,r=n?`START_AUDIO`:`STOP_AUDIO`,s&&s.postMessage({type:`updatePipelineStatus`,data:{isActive:T}}),u&&u.setAudioActive&&u.setAudioActive(T))}else if(e===`microphone`){if(G){console.log(`Shared mode: Microphone control blocked.`);break}if(!Ye){console.log(`Microphone is disabled. Microphone pipeline control blocked.`);break}A.add(`microphone`),Ze=!1,n?zc():Bc()}else if(e===`webcam`){if(G){console.log(`Shared mode: Webcam control blocked.`);break}if(!Xe){console.log(`Webcam is disabled. Webcam pipeline control blocked.`);break}A.add(`webcam`),Qe=!1,n?Hc():Uc()}else console.warn(`Received pipelineControl message for unknown pipeline: ${e}`);if(r&&u&&u.readyState===WebSocket.OPEN)try{u.send(r),console.log(`Sent command to server via WebSocket: ${r}`)}catch(e){console.error(`Error sending ${r} to WebSocket:`,e)}break}case`audioDeviceSelected`:{if(console.log(`Received audioDeviceSelected message:`,t),G&&t.context===`input`){console.log(`Shared mode: Audio input device selection ignored.`);break}if(!Ge){console.log(`Audio control flag is disabled. Audio device selection blocked.`);break}let{context:e,deviceId:n}=t;if(!n){console.warn(`Received audioDeviceSelected message without a deviceId.`);break}e===`input`?(P=n,E&&(Bc(),setTimeout(zc,150))):e===`output`?(dt=n,dc()):console.warn(`Unknown context in audioDeviceSelected message: ${e}`);break}case`gamepadControl`:{console.log(`Received gamepad control message: enabled=${t.enabled}`);let e=t.enabled;A.add(`gamepad`),Pe!==e&&(Pe=e,la(`isGamepadEnabled`,Pe),mc(),fc());break}case`requestFullscreen`:Ta(!1);break;case`requestGamingMode`:Ta(!0);break;case`command`:if(G){console.log(`Shared mode: Arbitrary command sending to server blocked.`);break}if(!mr){console.log(`Command sending suppressed: server has command_enabled=false; not sending 'cmd,'.`);break}if(typeof t.value==`string`){let e=t.value;if(console.log(`Received 'command' message with value: "${e}". Forwarding to WebSocket.`),u&&u.readyState===WebSocket.OPEN)try{u.send(`cmd,${e}`),console.log(`Sent command to server via WebSocket: cmd,${e}`)}catch(e){console.error(`Failed to send command via WebSocket:`,e)}else console.warn(`Cannot send command: WebSocket is not open or not available.`)}else console.warn(`Received 'command' message without a string value:`,t);break;case`touchinput:trackpad`:window.webrtcInput&&typeof window.webrtcInput.setTrackpadMode==`function`&&(tn=!0,la(`trackpadMode`,!0),window.webrtcInput.setTrackpadMode(!0));break;case`touchinput:touch`:window.webrtcInput&&typeof window.webrtcInput.setTrackpadMode==`function`&&(tn=!1,la(`trackpadMode`,!1),window.webrtcInput.setTrackpadMode(!1))}}function gc(e,t){console.warn(`Clipboard image upload skipped: `+e),window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`clipboard-image`,message:e,code:t}},window.location.origin)}function _c(e){let t=Kt()||e&&e.message||String(e);console.error(`Failed to write the session image to the local clipboard:`,e),window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`clipboard-image`,message:t,code:`clipboardImageWriteFailed`}},window.location.origin)}async function vc(e,t=`text/plain`,n=null){let r=(e,t)=>{n&&n(e,t)};if(window.clipboard_enabled===void 0){r(`the session has not reported its clipboard policy yet`,`clipboardSkipNotConnected`);return}if(!window.clipboard_enabled){r(`the server has the clipboard turned off`,`clipboardSkipDisabled`);return}if(!_n){r(`the client-to-session clipboard is turned off`,`clipboardSkipInDisabled`);return}if(!u||u.readyState!==WebSocket.OPEN){console.warn(`Cannot send clipboard data: WebSocket is not open.`),r(`not connected`,`clipboardSkipNotConnected`);return}let i=e instanceof ArrayBuffer||e instanceof Uint8Array,a;i?a=new Uint8Array(e):(a=new TextEncoder().encode(e),t=`text/plain`);let o=e;if(i)try{let{byteLength:e,hash:t}=await Un.hashBytes(a.slice().buffer);o=Wt(e,t)}catch{}if(!qn.shouldSend(o,t)){r(`already the current clipboard`,`clipboardSkipUnchanged`);return}let s=!1;await jn(a,t,{worker:Un,send:e=>u.send(e),waitDrain:async()=>{for(;u.bufferedAmount>65536;)if(await new Promise(e=>setTimeout(e,20)),u.readyState!==WebSocket.OPEN)return s=!0,!1;return!0},chunkRawBytes:16383,nextTid:()=>++Hn}),!s&&u.readyState===WebSocket.OPEN?qn.markSynced(o,t):r(`connection lost during send`,`clipboardSkipSendFailed`)}function yc(e,t,n=!0){let r=t?()=>{}:sa,i=t?()=>{}:la,a=t?()=>{}:da;t||ii(ca,Object.keys(e)),console.log(`Applying settings:`,e);let o=!1;if(e.framerate!==void 0){let n=e.framerate===Fr;t||(Jr.reset(),$&&$.postMessage({type:`decodePaceReset`}),qr!==null&&ti(null)),a(`framerate`,n?Fr:String(parseFloat(e.framerate)));let r=n?es():parseFloat(e.framerate);Number.isFinite(r)&&(Ur=r),o=!0}if(e.webcam_encoder!==void 0){let t=String(e.webcam_encoder);cr.includes(t)&&t!==$e&&($e=t,a(`webcam_encoder`,t),j&&(Uc(),Hc()))}if(e.encoder!==void 0){let n=e.encoder;if(t||_a(n),!t&&!pe(n)){let t=Ko(n);console.warn(`This browser has no decoder for ${n}; using the ${t} encoder.`),n=t,ga(t,`no decoder for ${e.encoder}`)}H!==n&&(H=n,uo(),a(`encoder`,H),o=!0,n!==`h264enc-striped`&&fs(),Ac(),jc(),setTimeout(()=>{if(u&&u.readyState===WebSocket.OPEN)try{u.send(`REQUEST_KEYFRAME`),Fi.keyframes++}catch{}},1500))}if(e.video_crf!==void 0&&(ai=parseInt(e.video_crf,10),r(`video_crf`,ai),o=!0),e.video_fullcolor!==void 0&&(K=!!e.video_fullcolor,i(`video_fullcolor`,K),o=!0,fs()),e.video_10bit!==void 0&&(oi=!!e.video_10bit,i(`video_10bit`,oi),o=!0),e.video_streaming_mode!==void 0&&(si=!!e.video_streaming_mode,i(`video_streaming_mode`,si),o=!0),e.jpeg_quality!==void 0&&(ci=parseInt(e.jpeg_quality,10),r(`jpeg_quality`,ci),o=!0),e.paint_over_jpeg_quality!==void 0&&(li=parseInt(e.paint_over_jpeg_quality,10),r(`paint_over_jpeg_quality`,li),o=!0),e.use_cpu!==void 0&&(ui=!!e.use_cpu,i(`use_cpu`,ui),o=!0,fs()),e.cpu_encode_threading!==void 0&&(_i=!!e.cpu_encode_threading,i(`cpu_encode_threading`,_i),t||nt.add(`cpu_encode_threading`),o=!0),e.video_paintover_crf!==void 0&&(vi=parseInt(e.video_paintover_crf,10),r(`video_paintover_crf`,vi),o=!0),e.video_paintover_burst_frames!==void 0&&(wi=parseInt(e.video_paintover_burst_frames,10),r(`video_paintover_burst_frames`,wi),o=!0),e.use_paint_over_quality!==void 0&&(Ei=!!e.use_paint_over_quality,i(`use_paint_over_quality`,Ei),t||nt.add(`use_paint_over_quality`),o=!0),e.scaling_dpi!==void 0&&(an=parseInt(e.scaling_dpi,10),o=!0,U&&!window.manual_resolution&&!G&&typeof V==`function`&&V()),e.enable_binary_clipboard!==void 0&&(Gn=!!e.enable_binary_clipboard,i(`enable_binary_clipboard`,Gn),o=!0),e.keyboard_shortcuts!==void 0&&(In=!!e.keyboard_shortcuts,i(`keyboard_shortcuts`,In),Ln()),e.clipboard_seamless!==void 0&&(Sn=!!e.clipboard_seamless,i(`clipboard_seamless`,Sn)),e.print_auto!==void 0&&(Ca.setAutomatic(e.print_auto),i(`print_auto`,!!e.print_auto)),e.clipboard_in_enabled!==void 0&&(_n=!!e.clipboard_in_enabled,i(`clipboard_in_enabled`,_n),o=!0),e.clipboard_out_enabled!==void 0&&(bn=!!e.clipboard_out_enabled,i(`clipboard_out_enabled`,bn),o=!0),e.use_css_scaling!==void 0){let n={type:`setUseCssScaling`,value:!!e.use_css_scaling,persist:!t};hc({origin:window.location.origin,data:n})}e.use_browser_cursors!==void 0&&(Cn=!!e.use_browser_cursors,Tn()),e.raw_pointer_motion!==void 0&&(En=!!e.raw_pointer_motion,Dn()),e.mac_cmd_as_ctrl!==void 0&&(Pn=!!e.mac_cmd_as_ctrl,Fn()),e.debug===void 0?(e.rate_control_mode!==void 0&&(ia=e.rate_control_mode,a(`rate_control_mode`,ia),xc(ia),o=!0),e.video_bitrate!==void 0&&(ki=parseInt(e.video_bitrate,10),r(`video_bitrate`,ki),t||je(M),o=!0),e.audio_bitrate!==void 0&&(Oi=parseInt(e.audio_bitrate,10),r(`audio_bitrate`,Oi),o=!0),e.force_aligned_resolution!==void 0&&(Ai=!!e.force_aligned_resolution,i(`force_aligned_resolution`,Ai),o=!0),o&&n&&Qo(`handleSettingsMessage`,t?null:Object.keys(e))):(Ji=e.debug,la(`debug`,Ji),console.log(`Applied debug setting: ${Ji}. Reloading...`),setTimeout(()=>{window.location.reload()},700))}function bc(e){if(G)return;let t=ri(ca,hr,e,vr(`the settings of a display it shares`));if(Object.keys(t).length!==0){console.log(`[display] Streaming with what the display does:`,t);for(let[e,n]of Object.entries(t))window[e]=n;yc(t,!0,!1),t.encoder!==void 0&&Xo(t.encoder,qe&&qe.encoder),qe&&window.postMessage({type:`serverSettings`,payload:{...qe}},window.location.origin)}}function xc(e){e===`cbr`?ki=aa(`video_bitrate`,ki):e===`crf`&&(ai=aa(`video_crf`,ai))}function Sc(){let e={info:window.stream_info,client:window.stream_client,latest:window.stream_stats.latest,clientFps:window.fps,audioBuffer:window.currentAudioBufferSize,audioUnderrunSamples:window.currentAudioUnderrunSamples,audioDropped:window.currentAudioDropped+window.currentAudioWorkletDropped,isVideoPipelineActive:C,isAudioPipelineActive:T,isMicrophoneActive:E,isWebcamActive:Me};e.encoderName=H,e.video_fullcolor=K,e.video_10bit=oi,e.video_streaming_mode=si,window.parent.postMessage({type:`stats`,data:e},window.location.origin),console.log(`Sent stats message via window.postMessage:`,e)}function Cc(){if(!Zc())return;G||(window.displayRefreshRate=null,Gr=Xr(e=>{window.displayRefreshRate=e,window.postMessage({type:`displayRefresh`,rate:e},window.location.origin),ts(`display refresh`)}));let a=Te()+`/`;nr=nn({isChromium:Kn,getDeferredWriteInFlight:()=>Jn.getInFlight(),isSharedMode:()=>G,canSync:()=>!!window.clipboard_enabled&&Sn,canRead:()=>!!_n,binaryEnabled:()=>!!Gn,sendClipboardData:(e,t,n)=>vc(e,t,n),clipboardSync:qn});let o=()=>nr.readAndSend(),ee=()=>nr.maybeInitial();Kn&&window.addEventListener(`focus`,()=>{o()}),fn({isChromium:Kn,clipboardSync:qn,sendClipboardData:(e,t)=>vc(e,t),canSync:()=>!G&&!!window.clipboard_enabled&&Sn,canRead:()=>!!_n,canWrite:()=>!!bn,binaryEnabled:()=>!!Gn,getSendInFlight:()=>nr.getSendInFlight(),getDeferredWriteLanding:()=>Jn.getLanding(),hasPendingServerWrite:()=>Jn.hasPending(),readLocalClipboard:o}).wire();let ae=()=>{if(l&&c)try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)}catch(e){console.error(`Error clearing canvas on visibility change:`,e)}},b=null,x=!1,S=()=>{if(x&&u&&u.readyState===WebSocket.OPEN)try{u.send(document.hidden?`PAGE_HIDDEN`:`PAGE_SHOWN`)}catch{}},oe=!1,se=()=>{if(u&&u.readyState===WebSocket.OPEN&&C&&(u.send(`STOP_VIDEO`),C=!1,oe=!0,window.postMessage({type:`pipelineStatusUpdate`,video:!1},window.location.origin),console.log(`Tab hidden: Sent STOP_VIDEO. Clearing canvas visually. Server will send PIPELINE_RESETTING for full state reset.`),l&&c))try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)}catch(e){console.error(`Error clearing canvas on tab hidden:`,e)}};document.addEventListener(`visibilitychange`,async()=>{if(G){if(!u||u.readyState!==WebSocket.OPEN)return;if(document.hidden){if(!pr){pr=!0;try{u.send(`STOP_VIDEO`)}catch{}ae(),window.postMessage({type:`pipelineStatusUpdate`,video:!1},window.location.origin),console.log(`Shared mode: tab hidden, sent STOP_VIDEO to pause this viewer's feed.`)}}else{if(pr){pr=!1;try{u.send(`START_VIDEO`)}catch{}Hs(),window.postMessage({type:`pipelineStatusUpdate`,video:!0},window.location.origin),console.log(`Shared mode: tab visible, sent START_VIDEO to resume this viewer's feed.`)}Bt===null&&(console.log(`Tab is visible again, re-acquiring Wake Lock.`),await Zs())}}else if(S(),document.hidden)b===null&&(b=setTimeout(()=>{b=null,document.hidden&&(console.log(`Tab is hidden, stopping video pipeline if active.`),se())},250));else{if(b!==null&&(clearTimeout(b),b=null),!oe&&C&&Bs(),oe&&(oe=!1,console.log(`Tab is visible, resuming the video pipeline paused on hide.`),u&&u.readyState===WebSocket.OPEN&&(u.send(`START_VIDEO`),C=!0,Hs(),window.postMessage({type:`pipelineStatusUpdate`,video:!0},window.location.origin),console.log(`Tab visible: Sent START_VIDEO. Clearing canvas visually. Server will send PIPELINE_RESETTING for full state reset.`),l&&c)))try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)}catch(e){console.error(`Error clearing canvas on tab visible/start:`,e)}Bt===null&&(console.log(`Tab is visible again, re-acquiring Wake Lock.`),await Zs())}});let le={imagedecoder:async e=>{let t=new ImageDecoder({data:e,type:`image/jpeg`});try{return(await t.decode()).image}finally{try{t.close()}catch{}}},bitmap:e=>createImageBitmap(new Blob([e],{type:`image/jpeg`})),img:e=>{let t=URL.createObjectURL(new Blob([e],{type:`image/jpeg`})),n=new Image;return n.src=t,n.decode().then(()=>n,e=>{throw URL.revokeObjectURL(t),e}).then(e=>(URL.revokeObjectURL(t),e))}};function de(e,t){let n=new TextEncoder().encode(`sel`+t.toString(36).padStart(9,`0`)),r=new Uint8Array(e),i=new Uint8Array(r.length+4+n.length);i[0]=255,i[1]=216,i[2]=255,i[3]=254;let a=n.length+2;return i[4]=a>>8&255,i[5]=a&255,i.set(n,6),i.set(r.subarray(2),6+n.length),i}let pe=null,me=null;async function he(){let e=Object.keys(le).filter(e=>(e!==`imagedecoder`||typeof ImageDecoder<`u`)&&(e!==`bitmap`||typeof createImageBitmap==`function`)&&(e!==`img`||typeof Image<`u`));if(e.length<=1)return e[0]||null;let t=1920,n,r;try{n=[];for(let e=0;e<8;e++){let r=document.createElement(`canvas`);r.width=t,r.height=136;let i=r.getContext(`2d`);i.fillStyle=`#204080`,i.fillRect(0,0,t,136),i.lineWidth=3,i.strokeStyle=`#c8c828`;for(let n=0;n<t;n+=40)i.beginPath(),i.moveTo(n+e,0),i.lineTo(n+e,136),i.stroke();let a=await new Promise(e=>r.toBlob(e,`image/jpeg`,.75));n.push(await a.arrayBuffer())}r=document.createElement(`canvas`),r.width=t,r.height=1088}catch{return e[0]}let i=r.getContext(`2d`),a=0;for(let t of e)try{let e=await le[t](de(n[0],a++));i.drawImage(e,0,0);try{e.close()}catch{}}catch{}let o=null;for(let t of e)try{let e=performance.now();for(let e=0;e<2;e++)await Promise.all(n.map(async(e,n)=>{let r=await le[t](de(e,a++));i.drawImage(r,0,n*136);try{r.close()}catch{}}));let r=performance.now()-e;(!o||r<o.ms)&&(o={name:t,ms:r})}catch{}return o?o.name:e[0]}async function ge(e,t,n,r){Se++;try{let i=pe;if(!i&&(me||=he().then(e=>(pe=e,e&&console.log(`[jpeg] decoding stripes through ${e}`),e)).catch(()=>null),i=typeof ImageDecoder<`u`?`imagedecoder`:typeof createImageBitmap==`function`?`bitmap`:null,!i)){console.warn(`No JPEG decoder available (ImageDecoder and createImageBitmap both missing).`);return}xe.push({image:await le[i](t),startY:e,frameId:n,at:r}),ve()}catch(n){console.error(`Error decoding JPEG stripe:`,n,`startY:`,e,`dataLength:`,t.byteLength)}finally{Se--}}let _e=!1;function ve(){_e||(_e=!0,requestAnimationFrame(()=>{_e=!1,ye()}))}_s=ve;function ye(){if(!c||!l){ve();return}if(ce||Ma){let e=Gt(H);ce&&!e&&Co(),Ma&&!e&&!Ga&&go()}let e=G?1:window.devicePixelRatio||1;if(G&&z&&B&&z>0&&B>0){let t=Q(z*e),n=Q(B*e);(c.width!==t||c.height!==n)&&(console.log(`Shared mode (paintVideoFrame): Canvas buffer ${c.width}x${c.height} out of sync with expected physical ${t}x${n} (logical: ${z}x${B}). Re-applying style.`),as(z,B,!0))}let t=!1;if(Gt(H)){let e=!1;if(gs.length>0){let t=gs.length-1;for(let e=0;e<t;e++)try{gs[e].frame.close()}catch{}J.open&&Ii.superseded(t);let n=gs[t].frame;if(gs.length=0,ze=performance.now(),!(Oa&&oo(n))&&!(ka&&vo(n))){c.width>0&&c.height>0&&(l.drawImage(n,0,0),J.open&&Ii.drawn(Bi(n.timestamp)));try{n.close()}catch{}}e=!0}e&&!Yi&&sc()}else if(H===`h264enc-striped`){ka&&!$&&!Wa&&Xa<3&&ho();let e=!1,t=Ps(),n=ms(),r=n&&ws.settled(),i=!1;if(t)for(let t of gs){let n=t.frameId;!r&&bs!==null&&n!==bs&&xs&&(Is(),xs=!1,e=!0),bs=n,t.yPos+t.frame.displayHeight>=c.height&&(i=!0),Fs(t.frame,t.yPos),t.at>Ls&&(Ls=t.at),xs=!0}else for(let e of gs)try{e.frame.close()}catch{}gs=[],n&&(r||i)&&xs&&c.width>0&&c.height>0&&(Is(),xs=!1,e=!0),e&&!Yi&&sc()}else if(H===`jpeg`){ka&&!$&&!Wa&&Xa<3&&ho();let e=Se===0,n=e&&ws.settled(),r=!1;if(l&&xe.length>0){if(c.width===0||c.height===0||c.width===300&&c.height===150){let e=xe[0],t=e&&e.image&&(e.image.displayHeight??e.image.height),n=e&&e.image&&(e.image.displayWidth??e.image.width);e&&e.image&&(e.startY+t>c.height||n>c.width)&&console.warn(`[paintVideoFrame] Canvas dimensions (${c.width}x${c.height}) may be too small for JPEG stripes.`)}let e=Ps();for(;xe.length>0;){let i=xe.shift();if(i&&i.image){let a=i.frameId,o=Rs[i.startY];if(a!==void 0&&o!==void 0){let e=o-a&65535;if(e>0&&e<=256){try{i.image.close()}catch{}continue}}try{if(e){!n&&a!==void 0&&bs!==null&&a!==bs&&xs&&(Is(),xs=!1),a!==void 0&&(bs=a);let e=i.image.displayHeight??i.image.height;i.startY+e>=c.height&&(r=!0),Fs(i.image,i.startY),i.at>Ls&&(Ls=i.at),xs=!0}else try{i.image.close()}catch{}a!==void 0&&(Rs[i.startY]=a),t=!0}catch(e){if(console.error(`[paintVideoFrame] Error drawing JPEG segment:`,e,i),i.image&&typeof i.image.close==`function`)try{i.image.close()}catch{}}}}t&&(Yi||(sc(),!Zi&&!G&&cc()))}e&&(n||r)&&xs&&l&&c.width>0&&c.height>0&&(Is(),xs=!1)}J.open&&Ii.land(),(gs.length>0||xe.length>0||xs)&&ve()}function be(){if(!s||!y)return;let e=new MessageChannel;try{y.postMessage({type:`pcmPort`,port:e.port1},[e.port1]),s.postMessage({type:`pcmPort`,port:e.port2},[e.port2])}catch(e){console.warn(`Could not connect the audio decoder to the worklet directly:`,e)}}function Ce(){if(!s||!u||typeof u.connectAudio!=`function`)return;let e=new MessageChannel;try{s.postMessage({type:`audioIn`,port:e.port1},[e.port1]),u.connectAudio(e.port2)}catch(e){console.warn(`Could not connect the socket worker to the audio decoder:`,e)}}let we=`
let ws = null, audioPort = null, audioOn = true, primary = true;
let lastTick = 0;

// Encoded webcam frames sent while the socket was down would corrupt the
// server's decoder as deltas; held back until a keyframe restores the chain.
let webcamChainBroken = false;
// Video divert: 0x03/0x04 go straight to the video worker while the page
// keeps this on, and the newest frame id is acked from here on the same
// cadence the page would use, so pacing and RTT stay honest through a stall.
// Full frames ack on receipt; the striped modes ack the id the video worker
// reports presented, so a client that cannot render sheds load. An unchanged
// id is repeated on the heartbeat cadence, as the page path does.
let videoPort = null, videoDivert = false, videoAck = false, videoAckSource = 'receive';
let videoLastId = -1, videoLastIdAt = 0, videoAckedId = -1, videoAckSentAt = 0, videoAckTimer = null;
// While the page has its stats open, each message is dated with its arrival
// (epoch ms), which the thread that shows a frame measures its delay from.
let statsOn = false;

// The page gates its own sends on what this reports, so a socket left holding
// bytes has to be reported as it drains: reporting only on send would freeze
// the page's view at the moment of a message too big for its gate, and nothing
// would ever send again to correct it.
let bufferedTimer = null;
function reportBuffered() {
  self.postMessage({ type: 'buffered', amount: ws ? ws.bufferedAmount : 0 });
  if (!ws || ws.bufferedAmount === 0) {
    if (bufferedTimer) { clearInterval(bufferedTimer); bufferedTimer = null; }
    return;
  }
  if (bufferedTimer) return;
  bufferedTimer = setInterval(() => {
    self.postMessage({ type: 'buffered', amount: ws ? ws.bufferedAmount : 0 });
    if (!ws || ws.bufferedAmount === 0) { clearInterval(bufferedTimer); bufferedTimer = null; }
  }, 20);
}

function syncVideoAckTimer() {
  const want = videoDivert && videoAck;
  if (want && !videoAckTimer) {
    videoAckTimer = setInterval(() => {
      if (videoLastId < 0) return;
      if (!ws || ws.readyState !== 1) return;
      const now = performance.now();
      if (videoLastId === videoAckedId && now - videoAckSentAt < ${Pt}) return;
      // The hold: how long the id waited on this tick, which a backgrounded
      // tab clamps to a second. The server subtracts it, so the round trip it
      // reports stays the path's rather than this timer's.
      const held = Math.max(0, Math.round(now - videoLastIdAt));
      try { ws.send('CLIENT_FRAME_ACK ' + videoLastId + ' ' + held); videoAckedId = videoLastId; videoAckSentAt = now; } catch (err) {}
    }, 50);
  } else if (!want && videoAckTimer) {
    clearInterval(videoAckTimer);
    videoAckTimer = null;
  }
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'audioPort') { audioPort = m.port; return; }
  if (m.type === 'audioState') { audioOn = !!m.active; return; }
  if (m.type === 'videoPort') {
    videoPort = m.port;
    videoPort.onmessage = (ev) => {
      const pm = ev.data;
      if (pm && pm.presentedId !== undefined) { videoLastId = pm.presentedId; videoLastIdAt = performance.now(); }
    };
    return;
  }
  if (m.type === 'videoState') {
    videoDivert = !!m.divert;
    videoAck = !!m.ack;
    videoAckSource = m.ackSource || 'receive';
    syncVideoAckTimer();
    return;
  }
  if (m.type === 'stats') { statsOn = !!m.on; return; }
  if (m.type === 'videoAckReset') {
    // The server's ids restart; the heartbeat must not repeat the old one.
    videoLastId = -1; videoAckedId = -1; videoAckSentAt = 0;
    return;
  }
  if (m.type === 'sendPort') {
    // Fully framed messages from another worker (the microphone encoder).
    m.port.onmessage = (ev) => {
      if (!ws || ws.readyState !== 1) return;
      try { ws.send(ev.data); } catch (err) { /* onclose reports */ }
    };
    return;
  }
  if (m.type === 'webcamPort') {
    m.port.onmessage = (ev) => {
      const f = ev.data;
      if (!ws || ws.readyState !== 1) { webcamChainBroken = true; return; }
      if (webcamChainBroken && !f.keyframe) {
        try { ev.target.postMessage({ needKeyframe: true }); } catch (err) {}
        return;
      }
      const msg = new Uint8Array(3 + f.buffer.byteLength);
      msg[0] = 0x06;
      msg[1] = f.codecId;
      msg[2] = (f.keyframe ? 0x01 : 0x00) | ((((f.rotation || 0) / 90) & 0x03) << 1) | (f.flip ? 0x08 : 0x00);
      msg.set(new Uint8Array(f.buffer), 3);
      try {
        ws.send(msg.buffer);
        if (f.keyframe) webcamChainBroken = false;
      } catch (err) { webcamChainBroken = true; }
    };
    return;
  }
  if (m.type === 'open') {
    primary = m.primary !== false;
    try {
      ws = new WebSocket(m.url, m.protocols || []);
    } catch (err) {
      // Uncaught here, the page would wait on a socket that never opens.
      self.postMessage({ type: 'close', code: 1006, reason: '', wasClean: false });
      return;
    }
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => self.postMessage({ type: 'open' });
    ws.onerror = () => self.postMessage({ type: 'error' });
    ws.onclose = (ev) => {
      self.postMessage({ type: 'close', code: ev.code, reason: ev.reason, wasClean: ev.wasClean });
      ws = null;
    };
    ws.onmessage = (ev) => {
      const d = ev.data;
      const at = statsOn ? performance.timeOrigin + performance.now() : 0;
      if (audioPort && audioOn && primary && d instanceof ArrayBuffer &&
          d.byteLength >= 2 && new Uint8Array(d, 0, 1)[0] === 0x01) {
        // The page still owns the AudioContext, which only it can resume, so it
        // is told audio is arriving -- rarely, since this runs per packet.
        const now = Date.now();
        if (now - lastTick > 1000) { lastTick = now; self.postMessage({ type: 'audioTick' }); }
        audioPort.postMessage({ buffer: d }, [d]);
        return;
      }
      if (videoPort && videoDivert && d instanceof ArrayBuffer && d.byteLength > 6) {
        const t = new Uint8Array(d, 0, 1)[0];
        if (t === 0x03 || (t === 0x04 && d.byteLength > 10)) {
          if (videoAckSource === 'receive') {
            const head = new Uint8Array(d, 2, 2);
            videoLastId = (head[0] << 8) | head[1];
            videoLastIdAt = performance.now();
          }
          if (at) videoPort.postMessage({ buffer: d, at }, [d]);
          else videoPort.postMessage(d, [d]);
          return;
        }
      }
      if (d instanceof ArrayBuffer) {
        // Padding (0x07) is dropped here rather than handed to the page.
        if (d.byteLength >= 1 && new Uint8Array(d, 0, 1)[0] === 0x07) return;
        self.postMessage({ type: 'message', data: d, at }, [d]);
      } else self.postMessage({ type: 'message', data: d });
    };
    return;
  }
  if (!ws) return;
  if (m.type === 'send') {
    try { ws.send(m.data); } catch (err) { /* a closing socket reports through onclose */ }
    reportBuffered();
    return;
  }
  if (m.type === 'close') { try { ws.close(m.code, m.reason); } catch (err) {} return; }
};
`;class Ee{constructor(e,t,n=[]){this.readyState=WebSocket.CONNECTING,this.binaryType=`arraybuffer`,this.onopen=this.onmessage=this.onerror=this.onclose=null,this._listeners={},this._buffered=0;let r=new Blob([we],{type:`text/javascript`}),i=URL.createObjectURL(r);this._worker=new Worker(i),URL.revokeObjectURL(i),this._worker.onmessage=e=>{let t=e.data;if(t.type===`message`){let e={data:t.data,at:t.at};this.onmessage&&this.onmessage(e),this._emit(`message`,e)}else t.type===`buffered`?this._buffered=t.amount:t.type===`audioTick`?h&&h.state!==`running`&&h.resume().catch(()=>{}):t.type===`open`?(this.readyState=WebSocket.OPEN,this.onopen&&this.onopen(),this._emit(`open`,{})):t.type===`error`?(this.onerror&&this.onerror(t),this._emit(`error`,t)):t.type===`close`&&(this.readyState=WebSocket.CLOSED,this.onclose&&this.onclose(t),this._emit(`close`,t),this._retire())},this._worker.postMessage({type:`open`,url:e,primary:t,protocols:n})}get bufferedAmount(){return this._buffered}addEventListener(e,t){(this._listeners[e]||(this._listeners[e]=[])).push(t)}removeEventListener(e,t){let n=this._listeners[e];if(!n)return;let r=n.indexOf(t);r>=0&&n.splice(r,1)}_emit(e,t){let n=this._listeners[e];if(n)for(let e of n.slice())try{e(t)}catch{}}connectAudio(e){try{this._worker.postMessage({type:`audioPort`,port:e},[e])}catch{}}setAudioActive(e){try{this._worker.postMessage({type:`audioState`,active:e})}catch{}}connectSend(e){try{this._worker.postMessage({type:`sendPort`,port:e},[e])}catch{}}connectWebcam(e){try{this._worker.postMessage({type:`webcamPort`,port:e},[e])}catch{}}connectVideo(e){try{this._worker.postMessage({type:`videoPort`,port:e},[e])}catch{}}setVideoDivert(e,t){let n=!!e&&M===`primary`&&!G;try{this._worker.postMessage({type:`videoState`,divert:!!e,ack:n,ackSource:t||`receive`})}catch{}}setStats(e){try{this._worker.postMessage({type:`stats`,on:!!e})}catch{}}resetVideoAck(){try{this._worker.postMessage({type:`videoAckReset`})}catch{}}send(e){if(this.readyState!==WebSocket.OPEN)return;if(typeof e==`string`){this._buffered+=e.length,this._worker.postMessage({type:`send`,data:e});return}let t=e instanceof ArrayBuffer?e:ArrayBuffer.isView(e)?e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength):e;this._buffered+=t.byteLength||0,this._worker.postMessage({type:`send`,data:t},[t])}close(e,t){this.readyState=WebSocket.CLOSING;try{this._worker.postMessage({type:`close`,code:e,reason:t})}catch{}this._retire()}_retire(){this._retiring||(this._retiring=!0,setTimeout(()=>{try{this._worker.terminate()}catch{}},2e3))}}async function De(){if(M!==`primary`)console.log(`Secondary display: Audio pipeline initialization skipped.`);else if(!window.isAudioInitializing){if(s&&h&&h.state!==`closed`&&g)return Ce(),!0;window.isAudioInitializing=!0;try{if(s){console.warn(`Terminating existing audio worker during init.`);let e=s;s=null,e.postMessage({type:`close`}),await new Promise(e=>setTimeout(e,50)),e.terminate()}if(h){console.warn(`Closing existing AudioContext during init.`);try{await h.close()}catch(e){console.error(e)}h=null,uc(),g=null,y=null}h||(navigator.audioSession&&navigator.audioSession.type===`play-and-record`||Rc(`playback`),h=new(window.AudioContext||window.webkitAudioContext)({sampleRate:48e3}),console.log(`Playback AudioContext initialized. Actual sampleRate:`,h.sampleRate,`Initial state:`,h.state),h.onstatechange=()=>{h&&(console.log(`Playback AudioContext state changed to: ${h.state}`),h.state===`running`&&dc())});try{await h.audioWorklet.addModule(Nt(`
        class AudioFrameProcessor extends AudioWorkletProcessor {
            constructor(options) {
                super();
                this.channels = (options && options.processorOptions && options.processorOptions.channels) || 2;
                this.audioBufferQueue = [];
                this.currentAudioData = null;
                this.currentDataOffset = 0;

                // Adaptive jitter depth under a fixed drop-oldest ceiling.
                // Output starts once target packets are queued; a mid-stream
                // underrun that a late delivery caused deepens the target, a
                // clean stretch decays it back, and standing depth above it is
                // trimmed a packet at a time -- so steady latency sits at the
                // smallest depth the delivery path has recently proven to
                // hold, and a jittery one (a stall upstream, Gecko routing
                // the socket through the page's thread) buys the depth it
                // demonstrably needs. The depths are durations counted in
                // packets of the frame duration the stream carries (see
                // _learnFrame), so they mean the same at every setting.
                this.frameSamples = 0;
                this._learnFrame(480);
                this.target = this.TARGET_MIN;
                this.priming = true;
                this.overCount = 0;
                this.cleanCount = 0;
                // Packets left at the moment one is pulled, tracked at its
                // minimum: the slack that proves a shallower target safe.
                // Pulls since the last arrival are held apart and committed
                // by the next one, unless the sender went quiet between them,
                // since a drain into its silence proves nothing about the
                // delivery.
                this.shiftSlackMin = Infinity;
                this.drainSlackMin = Infinity;
                // The server says when its silence gate closes (a bare quiet
                // mark): what is queued then plays out at once, however short,
                // instead of waiting for packets that are not coming, and
                // running dry after it is the sender's silence. An underrun is
                // judged by what ends it, since the mark can trail the last
                // packet by up to a frame: a packet means a late delivery,
                // which deepens the target, and the mark means silence. The
                // frame the server sends right behind the mark, carrying the
                // end of the sound, is marked too (\`ending\`): it is appended
                // to the sound, and whatever it ends is silence as well.
                this.senderQuiet = false;
                this.underrunPending = false;
                this.pendingUnderrunSamples = 0;

                // Concealment counters: zero-filled samples output on underrun, and
                // packets dropped by the drop-oldest ring when the queue overflows.
                this.underrunSamples = 0;
                this.droppedOldest = 0;
                // Every seam is smoothed over 2 ms: output fades in when priming
                // ends, the last sample decays to silence when the queue runs
                // dry, and a dropped packet's head is blended into the head of
                // the one after it -- a step at any of them is a click on tonal
                // content.
                this.FADE = Math.round(sampleRate * 0.002);
                this.fadeIn = 0;
                this.fadeOut = 0;
                this.lastOut = new Float32Array(Math.max(this.channels, 8));
                // Output RMS accumulator (channel 0), reported with each stats reply.
                this._levelAcc = 0;
                this._levelCount = 0;

                this.enqueue = (buffer, ending) => {
                    const pcmData = new Float32Array(buffer);
                    this._learnFrame(pcmData.length / this.channels);
                    if (ending) {
                        this.underrunPending = false;
                        this.pendingUnderrunSamples = 0;
                        this.senderQuiet = true;
                    } else {
                        if (this.underrunPending) {
                            this.underrunPending = false;
                            this.target = Math.min(this.target + this.STEP, this.TARGET_MAX);
                            this.underrunSamples += this.pendingUnderrunSamples;
                            this.pendingUnderrunSamples = 0;
                            this.cleanCount = 0;
                            this.shiftSlackMin = Infinity;
                            this.drainSlackMin = Infinity;
                        }
                        if (this.senderQuiet) this.senderQuiet = false;
                        else if (this.drainSlackMin < this.shiftSlackMin) this.shiftSlackMin = this.drainSlackMin;
                    }
                    this.drainSlackMin = Infinity;
                    if (this.audioBufferQueue.length >= this.MAX_BUFFER_PACKETS) this._dropHead();
                    this.audioBufferQueue.push(pcmData);
                };
                const receive = (data) => {
                    if (!data) return;
                    if (data.audioData) {
                        this.enqueue(data.audioData, !!data.quiet);
                    } else if (data.quiet) {
                        this.senderQuiet = true;
                        this.underrunPending = false;
                        this.pendingUnderrunSamples = 0;
                    }
                };
                this.port.onmessage = (event) => {
                    if (event.data.audioData || event.data.quiet) {
                        receive(event.data);
                    } else if (event.data.type === 'pcmPort' && event.data.port) {
                        // The decoder worker's own line in: decoded packets then
                        // reach this processor whatever the page's thread is doing.
                        event.data.port.onmessage = (m) => receive(m.data);
                    } else if (event.data.type === 'getBufferSize') {
                        const bufferMillis = this.audioBufferQueue.reduce((total, buf) => total + (buf.length / this.channels / sampleRate) * 1000, 0);
                        const level = this._levelCount > 0 ? Math.sqrt(this._levelAcc / this._levelCount) : 0;
                        this._levelAcc = 0;
                        this._levelCount = 0;
                        this.port.postMessage({
                            type: 'audioBufferSize',
                            size: this.audioBufferQueue.length,
                            durationMs: bufferMillis,
                            underrunSamples: this.underrunSamples,
                            droppedOldest: this.droppedOldest,
                            level: level
                        });
                    }
                };
            }

            process(inputs, outputs, parameters) {
                const output = outputs[0];
                if (!output || !output[0]) {
                    return true;
                }
                // The decoder hands interleaved f32 data with this.channels channels;
                // de-interleave into however many output channels were configured.
                const chans = output.length;
                const samplesPerBuffer = output[0].length;

                if (this.priming) {
                    const held = this.audioBufferQueue.length;
                    if (held < this.target && !(this.senderQuiet && held > 0)) {
                        this._silence(output, 0);
                        return true;
                    }
                    this.priming = false;
                    this.fadeIn = this.FADE;
                    this.fadeOut = 0;
                }

                if (this.audioBufferQueue.length === 0 && this.currentAudioData === null) {
                    this.fadeOut = this.FADE;
                    this._silence(output, 0);
                    // Full-buffer concealment.
                    this._reprime(samplesPerBuffer);
                    return true;
                }

                let data = this.currentAudioData;
                let offset = this.currentDataOffset;

                for (let sampleIndex = 0; sampleIndex < samplesPerBuffer; sampleIndex++) {
                    if (!data || offset >= data.length) {
                        if (this.audioBufferQueue.length > 0) {
                            const slack = this.audioBufferQueue.length - 1;
                            if (slack < this.drainSlackMin) this.drainSlackMin = slack;
                            data = this.currentAudioData = this.audioBufferQueue.shift();
                            offset = this.currentDataOffset = 0;
                        } else {
                            this.currentAudioData = null;
                            this.currentDataOffset = 0;
                            this.fadeOut = this.FADE;
                            this._silence(output, sampleIndex);
                            // Partial concealment.
                            this._reprime(samplesPerBuffer - sampleIndex);
                            return true;
                        }
                    }

                    const gain = this.fadeIn > 0 ? (this.FADE - this.fadeIn-- + 1) / (this.FADE + 1) : 1;
                    for (let c = 0; c < chans; c++) {
                        const v = offset < data.length ? data[offset++] * gain : output[0][sampleIndex];
                        output[c][sampleIndex] = v;
                        this.lastOut[c] = v;
                    }
                    const s0 = output[0][sampleIndex];
                    this._levelAcc += s0 * s0;
                    this._levelCount++;
                }

                this.currentDataOffset = offset;
                if (data && offset >= data.length) {
                    this.currentAudioData = null;
                    this.currentDataOffset = 0;
                }

                // Reclaims latency: depth held above target is a standing
                // delay, dropped one packet per window; long clean runs
                // shrink the target.
                if (this.audioBufferQueue.length > this.target) {
                    if (++this.overCount >= 250) {
                        this._dropHead();
                        this.overCount = 0;
                    }
                } else {
                    this.overCount = 0;
                }
                if (++this.cleanCount >= 2000) {
                    this.cleanCount = 0;
                    // Decay only over proven slack: a whole packet must have
                    // stayed spare at every pull, else a shallower target is
                    // a periodic audible probe rather than a reclaim.
                    if (this.target > this.TARGET_MIN && this.shiftSlackMin >= 2 * this.STEP) {
                        this.target = Math.max(this.TARGET_MIN, this.target - this.STEP);
                    }
                    this.shiftSlackMin = Infinity;
                }

                return true;
            }

            /**
             * Writes silence from \`from\` on, after the rest of a fade-out:
             * the last sample output decaying to zero over the fade.
             * @param {Float32Array[]} output The quantum's output channels.
             * @param {number} from First sample to write.
             */
            _silence(output, from) {
                const n = output[0].length;
                let k = from;
                for (; k < n && this.fadeOut > 0; k++, this.fadeOut--) {
                    const g = this.fadeOut / (this.FADE + 1);
                    for (let c = 0; c < output.length; c++) output[c][k] = this.lastOut[c] * g;
                }
                for (let c = 0; c < output.length; c++) output[c].fill(0, k);
            }

            /**
             * Drops the oldest queued packet, blending its head into the head
             * of the packet after it: the dropped head continues whatever
             * played before it, so the seam starts where the audio left off.
             */
            _dropHead() {
                const gone = this.audioBufferQueue.shift();
                this.droppedOldest++;
                const next = this.audioBufferQueue[0];
                if (!gone || !next) return;
                const ch = this.channels;
                const frames = Math.min(this.FADE, gone.length / ch, next.length / ch);
                for (let f = 0; f < frames; f++) {
                    const w = (f + 1) / (frames + 1);
                    for (let c = 0; c < ch; c++) {
                        const i = f * ch + c;
                        next[i] = gone[i] + (next[i] - gone[i]) * w;
                    }
                }
            }

            /**
             * Restarts priming after the queue ran dry: after the quiet mark
             * that is the sender's silence, otherwise what ends it says
             * whether the target deepens.
             * @param {number} samples Samples zero-filled when it ran dry.
             */
            _reprime(samples) {
                this.priming = true;
                this.overCount = 0;
                if (this.senderQuiet) return;
                this.underrunPending = true;
                this.pendingUnderrunSamples += samples;
            }

            /**
             * Sizes the depths for packets of \`frames\` samples per
             * channel. A target of N packets starts output once N are
             * queued, which leaves N - 1 packets of arrival slack behind the
             * one playing, so the durations are slack: the target keeps its
             * floor of two packets, deepens and decays in steps of 5 ms, and
             * stops once 50 ms of slack is reached, with the drop-oldest
             * ceiling 20 ms above that, each rounded up to whole packets --
             * two, six, one, and eight at the default 10 ms frame.
             * @param {number} frames Samples per channel in one packet.
             */
            _learnFrame(frames) {
                if (!(frames > 0) || frames === this.frameSamples) return;
                this.frameSamples = frames;
                const ms = frames * 1000 / sampleRate;
                const packets = (d) => Math.max(1, Math.ceil(d / ms - 1e-9));
                this.TARGET_MIN = 2;
                this.TARGET_MAX = 1 + packets(50);
                this.STEP = packets(5);
                this.MAX_BUFFER_PACKETS = this.TARGET_MAX + packets(20);
                if (this.target !== undefined) {
                    this.target = Math.min(Math.max(this.target, this.TARGET_MIN), this.TARGET_MAX);
                }
            }
        }
        registerProcessor('audio-frame-processor', AudioFrameProcessor);
      `));let e=Nc();if(e>2)try{h.destination.channelCount=Math.min(e,h.destination.maxChannelCount||e)}catch(e){console.warn(`Could not widen audio destination:`,e)}g=new AudioWorkletNode(h,`audio-frame-processor`,{numberOfOutputs:1,outputChannelCount:[e],processorOptions:{channels:e}}),y=g.port,be(),y.onmessage=e=>{e.data.type===`audioBufferSize`&&(window.currentAudioBufferSize=e.data.size,window.currentAudioBufferDuration=e.data.durationMs,e.data.underrunSamples!==void 0&&(window.currentAudioUnderrunSamples=e.data.underrunSamples),e.data.droppedOldest!==void 0&&(window.currentAudioWorkletDropped=e.data.droppedOldest),e.data.level!==void 0&&(window.currentAudioLevel=Math.min(100,Math.round(e.data.level*141))))},_=h.createGain(),_.gain.value=v,g.connect(_),_.connect(h.destination),console.log(`Playback AudioWorkletProcessor initialized and connected through a GainNode for volume control.`),await dc();let t=new Blob([Ic],{type:`application/javascript`}),n=URL.createObjectURL(t);if(s=new Worker(n),URL.revokeObjectURL(n),be(),Ce(),s.onmessage=e=>{let{type:t,reason:n,message:r}=e.data;if(t===`decoderInitFailed`)console.error(`[Main] Audio Decoder Worker failed to initialize: ${n}`);else if(t===`decoderError`)console.error(`[Main] Audio Decoder Worker reported error: ${r}`);else if(t===`decoderInitialized`)console.log(e.data.wasm?`[Main] Audio Decoder Worker decodes on libopus in WASM, the engine having no AudioDecoder.`:`[Main] Audio Decoder Worker confirmed its decoder is initialized.`);else if(t===`decodedAudioData`){let t=e.data.pcmBuffer;t&&y&&h&&h.state===`running`&&window.currentAudioBufferDuration<80&&y.postMessage(e.data.quiet?{audioData:t,quiet:!0}:{audioData:t},[t])}else t===`audioQuiet`&&y&&y.postMessage({quiet:!0})},s.onerror=e=>{console.error(`[Main] Uncaught error in Audio Decoder Worker:`,e.message,e),s&&=(s.terminate(),null)},y){let e=Nc();s.postMessage({type:`init`,data:{initialPipelineStatus:T,channels:e,description:e>2?Fc(e):null,opusUrl:Pc()}}),console.log(`[Main] Audio Decoder Worker created and init message sent.`)}else console.error(`[Main] audioWorkletProcessorPort is null, cannot initialize audioDecoderWorker correctly.`)}catch(e){console.error(`Error initializing Playback AudioWorklet:`,e),h&&h.state!==`closed`&&h.close(),h=null,uc(),g=null,y=null}}finally{window.isAudioInitializing=!1}}}async function Oe(){s?(console.log(`[Main] Requesting Audio Decoder Worker to reinitialize its decoder.`),s.postMessage({type:`reinitialize`})):(console.warn(`[Main] Cannot initialize decoder audio: Audio Decoder Worker not available. Call initializeAudio() first.`),d===`websockets`&&!h&&(console.log(`[Main] Audio context missing, attempting to initialize full audio pipeline for websockets.`),await De()))}let ke=location.protocol===`http:`?`ws://`:`wss://`,je=new URL(`${ke}${window.location.host}${a}`),O=xn();if(m)O.length===0&&(je.search=`?token=${encodeURIComponent(ur)}`);else if(G){let e=new URLSearchParams;if(e.set(`role`,`viewer`),or&&or.startsWith(`player`)){let t=or.replace(`player`,``);t>=2&&t<=4&&e.set(`slot`,t)}je.search=e.toString()}je.pathname+=`api/websockets`;let Ne=lr.get(`socket_worker`),Ve=Ne===null?Z(`socket_worker`,!0):Ne.toLowerCase()===`true`,He=()=>{try{if(!Ve)throw Error(`socket_worker=false`);u=new Ee(je.href,M===`primary`,O),J.open&&u.setStats(!0)}catch(e){Ve&&console.warn(`[websockets] socket worker unavailable, reading on the page:`,e),u=new WebSocket(je.href,O),u.binaryType=`arraybuffer`}window.selkiesTransport=u,Ce(),Ga=!1,lo()};He();let it=()=>{if(!Ga&&u&&u.readyState===WebSocket.OPEN)try{let e=(H===`jpeg`||H===`h264enc-striped`)&&Ss!==null,t=e?Ss:Fe,n=e?Cs:k,r=performance.now();if(t!==-1&&t!==null&&(t!==Le||r-Re>=Pt)){let e=Math.max(0,Math.round(r-n));u.send(`CLIENT_FRAME_ACK ${t} ${e}`),Le=t,Re=r}}catch(e){console.error(`[Backpressure] Error sending frame ACK:`,e)}},at=()=>{if(y&&y.postMessage({type:`getBufferSize`}),Gi(),G)return;let e=performance.now(),t=e-ta,n=e-na,r=1e3,i=ea.size+qa;if(i>0){if(t>=r){let n=i*1e3/t;window.fps=Math.round(n),ea.clear(),qa=0,ta=e,$i=0,na=e}}else if($i>0){if(n>=r){let t=$i*1e3/n;window.fps=Math.round(t),$i=0,na=e,ta=e}}else(t>=r||n>=r)&&(window.fps=0,na=e,ta=e);Vr(),Hr()},N=async()=>{console.log(`[websockets] Connection opened!`),vt=performance.now(),_t=0,Si=!1,ji=`connected_waiting_mode`,Mi=`Connection established. Waiting for server mode...`,Da(),await Do(),await Ao(),await ue===`avcc`&&console.info(`[Selkies] H.264 decodes here with an avcC description; frames are reframed for it.`),Oc().then(e=>{e&&location.reload()}),wc=!0;try{sessionStorage.removeItem(`selkies_mode_flip`)}catch{}if(typeof DecompressionStream<`u`)try{u.send(`_gz,1`)}catch{}try{u.send(`_pad,1`)}catch{}if(window.postMessage({type:`trackpadModeUpdate`,enabled:tn},window.location.origin),G)console.log(`Shared mode: WebSocket opened. Waiting for 'MODE websockets' from server to start identification sequence.`);else{let e=`${hr}_`,t={},n=Yt(),r=[`video_crf`,`encoder`,`manual_resolution`,`audio_bitrate`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`jpeg_quality`,`paint_over_jpeg_quality`,`use_cpu`,`cpu_encode_threading`,`video_paintover_crf`,`video_paintover_burst_frames`,`use_paint_over_quality`,`scaling_dpi`,`enable_binary_clipboard`,`rate_control_mode`,`video_bitrate`,`force_aligned_resolution`],i=[`manual_resolution`,`video_fullcolor`,`video_10bit`,`video_streaming_mode`,`use_cpu`,`cpu_encode_threading`,`use_paint_over_quality`,`enable_binary_clipboard`,`force_aligned_resolution`],a=[`video_crf`,`audio_bitrate`,`jpeg_quality`,`paint_over_jpeg_quality`,`video_paintover_crf`,`video_paintover_burst_frames`,`scaling_dpi`,`video_bitrate`];for(let n in localStorage)if(Object.hasOwnProperty.call(localStorage,n)&&n.startsWith(e)){let o=n.substring(e.length),s=`_${M}`,c=M!==`primary`&&o.endsWith(s),l=c?o.slice(0,-s.length):o;if(!c&&M!==`primary`&&rt.includes(l))continue;if(r.includes(l)){if(tt.includes(l)&&!nt.has(l)&&localStorage.getItem(`${n}_explicit_choice`)!==`true`)continue;let e=localStorage.getItem(n);if(i.includes(l))e=e===`true`;else if(a.includes(l)&&(e=parseInt(e,10),isNaN(e)))continue;t[l]=e}}if(t.encoder!==void 0&&ha()&&(t.encoderFallback=!0),window.manual_resolution&&z!=null&&B!=null)t.manual_resolution=!0,t.manual_width=Q(z),t.manual_height=Q(B);else{let e=document.querySelector(`.video-container`),r=e?e.getBoundingClientRect():{width:window.innerWidth,height:window.innerHeight};t.manual_resolution=!1,t.initialClientWidth=Q(r.width*n),t.initialClientHeight=Q(r.height*n)}t.scaling_dpi===void 0&&(t.scaling_dpi=cn()),Kr=es(),Kr!==null&&(t.framerate=Kr),xi&&(t.keyboardLayout=xi),t.useCssScaling=U,t.displayId=M,t.tabId=w();let o=D(M);o!==null&&(t.ccStartKbps=o),t.displayScale=$o(n),Qt=n,M===`display2`&&(t.displayPosition=et),t.audioRedundancy=!0;try{let e=`SETTINGS,${JSON.stringify(t)}`;u.send(e),Si=!0,qr!==null&&$r(),console.log(`[websockets] Sent initial settings (resolutions are physical) to server:`,t)}catch(e){console.error(`[websockets] Error constructing or sending initial settings:`,e)}}Xn.armLegacyWindow(5e3),u.send(`cr`),console.log(`[websockets] Sent initial clipboard request (cr) to server (cache-only).`),ic();let e=wt;A=e?new Set(e.toggled):new Set,Ke=!1,Je=!1,C=e&&e.toggled.has(`video`)?e.video:!0,T=e&&e.toggled.has(`audio`)?e.audio:M===`primary`,window.postMessage({type:`pipelineStatusUpdate`,video:C,audio:T},window.location.origin),ft===null&&(ft=setInterval(at,500),console.log(`[websockets] Started client metrics every 500ms.`)),G||(E=!1,pt===null&&(pt=setInterval(it,50),console.log(`[websockets] Started sending backpressure ACKs every 50ms.`)))},ot=Promise.resolve(),st=0,ct=async e=>{let t=new Response(new Blob([e]).stream().pipeThrough(new DecompressionStream(`gzip`)));return new TextDecoder().decode(await t.arrayBuffer())},lt=!1,ut=Promise.resolve(),P=0,dt=async e=>{let t=await new Response(new Blob([e]).stream().pipeThrough(new CompressionStream(`gzip`))).arrayBuffer(),n=new Uint8Array(t.byteLength+1);return n[0]=5,n.set(new Uint8Array(t),1),n.buffer},mt=e=>{let t=e.send.bind(e);e.send=e=>{lt&&typeof e==`string`&&e.length>=512?(P++,ut=ut.then(async()=>{try{t(await dt(e))}catch{t(e)}finally{P--}})):typeof e==`string`&&P>0?ut=ut.then(()=>t(e)):t(e)}},yt=a=>{if(a.data instanceof ArrayBuffer){let e=a.data,t=new DataView(e);if(e.byteLength<1||t.getUint8(0)===7)return;J.noteBytes(e.byteLength);let o=t.getUint8(0),c=J.open?a.at>0?a.at:performance.timeOrigin+performance.now():NaN;if((o===3||o===4)&&(window.videoChunksReceived++,Be=performance.now(),I!==null&&zs()),G&&(o===3||o===4)&&(L=performance.now(),R=0,jt=0),o===1){if(M!==`primary`||e.byteLength<2)return;if(T||G){if(s){h&&h.state!==`running`&&h.resume().catch(e=>console.error(`Error resuming audio context`,e));let t=(new Uint8Array(e,1,1)[0]&Ti)!==0;if(t&&e.byteLength<=2){s.postMessage({type:`quiet`});return}let n=Di(e).filter(e=>e.byteLength);for(let e=0;e<n.length;e++){if(!G&&window.currentAudioBufferDuration>=80){window.currentAudioDropped++;break}s.postMessage({type:`decode`,data:{opusBuffer:n[e],timestamp:performance.now()*1e3,quiet:t&&e===n.length-1}},[n[e]])}}else console.warn(`AudioDecoderWorker not ready. Attempting to initialize audio pipeline.`),De().then(()=>{if(s){let t=Di(e);for(let e of t)if(e.byteLength!==0){if(!G&&window.currentAudioBufferDuration>=80){window.currentAudioDropped++;break}s.postMessage({type:`decode`,data:{opusBuffer:e,timestamp:performance.now()*1e3}},[e])}}})}}else if(o===3){if(e.byteLength<6)return;Fo===`jpeg`&&(Fo=null);let n=t.getUint16(2,!1);ws.note(n),G||(Fe=n,k=performance.now());let r=t.getUint16(4,!1),i=e.slice(6);if(!G&&C&&H===`jpeg`||G&&H===`jpeg`){if(i.byteLength===0)return;ge(r,i,n,c)}}else if(o===4){if(e.byteLength<12)return;let a=t.getUint8(1),o=t.getUint16(2,!1);ws.note(o),G||(Fe=o,k=performance.now(),H!==`h264enc-striped`&&ea.add(Fe));let s=t.getUint16(4,!1),l=t.getUint16(6,!1),u=t.getUint16(8,!1),d=t.getUint16(10,!1),f=e.slice(12);if(G&&H!==`h264enc-striped`&&l>0&&u>0&&(z!==l||B!==u)&&(z=l,B=u,console.log(`Shared mode: stream is ${z}x${B} (physical).`),as(z,B,!0)),G&&typeof VideoDecoder>`u`){At||(At=!0,console.error(`Shared viewing needs WebCodecs VideoDecoder, which this browser lacks.`),Y&&(Y.textContent=`This browser cannot decode the shared stream (no WebCodecs).`,Y.classList.remove(`hidden`)));return}let p=r(a);if(Fo){if(n(a)!==i(Fo))return;Fo=null}if(za&&Gt(H)&&(G||C)){if(f.byteLength===0)return;if(p){let e=wo(a,f,l,u);e!==Ua&&(Ua=e)}if(So(p,f,l,u,Ua||wo(a,null,l,u),o,d,c))return}if(qt(H)&&(G||C)){if(f.byteLength===0)return;let e=Lt[s],t=p?`key`:`delta`,r=!e||!e.hasReceivedKeyframe;if(t===`delta`&&r){Jc();return}let i=e&&e.framed&&p&&!ie(ne(new Uint8Array(f)),e.description);if(!e||e.decoder.state===`closed`||i||e.decoder.state===`configured`&&(e.width!==l||e.height!==u)){if(e&&e.decoder.state!==`closed`)try{e.decoder.close()}catch(e){console.warn(`Error closing old VNC stripe decoder:`,e)}let t=new VideoDecoder({output:Gs.bind(null,s),error:e=>ps(e,s)});s===0&&Zr.configured(),Gt(H)&&Jr.cap!==null&&!za&&e&&(e.width!==l||e.height!==u)&&(Jr.reset(),ti(null));let r=wo(a,f,l,u),i=fe()===`avcc`&&r.startsWith(`avc1`),o=i?ne(new Uint8Array(f)):null,c=Lr({codec:r,codedWidth:l,codedHeight:u,optimizeForLatency:!0,colorSpace:te(r,Or),...o?{description:o}:{}});q.config=c,Ui(c),Lt[s]={decoder:t,pendingChunks:[],width:l,height:u,framed:i,description:o,hasReceivedKeyframe:!1},e=Lt[s],Ue||=performance.now(),Rr(c).then(e=>{if(e)return t.configure(e);{qo(r,n(a));let e=Error(`config not supported: ${r}`);return e.quiet=!0,Promise.reject(e)}}).then(()=>{hs(s)}).catch(e=>{if(e.quiet||console.error(`Error configuring VNC stripe decoder Y=${s}:`,e),Lt[s]&&Lt[s].decoder===t){try{t.state!==`closed`&&t.close()}catch{}delete Lt[s]}})}if(e){if(t===`delta`&&!e.hasReceivedKeyframe){Jc();return}let n=Gt(H);if(t===`key`&&(e.hasReceivedKeyframe=!0),n){let n=e.decoder.decodeQueueSize,r=Zr.decide(t===`key`,o,d,n);if(Jr.decided(n,r===`lost`||r===`overload`),r===`lost`){Kc(o);return}if(r===`no_key`||r===`overload`){e.hasReceivedKeyframe=!1,Jc();return}}else if(t===`delta`&&e.decoder.decodeQueueSize>8){e.hasReceivedKeyframe=!1,Jc();return}let r=H===`h264enc-striped`?o:Ts(),i={type:t,timestamp:r,data:e.framed?re(new Uint8Array(f)):f};if(e.decoder.state===`configured`){let t=new EncodedVideoChunk(i);J.open&&(Gt(H)&&q.starts.set(r,performance.now()),q.arrivals.set(Math.trunc(r),c));try{e.decoder.decode(t)}catch(e){Xc(e,`stripe_decode_Y=${s}`)}}else if(e.decoder.state===`unconfigured`||e.decoder.state===`configuring`){if(e.width&&(e.width!==l||e.height!==u)){console.warn(`Dropping stale stripe chunk for Y=${s}: ${l}x${u} vs decoder ${e.width}x${e.height}.`);return}e.pendingChunks.push(i)}else console.warn(`VNC stripe decoder for Y=${s} in unexpected state: ${e.decoder.state}. Dropping chunk.`)}}}else console.warn(`Unknown binary data payload type received:`,o)}else if(typeof a.data==`string`){if(a.data.startsWith(`CC_RATE `)){Ae(M,parseFloat(a.data.substring(8)));return}if(a.data.startsWith(`CONNECTION `)){J.setConnection(a.data.substring(11)===`poor`);return}if(a.data===`PAGE_VISIBILITY`){x=!0,S();return}if(a.data.startsWith(`DISPLAY_OWNER `)){console.log(`[websockets] This page owns the display now.`),Qo(`display owner`),typeof V==`function`&&V();return}if(a.data.startsWith(`KILL `)){let e=a.data.substring(5);console.error(`Received KILL message from server: ${e}`),Dc(),u&&(u.onclose=()=>{},u.close()),Y&&(Y.textContent=`Connection Terminated: ${e}`,Y.classList.remove(`hidden`));return}if(a.data.startsWith(`AUTH_SUCCESS,`)){let e;try{let t=a.data.substring(13);e=JSON.parse(t)}catch(e){console.error(`Failed to parse AUTH_SUCCESS message:`,e);return}f=e.role,p=e.slot,console.log(`Authentication successful. Received Role: ${f}, Slot: ${p}`),window.postMessage({type:`clientRoleUpdate`,role:f},window.location.origin),window.webrtcInput&&typeof window.webrtcInput.updateControllerSlot==`function`&&window.webrtcInput.updateControllerSlot(p),f===`viewer`&&(console.log(`Token-based client is a 'viewer'. Applying shared mode compatibility settings.`),G=!0,window.webrtcInput&&window.webrtcInput.setSharedMode(!0),or=`shared`,sr=p!==null&&p>0?p-1:void 0,(!z||z<=0||!B||B<=0)&&(z=1280,B=720),as(z,B,!0),window.addEventListener(`resize`,()=>{G&&z&&B&&z>0&&B>0&&as(z,B,!0)}),us(),We&&(console.log(`Post-init sync: Forcing shared mode state because 'MODE websockets' was handled before auth.`),fr=`ready`,u&&u.readyState===WebSocket.OPEN&&(u.send(`STOP_VIDEO`),setTimeout(()=>{u&&u.readyState===WebSocket.OPEN&&(document.hidden?(pr=!0,console.log(`Shared mode: hidden on init, leaving video paused.`)):(u.send(`START_VIDEO`),console.log(`Shared mode: Sent START_VIDEO after initial STOP_VIDEO.`)))},250))))}if(a.data.startsWith(`MK_ACCESS,`)){let e=parseInt(a.data.split(`,`)[1])===1;console.log(`Received MK_ACCESS update: ${e}`),window.webrtcInput&&(e?window.webrtcInput.isInputAttached()||(console.log(`MK Access Granted: Attaching input context.`),window.webrtcInput.attach_context()):(console.log(`MK Access Revoked: Detaching input context.`),window.webrtcInput.detach_context()))}if(a.data.startsWith(`ROLE_UPDATE,`)){let e;try{let t=a.data.substring(12);e=JSON.parse(t)}catch(e){console.error(`Failed to parse ROLE_UPDATE message:`,e);return}console.log(`Received role update. New role: ${e.role}, New slot: ${e.slot}`);let t=p;f=e.role,p=e.slot,window.webrtcInput&&typeof window.webrtcInput.updateControllerSlot==`function`&&window.webrtcInput.updateControllerSlot(p),t!==null&&p===null?window.webrtcInput&&window.webrtcInput.gamepadManager&&(console.log(`Controller slot revoked, disabling gamepad polling.`),window.webrtcInput.gamepadManager.disable()):t===null&&p!==null&&(window.webrtcInput&&window.webrtcInput.gamepadManager&&Pe?(console.log(`Controller slot granted and global gamepad toggle is ON. Enabling gamepad polling.`),window.webrtcInput.gamepadManager.enable()):window.webrtcInput&&window.webrtcInput.gamepadManager&&console.log(`Controller slot granted, but global gamepad toggle is OFF. Polling remains disabled.`))}if(a.data===`MODE websockets`){if(St=!0,d=`websockets`,console.log(`[websockets] Switched to websockets mode.`),ji=`initializing`,Mi=`Initializing WebSocket mode...`,Da(),!m){let e=mn();e===`#shared`?(f=`viewer`,p=null):e.startsWith(`#player`)?(f=`viewer`,p=parseInt(e.substring(7),10)||null,p!==null&&(sr=p-1)):(f=`controller`,p=1,sr=0),console.log(`Legacy mode detected. Role from hash: ${f}, Slot: ${p}`),cc()}fs(),Ac(),jc(),G||(Bc(),Uc(),m||cc()),De().then(e=>{e||Oe()}),m&&cc(),window.webrtcInput&&typeof window.webrtcInput.setTrackpadMode==`function`&&(window.webrtcInput.setTrackpadMode(tn),window.webrtcInput.resumePointerEcho()),ra&&ra.classList.add(`hidden`),Y&&!xt&&Y.classList.remove(`hidden`),ve(),G?(fr=`ready`,console.log(`Shared mode: Received 'MODE websockets'. Requesting initial stream with STOP/START_VIDEO. State: ready.`),Ws(),u&&u.readyState===WebSocket.OPEN&&(u.send(`STOP_VIDEO`),setTimeout(()=>{u&&u.readyState===WebSocket.OPEN&&(document.hidden?(pr=!0,console.log(`Shared mode: hidden on init, leaving video paused.`)):(u.send(`START_VIDEO`),console.log(`Shared mode: Sent START_VIDEO after initial STOP_VIDEO.`)))},250))):u&&u.readyState===WebSocket.OPEN&&T&&(Ke?u.send(`START_AUDIO`):Je=!0),Mi=`Waiting for stream...`,Da(),We=!0,J.subscribe(),Xi!==null&&clearInterval(Xi);let e=0;Xi=setInterval(()=>{Yi||!C||Io||!u||u.readyState!==WebSocket.OPEN||e>=5?(clearInterval(Xi),Xi=null):(e++,console.log(`No frame since connect; requesting keyframe (attempt ${e}).`),Jc())},3e3)}else if(d===`websockets`){if(a.data.startsWith(`{`)){let e;try{e=JSON.parse(a.data)}catch(e){console.error(`Error parsing JSON:`,e);return}if(e.type===`stream_info`)J.setInfo(e.info),jr(e.info);else if(e.type===`stream_stats`)J.serverSample(e.stats);else if(e.type===`display_settings`)bc(e.settings||{});else if(e.type===`server_settings`){if(qe=e.settings,M!==`primary`&&e.settings.second_screen&&e.settings.second_screen.value===!1){console.error(`The server reports no second display is available. This client will not function.`),Y&&(Y.textContent=`Error: A second display is not available on this server.`,Y.classList.remove(`hidden`)),u&&(u.onclose=()=>{},u.close()),Dc();return}let t=Sa(e.settings);if(typeof window.encoder==`string`&&window.encoder!==H){let e=window.encoder;console.log(`Server settings switch encoder ${H} -> ${e}.`),H=e,uo(),e!==`h264enc-striped`&&fs(),Ac(),jc()}Number.isFinite(parseFloat(window.framerate))&&(Ur=parseFloat(window.framerate));let n=e.settings.framerate;Wr=n&&n.min!==void 0?{min:n.min,max:n.max}:null,ts(`server framerate span`),typeof window.video_fullcolor==`boolean`&&(K=window.video_fullcolor);let r=e.settings&&e.settings.video_fullcolor;Oo=!!(r&&r.locked),K&&ko(`full color the server announced is not decoded here`),typeof window.video_10bit==`boolean`&&(oi=window.video_10bit);let i=e.settings&&e.settings.video_10bit;jo=!!(i&&i.locked),oi&&No(`10-bit the server announced is not decoded here`),typeof window.video_streaming_mode==`boolean`&&(si=window.video_streaming_mode);let a=e.settings&&e.settings.command_enabled;mr=a&&typeof a.value==`boolean`?a.value:!0,Ke||(Ke=!0,pc(e.settings),oc(),document.hidden&&!G&&(console.log(`Tab is hidden on connect, pausing video until it is shown.`),se())),Je&&(Je=!1,T&&u&&u.readyState===WebSocket.OPEN&&u.send(`START_AUDIO`));let o=e.settings&&e.settings.enable_resize;o&&typeof o.value==`boolean`&&(window.enable_resize=o.value);let s=e.settings&&e.settings.clipboard_in_enabled;s&&typeof s.value==`boolean`&&(_n=s.value);let c=e.settings&&e.settings.clipboard_out_enabled;c&&typeof c.value==`boolean`&&(bn=c.value);let l=e.settings&&e.settings.enable_binary_clipboard;l&&typeof l.value==`boolean`&&(Gn=l.locked?l.value:Z(`enable_binary_clipboard`,l.value));let d=e.settings&&e.settings.webcam_encoder;if(d&&cr.includes(d.value)){let e=ua(`webcam_encoder`,d.value);$e=d.locked||!cr.includes(e)?d.value:e}let f=ya(e.settings);f!==U&&window.postMessage({type:`setUseCssScaling`,value:f},window.location.origin);let p=ba(e.settings);p!==En&&(En=p,Dn());let m=xa(e.settings);m!==Pn&&(Pn=m,Fn()),ee(),Ie(e.settings),window.postMessage({type:`serverSettings`,payload:e.settings},window.location.origin),Object.keys(t).length>0&&(console.log(`Client settings were sanitized by server rules. Sending updates back to server:`,t),yc(t,!0)),e.settings.encoder_backends&&(Bo=e.settings.encoder_backends.value||null),typeof window.encoder==`string`&&Xo(window.encoder,e.settings.encoder);let h=e.settings&&e.settings.manual_resolution&&e.settings.manual_resolution.value===!0;if(h||window.manual_resolution){if(console.log(`Manual resolution mode active (Server forced: ${h}, Client pref: ${window.manual_resolution}). Switching to manual resize handlers.`),h){let t=e.settings.manual_width?parseInt(e.settings.manual_width.value,10):0,n=e.settings.manual_height?parseInt(e.settings.manual_height.value,10):0;t>0&&n>0?(console.log(`Applying server-enforced manual resolution: ${t}x${n}`),window.manual_resolution=!0,z=t,B=n,as(z,B,Qi),un(`server resolution`)&&Qo(`server resolution`)):console.warn(`Server dictated manual mode but did not provide valid dimensions.`)}else z&&B&&as(z,B,Qi);ls()}else console.log(`Server settings payload confirms auto mode. Switching to auto resize handlers.`),ss()}else if(e.type===`server_apps`)e.apps&&Array.isArray(e.apps)&&window.postMessage({type:`systemApps`,apps:e.apps},window.location.origin);else if(e.type===`print_document`)mn().startsWith(`#display2`)||Ca.announce(e.name,e.size_bytes);else if(e.type===`pipeline_status`){let t=!1;e.video!==void 0&&e.video!==C&&(C=e.video,t=!0,!C&&qt(H)&&!G&&fs()),e.audio!==void 0&&e.audio!==T&&(T=e.audio,t=!0,s&&s.postMessage({type:`updatePipelineStatus`,data:{isActive:T}}),u&&u.setAudioActive&&u.setAudioActive(T)),t&&window.postMessage({type:`pipelineStatusUpdate`,video:C,audio:T},window.location.origin)}else if(e.type===`stream_resolution`){let t=e.displayId||`primary`;if(t!==M)console.log(`Ignoring stream_resolution for display '${t}' (this page renders '${M}').`);else if(G){if(fr===`error`||fr===`idle`)console.log(`Shared mode: Received stream_resolution while in state '${fr}'. Ignoring.`);else{let t=parseInt(e.width,10),n=parseInt(e.height,10);if(t>0&&n>0){let e=Q(t),r=Q(n),i=z!==e||B!==r;i&&(console.log(`Shared mode: Received new stream resolution ${e}x${r} (physical).`),z=e,B=r,as(z,B,!0)),fr===`ready`&&i&&(console.log(`Shared mode: Clearing decoders and canvas for new resolution.`),fs(),l&&c.width>0&&c.height>0&&(l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height)))}else console.warn(`Shared mode: Received invalid stream_resolution dimensions: ${e.width}x${e.height}`)}}else{let t=parseInt(e.width,10),n=parseInt(e.height,10);if(t>0&&n>0){let e=window.manual_resolution?1:Yt(),r=Q(t),i=Q(n),a=!window.manual_resolution&&$t&&r===$t[0]&&i===$t[1];c&&r>0&&i>0&&(c.width!==r||c.height!==i)&&(fs(),a?(window.streamResolutionDiverged=!1,os($t[2],$t[3])):(console.log(`Server realized stream resolution ${t}x${n} (canvas buffer ${c.width}x${c.height}); reconciling.`),window.streamResolutionDiverged=!0,window.manual_resolution?(z=r,B=i,as(z,B,Qi)):as((r+.5)/e,(i+.5)/e,!0)))}else console.warn(`Received invalid stream_resolution dimensions: ${e.width}x${e.height}`)}}else console.warn(`Unexpected JSON message type:`,e.type,e)}else if(a.data.startsWith(`cursor,`))try{let e=JSON.parse(a.data.substring(7));window.webrtcInput&&typeof window.webrtcInput.updateServerCursor==`function`&&window.webrtcInput.updateServerCursor(e)}catch(e){console.error(`Error parsing cursor data:`,e)}else if(a.data.startsWith(`clipboard_reply,`))a.data.substring(16)===`cr`&&Zn();else if(a.data===`clipboard_secret`)Yn.markSecret();else if(a.data.startsWith(`clipboard_start,`)){let e=a.data.split(`,`);Yn.begin(e[1],parseInt(e[2],10),er())}else if(a.data.startsWith(`clipboard_data,`))Yn.push(a.data.substring(15));else if(a.data===`clipboard_finish`)Yn.finish();else if(a.data.startsWith(`clipboard_binary,`)){let e=a.data.split(`,`);if(e.length<3){console.error(`Malformed binary clipboard message from server:`,a.data);return}Yn.single(e[1],e[2],er())}else if(a.data.startsWith(`clipboard,`))Yn.single(`text/plain`,a.data.substring(10),er());else if(a.data.startsWith(`system,`))try{let e=JSON.parse(a.data.substring(7));if(e.action===`reload`)window.location.reload();else if(typeof e.action==`string`&&e.action.startsWith(`command_error,`)&&!G)window.postMessage({type:`fileUpload`,payload:{status:`warning`,fileName:`command`,message:e.action.slice(14),code:`commandFailed`}},window.location.origin);else if(typeof e.action==`string`&&e.action.startsWith(`command_done,`)&&!G)window.postMessage({type:`commandDone`,command:e.action.slice(13)},window.location.origin);else if(typeof e.action==`string`&&e.action.startsWith(`apps_installed,`)&&!G)window.postMessage({type:`appsInstalled`,apps:JSON.parse(e.action.slice(15))},window.location.origin);else if(typeof e.action==`string`&&e.action.startsWith(`rumble,`)&&window.webrtcInput){let[t,n,r,i]=e.action.split(`,`).slice(1).map(Number);window.webrtcInput.rumble(t,n,r,i)}else typeof e.action==`string`&&e.action.startsWith(`pointer,`)&&window.webrtcInput&&window.webrtcInput.onPointerEcho(e.action)}catch(e){console.error(`Error parsing system data:`,e)}else if(a.data===`VIDEO_STARTED`&&!G)zs(),C=!0,window.postMessage({type:`pipelineStatusUpdate`,video:!0},window.location.origin);else if(a.data===`VIDEO_STOPPED`&&!G)console.log(`Client: Received VIDEO_STOPPED. Updating isVideoPipelineActive=false. Expecting PIPELINE_RESETTING from server for full state reset.`),C=!1,window.postMessage({type:`pipelineStatusUpdate`,video:!1},window.location.origin);else if(a.data.startsWith(`PIPELINE_RESETTING `)){let e=a.data.split(` `),t=e.length>1?e[1]:`primary`;console.log(`[websockets] Received PIPELINE_RESETTING for display '${t}'.`),G&&t===`primary`||!G&&t===M?(Gc(`PIPELINE_RESETTING from server for display '${t}'`),G?(console.log(`Shared mode: Primary pipeline reset. Client remains in ready state.`),fr=`ready`):console.log(`Display '${M}': Video reset complete.`)):console.log(`Ignoring PIPELINE_RESETTING for '${t}' as this client is '${G?`shared`:M}'.`)}else if(a.data.startsWith(`DISPLAY_CONFIG_UPDATE,`))try{let n=a.data.substring(a.data.indexOf(`,`)+1),r=JSON.parse(n);if(t=r.layouts||null,W=!!r.wayland,Jt=!!r.finger_scroll,window.webrtcInput&&window.webrtcInput.setFingerScroll&&window.webrtcInput.setFingerScroll(Jt),window.webrtcInput&&window.webrtcInput.setDisplayLayouts&&window.webrtcInput.setDisplayLayouts(t,M),en(),M===`primary`){let t=r.displays.includes(`display2`);e!==t&&(console.log(`Secondary display connection status changed to: ${t}`),e=t,Tn())}}catch(e){console.error(`Error parsing DISPLAY_CONFIG_UPDATE:`,e,`Original data:`,a.data)}else if(a.data===`AUDIO_STARTED`&&!G)T=!0,window.postMessage({type:`pipelineStatusUpdate`,audio:!0},window.location.origin),s&&s.postMessage({type:`updatePipelineStatus`,data:{isActive:!0}}),u&&u.setAudioActive&&u.setAudioActive(!0);else if(a.data===`AUDIO_STOPPED`&&!G)T=!1,window.postMessage({type:`pipelineStatusUpdate`,audio:!1},window.location.origin),s&&s.postMessage({type:`updatePipelineStatus`,data:{isActive:!1}}),u&&u.setAudioActive&&u.setAudioActive(!1);else if(a.data===`AUDIO_DISABLED`&&!G){if(console.log(`Server reports audio is disabled. Tearing down audio workers.`),Ge=!1,T=!1,s&&(s.postMessage({type:`updatePipelineStatus`,data:{isActive:!1}}),u&&u.setAudioActive&&u.setAudioActive(!1),s.postMessage({type:`close`}),setTimeout(()=>{s&&=(s.terminate(),null)},50)),h){try{h.close()}catch(e){console.error(`Error closing AudioContext on AUDIO_DISABLED:`,e)}h=null,uc(),g=null,y=null}window.postMessage({type:`pipelineStatusUpdate`,audio:!1},window.location.origin)}else if(a.data===`MICROPHONE_DISABLED`&&!G)console.log(`Server reports microphone is disabled. Stopping microphone capture.`),Ye=!1,Bc(),window.postMessage({type:`pipelineStatusUpdate`,microphone:!1},window.location.origin);else if(a.data===`WEBCAM_DISABLED`&&!G)console.log(`Server reports webcam is disabled. Stopping webcam capture.`),Xe=!1,Uc(),window.postMessage({type:`pipelineStatusUpdate`,webcam:!1},window.location.origin);else if(a.data===`WEBCAM_KEYFRAME`)j&&j.requestKeyframe();else if(a.data.startsWith(`CAPTURE_DEMAND `)&&!G){let[e,t]=a.data.slice(15).split(` `);e===`webcam`&&Xe&&!A.has(`webcam`)?t===`1`?Qe||Hc(!0):Uc():e===`microphone`&&Ye&&!A.has(`microphone`)&&(t===`1`?Ze||zc(!0):Bc())}else window.webrtcInput&&window.webrtcInput.on_message&&!G&&window.webrtcInput.on_message(a.data)}}},Tt=e=>{let t=e.data;if(t instanceof ArrayBuffer){if(t.byteLength>=1&&new Uint8Array(t,0,1)[0]===5){st++;let e=t.slice(1);ot=ot.then(async()=>{try{yt({data:await ct(e)})}catch(e){console.error(`[websockets] gzip control inflate failed:`,e)}finally{st--}});return}yt(e)}else t===`_gz,1`?typeof CompressionStream<`u`&&(lt=!0):st>0?ot=ot.then(()=>yt({data:t})):yt({data:t})},F=e=>{console.error(`[websockets] Error:`,e),ji=`error`,Mi=`WebSocket connection error.`,Da(),ft&&=(clearInterval(ft),null),pt&&=(clearInterval(pt),null),ec(),G&&(console.error(`Shared mode: WebSocket error. Resetting shared state to 'error'.`),fr=`error`)},Dt=e=>{if(console.log(`[websockets] Connection closed`,e),x=!1,J.disconnected(),window.webrtcInput&&typeof window.webrtcInput.stopRumble==`function`&&window.webrtcInput.stopRumble(),Yn.reset(),window.__selkiesAuthProbe&&window.__selkiesAuthProbe(),e.code===4001){console.error(`Server rejected connection: Invalid token. Disabling reconnect.`),Dc(),Mi=`Connection Failed: Invalid Token`,Da();return}e.code===4002&&(console.log(`Server closed connection due to permission change. Reconnecting...`),ht=!0);let t=/superseded/i.test(e.reason||``);t&&(console.warn(`Session superseded by a new connection. Auto-reconnect disabled.`),Dc()),ji=`disconnected`,St=!1,Mi=t?`Session opened elsewhere. Reload this page to take over.`:`WebSocket disconnected. Attempting to reconnect...`,Da(),ft&&=(clearInterval(ft),null),pt&&=(clearInterval(pt),null);let n=!t&&!ht;n&&vt&&!xt&&(xt=!0,Et=performance.now(),wt={toggled:new Set(A),video:C,audio:T,microphone:E,webcam:Me}),Ac(),fs(),Ms(),G||(Bc(),Uc()),C=!1,T=!1,E=!1;let r=()=>{ec(),s&&=(s.postMessage({type:`close`}),null),window.postMessage({type:`pipelineStatusUpdate`,video:!1,audio:!1},window.location.origin)};xt&&n?(y&&y.postMessage({quiet:!0}),Ct===null&&(Ct=setTimeout(()=>{Ct=null,!Yi&&(ac(),St?C&&Y&&Y.classList.remove(`hidden`):(r(),Y&&Y.classList.remove(`hidden`)))},1500))):(ac(),r()),G&&(console.log(`Shared mode: WebSocket closed. Resetting shared state to 'idle'.`),fr=`idle`,Us()),Fe=-1,Ss=null,Le=-1,jc(),lt=!1,t||(Yi=!1,Y&&!xt&&Y.classList.remove(`hidden`),vt&&performance.now()-vt>=1e4&&(gt=0),Tc(e.code===1006&&gt===0)),vt=0},Ot=()=>{mt(u),u.onopen=N,u.onmessage=Tt,u.onerror=F,u.onclose=Dt};Ot(),bt=()=>{He(),Ot()}}let wc=!1;function Tc(e=!1){if(mt!==null||!bt)return;let t=Math.min(400*2**gt,1e3);if(gt++,e&&!window.__selkiesModeSwitching&&!ht){Ec(!0);return}let n=setTimeout(async()=>{if(window.__selkiesModeSwitching){mt=null;return}let e=new URL(window.location.href);e.pathname=Te()+`/api/websockets`;let t=await Ee(e.href,yn());mt===n&&(mt=null,t?t.status===409||ht||_t>=3?kc(t):Ec():Tc())},t);mt=n}function Ec(e=!1){e||_t++,console.log(`[websockets] Reconnecting in place (attempt ${gt}).`),bt();let t=u;setTimeout(()=>{u===t&&t.readyState===WebSocket.CONNECTING&&t.close()},5e3)}window.addEventListener(`online`,()=>{mt!==null&&(Dc(),gt=0,Tc())});function Dc(){mt!==null&&clearTimeout(mt),mt=null}async function Oc(){let e=await De(yn());return e===null?!1:yt===null?(yt=e,!1):e!==yt}function kc(e){let t=null;try{t=sessionStorage.getItem(`selkies_mode_flip`)}catch{}if(!wc&&!t&&e.status===409){try{sessionStorage.setItem(`selkies_mode_flip`,`1`)}catch{}gr(`${hr}_stream_mode`,`webrtc`),console.warn(`[websockets] Server is serving WebRTC (endpoint 409); switching stored mode.`)}location.reload()}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,Cc):Cc();function Ac(){let e=0;for(;xe.length>0;){let t=xe.shift();if(t&&t.image&&typeof t.image.close==`function`)try{t.image.close(),e++}catch{}}e>0&&console.log(`Cleanup: Closed ${e} JPEG stripe images.`),Rs={},bs=null,xs=!1}function jc(){for(;gs.length>0;){let e=gs.shift();try{e&&e.frame&&e.frame.close()}catch{}}bs=null,xs=!1}let Mc={6:{streams:4,coupled:2,mapping:[0,4,1,2,3,5]},8:{streams:5,coupled:3,mapping:[0,6,1,2,3,4,5,7]}};function Nc(){let e=parseInt(window.audio_channels,10);return e===1||e===2||e===6||e===8?e:2}function Pc(){return new URL(`codecs/libopus-wasm/index.js`,document.baseURI).href}function Fc(e){let t=Mc[e];if(!t)return null;let n=new ArrayBuffer(21+e),r=new Uint8Array(n),i=new DataView(n);return r.set([79,112,117,115,72,101,97,100]),r[8]=1,r[9]=e,i.setUint16(10,0,!0),i.setUint32(12,48e3,!0),i.setInt16(16,0,!0),r[18]=1,r[19]=t.streams,r[20]=t.coupled,r.set(t.mapping,21),n}let Ic=`
  let decoderAudio;
  let pipelineActive = true;
  let currentDecodeQueueSize = 0;
  // libopus-wasm, where the engine has no AudioDecoder, and whether no decoder
  // can be had, which leaves packets undecoded until the page asks again.
  let opusUrl = null;
  let opusModule = null;
  let decoderUnavailable = false;
  // Set once the page hands over the worklet's line; until then decoded packets
  // go back through the page, which is also the path a worklet-less build takes.
  let pcmPort = null;
  let audioIn = null;
  let lastAudioTs = null;

  // Outputs still due before a pending mark goes out; 0 when none is pending.
  let quietAfter = 0;
  // Per decode in flight, in order: whether that frame ends a sound, so its PCM
  // goes to the worklet marked quiet.
  const endsSound = [];

  // Tells the worklet the server's silence gate closed, behind the PCM of every
  // packet before the mark and ahead of any after it: a mark that overtakes a
  // decode waits for the outputs due when it came, and no more.
  function forwardQuiet() {
    if (currentDecodeQueueSize > 0) { quietAfter = currentDecodeQueueSize; return; }
    postQuiet();
  }

  function postQuiet() {
    quietAfter = 0;
    if (pcmPort) pcmPort.postMessage({ quiet: true });
    else self.postMessage({ type: 'audioQuiet' });
  }

  // One decode's output has gone to the worklet (or been dropped).
  function outputDone() {
    if (quietAfter > 0 && --quietAfter === 0) postQuiet();
  }

  function audioTsNewer(a, b) {
    const d = (a - b) >>> 0;
    return d !== 0 && d < 0x80000000;
  }

  function extractOpusFrames(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    if (arrayBuffer.byteLength <= 2) return [];
    const nRed = bytes[1] & ~${Ti};
    if (!nRed) { lastAudioTs = null; return [arrayBuffer.slice(2)]; }
    // With n_red > 0 the bytes after the flag word are headers, not Opus, so a
    // truncated fixed part leaves no primary to salvage.
    if (arrayBuffer.byteLength < 6 + nRed * 4 + 1) { lastAudioTs = null; return []; }
    const pts = ((bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5]) >>> 0;
    let pos = 6;
    const offsets = [], lens = [];
    for (let i = 0; i < nRed; i++) {
      const field = (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3];
      offsets.push((field >> 10) & 0x3fff);
      lens.push(field & 0x3ff);
      pos += 4;
    }
    pos += 1;
    // The declared block lengths must fit the payload: slice() clamps silently,
    // and the primary cannot be located without trustworthy lengths.
    let declared = pos;
    for (let i = 0; i < nRed; i++) { declared += lens[i]; }
    if (declared > arrayBuffer.byteLength) { lastAudioTs = null; return []; }
    const blocks = [];
    for (let i = 0; i < nRed; i++) {
      blocks.push({ ts: (pts - offsets[i]) >>> 0, buf: arrayBuffer.slice(pos, pos + lens[i]) });
      pos += lens[i];
    }
    blocks.push({ ts: pts, buf: arrayBuffer.slice(pos) });
    if (lastAudioTs === null) {
      lastAudioTs = pts;
      return [blocks[blocks.length - 1].buf];
    }
    const out = [];
    let last = lastAudioTs;
    for (const b of blocks) {
      if (audioTsNewer(b.ts, last)) { out.push(b.buf); last = b.ts; }
    }
    lastAudioTs = last;
    return out;
  }
  const decoderConfig = {
    codec: 'opus',
    numberOfChannels: 2,
    sampleRate: 48000,
  };

  // An Opus frame length field at pos (RFC 6716 3.2.1): [bytes it takes, length].
  function frameLength(u8, pos) {
    const b = u8[pos];
    return b < 252 ? [1, b] : [2, b + 4 * u8[pos + 1]];
  }

  // The elementary packets of a multistream packet. Every stream but the last
  // is self-delimited (RFC 6716 Appendix B): a plain packet with one more
  // length field in front of its last frame's data, which is cut out here.
  function splitStreams(buf, streams) {
    const u8 = new Uint8Array(buf);
    const out = [];
    let pos = 0;
    for (let s = 0; s < streams - 1; s++) {
      if (pos >= u8.length) return null;
      const start = pos;
      const code = u8[pos++] & 3;
      let pad = 0, data = 0, sdAt, sdSize, n, len;
      if (code === 2) {
        [n, len] = frameLength(u8, pos); pos += n; data = len;
      } else if (code === 3) {
        const count = u8[pos++];
        if (count & 0x40) {
          let p;
          do { p = u8[pos++]; pad += p === 255 ? 254 : p; } while (p === 255);
        }
        if (count & 0x80) {
          for (let i = 0; i < (count & 0x3f) - 1; i++) { [n, len] = frameLength(u8, pos); pos += n; data += len; }
        }
      }
      sdAt = pos;
      [sdSize, len] = frameLength(u8, pos);
      pos += sdSize;
      data = code === 1 ? 2 * len : code === 3 && !(u8[start + 1] & 0x80) ? (u8[start + 1] & 0x3f) * len : data + len;
      const end = pos + data + pad;
      if (end > u8.length) return null;
      const plain = new Uint8Array(end - start - sdSize);
      plain.set(u8.subarray(start, sdAt), 0);
      plain.set(u8.subarray(sdAt + sdSize, end), sdAt - start);
      out.push(plain.buffer);
      pos = end;
    }
    out.push(buf.slice(pos));
    return out;
  }

  // A decoder for the surround layout of an OpusHead description: one mono or
  // stereo decoder per elementary stream, whose outputs are reassembled into
  // interleaved frames of the channels the mapping table names, in order.
  function surroundDecoder(description, channels, onPcm, onError) {
    const head = new Uint8Array(description);
    const streams = head[19], coupled = head[20];
    const mapping = Array.from(head.subarray(21, 21 + channels));
    const decoders = [], held = [];
    const assemble = () => {
      while (held.every((q) => q.length > 0)) {
        const parts = held.map((q) => q.shift());
        const frames = parts[0].frames;
        const pcm = new Float32Array(frames * channels);
        mapping.forEach((coded, c) => {
          if (coded === 255) return;
          const stream = coded < 2 * coupled ? coded >> 1 : coupled + coded - 2 * coupled;
          const plane = parts[stream].planes[coded < 2 * coupled ? coded & 1 : 0];
          for (let f = 0; f < frames && f < plane.length; f++) pcm[f * channels + c] = plane[f];
        });
        onPcm(pcm.buffer);
      }
    };
    for (let k = 0; k < streams; k++) {
      held.push([]);
      decoders.push(new AudioDecoder({
        output: (d) => {
          const planes = [];
          for (let c = 0; c < d.numberOfChannels; c++) {
            const plane = new Float32Array(d.numberOfFrames);
            d.copyTo(plane, { planeIndex: c, format: 'f32-planar' });
            planes.push(plane);
          }
          held[k].push({ frames: d.numberOfFrames, planes });
          d.close();
          assemble();
        },
        error: onError,
      }));
    }
    return {
      get state() {
        return decoders.some((d) => d.state === 'closed') ? 'closed'
          : decoders.every((d) => d.state === 'configured') ? 'configured' : 'unconfigured';
      },
      async configure() {
        for (let k = 0; k < streams; k++) {
          decoders[k].configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: k < coupled ? 2 : 1 });
        }
      },
      decode(chunk) {
        const bytes = new Uint8Array(chunk.byteLength);
        chunk.copyTo(bytes);
        const parts = splitStreams(bytes.buffer, streams);
        if (!parts) throw new Error('malformed multistream packet');
        parts.forEach((part, k) => decoders[k].decode(
          new EncodedAudioChunk({ type: 'key', timestamp: chunk.timestamp, data: part })));
      },
      close() {
        for (const d of decoders) { try { d.close(); } catch (e) { /* closed */ } }
      },
    };
  }

  // libopus in WASM for an engine with no AudioDecoder: mono and stereo decode
  // as they are, surround one elementary stream at a time into the order of
  // the description's mapping table, as surroundDecoder does. A packet's PCM
  // goes out a microtask after its decode call, as a WebCodecs output would,
  // so the caller's queue accounting has run first.
  function wasmDecoder(config, onPcm, onError) {
    const channels = config.numberOfChannels;
    const head = channels > 2 && config.description ? new Uint8Array(config.description) : null;
    const streams = head ? head[19] : 1, coupled = head ? head[20] : 0;
    const mapping = head ? Array.from(head.subarray(21, 21 + channels)) : null;
    const decoders = [];
    const dec = {
      state: 'configuring',
      decode(buffer) {
        const parts = head ? splitStreams(buffer, streams) : [buffer];
        if (!parts) throw new Error('malformed multistream packet');
        queueMicrotask(() => {
          if (dec.state !== 'configured') return;
          let outs;
          try { outs = parts.map((part, k) => decoders[k].decodeFloat(new Uint8Array(part))); }
          catch (e) { onError(e); return; }
          if (!head) { onPcm(outs[0].buffer); return; }
          const frames = outs[0].length / (coupled ? 2 : 1);
          const pcm = new Float32Array(frames * channels);
          mapping.forEach((coded, c) => {
            if (coded === 255) return;
            const paired = coded < 2 * coupled;
            const out = outs[paired ? coded >> 1 : coded - coupled];
            for (let f = 0; f < frames; f++) pcm[f * channels + c] = paired ? out[2 * f + (coded & 1)] : out[f];
          });
          onPcm(pcm.buffer);
        });
      },
      close() {
        dec.state = 'closed';
        for (const d of decoders) { try { d.free(); } catch (e) { /* freed */ } }
      },
    };
    dec.ready = (async () => {
      if (!opusUrl) throw new Error('no AudioDecoder and no WASM decoder to fall back on');
      opusModule = opusModule || import(opusUrl);
      const opus = await opusModule;
      for (let k = 0; k < streams; k++) {
        decoders.push(await opus.createDecoder({ sampleRate: 48000, channels: head ? (k < coupled ? 2 : 1) : channels }));
      }
      if (dec.state === 'closed') dec.close();
      else dec.state = 'configured';
    })();
    return dec;
  }

  // A packet as the decoder takes it: a chunk for WebCodecs, the bytes for WASM.
  function packet(buffer, timestamp) {
    return typeof AudioDecoder === 'undefined' ? buffer : new EncodedAudioChunk({ type: 'key', timestamp, data: buffer });
  }

  function postPcm(pcm, ending) {
    if (pcmPort) pcmPort.postMessage(ending ? { audioData: pcm, quiet: true } : { audioData: pcm }, [pcm]);
    else self.postMessage({ type: 'decodedAudioData', pcmBuffer: pcm, quiet: ending }, [pcm]);
  }

  async function initializeDecoderInWorker() {
    if (decoderAudio && decoderAudio.state !== 'closed') {
      try { decoderAudio.close(); } catch (e) { /* ignore */ }
    }
    currentDecodeQueueSize = 0;
    endsSound.length = 0;
    quietAfter = 0;
    decoderUnavailable = false;
    const onError = (e) => {
      // A fatal decoder error is not re-initialized from here: a persistent
      // failure would spin. The page drives recovery with its 'reinitialize'
      // message, which also re-checks the codec configuration.
      console.error('[AudioWorker] AudioDecoder error:', e.message, e);
      currentDecodeQueueSize = Math.max(0, currentDecodeQueueSize -1);
      endsSound.shift();
      outputDone();
    };
    const onPcm = (pcm) => {
      currentDecodeQueueSize = Math.max(0, currentDecodeQueueSize - 1);
      postPcm(pcm, !!endsSound.shift());
      outputDone();
    };
    const failed = (reason) => {
      decoderAudio = null;
      decoderUnavailable = true;
      self.postMessage({ type: 'decoderInitFailed', reason });
    };
    if (typeof AudioDecoder === 'undefined') {
      const wasm = wasmDecoder(decoderConfig, onPcm, onError);
      decoderAudio = wasm;
      try {
        await wasm.ready;
        if (decoderAudio === wasm) self.postMessage({ type: 'decoderInitialized', wasm: true });
      } catch (e) {
        if (decoderAudio === wasm) failed(String((e && e.message) || e));
      }
      return;
    }
    const surround = decoderConfig.numberOfChannels > 2 && decoderConfig.description;
    decoderAudio = surround
      ? surroundDecoder(decoderConfig.description, decoderConfig.numberOfChannels, onPcm, onError)
      : new AudioDecoder({ output: handleDecodedAudioFrameInWorker, error: onError });
    try {
      const support = await AudioDecoder.isConfigSupported(
        surround ? { codec: 'opus', sampleRate: 48000, numberOfChannels: 2 } : decoderConfig);
      if (support.supported) {
        await decoderAudio.configure(decoderConfig);
        self.postMessage({ type: 'decoderInitialized' });
      } else {
        failed('configNotSupported');
      }
    } catch (e) {
      failed(e.message);
    }
  }

  async function handleDecodedAudioFrameInWorker(frame) {
    currentDecodeQueueSize = Math.max(0, currentDecodeQueueSize - 1);
    const ending = !!endsSound.shift();
    if (!frame || typeof frame.copyTo !== 'function' || typeof frame.allocationSize !== 'function' || typeof frame.close !== 'function') {
        if(frame && typeof frame.close === 'function') { try { frame.close(); } catch(e) { /* ignore */ } }
        outputDone();
        return;
    }
    let pcmDataArrayBuffer;
    try {
      const requiredByteLength = frame.allocationSize({ planeIndex: 0, format: 'f32' });
      if (requiredByteLength === 0) {
          try { frame.close(); } catch(e) { /* ignore */ }
          return;
      }
      pcmDataArrayBuffer = new ArrayBuffer(requiredByteLength);
      const pcmDataView = new Float32Array(pcmDataArrayBuffer);
      await frame.copyTo(pcmDataView, { planeIndex: 0, format: 'f32' });
      postPcm(pcmDataArrayBuffer, ending);
      pcmDataArrayBuffer = null;
    } catch (error) { /* console.error */ }
    finally {
      if (frame && typeof frame.close === 'function') {
        try { frame.close(); } catch (e) { /* ignore */ }
      }
      outputDone();
    }
  }

  self.onmessage = async (event) => {
    const { type, data } = event.data;
    switch (type) {
      case 'init':
        pipelineActive = data.initialPipelineStatus;
        if (data.channels) {
          decoderConfig.numberOfChannels = data.channels;
        }
        if (data.description) {
          decoderConfig.description = data.description;
        }
        if (data.opusUrl) opusUrl = data.opusUrl;
        await initializeDecoderInWorker();
        break;
      case 'quiet': forwardQuiet(); break;
      case 'decode':
        if (decoderAudio && decoderAudio.state === 'configured') {
          const chunk = packet(data.opusBuffer, data.timestamp || (performance.now() * 1000));
          try {
            if (currentDecodeQueueSize < 20) {
                 decoderAudio.decode(chunk); currentDecodeQueueSize++;
                 endsSound.push(!!data.quiet);
            }
          } catch (e) {
              currentDecodeQueueSize = Math.max(0, currentDecodeQueueSize - 1);
              if (decoderAudio.state === 'closed' || decoderAudio.state === 'unconfigured') await initializeDecoderInWorker();
          }
        } else if (!decoderUnavailable && (!decoderAudio || decoderAudio.state !== 'configuring')) {
          await initializeDecoderInWorker();
        }
        break;
      case 'reinitialize': await initializeDecoderInWorker(); break;
      case 'pcmPort': pcmPort = event.data.port; break;
      case 'audioIn':
        audioIn = event.data.port;
        audioIn.onmessage = (m) => {
          if (!decoderAudio || decoderAudio.state !== 'configured') return;
          const quiet = (new Uint8Array(m.data.buffer, 1, 1)[0] & ${Ti}) !== 0;
          if (quiet && m.data.buffer.byteLength <= 2) { forwardQuiet(); return; }
          const frames = extractOpusFrames(m.data.buffer).filter((opus) => opus.byteLength);
          frames.forEach((opus, i) => {
            try {
              decoderAudio.decode(packet(opus, performance.now() * 1000));
              currentDecodeQueueSize++;
              endsSound.push(quiet && i === frames.length - 1);
            } catch (err) { /* a reconfiguring decoder drops the packet */ }
          });
        };
        break;
      case 'updatePipelineStatus': pipelineActive = data.isActive; break;
      case 'close':
        if (decoderAudio && decoderAudio.state !== 'closed') { try { decoderAudio.close(); } catch (e) { /* ignore */ } }
        decoderAudio = null; self.close(); break;
      default: break;
    }
  };
`,Lc=`
  let encoder = null, tsUs = 0, active = true, wirePort = null, wasm = false;
  // One Opus packet out as a 0x02 frame.
  const send = (opus) => {
    if (!active) return;
    const buf = new ArrayBuffer(1 + opus.byteLength);
    const frame = new Uint8Array(buf);
    frame[0] = 0x02;
    frame.set(opus, 1);
    if (wirePort) wirePort.postMessage(buf, [buf]);
    else self.postMessage({ type: 'chunk', buffer: buf }, [buf]);
  };
  // libopus in WASM for an engine with no AudioEncoder: the settings the
  // WebCodecs path asks for, in its default 20 ms frames, which the worklet's
  // render quanta are gathered into here.
  const wasmEncoder = async (url) => {
    const opus = await import(url);
    const enc = await opus.createEncoder({ sampleRate: 24000, channels: 1, frameSize: 480,
      application: opus.Application.RestrictedLowDelay, bitrate: ${lt} });
    const frame = new Int16Array(enc.frameSize);
    let fill = 0;
    return {
      state: 'configured',
      encode(buffer) {
        const pcm = new Int16Array(buffer);
        for (let i = 0; i < pcm.length;) {
          const n = Math.min(frame.length - fill, pcm.length - i);
          frame.set(pcm.subarray(i, i + n), fill);
          fill += n;
          i += n;
          if (fill === frame.length) { fill = 0; send(enc.encode(frame)); }
        }
      },
      close() { this.state = 'closed'; enc.free(); },
    };
  };
  const onPcm = (buffer) => {
    if (!active || !encoder || encoder.state !== 'configured') return;
    if (!buffer || !(buffer instanceof ArrayBuffer) || buffer.byteLength === 0) return;
    if (wasm) { try { encoder.encode(buffer); } catch (err) {} return; }
    const numFrames = buffer.byteLength / 2;
    const audioData = new AudioData({ format: 's16', sampleRate: 24000, numberOfFrames: numFrames, numberOfChannels: 1, timestamp: tsUs, data: buffer });
    tsUs += Math.round(numFrames * 1e6 / 24000);
    try { encoder.encode(audioData); } catch (err) {}
    audioData.close();
  };
  self.onmessage = async (e) => {
    const m = e.data;
    if (m.type === 'pcmPort') { m.port.onmessage = (ev) => onPcm(ev.data); return; }
    if (m.type === 'wirePort') { wirePort = m.port; return; }
    if (m.type === 'init') {
      if (typeof AudioEncoder === 'undefined') {
        try {
          if (!m.opusUrl) throw new Error('no AudioEncoder and no WASM encoder to fall back on');
          const enc = await wasmEncoder(m.opusUrl);
          if (!active) { enc.close(); return; }
          encoder = enc;
          wasm = true;
          self.postMessage({ type: 'ready', wasm: true });
        } catch (err) { self.postMessage({ type: 'error', message: String(err && err.message) }); }
        return;
      }
      const base = { codec: 'opus', sampleRate: 24000, numberOfChannels: 1, bitrate: ${lt} };
      let cfg = { ...base, opus: { application: 'lowdelay' } };
      try { const s = await AudioEncoder.isConfigSupported(cfg); if (!s || !s.supported) cfg = base; } catch (err) { cfg = base; }
      try {
        encoder = new AudioEncoder({
          output: (chunk) => {
            const opus = new Uint8Array(chunk.byteLength);
            chunk.copyTo(opus);
            send(opus);
          },
          error: (err) => self.postMessage({ type: 'error', message: String(err && err.message) }),
        });
        encoder.configure(cfg);
        self.postMessage({ type: 'ready' });
      } catch (err) { self.postMessage({ type: 'error', message: String(err && err.message) }); }
      return;
    }
    if (m.type === 'pcm') { onPcm(m.buffer); return; }
    if (m.type === 'stop') { active = false; try { encoder && encoder.state !== 'closed' && encoder.close(); } catch (err) {} encoder = null; return; }
  };
`;function Rc(e){try{navigator.audioSession&&navigator.audioSession.type!==e&&(navigator.audioSession.type=e)}catch{}}async function zc(e=!1){if(G){console.log(`Shared mode: Microphone capture blocked.`),E=!1,mc();return}if(E||at||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){E||=!1,mc();return}let t={withdrawn:!1},n;try{n={audio:{deviceId:P?{exact:P}:void 0,sampleRate:24e3,channelCount:1,echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1},Rc(`play-and-record`),at=t;let e;try{e=await navigator.mediaDevices.getUserMedia(n)}finally{at=null}if(t.withdrawn){e.getTracks().forEach(e=>e.stop()),Rc(`playback`);return}it=e;let r=it.getAudioTracks();if(r.length>0){let e=r[0].getSettings();!P&&e.deviceId&&(P=e.deviceId)}N&&N.state!==`closed`&&await N.close(),N=new AudioContext({sampleRate:24e3});try{ot=N.createMediaStreamSource(it)}catch(e){if(e.name!==`NotSupportedError`)throw e;await N.close(),N=new AudioContext,ot=N.createMediaStreamSource(it),console.info(`[Main] Microphone captured at ${N.sampleRate} Hz and resampled to 24 kHz, the engine refusing a 24 kHz context.`)}N.state===`suspended`&&await N.resume(),await N.audioWorklet.addModule(Nt(`
class MicWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.SILENCE_THRESHOLD_CHUNKS = 300;
    this.silentChunkCounter = 0;
    this.isSending = true;
    // Resampling to 24 kHz: a Hann-windowed sinc low-pass under the new
    // Nyquist, then linear interpolation between its outputs.
    this.step = sampleRate / 24000;
    if (this.step !== 1) {
      const n = 31, cut = Math.min(0.5, 10800 / sampleRate);
      const taps = Array.from({ length: n }, (_, i) => {
        const x = i - (n - 1) / 2;
        const sinc = x === 0 ? 2 * cut : Math.sin(2 * Math.PI * cut * x) / (Math.PI * x);
        return sinc * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1)));
      });
      const sum = taps.reduce((a, b) => a + b, 0);
      this.taps = Float32Array.from(taps, (t) => t / sum);
      this.history = new Float32Array(n);
      this.prev = 0;
      this.at = 1;
    }
    // The encode worker's own line in: capture then reaches it whatever the
    // page's thread is doing. Until it is handed over, the page relays.
    this.out = this.port;
    this.port.onmessage = (e) => {
      if (e.data && e.data.port) this.out = e.data.port;
    };
  }
  resample(input) {
    const out = [];
    const h = this.history, taps = this.taps;
    for (let i = 0; i < input.length; i++) {
      h.copyWithin(0, 1);
      h[h.length - 1] = input[i];
      let y = 0;
      for (let k = 0; k < h.length; k++) y += taps[k] * h[k];
      for (; this.at <= 1; this.at += this.step) out.push(this.prev + (y - this.prev) * this.at);
      this.at -= 1;
      this.prev = y;
    }
    return out;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input[0]) {
      const inputChannelData = this.step === 1 ? input[0] : this.resample(input[0]);
      const int16Array = Int16Array.from(inputChannelData, x => x * 32767);
      const isCurrentChunkSilent = int16Array.every(item => item === 0);
      if (!isCurrentChunkSilent) {
        this.isSending = true;
        this.silentChunkCounter = 0;
      } else {
        this.silentChunkCounter++;
      }
      if (this.silentChunkCounter >= this.SILENCE_THRESHOLD_CHUNKS) {
        this.isSending = false;
      }
      if (this.isSending) {
        this.out.postMessage(int16Array.buffer, [int16Array.buffer]);
      }
    }
    return true;
  }
}
registerProcessor('mic-worklet-processor', MicWorkletProcessor);
`)),st=new AudioWorkletNode(N,`mic-worklet-processor`);let i=URL.createObjectURL(new Blob([Lc],{type:`application/javascript`}));if(ct=new Worker(i),URL.revokeObjectURL(i),ct.onmessage=e=>{let t=e.data;if(t.type===`chunk`){if(!(u&&u.readyState===WebSocket.OPEN&&E))return;try{u.send(t.buffer)}catch(e){console.error(`Error sending mic Opus:`,e)}}else t.type===`ready`&&t.wasm?console.log(`[Main] Microphone encodes Opus on libopus in WASM, the engine having no AudioEncoder.`):t.type===`error`&&console.error(`Mic AudioEncoder error:`,t.message)},ct.onerror=e=>console.error(`Mic encode worker error:`,e&&e.message),ct.postMessage({type:`init`,opusUrl:Pc()}),u&&u.connectSend){let e=new MessageChannel;st.port.postMessage({port:e.port1},[e.port1]),ct.postMessage({type:`pcmPort`,port:e.port2},[e.port2]);let t=new MessageChannel;ct.postMessage({type:`wirePort`,port:t.port1},[t.port1]),u.connectSend(t.port2)}st.port.onmessage=e=>{let t=e.data;if(ct&&E&&t&&t instanceof ArrayBuffer&&t.byteLength!==0)try{ct.postMessage({type:`pcm`,buffer:t},[t])}catch(e){console.error(`Mic PCM forward error:`,e)}},st.port.onmessageerror=e=>console.error(`Error from mic worklet:`,e),ot.connect(st),E=!0,mc()}catch(n){console.error(`Failed to start microphone capture:`,n),!e&&!t.withdrawn?alert(`Microphone error: ${n.name} - ${n.message}`):Ne(n)&&(Ze=!0),Bc(),Rc(`playback`)}}function Bc(){if(at&&(at.withdrawn=!0),!E&&!it&&!N)E&&(E=!1,mc());else{if(it&&=(it.getTracks().forEach(e=>e.stop()),null),st){st.port.onmessage=null,st.port.onmessageerror=null;try{st.disconnect()}catch{}st=null}if(ct){try{ct.postMessage({type:`stop`})}catch{}try{ct.terminate()}catch{}ct=null}if(ot){try{ot.disconnect()}catch{}ot=null}N&&(N.state===`closed`?N=null:N.close().catch(e=>console.error(`Error closing mic AudioContext:`,e)).finally(()=>N=null)),Rc(`playback`),E&&(E=!1,mc())}}let Vc=0;function Hc(e=!1){G||j||(j=new br({encoderPreference:$e,sendFrame:(e,t,n,r,i)=>{if(!(u&&u.readyState===WebSocket.OPEN&&Me))return;let a=new ArrayBuffer(3+n.byteLength),o=new Uint8Array(a);o[0]=6,o[1]=e,o[2]=+!!t|((r||0)/90&3)<<1|(i?8:0),o.set(n,3);try{Vc=a.byteLength,u.send(a)}catch(e){console.error(`Error sending webcam frame:`,e)}},canSend:()=>!u||u.bufferedAmount<=Math.max(j.bitrate/8*250/1e3,Vc),onStateChange:e=>{Me=e,mc()},onError:t=>{console.error(`Webcam capture error:`,t),e?Ne(t)&&(Qe=!0):alert(`Webcam error: ${t.name||`Error`} - ${t.message||t}`),Uc()}}),u&&u.connectWebcam&&j.setWireProvider(()=>{if(!u||!u.connectWebcam)return null;let e=new MessageChannel;return u.connectWebcam(e.port2),e.port1}),j.start(null))}function Uc(){j&&=(j.stop(),null),Me&&(Me=!1,mc())}function Wc(){ft&&=(clearInterval(ft),null),pt&&=(clearInterval(pt),null),Us(),ec(),Dc(),!window.isCleaningUp&&(window.isCleaningUp=!0,console.log(`Cleanup: Starting cleanup process...`),G||(Bc(),Uc()),u&&(u.onopen=null,u.onmessage=null,u.onerror=null,u.onclose=null,(u.readyState===WebSocket.OPEN||u.readyState===WebSocket.CONNECTING)&&u.close(),u=null,window.selkiesTransport=null,Ga=!1),h&&(h.state!==`closed`&&h.close().catch(e=>console.error(`Cleanup error:`,e)),h=null,uc(),g=null,y=null,window.currentAudioBufferSize=0,s&&=(s.postMessage({type:`close`}),s.terminate(),null)),Ac(),fs(),P=null,dt=null,ji=`connecting`,Mi=``,Yi=!1,Zi=!1,Y&&(Y.textContent=`Connecting...`),Y&&Y.classList.remove(`hidden`),ra&&ra.classList.remove(`hidden`),X&&(X.style.cursor=`auto`),C=!0,T=!0,E=!1,A.clear(),Ke=!1,Je=!1,window.fps=0,$i=0,na=performance.now(),console.log(`Cleanup: Finished cleanup process.`),window.isCleaningUp=!1)}function Gc(e=`unknown`){if(console.log(`Performing server-initiated video reset. Reason: ${e}. Current lastReceivedVideoFrameId before reset: ${Fe}`),Fe=-1,Ss=null,Le=-1,u&&typeof u.resetVideoAck==`function`&&u.resetVideoAck(),console.log(`  Reset lastReceivedVideoFrameId to ${Fe}.`),Ac(),jc(),qt(H)&&fs(),Wa&&(Wa=!1,Ba=null,Va=0,Ha=0,Ua=null,uo()),l&&c&&!qt(H))try{l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height),console.log(`  Cleared canvas during server-initiated reset.`)}catch(e){console.error(`  Error clearing canvas during server-initiated reset:`,e)}}function Kc(e){u&&u.readyState===WebSocket.OPEN&&(u.send(`LOST_FRAME ${e}`),Fi.lost++)}let qc=0;function Jc(){if(Io)return;let e=performance.now();e-qc<(G?1500:500)||(qc=e,u&&u.readyState===WebSocket.OPEN&&(u.send(`REQUEST_KEYFRAME`),Fi.keyframes++))}function Yc(){if(Ba=null,Va=0,Ha=0,Ua=null,Wa=!1,$)try{$.postMessage({type:`closeDecoder`})}catch{}fs(),qc=0,Jc()}function Xc(e,t){if(e.name===`QuotaExceededError`||e.message&&e.message.includes(`reclaimed`)){console.warn(`[initiateFallback] Ignoring soft error (Context: ${t}): Codec reclaimed by browser. Waiting for tab focus to re-initialize.`);return}if(!wr&&!window.isFallingBack&&H!==`jpeg`){wr=!0,Tr=Dr=performance.now(),console.warn(`[initiateFallback] Decoder error (Context: ${t}); retrying on software decode.`,e),Ir(!0,`decoder error (${t}: ${e&&e.message||e})`),Yc();return}if(performance.now()-Tr<Er){console.warn(`[initiateFallback] Ignoring decoder error (Context: ${t}) from the decoders the software switch replaced.`);return}let n=i(H);if(!G&&Gt(H)&&n!==`h264`){if(Fo)return;if(qo(`${n} (refused at decode)`,n),Fo){wr=!1,Ir(!1),fs();return}}if(Cr&&!window.isFallingBack&&!(ze>Dr))console.warn(`[initiateFallback] Software decode put out no frame (Context: ${t}); leaving the choice of decoder to the browser.`,e),Ir(!1),Tr=performance.now(),Yc();else if(console.error(`FATAL DECODER ERROR (Context: ${t}).`,e),!window.isFallingBack){if(window.isFallingBack=!0,Ir(!1),u&&u.readyState===WebSocket.OPEN&&(u.onclose=null,u.close()),ft&&=(clearInterval(ft),null),G)console.log(`Shared client fallback: Reloading page to re-sync with the stream.`),Y&&(Y.textContent=`A video error occurred. Reloading to re-sync with the stream...`,Y.classList.remove(`hidden`));else{let n=parseInt(window.localStorage.getItem(zr)||`0`);n++,gr(zr,n.toString());let r=`decoder crash ${n} in this browser (${t}: ${e&&e.message||e})`,i=null;n>=3?i=`jpeg`:H===`jpeg`?gr(zr,`0`):i=`h264enc`,i&&ga(i,r),va(r),console.log(`Primary client fallback, ${r}: this tab reloads on safe defaults${i?` and the ${i} encoder`:``}.`),Y&&(Y.textContent=`A critical video error occurred. Resetting to default settings and reloading...`,Y.classList.remove(`hidden`))}setTimeout(()=>{window.location.reload()},3e3)}}function Zc(){return ds(),window.isSecureContext?(window.VideoDecoder===void 0?(console.warn(`VideoDecoder API unavailable: the stream is pinned to the jpeg encoder.`),Qc()):console.log(`Pre-flight checks passed: Secure context and VideoDecoder API are available.`),!0):(console.error(`FATAL: Not in a secure context. WebCodecs require HTTPS.`),Y&&(Y.textContent=`Error: This application requires a secure connection (HTTPS). Please check the URL.`,Y.classList.remove(`hidden`)),ra&&ra.classList.add(`hidden`),!1)}function Qc(){H=`jpeg`,ga(`jpeg`,`no WebCodecs VideoDecoder`)}window.addEventListener(`beforeunload`,Wc),window.webrtcInput=null}var ki=`webrtc`,Ai=`websockets`,ji=window.location.origin+window.location.pathname,Mi=Oe(),Ni=e=>`${Mi}_${e}`,q=(e,t)=>{try{localStorage.setItem(e,t)}catch(t){console.warn(`Selkies: could not persist '${e}' to localStorage:`,t)}};(function(){try{if(typeof localStorage>`u`)return;let e=``;for(let t=0;t<ji.length;t++){let n=ji.charCodeAt(t);e+=n>=46&&n<=95||n>=97&&n<=122?ji[t]:`_`}let t=e+`?`,n=[];for(let e=0;e<localStorage.length;e++){let r=localStorage.key(e);r&&r.startsWith(t)&&n.push(r)}if(n.forEach(e=>localStorage.removeItem(e)),n.length&&console.log(`Selkies: removed ${n.length} stale token-scoped localStorage keys.`),e===Mi)return;let r=`${Mi}_storage_key_migrated`;if(localStorage.getItem(r)!==null)return;let i=`${e}_`,a=`${Mi}_`,o=[];for(let e=0;e<localStorage.length;e++){let t=localStorage.key(e);t!==null&&o.push(t)}let s=o.some(e=>e.startsWith(a)),c=o.filter(e=>e.startsWith(i));if(!s&&c.length>0){for(let e of c){let t=a+e.slice(i.length);if(localStorage.getItem(t)===null){let n=localStorage.getItem(e);n!==null&&q(t,n)}}console.log(`Migrated ${c.length} setting(s) from old storage prefix "${i}" to "${a}".`)}q(r,`1`)}catch(e){console.warn(`Storage key migration skipped due to error:`,e)}})();var Pi=null;function Fi(){let e=typeof window<`u`&&window.__SELKIES_STREAMING_MODE__?window.__SELKIES_STREAMING_MODE__:void 0,t=localStorage.getItem(Ni(`stream_mode`)),n=e||t||Ai;return console.log(`Streaming mode determined to be: ${n}`),n}function Ii(e){if(e.origin!==window.location.origin)return;let t=e.data;if(t.mode!==void 0&&t.type===`mode`){if(![ki,Ai].includes(t.mode))return;console.log(`Switching streaming mode to: ${t.mode}`),q(Ni(`stream_mode`),t.mode),setTimeout(()=>{window.location.reload()},2e3)}}function Li(e){switch(q(Ni(`stream_mode`),e),e){case ki:Pi=ui(),Pi.initialize();break;case Ai:Pi=Oi();break;default:throw Error(`Invalid client mode: ${e} received, aborting`)}}typeof window<`u`&&(window.addEventListener(`message`,Ii),window.selkiesCoreInitialize=function(){Fe(),Li(Fi())}),typeof window<`u`&&!window.__SELKIES_DEFER_INITIALIZATION&&window.selkiesCoreInitialize();