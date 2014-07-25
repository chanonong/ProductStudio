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
YUI.add('ohp-change-exclude-item-plugin', function (Y, NAME) {

/**
RepeatingList plugin that allows users to change and exclude list items.

@module ohp-change-exclude-item-plugin
**/
var Locale = Y.OHP.Locale;

/**
@class ChangeExcludeListItemPlugin
@namespace OHP
@extends Plugin.Base
**/
function ChangeExcludeListItemPlugin(/*config*/) {
	ChangeExcludeListItemPlugin.superclass.constructor.apply(this, arguments);
}

ChangeExcludeListItemPlugin.NAME = 'changeExcludeListItemPlugin';
ChangeExcludeListItemPlugin.NS = 'changeExcludeItem';

ChangeExcludeListItemPlugin.ATTRS = {
	/**
	Function to be called when user chooses to change an item on the list.
	This function should get input from user, change the list item, etc.

	@config changeHandler
	@type Function
	@writeOnce
	**/
	changeHandler: {
		value: function() {
			Y.log('Default changeHandler implementation');
		},

		validator: Y.Lang.isFunction,
		writeOnce: true
	}
};

Y.extend(ChangeExcludeListItemPlugin, Y.Plugin.Base, {
	initializer: function(/*config*/) {
		var host = this.get('host');

		this.afterHostMethod('render', this._afterRender);
		this.afterHostEvent('addChild', this._afterChildAddOrUpdate);
		this.afterHostEvent('updateChild', this._afterChildAddOrUpdate);

		// TODO: intercept setContent

		host.publish('itemExcluded', {
			emitFacade: true,

			defaultFn: function(e) {
				var item = e.item,
					contentBox =  item.get('contentBox'),
					changeLink = contentBox.one('ul.separated .action-change');

				contentBox.addClass(item.getClassName('excluded'));
				changeLink.setAttribute('tabindex', '-1');
			}
		});

		host.publish('itemIncluded', {
			emitFacade: true,

			defaultFn: function(e) {
				var item = e.item,
					contentBox =  item.get('contentBox'),
					changeLink = contentBox.one('ul.separated .action-change');

				contentBox.removeClass(item.getClassName('excluded'));
				changeLink.removeAttribute('tabindex');
			}
		});

		host.get('contentBox').delegate('click', function(e) {
			var changeHandler = this.get('changeHandler'),

				childNode = e.target.ancestor(function(node) {
					return node.hasClass('ohp-repeating-list-item-content');
				}),

				activeDescendant,

				boundFn;

			e.preventDefault();

			host.each(function(item) {
				if (item.get('contentBox') === childNode) {
					activeDescendant = item;
				}
			});

			if (!(activeDescendant && childNode)) {
				return;
			}

			if (e.target.hasClass('action-change') && !childNode.hasClass(host.getClassName('item-excluded')) && changeHandler) {
				boundFn = Y.bind(changeHandler, activeDescendant);
				boundFn();
			} else if (e.target.hasClass('action-exclude')) {
				host.fire('itemExcluded', { item: activeDescendant });
			} else if (e.target.hasClass('action-include')) {
				host.fire('itemIncluded', { item: activeDescendant });
			}
		}, 'ul.separated a', this);
	},

	/**
	@event itemExcluded
	@description Fires when an item is excluded from the list.
	@param {Event.Facade} event An Event Facade object with the following specific property added:
				<dl>
					<dt>item</dt><dd>The list item excluded.</dd>
				</dl>
	@type {Event.Custom}
	**/

	/**
	@event itemIncluded
	@description Fires when an item is included back into the list.
	@param {Event.Facade} event An Event Facade object with the following specific property added:
				<dl>
					<dt>item</dt><dd>The list item included.</dd>
				</dl>
	@type {Event.Custom}
	**/

	_afterRender: function() {
		var host = this.get('host');

		host.each(function(child) {
			this._insertChangeExcludeLinks(host, child.get('contentBox'));
		}, this);
	},

	_afterChildAddOrUpdate: function(e) {
		var contentBox = e.child.get('contentBox');
		// Give default handler opportunity to execute
		Y.later(0, this, function() {
			this._insertChangeExcludeLinks(e.target, contentBox);
		});
	},

	_insertChangeExcludeLinks: function(host, contentBox) {
		var content = Y.substitute(
			'<ul class="separated">' +
			'<li><a href="#" class="action-change">{change}</a></li>' +
			'<li><a href="#" class="action-exclude">{exclude}</a><a href="#" class="action-include">{include}</a></li>' +
			'</ul>',
			{
				change: Locale.get('widget.repeatingList.action.change'),
				exclude: Locale.get('widget.repeatingList.action.exclude'),
				include: Locale.get('widget.repeatingList.action.include')
			});

		if (!contentBox.one('.separated')) {
			contentBox.appendChild(content, 'after');
		}

		host.triggerReflow();
	}
});

Y.namespace('OHP').ChangeExcludeListItemPlugin = ChangeExcludeListItemPlugin;


}, '7.9.0', {
    "requires": [
        "ohp-locale-translations",
        "ohp-locale-base",
        "arraylist",
        "substitute",
        "event-custom",
        "node-event-delegate",
        "event-base",
        "plugin",
        "oop",
        "yui-later",
        "node-base"
    ]
});
