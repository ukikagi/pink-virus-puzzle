(this["webpackJsonppink-virus-puzzle"]=this["webpackJsonppink-virus-puzzle"]||[]).push([[0],{15:function(e,t,n){},16:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var c,a,r=n(1),i=n(0),u=n.n(i),f=n(9),o=n.n(f),l=(n(15),n(7)),O=n(3),h=n(4),s=n(2);function b(e){return Array(e).fill(0).map((function(e,t){return t}))}function j(e){return e.map((function(e){return Object(l.a)(e)}))}!function(e){e[e.BLANK=0]="BLANK",e[e.BRICK=1]="BRICK",e[e.BLOCK=2]="BLOCK",e[e.LADDER=3]="LADDER",e[e.ROPE=4]="ROPE",e[e.EXIT=5]="EXIT",e[e.GOLD=6]="GOLD",e[e.CHARA=7]="CHARA"}(c||(c={}));var d,R=40,v=40,L=(a={},Object(s.a)(a,c.BLANK,""),Object(s.a)(a,c.BRICK,"DarkRed"),Object(s.a)(a,c.BLOCK,"DarkCyan"),Object(s.a)(a,c.LADDER,"GreenYellow"),Object(s.a)(a,c.ROPE,"Khaki"),Object(s.a)(a,c.EXIT,"Red"),Object(s.a)(a,c.GOLD,"Cyan"),Object(s.a)(a,c.CHARA,""),a);function D(e){var t=Object(i.useRef)(null);return Object(i.useEffect)((function(){var n=t.current.getContext("2d");n.clearRect(0,0,e.width,e.height),b(e.field.height).forEach((function(t){b(e.field.width).forEach((function(a){e.field.value[t][a]!==c.BLANK&&function(e,t){var c=e.x,a=e.y;n.fillStyle=t,n.fillRect(R*c,v*a,R,v),n.strokeRect(R*c,v*a,R,v)}({x:a,y:t},L[e.field.value[t][a]])}))})),function(e){var t=e.x,c=e.y,a=R*(t+.2),r=v*(c+.2);n.fillStyle="pink",n.fillRect(a,r,24,24),n.strokeRect(a,r,24,24)}(e.chara)}),[e]),Object(r.jsx)("canvas",Object(O.a)({ref:t},e))}function A(e,t){return{x:e.x+[1,0,-1,0][t],y:e.y+[0,1,0,-1][t]}}function x(e,t){return e.value[t.y][t.x]}function E(e,t,n){e.value[t.y][t.x]=n}function y(e,t){return 0<=t.x&&t.x<e.width&&0<=t.y&&t.y<e.height}function C(e,t){return y(e,t)&&![c.BRICK,c.BLOCK].includes(x(e,t))}function I(e,t){var n=A(t,d.DOWN);return![c.LADDER,c.ROPE].includes(x(e,t))&&C(e,n)&&![c.LADDER].includes(x(e,n))}!function(e){e[e.RIGHT=0]="RIGHT",e[e.DOWN=1]="DOWN",e[e.LEFT=2]="LEFT",e[e.UP=3]="UP"}(d||(d={}));var g,p,w,B=(g="000000000000000007000000000003500000000003100000000003100000000003100000000003130000000000130000000003130000000003100000000003130000000006130000",p=12,w=12,console.assert(g.length===w*p),{field:b(p).map((function(e){return b(w).map((function(t){return parseInt(g[e*w+t])}))})),width:w,height:p});function K(e){var t=e.width,n=e.height,a=j(e.field),r={x:0,y:0},i={x:0,y:0};return b(n).forEach((function(e){b(t).forEach((function(t){switch(a[e][t]){case c.CHARA:a[e][t]=c.BLANK,r={x:t,y:e};break;case c.EXIT:a[e][t]=c.BRICK,i={x:t,y:e}}}))})),{field:{value:a,width:t,height:n},chara:r,exit:i}}function k(e){var t=K(B),n=Object(i.useState)(t.field),a=Object(h.a)(n,2),u=a[0],f=a[1],o=Object(i.useState)(t.chara),s=Object(h.a)(o,2),b=s[0],R=s[1],v=Object(i.useState)([]),L=Object(h.a)(v,2),g=L[0],p=L[1],w=Object(i.useState)(t.exit),k=Object(h.a)(w,2),T=k[0],N=k[1],P=Object(i.useState)(!1),G=Object(h.a)(P,2),S=(G[0],G[1]);function F(e,t,n){x(e,t)===c.GOLD&&E(e,t,c.BLANK),x(e,t)===c.EXIT&&S(!0),0===function(e){return e.value.flatMap((function(e){return e.filter((function(e){return e===c.GOLD}))})).length}(e)&&E(e,n,c.EXIT)}function H(e){if(e!==d.UP||x(u,b)===c.LADDER){var t=A(b,e);if(C(u,t)){var n=Object(O.a)({},t),a=Object(O.a)(Object(O.a)({},u),{},{value:j(u.value)});for(F(a,n,T);I(a,n);)F(a,n=A(n,d.DOWN),T);R(n),f(a)}}}function m(e){var t=A(A(b,d.DOWN),e);if(function(e,t){return y(e,t)&&x(e,t)===c.BRICK&&C(e,A(t,d.UP))}(u,t)){var n=Object(O.a)(Object(O.a)({},u),{},{value:j(u.value)}),a=Object(l.a)(g);if(E(n,t,c.BLANK),a.push(t),a.length>5)E(n,a.shift(),c.BRICK);f(n),p(a)}}return Object(r.jsx)("div",{tabIndex:0,onKeyDown:function(e){switch(e.key){case"ArrowDown":H(d.DOWN);break;case"ArrowLeft":H(d.LEFT);break;case"ArrowRight":H(d.RIGHT);break;case"ArrowUp":H(d.UP);break;case"z":m(d.LEFT);break;case"x":m(d.RIGHT);break;case"r":!function(e){var t=K(e),n=t.field,c=t.chara,a=t.exit;f(n),R(c),p([]),N(a),S(!1)}(B)}},children:Object(r.jsx)(D,{field:u,chara:b,width:e.width,height:e.height})})}n(16);var T=function(){return Object(r.jsx)("div",{className:"App",children:Object(r.jsx)(k,{width:480,height:480})})},N=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),c(e),a(e),r(e),i(e)}))};o.a.render(Object(r.jsx)(u.a.StrictMode,{children:Object(r.jsx)(T,{})}),document.getElementById("root")),N()}},[[17,1,2]]]);
//# sourceMappingURL=main.a8883f4e.chunk.js.map