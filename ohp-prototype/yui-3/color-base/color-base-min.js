/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("color-base",function(e,t){var n=/^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})(\ufffe)?/,r=/^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})(\ufffe)?/,i=/rgba?\(([\d]{1,3}), ?([\d]{1,3}), ?([\d]{1,3}),? ?([.\d]*)?\)/,s={HEX:"hex",RGB:"rgb",RGBA:"rgba"},o={hex:"toHex",rgb:"toRGB",rgba:"toRGBA"};e.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},REGEX_HEX:n,REGEX_HEX3:r,REGEX_RGB:i,re_RGB:i,re_hex:n,re_hex3:r,STR_HEX:"#{*}{*}{*}",STR_RGB:"rgb({*}, {*}, {*})",STR_RGBA:"rgba({*}, {*}, {*}, {*})",TYPES:s,CONVERTS:o,convert:function(t,n){var r=e.Color.CONVERTS[n.toLowerCase()],i=t;return r&&e.Color[r]&&(i=e.Color[r](t)),i},toHex:function(t){var n=e.Color._convertTo(t,"hex"),r=n.toLowerCase()==="transparent";return n.charAt(0)!=="#"&&!r&&(n="#"+n),r?n.toLowerCase():n.toUpperCase()},toRGB:function(t){var n=e.Color._convertTo(t,"rgb");return n.toLowerCase()},toRGBA:function(t){var n=e.Color._convertTo(t,"rgba");return n.toLowerCase()},toArray:function(t){var n=e.Color.findType(t).toUpperCase(),r,i,s,o;return n==="HEX"&&t.length<5&&(n="HEX3"),n.charAt(n.length-1)==="A"&&(n=n.slice(0,-1)),r=e.Color["REGEX_"+n],r&&(i=r.exec(t)||[],s=i.length,s&&(i.shift(),s--,n==="HEX3"&&(i[0]+=i[0],i[1]+=i[1],i[2]+=i[2]),o=i[s-1],o||(i[s-1]=1))),i},fromArray:function(t,n){t=t.concat();if(typeof n=="undefined")return t.join(", ");var r="{*}";n=e.Color["STR_"+n.toUpperCase()],t.length===3&&n.match(/\{\*\}/g).length===4&&t.push(1);while(n.indexOf(r)>=0&&t.length>0)n=n.replace(r,t.shift());return n},findType:function(t){if(e.Color.KEYWORDS[t])return"keyword";var n=t.indexOf("("),r;return n>0&&(r=t.substr(0,n)),r&&e.Color.TYPES[r.toUpperCase()]?e.Color.TYPES[r.toUpperCase()]:"hex"},_getAlpha:function(t){var n,r=e.Color.toArray(t);return r.length>3&&(n=r.pop()),+n||1},_keywordToHex:function(t){var n=e.Color.KEYWORDS[t];if(n)return n},_convertTo:function(t,n){if(t==="transparent")return t;var r=e.Color.findType(t),i=n,s,o,u,a;return r==="keyword"&&(t=e.Color._keywordToHex(t),r="hex"),r==="hex"&&t.length<5&&(t.charAt(0)==="#"&&(t=t.substr(1)),t="#"+t.charAt(0)+t.charAt(0)+t.charAt(1)+t.charAt(1)+t.charAt(2)+t.charAt(2)),r===n?t:(r.charAt(r.length-1)==="a"&&(r=r.slice(0,-1)),s=n.charAt(n.length-1)==="a",s&&(n=n.slice(0,-1),o=e.Color._getAlpha(t)),a=n.charAt(0).toUpperCase()+n.substr(1).toLowerCase(),u=e.Color["_"+r+"To"+a],u||r!=="rgb"&&n!=="rgb"&&(t=e.Color["_"+r+"ToRgb"](t),r="rgb",u=e.Color["_"+r+"To"+a]),u&&(t=u(t,s)),s&&(e.Lang.isArray(t)||(t=e.Color.toArray(t)),t.push(o),t=e.Color.fromArray(t,i.toUpperCase())),t)},_hexToRgb:function(e,t){var n,r,i;return e.charAt(0)==="#"&&(e=e.substr(1)),e=parseInt(e,16),n=e>>16,r=e>>8&255,i=e&255,t?[n,r,i]:"rgb("+n+", "+r+", "+i+")"},_rgbToHex:function(t){var n=e.Color.toArray(t),r=n[2]|n[1]<<8|n[0]<<16;r=(+r).toString(16);while(r.length<6)r="0"+r;return"#"+r}}},"3.17.2",{requires:["yui-base"]});
