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
YUI.add('ohp-scrollpane', function (Y, NAME) {

"use strict";
/**
The ScrollPane Widget is used for providing custom scrollbars to overflowing containers.

@module ohp-scrollpane
**/

/**
Provides ScrollPane instance

@class ScrollPane
@namespace OHP
@constructor
@extends Widget
@uses WidgetStdMod
**/
var ScrollPane,

	registerMouseWheelEvent,

	scrollInit,

	WidgetStdMod = Y.WidgetStdMod,
	Lang = Y.Lang,

	Locale = Y.OHP.Locale,

	getClassName = Y.OHP.OhpClassNameManager.getClassName,

	ALIGN_LEFT = 'left',
	ALIGN_RIGHT = 'right',

	WIDGET_NAME = 'ScrollPane',
	CLASS_NAME = WIDGET_NAME.toLowerCase(),

	SCROLL_INCREMENT = 25,

	MIN_THUMB_SIZE = 12,

	CLASS_VERTICAL = getClassName(CLASS_NAME, 'vertical'),
	CLASS_HORIZONTAL = getClassName(CLASS_NAME, 'horizontal'),

	CLASS_AUTOHIDE = getClassName(CLASS_NAME, 'autohide'),
	CLASS_ALIGN_LEFT = getClassName(CLASS_NAME, 'align', 'left'),
	CLASS_ALIGN_RIGHT = getClassName(CLASS_NAME, 'align', 'right'),

	CLASS_CONTAINER = getClassName(CLASS_NAME, 'container'),
	CLASS_CONTENT_AREA = getClassName(CLASS_NAME, 'content', 'area'),

	CLASS_HOVER = getClassName(CLASS_NAME, 'hover'),
	CLASS_DRAG = getClassName(CLASS_NAME, 'drag'),

	CLASS_INDICATOR = getClassName(CLASS_NAME, 'indicator'),
	CLASS_INDICATOR_BOTTOM = getClassName(CLASS_NAME, 'indicator', 'bottom'),
	CLASS_INDICATOR_TOP = getClassName(CLASS_NAME, 'indicator', 'top'),
	CLASS_OVERFLOW_BOTTOM = getClassName(CLASS_NAME, 'overflow', 'bottom'),
	CLASS_OVERFLOW_HORIZONTAL = getClassName(CLASS_NAME, 'overflow', 'horizontal'),
	CLASS_OVERFLOW_TOP = getClassName(CLASS_NAME, 'overflow', 'top'),
	CLASS_OVERFLOW_VERTICAL = getClassName(CLASS_NAME, 'overflow', 'vertical'),

	CLASS_SCROLLPANE = getClassName(CLASS_NAME),

	CLASS_SCROLLBAR = getClassName(CLASS_NAME, 'bar'),

	CLASS_VERTICAL_SCROLLBAR = getClassName(CLASS_NAME, 'vertical', 'bar'),
	CLASS_VERTICAL_TRACK = getClassName(CLASS_NAME, 'vertical', 'track'),
	CLASS_VERTICAL_THUMB = getClassName(CLASS_NAME, 'vertical', 'bar', 'drag'),

	CLASS_HORIZONTAL_SCROLLBAR = getClassName(CLASS_NAME, 'horizontal', 'bar'),
	CLASS_HORIZONTAL_TRACK = getClassName(CLASS_NAME, 'horizontal', 'track'),
	CLASS_HORIZONTAL_THUMB = getClassName(CLASS_NAME, 'horizontal', 'bar', 'drag'),

	CLASS_UP_LINK = getClassName(CLASS_NAME, 'vertical', 'bar', 'arrow', 'up'),
	CLASS_DOWN_LINK = getClassName(CLASS_NAME, 'vertical', 'bar', 'arrow', 'down'),
	CLASS_VERTICAL_ARROW = getClassName(CLASS_NAME, 'vertical', 'bar', 'arrow'),

	CLASS_LEFT_LINK = getClassName(CLASS_NAME, 'horizontal', 'bar', 'arrow', 'left'),
	CLASS_RIGHT_LINK = getClassName(CLASS_NAME, 'horizontal', 'bar', 'arrow', 'right'),
	CLASS_HORIZONTAL_ARROW = getClassName(CLASS_NAME, 'horizontal', 'bar', 'arrow'),

	CLASS_ARROW = getClassName(CLASS_NAME, 'arrow'),

	TEMPLATE_CONTENT_AREA = '<div class="' + CLASS_CONTENT_AREA + '"></div>',
	TEMPLATE_CONTAINER = '<div class="' + CLASS_CONTAINER + '"></div>',
	TEMPLATE_INDICATOR = '<a href="#" class="' + CLASS_INDICATOR + ' {className}">' +
							'<span class="ohp-screen-reader-only">{screenReaderText}</span>' +
							'<span></span>' +
						'</a>',

	TEMPLATE_VERTICAL_BAR = '<div class="' + CLASS_VERTICAL_SCROLLBAR + ' ' + CLASS_SCROLLBAR + '">' +
								'<a href="#" class="' + CLASS_VERTICAL_ARROW +' ' + CLASS_UP_LINK + ' ' + CLASS_ARROW + '">' +
									'<span class="ohp-screen-reader-only">{upScreenReaderText}</span>' +
								'</a>'+
								'<div class="'+ CLASS_VERTICAL_TRACK + '">' +
									'<div class="'+ CLASS_VERTICAL_THUMB + '" style="top: 0;"></div>' +
								'</div>' +
								'<a href="#" class="' + CLASS_VERTICAL_ARROW + ' ' + CLASS_DOWN_LINK + ' ' + CLASS_ARROW + '">' +
									'<span class="ohp-screen-reader-only">{downScreenReaderText}</span>' +
								'</a>'+
							'</div>',

	TEMPLATE_HORIZONTAL_BAR = '<div class="' + CLASS_HORIZONTAL_SCROLLBAR + ' ' + CLASS_SCROLLBAR + '">' +
									'<a href="#" class="' + CLASS_HORIZONTAL_ARROW + ' ' + CLASS_LEFT_LINK + ' ' + CLASS_ARROW + '">' +
										'<span class="ohp-screen-reader-only">{leftScreenReaderText}</span>' +
									'</a>'+
									'<div class="'+ CLASS_HORIZONTAL_TRACK + '">' +
										'<div class="' + CLASS_HORIZONTAL_THUMB + '" style="left: 0;"></div>' +
									'</div>' +
									'<a href="#" class="' + CLASS_HORIZONTAL_ARROW + ' ' + CLASS_RIGHT_LINK + ' ' + CLASS_ARROW + '">' +
										'<span class="ohp-screen-reader-only">{rightScreenReaderText}</span>' +
									'</a>'+
								'</div>',

	VERTICAL_SCROLL_PROPERTIES = {
		vertical: true,
		horizontal: false,
		sizeType: 'height',
		scrollSizeType: 'scrollHeight',
		posStyleType: 'top',
		scrollPosType: 'scrollTop',
		scrollbarClass: CLASS_VERTICAL_SCROLLBAR,
		trackClass: CLASS_VERTICAL_TRACK,
		thumbClass: CLASS_VERTICAL_THUMB,
		arrowClass: CLASS_VERTICAL_ARROW,
		overflowClass: CLASS_OVERFLOW_VERTICAL
	},

	HORIZONTAL_SCROLL_PROPERTIES = {
		vertical: false,
		horizontal: true,
		sizeType: 'width',
		scrollSizeType: 'scrollWidth',
		posStyleType: 'left',
		scrollPosType: 'scrollLeft',
		scrollbarClass: CLASS_HORIZONTAL_SCROLLBAR,
		trackClass: CLASS_HORIZONTAL_TRACK,
		thumbClass: CLASS_HORIZONTAL_THUMB,
		arrowClass: CLASS_HORIZONTAL_ARROW,
		overflowClass: CLASS_OVERFLOW_HORIZONTAL
	};

/*
 * Removes 'px' or 'pt' from Style Value to return Number
 *
 * @method getNumericStyle
 * @param {styleVal} Style Value to edit
 * @private
 */
function getNumericStyle(styleVal) {
	return Number(styleVal.replace(/px/, '').replace(/pt/, ''));
}

/*
 * Returns Computed Style in Numeric Form,
 * (e.g. a style value of '20px' would be returned as '20').
 *
 * @method getNumericComputedStyle
 * @private
 */
function getNumericComputedStyle(node, style) {
	return getNumericStyle(node.getComputedStyle(style));
}

/*
 * Register the global mousewheel event once per instance of YUI and only when there is an instantiated ScrollPane widget.
 * This is necessary because you can't subscribe to a mousewheel event for a particular node and you don't want multiple subscribers.
 *
 * @method registerMouseWheelEvent
 * @private
 */
registerMouseWheelEvent = (function() {
	var registered = false;
	return function() {
		if (!registered) {
			Y.on('ScrollPane|mousewheel', function(e) {
				// TODO Is this expensive to do on every scroll of the mouse wheel?
				var scrollPane = Y.Widget.getByNode(e.target),
					boundingBox,
					contentArea;
				if (scrollPane && scrollPane.get('vertical')) {
					boundingBox = scrollPane.get('boundingBox');
					contentArea = scrollPane.get('contentArea');
					if (e.wheelDelta > 0) {
						scrollPane._scroll(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, false);
					} else if (e.wheelDelta < 0) {
						scrollPane._scroll(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, true);
					}
					e.preventDefault();
				}
			});
			registered = true;
		}
	};
}());

ScrollPane = Y.Base.create(WIDGET_NAME, Y.Widget, [WidgetStdMod], {

	initializer: function() {
		/**
		@event scroll
		@description Fires when the ScrollPane scrolls it's content.
		@param e {Event.Facade} An Event Facade object with the following specific property added:
					<dl>
						<dt></dt><dd></dd>
					</dl>
		@type {Event.Custom}
		**/
		this.publish('scroll');

		/*
		 * Private _enableThumbSync property changed in relation to dragging.
		 *
		 * Most common scroll scenario is _enableThumbSync is true, because scrollTop
		 * is updated by mouseWheel or keyboard taboundingBoxing,
		 * and thumb needs to sync position in relation to this.
		 *
		 * When thumb is dragged, _enableThumbSync is false, because scrollTop is being
		 * changed in relation to thumb drag position already.
		 */
		this._enableThumbSync = true;
	},

	/*
	 * Widget lifecycle method used to create/insert new elements into the DOM
	 * To render the initial state of the widget
	 */
	renderUI: function() {
		var boundingBox = this.get('boundingBox'),
			contentBox = this.get('contentBox'),
			contentArea,
			parent =  boundingBox.get('parentNode'),
			parentHeight = getNumericComputedStyle(parent, 'height'),
			parentWidth = getNumericComputedStyle(parent, 'width');

		// The ohp-scrollpane class can be placed on elements to construct a ScrollPane using scrollInit().
		// Remove the class from the contentBox (constructed
		// from the srcNode) so that any CSS targeting the boundingBox with this class doesn't affect the contentBox.
		contentBox.removeClass(CLASS_SCROLLPANE);

		boundingBox.addClass(this.getClassName('loading'));

		this._renderBody(contentBox);

		/*
		 * Setting widget height/width sets boundingBox to this height/width
		 */
		this.set('height', parentHeight);
		this.set('width', parentWidth);

		// created in _renderBody
		contentArea = this.get('contentArea');

		// Store current scroll properties so that we can check if the value has changed before updating
		this._storeCurrentScrollSize('scrollHeight', contentArea.get('scrollHeight'));
		this._storeCurrentScrollSize('scrollWidth', contentArea.get('scrollWidth'));
		this._storeCurrentScrollPosition('scrollTop', contentArea.get('scrollTop'));
		this._storeCurrentScrollPosition('scrollLeft', contentArea.get('scrollLeft'));

		if (this.get('showVerticalIndicators')) {
			this._renderVerticalIndicators(boundingBox);
		}
		if (this.get('vertical')) {
			contentBox.addClass(CLASS_VERTICAL);
			this._renderVerticalScrollBar();
		}
		if (this.get('horizontal')) {
			contentBox.addClass(CLASS_HORIZONTAL);
			this._renderHorizontalScrollBar();
		}

		// TODO Don't render arrows at all if not used
		if (!this.get('showArrows')) {
			boundingBox.all('.' + CLASS_ARROW).setStyle('display', 'none');
		}

		contentBox.addClass(this.get('align') === ALIGN_LEFT ? CLASS_ALIGN_LEFT : CLASS_ALIGN_RIGHT);

		if (this.get('autoHide')) {
			contentBox.addClass(CLASS_AUTOHIDE);
		}
	},

	/**
	Renders Body and Contents.

	Body wraps Content Area (scrollbars are also later insterted into Body).
	Content Area wraps Container.
	Container wraps scrollpane content (which can be multiple elements).

	@method _renderBody
	@param contentBox {Node} Widget contentBox that all content is added to
	@private
	**/
	_renderBody: function(contentBox) {
		var body,
			contentContainer,
			contentArea;

		// Container wraps content
		contentContainer = contentBox.one('.' + CLASS_CONTAINER);
		if (!contentContainer) {
			contentContainer = Y.Node.create(TEMPLATE_CONTAINER);
			contentContainer.append(contentBox.get('children'));
		}

		// Body contains content area and scrollbar(s)
		body = this.getStdModNode(WidgetStdMod.BODY);
		if (!body || !body.contains(contentContainer)) {
			// Content area is inside body and wraps content container
			// Content area scrollTop changes to scroll content in container
			contentArea = Y.Node.create(TEMPLATE_CONTENT_AREA);
			this.setStdModContent(WidgetStdMod.BODY, contentArea);
			body = this.getStdModNode(WidgetStdMod.BODY);
			contentArea.append(contentContainer);
		}

		body.addClass(this.getClassName('body'));

		contentContainer.setStyle('width', 'auto');
		contentContainer.setStyle('height', 'auto');
	},

	/**
	Renders Top and Bottom Vertical Scroll Indicators

	@method _renderVerticalIndicators
	@param boundingBox {Node} Widget boundingBox that contains the whole ScrollPane widget
	@private
	**/
	_renderVerticalIndicators: function(boundingBox) {
		this._renderIndicator(boundingBox, WidgetStdMod.HEADER, CLASS_INDICATOR_TOP,
			Locale.get('widget.scrollPane.action.screenReader.scrollUp'));
		this._renderIndicator(boundingBox, WidgetStdMod.FOOTER, CLASS_INDICATOR_BOTTOM,
			Locale.get('widget.scrollPane.action.screenReader.scrollDown'));
	},
	/**
	Shortcut function to render a single Vertical Scroll Indicator

	@method _renderIndicator
	@param boundingBox {Node} Widget boundingBox that contains the whole ScrollPane widget
	@param stdModSection {WidgetStdMod.HEADER/BODY/FOOTER} WidgetStdMod Section in which to render the indicator
	@param indicatorClass {String} Class for type of Indicator
	@param screenReaderText {String} Text screenreader will announce when Indicator is focussed
	@private
	**/
	_renderIndicator: function(boundingBox, stdModSection, indicatorClass, screenReaderText) {
		var indicator,
			placeholder;

		indicator = Y.Node.create(Y.substitute(TEMPLATE_INDICATOR, {
			className: indicatorClass,
			screenReaderText: screenReaderText
		}));

		// Placeholder may already be in place in progressive enhancement scenarios
		placeholder = boundingBox.one('.' + indicatorClass);
		if (placeholder) {
			placeholder.replace(indicator);
		}

		this.setStdModContent(stdModSection, indicator);
	},

	/**
	Renders Vertical ScrollBar using TEMPLATE_VERTICAL_BAR into the WidgetStdMod.BODY Section.
	Stores height of ScrollBar Arrows if present.

	@method _renderVerticalScrollBar
	@private
	**/
	_renderVerticalScrollBar: function() {
		var verticalScrollBarContent = Y.substitute(TEMPLATE_VERTICAL_BAR, {
			upScreenReaderText: Locale.get('widget.scrollPane.action.screenReader.scrollUp'),
			downScreenReaderText: Locale.get('widget.scrollPane.action.screenReader.scrollDown')
		});

		this.setStdModContent(WidgetStdMod.BODY, verticalScrollBarContent, WidgetStdMod.AFTER);
	},

	/**
	Renders Horizontal ScrollBar using TEMPLATE_HORIZONTAL_BAR into the WidgetStdMod.BODY Section.
	Stores width of ScrollBar Arrows if present.

	@method _renderHorizontalScrollBar
	@private
	**/
	_renderHorizontalScrollBar: function() {
		var horizontalScrollBarContent = Y.substitute(TEMPLATE_HORIZONTAL_BAR, {
			leftScreenReaderText: Locale.get('widget.scrollPane.action.screenReader.scrollLeft'),
			rightScreenReaderText: Locale.get('widget.scrollPane.action.screenReader.scrollRight')
		});

		this.setStdModContent(WidgetStdMod.BODY, horizontalScrollBarContent, WidgetStdMod.AFTER);
	},

	/*
	 * Widget lifecycle method used to bind event listeners to drive the widget UI
	 * (will generally bind event listeners for attribute change events to update the UI in response,
	 * and attach any DOM events to activate the UI)
	 */
	bindUI: function() {
		var boundingBox = this.get('boundingBox'),
			contentBox = this.get('contentBox'),
			contentArea = this.get('contentArea'),
			vertical = this.get('vertical'),
			horizontal = this.get('horizontal');

		/*
		 * Only binds if Arrows exist, i.e. when enabled.
		 */
		this._bindScrollBarArrowEvents(boundingBox, contentArea);

		/*
		 * Only binds if Vertical/Horizontal Thumbs exist,
		 * i.e. only when that scrollbar is enabled.
		 */
		this._bindThumbDrag(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES);
		this._bindThumbDrag(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES);

		if (this.get('showVerticalIndicators')) {
			this._bindVerticalIndicatorEvents(boundingBox, contentArea);
		}

		// if mouse up from any arrows, or vertical indicators, stop scrolling
		boundingBox.on('mouseup', this._cancelScrollTimer, this);

		// Can only use mousewheel for vertical scrolling
		// TODO: Mac OS allows also horizontal scrolling in this way so should support this
		if (vertical) {
			registerMouseWheelEvent();
		}

		/*
		 * Event listeners for autoHide scrollbar
		 */
		boundingBox.on('mouseenter', function() {
			contentBox.addClass(CLASS_HOVER);
		});
		boundingBox.on('mouseleave', function() {
			contentBox.removeClass(CLASS_HOVER);
		});

		// TODO: the below functions... only if vertical/horizontal enabled..

		/*
		 * Fired in response to scrollTop/scrollHeight changing.
		 *
		 * Sometimes the scroll position is changed automatically by browser auto-scrolling so tabbed to element is visible.
		 * Other times scroll position is changed by this ScrollPane to scroll it's content.
		 *
		 * (Note that this is the browser 'scroll' event not the custom ScrollPane 'scroll' event.)
		 */
		contentArea.on('scroll', function _onBrowserScroll() {
			if (vertical) {
				this._updateIfBrowserScrollPositionChanged(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES);
			}
			if (horizontal) {
				this._updateIfBrowserScrollPositionChanged(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES);
			}
		}, this);

		// Poll to periodically check if anything has changed so the ScrollPane can keep in sync
		Y.later(200, this, function() {
			this._updateDimensionsIfChanged(boundingBox, contentBox, contentArea);
		}, null, true);
	},

	/**
	Binds event listeners for clicking Up, Down, Left and Right Scrollbar Arrows/Links to scroll

	@method _bindScrollBarArrowEvents
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_bindScrollBarArrowEvents: function(boundingBox, contentArea) {
		var upLink = boundingBox.one('.' + CLASS_UP_LINK),
			downLink = boundingBox.one('.' + CLASS_DOWN_LINK),
			leftLink = boundingBox.one('.' + CLASS_LEFT_LINK),
			rightLink = boundingBox.one('.' + CLASS_RIGHT_LINK);

		if (upLink) {
			this._bindScrollButtonEvents(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, false, upLink);
		}

		if (downLink) {
			this._bindScrollButtonEvents(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, true, downLink);
		}

		if (leftLink) {
			this._bindScrollButtonEvents(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES, false, leftLink);
		}

		if (rightLink) {
			this._bindScrollButtonEvents(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES, true, rightLink);
		}
	},

	/**
	Binds event listeners for dragging Scrollbar Thumb to scroll.
	Creates Y.DD.Drag Instance of thumb node.

	@method _bindThumbDrag
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to bind
	@private
	**/
	_bindThumbDrag: function(boundingBox, contentArea, scrollProperties) {
		var contentBox = this.get('contentBox'),
			thumb = boundingBox.one('.' + scrollProperties.thumbClass),
			track,
			thumbDrag;

		if (!thumb) {
			return;
		}

		track = boundingBox.one('.' + scrollProperties.trackClass);

		// Allow scrollbar thumb to be draggable constrained to track along "sticky" axis
		thumbDrag = new Y.DD.Drag({
			node: thumb
		}).plug(Y.Plugin.DDConstrained, {
			constrain: track,
			useShim: false,
			stickX: scrollProperties.horizontal,
			stickY: scrollProperties.vertical
		});

		// When drag in progress, supress thumb syncing to scroll pos changes,
		// as drag is changing thumbTop
		thumbDrag.on('start', function() {
			contentBox.addClass(CLASS_DRAG);
			this._enableThumbSync = false;
		}, this);

		// Turn thumb sync back on so thumbTop syncs to any changes in scroll pos
		thumbDrag.on('end', function(){
			contentBox.removeClass(CLASS_DRAG);
			this._enableThumbSync = true;
		}, this);

		// Update position of content in relation to where scrollbar dragged
		thumbDrag.on('drag', function() {
			var sizeType = scrollProperties.sizeType,
				thumbPos = getNumericComputedStyle(thumb, scrollProperties.posStyleType),
				thumbSize = getNumericComputedStyle(thumb, sizeType),
				trackSize = getNumericComputedStyle(track, sizeType),
				contentAreaSize = getNumericComputedStyle(contentArea, sizeType),
				scrollRatio,
				currentScrollSize,
				newScrollPos;

			// there will only ever be a thumb available if it is possible to scroll
			// therefore no need to zero check trackSize - thumbSize
			scrollRatio =  thumbPos / (trackSize - thumbSize);

			currentScrollSize = this._getStoredCurrentScrollSize(scrollProperties.scrollSizeType);

			newScrollPos = Math.round(scrollRatio * (currentScrollSize - contentAreaSize));

			this._updateContentScrollPosition(contentArea, scrollProperties, newScrollPos);

		}, this);
	},

	/**
	Binds event listeners for ScrollPane Vertical Scroll Indicators in the HEADER and FOOTER of the ScrollPane
	This includes binding custom 'scroll' event handler that updatesScrollIndicators in response to scrolling.
	A user can click a Vertical Scroll Indicator or focus a Vertical Scroll Indicator and Press Return to activate.
	A user can Click/Press Enter once to scroll once or they can Click/Press Enter and Hold for continuous scrolling.

	@method _bindVerticalIndicatorEvents
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_bindVerticalIndicatorEvents: function(boundingBox, contentArea) {
		/*
		 * Everytime custom scroll event is fired, check if Scroll Indicators should update
		 */
		this.on('scroll', function(){
			this._updateScrollIndicators(boundingBox, contentArea);
		}, this);

		this._bindScrollButtonEvents(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, false,
			boundingBox.one('.' + CLASS_INDICATOR_TOP));
		this._bindScrollButtonEvents(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES, true,
			boundingBox.one('.' + CLASS_INDICATOR_BOTTOM));
	},

	_bindScrollButtonEvents: function(boundingBox, contentArea, scrollProperties, increase, button) {
		var buttonScroll = function() {
			this._scroll(boundingBox, contentArea, scrollProperties, increase);
		};

		button.on({
			click: Y.bind(function(e) {
				e.preventDefault();
				buttonScroll.call(this);
			}, this),

			mousedown: Y.bind(function(e) {
				this._cancelScrollTimer();

				/*
				 * Private _scrollTimer property
				 */
				this._scrollTimer = Y.later(100, this, buttonScroll, null, true, contentArea);

				// preventing default stops dragging and allows mouseUp to fire and cancel the timer
				// but that means we have to explicitly focus the button
				button.focus();
				e.preventDefault();
			}, this)
		});
	},

	/**
	Cancels the scroll timers used with continuous scrolling through the scroll indicators or arrows

	@method _cancelScrollTimer
	@private
	**/
	_cancelScrollTimer: function() {
		if (this._scrollTimer) {
			this._scrollTimer.cancel();
			this._scrollTimer = null;
		}
	},

	/**
	This method fires a custom ScrollPane 'scroll' event if scroll pos (scrollTop/scrollLeft) is detected
	as different to last stored scroll Postion, (i.e. indicating browser has changed scroll pos),
	as well as calling the sync Thumb method to ensure the ScrollBar thumb syncs correctly
	to the scroll pos change.

	@method _updateIfBrowserScrollPositionChange
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to update
	@private
	**/
	_updateIfBrowserScrollPositionChanged: function(boundingBox, contentArea, scrollProperties) {
		var scrollPosType = scrollProperties.scrollPosType,
			scrollPos = contentArea.get(scrollPosType),
			currentScrollPos = this._getStoredCurrentScrollPosition(scrollPosType);

		if (scrollPos !== currentScrollPos) {
			// scrollPos (scrollTop/scrollLeft) has been changed by the browser
			// (e.g. when tabbing to nodes browser changes scroll pos to ensure they are visible)

			this._storeCurrentScrollPosition(scrollPosType, scrollPos);

			// Ensure ScrollPane custom scroll event also fired.
			this.fire('scroll');

			// Sync thumb in relation to new scroll pos
			this._syncThumbPosition(boundingBox, contentArea, scrollProperties);
		}
	},

	/**
	Update boundingBox size (i.e. width or height) if there are changes.
	Updates scrollSize (i.e. scrollHeight or scrollWidth) if there are changes.
	Calls update if any changes are detected.

	@method _updateDimensionsIfChanged
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentBox {Node} Widget contentBox that all content is added to
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_updateDimensionsIfChanged: function(boundingBox, contentBox, contentArea) {
		var parent = boundingBox.get('parentNode'),
			parentHeight = getNumericComputedStyle(parent, 'height'),
			parentWidth = getNumericComputedStyle(parent, 'width'),
			scrollHeight = contentArea.get('scrollHeight'),
			scrollWidth = contentArea.get('scrollWidth'),
			parentDimensionsChanged = false,
			scrollHeightChanged = false,
			scrollWidthChanged = false,
			boundingBoxOffsetHeight,
			currentHeight,
			currentWidth,
			currentScrollHeight,
			currentScrollWidth;

		// if we aren't visible, and have no dimensions, we can't size anything so give up
		if (parentWidth === 0 || parentHeight === 0 || scrollWidth === 0 || scrollHeight === 0) {
			return;
		}

		// Check if parent constraints have changed and update boundingBox size in response
		currentHeight = getNumericComputedStyle(boundingBox, 'height');
		currentWidth = getNumericComputedStyle(boundingBox, 'width');

		if (currentHeight !== parentHeight) {
			// Update bounding box size
			this.set('height', parentHeight);
			parentDimensionsChanged = true;
		}

		if (currentWidth !== parentWidth) {
			this.set('width', parentWidth);
			parentDimensionsChanged = true;
		}

		// most browsers report scrollSize of 0 if not displayed, but in IE7, if the scroll pane was visible before
		// it will still report the same scrollSize when it is hidden, offsetHeight will report 0 though, so also check this
		// but only after updating the dimensions to the parent dimensions
		boundingBoxOffsetHeight = boundingBox.get('offsetHeight');
		if (boundingBoxOffsetHeight === 0) {
			return;
		}

		// if parent dimensions have changed, tidy things up in case they were hidden on load
		if (this._syncDimensions) {
			// in IE7 if the scrollpane is not displayed when loaded,
			// the height of the contentBox is set to 0, we need to reset this
			contentBox.setStyle('height', '100%');
			this.fillHeight(this.getStdModNode(WidgetStdMod.BODY));
			this._syncDimensions = false;
		}

		if (this.get('vertical')) {
			currentScrollHeight = this._getStoredCurrentScrollSize('height');
			if (scrollHeight !== currentScrollHeight) {
				this._storeCurrentScrollSize('scrollHeight', scrollHeight);
				scrollHeightChanged = true;
			}
			if (parentDimensionsChanged || scrollHeightChanged) {
			// Update thumb and scroll position in relation to size changede
				this._updateScrollBarsAndIndicators(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES);
			}
		}

		if (this.get('horizontal')) {
			currentScrollWidth = this._getStoredCurrentScrollSize('width');
			if (scrollWidth !== currentScrollWidth) {
				this._storeCurrentScrollSize('scrollWidth', scrollWidth);
				scrollWidthChanged = true;
			}
			if (parentDimensionsChanged || scrollWidthChanged) {
				// Update thumb and scroll position in relation to size change
				this._updateScrollBarsAndIndicators(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES);
			}
		}
	},

	/**
	Returns stored current scrollWidth or scrollHeight depending on scrollSizeType passed.

	@method _getStoredCurrentScrollSize
	@param scrollSizeType {String} Accepted values are 'scrollWidth' or 'scrollHeight'
	@return scrollSize {Integer} Stored current scrollWidth or scrollHeight
	@private
	**/
	_getStoredCurrentScrollSize: function(scrollSizeType) {
		return this['_' + scrollSizeType];
	},

	/**
	Sets scrollSize value as current scrollWidth or scrollHeight depending on scrollSizeType passed.

	@method _storeCurrentScrollSize
	@param scrollSizeType {String} Accepted values are 'scrollWidth' or 'scrollHeight'
	@param scrollSize {Integer} New value to store as current scrollWidth or scrollHeight
	@private
	**/
	_storeCurrentScrollSize: function(scrollSizeType, scrollSize) {
		this['_' + scrollSizeType] = scrollSize;
	},

	/**
	Returns stored current scrollWidth or scrollHeight depending on scrollSizeType passed.

	@method _getStoredCurrentScrollPosition
	@param scrollPosType {String} Accepted values are 'scrollLeft' or 'scrollTop'
	@return scrollPos {Integer} Stored current scrollLeft or scrollTop
	@private
	**/
	_getStoredCurrentScrollPosition: function(scrollPosType) {
		return this['_' + scrollPosType];
	},

	/**
	Sets scrollPosition value as currently stored scrollLeft or scrollTop depending on scrollPosType passed.
	Note that this is different to _updateContentScrollPosition which actually changes the scrollTop/Left of the contentArea.
	This method just stores the current value.

	@method _storeCurrentScrollPosition
	@param scrollPosType {String} Accepted values are 'scrollLeft' or 'scrollTop'
	@param scrollPos {Integer} New value to store as current scrollLeft or scrollTop
	@private
	**/
	_storeCurrentScrollPosition: function(scrollPosType, scrollPos) {
		this['_' + scrollPosType] = scrollPos;
	},

	/*
	 * Widget lifecycle method used to update the UI to reflect the
	 * initial state of the widget after renderUI.
	 * Once this is called, the event listeners bound in bindUI will
	 * take over UI updates reflecting any state changes.
	 */
	syncUI: function() {
		var boundingBox = this.get('boundingBox'),
			contentArea = this.get('contentArea'),
			// use scrollHeight to determine if contentArea is displayed and so has dimensions
			scrollHeight = contentArea.get('scrollHeight');

		// If it does not have dimensions, we will have to update dimensions later before doing anything else
		if (scrollHeight <= 0) {
			this._syncDimensions = true;
			return;
		}

		if (this.get('horizontal')) {
			this._updateScrollBarsAndIndicators(boundingBox, contentArea, HORIZONTAL_SCROLL_PROPERTIES);
		}

		if (this.get('vertical')) {
			this._updateScrollBarsAndIndicators(boundingBox, contentArea, VERTICAL_SCROLL_PROPERTIES);
		}
	},

	/**
	Updates ScrollBars and Indicators. Should be called if size of boundingBox or inner content changes.

	Is called by widget lifecycle method syncUI to update the UI to reflect initial state after renderUI.
	After that it can be called whenever content is changed so UI is updated to reflect state.
	(cannot just call syncUI as other 'before' and 'after' methods are bound to that lifecycle point
	in relation to syncing to initial state)

	@method _updateScrollBarsAndIndicators
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to update
	@private
	**/
	_updateScrollBarsAndIndicators: function(boundingBox, contentArea, scrollProperties) {
		this._updateScrollBar(boundingBox, contentArea, scrollProperties);
		// only have vertical indicators, so... need to check if thats the dimension we are updating
		if (scrollProperties.vertical && this.get('showVerticalIndicators')) {
			this._updateScrollIndicators(boundingBox, contentArea);
		}
	},

	/**
	Updates size of Relevant ScrollBar Track and Thumb (sizes thumb in relation to current track width and scale)

	@method _updateScrollBar
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to update
	@private
	**/
	_updateScrollBar: function(boundingBox, contentArea, scrollProperties) {
		var sizeType = scrollProperties.sizeType,
			currentScrollSize = this._getStoredCurrentScrollSize(scrollProperties.scrollSizeType),
			contentAreaSize = getNumericComputedStyle(contentArea, sizeType),
			overflow = currentScrollSize > contentAreaSize,
			arrowSelector = '.' + scrollProperties.arrowClass,
			scrollbar,
			track,
			thumb,
			trackSize,
			thumbSize,
			scale;

		// Add overflow class to update display of scrollbars etc
		boundingBox[overflow ? 'addClass' : 'removeClass'](scrollProperties.overflowClass);

		// if not overflowing, don't bother updating size of anything (this crashed IE7 if we try)
		if (!overflow) {
			return;
		}

		scrollbar = boundingBox.one('.' + scrollProperties.scrollbarClass);
		track = boundingBox.one('.' + scrollProperties.trackClass);
		thumb = boundingBox.one('.' + scrollProperties.thumbClass);

		trackSize = getNumericComputedStyle(scrollbar, sizeType);
		if (this.get('showArrows')) {
			scrollbar.all(arrowSelector).each(function(arrow) {
				trackSize -= getNumericComputedStyle(arrow, sizeType);
			});
		}
		track.setStyle(sizeType, trackSize + 'px');

		scale = currentScrollSize / contentAreaSize;

		// Update and set size of drag handle in relation to track and scale
		thumbSize = Math.max(MIN_THUMB_SIZE, Math.round(trackSize / scale));
		thumb.setStyle(sizeType, thumbSize);

		// Make sure thumbPosition and scrollPosition are in sync
		this._syncThumbPosition(boundingBox, contentArea, scrollProperties, track, thumb);
	},

	/**
	Checks for overflow and displays or hides Scroll Indicators in response.
	If there is content to scroll down to Bottom Indicator shows.
	If there is content to scroll up to Top Indicator shows.

	@method _updateScrollIndicators
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_updateScrollIndicators: function(boundingBox, contentArea) {
		var isOverflowTop = this._isOverflowTop(contentArea),
			isOverflowBottom = this._isOverflowBottom(contentArea);

		boundingBox[isOverflowBottom ? 'addClass' : 'removeClass'](CLASS_OVERFLOW_BOTTOM);
		boundingBox[isOverflowTop ? 'addClass' : 'removeClass'](CLASS_OVERFLOW_TOP);
	},

	/**
	Returns true if there is content to scroll up to.
	Called by _updateScrollIndicators

	@method _isOverflowTop
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_isOverflowTop: function(contentArea) {
		var scrollTop = contentArea.get('scrollTop');
		return scrollTop > 0;
	},

	/**
	Returns true if there is content to scroll down to.
	Called by _updateScrollIndicators

	@method _isOverflowBottom
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@private
	**/
	_isOverflowBottom: function(contentArea) {
		var scrollTop = contentArea.get('scrollTop'),
			maxScrollTop = this._getMaxScrollPosition(contentArea, VERTICAL_SCROLL_PROPERTIES);

		return scrollTop < maxScrollTop;
	},

	/**
	Returns the maximum position that can be scrolled to for the given scroll properties.

	@method _getMaxScrollPosition
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to update
	@return maxScrollPosition {Integer} The maximum position that can be scrolled to
	@private
	**/
	_getMaxScrollPosition: function(contentArea, scrollProperties) {
		var contentAreaSize = getNumericComputedStyle(contentArea, scrollProperties.sizeType),
			currentScrollSize = this._getStoredCurrentScrollSize(scrollProperties.scrollSizeType),
			maxScrollSize = currentScrollSize - contentAreaSize;

		return maxScrollSize;
	},

	/**
	Is passed new value to set as scrollTop/scrollLeft of contentArea, to enable scrolling of content.
	Fires custom scroll event once changed. Sets newScrollPos as _currentScrollTop/_currentScrollLeft private property
	to keep track of when browser scrolls content automatically (e.g. when keeping focussed elements visible).

	@method _updateContentScrollPosition
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to update
	@param newScrollPos {String} Value to set as new scrollTop/scrollLeft of content area, in order to scroll content.
	@private
	**/
	_updateContentScrollPosition: function(contentArea, scrollProperties, newScrollPos) {
		var scrollPosType = scrollProperties.scrollPosType,
			maxScrollPos = this._getMaxScrollPosition(contentArea, scrollProperties);

		if (newScrollPos <= 0) {
			newScrollPos = 0;
			this._cancelScrollTimer();
		}

		if (newScrollPos >= maxScrollPos) {
			newScrollPos = maxScrollPos;
			this._cancelScrollTimer();
		}

		// Store the current value
		// Must store before change, so when browser scroll event handler runs, correct current is set.
		this._storeCurrentScrollPosition(scrollPosType, newScrollPos);

		// Change the scroll position
		contentArea.set(scrollPosType, newScrollPos);
		// Changing scrollTop fires Node scroll event (different to custom ScrollPane 'scroll' event)

		// This fires the ScrollPane custom event 'scroll'
		this.fire('scroll');
	},

	/**
	Updates position of Relevant ScrollBar Thumb in relation to scrollPos,
	(of type scrollPosType either scrollLeft or scrollTop, worked out from passed sizeType).

	@method _syncThumbPosition
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to sync
	@param [track] {Node} ScrollBar Track Node (optional - only specify if you already have a reference)
	@param [thumb] {Node} ScrollBar Thumb Node (optional - only specify if you already have a reference)
	@private
	**/
	_syncThumbPosition: function(boundingBox, contentArea, scrollProperties, track, thumb) {

		if (!this._enableThumbSync) {
			// _enableThumbSync is false when thumb is being dragged.
			// When thumb is dragged, scrollTop/Left is being updated
			// in relation to this, so therefore thumb does
			// not need syncing.
			return;
		}

		var sizeType = scrollProperties.sizeType,
			currentScrollSize = this._getStoredCurrentScrollSize(scrollProperties.scrollSizeType),
			contentAreaSize = getNumericComputedStyle(contentArea, sizeType),
			scrollPos,
			maxScrollPos,
			scrollRatio,
			thumbSize,
			trackSize,
			maxThumbPos,
			thumbPos;

		if (currentScrollSize <= contentAreaSize) {
			return;
		}

		// support passing these in, but if they aren't specified, find them
		track = track || boundingBox.one('.' + scrollProperties.trackClass);
		thumb = thumb || boundingBox.one('.' + scrollProperties.thumbClass);

		scrollPos = contentArea.get(scrollProperties.scrollPosType);
		maxScrollPos = currentScrollSize - contentAreaSize;
		scrollRatio = scrollPos / maxScrollPos;

		thumbSize = getNumericComputedStyle(thumb, sizeType);
		trackSize = getNumericComputedStyle(track, sizeType);
		maxThumbPos = trackSize - thumbSize;
		// Ensure position is not set to a fractional number so the drag calculations work.
		thumbPos = Math.round(scrollRatio * maxThumbPos);
		thumb.setStyle(scrollProperties.posStyleType, thumbPos);
	},

	/**
	Increases (down/right) or decreases (up/left) scroll position by static SCROLL_INCREMENT value.
	Calls _updateContentScrollPosition with new scrollPos value and ensures Thumb sync.

	@method _scroll
	@param boundingBox {Node} ScrollPane boundingBox that contains the whole ScrollPane widget
	@param contentArea {Node} ScrollPane contentArea that contains the content to scroll
	@param scrollProperties {Object} The scroll properties for the scroll axis to scroll
	@param increase {boolean} Whether to increase the scroll position (true scrolls down/right, false scrolls up/left)
	@private
	**/
	_scroll: function(boundingBox, contentArea, scrollProperties, increase) {
		var increment = increase ? SCROLL_INCREMENT : -SCROLL_INCREMENT,
			newScrollPos;

		newScrollPos = contentArea.get(scrollProperties.scrollPosType) + increment;

		this._updateContentScrollPosition(contentArea, scrollProperties, newScrollPos);
		this._syncThumbPosition(boundingBox, contentArea, scrollProperties);
	}

}, {

	CSS_PREFIX: getClassName(CLASS_NAME),

	/*
	 * The attribute configuration for the widget. This defines the core user facing state of the widget.
	 */
	ATTRS: {
		/**
		When set to true, ScrollPane instance has a draggable Vertical ScrollBar.

		@config vertical
		@default true
		@type Boolean
		@writeOnce initOnly
		**/
		vertical: {
			validator: Lang.isBoolean,
			value: true,
			writeOnce: 'initOnly'
		},
		/**
		When set to true, ScrollPane instance has a draggable Horizontal ScrollBar.

		@config horizontal
		@default false
		@type Boolean
		@writeOnce initOnly
		**/
		horizontal: {
			validator: Lang.isBoolean,
			value: false,
			writeOnce: 'initOnly'
		},
		/**
		When set to true the ScrollBars include clickable Arrows at each end.

		@config showArrows
		@default false
		@type Boolean
		@writeOnce initOnly
		**/
		showArrows: {
			validator: Lang.isBoolean,
			value: false,
			writeOnce: 'initOnly'
		},
		/**
		When set to true the ScrollBars are hidden by default and only visible
		when the mouse is hovered over the ScrollPane.

		@config autoHide
		@default false
		@type Boolean
		@writeOnce initOnly
		**/
		autoHide: {
			validator: Lang.isBoolean,
			value: false,
			writeOnce: 'initOnly'
		},
		/**
		Whether to align the Vertical ScrollBar on the left or right side of the content.
		Accepted values are 'left' or 'right'.

		@config align
		@default 'right'
		@type String
		@writeOnce initOnly
		**/
		align: {
			value: ALIGN_RIGHT,
			validator: function(val) {
				if (!Lang.isValue(val) || !Lang.isString(val)) {
					return false;
				}
				var lowerVal = val.toLowerCase();
				return lowerVal === ALIGN_LEFT || lowerVal === ALIGN_RIGHT;
			},
			writeOnce: 'initOnly'
		},
		/**
		When set to true Vertical overflow Indicators are enabled.
		These Indicators are arrows above and below the ScrollPane content,
		that are visible when there is overflow in that respective direction.

		@config showVerticalIndicators
		@default false
		@type Boolean
		@writeOnce initOnly
		**/
		showVerticalIndicators: {
			validator: Lang.isBoolean,
			value: false,
			writeOnce: 'initOnly'
		},
		/**
		The Node that the content scrolls inside.

		@config contentArea
		@readOnly
		@type Node
		**/
		contentArea: {
			getter: function() {
				var contentArea = this.getStdModNode(WidgetStdMod.BODY).one('.' + CLASS_CONTENT_AREA);
				return contentArea;
			},
			readOnly: true
		}
	},

	HTML_PARSER: {
		align: function(srcNode) {
			return srcNode.hasClass(CLASS_ALIGN_LEFT) ? ALIGN_LEFT : ALIGN_RIGHT;
		},

		autoHide: function(srcNode) {
			return srcNode.hasClass(CLASS_AUTOHIDE);
		}
	}
});

Y.namespace('OHP').ScrollPane = ScrollPane;

/**
Static shortcut function for Progressively Enhancing any number of ScrollPane instances on one page
through specific classes.
These include 'ohp-scrollpane', ohp-scrollpane-vertical' and 'ohp-scrollpane-horizontal'.

@method Y.OHP.ScrollPane.scrollInit
@public
**/
scrollInit = function() {

	function createNewScrollPane(config) {
		config = config || {};

		function isScrollPane(node) {
			var spNode;

			node = Y.one(node);
			if (!node) {
				return false;
			}

			spNode = node.ancestor('.' + CLASS_SCROLLPANE, true);
			return spNode && spNode.one('.' + CLASS_CONTAINER);
		}

		return function(node) {
			if (!isScrollPane(node)) {
				new Y.OHP.ScrollPane(Y.merge({
					srcNode: node,
					render: true
				}, config));
			}
		};
	}

	Y.all('.ohp-scrollpane-vertical').each(createNewScrollPane());
	Y.all('.ohp-scrollpane-horizontal').each(createNewScrollPane({
		horizontal: true,
		vertical: false
	}));
	Y.all('.' + CLASS_SCROLLPANE).each(createNewScrollPane({
		horizontal: true
	}));
};

ScrollPane.scrollInit = scrollInit;

// TODO: need whole rollup? include event-base and event-mousewheel ?


}, '7.9.0', {
    "requires": [
        "ohp-locale-translations",
        "node",
        "ohp-locale-base",
        "ohp-ohp-class-name-manager",
        "event",
        "widget-stdmod",
        "substitute",
        "widget",
        "dd-constrain",
        "yui-later"
    ]
});
