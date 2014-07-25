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
YUI.add("yui2-orchestral-autorefresh",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.widget"),function(){var e=n.lang,t=n.util.Dom,i=n.util.Event,s=function(t,n,r,o,u){this._refreshInterval=r,this._updateHandler=o,this._scope=u,s.superclass.constructor.call(this,t),i.on(n,"click",this._registerActivity,null,this),i.on(n,"mousemove",this._registerActivity,null,this),this._refreshTimer=e.later(this._refreshInterval*1e3,this,this._triggerRefresh)};e.extend(s,n.util.Element,{_paused:!1,_recentActivityTimer:null,_refreshInterval:null,_refreshTimer:null,_scope:null,_updateHandler:null,_registerActivity:function(){this._recentActivityTimer&&this._recentActivityTimer.cancel(),this._recentActivityTimer=e.later(5e3,this,function(){this._recentActivityTimer=null})},_triggerRefresh:function(){this._paused||this._recentActivityTimer?this._refreshTimer=e.later(1e3,this,this._triggerRefresh):this._updateHandler.call(this._scope)},pause:function(){this._paused=!0},unpause:function(){this._paused=!1},updateMessage:function(){if(this.hasChildNodes())this._refreshTimer.cancel();else{this.addClass("label"),this.addClass("last-refreshed");var n=document.createElement("a");n.href="#",t.addClass(n,"refresh-link"),this.appendChild(document.createTextNode("")),this.appendChild(n),i.on(n,"click",function(e){this._updateHandler.call(this._scope),i.preventDefault(e)},null,this)}this.get("element").firstChild.nodeValue=e.substitute(r.util.Locale.get("widget.autorefresh.lastRefreshed"),[r.util.DateFormat.SHORT_TIME.format(new Date)])+" ",this._refreshTimer=e.later(this._refreshInterval*1e3,this,this._triggerRefresh)}}),r.widget.AutoRefresh=s}(),n.register("orchestral-autorefresh",r.widget.AutoRefresh,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui2-element","yui2-orchestral","ohp-locale-translations","yui2-orchestral-datetime"]});
