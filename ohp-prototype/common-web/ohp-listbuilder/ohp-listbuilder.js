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
YUI.add('ohp-listbuilder', function (Y, NAME) {

/**
A listbuilder is made up of 1 option list and 1 selected list
And user can move items between option list and selected list

@module ohp-listbuilder
**/
var Lang = Y.Lang,

	SELECTED_LIST = '.selected-list',
	OPTIONS_LIST = '.options-list',
	//SELECTED_TITLE = '.selected-title',
	//OPTIONS_TITLE = '.options-title',
	ADD_LINK = '.add-item',
	REMOVE_LINK = '.remove-item',
	HIDDEN_LIST='.selected-options-list';

/**
@class ListBuilder
@constructor
@namespace OHP
@extends Widget
**/
function ListBuilder(/*config*/) {
	ListBuilder.superclass.constructor.apply(this, arguments);
}

ListBuilder.NAME = 'ohp-listbuilder';
ListBuilder.ATTRS = {

	/**
	The set of records used to populate the option list.
	If a <code>select</code> control is found in the <code>srcNode</code>,
	it will be used to populate the value of <code>recordset</code> via <code>HTML_PARSER</code>

	@attribute recordset
	@type Recordset
	**/
	recordset : {
		value: null,
		setter: function(value) {
			if (Lang.type(value)==='Recordset') {
				return value;
			}
			return value;//new Y.Recordset(value);
		}
	},

	/**
	The maximum number of selected items

	@attribute maxSelect
	@type Number
	**/
	maxSelect : {
		value: -1,
		setter: function(value) {
			return parseInt(value, 10);
		},
		getter: function(val) {
			return parseInt(val, 10);
		}
	},

	/**
	The title used for the option list

	@attribute optionTitle
	@type String
	**/
	optionTitle: {value: ''},

	/**
	The title used for the selected list

	@attribute selectedTitle
	@type String
	**/
	selectedTitle : {value:''},

	/**
	Set to true if required

	@attribute isRequired
	@default false
	@type Boolean
	**/
	isRequired : {value :false},

	/**
	The selected items is an Array of objects with properties:
		<ul>
			<li><code>id</code>: The <code>value</code> of the node</li>
			<li><code>name</code>: The content of the node</li>
		</ul>

	@attribute selected
	@type Array
	**/
	selected: {
		value: null,
		getter: function() {
			var selBox = this.get('contentBox').one(HIDDEN_LIST),
				selectedData = [];
			selBox.all('option').each(function(node) {
				selectedData.push({id:node.get('value'), name: node.getContent()});
			});
			return selectedData;
		}
	}
};

/*
* The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
* used to populate the configuration for the ListBuilder instance from markup already on the page.
*/
ListBuilder.HTML_PARSER = {
	recordset: function (srcNode) {

		if (srcNode.one('select')) {
			var domNode = srcNode.one('select').getDOMNode(),
				items,
				rs;

			if (domNode.tagName === 'SELECT') {
				items = [];
				srcNode.all('option').each(function(node) {
					items.push({id:node.get('value'), name: node.getContent()});
				});

				rs = new Y.Recordset({data:items});
				return rs;
			}
		}
	}
};

ListBuilder.LISTBUILDER_TEMPLATE = '<div id="wrapper" class="ohp-listbuilder">' +
	'<div class="ohp-listbuilder-content">' +
	'	<span class="main-list">' +
	'		<span class="label">{optionTitle}</span> <br />' +
	'		<select class="options-list" multiple="multiple">' +
	'		</select>' +
	'	</span>' +
	'	<span class="ohp-listbuilder-actions">' +
	'		<span class="actions-container">' +
	'			<a class="add-item" href="#"> </a>' +
	'			<a class="remove-item" href="#"> </a>' +
	'		</span>' +
	'	</span>' +
	'	<span class="selected-options">' +
	'		<span class="label">{selectedTitle} {required}</span> <br />' +
	'		<select class="selected-list" multiple="multiple">' +
	'		</select>' +
	'	</span>' +
	'	<select class="selected-options-list" id="{id}-selected" name="{id}-selected">' +
	'	</select>' +
	'</div>';

/* ListBuilder extends the base Widget class */
Y.extend(ListBuilder, Y.Widget, {
	_mynode : null,

	initializer: function() {
	},

	destructor : function() {
	},

	renderUI : function() {
		if (this._hasSelect()) {
			this._removeSelect();
		}
		var template = Y.substitute(ListBuilder.LISTBUILDER_TEMPLATE , {
			optionTitle: this.get('optionTitle'),
			selectedTitle:this.get('selectedTitle'),
			required : this.get('isRequired') ? '<em>*</em>' : '',
			id: this.get('srcNode').get('id')
		});
		this._mynode = Y.Node.create(template);

		this.get('recordset').each(function(item/*, index*/) {
			this._mynode.one(OPTIONS_LIST).insert(
				Y.Node.create('<option value="' + item.get('data').id + '">' + item.get('data').name + '</option>'));
		}, this);
		this.get('contentBox').insert(this._mynode);
	},

	bindUI : function() {
		var container = this.get('contentBox');

		container.one(ADD_LINK).on('click', this._addSelectedOptions, this);
		container.one(REMOVE_LINK).on('click', this._removeSelectedOptions, this);
		container.one(OPTIONS_LIST).on('dblclick', this._addSelectedOptions, this);
		container.one(SELECTED_LIST).on('dblclick',this._removeSelectedOptions, this);
	},

	syncUI : function() {
		/*
		 * syncUI is intended to be used by the Widget subclass to
		 * update the UI to reflect the initial state of the widget,
		 * after renderUI. From there, the event listeners we bound above
		 * will take over.
		 */

		// this._uiSetAttrA(this.get('attrA'));
	},

	/**
	Add all items from the option list to the selected list.

	@method addAll
	**/
	addAll: function() {
		var container = this.get('contentBox');

		container.one(OPTIONS_LIST).all('option').each(function(node) {
			if (this._isSelectionAvailable(container)) {
				container.one(SELECTED_LIST).insert(node);
				node.set('selected', false);
				container.one(HIDDEN_LIST).insert(node.cloneNode(true));
			}
		}, this);
	},

	/**
	Move all items from the selected list back to the option list.

	@method removeAll
	**/
	removeAll: function() {
		var container = this.get('contentBox');
		container.one(SELECTED_LIST).all('option').each(function(node) {
			container.one(OPTIONS_LIST).insert(node);
			node.set('selected', false);
			container.all(HIDDEN_LIST + ' option').each(function(node) {
				node.remove(true);
			});
		});
	},

	_addSelectedOptions : function(e) {
		var container = this.get('contentBox');
		container.one(OPTIONS_LIST).all('option').each(function(node) {

			if (node.get('selected') && this._isSelectionAvailable(container) ) {
				container.one(SELECTED_LIST).insert(node);
				node.set('selected', false);
				container.one(HIDDEN_LIST).insert(node.cloneNode(true));
			}

		}, this);
		e.preventDefault();
	},

	_removeSelectedOptions : function(e) {
		var container = this.get('contentBox');
		container.one(SELECTED_LIST).all('option').each(function(node) {
			if (node.get('selected') ) {
				container.one(OPTIONS_LIST).insert(node);
				node.set('selected', false);
				container.one(HIDDEN_LIST).one('option[value="'+node.get('value') + '"]').remove(true);
			}
		});
		e.preventDefault();
	},

	_isSelectionAvailable : function() {
		var max = parseInt(this.get('maxSelect'),10),
			container;

		if (max === -1) {
			return true;
		}

		container = this.get('contentBox');
		return container.one(SELECTED_LIST).all('option').size() <  max;
	},

	_hasSelect:function() {
		var select = this.get('contentBox').one('select');
		if (select) {
			return true;
		}
		return false;
	},

	_removeSelect: function() {
		this.get('contentBox').one('select').remove();
	}

});

Y.namespace('OHP').ListBuilder = ListBuilder;


}, '7.9.0', {
    "requires": [
        "node",
        "dom",
        "selector-css3",
        "event",
        "recordset",
        "substitute",
        "widget"
    ],
    "skinnable": true
});
