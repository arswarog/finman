!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){var o,r;o=[t,n,t(1)],void 0===(r=function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(t)}.apply(n,o))||(e.exports=r)},function(e,n,t){var o,r,i=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(r,i){function c(e){try{a(o.next(e))}catch(e){i(e)}}function u(e){try{a(o.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(c,u)}a((o=o.apply(e,n||[])).next())}))},c=this&&this.__generator||function(e,n){var t,o,r,i,c={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;c;)try{if(t=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,o=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(r=c.trys,(r=r.length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){c.label=i[1];break}if(6===i[0]&&c.label<r[1]){c.label=r[1],r=i;break}if(r&&c.label<r[2]){c.label=r[2],c.ops.push(i);break}r[2]&&c.ops.pop(),c.trys.pop();continue}i=n.call(e,c)}catch(e){i=[6,e],o=0}finally{t=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};o=[t,n,t(2)],void 0===(r=function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=new t.ApplicationUpdateService;console.log("SW ts 6"),console.log(location),self.addEventListener("install",(function(e){console.log("install",e),e.waitUntil(new Promise((function(e,n){return i(void 0,void 0,void 0,(function(){var n,t;return c(this,(function(o){switch(o.label){case 0:return[4,fetch("./asset-manifest.json").then((function(e){return e.json()}))];case 1:return n=o.sent(),(t=Object.entries(n.files).map((function(e){return e})).map((function(e){var n=e[0],t=e[1];return".map"===n.substr(-4)?"":t})).filter((function(e){return!!e}))).unshift("/finman/","/finman/manifest.json","/finman/favicon.ico","/finman/logo192.png","/finman/logo512.png"),console.log(t),[4,caches.open("v1").then((function(e){return i(void 0,void 0,void 0,(function(){var n;return c(this,(function(o){switch(o.label){case 0:return console.time("precaching"),console.log("cache ready. precaching"),[4,e.addAll(t)];case 1:return n=o.sent(),console.timeEnd("precaching"),[2,n]}}))}))}))];case 2:return o.sent(),e(),[2]}}))}))})))})),self.addEventListener("activate",(function(e){console.log("activate",e),o.init(),fetch("./asset-manifest.json").then((function(e){return e.json()})).then(console.log)})),self.addEventListener("message",(function(e){console.log("message",e)})),self.addEventListener("sync",(function(e){console.log("sync",e)})),self.addEventListener("push",(function(e){console.log("push",e)})),self.addEventListener("fetch",(function(e){var n;e.respondWith((n=e.request,console.log(n.url),"chrome-extension://"===n.url.substr(0,19)?function(e){return fetch(e)}(n):function(e){return caches.open("v1").then((function(n){return n.match(e).then((function(e){return e||Promise.reject("no-match")}))}))}(n)))})),n.default=void 0}.apply(n,o))||(e.exports=r)},function(e,n,t){var o;void 0===(o=function(e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function e(){}return e.prototype.init=function(){self.addEventListener("fetch",(function(e){console.log(e.request.url),e.respondWith(caches.match(e.request).then((function(n){return n||fetch(e.request)})))}))},e}();n.ApplicationUpdateService=t}.apply(n,[t,n]))||(e.exports=o)}]);