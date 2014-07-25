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
YUI.add("ohp-annotation-footnote-model",function(e,t){"use strict";var n=e.OHP.Annotation.TextShape,r=e.OHP.Annotation.RoundedRect,i,s=1;i=e.Base.create("ohp-annotation-footnote-model",e.OHP.Annotation.DrawingModel,[],{addShapes:function(e){var t=8,i=10,s=3,o=this.get("point"),u=String(this.get("number")),a=t*u.length,f=i,l=f+s*2,c=a+(l-t),h=o.x-c/2,p=o.y-l/2,d=e.get("width"),v=e.get("height"),m=0,g=0,y,b;return h<0?m=-h:h+c>d&&(m=d-h-c),p<0?g=-p:p+l>v&&(g=v-p-l),e.set("stroke",{weight:1}),y=e.addShape({type:n,x:o.x+m-a/2+1,y:o.y+g+f/2,width:a,height:f,text:u}),e.set("stroke",{weight:2}),b=e.addShape({type:r,x:h+m,y:p+g,width:c,height:l}),this.set("bounds",{left:h+m,top:p+g,right:h+m+c,bottom:p+g+l}),[y,b]},hit:function(e){var t=this.get("bounds");return e.x>t.left-10&&e.x<t.right+10&&e.y>t.top-10&&e.y<t.bottom+10}},{ATTRS:{point:{},number:{getter:function(){return s+=1}},text:{}}}),e.namespace("OHP.Annotation").FootnoteModel=i},"7.9.0",{requires:["model","ohp-annotation-drawing-model","base","ohp-annotation-layer","ohp-annotation-graphics"]});
