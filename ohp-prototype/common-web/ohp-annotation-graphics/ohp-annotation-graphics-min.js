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
YUI.add("ohp-annotation-graphics",function(e,t){"use strict";var n=e.config.doc,r,i,s;e.Graphic===e.SVGGraphic?r={_type:"text",_draw:function(){i.superclass._draw.apply(this,arguments),e.one(this.node).set("text",this.get("text"))}}:e.Graphic===e.VMLGraphic?r={_type:"shape",_draw:function(){var e=this.node,t=this.get("text"),r=this.get("stroke").color,i,s;this.clear(),this.moveTo(-3,-4),this.lineTo(8*t.length,-4),this.end(),this.textpathNode||(i=n.createElement('<path textpathok="true" style="behavior:url(#default#VML);" xmlns="urn:schemas-microsft.com:vml" />'),s=n.createElement('<fill color="'+r+'" style="behavior:url(#default#VML);" on="true" xmlns="urn:schemas-microsft.com:vml" />'),this.textpathNode=n.createElement('<textpath string="'+t+'" style="font-size:14px;behavior:url(#default#VML);" on="true" xmlns="urn:schemas-microsft.com:vml" />'),e.appendChild(i),e.appendChild(s),e.appendChild(this.textpathNode))}}:e.Graphic===e.CanvasGraphic&&(r={}),i=e.Base.create("ohp-annotation-graphics-text",e.Shape,[],r,{ATTRS:e.mix({text:{value:""}},e.Shape.ATTRS)}),e.namespace("OHP.Annotation").TextShape=i,s=e.Base.create("ohp-annotation-graphics-rounded-rect",e.Shape,[],{_draw:function(){var e=.552228474,t=this.get("width"),n=this.get("height"),r=n/2,i=e*r;this.clear(),this.moveTo(0,r),this.lineTo(0,n-r),this.curveTo(0,n-r+i,r-i,n,r,n),this.lineTo(t-r,n),this.curveTo(t-r+i,n,t,n-r+i,t,n-r),this.lineTo(t,r),this.curveTo(t,r-i,t-r+i,0,t-r,0),this.lineTo(r,0),this.curveTo(r-i,0,0,r-i,0,r),this.end()}},{ATTRS:e.Shape.ATTRS}),e.namespace("OHP.Annotation").RoundedRect=s},"7.9.0",{requires:["node","base","graphics"]});
