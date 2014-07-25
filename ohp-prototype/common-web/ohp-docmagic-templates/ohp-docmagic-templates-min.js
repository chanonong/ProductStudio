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
YUI.add("ohp-docmagic-templates",function(e,t){"use strict";var n=new e.Template(e.Handlebars);e.Template.register("ohp-docmagic-script-template",n.revive(function(e,t,n,r,i){function l(e,t){return"\n	var YAHOO = Y.YUI2, ORCHESTRAL = YAHOO.ORCHESTRAL;\n	"}function c(e,t){var r="",i;r+=", '', { requires: [ ",(i=n.modules)?i=i.call(e,{hash:{},data:t}):(i=e.modules,i=typeof i===u?i.apply(e):i);if(i||i===0)r+=i;return r+=" ] }",r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u="function",a=this.escapeExpression,f=this;s+="YUI.add('",(o=n.moduleName)?o=o.call(t,{hash:{},data:i}):(o=t.moduleName,o=typeof o===u?o.apply(t):o),s+=a(o)+"', function(Y) {\n	'use strict';\n\n	",o=n["if"].call(t,t.initializeGlobals,{hash:{},inverse:f.noop,fn:f.program(1,l,i),data:i});if(o||o===0)s+=o;s+="\n\n	",(o=n.scriptContent)?o=o.call(t,{hash:{},data:i}):(o=t.scriptContent,o=typeof o===u?o.apply(t):o);if(o||o===0)s+=o;s+="\n\n}",o=n["if"].call(t,t.modules,{hash:{},inverse:f.noop,fn:f.program(3,c,i),data:i});if(o||o===0)s+=o;return s+=");\n",s}))},"7.9.0",{requires:["template-base","handlebars-base"]});
