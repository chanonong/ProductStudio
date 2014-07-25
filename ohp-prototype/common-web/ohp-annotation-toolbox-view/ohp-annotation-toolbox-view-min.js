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
YUI.add("ohp-annotation-toolbox-view",function(e,t){"use strict";var n=e.Handlebars,r=e.OHP.AnnotationClassNameManager.getClassName,i;i=e.Base.create("ohp-annotation-toolbox-view",e.View,[],{events:{".ohp-annotation-tool-button":{click:"_handleClickToSelectTool"}},_buttonTemplate:n.compile('&nbsp;<label><input type="radio" name="ohp-annotation-tool-buttons" class="{{className}}" value={{value}} {{active}} />&nbsp;{{label}}</label>'),_renderTool:function(e){var t=e.get("tool").get("name"),n=this._buttonTemplate({label:t,value:t,active:e.get("active")?"checked":"",className:r("tool","button")});this.get("container").appendChild(n)},render:function(){var e=this.get("annotationModel"),t=e.get("toolModelList"),n=this.get("container");return n.addClass("ohp-annotation-toolbox"),n.setStyle("width",this.get("width")),n.setStyle("height",i.HEIGHT),t.each(this._renderTool,this),this},_handleClickToSelectTool:function(e){var t=this.get("annotationModel"),n=t.get("toolModelList"),r=e.currentTarget.get("value");r!==n.getActiveToolName()&&(n.setActiveToolName(r),t.get("drawingModelList").clearSelection())}},{ATTRS:{width:{writeOnce:"initOnly"}},HEIGHT:30}),e.namespace("OHP.Annotation").ToolboxView=i},"7.9.0",{requires:["ohp-annotation-tool","ohp-annotation-class-name-manager","node-style","handlebars","yui-base","base","view","event-base","node-base"]});
