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
YUI.add('yui2-orchestral-button-aria', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL */

/**
 * Adds WAI-ARIA support to checkboxes and radio buttons.
 *
 * Based on https://github.com/yui/yui2/blob/master/sandbox/buttonariaplugin/js/buttonariaplugin.js
 *
 * @module orchestral-button-aria
 * @requires yahoo, button, orchestral, orchestral-button-core
 */

// TODO: can i use this with ORCHESTRAL.use
(function () {
	'use strict';

	var Lang = YAHOO.lang,
		UA = ORCHESTRAL.env.ua,

		ButtonPrototype = YAHOO.widget.Button.prototype,
		fnButtonInitAttributes = ButtonPrototype.initAttributes,

		ButtonGroupBasePrototype = ORCHESTRAL.widget.ButtonGroupBase.prototype,
		fnButtonGroupBaseInitAttributes = ButtonGroupBasePrototype.initAttributes,

		CheckboxButtonGroupPrototype = ORCHESTRAL.widget.CheckboxButtonGroup.prototype,
		fnCheckboxButtonGroupAddButton = CheckboxButtonGroupPrototype.addButton,

		RadioButtonGroupPrototype = ORCHESTRAL.widget.RadioButtonGroup.prototype,
		fnRadioButtonGroupAddButton = RadioButtonGroupPrototype.addButton,
		fnRadioButtonGroupAddButtons = RadioButtonGroupPrototype.addButtons,

		m_bUseAria = ((UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8)) || !(UA.gecko && UA.ie),

		// Private constants for strings

		ARIA_PREFIX = 'aria-',
		USE_ARIA = 'usearia',
		CHECKED = 'checked',
		TYPE = 'type',
		MENU = 'menu',
		SPLIT = 'split',
		HAS_POPUP = 'haspopup',
		RENDER = 'render',
		RADIO = 'radio',
		CHECKBOX = 'checkbox',
		ROLE = 'role',
		CHECKED_CHANGE = 'checkedChange',
		PRESENTATION = 'presentation',
		ELEMENT = 'element',
		GROUP = 'group',
		RADIO_GROUP = 'radiogroup',
		CHECKED_BUTTON_CHANGE = 'checkedButtonChange',
		APPEND_TO = 'appendTo',
		LABELLED_BY = 'labelledby',
		DESCRIBED_BY = 'describedby',
		ID = 'id',
		DISABLED = 'disabled';

	if (m_bUseAria) {
		ButtonPrototype.RADIO_DEFAULT_TITLE = '';
		ButtonPrototype.RADIO_CHECKED_TITLE = '';
		ButtonPrototype.CHECKBOX_DEFAULT_TITLE = '';
		ButtonPrototype.CHECKBOX_CHECKED_TITLE = '';
	}

	// Common ARIA plugin

	function setAriaRole(element, role) {
		element.setAttribute(ROLE, role);
	}

	function setAriaProperty(element, property, value) {
		element.setAttribute((ARIA_PREFIX + property), value);
	}

	// Button ARIA plugin

	function enableAriaForMenu(type, args, button) {
		button.cfg.setProperty(USE_ARIA, true);
		button.cfg.setProperty(LABELLED_BY, button.get(ID));
	}

	function onAppendToForAriaMenu(event, button) {
		button._menu.subscribe(RENDER, enableAriaForMenu, button);
	}

	/*
	 * Toggles aria-checked attribute to keep in sync with button's checked value
	 */
	function toggleAriaCheckedState(event, button) {
		setAriaProperty(button._button, CHECKED, event.newValue);
	}

	// Common ButtonGroupBase ARIA plugin

	/*
	 * Enables Aria on the given button
	 */
	function enableButtonAria(oButton) {
		var oParentNode =oButton._button.parentNode;

		oButton.set(USE_ARIA, true);

		setAriaRole(oParentNode, PRESENTATION);
		setAriaRole(oParentNode.parentNode, PRESENTATION);
	}

	// RadioButtonGroup ARIA plugin

	/*
	 * Handles a change of which button is checked in a button group.
	 *
	 * Sets the aria-checked attribute of the checked and unchecked buttons.
	 *
	 * Sets tabIndex of the checked button to 0, and all other buttons in p_aButtons to -1.
	 * If the new button is null, sets tabIndex of first enabled button in p_aButtons to 0 instead.
	 * This ensures that either the checked button, or if none are checked the first enabled button
	 * will receive tab focus, but no others will.
	 */
	function handleCheckedButtonChange(event, p_aButtons) {
		var oPrevButton = event.prevValue,
			oNewButton = event.newValue,
			nButtons = p_aButtons.length,
			oButton,
			i,
			tabIndexSet = false;

		if (nButtons > 0) {
			for (i = 0; i < nButtons; i += 1) {
				oButton = p_aButtons[i];

				// if new button is null then we are unchecking it, so tab will focus the first enabled button in the group
				if (!oNewButton && !tabIndexSet && !oButton.get(DISABLED)) {
					oButton._button.tabIndex = 0;
					tabIndexSet = true;
				} else if (oButton === oNewButton) { // otherwise if it is the new button, tab to it
					oButton._button.tabIndex = 0;
				} else {
					oButton._button.tabIndex = -1; // otherwise skip it
				}
			}
		}

		if (oPrevButton) {
			setAriaProperty(oPrevButton._button, CHECKED, false);
		}

		if (oNewButton) {
			setAriaProperty(oNewButton._button, CHECKED, true);
		}
	}

	/*
	 * Ensures that there is an enabled button in p_aButtons that has tabIndex set to 0.
	 * If there isn't one, it will set tabIndex of the first enabled button to 0.
	 * This ensures that the button group will receive tab focus even if there are no checked buttons
	 * (as long as there is at least one enabled button).
	 */
	function ensureReceivesTabFocus(p_aButtons) {
		var nButtons = p_aButtons.length,
			oButton,
			i,
			hasTabIndex = false,
			firstEnabledButtonIndex = -1;

		if (nButtons > 0) {
			// check all enabled buttons to see if they have tab index of 0, and also record the first enabled one
			for (i = 0; i < nButtons && !hasTabIndex; i += 1) {
				oButton = p_aButtons[i];
				if (!oButton.get(DISABLED)) {
					if (oButton._button.tabIndex > -1) {
						hasTabIndex = true;
					} else if (firstEnabledButtonIndex < 0) {
						firstEnabledButtonIndex = i;
					}
				}
			}

			// if there aren't any enabled buttons that receive tab focus, tab to first enabled button in group
			if (!hasTabIndex && firstEnabledButtonIndex > -1) {
				p_aButtons[firstEnabledButtonIndex]._button.tabIndex = 0;
			}
		}
	}

	/**
	 * @namespace ORCHESTRAL.widget
	 * @class ButtonAria
	 * @extensionfor Button
	 */
	Lang.augmentObject(ButtonPrototype, {

		_setUseAria: function (p_bUseAria) {
			var sType = this.get(TYPE),
				oButtonEl = this._button;

			if (p_bUseAria) {
				if (sType === MENU || sType === SPLIT) {
					setAriaProperty(oButtonEl, HAS_POPUP, true);
					this.on(APPEND_TO, onAppendToForAriaMenu, this);
				} else if (sType === RADIO || sType === CHECKBOX) {
					setAriaRole(oButtonEl, sType);
					setAriaProperty(oButtonEl, CHECKED, this.get(CHECKED));
					// only toggle checked state for checkboxes, radio buttons will be handled by group
					if (sType === CHECKBOX) {
						this.on(CHECKED_CHANGE, toggleAriaCheckedState, this);
					}
				}
			}
		},

		initAttributes: function (p_oAttributes) {
			/**
			* @attribute usearia
			* @description Boolean indicating if use of the WAI-ARIA Roles and States should
			* be enabled.
			* @type Boolean
			* @default true for Firefox 3 and IE 8, false for all other browsers.
			*/
			this.setAttributeConfig(USE_ARIA, {
				value: p_oAttributes.usearia || m_bUseAria,
				validator: Lang.isBoolean,
				writeOnce: true,
				method: this._setUseAria
			});

			fnButtonInitAttributes.apply(this, arguments);

			if (m_bUseAria) {
				this.set(USE_ARIA, true);
			}
		}

	}, true);

	/**
	 * @namespace ORCHESTRAL.widget
	 * @class ButtonGroupBaseAria
	 * @extensionfor ButtonGroupBase
	 */
	Lang.augmentObject(ButtonGroupBasePrototype, {

		_setLabelledBy: function (id) {
			if (this.get(USE_ARIA)) {
				setAriaProperty(this.get(ELEMENT), LABELLED_BY, id);
			}
		},

		_setDescribedBy: function (id) {
			if (this.get(USE_ARIA)) {
				setAriaProperty(this.get(ELEMENT), DESCRIBED_BY, id);
			}
		},

		initAttributes: function (p_oAttributes) {

			/**
			* @attribute usearia
			* @description Boolean indicating if use of the WAI-ARIA Roles and States should
			* be enabled.
			* @type Boolean
			* @default true for Firefox 3 and IE 8, false for all other browsers.
			*/
			this.setAttributeConfig(USE_ARIA, {
				value: p_oAttributes.usearia || m_bUseAria,
				validator: Lang.isBoolean,
				writeOnce: true,
				method: this._setUseAria
			});

			/**
			* @attribute labelledby
			* @description String representing the id of the element that labels the ButtonGroup.
			* Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#labelledby">
			* <code>aria-labelledby</code></a> attribute.
			* @type String
			* @default null
			*/
			this.setAttributeConfig(LABELLED_BY, {
				value: p_oAttributes.labelledby,
				validator: Lang.isString,
				method: this._setLabelledBy
			});

			/**
			* @attribute describedby
			* @description String representing the id of the element that describes the ButtonGroup.
			* Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#describedby">
			* <code>aria-describedby</code></a> attribute.
			* @type String
			* @default null
			*/
			this.setAttributeConfig(DESCRIBED_BY, {
				value: p_oAttributes.describedby,
				validator: Lang.isString,
				method: this._setDescribedBy
			});

			fnButtonGroupBaseInitAttributes.apply(this, arguments);

			if (m_bUseAria) {
				this.set(USE_ARIA, true);
			}

		}

	}, true);

	/**
	 * @namespace ORCHESTRAL.widget
	 * @class CheckboxButtonGroupAria
	 * @extensionfor CheckboxButtonGroup
	 */
	Lang.augmentObject(CheckboxButtonGroupPrototype, {

		addButton: function (p_oButton) {
			var oButton = fnCheckboxButtonGroupAddButton.call(this, p_oButton);

			if (this.get(USE_ARIA)) {
				enableButtonAria(oButton);
			}

			return oButton;
		},

		_setUseAria: function(p_bUseAria) {
			if (p_bUseAria) {
				setAriaRole(this.get(ELEMENT), GROUP);
			}
		}

	}, true);

	/**
	 * @namespace ORCHESTRAL.widget
	 * @class RadioButtonGroupAria
	 * @extensionfor RadioButtonGroup
	 */
	Lang.augmentObject(RadioButtonGroupPrototype, {

		addButton: function (p_oButton) {
			var oButton = fnRadioButtonGroupAddButton.call(this, p_oButton);

			if (this.get(USE_ARIA)) {
				enableButtonAria(oButton);
				oButton._button.tabIndex = oButton.get(CHECKED) ? 0 : -1;
			}

			return oButton;
		},

		addButtons: function (p_aButtons) {
			var aButtons = fnRadioButtonGroupAddButtons.call(this, p_aButtons);
			ensureReceivesTabFocus(aButtons);
			return aButtons;
		},

		_setUseAria: function (p_bUseAria) {
			if (p_bUseAria) {
				setAriaRole(this.get(ELEMENT), RADIO_GROUP);

				this.on(CHECKED_BUTTON_CHANGE, function (event) {
					handleCheckedButtonChange(event, this.getButtons());
				});
			}
		}
	}, true);
}());

YAHOO.register('orchestral-button-aria', ORCHESTRAL.widget.Button, {version: '7.9', build: '0'});


}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-button", "yui2-orchestral", "yui2-orchestral-button-core"]});
