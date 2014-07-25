/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
YAHOO.namespace("tool");(function(){var a=0;YAHOO.tool.TestCase=function(b){this._should={};for(var c in b){this[c]=b[c]}if(!YAHOO.lang.isString(this.name)){this.name="testCase"+(a++)}};YAHOO.tool.TestCase.prototype={resume:function(b){YAHOO.tool.TestRunner.resume(b)},wait:function(d,c){var b=arguments;if(YAHOO.lang.isFunction(b[0])){throw new YAHOO.tool.TestCase.Wait(b[0],b[1])}else{throw new YAHOO.tool.TestCase.Wait(function(){YAHOO.util.Assert.fail("Timeout: wait() called but resume() never called.")},(YAHOO.lang.isNumber(b[0])?b[0]:10000))}},setUp:function(){},tearDown:function(){}};YAHOO.tool.TestCase.Wait=function(c,b){this.segment=(YAHOO.lang.isFunction(c)?c:null);this.delay=(YAHOO.lang.isNumber(b)?b:0)}})();YAHOO.namespace("tool");YAHOO.tool.TestSuite=function(a){this.name="";this.items=[];if(YAHOO.lang.isString(a)){this.name=a}else{if(YAHOO.lang.isObject(a)){YAHOO.lang.augmentObject(this,a,true)}}if(this.name===""){this.name=YAHOO.util.Dom.generateId(null,"testSuite")}};YAHOO.tool.TestSuite.prototype={add:function(a){if(a instanceof YAHOO.tool.TestSuite||a instanceof YAHOO.tool.TestCase){this.items.push(a)}},setUp:function(){},tearDown:function(){}};YAHOO.namespace("tool");YAHOO.tool.TestRunner=(function(){function b(c){this.testObject=c;this.firstChild=null;this.lastChild=null;this.parent=null;this.next=null;this.results={passed:0,failed:0,total:0,ignored:0};if(c instanceof YAHOO.tool.TestSuite){this.results.type="testsuite";this.results.name=c.name}else{if(c instanceof YAHOO.tool.TestCase){this.results.type="testcase";this.results.name=c.name}}}b.prototype={appendChild:function(c){var d=new b(c);if(this.firstChild===null){this.firstChild=this.lastChild=d}else{this.lastChild.next=d;this.lastChild=d}d.parent=this;return d}};function a(){a.superclass.constructor.apply(this,arguments);this.masterSuite=new YAHOO.tool.TestSuite("YUI Test Results");this._cur=null;this._root=null;var d=[this.TEST_CASE_BEGIN_EVENT,this.TEST_CASE_COMPLETE_EVENT,this.TEST_SUITE_BEGIN_EVENT,this.TEST_SUITE_COMPLETE_EVENT,this.TEST_PASS_EVENT,this.TEST_FAIL_EVENT,this.TEST_IGNORE_EVENT,this.COMPLETE_EVENT,this.BEGIN_EVENT];for(var c=0;c<d.length;c++){this.createEvent(d[c],{scope:this})}}YAHOO.lang.extend(a,YAHOO.util.EventProvider,{TEST_CASE_BEGIN_EVENT:"testcasebegin",TEST_CASE_COMPLETE_EVENT:"testcasecomplete",TEST_SUITE_BEGIN_EVENT:"testsuitebegin",TEST_SUITE_COMPLETE_EVENT:"testsuitecomplete",TEST_PASS_EVENT:"pass",TEST_FAIL_EVENT:"fail",TEST_IGNORE_EVENT:"ignore",COMPLETE_EVENT:"complete",BEGIN_EVENT:"begin",_addTestCaseToTestTree:function(c,d){var e=c.appendChild(d);for(var f in d){if(f.indexOf("test")===0&&YAHOO.lang.isFunction(d[f])){e.appendChild(f)}}},_addTestSuiteToTestTree:function(c,f){var e=c.appendChild(f);for(var d=0;d<f.items.length;d++){if(f.items[d] instanceof YAHOO.tool.TestSuite){this._addTestSuiteToTestTree(e,f.items[d])}else{if(f.items[d] instanceof YAHOO.tool.TestCase){this._addTestCaseToTestTree(e,f.items[d])}}}},_buildTestTree:function(){this._root=new b(this.masterSuite);this._cur=this._root;for(var c=0;c<this.masterSuite.items.length;c++){if(this.masterSuite.items[c] instanceof YAHOO.tool.TestSuite){this._addTestSuiteToTestTree(this._root,this.masterSuite.items[c])}else{if(this.masterSuite.items[c] instanceof YAHOO.tool.TestCase){this._addTestCaseToTestTree(this._root,this.masterSuite.items[c])}}}},_handleTestObjectComplete:function(c){if(YAHOO.lang.isObject(c.testObject)){c.parent.results.passed+=c.results.passed;c.parent.results.failed+=c.results.failed;c.parent.results.total+=c.results.total;c.parent.results.ignored+=c.results.ignored;c.parent.results[c.testObject.name]=c.results;if(c.testObject instanceof YAHOO.tool.TestSuite){c.testObject.tearDown();this.fireEvent(this.TEST_SUITE_COMPLETE_EVENT,{testSuite:c.testObject,results:c.results})}else{if(c.testObject instanceof YAHOO.tool.TestCase){this.fireEvent(this.TEST_CASE_COMPLETE_EVENT,{testCase:c.testObject,results:c.results})}}}},_next:function(){if(this._cur.firstChild){this._cur=this._cur.firstChild}else{if(this._cur.next){this._cur=this._cur.next}else{while(this._cur&&!this._cur.next&&this._cur!==this._root){this._handleTestObjectComplete(this._cur);this._cur=this._cur.parent}if(this._cur==this._root){this._cur.results.type="report";this._cur.results.timestamp=(new Date()).toLocaleString();this._cur.results.duration=(new Date())-this._cur.results.duration;this.fireEvent(this.COMPLETE_EVENT,{results:this._cur.results});this._cur=null}else{this._handleTestObjectComplete(this._cur);this._cur=this._cur.next}}}return this._cur},_run:function(){var e=false;var d=this._next();if(d!==null){var c=d.testObject;if(YAHOO.lang.isObject(c)){if(c instanceof YAHOO.tool.TestSuite){this.fireEvent(this.TEST_SUITE_BEGIN_EVENT,{testSuite:c});c.setUp()}else{if(c instanceof YAHOO.tool.TestCase){this.fireEvent(this.TEST_CASE_BEGIN_EVENT,{testCase:c})}}if(typeof setTimeout!="undefined"){setTimeout(function(){YAHOO.tool.TestRunner._run()},0)}else{this._run()}}else{this._runTest(d)}}},_resumeTest:function(g){var c=this._cur;var h=c.testObject;var e=c.parent.testObject;if(e.__yui_wait){clearTimeout(e.__yui_wait);delete e.__yui_wait}var k=(e._should.fail||{})[h];var d=(e._should.error||{})[h];var f=false;var i=null;try{g.apply(e);if(k){i=new YAHOO.util.ShouldFail();f=true}else{if(d){i=new YAHOO.util.ShouldError();f=true}}}catch(j){if(j instanceof YAHOO.util.AssertionError){if(!k){i=j;f=true}}else{if(j instanceof YAHOO.tool.TestCase.Wait){if(YAHOO.lang.isFunction(j.segment)){if(YAHOO.lang.isNumber(j.delay)){if(typeof setTimeout!="undefined"){e.__yui_wait=setTimeout(function(){YAHOO.tool.TestRunner._resumeTest(j.segment)},j.delay)}else{throw new Error("Asynchronous tests not supported in this environment.")}}}return}else{if(!d){i=new YAHOO.util.UnexpectedError(j);f=true}else{if(YAHOO.lang.isString(d)){if(j.message!=d){i=new YAHOO.util.UnexpectedError(j);f=true}}else{if(YAHOO.lang.isFunction(d)){if(!(j instanceof d)){i=new YAHOO.util.UnexpectedError(j);f=true}}else{if(YAHOO.lang.isObject(d)){if(!(j instanceof d.constructor)||j.message!=d.message){i=new YAHOO.util.UnexpectedError(j);f=true}}}}}}}}if(f){this.fireEvent(this.TEST_FAIL_EVENT,{testCase:e,testName:h,error:i})}else{this.fireEvent(this.TEST_PASS_EVENT,{testCase:e,testName:h})}e.tearDown();c.parent.results[h]={result:f?"fail":"pass",message:i?i.getMessage():"Test passed",type:"test",name:h};if(f){c.parent.results.failed++}else{c.parent.results.passed++}c.parent.results.total++;if(typeof setTimeout!="undefined"){setTimeout(function(){YAHOO.tool.TestRunner._run()},0)}else{this._run()}},_runTest:function(f){var c=f.testObject;var d=f.parent.testObject;var g=d[c];var e=(d._should.ignore||{})[c];if(e){f.parent.results[c]={result:"ignore",message:"Test ignored",type:"test",name:c};f.parent.results.ignored++;f.parent.results.total++;this.fireEvent(this.TEST_IGNORE_EVENT,{testCase:d,testName:c});if(typeof setTimeout!="undefined"){setTimeout(function(){YAHOO.tool.TestRunner._run()},0)}else{this._run()}}else{d.setUp();this._resumeTest(g)}},fireEvent:function(c,d){d=d||{};d.type=c;a.superclass.fireEvent.call(this,c,d)},add:function(c){this.masterSuite.add(c)},clear:function(){this.masterSuite.items=[]},resume:function(c){this._resumeTest(c||function(){})},run:function(c){var d=YAHOO.tool.TestRunner;d._buildTestTree();d._root.results.duration=(new Date()).getTime();d.fireEvent(d.BEGIN_EVENT);d._run()}});return new a()})();YAHOO.namespace("util");YAHOO.util.Assert={_formatMessage:function(b,a){var c=b;if(YAHOO.lang.isString(b)&&b.length>0){return YAHOO.lang.substitute(b,{message:a})}else{return a}},fail:function(a){throw new YAHOO.util.AssertionError(this._formatMessage(a,"Test force-failed."))},areEqual:function(b,c,a){if(b!=c){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Values should be equal."),b,c)}},areNotEqual:function(a,c,b){if(a==c){throw new YAHOO.util.UnexpectedValue(this._formatMessage(b,"Values should not be equal."),a)}},areNotSame:function(a,c,b){if(a===c){throw new YAHOO.util.UnexpectedValue(this._formatMessage(b,"Values should not be the same."),a)}},areSame:function(b,c,a){if(b!==c){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Values should be the same."),b,c)}},isFalse:function(b,a){if(false!==b){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be false."),false,b)}},isTrue:function(b,a){if(true!==b){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be true."),true,b)}},isNaN:function(b,a){if(!isNaN(b)){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be NaN."),NaN,b)}},isNotNaN:function(b,a){if(isNaN(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Values should not be NaN."),NaN)}},isNotNull:function(b,a){if(YAHOO.lang.isNull(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Values should not be null."),null)}},isNotUndefined:function(b,a){if(YAHOO.lang.isUndefined(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should not be undefined."),undefined)}},isNull:function(b,a){if(!YAHOO.lang.isNull(b)){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be null."),null,b)}},isUndefined:function(b,a){if(!YAHOO.lang.isUndefined(b)){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be undefined."),undefined,b)}},isArray:function(b,a){if(!YAHOO.lang.isArray(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be an array."),b)}},isBoolean:function(b,a){if(!YAHOO.lang.isBoolean(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be a Boolean."),b)}},isFunction:function(b,a){if(!YAHOO.lang.isFunction(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be a function."),b)}},isInstanceOf:function(b,c,a){if(!(c instanceof b)){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value isn't an instance of expected type."),b,c)}},isNumber:function(b,a){if(!YAHOO.lang.isNumber(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be a number."),b)}},isObject:function(b,a){if(!YAHOO.lang.isObject(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be an object."),b)}},isString:function(b,a){if(!YAHOO.lang.isString(b)){throw new YAHOO.util.UnexpectedValue(this._formatMessage(a,"Value should be a string."),b)}},isTypeOf:function(b,c,a){if(typeof c!=b){throw new YAHOO.util.ComparisonFailure(this._formatMessage(a,"Value should be of type "+b+"."),b,typeof c)}}};YAHOO.util.AssertionError=function(a){this.message=a;this.name="AssertionError"};YAHOO.lang.extend(YAHOO.util.AssertionError,Object,{getMessage:function(){return this.message},toString:function(){return this.name+": "+this.getMessage()}});YAHOO.util.ComparisonFailure=function(b,a,c){YAHOO.util.AssertionError.call(this,b);this.expected=a;this.actual=c;this.name="ComparisonFailure"};YAHOO.lang.extend(YAHOO.util.ComparisonFailure,YAHOO.util.AssertionError,{getMessage:function(){return this.message+"\nExpected: "+this.expected+" ("+(typeof this.expected)+")\nActual:"+this.actual+" ("+(typeof this.actual)+")"}});YAHOO.util.UnexpectedValue=function(b,a){YAHOO.util.AssertionError.call(this,b);this.unexpected=a;this.name="UnexpectedValue"};YAHOO.lang.extend(YAHOO.util.UnexpectedValue,YAHOO.util.AssertionError,{getMessage:function(){return this.message+"\nUnexpected: "+this.unexpected+" ("+(typeof this.unexpected)+") "}});YAHOO.util.ShouldFail=function(a){YAHOO.util.AssertionError.call(this,a||"This test should fail but didn't.");this.name="ShouldFail"};YAHOO.lang.extend(YAHOO.util.ShouldFail,YAHOO.util.AssertionError);YAHOO.util.ShouldError=function(a){YAHOO.util.AssertionError.call(this,a||"This test should have thrown an error but didn't.");this.name="ShouldError"};YAHOO.lang.extend(YAHOO.util.ShouldError,YAHOO.util.AssertionError);YAHOO.util.UnexpectedError=function(a){YAHOO.util.AssertionError.call(this,"Unexpected error: "+a.message);this.cause=a;this.name="UnexpectedError";this.stack=a.stack};YAHOO.lang.extend(YAHOO.util.UnexpectedError,YAHOO.util.AssertionError);YAHOO.util.ArrayAssert={contains:function(e,d,b){var c=false;var f=YAHOO.util.Assert;for(var a=0;a<d.length&&!c;a++){if(d[a]===e){c=true}}if(!c){f.fail(f._formatMessage(b,"Value "+e+" ("+(typeof e)+") not found in array ["+d+"]."))}},containsItems:function(c,d,b){for(var a=0;a<c.length;a++){this.contains(c[a],d,b)}},containsMatch:function(e,d,b){if(typeof e!="function"){throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.")}var c=false;var f=YAHOO.util.Assert;for(var a=0;a<d.length&&!c;a++){if(e(d[a])){c=true}}if(!c){f.fail(f._formatMessage(b,"No match found in array ["+d+"]."))}},doesNotContain:function(e,d,b){var c=false;var f=YAHOO.util.Assert;for(var a=0;a<d.length&&!c;a++){if(d[a]===e){c=true}}if(c){f.fail(f._formatMessage(b,"Value found in array ["+d+"]."))}},doesNotContainItems:function(c,d,b){for(var a=0;a<c.length;a++){this.doesNotContain(c[a],d,b)}},doesNotContainMatch:function(e,d,b){if(typeof e!="function"){throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.")}var c=false;var f=YAHOO.util.Assert;for(var a=0;a<d.length&&!c;a++){if(e(d[a])){c=true}}if(c){f.fail(f._formatMessage(b,"Value found in array ["+d+"]."))}},indexOf:function(e,d,a,c){for(var b=0;b<d.length;b++){if(d[b]===e){YAHOO.util.Assert.areEqual(a,b,c||"Value exists at index "+b+" but should be at index "+a+".");return}}var f=YAHOO.util.Assert;f.fail(f._formatMessage(c,"Value doesn't exist in array ["+d+"]."))},itemsAreEqual:function(d,f,c){var a=Math.max(d.length,f.length||0);var e=YAHOO.util.Assert;for(var b=0;b<a;b++){e.areEqual(d[b],f[b],e._formatMessage(c,"Values in position "+b+" are not equal."))}},itemsAreEquivalent:function(e,f,b,d){if(typeof b!="function"){throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.")}var a=Math.max(e.length,f.length||0);for(var c=0;c<a;c++){if(!b(e[c],f[c])){throw new YAHOO.util.ComparisonFailure(YAHOO.util.Assert._formatMessage(d,"Values in position "+c+" are not equivalent."),e[c],f[c])}}},isEmpty:function(c,a){if(c.length>0){var b=YAHOO.util.Assert;b.fail(b._formatMessage(a,"Array should be empty."))}},isNotEmpty:function(c,a){if(c.length===0){var b=YAHOO.util.Assert;b.fail(b._formatMessage(a,"Array should not be empty."))}},itemsAreSame:function(d,f,c){var a=Math.max(d.length,f.length||0);var e=YAHOO.util.Assert;for(var b=0;b<a;b++){e.areSame(d[b],f[b],e._formatMessage(c,"Values in position "+b+" are not the same."))}},lastIndexOf:function(e,d,a,c){var f=YAHOO.util.Assert;for(var b=d.length;b>=0;b--){if(d[b]===e){f.areEqual(a,b,f._formatMessage(c,"Value exists at index "+b+" but should be at index "+a+"."));return}}f.fail(f._formatMessage(c,"Value doesn't exist in array."))}};YAHOO.namespace("util");YAHOO.util.ObjectAssert={propertiesAreEqual:function(d,g,c){var f=YAHOO.util.Assert;var b=[];for(var e in d){b.push(e)}for(var a=0;a<b.length;a++){f.isNotUndefined(g[b[a]],f._formatMessage(c,"Property '"+b[a]+"' expected."))}},hasProperty:function(a,b,c){if(!(a in b)){var d=YAHOO.util.Assert;d.fail(d._formatMessage(c,"Property '"+a+"' not found on object."))}},hasOwnProperty:function(a,b,c){if(!YAHOO.lang.hasOwnProperty(b,a)){var d=YAHOO.util.Assert;d.fail(d._formatMessage(c,"Property '"+a+"' not found on object instance."))}}};YAHOO.util.DateAssert={datesAreEqual:function(b,d,a){if(b instanceof Date&&d instanceof Date){var c=YAHOO.util.Assert;c.areEqual(b.getFullYear(),d.getFullYear(),c._formatMessage(a,"Years should be equal."));c.areEqual(b.getMonth(),d.getMonth(),c._formatMessage(a,"Months should be equal."));c.areEqual(b.getDate(),d.getDate(),c._formatMessage(a,"Day of month should be equal."))}else{throw new TypeError("DateAssert.datesAreEqual(): Expected and actual values must be Date objects.")}},timesAreEqual:function(b,d,a){if(b instanceof Date&&d instanceof Date){var c=YAHOO.util.Assert;c.areEqual(b.getHours(),d.getHours(),c._formatMessage(a,"Hours should be equal."));c.areEqual(b.getMinutes(),d.getMinutes(),c._formatMessage(a,"Minutes should be equal."));c.areEqual(b.getSeconds(),d.getSeconds(),c._formatMessage(a,"Seconds should be equal."))}else{throw new TypeError("DateAssert.timesAreEqual(): Expected and actual values must be Date objects.")}}};YAHOO.register("yuitest_core",YAHOO.tool.TestRunner,{version:"2.8.2r1",build:"7"});