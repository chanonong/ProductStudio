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

var __cov_zYI4dJ$P9U9XHX1Vyl_cqw = (Function('return this'))();
if (!__cov_zYI4dJ$P9U9XHX1Vyl_cqw.__coverage__) { __cov_zYI4dJ$P9U9XHX1Vyl_cqw.__coverage__ = {}; }
__cov_zYI4dJ$P9U9XHX1Vyl_cqw = __cov_zYI4dJ$P9U9XHX1Vyl_cqw.__coverage__;
if (!(__cov_zYI4dJ$P9U9XHX1Vyl_cqw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-editable/ohp-editable.js'])) {
   __cov_zYI4dJ$P9U9XHX1Vyl_cqw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-editable/ohp-editable.js'] = {"path":"/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-editable/ohp-editable.js","s":{"1":0,"2":1,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":24},"end":{"line":2,"column":43}}},"2":{"name":"Editable","line":17,"loc":{"start":{"line":17,"column":0},"end":{"line":17,"column":30}}},"3":{"name":"(anonymous_3)","line":25,"loc":{"start":{"line":25,"column":14},"end":{"line":25,"column":25}}},"4":{"name":"(anonymous_4)","line":27,"loc":{"start":{"line":27,"column":30},"end":{"line":27,"column":52}}},"5":{"name":"(anonymous_5)","line":34,"loc":{"start":{"line":34,"column":24},"end":{"line":34,"column":35}}},"6":{"name":"(anonymous_6)","line":37,"loc":{"start":{"line":37,"column":52},"end":{"line":37,"column":66}}},"7":{"name":"(anonymous_7)","line":39,"loc":{"start":{"line":39,"column":22},"end":{"line":39,"column":32}}},"8":{"name":"(anonymous_8)","line":43,"loc":{"start":{"line":43,"column":67},"end":{"line":43,"column":82}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":51,"column":38}},"2":{"start":{"line":17,"column":0},"end":{"line":19,"column":1}},"3":{"start":{"line":18,"column":1},"end":{"line":18,"column":56}},"4":{"start":{"line":21,"column":0},"end":{"line":21,"column":31}},"5":{"start":{"line":22,"column":0},"end":{"line":22,"column":25}},"6":{"start":{"line":24,"column":0},"end":{"line":47,"column":3}},"7":{"start":{"line":26,"column":2},"end":{"line":26,"column":59}},"8":{"start":{"line":27,"column":2},"end":{"line":31,"column":5}},"9":{"start":{"line":28,"column":3},"end":{"line":30,"column":4}},"10":{"start":{"line":29,"column":4},"end":{"line":29,"column":32}},"11":{"start":{"line":35,"column":2},"end":{"line":35,"column":30}},"12":{"start":{"line":37,"column":2},"end":{"line":42,"column":5}},"13":{"start":{"line":38,"column":3},"end":{"line":38,"column":28}},"14":{"start":{"line":39,"column":3},"end":{"line":41,"column":6}},"15":{"start":{"line":40,"column":4},"end":{"line":40,"column":16}},"16":{"start":{"line":43,"column":2},"end":{"line":45,"column":5}},"17":{"start":{"line":44,"column":3},"end":{"line":44,"column":15}},"18":{"start":{"line":48,"column":0},"end":{"line":48,"column":46}}},"branchMap":{"1":{"line":28,"type":"if","locations":[{"start":{"line":28,"column":3},"end":{"line":28,"column":3}},{"start":{"line":28,"column":3},"end":{"line":28,"column":3}}]},"2":{"line":28,"type":"binary-expr","locations":[{"start":{"line":28,"column":7},"end":{"line":28,"column":25}},{"start":{"line":28,"column":29},"end":{"line":28,"column":34}}]}},"code":["(function () { /*!(C) ORCHESTRAL*/","YUI.add('ohp-editable', function (Y, NAME) {","","/**","Provides a basic plugin functionality for handling a popover with form elements","@module ohp-editable","**/","","/**","A plugin to the Popover Widget that allows the popover instance to be locked into a visible state during editing","of a form","@class Editable","@namespace OHP","@constructor","@extends Plugin","**/","function Editable(/*config*/) {","\tEditable.superclass.constructor.apply(this, arguments);","}","","Editable.NAME = 'ohp-editable';","Editable.NS = 'editable';","","Y.extend(Editable, Y.Plugin.Base, {","\tinitializer: function() {","\t\tthis.afterHostEvent('render', this._setupPopoverLocking);","\t\tthis.afterHostMethod('set', function(attr, value) {","\t\t\tif (attr === 'content' && value) {","\t\t\t\tthis._setupPopoverLocking();","\t\t\t}","\t\t});","\t},","","\t_setupPopoverLocking : function() {","\t\tvar host = this.get('host');","","\t\thost.get('contentBox').all('input,textarea').each(function(node){","\t\t\tnode.addClass('evented');","\t\t\tnode.on('keypress',function(){","\t\t\t\thost.lock();","\t\t\t});","\t\t});","\t\thost.get('contentBox').all('input,textarea,select').on('change', function(/*e*/){","\t\t\thost.lock();","\t\t});","\t}","});","Y.namespace('Plugin.OHP').Editable = Editable;","","","}, '7.9.0', {\"requires\": [\"plugin\"]});","","}());"]};
}
__cov_zYI4dJ$P9U9XHX1Vyl_cqw = __cov_zYI4dJ$P9U9XHX1Vyl_cqw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-editable/ohp-editable.js'];
__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['1']++;YUI.add('ohp-editable',function(Y,NAME){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['1']++;function Editable(){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['2']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['3']++;Editable.superclass.constructor.apply(this,arguments);}__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['4']++;Editable.NAME='ohp-editable';__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['5']++;Editable.NS='editable';__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['6']++;Y.extend(Editable,Y.Plugin.Base,{initializer:function(){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['3']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['7']++;this.afterHostEvent('render',this._setupPopoverLocking);__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['8']++;this.afterHostMethod('set',function(attr,value){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['4']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['9']++;if((__cov_zYI4dJ$P9U9XHX1Vyl_cqw.b['2'][0]++,attr==='content')&&(__cov_zYI4dJ$P9U9XHX1Vyl_cqw.b['2'][1]++,value)){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.b['1'][0]++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['10']++;this._setupPopoverLocking();}else{__cov_zYI4dJ$P9U9XHX1Vyl_cqw.b['1'][1]++;}});},_setupPopoverLocking:function(){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['5']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['11']++;var host=this.get('host');__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['12']++;host.get('contentBox').all('input,textarea').each(function(node){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['6']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['13']++;node.addClass('evented');__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['14']++;node.on('keypress',function(){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['7']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['15']++;host.lock();});});__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['16']++;host.get('contentBox').all('input,textarea,select').on('change',function(){__cov_zYI4dJ$P9U9XHX1Vyl_cqw.f['8']++;__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['17']++;host.lock();});}});__cov_zYI4dJ$P9U9XHX1Vyl_cqw.s['18']++;Y.namespace('Plugin.OHP').Editable=Editable;},'7.9.0',{'requires':['plugin']});
