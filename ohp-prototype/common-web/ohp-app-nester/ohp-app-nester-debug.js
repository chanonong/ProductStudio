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
YUI.add('ohp-app-nester', function (Y, NAME) {

"use strict";
/**
Y.App Extension for a Y.App that nests other apps inside it, where an app can be a simple Y.View or a Y.App that optionally mixes in the
Y.OHP.AppNestable extension for additional functionality. Provides a function for constructing, rendering and dispatching a nested app
(ensuring the appropriate configuration) and a function for uprooting a nested app.

@module ohp-app-nester
@class AppNester
@constructor
@namespace OHP
**/
function AppNester() {
}

AppNester.prototype = {

	/**
	Nests the specified app inside this Y.App. The provided app (constructor function) will be constructed, rendered and dispatched (if
	applicable). This Y.App will be added as an EventTarget for the nested app.

	Note: it is the responsibility of the user to uproot the nested app when it is no longer required (in this Y.App's destructor
	function, for example). See `AppNester._uprootApp()` for more information.

	@method _nestApp
	@protected
	@param {Function} AppConstructorFn constructor function for constructing the nested app.
	@param {String} rootPathToApp context path to the nested app (including this Y.App's `root`)
	@param {Object} [config] additional config to pass to the constructor of the nested app. Note that the `root` and `linkSelector`
		config options will be ignored if provided.
		@param {HTMLElement|Node|String} [config.container] The node into which this app will be rendered. If not provided, it will default
			to this Y.App's `viewContainer`.

	@return {App} the instance of the given app that has been nested in this Y.App
	**/
	_nestApp: function(AppConstructorFn, rootPathToApp, config) {

		var appConfig,
			app;

		appConfig = {
			root: rootPathToApp,
			// Null out the linkSelector as only the top level Y.App should be listening for Pjax link clicks.
			// See http://yuilibrary.com/yui/docs/app/#known-limitations for more info.
			linkSelector: null
		};

		if (config) {
			appConfig = Y.merge(config, appConfig);
		}

		if (!appConfig.container) {
			appConfig.container = this.get('viewContainer');
		}

		if (!this.get('html5')) {
			// Use a separate attribute to build up PJAX links as we've lied to the nested app about what its root is
			appConfig.pjaxRootPath = appConfig.root;

			// Remove the top level Y.App's 'root' from the beginning of the sub-app's 'root' otherwise clicking on sub-links results in the
			// wrong path appended after the /#
			appConfig.root = this.removeRoot(appConfig.root);
		}

		Y.log('Y.OHP.AppNester loading App at "' + rootPathToApp + '". AppNester root: "' + appConfig.root + '"', 'debug');

		app = new AppConstructorFn(appConfig);

		app.addTarget(this);

		app.render();

		if (typeof (app.dispatch) === 'function'){
			app.dispatch();
		}

		return app;
	},

	/**
	Uproots the given app, removing this Y.App as an EventTarget and destroying the app.

	@method _uprootApp
	@protected
	@param {App} app instance of the nested app inside this Y.App to uproot
	**/
	_uprootApp: function(app) {
		app.removeTarget(this);
		app.destroy();
	}
};

Y.namespace('OHP').AppNester = AppNester;


}, '7.9.0', {"requires": []});
