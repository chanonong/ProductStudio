/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("widget-anim",function(e,t){function b(e){b.superclass.constructor.apply(this,arguments)}var n="boundingBox",r="host",i="node",s="opacity",o="",u="visible",a="destroy",f="hidden",l="rendered",c="start",h="end",p="duration",d="animShow",v="animHide",m="_uiSetVisible",g="animShowChange",y="animHideChange";b.NS="anim",b.NAME="pluginWidgetAnim",b.ANIMATIONS={fadeIn:function(){var t=this.get(r),f=t.get(n),l=new e.Anim({node:f,to:{opacity:1},duration:this.get(p)});return t.get(u)||f.setStyle(s,0),l.on(a,function(){this.get(i).setStyle(s,e.UA.ie?1:o)}),l},fadeOut:function(){return new e.Anim({node:this.get(r).get(n),to:{opacity:0},duration:this.get(p)})}},b.ATTRS={duration:{value:.2},animShow:{valueFn:b.ANIMATIONS.fadeIn},animHide:{valueFn:b.ANIMATIONS.fadeOut}},e.extend(b,e.Plugin.Base,{initializer:function(e){this._bindAnimShow(),this._bindAnimHide(),this.after(g,this._bindAnimShow),this.after(y,this._bindAnimHide),this.beforeHostMethod(m,this._uiAnimSetVisible)},destructor:function(){this.get(d).destroy(),this.get(v).destroy()},_uiAnimSetVisible:function(t){if(this.get(r).get(l))return t?(this.get(v).stop(),this.get(d).run()):(this.get(d).stop(),this.get(v).run()),new e.Do.Prevent},_uiSetVisible:function(e){var t=this.get(r),i=t.getClassName(f);t.get(n).toggleClass(i,!e)},_bindAnimShow:function(){this.get(d).on(c,e.bind(function(){this._uiSetVisible(!0)},this))},_bindAnimHide:function(){this.get(v).after(h,e.bind(function(){this._uiSetVisible(!1)},this))}}),e.namespace("Plugin").WidgetAnim=b},"3.17.2",{requires:["anim-base","plugin","widget"]});
