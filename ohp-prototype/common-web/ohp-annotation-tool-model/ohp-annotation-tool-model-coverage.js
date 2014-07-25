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

var __cov_Du9sMyPZM_uh5n$UuK2$og = (Function('return this'))();
if (!__cov_Du9sMyPZM_uh5n$UuK2$og.__coverage__) { __cov_Du9sMyPZM_uh5n$UuK2$og.__coverage__ = {}; }
__cov_Du9sMyPZM_uh5n$UuK2$og = __cov_Du9sMyPZM_uh5n$UuK2$og.__coverage__;
if (!(__cov_Du9sMyPZM_uh5n$UuK2$og['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool-model/ohp-annotation-tool-model.js'])) {
   __cov_Du9sMyPZM_uh5n$UuK2$og['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool-model/ohp-annotation-tool-model.js'] = {"path":"/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool-model/ohp-annotation-tool-model.js","s":{"1":0,"2":0,"3":0},"b":{},"f":{"1":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":37},"end":{"line":2,"column":56}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":33,"column":45}},"2":{"start":{"line":19,"column":0},"end":{"line":28,"column":3}},"3":{"start":{"line":30,"column":0},"end":{"line":30,"column":52}}},"branchMap":{},"code":["(function () { /*!(C) ORCHESTRAL*/","YUI.add('ohp-annotation-tool-model', function (Y, NAME) {","","\"use strict\";","/**","Tool Model, contains Tool and active status.","","@module ohp-annotation-tool-model","**/","","/**","Tool Model, contains Tool and active status.","","@class ToolModel","@namespace OHP.Annotation","@constructor","@extends Model","**/","var ToolModel = Y.Base.create('ohp-annotation-tool', Y.Model, [], {}, {","\tATTRS: {","\t\tactive: {","\t\t\tvalue: false","\t\t},","\t\ttool: {","\t\t\twriteOnce: 'initOnly'","\t\t}","\t}","});","","Y.namespace('OHP.Annotation').ToolModel = ToolModel;","","","}, '7.9.0', {\"requires\": [\"model\", \"base\"]});","","}());"]};
}
__cov_Du9sMyPZM_uh5n$UuK2$og = __cov_Du9sMyPZM_uh5n$UuK2$og['/build/work/UIE-COW-JOB1/Common-Web/com.orchestral.commonweb/web/ohp-annotation-tool-model/ohp-annotation-tool-model.js'];
__cov_Du9sMyPZM_uh5n$UuK2$og.s['1']++;YUI.add('ohp-annotation-tool-model',function(Y,NAME){'use strict';__cov_Du9sMyPZM_uh5n$UuK2$og.f['1']++;__cov_Du9sMyPZM_uh5n$UuK2$og.s['2']++;var ToolModel=Y.Base.create('ohp-annotation-tool',Y.Model,[],{},{ATTRS:{active:{value:false},tool:{writeOnce:'initOnly'}}});__cov_Du9sMyPZM_uh5n$UuK2$og.s['3']++;Y.namespace('OHP.Annotation').ToolModel=ToolModel;},'7.9.0',{'requires':['model','base']});
