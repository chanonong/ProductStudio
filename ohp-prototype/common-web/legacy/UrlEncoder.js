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
function UrlEncoder(){}window.UrlEncoder=UrlEncoder,UrlEncoder.hex="0123456789ABCDEF",UrlEncoder.escapeChars=new Array(256);for(var i=0;i<16;i++)for(var j=0;j<16;j++)UrlEncoder.escapeChars[i*16+j]="%"+UrlEncoder.hex.charAt(i)+UrlEncoder.hex.charAt(j);UrlEncoder.encode=function(e){if(e==null)return e;e=""+e;var t=new StringBuffer,n=e.length;for(var r=0;r<n;r++){var i=e.charCodeAt(r);i>=97&&i<=122||i>=65&&i<=90||i>=48&&i<=57||i==95||i==46?t.append(e.charAt(r)):i==32?t.append("+"):i<=127?t.append(UrlEncoder.escapeChars[i]):i<=2047?t.append(UrlEncoder.escapeChars[192|i>>6],UrlEncoder.escapeChars[128|i&63]):t.append(UrlEncoder.escapeChars[224|i>>12],UrlEncoder.escapeChars[128|i>>6&63],UrlEncoder.escapeChars[128|i&63])}return t.toString()},UrlEncoder.decode=function(e){if(e==null)return e;var t=0,n=0,r=new StringBuffer,i=e.length;for(var s=0;s<i;s++){switch(e.charAt(s)){case"%":c=e.charCodeAt(++s);var o=(UrlEncoder.isDigit(c)?c-48:10+UrlEncoder.toLowerCase(c)-97)&15;c=e.charCodeAt(++s);var u=(UrlEncoder.isDigit(c)?c-48:10+UrlEncoder.toLowerCase(c)-97)&15;t=o<<4|u;break;case"+":t=32;break;default:t=e.charCodeAt(s)}(t&192)==128?n=n<<6|t&63:(n!=0&&(r.append(String.fromCharCode(n)),n=0),n=(t&128)==0?t:t&31)}return n!=0&&r.append(String.fromCharCode(n)),r.toString()},UrlEncoder.isDigit=function(e){return!isNaN(String.fromCharCode(e))},UrlEncoder.toLowerCase=function(e){return String.fromCharCode(e).toLowerCase().charCodeAt(0)};
