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
YUI.add("ohp-annotation-view",function(e,t){"use strict";var n=e.OHP.Annotation.DrawingAreaView,r=e.OHP.Annotation.ToolboxView,i;i=e.Base.create("ohp-annotation-view",e.View,[],{_drawingAreaView:null,_toolboxView:null,initializer:function(){var t=this.get("annotationModel"),i=this.get("width"),s=this.get("height");this._drawingAreaView=new n({annotationModel:t,container:e.Node.create("<div/>"),width:i,height:s-r.HEIGHT}),this._toolboxView=new r({annotationModel:t,container:e.Node.create("<div/>"),width:i})},render:function(){var e=this.get("container");return this._drawingAreaView.render(),this._toolboxView.render(),e.appendChild(this._drawingAreaView.get("container")),e.appendChild(this._toolboxView.get("container")),this}},{ATTRS:{annotationModel:{readOnly:!0,value:new e.OHP.Annotation.AnnotationModel},width:{writeOnce:"initOnly"},height:{writeOnce:"initOnly"}}}),e.namespace("OHP.Annotation").AnnotationView=i},"7.9.0",{requires:["base","ohp-annotation-model","view","ohp-annotation-toolbox-view","ohp-annotation-drawing-area-view","node-base"]});
