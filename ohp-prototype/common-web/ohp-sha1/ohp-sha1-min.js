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
YUI.add("ohp-sha1",function(e,t){var n=e.OHP.Utf8,r={hash:function(e,t){var r=[1518500249,1859775393,2400959708,3395469782],i=1732584193,s=4023233417,o=2562383102,u=271733878,a=3285377520,f,l,c,h,p,d,v,m,g,y,b,w,E,S;t=t||!0,t&&(e=n.encode(e)),e+=String.fromCharCode(128),f=e.length/4+2,l=Math.ceil(f/16),c=new Array(l);for(w=0;w<l;w++){c[w]=new Array(16);for(E=0;E<16;E++)c[w][E]=e.charCodeAt(w*64+E*4)<<24|e.charCodeAt(w*64+E*4+1)<<16|e.charCodeAt(w*64+E*4+2)<<8|e.charCodeAt(w*64+E*4+3)}c[l-1][14]=(e.length-1)*8/Math.pow(2,32),c[l-1][14]=Math.floor(c[l-1][14]),c[l-1][15]=(e.length-1)*8&4294967295,h=new Array(80);for(w=0;w<l;w++){for(S=0;S<16;S++)h[S]=c[w][S];for(S=16;S<80;S++)h[S]=this.ROTL(h[S-3]^h[S-8]^h[S-14]^h[S-16],1);p=i,d=s,v=o,m=u,g=a;for(S=0;S<80;S++)y=Math.floor(S/20),b=this.ROTL(p,5)+this.f(y,d,v,m)+g+r[y]+h[S]&4294967295,g=m,m=v,v=this.ROTL(d,30),d=p,p=b;i=i+p&4294967295,s=s+d&4294967295,o=o+v&4294967295,u=u+m&4294967295,a=a+g&4294967295}return this.toHexStr(i)+this.toHexStr(s)+this.toHexStr(o)+this.toHexStr(u)+this.toHexStr(a)},f:function(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:return t^n^r;case 2:return t&n^t&r^n&r;case 3:return t^n^r}},ROTL:function(e,t){return e<<t|e>>>32-t},toHexStr:function(e){var t="",n,r;for(r=7;r>=0;r--)n=e>>>r*4&15,t+=n.toString(16);return t}};e.namespace("OHP").Sha1=r},"7.9.0",{requires:["ohp-utf8"]});
