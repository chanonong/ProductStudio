/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/attribute-complex/attribute-complex.js']) {
   __coverage__['build/attribute-complex/attribute-complex.js'] = {"path":"build/attribute-complex/attribute-complex.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0},"b":{},"f":{"1":0,"2":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":29},"end":{"line":1,"column":48}}},"2":{"name":"(anonymous_2)","line":14,"loc":{"start":{"line":14,"column":24},"end":{"line":14,"column":35}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":56,"column":47}},"2":{"start":{"line":12,"column":4},"end":{"line":12,"column":32}},"3":{"start":{"line":14,"column":4},"end":{"line":14,"column":38}},"4":{"start":{"line":15,"column":4},"end":{"line":50,"column":6}},"5":{"start":{"line":53,"column":4},"end":{"line":53,"column":43}}},"branchMap":{},"code":["(function () { YUI.add('attribute-complex', function (Y, NAME) {","","    /**","     * Adds support for attribute providers to handle complex attributes in the constructor","     *","     * @module attribute","     * @submodule attribute-complex","     * @for Attribute","     * @deprecated AttributeComplex's overrides are now part of AttributeCore.","     */","","    var Attribute = Y.Attribute;","","    Attribute.Complex = function() {};","    Attribute.Complex.prototype = {","","        /**","         * Utility method to split out simple attribute name/value pairs (\"x\")","         * from complex attribute name/value pairs (\"x.y.z\"), so that complex","         * attributes can be keyed by the top level attribute name.","         *","         * @method _normAttrVals","         * @param {Object} valueHash An object with attribute name/value pairs","         *","         * @return {Object} An object literal with 2 properties - \"simple\" and \"complex\",","         * containing simple and complex attribute values respectively keyed","         * by the top level attribute name, or null, if valueHash is falsey.","         *","         * @private","         */","        _normAttrVals : Attribute.prototype._normAttrVals,","","        /**","         * Returns the initial value of the given attribute from","         * either the default configuration provided, or the","         * over-ridden value if it exists in the set of initValues","         * provided and the attribute is not read-only.","         *","         * @param {String} attr The name of the attribute","         * @param {Object} cfg The attribute configuration object","         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals","         *","         * @return {Any} The initial value of the attribute.","         *","         * @method _getAttrInitVal","         * @private","         */","        _getAttrInitVal : Attribute.prototype._getAttrInitVal","","    };","","    // Consistency with the rest of the Attribute addons for now.","    Y.AttributeComplex = Attribute.Complex;","","","}, '3.17.2', {\"requires\": [\"attribute-base\"]});","","}());"]};
}
var __cov_CggkyoCmV_99zCFiws4$GA = __coverage__['build/attribute-complex/attribute-complex.js'];
__cov_CggkyoCmV_99zCFiws4$GA.s['1']++;YUI.add('attribute-complex',function(Y,NAME){__cov_CggkyoCmV_99zCFiws4$GA.f['1']++;__cov_CggkyoCmV_99zCFiws4$GA.s['2']++;var Attribute=Y.Attribute;__cov_CggkyoCmV_99zCFiws4$GA.s['3']++;Attribute.Complex=function(){__cov_CggkyoCmV_99zCFiws4$GA.f['2']++;};__cov_CggkyoCmV_99zCFiws4$GA.s['4']++;Attribute.Complex.prototype={_normAttrVals:Attribute.prototype._normAttrVals,_getAttrInitVal:Attribute.prototype._getAttrInitVal};__cov_CggkyoCmV_99zCFiws4$GA.s['5']++;Y.AttributeComplex=Attribute.Complex;},'3.17.2',{'requires':['attribute-base']});
