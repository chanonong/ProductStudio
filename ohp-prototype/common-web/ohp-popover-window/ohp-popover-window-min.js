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
YUI.add("ohp-popover-window",function(e,t){function n(e){n.superclass.constructor.apply(this,arguments)}n.NAME="ohp-popover-window",n.NS="popwindow",n.ATTRS={maxHeight:{value:null},maxWidth:{value:null}},e.extend(n,e.Plugin.Base,{initializer:function(){this.afterHostMethod("show",this._afterHostShowMethod),this.beforeHostMethod("init",this._beforeHostInit),this.onHostEvent("render",this._onHostRenderEvent),this.afterHostEvent("render",this._afterHostRenderEvent),this.beforeHostMethod("_afterShow",this._prevent),this.get("host").set("hasBeak",!1),this.get("host").BOUNDING_TEMPLATE='<div class="yui3-popover yui-popover yui3-ohp-popover-window"></div>'},destructor:function(){},_beforeHostInit:function(){this.get("host").setAttrs({showBeak:!1})},_applyCloseButton:function(){var t=this.get("host");if(this.get("host").get("contentBox").one(".icon-close"))return;var n=e.Node.create('<span class="icon-close"> </span>');n.on("click",function(t){e.OHP.Popover.resume(),this.get("host").hide()},this),t.setStdModContent(e.WidgetStdMod.HEADER,n,e.WidgetStdMod.AFTER)},_afterHostShowMethod:function(){this.get("host").set("centered",!0),this._applyCloseButton(),e.OHP.Popover.isSuspended()||e.OHP.Popover.suspend()},_onHostRenderEvent:function(e){},_afterHostRenderEvent:function(e){},_prevent:function(){return new e.Do.Prevent}}),e.namespace("Plugin.OHP").PopoverWindow=n},"7.9.0",{requires:["node","widget-stdmod","widget","plugin"]});
