/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/panel/panel.js']) {
   __coverage__['build/panel/panel.js'] = {"path":"build/panel/panel.js","s":{"1":0,"2":0,"3":0},"b":{},"f":{"1":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":36}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":112,"column":3}},"2":{"start":{"line":13,"column":0},"end":{"line":13,"column":51}},"3":{"start":{"line":37,"column":0},"end":{"line":96,"column":3}}},"branchMap":{},"code":["(function () { YUI.add('panel', function (Y, NAME) {","","// TODO: Change this description!","/**","Provides a Panel widget, a widget that mimics the functionality of a regular OS","window. Comes with Standard Module support, XY Positioning, Alignment Support,","Stack (z-index) support, modality, auto-focus and auto-hide functionality, and","header/footer button support.","","@module panel","**/","","var getClassName = Y.ClassNameManager.getClassName;","","// TODO: Change this description!","/**","A basic Panel Widget, which can be positioned based on Page XY co-ordinates and","is stackable (z-index support). It also provides alignment and centering support","and uses a standard module format for it's content, with header, body and footer","section support. It can be made modal, and has functionality to hide and focus","on different events. The header and footer sections can be modified to allow for","button support.","","@class Panel","@constructor","@extends Widget","@uses WidgetAutohide","@uses WidgetButtons","@uses WidgetModality","@uses WidgetPosition","@uses WidgetPositionAlign","@uses WidgetPositionConstrain","@uses WidgetStack","@uses WidgetStdMod","@since 3.4.0"," */","Y.Panel = Y.Base.create('panel', Y.Widget, [","    // Other Widget extensions depend on these two.","    Y.WidgetPosition,","    Y.WidgetStdMod,","","    Y.WidgetAutohide,","    Y.WidgetButtons,","    Y.WidgetModality,","    Y.WidgetPositionAlign,","    Y.WidgetPositionConstrain,","    Y.WidgetStack","], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Collection of predefined buttons mapped from name => config.","","    Panel includes a \"close\" button which can be use by name. When the close","    button is in the header (which is the default), it will look like: [x].","","    See `addButton()` for a list of possible configuration values.","","    @example","        // Panel with close button in header.","        var panel = new Y.Panel({","            buttons: ['close']","        });","","        // Panel with close button in footer.","        var otherPanel = new Y.Panel({","            buttons: {","                footer: ['close']","            }","        });","","    @property BUTTONS","    @type Object","    @default {close: {}}","    @since 3.5.0","    **/","    BUTTONS: {","        close: {","            label  : 'Close',","            action : 'hide',","            section: 'header',","","            // Uses `type=\"button\"` so the button's default action can still","            // occur but it won't cause things like a form to submit.","            template  : '<button type=\"button\" />',","            classNames: getClassName('button', 'close')","        }","    }","}, {","    ATTRS: {","        // TODO: API Docs.","        buttons: {","            value: ['close']","        }","    }","});","","","}, '3.17.2', {","    \"requires\": [","        \"widget\",","        \"widget-autohide\",","        \"widget-buttons\",","        \"widget-modality\",","        \"widget-position\",","        \"widget-position-align\",","        \"widget-position-constrain\",","        \"widget-stack\",","        \"widget-stdmod\"","    ],","    \"skinnable\": true","});","","}());"]};
}
var __cov_10weLx3bojCGZEmv$aKmKg = __coverage__['build/panel/panel.js'];
__cov_10weLx3bojCGZEmv$aKmKg.s['1']++;YUI.add('panel',function(Y,NAME){__cov_10weLx3bojCGZEmv$aKmKg.f['1']++;__cov_10weLx3bojCGZEmv$aKmKg.s['2']++;var getClassName=Y.ClassNameManager.getClassName;__cov_10weLx3bojCGZEmv$aKmKg.s['3']++;Y.Panel=Y.Base.create('panel',Y.Widget,[Y.WidgetPosition,Y.WidgetStdMod,Y.WidgetAutohide,Y.WidgetButtons,Y.WidgetModality,Y.WidgetPositionAlign,Y.WidgetPositionConstrain,Y.WidgetStack],{BUTTONS:{close:{label:'Close',action:'hide',section:'header',template:'<button type="button" />',classNames:getClassName('button','close')}}},{ATTRS:{buttons:{value:['close']}}});},'3.17.2',{'requires':['widget','widget-autohide','widget-buttons','widget-modality','widget-position','widget-position-align','widget-position-constrain','widget-stack','widget-stdmod'],'skinnable':true});
