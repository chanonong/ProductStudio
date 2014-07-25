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

var __cov_owerldzXHPENY6mnaJOdOw = (Function('return this'))();
if (!__cov_owerldzXHPENY6mnaJOdOw.__coverage__) { __cov_owerldzXHPENY6mnaJOdOw.__coverage__ = {}; }
__cov_owerldzXHPENY6mnaJOdOw = __cov_owerldzXHPENY6mnaJOdOw.__coverage__;
if (!(__cov_owerldzXHPENY6mnaJOdOw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-browser-test-tool/ohp-annotation-browser-test-tool.js'])) {
   __cov_owerldzXHPENY6mnaJOdOw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-browser-test-tool/ohp-annotation-browser-test-tool.js'] = {"path":"/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-browser-test-tool/ohp-annotation-browser-test-tool.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0},"b":{},"f":{"1":0,"2":0,"3":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":44},"end":{"line":2,"column":63}}},"2":{"name":"(anonymous_2)","line":26,"loc":{"start":{"line":26,"column":14},"end":{"line":26,"column":25}}},"3":{"name":"(anonymous_3)","line":31,"loc":{"start":{"line":31,"column":8},"end":{"line":31,"column":29}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":82,"column":92}},"2":{"start":{"line":12,"column":0},"end":{"line":13,"column":17}},"3":{"start":{"line":24,"column":0},"end":{"line":77,"column":3}},"4":{"start":{"line":27,"column":2},"end":{"line":27,"column":27}},"5":{"start":{"line":28,"column":2},"end":{"line":28,"column":30}},"6":{"start":{"line":35,"column":2},"end":{"line":36,"column":17}},"7":{"start":{"line":40,"column":2},"end":{"line":40,"column":38}},"8":{"start":{"line":41,"column":2},"end":{"line":41,"column":45}},"9":{"start":{"line":43,"column":2},"end":{"line":43,"column":40}},"10":{"start":{"line":44,"column":2},"end":{"line":44,"column":38}},"11":{"start":{"line":47,"column":2},"end":{"line":47,"column":38}},"12":{"start":{"line":48,"column":2},"end":{"line":48,"column":43}},"13":{"start":{"line":49,"column":2},"end":{"line":49,"column":45}},"14":{"start":{"line":50,"column":2},"end":{"line":50,"column":44}},"15":{"start":{"line":51,"column":2},"end":{"line":51,"column":40}},"16":{"start":{"line":52,"column":2},"end":{"line":52,"column":38}},"17":{"start":{"line":54,"column":2},"end":{"line":54,"column":38}},"18":{"start":{"line":55,"column":2},"end":{"line":55,"column":44}},"19":{"start":{"line":56,"column":2},"end":{"line":56,"column":44}},"20":{"start":{"line":57,"column":2},"end":{"line":57,"column":44}},"21":{"start":{"line":58,"column":2},"end":{"line":58,"column":44}},"22":{"start":{"line":59,"column":2},"end":{"line":59,"column":39}},"23":{"start":{"line":60,"column":2},"end":{"line":60,"column":38}},"24":{"start":{"line":62,"column":2},"end":{"line":62,"column":38}},"25":{"start":{"line":63,"column":2},"end":{"line":63,"column":44}},"26":{"start":{"line":64,"column":2},"end":{"line":64,"column":44}},"27":{"start":{"line":65,"column":2},"end":{"line":65,"column":45}},"28":{"start":{"line":66,"column":2},"end":{"line":66,"column":45}},"29":{"start":{"line":67,"column":2},"end":{"line":67,"column":39}},"30":{"start":{"line":68,"column":2},"end":{"line":68,"column":38}},"31":{"start":{"line":70,"column":2},"end":{"line":70,"column":38}},"32":{"start":{"line":71,"column":2},"end":{"line":71,"column":44}},"33":{"start":{"line":72,"column":2},"end":{"line":72,"column":45}},"34":{"start":{"line":73,"column":2},"end":{"line":73,"column":45}},"35":{"start":{"line":74,"column":2},"end":{"line":74,"column":39}},"36":{"start":{"line":75,"column":2},"end":{"line":75,"column":38}},"37":{"start":{"line":79,"column":0},"end":{"line":79,"column":64}}},"branchMap":{},"code":["(function () { /*!(C) ORCHESTRAL*/","YUI.add('ohp-annotation-browser-test-tool', function (Y, NAME) {","","\"use strict\";","/**","This is a Tool for temporary use. It is used to show a certain consistent","drawing which can then be used to test across browsers.","","@module ohp-annotation-browser-test-tool","**/","","var FreehandModel = Y.OHP.Annotation.FreehandModel,","\tBrowserTestTool;","","/**","This is a Tool for temporary use. It is used to show a certain consistent","drawing which can then be used to test across browsers.","","@class BrowserTestTool","@namespace OHP.Annotation","@constructor","@extends OHP.Annotation.Tool","**/","BrowserTestTool = Y.Base.create('ohp-annotation-browser-test-tool', Y.OHP.Annotation.Tool, [], {","","\tinitializer: function() {","\t\tthis.set('name', 'test');","\t\tthis.set('type', 'drawing');","\t},","","\tstart: function(/*config*/) {","\t\t// just a test tool, relax jshint","\t\t/*jshint maxstatements:35*/","","\t\tvar drawingModelList = this.get('annotationModel').get('drawingModelList'),","\t\t\tfreehandModel;","","\t\t// Dot test.","\t\t// VML doesn't draw a dot.","\t\tfreehandModel = new FreehandModel();","\t\tfreehandModel.addPoint({ x: 150, y: 150 });","\t\t//freehandModel.addPoint({ x: 150, y: 150 });","\t\tfreehandModel.end({ x: 150, y: 150 });","\t\tdrawingModelList.add(freehandModel);","","","\t\tfreehandModel = new FreehandModel();","\t\tfreehandModel.addPoint({ x: 20, y: 20 });","\t\tfreehandModel.addPoint({ x: 260, y: 256 });","\t\tfreehandModel.addPoint({ x: 333, y: 98 });","\t\tfreehandModel.end({ x: 400, y: 249 });","\t\tdrawingModelList.add(freehandModel);","","\t\tfreehandModel = new FreehandModel();","\t\tfreehandModel.addPoint({ x: 200, y: 20 });","\t\tfreehandModel.addPoint({ x: 250, y: 20 });","\t\tfreehandModel.addPoint({ x: 250, y: 70 });","\t\tfreehandModel.addPoint({ x: 200, y: 70 });","\t\tfreehandModel.end({ x: 200, y: 20 });","\t\tdrawingModelList.add(freehandModel);","","\t\tfreehandModel = new FreehandModel();","\t\tfreehandModel.addPoint({ x: 450, y: 50 });","\t\tfreehandModel.addPoint({ x: 550, y: 50 });","\t\tfreehandModel.addPoint({ x: 550, y: 250 });","\t\tfreehandModel.addPoint({ x: 450, y: 250 });","\t\tfreehandModel.end({ x: 450, y: 50 });","\t\tdrawingModelList.add(freehandModel);","","\t\tfreehandModel = new FreehandModel();","\t\tfreehandModel.addPoint({ x: 50, y: 550 });","\t\tfreehandModel.addPoint({ x: 550, y: 550 });","\t\tfreehandModel.addPoint({ x: 550, y: 350 });","\t\tfreehandModel.end({ x: 50, y: 550 });","\t\tdrawingModelList.add(freehandModel);","\t}","});","","Y.namespace('OHP.Annotation').BrowserTestTool = BrowserTestTool;","","","}, '7.9.0', {\"requires\": [\"ohp-annotation-tool\", \"base\", \"ohp-annotation-freehand-model\"]});","","}());"]};
}
__cov_owerldzXHPENY6mnaJOdOw = __cov_owerldzXHPENY6mnaJOdOw['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-browser-test-tool/ohp-annotation-browser-test-tool.js'];
__cov_owerldzXHPENY6mnaJOdOw.s['1']++;YUI.add('ohp-annotation-browser-test-tool',function(Y,NAME){'use strict';__cov_owerldzXHPENY6mnaJOdOw.f['1']++;__cov_owerldzXHPENY6mnaJOdOw.s['2']++;var FreehandModel=Y.OHP.Annotation.FreehandModel,BrowserTestTool;__cov_owerldzXHPENY6mnaJOdOw.s['3']++;BrowserTestTool=Y.Base.create('ohp-annotation-browser-test-tool',Y.OHP.Annotation.Tool,[],{initializer:function(){__cov_owerldzXHPENY6mnaJOdOw.f['2']++;__cov_owerldzXHPENY6mnaJOdOw.s['4']++;this.set('name','test');__cov_owerldzXHPENY6mnaJOdOw.s['5']++;this.set('type','drawing');},start:function(){__cov_owerldzXHPENY6mnaJOdOw.f['3']++;__cov_owerldzXHPENY6mnaJOdOw.s['6']++;var drawingModelList=this.get('annotationModel').get('drawingModelList'),freehandModel;__cov_owerldzXHPENY6mnaJOdOw.s['7']++;freehandModel=new FreehandModel();__cov_owerldzXHPENY6mnaJOdOw.s['8']++;freehandModel.addPoint({x:150,y:150});__cov_owerldzXHPENY6mnaJOdOw.s['9']++;freehandModel.end({x:150,y:150});__cov_owerldzXHPENY6mnaJOdOw.s['10']++;drawingModelList.add(freehandModel);__cov_owerldzXHPENY6mnaJOdOw.s['11']++;freehandModel=new FreehandModel();__cov_owerldzXHPENY6mnaJOdOw.s['12']++;freehandModel.addPoint({x:20,y:20});__cov_owerldzXHPENY6mnaJOdOw.s['13']++;freehandModel.addPoint({x:260,y:256});__cov_owerldzXHPENY6mnaJOdOw.s['14']++;freehandModel.addPoint({x:333,y:98});__cov_owerldzXHPENY6mnaJOdOw.s['15']++;freehandModel.end({x:400,y:249});__cov_owerldzXHPENY6mnaJOdOw.s['16']++;drawingModelList.add(freehandModel);__cov_owerldzXHPENY6mnaJOdOw.s['17']++;freehandModel=new FreehandModel();__cov_owerldzXHPENY6mnaJOdOw.s['18']++;freehandModel.addPoint({x:200,y:20});__cov_owerldzXHPENY6mnaJOdOw.s['19']++;freehandModel.addPoint({x:250,y:20});__cov_owerldzXHPENY6mnaJOdOw.s['20']++;freehandModel.addPoint({x:250,y:70});__cov_owerldzXHPENY6mnaJOdOw.s['21']++;freehandModel.addPoint({x:200,y:70});__cov_owerldzXHPENY6mnaJOdOw.s['22']++;freehandModel.end({x:200,y:20});__cov_owerldzXHPENY6mnaJOdOw.s['23']++;drawingModelList.add(freehandModel);__cov_owerldzXHPENY6mnaJOdOw.s['24']++;freehandModel=new FreehandModel();__cov_owerldzXHPENY6mnaJOdOw.s['25']++;freehandModel.addPoint({x:450,y:50});__cov_owerldzXHPENY6mnaJOdOw.s['26']++;freehandModel.addPoint({x:550,y:50});__cov_owerldzXHPENY6mnaJOdOw.s['27']++;freehandModel.addPoint({x:550,y:250});__cov_owerldzXHPENY6mnaJOdOw.s['28']++;freehandModel.addPoint({x:450,y:250});__cov_owerldzXHPENY6mnaJOdOw.s['29']++;freehandModel.end({x:450,y:50});__cov_owerldzXHPENY6mnaJOdOw.s['30']++;drawingModelList.add(freehandModel);__cov_owerldzXHPENY6mnaJOdOw.s['31']++;freehandModel=new FreehandModel();__cov_owerldzXHPENY6mnaJOdOw.s['32']++;freehandModel.addPoint({x:50,y:550});__cov_owerldzXHPENY6mnaJOdOw.s['33']++;freehandModel.addPoint({x:550,y:550});__cov_owerldzXHPENY6mnaJOdOw.s['34']++;freehandModel.addPoint({x:550,y:350});__cov_owerldzXHPENY6mnaJOdOw.s['35']++;freehandModel.end({x:50,y:550});__cov_owerldzXHPENY6mnaJOdOw.s['36']++;drawingModelList.add(freehandModel);}});__cov_owerldzXHPENY6mnaJOdOw.s['37']++;Y.namespace('OHP.Annotation').BrowserTestTool=BrowserTestTool;},'7.9.0',{'requires':['ohp-annotation-tool','base','ohp-annotation-freehand-model']});