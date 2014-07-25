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
YUI.add('yui2-legacy-urlencoder', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @class The UrlEncoder class provides static methods for URL encoding and decoding.
 * @module legacy-urlencoder
 * @requires legacy-stringbuffer
 * @deprecated in favour of UrlEncoder in CoreHttp.js
 */
function UrlEncoder() {}
window.UrlEncoder = UrlEncoder;

/**
 * @private
 */
UrlEncoder.hex = "0123456789ABCDEF";

/**
 * @private
 */
UrlEncoder.escapeChars = new Array( 256 );
for( var i = 0; i < 16; i++ ) {
	for( var j = 0; j < 16; j++ ) {
		UrlEncoder.escapeChars[i * 16 + j] = "%" + UrlEncoder.hex.charAt( i ) + UrlEncoder.hex.charAt( j );
	}
}

/**
 * URL encodes a string.
 * @param s the string to URL encode
 * @return the URL encoded string
 * @type String
 */
UrlEncoder.encode = function( s ) {
	if( s == null ) return s;
	s = "" + s;
	var buf = new StringBuffer();
	var len = s.length;
	for( var i = 0; i < len; i++ ) {
		var c = s.charCodeAt( i );
		if( ( c >= 0x61 && c <= 0x7A ) || ( c >= 0x41 && c <= 0x5A ) || ( c >= 0x30 && c <= 0x39 ) || c == 0x5F || c == 0x2E ) {
			// If c represents an alphanumeric, underscore, or period character then we don't need to encode it.
			buf.append( s.charAt( i ) );
		} else if( c == 0x20 ) {
			buf.append( "+" );
		} else if( c <= 0x7F ) {
			buf.append( UrlEncoder.escapeChars[c] );
		} else if( c <= 0x07FF ) {
			buf.append( UrlEncoder.escapeChars[0xC0 | (c >> 6)], UrlEncoder.escapeChars[0x80 | (c & 0x3F)] );
		} else {
			buf.append( UrlEncoder.escapeChars[0xE0 | (c >> 12)], UrlEncoder.escapeChars[0x80 | ((c >> 6) & 0x3F)], UrlEncoder.escapeChars[0x80 | (c & 0x3F)] );
		}
	}
	return buf.toString();
};

/**
 * URL decodes a string.
 * @param s the string to URL decode
 * @return the URL decoded string
 * @type String
 */
UrlEncoder.decode = function( s ) {
	if( s == null ) return s;
	var b = 0;
	var sumb = 0;
	var buf = new StringBuffer();
	var len = s.length;
	for( var i = 0; i < len; i++ ) {
		switch( s.charAt( i ) ) {
			case '%':
				c = s.charCodeAt( ++i );
				var hb = ( UrlEncoder.isDigit( c ) ? c - 0x30 : 10 + UrlEncoder.toLowerCase( c ) - 0x61 ) & 0xF;
				c = s.charCodeAt( ++i );
				var lb = ( UrlEncoder.isDigit( c ) ? c - 0x30 : 10 + UrlEncoder.toLowerCase( c ) - 0x61 ) & 0xF;
				b = (hb << 4) | lb;
				break;
			case '+':
				b = 32;
				break;
			default:
				b = s.charCodeAt( i );
		}
		if( (b & 0xC0) == 0x80 ) {
			sumb = (sumb << 6) | (b & 0x3F);
		} else {
			if( sumb != 0 ) {
				buf.append( String.fromCharCode( sumb ) );
				sumb = 0;
			}
			sumb = ( (b & 0x80) == 0 ) ? b : b & 0x1F;
		}
	}
	if( sumb != 0 ) {
		buf.append( String.fromCharCode( sumb ) );
	}
	return buf.toString();
};

/**
 * Returns if the decimal code represents an numeric ASCII character.
 * @param c the decimal code to test
 * @return <code>true</code> if the decimal code represents an ASCII digit,
 * <code>false</code> otherwise
 * @type Boolean
 * @private
 */
UrlEncoder.isDigit = function( c ) {
	return !isNaN( String.fromCharCode( c ) );
};

/**
 * Returns the decimal code that corresponds to the lower case version of
 * the given decimal code that represents a alphabetic ASCII character.
 * @param c the decimal code to convert
 * @return the lower case decimal code of the alphabetic ASCII character
 * represented by the given decimal code
 * @type Number
 * @private
 */
UrlEncoder.toLowerCase = function( c ){
	return String.fromCharCode( c ).toLowerCase().charCodeAt( 0 );
};


}, '7.9.0', {"requires": ["yui2-legacy-stringbuffer"]});
