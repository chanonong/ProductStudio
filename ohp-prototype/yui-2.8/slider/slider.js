/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function(){var b=YAHOO.util.Dom.getXY,a=YAHOO.util.Event,d=Array.prototype.slice;function c(g,e,f,h){c.ANIM_AVAIL=(!YAHOO.lang.isUndefined(YAHOO.util.Anim));if(g){this.init(g,e,true);this.initSlider(h);this.initThumb(f)}}YAHOO.lang.augmentObject(c,{getHorizSlider:function(f,g,i,h,e){return new c(f,f,new YAHOO.widget.SliderThumb(g,f,i,h,0,0,e),"horiz")},getVertSlider:function(g,h,e,i,f){return new c(g,g,new YAHOO.widget.SliderThumb(h,g,0,0,e,i,f),"vert")},getSliderRegion:function(g,h,j,i,e,k,f){return new c(g,g,new YAHOO.widget.SliderThumb(h,g,j,i,e,k,f),"region")},SOURCE_UI_EVENT:1,SOURCE_SET_VALUE:2,SOURCE_KEY_EVENT:3,ANIM_AVAIL:false},true);YAHOO.extend(c,YAHOO.util.DragDrop,{_mouseDown:false,dragOnly:true,initSlider:function(e){this.type=e;this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);this.isTarget=false;this.animate=c.ANIM_AVAIL;this.backgroundEnabled=true;this.tickPause=40;this.enableKeys=true;this.keyIncrement=20;this.moveComplete=true;this.animationDuration=0.2;this.SOURCE_UI_EVENT=1;this.SOURCE_SET_VALUE=2;this.valueChangeSource=0;this._silent=false;this.lastOffset=[0,0]},initThumb:function(f){var e=this;this.thumb=f;f.cacheBetweenDrags=true;if(f._isHoriz&&f.xTicks&&f.xTicks.length){this.tickPause=Math.round(360/f.xTicks.length)}else{if(f.yTicks&&f.yTicks.length){this.tickPause=Math.round(360/f.yTicks.length)}}f.onAvailable=function(){return e.setStartSliderState()};f.onMouseDown=function(){e._mouseDown=true;return e.focus()};f.startDrag=function(){e._slideStart()};f.onDrag=function(){e.fireEvents(true)};f.onMouseUp=function(){e.thumbMouseUp()}},onAvailable:function(){this._bindKeyEvents()},_bindKeyEvents:function(){a.on(this.id,"keydown",this.handleKeyDown,this,true);a.on(this.id,"keypress",this.handleKeyPress,this,true)},handleKeyPress:function(g){if(this.enableKeys){var f=a.getCharCode(g);switch(f){case 37:case 38:case 39:case 40:case 36:case 35:a.preventDefault(g);break;default:}}},handleKeyDown:function(l){if(this.enableKeys){var i=a.getCharCode(l),g=this.thumb,j=this.getXValue(),f=this.getYValue(),k=true;switch(i){case 37:j-=this.keyIncrement;break;case 38:f-=this.keyIncrement;break;case 39:j+=this.keyIncrement;break;case 40:f+=this.keyIncrement;break;case 36:j=g.leftConstraint;f=g.topConstraint;break;case 35:j=g.rightConstraint;f=g.bottomConstraint;break;default:k=false}if(k){if(g._isRegion){this._setRegionValue(c.SOURCE_KEY_EVENT,j,f,true)}else{this._setValue(c.SOURCE_KEY_EVENT,(g._isHoriz?j:f),true)}a.stopEvent(l)}}},setStartSliderState:function(){this.setThumbCenterPoint();this.baselinePos=b(this.getEl());this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);if(this.thumb._isRegion){if(this.deferredSetRegionValue){this._setRegionValue.apply(this,this.deferredSetRegionValue);this.deferredSetRegionValue=null}else{this.setRegionValue(0,0,true,true,true)}}else{if(this.deferredSetValue){this._setValue.apply(this,this.deferredSetValue);this.deferredSetValue=null}else{this.setValue(0,true,true,true)}}},setThumbCenterPoint:function(){var e=this.thumb.getEl();if(e){this.thumbCenterPoint={x:parseInt(e.offsetWidth/2,10),y:parseInt(e.offsetHeight/2,10)}}},lock:function(){this.thumb.lock();this.locked=true},unlock:function(){this.thumb.unlock();this.locked=false},thumbMouseUp:function(){this._mouseDown=false;if(!this.isLocked()){this.endMove()}},onMouseUp:function(){this._mouseDown=false;if(this.backgroundEnabled&&!this.isLocked()){this.endMove()}},getThumb:function(){return this.thumb},focus:function(){this.valueChangeSource=c.SOURCE_UI_EVENT;var f=this.getEl();if(f.focus){try{f.focus()}catch(g){}}this.verifyOffset();return !this.isLocked()},onChange:function(e,f){},onSlideStart:function(){},onSlideEnd:function(){},getValue:function(){return this.thumb.getValue()},getXValue:function(){return this.thumb.getXValue()},getYValue:function(){return this.thumb.getYValue()},setValue:function(){var e=d.call(arguments);e.unshift(c.SOURCE_SET_VALUE);return this._setValue.apply(this,e)},_setValue:function(i,l,g,h,e){var f=this.thumb,k,j;if(!f.available){this.deferredSetValue=arguments;return false}if(this.isLocked()&&!h){return false}if(isNaN(l)){return false}if(f._isRegion){return false}this._silent=e;this.valueChangeSource=i||c.SOURCE_SET_VALUE;f.lastOffset=[l,l];this.verifyOffset();this._slideStart();if(f._isHoriz){k=f.initPageX+l+this.thumbCenterPoint.x;this.moveThumb(k,f.initPageY,g)}else{j=f.initPageY+l+this.thumbCenterPoint.y;this.moveThumb(f.initPageX,j,g)}return true},setRegionValue:function(){var e=d.call(arguments);e.unshift(c.SOURCE_SET_VALUE);return this._setRegionValue.apply(this,e)},_setRegionValue:function(f,j,h,i,g,k){var l=this.thumb,e,m;if(!l.available){this.deferredSetRegionValue=arguments;return false}if(this.isLocked()&&!g){return false}if(isNaN(j)){return false}if(!l._isRegion){return false}this._silent=k;this.valueChangeSource=f||c.SOURCE_SET_VALUE;l.lastOffset=[j,h];this.verifyOffset();this._slideStart();e=l.initPageX+j+this.thumbCenterPoint.x;m=l.initPageY+h+this.thumbCenterPoint.y;this.moveThumb(e,m,i);return true},verifyOffset:function(){var f=b(this.getEl()),e=this.thumb;if(!this.thumbCenterPoint||!this.thumbCenterPoint.x){this.setThumbCenterPoint()}if(f){if(f[0]!=this.baselinePos[0]||f[1]!=this.baselinePos[1]){this.setInitPosition();this.baselinePos=f;e.initPageX=this.initPageX+e.startOffset[0];e.initPageY=this.initPageY+e.startOffset[1];e.deltaSetXY=null;this.resetThumbConstraints();return false}}return true},moveThumb:function(k,j,i,g){var l=this.thumb,m=this,f,e,h;if(!l.available){return}l.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);e=l.getTargetCoord(k,j);f=[Math.round(e.x),Math.round(e.y)];if(this.animate&&l._graduated&&!i){this.lock();this.curCoord=b(this.thumb.getEl());this.curCoord=[Math.round(this.curCoord[0]),Math.round(this.curCoord[1])];setTimeout(function(){m.moveOneTick(f)},this.tickPause)}else{if(this.animate&&c.ANIM_AVAIL&&!i){this.lock();h=new YAHOO.util.Motion(l.id,{points:{to:f}},this.animationDuration,YAHOO.util.Easing.easeOut);h.onComplete.subscribe(function(){m.unlock();if(!m._mouseDown){m.endMove()}});h.animate()}else{l.setDragElPos(k,j);if(!g&&!this._mouseDown){this.endMove()}}}},_slideStart:function(){if(!this._sliding){if(!this._silent){this.onSlideStart();this.fireEvent("slideStart")}this._sliding=true;this.moveComplete=false}},_slideEnd:function(){if(this._sliding){var e=this._silent;this._sliding=false;this.moveComplete=true;this._silent=false;if(!e){this.onSlideEnd();this.fireEvent("slideEnd")}}},moveOneTick:function(f){var h=this.thumb,g=this,i=null,e,j;if(h._isRegion){i=this._getNextX(this.curCoord,f);e=(i!==null)?i[0]:this.curCoord[0];i=this._getNextY(this.curCoord,f);j=(i!==null)?i[1]:this.curCoord[1];i=e!==this.curCoord[0]||j!==this.curCoord[1]?[e,j]:null}else{if(h._isHoriz){i=this._getNextX(this.curCoord,f)}else{i=this._getNextY(this.curCoord,f)}}if(i){this.curCoord=i;this.thumb.alignElWithMouse(h.getEl(),i[0]+this.thumbCenterPoint.x,i[1]+this.thumbCenterPoint.y);if(!(i[0]==f[0]&&i[1]==f[1])){setTimeout(function(){g.moveOneTick(f)},this.tickPause)}else{this.unlock();if(!this._mouseDown){this.endMove()}}}else{this.unlock();if(!this._mouseDown){this.endMove()}}},_getNextX:function(e,f){var h=this.thumb,j,g=[],i=null;if(e[0]>f[0]){j=h.tickSize-this.thumbCenterPoint.x;g=h.getTargetCoord(e[0]-j,e[1]);i=[g.x,g.y]}else{if(e[0]<f[0]){j=h.tickSize+this.thumbCenterPoint.x;g=h.getTargetCoord(e[0]+j,e[1]);i=[g.x,g.y]}else{}}return i},_getNextY:function(e,f){var h=this.thumb,j,g=[],i=null;if(e[1]>f[1]){j=h.tickSize-this.thumbCenterPoint.y;g=h.getTargetCoord(e[0],e[1]-j);i=[g.x,g.y]}else{if(e[1]<f[1]){j=h.tickSize+this.thumbCenterPoint.y;g=h.getTargetCoord(e[0],e[1]+j);i=[g.x,g.y]}else{}}return i},b4MouseDown:function(f){if(!this.backgroundEnabled){return false}this.thumb.autoOffset();this.baselinePos=[]},onMouseDown:function(g){if(!this.backgroundEnabled||this.isLocked()){return false}this._mouseDown=true;var f=a.getPageX(g),h=a.getPageY(g);this.focus();this._slideStart();this.moveThumb(f,h)},onDrag:function(g){if(this.backgroundEnabled&&!this.isLocked()){var f=a.getPageX(g),h=a.getPageY(g);this.moveThumb(f,h,true,true);this.fireEvents()}},endMove:function(){this.unlock();this.fireEvents();this._slideEnd()},resetThumbConstraints:function(){var e=this.thumb;e.setXConstraint(e.leftConstraint,e.rightConstraint,e.xTickSize);e.setYConstraint(e.topConstraint,e.bottomConstraint,e.xTickSize)},fireEvents:function(g){var f=this.thumb,i,h,e;if(!g){f.cachePosition()}if(!this.isLocked()){if(f._isRegion){i=f.getXValue();h=f.getYValue();if(i!=this.previousX||h!=this.previousY){if(!this._silent){this.onChange(i,h);this.fireEvent("change",{x:i,y:h})}}this.previousX=i;this.previousY=h}else{e=f.getValue();if(e!=this.previousVal){if(!this._silent){this.onChange(e);this.fireEvent("change",e)}}this.previousVal=e}}},toString:function(){return("Slider ("+this.type+") "+this.id)}});YAHOO.lang.augmentProto(c,YAHOO.util.EventProvider);YAHOO.widget.Slider=c})();YAHOO.widget.SliderThumb=function(g,b,e,d,a,f,c){if(g){YAHOO.widget.SliderThumb.superclass.constructor.call(this,g,b);this.parentElId=b}this.isTarget=false;this.tickSize=c;this.maintainOffset=true;this.initSlider(e,d,a,f,c);this.scroll=false};YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,dragOnly:true,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent0:function(c){var a=YAHOO.util.Dom.getXY(this.getEl()),b=c||YAHOO.util.Dom.getXY(this.parentElId);return[(a[0]-b[0]),(a[1]-b[1])]},getOffsetFromParent:function(h){var a=this.getEl(),e,i,f,b,k,d,c,j,g;if(!this.deltaOffset){i=YAHOO.util.Dom.getXY(a);f=h||YAHOO.util.Dom.getXY(this.parentElId);e=[(i[0]-f[0]),(i[1]-f[1])];b=parseInt(YAHOO.util.Dom.getStyle(a,"left"),10);k=parseInt(YAHOO.util.Dom.getStyle(a,"top"),10);d=b-e[0];c=k-e[1];if(isNaN(d)||isNaN(c)){}else{this.deltaOffset=[d,c]}}else{j=parseInt(YAHOO.util.Dom.getStyle(a,"left"),10);g=parseInt(YAHOO.util.Dom.getStyle(a,"top"),10);e=[j+this.deltaOffset[0],g+this.deltaOffset[1]]}return e},initSlider:function(d,c,a,e,b){this.initLeft=d;this.initRight=c;this.initUp=a;this.initDown=e;this.setXConstraint(d,c,b);this.setYConstraint(a,e,b);if(b&&b>1){this._graduated=true}this._isHoriz=(d||c);this._isVert=(a||e);this._isRegion=(this._isHoriz&&this._isVert)},clearTicks:function(){YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);this.tickSize=0;this._graduated=false},getValue:function(){return(this._isHoriz)?this.getXValue():this.getYValue()},getXValue:function(){if(!this.available){return 0}var a=this.getOffsetFromParent();if(YAHOO.lang.isNumber(a[0])){this.lastOffset=a;return(a[0]-this.startOffset[0])}else{return(this.lastOffset[0]-this.startOffset[0])}},getYValue:function(){if(!this.available){return 0}var a=this.getOffsetFromParent();if(YAHOO.lang.isNumber(a[1])){this.lastOffset=a;return(a[1]-this.startOffset[1])}else{return(this.lastOffset[1]-this.startOffset[1])}},toString:function(){return"SliderThumb "+this.id},onChange:function(a,b){}});(function(){var a=YAHOO.util.Event,b=YAHOO.widget;function c(i,f,h,d){var g=this,j={min:false,max:false},e,k;this.minSlider=i;this.maxSlider=f;this.activeSlider=i;this.isHoriz=i.thumb._isHoriz;e=this.minSlider.thumb.onMouseDown;k=this.maxSlider.thumb.onMouseDown;this.minSlider.thumb.onMouseDown=function(){g.activeSlider=g.minSlider;e.apply(this,arguments)};this.maxSlider.thumb.onMouseDown=function(){g.activeSlider=g.maxSlider;k.apply(this,arguments)};this.minSlider.thumb.onAvailable=function(){i.setStartSliderState();j.min=true;if(j.max){g.fireEvent("ready",g)}};this.maxSlider.thumb.onAvailable=function(){f.setStartSliderState();j.max=true;if(j.min){g.fireEvent("ready",g)}};i.onMouseDown=f.onMouseDown=function(l){return this.backgroundEnabled&&g._handleMouseDown(l)};i.onDrag=f.onDrag=function(l){g._handleDrag(l)};i.onMouseUp=f.onMouseUp=function(l){g._handleMouseUp(l)};i._bindKeyEvents=function(){g._bindKeyEvents(this)};f._bindKeyEvents=function(){};i.subscribe("change",this._handleMinChange,i,this);i.subscribe("slideStart",this._handleSlideStart,i,this);i.subscribe("slideEnd",this._handleSlideEnd,i,this);f.subscribe("change",this._handleMaxChange,f,this);f.subscribe("slideStart",this._handleSlideStart,f,this);f.subscribe("slideEnd",this._handleSlideEnd,f,this);this.createEvent("ready",this);this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);d=YAHOO.lang.isArray(d)?d:[0,h];d[0]=Math.min(Math.max(parseInt(d[0],10)|0,0),h);d[1]=Math.max(Math.min(parseInt(d[1],10)|0,h),0);if(d[0]>d[1]){d.splice(0,2,d[1],d[0])}this.minVal=d[0];this.maxVal=d[1];this.minSlider.setValue(this.minVal,true,true,true);this.maxSlider.setValue(this.maxVal,true,true,true)}c.prototype={minVal:-1,maxVal:-1,minRange:0,_handleSlideStart:function(e,d){this.fireEvent("slideStart",d)},_handleSlideEnd:function(e,d){this.fireEvent("slideEnd",d)},_handleDrag:function(d){b.Slider.prototype.onDrag.call(this.activeSlider,d)},_handleMinChange:function(){this.activeSlider=this.minSlider;this.updateValue()},_handleMaxChange:function(){this.activeSlider=this.maxSlider;this.updateValue()},_bindKeyEvents:function(d){a.on(d.id,"keydown",this._handleKeyDown,this,true);a.on(d.id,"keypress",this._handleKeyPress,this,true)},_handleKeyDown:function(d){this.activeSlider.handleKeyDown.apply(this.activeSlider,arguments)},_handleKeyPress:function(d){this.activeSlider.handleKeyPress.apply(this.activeSlider,arguments)},setValues:function(h,k,i,e,j){var f=this.minSlider,m=this.maxSlider,d=f.thumb,l=m.thumb,n=this,g={min:false,max:false};if(d._isHoriz){d.setXConstraint(d.leftConstraint,l.rightConstraint,d.tickSize);l.setXConstraint(d.leftConstraint,l.rightConstraint,l.tickSize)}else{d.setYConstraint(d.topConstraint,l.bottomConstraint,d.tickSize);l.setYConstraint(d.topConstraint,l.bottomConstraint,l.tickSize)}this._oneTimeCallback(f,"slideEnd",function(){g.min=true;if(g.max){n.updateValue(j);setTimeout(function(){n._cleanEvent(f,"slideEnd");n._cleanEvent(m,"slideEnd")},0)}});this._oneTimeCallback(m,"slideEnd",function(){g.max=true;if(g.min){n.updateValue(j);setTimeout(function(){n._cleanEvent(f,"slideEnd");n._cleanEvent(m,"slideEnd")},0)}});f.setValue(h,i,e,false);m.setValue(k,i,e,false)},setMinValue:function(f,h,i,e){var g=this.minSlider,d=this;this.activeSlider=g;d=this;this._oneTimeCallback(g,"slideEnd",function(){d.updateValue(e);setTimeout(function(){d._cleanEvent(g,"slideEnd")},0)});g.setValue(f,h,i)},setMaxValue:function(d,h,i,f){var g=this.maxSlider,e=this;this.activeSlider=g;this._oneTimeCallback(g,"slideEnd",function(){e.updateValue(f);setTimeout(function(){e._cleanEvent(g,"slideEnd")},0)});g.setValue(d,h,i)},updateValue:function(j){var e=this.minSlider.getValue(),k=this.maxSlider.getValue(),f=false,d,m,h,i,l,g;if(e!=this.minVal||k!=this.maxVal){f=true;d=this.minSlider.thumb;m=this.maxSlider.thumb;h=this.isHoriz?"x":"y";g=this.minSlider.thumbCenterPoint[h]+this.maxSlider.thumbCenterPoint[h];i=Math.max(k-g-this.minRange,0);l=Math.min(-e-g-this.minRange,0);if(this.isHoriz){i=Math.min(i,m.rightConstraint);d.setXConstraint(d.leftConstraint,i,d.tickSize);m.setXConstraint(l,m.rightConstraint,m.tickSize)}else{i=Math.min(i,m.bottomConstraint);d.setYConstraint(d.leftConstraint,i,d.tickSize);m.setYConstraint(l,m.bottomConstraint,m.tickSize)}}this.minVal=e;this.maxVal=k;if(f&&!j){this.fireEvent("change",this)}},selectActiveSlider:function(j){var g=this.minSlider,f=this.maxSlider,l=g.isLocked()||!g.backgroundEnabled,i=f.isLocked()||!g.backgroundEnabled,h=YAHOO.util.Event,k;if(l||i){this.activeSlider=l?f:g}else{if(this.isHoriz){k=h.getPageX(j)-g.thumb.initPageX-g.thumbCenterPoint.x}else{k=h.getPageY(j)-g.thumb.initPageY-g.thumbCenterPoint.y}this.activeSlider=k*2>f.getValue()+g.getValue()?f:g}},_handleMouseDown:function(d){if(!d._handled&&!this.minSlider._sliding&&!this.maxSlider._sliding){d._handled=true;this.selectActiveSlider(d);return b.Slider.prototype.onMouseDown.call(this.activeSlider,d)}else{return false}},_handleMouseUp:function(d){b.Slider.prototype.onMouseUp.apply(this.activeSlider,arguments)},_oneTimeCallback:function(g,d,f){var e=function(){g.unsubscribe(d,e);f.apply({},arguments)};g.subscribe(d,e)},_cleanEvent:function(m,e){var l,k,d,g,h,f;if(m.__yui_events&&m.events[e]){for(k=m.__yui_events.length;k>=0;--k){if(m.__yui_events[k].type===e){l=m.__yui_events[k];break}}if(l){h=l.subscribers;f=[];g=0;for(k=0,d=h.length;k<d;++k){if(h[k]){f[g++]=h[k]}}l.subscribers=f}}}};YAHOO.lang.augmentProto(c,YAHOO.util.EventProvider);b.Slider.getHorizDualSlider=function(h,j,k,g,f,d){var i=new b.SliderThumb(j,h,0,g,0,0,f),e=new b.SliderThumb(k,h,0,g,0,0,f);return new c(new b.Slider(h,h,i,"horiz"),new b.Slider(h,h,e,"horiz"),g,d)};b.Slider.getVertDualSlider=function(h,j,k,g,f,d){var i=new b.SliderThumb(j,h,0,0,0,g,f),e=new b.SliderThumb(k,h,0,0,0,g,f);return new b.DualSlider(new b.Slider(h,h,i,"vert"),new b.Slider(h,h,e,"vert"),g,d)};YAHOO.widget.DualSlider=c})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"2.8.2r1",build:"7"});