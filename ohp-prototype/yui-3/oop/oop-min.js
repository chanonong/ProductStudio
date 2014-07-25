/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("oop",function(e,t){function a(t,n,i,s,o){if(t&&t[o]&&t!==e)return t[o].call(t,n,i);switch(r.test(t)){case 1:return r[o](t,n,i);case 2:return r[o](e.Array(t,0,!0),n,i);default:return e.Object[o](t,n,i,s)}}var n=e.Lang,r=e.Array,i=Object.prototype,s="_~yuim~_",o=i.hasOwnProperty,u=i.toString;e.augment=function(t,n,r,i,s){var a=t.prototype,f=a&&n,l=n.prototype,c=a||t,h,p,d,v,m;return s=s?e.Array(s):[],f&&(p={},d={},v={},h=function(e,t){if(r||!(t in a))u.call(e)==="[object Function]"?(v[t]=e,p[t]=d[t]=function(){return m(this,e,arguments)}):p[t]=e},m=function(e,t,r){for(var i in v)o.call(v,i)&&e[i]===d[i]&&(e[i]=v[i]);return n.apply(e,s),t.apply(e,r)},i?e.Array.each(i,function(e){e in l&&h(l[e],e)}):e.Object.each(l,h,null,!0)),e.mix(c,p||l,r,i),f||n.apply(c,s),t},e.aggregate=function(t,n,r,i){return e.mix(t,n,r,i,0,!0)},e.extend=function(t,n,r,s){(!n||!t)&&e.error("extend failed, verify dependencies");var o=n.prototype,u=e.Object(o);return t.prototype=u,u.constructor=t,t.superclass=o,n!=Object&&o.constructor==i.constructor&&(o.constructor=n),r&&e.mix(u,r,!0),s&&e.mix(t,s,!0),t},e.each=function(e,t,n,r){return a(e,t,n,r,"each")},e.some=function(e,t,n,r){return a(e,t,n,r,"some")},e.clone=function(t,r,i,o,u,a){var f,l,c;if(!n.isObject(t)||e.instanceOf(t,YUI)||t.addEventListener||t.attachEvent)return t;l=a||{};switch(n.type(t)){case"date":return new Date(t);case"regexp":return t;case"function":return t;case"array":f=[];break;default:if(t[s])return l[t[s]];c=e.guid(),f=r?{}:e.Object(t),t[s]=c,l[c]=t}return e.each(t,function(n,a){(a||a===0)&&(!i||i.call(o||this,n,a,this,t)!==!1)&&a!==s&&a!="prototype"&&(this[a]=e.clone(n,r,i,o,u||t,l))},f),a||(e.Object.each(l,function(e,t){if(e[s])try{delete e[s]}catch(n){e[s]=null}},this),l=null),f},e.bind=function(t,r){var i=arguments.length>2?e.Array(arguments,2,!0):null;return function(){var s=n.isString(t)?r[t]:t,o=i?i.concat(e.Array(arguments,0,!0)):arguments;return s.apply(r||s,o)}},e.rbind=function(t,r){var i=arguments.length>2?e.Array(arguments,2,!0):null;return function(){var s=n.isString(t)?r[t]:t,o=i?e.Array(arguments,0,!0).concat(i):arguments;return s.apply(r||s,o)}}},"3.17.2",{requires:["yui-base"]});
