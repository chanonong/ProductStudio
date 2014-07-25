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
YUI.add('yui2-legacy-window', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @fileoverview A library for opening and manipulating new browser
 * windows.
 * @module legacy-window
 */

window.Windows = {
	list: new Object(),
	polling: false,

	registerWindow: function(name, win) {
		Windows.list[name] = win;
		if (!Windows.polling) {
			setInterval(Windows.poll, 250);
			Windows.polling = true;
		}
	},

	poll: function() {
		for (key in Windows.list) {
			try {
				Windows.list[key].processResults();
				delete Windows.list[key];
			} catch (notReady) {}
		}
	}
};

/**
 * @class A Window is a wrapper for opening and manipulating new browser
 * windows.
 * <p>
 * When the opened window is ready to close and return data to the
 * opening window it must dynamically create a function in its global scope called
 * <code>getResults</code>. The framework will call the <code>getResults</code>
 * method, close the window, and call the result handler function passing the
 * result of the <code>getResults</code> method if the result is not
 * <code>null</code>. Nothing will happen if the window is closed by the user
 * using the browser close button.
 * <p>
 * The result handler will be run before the window is closed. If you want to
 * use the results object outside of the result handler you will need to create
 * a copy of the results object (including any of the internal structure you
 * will need). This is because Internet Explorer destroys any objects created by
 * a new window when it is closed. Any references that other windows have to
 * objects created by the new window will be deleted.
 * @param url the URL to open in a new window
 * @param resultHander a reference to a function that will be called when the
 * opened window is closed. This function must take a single argument.
 * @param width the width of the new window in pixels
 * @param height the height of the new window in pixels
 * @param name the name for the new window. A subsequent window opened with the
 * same name as an existing one be opened in the same window. This name cannot
 * contain any space characters. If no name is provided a default of 'Window' will
 * be used.
 * @param position an object literal with two properties, top and left which
 * are the distance in pixels from the top and left of the top left corner of
 * the screen for the window to be placed. This argument is optional.
 * @constructor
 */
function Window(url, resultHandler, width, height, name, position) {
	/** @private */
	this.resultHandler = resultHandler;
	/** @private */
	this.cancelHandler;
	/** @private */
	this.name = typeof name != "undefined" ? name : "Window";
	/** @private */
	this.features = "height=" + height + ",width=" + width + ",resizable=yes,scrollbars=yes";
	/** @private */
	this.position = position;

	if (position) {
		this.features += ",top=" + position.top + ",left=" + position.left;
	}

	/**
	 * Opens the window using the detail supplied in the constructor.
	 */
	this.open = function() {
		/** @private */
		this.handle = window.open(url, this.name, this.features);
		this.handle.focus();

		// If there already was a window with the same name opened it doesn't
		// get repositioned by the browser so we do it ourselves.
		if (position) {
			this.handle.moveTo(position.left, position.top);
		}

		Windows.registerWindow(this.name, this);
	};

	/**
	 * Returns a DOM reference to the opened window. This will be undefined
	 * if called before the open method.
	 * @return the opened window
	 */
	this.getWindow = function() {
		return this.handle;
	};

	/**
	 * Sets the cancel handler that will be run when the user closes the
	 * window using the close button or the <code>getResults</code> method
	 * returns <code>null</code>.
	 * @param fn the cancel handler to run
	 */
	this.setCancelHandler = function(fn) {
		this.cancelHandler = fn;
	};

	/**
	 * Closes the window.
	 */
	this.close = function() {
		if (this.handle != null && !this.handle.closed) {
			this.handle.close();
		}
	};

	/**
	 * Attempts to run the result handler registered for this window by calling
	 * a method called <code>getResults</code> in the opened window. This will
	 * throw an exception if the window has not yet been closed or the
	 * <code>getResults</code> method does not exist yet in the opened window.
	 * @private
	 */
	this.processResults = function() {
		if (this.handle.closed) {
			// The window has been closed.
			if (this.cancelHandler != null) {
				this.cancelHandler();
			}
			return;
		}

		// Make a copy of results to return to the resultHandler. The original
		// results cannot be used as it might get destroyed by some browsers
		// when the window closes.
		var results = this.handle.getResults();

		// We have successfully got our results; so bring the opening window
		// into focus.
		window.focus();

		// If results is null, then we consider the user has cancelled the
		// operation performed in the window.
		if (results != null) {
			try {
				this.resultHandler(results);
			} catch (e) {
				alert("An error was thrown from the result handler of the window opened at " + url);
			}
		} else if (this.cancelHandler != null) {
			try {
				this.cancelHandler();
			} catch (e) {
				alert("An error was thrown from the cancel handler of the window opened at " + url);
			}
		}

		// The window is closed once the results have been handled. We do this here
		// because any non-primitive JavaScript objects returned from the opened
		// window are destroyed by Internet Explorer when the opened window gets
		// closed.
		this.handle.close();
	};
}
window.Window = Window;


}, '7.9.0');
