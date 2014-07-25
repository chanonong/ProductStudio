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

(function() {

// Share a single popover among all comments on a page. Needs to be declared outside the YUI.add handler function
// so that it's only executed once regardless of number of times YUI.use is called in the page.
var popover;
YUI.add('ohp-commentindicator', function (Y, NAME) {

/*global ORCHESTRAL*/

// popover is provided by the wrapper js files, but appears global to this file, so JSHint would have errors on this file for popover.
// However, Shifter will see popover in the complete file, so thinks it shouldn't be global.
// Fortunately, we can hack it, because JSHint will parse a jshint comment with spaces at the start and end, but Shifter will ignore this:
/* global popover:true */

/**
Provides a basic Comment popover inside a comment column in a datatable. Shows popover when user puts mouse pointer over a comment icon.

@module ohp-commentindicator
**/
var Lang = Y.Lang,
	Widget = Y.Widget;

/**
Comment indicator.

When user hovers over the indicator the comment is shown in a popover.

@class CommentIndicator
@namespace OHP
@constructor CommentIndicator
@extends Widget
@param {object} config
**/
function CommentIndicator(/*config*/) {
	// Detect deprecated call to CommentIndicator as a function.
	if (
			ORCHESTRAL &&
			ORCHESTRAL.widget &&
			ORCHESTRAL.widget.DataTable &&
			arguments.length > 0 &&
			Y.instanceOf(arguments[0], ORCHESTRAL.widget.DataTable)
	) {
		Y.log('Call to Y.OHP.CommentIndicator is depracated.', 'warn');
		return;
	}

	CommentIndicator.superclass.constructor.apply(this, arguments);
}

CommentIndicator.NAME = 'commentIndicator';

CommentIndicator.VALUE_CLASS = 'value';

CommentIndicator.EMPTY_CLASS = 'empty';

CommentIndicator.ATTRS = {
	/**
	@config value
	@type String
	**/
	value: {
		value: ''
	}
};

CommentIndicator.CSS_PREFIX = 'ohp-comment';

CommentIndicator.HTML_PARSER = {
	value: function(srcNode) {
		return srcNode ? srcNode.getContent() : '';
	}
};

Y.extend(CommentIndicator, Widget, {
	BOUNDING_TEMPLATE: '<span/>',

	CONTENT_TEMPLATE: '<span/>',

	initializer: function(/*config*/) {
		if (!popover) {
			popover = new Y.OHP.Popover({
				visible: false,
				zIndex: 2
			});

			popover.plug(Y.OHP.Constraint, {
				maxWidth: '300px',
				maxHeight: '200px'
			});

			popover.render();

			Y.log('Popover for CommentIndicator created and rendered.', 'debug');
		}
	},

	destructor: function() {
	},

	renderUI: function() {
		this.get('contentBox').addClass(this.getClassName(CommentIndicator.VALUE_CLASS));
		// Also add .value as a class so that we follow http://microformats.org/wiki/value-class-pattern
		this.get('contentBox').addClass(CommentIndicator.VALUE_CLASS);
	},

	bindUI: function() {
		this.get('boundingBox').on({
			mouseenter: Y.bind(this._onMouseEnter, this),
			mouseleave: Y.bind(this._onMouseLeave, this)
		});

		this.after('valueChange', this.syncUI);

		// TODO: Think about iPad interaction
		// TODO: Think about event delegation
	},

	syncUI: function() {
		this.get('boundingBox')[this.isEmpty() ? 'addClass' : 'removeClass'](this.getClassName(CommentIndicator.EMPTY_CLASS));
	},

	/**
	Determines if a comment is empty.

	@method isEmpty
	@return {boolean} true if the comment is empty
	**/
	isEmpty: function() {
		var value = this.get('value');

		return value ? !Lang.trim(value) : true;
	},

	_onMouseEnter: function(/*e*/) {
		var value = this.get('value'),
			// Get the id of the node and create a selector because of http://jira/browse/COW-1101
			trigger = '#' + this.get('boundingBox').get('id');

		if (value) {
			popover.show({
				content: value,
				triggerNode: trigger
			});
		}
	},

	_onMouseLeave: function(/*e*/) {
		popover.delayedHide();
	}
});

Y.namespace('OHP').CommentIndicator = CommentIndicator;


}, '7.9.0', {"requires": ["event", "ohp-popover", "widget", "ohp-constraint"]});
}());
