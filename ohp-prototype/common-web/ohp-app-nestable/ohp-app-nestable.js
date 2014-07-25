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
YUI.add('ohp-app-nestable', function (Y, NAME) {

"use strict";
/**
Y.App Extension for Y.Apps that can be nested inside other Y.Apps. Primarily ensures any Pjax links created by this Y.App have the
correct path (as the 'root' may be redefined to be relative to another Y.App that this Y.App is nested inside of).

@module ohp-app-nestable
@class AppNestable
@constructor
@namespace OHP
**/
function AppNestable() {
}

AppNestable.ATTRS = {

	/**
	Full root path for this Y.App suitable for use in Pjax links (as the 'root' may be redefined to be relative to another Y.App that this
	Y.App is nested inside of).

	@attribute pjaxRootPath
	@type String
	@default this.get('root')
	**/
	pjaxRootPath: {
		valueFn: '_initAttrPjaxRootPath'
	}
};

AppNestable.prototype = {
	_initAttrPjaxRootPath: function() {
		return this.get('root');
	},

	/**
	Get the full path to a sub-resource of this Y.App suitable for use in a Pjax link (as the 'root' may be redefined to be relative to
	another Y.App that this Y.App is nested inside of).

	For example, where the pjaxRootPath is '/root/nestedRoot/':

	getFullPathForPjax('/') --> /root/nestedRoot/
	getFullPathForPjax('/hello') --> /root/nestedRoot/hello
	getFullPathForPjax('hello') --> /root/nestedRoot/hello

	@method getFullPathForPjax
	@param {String} path the path to the resource to link to in the Pjax link

	@return the full path suitable for use in a Pjax link
	**/
	getFullPathForPjax: function(path) {
		var rootPath = this.get('pjaxRootPath'),
			fullPath = path ? (rootPath + '/' + path) : rootPath;

		return this._normalizePath(fullPath);
	}
};

Y.namespace('OHP').AppNestable = AppNestable;


}, '7.9.0', {"requires": []});
