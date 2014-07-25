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
YUI.add('cow-activity-syncer', function (Y, NAME) {

"use strict";
var win = Y.config.win,
	doc = Y.config.doc,

	LocalStorageNoOp = {
		setItem: function( /* key, value */ ) {},
		removeItem: function( /* key */ ) {},
		getItem: function( /* key */ ) {
			return null;
		}
	},
	LocStorage = Y.config.win.Modernizr.localstorage ? Y.config.win.localStorage : LocalStorageNoOp,

	ActivitySyncer;

function _addStorageChangeEventListener(eventListener) {
	if (win.addEventListener) {
		// addEventListener is only available in IE9+ and other modern browsers.
		win.addEventListener('storage', eventListener, false);
	} else if (doc.attachEvent) {
		// IE8 uses attachEvent, and the onstorage event is on document instead of window.
		doc.attachEvent('onstorage', eventListener);
	}
}

function _removeStorageChangeEventListener(eventListener) {
	if (win.removeEventListener) {
		// removeEventListener is only available in IE9+ and other modern browsers.
		win.removeEventListener('storage', eventListener, false);
	} else if (doc.detachEvent) {
		// IE8 uses detachEvent, and the onstorage event is on document instead of window.
		doc.detachEvent('onstorage', eventListener);
	}
}

/**
@class ActivitySyncer
@constructor
@namespace COW
@param storageKey The key used to store value in the LocalStorage
**/
ActivitySyncer = function(storageKey) {
	this._storageKey = storageKey;
	this._listeners = {};
	this._lastModifiedTime = null;
};

/*
Broadcast an activity to all other windows from the same domain.

@method broadcast
@param {String} [payload] The payload object is accessible for all windows via the attached listeners.
*/
ActivitySyncer.prototype.broadcast = function(payload) {
	var wrappedValue = {
		payload: payload || {},
		timestamp: Y.Lang.now()
	};
	LocStorage.setItem(this._storageKey, Y.JSON.stringify(wrappedValue));
};

/*
Get the current activity payload data.

@method get
@return {Object} The current activity payload data.
*/
ActivitySyncer.prototype.get = function() {
	var wrappedValue = this._getWrappedValue();
	return wrappedValue && wrappedValue.payload;
};

ActivitySyncer.prototype._getWrappedValue = function() {
	return Y.JSON.parse(LocStorage.getItem(this._storageKey));
};

/*
Clear the activity data from LocalStorage

@method clear
*/
ActivitySyncer.prototype.clear = function() {
	LocStorage.removeItem(this._storageKey);
};

/*
Attach an event listener that gets called when an activity is broadcast.

@method attachListener
@param {Function} [eventListener] The event listener of broadcast activity
	@param {Object} [event] A custom event facade
		@param {StorageEvent} [originalEvent] The original StorageEvent
		@param {String} [key] The key of the changed item in LocalStorage
		@param {Object} [value] The latest value of the changed item in LocalStorage
@param {Object} [context] the execution context of the event listener
*/
ActivitySyncer.prototype.attachListener = function(eventListener, context) {
	var wrappedListener = Y.bind(function(evt) {
		var wrappedValue = this._getWrappedValue() || {},
			modifiedTime = wrappedValue.timestamp;

		if (modifiedTime && modifiedTime !== this._lastModifiedTime) {
			eventListener.call(context, {
				originalEvent: evt,
				key: this._storageKey,
				value: this.get()
			});

			this._lastModifiedTime = modifiedTime;
		}
	}, this);

	this._listeners[eventListener] = wrappedListener;
	_addStorageChangeEventListener(wrappedListener);
};

/*
Detach an event listener. The listener function must be the same with the one that is attached,
otherwise nothing will be detached.

@method
@param {Function} [eventListener] The event listener of broadcast activity
*/
ActivitySyncer.prototype.detachListener = function(eventListener) {
	_removeStorageChangeEventListener(this._listeners[eventListener]);
};

/*
Detach all event listeners.

@method
*/
ActivitySyncer.prototype.detachAllListeners = function() {
	for (var eventListener in this._listeners) {
		if (this._listeners.hasOwnProperty(eventListener)) {
			this.detachListener(eventListener);
		}
	}
};

Y.namespace('COW').ActivitySyncer = ActivitySyncer;


}, '7.9.0', {"requires": ["json-stringify", "json-parse"]});
