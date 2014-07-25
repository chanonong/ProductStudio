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
YUI.add('ohp-mandatory-item-plugin', function (Y, NAME) {

"use strict";
/**
RepeatingList plugin that enforces that at least one active item is in the list.
// TODO: update description as plugin can be applied to TagGroups (and other widgets?) too.
// TODO: should translation variables be changed to be more generic too?

@module ohp-mandatory-item-plugin
**/

var Locale = Y.OHP.Locale;

/**
 * @class MandatoryListItemPlugin
 * @namespace OHP
 * @extends Plugin.Base
 */
function MandatoryListItemPlugin(/*config*/) {
	MandatoryListItemPlugin.superclass.constructor.apply(this, arguments);
}

MandatoryListItemPlugin.NAME = 'mandatoryListItemPlugin';
MandatoryListItemPlugin.NS = 'mandatoryItem';

Y.extend(MandatoryListItemPlugin, Y.Plugin.Base, {
	initializer: function (/*config*/) {
		this._missingRequiredErrorNode = Y.Node.create('<div class="error"></div>');

		this.afterHostMethod('render', this._checkMandatory);
		this.afterHostEvent('addChild', this._checkMandatory);
		this.afterHostEvent('removeChild', this._checkMandatory);
		this.afterHostEvent('itemIncluded', this._checkMandatory);
		this.afterHostEvent('itemExcluded', this._checkMandatory);

		this._checkMandatory();
	},

	_checkMandatory: function () {
		var host = this.get('host'),
			boundingBox = host.get('boundingBox'),
			field = boundingBox.ancestor('.field'),
			n = host.size(),
			itemExcludedClass = host.getClassName('item-excluded'),
			errorMessage,
			contentBox;

		if (!boundingBox.inDoc()) {
			return;
		}

		// for every child that is excluded, remove it from the count
		host.each(function(repeatingListItem) {
			if (repeatingListItem.get('srcNode').hasClass(itemExcludedClass)) {
				n -= 1;
			}
		});

		if (n === 0) {
			boundingBox.addClass(host.getClassName('error'));

			// TODO: there should be a single translation for this message,
			// not two concatenated as the order might not work in some languages
			errorMessage = Locale.get('widget.repeatingList.error.atLeastOneItem') + ' ' +
					Locale.get('widget.repeatingList.error.isRequired');
			this._missingRequiredErrorNode.set('text', errorMessage);

			if (field){
				field.appendChild(this._missingRequiredErrorNode);
			} else {
				// For situations where there is no field.
				contentBox = host.get('contentBox');
				contentBox.appendChild(this._missingRequiredErrorNode);
			}
		} else {
			boundingBox.removeClass(host.getClassName('error'));
			this._missingRequiredErrorNode.remove();
		}

	}
});

Y.namespace('OHP').MandatoryListItemPlugin = MandatoryListItemPlugin;
Y.namespace('OHP').MandatoryItemPlugin = MandatoryListItemPlugin;


}, '7.9.0', {
    "requires": [
        "ohp-locale-translations",
        "ohp-locale-base",
        "arraylist",
        "substitute",
        "plugin",
        "node-base"
    ]
});
