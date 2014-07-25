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
YUI.add('ohp-autocomplete-force-selection-plugin', function (Y, NAME) {

"use strict";
/**
Provides a plugin which adds force selection functionality to an Autocomplete control. Should be plugged in to the input hosting the
autocomplete.

Consider enabling 'activateFirstItem' in the Autocomplete control. This will mean if the user clicks the change link by mistake, or if they
change their mind after selecting it, they can re-select the item with one key press (tab or enter) - as it will already be selected in the
list.

@module ohp-autocomplete-force-selection-plugin
**/

var Locale = Y.OHP.Locale,
	getClassName = Y.OHP.OhpClassNameManager.getClassName,

	CLASS_NAMES = {
		container: getClassName('ac', 'fs', 'container'),
		displayText: getClassName('ac', 'fs', 'text'),
		changeLink: getClassName('ac', 'fs', 'link')
	},

	TEXT_AND_LINK = Y.Handlebars.compile(
		'<span class="' + CLASS_NAMES.container + '">' +
			'<span class="' + CLASS_NAMES.displayText + '"></span>' +
			'&nbsp;<a href="#" class="' + CLASS_NAMES.changeLink + '">' + Locale.get('widget.autocomplete.change') + '</a>' +
		'</span>'
	);

/**
A plugin to ensure that users can only select values from the autocomplete suggestion list - other values will be cleared from the input on
blur. This plugin should be bound to an input instance that is hosting a Y.Plugin.AutoComplete.

@example

	var myInput = Y.one('#my-input');

	myInput.plug(Y.Plugin.AutoComplete, {
		source: ['a', 'b', 'c', 'd']
	});

	myInput.plug(Y.OHP.Plugin.ForceSelection);

@class ForceSelection
@namespace OHP.Plugin
@extends Plugin.Base
**/
function ForceSelection(/* config */) {
	ForceSelection.superclass.constructor.apply(this, arguments);
}

ForceSelection.NS = 'fs';
ForceSelection.NAME = 'ForceSelection';

Y.extend(ForceSelection, Y.Plugin.Base, {

	initializer: function(config) {
		this._input = config.host;

		this._displayContainer = this._setupDisplayContainer();

		this._eventHandles = [

			this._input.ac.after('select', function(e) {
				this._selectedItem = e.result;
				this._displaySelectedItem();
			}, this),

			// If the text has changed since the last valid input, clear it out. If it hasn't changed, select again on blur.
			this._input.on('blur', function() {
				if (!this._selectedItem || this._input.get('value') !== this._selectedItem.text) {
					this._input.set('value', '');
					this._selectedItem = null;
				} else {
					this._displaySelectedItem();
				}
			}, this)
		];

	},

	destructor: function() {

		Y.Array.invoke(this._eventHandles, 'detach');

		this._displayContainer.purge(true);
		this._displayContainer.remove();
		this._displayContainer = null;
	},

	/**
	Construct the container that will be used to display the read only view of the selected list item once the user has chosen from the
	list. A change link allows the user to revert back to the editable input with autocomplete and choose again.

	@method _setupDisplayContainer
	@private
	**/
	_setupDisplayContainer: function() {

		var input = this._input,
			inputHeight = input.getDOMNode().offsetHeight,
			displayContainer = Y.Node.create(TEXT_AND_LINK()),
			changeLink = displayContainer.one('.' + CLASS_NAMES.changeLink);

		input.insert(displayContainer, 'after');
		displayContainer.setStyle('minHeight', inputHeight + 'px');

		// Hide the display container to begin with
		displayContainer.hide();

		changeLink.on('click', function(e) {

			e.preventDefault();
			e.stopPropagation();

			displayContainer.hide();

			input.show();
			input.set('value', this._selectedItem.text);

			// Trigger the autocomplete list to search straight away
			input.ac.sendRequest(this._selectedItem.text);

			input.select();
			input.focus();
		}, this);

		return displayContainer;
	},

	/**
	Toggles the read only view of the selected item, if not already shown.

	@method _displaySelectedItem
	@private
	**/
	_displaySelectedItem: function() {

		var displayContainer = this._displayContainer;

		if (displayContainer.getAttribute('hidden') !== 'true') {
			this._input.hide();

			displayContainer.one('.' + CLASS_NAMES.displayText).setHTML(this._selectedItem.display);

			// Providing our own show method that sets display to be an inline block
			displayContainer.show();
			displayContainer.setStyle('display', 'inline-block');

			displayContainer.one('.' + CLASS_NAMES.changeLink).focus();
		}
	}
});

Y.namespace('OHP.Plugin').ForceSelection = ForceSelection;


}, '7.9.0', {
    "requires": [
        "base",
        "handlebars",
        "plugin",
        "ohp-locale-translations",
        "ohp-locale-base",
        "ohp-ohp-class-name-manager"
    ]
});
