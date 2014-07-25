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
YUI.add("ohp-annotation-freehand-tool",function(e,t){"use strict";var n=e.OHP.Annotation.FreehandModel,r;r=e.Base.create("ohp-annotation-freehand-tool",e.OHP.Annotation.Tool,[],{initializer:function(){this.set("name","freehand"),this.set("type","drawing")},start:function(e,t){e.clear(),e.set("stroke",{color:"#61C0FF",weight:3}),this._path=e.addPath(),this._path.moveTo(t.x,t.y),this._currentFreehandModel=new n,this._currentFreehandModel.addPoint(t),this._layer=e},drag:function(e){this._currentFreehandModel.addPoint(e)&&(this._path.lineTo(e.x,e.y),this._path.end())},end:function(e){this._currentFreehandModel.end(e),this.get("annotationModel").get("drawingModelList").add(this._currentFreehandModel),this._layer.clear(),this._currentFreehandModel=null}}),e.namespace("OHP.Annotation").FreehandTool=r},"7.9.0",{requires:["ohp-annotation-tool","base","ohp-annotation-freehand-model","ohp-annotation-layer"]});
