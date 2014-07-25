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
YUI.add("ohp-annotation-freehand-model",function(e,t){"use strict";function i(e,t,r){var i=n.distanceFromLine(e,t,r);return i<10}var n=e.OHP.Annotation.Geometry,r;r=e.Base.create("ohp-annotation-freehand-model",e.OHP.Annotation.DrawingModel,[],{addPoint:function(e){var t=this.get("points"),r=t.length-1;return r<0?(t.push(e),this.set("bounds",{left:e.x,top:e.y,right:e.x,bottom:e.y}),!0):n.getDistanceBetweenPoints(e,t[r])>3?(t.push(e),this._updateBounds(e),!0):!1},end:function(e){var t=this.get("points"),n;e?(t.push(e),n=e):n=t[t.length-1],this._updateBounds(n),this._calculateHitSamplePoints()},_updateBounds:function(e){var t=this.get("bounds");t.left>e.x?t.left=e.x:t.right<e.x&&(t.right=e.x),t.top>e.y?t.top=e.y:t.bottom<e.y&&(t.bottom=e.y)},_calculateHitSamplePoints:function(){var e=this.get("points"),t=e[0],r=[t],i=e.length,s,o;for(s=1;s<i;s+=1)o=e[s],n.getDistanceBetweenPoints(o,t)>7&&(r.push(o),t=o);r.push(e[e.length-1]),this.set("hitSamplePoints",r)},addShapes:function(e){var t=this.get("points"),n=t[0],r=t.length-1,i=t[r],s,o,u;e.set("stroke",{weight:3}),o=e.addPath(),o.moveTo(n.x,n.y),r===1&&n.x===i.x&&n.y===i.y&&(s=i.x>=e.get("width")-2,i={x:s?i.x-1:i.x+1,y:i.y});for(u=1;u<r;u+=1)n=t[u],o.lineTo(n.x,n.y);return o.lineTo(i.x,i.y),o.end(),[o]},hit:function(t){var n,r;return n=e.Array.some(this.get("hitSamplePoints"),function(e){if(r&&i(r,e,t))return!0;r=e}),n}},{ATTRS:{points:{value:[]},hitSamplePoints:{}}}),e.namespace("OHP.Annotation").FreehandModel=r},"7.9.0",{requires:["ohp-annotation-geometry","model","ohp-annotation-drawing-model","base","ohp-annotation-layer"]});
