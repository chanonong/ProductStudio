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

var __cov_ROXN24jpvNnhK0fdTkzL_Q = (Function('return this'))();
if (!__cov_ROXN24jpvNnhK0fdTkzL_Q.__coverage__) { __cov_ROXN24jpvNnhK0fdTkzL_Q.__coverage__ = {}; }
__cov_ROXN24jpvNnhK0fdTkzL_Q = __cov_ROXN24jpvNnhK0fdTkzL_Q.__coverage__;
if (!(__cov_ROXN24jpvNnhK0fdTkzL_Q['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool/ohp-annotation-tool.js'])) {
   __cov_ROXN24jpvNnhK0fdTkzL_Q['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool/ohp-annotation-tool.js'] = {"path":"/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool/ohp-annotation-tool.js","s":{"1":0,"2":0,"3":0},"b":{},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":31},"end":{"line":2,"column":50}}},"2":{"name":"(anonymous_2)","line":21,"loc":{"start":{"line":21,"column":8},"end":{"line":21,"column":35}}},"3":{"name":"(anonymous_3)","line":24,"loc":{"start":{"line":24,"column":7},"end":{"line":24,"column":27}}},"4":{"name":"(anonymous_4)","line":27,"loc":{"start":{"line":27,"column":7},"end":{"line":27,"column":27}}},"5":{"name":"(anonymous_5)","line":30,"loc":{"start":{"line":30,"column":6},"end":{"line":30,"column":26}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":44,"column":36}},"2":{"start":{"line":19,"column":0},"end":{"line":39,"column":3}},"3":{"start":{"line":41,"column":0},"end":{"line":41,"column":42}}},"branchMap":{},"code":["(function () { /*!(C) ORCHESTRAL*/","YUI.add('ohp-annotation-tool', function (Y, NAME) {","","\"use strict\";","/**","Tool Base class. All Tools will extend","","@module ohp-annotation-tool","**/","","/**","Tool Base class. All Tools will extend","","@class Tool","@namespace OHP.Annotation","@constructor","@extends Base","**/","var Tool = Y.Base.create('ohp-annotation-tool', Y.Base, [], {","","\tstart: function(/*layer, point*/) {","\t},","","\tdrag: function(/*point*/) {","\t},","","\tmove: function(/*point*/) {","\t},","","\tend: function(/*point*/) {","\t}","","}, {","\tATTRS: {","\t\tname: {},","\t\ttype: {},","\t\tannotationModel: {}","\t}","});","","Y.namespace('OHP.Annotation').Tool = Tool;","","","}, '7.9.0', {\"requires\": [\"base\"]});","","}());"]};
}
__cov_ROXN24jpvNnhK0fdTkzL_Q = __cov_ROXN24jpvNnhK0fdTkzL_Q['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool/ohp-annotation-tool.js'];
__cov_ROXN24jpvNnhK0fdTkzL_Q.s['1']++;YUI.add('ohp-annotation-tool',function(Y,NAME){'use strict';__cov_ROXN24jpvNnhK0fdTkzL_Q.f['1']++;__cov_ROXN24jpvNnhK0fdTkzL_Q.s['2']++;var Tool=Y.Base.create('ohp-annotation-tool',Y.Base,[],{start:function(){__cov_ROXN24jpvNnhK0fdTkzL_Q.f['2']++;},drag:function(){__cov_ROXN24jpvNnhK0fdTkzL_Q.f['3']++;},move:function(){__cov_ROXN24jpvNnhK0fdTkzL_Q.f['4']++;},end:function(){__cov_ROXN24jpvNnhK0fdTkzL_Q.f['5']++;}},{ATTRS:{name:{},type:{},annotationModel:{}}});__cov_ROXN24jpvNnhK0fdTkzL_Q.s['3']++;Y.namespace('OHP.Annotation').Tool=Tool;},'7.9.0',{'requires':['base']});
