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
YUI.add('ohp-placeholder', function (Y, NAME) {

"use strict";
/**
Plugin that provides placeholder support for legacy browsers.

@module ohp-placeholder
**/

var PLACEHOLDER_CLASS = 'placeholder',
	doc = Y.config.doc,
	win = Y.config.win;

/**
@class PlaceholderPlugin
@namespace OHP
**/
Y.namespace('OHP').PlaceholderPlugin = Y.Base.create('PlaceholderPlugin', Y.Plugin.Base, [], {
	initializer: function(/*config*/) {
		var host = this.get('host'),
			previousValue = host.get('value'),
			tagName = Y.Node.getDOMNode(host).tagName;

		if (!(
				(tagName === 'INPUT' && host.getAttribute('type') === 'text' || tagName === 'TEXTAREA') &&
				host.getAttribute('placeholder')
			)) {
			return;
		}

		if (host.hasAttribute('data-ohp-placeholder') || host.hasClass('cow-off-screen-shim-element')) {
			return;
		}

		this._clone = this._initClone(host);
		host.setAttribute('data-ohp-placeholder','');

		if (!host.hasAttribute('tabindex')) {
			host.setAttribute('tabindex', '0');
		}

		if (!host.get('value')) {
			host.hide();
		} else {
			this._clone.hide();
		}

		this.onHostEvent('blur', function() {
			Y.log('Placeholder host node blur fired.');

			if (!host.get('value')) {
				host.hide();

				// By setting the value of the clone whenever we show the clone we don't have to listen to changes to
				// the host's placeholder attribute.
				this._clone.set('value', host.getAttribute('placeholder') || '');
				this._clone.show();
			}
		}, this);

		// By polling the underlying DOM node we can detect changes that have been made directly to the DOM that don't use Y.Node.
		this._timer = Y.later(200, this, function() {
			var hostClasses = host.getAttribute('class'),
				placeholder = host.getAttribute('placeholder'),
				cloneClasses = this._clone.getAttribute('class'),
				currentValue = host.get('value');


			if (doc.activeElement === Y.Node.getDOMNode(host)) {
				// If the host is the activeElement (i.e. it has focus) we don't want to accidentally hide the element, so return.
				return;
			}

			if (currentValue !== previousValue) {
				previousValue = currentValue;

				if (currentValue) {
					host.show();
					this._clone.hide();
				} else {
					host.hide();
					// By setting the value of the clone whenever we show the clone we don't have to listen to changes to
					// the host's placeholder attribute.
					this._clone.set('value', placeholder || '');
					this._clone.show();
				}
			}

			if (hostClasses !== cloneClasses.replace(new RegExp('\\s*' + PLACEHOLDER_CLASS), '')) {
				Y.log('Placeholder host class change(s) updated on clone.');

				this._clone.setAttribute('class', hostClasses);
				this._clone.addClass(PLACEHOLDER_CLASS);
			}

			// Ensure the clone's value is the same as the host's placeholder attribute. If the containing form is reset
			// the clone's value is set to "" and will probably not be the same as the host's placeholder attribute.
			if (host.hasAttribute('placeholder') && this._clone.get('value') !== placeholder) {
				this._clone.set('value', placeholder || '');
			}
		}, [], true);

		// TODO: Theoretically we should listen for inline style changes on the host, etc. but add that if/when the requirement arises
	},

	destructor: function() {
		this._clone.remove(true);

		if (this._timer) {
			this._timer.cancel();
		}
	},

	/**
	Creates a clone of the host node, inserts it into the document and attaches event listeners.

	@param host {Node} host node
	@return {Node} clone node
	@private
	**/
	_initClone: function(host) {
		var clone = host.cloneNode(),

		handleFocus = function(/*e*/) {
			Y.log('Placeholder clone node focus fired.');

			host.show();
			host.focus();

			clone.hide();
		};

		clone.removeAttribute('id');
		clone.removeAttribute('name');
		clone.removeAttribute('placeholder');
		clone.removeAttribute('tabindex');
		clone.setAttribute('data-ohp-placeholder','');
		clone.set('value', host.getAttribute('placeholder'));
		clone.addClass(PLACEHOLDER_CLASS);

		host.insert(clone, 'before');

		// In IE we use attachEvent because of http://yuilibrary.com/projects/yui3/ticket/2530497
		if (win.attachEvent) {
			Y.Node.getDOMNode(clone).attachEvent('onfocus', handleFocus);
		} else {
			clone.on('focus', handleFocus, this);
		}

		return clone;
	},

	_clone: null,

	_timer: null
}, {
	NS: 'placeholder',
	ATTRS: {}
});


}, '7.9.0', {"requires": ["base-build", "node-style", "plugin", "event-base", "node-base"]});
