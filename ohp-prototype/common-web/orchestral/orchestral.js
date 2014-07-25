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
YAHOO.namespace("ORCHESTRAL","ORCHESTRAL.util","ORCHESTRAL.lang");var ORCHESTRAL=YAHOO.ORCHESTRAL;(function(){"use strict";var e=YAHOO.util.Dom,t=YAHOO.util.Event,n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;","`":"&#x60;"};YAHOO.util.Event.throwErrors=!0,ORCHESTRAL.YUI_2_CONTEXT="/yui-2.8",ORCHESTRAL.COMMON_WEB_CONTEXT="/common-web",function(){var t=e.getElementsBy(function(){return!0},"script");e.batch(t,function(e,t){var n=e.getAttribute("src");n&&t.exec(n)&&(ORCHESTRAL.YUI_2_CONTEXT=n.slice(0,-1*"/event/event.js".length))},new RegExp("(/yui-2.\\d+)/event/event.js$")),e.batch(t,function(e,t){var n=e.getAttribute("src");n&&t.exec(n)&&(ORCHESTRAL.COMMON_WEB_CONTEXT=n.slice(0,-1*"/orchestral/orchestral.js".length))},new RegExp("(/common-web)/orchestral/orchestral.js$"))}(),ORCHESTRAL.use=function(e,t){var n=new YAHOO.util.YUILoader({allowRollup:!0,base:ORCHESTRAL.YUI_2_CONTEXT+"/"});n.addModule({name:"orchestral-loader",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/loader/loader.js",type:"js"}),n.require("orchestral-loader"),n.insert({onSuccess:function(){ORCHESTRAL.util.Loader.load(e,t)}})},ORCHESTRAL.env={ua:YAHOO.lang.merge(YAHOO.env.ua,{ie:document.documentMode?document.documentMode:YAHOO.env.ua.ie})},ORCHESTRAL.env.ua.ie&&ORCHESTRAL.env.ua.ie<9&&(e.addClass(document.documentElement,"ie"+ORCHESTRAL.env.ua.ie),ORCHESTRAL.env.ua.ie===6&&function(){var e,t,n;e=function(){var e="orchestral/orchestral.js",t=new RegExp("(^.*/common-web/)"+e+"$"),n=document.getElementsByTagName("script"),r,i,s;for(r=n.length-1;r>=0;r-=1){i=n.item(r).src;if(i){s=t.exec(i);if(s)return s[1]}}},t=function(){var e="This content is not displayed because the browser you are using (Internet Explorer 6) is nolonger supported. Please update to a later version of Internet Explorer or use a different browser.\n\nDetails:\nThe current version of OHP Web (the Orion Health common web library) no longer supports Internet Explorer 6.\nIf you were not expecting this page, it is possible that anewly installed component has upgraded OHP Web.";alert(e)},n=e();if(n){window.onbeforeunload=null,setTimeout(t,2e3);try{window.location.replace(n+"unsupported-browser.jsp?url="+encodeURIComponent(window.location.href))}catch(r){}}else t()}()),ORCHESTRAL.lang={contains:function(e,t){var n;for(n=0;n<t.length;n+=1)if(t[n]===e)return!0;return!1},escapeHtml:function(e){return e.replace(/[&<>"'\/`]/g,function(e){return n[e]})},escapeRegex:function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")},filter:function(e,t){var n=[],r;for(r=0;r<e.length;r+=1)t(e[r])&&n.push(e[r]);return n}},ORCHESTRAL.util.Locale=function(){var e={};return{put:function(t,n){e[t]=n},putAll:function(t){e=YAHOO.lang.merge(e,t)},get:function(t){var n=e[t],r=window.ORCHESTRAL_LOCALISATIONS;return YAHOO.lang.isUndefined(n)&&!YAHOO.lang.isUndefined(r)&&(n=r[t]),YAHOO.lang.isUndefined(n)?"???"+t+"???":arguments.length===1?n:YAHOO.lang.substitute(n,Array.prototype.slice.call(arguments).slice(1))}}}(),ORCHESTRAL.util.Registry=window.ORCHESTRAL_REGISTRY||function(){var t={};return{putEvent:new YAHOO.util.CustomEvent("putEvent",this),put:function(n,r,i){r&&r.tagName&&(r=r.id?r.id:e.generateId(r)),t[n]===undefined&&(t[n]={}),t[n][r]=i,this.putEvent.fire({type:n,key:r,value:i})},get:function(e,n){return n&&n.tagName&&n.id&&(n=n.id),t[e]===undefined?null:n===undefined?t[e]:t[e][n]===undefined?null:t[e][n]},clear:function(e,n){var r;if(e===undefined)t={};else if(n===undefined)delete t[e];else{delete t[e][n];for(r in t[e])if(t[e].hasOwnProperty(r))return;delete t[e]}},batch:function(e,t){var n=this.get(e),r=0,i;for(i in n)n.hasOwnProperty(i)&&(r+=1,t(n[i],r));return n}}}(),window.ORCHESTRAL_REGISTRY=ORCHESTRAL.util.Registry,t.on(window,"unload",ORCHESTRAL.util.Registry.clear),ORCHESTRAL.util.Event={debounce:function(e,n){var r;return function(i){var s;n?s=n:s=i&&i.type==="submit"?3e3:1e3,r?(i&&t.stopEvent(i),clearTimeout(r)):e&&e.apply(this,arguments),r=setTimeout(function(){r=null},s)}},debounceEvent:function(e,n,r){t.on(e,n,ORCHESTRAL.util.Event.debounce(null,r))}}})(),YAHOO.register("orchestral",ORCHESTRAL,{version:"7.9",build:"0"});
