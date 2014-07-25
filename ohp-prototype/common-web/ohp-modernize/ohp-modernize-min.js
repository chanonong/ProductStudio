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
YUI.add("ohp-modernize",function(e,t){"use strict";var n=e.config.doc,r=function(){return!0},i=function(t){if(Modernizr.input.placeholder)return;e.use("ohp-placeholder",function(){t.all("input[type=text][placeholder],textarea[placeholder]").each(function(t){t.hasPlugin(e.OHP.PlaceholderPlugin)||t.plug(e.OHP.PlaceholderPlugin)})})},s;e.namespace("OHP").ModernizePlugin=e.Base.create("ModernizePlugin",e.Plugin.Base,[],{initializer:function(){var t=e.OHP.Modernize,n=this.get("host"),i=e.Node.getDOMNode(n).tagName;if(i==="INPUT")return;this.afterHostMethod("setContent",function(){t.modernize(n.get("parentNode"))}),this.afterHostMethod("setHTML",function(){t.modernize(n.get("parentNode"))}),this.afterHostMethod("set",function(e){e==="innerHTML"&&t.modernize(n.get("parentNode"))}),this.afterHostMethod("insert",function(e,i){switch(i){case"replace":t.modernize(n.get("parentNode"));break;case"before":t.modernize(n.previous(r));break;case"after":t.modernize(n.next(r));break;default:t.modernize(n)}})}},{NS:"modernize",ATTRS:{}}),s=function(){},s.prototype={_modernizrs:{placeholder:function(t){i(t?t:e.one(n.body))}},modernize:function(t,r){t=t?t:e.one(n.body),r=r?r:["placeholder"],e.each(r,function(e){this._modernizrs[e](t)},this)},removePlaceholders:function(){}},e.namespace("OHP").Modernize=new s,e.on("domready",function(){var t=e.one(n.body);i(t),e.Node.plug(e.OHP.ModernizePlugin)})},"7.9.0",{requires:["node","base-build","plugin"]});
