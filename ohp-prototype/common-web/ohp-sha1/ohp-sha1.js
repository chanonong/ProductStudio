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
YUI.add('ohp-sha1', function (Y, NAME) {

/*jshint bitwise: false, plusplus: false*/

/**
SHA-1 cryptographic hash.

@module ohp-sha1
**/
// SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk
//   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html
//         http://csrc.nist.gov/groups/ST/toolkit/examples.html

var Utf8 = Y.OHP.Utf8,

	/**
	SHA-1 cryptographic hash.

	@class Sha1
	@namespace OHP
	**/
	Sha1 = {
		/**
		Generates SHA-1 hash of string

		@method hash
		@param {String} msg String to be hashed.
		@param {Boolean} (optional) Encode msg as UTF-8 before generating hash.
		@return {String} Hash of msg as hex character string.
		**/
		hash: function(msg, utf8encode) {
			/*jshint maxstatements:40*/

			var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6],
				H0 = 0x67452301,
				H1 = 0xefcdab89,
				H2 = 0x98badcfe,
				H3 = 0x10325476,
				H4 = 0xc3d2e1f0,
				l, N, M, W,
				a, b, c, d, e,
				s, T,
				i, j, t;

			utf8encode = utf8encode || true;

			// convert string to UTF-8, as SHA only deals with byte-streams
			if (utf8encode) {
				msg = Utf8.encode(msg);
			}

			// PREPROCESSING
			msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string

			// convert string msg into 512-bit/16-integer blocks arrays of ints
			l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + '1' + appended length
			N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
			M = new Array(N);

			for (i = 0; i < N; i++) {
				M[i] = new Array(16);

				for (j = 0; j < 16; j++) {  // encode 4 chars per integer, big-endian encoding
					M[i][j] =
						(msg.charCodeAt(i*64+j*4)<<24) |
						(msg.charCodeAt(i*64+j*4+1)<<16) |
						(msg.charCodeAt(i*64+j*4+2)<<8) |
						(msg.charCodeAt(i*64+j*4+3));
				} // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
			}

			// add length (in bits) into final pair of 32-bit integers (big-endian)
			// note: most significant word would be (len-1)*8 >>> 32, but since JS converts
			// bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
			M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
			M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

			// HASH COMPUTATION
			W = new Array(80);

			for (i = 0; i < N; i++) {
				// 1 - prepare message schedule 'W'
				for (t = 0;  t < 16; t++) {
					W[t] = M[i][t];
				}

				for (t = 16; t < 80; t++) {
					W[t] = this.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
				}

				// 2 - initialise five working variables a, b, c, d, e with previous hash value
				a = H0; b = H1; c = H2; d = H3; e = H4;

				// 3 - main loop
				for (t = 0; t < 80; t++) {
					s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
					T = (this.ROTL(a,5) + this.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
					e = d;
					d = c;
					c = this.ROTL(b, 30);
					b = a;
					a = T;
				}

				// 4 - compute the new intermediate hash value
				H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
				H1 = (H1+b) & 0xffffffff;
				H2 = (H2+c) & 0xffffffff;
				H3 = (H3+d) & 0xffffffff;
				H4 = (H4+e) & 0xffffffff;
			}

			return this.toHexStr(H0) + this.toHexStr(H1) + this.toHexStr(H2) + this.toHexStr(H3) + this.toHexStr(H4);
		},

		/**
		f

		@method f
		@private
		**/
		f: function(s, x, y, z)  {
			switch (s) {
				case 0:
					return (x & y) ^ (~x & z);           // Ch()
				case 1:
					return x ^ y ^ z;                    // Parity()
				case 2:
					return (x & y) ^ (x & z) ^ (y & z);  // Maj()
				case 3:
					return x ^ y ^ z;                    // Parity()
			}
		},

		/**
		Rotate left (circular left shift) value x by n positions.

		@method ROTL
		@private
		**/
		ROTL: function(x, n) {
			return (x<<n) | (x>>>(32-n));
		},

		/**
		Hexadecimal representation of a number.

		Note toString(16) is implementation-dependant, and in IE returns signed numbers when used on full words.

		@method toHexStr
		@private
		**/
		toHexStr: function(n) {
			var s = '', v, i;

			for (i = 7; i >= 0; i--) {
				v = (n>>>(i*4)) & 0xf; s += v.toString(16);
			}

			return s;
		}
	};

Y.namespace('OHP').Sha1 = Sha1;


}, '7.9.0', {"requires": ["ohp-utf8"]});
