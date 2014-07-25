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

var __cov_hPtrnY3_wI1bjNbotntAdA = (Function('return this'))();
if (!__cov_hPtrnY3_wI1bjNbotntAdA.__coverage__) { __cov_hPtrnY3_wI1bjNbotntAdA.__coverage__ = {}; }
__cov_hPtrnY3_wI1bjNbotntAdA = __cov_hPtrnY3_wI1bjNbotntAdA.__coverage__;
if (!(__cov_hPtrnY3_wI1bjNbotntAdA['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-freehand-tool/ohp-annotation-freehand-tool.js'])) {
   __cov_hPtrnY3_wI1bjNbotntAdA['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-freehand-tool/ohp-annotation-freehand-tool.js'] = {"path":"/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-freehand-tool/ohp-annotation-freehand-tool.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0},"b":{"1":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":40},"end":{"line":2,"column":59}}},"2":{"name":"(anonymous_2)","line":24,"loc":{"start":{"line":24,"column":14},"end":{"line":24,"column":25}}},"3":{"name":"(anonymous_3)","line":29,"loc":{"start":{"line":29,"column":8},"end":{"line":29,"column":31}}},"4":{"name":"(anonymous_4)","line":45,"loc":{"start":{"line":45,"column":7},"end":{"line":45,"column":23}}},"5":{"name":"(anonymous_5)","line":53,"loc":{"start":{"line":53,"column":6},"end":{"line":53,"column":22}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":67,"column":116}},"2":{"start":{"line":11,"column":0},"end":{"line":12,"column":14}},"3":{"start":{"line":22,"column":0},"end":{"line":62,"column":3}},"4":{"start":{"line":25,"column":2},"end":{"line":25,"column":31}},"5":{"start":{"line":26,"column":2},"end":{"line":26,"column":30}},"6":{"start":{"line":30,"column":2},"end":{"line":30,"column":16}},"7":{"start":{"line":31,"column":2},"end":{"line":34,"column":5}},"8":{"start":{"line":36,"column":2},"end":{"line":36,"column":31}},"9":{"start":{"line":37,"column":2},"end":{"line":37,"column":38}},"10":{"start":{"line":39,"column":2},"end":{"line":39,"column":51}},"11":{"start":{"line":40,"column":2},"end":{"line":40,"column":45}},"12":{"start":{"line":42,"column":2},"end":{"line":42,"column":22}},"13":{"start":{"line":46,"column":2},"end":{"line":50,"column":3}},"14":{"start":{"line":48,"column":3},"end":{"line":48,"column":39}},"15":{"start":{"line":49,"column":3},"end":{"line":49,"column":20}},"16":{"start":{"line":54,"column":2},"end":{"line":54,"column":40}},"17":{"start":{"line":56,"column":2},"end":{"line":56,"column":86}},"18":{"start":{"line":59,"column":2},"end":{"line":59,"column":22}},"19":{"start":{"line":60,"column":2},"end":{"line":60,"column":36}},"20":{"start":{"line":64,"column":0},"end":{"line":64,"column":58}}},"branchMap":{"1":{"line":46,"type":"if","locations":[{"start":{"line":46,"column":2},"end":{"line":46,"column":2}},{"start":{"line":46,"column":2},"end":{"line":46,"column":2}}]}},"code":["(function () { /*!(C) ORCHESTRAL*/","YUI.add('ohp-annotation-freehand-tool', function (Y, NAME) {","","\"use strict\";","/**","Tool for creating Freehand Drawings","","@module ohp-annotation-freehand-tool","**/","","var FreehandModel = Y.OHP.Annotation.FreehandModel,","\tFreehandTool;","","/**","Tool for creating Freehand Drawings","","@class FreehandTool","@namespace OHP.Annotation","@constructor","@extends OHP.Annotation.Tool","**/","FreehandTool = Y.Base.create('ohp-annotation-freehand-tool', Y.OHP.Annotation.Tool, [], {","","\tinitializer: function() {","\t\tthis.set('name', 'freehand');","\t\tthis.set('type', 'drawing');","\t},","","\tstart: function(layer, point) {","\t\tlayer.clear();","\t\tlayer.set('stroke', {","\t\t\tcolor:'#61C0FF',","\t\t\tweight: 3","\t\t});","","\t\tthis._path = layer.addPath();","\t\tthis._path.moveTo(point.x, point.y);","","\t\tthis._currentFreehandModel = new FreehandModel();","\t\tthis._currentFreehandModel.addPoint(point);","","\t\tthis._layer = layer;","\t},","","\tdrag: function(point) {","\t\tif (this._currentFreehandModel.addPoint(point)) {","\t\t\t// only draw the point if it was added to the model","\t\t\tthis._path.lineTo(point.x, point.y);","\t\t\tthis._path.end();","\t\t}","\t},","","\tend: function(point) {","\t\tthis._currentFreehandModel.end(point);","\t\t// Add new drawing once complete, to the Annotation Model","\t\tthis.get('annotationModel').get('drawingModelList').add(this._currentFreehandModel);","\t\t// Clear tool layer once tool has completed 'in progress' drawing","\t\t// new drawing will be drawn to drawing layer","\t\tthis._layer.clear();","\t\tthis._currentFreehandModel = null;","\t}","});","","Y.namespace('OHP.Annotation').FreehandTool = FreehandTool;","","","}, '7.9.0', {\"requires\": [\"ohp-annotation-tool\", \"base\", \"ohp-annotation-freehand-model\", \"ohp-annotation-layer\"]});","","}());"]};
}
__cov_hPtrnY3_wI1bjNbotntAdA = __cov_hPtrnY3_wI1bjNbotntAdA['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-freehand-tool/ohp-annotation-freehand-tool.js'];
__cov_hPtrnY3_wI1bjNbotntAdA.s['1']++;YUI.add('ohp-annotation-freehand-tool',function(Y,NAME){'use strict';__cov_hPtrnY3_wI1bjNbotntAdA.f['1']++;__cov_hPtrnY3_wI1bjNbotntAdA.s['2']++;var FreehandModel=Y.OHP.Annotation.FreehandModel,FreehandTool;__cov_hPtrnY3_wI1bjNbotntAdA.s['3']++;FreehandTool=Y.Base.create('ohp-annotation-freehand-tool',Y.OHP.Annotation.Tool,[],{initializer:function(){__cov_hPtrnY3_wI1bjNbotntAdA.f['2']++;__cov_hPtrnY3_wI1bjNbotntAdA.s['4']++;this.set('name','freehand');__cov_hPtrnY3_wI1bjNbotntAdA.s['5']++;this.set('type','drawing');},start:function(layer,point){__cov_hPtrnY3_wI1bjNbotntAdA.f['3']++;__cov_hPtrnY3_wI1bjNbotntAdA.s['6']++;layer.clear();__cov_hPtrnY3_wI1bjNbotntAdA.s['7']++;layer.set('stroke',{color:'#61C0FF',weight:3});__cov_hPtrnY3_wI1bjNbotntAdA.s['8']++;this._path=layer.addPath();__cov_hPtrnY3_wI1bjNbotntAdA.s['9']++;this._path.moveTo(point.x,point.y);__cov_hPtrnY3_wI1bjNbotntAdA.s['10']++;this._currentFreehandModel=new FreehandModel();__cov_hPtrnY3_wI1bjNbotntAdA.s['11']++;this._currentFreehandModel.addPoint(point);__cov_hPtrnY3_wI1bjNbotntAdA.s['12']++;this._layer=layer;},drag:function(point){__cov_hPtrnY3_wI1bjNbotntAdA.f['4']++;__cov_hPtrnY3_wI1bjNbotntAdA.s['13']++;if(this._currentFreehandModel.addPoint(point)){__cov_hPtrnY3_wI1bjNbotntAdA.b['1'][0]++;__cov_hPtrnY3_wI1bjNbotntAdA.s['14']++;this._path.lineTo(point.x,point.y);__cov_hPtrnY3_wI1bjNbotntAdA.s['15']++;this._path.end();}else{__cov_hPtrnY3_wI1bjNbotntAdA.b['1'][1]++;}},end:function(point){__cov_hPtrnY3_wI1bjNbotntAdA.f['5']++;__cov_hPtrnY3_wI1bjNbotntAdA.s['16']++;this._currentFreehandModel.end(point);__cov_hPtrnY3_wI1bjNbotntAdA.s['17']++;this.get('annotationModel').get('drawingModelList').add(this._currentFreehandModel);__cov_hPtrnY3_wI1bjNbotntAdA.s['18']++;this._layer.clear();__cov_hPtrnY3_wI1bjNbotntAdA.s['19']++;this._currentFreehandModel=null;}});__cov_hPtrnY3_wI1bjNbotntAdA.s['20']++;Y.namespace('OHP.Annotation').FreehandTool=FreehandTool;},'7.9.0',{'requires':['ohp-annotation-tool','base','ohp-annotation-freehand-model','ohp-annotation-layer']});
