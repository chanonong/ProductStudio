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
YUI.add('ohp-widget-resize-ie', function (Y, NAME) {

/**
Plugin for various fixes to issues that occur when resizing a widget on IE (6 in particular). Current fixes include: using
WidgetStdMod and 'fillHeight' causes a widget to not resize correctly, and iframes embedded in widgets often mysteriously
disappear after resizing the window/widget.

@module ohp-widget-resize-ie
**/
var FILL_HEIGHT = 'fillHeight',
	HEIGHT_CHANGE = 'heightChange',
	HOST = 'host',

	TMP_FIX_VISIBILITY_CLASS = Y.ClassNameManager.getClassName('tmp', 'fixvisibility'),

	WidgetResizeIE;

/**
Plugin for various fixes to issues that occur when resizing a widget on IE.

@class WidgetResizeIE
@namespace OHP
@constructor
@extends Plugin.Base
**/
WidgetResizeIE = Y.Base.create('ohp-widget-resize-ie', Y.Plugin.Base, [], {
	_usingStdMod: false,

	initializer: function() {
		// Check if the host widget is using WidgetStdMod
		if (!Y.Lang.isUndefined(this.get(HOST).getStdModNode)) {
			this._usingStdMod = true;
		}
		this.afterHostMethod('bindUI', this._afterHostBindUI, this);
	},

	_afterHostBindUI: function() {
		if (this._usingStdMod) {
			this.doBefore(HEIGHT_CHANGE, this._onHeightChangeFixFillHeight, this);
			this.doAfter(HEIGHT_CHANGE, this._afterHeightChangeFixFillHeight, this);
		}
		this.doAfter(HEIGHT_CHANGE, this._fixIframeVisibility, this);
		this.afterHostMethod(FILL_HEIGHT, this._fixIframeVisibility, this);
		Y.on('windowresize', this._fixIframeVisibility, this);
	},

	/**
	Zeros out the height of the 'fillHeight' node so that the content box can correctly resize. Height is restored again
	in <a href="#_afterHeightChangeFixFillHeight">_afterHeightChangeFixFillHeight</a>.

	@method _onHeightChangeFixFillHeight
	@private
	**/
	_onHeightChangeFixFillHeight: function(event) {
		if (event.newVal !== event.prevVal) {
			var host = this.get(HOST),
				fillHeightNode;
			fillHeightNode = host.getStdModNode(host.get(FILL_HEIGHT));
			if (fillHeightNode) {
				fillHeightNode.set('offsetHeight', 0);
			}
		}
	},

	/**
	Restores the height of the 'fillHeight' node after resizing the widget.

	@method _afterHeightChangeFixFillHeight
	@private
	**/
	_afterHeightChangeFixFillHeight: function() {
		var host = this.get(HOST),
			fillHeightNode;
		fillHeightNode = host.getStdModNode(host.get(FILL_HEIGHT));
		if (fillHeightNode) {
			host.fillHeight(fillHeightNode);
		}
	},

	/**
	Fixes the visibility of any iframes in the widget after resizing the window/widget.

	@method _fixIframeVisibility
	@private
	**/
	_fixIframeVisibility: function() {
		// iframes mysteriously disappear when resizing the window on IE 6. Toggling a class which toggles the
		// visibility of the iframes works around this issue.
		var iframes = this.get(HOST).get('contentBox').all('iframe');
		if (iframes) {
			iframes.addClass(TMP_FIX_VISIBILITY_CLASS);
			iframes.removeClass(TMP_FIX_VISIBILITY_CLASS);
		}
	}
}, {
	NS: 'ohp-widget-resize-ie'
});

Y.namespace('OHP').WidgetResizeIE = WidgetResizeIE;


}, '7.9.0', {"requires": ["widget-stdmod", "widget", "plugin"]});
