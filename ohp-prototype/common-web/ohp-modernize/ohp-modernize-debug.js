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
YUI.add('ohp-modernize', function (Y, NAME) {

"use strict";
/*global Modernizr */

/**
Provides modernization solutions for older browsers.

@module ohp-modernize
@ohp-requires-yui2 modernizr
**/

var doc = Y.config.doc,

	alwaysTrue = function() {
		return true;
	},

	applyPlaceholder = function(rootNode) {
		if (Modernizr.input.placeholder) {
			return;
		}

		Y.use('ohp-placeholder', function() {
			rootNode.all('input[type=text][placeholder],textarea[placeholder]').each(function(node) {
				if (!node.hasPlugin(Y.OHP.PlaceholderPlugin)) {
					node.plug(Y.OHP.PlaceholderPlugin);
				}
			});
		});
	},

	Modernize;

Y.namespace('OHP').ModernizePlugin = Y.Base.create('ModernizePlugin', Y.Plugin.Base, [], {
	initializer: function(/*config*/) {
		var Modernize = Y.OHP.Modernize,
			host = this.get('host'),
			tagName = Y.Node.getDOMNode(host).tagName;

		if (tagName === 'INPUT') {
			return;
		}

		this.afterHostMethod('setContent', function() {
			Modernize.modernize(host.get('parentNode'));
		});

		this.afterHostMethod('setHTML', function() {
			Modernize.modernize(host.get('parentNode'));
		});

		this.afterHostMethod('set', function(attr) {
			if (attr === 'innerHTML') {
				Modernize.modernize(host.get('parentNode'));
			}
		});

		// Several Node methods delegate to insert, e.g. append, appendChild, so we can handle them here.
		this.afterHostMethod('insert', function(content, where) {
			switch (where) {
				case 'replace':
					Modernize.modernize(host.get('parentNode'));
					break;
				case 'before':
					Modernize.modernize(host.previous(alwaysTrue));
					break;
				case 'after':
					Modernize.modernize(host.next(alwaysTrue));
					break;
				default:
					Modernize.modernize(host);
			}
		});
	}
}, {
	NS: 'modernize',
	ATTRS: {}
});


/**
@class Modernize
@namespace OHP
**/
Modernize = function() {};

Modernize.prototype = {
	_modernizrs: {
		placeholder: function(root) {
			applyPlaceholder((root) ? root : (Y.one(doc.body)));
		}
	},

	/**
	Runs a set of modernization functions on a node.

	@method modernize
	@param node {Y.Node} to apply modernization to. Defaults to document body.
	@param features {Array} of modernization features to apply. Defaults to all functions.
	**/
	modernize: function(node, features) {
		node = (node) ? node : (Y.one(doc.body));
		features = (features) ? features : (['placeholder']);

		Y.each(features, function(feature) {
			this._modernizrs[feature](node);
		}, this);
	},

	/**
	Removes placeholders from the root Node.

	@method removePlaceholders
	@param root {Y.Node}
	@deprecated This method does not need to be called anymore.
	**/
	removePlaceholders: function(/*root*/) {
		Y.log('removePlaceholders method is deprecated.', 'info');
	}
};

Y.namespace('OHP').Modernize = new Modernize();

Y.on('domready', function() {
	var body = Y.one(doc.body);

	// TODO: in the future we may want to prevent this happening automatically via a config flag or similar
	applyPlaceholder(body);

	Y.Node.plug(Y.OHP.ModernizePlugin);
});


}, '7.9.0', {"requires": ["node", "base-build", "plugin"]});
