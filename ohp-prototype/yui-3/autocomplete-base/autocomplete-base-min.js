/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("autocomplete-base",function(e,t){function T(){}var n=e.Escape,r=e.Lang,i=e.Array,s=e.Object,o=r.isFunction,u=r.isString,a=r.trim,f=e.Attribute.INVALID_VALUE,l="_functionValidator",c="_sourceSuccess",h="allowBrowserAutocomplete",p="inputNode",d="query",v="queryDelimiter",m="requestTemplate",g="results",y="resultListLocator",b="value",w="valueChange",E="clear",S=d,x=g;T.prototype={initializer:function(){e.before(this._bindUIACBase,this,"bindUI"),e.before(this._syncUIACBase,this,"syncUI"),this.publish(E,{defaultFn:this._defClearFn}),this.publish(S,{defaultFn:this._defQueryFn}),this.publish(x,{defaultFn:this._defResultsFn})},destructor:function(){this._acBaseEvents&&this._acBaseEvents.detach(),delete this._acBaseEvents,delete this._cache,delete this._inputNode,delete this._rawSource},clearCache:function(){return this._cache&&(this._cache={}),this},sendRequest:function(t,n){var r,i=this.get("source");return t||t===""?this._set(d,t):t=this.get(d)||"",i&&(n||(n=this.get(m)),r=n?n.call(this,t):t,i.sendRequest({query:t,request:r,callback:{success:e.bind(this._onResponse,this,t)}})),this},_bindUIACBase:function(){var t=this.get(p),n=t&&t.tokenInput;n&&(t=n.get(p),this._set("tokenInput",n));if(!t){e.error("No inputNode specified.");return}this._inputNode=t,this._acBaseEvents=new e.EventHandle([t.on(w,this._onInputValueChange,this),t.on("blur",this._onInputBlur,this),this.after(h+"Change",this._syncBrowserAutocomplete),this.after("sourceTypeChange",this._afterSourceTypeChange),this.after(w,this._afterValueChange)])},_syncUIACBase:function(){this._syncBrowserAutocomplete(),this.set(b,this.get(p).get(b))},_createArraySource:function(e){var t=this;return{type:"array",sendRequest:function(n){t[c](e.concat(),n)}}},_createFunctionSource:function(e){var t=this;return{type:"function",sendRequest:function(n){function i(e){t[c](e||[],n)}var r;(r=e(n.query,i))&&i(r)}}},_createObjectSource:function(e){var t=this;return{type:"object",sendRequest:function(n){var r=n.query;t[c](s.owns(e,r)?e[r]:[],n)}}},_functionValidator:function(e){return e===null||o(e)},_getObjectValue:function(e,t){if(!e)return;for(var n=0,r=t.length;e&&n<r;n++)e=e[t[n]];return e},_parseResponse:function(e,t,r){var i={data:r,query:e,results:[]},s=this.get(y),o=[],u=t&&t.results,a,f,l,c,h,p,d,v,m,g,b;u&&s&&(u=s.call(this,u));if(u&&u.length){a=this.get("resultFilters"),b=this.get("resultTextLocator");for(p=0,d=u.length;p<d;++p)m=u[p],g=b?b.call(this,m):m.toString(),o.push({display:n.html(g),raw:m,text:g});for(p=0,d=a.length;p<d;++p){o=a[p].call(this,e,o.concat());if(!o)return;if(!o.length)break}if(o.length){l=this.get("resultFormatter"),h=this.get("resultHighlighter"),v=this.get("maxResults"),v&&v>0&&o.length>v&&(o.length=v);if(h){c=h.call(this,e,o.concat());if(!c)return;for(p=0,d=c.length;p<d;++p)m=o[p],m.highlighted=c[p],m.display=m.highlighted}if(l){f=l.call(this,e,o.concat());if(!f)return;for(p=0,d=f.length;p<d;++p)o[p].display=f[p]}}}i.results=o,this.fire(x,i)},_parseValue:function(e){var t=this.get(v);return t&&(e=e.split(t),e=e[e.length-1]),r.trimLeft(e)},_setEnableCache:function(e){this._cache=e?{}:null},_setLocator:function(e){if(this[l](e))return e;var t=this;return e=e.toString().split("."),function(n){return n&&t._getObjectValue(n,e)}},_setRequestTemplate:function(e){return this[l](e)?e:(e=e.toString(),function(t){return r.sub(e,{query:encodeURIComponent(t)})})},_setResultFilters:function(t){var n,s;return t===null?[]:(n=e.AutoCompleteFilters,s=function(e){return o(e)?e:u(e)&&n&&o(n[e])?n[e]:!1},r.isArray(t)?(t=i.map(t,s),i.every(t,function(e){return!!e})?t:f):(t=s(t),t?[t]:f))},_setResultHighlighter:function(t){var n;return this[l](t)?t:(n=e.AutoCompleteHighlighters,u(t)&&n&&o(n[t])?n[t]:f)},_setSource:function(t){var n=this.get("sourceType")||r.type(t),i;return t&&o(t.sendRequest)||t===null||n==="datasource"?(this._rawSource=t,t):(i=T.SOURCE_TYPES[n])?(this._rawSource=t,r.isString(i)?this[i](t):i(t)):(e.error("Unsupported source type '"+n+"'. Maybe autocomplete-sources isn't loaded?"),f)},_sourceSuccess:function(e,t){t.callback.success({data:e,response:{results:e}})},_syncBrowserAutocomplete:function(){var e=this.get(p);e.get("nodeName").toLowerCase()==="input"&&e.setAttribute("autocomplete",this.get(h)?"on":"off")},_updateValue:function(e){var t=this.get(v),n,s,o;e=r.trimLeft(e),t&&(n=a(t),o=i.map(a(this.get(b)).split(t),a),s=o.length,s>1&&(o[s-1]=e,e=o.join(n+" ")),e=e+n+" "),this.set(b,e)},_afterSourceTypeChange:function(e){this._rawSource&&this.set("source",this._rawSource)},_afterValueChange:function(e){var t=e.newVal,n=this,r=e.src===T.UI_SRC,i,s,o,u;r||n._inputNode.set(b,t),o=n.get("minQueryLength"),u=n._parseValue(t)||"",o>=0&&u.length>=o?r?(i=n.get("queryDelay"),s=function(){n.fire(S,{inputValue:t,query:u,src:e.src})},i?(clearTimeout(n._delay),n._delay=setTimeout(s,i)):s()):n._set(d,u):(clearTimeout(n._delay),n.fire(E,{prevVal:e.prevVal?n._parseValue(e.prevVal):null,src:e.src}))},_onInputBlur:function(e){var t=this.get(v),n,i,s;if(t&&!this.get("allowTrailingDelimiter")){t=r.trimRight(t),s=i=this._inputNode.get(b);if(t)while((i=r.trimRight(i))&&(n=i.length-t.length)&&i.lastIndexOf(t)===n)i=i.substring(0,n);else i=r.trimRight(i);i!==s&&this.set(b,i)}},_onInputValueChange:function(e){var t=e.newVal;t!==this.get(b)&&this.set(b,t,{src:T.UI_SRC})},_onResponse:function(e,t){e===(this.get(d)||"")&&this._parseResponse(e||"",t.response,t.data)},_defClearFn:function(){this._set(d,null),this._set(g,[])},_defQueryFn:function(e){this.sendRequest(e.query)},_defResultsFn:function(e){this._set(g,e[g])}},T.ATTRS={allowBrowserAutocomplete:{value:!1},allowTrailingDelimiter:{value:!1},enableCache:{lazyAdd:!1,setter:"_setEnableCache",value:!0},inputNode:{setter:e.one,writeOnce:"initOnly"},maxResults:{value:0},minQueryLength:{value:1},query:{readOnly:!0,value:null},queryDelay:{value:100},queryDelimiter:{value:null},requestTemplate:{setter:"_setRequestTemplate",value:null},resultFilters:{setter:"_setResultFilters",value:[]},resultFormatter
:{validator:l,value:null},resultHighlighter:{setter:"_setResultHighlighter",value:null},resultListLocator:{setter:"_setLocator",value:null},results:{readOnly:!0,value:[]},resultTextLocator:{setter:"_setLocator",value:null},source:{setter:"_setSource",value:null},sourceType:{value:null},tokenInput:{readOnly:!0},value:{value:""}},T._buildCfg={aggregates:["SOURCE_TYPES"],statics:["UI_SRC"]},T.SOURCE_TYPES={array:"_createArraySource","function":"_createFunctionSource",object:"_createObjectSource"},T.UI_SRC=e.Widget&&e.Widget.UI_SRC||"ui",e.AutoCompleteBase=T},"3.17.2",{optional:["autocomplete-sources"],requires:["array-extras","base-build","escape","event-valuechange","node-base"]});
