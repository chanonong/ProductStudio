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
YUI.add("ohp-constraint",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="ohp-constraint",n.NS="constraint",n.ATTRS={maxHeight:{value:null},maxWidth:{value:null}},e.extend(n,e.Plugin.Base,{initializer:function(){this.beforeHostMethod("show",this._beforeHostShowMethod),this.afterHostMethod("show",this._afterHostShowMethod),this.onHostEvent("render",this._onHostRenderEvent),this.afterHostEvent("render",this._afterHostRenderEvent)},destructor:function(){},_onHostRenderEvent:function(){},_afterHostRenderEvent:function(){},_beforeHostShowMethod:function(){var t=this.get("host"),n=t.get("contentBox"),r;n.setStyle("maxWidth",""),n.setStyle("maxHeight",""),n.setStyle("overflow","auto"),r=t.getStdModNode(e.WidgetStdMod.BODY),r?(r.setStyle("maxWidth",""),r.setStyle("maxHeight",""),r.setStyle("overflow","auto")):(r=n,t.set("bodyContent",n.get("innerHTML")),r=t.getStdModNode(e.WidgetStdMod.BODY)),this.get("maxWidth")&&(r.setStyle("maxWidth",this.get("maxWidth")),(e.one("body.ie6")||e.one("body.ie7"))&&r.setStyle("width",this.get("maxWidth"))),this.get("maxHeight")&&(r.setStyle("maxHeight",this.get("maxHeight")),r.setStyle("overflow","scroll"),(e.one("body.ie6")||e.one("body.ie7"))&&r.setStyle("height",this.get("maxHeight")))},_afterHostShowMethod:function(){}}),e.namespace("OHP").Constraint=n},"7.9.0",{requires:["node","widget-stdmod","widget","plugin"]});
