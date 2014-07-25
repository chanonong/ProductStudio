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
YUI.add("yui2-orchestral-base",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;(function(){"use strict";(function(){var e=3,t=document.createElement("div"),n=t.getElementsByTagName("i");do t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->";while(n[0]);e>=6&&(document.documentMode&&(e=document.documentMode),e<=8&&(document.documentElement.className+=" oldie ie"+e)),e>4&&e<=6&&function(){var e,t,n;e=function(){var e="orchestral-base/orchestral-base.js",t=new RegExp("(^.*/common-web/)"+e+"$"),n=document.getElementsByTagName("script"),r,i,s;for(r=n.length-1;r>=0;r-=1){i=n.item(r).src;if(i){s=t.exec(i);if(s)return s[1]}}},t=function(){var e="This content is not displayed because the browser you are using (Internet Explorer 6) is nolonger supported. Please update to a later version of Internet Explorer or use a different browser.\n\nDetails:\nThe current version of OHP Web (the Orion Health common web library) no longer supports Internet Explorer 6.\nIf you were not expecting this page, it is possible that anewly installed component has upgraded OHP Web.";alert(e)},n=e();if(n){window.onbeforeunload=null,setTimeout(t,2e3);try{window.location.replace(n+"unsupported-browser.jsp?url="+encodeURIComponent(window.location.href))}catch(r){}}else t()}()})()})()},"7.9.0");
