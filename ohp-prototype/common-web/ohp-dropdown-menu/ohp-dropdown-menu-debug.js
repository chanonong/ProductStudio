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
YUI.add('ohp-dropdown-menu', function (Y, NAME) {

"use strict";
/**
A basic dropdown menu control

@module ohp-dropdown-menu
**/

var DropdownMenu,

	getClassName = Y.OHP.OhpClassNameManager.getClassName,
	Lang = Y.Lang,
	Locale = Y.OHP.Locale,

	CLASS_NAMES = {
		dropdownMenuActive: getClassName('dropdown', 'menu', 'active'),
		item: getClassName('dropdown', 'menu', 'item'),
		itemContent: getClassName('dropdown', 'menu', 'item', 'content'),
		itemContentActive: getClassName('dropdown', 'menu', 'item', 'content', 'active')
	},

	DATA_ATTR_NAMES = {
		itemId: 'item-id',
		itemIndex: 'item-index'
	},

	EVT_ITEM_CLICK = 'itemClick',


	CLEAR_ALERT_TIMEOUT = 3000, // Milliseconds

	DEFAULT_ALIGN_POINTS = [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL],

	renderMenuItem = Y.Template.get('ohp-dropdown-menu-item-template');

/**
Dropdown Menu

@class DropdownMenu
@namespace OHP
@extends Widget
@uses WidgetPosition, WidgetStack, WidgetPositionAlign, WidgetPositionConstrain
**/
DropdownMenu = Y.Base.create('ohpDropdownMenu', Y.Widget,
	[Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain], {

	CONTENT_TEMPLATE: '<ul></ul>',

	/**
	A map of guid to item config

	@property _menuItemMap
	@type Object
	@private
	**/
	_menuItemMap: {},

	initializer: function() {
		this._publishedEvents = {};
		this._menuVisibleEventHandles = [];
	},

	destructor: function() {
		this.get('contentBox').unplug(Y.Plugin.NodeFocusManager);

		Y.Array.invoke(this._eventHandles, 'detach');

		Y.each(this._publishedEvents, function(publishedEvent) {
			publishedEvent.detach();
		});

		this._detachMenuVisibleEvents();
	},

	renderUI: function() {
		var boundingBox = this.get('boundingBox'),
			contentBox = this.get('contentBox'),
			items = this.get('items'),
			triggerNode = this.get('triggerNode');

		boundingBox.setAttrs({
			'aria-hidden': true,
			'role': 'menu',
			'tabIndex': null
		});

		this._menuItemMap = {};
		contentBox.empty();

		Y.each(items, function(item, index) {
			var id = Y.guid();
			this._menuItemMap[id] = item;
			contentBox.append(renderMenuItem({
				id: id,
				index: '' + index,
				labelHtml: item.labelHtml,
				label: item.label,
				href: item.url || '#',
				target: item.target,
				classNames: CLASS_NAMES,
				dataAttrNames: DATA_ATTR_NAMES
			}));
		}, this);

		// Check if a menu status node already exists, if not, create one
		this._menuStatusNode = Y.one('#ohp-menu-status-node');
		if (!this._menuStatusNode) {
			this._menuStatusNode = Y.Node.create(
				'<span id="ohp-menu-status-node" class="ohp-screen-reader-only" role="status" aria-live="polite"></span>');
			Y.one('body').append(this._menuStatusNode);
		}

		if (triggerNode) {
			if (!triggerNode.get('tabIndex')) {
				// If trigger is a link, and has been clicked, it can lose focus if don't explicitly set tabIndex 0.
				// To be safe we set a tab index if there is not one already
				triggerNode.set('tabIndex', 0);
			}

			triggerNode.setAttrs({
				role: 'button',
				'aria-haspopup': true
			});
		}
	},

	bindUI: function() {
		var contentBox = this.get('contentBox'),
			triggerNode = this.get('triggerNode');

		contentBox.plug(Y.Plugin.NodeFocusManager, {
			descendants: '.' + CLASS_NAMES.itemContent,
			keys: {
				next: 'down:40', // down arrow key keydown
				previous: 'down:38' // up arrow key keydown
			},
			focusClass: CLASS_NAMES.itemContentActive,
			circular: true
		});

		contentBox.focusManager.after('focusedChange', this._afterFocusedChangeHideIfBlurred, this);

		// Defining touchstartoutside event
		Y.Event.defineOutside('touchstart');

		this._eventHandles = [
			contentBox.delegate('click', this._onItemContentNodeClick, '.' + CLASS_NAMES.itemContent, this),
			contentBox.delegate('key', this._hideMenuAndFocusTriggerNode, 'down:esc', '.' + CLASS_NAMES.itemContent, this),
			contentBox.delegate('mouseenter', this._onItemContentNodeHoverSetFocus, '.' + CLASS_NAMES.item, this),
			this.after('visibleChange', this._afterVisibleChange, this)
		];

		// If a triggerNode has been defined, set the default actions on it
		if (triggerNode) {
			this._eventHandles.push(triggerNode.on('click', this._onTriggerNodeClickToggleMenu, this));
			this._eventHandles.push(triggerNode.on('keydown', this._onTriggerNodeKeyPress, this));
		}
	},

	// === Private Methods ==============================

	_publishAndFireEvent: function(eventName, publishConfig, fireConfig) {
		if (!this._publishedEvents[eventName]) {
			this._publishedEvents[eventName] = this.publish(eventName, publishConfig);
		}

		this.fire(eventName, fireConfig);
	},

	_alertScreenReaderOfMenuShown: function() {
		this._menuStatusNode.setHTML(Locale.get('cow.dropdownmenu.tooltip.screenReader.show'));

		Y.later(CLEAR_ALERT_TIMEOUT, this, function() {
			this._menuStatusNode.setHTML('');
		});
	},

	_detachMenuVisibleEvents: function() {
		Y.Array.invoke(this._menuVisibleEventHandles, 'detach');
		this._menuVisibleEventHandles = [];
	},

	// If align has not been previously set, return the default align config
	_getAlign: function(value) {
		return value || {
				align: this.get('triggerNode'),
				points: DEFAULT_ALIGN_POINTS
			};
	},

	_hideMenuAndFocusTriggerNode: function(/*event*/) {
		var triggerNode = this.get('triggerNode');

		this.hide();

		if (triggerNode) {
			triggerNode.focus();
		}
	},

	// Default the node or points properties on the align attribute if they have not been set.
	_setAlign: function(value) {
		var mergeConfig = {};
		// If provided a value without points, default points to align the menu's top left corner to
		// the bottom left corner of the align node
		if (!value || !value.points) {
			mergeConfig.points = DEFAULT_ALIGN_POINTS;
		}
		// If provided a value without a node, default node to triggerNode
		if (!value || !value.node) {
			mergeConfig.node = this.get('triggerNode');
		}

		return Y.merge(value, mergeConfig);
	},

	// === Event Handlers =================================

	_afterFocusedChangeHideIfBlurred: function(event) {
		// Focus changed, but nothing (in the menu) selected
		if (!event.newVal) {
			this.hide();
		}
	},

	_afterVisibleChange: function(event) {
		var visible = event.newVal,
			boundingBox = this.get('boundingBox'),
			triggerNode = this.get('triggerNode');

		if (visible) {
			// We only require the these event handlers when the menu is visible. This is so we don't have multiple
			// event handlers firing for every hidden DropdownMenu on the page.
			this._menuVisibleEventHandles = [
				boundingBox.on('clickoutside', this._onClickOrTouchOutsideHide, this),
				boundingBox.on('touchstartoutside', this._onClickOrTouchOutsideHide, this)
			];

			// Only bind the window 'resize' event 100ms later as in some cases, namely when inside an iframe on an iPad, showing the menu
			// may trigger a resize (and if this was already bound, the menu would then immediately hide again). See COW-3419.
			Y.later(100, this, this._afterShowMenuBindWindowResize);

			this._alertScreenReaderOfMenuShown();
		} else {
			this._detachMenuVisibleEvents();

			// Reset the activeDescendant so the first item in the menu is focused when tabbed into
			this.get('contentBox').focusManager.set('activeDescendant', 0);
		}

		if (triggerNode) {
			triggerNode[visible ? 'addClass' : 'removeClass'](CLASS_NAMES.dropdownMenuActive);
		}
		boundingBox.set('aria-hidden', !visible);
	},

	_afterShowMenuBindWindowResize: function() {
		if (this.get('visible')) {
			this._menuVisibleEventHandles.push(Y.on('resize', this._hideMenuAndFocusTriggerNode, Y.config.win, this));
		}
	},

	_onClickOrTouchOutsideHide: function(event) {
		var triggerNode = this.get('triggerNode'),
			target = event.target;

		// We can only safely close on click outside if we know it wasn't clicking the trigger node
		// if no trigger node is specified, it will be up to the dev to handle closing
		if (triggerNode) {
			if (!target.compareTo(triggerNode) && !triggerNode.contains(target)) {
				this.hide();
			}
		}
	},

	_onItemContentNodeClick: function(event) {
		var item = this._menuItemMap[event.currentTarget.getData(DATA_ATTR_NAMES.itemId)];

		if (!item.url) {
			event.preventDefault();
		}

		// Calling this function before the click event it fired, as in the case where a menu item click opens a page in a new tab, the
		// events default function does not get a chance to get called. Therefore the menu will remain visible after switching back to the
		// tab that the menu item was clicked from.
		this._hideMenuAndFocusTriggerNode();

		this._publishAndFireEvent(EVT_ITEM_CLICK, {
			emitFacade: true
		}, {
			originEvent: event,
			item: item
		});
	},

	_onItemContentNodeHoverSetFocus: function(event) {
		var index = parseInt(event.currentTarget.getData(DATA_ATTR_NAMES.itemIndex), 10);

		this.get('contentBox').focusManager.focus(index);
	},

	_onTriggerNodeClickToggleMenu: function(event) {
		event.preventDefault();

		this.set('visible', !this.get('visible'));
	},

	_onTriggerNodeKeyPress: function(event) {
		// If down arrow pressed, focus the first item in the menu
		if (event.keyCode === 40 && this.get('visible')) {
			// This is neccesary to prevent the page from scrolling when the down arrow is pressed.
			event.preventDefault();
			this.get('contentBox').focusManager.focus(0);
		// If esc or shift + tab pressed, hide the menu
		} else if (event.keyCode === 27 || (event.shiftKey && event.keyCode === 9)) {
			this.hide();
		}
	}

}, {
	ATTRS: {
		/**
		The array of menu item configs to display. Each item contains:
		<ul>
			<li><code>label</code>: The text that will appear in the menu</li>
			<li>
				<code>labelHtml</code>: The <strong>unescaped</strong> content that will appear in the menu.
				<strong>Note:</strong> If both label and labelHtml are set, labelHtml will take precedence.
			</li>
			<li><code>url</code> (Optional): The url that the browser will navigate to</li>
			<li><code>target</code> (Optional): The target attribute that will be set on the anchor</li>
			<li><code>id</code> (Optional): A unique identifier for the item</li>
			<li><code>data</code> (Optional): An object containing any additional information related to the item</li>
		</ul>

		@config items
		@type Array
		@writeOnce initOnly
		**/
		items: {
			validator: Lang.isArray,
			writeOnce: 'initOnly'
		},

		/**
		The node which toggles the menu's visible attribute

		@config triggerNode
		@type String | Node
		@writeOnce initOnly
		**/
		triggerNode: {
			value: null,
			setter: Y.one,
			writeOnce: 'initOnly'
		},

		// === Superclass Attribute Overrides =================================

		align: {
			getter: '_getAlign',
			setter: '_setAlign'
		},

		visible: {
			value: false
		},

		zIndex: {
			value: 2
		}
	},

	CSS_PREFIX: getClassName('dropdown', 'menu')
});

Y.namespace('OHP').DropdownMenu = DropdownMenu;


}, '7.9.0', {
    "requires": [
        "array-invoke",
        "base",
        "event-key",
        "event-mouseenter",
        "event-outside",
        "event-resize",
        "event-touch",
        "node-base",
        "node-event-delegate",
        "node-focusmanager",
        "template-base",
        "widget",
        "widget-position",
        "widget-position-align",
        "widget-position-constrain",
        "widget-stack",
        "ohp-locale-base",
        "ohp-locale-translations",
        "ohp-ohp-class-name-manager",
        "ohp-dropdown-menu-templates"
    ],
    "skinnable": true
});
