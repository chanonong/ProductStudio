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
YUI.add('yui2-legacy-form', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @fileoverview A library for dealing with forms on a web page.
 * @module legacy-form
 */

/**
 * Unused private constructor (all class methods are static).
 * @class The Page class provides static methods for dealing with forms
 * on a page.
 * @constructor
 */
function Page() {}
window.Page = Page;

Page.excludedInputNames = [];

/**
 * @private
 */
Page.changed = false;

/**
 * Returns <code>true</code> if the page is considered dirty, that is, any of
 * the underlying form elements in the page have changed since the page loaded.
 * Any input fields with the class name "Derived" will be ignored in the dirty
 * check.
 * This currently fails to detect changed hidden input fields
 * <a href="http://bugzilla.mozilla.org/show_bug.cgi?id=205618">in Mozilla based
 * browsers</a>.
 * @return <code>true</code> if the page is dirty; <code>false</code> otherwise
 * @type Boolean
 */
Page.isDirty = function() {
	if (Page.changed) return true;
	for (var i = 0; i < document.forms.length; i++) {
		if (new Form(document.forms[i]).isDirty()) {
			return true;
		}
	}
	return false;
};

/**
 * Manually set the page to be considered dirty. This allows the page to be
 * marked as dirty when custom widgets change their value.
 * @type void
 */
Page.setDirty = function() {
	Page.changed = true;
};

/**
 * Set the form element default values to their current values so the page is
 * considered clean.
 * @type void
 */
Page.clean = function() {
	for (var i = 0; i < document.forms.length; i++) {
		new Form(document.forms[i]).clean();
	}
	Page.changed = false;
};

/**
 * Gets a parameter list representation of all the forms on the page.
 * @return a parameter list containing all of the form content on the page
 * @type ParameterList
 *
 * Requires the ParameterList class to exist on the page.
 */
Page.getParameterList = function() {
	var params = new ParameterList();
	for (var i = 0; i < document.forms.length; i++) {
		params.addParameters(new Form(document.forms[i]).getParameterList());
	}
	return params;
};

/**
 * @class A Form is a wrapper that provides convience methods for dealing with
 * forms.
 * @param form the DOM reference of the form to wrap
 * @constructor
 */
function Form(form) {
	/** @private */
	this.form = form;

	/**
	 * Returns <code>true</code> if this form is considered dirty, that is, any of
	 * the underlying form elements have been changed since the page loaded. Any
	 * input fields with the class name "Derived" will be ignored in the dirty
	 * check.
	 * This currently fails to detect changed hidden input fields
	 * <a href="http://bugzilla.mozilla.org/show_bug.cgi?id=205618">in Mozilla
	 * based browsers</a>.
	 * @return <code>true</code> if the form is dirty; <code>false</code>
	 * otherwise
	 * @type Boolean
	 */
	this.isDirty = function() {
		var convertLineEndings = function(text) {
			return text.replace(/\r\n/g, '\r').replace(/\n/g, '\r');
		}
		for (var i = 0; i < this.form.elements.length; i++) {
			var element = this.form.elements[i];
			if (element.className.toLowerCase().indexOf("derived") != -1) {
				continue;
			}
			if ("text" == element.type || "hidden" == element.type || "password" == element.type || "textarea" == element.type) {
				if (element.value != element.defaultValue) {
					// Convert line endings to \r because Internet Explorer will munge them in the defaultValue
					if (convertLineEndings(element.value) != convertLineEndings(element.defaultValue)) {
						return true;
					}
				}
			} else if ("checkbox" == element.type || "radio" == element.type) {
				if (element.checked != element.defaultChecked) {
					return true;
				}
			} else if ("select-one" == element.type || "select-multiple" == element.type) {
				for (var j = 0; j < element.options.length; j++) {
					var option = element.options[j];
					if (option.selected != option.defaultSelected && option.value != "") {
						return true;
					}
				}
			}
		}
		return false;
	};

	/**
	 * Set the form element default values to their current values so the form is
	 * considered clean.
	 * @type void
	 */
	this.clean = function() {
		for (var i = 0; i < this.form.elements.length; i++) {
			var element = this.form.elements[i];
			if ("text" == element.type || "hidden" == element.type || "password" == element.type || "textarea" == element.type) {
				element.defaultValue = element.value;
			} else if ("checkbox" == element.type || "radio" == element.type) {
				element.defaultChecked = element.checked;
			} else if ("select-one" == element.type || "select-multiple" == element.type) {
				for (var j = 0; j < element.options.length; j++) {
					var option = element.options[j];
					option.defaultSelected = option.selected;
				}
			}
		}
	};

	/**
	 * Gets a parameter list representation of all the form. Any information
	 * from input fields with the class name "Derived" will not be contained in
	 * the parameter list.
	 * @return a parameter list containing all of the form content
	 * @type ParameterList
	 *
	 * Requires the ParameterList class to exist on the page.
	 */
	this.getParameterList = function() {
		var params = new ParameterList();
		for (var i = 0; i < this.form.elements.length; i++) {
			var element = this.form.elements[i];
			var name = element.name;

			if (element.className.toLowerCase().indexOf("derived") != -1) {
				continue;
			}

			if ("select-one" == element.type || "select-multiple" == element.type) {
				for (var j = 0; j < element.options.length; j++) {
					if (element.options[j].selected) params.addParameter(name, element.options[j].value);
				}
				if (!params.hasParameter(name)) params.addParameter(name, "");
			} else if ("checkbox" == element.type) {
				// Checkboxes that don't have a value attribute use the default
				// value attribute of 'on' in IE/Firefox and null in Webkit.
				if (element.value && element.value != "on") {
					// The checkbox value has been customised, so we only send through
					// the value when it is checked.
					if (element.checked) {
						params.addParameter(name, element.value);
					}
				} else {
					// The checkbox value attribute has not been customised, so send the
					// current state of the checkbox through as the value.
					params.addParameter(name, element.checked);
				}
			} else if ("radio" == element.type) {
				if (element.checked) {
					params.setParameter(name, element.value);
				} else if (!params.hasParameter(name)) {
					params.addParameter(name, "");
				}
			} else if (name != "" && typeof name != "undefined") {
				params.addParameter(name, element.value);
			}
		}
		return params;
	};
}
window.Form = Form;


}, '7.9.0');
