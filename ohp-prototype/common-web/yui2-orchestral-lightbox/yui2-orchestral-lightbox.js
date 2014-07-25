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
YUI.add('yui2-orchestral-lightbox', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, window */

YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget for displaying a lightbox.
 *
 * @module orchestral-lightbox
 * @requires yahoo, orchestral, container
 * @namespace ORCHESTRAL.widget
 * @title Lightbox
 */
(function() {
	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom,
		lang = YAHOO.lang;

	/**
	 * A widget for displaying a lightbox.
	 *
	 * @class Lightbox
	 * @namespace ORCHESTRAL.widget
	 * @extends YAHOO.widget.Dialog
	 * @constructor
	 * @param el {String | HTMLElement} The element or ID of the element containing the lightbox content.
	 * @param config {object} (optional) Object literal of configuration values.
	 */
	var Lightbox = function(el, config) {
		if (!Dom.get(el)) {
			YAHOO.log('No element passed to Lightbox constructor', 'warn');
			return;
		}

		this.viewportWidth = null;
		this.viewportHeight = null;
		this.initialZIndex = null;

		Dom.setStyle(el, 'display', 'block');

		// Merges the default config with the passed config.
		// The properties of later objects will overrite those in earlier objects.
		config = lang.merge({
			autofillheight: 'body',
			draggable: false,
			// Fixed centering causes "maximum call stack size exceeded" errors on Safari Mobile on iPad.
			// The call to resize() below centers the lightbox and as the window can't resize it does not need to be fixed to center.
			// 'contained' means it won't center if there isn't enough space, allowing the user to scroll the viewport to see everything
			fixedcenter: YAHOO.env.ua.mobile ? false : 'contained',
			naturalwidth: Dom.hasClass(el, 'natural-content-width'),
			modal: true,
			underlay: 'shadow',
			visible: false
		}, config || {});

		Lightbox.superclass.constructor.call(this, el, config);

		config = config || {};

		if (config.sidebar) {
			Dom.addClass(this.element, 'lightbox-sidebar-enabled');
		}

		/**
		 * Whether the lightbox should size to content, rather than min-width applying. Write once.
		 * @config naturalwidth
		 * @type Boolean
		 */
		Dom[config.naturalwidth ? 'addClass' : 'removeClass'](el, 'natural-content-width');

		if (config.width) {
			// Explicit width is configured.
			Dom.removeClass(el, 'natural-content-width');
		}

		// Firefox 4.x identifies itself as gecko 2.x (e.g. FF 4.0.1 is gecko 2.01) - see http://developer.yahoo.com/yui/docs/YAHOO.env.ua.html#property_gecko
		if (Math.floor(ORCHESTRAL.env.ua.gecko) === 2 || Math.floor(ORCHESTRAL.env.ua.gecko) === 5 || Math.floor(ORCHESTRAL.env.ua.gecko) === 6) {
			this.changeBodyEvent.subscribe(function(e) {
				Dom.setStyle(this.body, 'height', 'auto');
				this.resize();
			});
		}

		Dom.setStyle(this.body, 'height', 'auto');

		if (!config.visible) {
			Dom.addClass(this.element, 'cow-lightbox-hidden');
		}

		this.render();
		this.resize();

		if (YAHOO.env.ua.mobile) {
			// For iPad, the lightbox only needs to be repositioned on initial render and orientation change.
			// So it is simply always posiitoned in the center of the full screen (not counting zoom).
			// It is not necessary to reposition when scrolled, zoomed or on show, because the user should be
			// able to scroll around/zoom etc without the lightbox moving around.

			YAHOO.util.Event.on(window, 'orientationchange', function(e){
				// Resize should be called when window changes orientation (portrait/landscape)
				// as height changes in this context.
				this.resize();
			}, this, true);

		} else {

			// Calling resize() appears to trigger a resize event on Safari Mobile on iPad,
			// which causes a recursive loop ending in a "maximum call stack size exceeded" error.
			// Resize events are only necessary for window size changing, which does not occur on iPad.
			YAHOO.widget.Overlay.windowResizeEvent.subscribe(function () {
				if (this.viewportWidth === Dom.getViewportWidth() && this.viewportHeight === Dom.getViewportHeight()) {
					// IE8 triggers a window resize event when scrollbars appear/disappear. In this situation
					// it causes the resize method to be continually be called and it screws up scrolling in
					// overflowing lightboxes. We fix this by only resizing when we see the browser viewport
					// dimensions change.
					return;
				}
				this.resize();
			}, null, this);

			// For the case of lightbox height increasing below end of the window (rather than just the case of window resizing).
			// Otherwise due to absolute positioning of lightbox to top, could never scroll down to see the bottom of the lightbox.
			YAHOO.widget.Overlay.windowScrollEvent.subscribe(this.resize, null, this);
		}

		this.beforeShowEvent.subscribe(function(){
			Dom.removeClass(this.element, 'cow-lightbox-hidden');
		});

		this.showEvent.subscribe(function(){
			Dom.setStyle(this.body, 'height', 'auto');
			this.resize();
		});

		// TODO: when height has been explicitly set (i.e. no longer auto) - when form in lightbox decreases in height again,
		// the lightbox does not resize smaller.
	};
	lang.extend(Lightbox, YAHOO.widget.Dialog, {

		// Overriding the Dialog method.
		// If no form element is present, don't add a form element.
		// (original method creates and appends a form element if one is
		// not present causing validation errors and being unnecessary).
		registerForm: function() {
			var form = this.element.getElementsByTagName('form')[0];

			if (this.form) {
				if (this.form == form && Dom.isAncestor(this.element, this.form)) {
					return;
				} else {
					Event.purgeElement(this.form);
					this.form = null;
				}
			}

			if (form) {
				this.form = form;
				Event.on(form, 'submit', this._submitHandler, this, true);
			}
		},

		// _onElementFocus forces all elements not in a modal lightbox to blur if focussed.
		// If an Orchestral date time widget is used in a lightbox then elements within it would
		// lose focus when clicked because the calendar container is not a descendant of the lightbox.
		// We override the focus handling for the lightbox to prevent this undesirable behaviour.
		_onElementFocus: function(e) {
			if (!Dom.isAncestor('OrchestralCalendar', YAHOO.util.Event.getTarget(e))) {
				Lightbox.superclass._onElementFocus.call(this, e);
			}
		},

		bringToTop: function() {
			// save initial z-index so that we care reset it after hiding it
			// this prevents the zindex endless growing till it ends up accidentally on top of other specific z index layers
			this.initialZIndex = this.cfg.getProperty('zindex');

			// Note: If there is only one Lightbox(Overlay) on the page, bringToTop doesn't bump its z-index.
			Lightbox.superclass.bringToTop.apply(this, arguments);

			// Because of a specific fix for iOS7 (COW-3216), we set z-index as "-1" to prevent the visibility:hidden
			// lightboxes from consuming user input (e.g. taps).
			if(YAHOO.env.ua.mobile === 'Apple' && this.cfg.getProperty('zindex') == -1) {
				// Set z-index as 2 because the mask's z-index is set 1 less than the lightbox panel.
				this.cfg.setProperty('zindex', 2);
			}
		},

		// override to init an additional event
		initEvents: function() {
			Lightbox.superclass.initEvents.apply(this, arguments);

			// reset the z-index back to what it was, as described above
			this.hideEvent.subscribe(function(event) {
				Dom.addClass(this.element, 'cow-lightbox-hidden');
				this.cfg.setProperty('zindex', this.initialZIndex);
			});
		},

		initDefaultConfig: function(config) {
			Lightbox.superclass.initDefaultConfig.call(this, config);

			/**
			 * Whether the lightbox's body should fill the available page height.
			 * @config fillPageHeight
			 * @type Boolean
			 * @default false
			 */
			this.cfg.addProperty('fillPageHeight', {
				value: false,
				validator: lang.isBoolean,
				handler: this.resize
			});

			/**
			 * The element containing the content to display in a sidebar on the lightbox. The
			 * width of the sidebar will be determined from the width of this element. Write once.
			 * @config sidebar
			 * @type String | Element
			 */
			this.cfg.addProperty('sidebar', {
				writeOnce: true,
				validator: function(value) {
					return Dom.get(value) !== null;
				},
				handler: function(type, args, obj) {
					var sidebar = Dom.get(args[0]),
						timer = null,
						position = function() {
							// Set the sidebar z-index so it doesn't appear under the lightbox mask or underlay shadow.
							Dom.setStyle(sidebar, 'z-index', Dom.getStyle(this.element, 'z-index'));
							Dom.setStyle(sidebar, 'height', this.innerElement.offsetHeight + 'px');
							Dom.setXY(sidebar, [Dom.getX(this.innerElement) + this.innerElement.offsetWidth, Dom.getY(this.innerElement)]);
						};

					this.beforeShowEvent.subscribe(function() {
						Dom.setStyle(sidebar, 'display', 'block');
						Dom.setStyle(this.innerElement, 'margin-right', sidebar.offsetWidth + 'px');
						// Reposition the sidebar whenever the window or the content of the lightbox changes. The timer alone would
						// be sufficient triggering on window resizes makes the updating more responsive when the browser window
						// is resized.
						YAHOO.widget.Overlay.windowResizeEvent.subscribe(position, null, this);
						timer = lang.later(250, this, position, null, true);
					});
					this.showEvent.subscribe(position);
					this.beforeHideEvent.subscribe(function() {
						YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(position);
						timer.cancel();
						Dom.setStyle(sidebar, 'display', 'none');
					});
				}
			});
		},

		configButtons: function(type, args, obj) {
			// args[0] will be a string if no buttons have been configured.
			var buttons = args[0],
				i;
			for (i = 0; lang.isArray(buttons) && i < buttons.length; i++) {
				buttons[i].type = buttons[i].isDefault ? 'primary' : 'link';
			}
			Lightbox.superclass.configButtons.apply(this, arguments);
		},

		configWidth: function(type, args, obj) {
			var el = this.innerElement,
				width = args[0];
			// When width cfg set, remove the min-width so specified width is invoked.
			Dom.setStyle(el, 'min-width', width);
			Lightbox.superclass.configWidth.apply(this, arguments);
		},

		resize: function() {
			var fillPageHeight = this.cfg.getProperty('fillPageHeight'),
				visible = this.cfg.getProperty('visible');

			this.viewportWidth = Dom.getViewportWidth();
			this.viewportHeight = Dom.getViewportHeight();

			if (!fillPageHeight) {
				// The window may have increased in size so we restore the lightbox to its natural height
				// as it may be able to consume more vertical real estate.
				Dom.setStyle([this.innerElement, this.body], 'height', 'auto');
				if (visible && this.fitsInViewport()) {
					this.center();
				}
			}
			if (fillPageHeight || this.element.offsetHeight > Dom.getViewportHeight() - 30) {
				// We test if the lightbox is going to be too high to fit in the window by comparing the viewport height to the height of the lightbox
				// wrapper element (this.element). Because the height configuration attribute of the lightbox gets applied to the child of the wrapper
				// element we need to take the child's padding into account when setting it otherwise we will end up with a vertical scrollbar on the
				// entire page when the lightbox gets restricted to the page height.
				var verticalPadding = parseInt(Dom.getStyle(this.innerElement, 'padding-top')) + parseInt(Dom.getStyle(this.innerElement, 'padding-bottom'));
				// We set the height twice because the viewport height can change after the first set (horizontal scrollbars
				// may have disappeared, changing the viewport height).
				this.cfg.setProperty('height', (Dom.getViewportHeight() - 30 - verticalPadding) + 'px');
				this.cfg.setProperty('height', (Dom.getViewportHeight() - 30 - verticalPadding) + 'px');
				if (visible && this.fitsInViewport()) {
					this.center();
				}
			}
			this.sizeMask(); // we could have changed the lightbox height, so update the mask
			if (YAHOO.env.ua.ie === 6) {
				this.sizeUnderlay();
			}
		}
	});

	ORCHESTRAL.widget.Lightbox = Lightbox;
}());

YAHOO.register('orchestral-lightbox', ORCHESTRAL.widget.Lightbox, {version: '7.9', build: '0'});


}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-orchestral", "yui2-container"]});
