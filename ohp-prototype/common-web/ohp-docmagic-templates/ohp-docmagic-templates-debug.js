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
YUI.add('ohp-docmagic-templates', function (Y, NAME) {

"use strict";
var handlebarsEngine = new Y.Template(Y.Handlebars);

Y.Template.register('ohp-docmagic-script-template', handlebarsEngine.revive(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n	var YAHOO = Y.YUI2, ORCHESTRAL = YAHOO.ORCHESTRAL;\n	";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += ", '', { requires: [ ";
  if (stack1 = helpers.modules) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.modules; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ] }";
  return buffer;
  }

  buffer += "YUI.add('";
  if (stack1 = helpers.moduleName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.moduleName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "', function(Y) {\n	'use strict';\n\n	";
  stack1 = helpers['if'].call(depth0, depth0.initializeGlobals, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  if (stack1 = helpers.scriptContent) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.scriptContent; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n}";
  stack1 = helpers['if'].call(depth0, depth0.modules, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ");\n";
  return buffer;
  }));



}, '7.9.0', {"requires": ["template-base", "handlebars-base"]});
