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
YUI.add('ohp-utf8', function (Y, NAME) {

/*jshint bitwise: false*/

/**
UTF-8 encoder/decoder.

@module ohp-utf8
**/
// Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple
// single-byte character encoding (c) Chris Veness 2002-2010

/**
UTF-8 encoder/decoder.

@class Utf8
@namespace OHP
**/
var Utf8 = {
	/**
	Encode multi-byte Unicode string into utf-8 multiple single-byte characters
	(BMP / basic multilingual plane only).

	Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.

	@method encode
	@param {String} strUni Unicode string to be encoded as UTF-8
	@return {String} encoded string
	**/
	encode: function(strUni) {
		// use regular expressions & String.replace callback function for better efficiency
		// than procedural approaches
		var strUtf = strUni.replace(
			/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
			function(c) {
				var cc = c.charCodeAt(0);

				return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f);
			});

		strUtf = strUtf.replace(
			/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
			function(c) {
				var cc = c.charCodeAt(0);

				return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f);
			});

		return strUtf;
	},

	/**
	Decode utf-8 encoded string back into multi-byte Unicode characters.

	@method decode
	@param {String} strUtf UTF-8 string to be decoded back to Unicode
	@return {String} decoded string
	**/
	decode: function(strUtf) {
	// note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
		var strUni = strUtf.replace(
			/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
			function(c) {  // (note parentheses for precence)
				var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
				return String.fromCharCode(cc);
			});

		strUni = strUni.replace(
			/[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
			function(c) {  // (note parentheses for precence)
				var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
				return String.fromCharCode(cc);
			});

		return strUni;
	}
};

Y.namespace('OHP').Utf8 = Utf8;


}, '7.9.0');
