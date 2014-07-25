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
YUI.add('yui2-orchestral-dom', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, document, HTMLElement */

YAHOO.namespace('ORCHESTRAL.util');

/**
 * The dom module provides helper methods for working with DOM elements.
 * 
 * @module orchestral-dom
 * @requires yahoo, dom, event, orchestral
 * @namespace ORCHESTRAL.util
 * @title Dom
 */

/**
 * Provides helper methods for DOM elements that aren't provided by YAHOO.util.Dom.
 *
 * @class Dom
 */
ORCHESTRAL.util.Dom = (function () {
	'use strict';

	var Dom = YAHOO.util.Dom,

		/**
		 * Value of nodeType property of element nodes.
		 * @property ELEMENT_NODE
		 * @type Number
		 * @private
		 * @final
		 */
		ELEMENT_NODE = 1,

		/**
		 * Metadata used to deal with elements whose innerHTML property cannot be set directly.
		 * @property READ_ONLY_INNERHTML_ELEMENTS
		 * @type Object
		 * @private
		 * @final
		 */
		READ_ONLY_INNERHTML_ELEMENTS = {
			'TABLE': ['<table>', '</table>', 1],
			'TBODY': ['<table><tbody>', '</tbody></table>', 2],
			'THEAD': ['<table><thead>', '</thead></table>', 2],
			'TFOOT': ['<table><tfoot>', '</tfoot></table>', 2],
			'TR': ['<table><tbody><tr>', '</tr></tbody></table>', 3],
			'SELECT': ['<select>', '</select>', 1]
		},

		/**
		 * Regular expression for a &lt;script&gt; block.
		 * @property SCRIPT_REGEX
		 * @type RegExp
		 * @private
		 * @final
		 */
		SCRIPT_REGEX = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img,

		// A temporary array for holding the original state of elements between
		// showElement/restore function calls.
		elementStates = [],

		/**
		 * Recursively traverse up the element hierarchy temporarily showing each element 
		 * and capture the visibility and display information in an original. Push each of
		 * these elements onto the stack of elements that have been temporarily displayed. 
		 * This stack of elements is used to restore all the original values.
		 * @param element {HTMLElement} The element to determine the width of.
		 * @private
		 */
		showElement = function (element) {
			var parentElement = element;

			while (parentElement && parentElement.tagName !== 'BODY') {
				// Show the element if it was hidden.
				if (Dom.getStyle(parentElement, 'display') === 'none') {
					elementStates.push({
						element: parentElement,
						visibility: YAHOO.util.Dom.getStyle(parentElement, 'visibility'),
						display: YAHOO.util.Dom.getStyle(parentElement, 'display')
					});
					
					Dom.setStyle(parentElement, 'visibility', 'hidden');
					Dom.setStyle(parentElement, 'display', 'block');
				}
				// Find the parent element.
				parentElement = parentElement.parentNode;
			}
		},

		/**
		 * Restore all temporarily shown elements to their original state from their
		 * original state. Clear out the stack after all of the elements have been
		 * restored.
		 * @private
		 */
		restore = function () {
			var original = elementStates.pop();
			while (original) {
				Dom.setStyle(original.element, 'visibility', original.visibility);
				Dom.setStyle(original.element, 'display', original.display);
				original = elementStates.pop();
			}
		},

		/**
		 * Removes the child nodes of an element.
		 * @param element {HTMLElement|String} The element to remove the child nodes from.
		 * @private
		 */
		removeChildNodes = function (element) {
			element = Dom.get(element);

			var n = element.childNodes.length,
				i;

			for (i = 0; i < n; i += 1) {
				ORCHESTRAL.util.Dom.remove(element.childNodes[0], true);
			}
		},

		/**
		 * Converts an HTML string to an array of DOM nodes.
		 * @param html {String} The HTML string to convert.
		 * @param wrap {Array} Metadata required to deal with elements whose innerHTML property cannot be set directly.
		 * @return {Array} Array of DOM nodes.
		 * @private
		 */
		toDomNodes = function (html, wrap) {
			html = html.replace(SCRIPT_REGEX, '');
		
			var div = document.createElement('div'),
				nodes = [],
				el = div,
				i,
				n;

			div.innerHTML = wrap ? wrap[0] + html + wrap[1] : html;

			if (wrap) {
				for (i = 0; i < wrap[2]; i += 1) {
					el = Dom.getFirstChild(el);
				}
			}
		
			n = el.childNodes.length;
		
			for (i = 0; i < n; i += 1) {
				nodes[i] = el.childNodes[i];
			}
		
			removeChildNodes(div);
			div = null;
		
			return nodes;
		},
		
		/**
		 * Converts an HTML string to DOM nodes and inserts these nodes into the document based on the method supplied.
		 * @param element {HTMLElement|String} The element relative to which the content will be inserted.
		 * @param html {String} The HTML string to insert.
		 * @param method {Function} The method to use to insert the DOM nodes.
		 * @return {HTMLElement} The first element of the inserted content.
		 * @private
		 */
		insertHtml = function (element, html, method) {
			element = Dom.get(element);

			var firstElement = null,
				nodes = toDomNodes(html, READ_ONLY_INNERHTML_ELEMENTS[element.parentNode.tagName]),
				node,
				n = nodes.length,
				i;
		
			for (i = 0; i < n; i += 1) {
				node = nodes[i];
			
				method(node, element);
			
				if (!firstElement && node.nodeType === ELEMENT_NODE) {
					firstElement = node;
				}
			}
		
			return firstElement;
		};
	
	return {
		/**
		 * Returns the width and height of a the given element.
		 *
		 * If the element's display property is set to none this method will calculate the width of the 
		 * element by assuming the element is displayed as a block-level element when visible. 
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to determine the dimensions of.
		 * @return {Object} An object literal with properties <code>width</code> and <code>height</code>.
		 */
		getDimensions: function (element) {
			element = Dom.get(element);
			showElement(element);
			
			var originalWidth = element.offsetWidth,
				originalHeight = element.offsetHeight;
			
			restore();
			
			return { width: originalWidth, height: originalHeight };
		},
		
		/**
		 * Returns the height of the given element.
		 *
		 * If the element's display property is set to none this method will calculate the width of the 
		 * element by assuming the element is displayed as a block-level element when visible. 
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to determine the height of.
		 * @return {Integer} The height of the element.
		 */
		getHeight: function (element) {
			return ORCHESTRAL.util.Dom.getDimensions(element).height;
		},
		
		/**
		 * Returns the width of the given element.
		 * If the element's display property is set to none this method will calculate the width of the 
		 * element by assuming the element is displayed as a block-level element when visible. 
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to determine the width of.
		 * @return {Integer} The width of the element.
		 */
		getWidth: function (element) {
			return ORCHESTRAL.util.Dom.getDimensions(element).width;
		},
		
		/**
		 * Resizes an element.
		 * @static
		 * @param {HTMLElement|String} The element or ID of the element to resize.
		 * @param width {int} (optional) The width to resize the element to.
		 * @param height {int} (optional) The height to resize the element to.
		 */
		resizeTo: function (element, width, height) {
			if (width) {
				Dom.setStyle(element, 'width', width + 'px');
				Dom.setStyle(element, 'width', (width + (width - ORCHESTRAL.util.Dom.getWidth(element))) + 'px');
			}
			if (height) {
				Dom.setStyle(element, 'height', height + 'px');
				Dom.setStyle(element, 'height', (height + (height - ORCHESTRAL.util.Dom.getHeight(element))) + 'px');
			}
		},
		
		/**
		 * Removes the element from the document if it exists. 
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to remove.
		 * @param purge {Boolean} Whether or not to call YAHOO.util.Event.purgeElement() on the element after removal.
		 * @return {HTMLElement} The removed element.
		 */
		remove: function (element, purge) {
			element = Dom.get(element);
			if (element) {
				element.parentNode.removeChild(element);
				if (purge) {
					YAHOO.util.Event.purgeElement(element, false);
				}
				return element;
			}

			return;
		},
		
		/**
		 * Converts an HTML string into DOM nodes and inserts them before an element.
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to insert content before.
		 * @param html {String} The HTML content to insert.
		 * @return {HTMLElement} The first element of inserted content.
		 */
		insertHtmlBefore: function (element, html) {
			return insertHtml(element, html, Dom.insertBefore);
		},
		
		/**
		 * Converts an HTML string into DOM nodes and inserts them after an element.
		 * @static
		 * @param element {HTMLElement|String} The element or ID of the element to insert content after.
		 * @param html {String} The HTML content to insert.
		 * @return {HTMLElement} The first element of inserted content.
		 */
		insertHtmlAfter: function (element, html) {
			return insertHtml(element, html, Dom.insertAfter);
		},
		
		/**
		 * Converts an HTML string into DOM nodes and inserts these nodes as the first children of an element.
		 * @static
		 * @param {HTMLElement|String} The element or ID of the element to insert the children into.
		 * @param html {String} The HTML content to insert.
		 * @return {HTMLElement} The first element of inserted content.
		 */
		insertHtmlAsFirstChild: function (element, html) {
			return ORCHESTRAL.util.Dom.insertHtmlBefore(Dom.getFirstChild(element), html);
		},
		
		/**
		 * Converts an HTML string into DOM nodes and inserts these nodes as the last children of an element.
		 * @static
		 * @param {HTMLElement|String} The element or ID of the element to insert the children into.
		 * @param html {String} The HTML content to insert.
		 * @return {HTMLElement} The first element of inserted content.
		 */
		insertHtmlAsLastChild: function (element, html) {
			return ORCHESTRAL.util.Dom.insertHtmlAfter(Dom.getLastChild(element), html);
		},
		
		/**
		 * Returns true if the object passed is an HTML Element.
		 *
		 * @param obj {Object} Object to test.
		 * @return {Boolean} If the object is an HTML Element.
		 */
		isElement: function (obj) {
			// Implementation based on http://stackoverflow.com/a/384380
			if (typeof HTMLElement === 'object') {
				return obj instanceof HTMLElement;
			} else {
				return YAHOO.lang.isObject(obj) && obj.nodeType === ELEMENT_NODE && YAHOO.lang.isString(obj.nodeName);
			}
		},
		
		/**
		 * Sets the content of an element by converting an HTML string into DOM nodes and appending these nodes
		 * to the element, replacing any existing content.
		 * 
		 * Also works for any element whose innerHTML property is read-only in Internet Explorer.
		 * @static
		 * @param {HTMLElement|String} The element or ID of the element whose innerHTML to set.
		 * @param html {String} The HTML content to set.
		 * @return {HTMLElement} The first element of inserted content.
		 */
		setInnerHtml: function (element, html) {
			element = Dom.get(element);
			
			if (READ_ONLY_INNERHTML_ELEMENTS[element.tagName]) {
				removeChildNodes(element);
				
				var nodes = toDomNodes(html, READ_ONLY_INNERHTML_ELEMENTS[element.tagName]),
					n = nodes.length,
					i;
	
				for (i = 0; i < n; i += 1) {
					element.appendChild(nodes[i]);
				}
			} else {
				element.innerHTML = html.replace(SCRIPT_REGEX, '');
			}
			
			return Dom.getFirstChild(element);
		},
		
		/**
		 * Sets the text of an element. Any HTML tags will be escaped.
		 * @static
		 * @param {HTMLElement|String} The element or ID of the element whose text to set.
		 * @param text {String} The text content to set.
		 */
		setText: (document.documentElement.textContent !== undefined) ? function (element, text) {
			Dom.get(element).textContent = text;
		} : function (element, text) {
			Dom.get(element).innerText = text;
		}
	};
}());

YAHOO.register("orchestral-dom", ORCHESTRAL.util.Dom, {version: '7.9', build: '0'});


}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-orchestral"]});
