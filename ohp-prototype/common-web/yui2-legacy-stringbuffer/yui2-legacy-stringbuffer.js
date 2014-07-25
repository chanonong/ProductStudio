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
YUI.add('yui2-legacy-stringbuffer', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * Constructs a string buffer with no characters in it.
 * @module legacy-stringbuffer
 * @class A StringBuffer provides an efficient way of concatenating large
 * numbers of strings.
 * @constructor
 */
function StringBuffer() {
	/**
	 * @private
	 */
	this.s = new Array();

	/**
	 * Appends the strings in the arguments of this method to this string buffer.
	 * @param arguments the strings to append to this string buffer
	 * @type void
	 */
	this.append = function() {
		var args = this.append.arguments;
		for( var i = 0; i < args.length; i++ ) {
			this.s[this.s.length] = args[i]
		}
	};

	/**
	 * Converts to a string representing the data in this string buffer.
	 * @return a string representation of this string buffer
	 * @type String
	 */
	this.toString = function() {
		return this.s.join( "" );
	};
}
window.StringBuffer = StringBuffer;


}, '7.9.0');
