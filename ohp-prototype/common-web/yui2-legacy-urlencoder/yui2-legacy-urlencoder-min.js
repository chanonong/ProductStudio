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
YUI.add("yui2-legacy-urlencoder",function(e,t){
/*!(C) ORCHESTRAL*/
function s(){}var n=e.YUI2,r=n.ORCHESTRAL;window.UrlEncoder=s,s.hex="0123456789ABCDEF",s.escapeChars=new Array(256);for(var o=0;o<16;o++)for(var u=0;u<16;u++)s.escapeChars[o*16+u]="%"+s.hex.charAt(o)+s.hex.charAt(u);s.encode=function(e){if(e==null)return e;e=""+e;var t=new StringBuffer,n=e.length;for(var r=0;r<n;r++){var i=e.charCodeAt(r);i>=97&&i<=122||i>=65&&i<=90||i>=48&&i<=57||i==95||i==46?t.append(e.charAt(r)):i==32?t.append("+"):i<=127?t.append(s.escapeChars[i]):i<=2047?t.append(s.escapeChars[192|i>>6],s.escapeChars[128|i&63]):t.append(s.escapeChars[224|i>>12],s.escapeChars[128|i>>6&63],s.escapeChars[128|i&63])}return t.toString()},s.decode=function(e){if(e==null)return e;var t=0,n=0,r=new StringBuffer,i=e.length;for(var o=0;o<i;o++){switch(e.charAt(o)){case"%":c=e.charCodeAt(++o);var u=(s.isDigit(c)?c-48:10+s.toLowerCase(c)-97)&15;c=e.charCodeAt(++o);var a=(s.isDigit(c)?c-48:10+s.toLowerCase(c)-97)&15;t=u<<4|a;break;case"+":t=32;break;default:t=e.charCodeAt(o)}(t&192)==128?n=n<<6|t&63:(n!=0&&(r.append(String.fromCharCode(n)),n=0),n=(t&128)==0?t:t&31)}return n!=0&&r.append(String.fromCharCode(n)),r.toString()},s.isDigit=function(e){return!isNaN(String.fromCharCode(e))},s.toLowerCase=function(e){return String.fromCharCode(e).toLowerCase().charCodeAt(0)}},"7.9.0",{requires:["yui2-legacy-stringbuffer"]});
