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
YUI.add('yui2-orchestral-form', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, document, NodeList */

 /**
  * Orchestral Form API.
  * 
  * @module orchestral-form
  * @requires yahoo, dom, selector, orchestral
  * @namespace ORCHESTRAL.util
  * @title Form
  */
YAHOO.namespace('ORCHESTRAL.util');
 
/**
 * Orchestral Form API.
 * 
 * Provides useful functions for working with forms.
 *
 * @class Form
 * @static
 */
ORCHESTRAL.util.Form = (function() {
	var lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Selector = YAHOO.util.Selector;
	
	/**
	 * Converts line ending \r\n to just \r because Internet Explorer will munge them in the defaultValue.
	 * @private
	 * @param {String} the value to convert line endings for 
	 */
	var convertLineEndings = function(text) {
		return text.replace(/\r\n/g, '\r').replace(/\n/g, '\r');
	};
	
	/**
	 * Returns true of the string representation of both values are
	 * the same.
	 * @private
	 * @param firstValue the first value for comparison
	 * @param secondValue the second value for comparison
	 */
	var isSameValue = function(firstValue, secondValue) {
		firstValue = firstValue || "";
		secondValue = secondValue || "";
		if (lang.isArray(firstValue)) {
			firstValue = firstValue.join(',');
		} else if (lang.isObject(firstValue)) {
			firstValue = lang.dump(firstValue);
		}
		if (lang.isArray(secondValue)) {
			secondValue = secondValue.join(',');
		} else if (lang.isObject(secondValue)) {
			secondValue = lang.dump(secondValue);
		}
		return firstValue == secondValue;
	};
	
	var alwaysAccept = function() { 
		return true; 
	};
		
	/**
	 * Retrieve an array of form field elements from the required scope.
	 * This excludes the form buttons so is more useful than the native elements array
	 * on a form node.
	 * @param {HTMLElement | String} scope the scope for extracting form elements from.
	 * This should ideally be a form element, but can be any HTMLElement scope.
	 * @private
	 */
	var getFormFields = function(scope) {
		var root = Dom.get(scope),
			fields = [];

		fields = fields.concat(Dom.getElementsBy(alwaysAccept, 'input', scope));
		fields = fields.concat(Dom.getElementsBy(alwaysAccept, 'textarea', scope));
		fields = fields.concat(Dom.getElementsBy(alwaysAccept, 'select', scope));

		return fields;
	};
	
	/**
	 * Provides methods for extracting values from form elements based on tag name
	 * and returning those values as either a single string or an array of strings.
	 * @private
	 */
	var serializers = {
		input: function(elements) {
			var type = elements.length ? elements[0].type : elements.type;
			
			switch (type) {
				case 'checkbox':
				case 'radio':
					return this.checkbox(elements);
				default:
					// This case is used for password and text input fields.
					return this.textarea(elements);
			}
		},
		
		checkbox: function(elements) {
			var values = [];
			
			Dom.batch(elements, function(element) {
				if (element.checked) {
					// Webkit browsers report the value of a checkbox with no explicit value set as null.
					// However when submitting a form natively they send the value 'on' for checked checkboxes.
					values.push(element.value ? element.value : 'on');
				}
			});
			
			return this.returnArrayValue(values);
		},
		
		textarea: function(elements) {
			var values = [];
			
			Dom.batch(elements, function(element) {
				if (element.value || element.value === '') {
					values.push(convertLineEndings(element.value));
				}
			});
			
			return this.returnArrayValue(values);
		},
		
		select: function(elements) {
			var values = [];
			
			Dom.batch(elements, function(element) {
				var n = element.options.length,
					i, opt, value;
				
				for (i = 0; i < n; i++) {
					opt = element.options[i];
					value = serializers.optionValue(opt);
					
					if (opt.selected && value !== '') {
						values.push(value);
					}
				}
			});
			
			return this.returnArrayValue(values);
		},
		
		optionValue: function(opt) {
			if (opt.value) {
				return opt.value;
			}
			
			return opt.value === '' ? '' : opt.text;
		},
		
		returnArrayValue: function(values) {
			if (values.length) {
				return values.length == 1 ? values[0] : values;
			} else {
				return null;
			}
		}
	};

	/**
	 * Provides methods based upon name, to populate form fields with values from
	 * an object literal containing the value (either a single string or an array of
	 * strings) and the name.  The name property is not used.
	 * 
	 * @private
	 */
	var deserializers = {
		input: function(parameter, elements) {
			var type = elements.length ? elements[0].type : elements.type;
			
			switch (type.toLowerCase()) {
				case "checkbox":
				case "radio":
					this.checkbox(parameter, elements);
					break;
				default:
					// This case is used for password and text input fields.
					this.textarea(parameter, elements);
			}
		},
		
		textarea: function(parameter, elements) {
			var values = lang.isString(parameter.value) ? [parameter.value] : parameter.value;
			
			Dom.batch(elements, function(el) {
				el.value = convertLineEndings(values.shift());
			});
		},
		
		checkbox: function(parameter, elements) {
			var values = (lang.isString(parameter.value) || lang.isBoolean(parameter.value)) ? [parameter.value] : parameter.value;
			
			Dom.batch(elements, function(el) {
				if (!el.value || el.value == 'on') {
					// Browsers report the value of checkboxes without an explicit value set as "on" in IE/Firefox and null in Webkit.
					// The checkbox has no explicit value so look for boolean true or 'on' in deserialization data.
					el.checked = ORCHESTRAL.lang.contains(true, values) || ORCHESTRAL.lang.contains('on', values);
				} else {
					// The checkbox has explicit value so look for explicit value in deserialization data.
					el.checked = ORCHESTRAL.lang.contains(el.value, values);
				}
			});
		},
	
		select: function(parameter, elements) {
			var values = lang.isString(parameter.value) ? [parameter.value] : parameter.value;
			
			Dom.batch(elements, function(el) {
				var n = el.options.length,
					i, opt;
					
				for (i = 0; i < n; i++) {
					opt = el.options[i];
					opt.selected = ORCHESTRAL.lang.contains(serializers.optionValue(opt), values);
				}
			});
		}
	};
	
	/**
	 * @method isNodeList
	 * @private
	 * @param el {Object}
	 * @return {boolean}
	 */
	var isNodeList = function(el) {
		if (YAHOO.env.ua.ie > 0 ) {
			return typeof el.length == 'number' && typeof el.item == 'function' && typeof el.nextNode == 'function' && typeof el.reset == 'function';
		}
		
		return el instanceof NodeList; 
	};
	
	return {
		
		/**
		 * Converts an object literal of key-value pairs to a URL encoded query string. 
		 * 
		 * The returned query string does not include the question mark prefix.
		 * 
		 * @method toQueryString
		 * @static
		 * @param {Object} params an object literal of key value pairs to 
		 * @return {String} URL encoded query string
		 */
		toQueryString: function(params) {
			var query = [],
				key, values, i, n;
			
			for (key in params) {
				if (params.hasOwnProperty(key)) {
					values = params[key];
			
					if (!lang.isArray(values)) {
						values = [values];
					}
					
					n = values.length;
					
					for (i = 0; i < n; i++) {
						query.push(encodeURIComponent(key) + "=" + encodeURIComponent(values[i]));
					}
				}
			}
			
			return query.join('&');
		},
		
		/**
		 * Converts a query string to an object literal containing key value pairs.
		 * 
		 * @method toParameters
		 * @static
		 * @param {String} queryString to convert
		 * @return {Object} an object literal containing key value pairs from the query string
		 */
		toParameters: function(queryString) {
			var match = lang.trim(queryString).match(/([^?#]*)(#.*)?$/);
			
			if (!match) {
				return {};
			}
		
			var results = {},
				uriComponents = match[1].split('&'),
				n = uriComponents.length,
				i, pair, name, value;
				
			for (i = 0; i < n; i++) {
				pair = uriComponents[i].split('=');
				
				if (pair[0]) {
					name = decodeURIComponent(pair[0]);
					value = pair[1] ? decodeURIComponent(pair[1]) : '';
					
					if (results[name] !== undefined) {
						if (!lang.isArray(results[name])) {
							results[name] = [results[name]];
						}
						if (value) {
							results[name].push(decodeURIComponent(value));
						}
					} else {
						results[name] = decodeURIComponent(value);
					}
				}
			}
			
			return results;
		},
		
		/**
		 * Fires event handlers applied to an HTML element.
		 * 
		 * @method fireEvents
		 * @static
		 * @private
		 * @param {String} the type of event to fire 
		 * @param {String | HTMLElement | Array} element form field id or element or array of ids and/or elements to fire the events on.
		 */
		fireEvents: function(event, elements) {
			Dom.batch(elements, function (element) {
				if (document.createEventObject){
					// dispatch for IE
					element.fireEvent('on' + event, document.createEventObject());
				} else {
					// dispatch for Firefox + others
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent(event, true, true); // event type, bubbling, cancelable
					element.dispatchEvent(evt);
				}
			});
		},

		/**
		 * Gives focus to a form control and selects its contents if it is a text input.
		 * 
		 * @method activate
		 * @static
		 * @param {String | HTMLElement | Array} element form field id or element or array of ids and/or elements to activate. 
		 * If an Array is passed the first field is activated.
		 */
		activate: function(element) {
			element = Dom.get(element);
			
			if (element.length) {
				element = element[0];
			}
			
			try {
				element.focus();
				
				if (element.select && !Selector.test(element, 'input[type=button], input[type=reset], input[type=submit]')) {
					element.select();
				}
			} catch (e) {}
		},
		
		/**
		 * Disables the form field(s) supplied.
		 * 
		 * @method disable
		 * @static
		 * @param {String | HTMLElement | Array} element form field id or element or array of ids and/or elements to disable.
		 */
		disable: function(element) {
			var i, n;
			
			element = Dom.get(element);
			
			if (!lang.isArray(element)) {
				element = [element];
			}
			
			n = element.length;
			
			for (i = 0; i < n; i++) {
				element[i].blur();
				element[i].disabled = true;
			}
		},

		/**
		 * Enables the form field(s) supplied.
		 * 
		 * @method enable
		 * @static
		 * @param  {String | HTMLElement | Array} element form field id or element or array of ids and/or elements to enable.
		 */
		enable: function(element) {
			var i, n;
			
			element = Dom.get(element);
			
			if (!lang.isArray(element)) {
				element = [element];
			}
			
			n = element.length;
			
			for (i = 0; i < n; i++) {
				element[i].disabled = false;
			}
		},

		/**
		 * Returns the current value of a form control.
		 * 
		 * @method getValue
		 * @param {String | HTMLElement | Array} element form field id or element or array of ids and/or elements.
		 * If an Array is passed the value of the first field is returned.
		 * @return {String | Array} Value of the element. For most controls a String is returned.
		 * For select controls with multiple selection enabled and checkbox groups with multiple values an Array is returned
		 */
		getValue: function(element) {
			var tagName;
			
			element = Dom.get(element);
			tagName = element.tagName ? element.tagName.toLowerCase(): element[0].tagName.toLowerCase();
			
			return serializers[tagName](element);
		},
		
		/**
		 * Sets the value of a form control.
		 * 
		 * @method setValue
		 * @static
		 * @param {String | HTMLElement | Array} element form field id or element or array of ids and/or elements.
		 * If an Array is passed the value of the first field is set.
		 * @param {String | Array} a single value or array of values to set into the scoped form field.
		 */
		setValue: function(element, values) {
			element = Dom.get(element);
			
			var parameter = { name: element.tagName ? element.tagName.toLowerCase(): element[0].tagName.toLowerCase() , value: values || ''};
			var originalValue = ORCHESTRAL.util.Form.getValue(element);
			deserializers[parameter.name](parameter, element);
			var newValue = ORCHESTRAL.util.Form.getValue(element);
			
			if (!isSameValue(originalValue, newValue)) {
				this.fireEvents('change', element);
			}
		},
		
		/**
		 * Determines if a form field value is empty.  
		 * 
		 * @method isEmpty
		 * @static
		 * @param {String | HTMLElement} element form field id or element.
		 * @return {Boolean} true if the field is empty.
		 */
		isEmpty: function(element) {
			if (lang.isArray(element) || isNodeList(element)) {
				throw new Error('isEmpty must be passed a single element');
			}
			
			var value = lang.trim(ORCHESTRAL.util.Form.getValue(element));
			
			return (value === null || value === '');
		},
		
		/**
		 * Determines if all the form fields value are empty in the given scope.  
		 * 
		 * @method isEmptyScope
		 * @static
		 * @param {String | HTMLElement} scope parent element.
		 * @return {Boolean} true if all fields in the scope are empty.
		 */
		isEmptyScope: function(scope) {
			var formElements = getFormFields(scope),
				n = formElements.length,
				i;
			
			for (i = 0; i < n; i++) {
				if (!this.isEmpty(formElements[i])) {
					return false;
				}
			}
			
			return true;
		},

		/**
		 * Parses a query string or object literal of key value pairs into the form fields
		 * of the provided HTMLElement scope.  These fields will be populated in order of
		 * declaration and may span multiple form elements, we recommend using form elements
		 * for the scope variable as generally this makes the most sense and will avoid
		 * any potential performance issues. 
		 *
		 * A change event is fired on any element which changes due to the deserialization
		 * process, for example a checkbox which changes from unchecked to checked or a
		 * text input whose value changes.
		 * 
		 * @method deserialize
		 * @static
		 * @param {String | HTMLElement} scope parent element.
		 * @param {Object} parameters an object literal containing key value pairs.
		 */
		deserialize: function(scope, parameters) {
			var formElements = getFormFields(scope),
				p, parameter, elements, method, originalValue, newValue;
			
			for (p in parameters) {
				parameter = { name: p, value: parameters[p] || "" };
				
				elements = ORCHESTRAL.lang.filter(formElements, function(el) {
					return el.name == parameter.name;
				});
				
				if (elements.length > 0) {
					method = elements[0].tagName.toLowerCase();
					originalValue = ORCHESTRAL.util.Form.getValue(elements);
					
					deserializers[method](parameter, elements);
					
					newValue = ORCHESTRAL.util.Form.getValue(elements);
					
					if (!isSameValue(originalValue, newValue)) {
						this.fireEvents('change', elements);
					}
				}
			}
		},
		
		/**
		 * Converts a HTML form element into an object literal of key value pairs.
		 * 
		 * @method serialize
		 * @static
		 * @param {String | HTMLElement} scope parent element.
		 * @return {Object} serialized form fields.
		 */
		serialize: function(scope) {
			var formElements = getFormFields(scope),
				data = {};
			
			Dom.batch(formElements, function(element) {
				if (!element.disabled && element.name) {
					var key = element.name;
					element = Dom.get(element);
					var value = serializers[element.tagName.toLowerCase()](element);
					
					if (lang.isValue(data[key]) && data[key] !== '' && lang.isValue(value)) {
						if (!lang.isArray(data[key])) {
							data[key] = [data[key]];
						}
						data[key].push(value);
					} else if (lang.isUndefined(data[key]) || !data[key]) {
						// Don't overwrite any existing value unless it is an string.
						data[key] = value || '';
					}
				}
			});
			
			return data;
		},
		
		/**
		 * Sets all the form elements values in the provided form to the empty string.
		 *
		 * @method clear
		 * @static
		 * @param {String | HTMLElement} scope HTMLElement or id of a HTMLElement containing the form fields to clear out.
		 */
		clear: function(scope) {
			var formElements = getFormFields(scope);
			
			Dom.batch(formElements, function(element) {
				switch (element.type.toLowerCase()) {
					case 'checkbox': 
					case 'radio':
						element.checked = false;
						break;
					default:
						if (element.tagName && element.tagName.toLowerCase() === 'select') {
							element.selectedIndex = 0;
						} else {
							// Input fields or textareas.
							element.value = '';
						}
				}
			});
		},
		
		/**
		 * Indicates if the value of the any form on the field has changed since page load or last clean.
		 * 
		 * @method isDirty
		 * @static
		 * @param {String | HTMLElement} scope HTMLElement or id of a HTMLElement
		 * @return {Boolean} true if the value of the any form on the field has changed since page load or last clean.
		 */
		isDirty: function(scope) {
			var formElements = getFormFields(scope),
				n = formElements.length,
				i, j, element, option;
				
			for (i = 0; i < n; i++) {
				element = formElements[i];
				
				if (element.className.toLowerCase().indexOf('derived') != -1) {
					continue;
				}
				
				switch (element.type.toLowerCase()) {
				case 'checkbox': 
				case 'radio':
					if (element.checked != element.defaultChecked) {
						return true;
					}
					break;
				case 'select-one': 
				case 'select-multiple':
					for (j = 0; j < element.options.length; j++) {
						option = element.options[j];
						if (option.selected != option.defaultSelected && serializers.optionValue(option) != "") {
							return true;
						}
					}
					break;
				default:
					if (convertLineEndings(element.value) != convertLineEndings(element.defaultValue)) {
						return true;
					}
					break;
				}
			}
			return false;
		},
		
		/**
		 * Mark form as clean, meaning that susbsequent isDirty checks will be 
		 * compared to the current state of the form.
		 * 
		 * @method clean
		 * @static
		 * @param {String | HTMLFormElement} scope an HTMLElement or an id of an HTMLElement representing the scope for the clean.
		 */ 
		clean: function(scope) {
			var formElements = getFormFields(scope),
				n = formElements.length,
				i, j, element, option;
				
			for (i = 0; i < n; i++) {
				element = formElements[i];
				
				switch (element.type.toLowerCase()) {
				case 'checkbox': 
				case 'radio':
					element.defaultChecked = element.checked;
					break;
				case 'select-one': 
				case 'select-multiple':
					for (j = 0; j < element.options.length; j++) {
						option = element.options[j];
						option.defaultSelected = option.selected;
					}
					break;
				default:
					element.defaultValue = element.value;
					break;
				}
			}
		}
	};
}());

YAHOO.register('orchestral-form', ORCHESTRAL.util.Form, {version: '7.9', build: '0'});

}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-selector", "yui2-orchestral"]});
