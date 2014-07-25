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
YUI.add('yui2-orchestral', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, window, document, setTimeout, clearTimeout, alert*/

/**
* The ORCHESTRAL object is the single global object used by OHP Web.
*
* @module orchestral
* @title ORCHESTRAL
* @requires yahoo, dom, event
*/
YAHOO.namespace('ORCHESTRAL', 'ORCHESTRAL.util', 'ORCHESTRAL.lang');

var ORCHESTRAL = YAHOO.ORCHESTRAL;

(function() {
	'use strict';

	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		HTML_CHARS = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;',
			'`': '&#x60;'
		};

	// Yes please. Otherwise errors in event handers get swallowed into the void.
	YAHOO.util.Event.throwErrors = true;

	/**
	 * @class ORCHESTRAL
	 */

	/**
	 * Server context root for the YUI 2 application.
	 *
	 * @property YUI_2_CONTEXT
	 * @static
	 * @type String
	 */
	ORCHESTRAL.YUI_2_CONTEXT = '/yui-2.8';

	/**
	 * Server context root for the OHP Web application.
	 *
	 * @property COMMON_WEB_CONTEXT
	 * @static
	 * @type String
	 */
	ORCHESTRAL.COMMON_WEB_CONTEXT = '/common-web';

	// Check script elements in page to ensure that YUI_2_CONTEXT and COMMON_WEB_CONTEXT are correct and have correct node and context
	// prefixes, etc. YUI 2's event.js and orchestral.js (this file) must have been loaded.
	(function() {
		var scriptElements = Dom.getElementsBy(function() { return true; }, 'script');

		Dom.batch(scriptElements, function(el, regExp) {
			var srcAttribute = el.getAttribute('src');

			if (srcAttribute && regExp.exec(srcAttribute)) {
				ORCHESTRAL.YUI_2_CONTEXT = srcAttribute.slice(0, -1 * '/event/event.js'.length);
			}
		}, new RegExp('(/yui-2.\\d+)/event/event.js$'));

		Dom.batch(scriptElements, function(el, regExp) {
			var srcAttribute = el.getAttribute('src');

			if (srcAttribute && regExp.exec(srcAttribute)) {
				ORCHESTRAL.COMMON_WEB_CONTEXT = srcAttribute.slice(0, -1 * '/orchestral/orchestral.js'.length);
			}
		}, new RegExp('(/common-web)/orchestral/orchestral.js$'));
	}());

	/**
	 * Executes a function after ensuring that its required modules and their dependencies are available., e.g:
	 *
	 * ORCHESTRAL.use(['orchestral-datetime'], function() {
	 *	new ORCHESTRAL.widget.DateTime('date');
	 * });
	 *
	 * It is recommended that your page include the orchestral-loader module before calling this method.
	 *
	 * @method use
	 * @static
	 * @param modules {String[]} Modules to load.
	 * @param callback {Function} Function that is called when modules have loaded.
	 */
	ORCHESTRAL.use = function(modules, callback) {

		// Fallback implementation if page author has not loaded the orchestral-loader module.
		// Once orchestral-loader has been loaded, ORCHESTRAL.use implementation will be replaced by orchestral-loader.
		var loader = new YAHOO.util.YUILoader({
			allowRollup: true,
			base: ORCHESTRAL.YUI_2_CONTEXT + '/'
		});

		loader.addModule({
			name: 'orchestral-loader',
			fullpath: ORCHESTRAL.COMMON_WEB_CONTEXT + '/loader/loader.js',
			type: 'js'
			// We don't need to define requires because orchestral-loader's requirements (yuiloader and orchestral) must already be loaded.
		});

		loader.require('orchestral-loader');

		loader.insert({
			onSuccess: function() {
				ORCHESTRAL.util.Loader.load(modules, callback);
			}
		});
	};

	/**
	 * ORCHESTRAL.env is used to keep track of what is known about the browsing environment. This is provided because the
	 * YAHOO.env.ua.ie version reported for IE 8 can vary depending if the page is displayed in the intranet or internet zone.
	 *
	 * See http://rumsby.name/blog/posts/2009/08/12/IE+8+and+the+User+Agent+String and http://yuilibrary.com/projects/yui2/ticket/2528313
	 * for more details.
	 *
	 * @class ORCHESTRAL.env
	 * @static
	 */
	ORCHESTRAL.env = {
		ua: YAHOO.lang.merge(YAHOO.env.ua, {
			ie: document.documentMode ? document.documentMode : YAHOO.env.ua.ie
		})
	};

	if (ORCHESTRAL.env.ua.ie && ORCHESTRAL.env.ua.ie < 9) {
		// Even though the orchestral-base module does this we do this here again to support the situation where people include
		// orchestral.js directly rather than via ClientResourceHelper. Dom.addClass calls Dom.hasClass internally so we just call addClass.
		Dom.addClass(document.documentElement, 'ie' + ORCHESTRAL.env.ua.ie);

		// Duplicate logic also appears in orchestral-base.js, here too in case this is included without using the out:include or similar
		// NOTE: DO NOT REMOVE THIS CODE - It is required to guard against incorrect usage of old browsers
		if (ORCHESTRAL.env.ua.ie === 6) {
			(function() {

				var getOhpWebBase,
					displayNotificationAlert,
					ohpWebBase;

				getOhpWebBase = function() {
					var jsPath = 'orchestral/orchestral.js',
						orchestralBaseJsRegExp = new RegExp('(^.*/common-web/)' + jsPath + '$'),
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
					// Just in case onbeforeunload exists and will prevent the redirect
					window.onbeforeunload = null;
					// In case the redirect didn't work and we are still here, notify in an alert
					setTimeout(displayNotificationAlert, 2000);
					try {
						window.location.replace(ohpWebBase + 'unsupported-browser.jsp?url=' + encodeURIComponent(window.location.href));
					} catch (err) {
						// Ignore, can happen if cancelling an attached onbeforeunload event listener, rely on above timeout
					}
				} else {
					// If can't work out where to redirect to
					displayNotificationAlert();
				}
			}());
		}
	}

	/**
	 * Provides additional lang functions not available in YAHOO.lang.
	 *
	 * @class lang
	 * @namespace ORCHESTRAL
	 */
	ORCHESTRAL.lang = {

		/**
		 * Returns true if an array contains the value supplied. Does not use coercive equals.
		 *
		 * @param needle {Object} The value to look for.
		 * @param haystack {Array} The array to search for the value in.
		 * @return {Boolean} Whether the value was found.
		 */
		contains: function(needle, haystack) {
			var i;

			for (i = 0; i < haystack.length; i += 1) {
				if (haystack[i] === needle) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Escapes HTML to prevent XSS attacks and other issues with using unescaped HTML.
		 *
		 * @param html {String} The HTML string to escape.
		 * @return {String} The escaped string.
		 * @deprecated Use Y.Escape.html provided by YUI 3 instead.
		 */
		escapeHtml: function(html) {
			// As implemented in YUI 2.9.0
			return html.replace(/[&<>"'\/`]/g, function (match) {
				return HTML_CHARS[match];
			});
		},

		/**
		 * Escapes any special regex characters in the given string.
		 *
		 * @param s {String} The string to escape.
		 * @return {String} The escaped string.
		 */
		escapeRegex: function(s) {
			// From http://simonwillison.net/2006/Jan/20/escape/#c32703
			return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
		},

		/**
		 * Filters an array of elements using the given filter function.
		 * The function must return a boolean value that indicates whether the an array item should be included.
		 *
		 * @param array {Array} The array to filter.
		 * @param fn {Function} The function to filter the array items.
		 * @return {Array} The filtered array.
		 */
		filter: function(array, fn) {
			var results = [],
				i;

			for (i = 0; i < array.length; i += 1) {
				if (fn(array[i])) {
					results.push(array[i]);
				}
			}
			return results;
		}
	};

	/**
	 * A utility for managing localised objects in static JavaScript files.
	 *
	 * @class Locale
	 * @namespace ORCHESTRAL.util
	 */

	ORCHESTRAL.util.Locale = (function() {

		/**
		 * @property local
		 * @private
		 */
		var localisations = {};

		return {

			/**
			 * Registers the given localised object with the locale utility for use in the current page.
			 *
			 * @param key {String} The key of the localised object to register.
			 * @param localisation {Object} The localised object to register.
			 */
			put: function(key, localisation) {
				localisations[key] = localisation;
			},

			/**
			 * Registers all the given localised objects with the locale utility for use in the current page.
			 *
			 * @param o {Object} An object containing the keys and corresponding localised objects to register.
			 */
			putAll: function(o) {
				localisations = YAHOO.lang.merge(localisations, o);
			},

			/**
			 * Retrieves a localised object. Any additional arguments to the method will be used to format the localised object using
			 * YAHOO.lang.substitute.
			 *
			 * @param key {String} The key of the localised object to retrieve.
			 * @return {Object} The localised object.
			 */
			get: function(key) {
				var localisation = localisations[key],

					// localisations loaded by orchestral-locale module
					globalLocalisations = window.ORCHESTRAL_LOCALISATIONS;

				if (YAHOO.lang.isUndefined(localisation) && !YAHOO.lang.isUndefined(globalLocalisations)) {
					// Look for the requested translation from the global dynamic client translations. The ORCHESTRAL_LOCALISATIONS global
					// is provided by the orchestral-locale module published by the com.orchestral.core.web.support bundle.
					localisation = globalLocalisations[key];
				}
				if (YAHOO.lang.isUndefined(localisation)) {
					return '???' + key + '???';
				} else if (arguments.length === 1) {
					return localisation;
				}
				// The arguments object isn't a true array so we call Array's slice method on the arguments object to make a copy of it,
				// returning a true array.
				return YAHOO.lang.substitute(localisation, Array.prototype.slice.call(arguments).slice(1));
			}
		};
	}());

	/**
	 * A unified place to put and retrieve JavaScript objects by key.
	 *
	 * @class Registry
	 * @namespace ORCHESTRAL.util
	 */
	ORCHESTRAL.util.Registry = window.ORCHESTRAL_REGISTRY || (function() {

		/**
		 * @property registry
		 * @private
		 */
		var registry = {};

		return {

			/**
			 * The event fired when an object is put into this registry.
			 *
			 * @event putEvent
			 */
			putEvent: new YAHOO.util.CustomEvent("putEvent", this),

			/**
			 * Puts the object into the registry under the type and key.
			 * If the key is a reference to an element and it doesn't have an ID then an ID will be generated for it.
			 *
			 * @param type {Object}
			 * @param key {String|HTMLElement}
			 * @param value {Object}
			 */
			put: function(type, key, value) {
				if (key && key.tagName) {
					key = key.id ? key.id : Dom.generateId(key);
				}
				if (registry[type] === undefined) {
					registry[type] = {};
				}
				registry[type][key] = value;

				this.putEvent.fire({type: type, key: key, value: value});
			},

			/**
			 * Gets the object from the registry if the requested bucket exists. Returns null if either type of key aren't there.
			 *
			 * @param type {Object}
			 * @param key {String|HTMLElement} (optional)
			 * @return {Object}
			 */
			get: function(type, key) {
				if (key && key.tagName && key.id) {
					key = key.id;
				}

				if (registry[type] === undefined) {
					return null;
				} else if (key === undefined) {
					return registry[type];
				}
				return registry[type][key] === undefined ? null : registry[type][key];
			},

			/**
			 * Clears the supplied bucket from the registry, or the whole registry if no bucket is supplied. If a bucket is empty after a
			 * delete, it will also delete the bucket.
			 *
			 * @param type {Object} (optional)
			 * @param key {String} (optional)
			 */
			clear: function(type, key) {
				var k;

				if (type === undefined) {
					registry = {};
				} else if (key === undefined) {
					delete registry[type];
				} else {
					delete registry[type][key];
					for (k in registry[type]) {
						if (registry[type].hasOwnProperty(k)) {
							// The bucket is not empty.
							return;
						}
					}
					delete registry[type];
				}
			},

			/**
			 * Runs the supplied function on each instance of the supplied type.
			 *
			 * @param type {Object}
			 * @param fn {Function}
			 */
			batch: function(type, fn) {
				var items = this.get(type),
					count = 0,
					item;

				for (item in items) {
					if (items.hasOwnProperty(item)) {
						count += 1;
						fn(items[item], count);
					}
				}
				return items;
			}
		};
	}());

	window.ORCHESTRAL_REGISTRY = ORCHESTRAL.util.Registry;

	Event.on(window, 'unload', ORCHESTRAL.util.Registry.clear);

	/**
	 * Provides helper methods for working with Events that aren't provided by YAHOO.util.Event.
	 *
	 * @class Event
	 * @namespace ORCHESTRAL.util
	 */
	ORCHESTRAL.util.Event = {

		/**
		 * Debounce allows you to execute a function once, ignoring subsequent calls to the function for as long as they occur within a
		 * specified period of one another. This allows you to respond once to events that happen multiple times over a time span.
		 *
		 * By default, the timeout period is 1s, and 3s for submit events. If any executions are made during the timeout period, the timeout
		 * will be reset to zero and counted down again.
		 *
		 * For example, you can debounce a callback to a click event so that the click handler is not called more than once if the user
		 * double clicks or holds down the enter button.
		 *
		 * Y.one('#my-button').on('click', ORCHESTRAL.util.Event.debounce(function () {
		 *	// This code will only be executed once, even if the user double clicks
		 * }));
		 *
		 * @method debounce
		 * @param [fn] {Function} The function to debounce.
		 * @param [ms] {Number} The number of milliseconds to debounce the function call. If no time
		 * is specified, events of type submit will default to 3000ms, and all other events to 1000ms.
		 * @return {Function} Returns a wrapped function that calls the given function.
		 */
		debounce: function(fn, ms) {
			var timeout;

			return function (e) {
				var delay;

				if (ms) {
					delay = ms;
				} else {
					delay = (e && e.type === 'submit') ? 3000 : 1000;
				}

				if (timeout) {
					if (e) {
						Event.stopEvent(e);
					}
					clearTimeout(timeout);
				} else if (fn) {
					fn.apply(this, arguments);
				}
				timeout = setTimeout(function() {
					timeout = null;
				}, delay);
			};
		},

		/**
		 * Debounces an event on an element so that no more than one invocation will happen within a
		 * period of time. The event handler will be called immediately, and subsequent events will
		 * be ignored (see ORCHESTRAL.util.Event.debounce for details).
		 *
		 * Use this method only if no other event handlers are listening to the event.
		 *
		 * @param element {HTMLElement|String} The element or id of the element to debounce the event on.
		 * @param eventType {String} The type of the event to debounce.
		 * @param [ms] {Number} The number of milliseconds to debounce the function call. If no time
		 * is specified, events of type submit will default to 3000ms, and all other events to 1000ms.
		 */
		debounceEvent: function(element, eventType, ms) {
			Event.on(element, eventType, ORCHESTRAL.util.Event.debounce(null, ms));
		}
	};
}());

YAHOO.register('orchestral', ORCHESTRAL, {version: '7.9', build: '0'});


}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-event"]});
