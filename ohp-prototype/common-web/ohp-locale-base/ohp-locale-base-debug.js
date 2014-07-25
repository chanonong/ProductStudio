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
YUI.add('ohp-locale-base', function (Y, NAME) {

"use strict";
/**
A utility for managing localised objects in static JavaScript files.

@module ohp-locale-base
**/

var Lang = Y.Lang,
	Locale;

/**
A utility for managing localised objects in static JavaScript files.

@class Locale
@namespace OHP
**/
Locale = (function() {
	/**
	@property localisations
	@private
	**/
	var localisations = {};

	return {
		/**
		Registers the given localised object with the locale utility for use in the current page.

		@param key {String} The key of the localised object to register.
		@param localisation {Object} The localised object to register.
		**/
		put: function(key, localisation) {
			localisations[key] = localisation;
		},

		/**
		Registers all the given localised objects with the locale utility for use in the current page.

		@param o {Object} An object containing the keys and corresponding localised objects to register.
		**/
		putAll: function(o) {
			localisations = Y.merge(localisations, o);
		},

		/**
		Retrieves a localised object. Any additional arguments to the method will be used to format the
		localised object using Y.substitute.

		@param key {String} The key of the localised object to retrieve.
		@return {Object} The localised object.
		**/
		get: function(key) {
			var localisation = localisations[key],
				// localisations loaded by ohp-locale-translations module
				globalLocalisations = Y.config.win.ORCHESTRAL_LOCALISATIONS;

			if (Lang.isUndefined(localisation) && !Lang.isUndefined(globalLocalisations)) {
				// Look for the requested translation from the global dynamic client translations.
				// The ORCHESTRAL_LOCALISATIONS global is provided by the ohp-locale-translations module
				// published by the com.orchestral.core.web.support bundle.
				localisation = globalLocalisations[key];
			}
			if (Lang.isUndefined(localisation)) {
				return '???' + key + '???';
			} else if (arguments.length === 1) {
				return localisation;
			}
			// The arguments object isn't a true array so we use Y.Array to create a true array from it
			return Y.substitute(localisation, Y.Array(arguments, 1, true));
		}
	};
}());

Y.namespace('OHP').Locale = Locale;


}, '7.9.0', {"requires": ["yui-base", "substitute"]});
