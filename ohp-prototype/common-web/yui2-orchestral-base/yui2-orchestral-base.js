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
YUI.add('yui2-orchestral-base', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * Base module that sets up page to be in the correct state for later modules to load.
 *
 * The intention of this module is that it has no dependencies and is loaded before the skin CSS.
 *
 * @module orchestral-base
 */

/*global document, window, alert, setTimeout */
(function() {
	'use strict';

	// Adapted from http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
	// This method is symmetrical with that defined in orchestral.js
	// NOTE: DO NOT REMOVE THIS CODE - It is required to guard against incorrect usage of old browsers
	(function() {
		var ieVersion = 3,
			div = document.createElement('div'),
			all = div.getElementsByTagName('i');

		do {
			div.innerHTML = '<!--[if gt IE ' + (++ieVersion) + ']><i></i><![endif]-->';
		} while (all[0]); // HTMLCollections are live; they are automatically updated when the underlying document is changed

		// it's IE
		if (ieVersion >= 6) {
			// if a documentMode has been specified, then use that mode to style the page, regardless of the browser mode
			if (document.documentMode) {
				ieVersion = document.documentMode;
			}

			// its an old version of IE
			if (ieVersion <= 8) {
				// Need a leading space so that the class name doesn't get added onto the end of any existing class name.
				document.documentElement.className += ' oldie ie' + ieVersion;
			}
		}

		// All browsers will get to a value of at least 4 for ieVersion during detection, if it's more than that its actually IE
		// Duplicate logic also appears in orchestral.js in case this file isn't included because they aren't using out:include or similar
		if (ieVersion > 4 && ieVersion <= 6) {

			(function() {

				var getOhpWebBase,
					displayNotificationAlert,
					ohpWebBase;

				getOhpWebBase = function() {
					var jsPath = 'orchestral-base/orchestral-base.js',
						orchestralBaseJsRegExp = new RegExp( '(^.*/common-web/)' + jsPath + '$'),
						scripts = document.getElementsByTagName('script'),
						i,
						scriptSrc,
						match;

					// Go backwards, because since this is the currently executing script, it will be the last one.
					// (and its more performant not evaluating length each time)
					for (i = scripts.length - 1; i >= 0; i -= 1) {
						scriptSrc = scripts.item(i).src;
						if (scriptSrc) {
							match = orchestralBaseJsRegExp.exec(scriptSrc);
							if (match) {
								return match[1]; // path to OHP Web context from root
							}
						}
					}
				};

				// Displays an untranslated fallback alert message if can't redirect to translated page
				displayNotificationAlert = function() {
					var notification = 'This content is not displayed because the browser you are using (Internet Explorer 6) is no' +
									'longer supported. Please update to a later version of Internet Explorer or use a different ' +
									'browser.\n\nDetails:\nThe current version of OHP Web (the Orion Health common web library) no ' +
									'longer supports Internet Explorer 6.\nIf you were not expecting this page, it is possible that a' +
									'newly installed component has upgraded OHP Web.';
					alert(notification);
				};

				ohpWebBase = getOhpWebBase();
				if (ohpWebBase) {
					// just in case onbeforeunload exists and will prevent the redirect
					window.onbeforeunload = null;
					// in case the redirect didn't work and we are still here, notify in an alert
					setTimeout(displayNotificationAlert, 2000);
					try {
						window.location.replace(ohpWebBase + 'unsupported-browser.jsp?url=' + encodeURIComponent(window.location.href));
					} catch (err) {
						// ignore, can happen if cancelling an attached onbeforeunload event listener, rely on above timeout
					}
				} else {
					// If can't work out where to redirect to
					displayNotificationAlert();
				}
			}());
		}
	}());
}());


}, '7.9.0');
