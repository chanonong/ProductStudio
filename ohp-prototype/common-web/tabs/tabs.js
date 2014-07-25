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
YAHOO.namespace("ORCHESTRAL.widget"),function(){ORCHESTRAL.widget.TabView=function(e,t){t=t||{},arguments.length==1&&!YAHOO.lang.isString(e)&&!e.nodeName&&(t=e,e=t.element||null);var n=YAHOO.util.Dom.getElementsByClassName("yui-nav","ul",e)[0];n&&document.documentMode==8&&(n.innerHTML=n.innerHTML.replace(/<\/li>\s+</gi,"</li><")),ORCHESTRAL.widget.TabView.superclass.constructor.call(this,e,t);var r=this.get("tabs");for(var i=0;i<r.length;i++){var s=this.getTab(i),o=s.get("href");o.substring(0,1)!="#"&&(s.set("dataSrc",o),s.set("cacheData",!0),t.onContentChange&&s.addListener("contentChange",t.onContentChange))}},YAHOO.extend(ORCHESTRAL.widget.TabView,YAHOO.widget.TabView),YAHOO.widget.Tab.prototype.LOADING_CLASSNAME="Throbber",YAHOO.widget.Tab.prototype.ACTIVE_TITLE="",YAHOO.util.Event.onDOMReady(function(){YAHOO.util.Dom.getElementsByClassName("OrchestralTabs","div",null,function(e){new ORCHESTRAL.widget.TabView(e)})})}(),YAHOO.register("orchestral-tabs",ORCHESTRAL.widget.TabView,{version:"7.9",build:"0"});
