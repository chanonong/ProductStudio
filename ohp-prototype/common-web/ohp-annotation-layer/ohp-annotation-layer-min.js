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
YUI.add("ohp-annotation-layer",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-layer",e.Base,[],{initializer:function(){this._graphic=new e.Graphic({render:!1})},render:function(){this._graphic.render(this.get("container"))},clear:function(){this._graphic.clear()},addPath:function(){return this.addShape({type:"path"})},addRect:function(e,t,n,r){var i=this.addShape({type:"path"});return i.moveTo(e,t),i.lineTo(e+n,t),i.lineTo(e+n,t+r),i.lineTo(e,t+r),i.lineTo(e,t),i.end(),i},addShape:function(t){return this._graphic.addShape(e.merge(t,{stroke:this.get("stroke")}))},removeShape:function(e){this._graphic.removeShape(e)},getXY:function(){var e=this._graphic.getXY();return{x:e[0],y:e[1]}}},{ATTRS:{container:{},width:{},height:{},stroke:{value:{linecap:"round",linejoin:"round"},setter:function(t){var n=this.get("stroke");return e.merge(n,t)}}}});e.namespace("OHP.Annotation").Layer=n},"7.9.0",{requires:["yui-base","base","graphics"]});
