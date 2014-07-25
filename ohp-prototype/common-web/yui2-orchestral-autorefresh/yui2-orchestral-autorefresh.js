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
YUI.add('yui2-orchestral-autorefresh', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/
YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget that auto-refreshes information.
 *
 * @module orchestral-autorefresh
 * @requires yahoo, element, orchestral, orchestral-locale, orchestral-datetime
 * @namespace ORCHESTRAL.widget
 * @title AutoRefresh
 */
(function() {
	var lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event;

	/**
	 * A widget that auto-refreshes information.
	 *
	 * @class AutoRefresh
	 * @namespace ORCHESTRAL.widget
	 * @extends YAHOO.util.Element
	 * @constructor
	 * @param el {HTMLElement | String} Container element to display the last refreshed time and manual refresh button.
	 * @param refreshedEl {HTMLElement | String} DOM reference to the element whose information will be refreshed.
	 * @param refreshInterval {Number} The interval to auto-refresh (in seconds).
	 * @param updateHandler {Function} The handler for peforming the refresh of the information.
	 * @param scope {Object} The scope that the update handler will be executed in the context of.
	 */
	var AutoRefresh = function(el, refreshedEl, refreshInterval, updateHandler, scope) {
		this._refreshInterval = refreshInterval;
		this._updateHandler = updateHandler;
		this._scope = scope;

		AutoRefresh.superclass.constructor.call(this, el);

		// The user is currently interacting with the area that will be refreshed so any refresh that may trigger within a small
		// period of time will be delayed to avoid springing any suprising UI behaviour on the user.
		Event.on(refreshedEl, 'click', this._registerActivity, null, this);
		Event.on(refreshedEl, 'mousemove', this._registerActivity, null, this);
		this._refreshTimer = lang.later(this._refreshInterval * 1000, this, this._triggerRefresh);
	};

	lang.extend(AutoRefresh, YAHOO.util.Element, {
		/**
		 * Whether auto-refresh activity is paused.
		 *
		 * @type Boolean
		 * @private
		 */
		_paused: false,

		/**
		 * The timer for tracking recent user activity. If this is null then
		 * no recent user activity has occurred with the element that displays
		 * the auto-refreshed information.
		 *
		 * @type Object
		 * @private
		 */
		_recentActivityTimer: null,

		/**
		 * The interval the information should be refreshed at (in seconds).
		 *
		 * @type Number
		 * @private
		 */
		_refreshInterval: null,

		/**
		 * The timer for tracking when a refresh of the information should be performed.
		 *
		 * @type Object
		 * @private
		 */
		_refreshTimer: null,

		/**
		 * The scope that the update handler is to be executed in the context of.
		 *
		 * @type Object
		 * @private
		 */
		_scope: null,

		/**
		 * The handler to use to execute a refresh.
		 *
		 * @type Function
		 * @private
		 */
		_updateHandler: null,

		/**
		 * Registers user activity.
		 *
		 * @private
		 */
		_registerActivity: function() {
			if (this._recentActivityTimer) {
				this._recentActivityTimer.cancel();
			}
			this._recentActivityTimer = lang.later(5000, this, function() {
				this._recentActivityTimer = null;
			});
		},

		/**
		 * Handles triggering refreshes.
		 *
		 * @private
		 */
		_triggerRefresh: function() {
			if (this._paused || this._recentActivityTimer) {
				this._refreshTimer = lang.later(1000, this, this._triggerRefresh);
			} else {
				this._updateHandler.call(this._scope);
			}
		},

		/**
		 * Pauses auto-refreshing. This is for use when a lightbox or pop-over is opened
		 * from the element that displays the auto-refreshed information.
		 */
		pause: function() {
			this._paused = true;
		},

		/**
		 * Unpauses auto-refreshing. This is for use when a lightbox or pop-over opened
		 * from the element that displays the auto-refreshed information is closed.
		 */
		unpause: function() {
			this._paused = false;
		},

		/**
		 * Updates the last refreshed message on the widget and schedules the next auto-refresh. This is to be
		 * called when refreshing the information on receipt of the updated data from the server.
		 */
		updateMessage: function() {
			if (this.hasChildNodes()) {
				this._refreshTimer.cancel();
			} else {
				this.addClass('label');
				this.addClass('last-refreshed');

				var refreshLink = document.createElement('a');
				refreshLink.href = '#';
				Dom.addClass(refreshLink, 'refresh-link');

				this.appendChild(document.createTextNode(''));
				this.appendChild(refreshLink);

				Event.on(refreshLink, 'click', function(e) {
					this._updateHandler.call(this._scope);
					Event.preventDefault(e);
				}, null, this);
			}

			this.get('element').firstChild.nodeValue = lang.substitute(ORCHESTRAL.util.Locale.get('widget.autorefresh.lastRefreshed'), [ORCHESTRAL.util.DateFormat.SHORT_TIME.format(new Date())]) + ' ';
			this._refreshTimer = lang.later(this._refreshInterval * 1000, this, this._triggerRefresh);
		}
	});

	ORCHESTRAL.widget.AutoRefresh = AutoRefresh;
})();

YAHOO.register('orchestral-autorefresh', ORCHESTRAL.widget.AutoRefresh, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui2-element",
        "yui2-orchestral",
        "ohp-locale-translations",
        "yui2-orchestral-datetime"
    ]
});
