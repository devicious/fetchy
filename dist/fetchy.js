(()=>{var e={249:function(e,t,i){var r;e.exports=r=r||function(e,t){var r;if("undefined"!=typeof window&&window.crypto&&(r=window.crypto),"undefined"!=typeof self&&self.crypto&&(r=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(r=globalThis.crypto),!r&&"undefined"!=typeof window&&window.msCrypto&&(r=window.msCrypto),!r&&void 0!==i.g&&i.g.crypto&&(r=i.g.crypto),!r)try{r=i(480)}catch(e){}var n=function(){if(r){if("function"==typeof r.getRandomValues)try{return r.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof r.randomBytes)try{return r.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},s=Object.create||function(){function e(){}return function(t){var i;return e.prototype=t,i=new e,e.prototype=null,i}}(),o={},a=o.lib={},c=a.Base={extend:function(e){var t=s(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},h=a.WordArray=c.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=null!=t?t:4*e.length},toString:function(e){return(e||d).stringify(this)},concat:function(e){var t=this.words,i=e.words,r=this.sigBytes,n=e.sigBytes;if(this.clamp(),r%4)for(var s=0;s<n;s++){var o=i[s>>>2]>>>24-s%4*8&255;t[r+s>>>2]|=o<<24-(r+s)%4*8}else for(var a=0;a<n;a+=4)t[r+a>>>2]=i[a>>>2];return this.sigBytes+=n,this},clamp:function(){var t=this.words,i=this.sigBytes;t[i>>>2]&=4294967295<<32-i%4*8,t.length=e.ceil(i/4)},clone:function(){var e=c.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],i=0;i<e;i+=4)t.push(n());return new h.init(t,e)}}),u=o.enc={},d=u.Hex={stringify:function(e){for(var t=e.words,i=e.sigBytes,r=[],n=0;n<i;n++){var s=t[n>>>2]>>>24-n%4*8&255;r.push((s>>>4).toString(16)),r.push((15&s).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,i=[],r=0;r<t;r+=2)i[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new h.init(i,t/2)}},f=u.Latin1={stringify:function(e){for(var t=e.words,i=e.sigBytes,r=[],n=0;n<i;n++){var s=t[n>>>2]>>>24-n%4*8&255;r.push(String.fromCharCode(s))}return r.join("")},parse:function(e){for(var t=e.length,i=[],r=0;r<t;r++)i[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new h.init(i,t)}},l=u.Utf8={stringify:function(e){try{return decodeURIComponent(escape(f.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return f.parse(unescape(encodeURIComponent(e)))}},p=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new h.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=l.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var i,r=this._data,n=r.words,s=r.sigBytes,o=this.blockSize,a=s/(4*o),c=(a=t?e.ceil(a):e.max((0|a)-this._minBufferSize,0))*o,u=e.min(4*c,s);if(c){for(var d=0;d<c;d+=o)this._doProcessBlock(n,d);i=n.splice(0,c),r.sigBytes-=u}return new h.init(i,u)},clone:function(){var e=c.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),g=(a.Hasher=p.extend({cfg:c.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){p.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,i){return new e.init(i).finalize(t)}},_createHmacHelper:function(e){return function(t,i){return new g.HMAC.init(e,i).finalize(t)}}}),o.algo={});return o}(Math)},214:function(e,t,i){var r;e.exports=(r=i(249),function(e){var t=r,i=t.lib,n=i.WordArray,s=i.Hasher,o=t.algo,a=[];!function(){for(var t=0;t<64;t++)a[t]=4294967296*e.abs(e.sin(t+1))|0}();var c=o.MD5=s.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var i=0;i<16;i++){var r=t+i,n=e[r];e[r]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var s=this._hash.words,o=e[t+0],c=e[t+1],l=e[t+2],p=e[t+3],g=e[t+4],y=e[t+5],m=e[t+6],w=e[t+7],v=e[t+8],S=e[t+9],_=e[t+10],b=e[t+11],x=e[t+12],I=e[t+13],C=e[t+14],T=e[t+15],D=s[0],O=s[1],B=s[2],U=s[3];D=h(D,O,B,U,o,7,a[0]),U=h(U,D,O,B,c,12,a[1]),B=h(B,U,D,O,l,17,a[2]),O=h(O,B,U,D,p,22,a[3]),D=h(D,O,B,U,g,7,a[4]),U=h(U,D,O,B,y,12,a[5]),B=h(B,U,D,O,m,17,a[6]),O=h(O,B,U,D,w,22,a[7]),D=h(D,O,B,U,v,7,a[8]),U=h(U,D,O,B,S,12,a[9]),B=h(B,U,D,O,_,17,a[10]),O=h(O,B,U,D,b,22,a[11]),D=h(D,O,B,U,x,7,a[12]),U=h(U,D,O,B,I,12,a[13]),B=h(B,U,D,O,C,17,a[14]),D=u(D,O=h(O,B,U,D,T,22,a[15]),B,U,c,5,a[16]),U=u(U,D,O,B,m,9,a[17]),B=u(B,U,D,O,b,14,a[18]),O=u(O,B,U,D,o,20,a[19]),D=u(D,O,B,U,y,5,a[20]),U=u(U,D,O,B,_,9,a[21]),B=u(B,U,D,O,T,14,a[22]),O=u(O,B,U,D,g,20,a[23]),D=u(D,O,B,U,S,5,a[24]),U=u(U,D,O,B,C,9,a[25]),B=u(B,U,D,O,p,14,a[26]),O=u(O,B,U,D,v,20,a[27]),D=u(D,O,B,U,I,5,a[28]),U=u(U,D,O,B,l,9,a[29]),B=u(B,U,D,O,w,14,a[30]),D=d(D,O=u(O,B,U,D,x,20,a[31]),B,U,y,4,a[32]),U=d(U,D,O,B,v,11,a[33]),B=d(B,U,D,O,b,16,a[34]),O=d(O,B,U,D,C,23,a[35]),D=d(D,O,B,U,c,4,a[36]),U=d(U,D,O,B,g,11,a[37]),B=d(B,U,D,O,w,16,a[38]),O=d(O,B,U,D,_,23,a[39]),D=d(D,O,B,U,I,4,a[40]),U=d(U,D,O,B,o,11,a[41]),B=d(B,U,D,O,p,16,a[42]),O=d(O,B,U,D,m,23,a[43]),D=d(D,O,B,U,S,4,a[44]),U=d(U,D,O,B,x,11,a[45]),B=d(B,U,D,O,T,16,a[46]),D=f(D,O=d(O,B,U,D,l,23,a[47]),B,U,o,6,a[48]),U=f(U,D,O,B,w,10,a[49]),B=f(B,U,D,O,C,15,a[50]),O=f(O,B,U,D,y,21,a[51]),D=f(D,O,B,U,x,6,a[52]),U=f(U,D,O,B,p,10,a[53]),B=f(B,U,D,O,_,15,a[54]),O=f(O,B,U,D,c,21,a[55]),D=f(D,O,B,U,v,6,a[56]),U=f(U,D,O,B,T,10,a[57]),B=f(B,U,D,O,m,15,a[58]),O=f(O,B,U,D,I,21,a[59]),D=f(D,O,B,U,g,6,a[60]),U=f(U,D,O,B,b,10,a[61]),B=f(B,U,D,O,l,15,a[62]),O=f(O,B,U,D,S,21,a[63]),s[0]=s[0]+D|0,s[1]=s[1]+O|0,s[2]=s[2]+B|0,s[3]=s[3]+U|0},_doFinalize:function(){var t=this._data,i=t.words,r=8*this._nDataBytes,n=8*t.sigBytes;i[n>>>5]|=128<<24-n%32;var s=e.floor(r/4294967296),o=r;i[15+(n+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),i[14+(n+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t.sigBytes=4*(i.length+1),this._process();for(var a=this._hash,c=a.words,h=0;h<4;h++){var u=c[h];c[h]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}return a},clone:function(){var e=s.clone.call(this);return e._hash=this._hash.clone(),e}});function h(e,t,i,r,n,s,o){var a=e+(t&i|~t&r)+n+o;return(a<<s|a>>>32-s)+t}function u(e,t,i,r,n,s,o){var a=e+(t&r|i&~r)+n+o;return(a<<s|a>>>32-s)+t}function d(e,t,i,r,n,s,o){var a=e+(t^i^r)+n+o;return(a<<s|a>>>32-s)+t}function f(e,t,i,r,n,s,o){var a=e+(i^(t|~r))+n+o;return(a<<s|a>>>32-s)+t}t.MD5=s._createHelper(c),t.HmacMD5=s._createHmacHelper(c)}(Math),r.MD5)},264:(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Fetchy=void 0;const r=i(214);class n{constructor(e){this.config={url:"",timeout:3e4,retry:0,format:"json",method:"GET"},this.cacheUID="_cacheResponseData",this.cacheQueueUID="_cacheResponseQueue",this.cacheQueueRetries=40,this.cacheStorage={},this.writable=!0,this.config={url:e,method:"GET",headers:new Headers({Accept:"application/json","Content-Type":"application/json"}),timeout:3e4,retry:0,delay:0,format:"json",credentials:"same-origin",mode:"cors",cache:!1,id:"",expiry:0,validator:e=>e&&e.meta.ok},this.refreshCacheStorage(),this.cacheUID="_cacheResponseData",this.cacheQueueUID="_cacheResponseQueue",this.cacheQueueRetries=40}attachSelf(e){const t=Object.getPrototypeOf(e);return Object.setPrototypeOf(t,this),e}do(){this.writable=!1;const e=this.config.cache;return this.attachSelf(new Promise(((t,i)=>{if(!e||e&&!this.isCached()&&!this.isInQueue()){const{timeout:n,retry:s,delay:o}=this.config;(r=()=>new Promise(((e,t)=>{let i;n&&(i=setTimeout((()=>{t("Timeout")}),n)),this.call().then((t=>e(t))).catch((e=>t(e))).finally((()=>{i&&clearTimeout(i)}))})),new Promise(((e,t)=>{!function i(r,n){r().then((t=>{e(t)})).catch((e=>{n>1?setTimeout((()=>{i(r,--n)}),o):t(e)}))}(r,s)}))).then((e=>{t(this.formatResponse(e))})).catch((e=>{i(e)})),e&&this.setQueue()}else t(this.retrieveCached());var r})).then((t=>(e&&!this.isCached()&&this.config.validator(t)&&this.storeCached(t),t))))}call(){const{method:e,headers:t,credentials:i,mode:r,data:n}=this.config,s="string"!=typeof n?JSON.stringify(n):n;return fetch(this.config.url,{method:e,headers:t,credentials:i,body:s,mode:r})}formatResponse(e){if(e[this.config.format])return e[this.config.format]().then((t=>(Object.defineProperty(t,"meta",{value:{ok:e.ok,status:e.status,redirected:e.redirected,statusText:e.statusText,type:e.type},writable:!1,enumerable:!1}),t)));throw new Error(`${e.status} - The response format ${this.config.format} is not available on current response.`)}method(e){if(!(e&&["GET","POST","PATCH","PUT","DELETE","OPTIONS"].indexOf(e)>=0))throw`Method not allowed ${e}`;return this.override({method:e}),this}headers(e){return e&&this.override({headers:new Headers(e)}),this}timeout(e){if(!(e&&e>=1))throw"Timeout cannot be less than one second.";return this.override({timeout:1e3*e}),this}format(e){if(!(e&&["json","text","blob"].indexOf(e)>=0))throw`The format you specified ${e} is not valid.`;return this.override({format:e}),this}retry(e,t=0){if(!(e&&e>=0))throw"Retries cannot be less than zero.";return this.override({retry:e,delay:t}),this}data(e){const t=this.clone();if("GET"===this.config.method)throw"You cannot specify a body with GET calls.";return t.override({data:e}),t}id(e){if(!e)throw"ID must be a non empty string value";return this.override({id:e}),this}credentials(e){if(!(e&&["omit","same-origin","include"].indexOf(e)>=0))throw`The credential mode you specified ${e} is not valid.`;return this.override({credentials:e}),this}mode(e){if(!(e&&["cors","same-origin","no-cors"].indexOf(e)>=0))throw`The mode you specified ${e} is not valid.`;return this.override({mode:e}),this}validator(e){if(!e||"function"!=typeof e)throw"You must specify a valid function as a validator";return this.override({validator:e}),this}clone(){const e=this.config.url,t=new n(e);return t.override(this.config),t}override(e){if(!this.writable)throw"Configuration is not editable anymore";return this.config=Object.assign(Object.assign({},this.config),e),this}cache(e){return this.override({cache:!!e}),this}expiry(e){if(!(e&&e>=1))throw"Expiry cannot be less than one minute.";{const t=(new Date).getTime();this.override({expiry:t+6e4*e})}return this}clearCache(e){if(e){const t=JSON.parse(sessionStorage.getItem(this.cacheUID)||"{}");for(let i in t)t.hasOwnProperty(i)&&t[i].id===e&&delete t[i];delete window[this.cacheQueueUID][e],sessionStorage.setItem(this.cacheUID,JSON.stringify(t)),this.cacheStorage=t}else sessionStorage.removeItem(this.cacheUID),this.cacheStorage={},window[this.cacheQueueUID]={}}isCached(){this.refreshCacheStorage();const e=this.getCacheHash(),t=this.cacheStorage[e],i=(new Date).getTime();return!!t&&(!t.expiry||t.expiry>i)}refreshCacheStorage(){this.cacheStorage=JSON.parse(sessionStorage.getItem(this.cacheUID)||"{}"),window[this.cacheQueueUID]=window[this.cacheQueueUID]||{}}retrieveCached(){return new Promise(((e,t)=>{this.refreshCacheStorage();const i=this.getCacheHash(),r=this.cacheStorage[i];if(r||this.isInQueue())if(r)e(r.data);else{let r=0;const n=this.cacheQueueRetries,s=this,o=setInterval((()=>{s.refreshCacheStorage();const a=s.cacheStorage[i];a?(e(a.data),clearInterval(o)):r<n?r++:(clearInterval(o),t("Unexpected timeout error during cache retrieval"))}),350)}else t("Unexpected error during cache retrieval")}))}storeCached(e){this.refreshCacheStorage();const t=this.getCacheHash();this.cacheStorage[t]={expiry:this.config.expiry,id:this.config.id||t,data:e},sessionStorage.setItem(this.cacheUID,JSON.stringify(this.cacheStorage)),delete window[this.cacheQueueUID][t]}getCacheHash(){const{url:e,method:t,data:i,format:n,credentials:s,mode:o,id:a}=this.config,c=JSON.stringify({url:e,method:t,data:i,format:n,credentials:s,mode:o});return`${a}-${r(c.replace(/[^\w]/gi,"")).toString()}`}setQueue(){const e=this.getCacheHash();window[this.cacheQueueUID][e]=!0}isInQueue(){const e=this.getCacheHash();return!!window[this.cacheQueueUID][e]}then(e){return this.do().then(e)}catch(e){return this.do().catch(e)}finally(e){return this.do().finally(e)}}t.Fetchy=n},480:()=>{}},t={};function i(r){var n=t[r];if(void 0!==n)return n.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,i),s.exports}i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{"use strict";const e=i(264);i.g.Fetchy=e.Fetchy})()})();
//# sourceMappingURL=fetchy.js.map