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
YUI.add('ohp-dropdown-menu-templates', function (Y, NAME) {

"use strict";
var handlebarsEngine = new Y.Template(Y.Handlebars);

Y.Template.register('ohp-dropdown-menu-item-template', handlebarsEngine.revive(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "target=\"";
  if (stack1 = helpers.target) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.target; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			";
  if (stack1 = helpers.labelHtml) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.labelHtml; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n		";
  return buffer;
  }

  buffer += "<li class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.classNames),stack1 == null || stack1 === false ? stack1 : stack1.item)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-"
    + escapeExpression(((stack1 = ((stack1 = depth0.dataAttrNames),stack1 == null || stack1 === false ? stack1 : stack1.itemIndex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "=\"";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" role=\"presentation\">\n	<a href=\"";
  if (stack2 = helpers.href) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.href; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"\n		class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.classNames),stack1 == null || stack1 === false ? stack1 : stack1.itemContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n		data-"
    + escapeExpression(((stack1 = ((stack1 = depth0.dataAttrNames),stack1 == null || stack1 === false ? stack1 : stack1.itemId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"\n		role=\"menuitem\"\n		";
  stack2 = helpers['if'].call(depth0, depth0.target, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">\n		";
  stack2 = helpers['if'].call(depth0, depth0.labelHtml, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</a>\n</li>\n";
  return buffer;
  }));



}, '7.9.0', {"requires": ["template-base", "handlebars-base"]});
