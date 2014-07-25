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
YUI.add("ohp-annotation-drawing-view",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-drawing-view",e.View,[],{initializer:function(){var t=this.get("drawingModel");t.after("selectedChange",function(r){var i=this.get("selectionLayer"),s=i.get("width"),o=i.get("height"),u=this._getStroke(),a=n.SELECTED_BOX_PADDING,f=n.SELECTED_BOX_MARGIN,l,c,h,p,d;e.Array.each(this._shapes,function(e){e.set("stroke",u)}),r.newVal?(l=t.get("bounds"),c=Math.max(f,l.left-a),h=Math.max(f,l.top-a),p=Math.min(s,l.right+a)-c-f,d=Math.min(o,l.bottom+a)-h-f,this._selectedBox=i.addRect(c,h,p,d)):i.removeShape(this._selectedBox)},this),t.after("highlightedChange",function(){var t=this._getStroke();e.Array.each(this._shapes,function(e){e.set("stroke",t)})},this)},_getStroke:function(){var e=this.get("drawingModel"),t={};return e.get("highlighted")?t.color="#63afe1":e.get("selected")?t.color="#aad3ef":t.color="#007bce",t},render:function(){var e=this.get("drawingLayer");return e.set("stroke",this._getStroke()),this._shapes=this.get("drawingModel").addShapes(e),this}},{ATTRS:{drawingModel:{writeOnce:"initOnly"},drawingLayer:{writeOnce:"initOnly"},selectionLayer:{writeOnce:"initOnly"}},SELECTED_BOX_PADDING:5,SELECTED_BOX_MARGIN:1});e.namespace("OHP.Annotation").DrawingView=n},"7.9.0",{requires:["ohp-annotation-drawing-model","yui-base","base","view","ohp-annotation-layer","event-base"]});
