/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("querystring-stringify-simple",function(e,t){var n=e.namespace("QueryString"),r=encodeURIComponent;n.stringify=function(t,n){var i=[],s=n&&n.arrayKey?!0:!1,o,u,a;for(o in t)if(t.hasOwnProperty(o))if(e.Lang.isArray(t[o]))for(u=0,a=t[o].length;u<a;u++)i.push(r(s?o+"[]":o)+"="+r(t[o][u]));else i.push(r(o)+"="+r(t[o]));return i.join("&")}},"3.17.2",{requires:["yui-base"]});
