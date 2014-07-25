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
YUI.add("yui2-legacy-mod11",function(e,t){
/*!(C) ORCHESTRAL*/
function o(){this.createCheckDigit=function(e){var t=new Array(e.length),n=0;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(i>="0"&&i<="9")var s=i-"0";else var s=this.getInt(e.charAt(r));s!=-1&&(t[n++]=s)}var o=this.calculateCheckDigit(t,0,n);return o!=-1?this.getCheckChar(o):null}}function u(){this.calculateCheckDigit=function(e,t,n){var r=this.calculateCheckSum(e,t,n);return r%=11,r==0&&(r=1),(11-r)%10},this.calculateCheckSum=function(e,t,n){var r=0;for(var i=0;i<n;i++){var s=n-i-1+t,o=e[s],u=i%6+2;r+=o*u}return r},this.getInt=function(e){var t=s.indexOf(e);return t==-1?-1:t+1},this.getCheckChar=function(e){return"0123456789".charAt(e)}}function f(){}function l(){this.mod11=new u,this.calculateCheckDigit=function(e,t,n){var r=this.mod11.calculateCheckSum(e,t,n);return r%=11,r==0?-1:(11-r)%10},this.getInt=function(e){return this.mod11.getInt(e)},this.getCheckChar=function(e){return this.mod11.getCheckChar(e)}}function h(){}function p(){this.mod11=new u,this.calculateCheckDigit=function(e,t,n){var r=this.mod11.calculateCheckSum(e,t,n);return r%=11,r==0?-1:r},this.getInt=function(e){var t=s.indexOf(e);return t==-1?-1:t+1},this.getCheckChar=function(e){return s.charAt(e-1)}}function v(){}var n=e.YUI2,r=n.ORCHESTRAL,s="ABCDEFGHJKLMNPQRSTUVWXYZ";window.AbstractCheckDigitAlgorithm=o,window.Mod11CheckDigitAlgorithm=u,u.prototype=new o,u.prototype.constructor=u,u.superclass=o.prototype;var a=new u;window.Mod11=f,f.calculateCheckDigit=function(e){return a.createCheckDigit(e)},window.RestrictedMod11CheckDigitAlgorithm=l,l.prototype=new o,l.prototype.constructor=l,l.superclass=o.prototype;var c=new l;window.RestrictedMod11=h,h.calculateCheckDigit=function(e){return c.createCheckDigit(e)},window.Mod11AlphaCheckDigitAlgorithm=p,p.prototype=new o,p.prototype.constructor=l,p.superclass=o.prototype;var d=new p;window.Mod11Alpha=v,v.calculateCheckDigit=function(e){return d.createCheckDigit(e)}},"7.9.0");
