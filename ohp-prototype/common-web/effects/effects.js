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

/*!
* Copyright (c) 2007, Dav Glass <dav.glass@yahoo.com>.
* Code licensed under the BSD License:
* http://blog.davglass.com/license.txt
* All rights reserved.
*/
YAHOO.namespace("ORCHESTRAL.util"),function(){var Registry=ORCHESTRAL.util.Registry;ORCHESTRAL.util.Effects=function(){return{version:"0.8"}}();var obtainLock=function(e){return Registry.get("ORCHESTRAL.util.Effects",e)?!1:(Registry.put("ORCHESTRAL.util.Effects",e,!0),!0)},clearLock=function(e){Registry.clear("ORCHESTRAL.util.Effects",e.id);return};ORCHESTRAL.util.Effects.Hide=function(e){this.element=YAHOO.util.Dom.get(e),YAHOO.util.Dom.setStyle(this.element,"display","none"),YAHOO.util.Dom.setStyle(this.element,"visibility","hidden")},ORCHESTRAL.util.Effects.Hide.prototype.toString=function(){return"Effect Hide ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Toggle=function(e){e=YAHOO.util.Dom.get(e);var t=YAHOO.util.Dom.getStyle(e,"display");YAHOO.util.Dom.setStyle(e,"display",t=="none"?"":"none")},ORCHESTRAL.util.Effects.Toggle.prototype.toString=function(){return"Effect Toggle ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Show=function(e){this.element=YAHOO.util.Dom.get(e),YAHOO.util.Dom.setStyle(this.element,"display",""),YAHOO.util.Dom.setStyle(this.element,"visibility","visible")},ORCHESTRAL.util.Effects.Show.prototype.toString=function(){return"Effect Show ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Fade=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;var n={opacity:{from:1,to:0}};this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,i=t&&t.seconds?t.seconds:1,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){ORCHESTRAL.util.Effects.Hide(this.element),clearLock(this.element),this.onEffectComplete.fire()},this,!0),s||this.effect.animate()},ORCHESTRAL.util.Effects.Fade.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Fade.prototype.toString=function(){return"Effect Fade ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Appear=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;YAHOO.util.Dom.setStyle(this.element,"opacity","0"),ORCHESTRAL.util.Effects.Show(this.element);var n={opacity:{from:0,to:1}};this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,i=t&&t.seconds?t.seconds:3,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){clearLock(this.element),this.onEffectComplete.fire()},this,!0),s||this.effect.animate()},ORCHESTRAL.util.Effects.Appear.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Appear.prototype.toString=function(){return"Effect Appear ["+this.element.id+"]"},ORCHESTRAL.util.Effects.BlindUp=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1,s=t&&t.ghost?t.ghost:!1,o=parseInt(YAHOO.util.Dom.getStyle(e,"height"));this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;isNaN(o)?this._height=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)):this._height=parseInt(o),this._top=parseInt(YAHOO.util.Dom.getStyle(this.element,"top")),isNaN(this._top)&&(this._top=0),this._opts=t,YAHOO.util.Dom.setStyle(this.element,"overflow","hidden");var u={height:{to:0}};s&&(u.opacity={to:0,from:1}),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);if(t&&t.bind&&t.bind=="bottom"){var u={height:{from:0,to:parseInt(this._height)},top:{from:this._top+parseInt(this._height),to:this._top}};s&&(u.opacity={to:1,from:0})}this.effect=new YAHOO.util.Anim(this.element,u,r,n),this.effect.onComplete.subscribe(function(){this._opts&&this._opts.bind&&this._opts.bind=="bottom"?YAHOO.util.Dom.setStyle(this.element,"top",this._top+"px"):(ORCHESTRAL.util.Effects.Hide(this.element),isNaN(o)?YAHOO.util.Dom.setStyle(this.element,"height","auto"):YAHOO.util.Dom.setStyle(this.element,"height",this._height+"px")),this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.BlindUp.prototype.prepStyle=function(){this._opts&&this._opts.bind&&this._opts.bind=="bottom"&&(YAHOO.util.Dom.setStyle(this.element,"height","0px"),YAHOO.util.Dom.setStyle(this.element,"top",this._height)),ORCHESTRAL.util.Effects.Show(this.element)},ORCHESTRAL.util.Effects.BlindUp.prototype.animate=function(){this.prepStyle(),this.effect.animate()},ORCHESTRAL.util.Effects.BlindUp.prototype.toString=function(){return"Effect BlindUp ["+this.element.id+"]"},ORCHESTRAL.util.Effects.BlindDown=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1,s=t&&t.ghost?t.ghost:!1,o=parseInt(YAHOO.util.Dom.getStyle(e,"height"));this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._opts=t,isNaN(o)?this._height=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)):this._height=o,this._top=parseInt(YAHOO.util.Dom.getStyle(this.element,"top")),isNaN(this._top)&&(this._top=0),YAHOO.util.Dom.setStyle(this.element,"overflow","hidden");var u={height:{from:0,to:this._height}};s&&(u.opacity={to:1,from:0}),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);if(t&&t.bind&&t.bind=="bottom"){var u={height:{to:0,from:parseInt(this._height)},top:{to:this._top+parseInt(this._height),from:this._top}};s&&(u.opacity={to:0,from:1})}this.effect=new YAHOO.util.Anim(this.element,u,r,n),t&&t.bind&&t.bind=="bottom"?this.effect.onComplete.subscribe(function(){ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"top",this._top+"px"),isNaN(o)?YAHOO.util.Dom.setStyle(this.element,"height","auto"):YAHOO.util.Dom.setStyle(this.element,"height",this._height+"px"),this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0):this.effect.onComplete.subscribe(function(
){isNaN(o)?YAHOO.util.Dom.setStyle(this.element,"height","auto"):YAHOO.util.Dom.setStyle(this.element,"height",this._height+"px"),this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.BlindDown.prototype.prepStyle=function(){(!this._opts||!this._opts.bind||this._opts.bind!="bottom")&&YAHOO.util.Dom.setStyle(this.element,"height","0px"),ORCHESTRAL.util.Effects.Show(this.element)},ORCHESTRAL.util.Effects.BlindDown.prototype.animate=function(){this.prepStyle(),this.effect.animate()},ORCHESTRAL.util.Effects.BlindDown.prototype.toString=function(){return"Effect BlindDown ["+this.element.id+"]"},ORCHESTRAL.util.Effects.BlindRight=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1,s=t&&t.ghost?t.ghost:!1;this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._width=parseInt(YAHOO.util.Dom.getStyle(this.element,"width")),this._left=parseInt(YAHOO.util.Dom.getStyle(this.element,"left")),isNaN(this._left)&&(this._left=0),this._opts=t,YAHOO.util.Dom.setStyle(this.element,"overflow","hidden"),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var o={width:{from:0,to:this._width}};s&&(o.opacity={to:1,from:0});if(t&&t.bind&&t.bind=="right"){var o={width:{to:0},left:{to:this._left+parseInt(this._width),from:this._left}};s&&(o.opacity={to:0,from:1})}this.effect=new YAHOO.util.Anim(this.element,o,r,n),t&&t.bind&&t.bind=="right"?this.effect.onComplete.subscribe(function(){ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"width",this._width+"px"),YAHOO.util.Dom.setStyle(this.element,"left",this._left+"px"),this._width=null,this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0):this.effect.onComplete.subscribe(function(){this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.BlindRight.prototype.prepStyle=function(){(!this._opts||!this._opts.bind||this._opts.bind!="right")&&YAHOO.util.Dom.setStyle(this.element,"width","0")},ORCHESTRAL.util.Effects.BlindRight.prototype.animate=function(){this.prepStyle(),this.effect.animate()},ORCHESTRAL.util.Effects.BlindRight.prototype.toString=function(){return"Effect BlindRight ["+this.element.id+"]"},ORCHESTRAL.util.Effects.BlindLeft=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1,s=t&&t.ghost?t.ghost:!1;this.ghost=s,this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._width=YAHOO.util.Dom.getStyle(this.element,"width"),this._left=parseInt(YAHOO.util.Dom.getStyle(this.element,"left")),isNaN(this._left)&&(this._left=0),this._opts=t,YAHOO.util.Dom.setStyle(this.element,"overflow","hidden");var o={width:{to:0}};s&&(o.opacity={to:0,from:1}),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);if(t&&t.bind&&t.bind=="right"){var o={width:{from:0,to:parseInt(this._width)},left:{from:this._left+parseInt(this._width),to:this._left}};s&&(o.opacity={to:1,from:0})}this.effect=new YAHOO.util.Anim(this.element,o,r,n),t&&t.bind&&t.bind=="right"?this.effect.onComplete.subscribe(function(){clearLock(this.element),this.onEffectComplete.fire()},this,!0):this.effect.onComplete.subscribe(function(){ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"width",this._width),YAHOO.util.Dom.setStyle(this.element,"left",this._left+"px"),this.element.style.opacity="",this._width=null,clearLock(this.element),this.onEffectComplete.fire()},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.BlindLeft.prototype.prepStyle=function(){this._opts&&this._opts.bind&&this._opts.bind=="right"&&(ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"width","0px"),YAHOO.util.Dom.setStyle(this.element,"left",parseInt(this._width)),this.ghost&&YAHOO.util.Dom.setStyle(this.element,"opacity",0),ORCHESTRAL.util.Effects.Show(this.element))},ORCHESTRAL.util.Effects.BlindLeft.prototype.animate=function(){this.prepStyle(),this.effect.animate()},ORCHESTRAL.util.Effects.BlindLeft.prototype.toString=function(){return"Effect BlindLeft ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Fold=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1;this.ghost=t&&t.ghost?t.ghost:!1,this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._to=5,i||ORCHESTRAL.util.Effects.Show(this.element),YAHOO.util.Dom.setStyle(this.element,"overflow","hidden"),this.done=!1,this._height=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)),this._width=YAHOO.util.Dom.getStyle(this.element,"width"),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this),t&&t.to&&(this._to=t.to);var s={height:{to:this._to}};this.effect=new YAHOO.util.Anim(this.element,s,r,n),this.effect.onComplete.subscribe(function(){this.done?(ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"height",this._height+"px"),YAHOO.util.Dom.setStyle(this.element,"width",this._width),clearLock(this.element),this.onEffectComplete.fire()):(this.done=!0,this.effect.attributes={width:{to:0},height:{from:this._to,to:this._to}},this.ghost&&(this.effect.attributes.opacity={to:0,from:1}),this.animate())},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.Fold.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Fold.prototype.toString=function(){return"Effect Fold ["+this.element.id+"]"},ORCHESTRAL.util.Effects.UnFold=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1;this.ghost=t&&t.ghost?t.ghost:!1,this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._height=ORCHESTRAL.util.Dom.getHeight(this.element),this._width=YAHOO.util.Dom.getStyle(this.element,"width"),this._to=5,YAHOO
.util.Dom.setStyle(this.element,"overflow","hidden"),this.done=!1,this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this),t&&t.to&&(this._to=t.to),attributes={height:{from:0,to:this._to},width:{from:0,to:parseInt(this._width)}},this.ghost&&(attributes.opacity={to:.15,from:0}),this.effect=new YAHOO.util.Anim(this.element,attributes,r,n),this.effect.onComplete.subscribe(function(){this.done?(clearLock(this.element),this.onEffectComplete.fire(),this.done=!1):(this.done=!0,this.effect.attributes={width:{from:parseInt(this._width),to:parseInt(this._width)},height:{from:this._to,to:parseInt(this._height)}},this.ghost&&(this.effect.attributes.opacity={to:1,from:.15}),this.effect.animate())},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.UnFold.prototype.prepStyle=function(){ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"height","0px"),YAHOO.util.Dom.setStyle(this.element,"width","0px"),this.effect.attributes=attributes},ORCHESTRAL.util.Effects.UnFold.prototype.animate=function(){this.prepStyle(),ORCHESTRAL.util.Effects.Show(this.element),this.effect.animate()},ORCHESTRAL.util.Effects.UnFold.prototype.toString=function(){return"Effect UnFold ["+this.element.id+"]"},ORCHESTRAL.util.Effects.ShakeLR=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._offSet=10,this._maxCount=5,this._counter=0,this._elmPos=YAHOO.util.Dom.getXY(this.element);var n={left:{to:-this._offSet}};this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this),t&&t.offset&&(this._offSet=t.offset),t&&t.maxcount&&(this._maxCount=t.maxcount);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,i=t&&t.seconds?t.seconds:.25,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){this.done?(clearLock(this.element),this.onEffectComplete.fire()):this._counter<this._maxCount?(this._counter++,this._left?(this._left=null,this.effect.attributes={left:{to:-this._offSet}}):(this._left=!0,this.effect.attributes={left:{to:this._offSet}}),this.effect.animate()):(this.done=!0,this._left=null,this._counter=null,this.effect.attributes={left:{to:0}},this.effect.animate())},this,!0),s||this.effect.animate()},ORCHESTRAL.util.Effects.ShakeLR.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.ShakeLR.prototype.toString=function(){return"Effect ShakeLR ["+this.element.id+"]"},ORCHESTRAL.util.Effects.ShakeTB=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._offSet=10,this._maxCount=5,this._counter=0,this._elmPos=YAHOO.util.Dom.getXY(this.element);var n={top:{to:-this._offSet}};t&&t.offset&&(this._offSet=t.offset),t&&t.maxcount&&(this._maxCount=t.maxcount),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,i=t&&t.seconds?t.seconds:.25,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){this.done?(clearLock(this.element),this.onEffectComplete.fire()):this._counter<this._maxCount?(this._counter++,this._left?(this._left=null,this.effect.attributes={top:{to:-this._offSet}}):(this._left=!0,this.effect.attributes={top:{to:this._offSet}}),this.effect.animate()):(this.done=!0,this._left=null,this._counter=null,this.effect.attributes={top:{to:0}},this.effect.animate())},this,!0),s||this.effect.animate()},ORCHESTRAL.util.Effects.ShakeTB.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.ShakeTB.prototype.toString=function(){return"Effect ShakeTB ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Drop=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._height=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)),this._top=parseInt(YAHOO.util.Dom.getStyle(this.element,"top")),isNaN(this._top)&&(this._top=0);var n={top:{from:this._top,to:this._top+this._height},opacity:{from:1,to:0}};this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeIn,i=t&&t.seconds?t.seconds:1,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"top",this._top+"px"),this.element.style.opacity="",clearLock(this.element),this.onEffectComplete.fire()},this,!0),s||this.animate()},ORCHESTRAL.util.Effects.Drop.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Drop.prototype.toString=function(){return"Effect Drop ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Pulse=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this._counter=0,this._maxCount=9;var n={opacity:{from:1,to:0}};t&&t.maxcount&&(this._maxCount=t.maxcount),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var r=t&&t.ease?t.ease:YAHOO.util.Easing.easeIn,i=t&&t.seconds?t.seconds:.25,s=t&&t.delay?t.delay:!1;this.effect=new YAHOO.util.Anim(this.element,n,i,r),this.effect.onComplete.subscribe(function(){this.done?(clearLock(this.element),this.onEffectComplete.fire()):this._counter<this._maxCount?(this._counter++,this._on?(this._on=null,this.effect.attributes={opacity:{to:0}}):(this._on=!0,this.effect.attributes={opacity:{to:1}}),this.effect.animate()):(this.done=!0,this._on=null,this._counter=null,this.effect.attributes={opacity:{to:1}},this.effect.animate())},this,!0),s||this.effect.animate()},ORCHESTRAL.util.Effects.Pulse.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Pulse.prototype.toString=function(){return"Effect Pulse ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Shrink=function(e,t){this.start_elm=YAHOO.util.Dom.get(e),this.element=this.start_elm.cloneNode(!0);if(!obtainLock(this.element))return;this.start_elm.parentNode.replaceChild(this.element,this.start_elm),ORCHESTRAL.util.Effects.Hide
(this.start_elm),YAHOO.util.Dom.setStyle(this.element,"overflow","hidden"),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1,s={width:{to:0},height:{to:0},fontSize:{from:100,to:0,unit:"%"},opacity:{from:1,to:0}};this.effect=new YAHOO.util.Anim(this.element,s,r,n),this.effect.onComplete.subscribe(function(){this.element.parentNode.replaceChild(this.start_elm,this.element),clearLock(this.element),this.onEffectComplete.fire()},this,!0),i||this.effect.animate()},ORCHESTRAL.util.Effects.Shrink.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Shrink.prototype.toString=function(){return"Effect Shrink ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Grow=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;var n=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)),r=parseInt(YAHOO.util.Dom.getStyle(this.element,"width"));YAHOO.util.Dom.setStyle(this.element,"overflow","hidden"),this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var i=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,s=t&&t.seconds?t.seconds:1,o=t&&t.delay?t.delay:!1,u={width:{to:r,from:0},height:{to:n,from:0},fontSize:{from:0,to:100,unit:"%"},opacity:{from:0,to:1}};this.effect=new YAHOO.util.Anim(this.element,u,s,i),this.effect.onComplete.subscribe(function(){clearLock(this.element),this.onEffectComplete.fire()},this,!0),o||this.animate()},ORCHESTRAL.util.Effects.Grow.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Grow.prototype.toString=function(){return"Effect Grow ["+this.element.id+"]"},ORCHESTRAL.util.Effects.TV=function(e,t){var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeIn,r=t&&t.seconds?t.seconds:1,i=t&&t.delay?t.delay:!1;this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;this.done=!1,this._height=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)),this._width=parseInt(YAHOO.util.Dom.getStyle(this.element,"width")),YAHOO.util.Dom.setStyle(this.element,"overflow","hidden");var s={top:{from:0,to:this._height/2},height:{to:5}};this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this),this.effect=new YAHOO.util.Anim(this.element,s,r,n),this.effect.onComplete.subscribe(function(){this.done?(clearLock(this.element),this.onEffectComplete.fire(),ORCHESTRAL.util.Effects.Hide(this.element),YAHOO.util.Dom.setStyle(this.element,"height",this._height+"px"),YAHOO.util.Dom.setStyle(this.element,"width",this._width+"px"),YAHOO.util.Dom.setStyle(this.element,"top",""),YAHOO.util.Dom.setStyle(this.element,"left",""),this.element.style.opacity=""):(this.done=!0,this.effect.attributes={top:{from:this._height/2,to:this._height/2},left:{from:0,to:this._width/2},height:{from:5,to:5},width:{to:5},opacity:{from:1,to:0}},this.effect.animate())},this,!0),i||this.animate()},ORCHESTRAL.util.Effects.TV.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.TV.prototype.toString=function(){return"Effect TV ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Shadow=function(e,t){var n=t&&t.delay?t.delay:!1,r=t&&t.top?t.top:8,i=t&&t.left?t.left:8,s=t&&t.color?t.color:"#ccc",o=t&&t.opacity?t.opacity:.75;this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;YAHOO.util.Dom.get(this.element.id+"_shadow")?this.shadow=YAHOO.util.Dom.get(this.element.id+"_shadow"):(this.shadow=document.createElement("div"),this.shadow.id=this.element.id+"_shadow",this.element.parentNode.appendChild(this.shadow));var u=parseInt(ORCHESTRAL.util.Dom.getHeight(this.element)),a=parseInt(YAHOO.util.Dom.getStyle(this.element,"width")),f=this.element.style.zIndex;f||(f=1,this.element.style.zIndex=f),YAHOO.util.Dom.setStyle(this.element,"overflow","hidden"),YAHOO.util.Dom.setStyle(this.shadow,"height",u+"px"),YAHOO.util.Dom.setStyle(this.shadow,"width",a+"px"),YAHOO.util.Dom.setStyle(this.shadow,"background-color",s),YAHOO.util.Dom.setStyle(this.shadow,"opacity",0),YAHOO.util.Dom.setStyle(this.shadow,"position","absolute"),this.shadow.style.zIndex=f-1;var l=YAHOO.util.Dom.getXY(this.element);this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this);var c={opacity:{from:0,to:o},top:{from:l[1],to:l[1]+r},left:{from:l[0],to:l[0]+i}};this.effect=new YAHOO.util.Anim(this.shadow,c),this.effect.onComplete.subscribe(function(){clearLock(this.element),this.onEffectComplete.fire()},this,!0),n||this.animate()},ORCHESTRAL.util.Effects.Shadow.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Shadow.prototype.toString=function(){return"Effect Shadow ["+this.element.id+"]"},ORCHESTRAL.util.Effects.Highlight=function(e,t){this.element=YAHOO.util.Dom.get(e);if(!obtainLock(this.element))return;var n=t&&t.ease?t.ease:YAHOO.util.Easing.easeOut,r=t&&t.seconds?t.seconds:1,i=t&&t.startcolor?t.startcolor:"#ffff99",s=t&&t.endcolor?t.endcolor:"#ffffff",o=t&&t.restorecolor?t.restorecolor:YAHOO.util.Dom.getStyle(this.element,"backgroundColor"),u=t&&t.keepBackgroundImage?t.keepBackgroundImage:!1,a=t&&t.delay?t.delay:!1;this.onEffectComplete=new YAHOO.util.CustomEvent("oneffectcomplete",this),this.oldStyle={},u||(this.oldStyle.backgroundImage=YAHOO.util.Dom.getStyle(this.element,"background-image"),YAHOO.util.Dom.setStyle(this.element,"backgroundImage","none"));var f={backgroundColor:{from:i,to:s}};this.effect=new YAHOO.util.ColorAnim(this.element,f,r,n),this.effect.onComplete.subscribe(function(){YAHOO.util.Dom.setStyle(this.element,"backgroundColor",o),clearLock(this.element),this.onEffectComplete.fire()},this,!0),a||this.effect.animate()},ORCHESTRAL.util.Effects.Highlight.prototype.animate=function(){this.effect.animate()},ORCHESTRAL.util.Effects.Highlight.prototype.toString=function(){return"Effect Highlight ["+this.element.id+"]"},ORCHESTRAL.util.Effects.ContainerEffect=function(){},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownBinded=function(e,t){var n=new YAHOO.widget.ContainerEffect
(e,{attributes:{effect:"BlindUp",opts:{bind:"bottom"}},duration:t},{attributes:{effect:"BlindDown",opts:{bind:"bottom"}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDown=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindDown"},duration:t},{attributes:{effect:"BlindUp"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightBinded=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindLeft",opts:{bind:"right"}},duration:t},{attributes:{effect:"BlindRight",opts:{bind:"right"}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRight=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindRight"},duration:t},{attributes:{effect:"BlindLeft"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindRightFold=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindRight"},duration:t},{attributes:{effect:"Fold"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftFold=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindLeft",opts:{bind:"right"}},duration:t},{attributes:{effect:"Fold"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.UnFoldFold=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"UnFold"},duration:t},{attributes:{effect:"Fold"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindDownDrop=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindDown"},duration:t},{attributes:{effect:"Drop"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDrop=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindUp",opts:{bind:"bottom"}},duration:t},{attributes:{effect:"Drop"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownBindedGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindUp",opts:{ghost:!0,bind:"bottom"}},duration:t},{attributes:{effect:"BlindDown",opts:{ghost:!0,bind:"bottom"}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindDown",opts:{ghost:!0}},duration:t},{attributes:{effect:"BlindUp",opts:{ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightBindedGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindLeft",opts:{bind:"right",ghost:!0}},duration:t},{attributes:{effect:"BlindRight",opts:{bind:"right",ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindRight",opts:{ghost:!0}},duration:t},{attributes:{effect:"BlindLeft",opts:{ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindRightFoldGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindRight",opts:{ghost:!0}},duration:t},{attributes:{effect:"Fold",opts:{ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftFoldGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindLeft",opts:{bind:"right",ghost:!0}},duration:t},{attributes:{effect:"Fold",opts:{ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.UnFoldFoldGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"UnFold",opts:{ghost:!0}},duration:t},{attributes:{effect:"Fold",opts:{ghost:!0}},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindDownDropGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindDown",opts:{ghost:!0}},duration:t},{attributes:{effect:"Drop"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDropGhost=function(e,t){var n=new YAHOO.widget.ContainerEffect(e,{attributes:{effect:"BlindUp",opts:{bind:"bottom",ghost:!0}},duration:t},{attributes:{effect:"Drop"},duration:t},e.element,ORCHESTRAL.util.Effects.Container);return n.init(),n},ORCHESTRAL.util.Effects.Container=function(el,attrs,dur){var opts={delay:!0};if(attrs.opts)for(var i in attrs.opts)opts[i]=attrs.opts[i];var func=eval("ORCHESTRAL.util.Effects."+attrs.effect),eff=new func(el,opts);return eff.onStart=eff.effect.onStart,eff.onTween=eff.effect.onTween,eff.onComplete=eff.onEffectComplete,eff}}(),YAHOO.register("orchestral-effects",ORCHESTRAL.util.Effects,{version:"7.9",build:"0"});
