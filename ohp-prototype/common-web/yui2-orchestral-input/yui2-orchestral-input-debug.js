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
YUI.add('yui2-orchestral-input', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, document */
YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget for extending the behaviour of input elements.
 *
 * @module orchestral-input
 * @requires yahoo, dom, event, element, container, menu, orchestral, orchestral-locale
 * @optional datasource
 * @namespace ORCHESTRAL.widget
 * @title Input
 */
(function() {
	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		lang = YAHOO.lang,
		KEY = YAHOO.util.KeyListener.KEY,
		Locale = ORCHESTRAL.util.Locale,
		// maximum number of characters to show the remaining characters hint for
		MAX_HINT_REMAINING = 1000,
		NEWLINES_REGEX = /\r?\n|<br\s*\/?>/gi;

	function isNonNegativeNumber(val) {
		return lang.isNumber(val) && val >= 0;
	}

	/**
	 * A widget for extending the behaviour of input elements.
	 *
	 * @param el {HTMLElement|String} HTMLElement (or id of HTMLElement) of input element to extend.
	 * @param oConfig {Object} Configuration object literal.
	 * @class Input
	 * @constructor
	 * @extends YAHOO.util.Element
	 */
	var Input = function(el, oConfig) {
		var element = Dom.get(el);
		if (!element) {
			YAHOO.log('No element passed to Input constructor', 'warn');
			return;
		}

		if (!(element.tagName === 'TEXTAREA' || (element.tagName === 'INPUT' && element.type === 'text'))) {
			return;
		}
		this._previousValue = Dom.get(el).value;
		// Ensure the element has an ID for _showHint and _hideHint methods
		Dom.generateId(element);

		// We need to set up the _hint and _overlay elements before calling the superclass constructor in case they
		// get displayed when the config attributes are initialised.
		this._hint = document.createElement('div');

		Dom.addClass(this._hint, 'hint');
		Dom.insertAfter(this._hint, element);

		this._overlay = new YAHOO.widget.Overlay(this._hint, {
			context: [element, 'br', 'tr']
		});
		// Immediately call 'hide()' as unfortunately specifying 'visible: false' in the constructor doesn't seem to work.
		this._overlay.hide();

		Input.superclass.constructor.call(this, el, oConfig);

		// In IE7 if there is no maxlength attribute getAttribute('maxlength') will return 2147483647.
		// If we don't check for a falsey value of this.get('maxlength') we might accidentally replace
		// the intended value of maxlength with 2147483647.
		if (!this.get('maxlength') && YAHOO.util.Dom.getAttribute(element, 'maxlength')) {
			// added '+' before returned value to ensure type integer
			this.set('maxlength', +YAHOO.util.Dom.getAttribute(element, 'maxlength'));
		}

		lang.later(200, this, this._checkForUpdate, null, true);
		lang.later(1, this, this._checkForUpdate);

		/**
		 * Fires when the value of this element is updated.
		 *
		 * @event update
		 */

		/**
		 * Fires when a QuickText expansion is made.
		 *
		 * @event textExpanded
		 */

		/**
		 * Fires when the element is resized
		 *
		 * @event resized
		 */
	};

	lang.extend(Input, YAHOO.util.Element, {
		initAttributes: function(config) {
			Input.superclass.initAttributes.call(this, config);

			/**
			 * The minimum height of a resizable textarea, measured in pixels.
			 *
			 * @attribute minheight
			 * @type Number
			 * @default 50
			 */
			this.setAttributeConfig('minheight', {
				validator: isNonNegativeNumber,
				setter: function (val, name) {
					return this._resolveHeights(val, name);
				},
				value: 50
			});

			/**
			 * The maximum height of a resizable textarea, measured in pixels.
			 *
			 * @attribute maxheight
			 * @type Number
			 * @default 200
			 */
			this.setAttributeConfig('maxheight', {
				validator: isNonNegativeNumber,
				setter: function (val, name) {
					return this._resolveHeights(val, name);
				},
				value: 200
			});

			/**
			 * Maximum number of characters that the input element can contain.
			 *
			 * @attribute maxlength
			 * @type Number
			 */
			this.setAttributeConfig('maxlength', {
				validator: lang.isNumber,
				method: function(value) {
					var singleCharRemainingMsg = Locale.get('widget.input.singleCharacterRemaining'),
						multiCharRemainingMsg = Locale.get('widget.input.multipleCharactersRemaining'),
						singleCharTooManyMsg = Locale.get('widget.input.singleCharacterTooMany'),
						multiCharTooManyMsg = Locale.get('widget.input.multipleCharactersTooMany'),
						hintWarningClass = 'hint-warning';

					var isFocused = function(ele) {
							if ( document.activeElement ){
								return ele === document.activeElement;
							}
							else {
								return ele === document.focusNode;
							}
						},
						showCharsRemaining = function() {
							var element = this.get('element'),
								value = element.value,
								remaining = this._getCharsRemaining(value),
								message = '';

							if (value.length === 0 || remaining > MAX_HINT_REMAINING || (remaining >= 0 && !isFocused(element))) {
								// Don't show the hint until something is typed and characters remaining is less than the set maximum hint number
								// Also don't show the hint if characters are still remaining and the input is not in focus
								this._hideHint();
							} else {
								var hasWarningClass = Dom.hasClass(this._hint, hintWarningClass);
								if (remaining < 0 && !hasWarningClass) {
									Dom.addClass(this._hint, hintWarningClass);
								} else if (remaining >= 0 && hasWarningClass) {
									Dom.removeClass(this._hint, hintWarningClass);
								}

								if (remaining === 1) {
									message = singleCharRemainingMsg;
								} else if (remaining >= 0) {
									message = multiCharRemainingMsg;
								} else if (remaining === -1) {
									message = singleCharTooManyMsg;
								} else {
									message = multiCharTooManyMsg;
								}

								this._showHint(lang.substitute(message, [ Math.abs(remaining) ]));
							}
						};

					this.subscribe('update', showCharsRemaining, null, this);

					this.on('blur', function() {
						if (this._getCharsRemaining(this.get('element').value) >= 0) {
							this._hideHint();
						}
					}, this, true);

					if (this._getCharsRemaining(this.get('element').value) < 0) {
						showCharsRemaining.apply(this);
					}
				}
			});

			/**
			 * Boolean indicating if the element should resize to fit its content.
			 *
			 * Only applicable to textarea elements.
			 *
			 * @attribute resizable
			 * @type Boolean
			 * @default false
			 */
			this.setAttributeConfig('resizable', {
				validator: function(value) {
					return this.get('element').tagName === 'TEXTAREA' && lang.isBoolean(value);
				},
				method: function(value) {
					var element = this.get('element');

					if (value) {
						this.setStyle('overflow', 'hidden');
						this.setStyle('resize', 'none');
						this.setStyle('min-height', this.get('minheight') + 'px');

						this._clone = element.cloneNode(true);
						this._clone.removeAttribute('id');
						this._clone.removeAttribute('name');
						Dom.insertAfter(this._clone, element);
						Dom.addClass(this._clone, 'cow-off-screen-shim-element');
						Dom.addClass(this._clone, 'ohp-hidden');

						// Clear heights to remove style bias when calculating the height of the content
						Dom.setStyle(this._clone, 'height', '0');
						Dom.setStyle(this._clone, 'min-height', '0');

						if (ORCHESTRAL.env.ua.webkit) {
							// Redo the wrapping in the textarea to force the content to extend to the full width
							// Fix for Google Chrome on Windows.
							var text = element.value;
							element.value = '';
							element.value = text;
							this._clone.value = '';
							this._clone.value = text;

						}

						this._clone.tabIndex = -1;

						this.subscribe('update', this.resize, null, this);
						this.resize();
					} else {
						if (this._clone) {
							this._clone.parentNode.removeChild(this._clone);
							this._clone = null;
						}

						this.unsubscribe('update', this.resize);
					}
				},
				value: false
			});

			/**
			 * DataSource used for QuickText proposals.
			 *
			 * @attribute dataSource
			 * @type YAHOO.util.DataSource
			 */
			this.setAttributeConfig('dataSource', {
				validator: function(value) {
					return value instanceof YAHOO.util.DataSourceBase;
				},
				method: function(value) {
					var quickTextHint = Locale.get('widget.input.quickTextHint'),
						dataSource = value,
						menu,
						isProposalShortcut;

					// FIXME: What if this is displayed in a lightbox or other element with a higher zIndex?
					menu = new YAHOO.widget.Menu(Dom.generateId(), {
						classname: 'OrchestralTextExpansionMenu',
						maxheight: 250,
						position: 'dynamic',
						zIndex: 3
					});

					this.on('focus', function() {
						// Only show the QuickText Hint if maxlength is not enabled or
						// it is set but the no. of characters in the Input does not exceed the maxlength.
						if (!this.get('maxlength') || this._getCharsRemaining(this.get('element').value) >= 0) {
							Dom.removeClass(this._hint, 'hint-warning');
							this._showHint(quickTextHint);
						}
					}, this, true);

					this.on('blur', function() {
						// Only hide the hint overlay if maxlength is not enabled or
						// it is set but the no. of characters in the Input does not exceed the maxlength.
						if (!this.get('maxlength') || this._getCharsRemaining(this.get('element').value) >= 0) {
							this._hideHint();
						}
					}, this, true);

					isProposalShortcut = function(e) {
						return Event.getCharCode(e) === KEY.ENTER && e.ctrlKey;
					};

					this.on('keydown', function(e) {
						var keyCode = Event.getCharCode(e),
							item = null,
							next;

						if (!menu.cfg.getProperty('visible')) {
							if (isProposalShortcut(e)) {
								// Do this to stop the space character being written into text field.
								Event.stopEvent(e);
							}
							return;
						}

						switch (keyCode) {
							case KEY.UP:
							case KEY.DOWN:
								// Catch KEY.UP or KEY.DOWN and use this to move up and down the menu.
								// We need to do this because the input element has the focus and
								// will receive these events.
								Event.stopEvent(e);
								item = menu.activeItem;

								// No item is selected
								if (item === null) {
									if (keyCode === KEY.UP) {
										menu.hide();
									} else {
										// Select the first completion proposal
										menu.getItems()[0].cfg.setProperty('selected', true);
									}
									break;
								}

								next = (menu.getItems().length > 1) ? item['get' + (keyCode === KEY.UP ? 'Previous' : 'Next') +
									'EnabledSibling']() : item;

								if ((keyCode === KEY.UP && next.index < item.index) || (keyCode === KEY.DOWN && next.index > item.index)) {
									menu.clearActiveItem();
									next.cfg.setProperty('selected', true);
								} else if (keyCode === KEY.UP) {
									menu.clearActiveItem();
								}

								break;
							case KEY.ENTER:
							case KEY.TAB:
								item = menu.activeItem;
								if (item) {
									menu.activeItem.clickEvent.fire();
								}
								Event.stopEvent(e);
								menu.hide();
								break;
							case KEY.ESCAPE:
							case KEY.SPACE:
								Event.stopEvent(e);
								menu.hide();
								break;
							case KEY.DELETE:
								Event.stopEvent(e);
								return;
							case KEY.LEFT:
								if (TextSelection.getSelection(this.get('element')).text === '') {
									menu.hide();
								}
						}
					});

					this.on('keyup', function(e) {
						var keyCode = Event.getCharCode(e),
							selection,
							text,
							xy,
							autoInsertSingle;

						if (!menu.cfg.getProperty('visible') && !isProposalShortcut(e)) {
							return;
						}

						switch (keyCode) {
							case KEY.UP:
							case KEY.DOWN:
							case KEY.CONTROL:
								return;
							default:
								selection = TextSelection.getSelection(this.get('element'));
								text = selection.text;
								xy = selection.getXY();
								// If there is a single proposal match we will insert it automatically if there
								// isn't a proposal menu open as an affordance to the user.
								autoInsertSingle = !menu.cfg.getProperty('visible');

								menu.clearContent();
								menu.addItem(new YAHOO.widget.MenuItem('&nbsp;', { disabled: true, classname: 'Throbber Active' }));
								menu.render(this.get('element').parentNode);
								menu.setInitialSelection();
								menu.show();
								menu.moveTo(xy[0], xy[1]);

								dataSource.sendRequest(this.get('paramName') + '=' + text, {
									success: function(request, response) {
										var self = this,
											sText,
											resultsLength,
											selectItem,
											i,
											result,
											keyQuery,
											keyRemainder;

										// TODO: Do we need to check for a null response? If we do why not handle that case?
										if (response !== null) {
											menu.clearContent();
											resultsLength = response.results.length;

											if (resultsLength === 0) {
												menu.addItem(new YAHOO.widget.MenuItem(Locale.get('widget.input.noQuickTextMatches'), {
													disabled: true
												}));
											} else if (resultsLength === 1 &&
												text.toLowerCase() === response.results[0].code.toLowerCase() && autoInsertSingle) {

												sText = response.results[0].value.replace(NEWLINES_REGEX, '\n');

												selection.replace(sText);
												this.fireEvent('textExpanded', sText);
												this.fireEvent('update');
												menu.hide();
												return;
											} else {
												selectItem = function(e, args, obj) {
													var sText = obj.text.replace(NEWLINES_REGEX, '\n');
													selection.replace(sText);
													self.fireEvent('textExpanded', sText);
													self.fireEvent('update');
													menu.hide();
												};
												for (i = 0; i < resultsLength; i += 1) {
													result = response.results[i];

													keyQuery = result.code.substr(0, text.length);
													keyRemainder = result.code.substr(text.length);

													menu.addItem(new YAHOO.widget.MenuItem(result.value, {
														onclick: {
															fn: selectItem,
															obj: { text: result.value }
														},
														text: '<strong>' + keyQuery + '</strong>' + keyRemainder + ' - ' +
															self._escapeMenuItem(result.value),
														selected: (i === 0)
													}));
												}
											}
										}

										menu.render(this.get('element').parentNode);
										menu.setInitialSelection();
										menu.show();
										menu.moveTo(xy[0], xy[1]);
									},
									failure: function(request, response) {
										YAHOO.log('Request to dataSource failed: ' + response.statusText, 'error');
									},
									scope: this
								});
						}
					});

					// Prevent the up and down arrow key presses being passed through to the textarea.
					// Without this code the up and down arrows navigate both the menu and the cursor in
					// the textarea.
					this.on('keypress', function(e) {
						if (!menu.cfg.getProperty('visible')) {
							return;
						}

						switch (Event.getCharCode(e)) {
							case KEY.UP:
							case KEY.DOWN:
							case KEY.DELETE:
								Event.stopEvent(e);
								return;
						}
					});
				}
			});

			/**
			 * Query parameter name used to query the QuickText DataSource.
			 *
			 * @attribute paramName
			 * @type String
			 * @default text
			 */
			this.setAttributeConfig('paramName', {
				validator: lang.isString,
				value: 'text'
			});
		},

		/**
		 * Removes attached event listeners.
		 */
		destroy: function() {
			Event.purgeElement(this.get('element'), true);
			this._overlay.hide();

			for (var i = 0; i < this._interval.length; i++) {
				if (this._interval[i]) {
					this._interval[i].cancel();
				}
			}
		},

		/**
		 * @property _hint
		 * @type HTMLElement
		 * @private
		 */
		_hint: null,

		/**
		 * @property _overlay
		 * @type YAHOO.widget.Overlay
		 * @private
		 */
		_overlay: null,

		/**
		 * @property _interval
		 * @type Array
		 * @private
		 */
		_interval: [],

		/**
		 * @property _lastScrollTop
		 * @type Number
		 * @private
		 */
		_lastScrollTop: null,

		/**
		 * @property _previousValue
		 * @type String
		 * @private
		 */
		_previousValue: null,

		/**
		 * @property _previousHeight
		 * @type Number
		 * @private
		 */
		_previousHeight: 0,

		/**
		 * @property _clone
		 * @type HTMLElement
		 * @private
		 */
		_clone: null,

		/**
		 * Escapes content for HTML, and replaces new line characters and breaks with unescaped pilcrows, to enable a one line display.
		 * TODO: This is on the Input for test purposes - this whole class could use a giant refactor for testability.
		 * @method _escapeMenuItem
		 * @return The escaped string
		 * @private
		 */
		_escapeMenuItem: function(value) {
			var tokens = value.split(NEWLINES_REGEX),
				escapedTokens = [],
				j;

				for (j = 0; j < tokens.length; j += 1) {
					escapedTokens.push(ORCHESTRAL.lang.escapeHtml(tokens[j]));
				}
				return escapedTokens.join('&para;');
		},

		/**
		 * @method _getElementWidth
		 * @return The current width of the textarea.
		 * @private
		 */
		_getElementWidth: function() {
			if (ORCHESTRAL.env.ua.ie && ORCHESTRAL.env.ua.ie < 9) {
				// see doco below
				return this._getCalculatedElementWidth();
			} else {
				return Dom.getComputedStyle(this.get('element'), 'width');
			}
		},

		/**
		 * @method _getCalculatedElementWidth
		 * @return The current width of the textarea based on it's offsetWidth.
		 * Avoids using getComputedStyle for width, as that can prevent IE from
		 * scrolling down to newly typed characters.
		 * @private
		 */
		_getCalculatedElementWidth: function() {
			var	element =  this.get('element'),
				offsetWidth = parseInt(element.offsetWidth, 10),
				borderLeft,
				borderRight,
				paddingLeft,
				paddingRight,
				width;

			if (offsetWidth === 0) {
				// the offsetWidth will be 0 if it is hidden, in which case just use computed style
				// if its hidden, it won't create the bug described above anyway
				return Dom.getComputedStyle(element, 'width');
			} else {
				if (ORCHESTRAL.env.ua.ie === 6) {
					// in IE6 the computed style will return 2px even though it is actually only 1px
					// since we are setting the style, hard code here... but will need to be kept in sync
					borderLeft = 1;
					borderRight = 1;
				} else {
					borderLeft = parseInt(Dom.getComputedStyle(element, 'borderLeftWidth'), 10);
					borderRight = parseInt(Dom.getComputedStyle(element, 'borderRightWidth'), 10);
				}
				paddingLeft = parseInt(Dom.getComputedStyle(element, 'paddingLeft'), 10);
				paddingRight = parseInt(Dom.getComputedStyle(element, 'paddingRight'), 10);
				width = (offsetWidth - borderLeft - borderRight - paddingLeft - paddingRight) + 'px';
				return width;
			}
		},

		/**
		 * @method resize
		 */
		resize: function() {
			var textarea = this.get('element'),
				maxHeight = this.get('maxheight'),
				minHeight = this.get('minheight'),
				bufferHeight,
				contentHeight,
				newTextareaHeight,
				scrollType;

			// Buffer height - the space at the bottom of the text box between what you type and the bottom of the box.
			bufferHeight = 16;

			// IE 8 can't report offset height/widths for elements that are directly hidden.
			// See http://bugs.jquery.com/ticket/4512 and
			// https://github.com/csnover/jquery/commit/0229b83f7e5bf64edb2888ab349bedcd1a45e7c1#L0L281 for more details.
			if ((textarea.offsetWidth === 0 && textarea.offsetHeight === 0) || this.getStyle('display') === 'none') {
				// The textarea is not displayed so we poll until it is.
				lang.later(500, this, this.resize);
				return;
			}

			// Assigning the styles requred to clone in order to get accurate height
			Dom.removeClass(this._clone, 'ohp-hidden');
			this._clone.value = textarea.value;

			// This is necessary for IE7
			this._clone.scrollTop = 100000;

			Dom.setStyle(this._clone, 'overflow-y', this.getStyle('overflow-y'));
			Dom.setStyle(this._clone, 'width', this.getStyle('width'));

			contentHeight = this._clone.scrollHeight;

			// When contentHeight is bigger than the maximumHeight
			if (contentHeight > maxHeight) {
				// Reset the textarea height from the result of the update
				newTextareaHeight =  maxHeight ;

				// Set Scroll Type
				scrollType = 'auto';
			}

			// When contentHeight is within the bufferHeight of (but still less than) the maximum height
			else if ((contentHeight + bufferHeight) > maxHeight) {
				// calculate sensible new height.
				newTextareaHeight = maxHeight;

				// Set Scroll Type
				scrollType = 'hidden';
			}

			// When contentHeight is more than the bufferHeight less than the maximum height
			else {
				// Do nothing, but ensure the minHeight is enforced
				newTextareaHeight = Math.max(contentHeight + bufferHeight, minHeight);

				// Set Scroll Type
				scrollType = 'hidden';
			}

			// Set the final attributes on the visible textarea.
			this.setStyle('height', newTextareaHeight + 'px');
			this.setStyle('overflow-y', scrollType);

			// Rehide the element.
			Dom.addClass(this._clone, 'ohp-hidden');
		},

		/**
		 * Re-aligns the hint to the top right corner of the input element.
		 *
		 * @method _positionHint
		 * @private
		 */
		_positionHint: function() {
			// Move the hint down 1px (the 1 in the last argument) so it overlaps the top border of the input, making it look
			// integrated with the input.
			this._overlay.align('br', 'tr', [0, 1]);
		},

		/**
		 * @method _showHint
		 * @param {String} message
		 * @private
		 */
		_showHint: function(message) {
			this._hint.innerHTML = message;

			// Just let the hint size to it's message content, rather than forcing an arbitrary size.

			this._positionHint();
			this._overlay.show();

			// By default Overlay.show() will set visibility to visible, which means that the overlay wll show
			// even if it is contained in an element with visibility: hidden. Set visibility to inherit so that
			// it will not be visible when its container is invisible.
			Dom.setStyle(this._hint, 'visibility', 'inherit');

			var id = this.get('element').id;
			if (!this._interval[id]) {
				// If the window has been resized, or new elements have been added to or removed from the page
				// then a page reflow might cause the hint to be incorrectly positioned. Set the position every
				// 200ms to deal with this.
				this._interval[id] = lang.later(200, this, this._positionHint, null, true);
			}
		},

		/**
		 * @method _hideHint
		 * @private
		 */
		_hideHint: function() {
			var id = this.get('element').id;

			this._overlay.hide();

			if (this._interval[id]) {
				this._interval[id].cancel();
				this._interval[id] = null;
			}
		},

		/**
		 * @method _checkForUpdate
		 * @private
		 */
		_checkForUpdate: function() {
			var element = this.get('element'),
				currValue = element.value,
				prevValue = this._previousValue;

			if (prevValue === null || currValue != prevValue) {
				this._previousValue = currValue;
				this.fireEvent('update');
			}
		},

		/**
		 * Resolves the circular reference between minheight and maxheight
		 * by always having the minheight as the reference value.
		 * This function is called both on minheight and maxheight setter methods.
		 *
		 * @method _resolveHeights
		 * @param {Number} heightValue
		 * @param {String} attributeName
		 * @returns {Number}
		 * @private
		 */
		_resolveHeights: function (heightValue, attributeName) {
			var minHeight,
				maxHeight;

			if (attributeName === 'minheight') {
				minHeight = heightValue;
				maxHeight = this.get('maxheight');
				if (minHeight > maxHeight) {
					this.set('maxheight', minHeight);
				}
				return minHeight;
			} else if (attributeName === 'maxheight') {
				minHeight = this.get('minheight');
				maxHeight = heightValue;
				return minHeight > maxHeight ? minHeight : maxHeight;
			}
		},

		/**
		 * Calculates the difference between the number of characters
		 * in the Input element versus the maxlength attribute setting.
		 * If maxlength is not set, this function will just return zero.
		 * This function is used on focus and blur events of both the
		 * datasource and maxlength attribute methods.
		 *
		 * @method _getCharsRemaining
		 * @param {String} text
		 * @returns {Number}
		 * @private
		 */
		_getCharsRemaining: function (text) {
			// In IE/Windows line endings are represented as \r\n. Ideally we would replace all instances of \r\n with \n, but due to a bug in
			// Internet Explorer, IE will revert the line endings in a TEXTAREA to its platform-specific preference (described by Simon Willison here -
			// http://www.sitepoint.com/blogs/2004/02/16/line-endings-in-javascript/). Counting a line ending as 2 characters is likely to confuse users
			// so copy the contents of the TEXTAREA to a local variable, convert line endings on the local variable to avoid the bug and present the
			// length of the text in the local variable to the user.
			var normalizedText = text.replace(/(\r\n|\r|\n)/g, '\r\n'),
				maxLength = this.get('maxlength');
			return maxLength ? maxLength - normalizedText.length : 0;
		}

	});

	ORCHESTRAL.widget.Input = Input;

	/**
	 * Represents text selected within a input[type="text"] or textarea element.
	 *
	 * @param {String} sText Selected text.
	 * @param {HTMLElement|String} el ID or element reference of a text or textarea element.
	 * @param {int} iStart Character offset of start of selection.
	 * @param {int} iEnd Character offset of end of selection.
	 * @param {int} iX (optional)
	 * @param {int} iY (optional)
	 * @namespace ORCHESTRAL.widget
	 * @class TextSelection
	 * @constructor
	 * @private
	 */
	var TextSelection = function(sText, el, iStart, iEnd, iX, iY) {
		/**
		 * Selected text.
		 *
		 * @property text
		 * @type String
		 */
		this.text = sText || '';

		/**
		 * Element that contains the selected text.
		 *
		 * @property _element
		 * @type HTMLElement
		 * @private
		 */
		this._element = Dom.get(el);

		/**
		 * Character offset of start of selection.
		 *
		 * @property _start
		 * @type int
		 * @private
		 */
		this._start = iStart;

		/**
		 * Character offset of end of selection.
		 *
		 * @property _end
		 * @type int
		 * @private
		 */
		this._end = iEnd;

		/**
		 * x co-ordinate of selection.
		 *
		 * @property _x
		 * @type int
		 * @private
		 */
		this._x = iX;

		/**
		 * y co-ordinate of selection.
		 *
		 * @property _y
		 * @type int
		 * @private
		 */
		this._y = iY;
	};

	TextSelection.prototype = {
		/**
		 * Replaces the selected text with a new String.
		 *
		 * @method replace
		 * @param {String} sText
		 */
		replace: function(sText) {
			var scrollTop = this._element.scrollTop;

			if (document.selection) {
				// IE-specific code
				this._element.focus();
				var range = document.selection.createRange();

				// If user hasn't selected text, and this.text is the word before the cursor
				if (this.text != range.text) {
					range.moveStart('character', -1 * (this.text.length));
				}
				range.text = sText;
				range.select();
				range.moveEnd('character', sText.length);
				range.moveStart('character', sText.length);
			} else {
				// Firefox-code
				this._element.value = this._element.value.substr(0, this._start) + sText + this._element.value.substr(this._end, this._element.value.length);

				this._element.select();
				this._element.focus();

				// With FF cursor stays in its original position so we need to move it to the end of the replaced text.
				var pos = this._start + sText.length;

				this._element.setSelectionRange(pos, pos);

				// If content has scrolled this ensures that textarea does not scroll back to the top when text is replaced.
				var y = TextSelection.getSelection(this._element).getXY()[1] - Dom.getY(this._element) - this._element.offsetHeight;

				// If the y co-ordinate of the selection is greater than scrollTop then we need to scroll further down.
				this._element.scrollTop = Math.max(scrollTop, y);
			}

			this.text = sText;
		},

		/**
		 * Gets the X and Y co-ordinate of the bottom left of the selection.
		 *
		 * @method getXY
		 * @return {Array}
		 */
		getXY: function() {
			var elementPosition = Dom.getXY(this._element);
			var div = document.createElement('div');

			Dom.setStyle(div, 'border', '1px solid gray');
			Dom.setStyle(div, 'padding', '2px');
			Dom.setStyle(div, 'font-family', Dom.getStyle(this._element, 'font-family'));
			Dom.setStyle(div, 'font-weight', Dom.getStyle(this._element, 'font-weight'));
			// IE always shows scroll bars so we need to apply scroll to the div otherwise show scroll when overflow.
			Dom.setStyle(div, 'overflow', YAHOO.env.ua.ie ? 'scroll' : 'auto');
			Dom.setStyle(div, 'font-size', Dom.getStyle(this._element, 'font-size'));
			Dom.setStyle(div, 'width', (this._element.offsetWidth - TextSelection.WIDTH_OFFSET) + 'px');
			Dom.setStyle(div, 'height', this._element.offsetHeight + 'px');

			div.innerHTML = ORCHESTRAL.lang.escapeHtml(this._element.value.substr(0, this._start)).replace(/\n/g, '<br>') + '<span class="cursor">&nbsp;</span>';
			this._element.parentNode.appendChild(div);

			var cursor = Dom.getElementsByClassName('cursor', 'span', div)[0];
			var divPosition = Dom.getXY(div);
			var positionXY = Dom.getXY(cursor);
			var difference = [positionXY[0] - divPosition[0], positionXY[1] - divPosition[1] - this._element.scrollTop];
			this._element.parentNode.removeChild(div);
			return [(elementPosition[0] + difference[0]), (elementPosition[1] + difference[1] + TextSelection.PADDING)];
		}
	};

	lang.augmentObject(TextSelection, {
		/**
		 * Padding
		 *
		 * @property PADDING
		 * @type int
		 * @static
		 * @private
		 */
		PADDING: 17,

		/**
		 * FireFox Width Offset
		 *
		 * @property WIDTH_OFFSET
		 * @type int
		 * @static
		 * @private
		 */
		WIDTH_OFFSET: 8,

		/**
		 * Gets the current text selection.
		 *
		 * @method getSelection
		 * @param {HTMLElement} element the element to get the current text selection from
		 * @return {ORCHESTRAL.widget.ElementSelection}
		 * @static
		 */
		getSelection: function(element) {
			var text = '';
			var start = -1;
			var end = -1;
			var range = null;

			// We need to handle this in a browser-specific way because IE and FF provide access to the text selection in different ways.
			// http://www.quirksmode.org/dom/range_intro.html provides some more information on this.

			if (document.selection) {
				// IE-specific code to get the text selection.
				range = document.selection.createRange();

				if (element.value !== '') {
					if (range.text.length > 0) {
						// This is the easiest case - if they user has selected text then this is the selection.
						text = range.text;
					} else {
						// Otherwise we select the word immediately before the cursor position.
						range.moveStart('character', -1);

						if (range.text.length === 1) {
							if (/\W/.test(range.text.charAt(0))) {
								range.moveStart('character', 1);
								text = '';
							} else {
								range.moveStart('character', 1);
								range.moveStart('word', -1);
								text = range.text;
							}
						} else {
							range.moveStart('character', 1);
						}
						text = range.text;
					}
				}

				if (element.tagName === 'TEXTAREA') {
					// From http://the-stickman.com/web-development/javascript/finding-selection-cursor-position-in-a-textarea-in-internet-explorer/
					var duplicate = range.duplicate();
					duplicate.moveToElementText(element);
					duplicate.setEndPoint('EndToEnd', range);

					start = duplicate.text.length - text.length;
					end = duplicate.text.length;
				} else {
					start = range.offsetLeft - 1;
					end = text.length;
				}

				return new TextSelection(text, element, start, end, range.offsetLeft, range.offsetTop);
			}

			var delta = 0;

			start = element.selectionStart;
			end = element.selectionEnd;

			if (start === end) {
				// Select the word immediately before the cursor.
				delta--;

				var c = 0;

				while ((c = start + delta) > -1 && ! /\W/.test(element.value.charAt(c))) {
					delta--;
				}

				delta++;
			}

			start += delta;

			range = document.createRange();
			range.setStart(element, 0);
			range.setEnd(element, 0);

			text = element.value.substring(start, end);

			return new TextSelection(element.value.substring(start, end), element, start, end);
		}
	});

	/**
	 * Standard Orchestral Resizing Textarea.
	 *
	 * @class ResizingTextarea
	 * @deprecated Use ORCHESTRAL.widget.Input instead
	 * @constructor
	 * @param {HTMLElement | String} textarea the textarea element to make into a resizing textarea
	 * @param {Object} conf the configuration object (optional)
	 */
	ORCHESTRAL.widget.ResizingTextarea = function(textarea, conf) {
		var config = YAHOO.lang.merge({ resizable: true }, conf || {});

		// Change legacy configuration attributes to those expected by ORCHESTRAL.widget.Input
		if (config.minHeight) {
			config.minheight = config.minHeight;

			delete config.minHeight;
		}

		if (config.maxHeight) {
			config.maxheight = config.maxHeight;

			delete config.maxHeight;
		}

		return new ORCHESTRAL.widget.Input(textarea, config);
	};


	/**
	 * A widget providing text expansion functionality.
	 *
	 * DataSource should return a set of code, value pairs based on the the paramName specified in the config.
	 *
	 * @param {HTMLElement|String} el HTMLElement (or id of HTMLElement) that will provide TextExpansion behavior.
	 * @param {YAHOO.util.DataSource} oDataSource DataSource that will be used to provide matching text expansions.
	 * @param {Object} oConfig Configuration object literal.
	 * @class TextExpansion
	 * @deprecated Use ORCHESTRAL.widget.Input instead
	 * @constructor
	 */
	ORCHESTRAL.widget.TextExpansion = function(el, oDataSource, oConfig) {
		var config = YAHOO.lang.merge({ dataSource: oDataSource }, oConfig || {});

		return new ORCHESTRAL.widget.Input(el, config);
	};


	/**
	 * Standard Orchestral Constrained Textarea.
	 *
	 * @class ConstrainedTextarea
	 * @deprecated Use ORCHESTRAL.widget.Input instead
	 * @constructor
	 * @param {HTMLElement | String | Array} elem the element, element id, array of elements, or array of element ids of the textarea(s) to constrain.
	 */
	ORCHESTRAL.widget.ConstrainedTextarea = function(elem) {
		if (YAHOO.lang.isArray(elem)) {
			for (var i = 0; i < elem.length; i++) {
				new ORCHESTRAL.widget.ConstrainedTextarea(elem[i]);
			}
		} else {
			elem = YAHOO.util.Dom.get(elem);

			return new ORCHESTRAL.widget.Input(elem);
		}
	};
})();

YAHOO.register('orchestral-input', ORCHESTRAL.widget.Input, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui2-dom",
        "yui2-event",
        "yui2-element",
        "yui2-container",
        "yui2-menu",
        "yui2-orchestral",
        "ohp-locale-translations"
    ]
});
