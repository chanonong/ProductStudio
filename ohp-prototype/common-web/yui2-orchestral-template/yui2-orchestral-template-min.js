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
YUI.add("yui2-orchestral-template",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.util"),function(){var e=n.lang,t=n.util.Dom,i=n.util.Event,s=r.util.Registry,o=function(n,i){o.superclass.constructor.call(this,n,i);var s=t.getFirstChildBy(this.get("element"),function(e){return t.hasClass(e,"template")});if(e.isNull(s))return;this._template=s.cloneNode(!0),this.removeChild(s),t.removeClass(t.getChildren(this.get("element")),"template");if(r.env.ua.ie==8){var u=t.getAncestorByClassName(this.get("element"),"repeating-list");if(u){var a=function(){t.removeClass(u,"repeating-list"),t.addClass(u,"repeating-list")};this.subscribe("add",a,null,this),this.subscribe("remove",a,null,this)}}};e.extend(o,n.util.Element,{initAttributes:function(n){o.superclass.initAttributes.call(this,n),this.setAttributeConfig("repeatInitHandler",{writeOnce:!0,validator:e.isFunction,method:function(n){this.on("add",function(e){n(e.element,e.index)});var r=t.getChildrenBy(this.get("element"),function(t){return e.isNumber(Number(t.getAttribute("repeat")))});for(var i=0;i<r.length;i++)n(r[i],Number(r[i].getAttribute("repeat")))}})},destroy:function(){i.purgeElement(this.get("element"),!0)},_template:null,add:function(){if(e.isNull(this._template))return;var n=t.getChildren(this.get("element")).length?Number(t.getLastChild(this.get("element")).getAttribute("repeat"))+1:0,r=this.get("element").appendChild(this._template.cloneNode(!0));r.innerHTML=e.substitute(r.innerHTML,{index:+n}),r.setAttribute("repeat",n),t.replaceClass(r,"template","template-repeat"),this.fireEvent("add",{element:r,index:n})},remove:function(e){e=t.get(e),this.removeChild(e),i.purgeElement(e,!0),this.fireEvent("remove",{element:e})}}),r.util.Template=o}(),n.register("orchestral-template",r.util.Template,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui2-dom","yui2-event","yui2-element","yui2-orchestral"]});
