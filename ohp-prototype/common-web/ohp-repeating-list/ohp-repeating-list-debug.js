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
YUI.add('ohp-repeating-list', function (Y, NAME) {

"use strict";
/**
List of items that follow the same structure that allows users to add and remove items.

@module ohp-repeating-list
**/

var RepeatingList,
	RepeatingListItem;

RepeatingListItem = Y.Base.create('repeatingList', Y.Widget, [Y.WidgetChild], {
	ROOT_TYPE: RepeatingList,

	BOUNDING_TEMPLATE: '<li></li>',

	CONTENT_TEMPLATE: '<div></div>',

	renderUI: function() {
		var contentBox = this.get('contentBox'),

			content = Y.substitute('<div class="{className}"></div>', { className: this.getClassName('value') });

		contentBox.setContent(content);
		contentBox.insert('<a href="#" class="icon-remove" tabindex="0"><span class="ohp-screen-reader-only">' +
				Y.Escape.html(Y.OHP.Locale.get('widget.repeatingList.item.action.remove')) +
				'</span>&nbsp;</a>', 'after');

		// TODO: _initAria
		// TODO: add/remove plugin - role="region" aria-live="polite" aria-relevant="additions removals"
	},

	bindUI: function() {
		this.after('valueChange', this.syncUI);
	},

	syncUI: function() {
		var valueNode = this.get('contentBox').one('.' + this.getClassName('value'));

		valueNode.setContent(this.get('value'));
	}
}, {
	CSS_PREFIX: 'ohp-repeating-list-item',

	ATTRS: {
		value: {
			setter: function(val) {
				this.get('parent').fire('updateChild', {
					child: this
				});

				return val;
			},

			value: '',

			validator: Y.Lang.isString
		},

		propertyIndex: {
			value: 0,

			validator: Y.Lang.isNumber,

			writeOnce: true
		}
	},

	HTML_PARSER: {
		value: function(srcNode) {
			return srcNode.getContent();
		}
	}
});

/**
@class RepeatingList
@namespace OHP
@extends Widget
@uses WidgetParent
@uses WidgetStdMod
**/
RepeatingList = Y.Base.create('repeatingList', Y.Widget, [Y.WidgetParent, Y.WidgetStdMod], {
	CONTENT_TEMPLATE: '<ul></ul>',

	initializer: function() {
		var parent = this,
			children = this.get('contentBox').all('.yui3-widget-bd > ul > li'),
			n = 0;

		children.each(function(child) {
			parent.add({
				value: child.getContent()
			});
			child.set('propertyIndex', n += 1);
		});

		this._set('propertyIndex', n);
	},

	renderUI: function() {
		var body = this.getStdModNode(Y.WidgetStdMod.BODY),
			labelledBy = this.get('labelledBy'),
			describedBy = this.get('describedBy'),
			list;

		if (!body.hasChildNodes()) {
			this.setStdModContent(Y.WidgetStdMod.BODY, this.CONTENT_TEMPLATE);
		}

		list = body.one('ul');

		if (labelledBy) {
			list.setAttribute('aria-labelledby', labelledBy);
		}

		if (describedBy) {
			list.setAttribute('aria-describedby', describedBy);
		}

		list.removeClass('ohp-list');
		list.empty();

		this._childrenContainer = list;
	},

	bindUI: function() {
		// TODO: think can use UI_EVENTS here
		var footerNode = this.getStdModNode(Y.WidgetStdMod.FOOTER),

			addIcon = footerNode.one('.icon-add') || footerNode.one('.add');

		// TODO: what if addIcon is null?
		addIcon.on('click', function(e) {
			var addHandler = this.get('addHandler'),
				boundFn;

			e.preventDefault();

			if (addHandler) {
				boundFn = Y.bind(addHandler, this);
				boundFn();
			}
		}, this);

		this.getStdModNode(Y.WidgetStdMod.BODY).delegate('click', function(e) {
			var boundingBox = e.target.ancestor('.' + this.getClassName('item'));

			this.some(function(item) {
				if (item.get('boundingBox') === boundingBox) {
					this.remove(item.get('index'));

					this.triggerReflow();

					return true;
				}
			}, this);

			e.preventDefault();
		}, '.icon-remove', this);

		// TODO: could this be the default function for the addChild event?
		this.after('addChild', function(/*e*/) {
			var n = this.get('propertyIndex');

			this._set('propertyIndex', n + 1);

			this.triggerReflow();
		});
	},

	triggerReflow: function() {
		// In oldIE, if we insert or remove a node, there is a bug where because the repeating-list has display: inline-block,
		// the boundingBox doesn't automatically resize to fit the contents.
		// So, we have to force a reflow in oldIE whenever we add or remove nodes.
		// We can do this using the hack of setting the className back to itself.
		var boundingBox;
		if(Y.UA.ie && Y.UA.ie <= 8){
			boundingBox = this.get('boundingBox');
			boundingBox.set('className', boundingBox.get('className'));
		}
	}
}, {
	CSS_PREFIX: 'ohp-repeating-list',

	ATTRS: {
		defaultChildType: {
			value: RepeatingListItem
		},

		/**
		Function to be called when user chooses to add an item to the list.

		This function should get input from user, add it into the list, etc.

		<code>addHandler</code> will typically use the <code>itemTemplate</code> when adding content.

		@config addHandler
		@type Function
		@writeOnce
		**/
		addHandler: {
			value: function(/*list, footerNode*/) {
				Y.log('Default addHandler implementation');
			},

			validator: Y.Lang.isFunction,

			writeOnce: true
		},

		/**
		HTML template that describes the structure of items in the list.

		@config itemTemplate
		@type String
		@writeOnce
		**/
		itemTemplate: {
			value: '',

			// TODO: Should also be able to define a Function
			validator: Y.Lang.isString,

			writeOnce: true
		},

		/**
		Property index to be used when indexing input elements of an item.

		This implementation is designed to work with Stripes' support for
		<a href="http://stripesframework.org/display/stripes/Indexed+Properties">indexed properties</a>.

		This attribute is equivalent to {{index}} did in the YUI 2-based Template utility.

		@config propertyIndex
		@type Number
		@readOnly
		**/
		propertyIndex: {
			value: 0,

			validator: Y.Lang.isNumber,

			readOnly: true
		},

		/**
		String representing the id of the element that labels the RepeatingList.
		Maps directly to the <a href="http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby">
		<code>aria-labelledby</code></a> attribute.
		@config labelledBy
		@type String
		@writeOnce
		**/
		labelledBy: {
			validator: Y.Lang.isString,

			writeOnce: true
		},

		/**
		String representing the id of the element that describes the RepeatingList.
		Maps directly to the <a href="http://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby">
		<code>aria-describedby</code></a> attribute.
		@config describedBy
		@type String
		@writeOnce
		**/
		describedBy: {
			validator: Y.Lang.isString,

			writeOnce: true
		}
	},

	HTML_PARSER: {
		itemTemplate: function(srcNode) {
			var script = srcNode.one('script');

			return script ? Y.Lang.trim(script.getContent()) : '';
		}
	}
});

Y.namespace('OHP').RepeatingList = RepeatingList;


}, '7.9.0', {
    "requires": [
        "ohp-locale-base",
        "node-style",
        "substitute",
        "node-event-delegate",
        "escape",
        "event-base",
        "node-base",
        "ohp-locale-translations",
        "widget-stdmod",
        "base",
        "widget-child",
        "arraylist",
        "widget",
        "widget-parent",
        "oop"
    ],
    "skinnable": true
});
