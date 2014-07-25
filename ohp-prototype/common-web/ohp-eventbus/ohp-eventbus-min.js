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
YUI.add("ohp-eventbus",function(e,t){function a(e){}function f(e){return e.master==1?e:e===n.top?(a("could not find an existing master event bus, I am in "+n.location),null):f(e.parent)}function l(){function t(){var t=[],n,r;for(r=e.length-1;r>=0;r-=1)try{n=e[r],n&&n.location&&t.push(n)}catch(i){}return e=t,t}var e=[];return{add:function(t){a("add "+t.location+" to stack"),a(t),a(n.master),e.push(t)},remove:function(n){var r=[],i=t(),s;for(s=0;s<i.length;s+=1)i[s].location.href!==n.location.href&&r.push(i[s]);e=r},send:function(n,r,i){a("sending "+n+" : "+r),a(e.length),a(i);var s=t(),o;for(o=s.length-1;o>=0;o-=1)a("pushing to frame "+s[o].location),s[o].receive(n,r,i)},query:function(){return t().length}}}var n=e.config.win,r,i,s,o,u;s=f(n.parent),r=e.Base.create("ohp-eventbus",e.EventTarget,[],{initializer:function(){a("Host constructor executed.")},send:function(e,t,n){a("The FrameTaget(also known as the Public EventBus) send method"),s.eventBus.send(e,t,n)}}),i=e.Base.create("ohp-eventbus-publisher",e.EventTarget,[],{addEvent:function(e,t){t===null&&(t="master"),this.publish(t+":"+e,{emitFacade:!0})}}),o=new r,u=new i,u.addTarget(o),n.receive=function(e,t,n){a("receive "+e+" : "+t),u.addEvent(t,e),u.fire(e+":"+t,{payload:n})},s===null?(n.eventBus=new l,n.eventBus.add(n),n.master=!0,n.master.eventBus=n.eventBus,s=n):(n.master=s,n.master.eventBus.add(n)),e.on("unload",function(){s.eventBus.remove(n)},e.config.win),e.namespace("OHP").EventBus=o},"7.9.0",{requires:["base","event-custom"]});
