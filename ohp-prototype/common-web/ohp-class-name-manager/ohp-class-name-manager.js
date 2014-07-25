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
YUI.add('ohp-class-name-manager', function (Y, NAME) {

"use strict";
/**
Class name manager based on Y.ClassNameManager that creates class names with the specified prefixes.
@module ohp-class-name-manager
@class ClassNameManager
@namespace OHP
**/

// TODO: fix yuidoc to just be @method create when our yuidoc version supports static and instance methods with the same name
/**
Creates a ClassNameManager with the given prefixes.

@method ClassNameManager.create
@static
@param {String} prefix+ 1..n strings to be joined to form the class name prefix e.g. 'ohp', 'web' to prefix all class names with 'ohp-web-'
@return {ClassNameManager} a ClassNameManager with the specified prefixes.
**/
var create = function() {
	var prefixes = Y.Array(arguments);

	return {
		/**
		Returns a class name prefixed with the prefixes specified in the create method + the provided strings.
		E.g. Y.OHP.ClassNameManager.create('foo', 'bar').getClassName('baz','qux'); // foo-bar-baz-qux

		@method getClassName
		@param {String} classNameSection+ 1..n class name sections to be joined.
		@return {String} a class name prefixed with this ClassNameManagers prefixes plus the given classNameSections.
		*/
		getClassName: function() {
			// Convert the JavaScript 'arguments' object to a true array, prepend the specified prefixes and append the
			// true boolean (to indicate that YUI's getClassName method should not prepend the 'yui3' prefix to the class name).
			return Y.ClassNameManager.getClassName.apply(Y.ClassNameManager, prefixes.concat(Y.Array(arguments), true));
		},

		/**
		Creates a new ClassNameManager using this ClassNameManagers prefixes and the specified prefixes.
		E.g. Y.OHP.ClassNameManager.create('foo', 'bar').create('baz').getClassName('qux'); // foo-bar-baz-qux

		@method create
		@param {String} prefix+ 1..n prefixes to add to the current prefixes.
		@return {ClassNameManager} a new ClassNameManager with the additional prefixes.
		*/
		create: function() {
			return create.apply(this, prefixes.concat(Y.Array(arguments)));
		}
	};
};

Y.namespace('OHP.ClassNameManager').create = create;


}, '7.9.0', {"requires": ["classnamemanager"]});
