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
YUI.add('yui2-orchestral-button-core', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, document */
YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A family of button widgets.
 *
 * @module orchestral-button-core
 * @requires yahoo, button, orchestral, dom, orchestral-dom, logger
 * @namespace ORCHESTRAL.widget
 * @title Button
 */
(function() {
	'use strict';

	var lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event;

	var PrimaryButton,
		SubmitButton,
		SecondaryButton,
		IconButton,
		LinkButton,
		ButtonGroupBase,
		CheckboxButtonGroup,
		RadioButtonGroup,
		ButtonGroup,
		Button,
		// TODO: These should be changed to function declarations as opposed to function expressions.
		fixSeparation,
		getOffset,
		buttonsSameWidth;

	/**
	 * Used by CheckboxButtonGroup
	 *
	 * @private
	 */
	var m_oButtons = {};

	/**
	 * The PrimaryButton class creates a button widget styled as a primary button.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class PrimaryButton
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>,
	 * <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-6043025">HTMLInputElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-34812697">HTMLButtonElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>}
	 * Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code>
	 * element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends YAHOO.widget.Button
	 */
	PrimaryButton = function(el, config) {
		// Dom.get returns the object passed to it and therefore used here to check empty argument list, invalid element id,
		// or invalid HTMLElement.
		if (!Dom.get(el)) {
			YAHOO.log('No element passed to PrimaryButton constructor', 'warn');
			return;
		}

		PrimaryButton.superclass.constructor.apply(this, arguments);

		this._removeButtonSubmitType();

		fixSeparation(this);
	};
	lang.extend(PrimaryButton, YAHOO.widget.Button, {

		// CLASS_NAME_PREFIX: is set to "yui-" by default

		CSS_CLASS_NAME: 'primary-button',

		_removeButtonSubmitType: function() {
			// Strips the type from primary button if being created from full markup, and if IE7.
			// This is to fix a bug that causes the button to submit twice in IE7, because the
			// element.setAttribute('type', 'button') method seems to be ignored.
			if (YAHOO.env.ua.ie && YAHOO.env.ua.ie < 8 && this._button.type === 'submit') {
				this._button.removeAttribute('type');
			}
		}
	});

	/**
	 * The SubmitButton class creates a submit button widget styled as a primary button.
	 * Unlike our other YAHOO.widget.Button extensions, this button uses type="submit" and relies on the browser
	 * to submit the form when the submit button is clicked instead of triggering a submit from a click event.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class SubmitButton
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>,
	 * <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-6043025">HTMLInputElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-34812697">HTMLButtonElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>}
	 * Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code>
	 * element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends ORCHESTRAL.widget.PrimaryButton
	 */
	SubmitButton = function(el, config) {
		var args = Array.prototype.slice.call(arguments),
			index = (lang.isString(el) || ORCHESTRAL.util.Dom.isElement(el)) ? 1 : 0,
			cfg = args[index] || {};

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to SubmitButton constructor', 'warn');
			return;
		}

		args[index] = lang.merge({ type: 'submit' }, cfg);

		SubmitButton.superclass.constructor.apply(this, args);
		// if the complete markup was used, YUI.widget.Button will force the type to be "button", so we need to set it back to be submit
		// (note in IE this won't affect a button with type = "button" in the markup, if you start with complete markup it must say "submit")
		this._button.setAttribute('type', 'submit');
	};
	lang.extend(SubmitButton, PrimaryButton, {
		// override implementation of createButtonElement provided by YAHOO.widget.Button to ensure button has type="submit"
		createButtonElement: function() {
			var sNodeName = this.NODE_NAME,
				oElement = document.createElement(sNodeName);

			oElement.innerHTML =  '<' + sNodeName + ' class="first-child"><button type="submit"></button></' + sNodeName + '>';

			return oElement;
		},
		_onClick: function (p_oEvent) {
			// don't submit the form when this button is clicked, leave it to the browser
			if (this.get('type') !== 'submit') {
				return SubmitButton.superclass._onClick.apply(p_oEvent);
			}
		},

		// The type attribute must not be removed from a submit button, so overriding this
		// method inherited from PrimaryButton.
		_removeButtonSubmitType: function() {}
	});

	/**
	 * The SecondaryButton class creates a button widget styled as a secondary button.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class SecondaryButton
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>,
	 * <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-6043025">HTMLInputElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-34812697">HTMLButtonElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>}
	 * Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code>
	 * element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends YAHOO.widget.Button
	 */
	SecondaryButton = function(el, config) {
		var domEl = Dom.get(el);

		if (!domEl) {
			YAHOO.log('No element passed to SecondaryButton constructor', 'warn');
			return;
		}

		// IE8 defaults a button type to "submit" if it's inside a form and doesn't have a type attribute.
		if (YAHOO.env.ua.ie === 8 && domEl.type === 'submit') {
			domEl.setAttribute('type', 'button');
		}

		SecondaryButton.superclass.constructor.apply(this, arguments);
		fixSeparation(this);
	};
	lang.extend(SecondaryButton, YAHOO.widget.Button, {

		// CLASS_NAME_PREFIX: is set to "yui-" by default

		CSS_CLASS_NAME: 'secondary-button'
	});

	/**
	 * The IconButton class creates a button widget styled to have an icon as its label instead of text. An additional config option <code>icon</code> is
	 * available to set to the class that will provide the icon for the button.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class IconButton
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>,
	 * <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-6043025">HTMLInputElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-34812697">HTMLButtonElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>}
	 * Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code>
	 * element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends YAHOO.widget.Button
	 */
	IconButton = function(el, config) {
		var i;

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to IconButton constructor', 'warn');
			return;
		}

		for (i = 0; i < arguments.length; ++i) {
			if (arguments[i].icon) {
				arguments[i].label = '<span class="' + arguments[i].icon + '"></span>';
			}
		}
		IconButton.superclass.constructor.apply(this, arguments);
		fixSeparation(this);
	};
	lang.extend(IconButton, YAHOO.widget.Button, {

		// CLASS_NAME_PREFIX: is set to "yui-" by default

		CSS_CLASS_NAME: 'icon-button'
	});

	/**
	 * The LinkButton class creates a button widget styled to look like a link. LinkButtons can be disabled by setting the config option
	 * <code>disabled</code> to <code>true</code>.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class LinkButton
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;a&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-6043025">HTMLInputElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-34812697">HTMLButtonElement</a>|<a
	 * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>}
	 * Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code>
	 * element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends YAHOO.widget.Button
	 */
	LinkButton = function(el, config) {
		var args = Array.prototype.slice.call(arguments),
			index = (lang.isString(el) || ORCHESTRAL.util.Dom.isElement(el)) ? 1 : 0,
			cfg = args[index] || {};

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to LinkButton constructor', 'warn');
			return;
		}

		args[index] = lang.merge({ type: 'link', href: '#' }, cfg);

		LinkButton.superclass.constructor.apply(this, args);
		fixSeparation(this);

		// Prevent default click behavior for element
		Event.on(this.get('element'), 'click', function(e) {
			Event.preventDefault(e);
		});
	};
	lang.extend(LinkButton, YAHOO.widget.Button, {

		// CLASS_NAME_PREFIX: is set to "yui-" by default

		CSS_CLASS_NAME: 'link-button',

		// TODO: add support for linktype configuration attribute: navigational|action|one-way-action
		//		action buttons fire events on clickHandler completion?

		// TODO: outline styles on Chrome

		_setDisabled: function(p_bDisabled) {
			if (p_bDisabled) {
				if (this.hasFocus()) {
					this.blur();
				}

				this._button.setAttribute('disabled', 'disabled');
				this.addStateCSSClasses('disabled');

				this.removeStateCSSClasses('hover');
				this.removeStateCSSClasses('active');
				this.removeStateCSSClasses('focus');

				// This is to prevent the disabled link button to be in tab order.
				this._button.setAttribute('tabindex', '-1');

			} else {
				this._button.removeAttribute('disabled');
				this.removeStateCSSClasses('disabled');

				// Reset the tab index to specified value when the link button is re-enabled.
				this._button.setAttribute('tabindex', this._configs.tabindex.value);
			}
		}
	});

	/**
	 * If a text node only containing whitespace appears
	 * <ul>
	 * <li>before the button and the button is either the first DOM node in the container or is
	 * preceded by another button</li>
	 * <li>after the button and the button is either the last DOM node in the container or is
	 * followed by another button</li>
	 * <ul>
	 * then it is stripped to maintain consistent spacing between buttons.
	 * @param button {Button} The button widget to fix separation for.
	 * @private
	 */
	fixSeparation = function(button) {
		var el = button.get('element'),
			prevEl,
			prev,
			nextEl,
			next;

		if (!el) {
			// Like the YAHOO.widget.Button constructor silently return if an invalid element is provided to create the button.
			return;
		}
		prevEl = Dom.getPreviousSibling(el);
		if (!prevEl || Dom.hasClass(prevEl, 'yui-push-button') || Dom.hasClass(prevEl, 'yui-icon-button')) {
			prev = el.previousSibling;
			if (prev && prev.nodeType === 3 && lang.trim(prev.data) === '') {
				prev.parentNode.removeChild(prev);
			}
		}
		nextEl = Dom.getNextSibling(el);
		if (!nextEl || Dom.hasClass(nextEl, 'yui-push-button') || Dom.hasClass(nextEl, 'yui-icon-button')) {
			next = el.nextSibling;
			if (next && next.nodeType === 3 && lang.trim(next.data) === '') {
				next.parentNode.removeChild(next);
			}
		}
	};

	/**
	 * Determine the offset of an element.
	 *
	 * From later version of YUI 2, used to determine the pixel width of an element. http://developer.yahoo.com/yui/docs/IEStyle.js.html
	 *
	 * @param {HTMLElement} el The element to check
	 * @param {String} prop The property to check.
	 * @return {String} The offset
	 * @private
	 */
	getOffset = function(el, prop) {
		var current = el.currentStyle[prop],					 	// value of "width", "top", etc.
			capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
			offset = 'offset' + capped,							 	// "offsetWidth", "offsetTop", etc.
			pixel = 'pixel' + capped,								// "pixelWidth", "pixelTop", etc.
			value = '',
			actual,
			re_size = /^width|height$/;

		if (current === 'auto') {
			actual = el[offset];		// offsetHeight/Top etc.
			if (actual === undefined) { // likely "right" or "bottom"
				value = 0;
			}
			value = actual;
			if (re_size.test(prop)) {	// account for box model diff
				el.style[prop] = actual;
				if (el[offset] > actual) {
					// the difference is padding + border (works in Standards & Quirks modes)
					value = actual - (el[offset] - actual);
				}
				el.style[prop] = 'auto'; // revert to auto
			}
		} else {	// convert units to px
			if (!el.style[pixel] && !el.style[prop]) {	// need to map style.width to currentStyle (no currentStyle.pixelWidth)
				el.style[prop] = current;					// no style.pixelWidth if no style.width
			}
			value = el.style[pixel];
		}
		return value + 'px';
	};

	/*
	 * Used by <code>ORCHESTRAL.widget.RadioButtonGroup</code> and <code>ORCHESTRAL.widget.CheckboxButtonGroup</code> to check for a wrapping <code>&#60;label&#62;</code>
	 * element around the button <code>&#60;input&#62;</code> when progressively enhancing, indicating semantic markup used. Returns a reference to the <code>&#60;label&#62;</code>
	 * element for use after the <code>&#60;input&#62;</code> is enhanced into Button. The button parameter will be whatever is passed to the addButton function.
	 * We only check for a wrapping <code>&#60;label&#62;</code> element in cases of progressive enhancement when the button is a String or an HTMLElement.
	 *
	 * @param button {ORCHESTRAL.widget.Button} Object reference for the <code>ORCHESTRAL.widget.Button</code> instance to be added to the button group.
	 * @param button {String} String specifying the id attribute of the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to
	 * be added to the button group.
	 * @param button {HTMLElement} Object reference for the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to be added to the button group.
	 * @param button {Object} Object literal specifying a set of <code>YAHOO.widget.Button</code> configuration attributes used to configure the button to be added to the button group.
	 * @return wrappingLabel {HTMLElement} The <code>&#60;label&#62;</code> element wrapping the button, or undefined.
	 */
	function getWrappingLabelEl(button) {
		var wrappingLabelEl,
			buttonEl;
		if (!(button instanceof YAHOO.widget.Button) && (lang.isString(button) || button.nodeName)) {
			// Only check for wrapping label tag in progressive enhancement scenario.
			buttonEl = Dom.get(button);
			if (buttonEl.parentNode.tagName === 'LABEL') {
				wrappingLabelEl = buttonEl.parentNode;
			}
		}
		return wrappingLabelEl;
	}

	/*
	 * Used by <code>ORCHESTRAL.widget.RadioButtonGroup</code> and <code>ORCHESTRAL.widget.CheckboxButtonGroup</code> in progressive enhancement of semantic markup scenario.
	 * With standard non-semantic markup, the <code>&#60;input&#62;</code>'s <code>&#60;value&#62;</code> attribute is used as the label. If a wrapping
	 * <code>&#60;label&#62;</code> was around the <code>&#60;input&#62;</code>, this indicates semantic markup used. The <code>&#60;label&#62;</code> tag
	 * therefore contains content to use as the button label. This content is usually a String, but could also include HTML elements such as an
	 * <code>&#60;img&#62;</code> for example. This function returns the content of wrappingLabelEl.
	 *
	 * @param wrappingLabelEl {HTMLElement} The <code>&#60;label&#62;</code> element that contains content to be used as the Button label.
	 * @return label {String|HTMLElement} The label contained in the wrapping <code>&#60;label&#62;</code> element.
	 */
	function getWrappingLabel(wrappingLabelEl) {
		var label,
			surroundingWhitespaceRegex = /^(&nbsp;|\s)*|(&nbsp;|\s)*$/g;

		label = wrappingLabelEl.innerHTML;
		if (label) {
			// Trim leading and trailing whitespace, including &nbsp; entities
			label = label.replace(surroundingWhitespaceRegex, '');
		}
		return label;
	}

	/*
	 * Used by <code>ORCHESTRAL.widget.RadioButtonGroup</code> and <code>ORCHESTRAL.widget.CheckboxButtonGroup</code> in progressive enhancement of semantic markup scenario.
	 * Sets the content of the wrapping <code>&#60;label&#62;</code> element as the Button label, and subsequently removes
	 * the leftover wrapping <code>&#60;label&#62;</code> element from the DOM as it is no longer neccessary.
	 *
	 * @param button {ORCHESTRAL.widget.Button} Object reference for the <code>ORCHESTRAL.widget.Button</code> instance to be added to the button group.
	 * @param wrappingLabelEl {HTMLElement} The <code>&#60;label&#62;</code> element that contains content to be used as the Button label.
	 */
	function updateButtonLabel(button, wrappingLabelEl) {
		button.set('label', getWrappingLabel(wrappingLabelEl));
		ORCHESTRAL.util.Dom.remove(wrappingLabelEl, true);
	}

	/**
	 * The Button class is an extension of YAHOO.widget.Button that initialises an extra dataset configuration attribute that keeps account of
	 * any HTML5 data attributes on the element. Currently this is only used to create Buttons that are part of an ORCHESTRAL.widget.RadioButtonGroup
	 * or an ORCHESTRAL.widget.CheckboxButtonGroup
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class Button
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>, <code>&#60;a&#62;</code>,
	 * or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {HTMLInputElement | HTMLButtonElement | HTMLElement} Object reference for the <code>&#60;input&#62;</code>, <code>&#60;button&#62;</code>,
	 * <code>&#60;a&#62;</code>, or <code>&#60;span&#62;</code> element to be used to create the button.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button.
	 * @param config {Object} (optional). Object literal specifying a set of configuration attributes used to create the button.
	 * @extends YAHOO.widget.Button
	 */
	Button = function(el, config) {
		if (!Dom.get(el)) {
			YAHOO.log('No element passed to Button constructor', 'warn');
			return;
		}

		// When not progressively enhancing just call superclass constructor with current arguments,
		// otherwise initialise custom config from DOM attributes before calling superclass constructor.
		if (arguments.length === 1 && !lang.isString(el) && !el.nodeName) {
			Button.superclass.constructor.apply(this, arguments);
		} else {
			// Update config to use passed el as the original element
			var oConfig = {
				element: el,
				attributes: (config || {})
			};

			// We need srcelement to update attributes from
			oConfig.attributes.srcelement = Dom.get(el);

			// Update the config with our attributes that we additionally support
			this._setCustomAttributesFromDOMAttributes(oConfig);

			// Let the supertype do the rest as per usual
			Button.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
		}
	};
	lang.extend(Button, YAHOO.widget.Button, {

		/**
		 * Sets up the custom dataset object for the Button config. The dataset object keeps account of any HTML5 custom data DOM attributes.
		 * HTML5 custom data attributes start with "data-" and can be treated as a storage areas for private data.
		 *
		 * @param config {Object} the configuration object to be passed to the button superclass constructor
		 * @private
		 */
		_setCustomAttributesFromDOMAttributes: function(config) {
			var configAttributes = config.attributes,
				elAttributes = configAttributes.srcelement.attributes,
				dataset = {},
				elAttribute,
				dataAttributeName,
				numHyphens,
				indexOfChar,
				upperCaseChar,
				i,
				j;

			if (!configAttributes.dataset) {
				for (i = 0; i < elAttributes.length; i += 1) {
					elAttribute = elAttributes[i];

					// Load all "data-" attributes into dataset object
					if (elAttribute.name.indexOf('data-') === 0) {

						// Data attribute name is the rest of the attribute name after "data-"
						dataAttributeName = elAttribute.name.substring(elAttribute.name.indexOf('-') + 1);

						// As per HTML5 data attribute spec, hyphenated names become camel-cased
						// So remove all proceeding hyphens and uppercase the following character (i.e. code-system-value -> codeSystemValue)
						numHyphens = (dataAttributeName.split('-').length - 1);
						for (j = 0; j < numHyphens; j++) {
							indexOfChar = dataAttributeName.indexOf('-') + 1;
							upperCaseChar = dataAttributeName.charAt(indexOfChar).toUpperCase();
							dataAttributeName = dataAttributeName.substr(0, indexOfChar - 1) + upperCaseChar + dataAttributeName.substr(indexOfChar + 1);
						}

						dataset[dataAttributeName] = elAttribute.value;
					}
				}
				configAttributes.dataset = dataset;
			}
		},

		/**
		 * Initializes all of the configuration attributes used to create the button.
		 *
		 * @param  attributes {Object} Object literal specifying a set of configuration attributes used to create the button.
		 */
		initAttributes: function (attributes) {
			var oAttributes = attributes || {};

			Button.superclass.initAttributes.call(this, oAttributes);

			/**
			 * Object containing all the data attributes of the element.
			 *
			 * If the Button is enhanced from semantic HTML the dataset contains the set of
			 * HTML5 custom data attributes beginning with "data-" from the DOM element.
			 * These can be accessed by name (the rest of the attribute name after "data-").
			 *
			 * @attribute dataset
			 * @default null
			 * @type Object
			 */
			this.setAttributeConfig('dataset', {
				value: oAttributes.dataset,
				validator: lang.isObject
			});
		}
	});

	/**
	 * ButtonGroupBase provides common functionality to all button groups. It ensures that all buttons of a group are the same width.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class ButtonGroupBase
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {HTMLDivElement} Object specifying the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button group.
	 * @param config {Object} (optional).Object literal specifying a set of configuration attributes used to create the button group.
	 * @extends YAHOO.widget.ButtonGroup
	 */
	ButtonGroupBase = function (el, config) {
		var ariaLabelledBy;

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to ButtonGroupBase constructor', 'warn');
			return;
		}

		ButtonGroupBase.superclass.constructor.apply(this, arguments);

		ariaLabelledBy = this.get('ariaLabelledBy');
		if (ariaLabelledBy) {
			this.get('element').setAttribute('aria-labelledby', ariaLabelledBy);
		}
	};

	lang.extend(ButtonGroupBase, YAHOO.widget.ButtonGroup, {

		// Do not attempt to include a common init function here, CheckboxButtonGroup bypasses this class during init, see the function for details

		/**
		 * The current width of all the checkbox buttons in the button group.
		 * Set initially by <code>_initButtonWidths</code> function.
		 *
		 * @type String
		 * @private
		 */
		_currentButtonWidth: '0px',

		/**
		 * The largest button in the button group that has therefore determined
		 * the current button width for the group.
		 *
		 * @type YAHOO.widget.Button Element
		 * @private
		 */
		_largestWidthButton: null,

		/**
		 * Sets up the width of the buttons in the button group based on the button with the largest label.
		 *
		 * @private
		 */
		_initButtonWidths: function() {
			var buttonWidth,
				property = (ORCHESTRAL.env.ua.ie === 6) ? 'width' : 'min-width',
				defaultValue = (ORCHESTRAL.env.ua.ie === 6) ? 'auto' : '0px',
				i;

			this._currentButtonWidth = '0px';
			for (i = 0; i < this._buttons.length; i++) {
				// To maintain backwards compatibility, min-width is set on checkbox buttons (all three levels),
				// so set back to default in order to check auto width.
				this._buttons[i].setStyle(property, defaultValue);
				Dom.setStyle(this._buttons[i].getElementsByClassName('first-child')[0], property, defaultValue);
				Dom.setStyle(this._buttons[i].getElementsByTagName('button')[0], property, defaultValue);

				buttonWidth = this._buttons[i].getStyle('width');
				if (buttonWidth === 'auto' && document.all) {
					// IE only.
					buttonWidth = getOffset(this._buttons[i].get('element'), 'width');
				}

				// Convert px values to numbers to compare, and store the largest width.
				if (parseInt(buttonWidth, 10) > parseInt(this._currentButtonWidth, 10)) {
					this._currentButtonWidth = buttonWidth;
					this._largestWidthButton = this._buttons[i];
				}
			}

			// Set all buttons in the buttongroup to the largest width found (all three levels).
			for (i = 0; i < this._buttons.length; i++) {
				this._buttons[i].setStyle(property, this._currentButtonWidth);
				Dom.setStyle(this._buttons[i].getElementsByClassName('first-child')[0], property, this._currentButtonWidth);
				Dom.setStyle(this._buttons[i].getElementsByTagName('button')[0], property, this._currentButtonWidth);
			}
		},

		/**
		 * Checks the width of the button object passed and if it is larger than what is currently set, the current width of
		 * all buttons in the button group is adjusted.
		 *
		 * @param event {Event} Event Object representing the event that was fired.
		 * @param button {YAHOO.widget.Button} Button Object representing the button that fired the event.
		 * @private
		 */
		_adjustButtonWidths: function(event, button) {
			if (button === this._largestWidthButton) {
				this._initButtonWidths();
				return;
			}

			var buttonWidth,
				property = (ORCHESTRAL.env.ua.ie === 6) ? 'width' : 'min-width',
				i;

			if (event.type === 'addCheckboxButton' || (ORCHESTRAL.env.ua.ie === 6)) {
				var defaultValue = (ORCHESTRAL.env.ua.ie === 6) ? 'auto' : '0px';

				// To maintain backwards compatibility, min-width is set on checkbox buttons (all three levels),
				// so set back to default in order to check auto width.
				button.setStyle(property, defaultValue);
				Dom.setStyle(button.getElementsByClassName('first-child')[0], property, defaultValue);
				Dom.setStyle(button.getElementsByTagName('button')[0], property, defaultValue);
			}

			buttonWidth = button.getStyle('width');
			if (buttonWidth === 'auto' && document.all) {
				// IE only.
				buttonWidth = getOffset(button.get('element'), 'width');
			}

			// Convert px values to numbers to compare, and store the largest width.
			if (parseInt(buttonWidth, 10) > parseInt(this._currentButtonWidth, 10)) {
				this._currentButtonWidth = buttonWidth;
				this._largestWidthButton = button;
				// Set all buttons in the buttongroup to the largest width found (all three levels).
				for (i = 0; i < this._buttons.length; i++) {
					this._buttons[i].setStyle(property, this._currentButtonWidth);
					Dom.setStyle(this._buttons[i].getElementsByClassName('first-child')[0], property, this._currentButtonWidth);
					Dom.setStyle(this._buttons[i].getElementsByTagName('button')[0], property, this._currentButtonWidth);
				}
			} else {
				// Ensure this button is set to the currentButtonWidth.
				button.setStyle(property, this._currentButtonWidth);
				Dom.setStyle(button.getElementsByClassName('first-child')[0], property, this._currentButtonWidth);
				Dom.setStyle(button.getElementsByTagName('button')[0], property, this._currentButtonWidth);
			}
		},

		initAttributes: function (p_oAttributes) {
			var oAttributes = p_oAttributes || {};

			ButtonGroupBase.superclass.initAttributes.call(this, oAttributes);

			/**
			 * String specifying the id of the element that provides the label for this button group.
			 *
			 * @attribute ariaLabelledBy
			 * @default null
			 * @type String
			 */
			this.setAttributeConfig('ariaLabelledBy', {
				value: oAttributes.ariaLabelledBy,
				validator: lang.isString
			});
		}
	});

	/**
	 * The CheckboxButtonGroup class creates a set of checkbox buttons that are all the same width which is determined by
	 * the largest label in the group. Each Button in the group is an <code>ORCHESTRAL.widget.Button</code> (unless you directly
	 * call addButton and pass an existing instance of a <code>YAHOO.widget.Button</code>, this should not be done in practice).
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class CheckboxButtonGroup
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {HTMLDivElement} Object specifying the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button group.
	 * @param config {Object} (optional).Object literal specifying a set of configuration attributes used to create the button group.
	 * @extends ORCHESTRAL.widget.ButtonGroupBase
	 */
	CheckboxButtonGroup = function (el, config) {
		var container;

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to CheckboxButtonGroup constructor', 'warn');
			return;
		}

		CheckboxButtonGroup.superclass.constructor.apply(this, arguments);

		// Sets up the width of the buttons in the button group based on the button with the largest label.
		container = this.get('container');
		if (lang.isString(container)) {
			// If ButtonGroup created via Javascript, wait till content ready before initialising button widths.
			Event.onContentReady(container, function() {
				this._initButtonWidths();
			}, null, this);

		} else {
			this._initButtonWidths();
		}

		this.subscribe('addCheckboxButtonEvent', function(args) {
			this._adjustButtonWidths(args, args.button);
		});
		this.subscribe('removeCheckboxButtonEvent', function(args) {
			this._adjustButtonWidths(args, args.button);
		});
	};

	lang.extend(CheckboxButtonGroup, ButtonGroupBase, {

		CLASS_NAME_PREFIX: "",

		CSS_CLASS_NAME: "checkbox-group",

		/**
		 * The CheckboxButtonGroup class's initialization method. Changed to create Buttons of type checkbox.
		 *
		 * @param element {String} String specifying the id attribute of the <code>&#60;div&#62;</code> element of the button group.
		 * @param element {HTMLDivElement} Object specifying the <code>&#60;div&#62;</code> element of the button group.
		 * @param element {Object} Object literal specifying a set of configuration attributes used to create the button group.
		 * @param attributes {Object} Optional. Object literal specifying a set of configuration attributes used to create the button group.
		 */
		init: function(element, attributes) {
			var oContainer;

			this._buttons = [];

			// Don't call superclass init function, as YAHOO.widget.ButtonGroup.init sets properties specific to Radio button groups.
			// Instead, go straight to ButtonGroup's superclass init, then explicitly include the code we need
			YAHOO.widget.ButtonGroup.superclass.init.call(this, element, attributes);

			this.addClass(this.CSS_CLASS_NAME);

			this.addButtons(this.getElementsByClassName('yui-checkbox-button'));
			this.addButtons(Dom.getElementsBy(function(element) { return (element.type === 'checkbox'); }, 'input', this.get('element')));

			// The following is directly copied from YAHOO.widget.ButtonGroup.init:

			this.on("keydown", this._onKeyDown);
			this.on("appendTo", this._onAppendTo);

			oContainer = this.get("container");
			if (oContainer) {
				if (lang.isString(oContainer)) {
					Event.onContentReady(oContainer, function() {
						this.appendTo(oContainer);
					}, null, this);
				} else {
					this.appendTo(oContainer);
				}
			}
		},

		/**
		 * Adds the button to the CheckboxButtonGroup. Changed to add Buttons of type checkbox. Checks for semantic markup scenario, and sorts out wrapping label in this case.
		 *
		 * @param button {YAHOO.widget.Button} Object reference for the <code>YAHOO.widget.Button</code> instance to be added to the button group.
		 * @param button {String} String specifying the id attribute of the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to be added to the button group.
		 * @param button {HTMLElement} Object reference for the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to be added to the button group.
		 * @param button {Object} Object literal specifying a set of <code>YAHOO.widget.Button</code> configuration attributes used to configure the button to be added to the button group.
		 * @return {YAHOO.widget.Button}
		 */
		addButton: function(button) {
			var wrappingLabelEl = getWrappingLabelEl(button),
				oButton,
				oButtonElement,
				oGroupElement,
				nIndex,
				sButtonName,
				sGroupName;

			// Don't call superclass addButton function, as YAHOO.widget.ButtonGroup.addButton deals with Buttons of type radio.
			// Instead, we explicitly include the code we need and change it to deal with Buttons of type checkbox.

			if (button instanceof YAHOO.widget.Button && button.get('type') === 'checkbox') {
				// ORCHESTRAL.widget.Button's are also instances of YAHOO.widget.Button
				// If an existing YAHOO.widget.Button instance is passed it is added to the group as it exists and is
				// not transformed into an ORCHESTRAL.widget.Button. YAHOO.widget.Button's should not be created directly.
				oButton = button;
			} else if (!lang.isString(button) && !button.nodeName) {
				button.type = 'checkbox';
				oButton = new Button(button);
			} else {
				oButton = new Button(button, { type: 'checkbox' });
			}

			if (oButton) {
				nIndex = this._buttons.length;
				sButtonName = oButton.get('name');
				sGroupName = this.get('name');
				oButton.index = nIndex;
				this._buttons[nIndex] = oButton;
				m_oButtons[oButton.get('id')] = oButton;

				if (sButtonName !== sGroupName) {
					oButton.set('name', sGroupName);
				}
				if (this.get('disabled')) {
					oButton.set('disabled', true);
				}

				oButtonElement = oButton.get('element');
				oGroupElement = this.get('element');

				if (oButtonElement.parentNode !== oGroupElement) {
					oGroupElement.appendChild(oButtonElement);
				}

				oButton.on('labelChange', this._adjustButtonWidths, oButton, this);
			}

			if (wrappingLabelEl) {
				updateButtonLabel(oButton, wrappingLabelEl);
			}

			this.fireEvent('addCheckboxButtonEvent', {
				type: 'addCheckboxButton',
				button: oButton
			});

			return oButton;
		},

		/**
		 * Removes the button at the specified index from the button group.
		 *
		 * @param index {Number} Number specifying the index of the button to be removed from the button group.
		 */
		removeButton: function(index) {
			var oButton = this.getButton(index),
				nButtons,
				i;
			if (oButton) {
				this._buttons.splice(index, 1);
				delete m_oButtons[oButton.get("id")];
				oButton.destroy();
				nButtons = this._buttons.length;
				if (nButtons > 0) {
					i = this._buttons.length - 1;
					do {
						this._buttons[i].index = i;
					} while (i--);
				}
				this.fireEvent('removeCheckboxButtonEvent', {
					type: 'removeCheckboxButton',
					button: oButton
				});
			}
		},

		/**
		 * "keydown" event handler for the button group.
		 *
		 * @param event {Event} Object representing the DOM event object passed back by the event utility (YAHOO.util.Event).
		 * @private
		 */
		_onKeyDown: function(event) {
			// TODO: Fix keyboard controls for checkbox groups
		},

		/**
		 * This ButtonGroup function is not used by CheckboxButtonGroup.
		 *
		 * @param event
		 * @event button
		 * @private
		 */
		_onButtonCheckedChange: function(event, button) {
		}

	});

	/**
	 * The RadioButtonGroup class creates a set of buttons that are mutually exclusive; checking one button in the set will
	 * uncheck all others in the button group. Each Button in the group is an <code>ORCHESTRAL.widget.Button</code> (unless you directly
	 * call addButton and pass an existing instance of a <code>YAHOO.widget.Button</code>, this should not be done in practice).
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class RadioButtonGroup
	 * @constructor
	 * @param el {String} String specifying the id attribute of the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {HTMLDivElement} Object specifying the <code>&#60;div&#62;</code> element of the button group.
	 * @param el {Object} Object literal specifying a set of configuration attributes used to create the button group.
	 * @param config {Object} (optional).Object literal specifying a set of configuration attributes used to create the button group.
	 * @extends ORCHESTRAL.widget.ButtonGroupBase
	 */
	RadioButtonGroup = function(el, config) {
		var selectedButton,
			container;

		if (!Dom.get(el)) {
			YAHOO.log('No element passed to RadioButtonGroup constructor', 'warn');
			return;
		}

		RadioButtonGroup.superclass.constructor.apply(this, arguments);

		// Ensures radio buttons can be toggled off.

		selectedButton = this.get('checkedButton');

		this.on('checkedButtonChange', function(e) {
			// Execute in a timeout so that click handler can fire.
			lang.later(0, {}, function() {
				selectedButton = e.newValue;
			});
		});

		// Sets up the width of the buttons in the button group based on the button with the largest label.
		container = this.get('container');
		if (lang.isString(container)) {
			// If RadioButtonGroup created via Javascript, wait till content ready before initialising button widths.
			Event.onContentReady(container, function() {
				this._initButtonWidths();
			}, null, this);

		} else {
			this._initButtonWidths();
		}

		this.subscribe('addButtonEvent', function(args) {
			this._adjustButtonWidths(args, args.button);
		});
		this.subscribe('removeButtonEvent', function(args) {
			this._adjustButtonWidths(args, args.button);
		});
	};

	lang.extend(RadioButtonGroup, ButtonGroupBase, {

		/**
		 * Adds the button to the RadioButtonGroup. Adds Buttons of type radio. Checks for semantic markup scenario, and sorts out wrapping label in this case.
		 *
		 * @param button {YAHOO.widget.Button} Object reference for the <code>YAHOO.widget.Button</code> instance to be added to the button group.
		 * @param button {String} String specifying the id attribute of the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to be added to the button group.
		 * @param button {HTMLElement} Object reference for the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be used to create the button to be added to the button group.
		 * @param button {Object} Object literal specifying a set of <code>YAHOO.widget.Button</code> configuration attributes used to configure the button to be added to the button group.
		 * @return {YAHOO.widget.Button}
		 */
		addButton: function(button) {
			var wrappingLabelEl = getWrappingLabelEl(button),
				oButton;

			if (button instanceof YAHOO.widget.Button && button.get('type') === 'radio') {
				// ORCHESTRAL.widget.Button's are also instances of YAHOO.widget.Button
				// If an existing YAHOO.widget.Button instance is passed it is added to the group as it exists and is
				// not transformed into an ORCHESTRAL.widget.Button. YAHOO.widget.Button's should not be created directly.
				oButton = button;
			} else if (!lang.isString(button) && !button.nodeName) {
				button.type = 'radio';
				oButton = new Button(button);
			} else {
				oButton = new Button(button, { type: 'radio' });
			}

			oButton = YAHOO.widget.ButtonGroup.prototype.addButton.call(this, oButton);

			if (oButton) {
				oButton.on('labelChange', this._adjustButtonWidths, oButton, this);
			}

			if (wrappingLabelEl) {
				updateButtonLabel(oButton, wrappingLabelEl);
			}

			return oButton;
		},

		/**
		 * "checkedChange" event handler for each button in the button group.
		 * The YAHOO ButtonGroup doesn't support deselecting current button so overriding to allow this.
		 *
		 * @param p_oEvent {Event} Object representing the event that was fired.
		 * @param p_oButton {YAHOO.widget.Button} Object representing the button that fired the event.
		 * @protected
		 */
		_onButtonCheckedChange: function (p_oEvent, p_oButton) {
			var bChecked = p_oEvent.newValue,
				oCheckedButton = this.get('checkedButton');

			if (!bChecked && p_oButton === oCheckedButton) {
				this.set('checkedButton', null);
				this.set('value', null);
			} else {
				RadioButtonGroup.superclass._onButtonCheckedChange.apply(this, arguments);
			}
		}
	});

	/**
	* @namespace ORCHESTRAL.widget
	* @class ButtonGroup
	* @extends YAHOO.widget.ButtonGroup
	* @deprecated Use ORCHESTRAL.widget.RadioButtonGroup.
	*/
	ButtonGroup = RadioButtonGroup;

	ORCHESTRAL.widget.Button = Button;
	ORCHESTRAL.widget.PrimaryButton = PrimaryButton;
	ORCHESTRAL.widget.SubmitButton = SubmitButton;
	ORCHESTRAL.widget.SecondaryButton = SecondaryButton;
	ORCHESTRAL.widget.IconButton = IconButton;
	ORCHESTRAL.widget.LinkButton = LinkButton;
	ORCHESTRAL.widget.ButtonGroupBase = ButtonGroupBase;
	ORCHESTRAL.widget.CheckboxButtonGroup = CheckboxButtonGroup;
	ORCHESTRAL.widget.RadioButtonGroup = RadioButtonGroup;
	ORCHESTRAL.widget.ButtonGroup = ORCHESTRAL.widget.RadioButtonGroup;
}());

YAHOO.register('orchestral-button-core', ORCHESTRAL.widget.Button, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui2-button",
        "yui2-orchestral",
        "yui2-dom",
        "yui2-orchestral-dom",
        "yui2-logger"
    ]
});
