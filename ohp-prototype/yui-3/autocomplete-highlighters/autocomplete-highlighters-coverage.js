/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/autocomplete-highlighters/autocomplete-highlighters.js']) {
   __coverage__['build/autocomplete-highlighters/autocomplete-highlighters.js'] = {"path":"build/autocomplete-highlighters/autocomplete-highlighters.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0},"b":{"1":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":37},"end":{"line":1,"column":56}}},"2":{"name":"(anonymous_2)","line":28,"loc":{"start":{"line":28,"column":15},"end":{"line":28,"column":56}}},"3":{"name":"(anonymous_3)","line":35,"loc":{"start":{"line":35,"column":35},"end":{"line":35,"column":53}}},"4":{"name":"(anonymous_4)","line":51,"loc":{"start":{"line":51,"column":19},"end":{"line":51,"column":45}}},"5":{"name":"(anonymous_5)","line":65,"loc":{"start":{"line":65,"column":17},"end":{"line":65,"column":58}}},"6":{"name":"(anonymous_6)","line":69,"loc":{"start":{"line":69,"column":35},"end":{"line":69,"column":53}}},"7":{"name":"(anonymous_7)","line":85,"loc":{"start":{"line":85,"column":21},"end":{"line":85,"column":47}}},"8":{"name":"(anonymous_8)","line":99,"loc":{"start":{"line":99,"column":16},"end":{"line":99,"column":57}}},"9":{"name":"(anonymous_9)","line":103,"loc":{"start":{"line":103,"column":35},"end":{"line":103,"column":53}}},"10":{"name":"(anonymous_10)","line":120,"loc":{"start":{"line":120,"column":20},"end":{"line":120,"column":46}}},"11":{"name":"(anonymous_11)","line":135,"loc":{"start":{"line":135,"column":18},"end":{"line":135,"column":59}}},"12":{"name":"(anonymous_12)","line":143,"loc":{"start":{"line":143,"column":35},"end":{"line":143,"column":53}}},"13":{"name":"(anonymous_13)","line":159,"loc":{"start":{"line":159,"column":22},"end":{"line":159,"column":48}}},"14":{"name":"(anonymous_14)","line":173,"loc":{"start":{"line":173,"column":15},"end":{"line":173,"column":56}}},"15":{"name":"(anonymous_15)","line":177,"loc":{"start":{"line":177,"column":35},"end":{"line":177,"column":53}}},"16":{"name":"(anonymous_16)","line":193,"loc":{"start":{"line":193,"column":19},"end":{"line":193,"column":45}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":199,"column":63}},"2":{"start":{"line":12,"column":0},"end":{"line":196,"column":3}},"3":{"start":{"line":32,"column":8},"end":{"line":33,"column":48}},"4":{"start":{"line":35,"column":8},"end":{"line":39,"column":11}},"5":{"start":{"line":36,"column":12},"end":{"line":38,"column":15}},"6":{"start":{"line":52,"column":8},"end":{"line":52,"column":60}},"7":{"start":{"line":69,"column":8},"end":{"line":73,"column":11}},"8":{"start":{"line":70,"column":12},"end":{"line":72,"column":15}},"9":{"start":{"line":86,"column":8},"end":{"line":86,"column":62}},"10":{"start":{"line":103,"column":8},"end":{"line":108,"column":11}},"11":{"start":{"line":104,"column":12},"end":{"line":107,"column":15}},"12":{"start":{"line":121,"column":8},"end":{"line":121,"column":61}},"13":{"start":{"line":139,"column":8},"end":{"line":141,"column":11}},"14":{"start":{"line":143,"column":8},"end":{"line":147,"column":11}},"15":{"start":{"line":144,"column":12},"end":{"line":146,"column":15}},"16":{"start":{"line":160,"column":8},"end":{"line":160,"column":63}},"17":{"start":{"line":177,"column":8},"end":{"line":181,"column":11}},"18":{"start":{"line":178,"column":12},"end":{"line":180,"column":15}},"19":{"start":{"line":194,"column":8},"end":{"line":194,"column":60}}},"branchMap":{"1":{"line":32,"type":"cond-expr","locations":[{"start":{"line":32,"column":56},"end":{"line":32,"column":61}},{"start":{"line":33,"column":16},"end":{"line":33,"column":35}}]}},"code":["(function () { YUI.add('autocomplete-highlighters', function (Y, NAME) {","","/**","Provides pre-built result highlighters for AutoComplete.","","@module autocomplete","@submodule autocomplete-highlighters","@class AutoCompleteHighlighters","@static","**/","","var YArray    = Y.Array,","    Highlight = Y.Highlight,","","Highlighters = Y.mix(Y.namespace('AutoCompleteHighlighters'), {","    // -- Public Methods -------------------------------------------------------","","    /**","    Highlights any individual query character that occurs anywhere in a result.","    Case-insensitive.","","    @method charMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    charMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // charMatchCase(). It's intentionally undocumented.","","        var queryChars = YArray.unique((caseSensitive ? query :","                query.toLowerCase()).split(''));","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, queryChars, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `charMatch()`.","","    @method charMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    charMatchCase: function (query, results) {","        return Highlighters.charMatch(query, results, true);","    },","","    /**","    Highlights the complete query as a phrase anywhere within a result. Case-","    insensitive.","","    @method phraseMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    phraseMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // phraseMatchCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, [query], {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `phraseMatch()`.","","    @method phraseMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    phraseMatchCase: function (query, results) {","        return Highlighters.phraseMatch(query, results, true);","    },","","    /**","    Highlights the complete query as a phrase at the beginning of a result.","    Case-insensitive.","","    @method startsWith","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    startsWith: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // startsWithCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, [query], {","                caseSensitive: caseSensitive,","                startsWith   : true","            });","        });","    },","","    /**","    Case-sensitive version of `startsWith()`.","","    @method startsWithCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    startsWithCase: function (query, results) {","        return Highlighters.startsWith(query, results, true);","    },","","    /**","    Highlights portions of results in which words from the query match either","    whole words or parts of words in the result. Non-word characters like","    whitespace and certain punctuation are ignored. Case-insensitive.","","    @method subWordMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    subWordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // subWordMatchCase(). It's intentionally undocumented.","","        var queryWords = Y.Text.WordBreak.getUniqueWords(query, {","            ignoreCase: !caseSensitive","        });","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, queryWords, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `subWordMatch()`.","","    @method subWordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    subWordMatchCase: function (query, results) {","        return Highlighters.subWordMatch(query, results, true);","    },","","    /**","    Highlights individual words in results that are also in the query. Non-word","    characters like punctuation are ignored. Case-insensitive.","","    @method wordMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    wordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // wordMatchCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.words(result.text, query, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `wordMatch()`.","","    @method wordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    wordMatchCase: function (query, results) {","        return Highlighters.wordMatch(query, results, true);","    }","});","","","}, '3.17.2', {\"requires\": [\"array-extras\", \"highlight-base\"]});","","}());"]};
}
var __cov_XrxKjJ9Q4XlOD8JIkFkjmg = __coverage__['build/autocomplete-highlighters/autocomplete-highlighters.js'];
__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['1']++;YUI.add('autocomplete-highlighters',function(Y,NAME){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['1']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['2']++;var YArray=Y.Array,Highlight=Y.Highlight,Highlighters=Y.mix(Y.namespace('AutoCompleteHighlighters'),{charMatch:function(query,results,caseSensitive){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['2']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['3']++;var queryChars=YArray.unique((caseSensitive?(__cov_XrxKjJ9Q4XlOD8JIkFkjmg.b['1'][0]++,query):(__cov_XrxKjJ9Q4XlOD8JIkFkjmg.b['1'][1]++,query.toLowerCase())).split(''));__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['4']++;return YArray.map(results,function(result){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['3']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['5']++;return Highlight.all(result.text,queryChars,{caseSensitive:caseSensitive});});},charMatchCase:function(query,results){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['4']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['6']++;return Highlighters.charMatch(query,results,true);},phraseMatch:function(query,results,caseSensitive){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['5']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['7']++;return YArray.map(results,function(result){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['6']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['8']++;return Highlight.all(result.text,[query],{caseSensitive:caseSensitive});});},phraseMatchCase:function(query,results){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['7']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['9']++;return Highlighters.phraseMatch(query,results,true);},startsWith:function(query,results,caseSensitive){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['8']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['10']++;return YArray.map(results,function(result){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['9']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['11']++;return Highlight.all(result.text,[query],{caseSensitive:caseSensitive,startsWith:true});});},startsWithCase:function(query,results){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['10']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['12']++;return Highlighters.startsWith(query,results,true);},subWordMatch:function(query,results,caseSensitive){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['11']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['13']++;var queryWords=Y.Text.WordBreak.getUniqueWords(query,{ignoreCase:!caseSensitive});__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['14']++;return YArray.map(results,function(result){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['12']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['15']++;return Highlight.all(result.text,queryWords,{caseSensitive:caseSensitive});});},subWordMatchCase:function(query,results){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['13']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['16']++;return Highlighters.subWordMatch(query,results,true);},wordMatch:function(query,results,caseSensitive){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['14']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['17']++;return YArray.map(results,function(result){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['15']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['18']++;return Highlight.words(result.text,query,{caseSensitive:caseSensitive});});},wordMatchCase:function(query,results){__cov_XrxKjJ9Q4XlOD8JIkFkjmg.f['16']++;__cov_XrxKjJ9Q4XlOD8JIkFkjmg.s['19']++;return Highlighters.wordMatch(query,results,true);}});},'3.17.2',{'requires':['array-extras','highlight-base']});
