/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
YAHOO.namespace("util");(function(){var a=0;var b=YAHOO.env.ua;var c="ShockwaveFlash";if(b.gecko||b.webkit||b.opera){if((mF=navigator.mimeTypes["application/x-shockwave-flash"])){if((eP=mF.enabledPlugin)){var h=[];h=eP.description.replace(/\s[rd]/g,".").replace(/[A-Za-z\s]+/g,"").split(".");a=h[0]+".";switch((h[2].toString()).length){case 1:a+="00";break;case 2:a+="0";break}a+=h[2];a=parseFloat(a)}}}else{if(b.ie){try{var d=new ActiveXObject(c+"."+c+".6");d.AllowScriptAccess="always"}catch(g){if(d!=null){a=6}}if(a==0){try{var f=new ActiveXObject(c+"."+c);var h=[];h=f.GetVariable("$version").replace(/[A-Za-z\s]+/g,"").split(",");a=h[0]+".";switch((h[2].toString()).length){case 1:a+="00";break;case 2:a+="0";break}a+=h[2];a=parseFloat(a)}catch(g){}}}}b.flash=a;YAHOO.util.SWFDetect={getFlashVersion:function(){return a},isFlashVersionAtLeast:function(e){return a>=e}}})();YAHOO.register("swfdetect",YAHOO.util.SWFDetect,{version:"2.8.2r1",build:"7"});