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
YUI.add('yui2-orchestral-autocomplete', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global ORCHESTRAL, YAHOO, window, document, clearTimeout*/
YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget for displaying an autocomplete control.
 *
 * @module orchestral-autocomplete
 * @requires yahoo, dom, autocomplete, connection, json, orchestral, orchestral-locale
 * @namespace ORCHESTRAL.widget
 * @title AutoComplete
 */
(function() {
	var lang = YAHOO.lang,
		// These letters have been lifted from https://github.com/yui/yui3/blob/master/src/text/js/text-data-wordbreak.js
		letters = 'A-Za-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F3\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BC0-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u303B\u303C\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790\uA791\uA7A0-\uA7A9\uA7FA-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Locale = ORCHESTRAL.util.Locale,
		KEY = YAHOO.util.KeyListener.KEY,
		escapeRegex = ORCHESTRAL.lang.escapeRegex,
		timeNow,

		AutoComplete;

	function markupMatch(s, re, matchCase, startDelimiter, endDelimiter, wordStartMatch) {
		return s.replace(new RegExp(re, 'g' + (matchCase ? '' : 'i')), function(match, p1, p2, p3) {
			if (wordStartMatch) {
				return (p1 ? '' : p2.charAt(0)) + startDelimiter + (p1 ? p1 : p3) + endDelimiter;
			}
			return startDelimiter + match + endDelimiter;
		});
	}

	function formatResult(result, query, matchCase, matchContains, matchWordStart) {

		var words,
			i;

		// matchContains and matchWordStart are mutually exclusive
		if (!matchWordStart) {
			result = markupMatch(result, (matchContains ? '' : '^') + escapeRegex(query), matchCase, '<strong>', '</strong>', false);
		} else {
			// We can't split with \W+ because it will only match on ASCII charaters.
			words = query.split(new RegExp('[^' + letters + ']+'));
			for (i = 0; i < words.length; i += 1) {
				if (words[i] == '') {
					continue;
				}

				// Only highlight matches for words in the query that are at the start of a word boundary.
				// Placeholders are used for the match delimiters to prevent false positives that otherwise might occur on
				// matching the start of the 'strong' tags when marking up matches for subsequent words.
				// We can't use \b to match the start of word boundaries because it only matches on ASCII characters.
				result = markupMatch(result, '(^' + escapeRegex(words[i]) + ')|([^' + letters + '](' + escapeRegex(words[i]) + '))',
					matchCase, '<<<', '>>>', true);
			}
			// Replace the match delimiter placeholders with the desired strong tags.
			result = result.replace(/<<</g, '<strong>').replace(/>>>/g, '</strong>');
		}

		// The result is wrapped in an extra div so we can use CSS to wrap proposals that are too wide.
		return '<div>' + result + '</div>';
	}

	function getHeightWithPadding(element) {
		return parseInt(Dom.getComputedStyle(element, 'height'), 10) + parseInt(Dom.getStyle(element, 'padding-top'), 10) +
			parseInt(Dom.getStyle(element, 'padding-bottom'), 10);
	}

	timeNow = Date.now || function() {
		return new Date().getTime();
	};

	/**
	 * A widget for displaying an autocomplete control.
	 *
	 * @class AutoComplete
	 * @constructor
	 * @param input {HTMLElement | String} DOM element reference of an input field.
	 * @param container {HTMLElement | String} DOM element reference of an existing DIV.
	 * @param dataSource {YAHOO.widget.DataSource} DataSource instance.
	 * @param config {Object} (optional) Object literal of configuration values.
	 * @extends YAHOO.widget.AutoComplete
	 */
	AutoComplete = function(input, container, dataSource, config) {
		if (!Dom.get(input)) {
			YAHOO.log('No input element passed to AutoComplete constructor', 'warn');
			return;
		}

		config = lang.merge({
			autoHighlight: true,
			// An iframe is required for IE 6 & 7 otherwise we run into odd proposal highlighting issues: http://jira/browse/COW-707
			useIFrame: ORCHESTRAL.env.ua.ie && ORCHESTRAL.env.ua.ie < 8,
			useShadow: false,
			animVert: false,
			queryDelay: 0.5,
			formatResult: function(result, query, resultMatch) {
				return formatResult(resultMatch, query, this.queryMatchCase, this.queryMatchContains, false);
			}
		}, config || {});
		config.formatResult = config.formatter || config.formatResult; // backwards compatibility

		/**
		 * @config formatter
		 * @description Optional formatting function that can be used to override the default formatting strategy.
		 * @default Default formatting function.
		 * @type Function
		 * @deprecated Use the <code>formatResult</code> property as defined by <code>YAHOO.widget.AutoComplete</code> instead.
		 */

		/**
		 * @config formatSelectedResult
		 * @description Formatting function used to format the selected value when forced selection is enabled.
		 * This <b>must</b> be specified in the configuration object passed to the AutoComplete constructor so
		 * controls that have a coded value selected correctly display it in its read-only representation.
		 * The function is passed a single parameter, the result object that represents the selected item.
		 * @type Function
		 */

		/**
		 * @config beforeItemSelect
		 * @description Function called prior to onItemSelect.
		 * The function is passed the following parameters:
		 * <ol>
		 * <li>result {Object} - the result object associated with the selected item.</li>
		 * <li>input {HTMLElement} - the input field associated with the AutoComplete control.</li>
		 * <li>searchText {String} - the text entered in the input field.</li>
		 * </ol>
		 * If this function returns <code>false</code> then <code>onItemSelect</code> will not be called.
		 * @type Function
		 * @deprecated Use onBeforeItemSelect instead.
		 */

		/**
		 * @config onBeforeItemSelect
		 * @description Function called prior to onItemSelect.
		 * The function is passed a single parameter, an object literal with the following keys:
		 * <ol>
		 * <li>control {ORCHESTRAL.widget.AutoComplete} - the associated AutoComplete control</li>
		 * <li>input {HTMLElement} - the input field associated with the AutoComplete control.</li>
		 * <li>result {Object} - the result object associated with the selected item.</li>
		 * <li>searchText {String} - the text entered in the input field.</li>
		 * </ol>
		 * If this function returns <code>false</code> <code>onItemSelect</code> will not be called.
		 * @type Function
		 */

		/**
		 * @config onItemSelect
		 * @description Name of parameter used to query DataSource.
		 * The function is passed a single parameter, an object literal with the following keys:
		 * <ol>
		 * <li>control {ORCHESTRAL.widget.AutoComplete} - the associated AutoComplete control</li>
		 * <li>input {HTMLElement} - the input field associated with the AutoComplete control.</li>
		 * <li>result {Object} - the result object associated with the selected item.</li>
		 * <li>searchText {String} - the text entered in the input field.</li>
		 * @type Function
		 */

		/**
		 * @config resultDisplayWindow
		 * @description Maximum number of proposals to display before a scrollbar is added to the proposals menu.
		 * @default 10
		 * @type Integer
		 */

		/**
		 * @config submitInput
		 * @description The hidden input that will contain the submit value for the AutoComplete when using forced selection.
		 * @type String | Element
		 */

		/**
		 * The free text value explicitly chosen by the user when using forced selection with free text support
		 * enabled.
		 * @property _freeText
		 * @type String
		 * @private
		 */
		this._freeText = null;

		/**
		 * The last key down code observed by the AutoComplete input.
		 * @property _lastKeyDownCode
		 * @type Integer
		 * @private
		 */
		this._lastKeyDownCode = null;

		/**
		 * Whether a request to the datasource that backs this control is in progress.
		 * @property _requestInProgress
		 * @type Boolean
		 * @private
		 */
		this._requestInProgress = false;

		/**
		 * The maximum number of proposals to display before a scrollbar is added to the proposals menu.
		 * @property _resultDisplayWindow
		 * @type Integer
		 * @private
		 */
		this._resultDisplayWindow = config.resultDisplayWindow || 10;

		/**
		 * The hidden submit input used for storing the selected value of AutoCompletes with forced selection
		 * enabled.
		 * @property _submitInput
		 * @type Element
		 * @private
		 */
		this._submitInput = Dom.get(config.submitInput);

		/**
		 * Whether focus is being toggled between the AutoComplete input and the free text link when using forced
		 * selection with free text support enabled.
		 * @property _togglingFocus
		 * @type Boolean
		 * @private
		 */
		this._togglingFocus = false;

		/**
		 * The value of the AutoComplete input if no proposal matches are found, or <code>null</code> if there are
		 * any proposal matches.
		 * @property _noMatchText
		 * @type String
		 * @private
		 */
		this._noMatchText = null;

		/**
		 * Whether free text entry is supported when using forced selection.
		 * @config allowFreeText
		 * @type Boolean
		 * @default false
		 */
		this.allowFreeText = false;

		var rawSearch,
			viewportHeight,
			result;

		AutoComplete.superclass.constructor.call(this, input, container, dataSource, config);
		input = this.getInputEl();

		// Populate the intitial state of the control according to the selected result.
		if (this.forceSelection && this._submitInput && this._submitInput.value != '') {
			result = YAHOO.lang.JSON.parse(this._submitInput.value);
			if (result.isFreeText) {
				this._freeText = result.text;
				input.value = result.text;
			} else {
				this._displaySelectedItem(result);
				input.value = result[this.dataSource.responseSchema.fields[0]];
			}
		}

		Event.on(input, 'paste', function() {
			// We're interested in the value of the input field after text is pasted into it instead of the pasted text because the
			// autocomplete proposals are based upon the field's whole value. The paste event happens before the input field has been
			// updated so we need to wait until after this event has been handled to check the value of the input field.
			lang.later(0, this, function() {
				if (this._sInitInputValue !== input.value) {
					this.sendQuery(input.value);
				}
			});
		}, null, this);

		this.textboxFocusEvent.subscribe(function() {
			// If forceSelection is enabled and only a single proposal is presented that matches the input text exactly
			// then when the input loses focus YUI will automatically insert the proposal. This triggers YUI to updated
			// the input value with that proposal and select the text in the input. The YUI code that implements with
			// the text selection for Internet Explorer will trigger an input focus event. By the time this event is
			// fired the proposal will be displayed as read-only and the input field will be hidden so we use this
			// knowledge to prevent triggering an uneccessary query.
			if (this.forceSelection && Dom.getStyle(input, 'display') != 'none') {
				// The textbox has free text in it and has received focus, so trigger
				// a query to display the matching proposals (if any).
				this.sendQuery(input.value);
			}
		});

		this.dataRequestEvent.subscribe(function() {
			if (!this.isFocused()) {
				return;
			}
			rawSearch = input.value;

			this._displayLoadingIndicator();
		});

		// Create a unique function on the instance (not the prototype) so that when the 'resize' event is detached in the destroy() method
		// we can unbind just this particular listener (rather than all listeners of the 'resize' event).
		this._onWindowResizeEvent =  function() {
			this._onWindowResizeHideResultsList();
		};

		// Collapse the container on window resize to prevent the result list potentially being detached from the autocomplete input
		Event.on(window, 'resize', this._onWindowResizeEvent, this, true);

		this.containerExpandEvent.subscribe(function() {
			// Position and size the width of the proposals relative to the input field.
			var xy = [Dom.getX(input), Dom.getY(input) + input.offsetHeight],
				body = this._elBody,
				content = this._elContent,
				scrollTop = Dom.getDocumentScrollTop(),
				minHeight,
				listItems,
				iframe;

			// Expanding the container may cause a window resize. Save the time we expanded the container so that we don't close the
			// container again in response to the potential window resize.
			this._containerExpandedAt = timeNow();

			Dom.setXY(this.getContainerEl(), xy);
			Dom.setXY(content, xy);
			Dom.setStyle(this.getContainerEl(), 'width', input.offsetWidth + 'px');

			listItems = this.getListEl().childNodes;

			// Resets any previous height. If user has subsequently changed scrollTop we don't want to still display a tiny menu.
			Dom.setStyle(content, 'height', 'auto');

			if (!listItems[this._resultDisplayWindow] || listItems[this._resultDisplayWindow].style.display == 'none') {
				// There are less or equal results than the configured amount to display at once. A scroll bar shouldn't appear
				// so we turn it off if there is one showing, and allow the proposals to occupy their natural height.
				Dom.setStyle(content, 'overflow-y', 'hidden');
				Dom.setStyle(body, 'height', 'auto');
			} else {
				// There are more results than the configured amount to display at once. Because of this we know a vertical scroll
				// bar will appear, so we set overflow-y to compulsorily display the scroll bar so the height calculation factors
				// in proposals that may have wrapped due to the scroll bar taking up horizontal space.

				// scrollbars should always be on the outer content container
				Dom.setStyle(content, 'overflow-y', 'scroll');
				// but here we want to limit height of the body list in the container
				Dom.setStyle(content, 'height', (Dom.getY(listItems[this._resultDisplayWindow]) - Dom.getY(listItems[0])) + 'px');

				// The user may have scrolled the autocompletion proposals so we need to make sure the first of the new proposals
				// is scrolled into view.
				body.scrollTop = 0;
			}

			// Don't let autocomplete proposals spill past the bottom of the page viewport.
			if (xy[1] + content.offsetHeight > scrollTop + viewportHeight) {
				Dom.setStyle(content, 'overflow-y', 'scroll');
				// unlike above, we limit height on the content container since there isn't enough room for the container
				if (listItems[1]) {
					minHeight = getHeightWithPadding(listItems[0]) + getHeightWithPadding(listItems[1]);
				} else {
					minHeight = getHeightWithPadding(content);
				}
				// The constant in this line accounts for the borders on the container.
				Dom.setStyle(content, 'height', Math.max(minHeight, scrollTop + viewportHeight - (xy[1] + 2)) + 'px');
			}

			if (this.useIFrame) {
				iframe = this._elIFrame;

				iframe.style.display = 'block'; // See the autocomplete CSS for why we set the display style here.
				Dom.setXY(iframe, xy);
				Dom.setStyle(iframe, 'height', content.offsetHeight + 'px');
				Dom.setStyle(iframe, 'width', content.offsetWidth + 'px');
			}
		});

		this.itemSelectEvent.subscribe(function(type, args) {
			var result = args[2],
				object;
			if (config.onItemSelect) {
				object = {
					control: this,
					input: input,
					result: result,
					searchText: rawSearch
				};

				// If there's a beforeItemSelect and it returns false, short circuit.
				// for, e.g. 'no result' items.
				if (config.onBeforeItemSelect && (config.onBeforeItemSelect(object) === false)) {
					return;
				}

				// config.beforeItemSelect is deprecated, this code is here for clients using the old API,
				// but this block will be deleted in a future release. Clients should use config.onBeforeItemSelect instead.
				// Assuming the result is an array of a certain length is not a safe assumption because the structure of
				// each result depends on the DataSource used.
				if (config.beforeItemSelect && (config.beforeItemSelect(object.result[1], object.input, object.searchText) === false)) {
					return;
				}

				config.onItemSelect(object);
			}

			if (this.forceSelection && this._submitInput) {
				this._submitInput.value = YAHOO.lang.JSON.stringify(result);
				this._displaySelectedItem(result);
			}
		});

		this.doBeforeLoadData = function(query, response/*, payload*/) {
			// We get the height of the viewport before expanding the container because expanding the container may change the viewport's
			// dimensions.
			viewportHeight = Dom.getViewportHeight();

			this._requestInProgress = false;
			this.setHeader(null);

			if (!this.forceSelection) {
				return true;
			}

			if (this.allowFreeText) {
				this.setFooter('<a href="#" tabIndex="-1">' + Locale.get('widget.autocomplete.useFreeText') + '</a>');

				Event.on(this._elFooter.firstChild, 'click', function(e) {
					// The user has made an explicit choice to use their text as entered.
					this._selectFreeText();
					this.collapseContainer();
					input.focus();
					Event.preventDefault(e);
				}, null, this);

				new YAHOO.util.KeyListener(this._elFooter.firstChild, { keys: KEY.UP }, {
					fn: function() {
						// Move focus back to the AutoComplete input and highlight the last proposal (if any).
						input.focus();
						if (this._nDisplayedItems > 0) {
							this._toggleHighlight(this.getListEl().childNodes[this._nDisplayedItems - 1], 'to');
						}
					},
					scope: this,
					correctScope: true
				}).enable();
				new YAHOO.util.KeyListener(this._elFooter.firstChild, { keys: KEY.TAB }, {
					fn: function() {
						// We are tabbing from the free text link so clear the AutoComplete input and move to the next field.
						this._clearSelection();
						this.collapseContainer();
					},
					scope: this,
					correctScope: true
				}).enable();
			}

			if (response.results.length === 0) {
				this._noMatchText = input.value;
				this.setHeader(Locale.get('widget.autocomplete.noMatches'));
				return false;
			}

			this._noMatchText = null;

			return true;
		};
	};
	lang.extend(AutoComplete, YAHOO.widget.AutoComplete, {
		destroy: function() {
			Event.removeListener(window, 'resize', this._onWindowResizeEvent);

			AutoComplete.superclass.destroy.call(this);
		},

		_clearSelection: function() {
			if (!this.forceSelection || !this.allowFreeText) {
				if (this._submitInput) {
					this._submitInput.value = '';
				}
				AutoComplete.superclass._clearSelection.call(this);
				return;
			}

			if (!this._requestInProgress && this.getInputEl().value.length >= this.minQueryLength && this._nDisplayedItems === 0) {
				// Automatically use the input value as free text because the minimum query length is satisfied and there are no matching
				// coded proposals.
				this._selectFreeText();
			}

			if (this.getInputEl().value != this._freeText) {
				// The user didn't explicitly make the decision to use their input value as free text, so clear it out.
				this._freeText = null;
				if (this._submitInput) {
					this._submitInput.value = '';
				}
				AutoComplete.superclass._clearSelection.call(this);
			}
		},

		_displayLoadingIndicator: function() {
			this.setHeader('<div class="yui-ac-loading">&nbsp;</div>');
			this.setFooter(null);
			this.clearList();
			this.expandContainer();
		},

		_displaySelectedItem: function(result) {
			// Hide the AutoComplete input and display the selected item as read-only text with a change link after it
			// for forced selection.

			var input = this.getInputEl(),
				height = input.offsetHeight,
				changeLink,
				span;

			Dom.setStyle(input, 'display', 'none');

			changeLink = document.createElement('a');
			changeLink.href = '#';
			changeLink.innerHTML = Locale.get('widget.autocomplete.change');

			span = document.createElement('span');
			span.innerHTML = this.formatSelectedResult(result) + ' ';
			span.appendChild(changeLink);

			Dom.insertAfter(span, input);

			// Prevent trailing content from jumping by setting the height of the selected item to the
			// same height as the input field.
			Dom.setStyle(span, 'display', 'inline-block');
			Dom.setStyle(span, 'min-height', height + 'px');

			if (this._lastKeyDownCode == KEY.TAB) {
				// A proposal was selected with the Tab key. The change link is removed from the tab order
				// so the browser will focus on the next input field, but it is added back into the tab
				// order once the remaining AutoComplete code has completed to allow the shift-tabbing back
				// to the change link.
				changeLink.tabIndex = -1;
				lang.later(0, null, function() {
					changeLink.tabIndex = null;
				});
			} else if (this._lastKeyDownCode) {
				// The input has been hidden so move keyboard focus to the change link. This is done
				// is delayed otherwise it interferes with the execution of some of the AutoComplete
				// code still to run.
				lang.later(0, null, function() {
					changeLink.focus();
				});
			}

			Event.on(changeLink, 'click', function(e) {
				Event.purgeElement(changeLink);
				input.parentNode.removeChild(Dom.getNextSibling(input));
				Dom.setStyle(input, 'display', 'inline');
				input.select();
				this.sendQuery(input.value);
				Event.preventDefault(e);
			}, null, this);
		},

		_moveSelection: function(keyCode) {
			if (this.forceSelection && this.allowFreeText && keyCode == KEY.DOWN) {
				var highlightedItem = this._elCurListItem;
				if (highlightedItem && this.getListItemIndex(highlightedItem) + 1 >= this._nDisplayedItems) {
					// The last proposal is highlighted, so move the focus to the free text link but keep the
					// AutoComplete proposals container open.
					this._togglingFocus = true;
					this._toggleHighlight({});
					this._elFooter.firstChild.focus();
					return;
				}
			}

			// The _moveSelection method ensures proposals selected using the up and down keys will be scrolled into view.
			AutoComplete.superclass._moveSelection.call(this, keyCode);
		},

		_onTextboxBlur: function(event, self) {
			if (self._togglingFocus) {
				// Focus is moving to the free text link, so don't trigger a blur on the textbox that would
				// cause the proposals to be closed.
				self._togglingFocus = false;
				return false;
			}
			AutoComplete.superclass._onTextboxBlur.call(this, event, self);
		},

		_onTextboxKeyDown: function(event, self) {
			switch (event.keyCode) {
				// Override the YUI AutoComplete control behaviour of selecting proposals with the right key
				// and clearing the proposal highlight when navigating the textbox with the left, home, and
				// end keys.
				case KEY.LEFT:
				case KEY.RIGHT:
				case KEY.HOME:
				case KEY.END:
					self.textboxKeyEvent.fire(self, event.keyCode);
					break;
				case KEY.DOWN:
					if (self.forceSelection && self.allowFreeText && self.isContainerOpen() && !self._requestInProgress &&
						self._nDisplayedItems === 0) {
						// Pressing down when no proposals are displayed moves focus to the free text link.
						self.togglingFocus = true;
						self._elFooter.firstChild.focus();
						break;
					}
					self._lastKeyDownCode = event.keyCode;
					AutoComplete.superclass._onTextboxKeyDown.call(this, event, self);
					break;
				default:
					self._lastKeyDownCode = event.keyCode;
					AutoComplete.superclass._onTextboxKeyDown.call(this, event, self);
			}
		},

		_onTextboxKeyUp: function(event, self) {

			var query,
				value;

			// Display the loading indicator immediately on a key event that changes the textbox value
			// and the miniumum query length is satisfied. The actual query will only be sent when the
			// query delay has elapsed from the latest key event.

			if (self._isIgnoreKey(event.keyCode)) {
				return;
			}

			query = this.value;
			if ((query && (query.length < self.minQueryLength)) || (!query && self.minQueryLength > 0)) {
				if (self._nDelayID != -1) {
					clearTimeout(self._nDelayID);
				}

				self.collapseContainer();

				return;
			}

			value = self.getInputEl().value;
			if (self._noMatchText && value.indexOf(self._noMatchText) === 0) {
				// The previously seen value had no proposal matches and the start of the current value
				// matches the start of the previously seen value. We return immediately because there
				// is no point querying the server because the current value can't possibly result in any
				// proposal matches being returned.
				self._noMatchText = value;
				return;
			}
			self._noMatchText = null;

			self._requestInProgress = true;
			self._displayLoadingIndicator();

			AutoComplete.superclass._onTextboxKeyUp.call(this, event, self);
		},

		_selectItem: function(li) {
			// A proposal selection has been made so clear out the free text value.
			this._freeText = null;
			AutoComplete.superclass._selectItem.call(this, li);
		},

		_selectFreeText: function() {
			this._freeText = this.getInputEl().value;
			this._submitInput.value = YAHOO.lang.JSON.stringify({
				isFreeText: true,
				text: this._freeText
			});
		},

		_onWindowResizeHideResultsList: function() {
			this._hidingBecauseOfResize = true;
			// Only collapse the container if the resize event wasn't triggered by the container being expanded recently.
			// 200ms because IE7 is sloooooow.
			if (!this._containerExpandedAt || (timeNow() - 200) > this._containerExpandedAt) {
				this.collapseContainer();
			}
		},

		/**
		 * Overridable method called to format the read-only representation of the selected item
		 * when using forced selection.
		 * @method formatSelectedResult
		 * @param result {Object} the result object associated with the selected item.
		 * @return {String} The formatted read-only representation of the selected item.
		 */
		formatSelectedResult: null
	});

	/**
	 * A result formatter that highlights matches in results at the start of word boundaries. The matching is case insensitive.
	 * @property AutoComplete.WORD_MATCH_HIGHLIGHT_FORMATTER
	 * @static
	 * @type Function
	 * @final
	 */
	AutoComplete.WORD_MATCH_HIGHLIGHT_FORMATTER = function(result, query, resultMatch) {
		return formatResult(resultMatch, query, false, true, true);
	};

	ORCHESTRAL.widget.AutoComplete = AutoComplete;
})();

YAHOO.register("orchestral-autocomplete", ORCHESTRAL.widget.AutoComplete, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui2-dom",
        "yui2-autocomplete",
        "yui2-connection",
        "yui2-json",
        "yui2-orchestral",
        "ohp-locale-translations"
    ]
});
