/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function(){var a=YAHOO.util.Event,b=[],c={mouseenter:true,mouseleave:true};YAHOO.lang.augmentObject(YAHOO.util.Element.prototype,{delegate:function(j,l,f,h,i){if(YAHOO.lang.isString(f)&&!YAHOO.util.Selector){return false;}if(!a._createDelegate){return false;}var e=a._getType(j),g=this.get("element"),m,k,d=function(n){return m.call(g,n);};if(c[j]){if(!a._createMouseDelegate){return false;}k=a._createMouseDelegate(l,h,i);m=a._createDelegate(function(p,o,n){return k.call(o,p,n);},f,h,i);}else{m=a._createDelegate(l,f,h,i);}b.push([g,e,l,d]);return this.on(e,d);},removeDelegate:function(h,g){var i=a._getType(h),e=a._getCacheIndex(b,this.get("element"),i,g),f,d;if(e>=0){d=b[e];}if(d){f=this.removeListener(d[1],d[3]);if(f){delete b[e][2];delete b[e][3];b.splice(e,1);}}return f;}});}());YAHOO.register("element-delegate",YAHOO.util.Element,{version:"2.8.2r1",build:"7"});