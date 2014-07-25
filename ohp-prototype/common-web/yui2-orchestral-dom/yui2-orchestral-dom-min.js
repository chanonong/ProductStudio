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
YUI.add("yui2-orchestral-dom",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.util"),r.util.Dom=function(){"use strict";var e=n.util.Dom,t=1,i={TABLE:["<table>","</table>",1],TBODY:["<table><tbody>","</tbody></table>",2],THEAD:["<table><thead>","</thead></table>",2],TFOOT:["<table><tfoot>","</tfoot></table>",2],TR:["<table><tbody><tr>","</tr></tbody></table>",3],SELECT:["<select>","</select>",1]},s=/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img,o=[],u=function(t){var r=t;while(r&&r.tagName!=="BODY")e.getStyle(r,"display")==="none"&&(o.push({element:r,visibility:n.util.Dom.getStyle(r,"visibility"),display:n.util.Dom.getStyle(r,"display")}),e.setStyle(r,"visibility","hidden"),e.setStyle(r,"display","block")),r=r.parentNode},a=function(){var t=o.pop();while(t)e.setStyle(t.element,"visibility",t.visibility),e.setStyle(t.element,"display",t.display),t=o.pop()},f=function(t){t=e.get(t);var n=t.childNodes.length,i;for(i=0;i<n;i+=1)r.util.Dom.remove(t.childNodes[0],!0)},l=function(t,n){t=t.replace(s,"");var r=document.createElement("div"),i=[],o=r,u,a;r.innerHTML=n?n[0]+t+n[1]:t;if(n)for(u=0;u<n[2];u+=1)o=e.getFirstChild(o);a=o.childNodes.length;for(u=0;u<a;u+=1)i[u]=o.childNodes[u];return f(r),r=null,i},c=function(n,r,s){n=e.get(n);var o=null,u=l(r,i[n.parentNode.tagName]),a,f=u.length,c;for(c=0;c<f;c+=1)a=u[c],s(a,n),!o&&a.nodeType===t&&(o=a);return o};return{getDimensions:function(t){t=e.get(t),u(t);var n=t.offsetWidth,r=t.offsetHeight;return a(),{width:n,height:r}},getHeight:function(e){return r.util.Dom.getDimensions(e).height},getWidth:function(e){return r.util.Dom.getDimensions(e).width},resizeTo:function(t,n,i){n&&(e.setStyle(t,"width",n+"px"),e.setStyle(t,"width",n+(n-r.util.Dom.getWidth(t))+"px")),i&&(e.setStyle(t,"height",i+"px"),e.setStyle(t,"height",i+(i-r.util.Dom.getHeight(t))+"px"))},remove:function(t,r){t=e.get(t);if(t)return t.parentNode.removeChild(t),r&&n.util.Event.purgeElement(t,!1),t;return},insertHtmlBefore:function(t,n){return c(t,n,e.insertBefore)},insertHtmlAfter:function(t,n){return c(t,n,e.insertAfter)},insertHtmlAsFirstChild:function(t,n){return r.util.Dom.insertHtmlBefore(e.getFirstChild(t),n)},insertHtmlAsLastChild:function(t,n){return r.util.Dom.insertHtmlAfter(e.getLastChild(t),n)},isElement:function(e){return typeof HTMLElement=="object"?e instanceof HTMLElement:n.lang.isObject(e)&&e.nodeType===t&&n.lang.isString(e.nodeName)},setInnerHtml:function(t,n){t=e.get(t);if(i[t.tagName]){f(t);var r=l(n,i[t.tagName]),o=r.length,u;for(u=0;u<o;u+=1)t.appendChild(r[u])}else t.innerHTML=n.replace(s,"");return e.getFirstChild(t)},setText:document.documentElement.textContent!==undefined?function(t,n){e.get(t).textContent=n}:function(t,n){e.get(t).innerText=n}}}(),n.register("orchestral-dom",r.util.Dom,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui2-dom","yui2-event","yui2-orchestral"]});
