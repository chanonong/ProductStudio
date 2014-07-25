/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("widget-stack",function(e,t){function O(e){}var n=e.Lang,r=e.UA,i=e.Node,s=e.Widget,o="zIndex",u="shim",a="visible",f="boundingBox",l="renderUI",c="bindUI",h="syncUI",p="offsetWidth",d="offsetHeight",v="parentNode",m="firstChild",g="ownerDocument",y="width",b="height",w="px",E="shimdeferred",S="shimresize",x="visibleChange",T="widthChange",N="heightChange",C="shimChange",k="zIndexChange",L="contentUpdate",A="stacked";O.ATTRS={shim:{value:r.ie==6},zIndex:{value:0,setter:"_setZIndex"}},O.HTML_PARSER={zIndex:function(e){return this._parseZIndex(e)}},O.SHIM_CLASS_NAME=s.getClassName(u),O.STACKED_CLASS_NAME=s.getClassName(A),O.SHIM_TEMPLATE='<iframe class="'+O.SHIM_CLASS_NAME+'" frameborder="0" title="Widget Stacking Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>',O.prototype={initializer:function(){this._stackNode=this.get(f),this._stackHandles={},e.after(this._renderUIStack,this,l),e.after(this._syncUIStack,this,h),e.after(this._bindUIStack,this,c)},_syncUIStack:function(){this._uiSetShim(this.get(u)),this._uiSetZIndex(this.get(o))},_bindUIStack:function(){this.after(C,this._afterShimChange),this.after(k,this._afterZIndexChange)},_renderUIStack:function(){this._stackNode.addClass(O.STACKED_CLASS_NAME)},_parseZIndex:function(e){var t;return!e.inDoc()||e.getStyle("position")==="static"?t="auto":t=e.getComputedStyle("zIndex"),t==="auto"?null:t},_setZIndex:function(e){return n.isString(e)&&(e=parseInt(e,10)),n.isNumber(e)||(e=0),e},_afterShimChange:function(e){this._uiSetShim(e.newVal)},_afterZIndexChange:function(e){this._uiSetZIndex(e.newVal)},_uiSetZIndex:function(e){this._stackNode.setStyle(o,e)},_uiSetShim:function(e){e?(this.get(a)?this._renderShim():this._renderShimDeferred(),r.ie==6&&this._addShimResizeHandlers()):this._destroyShim()},_renderShimDeferred:function(){this._stackHandles[E]=this._stackHandles[E]||[];var e=this._stackHandles[E],t=function(e){e.newVal&&this._renderShim()};e.push(this.on(x,t))},_addShimResizeHandlers:function(){this._stackHandles[S]=this._stackHandles[S]||[];var e=this.sizeShim,t=this._stackHandles[S];t.push(this.after(x,e)),t.push(this.after(T,e)),t.push(this.after(N,e)),t.push(this.after(L,e))},_detachStackHandles:function(e){var t=this._stackHandles[e],n;if(t&&t.length>0)while(n=t.pop())n.detach()},_renderShim:function(){var e=this._shimNode,t=this._stackNode;e||(e=this._shimNode=this._getShimTemplate(),t.insertBefore(e,t.get(m)),this._detachStackHandles(E),this.sizeShim())},_destroyShim:function(){this._shimNode&&(this._shimNode.get(v).removeChild(this._shimNode),this._shimNode=null,this._detachStackHandles(E),this._detachStackHandles(S))},sizeShim:function(){var e=this._shimNode,t=this._stackNode;e&&r.ie===6&&this.get(a)&&(e.setStyle(y,t.get(p)+w),e.setStyle(b,t.get(d)+w))},_getShimTemplate:function(){return i.create(O.SHIM_TEMPLATE,this._stackNode.get(g))}},e.WidgetStack=O},"3.17.2",{requires:["base-build","widget"],skinnable:!0});
