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
YUI.add("yui2-orchestral-tabs",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.widget"),function(){r.widget.TabView=function(e,t){t=t||{},arguments.length==1&&!n.lang.isString(e)&&!e.nodeName&&(t=e,e=t.element||null);var i=n.util.Dom.getElementsByClassName("yui-nav","ul",e)[0];i&&document.documentMode==8&&(i.innerHTML=i.innerHTML.replace(/<\/li>\s+</gi,"</li><")),r.widget.TabView.superclass.constructor.call(this,e,t);var s=this.get("tabs");for(var o=0;o<s.length;o++){var u=this.getTab(o),a=u.get("href");a.substring(0,1)!="#"&&(u.set("dataSrc",a),u.set("cacheData",!0),t.onContentChange&&u.addListener("contentChange",t.onContentChange))}},n.extend(r.widget.TabView,n.widget.TabView),n.widget.Tab.prototype.LOADING_CLASSNAME="Throbber",n.widget.Tab.prototype.ACTIVE_TITLE="",n.util.Event.onDOMReady(function(){n.util.Dom.getElementsByClassName("OrchestralTabs","div",null,function(e){new r.widget.TabView(e)})})}(),n.register("orchestral-tabs",r.widget.TabView,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui2-dom","yui2-event","yui2-element","yui2-tabview","yui2-orchestral"]});
