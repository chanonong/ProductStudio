/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/yql-nodejs/yql-nodejs.js']) {
   __coverage__['build/yql-nodejs/yql-nodejs.js'] = {"path":"build/yql-nodejs/yql-nodejs.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":41}}},"2":{"name":"(anonymous_2)","line":13,"loc":{"start":{"line":13,"column":31},"end":{"line":13,"column":49}}},"3":{"name":"(anonymous_3)","line":17,"loc":{"start":{"line":17,"column":7},"end":{"line":17,"column":26}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":30,"column":36}},"2":{"start":{"line":10,"column":0},"end":{"line":10,"column":33}},"3":{"start":{"line":13,"column":0},"end":{"line":27,"column":2}},"4":{"start":{"line":14,"column":4},"end":{"line":26,"column":7}},"5":{"start":{"line":18,"column":8},"end":{"line":25,"column":9}},"6":{"start":{"line":20,"column":12},"end":{"line":22,"column":15}},"7":{"start":{"line":24,"column":12},"end":{"line":24,"column":47}}},"branchMap":{"1":{"line":16,"type":"binary-expr","locations":[{"start":{"line":16,"column":17},"end":{"line":16,"column":26}},{"start":{"line":16,"column":31},"end":{"line":16,"column":40}}]},"2":{"line":18,"type":"if","locations":[{"start":{"line":18,"column":8},"end":{"line":18,"column":8}},{"start":{"line":18,"column":8},"end":{"line":18,"column":8}}]}},"code":["(function () { YUI.add('yql-nodejs', function (Y, NAME) {","","/**","* NodeJS plugin for YQL to use native request to make requests instead of JSONP.","* Not required by the user, it's conditionally loaded and should \"just work\".","* @module yql","* @submodule yql-nodejs","*/","","var request = require('request');","","//Over writes Y.YQLRequest._send to use request instead of JSONP","Y.YQLRequest.prototype._send = function (url, o) {","    request(url, {","        method: 'GET',","        timeout: o.timeout || (30 * 1000)","    }, function(err, res) {","        if (err) {","            //The signature that YQL requires","            o.on.success({","                error: err","            });","        } else {","            o.on.success(JSON.parse(res.body));","        }","    });","};","","","}, '3.17.2', {\"requires\": [\"yql\"]});","","}());"]};
}
var __cov_EgLFkYGu601MZUC_5qJJLg = __coverage__['build/yql-nodejs/yql-nodejs.js'];
__cov_EgLFkYGu601MZUC_5qJJLg.s['1']++;YUI.add('yql-nodejs',function(Y,NAME){__cov_EgLFkYGu601MZUC_5qJJLg.f['1']++;__cov_EgLFkYGu601MZUC_5qJJLg.s['2']++;var request=require('request');__cov_EgLFkYGu601MZUC_5qJJLg.s['3']++;Y.YQLRequest.prototype._send=function(url,o){__cov_EgLFkYGu601MZUC_5qJJLg.f['2']++;__cov_EgLFkYGu601MZUC_5qJJLg.s['4']++;request(url,{method:'GET',timeout:(__cov_EgLFkYGu601MZUC_5qJJLg.b['1'][0]++,o.timeout)||(__cov_EgLFkYGu601MZUC_5qJJLg.b['1'][1]++,30*1000)},function(err,res){__cov_EgLFkYGu601MZUC_5qJJLg.f['3']++;__cov_EgLFkYGu601MZUC_5qJJLg.s['5']++;if(err){__cov_EgLFkYGu601MZUC_5qJJLg.b['2'][0]++;__cov_EgLFkYGu601MZUC_5qJJLg.s['6']++;o.on.success({error:err});}else{__cov_EgLFkYGu601MZUC_5qJJLg.b['2'][1]++;__cov_EgLFkYGu601MZUC_5qJJLg.s['7']++;o.on.success(JSON.parse(res.body));}});};},'3.17.2',{'requires':['yql']});
