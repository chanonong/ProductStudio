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
YUI.add('yui2-legacy-mod11', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @module legacy-mod11
 */

/**
 * @private The string is used to convert between alphabets and digits
 */
var alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * @class Abstract super class of check digit algorithms that implements the createCheckDigit
 * methods by using the implementation of the calculateCheckDigit(str), getCheckChar(int) and
 * getInt(char) methods.
 * @constructor
 * @private
 */
function AbstractCheckDigitAlgorithm() {
	/**
	 * Calculate the check digit for a string value.
	 *
	 * @param str a string value to calculate the check digit for.
	 * @return the check digit; if null there is no valid check digit
	 * @type String
	 * @private
	 */
	this.createCheckDigit = function(str){
		var ret = new Array(str.length);
		var j = 0;
		for (var i = 0; i < str.length; i++) {
			var ch = str.charAt(i);
			if (ch >= '0' && ch <= '9') {
				var digit = ch - '0';
			} else {
				var digit = this.getInt(str.charAt(i));
			}
			if (digit != -1) {
				ret[j++] = digit
			}
		}

		var checkDigit = this.calculateCheckDigit(ret, 0, j);
		return checkDigit != -1 ? this.getCheckChar(checkDigit) : null;
	};
}
window.AbstractCheckDigitAlgorithm = AbstractCheckDigitAlgorithm;

/**
 * Construct an instance of standard Mod 11 algorithm.
 *
 * @class An implementation of the Mod11CheckDigit algorithm.
 * This implementation is as specified in the HL7 spec. A check sum of 0 is
 * changed to a check sum of 1 before calculating the check digit.
 * @constructor
 * @private
 */
function Mod11CheckDigitAlgorithm() {
	/**
	 * Calculate the check digit for part of an array of digits.
	 *
	 * @param digits each digit as an entry in the array; the left most digit at
	 *            index <code>start</code>
	 * @param start the first index to start calculating the check digit from
	 * @param length the number of digits to use last digit will be
	 *            <code>digits[start + length - 1]</code>
	 * @return the check digit; if -1 there is no valid check digit
	 * @type int
	 * @private
	 */
	this.calculateCheckDigit = function(digits, start, length) {
		var checkSum = this.calculateCheckSum(digits, start, length);
		checkSum %= 11;
		if (checkSum == 0) {
			checkSum = 1;
		}
		return (11 - checkSum) % 10;
	};

	/**
	 * Calculate the check digit for part of an array of digits.
	 *
	 * @param digits each digit as an entry in the array; the left most digit at
	 *        index <code>start</code>
	 * @param start the first index to start calculating the check digit from
	 * @param length the number of digits to use last digit will be
	 *        <code>digits[start + length - 1]</code>
	 * @return the check digit; if -1 there is no valid check digit
	 * @type int
	 * @private
	 */
	this.calculateCheckSum = function(digits, start, length) {
		var checkSum = 0;
		for (var i = 0; i < length; i++) {
			var index = length - i - 1 + start;
			var digit = digits[index];
			var multiplier = (i % 6) + 2;
			checkSum += digit * multiplier;
		}
		return checkSum;
	};

	/**
	 * Get the digit for a single character.
	 *
	 * @param c the character
	 * @return the digit or -1 if the character is not valid
	 * @type int
	 * @private
	 */
	this.getInt = function(c) {
		var i = alpha.indexOf(c);
		return i == -1 ? -1 : i + 1;
	};

	/**
	 * Get the character value for a check digit.
	 *
	 * @param i the check digit
	 * @return the character
	 * @type char
	 * @private
	 */
	this.getCheckChar = function(i) {
		return "0123456789".charAt(i);
	};
}
window.Mod11CheckDigitAlgorithm = Mod11CheckDigitAlgorithm;

/**
 * @private
 */
Mod11CheckDigitAlgorithm.prototype = new AbstractCheckDigitAlgorithm();
/**
 * @private
 */
Mod11CheckDigitAlgorithm.prototype.constructor = Mod11CheckDigitAlgorithm;
/**
 * @private
 */
Mod11CheckDigitAlgorithm.superclass = AbstractCheckDigitAlgorithm.prototype;
/**
 * @private
 */
var MOD_11 = new Mod11CheckDigitAlgorithm();

/**
 * @class The Mod11 class provides a static method for getting
 * the mod11 check digit for a string.
 */
function Mod11() {}
window.Mod11 = Mod11;

/**
 * Gets the Mod11 check digit for the given string.
 * @param s the string to find the check digit for
 * @return the check digit
 * @type String
 */
Mod11.calculateCheckDigit = function(s) {
	return MOD_11.createCheckDigit(s);
};

/**
 * Construct an instance of restricted Mod 11 algorithm.
 *
 * @class An implementation of the Mod11CheckDigit algorithm.
 * This implementation is as specified in the
 * <A HREF="http://www.nzhis.govt.nz/nhi/validation.html">NHI Validation Routine</A>.
 * A check sum of 0 means that the identifier is not valid, so the check
 * digit will be calculated as -1 (indicating invalid check digit).
 * @constructor
 * @private
 */
function RestrictedMod11CheckDigitAlgorithm() {
	/**
	 * @private
	 */
	this.mod11 = new Mod11CheckDigitAlgorithm();

	/**
	 * Calculate the check digit for part of an array of digits.
	 *
	 * @param digits each digit as an entry in the array; the left most digit at
	 *            index <code>start</code>
	 * @param start the first index to start calculating the check digit from
	 * @param length the number of digits to use last digit will be
	 *            <code>digits[start + length - 1]</code>
	 * @return the check digit; if -1 there is no valid check digit
	 * @type int
	 * @private
	 */
	this.calculateCheckDigit = function(digits, start, length) {
		var checkSum = this.mod11.calculateCheckSum(digits, start, length);
		checkSum %= 11;
		if (checkSum == 0) {
			return -1;
		}
		return (11 - checkSum) % 10;
	};

	/**
	 * Get the digit for a single character.
	 *
	 * @param c the character
	 * @return the digit or -1 if the character is not valid
	 * @type int
	 * @private
	 */
	this.getInt = function(c) {
		return this.mod11.getInt(c);
	};

	/**
	 * Get the character value for a check digit.
	 *
	 * @param i the check digit
	 * @return the character
	 * @type char
	 * @private
	 */
	this.getCheckChar = function(i) {
		return this.mod11.getCheckChar(i);
	};
}
window.RestrictedMod11CheckDigitAlgorithm = RestrictedMod11CheckDigitAlgorithm;

/**
 * @private
 */
RestrictedMod11CheckDigitAlgorithm.prototype = new AbstractCheckDigitAlgorithm();
/**
 * @private
 */
RestrictedMod11CheckDigitAlgorithm.prototype.constructor = RestrictedMod11CheckDigitAlgorithm;
/**
 * @private
 */
RestrictedMod11CheckDigitAlgorithm.superclass = AbstractCheckDigitAlgorithm.prototype;
/**
 * @private
 */
var MOD_11_RESTRICTED = new RestrictedMod11CheckDigitAlgorithm();

/**
 * @class The RestrictedMod11 class provides a static method for getting
 * the mod11 restricted check digit for a string.
 */
function RestrictedMod11() {}
window.RestrictedMod11 = RestrictedMod11;

/**
 * Gets the Mod11 restricted check digit for the given string.
 * @param s the string to find the check digit for
 * @return the check digit
 * @type String
 */
RestrictedMod11.calculateCheckDigit = function(s) {
	return MOD_11_RESTRICTED.createCheckDigit(s);
};

/**
 * Construct an instance of Mod 11 alpha algorithm.
 *
 * @class A variation on the Mod11 Check digit algorithm. Unlike regular Mod11, this uses
 * <code>checkSum % 11</code> rather than <code>(11 - (checkSum % 11)) % 10</code> as normal Mod11 does. <BR>
 *
 * Also the check digit is converted to a character using the character
 * conversion table like a normal alphabetic digit is.
 * @constructor
 * @private
 */
function Mod11AlphaCheckDigitAlgorithm() {
	/**
	 * @private
	 */
	this.mod11 = new Mod11CheckDigitAlgorithm();

	/**
	 * Calculate the check digit for part of an array of digits.
	 *
	 * @param digits each digit as an entry in the array; the left most digit at
	 *            index <code>start</code>
	 * @param start the first index to start calculating the check digit from
	 * @param length the number of digits to use last digit will be
	 *            <code>digits[start + length - 1]</code>
	 * @return the check digit; if -1 there is no valid check digit
	 * @type int
	 * @private
	 */
	this.calculateCheckDigit = function(digits, start, length) {
		var checkSum = this.mod11.calculateCheckSum(digits, start, length);
		checkSum %= 11;
		if (checkSum == 0) {
			return -1;
		}
		return checkSum;
	};

	/**
	 * Get the digit for a single character.
	 *
	 * @param c the character
	 * @return the digit or -1 if the character is not valid
	 * @type int
	 * @private
	 */
	this.getInt = function(c) {
		var i = alpha.indexOf(c);
		return i == -1 ? -1 : i + 1;
	};

	/**
	 * Get the character value for a check digit.
	 *
	 * @param i the check digit
	 * @return the character
	 * @type char
	 * @private
	 */
	this.getCheckChar = function(i) {
		return alpha.charAt(i - 1);
	};
}
window.Mod11AlphaCheckDigitAlgorithm = Mod11AlphaCheckDigitAlgorithm;

/**
 * @private
 */
Mod11AlphaCheckDigitAlgorithm.prototype = new AbstractCheckDigitAlgorithm();
/**
 * @private
 */
Mod11AlphaCheckDigitAlgorithm.prototype.constructor = RestrictedMod11CheckDigitAlgorithm;
/**
 * @private
 */
Mod11AlphaCheckDigitAlgorithm.superclass = AbstractCheckDigitAlgorithm.prototype;
/**
 * @private
 */
var MOD_11_ALPHA = new Mod11AlphaCheckDigitAlgorithm();

/**
 * @class The Mod11Alpha class provides a static method for getting
 * the mod11 alpha check digit for a string.
 */
function Mod11Alpha() {}
window.Mod11Alpha = Mod11Alpha;

/**
 * Gets the Mod11 alpha check digit for the given string.
 * @param s the string to find the check digit for
 * @return the check digit
 * @type String
 */
Mod11Alpha.calculateCheckDigit = function(s) {
	return MOD_11_ALPHA.createCheckDigit(s);
};


}, '7.9.0');
