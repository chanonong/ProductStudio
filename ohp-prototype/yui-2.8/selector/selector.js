/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function(){var a=YAHOO.util;a.Selector={_foundCache:[],_regexCache:{},_re:{nth:/^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/,attr:/(\[.*\])/g,urls:/^(?:href|src)/},document:window.document,attrAliases:{},shorthand:{"\\#(-?[_a-z]+[-\\w]*)":"[id=$1]","\\.(-?[_a-z]+[-\\w]*)":"[class~=$1]"},operators:{"=":function(b,c){return b===c},"!=":function(b,c){return b!==c},"~=":function(b,d){var c=" ";return(c+b+c).indexOf((c+d+c))>-1},"|=":function(b,c){return b===c||b.slice(0,c.length+1)===c+"-"},"^=":function(b,c){return b.indexOf(c)===0},"$=":function(b,c){return b.slice(-c.length)===c},"*=":function(b,c){return b.indexOf(c)>-1},"":function(b,c){return b}},pseudos:{root:function(b){return b===b.ownerDocument.documentElement},"nth-child":function(b,c){return a.Selector._getNth(b,c)},"nth-last-child":function(b,c){return a.Selector._getNth(b,c,null,true)},"nth-of-type":function(b,c){return a.Selector._getNth(b,c,b.tagName)},"nth-last-of-type":function(b,c){return a.Selector._getNth(b,c,b.tagName,true)},"first-child":function(b){return a.Selector._getChildren(b.parentNode)[0]===b},"last-child":function(c){var b=a.Selector._getChildren(c.parentNode);return b[b.length-1]===c},"first-of-type":function(b,c){return a.Selector._getChildren(b.parentNode,b.tagName)[0]},"last-of-type":function(c,d){var b=a.Selector._getChildren(c.parentNode,c.tagName);return b[b.length-1]},"only-child":function(c){var b=a.Selector._getChildren(c.parentNode);return b.length===1&&b[0]===c},"only-of-type":function(b){return a.Selector._getChildren(b.parentNode,b.tagName).length===1},empty:function(b){return b.childNodes.length===0},not:function(b,c){return !a.Selector.test(b,c)},contains:function(b,d){var c=b.innerText||b.textContent||"";return c.indexOf(d)>-1},checked:function(b){return b.checked===true}},test:function(f,d){f=a.Selector.document.getElementById(f)||f;if(!f){return false}var c=d?d.split(","):[];if(c.length){for(var e=0,b=c.length;e<b;++e){if(a.Selector._test(f,c[e])){return true}}return false}return a.Selector._test(f,d)},_test:function(d,g,f,e){f=f||a.Selector._tokenize(g).pop()||{};if(!d.tagName||(f.tag!=="*"&&d.tagName!==f.tag)||(e&&d._found)){return false}if(f.attributes.length){var b,h,c=a.Selector._re.urls;if(!d.attributes||!d.attributes.length){return false}for(var j=0,l;l=f.attributes[j++];){h=(c.test(l[0]))?2:0;b=d.getAttribute(l[0],h);if(b===null||b===undefined){return false}if(a.Selector.operators[l[1]]&&!a.Selector.operators[l[1]](b,l[2])){return false}}}if(f.pseudos.length){for(var j=0,k=f.pseudos.length;j<k;++j){if(a.Selector.pseudos[f.pseudos[j][0]]&&!a.Selector.pseudos[f.pseudos[j][0]](d,f.pseudos[j][1])){return false}}}return(f.previous&&f.previous.combinator!==",")?a.Selector._combinators[f.previous.combinator](d,f):true},filter:function(e,d){e=e||[];var g,c=[],h=a.Selector._tokenize(d);if(!e.item){for(var f=0,b=e.length;f<b;++f){if(!e[f].tagName){g=a.Selector.document.getElementById(e[f]);if(g){e[f]=g}else{}}}}c=a.Selector._filter(e,a.Selector._tokenize(d)[0]);return c},_filter:function(e,g,h,d){var c=h?null:[],j=a.Selector._foundCache;for(var f=0,b=e.length;f<b;f++){if(!a.Selector._test(e[f],"",g,d)){continue}if(h){return e[f]}if(d){if(e[f]._found){continue}e[f]._found=true;j[j.length]=e[f]}c[c.length]=e[f]}return c},query:function(c,d,e){var b=a.Selector._query(c,d,e);return b},_query:function(h,n,o,f){var q=(o)?null:[],e;if(!h){return q}var d=h.split(",");if(d.length>1){var p;for(var j=0,k=d.length;j<k;++j){p=a.Selector._query(d[j],n,o,true);q=o?p:q.concat(p)}a.Selector._clearFoundCache();return q}if(n&&!n.nodeName){n=a.Selector.document.getElementById(n);if(!n){return q}}n=n||a.Selector.document;if(n.nodeName!=="#document"){a.Dom.generateId(n);h=n.tagName+"#"+n.id+" "+h;e=n;n=n.ownerDocument}var m=a.Selector._tokenize(h);var l=m[a.Selector._getIdTokenIndex(m)],b=[],c,g=m.pop()||{};if(l){c=a.Selector._getId(l.attributes)}if(c){e=e||a.Selector.document.getElementById(c);if(e&&(n.nodeName==="#document"||a.Dom.isAncestor(n,e))){if(a.Selector._test(e,null,l)){if(l===g){b=[e]}else{if(l.combinator===" "||l.combinator===">"){n=e}}}}else{return q}}if(n&&!b.length){b=n.getElementsByTagName(g.tag)}if(b.length){q=a.Selector._filter(b,g,o,f)}return q},_clearFoundCache:function(){var f=a.Selector._foundCache;for(var c=0,b=f.length;c<b;++c){try{delete f[c]._found}catch(d){f[c].removeAttribute("_found")}}f=[]},_getRegExp:function(d,b){var c=a.Selector._regexCache;b=b||"";if(!c[d+b]){c[d+b]=new RegExp(d,b)}return c[d+b]},_getChildren:function(){if(document.documentElement.children&&document.documentElement.children.tags){return function(c,b){return(b)?c.children.tags(b):c.children||[]}}else{return function(f,c){var e=[],g=f.childNodes;for(var d=0,b=g.length;d<b;++d){if(g[d].tagName){if(!c||g[d].tagName===c){e.push(g[d])}}}return e}}}(),_combinators:{" ":function(c,b){while((c=c.parentNode)){if(a.Selector._test(c,"",b.previous)){return true}}return false},">":function(c,b){return a.Selector._test(c.parentNode,null,b.previous)},"+":function(d,c){var b=d.previousSibling;while(b&&b.nodeType!==1){b=b.previousSibling}if(b&&a.Selector._test(b,null,c.previous)){return true}return false},"~":function(d,c){var b=d.previousSibling;while(b){if(b.nodeType===1&&a.Selector._test(b,null,c.previous)){return true}b=b.previousSibling}return false}},_getNth:function(d,o,q,h){a.Selector._re.nth.test(o);var m=parseInt(RegExp.$1,10),c=RegExp.$2,j=RegExp.$3,k=parseInt(RegExp.$4,10)||0,p=[],f;var l=a.Selector._getChildren(d.parentNode,q);if(j){m=2;f="+";c="n";k=(j==="odd")?1:0}else{if(isNaN(m)){m=(c)?1:0}}if(m===0){if(h){k=l.length-k+1}if(l[k-1]===d){return true}else{return false}}else{if(m<0){h=!!h;m=Math.abs(m)}}if(!h){for(var e=k-1,g=l.length;e<g;e+=m){if(e>=0&&l[e]===d){return true}}}else{for(var e=l.length-k,g=l.length;e>=0;e-=m){if(e<g&&l[e]===d){return true}}}return false},_getId:function(c){for(var d=0,b=c.length;d<b;++d){if(c[d][0]=="id"&&c[d][1]==="="){return c[d][2]}}},_getIdTokenIndex:function(d){for(var c=0,b=d.length;c<b;++c){if(a.Selector._getId(d[c].attributes)){return c}}return -1},_patterns:{tag:/^((?:-?[_a-z]+[\w-]*)|\*)/i,attributes:/^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,pseudos:/^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,combinator:/^\s*([>+~]|\s)\s*/},_tokenize:function(b){var d={},h=[],i,g=false,f=a.Selector._patterns,c;b=a.Selector._replaceShorthand(b);do{g=false;for(var e in f){if(YAHOO.lang.hasOwnProperty(f,e)){if(e!="tag"&&e!="combinator"){d[e]=d[e]||[]}if((c=f[e].exec(b))){g=true;if(e!="tag"&&e!="combinator"){if(e==="attributes"&&c[1]==="id"){d.id=c[3]}d[e].push(c.slice(1))}else{d[e]=c[1]}b=b.replace(c[0],"");if(e==="combinator"||!b.length){d.attributes=a.Selector._fixAttributes(d.attributes);d.pseudos=d.pseudos||[];d.tag=d.tag?d.tag.toUpperCase():"*";h.push(d);d={previous:d}}}}}}while(g);return h},_fixAttributes:function(c){var d=a.Selector.attrAliases;c=c||[];for(var e=0,b=c.length;e<b;++e){if(d[c[e][0]]){c[e][0]=d[c[e][0]]}if(!c[e][1]){c[e][1]=""}}return c},_replaceShorthand:function(c){var d=a.Selector.shorthand;var e=c.match(a.Selector._re.attr);if(e){c=c.replace(a.Selector._re.attr,"REPLACED_ATTRIBUTE")}for(var g in d){if(YAHOO.lang.hasOwnProperty(d,g)){c=c.replace(a.Selector._getRegExp(g,"gi"),d[g])}}if(e){for(var f=0,b=e.length;f<b;++f){c=c.replace("REPLACED_ATTRIBUTE",e[f])}}return c}};if(YAHOO.env.ua.ie&&YAHOO.env.ua.ie<8){a.Selector.attrAliases["class"]="className";a.Selector.attrAliases["for"]="htmlFor"}})();YAHOO.register("selector",YAHOO.util.Selector,{version:"2.8.2r1",build:"7"});