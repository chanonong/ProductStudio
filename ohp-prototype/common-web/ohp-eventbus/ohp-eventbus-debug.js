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
YUI.add('ohp-eventbus', function (Y, NAME) {

/**
 * Provides an EventBus to allow a frame to publish namespaced events across multiple frames
 * This is controlled by a Master Frame in the hierarchy, if you include the EventBus module in your page
 * and now Master Frame is found that page will become the master and will act as the channel for any child frames
 * This does not work across multiple domains, the master and the children must all be on the same domain.
 * @module ohp-eventbus
 * @title EventBus
 */

var win = Y.config.win,

	FrameTarget,
	Publisher,

	master,
	frameTarget,
	publisher;

// convenience function for logging
function log(message) {
	Y.log(message, 'info', 'ohp-eventbus');
}

/* getMaster walks up the parent frames until it finds a parent set as the master
 * it will only go up 10 levels, and after that returns null
 */
function getMaster(parentWin) {
	Y.log('parent passed :: ' + parentWin.location);
	Y.log(parentWin.master);

	if (parentWin.master == true) {
		return parentWin;
	}

	if (parentWin === win.top) {
		log('could not find an existing master event bus, I am in ' + win.location);
		return null;
	}

	return getMaster(parentWin.parent);
}
master = getMaster(win.parent);

/**
 * @class EventBus
 * @namespace OHP
 * @constructor EventBus
 */
function EventBus() {
	var _frames = [];

	function getFrames() {
		var validFrames = [],
			frame,
			i;

		for (i = _frames.length - 1; i >= 0; i -= 1) {
			try {
				frame = _frames[i];
				if (frame && frame.location) {
					validFrames.push(frame);
				}
			} catch (e) {
				Y.log('An invalid frame is ignored', 'warn', 'ohp-eventbus');
			}
		}

		_frames = validFrames;

		return validFrames;
	}

	return {
		add: function(frame) {
			log('add ' + frame.location + ' to stack');
			log(frame);
			log(win.master);
			_frames.push(frame);
		},

		remove: function(frame) {
			var frameset = [],
				currentValidFrames = getFrames(),
				i;

			for (i = 0; i < currentValidFrames.length; i += 1) {
				if (currentValidFrames[i].location.href !== frame.location.href) {
					frameset.push(currentValidFrames[i]);
				}
			}

			_frames = frameset;
		},

		/**
		 * Sends a message to the EventBus to then publish as an event
		 * @method send
		 * @param namespace    {string}   The namespace the event will be published in
		 * @param event   {string}  The name of the event that will be published
		 * @param payload {object} optional data that will be published with the event.
		 */
		send: function(eventNS, eventName, payload) {
			log('sending ' + eventNS + ' : ' + eventName);
			log(_frames.length);
			log(payload);

			var currentValidFrames = getFrames(),
				i;

			for (i = currentValidFrames.length - 1; i >= 0; i -= 1) {
				log('pushing to frame ' + currentValidFrames[i].location);
				currentValidFrames[i].receive(eventNS, eventName, payload);
			}
		},

		query: function() {
			return getFrames().length;
		}
	};
}

FrameTarget = Y.Base.create('ohp-eventbus', Y.EventTarget, [], {
	initializer: function() {
		log('Host constructor executed.');
	},

	send: function(namespace, eventname, payload) {
		log('The FrameTaget(also known as the Public EventBus) send method');
		master.eventBus.send(namespace, eventname, payload);
	}
});

Publisher = Y.Base.create('ohp-eventbus-publisher', Y.EventTarget, [], {
	addEvent: function(eventName, namespace) {
		if (namespace === null) {
			namespace = 'master';
		}
		this.publish(namespace + ':' + eventName, {
			emitFacade: true
		});
	}
});

frameTarget = new FrameTarget();
publisher = new Publisher();
publisher.addTarget(frameTarget);

win.receive = function(eventNS, eventName, data) {
	log('receive ' + eventNS + ' : ' + eventName);
	publisher.addEvent(eventName, eventNS);
	publisher.fire(eventNS + ':' + eventName, {
		payload: data
	});
};

if (master === null) {
	win.eventBus = new EventBus();
	win.eventBus.add(win);
	win.master = true;
	win.master.eventBus = win.eventBus;
	master = win;
} else {
	win.master = master;
	win.master.eventBus.add(win);
}

Y.on('unload', function() {
	master.eventBus.remove(win);
}, Y.config.win);

Y.namespace('OHP').EventBus = frameTarget;

/**
 * Subscribe to a custom event hosted by the EventBus
 * @method on
 * @param type    {string}   The type of the event
 * @param fn {Function} The callback with parameter with the property of payload that represents the data passed in.
 * @param context {object} optional execution context.
 * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
 * @return the event target or a detach handle per 'chain' config
 */


}, '7.9.0', {"requires": ["base", "event-custom"]});
