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
YUI.add('yui2-orchestral-template', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

YAHOO.namespace('ORCHESTRAL.util');

/**
 * Provides support for repetition templates inspired by the WHATWG's Web Forms 2.0 draft. 
 *
 * @module orchestral-template
 * @requires yahoo, dom, event, element, orchestral
 * @namespace ORCHESTRAL.util
 * @title Template
 */
(function() {
	var lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Registry = ORCHESTRAL.util.Registry;
	
	/**
	 * Repetition template.
	 *
	 * @class Template
	 * @constructor 
	 * @param el {HTMLElement | String}
	 * @param config {Object} (optional) Object literal of configuration params
	 * @extends YAHOO.util.Element
	 */
	var Template = function(el, config) {
		Template.superclass.constructor.call(this, el, config);
		
		var templateEl = Dom.getFirstChildBy(this.get('element'), function(el) { 
			return Dom.hasClass(el, 'template'); 
		});
		
		if (lang.isNull(templateEl)) {
			return;
		}
		
		this._template = templateEl.cloneNode(true);
		this.removeChild(templateEl);
		Dom.removeClass(Dom.getChildren(this.get('element')), 'template');

		if (ORCHESTRAL.env.ua.ie == 8) {
			// IE 8 has a bug where changes to the height of a list in an inline-block element
			// do not trigger the inline-block element to get reflowed. If this template list is
			// part of a Repeating List control, our container element is displayed as an inline-block
			// element, and so we add and remove the class that sets this to manually trigger a reflow
			// in order to work around this problem.
			var repeatList = Dom.getAncestorByClassName(this.get('element'), 'repeating-list');
			if (repeatList) {
				var triggerReflow = function() {
					Dom.removeClass(repeatList, 'repeating-list');
					Dom.addClass(repeatList, 'repeating-list');
				};
				this.subscribe('add', triggerReflow, null, this);
				this.subscribe('remove', triggerReflow, null, this);
			}
		}

		/**
		 * Fired when a repeat is added.
		 * 
		 * @event add
		 * @param args.element {HTMLElement} root element of the new repeat.
		 * @param args.index {Int} index of the new repeat.
		 */

		/**
		 * Fires when a repeat is removed.
		 * 
		 * @event remove
		 * @param args.element {HTMLElement} root element of the removed repeat.
		 */
	};
	
	lang.extend(Template, YAHOO.util.Element, {
		initAttributes: function(config) {
			Template.superclass.initAttributes.call(this, config);
			
			/**
			 * Performs initialisation required for a repeat, e.g. initalising widgets contained in the repeat.
			 *
			 * @attribute repeatInitHandler
			 * @type Function
			 */
			this.setAttributeConfig('repeatInitHandler', {
				writeOnce: true,
				validator: lang.isFunction,
				method: function(value) {
					this.on('add', function(args) {
						value(args.element, args.index);
					});

					var children = Dom.getChildrenBy(this.get('element'), function(element) {
						return lang.isNumber(Number(element.getAttribute('repeat')));
					});

					for (var i = 0; i < children.length; i++) {
						value(children[i], Number(children[i].getAttribute('repeat')));
					}
				}
			});
		},
		
		/**
		 * Removes attached event listeners.
		 */
		destroy: function() {
			Event.purgeElement(this.get('element'), true);
		},
		
		/**
		 * @property _template
		 * @type HTMLElement
		 * @private
		 */
		_template: null,

		/**
		 * Adds a new repeat to this Template.
		 */
		add: function() {
			if (lang.isNull(this._template)) {
				return;
			}
			
			var index = Dom.getChildren(this.get('element')).length ? Number(Dom.getLastChild(this.get('element')).getAttribute('repeat')) + 1 : 0,
				repititionEl = this.get('element').appendChild(this._template.cloneNode(true));
			
			repititionEl.innerHTML = lang.substitute(repititionEl.innerHTML, { 'index': +index });
			repititionEl.setAttribute('repeat', index);
			Dom.replaceClass(repititionEl, 'template', 'template-repeat');
			
			this.fireEvent('add', { element: repititionEl, index: index });
		},
		
		/**
		 * Removes a repeat from this Template.
		 * 
		 * @method remove
		 * @param el {HTMLElement | String} root element of the repetition block to remove.
		 */
		remove: function(el) {
			el = Dom.get(el);
			
			this.removeChild(el);
			Event.purgeElement(el, true);
			this.fireEvent('remove', { element: el });
		}
	});
	
	ORCHESTRAL.util.Template = Template;
})();

YAHOO.register("orchestral-template", ORCHESTRAL.util.Template, {version: '7.9', build: '0'});

}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-element", "yui2-orchestral"]});
