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
YUI.add('yui2-orchestral-datatable', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*global YAHOO, ORCHESTRAL, YUI, document, Modernizr */

YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget for displaying a data table.
 *
 * @module orchestral-datatable
 * @requires yahoo, yui, element, datasource, paginator, event-mouseenter, datatable, orchestral, orchestral-autorefresh, orchestral-dom, orchestral-locale, orchestral-button, orchestral-form, animation
 * @namespace ORCHESTRAL.widget
 * @title DataTable
 */
(function() {

	var lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Locale = ORCHESTRAL.util.Locale,
		Paginator = YAHOO.widget.Paginator,
		SELECTED_COLUMN_KEY = 'selected',
		_createCommentPopover;

	_createCommentPopover = (function() {
		var _useCalled = false,
			_callbacks = [],
			_commentPopover;

		function _onUseComplete(Y) {
			var bodyNode = Y.one(Y.config.doc.body),
				callback;

			// This popover is only used when formatComment defined for a table column.
			_commentPopover = new Y.OHP.Popover({
				trigger: {
					delegate: {
						el: bodyNode,
						// This markup is setup in formatComment.
						filter: '.ohp-comment'
					},
					handler: function(triggerNode) {
						this.set('bodyContent', triggerNode.one('.value').getContent());
					}
				},
				zIndex: 4
			});

			_commentPopover.plug(Y.OHP.Constraint, {
				maxWidth: '300px',
				maxHeight: '200px'
			});

			// If no body set, then "loading" class is applied. This is not removed when bodyContent is set in handler function.
			// TODO: better way to do this? - e.g. should fix this through a listener in the popover.
			_commentPopover.set('bodyContent', '');

			_commentPopover.render();

			if (Modernizr.touch) {
				// Creates a larger trigger area on the iPad, as the entire td cell
				// rather than just the comment icon.
				bodyNode.delegate('touchend', function(e) {
					var target = e.currentTarget,
						triggerNode = target.one('.ohp-comment');

					if (triggerNode) {
						_commentPopover.setAttrs({
							bodyContent: triggerNode.one('.value').getContent()
						});
						_commentPopover.delayedShow({
							triggerNode: triggerNode
						});
					}
				}, 'td.ohp-dt-col-type-comments', self);
			}

			while ((callback = _callbacks.pop())) {
				callback(_commentPopover);
			}
		}

		return function(callback) {
			if (_commentPopover) {
				callback(_commentPopover);
			} else {
				_callbacks.push(callback);

				if (!_useCalled) {
					YUI().use('node-base', 'event-delegate', 'ohp-popover', 'ohp-constraint', _onUseComplete);
					_useCalled = true;
				}
			}
		};
	}());

	/**
	 * A pre-configured XHRDataSource for data tables.
	 *
	 * @class XHRDataSource
	 * @namespace ORCHESTRAL.widget.DataTable
	 * @extends YAHOO.util.XHRDataSource
	 * @constructor
	 * @param url {String} The url to connect to in order to retrieve table data.
	 */
	var XHRDataSource = function(url) {
		return new YAHOO.util.XHRDataSource(url, {
			connMethodPost: true,
			connTimeout: 45000,
			connXhrMode: 'ignoreStaleResponses',
			responseType: YAHOO.util.DataSource.TYPE_JSON,
			responseSchema: {
				resultsList: 'data',
				metaFields: {
					totalRecords: 'totalRecords'
				}
			}
		});
	};

	/**
	 * A widget for displaying a data table.
	 *
	 * @class DataTable
	 * @namespace ORCHESTRAL.widget
	 * @extends YAHOO.widget.DataTable
	 * @constructor
	 * @param el {HTMLElement | String} DOM reference for the table.
	 * @param columnDefs {Object[]} Array of object literal Column definitions.
	 * @param dataSource {YAHOO.util.DataSource} DataSource instance.
	 * @param config {Object} (optional) Object literal of configuration values.
	 */
	var DataTable = function(el, columnDefs, dataSource, config) {
		if (!Dom.get(el)) {
			YAHOO.log('No element passed to DataTable constructor', 'warn');
			return;
		}

		config = lang.merge({
			MSG_EMPTY: Locale.get('widget.datatable.empty.message'),
			MSG_SORTASC: Locale.get('widget.datatable.sort.ascending'),
			MSG_SORTDESC: Locale.get('widget.datatable.sort.descending'),
			naturalwidth: Dom.hasClass(el, 'natural-content-width')
		}, config || {});

		columnDefs = YAHOO.widget.DataTable._cloneObject(columnDefs);

		/**
		 * Whether the DataTable should size to content, rather than min-width applying. Write once.
		 * @config naturalwidth
		 * @type Boolean
		 */
		Dom[config.naturalwidth ? 'addClass' : 'removeClass'](el, 'natural-content-width');

		/**
		 * Display row selection checkboxes in the first column of the data table.
		 * The selected rows can be fetched by the <code><a href="#method_getSelectedRecords">getSelectedRecords</a></code>
		 * method when handling <a href="YAHOO.widget.DataTable.html#event_rowSelectEvent">row select</a> and
		 * <a href="YAHOO.widget.DataTable.html#event_rowUnselectEvent">row unselect</a> events. This can
		 * only be set in the configuration object passed into the data table constructor.
		 *
		 * @config multiRowSelection
		 * @type String
		 */
		if (config.multiRowSelection) {
			columnDefs = [{
				key: SELECTED_COLUMN_KEY,
				label: '<input type="checkbox">',
				formatter: function(cell, record, column, data) {
					cell.innerHTML = '<input type="checkbox"' + (this.isSelected(record) ? ' checked' : '') + '/>';
				}
			}].concat(columnDefs);

			Dom.addClass(el, 'dt-row-selection-enabled');
		}

		if (config.dynamicData) {
			this.handleDataReturnPayload = function(request, response, payload) {
				try {
					payload.totalRecords = response.meta.totalRecords;
				} catch (ignored) {}
				return payload;
			};
		} else {
			// Needed when config.sortedBy is defined; as well as when any column is
			// defined as sortable and a table filter or autorefresh is configured.
			var defaultSortedBy = config.sortedBy || null;
			this.handleDataReturnPayload = function(request, response, payload) {
				var sortedBy = this.get('sortedBy') || defaultSortedBy;
				// If a column has not yet been sorted, sortedBy will be null.
				if (sortedBy) {
					this.sortColumn(this.getColumn(sortedBy.key), sortedBy.dir);
				}
				return payload;
			};
		}

		if (config.paginatorConfig) {
			config.paginator = new DataTablePaginator(config.paginatorConfig.initialRecordCount, config.paginatorConfig.recordsPerPage);
		}

		// The DataTable is displayed with inline-block for the purposes of lining the table
		// tools at the top right corner of the table. We wrap it in a block container so the
		// page lays out as we would expect.
		var wrapper = document.createElement('div');
		el = Dom.get(el);
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);

		DataTable.superclass.constructor.call(this, el, columnDefs, dataSource, config);

		if (!config.dynamicData && config.stickyState) {
			this.subscribe('columnSortEvent', this._saveSort);
		}

		// We use our own custom highlight methods instead of onEventHighlightColumn as onEventHighlightColumn
		// can be very slow on older browsers (IE < 8). Currently we only require the TH to be highlighted for
		// styling purposes - if we ever need the whole column highlighted we'll have to find an alternate
		// performant solution.
		this.subscribe('theadCellMouseoverEvent', this._onEventHighlightTheadCell);
		this.subscribe('theadCellMouseoutEvent', this._onEventUnhighlightTheadCell);

		if (ORCHESTRAL.env.ua.ie === 8) {
			// IE 8 has a bug where changes to the height of a table in an inline-block element
			// do not trigger the inline-block element to get reflowed. As our container element
			// is displayed as an inline-block element we add and remove the class that sets this
			// to manually trigger a reflow to work around this problem.
			this.subscribe('postRenderEvent', function() {
				Dom.removeClass(this.getContainerEl(), 'yui-dt');
				Dom.addClass(this.getContainerEl(), 'yui-dt');
			}, null, this);
		}

		this.subscribe('cellClickEvent', function(args) {
			var td = args.target,
				target = Event.getTarget(args.event);

			if (Dom.hasClass(target, 'show-more')) {
				Dom.setStyle(td, 'width', td.offsetWidth + 'px');
				Dom.addClass(td, 'showing-more');
				this.fireEvent('postRenderEvent');
				Event.preventDefault(args.event);
				return false;
			} else if (Dom.hasClass(target, 'show-less')) {
				Dom.removeClass(td, 'showing-more');
				Dom.setStyle(td, 'width', null);
				this.fireEvent('postRenderEvent');
				Event.preventDefault(args.event);
				return false;
			}
		});

		if (config.footerEditor) {
			this.subscribe('postRenderEvent', function(args) {
				this._initFooterEditor(config.editorAdd);
			}, null, this);
		}

		if (config.multiRowSelection) {
			this.subscribe('theadCellClickEvent', function(args) {
				return !this._handleRowSelection(args, function(selected) {
					var length = this.getRecordSet().getLength(),
						i;
					for (i = 0; i < length; i++) {
						if (this.getTrEl(this.getRecord(i))) {
							// Only select records that are actually displayed in the table.
							this[(selected ? '' : 'un') + 'selectRow'](i);
							this.updateCell(this.getRecord(i), 0);
						}
					}
				});
			});
			this.subscribe('cellClickEvent', function(args) {
				return !this._handleRowSelection(args, function(selected) {
					this[(selected ? '' : 'un') + 'selectRow'](args.target);
				});
			});
			this.subscribe('unselectAllRowsEvent', function(args) {
				var i;
				for (i = 0; i < args.records.length; ++i) {
					this.updateCell(args.records[i], 0);
				}
				// Clear the 'select all' checkbox in the column header
				Dom.getElementsByClassName('yui-dt-col-selected', 'th', this.getTheadEl(), function(el) {
					el.getElementsByTagName('input')[0].checked = false;
				});
			});
			this.subscribe('renderEvent', function() {
				// Fired when the DataTable's DOM is rendered or modified.
				var length = this.getRecordSet().getLength(),
					numShowing = 0,
					i;
				for (i = 0; i < length; i++) {
					if (this.getTrEl(this.getRecord(i))) {
						numShowing++;
					}
				}

				// Hide the 'select-all' checkbox header, if there are currently no rows to select
				Dom.getElementsByClassName('yui-dt-col-selected', 'th', this.getTheadEl(), function(el) {
					Dom[numShowing ? 'removeClass' : 'addClass'](el.getElementsByTagName('input')[0], 'dt-select-all-hidden');
				});
			});

			if (lang.isObject(config.multiRowSelection) && config.multiRowSelection.toolbar) {
				var paginator = this.get('paginator'),
					toolbarCfg = config.multiRowSelection.toolbar,
					oSelf = this;

				// Only initialise the toolbar once the paginator has been rendered as the toolbar
				// needs to be inserted in between the 'show more' and page report elements of the
				// paginator.
				if (paginator && !paginator.get('rendered')) {
					paginator.subscribe('render', function() {
						oSelf._initToolbar.call(oSelf, toolbarCfg);
					});
				} else {
					// Initialise the toolbar as we either have no paginator or it has already rendered.
					this._initToolbar(toolbarCfg);
				}
			}
		}

		this.subscribe('rowMouseoverEvent', this.onEventHighlightRow);
		this.subscribe('rowMouseoutEvent', this.onEventUnhighlightRow);

		this.subscribe('rowAddEvent', this._onRowAddOrUpdate);
		this.subscribe('rowUpdateEvent', this._onRowAddOrUpdate);
	};

	lang.extend(DataTable, YAHOO.widget.DataTable, {
		/**
		 * The ORCHESTRAL.widget.AutoRefresh instance for the DataTable. Accessible so can pause/unpause automatic refresh from
		 * outside datatable when popovers or lightboxes used for instance.
		 *
		 * @property _autoRefresh
		 * @type ORCHESTRAL.widget.AutoRefresh
		 * @private
		 */
		_autoRefresh: null,

		/**
		 * The link to add new items to the data table.
		 *
		 * @property _addItemEl
		 * @type HTMLElement
		 * @private
		 */
		_addItemEl: null,

		/**
		 * The element used to display the auto-refresh UI when auto-refreshing is enabled.
		 *
		 * @property _autoRefreshEl
		 * @type HTMLElement
		 * @private
		 */
		_autoRefreshEl: null,

		/**
		 * The DataTable filter's form element.
		 *
		 * @property _filterFormEl
		 * @type HTMLElement
		 * @private
		 */
		_filterFormEl: null,

		/**
		 * The parameters corresponding to state of the filter form for the last filter of the data table.
		 *
		 * @property _filterParams
		 * @type Object
		 * @private
		 */
		_filterParams: {},

		/**
		 * The link for toggling the display of the text quick filter.
		 *
		 * @property _filterToggleEl
		 * @type HTMLElement
		 * @private
		 */
		_filterToggleEl: null,

		/**
		 * The column and direction the data table was last sorted by.
		 *
		 * @property _lastSortedBy
		 * @type Object
		 * @private
		 */
		_lastSortedBy: null,

		/**
		 * The element where the message detailing the number of selected rows is displayed.
		 *
		 * @property _numberSelectedEl
		 * @type HTMLElement
		 * @private
		 */
		_numberSelectedEl: null,

		/**
		 * The element used for quick search.
		 *
		 * @property _quickSearchEl
		 * @type HTMLElement
		 * @private
		 */
		_quickSearchEl: null,

		/**
		 * The buttons on the DataTable toolbar.
		 *
		 * @property _toolbarButtons
		 * @type YAHOO.widget.Button[]
		 * @private
		 */
		_toolbarButtons: [],

		/**
		 * The DataTable toolbar element.
		 *
		 * @property _toolbarEl
		 * @type HTMLElement
		 * @private
		 */
		_toolbarEl: null,

		/**
		 * Destroys the data table's outer container element.
		 *
		 * @method _destroyContainerEl
		 * @param container {HTMLElement} The container element.
		 * @private
		 */
		_destroyContainerEl: function(container) {
			Dom.removeClass(container, 'filter-open');
			DataTable.superclass._destroyContainerEl.call(this, container);
		},

		/**
		 * Initialises the data table container.
		 *
		 * @method _initContainerEl
		 * @param container {HTMLElement} The container element.
		 * @private
		 */
		_initContainerEl: function(container) {
			var filter = Dom.getFirstChildBy(container, function(el) {
				return Dom.hasClass(el, 'dt-filter');
			});
			this._filterFormEl = filter;
			if (filter) {
				container.removeChild(filter);
			}

			DataTable.superclass._initContainerEl.call(this, container);

			if (filter) {
				var oSelf = this,
					submitButton = Dom.getElementsBy(function(el) {
						return Dom.hasClass(el, 'yui-primary-button');
					}, 'span', filter)[0],
					buttonGroups = Dom.getElementsByClassName('yui-buttongroup', null, filter);

				if (!submitButton) {
				//if we don't find a submit button from a span.yui-primary-button try again looking for an input[type="submit"] instead
					submitButton = Dom.getElementsBy(function(el) {
						return el.type === 'submit';
					}, 'input', filter)[0];

					//if we don't find a submit button from an input[type="submit"] try again looking for a button[type="submit"] instead
					if (!submitButton) {
						submitButton = Dom.getElementsBy(function(el) {
							return el.type === 'submit';
						}, 'button', filter)[0];
					}
				}

				if (submitButton) {
				// If we find a 'submit' button, we assume a full filter form with 'submit' button and 'reset-filter' link
					new ORCHESTRAL.widget.PrimaryButton(submitButton);

					var performFilterHandler = function(e) {
						oSelf.performFilter();
						Event.preventDefault(e);
					};
					Event.on(filter, 'submit', performFilterHandler, null, this);
					Dom.getElementsBy(function(el) {
						return Dom.hasClass(el, 'reset-filter');
					}, 'a', filter, function(el) {
						Event.on(el, 'click', function(e) {
							oSelf._filterFormEl.reset();
							performFilterHandler(e);
						});
					});
				} else if (buttonGroups.length > 0) {
					// If no 'submit' button but 1 or more button groups, initialize them and filter the table when they change
					Dom.batch(buttonGroups, function(el) {
						new YAHOO.widget.ButtonGroup(el).on('valueChange', this.performFilter, null, this);

						//TODO: see COW-1272 - when datatable implementation is updated to use this, need to account for backwards case
						//      of implementations of datatable filtering not accounting for 'all unchecked' case.
						// new ORCHESTRAL.widget.ButtonGroup(el).on('valueChange', this.performFilter, null, this);
					}, this, true);
				}
				// Implicit else: let the user do their own initialization, binding and form management

				Dom.addClass(container, 'filter-open');
			}

			var tools = document.createElement('div');
			tools.className = 'dt-tools';

			this._addItemEl = document.createElement('a');
			this._addItemEl.className = 'add';
			this._addItemEl.href = '#';

			this._filterToggleEl = document.createElement('a');
			this._filterToggleEl.className = 'filter-toggle';
			this._filterToggleEl.href = '#';
			this._filterToggleEl.title = Locale.get('widget.datatable.search.button');

			this._autoRefreshEl = document.createElement('span');

			this._quickSearchEl = document.createElement('span');
			this._initQuickSearch();

			tools.appendChild(this._addItemEl);
			tools.appendChild(this._filterToggleEl);
			tools.appendChild(this._autoRefreshEl);
			tools.appendChild(this._quickSearchEl);

			Dom.addClass(tools.childNodes, 'dt-tool');
			Dom.addClass(tools.childNodes, 'dt-tool-disabled');

			container.appendChild(tools);

			if (filter) {
				Dom.addClass(filter, 'filter');
				container.appendChild(filter);

				YAHOO.widget.Button.addHiddenFieldsToForm(filter);
				ORCHESTRAL.util.Form.deserialize(filter, this.get('filterState'));
				this._filterParams = ORCHESTRAL.util.Form.serialize(filter);
			}

			this.set('initialRequest', this.get('generateRequest')(this.getState(), this));

			Event.on(this._addItemEl, 'click', function(e) {
				this.fireEvent('addItemEvent');
				Event.preventDefault(e);
			}, null, this);

			Event.on(this._filterToggleEl, 'click', function(e) {
				var opening = !Dom.hasClass(container, 'filter-open'),
					input;
				Dom[opening ? 'addClass' : 'removeClass'](container, 'filter-open');
				if (opening) {
					// Future proof ourselves for when we support custom filter UIs.
					filter.getElementsByTagName('input')[0].focus();
				} else if (input.value !== '') {
					input.value = '';
					this.fireEvent('searchEvent', {
						query: ''
					});
				}
				Event.preventDefault(e);
			}, null, this);

			if (this.get('addItem')) {
				ORCHESTRAL.util.Dom.setText(this._addItemEl, this.get('addItem').label);
				Dom.addClass(this._addItemEl, 'dt-tool-enabled');
			}
			if (this.get('searchHandler')) {
				Dom.addClass(this._quickSearchEl, 'dt-tool-enabled');
			}
			if (this.get('autoRefreshInterval')) {
				this._initAutoRefresh();
			}
		},

		/**
		 * Initialises the data table table.
		 *
		 * @method _initTableEl
		 * @param container {HTMLElement} The container element.
		 * @private
		 */
		_initTableEl: function(container) {
			DataTable.superclass._initTableEl.call(this, container);
			Dom.addClass(this._elTable, 'data');
		},

		/**
		 * Initialises the DataTable auto refresh, if autoRefreshInterval configured.
		 *
		 * @method _initAutoRefresh
		 * @private
		 */
		_initAutoRefresh: function() {
			if (!this.get('autoRefreshInterval')) {
				return;
			}
			this._autoRefresh = new ORCHESTRAL.widget.AutoRefresh(this._autoRefreshEl, this.get('element'), this.get('autoRefreshInterval'), this._requestData, this);
			var previousHandlePayload = this.handleDataReturnPayload;
			Dom.addClass(this._autoRefreshEl, 'dt-tool-enabled');
			this.handleDataReturnPayload = function(request, response, payload) {
				this._autoRefresh.updateMessage();
				return previousHandlePayload.call(this, request, response, payload);
			};
		},

		/**
		 * Calls pause on the DataTable AutoRefresh instance to pause auto-refreshing. This is for use
		 * when a lightbox or pop-over is opened from the element that displays
		 * the auto-refreshed information.
		 *
		 * @method pauseAutoRefresh
		 */
		pauseAutoRefresh: function() {
			if (this._autoRefresh) {
				this._autoRefresh.pause();
			}
		},

		/**
		 * Calls unpause on the DataTable AutoRefresh instance to unpause auto-refreshing. This is for use
		 * when a lightbox or pop-over opened from the element that displays
		 * the auto-refreshed information is closed.
		 *
		 * @method unpauseAutoRefresh
		 */
		unpauseAutoRefresh: function() {
			if (this._autoRefresh) {
				this._autoRefresh.unpause();
			}
		},

		/**
		 * Initialises the DataTable quick search.
		 *
		 * @method _initQuickSearch
		 * @private
		 */
		_initQuickSearch: function() {
			var container = this._quickSearchEl;
			Dom.addClass(container, 'dt-quick-search');

			var input = document.createElement('input');
			input.type = 'text';
			Dom.addClass(input, 'short');

			container.appendChild(input);

			new YAHOO.util.KeyListener(input, {
				keys: YAHOO.util.KeyListener.KEY.ENTER
			}, {
				fn: function() {
					this.fireEvent('searchEvent', {
						query: input.value
					});
				},
				scope: this,
				correctScope: true
			}).enable();

			var quickSearchButton = new ORCHESTRAL.widget.IconButton({
				label: '&nbsp',
				type: 'quick-search',
				icon: 'icon-search',
				container: container,
				onclick: {
					fn: function() {
						this.fireEvent('searchEvent', {
							query: input.value
						});
					},
					scope: this
				}
			});
		},

		/**
		 * Initializes the toolbar. Constructs buttons, attaches events and sets up the container
		 * for displaying a message detailing the number of rows selected in the DataTable.
		 *
		 * @method _initToolbar
		 * @param config {Object} The configuration for the toolbar.
		 * @private
		 */
		_initToolbar: function(config) {
			var button,
			buttons = config.buttons,
				buttonsContainer,
				oButton,
				i;

			this._toolbarEl = Dom.getElementsByClassName('dt-toolbar', 'div', this.getContainerEl())[0];
			if (!this._toolbarEl) {
				this._toolbarEl = document.createElement('div');
				Dom.addClass(this._toolbarEl, 'dt-toolbar');
				Dom.insertAfter(this._toolbarEl, this.getTableEl());
			} else {
				Dom.removeClass(this._toolbarEl, 'dt-toolbar-loading');
			}

			if (buttons && buttons.length > 0) {
				this._toolbarButtons = [];
				buttonsContainer = document.createElement('span');
				Dom.addClass(buttonsContainer, 'dt-toolbar-buttons');

				for (i = 0; i < buttons.length; ++i) {
					button = buttons[i];
					oButton = new ORCHESTRAL.widget[button.isDefault ? 'PrimaryButton' : 'SecondaryButton']({
						label: button.text,
						id: button.id
					});
					oButton.appendTo(buttonsContainer);

					if (lang.isFunction(button.handler)) {
						oButton.set('onclick', {
							fn: button.handler,
							obj: this,
							scope: this
						});
					} else if (lang.isObject(button.handler) && lang.isFunction(button.handler.fn)) {
						oButton.set('onclick', {
							fn: button.handler.fn,
							obj: ((!lang.isUndefined(button.handler.obj)) ? button.handler.obj : this),
							scope: (button.handler.scope || this)
						});
					}

					this._toolbarButtons.push(oButton);
				}

				this._toolbarEl.appendChild(buttonsContainer);
			}

			this._numberSelectedEl = document.createElement('span');
			Dom.addClass(this._numberSelectedEl, 'dt-num-selected');
			this._toolbarEl.appendChild(this._numberSelectedEl);

			this.subscribe('rowSelectEvent', this._updateToolbarState, null, this);
			this.subscribe('rowUnselectEvent', this._updateToolbarState, null, this);
			this.subscribe('unselectAllRowsEvent', this._updateToolbarState, null, this);

			this._updateToolbarState();

			// Set value manually as the toolbarRendered attribute is read only
			this.setAttributeConfig('toolbarRendered', {
				value: true
			});

			/**
			 * Fired after the toolbar has been initialised & rendered into the DOM.
			 *
			 * @event toolbarRender
			 * @param args.toolbar {HTMLElement} The toolbar node.
			 */
			this.fireEvent('toolbarRender', {
				toolbar: this._toolbarEl
			});
		},

		/**
		 * Updates the message displayed in the toolbar based on the number of rows selected.
		 *
		 * @method _updateToolbarState
		 * @private
		 */
		_updateToolbarState: function() {
			var numSelected = this.getSelectedRecords().length,
				numSelectedMsg,
				i;

			if (this._toolbarEl) {
				if (this._numberSelectedEl) {
					switch (numSelected) {
						case 0:
							numSelectedMsg = this.get('MSG_NONE_SELECTED');
							break;
						case 1:
							numSelectedMsg = this.get('MSG_ONE_SELECTED');
							break;
						default:
							numSelectedMsg = lang.substitute(this.get('MSG_NUM_SELECTED'), [numSelected]);
							break;
					}

					this._numberSelectedEl.innerHTML = numSelectedMsg;
				}

				for (i = 0; i < this._toolbarButtons.length; ++i) {
					this._toolbarButtons[i].set('disabled', numSelected === 0);
				}

				if (numSelected > 0) {
					Dom.addClass(this._toolbarEl, 'dt-toolbar-enabled');
					Dom.removeClass(this._toolbarEl, 'dt-toolbar-disabled');
					this.fireEvent('toolbarEnabled', {
						toolbar: this._toolbarEl
					});
				} else {
					Dom.removeClass(this._toolbarEl, 'dt-toolbar-enabled');
					Dom.addClass(this._toolbarEl, 'dt-toolbar-disabled');
					this.fireEvent('toolbarDisabled', {
						toolbar: this._toolbarEl
					});
				}
			}
		},

		/**
		 * Returns a default container for pagination. We override the YUI DataTable implementation
		 * because we only want a paginator to appear at the bottom of the table.
		 *
		 * @method _defaultPaginatorContainers
		 * @param create {Boolean} Create the default containers if not found.
		 * @return {HTMLElement} The paginator container element.
		 * @private
		 */
		_defaultPaginatorContainers: function(create) {
			var id = this._sId + '-paginator',
				el = Dom.get(id);

			if (create && !el) {
				el = document.createElement('div');
				el.id = id;
				this._elContainer.appendChild(el);
			}

			return el;
		},

		/**
		 * Determines if the cell click event was for a row selection checkbox and executes the given callback if it was. If the click event was for a
		 * row selection checkbox then we return <code>false</code> so the calling code can prevent further bubbling of the custom event that would
		 * trigger a registered row click handler.
		 *
		 * @method _handleRowSelection
		 * @param args {Object} The cell click event arguments.
		 * @param fn {Function} The callback function.
		 * @return {Boolean} Whether the cell click event has been handled and should be stopped from bubbling up and triggering further event handlers
		 * @private
		 */
		_handleRowSelection: function(args, fn) {
			if (!Dom.hasClass(args.target, 'yui-dt-col-' + SELECTED_COLUMN_KEY)) {
				return false;
			}
			var el = Event.getTarget(args.event);
			if (el.tagName !== 'INPUT') {
				el = args.target.getElementsByTagName('input')[0];
				el.checked = !el.checked;
			}
			fn.call(this, el.checked);
			return true;
		},

		// TODO: yuidoc this & REFACTOR
		_initFooterEditor: function(callback) {
			var colset = this.getColumnSet(),
				tbodyEl = this._elTbody,
				editorRow = Dom.getElementsByClassName('yui-dt-footer-editor', null, tbodyEl),
				rows,
				formerLastRow,
				newLastRow,
				cellEditor,
				editorContainerEl,
				editorInputEl,
				cell,
				liner,
				anchor,
				i;

			// TODO: when would editorRow length be greater than 0?
			if (editorRow.length > 0 || !colset) {
				return;
			}

			rows = tbodyEl.getElementsByTagName('tr');
			formerLastRow = Dom.getElementsByClassName('yui-dt-last', 'tr', tbodyEl);
			newLastRow = document.createElement('tr');

			Dom.removeClass(formerLastRow, 'yui-dt-last');
			Dom.addClass(newLastRow, 'yui-dt-footer-editor');
			Dom.addClass(newLastRow, 'yui-dt-last');
			Dom.addClass(newLastRow, rows.length % 2 === 0 ? 'yui-dt-even' : 'yui-dt-odd');

			for (i = 0; i < colset.keys.length; i++) {

				// Cell Editor Widget
				cellEditor = colset.keys[i].editor;

				cell = document.createElement('td');

				if (cellEditor) {

					liner = document.createElement('div');
					editorContainerEl = cellEditor._elContainer;

					Dom.setStyle(editorContainerEl, 'display', '');
					Dom.addClass(liner, 'yui-dt-liner');
					editorInputEl = editorContainerEl.getElementsByTagName('input')[0];
					editorInputEl.setAttribute('tabindex', 0);

					// Removing the pre-defined keypress event listener, as by default this will attempt to save the value of the
					// CellEditor, which is not something that we are utilizing in our datatable footers.
					Event.removeListener(editorInputEl, 'keypress');

					// Re-adding an 'Enter' keypress listener to prevent form submission.
					Event.addListener(editorInputEl, 'keypress', function (e){
						// e.keyCode 13 = Enter
						if (e.keyCode === 13) {
							YAHOO.util.Event.preventDefault(e);
						}
					});

					// YUI add a tabindex of 0 to the cell, but we only want the input in the cell to recieve tab focus.
					editorContainerEl.removeAttribute('tabindex');

					liner.appendChild(editorContainerEl);
					cell.appendChild(liner);

					Dom.addClass(cell, i === 0 ? 'yui-dt-first' : 'yui-dt-edit');

				} else if (colset.keys[i].formatter[0] === 'action') {

					anchor = document.createElement('a');
					liner = document.createElement('div');

					//the assumption is the action will be the last row
					Dom.addClass(cell, 'yui-dt-last');
					Dom.addClass(liner, 'yui-dt-liner');
					Dom.addClass(anchor, 'icon-add');
					anchor.setAttribute('href', '#');

					liner.appendChild(anchor);
					cell.appendChild(liner);

				} else {
					// TODO: can this go through the formatDefault column formatter (and the other column formatters)
					// not have dashes hard coded?
					cell.innerHTML = ' - ';
					if (i === 0) {
						Dom.addClass(cell, 'yui-dt-first');
					}
				}

				newLastRow.appendChild(cell);
			}

			Event.addListener(newLastRow.getElementsByTagName('a'), 'click', function(e) {
				var rowData = {},
				inputs = newLastRow.getElementsByTagName('input'),
					i;

				Event.preventDefault(e);
				for (i = 0; i < inputs.length; i++) {
					rowData[colset.keys[i].key] = inputs[i].value;
					inputs[i].value = '';
				}

				// editorAdd callback, defined in config
				callback(rowData);

			}, newLastRow, this);

			this._elTbody.appendChild(newLastRow);
		},

		/**
		 * Sends request to refresh the DataSource, indicating current state and whether
		 * or not to animate row changes. Will animate by default.
		 *
		 * @method _requestData
		 * @param args {Object} (optional) Additional argument(s) such as whether to animate.
		 * @private
		 */
		_requestData: function(args) {
			var state = this.getState();
			var animate = args ? args.animate : true;
			this.getDataSource().sendRequest(this.get('generateRequest')(state, this), {
				success: this._onDataReturnReplaceRows,
				failure: this._onDataReturnReplaceRows,
				argument: {
					state: state,
					animate: animate
				},
				scope: this
			});
		},

		/**
		 * Splits args from request into separate payload and animate data for <code>onDataReturnReplaceRows</code> parameters.
		 *
		 * @method _onDataReturnReplaceRows
		 * @param request {Object}
		 * @param response {Object}
		 * @param payload {Object}
		 * @param args {Object} Additional payload and animate arguments.
		 * @private
		 */
		_onDataReturnReplaceRows: function(request, response, args) {
			this.onDataReturnReplaceRows(request, response, args.state, args.animate);
		},

		/**
		 * Callback function receives reponse from DataSource, replaces all existing Records in RecordSet,
		 * updates TR elements with new data, and updates state UI for pagination and sorting from payload data,
		 * if necessary. Animates row changes if animate is true. Persists row selection before and after refresh.
		 *
		 * @method onDataReturnReplaceRows
		 * @param request {Object}
		 * @param response {Object}
		 * @param payload {Object}
		 * @param animate {Boolean}
		 */
		onDataReturnReplaceRows: function(request, response, payload, animate) {

			// Prefix b is for before refresh. Prefix a is for after refresh.

			// Keep account of state of the rows onscreen before refresh.
			var bNumRows = this._elTbody.children.length,
				// Rows before refresh.
				bRows = [],
				numCells,
				i;

			for (i = 0; i < bNumRows; i++) {
				// Store each row before refresh, to compare with the rows after refresh.
				bRows.push(this._elTbody.children[i]);
			}

			if (bNumRows !== 0) {
				// Empty before refresh.
				numCells = this._elTbody.children[0].children.length;
			}

			// Refresh the RecordSet.
			DataTable.superclass.onDataReturnReplaceRows.call(this, request, response, payload);

			// Compare the previous state of the onscreen row data to the current state and animate changes.
			var aNumRows = this._elTbody.children.length,
				bIndex = 0,
				aIndex = 0,
				startIndex = 0,
				cellIndex = 0,
				bRow,
				aRow,
				bCell,
				aCell,
				// This regex catches every case of this << id="any_char_between_here" >> or << id=any_char_here_no_quotes >> in the row markup.
				// Because any change to a row is animated, but id's can change between requests, and this shouldn't count.
				// So all id's are removed before comparing the rows before and after refresh.
				regexIds = /\bid=("\S[^>\s]+"|\S[^>\s]+)/g,
				// This regex catches all whitespace.
				// Because whitespace changes (e.g. when removing id's) shouldn't count.
				regexWhitespace = /\s/g,
				// Assume rows match until a difference is found.
				rowMatch = true,
				rowsSelected = false,
				state = this.getState();

			if (state.selectedRows.length !== 0) {
				// Clear selectedRows, as id's change between requests, so must repopulate selectedRows after refresh.
				rowsSelected = true;
				this.unselectAllRows();
			}

			if (!numCells) {
				if (aNumRows === 0) {
					// Empty before and after refresh.
					return;
				}
				// else was empty before but not after refresh,
				// so will go straight to second loop, where rows added to end are animated.
			}

			for (bIndex = 0; bIndex < bNumRows; bIndex++) {

				// Pick each row before refresh (bRow) and try to find a match with a row after refresh (aRow).
				bRow = bRows[bIndex];

				for (aIndex = startIndex; aIndex < aNumRows; aIndex++) {

					aRow = this._elTbody.children[aIndex];

					for (cellIndex = 0; cellIndex < numCells; cellIndex++) {

						// Ignore cells with multiRowSelection checkbox when comparing rows for changes.
						if (Dom.hasClass(bRow.children[cellIndex], 'yui-dt-col-selected')) {
							cellIndex++;
							if (cellIndex >= numCells) {
								break;
							}
						}

						// Compare each cell of aRow and bRow.
						bCell = bRow.children[cellIndex].innerHTML.replace(regexIds, "").replace(regexWhitespace, "");
						aCell = aRow.children[cellIndex].innerHTML.replace(regexIds, "").replace(regexWhitespace, "");

						if (bCell !== aCell) {
							// Stop checking the rest of the cells, rows already do not match.
							rowMatch = false;
							break;
						}
					}

					if (rowMatch) {
						// All of the cells were matches indicating a row match.

						// If this row was selected before refresh, ensure it is reselected.
						if (rowsSelected && Dom.hasClass(bRow, 'yui-dt-selected')) {
							// TODO: Bug with this, where a row that changes slightly was selected
							// previously but will not be reselected as does not give a rowMatch.

							this.selectRow(this._elTbody.children[aIndex]);
						}

						if (animate && (aIndex > startIndex)) {
							// If a match is found on a later row, this indicates any previous rows were inserted.
							for (i = startIndex; i < aIndex; i++) {
								this.fireEvent('rowAddEvent', {
									record: this.getRecord(this._elTbody.children[i])
								});
							}
						}

						// Make sure to start next round checking for matches from the next row down.
						startIndex = aIndex + 1;
						break;
					}

					// Check next aRow, to see if a match to this bRow can still be found after any inserted rows.
					rowMatch = true;
				}
			}

			if (rowsSelected) {
				// Re-check checkboxes of reselected rows.
				Dom.batch(this.getSelectedRows(), function(el) {
					Dom.getElementsBy(function(elem) {
						return elem.getAttribute('type') === 'checkbox';
					}, 'input', el, function(input) {
						input.setAttribute('checked', 'checked');
					});
				});
			}

			// If pagination is enabled and not all rows are showing then ignore any rows added to the end,
			// otherwise, animate row additions.
			state = this.getState();
			if (animate && !(state.pagination && (state.pagination.rowsPerPage < state.pagination.totalRecords))) {

				// The 'startIndex' stores the index of the next after row that has not yet been matched.
				for (i = startIndex; i < aNumRows; i++) {
					// If there are still "after" rows left, this indicates rows were added to the end.
					this.fireEvent('rowAddEvent', {
						record: this.getRecord(this._elTbody.children[i])
					});
				}
			}
		},

		/**
		 * Sorts given Column. If <code>dynamicData</code> is true, current selections are purged before a request is
		 * sent to the DataSource for data for the new data (using request returned by <code>generateRequest()</code>).
		 *
		 * @method sortColumn
		 * @param column {Object} Column instance.
		 * @param dir {String} (Optional) YAHOO.widget.DataTable.CLASS_ASC or YAHOO.widget.DataTable.CLASS_DESC
		 */
		sortColumn: function(column, dir) {
			if (column && (column instanceof YAHOO.widget.Column)) {
				// The superclass function just reverses the record order if the column already has a sort direction,
				// but we need to account for inline changes since last sort, so keep record of the next sort direction and
				// clear the current sort direction before calling the superclass sortColumn function.

				// If the column is currently sorted, find the next sort dir, unless a dir is explicitly passed.
				var sortedBy = this.get("sortedBy") || {};
				var sorted = (sortedBy.key === column.key) ? true : false;
				if (sorted) {
					// Either takes the explicit dir passed, or returns next direction to sort.
					dir = dir || this.getColumnSortDir(column);
				}
				// Clear this, so the records are not just reversed.
				this.set("sortedBy", null);

				DataTable.superclass.sortColumn.call(this, column, dir);
			}
		},

		/**
		 * Event handler to sort columns.
		 *
		 * @method onEventSortColumn
		 * @param args.event {HTMLEvent} Event object.
		 * @param args.target {HTMLElement} Target element.
		 */
		onEventSortColumn: function(args) {
			var th = this.getThEl(args.target);

			DataTable.superclass.onEventSortColumn.call(this, args);

			// When the table is sorted the title element is re-constructed, thereby losing focus.
			// So we need to give focus back to the element.
			if (th && Dom.hasClass(th, YAHOO.widget.DataTable.CLASS_SORTABLE)) {

				var focusTheTitle = function() {
					th.getElementsByTagName('a')[0].focus();
				};

				// If its a dynamic-data table, need to wait for the table to finish rendering before assigning focus.
				if (this.get('dynamicData')) {
					var focusTheTitleHandler = function() {
						focusTheTitle();
						this.removeListener('postRenderEvent', focusTheTitleHandler);
					};
					this.addListener('postRenderEvent', focusTheTitleHandler);
				} else {
					focusTheTitle();
				}
			}
		},

		/**
		 * Persists the current sorting of the data table back to the server.
		 *
		 * @method _saveSort
		 * @private
		 */
		_saveSort: function() {
			var state = this.getState(),
				newSortedBy = state.sortedBy;

			if (!this._lastSortedBy) {
				// If we have no last sorted by information then the data table has just been
				// sorted for the first time using the sorting information provided from the
				// server so there is no need to make a request back to the server with this
				// information.
				this._lastSortedBy = newSortedBy;
				return;
			}

			if (this._lastSortedBy.key === newSortedBy.key && this._lastSortedBy.dir === newSortedBy.dir) {
				// A sort operation may have been triggered but no change what the data table is sorted
				// by occurred so there is no need to make a request back to the server with this
				// information.
				return;
			}

			this.getDataSource().sendRequest(this._getQuery(this._getSortParams(state)));
			this._lastSortedBy = newSortedBy;
		},

		/**
		 * Gets the sort parameters from the given state suitable for using to construct a request back
		 * to the server.
		 *
		 * @method _getSortParams
		 * @param state {Object} The state to extract the sorting information from.
		 * @return {Object} The extracted sort parameters.
		 * @private
		 */
		_getSortParams: function(state) {
			return {
				dir: (state.sortedBy && state.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? 'desc' : 'asc',
				sort: state.sortedBy ? state.sortedBy.key : this.getColumnSet().keys[0].getKey()
			};
		},

		/**
		 * Converts the given parameters to a query string with each request parameter name prefixed with the
		 * <code>dataRequestPrefix</code> configuration attribute.
		 *
		 * @method _getQuery
		 * @param params {Object} The parameters to construct the query string from.
		 * @return {String} The generated query string.
		 * @private
		 */
		_getQuery: function(params) {
			var prefixedParams = {},
				key;

			for (key in params) {
				if (params.hasOwnProperty(key)) {
					prefixedParams[this.get('dataRequestPrefix') + '.' + key] = params[key];
				}
			}

			return ORCHESTRAL.util.Form.toQueryString(prefixedParams);
		},

		/**
		 * Event handler for a TH element that highlights the TH by adding the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED).
		 *
		 * @method _onEventHighlightTheadCell
		 * @param args {Object} arguments from a theadCellMouseoverEvent
		 * @private
		 */
		_onEventHighlightTheadCell: function(args) {
			var thEl = this.getThEl(args.target);
			if (thEl) {
				Dom.addClass(thEl, YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
			}
		},

		/**
		 * Event handler for a TH element that unhighlights the TH by removing the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED).
		 *
		 * @method _onEventUnhighlightTheadCell
		 * @param args {Object} arguments from a theadCellMouseoutEvent
		 * @private
		 */
		_onEventUnhighlightTheadCell: function(args) {
			var thEl = this.getThEl(args.target);
			if (thEl) {
				Dom.removeClass(thEl, YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
			}
		},

		/**
		 * Event handler called when a row is added to a table or updated.
		 *
		 * @method _onRowAddOrUpdate
		 * @param args.record {YAHOO.widget.Record} The record that has been added or updatedd..
		 * @private
		 */
		_onRowAddOrUpdate: function(args) {
			var record = args.record,
				row = Dom.get(record._sId),
				bgColor = Dom.getStyle(row, 'backgroundColor'),
				rowAnim;

			rowAnim = new YAHOO.util.ColorAnim(row, {
				backgroundColor: {
					from: '#aad3eF',
					// IE returns color names which confuse the Animation Utility.
					// This is a hack that we could avoid if we had access to a later version of YUI 2 and could use Dom.Color.toHex.
					to: ('white' === bgColor ? '#fff' : bgColor)
				}
			});

			rowAnim.onComplete.subscribe(function() {
				// Remove inline style set by animation
				// so it doesn't override other background color styles such as yui-dt-selected.
				Dom.setStyle(row, 'backgroundColor', '');
			});

			rowAnim.animate();
		},

		/**
		 * Filters the table according to the state of the table filter.
		 *
		 * @method performFilter
		 */
		performFilter: function() {
			if (!this._filterFormEl) {
				return;
			}
			YAHOO.widget.Button.addHiddenFieldsToForm(this._filterFormEl);
			this._filterParams = ORCHESTRAL.util.Form.serialize(this._filterFormEl);
			this._requestData({
				animate: false
			});
		},

		/**
		 * Deletes the given row's Record from the RecordSet. If the row is on current page,
		 * the corresponding DOM elements are also deleted.
		 *
		 * @method deleteRow
		 * @param row {HTMLElement | String | Number} DOM element reference or ID string to DataTable page element or RecordSet index.
		 */
		deleteRow: function(row) {
			var oRow = YAHOO.lang.isNumber(row) ? this.getRecordSet().getRecord(row) : Dom.get(row);
			if (oRow) {
				this.unselectRow(oRow);
			}
			DataTable.superclass.deleteRow.call(this, row);
		},

		/**
		 * Outputs markup into the given TD based on given Record.
		 *
		 * @method formatCell
		 * @param cellEl {HTMLElement} The liner DIV element within the TD.
		 * @param record {YAHOO.widget.Record} (Optional) Record instance.
		 * @param column {YAHOO.widget.Column} (Optional) Column instance.
		 */
		formatCell: function(cellEl, record, column) {
			record = record || this.getRecord(cellEl);
			column = column || this.getColumn(cellEl.parentNode.cellIndex);
			if (record && column) {
				var sField = column.field,
					formatEmptyCell = true,
					formatDefault = true,
					fnFormatter;
				if (column.formatter) {
					var colFormatter,
						count;
					// Formatter can be provided as an array of multiple formatters, or a single formatter
					column.formatter = YAHOO.lang.isArray(column.formatter) ? column.formatter : [column.formatter];
					for (count = 0; count < column.formatter.length; ++count) {
						colFormatter = column.formatter[count];
						fnFormatter = (YAHOO.lang.isFunction(colFormatter)) ? colFormatter : YAHOO.widget.DataTable.Formatter[colFormatter] || YAHOO.widget.DataTable.Formatter.defaultFormatter;
						if (fnFormatter) {
							var result = fnFormatter.call(this, cellEl, record, column, record.getData(sField)),
								stopFormatting = false;
							if (result) {
								formatDefault = result.preventDefault ? false : formatDefault;
								formatEmptyCell = result.preventEmptyCellFormatting ? false : formatEmptyCell;
								stopFormatting = result.stopFormatting ? true : stopFormatting;
							} else {
								stopFormatting = true;
							}
							if (stopFormatting) {
								// Stop chaining of formatters, skip to fire 'cellFormatEvent'
								formatDefault = false;
								formatEmptyCell = false;
								break;
							}
						} else {
							cellEl.innerHTML = record.getData(sField);
						}
					}
				}
				if (formatDefault) {
					fnFormatter = YAHOO.widget.DataTable.Formatter.defaultFormatter;
					fnFormatter.call(this, cellEl, record, column, record.getData(sField));
				}
				if (formatEmptyCell) {
					fnFormatter = YAHOO.widget.DataTable.Formatter.emptyCellFormatter;
					fnFormatter.call(this, cellEl, record, column, record.getData(sField));
				}
				this.fireEvent("cellFormatEvent", {
					record: record,
					column: column,
					key: column.key,
					el: cellEl
				});
			}
		},

		/**
		 * Outputs markup into the given TH based on given column.
		 *
		 * @method formatTheadCell
		 * @param labelEl {HTMLElement} The label SPAN element within the TH liner.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param sortedBy {Object} Sort state object literal.
		 */
		formatTheadCell: function(labelEl, column, sortedBy) {
			var isIconColumn = Dom.getAncestorByClassName(labelEl, 'icon') !== null,
				label = column.label, // save the label as we need to overwrite it to an empty string for the desired rendering of an icon column header
				th = this.getThEl(column);

			if (isIconColumn) {
				column.label = '';
			}

			// Make sure screenreader doesn't read out content while HTML is being constructed
			th.setAttribute('aria-busy', 'true');
			DataTable.superclass.formatTheadCell.call(this, labelEl, column, sortedBy);
			Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SORTABLE, 'a', labelEl, function(el) {
				// Add a class for the default sort order for the column for our styling as YUI's DataTable doesn't provide one.
				var dir = (column.sortOptions || {}).defaultDir,
					sortedText;

				Dom.addClass(el, 'default-sort-' + (dir === YAHOO.widget.DataTable.CLASS_DESC || dir === 'desc' ? 'desc' : 'asc'));
				if (isIconColumn) {
					el.title = label + ' - ' + el.title;
				}

				// Add a hidden element to tell screen readers that this column has been sorted.
				// Also copy the 'title' information (which explains that you need to click to sort ascending or descending)
				// into the hidden text, because most screenreaders wont, by default, read the title attribute.
				// TODO: Replace the hardcoded full stops from the constructed html and use the screenreader specific 'pause' translation key, once it has been created.
				sortedText = '';
				if (sortedBy && sortedBy.key === column.key) {
					sortedText = (sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC || sortedBy.dir === 'desc' ? Locale.get('cow.datatable.tooltip.screenReader.sortedDescending') : Locale.get('cow.datatable.tooltip.screenReader.sortedAscending')) + '. ';
				}
				// container for icons, e.g. comment, priority or toggle icon, when sortable
				el.innerHTML += '<span class="ohp-dt-header-icon"></span>';
				// container for sort direction icon
				el.innerHTML += '<span class="ohp-dt-sort-icon"></span>';
				el.innerHTML += '<span class="ohp-screen-reader-only">. ' + sortedText + el.title + '.</span>';
			});
			if (isIconColumn && labelEl.childNodes.length === 0) {
				labelEl.title = label;
			}

			if (!column.sortable) {
				// container for icons when not sortable
				labelEl.innerHTML += '<span class="ohp-dt-header-icon"></span>';
			}
			column.label = label; // restore the label to the column object
			th.setAttribute('aria-busy', 'false');
		},

		/**
		 * Returns the records corresponding to the currently selected rows in the table.
		 *
		 * @method getSelectedRecords
		 * @return {<a href="YAHOO.widget.Record.html">Record</a>[]} Array of selected records.
		 */
		getSelectedRecords: function() {
			var records = [],
				i,
				rows;
			for (i = 0, rows = this.getSelectedRows(); i < rows.length; i++) {
				records.push(this.getRecord(rows[i]));
			}
			return records;
		},

		/**
		 * Returns DOM reference to the DataTable's toolbar element.
		 *
		 * @method getToolbarEl
		 * @return {HTMLElement} Reference to the toolbar element.
		 */
		getToolbarEl: function() {
			return this._toolbarEl;
		},

		/**
		 * Returns the enabled state of the DataTable's toolbar i.e. whether or not the toolbar exists,
		 * and has the class 'dt-toolbar-enabled'.
		 *
		 * @method isToolbarEnabled
		 * @return {Boolean} true if the toolbar is enabled, false otherwise.
		 */
		isToolbarEnabled: function() {
			return this._toolbarEl && Dom.hasClass(this._toolbarEl, 'dt-toolbar-enabled');
		},

		/**
		 * Returns DOM reference to the DataTable filter's form element.
		 *
		 * @method getFilterForm
		 * @return {HTMLElement} Reference to the filter's form element.
		 */
		getFilterForm: function() {
			return this._filterFormEl;
		},

		// DANGER: This method appears to have been erroneously added as part of http://jira/browse/COW-1394. Keeping a no-op implementation
		// around to prevent potential JS errors if anyone is indeed using it (have done a fisheye search and suspect that is not the case).
		beginWait: function() {
			YAHOO.log('If you see this message in your log, please contact the Common-Web team.', 'warn');
		},

		// DANGER: This method appears to have been erroneously added as part of http://jira/browse/COW-1394. Keeping a no-op implementation
		// around to prevent potential JS errors if anyone is indeed using it (have done a fisheye search and suspect that is not the case).
		endWait: function() {
			YAHOO.log('If you see this message in your log, please contact the Common-Web team.', 'warn');
		},

		/**
		 * Implementation of Element's abstract method. Sets up config values.
		 *
		 * @method initAttributes
		 * @param config {Object} (Optional) Object literal definition of configuration values.
		 * @private
		 */
		initAttributes: function(config) {
			DataTable.superclass.initAttributes.call(this, config);

			/**
			 * The message to display in the toolbar when no rows in the DataTable are selected.
			 *
			 * @config MSG_NONE_SELECTED
			 * @type String
			 */
			this.setAttributeConfig('MSG_NONE_SELECTED', {
				value: Locale.get('widget.datatable.noneSelected.message'),
				validator: lang.isString
			});

			/**
			 * The message to display in the toolbar when more than one row in the DataTable are selected.
			 *
			 * @config MSG_NUM_SELECTED
			 * @type String
			 */
			this.setAttributeConfig('MSG_NUM_SELECTED', {
				value: Locale.get('widget.datatable.numberSelected.message'),
				validator: lang.isString
			});

			/**
			 * The message to display in the toolbar when only one row in the DataTable is selected.
			 *
			 * @config MSG_ONE_SELECTED
			 * @type String
			 */
			var oSelf = this;
			this.setAttributeConfig('MSG_ONE_SELECTED', {
				value: lang.substitute(oSelf.get('MSG_NUM_SELECTED'), [1]),
				validator: lang.isString
			});

			/**
			 * Indicator of whether the toolbar has been initialised and rendered into the DOM.
			 *
			 * @attribute toolbarRendered
			 * @type boolean
			 * @final
			 */
			this.setAttributeConfig('toolbarRendered', {
				readOnly: true,
				value: false
			});

			/**
			 * The interval to auto-refresh information in the data table at in seconds. By default
			 * the data table will not auto-refresh. Write once.
			 *
			 * @config autoRefreshInterval
			 * @type Number
			 */
			this.setAttributeConfig('autoRefreshInterval', {
				validator: lang.isNumber,
				method: function(value) {
					if (this._autoRefreshEl) {
						this._initAutoRefresh();
					}
				}
			});

			/**
			 * The prefix that all sorting, pagination, and filter parameters will be prefixed with
			 * when making a request to the server for record data. If defined the <code>generateRequest</code>
			 * configuration attribute will be set to a function that also serialises the current filter
			 * state (via <code>ORCHESTRAL.util.Form.deserialize</code>) in addition to the sorting and pagination
			 * states. This can only be set in the configuration object passed into the data table constructor.
			 *
			 * @config dataRequestPrefix
			 * @type String
			 */
			this.setAttributeConfig('dataRequestPrefix', {
				validator: lang.isString,
				method: function(value) {
					this.set('generateRequest', function(state, self) {
						var params = self._filterParams;
						if (self.get('dynamicData')) {
							params = lang.merge(params, self._getSortParams(state), {
								results: state.pagination ? state.pagination.rowsPerPage : '',
								startIndex: state.pagination ? state.pagination.recordOffset : 0
							});
						}
						return self._getQuery(params);
					});
				}
			});

			/**
			 * The sort options to fallback to when sorting if an equal comparision is encountered for a column. This
			 * object is identical in structure to a <code>YAHOO.widget.Column
			 * <a href="YAHOO.widget.Column.html#property_sortOptions.defaultDir">sortOptions</a></code>
			 * configuration attribute. Note multiple column fallbacks can be defined by using the
			 * <a href="ORCHESTRAL.widget.DataTable.html#method_getSortFunction"><code>getSortFunction</code></a>
			 * method.
			 *
			 * @attribute fallbackSortOptions
			 * @type Object
			 */
			this.setAttributeConfig('fallbackSortOptions', {
				method: function(value) {
					var columns = this.getColumnSet().flat,
						i;
					for (i = 0; i < columns.length; i++) {
						var sortOptions = columns[i].sortOptions || {};
						sortOptions.field = sortOptions.field || columns[i].field;
						columns[i].sortOptions = {
							defaultDir: sortOptions.defaultDir || YAHOO.widget.DataTable.CLASS_ASC,
							sortFunction: DataTable.getSortFunction(sortOptions, value, {
								sortFunction: DataTable._compareRecordCounts
							})
						};
					}
				}
			});

			/**
			 * The filter state to initialise the data table with. This will be deserialized into the filter
			 * for the data table using the <code>ORCHESTRAL.util.Form.deserialize</code> method. This can
			 * only be set in the configuration object passed into the data table constructor.
			 *
			 * @attribute filterState
			 * @type Object
			 */
			this.setAttributeConfig('filterState', {
				value: {}
			});

			/**
			 * The handler for clicking on a table row. The handler is passed a single
			 * <a href="YAHOO.widget.Record.html"><code>Record</code></a> argument
			 * corresponding to the clicked row and the handler scope is the data table
			 * instance. Write once.
			 *
			 * @attribute rowClickHandler
			 * @type Function
			 */
			this.setAttributeConfig('rowClickHandler', {
				writeOnce: true,
				validator: lang.isFunction,
				method: function(value) {
					this.subscribe('rowClickEvent', ORCHESTRAL.util.Event.debounce(function(args) {
						var record = this.getRecord(args.target);
						if (record) {
							value.call(this, record);
						}
					}));
					this.subscribe('rowHighlightEvent', function(args) {
						Dom.addClass(args.el, 'yui-dt-clickable-highlighted');

						if (this.isSelected(args.record)) {
							Dom.addClass(args.el, 'yui-dt-selected-highlighted');
						}
					});
					this.subscribe('rowUnhighlightEvent', function(args) {
						Dom.removeClass(args.el, 'yui-dt-clickable-highlighted');
						Dom.removeClass(args.el, 'yui-dt-selected-highlighted');
					});
					this.subscribe('rowSelectEvent', function(args) {
						if (Dom.hasClass(args.el, 'yui-dt-highlighted')) {
							Dom.addClass(args.el, 'yui-dt-selected-highlighted');
						}
					});
					this.subscribe('rowUnselectEvent', function(args) {
						Dom.removeClass(args.el, 'yui-dt-selected-highlighted');
					});
				}
			});

			/**
			 * The handler for searching on a table. The handler is passed a single string argument
			 * that is the search query entered by the user in a filter displayed by this widget and
			 * the handler scope is the data table instance. When the filter is hidden this handler
			 * will be invoked with an empty string so the table contents are no longer filtered.
			 * Write once.
			 *
			 * @attribute searchHandler
			 * @type Function
			 */
			this.setAttributeConfig('searchHandler', {
				writeOnce: true,
				validator: lang.isFunction,
				method: function(value) {
					this.subscribe('searchEvent', function(args) {
						value.call(this, args.query);
					});
					Dom.addClass(this._filterToggleEl, 'dt-tool-enabled');
				}
			});

			/**
			 * Handlers for toggling boolean record values in a table. This is an object literal of
			 * column keys to the toggle handler functions that are used to persist the state change
			 * of the data. The handler method is passed two arguments, the first being the record
			 * to be changed, and the second is a function reference that should be called
			 * with no arguments upon successful receipt of the record value change being persisted.
			 * Columns configured with a toggle handler need to use the <code>boolean</code>
			 * formatter and have the following class names set on their configuration: <code>icon</code>,
			 * <code>toggle</code>, and one of:
			 * <ul>
			 * <li><code>toggle-complete</code></li>
			 * <li><code>toggle-flag</code></li>
			 * <li><code>toggle-star</code></li>
			 * </ul>
			 * Write once.
			 *
			 * @attribute toggleHandlers
			 * @type Object
			 */
			this.setAttributeConfig('toggleHandlers', {
				writeOnce: true,
				method: function(value) {
					this.subscribe('cellClickEvent', function(args) {
						var td = args.target,
							column = this.getColumn(td),
							liner,
							handler,
							cell;

						if (!column) {
							return true;
						}

						liner = this.getTdLinerEl(td);
						handler = value[column.key];
						cell = liner.parentNode;

						if (!handler) {
							// The click wasn't on a toggle cell so allow it to continue to bubble.
							return true;
						}
						if (Dom.hasClass(cell, 'toggle-working')) {
							// The click was on a currently toggling cell so we ignore it.
							return false;
						}

						var record = this.getRecord(td),
							newValue = !record.getData(column.key),
							table = this;

						// Remove failed change indicators
						Dom.removeClass(cell, 'toggle-failed');
						cell.title = '';

						Dom.addClass(cell, 'toggle-working');

						// Toggle icon straight away, visually pre-empting successful update, giving immediate feedback
						if (Dom.hasClass(liner, 'off')) {
							Dom.replaceClass(liner, 'off', 'on-working');
						} else if (Dom.hasClass(liner, 'on')) {
							Dom.replaceClass(liner, 'on', 'off-working');
						}
						// Add throbber if still 'working' after 1000ms (i.e. 'working' until result is received cancelling timer)
						var later = YAHOO.lang.later(1000, {}, function() {
							if (Dom.hasClass(liner, 'off-working')) {
								Dom.replaceClass(liner, 'off-working', 'off-throbber');
							} else if (Dom.hasClass(liner, 'on-working')) {
								Dom.replaceClass(liner, 'on-working', 'on-throbber');
							}
						});

						// Passed to the handler.
						// Result will be false if the toggle failed and this should be indicated.
						// Result will be true if the toggle was successful and state should change.
						var finishHandler = function(result) {
							if (result === false) {
								// Indicate failed change with icon and tooltip
								Dom.addClass(cell, 'toggle-failed');
								cell.title = Locale.get('widget.toggle.problemChanging');

								// After adding a toggle-failed class, when the mouse next enters the cell we want to remove the class.
								// The error might be temporary, so mouse enter is a sign of acknowledgement
								// plus it reveals the current state, and lets the user try again.

								var removeFailedChangeIndicators = function() {
									Dom.removeClass(cell, 'toggle-failed');
									cell.title = '';
									Event.removeListener(cell, 'mouseenter', removeFailedChangeIndicators);
								};
								Event.addListener(cell, 'mouseenter', removeFailedChangeIndicators);
							} else {
								table.updateCell(record, column, newValue);
							}
							// Remove throbber and change class for both success and failure results
							if (Dom.hasClass(liner, 'off-working')) {
								Dom.replaceClass(liner, 'off-working', (result === false) ? 'on' : 'off');
							} else if (Dom.hasClass(liner, 'on-working')) {
								Dom.replaceClass(liner, 'on-working', (result === false) ? 'off' : 'on');
							} else if (Dom.hasClass(liner, 'on-throbber')) {
								Dom.replaceClass(liner, 'on-throbber', (result === false) ? 'off' : 'on');
							} else if (Dom.hasClass(liner, 'off-throbber')) {
								Dom.replaceClass(liner, 'off-throbber', (result === false) ? 'on' : 'off');
							}
							Dom.removeClass(cell, 'toggle-working');
							later.cancel();
						};

						handler.call(this, record, finishHandler);
						// We've handled the click so don't allow it to bubble up and trigger other
						// things like row selection.
						return false;
					});
				}
			});

			/**
			 * Handler for changing priority record values in a table. This is an object literal of
			 * column keys to the priority handler function that is used to persist the state change
			 * of the data. The handler method is passed three arguments, the first being the record
			 * to be changed, the second is the new priority value to update to, and the third a
			 * function reference that should be called with argument true upon successful receipt of
			 * the record value change being persisted, or argument false to indicate a failure in
			 * persisting the change indicating that the table record should not be updated.
			 * Columns configured with a priority handler need to use the <code>priority</code>
			 * formatter and have the following class names set on their configuration: <code>icon</code>,
			 * and <code>priority</code>.
			 * Write once.
			 *
			 * @attribute priorityHandler
			 * @type Object
			 */
			this.setAttributeConfig('priorityHandler', {
				writeOnce: true,
				method: function(value) {
					var later = {},
						waiting = {};

					this.subscribe('cellClickEvent', function(args) {
						var td = args.target,
							column = this.getColumn(td),
							liner,
							handler;

						if (!column) {
							return true;
						}

						liner = this.getTdLinerEl(td);
						handler = value[column.key];

						if (!handler) {
							// The click wasn't on a toggle cell so allow it to continue to bubble.
							return true;
						}

						if (Dom.hasClass(liner.parentNode, 'priority-view')) {
							// Priority formatter is in read-only state so should not toggle.
							YAHOO.log('Priority formatter is in read-only state with class "priority-view" so should not toggle', 'warn');
							return false;
						}

						var table = this,
							record = this.getRecord(td),
							recordId = record.getId(),
							cellId = recordId + column.key,
							originalValue = record.getData(column.key), // Current actual stored priority value.
							originalClass = 'priority-' + originalValue,
							newValue,
							newClass,
							currentClass,
							i;

						if (Dom.hasClass(liner.parentNode, 'priority-change-failed')) {
							// Remove failed change indicator on mouseover.
							Dom.removeClass(td, 'priority-change-failed');
							table.updateCell(record, column, originalValue);
							return false;
						}

						if (Dom.hasClass(liner.parentNode, 'priority-working')) {
							// If click happens when it's already working on handling, but within 750ms, display a throbber immediatedly.
							if (!Dom.hasClass(liner, 'priority-throbber')) {
								Dom.addClass(liner, 'priority-throbber');
							}
							return false;
						}

						for (i = 0; i < 4; i++) {
							if (Dom.hasClass(liner, 'priority-' + i)) {
								newValue = (i + 1) % 4;
								currentClass = 'priority-' + i;
							}
						}

						newClass = 'priority-' + newValue;
						Dom.replaceClass(liner, currentClass, newClass);

						// Wait for 750ms after each click, if another click follows within that 750ms, cancel the previous timer and wait again,
						// until no more clicks. Then get the latest desired priority status and execute the handler.
						if (waiting[cellId]) {
							waiting[cellId].cancel();
						}

						waiting[cellId] = YAHOO.lang.later(750, {}, function() {

							if (newClass === originalClass) {
								// If the priority doesn't change, no bother to trigger the handler.
								return;
							}

							// TODO: others may be interested in this event - doc, include new priority value, etc
							table.fireEvent('priorityChangeEvent', {
								recordId: recordId
							});

							Dom.addClass(liner.parentNode, 'priority-working');

							if (later[cellId]) {
								later[cellId].cancel();
							}

							later[cellId] = YAHOO.lang.later(750, {}, function() {
								// Add throbber if still 'working' after 750ms
								if (Dom.hasClass(liner.parentNode, 'priority-working')) {
									Dom.addClass(liner, 'priority-throbber');
								}
							});

							// Call the columns defined priorityHandler function with this scope, and
							// parameters record, newPriority and finishHandler
							handler.call(this, record, newValue, function(result) {
								if (!result) {
									// Indicate failed state, and change back to old class value.
									Dom.replaceClass(liner, newClass, originalClass);
									Dom.addClass(liner.parentNode, 'priority-change-failed');
									table.updateCell(record, column, originalValue);
								} else {
									table.updateCell(record, column, newValue);
								}

								// Remove throbber and working states for both results.
								Dom.removeClass(liner.parentNode, 'priority-working');
								Dom.removeClass(liner, 'priority-throbber');
								later[cellId].cancel();
								waiting[cellId].cancel();
								delete later[cellId];
								delete waiting[cellId];
							});
						});

						// We've handled the click so don't allow it to bubble up and trigger other
						// things like row selection.
						return false;
					});
				}
			});

			/**
			 * Object literal describing how adding a new item to the table is invoked. Format:
			 * <p><code>{
			 * <br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>fn</strong>: Function // the handler for adding a new item to the table
			 * <br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>label</strong>: String // the text displayed on the link to add a new item to the table
			 * <br/>}</code></p>
			 * Write once.
			 *
			 * @attribute addItem
			 * @type Object
			 */
			this.setAttributeConfig('addItem', {
				writeOnce: true,
				validator: function(value) {
					return lang.isFunction(value.fn) && lang.isString(value.label);
				},
				method: function(value) {
					this.subscribe('addItemEvent', value.fn);
					if (this._addItemEl) {
						ORCHESTRAL.util.Dom.setText(this._addItemEl, value.label);
						Dom.addClass(this._addItemEl, 'dt-tool-enabled');
					}
				}
			});
			/**
			 * Handler to be called when a remove icon in a row is clicked. This
			 * allows developers to then using the handler update the datasource and
			 * then refresh the datatable. No work is actually done by the datatable
			 * to remove the row from the table.
			 *
			 * @attribute removeActionHandler
			 * @type Function
			 */
			this.setAttributeConfig('removeActionHandler', {
				validator: lang.isFunction
			});
		},

		/**
		 * Displays message within the secondary tbody.
		 *
		 * @method showTableMessage
		 * @param html {String} (optional) The message to display.
		 * @param className {String} (optional) The class name to set on the cell that displays the message.
		 */
		showTableMessage: function(html, className) {
			DataTable.superclass.showTableMessage.call(this, html, className);
			// Removed nodes in Internet Explorer still have a parentNode which is a DocumentFragment (which has
			// a nodeType of 11).
			if (!this._elMsgTbody.parentNode || this._elMsgTbody.parentNode.nodeType === 11) {
				Dom.insertBefore(this._elMsgTbody, this.getTbodyEl());
			}
		},

		/**
		 * Hides the secondary message tbody.
		 *
		 * @method hideTableMessage
		 */
		hideTableMessage: function() {
			// Internet Explorer 6/7 have a bug where borders on various hidden table elements
			// still appear. We work around this by instead removing the message tbody from the
			// DOM when it is to be hidden.
			if (this._elMsgTbody.parentNode && this._elMsgTbody.parentNode.nodeType !== 11) {
				this._elMsgTbody.parentNode.removeChild(this._elMsgTbody);
				this.fireEvent("tableMsgHideEvent");
			}
		}
	});

	DataTable.prototype._initTheadEl = function(table) {
		table = table || this.getTableEl();

		DataTable.superclass._initTheadEl.call(this, table);

		var colSet = this.getColumnSet(),
			colSpan,
			minWidthThead,
			tbody,
			tr,
			th,
			thead;

		if (!colSet) {
			return;
		}
		colSpan = colSet.keys.length;

		// Write in an extra thead with a single cell that spans every column that can be used to emulate min-width
		// for browsers that don't seem to support specifying min-width of tables (e.g. IE 6 & 7 and Webkit).

		minWidthThead = Dom.getElementsByClassName('yui-dt-tbody-min-width', 'thead', table)[0];
		if (minWidthThead) {
			// _initTheadEl is also called when columns are inserted/removed from the DataTable. In
			// that case (where the extra thead already exists) we update the colSpan appropriately.
			Dom.getElementsByClassName('min-width', 'th', minWidthThead, function(th) {
				th.colSpan = colSpan;
			});
		} else {
			tbody = document.createElement('tbody');

			Dom.addClass(tbody, 'yui-dt-tbody-min-width');

			tr = document.createElement('tr');
			th = document.createElement('th');

			Dom.addClass(th, 'min-width');

			th.colSpan = colSpan;
			tr.appendChild(th);
			tbody.appendChild(tr);

			thead = this.getTheadEl();

			Dom.insertAfter(tbody, thead);
		}
	};

	DataTable.prototype._initCommentPopover = function() {
		if (this._commentPopoverInitialized) {
			return;
		}

		var self = this;
		_createCommentPopover(function(commentPopover) {
			commentPopover.on('show', self.pauseAutoRefresh, self);
			commentPopover.on('hide', self.unpauseAutoRefresh, self);
		});

		// Only used if comment formatters defined
		this.subscribe('cellClickEvent', function(args) {
			var td = args.target,
				column = this.getColumn(td),
				liner;

			if (column) {
				liner = this.getTdLinerEl(td);
				if (Dom.hasClass(Dom.getChildren(liner)[0], 'ohp-comment')) {
					// Do not want to bubble up to trigger the rowClickHandler.
					return false;
				}
			}
		});

		this._commentPopoverInitialized = true;
	};

	lang.augmentObject(DataTable, {
		/**
		 * A row formatter that formats unread records (records whose value stored against the <code>unread</code> key
		 * returns <code>true</code>).
		 *
		 * @property DataTable.UNREAD_ROW_FORMATTER
		 * @static
		 * @type Function
		 * @final
		 */
		UNREAD_ROW_FORMATTER: function(tr, record) {
			Dom[record.getData('unread') ? 'addClass' : 'removeClass'](tr, 'unread');
			return true;
		},

		/**
		 * Helper function to fallback to for sorting if all sort comparisions return 0.
		 *
		 * @method _compareRecordCounts
		 * @param a {Record} The first record to compare.
		 * @param b {Record} The second record to compare.
		 * @param desc {Boolean} Whether the records are getting sorted ascending or descending.
		 * @return {Number} The result of the comparision.
		 * @static
		 * @private
		 */
		_compareRecordCounts: function(a, b, desc) {
			return YAHOO.util.Sort.compare(a.getCount(), b.getCount(), desc);
		},

		// TODO: yuidoc return values for formatters below!

		/**
		 * Formatter that adds an <code>on</code> or <code>off</code> class to the cell based on the boolean state of the data.
		 *
		 * @method formatBoolean
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatBoolean: function(el, record, column, data) {
			var on = lang.isBoolean(data) && data;
			el.className = YAHOO.widget.DataTable.CLASS_LINER;
			Dom.addClass(el, on ? 'on' : 'off');
			return {
				preventDefault: true,
				preventEmptyCellFormatting: true
			};
		},

		/**
		 * Default formatter which will display the value looked up from <code>column.key + 'Display'</code> in the cell if
		 * provided otherwise the default cell value passed. If <code>column.key + 'Tooltip'</code> is valued it will be
		 * displayed as a tooltip for the cell.
		 *
		 * @method formatDefault
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatDefault: function(el, record, column, data) {
			var displayValue = record.getData(column.key + 'Display');
			data = displayValue === undefined ? data : displayValue;
			if (el.innerHTML !== data) {
				YAHOO.widget.DataTable.formatDefault(el, record, column, data);
			}
			el.title = record.getData(column.key + 'Tooltip') || '';
			return {};
		},

		/**
		 * Formatter that adds <code>&ndash</code> to the cell if it is empty, i.e. data is null or empty
		 *
		 * @method formatEmptyCell
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatEmptyCell: function(el, record, column, data) {
			if (YAHOO.lang.trim(el.innerHTML) === '&nbsp;' || YAHOO.lang.trim(el.innerHTML) === '') {
				el.innerHTML = '&ndash;';
			}
			return {};
		},

		/**
		 * Formatter that displays content, along with additional content that can be displayed by clicking a 'More' link.
		 *
		 * If there is record data stored against <code>column.key + 'More'</code> then this will be the additional content
		 * displayed when the 'More' link is clicked.
		 *
		 * If there is no 'More' record data then the content displayed will be the data truncated to a certain character
		 * limit and the full content will be displayed on clicking the 'More' link. This is not supported for use with HTML
		 * cell content.
		 *
		 * @method formatMoreLess
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatMoreLess: function(el, record, column, data) {
			var getHtml = function(lessValue, moreValue) {
				return lang.substitute('<span class="less">{lessValue} <a href="#" class="show-more">{moreLink}</a></span><span class="more">{moreValue} <a href="#" class="show-less">{lessLink}</a></span>', {
					lessValue: lessValue,
					moreValue: moreValue,
					lessLink: Locale.get('widget.datatable.less.action'),
					moreLink: Locale.get('widget.datatable.more.action')
				});
			},
			html = null,
				moreValue = record.getData(column.key + 'More');

			if (moreValue) {
				html = getHtml(data, moreValue);
			} else if (!data) {
				return {};
			} else if (data.length <= 75) {
				html = data;
			} else {
				// Adjust the break position so we don't break in the middle of an HTML escape sequence.
				var breakIndex = 50,
					i;
				for (i = breakIndex; i < breakIndex + 10; i++) {
					if (data.charAt(i) === '&') {
						break;
					} else if (data.charAt(i) === ';') {
						breakIndex = i + 1;
						break;
					}
				}
				html = getHtml(data.substring(0, breakIndex) + '&hellip;', data);
			}
			el.innerHTML = html;
			return {
				preventDefault: true
			};
		},

		/**
		 * Formatter that adds a class named <code>&lt;column-key-name&gt;-&lt;data-value&gt;</code> to the cell.
		 *
		 * @method formatState
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatState: function(el, record, column, data) {
			el.className = YAHOO.widget.DataTable.CLASS_LINER;
			Dom.addClass(el, column.key + '-' + data);
			return {
				preventDefault: true,
				preventEmptyCellFormatting: true
			};
		},

		/**
		 * Formatter that wraps cell content into <code>&lt;span&gt;</code> tags to hide the content and show a comment icon instead.
		 *
		 * @method formatComment
		 * @param el {HTMLDivElement} The element with comment content.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatComment: function(el, record, column, data) {
			this._initCommentPopover();

			Dom.addClass(Dom.getAncestorByTagName(el, 'td'), 'ohp-dt-col-type-comments');

			var displayValue = record.getData(column.key + 'Display'),
				wrappedData = displayValue;
			if (displayValue === undefined) {
				if (YAHOO.lang.trim(el.innerHTML) !== '&nbsp;' && YAHOO.lang.trim(el.innerHTML) !== '') {
					wrappedData = '<span>' + el.innerHTML + '</span>'; // Used when chaining formatters
				} else {
					wrappedData = data;
				}
			}
			if (YAHOO.lang.trim(wrappedData) !== '&nbsp' && YAHOO.lang.trim(wrappedData) !== '') {
				// Note that commentPopover delegation of trigger events, relies on this markup structure.
				// The commentPopover is created in the YUI.use statement at the top.
				var commentData = '<span class="ohp-comment"><span class="value ohp-comment-content ohp-comment-value">' + wrappedData + '</span></span>';
				YAHOO.widget.DataTable.formatDefault(el, record, column, commentData);
				el.title = record.getData(column.key + 'Tooltip') || '';
			}
			return {
				preventDefault: true
			};
		},

		/**
		 * Formatter that adds a priority class to the cell based on the number state of the data
		 * (e.g. <code>priority-0</code> when data is <code>0</code>).
		 *
		 * @method formatPriority
		 * @param el {HTMLElement} The element to format with markup.
		 * @param record {YAHOO.widget.Record} Record instance.
		 * @param column {YAHOO.widget.Column} Column instance.
		 * @param data {Object} Data value for the cell, or null.
		 * @static
		 */
		formatPriority: function(el, record, column, data) {
			var priority = ((lang.isNumber(data) && data < 4) ? data : 0),
				tooltip,
				tooltipExtension;

			el.className = YAHOO.widget.DataTable.CLASS_LINER;
			Dom.addClass(el, 'priority-' + priority);

			tooltip = (Dom.hasClass(el.parentNode, 'priority-change-failed') ? Locale.get('cow.datatable.tooltip.priority.changeFailed') :
				(priority === 0) ? Locale.get('widget.priority.priorityNone') : (priority === 1) ? Locale.get('widget.priority.priorityLow') :
				(priority === 2) ? Locale.get('widget.priority.priorityMedium') : (priority === 3) ? Locale.get('widget.priority.priorityHigh') : '');

			tooltipExtension = record.getData(column.key + 'Tooltip');
			tooltipExtension = tooltipExtension === undefined ? '' : ', ' + tooltipExtension;
			el.title = tooltip + tooltipExtension;
			return {
				preventDefault: true,
				preventEmptyCellFormatting: true
			};
		},

		// TODO: yuidoc this.
		formatAction: function(el, record, column, data) {
			var result = {
				preventDefault: true,
				preventEmptyCellFormatting: true
			};
			el.className = "dt-delete";
			var rowData = record.getData();
			if (this.getAttributeConfig('removeActionHandler').value === null) {
				return result;
			}
			var callback = this.getAttributeConfig('removeActionHandler').value;

			if (record.getData() !== null) {
				el.innerHTML = '<div class="yui-dt-liner"><a href="#" class="icon-remove"> </a></div>';

				var actionLink = el.firstChild,
					data = record.getData(),
					rowId = record.getId();
				Event.addListener(actionLink, 'click', function(e, obj) {
					Event.preventDefault(e);
					callback(data, rowId);
				}, null, this);
			}
			return result;
		},

		// TODO: yuidoc this.
		formatThrobber: function(el, record, column, data) {

			var rowData = record.getData();
			el.className = YAHOO.widget.DataTable.CLASS_LINER;

			var throbber,
			cancel;

			return {
				preventDefault: true,
				preventEmptyCellFormatting: true
			};
		},

		/**
		 * Helper method to get a sort function that can sort a column based on multiple criteria.
		 *
		 * @method getSortFunction
		 * @param {Object*} The ordered sort options to use in turn for sorting. Each sort options
		 * object is identical in structure to a <code>YAHOO.widget.Column
		 * <a href="YAHOO.widget.Column.html#property_sortOptions.defaultDir">sortOptions</a></code>
		 * configuration attribute.
		 * @return {Object} A single sort options object encapsulating the provided sort criteria.
		 */
		getSortFunction: function() {
			var sortOptions = Array.prototype.slice.apply(arguments);
			return function(a, b, desc) {
				var sorted = 0,
					i;
				for (i = 0; sorted === 0 && i < sortOptions.length; i++) {
					var option = sortOptions[i];
					sorted = option.sortFunction ? option.sortFunction(a, b, desc) : YAHOO.util.Sort.compare(a.getData(option.field), b.getData(option.field), desc);
				}
				return sorted;
			};
		}
	});

	/**
	 * Fired when the add item link is clicked.
	 * @event addItemEvent
	 * @private
	 */

	/**
	 * Fired when a search is invoked.
	 * @event searchEvent
	 * @param args.query {String} The search string.
	 * @private
	 */

	// The formatter object gets augmented with our formatters so they can be specfied by a string key.
	lang.augmentObject(YAHOO.widget.DataTable.Formatter, {
		'boolean': DataTable.formatBoolean,
		priority: DataTable.formatPriority,
		moreless: DataTable.formatMoreLess,
		state: DataTable.formatState,
		comment: DataTable.formatComment,
		titlecase: DataTable.formatTitleCase,
		defaultFormatter: DataTable.formatDefault,
		emptyCellFormatter: DataTable.formatEmptyCell,
		action: DataTable.formatAction
	}, true);

	/**
	 * UI component to generate the DataTable toolbar to host buttons, 'X selected' messages and more. This
	 * is done as a paginator widget as the toolbar needs to be displayed between the 'Show More' link and
	 * the page report components of the paginator.
	 *
	 * @namespace YAHOO.widget.Paginator.ui
	 * @class DataTableToolbar
	 * @constructor
	 */
	var DataTableToolbar = function() {};

	DataTableToolbar.prototype = {
		render: function() {
			var toolbar = document.createElement('div');
			Dom.addClass(toolbar, 'dt-toolbar');
			Dom.addClass(toolbar, 'dt-toolbar-loading');
			return toolbar;
		}
	};

	/**
	 * A paginator widget for a data table that displays a 'Showing X of Y' message with a 'Show more' link.
	 *
	 * @namespace ORCHESTRAL.widget
	 * @class DataTablePaginator
	 * @extends YAHOO.widget.Paginator
	 * @constructor
	 * @param initialRecordCount {Number} The initial number of records to display in the data table.
	 * @param showMoreRecordIncrement {Number} The number of more records to display when the 'Show more' link is clicked.
	 */
	var DataTablePaginator = function(initialRecordCount, showMoreRecordIncrement) {
		return new Paginator({
			rowsPerPage: initialRecordCount,
			template: '{ShowMoreLink} {DataTableToolbar} {MinimalCurrentPageReport}',
			pageReportTemplate: lang.substitute(Locale.get('widget.datatable.showingXofY.message'), ['{endRecord}', '{totalRecords}']),
			showMoreRows: showMoreRecordIncrement
		});
	};

	/**
	 * UI component that displays the current page report (i.e. 'Showing X of Y'). Extends the YAHOO.widget.Paginator.ui.CurrentPageReport to
	 * not display the page report if the table is empty.
	 *
	 * @namespace YAHOO.widget.Paginator.ui
	 * @class MinimalCurrentPageReport
	 * @extends YAHOO.widget.Paginator.ui.CurrentPageReport
	 * @constructor
	 * @param paginator {Pagintor} The paginator instance to attach to.
	 */
	var MinimalCurrentPageReport = function(paginator) {
		MinimalCurrentPageReport.superclass.constructor.call(this, paginator);
	};

	lang.extend(MinimalCurrentPageReport, Paginator.ui.CurrentPageReport, {
		update: function(e) {
			if (e && e.prevValue === e.newValue) {
				return;
			}

			var values = this.paginator.get('pageReportValueGenerator')(this.paginator);
			if (values['totalRecords'] > 0) {
				this.span.innerHTML = Paginator.ui.CurrentPageReport.sprintf(this.paginator.get('pageReportTemplate'), values);
			} else {
				this.span.innerHTML = '';
			}
		}
	});

	/**
	 * UI component to generate the 'Show more' paginator link.
	 *
	 * @namespace YAHOO.widget.Paginator.ui
	 * @class ShowMoreLink
	 * @constructor
	 * @param paginator {Pagintor} The paginator instance to attach to.
	 */
	var ShowMoreLink = function(paginator) {
		this.paginator = paginator;
		paginator.subscribe('rowsPerPageChange', this.update, this, true);
		paginator.subscribe('totalRecordsChange', this.update, this, true);
		paginator.subscribe('rowsPerPageChange', this.loadingComplete, this, true);
		paginator.subscribe('totalRecordsChange', this.loadingComplete, this, true);
		paginator.subscribe('destroy', this.destroy, this, true);
	};

	/**
	 * Decorates the paginator instances with the attribute used by this UI component.
	 *
	 * @method init
	 * @param paginator {Paginator} The paginator instance to decorate.
	 * @static
	 */
	ShowMoreLink.init = function(paginator) {
		/**
		 * The number of more rows to show when this UI component is clicked.
		 *
		 * @attribute showMoreRows
		 */
		paginator.setAttributeConfig('showMoreRows', {
			validator: lang.isNumber
		});
	};

	ShowMoreLink.prototype = {
		/**
		 * Generate the 'Show more' link.
		 *
		 * @method render
		 * @return {HTMLElement}
		 */
		render: function() {
			this.showMore = document.createElement('div');
			this.showMore.className = 'yui-pg-show-more';

			var loading = document.createElement('span');
			loading.className = 'yui-dt-loading';
			this.showMore.appendChild(loading);

			this.link = document.createElement('a');
			this.link.href = '#';
			this.link.innerHTML = Locale.get('widget.datatable.showMore.action');
			this.showMore.appendChild(this.link);

			this.update();
			Event.on(this.link, 'click', this.onClick, this, true);

			return this.showMore;
		},

		/**
		 * Gets the container of the DataTable and this paginator by looking for the class 'yui-dt'.
		 *
		 * @method _getContainer
		 * @private
		 */
		_getContainer: function() {
			if (!this.container) {
				this.container = Dom.getAncestorByClassName(this.showMore, 'yui-dt');
			}
			return this.container;
		},

		/**
		 * Hide the 'Show more' link if all the records are displayed.
		 *
		 * @method update
		 */
		update: function() {
			Dom[(this.paginator.getTotalRecords() === Paginator.VALUE_UNLIMITED || this.paginator.getTotalRecords() > this.paginator.getRowsPerPage()) ? 'addClass' : 'removeClass'](this.showMore, 'yui-pg-more-to-show');
		},

		/**
		 * Set the state of the paginator to 'loading' while data is loading.
		 *
		 * @method loading
		 */
		loading: function() {
			Dom.addClass(this._getContainer(), 'yui-pg-loading');
		},

		/**
		 * Set the state of the paginator to 'loadingComplete' after data has loaded.
		 *
		 * @method loadingComplete
		 */
		loadingComplete: function() {
			Dom.removeClass(this._getContainer(), 'yui-pg-loading');
		},

		/**
		 * Removes the link node and clears event listeners.
		 *
		 * @method destroy
		 * @private
		 */
		destroy: function() {
			Event.purgeElement(this.link);
			this.showMore.parentNode.removeChild(this.showMore);
			this.link = null;
			this.showMore = null;
		},

		/**
		 * Listener for the link's onclick event. Updates the number of records displayed.
		 *
		 * @method onClick
		 * @param e {DOMEvent} The click event.
		 */
		onClick: function(e) {
			var p = this.paginator;
			var newRowsPerPage = p.getRowsPerPage() + p.get('showMoreRows');
			if (p.getTotalRecords() !== Paginator.VALUE_UNLIMITED && newRowsPerPage + p.get('showMoreRows') > p.getTotalRecords()) {
				newRowsPerPage = p.getTotalRecords();
			}
			this.loading();
			p.setRowsPerPage(newRowsPerPage);
			Event.stopEvent(e);
		}
	};

	ORCHESTRAL.widget.DataTable = DataTable;
	ORCHESTRAL.widget.DataTable.XHRDataSource = XHRDataSource;
	ORCHESTRAL.widget.DataTablePaginator = DataTablePaginator;
	Paginator.ui.DataTableToolbar = DataTableToolbar;
	Paginator.ui.ShowMoreLink = ShowMoreLink;
	Paginator.ui.MinimalCurrentPageReport = MinimalCurrentPageReport;
}());

YAHOO.register('orchestral-datatable', ORCHESTRAL.widget.DataTable, {version: '7.9', build: '0'});


}, '7.9.0', {
    "requires": [
        "yui2-yahoo",
        "yui-base",
        "yui2-element",
        "yui2-datasource",
        "yui2-paginator",
        "yui2-event-mouseenter",
        "yui2-datatable",
        "yui2-orchestral",
        "yui2-orchestral-autorefresh",
        "yui2-orchestral-dom",
        "ohp-locale-translations",
        "yui2-orchestral-button",
        "yui2-orchestral-form",
        "yui2-animation"
    ]
});
