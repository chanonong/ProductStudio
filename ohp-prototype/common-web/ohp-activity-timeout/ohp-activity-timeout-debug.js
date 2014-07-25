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
YUI.add('ohp-activity-timeout', function (Y, NAME) {

"use strict";
/**
Activity timeout module. It wires up all the submodules to provide automatic logout functionality.

@module ohp-activity-timeout
**/
var Lang = Y.Lang,
	win = Y.config.win,
	doc = Y.config.doc,

	ACTIVITY_TIMEOUT_ACTION_STORAGE_KEY = 'ohp-activity-timeout-action',
	activitySyncer = new Y.COW.ActivitySyncer(ACTIVITY_TIMEOUT_ACTION_STORAGE_KEY),

	DEFAULT_PING_INTERVAL = 60 * 1000, // 1 minute

	ACTION_DISPLAY_WARNING = 'displayWarning',
	ACTION_WARNING_DISMISSED = 'warningDismissed',
	ACTION_WARNING_TIMEOUT = 'warningTimeout',

	GLOBAL_SINGLETON_NS = YUI.namespace('OHP.ActivityTimeout'),

	ActivityTimeout,

	_ancestorFrameInstance;

function getInstanceOnAncestorFrame(currentWindow) {
	var curr = currentWindow || win,
		parentWindow = curr.parent,
		parentWindowNS;

	if (curr === curr.top) {
		return null;
	}

	if (!Lang.isUndefined(parentWindow.YUI)) {
		parentWindowNS = parentWindow.YUI.namespace('OHP.ActivityTimeout');
		if (parentWindowNS._instance) {
			return parentWindowNS._instance;
		}
	}

	return getInstanceOnAncestorFrame(parentWindow);
}

_ancestorFrameInstance = getInstanceOnAncestorFrame();

/**
The activity timeout class.

@class ActivityTimeout
@static
@namespace OHP
@extends Base
**/
ActivityTimeout = Y.Base.create('ohp-activity-timeout', Y.Base, [], {
	initializer: function( /*config*/ ) {
		this._eventSubscriptions = [];

		/**
		This event is fired when no activity is detected during the period of timeout time.
		This event is broadcasted to Y and Y.Global.

		@event ohp-activity-timeout:activityTimeout
		**/
		Y.publish('ohp-activity-timeout:activityTimeout', {
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

		// Use an instance of IO rather than Y.io for easier mocking in unit tests
		this._pingIo = new Y.IO();

		this._cleanCurrentAction();
	},

	destructor: function() {
		this._disableActivityTimeout();

		if (this._activityTimeoutDetector) {
			this._activityTimeoutDetector.destroy();
		}
		if (this._activityTimeoutWarningPanel) {
			this._activityTimeoutWarningPanel.destroy();
		}

		if (this._storageChangeEventListener) {
			activitySyncer.detachListener(this._storageChangeEventListener);
		}
	},

	/**
	Initialises the ActivityTimeout instance with the given configuration and starts the timers. If this instance has already been started
	or another instance exists on an ancestor frame then this method will do nothing.

	@method configureAndStart
	@param {Object} config the configuration to apply before starting
		@param {Function} config.logoutFn the function to execute when logging out due to timeout or user action
		@param {Number} [config.timeout] the time in milliseconds to wait before logging out due to inactivity (defaults to 600000 (10mins))
		@param {String} [config.pingUrl] the URL to ping (`GET`) to keep the session alive (if there is detected user activity)
		@param {Number} [config.pingInterval] the time to wait between pings in milliseconds (defaults to 60000 i.e. 1 minute)

	@return `true` if the ActivityTimeout was successfully configured and started, `false` otherwise.
	**/
	configureAndStart: function(config) {
		if (this._activityTimeoutEnabled || _ancestorFrameInstance) {
			return false;
		}

		this._activityTimeoutDetector = new Y.OHP.ActivityTimeout.Detector({
			timeout: config.timeout
		});
		this._activityTimeoutWarningPanel = new Y.OHP.ActivityTimeout.WarningPanel();

		this._set('logoutFn', config.logoutFn || function() {});

		if (config.pingUrl) {
			this._set('pingUrl', config.pingUrl);
		}
		if (config.pingInterval) {
			this._set('pingInterval', config.pingInterval);
		}

		this._enableActivityTimeout();

		return true;
	},

	/**
	Whether the system is in the process of logging out due to inactivity.

	@method isAutomaticallyLoggingOut
	@return `true` if the system is logging out due to user inactivity, `false` otherwise.
	**/
	isAutomaticallyLoggingOut: function() {
		if (_ancestorFrameInstance) {
			return _ancestorFrameInstance.isAutomaticallyLoggingOut();
		}
		return this.get('automaticallyLoggingOut');
	},

	_enableActivityTimeout: function() {
		this._activityTimeoutDetector.start();
		this._activityTimeoutWarningPanel.render();

		if (this.get('pingUrl')) {
			this._keepAliveTimer = Y.later(this.get('pingInterval'), this, this._onPingIntervalDoPing, [], true);
		}

		this._eventSubscriptions.push(
			Y.Global.on('ohp-activity-timeout:activityTimeout', this._onActivityTimeoutShowWarningPanel, this),
			Y.Global.on('ohp-activity-timeout:warningTimeout', this._onWarningTimeoutInitiateLogout, this),
			Y.Global.on('ohp-activity-timeout:warningDismissed', this._onWarningDismissedCommunicateDismiss, this)
		);

		this._storageChangeEventListener = Y.bind(this._actionStorageChangeHandler, this);
		activitySyncer.attachListener(this._storageChangeEventListener);

		this._activityTimeoutEnabled = true;
	},

	_onPingIntervalDoPing: function() {
		this._pingIo.send(this.get('pingUrl'));
	},

	_onActivityTimeoutShowWarningPanel: function() {
		this._initiateAction(ACTION_DISPLAY_WARNING);
		this._activityTimeoutWarningPanel.show();
	},

	_onWarningTimeoutInitiateLogout: function() {
		this._initiateAction(ACTION_WARNING_TIMEOUT);
		this._performLogout();
	},

	_onWarningDismissedCommunicateDismiss: function() {
		this._initiateAction(ACTION_WARNING_DISMISSED);
	},

	_actionStorageChangeHandler: function(event) {
		var action = event.value;

		if (action === ACTION_DISPLAY_WARNING) {
			Y.fire('ohp-activity-timeout:activityTimeout');
		} else if (action === ACTION_WARNING_DISMISSED) {
			this._activityTimeoutWarningPanel.dismiss();

		// Prevent triggering logout multiple times (specifically on IE 8 where the LocalStorage change event is vague)
		} else if (action === ACTION_WARNING_TIMEOUT && !this.get('automaticallyLoggingOut')) {
			Y.fire('ohp-activity-timeout:warningTimeout');
		}
	},

	_initiateAction: function(action) {
		var currentAction = activitySyncer.get();
		if (currentAction !== action) {
			activitySyncer.broadcast(action);

			Y.later(1000, this, this._cleanCurrentAction);
		}
	},

	_cleanCurrentAction: function() {
		activitySyncer.clear();
	},

	_performLogout: function() {
		if (this.get('automaticallyLoggingOut')) {
			// Prevent triggering logout multiple times (specifically on IE 8 where the LocalStorage change event is vague)
			return;
		}

		this._set('automaticallyLoggingOut', true);
		this._cancelKeepAliveTimer();
		this.get('logoutFn')();
	},

	_cancelKeepAliveTimer: function() {
		if (this._keepAliveTimer) {
			this._keepAliveTimer.cancel();
		}
	},

	_disableActivityTimeout: function() {
		Y.Array.invoke(this._eventSubscriptions, 'detach');

		this._activityTimeoutDetector.stop();
		this._activityTimeoutWarningPanel.hide();
		this._cancelKeepAliveTimer();
		this._activityTimeoutEnabled = false;
	}
}, {
	ATTRS: {
		/**
		The URL to be used to ping server to keep session alive.

		@config pingUrl
		@type String
		@readOnly readOnly
		**/
		pingUrl: {
			readOnly: true
		},

		/**
		The interval of pinging server to keep session alive.

		@config pingInterval
		@default 60000 milliseconds(1 mins)
		@type Number
		@readOnly readOnly
		**/
		pingInterval: {
			value: DEFAULT_PING_INTERVAL,
			readOnly: true
		},

		/**
		The function to be called when warning panel times out to perform logout action.

		@config logoutFn
		@type Function
		@readOnly readOnly
		**/
		logoutFn: {
			readOnly: true
		},

		/**
		Whether the system is in the process of logging out due to inactivity.

		@config automaticallyLoggingOut
		@type Boolean
		@default false
		@readOnly readOnly
		**/
		automaticallyLoggingOut: {
			readOnly: true,
			value: false
		}
	}
});

if (!GLOBAL_SINGLETON_NS._instance) {
	GLOBAL_SINGLETON_NS._instance = new ActivityTimeout();
}

Y.namespace('OHP').ActivityTimeout = Y.mix(GLOBAL_SINGLETON_NS._instance, Y.namespace('OHP.ActivityTimeout'));


}, '7.9.0', {
    "requires": [
        "base",
        "node-base",
        "event-base",
        "event-custom",
        "yui-later",
        "array-invoke",
        "io-base",
        "ohp-activity-timeout-detector",
        "ohp-activity-timeout-warning-panel",
        "ohp-activity-tracker",
        "cow-activity-syncer"
    ]
});
