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
YUI.add("yui2-legacy-window",function(e,t){
/*!(C) ORCHESTRAL*/
function s(e,t,n,r,i,s){this.resultHandler=t,this.cancelHandler,this.name=typeof i!="undefined"?i:"Window",this.features="height="+r+",width="+n+",resizable=yes,scrollbars=yes",this.position=s,s&&(this.features+=",top="+s.top+",left="+s.left),this.open=function(){this.handle=window.open(e,this.name,this.features),this.handle.focus(),s&&this.handle.moveTo(s.left,s.top),Windows.registerWindow(this.name,this)},this.getWindow=function(){return this.handle},this.setCancelHandler=function(e){this.cancelHandler=e},this.close=function(){this.handle!=null&&!this.handle.closed&&this.handle.close()},this.processResults=function(){if(this.handle.closed){this.cancelHandler!=null&&this.cancelHandler();return}var t=this.handle.getResults();window.focus();if(t!=null)try{this.resultHandler(t)}catch(n){alert("An error was thrown from the result handler of the window opened at "+e)}else if(this.cancelHandler!=null)try{this.cancelHandler()}catch(n){alert("An error was thrown from the cancel handler of the window opened at "+e)}this.handle.close()}}var n=e.YUI2,r=n.ORCHESTRAL;window.Windows={list:new Object,polling:!1,registerWindow:function(e,t){Windows.list[e]=t,Windows.polling||(setInterval(Windows.poll,250),Windows.polling=!0)},poll:function(){for(key in Windows.list)try{Windows.list[key].processResults(),delete Windows.list[key]}catch(e){}}},window.Window=s},"7.9.0");
