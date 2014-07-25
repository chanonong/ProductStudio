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
YUI.add('yui2-legacy-connector', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @module legacy-connector
 */

var success = false;
if (window.XMLHttpRequest) {
	http = new HttpConnector(new XMLHttpRequest());
	success = true;
} else if (window.ActiveXObject) {
	/*
		Versions of Internet Explorer prior to 7.0 implement XMLHttpRequest
		functionality via an ActiveX object. We attempt to load instantiate one of
		these objects following the guidelines at
		http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx

		The first two components are not always available when using IE 5.0, so we
		fall back to an older component that will be available.
	*/
	var progIds = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "Microsoft.XMLHTTP"];
	for (var i = 0; i < progIds.length && !success; i++) {
		try {
			http = new HttpConnector(new ActiveXObject(progIds[i]));
			success = true;
		} catch (ignored) {}
	}
}
if (typeof http == "undefined") {
	http = { loaded: false };
}

/**
 * Private constructor (the library will automatically construct an HTTP
 * connector object and assign it to a singleton named <code>http</code>).
 * @class A wrapper around a XML HTTP browser object. The wrapper previously
 * abstracted away the loading of an appropriate MSJVM or ActiveX connector
 * object to use as an HTTP transport to communicate back to the server.
 * The wrapper has been reimplemented using a XMLHttpRequest browser object
 * internally with an identical API to support Firefox. (Firefox did not support
 * either the MSJVM or ActiveX browser objects.)
 * The object is available to scripts through a JavaScript singleton named
 * <code>http</code>. Scripts however should be using the
 * <code>HttpResource</code> object that wraps this object where possible.
 * Requires UrlEncoder.js if using the encode() and decode() methods.
 * @deprecated in favour of {@link AsyncConnector}
 * @param xmlhttp an XMLHttpRequest object
 * @constructor
 */
function HttpConnector(xmlhttp) {
	/** @private */
	this.loaded = true;

	/** @private */
	this.xmlhttp = xmlhttp;

	/**
	 * Sends a GET HTTP request to the given URL.
	 * @param url the URL of the resource to get
	 * @param headerNameString an optional list of semicolon separated list of
	 * the names of header fields to set
	 * @param headerValueString an optional list of semicolon separated list of
	 * the values to set. The values are required if a list of header names is
	 * provided. The order of the values must correspond to the order of the
	 * names provided in the list of header names.
	 * @return the status code of the response
	 * @type Number
	 */
	this.getResource = function(url, headerNameString, headerValueString) {
		this.xmlhttp.open("GET", url, false);
		this.xmlhttp.setRequestHeader("X-Send-OK-Only", "true");
		this.setAdditionalHeaders(headerNameString, headerValueString);
		this.xmlhttp.send(null);
		return this.getResponseCode();
	};

	/**
	 * Sends a POST HTTP request to the given URL.
	 * @param url the URL of the resource to post to
	 * @param contentParameterString the URL encoded content string to post to
	 * the resource
	 * @param headerNameString an optional list of semicolon separated list of
	 * the names of header fields to set
	 * @param headerValueString an optional list of semicolon separated list of
	 * the values to set. The values are required if a list of header names is
	 * provided. The order of the values must correspond to the order of the
	 * names provided in the list of header names.
	 * @return the status code of the response
	 * @type Number
	 */
	this.postToResource = function(url, contentParameterString, headerNameString, headerValueString) {
		this.xmlhttp.open("POST", url, false);
		this.xmlhttp.setRequestHeader("X-Send-OK-Only", "true");
		this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		this.setAdditionalHeaders(headerNameString, headerValueString);
		this.xmlhttp.send(contentParameterString);
		return this.getResponseCode();
	};

	/**
	 * Sends a PUT HTTP request to the given URL.
	 * @param url the URL of the resource to put
	 * @param contentParameterString the URL encoded content string to put to
	 * the resource
	 * @return the status code of the response
	 * @type Number
	 */
	this.putResource = function(url, contentParameterString) {
		this.xmlhttp.open("POST", url, false);
		this.xmlhttp.setRequestHeader("X-Send-OK-Only", "true");
		this.xmlhttp.setRequestHeader("X-Request-Method", "PUT");
		this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		this.xmlhttp.send(contentParameterString);
		return this.getResponseCode();
	};

	/**
	 * Sends a DELETE HTTP request to the given URL.
	 * @param url the URL of the resource to delete
	 * @return the status code of the response
	 * @type Number
	 */
	this.deleteResource = function(url) {
		this.xmlhttp.open("POST", url, false);
		this.xmlhttp.setRequestHeader("X-Send-OK-Only", "true");
		this.xmlhttp.setRequestHeader("X-Request-Method", "DELETE");
		this.xmlhttp.send(null);
		return this.getResponseCode();
	};

	/**
	 * Gets whether the response contained a content string.
	 * @return <code>true</code> it the response contained a content string,
	 * <code>false</code> otherwise
	 * @type Boolean
	 */
	this.hasContentString = function() {
		return this.xmlhttp.responseText.length != 0;
	};

	/**
	 * Gets the content string (if any) contained in the response.
	 * @return the content string contained in the response
	 * @type String
	 */
	this.getContentString = function() {
		return this.xmlhttp.responseText;
	};

	/**
	 * Gets the content string (if any) contained in the response.
	 * @return the content string contained in the response
	 * @type String
	 * @deprecated use {@link #getContentString} instead
	 */
	this.getResponseContent = function() {
		return this.getContentString();
	};

	/**
	 * Gets the value of the named header in the response.
	 * @name the name of the header value to retrieve
	 * @return the value of the named header if the header exists in the
	 * response, otherwise an empty string
	 * @type String
	 */
	this.getHeader = function(name) {
		try {
			return this.xmlhttp.getResponseHeader(name);
		} catch (e) {
			// Mozilla throws a exception if the header isn't present in the response.
			return "";
		}
	};

	/**
	 * Gets the value of the named header in response.
	 * @name the name of the header value to retrieve
	 * @return the value of the named header
	 * @type String
	 * @deprecated use {@link #getHeader} instead
	 */
	this.getHeaderField = function(name) {
		return this.getHeader(name);
	};

	/**
	 * Gets the status code of the response.
	 * @return the status code of the response
	 * @type Number
	 */
	this.getResponseCode = function() {
		var code = this.getHeader("X-Response-Code");
		return isNaN(parseInt(code)) ? this.xmlhttp.status : code;
	};

	/**
	 * Gets the reason phrase of the response.
	 * @return the reason phrase of the response
	 * @type String
	 */
	this.getResponseMessage = function() {
		return this.getHeader("X-Response-Message");
	};

	/**
	 * URL decodes a string.
	 * @param s the string to URL decode
	 * @return the URL decoded string
	 * @type String
	 * @deprecated use {@link UrlEncoder#decode} instead
	 */
	this.decode = function(s) {
		return UrlEncoder.decode(s);
	};

	/**
	 * URL encodes a string.
	 * @param s the string to URL encode
	 * @return the URL encoded string
	 * @type String
	 * @deprecated use {@link UrlEncoder#encode} instead
	 */
	this.encode = function(s) {
		return UrlEncoder.encode(s);
	};

	/** @private */
	this.setAdditionalHeaders = function(headerNameString, headerValueString) {
		if (typeof headerValueString == "undefined") {
			return;
		}
		var names = headerNameString.split("~;~");
		var values = headerValueString.split("~;~");
		for(var i = 0; i < names.length; i++) {
			if (names[i].length != 0) {
				this.xmlhttp.setRequestHeader(names[i], values[i]);
			}
		}
	};

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_OK = 200;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_CREATED = 201;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_ACCEPTED = 202;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_NOT_AUTHORITATIVE = 203;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_NO_CONTENT = 204;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_RESET = 205;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_PARTIAL = 206;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_MULT_CHOICE = 300;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_MOVED_PERM = 301;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_MOVED_TEMP = 302;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_SEE_OTHER = 303;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_NOT_MODIFIED = 304;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_USE_PROXY = 305;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_BAD_REQUEST = 400;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_UNAUTHORIZED = 401;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_PAYMENT_REQUIRED = 402;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_FORBIDDEN = 403;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_NOT_FOUND = 404;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_BAD_METHOD = 405;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_NOT_ACCEPTABLE = 406;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_PROXY_AUTH = 407;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_CLIENT_TIMEOUT = 408;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_CONFLICT = 409;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_GONE = 410;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_LENGTH_REQUIRED = 411;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_PRECON_FAILED = 412;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_ENTITY_TOO_LARGE = 413;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_REQ_TOO_LONG = 414;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_UNSUPPORTED_TYPE = 415;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_SERVER_ERROR = 500;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_INTERNAL_ERROR = 501;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_BAD_GATEWAY = 502;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_UNAVAILABLE = 503;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_GATEWAY_TIMEOUT = 504;

	/**
	 * @private
	 * @deprecated
	 */
	this.HTTP_VERSION = 505;
}
window.HttpConnector = HttpConnector;


}, '7.9.0');
