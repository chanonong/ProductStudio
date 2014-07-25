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
YUI.add("ohp-widget-resize-ie",function(e,t){var n="fillHeight",r="heightChange",i="host",s=e.ClassNameManager.getClassName("tmp","fixvisibility"),o;o=e.Base.create("ohp-widget-resize-ie",e.Plugin.Base,[],{_usingStdMod:!1,initializer:function(){e.Lang.isUndefined(this.get(i).getStdModNode)||(this._usingStdMod=!0),this.afterHostMethod("bindUI",this._afterHostBindUI,this)},_afterHostBindUI:function(){this._usingStdMod&&(this.doBefore(r,this._onHeightChangeFixFillHeight,this),this.doAfter(r,this._afterHeightChangeFixFillHeight,this)),this.doAfter(r,this._fixIframeVisibility,this),this.afterHostMethod(n,this._fixIframeVisibility,this),e.on("windowresize",this._fixIframeVisibility,this)},_onHeightChangeFixFillHeight:function(e){if(e.newVal!==e.prevVal){var t=this.get(i),r;r=t.getStdModNode(t.get(n)),r&&r.set("offsetHeight",0)}},_afterHeightChangeFixFillHeight:function(){var e=this.get(i),t;t=e.getStdModNode(e.get(n)),t&&e.fillHeight(t)},_fixIframeVisibility:function(){var e=this.get(i).get("contentBox").all("iframe");e&&(e.addClass(s),e.removeClass(s))}},{NS:"ohp-widget-resize-ie"}),e.namespace("OHP").WidgetResizeIE=o},"7.9.0",{requires:["widget-stdmod","widget","plugin"]});
