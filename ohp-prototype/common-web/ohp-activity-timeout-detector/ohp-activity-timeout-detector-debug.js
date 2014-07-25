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
YUI.add('ohp-activity-timeout-detector', function (Y, NAME) {

"use strict";
/**
Activity timeout detector. It listens to activity events fired from activity tracker, and fires timeout events
when configured timeout is reached.

@module ohp-activity-timeout-detector
**/
var Detector,
	win = Y.config.win,
	doc = Y.config.doc,

	activitySyncer = new Y.COW.ActivitySyncer(YUI.OHP.ActivityTracker.ACTIVITY_STORAGE_KEY),

	DEFAULT_ACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

Y.mix(Y.Node.DOM_EVENTS, {
	visibilitychange: true
});

/**
The activity timeout detector class.

@class Detector
@namespace OHP.ActivityTimeout
@extends Base
**/
Detector = Y.Base.create('ohp-activity-timeout-detector', Y.Base, [], {
	initializer: function( /*config*/ ) {
		this._detectorStarted = false;
		this._activityTimeoutOccurred = false;
		this._eventSubscriptions = [];

		/**
		This event is fired when no activity is detected during the period of timeout time.
		This event is broadcasted to Y and Y.Global.

		@event ohp-activity-timeout:activityTimeout
		**/
		Y.publish('ohp-activity-timeout:activityTimeout', {
			broadcast: 2
		});
	},

	destructor: function() {
		this.stop();
	},

	/**
	Start the timeout detection.

	@method start
	**/
	start: function() {
		if (this._detectorStarted) {
			return;
		}

		this._eventSubscriptions.push(
			Y.Global.on('ohp-activity-tracker:activityDetected', this._onActivityDetected, this),
			Y.Global.on('ohp-activity-timeout:warningDismissed', this._restartTimer, this),
			Y.one(doc).on('visibilitychange', this._onPageVisibilityChange, this)
		);

		this._storageChangeEventListener = Y.bind(this._onLocalStorageChange, this);

		activitySyncer.attachListener(this._storageChangeEventListener);

		this._startTimer();
		this._detectorStarted = true;
	},

	_startTimer: function() {
		this._activityTimeoutTimer = Y.later(this.get('timeout'), this, this._onTimeoutTimerExpiry);
	},

	_onTimeoutTimerExpiry: function() {
		this._activityTimeoutOccurred = true;
		Y.fire('ohp-activity-timeout:activityTimeout');
	},

	_cancelTimer: function() {
		this._activityTimeoutOccurred = false;

		if (this._activityTimeoutTimer) {
			this._activityTimeoutTimer.cancel();
		}
	},

	_restartTimer: function() {
		this._cancelTimer();
		this._startTimer();
	},

	_onActivityDetected: function() {
		// Ignore activity detected if a timeout has already occurred (i.e. the warning panel is displayed)
		if (!this._activityTimeoutOccurred) {
			this._restartTimer();
		}
	},

	_onLocalStorageChange: function() {
		if (this._activityTimeoutOccurred) {
			// Ignore activity detected if a timeout has already occurred (i.e. the warning panel is displayed)
			return;
		}

		this._restartTimer();
	},

	_onPageVisibilityChange: function() {
		// Get the current time and last activity time
		var currentTimestamp = Y.Lang.now(),
			activityData = activitySyncer.get(),
			timeout = this.get('timeout'),
			timestampDifference;

		if (!activityData) {
			Y.Global.fire('ohp-activity-timeout:warningTimeout');
			return;
		}

		timestampDifference = currentTimestamp - activityData.timestamp;

		if (timestampDifference >= timeout + Y.OHP.ActivityTimeout.WarningPanel._WARNING_COUNT_DOWN_TIME) {
			// The last activity occurred more than the timeout plus the countdown, fire logout event
			Y.Global.fire('ohp-activity-timeout:warningTimeout');
		} else if (timestampDifference > timeout + 1000) {
			// The last activity occurred more than the timeout plus 1 second fire the show warning event
			Y.fire('ohp-activity-timeout:activityTimeout');
		}
	},

	/**
	Stop the timeout detection.

	@method stop
	**/
	stop: function() {
		this._cancelTimer();

		Y.Array.invoke(this._eventSubscriptions, 'detach');

		if (this._storageChangeEventListener) {
			activitySyncer.detachListener(this._storageChangeEventListener);
		}

		this._detectorStarted = false;
	}
}, {
	ATTRS: {
		/**
		Timeout period if there is no activity detected.

		@config timeout
		@default 600000 milliseconds(10 mins)
		@type Number
		**/
		timeout: {
			value: DEFAULT_ACTIVITY_TIMEOUT,
			writeOnce: 'initOnly'
		}
	}
});

Y.namespace('OHP.ActivityTimeout').Detector = Detector;


}, '7.9.0', {
    "requires": [
        "base",
        "node-base",
        "event-base",
        "event-custom",
        "yui-later",
        "array-invoke",
        "ohp-activity-tracker",
        "json-parse",
        "cow-activity-syncer"
    ]
});
