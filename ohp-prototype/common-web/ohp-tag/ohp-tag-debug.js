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
YUI.add('ohp-tag', function (Y, NAME) {

/**
The Tag widget is used to display result labels in removable Tags.

@module ohp-tag
**/
var Locale = Y.OHP.Locale,
	_tagRemoveButtonQuery = '.ohp-tag-content .icon-remove-tag',
	Tag,
	TagGroup;

/**
Provides Tag instances for use with TagGroup.

@class Tag
@namespace OHP
@constructor
@extends Widget
@uses WidgetChild
**/
Tag = Y.Base.create('ohp-tag', Y.Widget, [Y.WidgetChild], {

	ROOT_TYPE: TagGroup,

	BOUNDING_TEMPLATE: '<span />',

	CONTENT_TEMPLATE: '<span />',

	renderUI: function() {
		var submitName = this.get('parent').get('name'),
			contentBox = this.get('contentBox'),
			hiddenInput;

		contentBox.setContent(this.get('label'));
		contentBox.insert('<span class="icon-remove-tag"></span>');

		// If name has been set on the parent, this indicates that the TagGroup is submittable.
		// Therefore for every Tag, a corresponding hidden input is added to handle the
		// Tag values being sent on form submission
		if (submitName) {
			hiddenInput = Y.substitute('<input type="hidden" name="{name}" value="{value}"/>', {
				name: submitName,
				value: this.get('value')
			});
			contentBox.insert(hiddenInput);
		}
	}

}, {

	CSS_PREFIX: 'ohp-tag',

	ATTRS: {
		/**
		@config label
		@type String
		**/
		label: {
			value: '',
			validator: Y.Lang.isString
		},

		/**
		If the TagGroup this Tag belongs to is submittable, this will be the value submitted for this Tag.
		Defaults to label if not specified.

		@config value
		@type String
		@writeOnce
		**/
		value: {
			getter: function(value) {
				if (value) {
					return value;
				} else {
					return this.get('label');
				}
			},
			writeOnce: true,
			validator: Y.Lang.isString
		}
		// TODO: Set value if set in HTML (progressive enhancement)
	},

	HTML_PARSER: {
		label: function(srcNode) {
			return srcNode.getContent();
		}
	}
});

/**
Provides a group of removable Tags with labels.

@class TagGroup
@namespace OHP
@constructor
@extends Widget
@uses WidgetParent
**/
TagGroup = Y.Base.create('ohp-tag-group', Y.Widget, [Y.WidgetParent], {

	BOUNDING_TEMPLATE: '<span />',
	CONTENT_TEMPLATE: null,

	initializer: function(config) {
		if (config._htmlParsedChildren) {
			this._add(config._htmlParsedChildren);
		}

		// After render all children, append footer.
		Y.Do.after(this._appendFooter, this, 'renderUI');
	},

	/**
	Appends Footer to TagGroup that contains "editors" for changing the Tags.
	Called after all child Tags are rendered.

	@method _appendFooter
	@private
	**/
	_appendFooter: function() {
		var footer = Y.substitute('<span class="{footerClass}"></span>', { footerClass: this.getClassName('footer') }),
			footerClass = this.getClassName('footer'),
			contentBox = this.get('contentBox');

		contentBox.appendChild(footer);

		/**
		By default TagGroup footerNode will be defined by the node with footerClass

		@protected
		@property _footerNode
		@value the node added with footerClass
		@type Node
		**/
		this._footerNode = contentBox.one('.' + footerClass);
	},

	bindUI: function() {
		// Binds click event handler to all nodes matching defined query pattern (all child Tag remove button nodes).
		this.get('contentBox').delegate('click', function(e){
			e.preventDefault();
			this._onRemoveButtonClick(e.target);
		}, _tagRemoveButtonQuery, this);

		// Binds changeHandler function to footer node.
		this._footerNode.on('click', function(e) {
			var changeHandler = this.get('changeHandler'),
				boundFn;

			e.preventDefault();

			if (changeHandler) {
				boundFn = Y.bind(changeHandler, this);
				boundFn();
			}
		}, this);

		// Subscribe to 'after' addChild and removeChild events, call syncUI each time,
		// which checks if TagGroup is empty or not, and changes footerContent accordingly
		this.after('addChild', this.syncUI);
		this.after('removeChild', this.syncUI);
	},

	/**
	Called after first child Tag added from empty state.
	Ensures child node appears before footer node in DOM, in the contentBox.

	@method _syncFooter
	@private
	**/
	_syncFooter: function() {
		var nextSibling = this._footerNode.next(false);
		if (nextSibling) {
			// Footer node should be the last node in the contentBox (i.e. no nextSibling).
			this._footerNode.swap(nextSibling);
		}
	},

	syncUI: function() {
		// If TagGroup is empty, footerContent changes.

		// TODO: make the footer content configurable
		var footerContent = Y.substitute('<a href="#">{change}</a>', { change: Locale.get('widget.tag.action.change') });

		if (this.isEmpty()) {
			this.get('boundingBox').addClass(this.getClassName('empty'));
			footerContent = Y.substitute('<a href="#">{add}</a>', { add: Locale.get('widget.tag.action.add') });
			// When first Tag added from empty state, this assures it is not displayed after the footer in the contentBox.
			this.onceAfter('addChild', this._syncFooter);
		} else {
			this.get('boundingBox').removeClass(this.getClassName('empty'));
			footerContent = Y.substitute('<a href="#">{change}</a>', { change: Locale.get('widget.tag.action.change') });
		}
		this._footerNode.setContent(footerContent);
	},

	/**
	Finds index of child Tag that owns 'button', and removes it from this TagGroup.

	@method _onRemoveButtonClick
	@param button {Object} the target button that was clicked
	@private
	**/
	_onRemoveButtonClick: function(button) {
		var childIndex = this.get('contentBox').all(_tagRemoveButtonQuery).indexOf(button);
		// This fires the widget-parent 'removeChild' event.
		this.remove(childIndex);
	},

	_footerNode: null

}, {

	CSS_PREFIX: 'ohp-tag-group',

	ATTRS: {
		/**
		@config defaultChildType
		@default Tag
		@type String | Object
		@readOnly
		**/
		defaultChildType: {
			value: Tag,
			readOnly: true
		},

		/**
		Function to be called when user chooses to change (add/remove) Tags that are in the TagGroup.

		This function should get input from user, change Tags in TagGroup, etc.

		@config changeHandler
		@type Function
		@writeOnce
		**/
		changeHandler: {
			value: function(/*group, footerNode*/) {
				Y.log('Default changeHandler implementation');
			},
			validator: Y.Lang.isFunction,
			writeOnce: true
		},

		/**
		Specifying a name causes the Tags in this TagGroup to be submitted when the form is submitted.
		The name specified will be used as the submit name of each Tag.

		@config name
		@type String
		@writeOnce
		**/
		name: {
			writeOnce: true,
			validator: Y.Lang.isString
		}
	},

	HTML_PARSER: {
		// Because there is no 'children' attribute and the WidgetParent extension processes the 'config.children' param at construction
		// time (before HTML_PARSER is evaluated) rather than initialization time, we use a different property name for the children parsed
		// here so that we can add them in our own initializer function.
		_htmlParsedChildren: function(srcNode) {
			// Sets each span element as the srcNode for a child Tag.
			var nodes = srcNode.all('span'),
				children = [];

			nodes.each(function(node) {
				children.push({ srcNode: node });
			});

			return children;
		}
	}
});

Y.namespace('OHP').TagGroup = TagGroup;


}, '7.9.0', {
    "requires": [
        "ohp-locale-translations",
        "ohp-locale-base",
        "arraylist",
        "widget-child",
        "base",
        "substitute",
        "node-event-delegate",
        "widget",
        "event-base",
        "oop",
        "node-base",
        "widget-parent"
    ]
});
