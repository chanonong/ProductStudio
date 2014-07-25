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
YUI.add("ohp-dropdown-menu-templates",function(e,t){"use strict";var n=new e.Template(e.Handlebars);e.Template.register("ohp-dropdown-menu-item-template",n.revive(function(e,t,n,r,i){function c(e,t){var r="",i;return r+='target="',(i=n.target)?i=i.call(e,{hash:{},data:t}):(i=e.target,i=typeof i===a?i.apply(e):i),r+=f(i)+'"',r}function h(e,t){var r="",i;r+="\n			",(i=n.labelHtml)?i=i.call(e,{hash:{},data:t}):(i=e.labelHtml,i=typeof i===a?i.apply(e):i);if(i||i===0)r+=i;return r+="\n		",r}function p(e,t){var r="",i;return r+="\n			",(i=n.label)?i=i.call(e,{hash:{},data:t}):(i=e.label,i=typeof i===a?i.apply(e):i),r+=f(i)+"\n		",r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u,a="function",f=this.escapeExpression,l=this;s+='<li class="'+f((o=(o=t.classNames,o==null||o===!1?o:o.item),typeof o===a?o.apply(t):o))+'" data-'+f((o=(o=t.dataAttrNames,o==null||o===!1?o:o.itemIndex),typeof o===a?o.apply(t):o))+'="',(u=n.index)?u=u.call(t,{hash:{},data:i}):(u=t.index,u=typeof u===a?u.apply(t):u),s+=f(u)+'" role="presentation">\n	<a href="',(u=n.href)?u=u.call(t,{hash:{},data:i}):(u=t.href,u=typeof u===a?u.apply(t):u),s+=f(u)+'"\n		class="'+f((o=(o=t.classNames,o==null||o===!1?o:o.itemContent),typeof o===a?o.apply(t):o))+'"\n		data-'+f((o=(o=t.dataAttrNames,o==null||o===!1?o:o.itemId),typeof o===a?o.apply(t):o))+'="',(u=n.id)?u=u.call(t,{hash:{},data:i}):(u=t.id,u=typeof u===a?u.apply(t):u),s+=f(u)+'"\n		role="menuitem"\n		',u=n["if"].call(t,t.target,{hash:{},inverse:l.noop,fn:l.program(1,c,i),data:i});if(u||u===0)s+=u;s+=">\n		",u=n["if"].call(t,t.labelHtml,{hash:{},inverse:l.program(5,p,i),fn:l.program(3,h,i),data:i});if(u||u===0)s+=u;return s+="\n	</a>\n</li>\n",s}))},"7.9.0",{requires:["template-base","handlebars-base"]});
