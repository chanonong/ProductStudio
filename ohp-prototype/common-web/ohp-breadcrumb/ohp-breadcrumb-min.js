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
YUI.add("ohp-breadcrumb",function(e,t){"use strict";var n=e.ClassNameManager.getClassName,r="virtualpage",i="breadcrumb",s="breadcrumbtrail",o="boundingBox",u="contentBox",a="urlContentFrameId",f="height",l="index",c="innerHTML",h="parent",p="virtualPage",d=n(r,"full-page"),v="cow-breadcrumb-hide-content",m=n(r,"title"),g="url-content",y=n(r,g),b=n(s,"overflow"),w="addChild",E="removeChild",S="windowresize",x="visibleChange",T=".yui3-widget-hd",N=T+" h1, "+T+" h2",C=e.OHP.Locale.get("widget.breadcrumb.back.action"),k="bc",L,A,O,M,_;e.on("domready",function(){L=e.DOM.hasClass(e.config.doc.documentElement,"oldie")}),A=e.Base.create(r,e.Widget,[e.WidgetStack,e.WidgetStdMod],{URL_CONTENT_TEMPLATE:'<iframe id="{id}" name="{id}" class="'+y+'" src="{url}" frameborder="0"></iframe>',initializer:function(t){if(t.url){var n=e.merge(t,{id:this.get(a)});this.set("bodyContent",e.substitute(this.URL_CONTENT_TEMPLATE,n))}},renderUI:function(){var e=this.get("srcNode");e.hasClass(d)&&(e.removeClass(d),this.get(o).addClass(d))},bindUI:function(){e.UA.ipad&&this.on(x,this._onVisibleChange,this)},_onVisibleChange:function(t){t.newVal&&e.config.doc.body.scrollIntoView()}},{ATTRS:{destroyOnClose:{value:!0,validator:e.Lang.isBoolean},fillHeight:{value:e.WidgetStdMod.BODY},pageTitle:{value:C,validator:e.Lang.isString},shim:{value:!0},urlContentFrameId:{readOnly:!0,getter:function(){return this.get("id")+"-"+g}},urlContentWindow:{readOnly:!0,getter:function(){return e.config.win.frames[this.get(a)]}},visible:{value:!1}},HTML_PARSER:{pageTitle:function(e){var t=e.one(T+" ."+m+", "+N);return t?(t.addClass(m),t.get(c)):null}}}),O=e.Base.create(i,e.Widget,[e.WidgetChild],{BOUNDING_TEMPLATE:"<li></li>",CONTENT_TEMPLATE:'<a href="#"></a>',HREF_TEMPLATE:"#"+k+"={index}",initializer:function(){this._handlers=[]},destructor:function(){e.Array.each(this._handlers,function(e){e.detach()}),this._handlers=[];var t=this.get(p).hide();t.get("destroyOnClose")&&t.destroy()},renderUI:function(){this.get(u).setAttribute("href",e.substitute(this.HREF_TEMPLATE,{index:this.get(l)})).set("title",this.get("label")),this._set("breadCrumbWidth",parseInt(this.get(o).getComputedStyle("width"),10))},bindUI:function(){var t=this.get(h);this._handlers.push(t.after(w,this._updateVirtualPageVisibility,this)),this._handlers.push(t.after(E,this._updateVirtualPageVisibility,this)),this._handlers.push(this.get(p).after(x,this._afterVirtualPageVisibleChange,this)),this._handlers.push(e.one(window).on(S,this._onWindowResize,this))},syncUI:function(){this.set("label",this.get("label")),this._updateVirtualPageVisibility()},focus:function(){this.get(u).focus(),O.superclass.focus.apply(this)},_afterVirtualPageVisibleChange:function(e){e.newVal&&this._updateVirtualPageDimension()},_updateVirtualPageVisibility:function(){this.get(p)[this.get("active")?"show":"hide"]()},_updateVirtualPageDimension:function(){var t=this.get(h),n,r;if(!t)return;n=t.get(o).get("offsetHeight"),r=e.UA.ipad?e.one(e.config.doc.body).get("scrollHeight"):e.DOM.winHeight(),this.get(p).set(f,r-n)},_onWindowResize:function(){this._updateVirtualPageDimension()}},{ATTRS:{active:{readOnly:!0,getter:function(){var e=this.get(h);return e?this.get(l)===e.size()-1:!1}},label:{setter:function(e){return this.get(u).setContent(e),e},validator:e.Lang.isString},breadCrumbWidth:{readOnly:!0,validator:e.Lang.isNumber},virtualPage:{writeOnce:"initOnly",setter:function(t){var n=this.get(h),r,i,s;return t instanceof e.OHP.VirtualPage?r=t:(i=e.merge(t),typeof i.srcNode=="undefined"&&typeof i.boundingBox=="undefined"&&typeof i.contentBox=="undefined"&&(typeof i.render=="undefined"||i.render===!0)&&(s=e.Node.create("<div>"),n.get("boundingBox").insert(s,"after"),i.boundingBox=s),r=new e.OHP.VirtualPage(i)),r.set("zIndex",n.get("zIndex")),r.render(),r}}}}),M=function(e){e=e||{},e.zIndex=e.zIndex||99,M.superclass.constructor.call(this,e)},M.NAME=s,e.extend(M,e.Widget,{CONTENT_TEMPLATE:"<ul></ul>",initializer:function(){this._history=new e.HistoryHash,this._history.replaceValue(k,null)},destructor:function(){this._closeFromIndex(0)},bindUI:function(){this.after(x,this._afterVisibleChange,this),this._history.on("change",this._onHistoryChange,this),this.after(w,this._afterChildAdded,this),e.one(e.config.win).on("windowresize",this._positionBreadCrumbs,this)},open:function(e,t){var n,r,i;this.show(),n=this.add({label:t||this._getBreadCrumbLabel(),virtualPage:e}),i=n.size(),i&&(r=n.item(i-1),r.focus(),this._positionBreadCrumbs())},closeActive:function(){var e=this.size()-1;this._history.replaceValue(k,e),this._closeFromIndex(e)},_afterVisibleChange:function(t){var n=e.one(e.config.doc.documentElement);t.newVal?n.addClass(v):(n.removeClass(v),L&&e.one(e.config.doc.body).addClass("cow-trigger-reflow").removeClass("cow-trigger-reflow"))},_closeFromIndex:function(e){for(var t=this.size()-1;t>=e;t-=1)this.remove(t).destroy();this._updateVisibility(),this._positionBreadCrumbs()},_getBreadCrumbLabel:function(){var e=this.size();return(e>0?this.item(e-1).get(p):this).get("pageTitle")},_updateVisibility:function(){this[this.size()>0?"show":"hide"]()},_onHistoryChange:function(t){t.src===e.HistoryHash.SRC_HASH&&(t.changed[k]?this._closeFromIndex(parseInt(t.changed[k].newVal,10)):t.removed[k]&&this._closeFromIndex(0))},_afterChildAdded:function(){this._history.addValue(k,this.size())},_positionBreadCrumbs:function(){var e=this.get(u),t=0,n=6,r;this.size()>0&&(this.each(function(e){t+=e.get("breadCrumbWidth")},this),r=parseInt(this.get(o).getComputedStyle("width"),10),e.setStyle("width",t+n),t>r?e.hasClass(b)||e.addClass(b):e.removeClass(b))}}),e.Base.mix(M,[e.WidgetParent,e.WidgetStack]),M.ATTRS=e.merge(M.ATTRS,{activeBreadCrumb:{readOnly:!0,getter:function(){return this.get("visible")?this.item(this.size()-1):null}},defaultChildType:{readOnly:!0,value:O},multiple:{readOnly:!0,value:!1},pageTitle:{valueFn:function(){var t=e.one("h1, h2");return t?t.get("text"):C},validator:
e.Lang.isString},shim:{value:!0},visible:{value:!1},zIndex:{value:99}}),_=e.namespace("OHP"),_.BreadCrumb=O,_.VirtualPage=A,_.BreadCrumbTrail=M},"7.9.0",{requires:["history","ohp-locale-translations","widget-stack","node","ohp-locale-base","event-resize","widget-stdmod","widget-child","substitute","widget","event-base","widget-parent","ohp-widget-resize-ie"]});
