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
YUI.add('ohp-breadcrumb', function (Y, NAME) {

"use strict";
/*global window*/

/**
Widget for opening content over the top of existing content (like a lightbox) emulating that a
whole new page has been opened with a bread crumb trail to navigate back to the initial content.

@module ohp-breadcrumb
**/

var getClassName = Y.ClassNameManager.getClassName,
	// Widget Names
	VIRTUAL_PAGE = 'virtualpage',
	BREAD_CRUMB = 'breadcrumb',
	BREAD_CRUMB_TRAIL = 'breadcrumbtrail',

	// Attribute Names
	BOUNDING_BOX = 'boundingBox',
	CONTENT_BOX = 'contentBox',
	CONTENT_FRAME_ID = 'urlContentFrameId',
	HEIGHT = 'height',
	INDEX = 'index',
	INNER_HTML = 'innerHTML',
	PARENT = 'parent',
	VIRTUAL_PAGE_ATTR = 'virtualPage',

	// Class Names
	FULL_PAGE_CLASS = getClassName(VIRTUAL_PAGE, 'full-page'),
	HIDE_CONTENT_CLASS = 'cow-breadcrumb-hide-content',
	TITLE_CLASS = getClassName(VIRTUAL_PAGE, 'title'),
	URL_CONTENT_SUFFIX = 'url-content',
	URL_CONTENT_CLASS = getClassName(VIRTUAL_PAGE, URL_CONTENT_SUFFIX),
	BREADCRUMBTRAIL_OVERFLOW = getClassName(BREAD_CRUMB_TRAIL, 'overflow'),

	// Event Names
	EVT_ADD_CHILD = 'addChild',
	EVT_REMOVE_CHILD = 'removeChild',
	EVT_RESIZE = 'windowresize',
	EVT_VISIBLE_CHANGE = 'visibleChange',

	// Selectors
	SEL_WIDGET_HD = '.yui3-widget-hd',
	SEL_PAGE_TITLE = SEL_WIDGET_HD + ' h1, ' + SEL_WIDGET_HD + ' h2',

	DEFAULT_PAGE_TITLE = Y.OHP.Locale.get('widget.breadcrumb.back.action'),
	HISTORY_STATE_KEY = 'bc',

	USING_OLD_IE,

	VirtualPage,
	BreadCrumb,
	BreadCrumbTrail,

	OHP;

Y.on('domready', function() {
	USING_OLD_IE = Y.DOM.hasClass(Y.config.doc.documentElement, 'oldie');
});

/**
Widget for displaying content as a virtual page. Used by the BreadCrumb widget in a BreadCrumbTrail.

@class VirtualPage
@namespace OHP
@constructor
@extends Widget
@uses WidgetStack, WidgetStdMod
**/
VirtualPage = Y.Base.create(VIRTUAL_PAGE, Y.Widget, [Y.WidgetStack, Y.WidgetStdMod], {
	/**
	Template for displaying the contents of URL passed at construction time.

	@property URL_CONTENT_TEMPLATE
	@type String
	**/
	URL_CONTENT_TEMPLATE: '<iframe id="{id}" name="{id}" class="' + URL_CONTENT_CLASS + '" src="{url}" frameborder="0"></iframe>',

	initializer: function(config) {
		if (config.url) {
			var tokens = Y.merge(config, {
				id: this.get(CONTENT_FRAME_ID)
			});
			this.set('bodyContent', Y.substitute(this.URL_CONTENT_TEMPLATE, tokens));
		}
	},

	renderUI: function() {
		var srcNode = this.get('srcNode');

		// Move full-page class from contentBox to boundingBox
		if (srcNode.hasClass(FULL_PAGE_CLASS)) {
			srcNode.removeClass(FULL_PAGE_CLASS);
			this.get(BOUNDING_BOX).addClass(FULL_PAGE_CLASS);
		}
	},

	bindUI: function() {
		if (Y.UA.ipad) {
			// Scrolls to the top of the page when a virtual page is made visible on the iPad
			this.on(EVT_VISIBLE_CHANGE, this._onVisibleChange, this);
		}
	},

	// Scrolls to the top of the page (necessary for iPad)
	_onVisibleChange: function(event) {
		if (event.newVal) {
			Y.config.doc.body.scrollIntoView();
		}
	}
}, {
	ATTRS: {
		/**
		@attribute destroyOnClose
		@default true
		@type Boolean

		@description whether the virtual page content should be destroyed when the corresponding breadcrumb is closed.
		**/
		destroyOnClose: {
			value: true,
			validator: Y.Lang.isBoolean
		},

		fillHeight: { // Set the body of the virtual page to fill the remaining space of its container by default
			value: Y.WidgetStdMod.BODY
		},

		/**
		@attribute pageTitle
		@default "Back"
		@type String

		@description The title of the virtual page. Used as the default label for the next BreadCrumb.
		**/
		pageTitle: {
			value: DEFAULT_PAGE_TITLE,
			validator: Y.Lang.isString
		},

		shim: { // Force shim on all browsers
			value: true
		},

		/**
		@attribute urlContentFrameId
		@readOnly
		@type String

		@description The id/name of the iframe used for URL content.
		**/
		urlContentFrameId: {
			readOnly: true,
			getter: function() {
				return this.get('id') + '-' + URL_CONTENT_SUFFIX;
			}
		},

		/**
		@attribute urlContentWindow
		@readOnly
		@type String

		@description The window for the iframe used for URL content.
		**/
		urlContentWindow: {
			readOnly: true,
			getter: function() {
				return Y.config.win.frames[this.get(CONTENT_FRAME_ID)];
			}
		},

		visible: { // Hidden by default
			value: false
		}
	},

	HTML_PARSER: {
		// Parse the pageTitle attribute from either an h1, h2 or element with the .yui3-virtualpage-title class
		// that is a child of the virtual page's header
		pageTitle: function(srcNode) {
			var titleNode = srcNode.one(SEL_WIDGET_HD + ' .' + TITLE_CLASS + ', ' + SEL_PAGE_TITLE);
			if (titleNode) {
				titleNode.addClass(TITLE_CLASS);
				return titleNode.get(INNER_HTML);
			} else {
				return null;
			}
		}
	}
});

/**
Widget representing an individual bread crumb in the trail with a corresponding virtual page that is
displayed when this bread crumb is <a href="#attribute_active">active</a>.

@class BreadCrumb
@namespace OHP
@constructor
@extends Widget
@uses WidgetChild
**/
BreadCrumb = Y.Base.create(BREAD_CRUMB, Y.Widget, [Y.WidgetChild], {
	BOUNDING_TEMPLATE: '<li></li>',
	CONTENT_TEMPLATE: '<a href="#"></a>',
	/**
	 * Template for the href in the BreadCrumb's label. Contains history information for this bread crumb.
	 *
	 * @property HREF_TEMPLATE
	 * @type String
	 */
	HREF_TEMPLATE: '#' + HISTORY_STATE_KEY + '={index}',

	initializer: function() {
		this._handlers = [];
	},

	destructor: function() {
		Y.Array.each(this._handlers, function(handler) {
			handler.detach();
		});
		this._handlers = [];
		var page = this.get(VIRTUAL_PAGE_ATTR).hide();
		if (page.get('destroyOnClose')) {
			page.destroy();
		}
	},

	renderUI: function() {
		this.get(CONTENT_BOX)
			.setAttribute('href', Y.substitute(this.HREF_TEMPLATE, { index: this.get(INDEX) }))
			.set('title', this.get('label'));

		this._set('breadCrumbWidth', parseInt(this.get(BOUNDING_BOX).getComputedStyle('width'), 10));
	},

	bindUI: function() {
		var parent = this.get(PARENT);
		this._handlers.push(parent.after(EVT_ADD_CHILD, this._updateVirtualPageVisibility, this));
		this._handlers.push(parent.after(EVT_REMOVE_CHILD, this._updateVirtualPageVisibility, this));

		this._handlers.push(this.get(VIRTUAL_PAGE_ATTR).after(EVT_VISIBLE_CHANGE, this._afterVirtualPageVisibleChange, this));
		//Changed from this._handlers.push(Y.on(EVT_RESIZE, this._onWindowResize, this));
		//because it wasn't actually getting fired with our patched yui 3.4.1
		this._handlers.push(Y.one(window).on(EVT_RESIZE, this._onWindowResize, this));
	},

	syncUI: function() {
		this.set('label', this.get('label'));
		this._updateVirtualPageVisibility();
	},

	focus: function() {
		this.get(CONTENT_BOX).focus();
		BreadCrumb.superclass.focus.apply(this);
	},

	_afterVirtualPageVisibleChange: function(event) {
		if (event.newVal) {
			this._updateVirtualPageDimension();
		}
	},

	_updateVirtualPageVisibility: function() {
		this.get(VIRTUAL_PAGE_ATTR)[this.get('active') ? 'show' : 'hide']();
	},

	_updateVirtualPageDimension: function() {
		var parent = this.get(PARENT),
			parentHeight,
			containerHeight;

		// TODO Fix or explain
		if (!parent) {
			return;
		}

		parentHeight = parent.get(BOUNDING_BOX).get('offsetHeight');
		containerHeight = Y.UA.ipad ? Y.one(Y.config.doc.body).get('scrollHeight') : Y.DOM.winHeight();

		this.get(VIRTUAL_PAGE_ATTR).set(HEIGHT, containerHeight - parentHeight);
	},

	_onWindowResize: function() {
		this._updateVirtualPageDimension();
	}
}, {
	ATTRS: {
		/**
		@attribute active
		@type Boolean
		@readOnly

		@description Whether or not this bread crumb is 'active'. Defined as whether this is the last crumb in the
		bread crumb trail.
		**/
		active: {
			readOnly: true,
			getter: function() {
				var parent = this.get(PARENT);
				return parent ? (this.get(INDEX) === parent.size() - 1) : false;
			}
		},

		/**
		@attribute label
		@type String

		@description The bread crumb's label.
		**/
		label: {
			setter: function(label) {
				this.get(CONTENT_BOX).setContent(label);
				return label;
			},
			validator: Y.Lang.isString
		},

		/**
		@attribute breadCrumbWidth
		@type Number

		@description The rendered bread crumb's width.
		**/
		breadCrumbWidth: {
			readOnly: true,
			validator: Y.Lang.isNumber
		},

		/**
		@attribute virtualPage
		@type OHP.VirtualPage | Object
		@writeOnce initOnly

		@description The VirtualPage associated with this bread crumb, displayed when this bread crumb is
		<a href="#attribute_active">active</a>.
		**/
		virtualPage: {
			writeOnce: 'initOnly',
			setter: function(value) {
				var bcTrail = this.get(PARENT),
					virtualPage,
					config,
					container;

				if (value instanceof Y.OHP.VirtualPage) {
					virtualPage = value;
				} else {
					config = Y.merge(value);

					// Unless the config explicitly specifies where to render the VirtualPage we render it into a container that we
					// insert after the BreadCrumbTrail to ensure the correct tab navigation.
					if (typeof config.srcNode === 'undefined' &&
							typeof config.boundingBox === 'undefined' &&
							typeof config.contentBox === 'undefined' &&
							(typeof config.render === 'undefined' ||
							config.render === true)) {

						container = Y.Node.create('<div>');
						bcTrail.get('boundingBox').insert(container, 'after');
						config.boundingBox = container;
					}

					virtualPage = new Y.OHP.VirtualPage(config);
				}

				virtualPage.set('zIndex', bcTrail.get('zIndex'));
				virtualPage.render();

				return virtualPage;
			}
		}
	}
});

// We don't use Y.Base.create for BreadCrumbTrail because we need a constructor:
// * the pageTitle property is not correctly parsed if no config is passed to the widget constructor
// * the zIndex property is set to 0 at construction time unless specified in the initial config

/**
Widget for opening content over the top of existing content (like a lightbox) emulating that a
whole new page has been opened with a bread crumb trail to navigate back to the initial content.

@class BreadCrumbTrail
@namespace OHP
@constructor
@extends Widget
@uses WidgetParent
@uses WidgetStack
@param {Object} config The user configuration for this instance of the BreadCrumbTrail.
**/
BreadCrumbTrail = function(config) {
	config = config || {};
	config.zIndex = config.zIndex || 99;

	BreadCrumbTrail.superclass.constructor.call(this, config);
};

BreadCrumbTrail.NAME = BREAD_CRUMB_TRAIL;

Y.extend(BreadCrumbTrail, Y.Widget, {
	// Currently this doesn't work on IE - see http://yuilibrary.com/forum/viewtopic.php?f=18&t=7041&p=22098#p22098
	// BOUNDING_TEMPLATE: '<nav></nav>',
	CONTENT_TEMPLATE: '<ul></ul>',

	initializer: function() {
		this._history = new Y.HistoryHash();
		// Clear history state
		this._history.replaceValue(HISTORY_STATE_KEY, null);
	},

	destructor: function() {
		// Close all associated BreadCrumbs (which should also hide the BreadCrumbTrail widget and remove the class on the document element)
		this._closeFromIndex(0);
	},

	bindUI: function() {
		this.after(EVT_VISIBLE_CHANGE, this._afterVisibleChange, this);
		this._history.on('change', this._onHistoryChange, this);
		this.after(EVT_ADD_CHILD, this._afterChildAdded, this);
		Y.one(Y.config.win).on('windowresize', this._positionBreadCrumbs, this);
	},

	/* Public API */

	/**
	@method open
	@description Opens a new virtual page with a bread crumb link back to the currently displayed content.

	@param {Y.OHP.VirtualPage|Object} page The VirtualPage to open or the config to construct one.
	@param {String} label (optional) The label for the bread crumb link to return to the current content.
	**/
	open: function(page, label) {
		var children,
			child,
			size;

		this.show();

		children = this.add({
			label: label || this._getBreadCrumbLabel(),
			virtualPage: page
		});

		size = children.size();

		if (size) {
			child = children.item(size - 1);
			child.focus();
			this._positionBreadCrumbs();
		}
	},

	/**
	@method closeActive
	@description Closes the active breadcrumb as if the user clicked on the element in the trail
	**/
	closeActive: function() {
		var newSize = this.size() - 1;
		this._history.replaceValue(HISTORY_STATE_KEY, newSize);
		this._closeFromIndex(newSize);
	},

	/* Private Methods */

	_afterVisibleChange: function(event) {
		var docEl = Y.one(Y.config.doc.documentElement);
		if (event.newVal) {
			docEl.addClass(HIDE_CONTENT_CLASS);
		} else {
			docEl.removeClass(HIDE_CONTENT_CLASS);

			// On some older versions of IE removing the class that had previously set the page to "visibility: hidden;" is apparently not
			// enough for IE to consider re-rendering those now-visible elements... We add and remove a dummy class to trigger a reflow
			// of the document so as to trick old IE into actually displaying visible elements.
			if (USING_OLD_IE) {
				Y.one(Y.config.doc.body).addClass('cow-trigger-reflow').removeClass('cow-trigger-reflow');
			}
		}
	},

	_closeFromIndex: function(index) {
		for (var i = this.size() - 1; i >= index; i -= 1) {
			this.remove(i).destroy();
		}
		this._updateVisibility();
		this._positionBreadCrumbs();
	},

	_getBreadCrumbLabel: function() {
		var size = this.size();
		return (size > 0 ? this.item(size - 1).get(VIRTUAL_PAGE_ATTR) : this).get('pageTitle');
	},

	_updateVisibility: function() {
		this[this.size() > 0 ? 'show' : 'hide']();
	},

	_onHistoryChange: function(event) {
		// We're only interested in outside changes, such as the ones generated when the user clicks the browser's back or forward buttons.
		if (event.src === Y.HistoryHash.SRC_HASH) {
			if (event.changed[HISTORY_STATE_KEY]) {
				this._closeFromIndex(parseInt(event.changed[HISTORY_STATE_KEY].newVal, 10));
			} else if (event.removed[HISTORY_STATE_KEY]) {
				this._closeFromIndex(0);
			}
		}
	},

	_afterChildAdded: function() {
		this._history.addValue(HISTORY_STATE_KEY, this.size());
	},

	// Set the contentBox width such that all the Bread Crumbs fit on one line.
	// If this width is wider than the bounding box, then position the contentBox from the right so the last Bread Crumb is visible.
	// Bread Crumb Trail is `position: fixed` so this will not result in scrollbars.
	_positionBreadCrumbs: function() {
		var bctContent = this.get(CONTENT_BOX),
			bctContentWidth = 0,
			PADDING_RIGHT = 6,
			bctWidth;

		// `this` is a widgetParent so size is the number of children (breadcrumbs)
		if (this.size() > 0) {
			this.each(function(breadCrumb){
				bctContentWidth += breadCrumb.get('breadCrumbWidth');
			}, this);

			bctWidth = parseInt(this.get(BOUNDING_BOX).getComputedStyle('width'), 10);

			bctContent.setStyle('width', bctContentWidth + PADDING_RIGHT);

			if (bctContentWidth > bctWidth) {
				if (!bctContent.hasClass(BREADCRUMBTRAIL_OVERFLOW)) {
					bctContent.addClass(BREADCRUMBTRAIL_OVERFLOW);
				}
			} else {
				bctContent.removeClass(BREADCRUMBTRAIL_OVERFLOW);
			}
		}
	}
});

Y.Base.mix(BreadCrumbTrail, [Y.WidgetParent, Y.WidgetStack]);

BreadCrumbTrail.ATTRS = Y.merge(BreadCrumbTrail.ATTRS, {
	/**
	@attribute activeBreadCrumb
	@readOnly
	@type {Y.OHP.BreadCrumb|null}

	@description The currently active BreadCrumb or null if no BreadCrumbs are active (i.e. the trail
	is currently not displayed).
	**/
	activeBreadCrumb: {
		readOnly: true,
		getter: function() {
			return this.get('visible') ? this.item(this.size() - 1) : null;
		}
	},

	defaultChildType: {
		readOnly: true,
		value: BreadCrumb
	},

	// Force single selection mode only
	multiple: {
		readOnly: true,
		value: false
	},

	/**
	@attribute pageTitle
	@default "Back"
	@type String

	@description The title of the page that hosts the BreadCrumbTrail widget. Used as the default label
	for the first BreadCrumb.
	**/
	pageTitle: {
		valueFn: function() {
			var titleNode = Y.one('h1, h2');
			return titleNode ? titleNode.get('text') : DEFAULT_PAGE_TITLE;
		},
		validator: Y.Lang.isString
	},

	shim: {
		value: true
	},

	visible: {
		value: false
	},

	zIndex: {
		value: 99
	}
});

OHP = Y.namespace('OHP');

OHP.BreadCrumb = BreadCrumb;
OHP.VirtualPage = VirtualPage;
OHP.BreadCrumbTrail = BreadCrumbTrail;


}, '7.9.0', {
    "requires": [
        "history",
        "ohp-locale-translations",
        "widget-stack",
        "node",
        "ohp-locale-base",
        "event-resize",
        "widget-stdmod",
        "widget-child",
        "substitute",
        "widget",
        "event-base",
        "widget-parent",
        "ohp-widget-resize-ie"
    ]
});
