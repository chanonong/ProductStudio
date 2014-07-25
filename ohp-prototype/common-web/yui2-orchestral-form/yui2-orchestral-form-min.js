/*
 * Copyright (c) Orchestral Developments Ltd (2001 - 2014).
 *
 * This document is copyright. Except for the purpose of fair reviewing, no part
 * of this publication may be reproduced or transmitted in any form or by any
 * means, electronic or mechanical, including photocopying, recording, or any
 * information storage and retrieval system, without permission in writing from
 * the publisher. Infringers of copyright render themselves liable for
 * prosecution.
 */
YUI.add("yui2-orchestral-form",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.util"),r.util.Form=function(){var e=n.lang,t=n.util.Dom,i=n.util.Selector,s=function(e){return e.replace(/\r\n/g,"\r").replace(/\n/g,"\r")},o=function(t,n){return t=t||"",n=n||"",e.isArray(t)?t=t.join(","):e.isObject(t)&&(t=e.dump(t)),e.isArray(n)?n=n.join(","):e.isObject(n)&&(n=e.dump(n)),t==n},u=function(){return!0},a=function(e){var n=t.get(e),r=[];return r=r.concat(t.getElementsBy(u,"input",e)),r=r.concat(t.getElementsBy(u,"textarea",e)),r=r.concat(t.getElementsBy(u,"select",e)),r},f={input:function(e){var t=e.length?e[0].type:e.type;switch(t){case"checkbox":case"radio":return this.checkbox(e);default:return this.textarea(e)}},checkbox:function(e){var n=[];return t.batch(e,function(e){e.checked&&n.push(e.value?e.value:"on")}),this.returnArrayValue(n)},textarea:function(e){var n=[];return t.batch(e,function(e){(e.value||e.value==="")&&n.push(s(e.value))}),this.returnArrayValue(n)},select:function(e){var n=[];return t.batch(e,function(e){var t=e.options.length,r,i,s;for(r=0;r<t;r++)i=e.options[r],s=f.optionValue(i),i.selected&&s!==""&&n.push(s)}),this.returnArrayValue(n)},optionValue:function(e){return e.value?e.value:e.value===""?"":e.text},returnArrayValue:function(e){return e.length?e.length==1?e[0]:e:null}},l={input:function(e,t){var n=t.length?t[0].type:t.type;switch(n.toLowerCase()){case"checkbox":case"radio":this.checkbox(e,t);break;default:this.textarea(e,t)}},textarea:function(n,r){var i=e.isString(n.value)?[n.value]:n.value;t.batch(r,function(e){e.value=s(i.shift())})},checkbox:function(n,i){var s=e.isString(n.value)||e.isBoolean(n.value)?[n.value]:n.value;t.batch(i,function(e){!e.value||e.value=="on"?e.checked=r.lang.contains(!0,s)||r.lang.contains("on",s):e.checked=r.lang.contains(e.value,s)})},select:function(n,i){var s=e.isString(n.value)?[n.value]:n.value;t.batch(i,function(e){var t=e.options.length,n,i;for(n=0;n<t;n++)i=e.options[n],i.selected=r.lang.contains(f.optionValue(i),s)})}},c=function(e){return n.env.ua.ie>0?typeof e.length=="number"&&typeof e.item=="function"&&typeof e.nextNode=="function"&&typeof e.reset=="function":e instanceof NodeList};return{toQueryString:function(t){var n=[],r,i,s,o;for(r in t)if(t.hasOwnProperty(r)){i=t[r],e.isArray(i)||(i=[i]),o=i.length;for(s=0;s<o;s++)n.push(encodeURIComponent(r)+"="+encodeURIComponent(i[s]))}return n.join("&")},toParameters:function(t){var n=e.trim(t).match(/([^?#]*)(#.*)?$/);if(!n)return{};var r={},i=n[1].split("&"),s=i.length,o,u,a,f;for(o=0;o<s;o++)u=i[o].split("="),u[0]&&(a=decodeURIComponent(u[0]),f=u[1]?decodeURIComponent(u[1]):"",r[a]!==undefined?(e.isArray(r[a])||(r[a]=[r[a]]),f&&r[a].push(decodeURIComponent(f))):r[a]=decodeURIComponent(f));return r},fireEvents:function(e,n){t.batch(n,function(t){if(document.createEventObject)t.fireEvent("on"+e,document.createEventObject());else{var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}})},activate:function(e){e=t.get(e),e.length&&(e=e[0]);try{e.focus(),e.select&&!i.test(e,"input[type=button], input[type=reset], input[type=submit]")&&e.select()}catch(n){}},disable:function(n){var r,i;n=t.get(n),e.isArray(n)||(n=[n]),i=n.length;for(r=0;r<i;r++)n[r].blur(),n[r].disabled=!0},enable:function(n){var r,i;n=t.get(n),e.isArray(n)||(n=[n]),i=n.length;for(r=0;r<i;r++)n[r].disabled=!1},getValue:function(e){var n;return e=t.get(e),n=e.tagName?e.tagName.toLowerCase():e[0].tagName.toLowerCase(),f[n](e)},setValue:function(e,n){e=t.get(e);var i={name:e.tagName?e.tagName.toLowerCase():e[0].tagName.toLowerCase(),value:n||""},s=r.util.Form.getValue(e);l[i.name](i,e);var u=r.util.Form.getValue(e);o(s,u)||this.fireEvents("change",e)},isEmpty:function(t){if(e.isArray(t)||c(t))throw new Error("isEmpty must be passed a single element");var n=e.trim(r.util.Form.getValue(t));return n===null||n===""},isEmptyScope:function(e){var t=a(e),n=t.length,r;for(r=0;r<n;r++)if(!this.isEmpty(t[r]))return!1;return!0},deserialize:function(e,t){var n=a(e),i,s,u,f,c,h;for(i in t)s={name:i,value:t[i]||""},u=r.lang.filter(n,function(e){return e.name==s.name}),u.length>0&&(f=u[0].tagName.toLowerCase(),c=r.util.Form.getValue(u),l[f](s,u),h=r.util.Form.getValue(u),o(c,h)||this.fireEvents("change",u))},serialize:function(n){var r=a(n),i={};return t.batch(r,function(n){if(!n.disabled&&n.name){var r=n.name;n=t.get(n);var s=f[n.tagName.toLowerCase()](n);if(e.isValue(i[r])&&i[r]!==""&&e.isValue(s))e.isArray(i[r])||(i[r]=[i[r]]),i[r].push(s);else if(e.isUndefined(i[r])||!i[r])i[r]=s||""}}),i},clear:function(e){var n=a(e);t.batch(n,function(e){switch(e.type.toLowerCase()){case"checkbox":case"radio":e.checked=!1;break;default:e.tagName&&e.tagName.toLowerCase()==="select"?e.selectedIndex=0:e.value=""}})},isDirty:function(e){var t=a(e),n=t.length,r,i,o,u;for(r=0;r<n;r++){o=t[r];if(o.className.toLowerCase().indexOf("derived")!=-1)continue;switch(o.type.toLowerCase()){case"checkbox":case"radio":if(o.checked!=o.defaultChecked)return!0;break;case"select-one":case"select-multiple":for(i=0;i<o.options.length;i++){u=o.options[i];if(u.selected!=u.defaultSelected&&f.optionValue(u)!="")return!0}break;default:if(s(o.value)!=s(o.defaultValue))return!0}}return!1},clean:function(e){var t=a(e),n=t.length,r,i,s,o;for(r=0;r<n;r++){s=t[r];switch(s.type.toLowerCase()){case"checkbox":case"radio":s.defaultChecked=s.checked;break;case"select-one":case"select-multiple":for(i=0;i<s.options.length;i++)o=s.options[i],o.defaultSelected=o.selected;break;default:s.defaultValue=s.value}}}}}(),n.register("orchestral-form",r.util.Form,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui2-dom","yui2-selector","yui2-orchestral"]});
