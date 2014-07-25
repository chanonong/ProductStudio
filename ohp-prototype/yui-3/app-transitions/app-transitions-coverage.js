/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/app-transitions/app-transitions.js']) {
   __coverage__['build/app-transitions/app-transitions.js'] = {"path":"build/app-transitions/app-transitions.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":46}}},"2":{"name":"AppTransitions","line":40,"loc":{"start":{"line":40,"column":0},"end":{"line":40,"column":26}}},"3":{"name":"(anonymous_3)","line":222,"loc":{"start":{"line":222,"column":21},"end":{"line":222,"column":44}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":242,"column":41}},"2":{"start":{"line":40,"column":0},"end":{"line":40,"column":28}},"3":{"start":{"line":42,"column":0},"end":{"line":60,"column":2}},"4":{"start":{"line":76,"column":0},"end":{"line":91,"column":2}},"5":{"start":{"line":93,"column":0},"end":{"line":231,"column":2}},"6":{"start":{"line":223,"column":8},"end":{"line":223,"column":46}},"7":{"start":{"line":225,"column":8},"end":{"line":227,"column":9}},"8":{"start":{"line":226,"column":12},"end":{"line":226,"column":43}},"9":{"start":{"line":229,"column":8},"end":{"line":229,"column":27}},"10":{"start":{"line":234,"column":0},"end":{"line":234,"column":35}},"11":{"start":{"line":235,"column":0},"end":{"line":235,"column":36}},"12":{"start":{"line":237,"column":0},"end":{"line":239,"column":3}}},"branchMap":{"1":{"line":225,"type":"if","locations":[{"start":{"line":225,"column":8},"end":{"line":225,"column":8}},{"start":{"line":225,"column":8},"end":{"line":225,"column":8}}]},"2":{"line":225,"type":"binary-expr","locations":[{"start":{"line":225,"column":12},"end":{"line":225,"column":23}},{"start":{"line":225,"column":27},"end":{"line":225,"column":47}}]}},"code":["(function () { YUI.add('app-transitions', function (Y, NAME) {","","/**","`Y.App` extension that provides view transitions in browsers which support","native CSS3 transitions.","","@module app","@submodule app-transitions","@since 3.5.0","**/","","/**","`Y.App` extension that provides view transitions in browsers which support","native CSS3 transitions.","","View transitions provide an nice way to move from one \"page\" to the next that is","both pleasant to the user and helps to communicate a hierarchy between sections","of an application.","","When the `\"app-transitions\"` module is used, it will automatically mix itself","into `Y.App` and transition between `activeView` changes using the following","effects:","","  - **`fade`**: Cross-fades between the old an new active views.","","  - **`slideLeft`**: The old and new active views are positioned next to each","    other and both slide to the left.","","  - **`slideRight`**: The old and new active views are positioned next to each","    other and both slide to the right.","","**Note:** Transitions are an opt-in feature and are enabled via an app's","`transitions` attribute.","","@class App.Transitions","@uses App.TransitionsNative","@extensionfor App","@since 3.5.0","**/","function AppTransitions() {}","","AppTransitions.ATTRS = {","    /**","    Whether or not this application should use view transitions, and if so then","    which ones or `true` for the defaults which are specified by the","    `transitions` prototype property.","","    **Note:** Transitions are an opt-in feature and will only be used in","    browsers which support native CSS3 transitions.","","    @attribute transitions","    @type Boolean|Object","    @default false","    @since 3.5.0","    **/","    transitions: {","        setter: '_setTransitions',","        value : false","    }","};","","/**","Collect of transitions -> fx.","","A transition (e.g. \"fade\") is a simple name given to a configuration of fx to","apply, consisting of `viewIn` and `viewOut` properties who's values are names of","fx registered on `Y.Transition.fx`.","","By default transitions: `fade`, `slideLeft`, and `slideRight` have fx defined.","","@property FX","@type Object","@static","@since 3.5.0","**/","AppTransitions.FX = {","    fade: {","        viewIn : 'app:fadeIn',","        viewOut: 'app:fadeOut'","    },","","    slideLeft: {","        viewIn : 'app:slideLeft',","        viewOut: 'app:slideLeft'","    },","","    slideRight: {","        viewIn : 'app:slideRight',","        viewOut: 'app:slideRight'","    }","};","","AppTransitions.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Default transitions to use when the `activeView` changes.","","    The following are types of changes for which transitions can be defined that","    correspond to the relationship between the new and previous `activeView`:","","      * `navigate`: The default transition to use when changing the `activeView`","        of the application.","","      * `toChild`: The transition to use when the new `activeView` is configured","        as a child of the previously active view via its `parent` property as","        defined in this app's `views`.","","      * `toParent`: The transition to use when the new `activeView` is","        configured as the `parent` of the previously active view as defined in","        this app's `views`.","","    **Note:** Transitions are an opt-in feature and will only be used in","    browsers which support native CSS3 transitions.","","    @property transitions","    @type Object","    @default","        {","            navigate: 'fade',","            toChild : 'slideLeft',","            toParent: 'slideRight'","        }","    @since 3.5.0","    **/","    transitions: {","        navigate: 'fade',","        toChild : 'slideLeft',","        toParent: 'slideRight'","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Sets which view is active/visible for the application. This will set the","    app's `activeView` attribute to the specified `view`.","","    The `view` will be \"attached\" to this app, meaning it will be both rendered","    into this app's `viewContainer` node and all of its events will bubble to","    the app. The previous `activeView` will be \"detached\" from this app.","","    When a string-name is provided for a view which has been registered on this","    app's `views` object, the referenced metadata will be used and the","    `activeView` will be set to either a preserved view instance, or a new","    instance of the registered view will be created using the specified `config`","    object passed-into this method.","","    A callback function can be specified as either the third or fourth argument,","    and this function will be called after the new `view` becomes the","    `activeView`, is rendered to the `viewContainer`, and is ready to use.","","    @example","        var app = new Y.App({","            views: {","                usersView: {","                    // Imagine that `Y.UsersView` has been defined.","                    type: Y.UsersView","                }","            },","","            transitions: true,","            users      : new Y.ModelList()","        });","","        app.route('/users/', function () {","            this.showView('usersView', {users: this.get('users')});","        });","","        app.render();","        app.navigate('/uses/');","        // => Creates a new `Y.UsersView` and transitions to it.","","    @method showView","    @param {String|View} view The name of a view defined in the `views` object,","        or a view instance which should become this app's `activeView`.","    @param {Object} [config] Optional configuration to use when creating a new","        view instance. This config object can also be used to update an existing","        or preserved view's attributes when `options.update` is `true`.","    @param {Object} [options] Optional object containing any of the following","        properties:","      @param {Function} [options.callback] Optional callback function to call","        after new `activeView` is ready to use, the function will be passed:","          @param {View} options.callback.view A reference to the new","            `activeView`.","      @param {Boolean} [options.prepend=false] Whether the `view` should be","        prepended instead of appended to the `viewContainer`.","      @param {Boolean} [options.render] Whether the `view` should be rendered.","        **Note:** If no value is specified, a view instance will only be","        rendered if it's newly created by this method.","      @param {Boolean|String} [options.transition] Optional transition override.","        A transition can be specified which will override the default, or","        `false` for no transition.","      @param {Boolean} [options.update=false] Whether an existing view should","        have its attributes updated by passing the `config` object to its","        `setAttrs()` method. **Note:** This option does not have an effect if","        the `view` instance is created as a result of calling this method.","    @param {Function} [callback] Optional callback Function to call after the","        new `activeView` is ready to use. **Note:** this will override","        `options.callback` and it can be specified as either the third or fourth","        argument. The function will be passed the following:","      @param {View} callback.view A reference to the new `activeView`.","    @chainable","    @since 3.5.0","    **/","    // Does not override `showView()` but does use `options.transitions`.","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Setter for `transitions` attribute.","","    When specified as `true`, the defaults will be use as specified by the","    `transitions` prototype property.","","    @method _setTransitions","    @param {Boolean|Object} transitions The new `transitions` attribute value.","    @return {Mixed} The processed value which represents the new state.","    @protected","    @see App.Base.showView()","    @since 3.5.0","    **/","    _setTransitions: function (transitions) {","        var defTransitions = this.transitions;","","        if (transitions && transitions === true) {","            return Y.merge(defTransitions);","        }","","        return transitions;","    }","};","","// -- Namespace ----------------------------------------------------------------","Y.App.Transitions = AppTransitions;","Y.Base.mix(Y.App, [AppTransitions]);","","Y.mix(Y.App.CLASS_NAMES, {","    transitioning: Y.ClassNameManager.getClassName('app', 'transitioning')","});","","","}, '3.17.2', {\"requires\": [\"app-base\"]});","","}());"]};
}
var __cov_2_u5xavh62mdqarWSEoI8Q = __coverage__['build/app-transitions/app-transitions.js'];
__cov_2_u5xavh62mdqarWSEoI8Q.s['1']++;YUI.add('app-transitions',function(Y,NAME){__cov_2_u5xavh62mdqarWSEoI8Q.f['1']++;__cov_2_u5xavh62mdqarWSEoI8Q.s['2']++;function AppTransitions(){__cov_2_u5xavh62mdqarWSEoI8Q.f['2']++;}__cov_2_u5xavh62mdqarWSEoI8Q.s['3']++;AppTransitions.ATTRS={transitions:{setter:'_setTransitions',value:false}};__cov_2_u5xavh62mdqarWSEoI8Q.s['4']++;AppTransitions.FX={fade:{viewIn:'app:fadeIn',viewOut:'app:fadeOut'},slideLeft:{viewIn:'app:slideLeft',viewOut:'app:slideLeft'},slideRight:{viewIn:'app:slideRight',viewOut:'app:slideRight'}};__cov_2_u5xavh62mdqarWSEoI8Q.s['5']++;AppTransitions.prototype={transitions:{navigate:'fade',toChild:'slideLeft',toParent:'slideRight'},_setTransitions:function(transitions){__cov_2_u5xavh62mdqarWSEoI8Q.f['3']++;__cov_2_u5xavh62mdqarWSEoI8Q.s['6']++;var defTransitions=this.transitions;__cov_2_u5xavh62mdqarWSEoI8Q.s['7']++;if((__cov_2_u5xavh62mdqarWSEoI8Q.b['2'][0]++,transitions)&&(__cov_2_u5xavh62mdqarWSEoI8Q.b['2'][1]++,transitions===true)){__cov_2_u5xavh62mdqarWSEoI8Q.b['1'][0]++;__cov_2_u5xavh62mdqarWSEoI8Q.s['8']++;return Y.merge(defTransitions);}else{__cov_2_u5xavh62mdqarWSEoI8Q.b['1'][1]++;}__cov_2_u5xavh62mdqarWSEoI8Q.s['9']++;return transitions;}};__cov_2_u5xavh62mdqarWSEoI8Q.s['10']++;Y.App.Transitions=AppTransitions;__cov_2_u5xavh62mdqarWSEoI8Q.s['11']++;Y.Base.mix(Y.App,[AppTransitions]);__cov_2_u5xavh62mdqarWSEoI8Q.s['12']++;Y.mix(Y.App.CLASS_NAMES,{transitioning:Y.ClassNameManager.getClassName('app','transitioning')});},'3.17.2',{'requires':['app-base']});
