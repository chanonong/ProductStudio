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
(function(){var e;YUI.add("ohp-commentindicator",function(t,n){function s(){if(ORCHESTRAL&&ORCHESTRAL.widget&&ORCHESTRAL.widget.DataTable&&arguments.length>0&&t.instanceOf(arguments[0],ORCHESTRAL.widget.DataTable))return;s.superclass.constructor.apply(this,arguments)}var r=t.Lang,i=t.Widget;s.NAME="commentIndicator",s.VALUE_CLASS="value",s.EMPTY_CLASS="empty",s.ATTRS={value:{value:""}},s.CSS_PREFIX="ohp-comment",s.HTML_PARSER={value:function(e){return e?e.getContent():""}},t.extend(s,i,{BOUNDING_TEMPLATE:"<span/>",CONTENT_TEMPLATE:"<span/>",initializer:function(){e||(e=new t.OHP.Popover({visible:!1,zIndex:2}),e.plug(t.OHP.Constraint,{maxWidth:"300px",maxHeight:"200px"}),e.render())},destructor:function(){},renderUI:function(){this.get("contentBox").addClass(this.getClassName(s.VALUE_CLASS)),this.get("contentBox").addClass(s.VALUE_CLASS)},bindUI:function(){this.get("boundingBox").on({mouseenter:t.bind(this._onMouseEnter,this),mouseleave:t.bind(this._onMouseLeave,this)}),this.after("valueChange",this.syncUI)},syncUI:function(){this.get("boundingBox")[this.isEmpty()?"addClass":"removeClass"](this.getClassName(s.EMPTY_CLASS))},isEmpty:function(){var e=this.get("value");return e?!r.trim(e):!0},_onMouseEnter:function(){var t=this.get("value"),n="#"+this.get("boundingBox").get("id");t&&e.show({content:t,triggerNode:n})},_onMouseLeave:function(){e.delayedHide()}}),t.namespace("OHP").CommentIndicator=s},"7.9.0",{requires:["event","ohp-popover","widget","ohp-constraint"]})})();
