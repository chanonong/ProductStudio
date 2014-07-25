/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function(){var b=YAHOO.util,c=b.Dom,h=b.Event,f=window.document,j="active",d="activeIndex",e="activeTab",a="contentEl",g="element",i=function(l,k){k=k||{};if(arguments.length==1&&!YAHOO.lang.isString(l)&&!l.nodeName){k=l;l=k.element||null;}if(!l&&!k.element){l=this._createTabViewElement(k);}i.superclass.constructor.call(this,l,k);};YAHOO.extend(i,b.Element,{CLASSNAME:"yui-navset",TAB_PARENT_CLASSNAME:"yui-nav",CONTENT_PARENT_CLASSNAME:"yui-content",_tabParent:null,_contentParent:null,addTab:function(p,l){var n=this.get("tabs"),q=this.getTab(l),r=this._tabParent,k=this._contentParent,m=p.get(g),o=p.get(a);if(!n){this._queue[this._queue.length]=["addTab",arguments];return false;}l=(l===undefined)?n.length:l;n.splice(l,0,p);if(q){r.insertBefore(m,q.get(g));}else{r.appendChild(m);}if(o&&!c.isAncestor(k,o)){k.appendChild(o);}if(!p.get(j)){p.set("contentVisible",false,true);}else{this.set(e,p,true);this.set("activeIndex",l,true);}this._initTabEvents(p);},_initTabEvents:function(k){k.addListener(k.get("activationEvent"),k._onActivate,this,k);k.addListener(k.get("activationEventChange"),k._onActivationEventChange,this,k);},_removeTabEvents:function(k){k.removeListener(k.get("activationEvent"),k._onActivate,this,k);k.removeListener("activationEventChange",k._onActivationEventChange,this,k);},DOMEventHandler:function(p){var q=h.getTarget(p),s=this._tabParent,r=this.get("tabs"),m,l,k;if(c.isAncestor(s,q)){for(var n=0,o=r.length;n<o;n++){l=r[n].get(g);k=r[n].get(a);if(q==l||c.isAncestor(l,q)){m=r[n];break;}}if(m){m.fireEvent(p.type,p);}}},getTab:function(k){return this.get("tabs")[k];},getTabIndex:function(o){var l=null,n=this.get("tabs");for(var m=0,k=n.length;m<k;++m){if(o==n[m]){l=m;break;}}return l;},removeTab:function(m){var l=this.get("tabs").length,k=this.getTabIndex(m);if(m===this.get(e)){if(l>1){if(k+1===l){this.set(d,k-1);}else{this.set(d,k+1);}}else{this.set(e,null);}}this._removeTabEvents(m);this._tabParent.removeChild(m.get(g));this._contentParent.removeChild(m.get(a));this._configs.tabs.value.splice(k,1);m.fireEvent("remove",{type:"remove",tabview:this});},toString:function(){var k=this.get("id")||this.get("tagName");return"TabView "+k;},contentTransition:function(l,k){if(l){l.set("contentVisible",true);}if(k){k.set("contentVisible",false);}},initAttributes:function(k){i.superclass.initAttributes.call(this,k);if(!k.orientation){k.orientation="top";}var m=this.get(g);if(!c.hasClass(m,this.CLASSNAME)){c.addClass(m,this.CLASSNAME);}this.setAttributeConfig("tabs",{value:[],readOnly:true});this._tabParent=this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,"ul")[0]||this._createTabParent();this._contentParent=this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,"div")[0]||this._createContentParent();this.setAttributeConfig("orientation",{value:k.orientation,method:function(n){var o=this.get("orientation");this.addClass("yui-navset-"+n);if(o!=n){this.removeClass("yui-navset-"+o);}if(n==="bottom"){this.appendChild(this._tabParent);}}});this.setAttributeConfig(d,{value:k.activeIndex,validator:function(o){var n=true;if(o&&this.getTab(o).get("disabled")){n=false;}return n;}});this.setAttributeConfig(e,{value:k.activeTab,method:function(o){var n=this.get(e);if(o){o.set(j,true);}if(n&&n!==o){n.set(j,false);}if(n&&o!==n){this.contentTransition(o,n);}else{if(o){o.set("contentVisible",true);}}},validator:function(o){var n=true;if(o&&o.get("disabled")){n=false;}return n;}});this.on("activeTabChange",this._onActiveTabChange);this.on("activeIndexChange",this._onActiveIndexChange);if(this._tabParent){this._initTabs();}this.DOM_EVENTS.submit=false;this.DOM_EVENTS.focus=false;this.DOM_EVENTS.blur=false;for(var l in this.DOM_EVENTS){if(YAHOO.lang.hasOwnProperty(this.DOM_EVENTS,l)){this.addListener.call(this,l,this.DOMEventHandler);}}},deselectTab:function(k){if(this.getTab(k)===this.get("activeTab")){this.set("activeTab",null);}},selectTab:function(k){this.set("activeTab",this.getTab(k));},_onActiveTabChange:function(m){var k=this.get(d),l=this.getTabIndex(m.newValue);if(k!==l){if(!(this.set(d,l))){this.set(e,m.prevValue);}}},_onActiveIndexChange:function(k){if(k.newValue!==this.getTabIndex(this.get(e))){if(!(this.set(e,this.getTab(k.newValue)))){this.set(d,k.prevValue);}}},_initTabs:function(){var p=c.getChildren(this._tabParent),n=c.getChildren(this._contentParent),m=this.get(d),q,l,r;for(var o=0,k=p.length;o<k;++o){l={};if(n[o]){l.contentEl=n[o];}q=new YAHOO.widget.Tab(p[o],l);this.addTab(q);if(q.hasClass(q.ACTIVE_CLASSNAME)){r=q;}}if(m){this.set(e,this.getTab(m));}else{this._configs.activeTab.value=r;this._configs.activeIndex.value=this.getTabIndex(r);}},_createTabViewElement:function(k){var l=f.createElement("div");if(this.CLASSNAME){l.className=this.CLASSNAME;}return l;},_createTabParent:function(k){var l=f.createElement("ul");if(this.TAB_PARENT_CLASSNAME){l.className=this.TAB_PARENT_CLASSNAME;}this.get(g).appendChild(l);return l;},_createContentParent:function(k){var l=f.createElement("div");if(this.CONTENT_PARENT_CLASSNAME){l.className=this.CONTENT_PARENT_CLASSNAME;}this.get(g).appendChild(l);return l;}});YAHOO.widget.TabView=i;})();(function(){var d=YAHOO.util,i=d.Dom,l=YAHOO.lang,m="activeTab",j="label",g="labelEl",q="content",c="contentEl",o="element",p="cacheData",b="dataSrc",h="dataLoaded",a="dataTimeout",n="loadMethod",f="postData",k="disabled",e=function(s,r){r=r||{};if(arguments.length==1&&!l.isString(s)&&!s.nodeName){r=s;s=r.element;}if(!s&&!r.element){s=this._createTabElement(r);}this.loadHandler={success:function(t){this.set(q,t.responseText);},failure:function(t){}};e.superclass.constructor.call(this,s,r);this.DOM_EVENTS={};};YAHOO.extend(e,YAHOO.util.Element,{LABEL_TAGNAME:"em",ACTIVE_CLASSNAME:"selected",HIDDEN_CLASSNAME:"yui-hidden",ACTIVE_TITLE:"active",DISABLED_CLASSNAME:k,LOADING_CLASSNAME:"loading",dataConnection:null,loadHandler:null,_loading:false,toString:function(){var r=this.get(o),s=r.id||r.tagName;return"Tab "+s;},initAttributes:function(r){r=r||{};e.superclass.initAttributes.call(this,r);this.setAttributeConfig("activationEvent",{value:r.activationEvent||"click"});this.setAttributeConfig(g,{value:r[g]||this._getLabelEl(),method:function(s){s=i.get(s);var t=this.get(g);if(t){if(t==s){return false;}t.parentNode.replaceChild(s,t);this.set(j,s.innerHTML);}}});this.setAttributeConfig(j,{value:r.label||this._getLabel(),method:function(t){var s=this.get(g);if(!s){this.set(g,this._createLabelEl());}s.innerHTML=t;}});this.setAttributeConfig(c,{value:r[c]||document.createElement("div"),method:function(s){s=i.get(s);var t=this.get(c);if(t){if(t===s){return false;}if(!this.get("selected")){i.addClass(s,this.HIDDEN_CLASSNAME);}t.parentNode.replaceChild(s,t);this.set(q,s.innerHTML);}}});this.setAttributeConfig(q,{value:r[q],method:function(s){this.get(c).innerHTML=s;}});this.setAttributeConfig(b,{value:r.dataSrc});this.setAttributeConfig(p,{value:r.cacheData||false,validator:l.isBoolean});this.setAttributeConfig(n,{value:r.loadMethod||"GET",validator:l.isString});this.setAttributeConfig(h,{value:false,validator:l.isBoolean,writeOnce:true});this.setAttributeConfig(a,{value:r.dataTimeout||null,validator:l.isNumber});this.setAttributeConfig(f,{value:r.postData||null});this.setAttributeConfig("active",{value:r.active||this.hasClass(this.ACTIVE_CLASSNAME),method:function(s){if(s===true){this.addClass(this.ACTIVE_CLASSNAME);this.set("title",this.ACTIVE_TITLE);}else{this.removeClass(this.ACTIVE_CLASSNAME);this.set("title","");}},validator:function(s){return l.isBoolean(s)&&!this.get(k);}});this.setAttributeConfig(k,{value:r.disabled||this.hasClass(this.DISABLED_CLASSNAME),method:function(s){if(s===true){i.addClass(this.get(o),this.DISABLED_CLASSNAME);}else{i.removeClass(this.get(o),this.DISABLED_CLASSNAME);}},validator:l.isBoolean});this.setAttributeConfig("href",{value:r.href||this.getElementsByTagName("a")[0].getAttribute("href",2)||"#",method:function(s){this.getElementsByTagName("a")[0].href=s;},validator:l.isString});this.setAttributeConfig("contentVisible",{value:r.contentVisible,method:function(s){if(s){i.removeClass(this.get(c),this.HIDDEN_CLASSNAME);if(this.get(b)){if(!this._loading&&!(this.get(h)&&this.get(p))){this._dataConnect();}}}else{i.addClass(this.get(c),this.HIDDEN_CLASSNAME);}},validator:l.isBoolean});},_dataConnect:function(){if(!d.Connect){return false;}i.addClass(this.get(c).parentNode,this.LOADING_CLASSNAME);this._loading=true;this.dataConnection=d.Connect.asyncRequest(this.get(n),this.get(b),{success:function(r){this.loadHandler.success.call(this,r);this.set(h,true);this.dataConnection=null;i.removeClass(this.get(c).parentNode,this.LOADING_CLASSNAME);this._loading=false;},failure:function(r){this.loadHandler.failure.call(this,r);this.dataConnection=null;i.removeClass(this.get(c).parentNode,this.LOADING_CLASSNAME);this._loading=false;},scope:this,timeout:this.get(a)},this.get(f));},_createTabElement:function(r){var v=document.createElement("li"),s=document.createElement("a"),u=r.label||null,t=r.labelEl||null;s.href=r.href||"#";v.appendChild(s);if(t){if(!u){u=this._getLabel();}}else{t=this._createLabelEl();}s.appendChild(t);return v;},_getLabelEl:function(){return this.getElementsByTagName(this.LABEL_TAGNAME)[0];},_createLabelEl:function(){var r=document.createElement(this.LABEL_TAGNAME);return r;},_getLabel:function(){var r=this.get(g);if(!r){return undefined;}return r.innerHTML;},_onActivate:function(u,t){var s=this,r=false;d.Event.preventDefault(u);if(s===t.get(m)){r=true;}t.set(m,s,r);},_onActivationEventChange:function(s){var r=this;if(s.prevValue!=s.newValue){r.removeListener(s.prevValue,r._onActivate);r.addListener(s.newValue,r._onActivate,this,r);}}});YAHOO.widget.Tab=e;})();YAHOO.register("tabview",YAHOO.widget.TabView,{version:"2.8.2r1",build:"7"});