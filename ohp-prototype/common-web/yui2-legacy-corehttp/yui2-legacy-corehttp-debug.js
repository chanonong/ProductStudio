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
YUI.add('yui2-legacy-corehttp', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @fileoverview A library for URL encoding and decoding, building URL strings,
 * and communicating with a server over HTTP.
 * @module legacy-corehttp
 */

/**
 * Unused private constructor (all class methods are static).
 * @class The AsyncConnector provides a mechanism for a web page to
 * programmatically communicate with a server over HTTP.
 * @constructor
 */
function AsyncConnector() {}
window.AsyncConnector = function() {};

/**
 * @private
 */
AsyncConnector.ids = {};

/**
 * Creates an XMLHttpRequest object used to communicate with a server.
 * @return an XMLHttpRequest object
 * @type XMLHttpRequest
 * @private
 */
AsyncConnector.createTransport = function() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
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
		for (var i = 0; i < progIds.length; i++) {
			try {
				return new ActiveXObject(progIds[i]);
			} catch (ignored) {}
		}
	}
	return null;
};

/**
 * Services an HTTP request to a server.
 * <p>
 * Currently recognised options:
 * <ul>
 * <li><code>id</code>: an ID used to identify this request. Subsequent requests
 * made with the same ID will be ignored until the first request made with the
 * ID has been successfully serviced.</li>
 * </ul>
 * @param httpRequest an HTTP request object representing the HTTP request to
 * make to the server
 * @param callback a callback function that will be called with the response
 * is received for the given request. This function should accept a single
 * {@link HttpResponse} argument.
 * @param options an object literal containing options for this HTTP request.
 * This argument is optional and can be omitted from this call.
 * @void
 */
AsyncConnector.serviceRequest = function(httpRequest, callback, options) {
	with (httpRequest) {
		var id;
		if (options != null) {
			id = options.id;
		}
		if (id != null) {
			if (AsyncConnector.ids[id] != null) {
				// A request for the given ID is already in progress.
				return;
			}
			AsyncConnector.ids[id] = true;
		}

		var http = AsyncConnector.createTransport();
		// Tunnel PUT/DELETE over POST.
		http.open(method == Http.METHOD_GET ? Http.METHOD_GET : Http.METHOD_POST, url.toString(), true);
		// This header indicates to compatible servers to tunnel the real response
		// code back in a X-Response-Code header in the response.
		http.setRequestHeader("X-Send-OK-Only", true);
		// This header tunnels the real HTTP method through for compatible servers.
		http.setRequestHeader("X-Request-Method", method);
		for (var i = 0; i < headers.length; i++) {
			http.setRequestHeader(headers[i].name, headers[i].value);
		}
		if (method == Http.METHOD_POST || method == Http.METHOD_PUT) {
			http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		// Setup the callback handler.
		AsyncConnector.handleReadyState(http, callback, id, url.toString());
		http.send(getContent());
	}
}

/**
 * Handles incoming responses to HTTP requests. This polls the given
 * XMLHttpRequest object for changes to the readyState, and triggers the
 * callback handler when the request is in a completed state. We don't take
 * advantage of onreadystate change event handler as this leads to infinite loop
 * problems when the callback instantiates another async request.
 * @private
 * @void
 */
AsyncConnector.handleReadyState = function(http, callback, id, url) {
	var timer = setInterval(function() {
		if (http.readyState == 4) {
			// This request is in a completed state.
			try {
				callback(new HttpResponse(http));
			} catch (e) {
				alert("An error was thrown from the callback handler for the request to " + url);
			}
			// The request has now been handled so we delete the request ID so future
			// requests with the given ID can be serviced.
			delete AsyncConnector.ids[id];
			clearInterval(timer);
		}
	}, 300);
};

/**
 * Constructs a new HTTP request object.
 * @param method the method to use for this request
 * @param baseUrl the base URL (with no query parameters) to be requested
 * @class An object that is used to programatically make HTTP requests from
 * a web page using the {@link AsyncConnector}.
 * @constructor
 */
function HttpRequest(method, baseUrl) {
	/**
	 * @private
	 */
	this.method = method.toUpperCase();

	/**
	 * @private
	 */
	this.url = new Url(baseUrl);

	/**
	 * @private
	 */
	this.contentParams = new ParameterList();

	/**
	 * @private
	 */
	this.headers = [];

	/**
	 * Adds a query parameter to this HTTP request.
	 * @param name the name of the query parameter to add
	 * @param value the value of the query parameter to add
	 * @type void
	 */
	this.addQueryParameter = function(name, value) {
		this.url.addQueryParameter(name, value);
	};

	/**
	 * Returns the query parameter list for this HTTP request. This allows more
	 * advanced manipulation of the list using the {@link ParameterList} API.
	 * @return the query parameter list
	 * @type ParameterList
	 */
	this.getQueryParameters = function() {
		return this.url.getQueryParameters();
	};

	/**
	 * Adds a content parameter to this HTTP request.
	 * @param name the name of the content parameter to add
	 * @param value the value of the content parameter to add
	 * @type void
	 */
	this.addContentParameter = function(name, value) {
		this.contentParams.addParameter(name, value);
	};

	/**
	 * Returns the content parameter list for this HTTP request. This allows more
	 * advanced manipulation of the list using the {@link ParameterList} API.
	 * @return the content parameter list
	 * @type ParameterList
	 */
	this.getContentParameters = function() {
		return this.contentParams;
	};

	/**
	 * Adds a header to this HTTP request.
	 * @param name the name of the header to add
	 * @param value the value of the header to add
	 * @type void
	 */
	this.addHeader = function(name, value) {
		this.headers[this.headers.length] = {name: name, value: value};
	};

	/**
	 * Returns the x-www-form-urlencoded content string for this HTTP request.
	 * @return the x-www-form-urlencoded content, or an empty string if no
	 * content exists for this request
	 * @type String
	 * @private
	 */
	this.getContent = function() {
		return this.contentParams.getParameterString();
	};
}
window.HttpRequest = HttpRequest;

/**
 * Convenience constructor for creating a {@link HttpRequest} object that will
 * perform a GET request.
 * @class A convenience constructor to create a GET {@link HttpRequest} object.
 * @param baseUrl the base URL (with no query parameters) to be requested
 * @constructor
 */
function HttpGetRequest(baseUrl) {
	return new HttpRequest(Http.METHOD_GET, baseUrl);
}
window.HttpGetRequest = HttpGetRequest;

/**
 * Convenience constructor for creating a {@link HttpRequest} object that will
 * perform a PUT request.
 * @class A convenience constructor to create a PUT {@link HttpRequest} object.
 * @param baseUrl the base URL (with no query parameters) to be requested
 * @constructor
 */
function HttpPutRequest(baseUrl) {
	return new HttpRequest(Http.METHOD_PUT, baseUrl);
}
window.HttpPutRequest = HttpPutRequest;

/**
 * Convenience constructor for creating a {@link HttpRequest} object that will
 * perform a POST request.
 * @class A convenience constructor to create a POST {@link HttpRequest} object.
 * @param baseUrl the base URL (with no query parameters) to be requested
 * @constructor
 */
function HttpPostRequest(baseUrl) {
	return new HttpRequest(Http.METHOD_POST, baseUrl);
}
window.HttpPostRequest = HttpPostRequest;

/**
 * Convenience constructor for creating a {@link HttpRequest} object that will
 * perform a DELETE request.
 * @class A convenience constructor to create a DELETE {@link HttpRequest}
 * object.
 * @param baseUrl the base URL (with no query parameters) to be requested
 * @constructor
 */
function HttpDeleteRequest(baseUrl) {
	return new HttpRequest(Http.METHOD_DELETE, baseUrl);
}
window.HttpDeleteRequest = HttpDeleteRequest;

/**
 * Constructs an HTTP response object. This is only for use by the
 * {@link AsyncConnector} object.
 * @class An object that represents the HTTP response receieved when
 * programatically making HTTP requests from a web page using the
 * {@link AsyncConnector}.
 * @constructor
 */
function HttpResponse(http) {
	/**
	 * @private
	 */
	this.http = http;

	/**
	 * Returns the status code for this HTTP response.
	 * @return the status code tunneled through the
	 * <code>X-Response-Code</code> header if it is present; otherwise the real
	 * status code of the response
	 * @type Number
	 */
	this.getStatusCode = function() {
		var code = this.getHeader("X-Response-Code");
		if (!isNaN(parseInt(code))) {
			return code;
		}

		// See IE0013: IE XMLHTTP implementation turns 204 response code into bogus 1223 status code at
		// http://www.enhanceie.com/ie/bugs.asp
		return (this.http.status === 1223 && navigator.userAgent.indexOf('MSIE')) ? 204 : this.http.status;
	};

	/**
	 * Returns if this response had a status code in the 2xx response code range.
	 * @return <code>true</code> if this response had a 2xx response; otherwise
	 * <code>false</code>
	 * @type Boolean
	 */
	this.hasOkStatus = function() {
		return (Math.floor(this.getStatusCode() / 100) == 2);
	};

	/**
	 * Returns the status message for this HTTP response.
	 * @return the status message tunneled through the
	 * <code>X-Response-Message</code> header
	 * @type String
	 */
	this.getStatusMessage = function() {
		return this.getHeader("X-Response-Message");
	};

	/**
	 * Determines if this HTTP response contains any content.
	 * @return <code>true</code> if the response contains content; otherwise
	 * <code>false</code>
	 * @type Boolean
	 */
	this.hasContent = function() {
		return this.getContent().length != 0;
	};

	/**
	 * Returns the content for this HTTP response
	 * @return the content of the response
	 * @type String
	 */
	this.getContent = function() {
		return this.http.responseText;
	};

	/**
	 * Returns the header in the HTTP response with the given name.
	 * @param name the name of the header to retrieve
	 * @return the header in the response, or an empty string if no header with
	 * the given name is present
	 * @type String
	 */
	this.getHeader = function(name) {
		var value = this.http.getResponseHeader(name);
		// Firefox 1.5+ returns null if the header is not in the response.
		return value == null ? "" : value;
	};
}
window.HttpResponse = HttpResponse;

/**
 * Constructs a new request URL with the given base URL.
 * @param baseUrl the base URL (with no query parameters) this object represents
 * @class An object that represents a request URL.
 * @constructor
 */
function Url(baseUrl) {
	/**
	 * @private
	 */
	this.baseUrl = baseUrl;

	/**
	 * @private
	 */
	this.queryParams = new ParameterList();

	/**
	 * Adds a query parameter to this URL.
	 * @param name the name of the query parameter to add
	 * @param value the value of the query parameter to add
	 * @type void
	 */
	this.addQueryParameter = function(name, value) {
		this.queryParams.addParameter(name, value);
	};

	/**
	 * Returns the query parameter list for this URL. This allows more advanced
	 * manipulation of the list using the {@link ParameterList} API.
	 * @return the query parameter list
	 * @type ParameterList
	 */
	this.getQueryParameters = function() {
		return this.queryParams;
	};

	/**
	 * Returns a string representation of this URL.
	 * @return the URL
	 * @type String
	 */
	this.toString = function() {
		var paramString = this.queryParams.getParameterString();
		return this.baseUrl + (paramString.length > 0 ? "?" + paramString : "");
	};
}
window.Url = Url;

/**
 * Constructs a new empty parameter list.
 * @class An object for manipulating HTTP request parameter lists.
 * @constructor
 */
function ParameterList() {
	/**
	 * The collection of parameters contained in this list in {name: name, value: value} format.
	 * @public
	 */
	this.params = [];

	/**
	 * Appends the given parameter to this parameter list.
	 * @param name the name of the parameter to append
	 * @param value the value of the parameter to append
	 * @type void
	 */
	this.addParameter = function(name, value) {
		this.params[this.params.length] = {name: name, value: value};
	};

	/**
	 * Appends the given parameter list to this parameter list.
	 * @param paramList the parameter list to append
	 * @type void
	 */
	this.addParameters = function(paramList) {
		this.params = this.params.concat(paramList.params);
	};

	/**
	 * Removes all parameters with the given name from this parameter list.
	 * @param name the name of the parameters to remove
	 * @type void
	 */
	this.removeParameter = function(name) {
		var parameters = [];
		for (var i = 0; i < this.params.length; i++) {
			if (this.params[i].name != name) parameters[parameters.length] = this.params[i];
		}
		this.params = parameters;
	};

	/**
	 * Determines whether this parameter list has a parameter with the given name.
	 * @param name the name of the parameter to check for
	 * @return <code>true</code> if a parameter with the given name is present;
	 * <code>false</code> otherwise
	 * @type Boolean
	 */
	this.hasParameter = function(name) {
		for (var i = 0; i < this.params.length; i++) {
			if (this.params[i].name == name) return true;
		}
		return false;
	};

	/**
	 * Sets the value of the named parameter in this parameter list. Only one
	 * parameter will remain if there were multiple parameters with the given name
	 * when calling this.
	 * @param name the name of the parameter to alter
	 * @param value the new value to use for the parameter
	 * @type void
	 */
	this.setParameter = function(name, value) {
		this.removeParameter(name);
		this.addParameter(name, value);
	};

	/**
	 * Returns the URL encoded representation of this parameter list.
	 * @return the URL encoded parameter list
	 * @type String
	 */
	this.getParameterString = function() {
		var buf = new CoreHttpStringBuffer();
		for (var i = 0; i < this.params.length; i++) {
			buf.append(UrlEncoder.encode(this.params[i].name), "=", UrlEncoder.encode(this.params[i].value));
			if (i < this.params.length - 1) buf.append("&");
		}
		return buf.toString();
	};
}
window.ParameterList = ParameterList;

/**
 * Unused private constructor (all class methods are static).
 * @class The UrlEncoder class provides static methods for URL encoding and
 * decoding.
 * @constructor
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
UrlEncoder.escapeChars = new Array(256);
for (var i = 0; i < 16; i++) {
	for (var j = 0; j < 16; j++) {
		UrlEncoder.escapeChars[i * 16 + j] = "%" + UrlEncoder.hex.charAt(i) + UrlEncoder.hex.charAt(j);
	}
}

/**
 * URL encodes a string.
 * @param s the string to URL encode
 * @return the URL encoded string
 * @type String
 */
UrlEncoder.encode = function(s) {
	if (s == null) return s;
	s = "" + s;
	var buf = new CoreHttpStringBuffer();
	var len = s.length;
	for (var i = 0; i < len; i++) {
		var c = s.charCodeAt(i);
		if ((c >= 0x61 && c <= 0x7A) || (c >= 0x41 && c <= 0x5A) || (c >= 0x30 && c <= 0x39) || c == 0x5F || c == 0x2E) {
			// If c represents an alphanumeric, underscore, or period character then we don't need to encode it.
			buf.append(s.charAt(i));
		} else if (c == 0x20) {
			buf.append("+");
		} else if (c <= 0x7F) {
			buf.append(UrlEncoder.escapeChars[c]);
		} else if (c <= 0x07FF) {
			buf.append(UrlEncoder.escapeChars[0xC0 | (c >> 6)], UrlEncoder.escapeChars[0x80 | (c & 0x3F)]);
		} else {
			buf.append(UrlEncoder.escapeChars[0xE0 | (c >> 12)], UrlEncoder.escapeChars[0x80 | ((c >> 6) & 0x3F)], UrlEncoder.escapeChars[0x80 | (c & 0x3F)]);
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
UrlEncoder.decode = function(s) {
	if (s == null) return s;
	var b = 0;
	var sumb = 0;
	var buf = new CoreHttpStringBuffer();
	var len = s.length;
	for (var i = 0; i < len; i++) {
		switch (s.charAt(i)) {
			case '%':
				c = s.charCodeAt(++i);
				var hb = (UrlEncoder.isDigit(c) ? c - 0x30 : 10 + UrlEncoder.toLowerCase(c) - 0x61) & 0xF;
				c = s.charCodeAt(++i);
				var lb = (UrlEncoder.isDigit(c) ? c - 0x30 : 10 + UrlEncoder.toLowerCase(c) - 0x61) & 0xF;
				b = (hb << 4) | lb;
				break;
			case '+':
				b = 32;
				break;
			default:
				b = s.charCodeAt(i);
		}
		if ((b & 0xC0) == 0x80) {
			sumb = (sumb << 6) | (b & 0x3F);
		} else {
			if (sumb != 0) {
				buf.append(String.fromCharCode(sumb));
				sumb = 0;
			}
			sumb = ((b & 0x80) == 0) ? b : b & 0x1F;
		}
	}
	if (sumb != 0) {
		buf.append(String.fromCharCode(sumb));
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
UrlEncoder.isDigit = function(c) {
	return !isNaN(String.fromCharCode(c));
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
UrlEncoder.toLowerCase = function(c) {
	return String.fromCharCode(c).toLowerCase().charCodeAt(0);
};

/**
 * This class is a private identical copy of the {@link StringBuffer} so this
 * library does not require any additional dependencies.
 * @private
 */
function CoreHttpStringBuffer() {
	this.s = [];

	this.append = function() {
		var args = this.append.arguments;
		for (var i = 0; i < args.length; i++) {
			this.s[this.s.length] = args[i]
		}
	};

	this.toString = function() {
		return this.s.join("");
	};
}
window.CoreHttpStringBuffer = CoreHttpStringBuffer;

/**
 * @class The Http class contains HTTP related constants.
 */
function Http() {}
window.Http = Http;

// HTTP method constants

/**
 * The DELETE HTTP method.
 * @type String
 */
Http.METHOD_DELETE = "DELETE";

/**
 * The GET HTTP method.
 * @type String
 */
Http.METHOD_GET = "GET";

/**
 * The POST HTTP method.
 * @type String
 */
Http.METHOD_POST = "POST";

/**
 * The PUT HTTP method.
 * @type String
 */
Http.METHOD_PUT = "PUT";


}, '7.9.0');
