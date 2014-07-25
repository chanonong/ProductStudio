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
YUI.add('yui2-legacy-eventmanager', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!
 * EventManager.js
 * by Keith Gaughan
 *
 * This allows event handlers to be registered unobtrusively, and cleans
 * them up on unload to prevent memory leaks.
 *
 * Copyright (c) Keith Gaughan, 2005.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Common Public License v1.0
 * (CPL) which accompanies this distribution, and is available at
 * http://www.opensource.org/licenses/cpl.php
 *
 * This software is covered by a modified version of the Common Public License
 * (CPL), where Keith Gaughan is the Agreement Steward, and the licensing
 * agreement is covered by the laws of the Republic of Ireland.
 *
 * This software has been modified and extended by Orchestral Developments
 * Limited.
 */

/**
 * Static methods for dealing with events. Methods that take an event argument
 * will automatically resolve the event on the window object for Internet
 * Explorer browsers (see http://www.quirksmode.org/js/events_access.html).
 * @module legacy-eventmanager
 */
window.EventManager = {
	/** @private */
	eventHandlers: null,

	/** @private */
	init: function()
	{
		if( this.eventHandlers == null ) {
			this.eventHandlers = [];

			// Register a cleanup handler to execute on page unload.
			EventManager.addEventHandler( window, "unload", this.cleanup );
		}
	},

	/**
	 * Registers an event handler on an object.
	 * @param obj the object to register the handler with
	 * @param type the name of the event to register the handler for
	 * @param fn the event handling function
	 * @return <code>true</code> if the event handler was successfully registered,
	 * otherwise <code>false</code>
	 * @type Boolean
	 */
	addEventHandler: function( obj, type, fn )
	{
		this.init();

		if( obj.addEventListener ) {
			this.eventHandlers.push( { obj: obj, type: type, fn: fn } );
			obj.addEventListener( type, fn, false );
			return true;
		} else if( obj.attachEvent && obj.attachEvent( "on" + type, fn ) ) {
			// The Array.push() method cannot be used here because it is not supported
			// by Internet Explorer 5.0
			this.eventHandlers[this.eventHandlers.length] = { obj: obj, type: type, fn: fn };
			return true;
		}
		return false;
	},

	/**
	 * Cleans up all the registered event handlers. This prevents memory leaks
	 * in browsers.
	 * @private
	 */
	cleanup: function()
	{
		for( var i = 0; i < EventManager.eventHandlers.length; i++ )
		{
			with( EventManager.eventHandlers[i] )
			{
				if( obj.removeEventListener ) {
					obj.removeEventListener( type, fn, false );
				} else if( obj.detachEvent ) {
					obj.detachEvent( "on" + type, fn );
				}
			}
		}

		// Kill off the registry itself to get rid of the last remaining references.
		EventManager.eventHandlers = null;
	},

	/**
	 * Gets the element that triggered the given event. This will not neccessarily
	 * be the element your event handler was registered with.
	 * @param e the event to find the triggering element for
	 * @return the element that triggered the given event
	 */
	getEventTarget: function( e )
	{
		e = e || window.event;
		return e.target || e.srcElement;
	},

	/**
	 * @param e the event to check for an enter key press
	 * @return whether the given event was an enter key press
	 */
	isEnterKeyPress: function( e )
	{
		e = e || window.event;
		return e.keyCode == 13;
	},

	/**
	 * @param e the event to check for an escape key press
	 * @return whether the given event was an escape key press
	 */
	isEscapeKeyPress: function( e )
	{
		e = e || window.event;
		return e.keyCode == 27;
	},

	/**
	 * Cancels the given event from bubbling.
	 * @param e the event to cancel bubbling
	 */
	cancelBubble: function( e )
	{
		e = e || window.event;
		e.cancelBubble = true;
		if( e.stopPropagation ) {
			e.stopPropagation();
		}
	},

	/**
	 * Cancels the default action for the given event from triggering.
	 * @param e the event to cancel the default action from triggering
	 */
	cancelDefaultAction: function( e )
	{
		e = e || window.event;
		e.returnValue = false;
		if( e.preventDefault ) {
			e.preventDefault();
		}
	}
};


}, '7.9.0');
