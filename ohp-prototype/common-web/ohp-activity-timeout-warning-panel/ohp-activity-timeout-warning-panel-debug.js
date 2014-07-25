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
YUI.add('ohp-activity-timeout-warning-panel', function (Y, NAME) {

"use strict";
/**
Activity timeout warning panel is a panel informing user that inactivity is detected
and an automatic logout will happen in 20 seconds if not dismissed.

@module ohp-activity-timeout-warning-panel
**/
var Locale = Y.OHP.Locale,
	getClassName = Y.OHP.OhpClassNameManager.getClassName,

	DEFAULT_WARNING_COUNT_DOWN = 20 * 1000, // 20 seconds
	PANEL_BODY_CONTENT = '<div>' +
							Locale.get('cow.activityTimeout.warningPanel.message.inactivityDetected') +
						'</div>' +
						'<div class="cow-activity-timeout-warning-countdown" ' +
							'role="timer" ' +
							'aria-live="polite" ' +
							'aria-atomic="true" ' +
							'aria-relevant="all">' +
						'</div>',

	WarningPanel;

/**
The activity timeout warning panel.

@class WarningPanel
@namespace OHP.ActivityTimeout
@extends Y.Panel
**/
WarningPanel = Y.Base.create('ohp-activity-timeout-warning-panel', Y.Panel, [], {
	initializer: function( /*config*/ ) {
		this._eventSubscriptions = [];

		/**
		This event is fired when the user dismisses the activity timeout warning panel.
		This event is broadcasted to Y and Y.Global.

		@event ohp-activity-timeout:warningDismissed
		**/
		Y.publish('ohp-activity-timeout:warningDismissed', {
			broadcast: 2
		});

		/**
		This event is fired when the countdown on the warning panel reaches 0 and an automatic logout is triggered.
		This event is broadcasted to Y and Y.Global.

		@event ohp-activity-timeout:warningTimeout
		**/
		Y.publish('ohp-activity-timeout:warningTimeout', {
			broadcast: 2
		});
	},

	destructor: function() {
		this._cancelWarningTimer();
		Y.Array.invoke(this._eventSubscriptions, 'detach');
	},

	bindUI: function() {
		this._eventSubscriptions.push(
			this.after('visibleChange', this._afterVisibleChange, this),
			Y.on('windowresize', function() {
				this.centered();
			}, this)
		);
	},

	/**
	Closes the warning panel and broadcasts the "ohp-activity-timeout:warningDismissed" event.

	@method dismiss
	**/
	dismiss: function() {
		if (this.get('visible')) {
			Y.fire('ohp-activity-timeout:warningDismissed');
			this.hide();
		}
	},

	_cancelWarningTimer: function() {
		if (this._warningTimeoutTimer) {
			this._warningTimeoutTimer.cancel();
			this._warningTimeoutTimer = null;
		}
	},

	_afterVisibleChange: function(event) {
		var visible = event.newVal,
			countdown,
			countdownNode;

		if (!visible) {
			// On hide cancel the countdown
			this._cancelWarningTimer();
			return;
		}

		this.centered();

		countdown = Y.OHP.ActivityTimeout.WarningPanel._WARNING_COUNT_DOWN_TIME / 1000;
		countdownNode = this.get('contentBox').one('.cow-activity-timeout-warning-countdown');

		countdownNode.set('text', countdown);

		this._warningTimeoutTimer = Y.later(1000, this, function() {
			countdown -= 1;

			if (countdown === 0) {
				this._cancelWarningTimer();
				Y.fire('ohp-activity-timeout:warningTimeout');
			}

			countdownNode.set('text', countdown);
		}, [], true);
	}
}, {
	ATTRS: {
		// Override default values from Y.Panel

		headerContent: {
			value: Locale.get('cow.activityTimeout.warningPanel.heading.automaticLogout')
		},
		bodyContent: {
			value: PANEL_BODY_CONTENT
		},
		modal: {
			value: true
		},
		visible: {
			value: false
		},
		// 2 more digits than the hightest z-index found in other places,
		// which is 999999 for popover. The max supported value is 2147483647.
		zIndex: {
			value: 99999999
		},
		buttons: {
			value: [{
				name: 'dismiss',
				label: Locale.get('cow.activityTimeout.warningPanel.action.dismiss'),
				isDefault: true,
				action: 'dismiss'
			}]
		}
	},

	CSS_PREFIX: getClassName('activity', 'timeout', 'warning', 'panel'),

	/**
	Number of milliseconds to display the warning dialog before automatically logging the user out (exposed for unit testing purposes).

	@property _WARNING_COUNT_DOWN_TIME
	@default 20000 (20s)
	@type Number
	@protected
	**/
	_WARNING_COUNT_DOWN_TIME: DEFAULT_WARNING_COUNT_DOWN
});

Y.namespace('OHP.ActivityTimeout').WarningPanel = WarningPanel;


}, '7.9.0', {
    "requires": [
        "base",
        "node-base",
        "event-base",
        "event-custom",
        "event-resize",
        "panel",
        "ohp-locale-translations",
        "ohp-locale-base",
        "ohp-ohp-class-name-manager"
    ],
    "skinnable": true
});
