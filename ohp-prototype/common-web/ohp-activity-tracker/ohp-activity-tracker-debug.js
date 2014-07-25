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
YUI.add('ohp-activity-tracker', function (Y, NAME) {

"use strict";
/**
Activity tracker. It detects configured user activities on the page and fires activityDetected
events to notify other modules that are interested.

@module ohp-activity-tracker
**/
var ActivityTracker,

	OHP = Y.namespace('OHP'),
	GlobalNS = YUI.namespace('OHP.ActivityTracker'),

	ACTIVITY_STORAGE_KEY = 'ohp-activity-tracker-timestamp',
	DEFAULT_ACTIVITY_THROTTLE_TIME = 2000, //millisecond

	activitySyncer = new Y.COW.ActivitySyncer(ACTIVITY_STORAGE_KEY);

Y.mix(GlobalNS, {
	/*
	The key used in LocalStorage to store the timestamp for activities.

	@property ACTIVITY_STORAGE_KEY
	@type String
	@static
	*/
	ACTIVITY_STORAGE_KEY: ACTIVITY_STORAGE_KEY,

	/*
	Number of milliseconds to throttle the registering of activity (exposed for unit testing purposes).

	@property _ACTIVITY_THROTTLE_TIME
	@default 2000
	@type Number
	@protected
	*/
	_ACTIVITY_THROTTLE_TIME: DEFAULT_ACTIVITY_THROTTLE_TIME
});

/**
@class ActivityTracker
@static
@namespace OHP
@extends Base
**/
ActivityTracker = Y.Base.create('ohp-activity-tracker', Y.Base, [], {
	initializer: function( /*config*/ ) {
		this._trackingEventSubscriptions = [];
		this._publishedEvents = [
			/**
			The event is fired when any registered activity is detected.
			This event is broadcasted to Y and Y.Global.

			@event activityDetected
			**/
			this.publish('activityDetected', {
				broadcast: 2
			})
		];

		this._warningTimeoutHandler = Y.Global.on('ohp-activity-timeout:warningTimeout', this._deleteActivityStorageKey, this);

		this._startTracking();
	},

	destructor: function() {
		this._stopTracking();

		Y.Array.invoke(this._publishedEvents, 'detach');

		if (this._warningTimeoutHandler) {
			this._warningTimeoutHandler.detach();
		}
	},

	_startTracking: function() {
		var docBody = Y.one(Y.config.doc.body);

		this._doLogActivity({
			type: 'ohp-activity-tracker:init'
		});

		this._logActivity = Y.throttle(Y.bind(this._doLogActivity, this), GlobalNS._ACTIVITY_THROTTLE_TIME);

		this._trackingEventSubscriptions.push(docBody.on('keydown', this._logActivity));
		this._trackingEventSubscriptions.push(docBody.on('mousemove', this._logActivity));
		this._trackingEventSubscriptions.push(docBody.on('touchstart', this._logActivity));
		this._trackingEventSubscriptions.push(Y.on('mousewheel', this._logActivity));
	},

	_stopTracking: function() {
		Y.Array.invoke(this._trackingEventSubscriptions, 'detach');
	},

	/**
	Manually register some user activity for situations where that activity cannot be detected via standard dom events (e.g. inside YUI's
	Rich Text Editor which uses an iframe internally).

	@method registerActivity
	@param {String} [activityType] the event type or a description of the type of activity that occured; defaults to "registeredActivity".
	**/
	registerActivity: function(activityType) {
		this._logActivity({
			type: activityType || 'registeredActivity'
		});
	},

	_doLogActivity: function(event) {
		var timestamp = new Date().valueOf(),
			payload = {
				timestamp: timestamp,
				activity: event.type,
				url: Y.config.win.location.href
			};

		//Setting timestamp to LocalStorage fires events across windows
		activitySyncer.broadcast(payload);
		// ohp-activity-tracker:activityDetected is fired locally and broadcasted across YUI sandboxes
		this.fire('activityDetected', payload);
	},

	_deleteActivityStorageKey: function() {
		activitySyncer.clear();
	}
});

if (GlobalNS._instance) {
	OHP.ActivityTracker = GlobalNS._instance;
} else {
	OHP.ActivityTracker = new ActivityTracker();
	GlobalNS._instance = OHP.ActivityTracker;
}


}, '7.9.0', {
    "requires": [
        "base",
        "node-base",
        "event-base",
        "event-custom",
        "event-touch",
        "event-mousewheel",
        "yui-throttle",
        "json-stringify",
        "array-invoke",
        "cow-activity-syncer"
    ]
});
