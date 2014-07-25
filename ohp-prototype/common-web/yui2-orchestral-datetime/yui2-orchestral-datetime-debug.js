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
YUI.add('yui2-orchestral-datetime', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL*/

YAHOO.namespace('ORCHESTRAL.util');

/**
 * Date, time, and date time widgets for users to enter dates and date formatting utilities.
 *
 * @module orchestral-datetime
 * @namespace ORCHESTRAL.util
 * @requires yahoo, dom, event, calendar, orchestral, orchestral-locale, legacy-window, logger
 */
(function() {
	var lang = YAHOO.lang,
		DateMath = YAHOO.widget.DateMath,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Locale = ORCHESTRAL.util.Locale;

	/**
	 * A partial JavaScript implementation of Java's SimpleDateFormat.
	 *
	 * Some format patterns are not supported. Parsing is not supported.
	 *
	 * @param {String} format
	 * @namespace ORCHESTRAL.util
	 * @class DateFormat
	 * @constructor
	 */
	ORCHESTRAL.util.DateFormat = function(format) {
		this._format = format;
	};
	var DateFormat = ORCHESTRAL.util.DateFormat;

	DateFormat.prototype = {
		/**
		 * Returns the formatted date.
		 *
		 * @method format
		 * @param {Date} date
		 * @return {String}
		 */
		format: function(date) {
			if (date === null) {
				return '';
			}

			var s = this._format;

			// Any text that is processed into the formatted date that may contain format codes needs to be escaped
			// to prevent that text from getting processed incorrectly with subsequent replacements.

			var escapedText = [];
			var escapeText = function(text) {
				escapedText[escapedText.length] = text;
				return '~' + (escapedText.length - 1) + '~';
			};

			// Any text that is quoted is output verbatim into the result.
			s = s.replace(/'([^']+)'/g, function(match) {
				return escapeText(match.slice(1, -1));
			});

			// Single quotes get escaped as double quotes.
			s = s.replace("''", "'");

			s = s.replace(/y{4,}/g, date.getFullYear());
			s = s.replace(/y{1,3}/g, this._pad(date.getFullYear() % 100));
			s = s.replace(/M{4,}/g, escapeText(Locale.get('util.date.months.long')[date.getMonth()]));
			s = s.replace(/M{3}/g, escapeText(Locale.get('util.date.months.short')[date.getMonth()]));
			s = s.replace(/M{2}/g, this._pad(date.getMonth() + 1));
			s = s.replace(/M/g, date.getMonth() + 1);
			s = s.replace(/d{2,}/g, this._pad(date.getDate()));
			s = s.replace(/d/g, date.getDate());
			s = s.replace(/E{4,}/g, escapeText(Locale.get('util.date.day.long')[date.getDay()]));
			s = s.replace(/E{1,3}/g, escapeText(Locale.get('util.date.day.short')[date.getDay()]));
			s = s.replace(/a+/g, escapeText(Locale.get('util.date.' + (date.getHours() < 12 ? 'am' : 'pm'))));
			s = s.replace(/H{2,}/g, this._pad(date.getHours()));
			s = s.replace(/H/g, date.getHours());
			s = s.replace(/h{2,}/g, this._pad(this._halfDay(date.getHours())));
			s = s.replace(/h/g, this._halfDay(date.getHours()));
			s = s.replace(/m{2,}/g, this._pad(date.getMinutes()));
			s = s.replace(/m/g, date.getMinutes());
			s = s.replace(/s{2,}/g, this._pad(date.getSeconds()));
			s = s.replace(/s/g, date.getSeconds());

			// Process any text that was escaped for processing back into the final format.
			for (var i = 0; i < escapedText.length; i++) {
				s = s.replace(new RegExp('~' + i + '~', 'g'), escapedText[i]);
			}

			return s;
		},

		/**
		 * @method pad
		 * @param {int} toPad
		 * @param {int} length
		 * @private
		 * @return {String}
		 */
		_pad: function(s) {
			s += '';
			return (s.length == 1 ? '0' : '') + s;
		},

		/**
		 * @methood halfDay
		 * @param {int} hours
		 * @private
		 * @return {int}
		 */
		_halfDay: function(hours) {
			return (hours + 11) % 12 + 1;
		}
	};

	/**
	 * The format for ISO_8601 dates.
	 *
	 * @property ORCHESTRAL.util.DateFormat.ISO_8601_DATE
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.ISO_8601_DATE = new DateFormat('yyyy-MM-dd');
	DateFormat.ISO_8601_DATE.parse = function(str) {
		var parts = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (parts === null) {
			return null;
		}
		return new Date(+parts[1], +parts[2] - 1, +parts[3]);
	};

	/**
	 * The format for ISO_8601 times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.ISO_8601_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.ISO_8601_TIME = new DateFormat('HH:mm:ss');
	DateFormat.ISO_8601_TIME.parse = function(str) {
		var parts = str.match(/^(\d{2}):(\d{2}):(\d{2})$/);
		if (parts === null) {
			return null;
		}
		return new Date(0, 0, 0, +parts[1], +parts[2], +parts[3]);
	};

	/**
	 * The format for ISO_8601 date times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.ISO_8601_DATE_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.ISO_8601_DATE_TIME = new DateFormat("yyyy-MM-dd'T'HH:mm:ss");
	DateFormat.ISO_8601_DATE_TIME.parse = function(str) {
		var parts = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
		if (parts === null) {
			return null;
		}
		return new Date(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6]);
	};

	/**
	 * The format for displaying short dates.
	 *
	 * @property ORCHESTRAL.util.DateFormat.SHORT_DATE
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.SHORT_DATE = new DateFormat(Locale.get('widget.datetime.short.date.format'));

	/**
	 * The format for displaying short times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.SHORT_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.SHORT_TIME = new DateFormat(Locale.get('widget.datetime.short.time.format'));

	/**
	 * The format for displaying short date times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.SHORT_DATE_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.SHORT_DATE_TIME = new DateFormat(Locale.get('widget.datetime.short.datetime.format'));

	/**
	 * The format for displaying medium dates.
	 *
	 * @property ORCHESTRAL.util.DateFormat.MEDIUM_DATE
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.MEDIUM_DATE = new DateFormat(Locale.get('widget.datetime.medium.date.format'));

	/**
	 * The format for displaying medium times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.MEDIUM_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.MEDIUM_TIME = new DateFormat(Locale.get('widget.datetime.medium.time.format'));

	/**
	 * The format for displaying medium date times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.MEDIUM_DATE_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.MEDIUM_DATE_TIME = new DateFormat(Locale.get('widget.datetime.medium.datetime.format'));

	/**
	 * The format for displaying long dates.
	 *
	 * @property ORCHESTRAL.util.DateFormat.LONG_DATE
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.LONG_DATE = new DateFormat(Locale.get('widget.datetime.long.date.format'));

	/**
	 * The format for displaying long times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.LONG_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.LONG_TIME = new DateFormat(Locale.get('widget.datetime.long.time.format'));

	/**
	 * The format for displaying medium date times.
	 *
	 * @property ORCHESTRAL.util.DateFormat.LONG_DATE_TIME
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @final
	 */
	DateFormat.LONG_DATE_TIME = new DateFormat(Locale.get('widget.datetime.long.datetime.format'));

	var PartialDate = function(year, month) {
		this.year = year;
		this.month = month;
	};

	PartialDate._YEAR_DISPLAY_FORMAT = new DateFormat(Locale.get('widget.datetime.medium.year.format'));
	PartialDate._YEAR_MONTH_DISPLAY_FORMAT = new DateFormat(Locale.get('widget.datetime.medium.yearmonth.format'));

	PartialDate.parse = function(str) {
		var parts = str.match(/^(\d{4})-(\d{2})$/);
		if (parts !== null) {
			return new PartialDate(+parts[1], +parts[2]);
		}
		parts = str.match(/^(\d{4})$/);
		if (parts !== null) {
			return new PartialDate(+parts[1]);
		}
		return null;
	};

	PartialDate.prototype = {
		formatDisplay: function() {
			return this._formatDate(PartialDate._YEAR_DISPLAY_FORMAT, PartialDate._YEAR_MONTH_DISPLAY_FORMAT);
		},

		formatISO: function() {
			return this._formatDate(new DateFormat('yyyy'), new DateFormat('yyyy-MM'));
		},

		_formatDate: function(yearFormat, yearMonthFormat) {
			if (this.month) {
				return yearMonthFormat.format(new Date(this.year, this.month - 1, 1));
			} else {
				return yearFormat.format(new Date(this.year, 0, 1));
			}
		}
	};

	var InvalidInput = function(value) {
		this.value = value;
	};

	YAHOO.namespace('ORCHESTRAL.widget');

	/**
	 * Date widget.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class Date
	 * @constructor
	 * @param hiddenInput {String | HTMLElement}
	 * @uses YAHOO.util.EventProvider
	 * @extends ORCHESTRAL.widget.DateTime
	 */
	ORCHESTRAL.widget.Date = function(hiddenInput) {
		hiddenInput = Dom.get(hiddenInput);
		Dom.addClass(hiddenInput, 'OrchestralDate');
		return new ORCHESTRAL.widget.DateTime(hiddenInput);
	};

	/**
	 * Partial date widget.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class PartialDate
	 * @constructor
	 * @param hiddenInput {String | HTMLElement}
	 * @uses YAHOO.util.EventProvider
	 * @extends ORCHESTRAL.widget.DateTime
	 */
	ORCHESTRAL.widget.PartialDate = function(hiddenInput) {
		hiddenInput = Dom.get(hiddenInput);
		Dom.addClass(hiddenInput, 'OrchestralPartialDate');
		return new ORCHESTRAL.widget.DateTime(hiddenInput);
	};

	/**
	 * Time widget.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class Time
	 * @constructor
	 * @param hiddenInput {String | HTMLElement}
	 * @uses YAHOO.util.EventProvider
	 * @extends ORCHESTRAL.widget.DateTime
	 */
	ORCHESTRAL.widget.Time = function(hiddenInput) {
		hiddenInput = Dom.get(hiddenInput);
		Dom.addClass(hiddenInput, 'OrchestralTime');
		return new ORCHESTRAL.widget.DateTime(hiddenInput);
	};

	/**
	 * Date range widget.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class DateRange
	 * @constructor
	 * @param fromInput {String | HTMLElement}
	 * @param toInput {String | HTMLElement}
	 */
	ORCHESTRAL.widget.DateRange = function(fromInput, toInput) {
		this._from = new ORCHESTRAL.widget.Date(fromInput);
		this._to = new ORCHESTRAL.widget.Date(toInput);

		// The maximum allowed for the from date and the minimum allowed for the
		// to date are ignored. This is because they will be overwritten to indicate
		// the minimum or maximum allowable value for the field based upon the
		// value that has been entered in the other field.
		this._from.setMax(Dom.get(toInput).value);
		this._to.setMin(Dom.get(fromInput).value);

		this._from.subscribe('dateChanged', function(input) { this._to.setMin(input.value); }, this, true);
		this._to.subscribe('dateChanged', function(input) { this._from.setMax(input.value); }, this, true);
	};

	ORCHESTRAL.widget.DateRange.prototype = {
		_from: null,

		_to: null,

		/**
		 * Returns true if both dates are valid.
		 *
		 * @method isValid
		 * @return {Boolean} True if this date is valid.
		 */
		isValid: function() {
			return (this._from.isValid() && this._to.isValid());
		},

		/**
		 * Adds the specified class to each of the DateTime components within DateRange
		 *
		 * @method addClass
		 * @param className {String} the class name to add to the node's class attribute
		 */
		addClass: function(className) {
			this._from.addClass(className);
			this._to.addClass(className);
		},

		/**
		 * Removes the specified class from each of the DateTime components within DateRange
		 *
		 * @method removeClass
		 * @param className {String} the class name to be removed from the node's class attribute
		 */
		removeClass: function(className) {
			this._from.removeClass(className);
			this._to.removeClass(className);
		},

		/**
		 * Sets the specified attribute to each of the DateTime components within DateRange
		 *
		 * @method setAttribute
		 * @param attrName {String} name of attribute to set
		 * @param attrValue {String} attribute value to set
		 */
		setAttribute: function(attrName, attrValue) {
			this._from.setAttribute(attrName, attrValue);
			this._to.setAttribute(attrName, attrValue);
		},

		/**
		 * Removes the specified attribute from each of the DateTime components within DateRange
		 *
		 * @method removeAttribute
		 * @param attrName {String} name of attribute to remove
		 */
		removeAttribute: function(attrName) {
			this._from.removeAttribute(attrName);
			this._to.removeAttribute(attrName);
		}
	};


	/**
	 * Date time widget.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class DateTime
	 * @constructor
	 * @param hiddenInput {String | HTMLElement}
	 * @uses YAHOO.util.EventProvider
	 */
	ORCHESTRAL.widget.DateTime = function(hiddenInput) {
		var Registry = ORCHESTRAL.util.Registry;

		if (Registry.get('ORCHESTRAL.widget.DateTime', hiddenInput)) {
			return Registry.get('ORCHESTRAL.widget.DateTime', hiddenInput);
		}

		/**
		 * Is the control initalised?
		 */
		this._initialised = false;

		/**
		 * Original input element that is enhanced to become a DateTime control.
		 *
		 * @property _hiddenInput
		 * @type HTMLElement
		 * @private
		 */
		this._hiddenInput = Dom.get(hiddenInput);

		/**
		 * The last known value of the original input element.
		 * This is used for determining programatic changes to the date/time value.
		 *
		 * @property _lastSeenHiddenInputValue
		 * @type String
		 * @private
		 */
		this._lastSeenHiddenInputValue = null;

		/**
		 * The visible input field that is used to enter date information.
		 *
		 * @property _dateInput
		 * @property HTMLElement
		 * @property private
		 */
		this._dateInput = null;

		/**
		 * The visible input field that is used to enter time information.
		 *
		 * @property _timeInput
		 * @property HTMLElement
		 * @property private
		 */
		this._timeInput = null;

		/**
		 * The date component corresponding to the date entered in this control.
		 * This will be null if no date has been entered.
		 *
		 * @property _date
		 * @type Object
		 * @private
		 */
		this._date = null;

		/**
		 * The time component corresponding to the time entered in this control.
		 * This will be null if no time has been entered.
		 *
		 * @property _time
		 * @type Object
		 * @private
		 */
		this._time = null;

		/**
		 * Custom event which is fired after either the date or time is changed.
		 *
		 * @property dateTimeChangedEvent
		 * @type YAHOO.util.CustomEvent
		 */
		this.dateTimeChangedEvent = this.createEvent('dateTimeChanged');

		/**
		 * Custom event which is fired after the time is changed.
		 *
		 * @property timeChangedEvent
		 * @type YAHOO.util.CustomEvent
		 */
		this.timeChangedEvent = this.createEvent('timeChanged');

		/**
		 * Custom event which is fired after the date is changed.
		 *
		 * @property dateChangedEvent
		 * @type YAHOO.util.CustomEvent
		 */
		this.dateChangedEvent = this.createEvent('dateChanged');

		/**
		 * The minimum value allowed to be input into this control.
		 *
		 * @property _min
		 * @type Date
		 * @private
		 */
		this._min = null;

		/**
		 * The maximum value allowed to be input into this control.
		 *
		 * @property _max
		 * @type Date
		 * @private
		 */
		this._max = null;

		this._isPartialDateInput = Dom.hasClass(this._hiddenInput, 'OrchestralPartialDate');
		// Partial date inputs are considered date inputs because they are just a date input that accepts a greater range of inputs.
		this._isDateInput = Dom.hasClass(this._hiddenInput, 'OrchestralDate') || this._isPartialDateInput;
		this._isTimeInput = Dom.hasClass(this._hiddenInput, 'OrchestralTime');

		if (!this._isDateInput && !this._isTimeInput) {
			// This is a date time control that is getting constructed programatically.
			Dom.addClass(this._hiddenInput, 'OrchestralDateTime');
		}

		this._isDateTimeInput = Dom.hasClass(this._hiddenInput, 'OrchestralDateTime');

		// We construct the UI for the control here rather than in onDOMReady so that instances can be created dynamically.
		var nobr = document.createElement('nobr');

		var next = this._hiddenInput.nextSibling;
		if (next) {
			this._hiddenInput.parentNode.insertBefore(nobr, next);
		} else {
			this._hiddenInput.parentNode.appendChild(nobr);
		}


		var ariaLabel = this._hiddenInput.getAttribute('aria-label');

		/*
		 * Copies the aria-label from original input element to generated inputs.
		 * dateTimeTranslationKey is used in DateTime widgets to differentiate the date and time inputs
		 */
		var copyAriaLabel = function(inputElement, dateTimeTranslationKey) {
			if (ariaLabel) {
				if (this._isDateTimeInput) {
					inputElement.setAttribute('aria-label', Locale.get(dateTimeTranslationKey, ariaLabel));
				} else {
					inputElement.setAttribute('aria-label', ariaLabel);
				}
			}
		};

		if (this._isDateInput || this._isDateTimeInput) {
			this._dateInput = document.createElement('input');
			this._dateInput.setAttribute('type', 'text');
			this._dateInput.setAttribute('size', '11');
			this._dateInput.className = 'medium';

			copyAriaLabel.call(this, this._dateInput, 'cow.datetime.label.screenReader.date');

			nobr.appendChild(this._dateInput);

			var a = document.createElement('a');
			a.setAttribute('href', '#');
			a.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
			a.tabIndex = -1;

			nobr.appendChild(a);
			Dom.addClass(a, 'OrchestralDatePicker');

			Event.on(a, 'click',
				function(e, obj) {
					if (Dom.hasClass(a, 'disabled')) {
						// If OrchestralDatePicker is disabled, do nothing
					} else {
						// Render and display the calendar so we can determine if it can be displayed inline.

						// We get the viewport height and width before the calendar is shown because Mobile Safari returns the document
						// height and width for these and they incorrectly influence our calculations whether to display the calendar
						// inline or in a new window. Getting the viewport height and width after the the calendar is displayed also
						// has been observed to hang/crash Mobile Safari under certain scenarios (CPO-12125).
						var viewportHeight = Dom.getViewportHeight(),
							viewportWidth = Dom.getViewportWidth();

						var calendarElement = Dom.get('OrchestralCalendar'),
							calendar = ORCHESTRAL.widget.DateTime._createCalendar(calendarElement, obj.control);

						// Hide the calendar as we determine its size requirements so users don't see a flash of content.
						calendarElement.style.visibility = 'hidden';
						calendarElement.style.display = 'block';

						var y,
							inputTop = Dom.getY(obj.input),
							inputHeight = obj.input.offsetHeight;

						if (inputTop + inputHeight + calendarElement.offsetHeight - Dom.getDocumentScrollTop() < viewportHeight) {
							// Position the calendar below the input.
							y = inputTop + inputHeight;
						} else if (calendarElement.offsetHeight < inputTop - Dom.getDocumentScrollTop()) {
							// There is not enough room to display the calendar below the control; position it above the input.
							y = inputTop - calendarElement.offsetHeight;
						} else {
							// The page is not high enough to display the calendar without overlapping the input.
							y = -1;
						}

						var x,
							inputLeft = Dom.getX(obj.input),
							buttonLeft = Dom.getX(this),
							buttonWidth = this.offsetWidth;
						if (inputLeft + calendarElement.offsetWidth - Dom.getDocumentScrollLeft() < viewportWidth) {
							// Position the calendar so its left side is flush with the left side of the input.
							x = inputLeft;
						} else if (calendarElement.offsetWidth < buttonLeft - Dom.getDocumentScrollLeft() + buttonWidth) {
							// There is not enough room to display the calendar from the left-most edge of the input;
							// position it so its right side is flush with the right side of the calendar button.
							x = buttonLeft + buttonWidth - calendarElement.offsetWidth;
						} else if (calendarElement.offsetWidth < viewportWidth) {
							// There is also not enough room to display the calendar from the right-most edge of the input;
							// position it so its right side is flush with the right side of the page.
							x = viewportWidth - calendarElement.offsetWidth;
						} else {
							// The page is not wide enough to display the calendar.
							x = -1;
						}

						var selectHandler = function(result) {
							obj.input.value = ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT.format(result);
							obj.control._handleUserDateUpdate();
							obj.input.select();
						};

						if (x != -1 && y != -1) {
							calendar.selectEvent.subscribe(function() {
								calendarElement.style.visibility = 'hidden';
								selectHandler(calendar.getSelectedDates().pop());
							});

							// Making sure the calendar popup appears correctly when the input is in a positioned, z-indexed element.
							var elem = Dom.getAncestorBy(this, function(node) {
								if (Dom.hasClass(node, 'yui-panel')) {
									// If the positioned z-indexed element is a YUI panel we want to position the calendar using the
									// z-index of the element generated by YUI that wraps the panel. This allows the calendar to
									// spill outside of the panel if it is not large enough to be displayed inside the panel.
									return false;
								}
								var zIndex = Dom.getStyle(node, 'z-index');
								// When the z-index hasn't been explictly set Internet Explorer reports 0 and Firefox reports 'auto'.
								return zIndex !== 0 && zIndex != 'auto';
							});
							calendarElement.style.zIndex = elem ? Dom.getStyle(elem, 'z-index') : 0;

							calendarElement.style.visibility = 'visible';
							Dom.setXY(calendarElement, [x, y]);
						} else {
							// There is not enough room to display the calendar inline in the page so hide it and open a popup
							// calendar instead. We hide the title and close button when determining the height and width for
							// the popup because they are never displayed on popup calendar windows.
							calendar.cfg.setProperty('title', false);
							calendar.cfg.setProperty('close', false);

							var cssUrl,
								popupHeight = calendarElement.offsetHeight,
								popupWidth = calendarElement.offsetWidth,
								url = ORCHESTRAL.COMMON_WEB_CONTEXT + '/datetime/assets/calendar.html';

							// Height and width calculations of popup have been performed so we can re-enable title and close
							calendar.cfg.setProperty('title', true);
							calendar.cfg.setProperty('close', true);

							for (var i = 0; i < document.styleSheets.length; i++) {
								var styleSheet = document.styleSheets[i];
								if (!styleSheet.disabled && styleSheet.href && (styleSheet.href.indexOf('assets/skins/hive') != -1 || styleSheet.href.indexOf('assets/skins/orchestral') != -1)) {
									url += '?skin=' + (function() {
										var tokens = styleSheet.href.split('/');
										return tokens[tokens.length - 2];
									})();
									break;
								}
							}

							calendarElement.style.display = 'none';

							ORCHESTRAL.widget.DateTime._popupConfig = {
								activeControl: obj.control,
								title: Locale.get('widget.datetime.calendar.title')
							};

							// Exposes the popup config object to global window so that the config is accessible when used as a yui2in3 module.
							if (typeof Y !== "undefined" && Y.YUI2) {
								window.ORCHESTRAL_DATETIME_POPUP_CONFIG = ORCHESTRAL.widget.DateTime._popupConfig;
							}

							var position = (function() {
								var top = 0,
									left = 0,
									doc,
									docEl;

								// Position the popup in the center of the browser window.
								if (lang.isUndefined(window.screenTop)) {
									top = screenY + ((outerHeight - popupHeight) / 2);
									left = screenX + ((outerWidth - popupWidth) / 2);
								} else if (window.top.document){
									// See "The User's Display Screen" diagram at http://www.gtalbot.org/DHTMLSection/WindowEventsNS6.html to see what
									// we have to work with for Internet Explorer. Note we also have to get the top page height/width in different ways
									// depending on if the top page is rendered in quirks or standards mode.
									// http://stackoverflow.com/questions/1503843/quirksmode-javascript-implementation
									doc =  window.top.document;
									docEl = doc.compatMode != 'CSS1Compat' ? doc.body: doc.documentElement;

									top = window.top.screenTop + ((docEl.clientHeight - popupHeight) / 2);
									left = window.top.screenLeft + ((docEl.clientWidth - popupWidth) / 2);
								} else {
									top = 0;
									left = 0;
								}

								return {
									top: top,
									left: left
								};
							})();

							var win = new Window(url, selectHandler, popupWidth, popupHeight, 'Calendar', position);
							win.open();

							// If the page that contains with the date time control is navigated, closed, or reloaded the opened calendar window
							// is useless because selecting a date will do nothing (the opening page has gone away). We close the now useless window.
							Event.on(window, 'unload', win.close, null, win);
						}
					}
					Event.stopEvent(e);
				}, { input: this._dateInput, control: this }
			);

			Event.on(this._dateInput, 'blur', function(e) { this._handleUserDateUpdate(); }, this, true);

			new YAHOO.util.KeyListener(this._dateInput, { keys: YAHOO.util.KeyListener.KEY.ENTER }, {
				fn: function(e) { this._handleUserDateUpdate(); },
				scope: this,
				correctScope: true
			}).enable();
		}

		if (nobr.childNodes.length > 0) {
			nobr.appendChild(document.createTextNode(' '));
		}

		if (this._isTimeInput || this._isDateTimeInput) {
			this._timeInput = document.createElement('input');
			this._timeInput.setAttribute('type', 'text');
			this._timeInput.setAttribute('size', '6');
			this._timeInput.className = 'small';

			copyAriaLabel.call(this, this._timeInput, 'cow.datetime.label.screenReader.time');

			var imgHolder = document.createElement('span');
			imgHolder.className = 'orchestral-time-indicator';
			imgHolder.tabindex = "-1";
			imgHolder.appendChild(document.createTextNode(' '));

			if(this._isDateTimeInput){
				this._timeInput.className = 'small';
			}
			nobr.appendChild(this._timeInput);
			nobr.appendChild(imgHolder);
			Event.on(this._timeInput, 'blur', function(e) { this._handleUserTimeUpdate(); }, this, true);

			new YAHOO.util.KeyListener(this._timeInput, { keys: YAHOO.util.KeyListener.KEY.ENTER }, {
				fn: function(e) { this._handleUserTimeUpdate(); },
				scope: this,
				correctScope: true
			}).enable();
		}
		this.setMin(this._hiddenInput.getAttribute('min'));
		this.setMax(this._hiddenInput.getAttribute('max'));

		// Update the visible inputs to reflect the initial state of the hidden field.
		this._updateView();
		this._lastSeenHiddenInputValue = this._hiddenInput.value;

		// Update the defaultValue for the visible inputs so they reset to the initial
		// page state if they are reset.
		if (this._dateInput) {
			this._dateInput.defaultValue = this._dateInput.value;
		}
		if (this._timeInput) {
			this._timeInput.defaultValue = this._timeInput.value;
		}

		// Update the visible inputs following programatic changes to the underlying hidden field.
		var that = this;
		setInterval(function() { that._updateView(); }, ORCHESTRAL.widget.DateTime._POLLING_INTERVAL);

		// Set the tab index of the hidden input so it isn't focussed when tabbing between
		// fields using the keyboard. It's not actually hidden, becuse we need to be able to
		// handle programmatic focus events (which frameworks like Stripes use do to things
		// like focus the first field in a page).
		this._hiddenInput.tabIndex = -1;

		// Propogate any programmatic focus events on the hidden input to the first
		// visible field of the component.
		Event.on(this._hiddenInput, 'focus', function(e) {
			try {
				(this._isTimeInput ? this._timeInput : this._dateInput).focus();
			} catch (err) {
				// IE throws error when trying to a hidden element, we can safely ignore this
			}
		}, this, true);

		this._initialised = true;

		Registry.put('ORCHESTRAL.widget.DateTime', this._hiddenInput, this);
	};

	/**
	 * Create an appropriate DateTime widget for all inputs with 'OrchestralDate',
	 * 'OrchestralPartialDate', 'OrchestralTime' or 'OrchestralDateTime' classes.
	 *
	 * @method _enhanceMarkup
	 * @static
	 * @private
	 */
	ORCHESTRAL.widget.DateTime._enhanceMarkup = function() {
		// If this method has already been called, bail out
		if (window.ORCHESTRAL_DATETIME_MARKUP_ENHANCED || ORCHESTRAL.widget.DateTime._markupEnhanced) {
			return;
		}

		ORCHESTRAL.widget.DateTime._markupEnhanced = true;

		// Exposes the markup enhanced flag to global window so that the flag is accessible when used as a yui2in3 module.
		if (typeof Y != "undefined" && Y.YUI2) {
			window.ORCHESTRAL_DATETIME_MARKUP_ENHANCED = ORCHESTRAL.widget.DateTime._markupEnhanced;
		}

		var classNames = ['OrchestralDate', 'OrchestralPartialDate', 'OrchestralTime', 'OrchestralDateTime'];
		for (var i = 0; i < classNames.length; i++) {
			var elements = Dom.getElementsByClassName(classNames[i], 'input');
			for (var j = 0; j < elements.length; j++) {
				new ORCHESTRAL.widget.DateTime(elements[j]);
			}
		}

		var div = document.createElement('div');
		div.id = 'OrchestralCalendar';
		div.style.display = 'none';
		div.style.position = 'absolute';
		document.body.appendChild(div);

		var hideCalendar = function(e) {
			div.style.display = 'none';
		};

		// Hide the calendar if the user hits the Escape key, or clicks anywhere out of the calendar.
		new YAHOO.util.KeyListener(document, { keys: YAHOO.util.KeyListener.KEY.ESCAPE }, {
			fn: hideCalendar,
			scope: this,
			correctScope: true
		}).enable();
		Event.on(document, 'click', function(e) {
			var target = Event.getTarget(e);
			if (target != div && !Dom.isAncestor(div, target)) {
				hideCalendar();
			}
		});
	};

	/**
	 * Gets the DateTime control associated with a given input field.
	 *
	 * @method get
	 * @param el {HTMLElement|String} Element or ID of element of input field.
	 * @return {DateTime} Associated DateTime instance.
	 * @static
	 */
	ORCHESTRAL.widget.DateTime.get = function(el) {
		ORCHESTRAL.widget.DateTime._enhanceMarkup();
		return ORCHESTRAL.util.Registry.get('ORCHESTRAL.widget.DateTime', Dom.get(el));
	};

	ORCHESTRAL.widget.DateTime._createCalendar = function(container, control) {
		var date = null,
			calendar = new YAHOO.widget.Calendar(container, {
				close: true,
				title: Locale.get('widget.datetime.calendar.title'),
				LOCALE_MONTHS: 'long',
				LOCALE_WEEKDAYS: 'medium',
				MONTHS_SHORT: Locale.get('util.date.months.short'),
				MONTHS_LONG: Locale.get('util.date.months.long'),
				MULTI_SELECT: false,
				START_WEEKDAY: Locale.get('widget.datetime.calendar.startDayOfWeek'),
				WEEKDAYS_MEDIUM: ORCHESTRAL.widget.DateTime._CALENDAR_WEEKDAYS
			});

		try {
			date = DateFormat.ISO_8601_DATE.parse(control._hiddenInput.value.substr(0, 10));
			if (!date && control._isPartialDateInput) {
				date = PartialDate.parse(control._hiddenInput.value);
			}
		} catch (e) {
			// Ignore invalid dates.
		}

		if (date instanceof PartialDate) {
			calendar.setMonth(date.month ? date.month - 1 : 0);
			calendar.setYear(date.year);
		} else {
			if (date instanceof Date) {
				calendar.select(date);
			} else {
				date = new Date();
				if (control._min && DateMath.before(date, control._min)) {
					date = control._min;
				}
				if (control._max && DateMath.after(date, control._max)) {
					date = control._max;
				}
			}
			calendar.setMonth(date.getMonth());
			calendar.setYear(date.getFullYear());
		}

		calendar.cfg.setProperty('mindate', control._min ? new Date(control._min) : null);
		calendar.cfg.setProperty('maxdate', control._max ? new Date(control._max) : null);

		calendar.renderEvent.subscribe(function(type, args, cal) {
			Event.on('calmonth', 'change', function(e) {
				cal.setMonth(+Dom.get('calmonth').value);
				cal.render();
			}, cal);

			Event.on('calyear', 'change', function(e) {
				cal.setYear(+Dom.get('calyear').value);
				cal.render();
			}, cal);

			// The setTimeout call in the following next/previous month handlers is because
			// previousMonth/nextMonth calls render which removes the HTML that generated
			// the event, resulting in an invalid event target in Firefox.
			Event.on('headernavleft', 'click', function(e) {
				Event.preventDefault(e);
				setTimeout(function() {
					cal.previousMonth();
					Dom.get('headernavleft').focus();
				}, 0);
			}, cal, true);
			Event.on('headernavright', 'click', function(e) {
				Event.preventDefault(e);
				setTimeout(function() {
					cal.nextMonth();
					Dom.get('headernavright').focus();
				}, 0);
			}, cal, true);
		}, calendar);

		// We override buildMonthLabel of YAHOO.widget.Calendar to provide drop-down
		// month and year pickers to provide quicker date selection for certain scenarios.
		// The years drop-down will range from 2 years in the future to 100 years in the past
		// unless explicit min and/or min dates have been set or the currently displayed calendar
		// is for a year outside that range.
		calendar.buildMonthLabel = function() {
			var monthNames = this.Locale.LOCALE_MONTHS,
				pageDate = this.cfg.getProperty('pagedate'),
				minDate = this.cfg.getProperty('mindate'),
				maxDate = this.cfg.getProperty('maxdate'),
				minYear = Math.min(minDate === null ? new Date().getFullYear() - 100 : minDate.getFullYear(), pageDate.getFullYear()),
				maxYear = Math.max(maxDate === null ? new Date().getFullYear() + 2 : maxDate.getFullYear(), pageDate.getFullYear());

			// YUI's next/previous month buttons are absolutely positioned. This results in the buttons
			// appearing above the select inputs that are wider (which may be caused by longer month names
			// in other languages, or rendering differences by different browsers on different platforms).
			// We provide our own buttons inline to avoid this problem.

			var text = '<a href="#" id="headernavleft">&nbsp;</a>';
			text += '<select id="calmonth">';

			for (var i = 0; i < monthNames.length; i++) {
				text += '<option value="' + i + '"' + (pageDate.getMonth() == i ? ' selected="selected"' : '') + '>' + monthNames[i] + '</option>';
			}

			text += '</select><select id="calyear">';

			for (var y = maxYear; y >= minYear; y--) {
				text += '<option value="' + y + '"' + (y == pageDate.getFullYear() ? ' selected="selected"' : '') + '>' + y + '</option>';
			}

			text += '</select>';
			text += '<a href="#" id="headernavright">&nbsp;</a>';

			return text;
		};

		calendar.render();

		// There is an area to the right of the next month button in IE 8 that triggers the
		// behaviour of the previous month button. This appears to be caused one of the empty
		// text nodes present so we strip them to get rid of the behaviour.
		Dom.getElementsByClassName('calheader', 'div', calendar.oDomContainer, function(el) {
			for (var i = 0; i < el.childNodes.length; i++) {
				var node = el.childNodes[i];
				if (node.nodeType == 3) {
					node.parentNode.removeChild(node);
				}
			}
		});

		return calendar;
	};

	/**
	 * Helper function to update error styling for the Hive skin.
	 *
	 * @method _updateErrorStyling
	 * @param el {HTMLElement|String}
	 * @static
	 * @private
	 */
	ORCHESTRAL.widget.DateTime._updateErrorStyling = function(el) {
		Dom[Dom.hasClass(el, 'OrchestralDateTimeRangeError') || Dom.hasClass(el, 'OrchestralDateTimeInvalidValueError') ? 'addClass' : 'removeClass'](el, 'ohp-date-time-invalid-error');
	};

	/**
	 * Configuration object used by the popup calendar page.
	 *
	 * @property ORCHESTRAL.widget.DateTime._popupConfig
	 * @static
	 * @type Object
	 * @private
	 */
	ORCHESTRAL.widget.DateTime._popupConfig = null;

	/**
	 * The weekday labels displayed on the calendar.
	 *
	 * @property ORCHESTRAL.widget.DateTime._CALENDAR_WEEKDAYS
	 * @static
	 * @type Array(String)
	 * @private
	 * @final
	 */
	ORCHESTRAL.widget.DateTime._CALENDAR_WEEKDAYS = (function() {
		return Locale.get('cow.datetime.label.calendar.dayColumnHeaders');
	})();

	/**
	 * The format to display date times in.
	 *
	 * @property ORCHESTRAL.widget.DateTime._DATE_TIME_DISPLAY_FORMAT
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @private
	 * @final
	 */
	ORCHESTRAL.widget.DateTime._DATE_TIME_DISPLAY_FORMAT = DateFormat.MEDIUM_DATE_TIME;

	/**
	 * The format to display dates in.
	 *
	 * @property ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @private
	 * @final
	 */
	ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT = DateFormat.MEDIUM_DATE;

	/**
	 * The format to display times in.
	 *
	 * @property ORCHESTRAL.widget.DateTime._TIME_DISPLAY_FORMAT
	 * @static
	 * @type ORCHESTRAL.util.DateFormat
	 * @private
	 * @final
	 */
	ORCHESTRAL.widget.DateTime._TIME_DISPLAY_FORMAT = DateFormat.MEDIUM_TIME;

	/**
	 * The interval for the DateTime widget to update the visible input following progromatic changes to the hidden
	 * input.
	 *
	 * @property ORCHESTRAL.widget.DateTime._POLLING_INTERVAL
	 * @static
	 * @type Number
	 * @private
	 */
	ORCHESTRAL.widget.DateTime._POLLING_INTERVAL = 500;

	ORCHESTRAL.widget.DateTime.prototype = {

		/**
		 * Does the display format end with a year?
		 */
		_DISPLAY_FORMAT_ENDS_WITH_YEAR: function() {
			var format = lang.trim(ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT._format);
			return format.charAt(format.length - 1).toLowerCase() == 'y';
		}(),

		/**
		 * Whether days will be parsed first for ambiguous dates.
		 */
		_DAYS_FIRST: Locale.get('widget.datetime.display.daysBeforeMonths'),

		setMin: function(min) {
			if (min && !this._isPartialDateInput) {
				if (this._isDateInput || (this._isDateTimeInput && min.length == 10)) {
					this._min = DateFormat.ISO_8601_DATE.parse(min);
				} else if (this._isTimeInput) {
					this._min = DateFormat.ISO_8601_TIME.parse(min);
				} else {
					this._min = DateFormat.ISO_8601_DATE_TIME.parse(min);
				}
			} else {
				this._min = null;
			}
			this._updateTooltip();
			this._validateRanges();
		},

		setMax: function(max) {
			if (max && !this._isPartialDateInput) {
				if (this._isDateInput) {
					this._max = DateFormat.ISO_8601_DATE.parse(max);
				} else if (this._isTimeInput) {
					this._max = DateFormat.ISO_8601_TIME.parse(max);
				} else {
					// If no max time information has been provided for this date/time allow any point in time in that day to be valid.
					this._max = DateFormat.ISO_8601_DATE_TIME.parse(max + (max.length == 10 ? 'T23:59:59' : ''));
				}
			} else {
				this._max = null;
			}
			this._updateTooltip();
			this._validateRanges();
		},

		/**
		 * Returns true if this date is valid.
		 *
		 * @method isValid
		 * @return {Boolean} True if this date is valid.
		 */
		isValid: function() {
			var isInvalid = (this._timeInput && Dom.hasClass(this._timeInput, 'OrchestralDateTimeInvalidValueError')) ||
					(this._timeInput && Dom.hasClass(this._timeInput, 'OrchestralDateTimeRangeError')) ||
					Dom.hasClass(this._dateInput, 'OrchestralDateTimeInvalidValueError') ||
					Dom.hasClass(this._dateInput, 'OrchestralDateTimeRangeError');

			return !isInvalid;
		},

		/**
		 * Adds the specified class to the correct DateTime input element(s)
		 *
		 * @method addClass
		 * @param className {String} the class name to add to the node's class attribute
		 */
		addClass: function(className) {
			if (this._dateInput) {
				Dom.addClass(this._dateInput, className);
			} if (this._timeInput) {
				Dom.addClass(this._timeInput, className);
			}
		},

		/**
		 * Removes the specified class from the correct DateTime input element(s)
		 *
		 * @method removeClass
		 * @param className {String} the class name to be removed from the node's class attribute
		 */
		removeClass: function(className) {
			if (this._dateInput) {
				Dom.removeClass(this._dateInput, className);
			}
			if (this._timeInput) {
				Dom.removeClass(this._timeInput, className);
			}
		},

		/**
		 * Sets the specified attribute to the correct DateTime input element(s)
		 *
		 * @method setAttribute
		 * @param attrName {String} name of attribute to set
		 * @param attrValue {String} attribute value to set
		 */
		setAttribute: function(attrName, attrValue) {
			// If setting the disabled attribute on the DateTime widget, the
			// OrchestralDatePicker icon will also need to be disabled
			var addingDisabled = (attrName === 'disabled') ? true : false;

			if (this._dateInput) {
				this._dateInput.setAttribute(attrName, attrValue);
				if (addingDisabled) {
					Dom.addClass(this._dateInput.nextSibling, 'disabled');
				}
			}
			if (this._timeInput) {
				this._timeInput.setAttribute(attrName, attrValue);
				if (addingDisabled) {
					Dom.addClass(this._timeInput.nextSibling, 'disabled');
				}
			}
		},

		/**
		 * Removes the specified attribute from the correct DateTime input element(s)
		 *
		 * @method removeAttribute
		 * @param attrName {String} name of attribute to remove
		 */
		removeAttribute: function(attrName) {
			// If removing the disabled attribute on the DateTime widget, the
			// disabled class on the OrchestralDatePicker icon will also need
			// to be removed
			var removingDisabled = (attrName === 'disabled') ? true : false;

			if (this._dateInput) {
				this._dateInput.removeAttribute(attrName);
				if (removingDisabled) {
					Dom.removeClass(this._dateInput.nextSibling, 'disabled');
				}
			}
			if (this._timeInput) {
				this._timeInput.removeAttribute(attrName);
				if (removingDisabled) {
					Dom.removeClass(this._timeInput.nextSibling, 'disabled');
				}
			}
		},

		/**
		 * Sets the date/time value. Updates both the displayed value, and the value attribute of the hidden input.
		 *
		 * @method setValue
		 * @param value {String} the date/time to set on the datetime widget in ISO 8601 format
		*/
		setValue: function(value) {
			value = value || '';
			// Resetting the last seen input value when input is programatically set, as if this is the same as the new
			// value, the visible input will not update.
			this._lastSeenHiddenInputValue = value ? '' : 'force_update';
			this._hiddenInput.value = value;
			this._updateView();
		},

		/**
		 * Update the control based on a new date entered by the user.
		 */
		_handleUserDateUpdate: function() {
			this._dateInput.value = lang.trim(this._dateInput.value);
			var date = this._parseDate(this._dateInput.value);
			if (!date && this._isPartialDateInput) {
				date = this._parsePartialDate(this._dateInput.value);
			}
			if (!date) {
				date = this._dateInput.value == '' ? null : new InvalidInput(this._dateInput.value);
			}
			this._updateDate(date);
			if (this._isDateTimeInput) {
				if (this._date instanceof Date && this._timeInput.value == '') {
					// Automatically populate the time field when the user enters a valid date as the server
					// will want to be submitted a full date/time value or nothing.
					if (this._min && this._getDate(this._date).getTime() == this._getDate(this._min).getTime()) {
						// There is a min date and the selected date is the same day as the min date. Set the time
						// field to the first valid time according to the min date value.
						this._timeInput.value = this._min.getHours() + ':' + this._min.getMinutes();
					} else {
						this._timeInput.value = '00:00';
					}
				}
				this._handleUserTimeUpdate();
			}
		},

		/**
		 * Update the control with the given date. The visible input will be set to the unambiguous representation of the date.
		 * @param date {Date} The value to set on the date input
		 * @param dateTimeSilent {Boolean} If true, no dateTimeChange event will be fired
		 * @private
		 */
		_updateDate: function(date, dateTimeSilent) {
			var previousDate = this._date;
			this._date = date;

			Dom[date instanceof InvalidInput ? 'addClass' : 'removeClass'](this._dateInput, 'OrchestralDateTimeInvalidValueError');
			ORCHESTRAL.widget.DateTime._updateErrorStyling(this._dateInput);

			var dateChanged;
			if (date instanceof Date) {
				this._dateInput.value = ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT.format(date);
				dateChanged = !(previousDate instanceof Date) || previousDate.getTime() != date.getTime();
			} else if (date instanceof PartialDate) {
				this._dateInput.value = date.formatDisplay();
				dateChanged = !(previousDate instanceof PartialDate) || (previousDate.year != date.year || previousDate.month != date.month);
			} else if (date instanceof InvalidInput) {
				this._dateInput.value = date.value;
				dateChanged = !(previousDate instanceof InvalidInput) || previousDate.value != date.value;
			} else { // we have a null date
				this._dateInput.value = '';
				dateChanged = previousDate !== null;
			}

			this._validateRanges();
			this._updateHiddenInput();

			if (dateChanged && this._initialised) {
				this.dateChangedEvent.fire(this._hiddenInput);
				if (!dateTimeSilent) {
					this.dateTimeChangedEvent.fire(this._hiddenInput);
				}
			}
			return dateChanged;
		},

		/**
		 * Update the control based on a new time entered by the user.
		 */
		_handleUserTimeUpdate: function() {
			this._timeInput.value = lang.trim(this._timeInput.value);
			var time = this._parseTime(this._timeInput.value);
			if (!time) {
				time = this._timeInput.value == '' ? null : new InvalidInput(this._timeInput.value);
			}
			this._updateTime(time);
		},

		/**
		 * Update the control with the given time. The visible input will be set to the unambiguous representation of the time.
		 * @param time {Date} The value to set on the time input
		 * @param dateTimeSilent {Boolean} If true, no dateTimeChange event will be fired
		 * @private
		 */
		_updateTime: function(time, dateTimeSilent) {
			var previousTime = this._time;
			this._time = time;

			Dom[time instanceof InvalidInput ? 'addClass' : 'removeClass'](this._timeInput, 'OrchestralDateTimeInvalidValueError');
			ORCHESTRAL.widget.DateTime._updateErrorStyling(this._timeInput);

			if (this._isDateTimeInput && this._date === null) {
				Dom[time !== null ? 'addClass' : 'removeClass'](this._dateInput, 'OrchestralDateTimeInvalidValueError');
				ORCHESTRAL.widget.DateTime._updateErrorStyling(this._dateInput);
			}

			var timeChanged;
			if (time instanceof Date) {
				this._timeInput.value = ORCHESTRAL.widget.DateTime._TIME_DISPLAY_FORMAT.format(time);
				timeChanged = !(previousTime instanceof Date) || previousTime.getTime() != time.getTime();
			} else if (time instanceof InvalidInput) {
				this._timeInput.value = time.value;
				timeChanged = !(previousTime instanceof InvalidInput) || previousTime.value != time.value;
			} else { // we have a null time
				this._timeInput.value = '';
				timeChanged = previousTime !== null;
			}

			this._validateRanges();
			this._updateHiddenInput();

			if (timeChanged && this._initialised) {
				this.timeChangedEvent.fire(this._hiddenInput);
				if (!dateTimeSilent) {
					this.dateTimeChangedEvent.fire(this._hiddenInput);
				}
			}
			return timeChanged;
		},

		/**
		 * Attempts to work out the date represented by a user entered string.
		 * @return the date, or null if no date could be determined
		 */
		_parseDate: function(str) {
			if (/^\d{8}$/.test(str)) {
				// We have an 8 digit date string.
				return this._validateDate(str.substr(this._DAYS_FIRST ? 0 : 2, 2), str.substr(this._DAYS_FIRST ? 2 : 0, 2), str.substr(4));
			}

			var parts = this._splitDateParts(str);

			if (parts.length != 3) {
				return null;
			}

			if (isNaN(parts[0])) {
				// The first part is text so could only be a month, so we have a "M d y" pattern.
				return this._validateDate(parts[1], parts[0], parts[2]);
			}

			if (+parts[0] > 31) {
				// The first part could only be a year, so we have a "y M d" pattern.
				return this._validateDate(parts[2], parts[1], parts[0]);
			}

			if (+parts[2] > 31 || this._DISPLAY_FORMAT_ENDS_WITH_YEAR) {
				// Only the last part could only be a year, or we have an ambiguous case and are treating
				// the last part as a year because the date display format ends with the year.

				if (+parts[0] > 12 || isNaN(parts[1])) {
					// The first part has to be a day and/or the second part is text and can only be a month,
					// so we have a "d M y" pattern.
					return this._validateDate(parts[0], parts[1], parts[2]);
				}

				if (+parts[1] > 12) {
					// The second part has to be a day, so we have a "M d y" pattern.
					return this._validateDate(parts[1], parts[0], parts[2]);
				}

				// The day and month are ambiguous.
				return this._validateDate(parts[this._DAYS_FIRST ? 0 : 1], parts[this._DAYS_FIRST ? 1 : 0], parts[2]);
			}

			// "y M d" is the only logical pattern we are left with, so we try that.
			return this._validateDate(parts[2], parts[1], parts[0]);
		},

		/**
		 * Attempts to work out a partial date represented by the user entered string.
		 * @return the partial date, or null if no date could be determined
		 */
		_parsePartialDate: function(str) {
			var parts = this._splitDateParts(str);

			if (parts.length == 1) {
				// If we only have one part we have to treat it as a year.
				return this._validatePartialDate(parts[0]);
			}

			if (parts.length == 2) {
				if (+parts[0] > 12 || isNaN(parts[1])) {
					// The first part could only be a year, or the second part is text and could only be a month,
					// so we have a "y M" pattern.
					return this._validatePartialDate(parts[0], parts[1]);
				}

				if (+parts[1] > 12 || isNaN(parts[0])) {
					// The second part could only be a year, or the first part is text and could only be a month,
					// so we have a "M y" pattern.
					return this._validatePartialDate(parts[1], parts[0]);
				}

				// We have an ambiguous case so treat the last part as the year if the date display format ends with the year.
				return this._validatePartialDate(parts[this._DISPLAY_FORMAT_ENDS_WITH_YEAR ? 1 : 0], parts[this._DISPLAY_FORMAT_ENDS_WITH_YEAR ? 0 : 1]);
			}

			return null;
		},

		/**
		 * Splits the given string into parts from may represent some combination of a year, month, and day.
		 * @return an array of the found parts
		 */
		_splitDateParts: function(str) {
			// The optional first period is for the case for some languages where short month names
			// can be abbreviated with a period.
			var parts = str.split(/\.?\s*[\-\.\/ ]\s*/);

			// The results for some strings will include an empty string due to differences in the
			// implementation of the split method across browsers. We filter these out.
			var filtered = [];
			for (var i = 0; i < parts.length; i++) {
				if (parts[i] != '') {
					filtered.push(parts[i]);
				}
			}
			return filtered;
		},

		/**
		 * Validates the date represented by the passed parameters. This will resolve
		 * the month parameter if given as name internally.
		 * @return the date represented by the parameters, or null if the paramters
		 * represented no valid date
		 */
		_validateDate: function(day, month, year) {
			if (!day || !month || !year) {
				return null;
			}

			day = +day;
			if (isNaN(day) || day === 0 || day > 31) {
				return null;
			}

			year = this._normaliseYear(year);
			month = this._normaliseMonth(month);

			if (!year || !month) {
				return null;
			}

			// The months used in constructing a JavaScript date are in the range 0-11.
			var date = new Date(year, month - 1, day);
			if (date.getMonth() != month - 1) {
				// The day of the month is bigger than the maximum days allowed for the month.
				return null;
			}

			return date;
		},

		/**
		 * Validates the partial date represented by the passed paramters. This will resolve
		 * the month parameter if given as name internally. The month parameter is optional.
		 * @return the partial date represented by the parameters, or null if the parameters
		 * represented no valid partial date
		 */
		_validatePartialDate: function(year, month) {
			year = this._normaliseYear(year);
			if (!year) {
				return null;
			}
			if (month) {
				month = this._normaliseMonth(month);
				if (!month) {
					return null;
				}
			}
			return month ? new PartialDate(year, month) : new PartialDate(year);
		},

		/**
		 * Normalises the user entered year part to a full year value.
		 * @return the normalised year or null if it could not be normalised
		 */
		_normaliseYear: function(year) {
			var len = year.length;
			if (!(len == 2 || len == 4)) {
				return null;
			}
			year = +year;
			if (isNaN(year)) {
				return null;
			}
			if (len == 2) {
				year = year + (year > 50 ? 1900 : 2000);
			}
			return year;
		},

		/**
		 * Normalises the user entered month part to a full month value in the range 1-12.
		 * @return the normalised month or null if it could not be normalised
		 */
		_normaliseMonth: function(month) {
			if (isNaN(month)) {
				month = this._getMonthFromText(month);
			}
			month = +month;
			if (month < 1 || month > 12) {
				return null;
			}
			return month;
		},

		/**
		 * Gets the number in the range 1-12 representing the given month.
		 * @return the number for the month, or null if no month could be determined
		 */
		_getMonthFromText: (function() {
			var normalize = function(s) {
				// Normalizes the input string so we can compare month names accent and case insensitively.
				var chars = Locale.get('util.date.normalizedChars');
				for (var key in chars) {
					if (chars.hasOwnProperty(key)) {
						s = s.replace(key, chars[key]);
					}
				}

				// The last replace removes the period that short month names for some languages end in (e.g. French).
				return s.replace(/\.$/, "").toLowerCase();
			};

			return function(str) {
				str = normalize(str);

				var candidate, i,
					longMonths = Locale.get('util.date.months.long'),
					shortMonths = Locale.get('util.date.months.short');

				for (i = 0; i < longMonths.length; i++) {
					if (str == normalize(longMonths[i])) {
						return i + 1;
					}
				}

				for (i = 0; i < shortMonths.length; i++) {
					var month = normalize(shortMonths[i]);
					if (str == month) {
						return i + 1;
					}

					// Some languages like French have some 4 character short month names. The following
					// allows users to enter 3 character month names that can unambiguously resolved to
					// a single month.
					if (month.indexOf(str) === 0 ||
						(month == 'juin' && str == 'jun') || // 'jun' and 'jul' are also a valid short month names for French, so we accept them as special cases.
						(month == 'juil' && str == 'jul')) {
						if (!candidate) {
							candidate = i + 1;
						} else {
							return null;
						}
					}
				}

				return candidate ? candidate : null;
			};
		})(),

		/**
		 * Attempts to work out the time represented by a user entered string.
		 * @return the date, or null if no time could be determined
		 */
		_parseTime: function(str) {
			var match = str.match(/^(.*\d)\s*(\D*)$/);

			if (!match) {
				// There are no digits in the time string, so it can't possibly be valid.
				return null;
			}

			// Determine the format of the time.

			var hour, min, sec,
				time = match[1], suffix = match[2] || '';

			if (/^\d{1,2}$/.test(time)) {
				hour = time;
				min = 0;
				sec = 0;
			} else if (/^\d{3}$/.test(time)) {
				hour = time.charAt(0);
				min = time.substr(1);
				sec = 0;
			} else if (/^\d{4}$/.test(time)) {
				hour = time.substr(0, 2);
				min = time.substr(2);
				sec = 0;
			} else if (/^\d{6}$/.test(time)) {
				hour = time.substr(0, 2);
				min = time.substr(2, 2);
				sec = time.substr(4);
			} else if (/^\d/.test(time)) {
				match = time.match(/^(\d{1,2}) ?h ?(\d{2})$/);
				if (match && suffix == '') {
					// French 24 hour format.
					// See http://en.wikipedia.org/wiki/Date_and_time_notation_by_country for further details.
					hour = match[1];
					min = match[2];
					sec = 0;
				} else {
					var parts = time.match(/^(\d+) *[:|\.]? *(\d+) *[:|\.]? *(\d+)?$/);
					if (!parts) {
						return null;
					}
					hour = parts[1];
					min = parts[2];
					sec = parts[3] || 0;
				}
			}

			// Check the hours, minutes, and seconds are all valid values.

			hour = +hour;
			min = +min;
			sec = +sec;
			if (isNaN(hour) || isNaN(min) || isNaN(sec)) {
				return null;
			}

			if (suffix != '') {
				if (!/^[ap]\.?m?\.?$/i.test(suffix)) {
					// The suffix does not match any am/pm variation.
					return null;
				}

				// Normalize the suffix to 'a' or 'p'.
				suffix = suffix.charAt(0).toLowerCase();
			}
			var maxHour = suffix == '' ? 24 : 12;
			if (hour < 0 || hour > maxHour || min < 0 || min > 59 || sec < 0 || sec > 59) {
				return null;
			}
			if (hour == maxHour && hour == 24) {
				if (min === 0 && sec === 0) {
					// 24[:00[:00]] was entered. We normalize this to 23:59:59 to avoid confusion and complication.
					return new Date(0, 0, 0, 23, 59, 59);
				}
				return null;
			}

			if (suffix == 'a' && hour == 12) {
				hour -= 12;
			}
			if (suffix == 'p' && hour != 12) {
				hour += 12;
			}

			return new Date(0, 0, 0, hour, min, sec);
		},

		/**
		 * Updates the hidden submit value for this control based on the currently parsed
		 * date and time components. If there was an error parsing the input of a user then
		 * the visible input is copied to the hidden input. This means it will get submitted
		 * to the server allowing the server to display the problematic entry back to them.
		 */
		_updateHiddenInput: function() {
			if (this._isDateInput && this._date instanceof InvalidInput) {
				this._hiddenInput.value = this._dateInput.value;
			} else if (this._isTimeInput && this._time instanceof InvalidInput) {
				this._hiddenInput.value = this._timeInput.value;
			} else if (this._date instanceof InvalidInput || this._time instanceof InvalidInput) {
				this._hiddenInput.value = lang.trim(this._dateInput.value + ' ' + this._timeInput.value);
			} else if (this._date && this._time) {
				this._hiddenInput.value = DateFormat.ISO_8601_DATE_TIME.format(this._getDateTime(this._date, this._time));
			} else if (this._date) {
				this._hiddenInput.value = this._date instanceof PartialDate ? this._date.formatISO() : DateFormat.ISO_8601_DATE.format(this._date);
			} else if (this._time) {
				this._hiddenInput.value = DateFormat.ISO_8601_TIME.format(this._time);
			} else {
				this._hiddenInput.value = '';
			}
			this._lastSeenHiddenInputValue = this._hiddenInput.value;
		},

		/**
		 * Updates the tooltip on the input fields with the allowed input ranges (if any).
		 */
		_updateTooltip: function() {
			var formatMessage = function() { return ''; };
			if (this._min && this._max) {
				formatMessage = function(format) {
					return lang.substitute(Locale.get('widget.datetime.minmax.hint'), [format.format(this._min), format.format(this._max)]);
				};
			} else if (this._min) {
				formatMessage = function(format) {
					return lang.substitute(Locale.get('widget.datetime.min.hint'), [format.format(this._min)]);
				};
			} else if (this._max) {
				formatMessage = function(format) {
					return lang.substitute(Locale.get('widget.datetime.max.hint'), [format.format(this._max)]);
				};
			}
			if (this._isDateInput) {
				this._dateInput.title = formatMessage.call(this, ORCHESTRAL.widget.DateTime._DATE_DISPLAY_FORMAT);
			} else if (this._isTimeInput) {
				this._timeInput.title = formatMessage.call(this, ORCHESTRAL.widget.DateTime._TIME_DISPLAY_FORMAT);
			} else if (this._isDateTimeInput) {
				var title = formatMessage.call(this, ORCHESTRAL.widget.DateTime._DATE_TIME_DISPLAY_FORMAT);
				this._dateInput.title = title;
				this._timeInput.title = title;
			}
		},

		_validateRanges: (function() {
			var sameDay = function(d1, d2) {
				return d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate();
			};

			var dateError = function() {
				Dom.addClass(this._dateInput, 'OrchestralDateTimeRangeError');
				Dom.addClass(this._dateInput, 'ohp-date-time-invalid-error');
			};
			var timeError = function() {
				Dom.addClass(this._timeInput, 'OrchestralDateTimeRangeError');
				Dom.addClass(this._timeInput, 'ohp-date-time-invalid-error');
			};

			return function() {
				if (this._isPartialDateInput) {
					// We can't perform range validation for partial dates.
					return;
				}

				if (!this._isDateInput) {
					Dom.removeClass(this._timeInput, 'OrchestralDateTimeRangeError');
					ORCHESTRAL.widget.DateTime._updateErrorStyling(this._timeInput);
				}
				if (!this._isTimeInput) {
					Dom.removeClass(this._dateInput, 'OrchestralDateTimeRangeError');
					ORCHESTRAL.widget.DateTime._updateErrorStyling(this._dateInput, 'error');
				}

				var validDate = this._date instanceof Date;
				var validTime = this._time instanceof Date;
				if (((this._isDateInput || this._isDateTimeInput) && !validDate) || (this._isTimeInput && !validTime)) {
					// We can only perform range validation for valid, non-empty values.
					return;
				}

				var dateTime;
				if (this._isTimeInput) {
					dateTime = this._getDateTime(new Date(0, 0, 0), this._time);
				} else if (this._isDateInput) {
					dateTime = this._getDate(this._date);
				} else {
					// If no time has been provided for a date/time input we need to take the last point in time of the day
					// for validating the input satisfies the maximum value.
					dateTime = this._getDateTime(this._date, validTime ? this._time : new Date(0, 0, 0, 23, 59, 59));
				}

				if (this._max && DateMath.after(dateTime, this._max)) {
					if (this._isDateInput) {
						dateError.apply(this);
					} else if (this._isTimeInput) {
						timeError.apply(this);
					} else if (sameDay(dateTime, this._max)) {
						if (validTime) {
							timeError.apply(this);
						} // else we do nothing as no time component has been entered so we can't determine if we are in the range
					} else {
						dateError.apply(this);
					}
				}

				if (this._isDateTimeInput && !validTime) {
					// If no time has been provided for a date/time input we need to take the first point in time of the day
					// for validating the input satisfies the minimum value.
					dateTime = this._getDate(this._date);
				}

				if (this._min && DateMath.before(dateTime, this._min)) {
					if (this._isDateInput) {
						//since it is just a date
						if(DateMath.before(DateMath.clearTime(dateTime), DateMath.clearTime(this._min))){
							dateError.apply(this);
						}
					} else if (this._isTimeInput) {
						timeError.apply(this);
					} else if (sameDay(dateTime, this._min)) {
						if (validTime) {
							timeError.apply(this);
						} // else we do nothing as no time component has been entered so we can't determine if we are in the range
					} else {
						dateError.apply(this);
					}
				}
			};
		})(),

		/**
		 * Return the given date with the time information normalized to midnight.
		 * @private
		 */
		_getDate: function(date) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
		},

		/**
		 * Return a date with the date information from the date argument and the time information from the time argument.
		 * @private
		 */
		_getDateTime: function(date, time) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
		},

		/**
		 * Update the visible datetime input to match the value of the hidden input.
		 * @private
		 */
		_updateView: function() {
			var value = this._hiddenInput.value,
				date = null,
				time = null,
				dateTime,
				dateUpdated,
				timeUpdated;

			if (value == this._lastSeenHiddenInputValue) {
				return;
			}

			if (this._isDateInput) {
				date = DateFormat.ISO_8601_DATE.parse(value);
				if (!date && this._isPartialDateInput) {
					date = PartialDate.parse(value);
				}
				if (!date) {
					date = value == '' ? null : new InvalidInput(value);
				}
				this._updateDate(date);
			} else if (this._isTimeInput) {
				time = DateFormat.ISO_8601_TIME.parse(value);
				if (!time) {
					time = value == '' ? null : new InvalidInput(value);
				}
				this._updateTime(time);
			} else {
				// it's a datetime
				if (value) {
					dateTime = DateFormat.ISO_8601_DATE_TIME.parse(value);
					if (dateTime) {
						date = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
						time = new Date(0, 0, 0, dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds());
					} else {
						// We have a date/time control with a hidden input value that isn't considered valid by the server side
						// (as one of the parts of the date/time has not been provided). We see if the value fits either just the
						// date or time component so we can extract it out and display it using the unambiguous representation in
						// the appropriate input for the purpose of improving the round trip user experience.
						date = DateFormat.ISO_8601_DATE.parse(value);
						if (!date) {
							// date was not valid, try time
							time = DateFormat.ISO_8601_TIME.parse(value);
							if (!time) {
								// no time either, mark the date part as invalid
								date = new InvalidInput(value);
							}
						}
					}
				}

				dateUpdated = this._updateDate(date, true);
				timeUpdated = this._updateTime(time, true);

				if ((dateUpdated || timeUpdated) && this._initialised) {
					this.dateTimeChangedEvent.fire(this._hiddenInput);
				}
			}
		}
	};

	lang.augment(ORCHESTRAL.widget.Date, YAHOO.util.EventProvider);
	lang.augment(ORCHESTRAL.widget.PartialDate, YAHOO.util.EventProvider);
	lang.augment(ORCHESTRAL.widget.Time, YAHOO.util.EventProvider);
	lang.augment(ORCHESTRAL.widget.DateTime, YAHOO.util.EventProvider);

	Event.onDOMReady(function() {
		ORCHESTRAL.widget.DateTime._enhanceMarkup();
	}

	);
})();

YAHOO.register("orchestral-datetime", ORCHESTRAL.widget.DateTime, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui2-dom",
        "yui2-event",
        "yui2-calendar",
        "yui2-orchestral",
        "ohp-locale-translations",
        "yui2-legacy-window",
        "yui2-logger"
    ]
});
