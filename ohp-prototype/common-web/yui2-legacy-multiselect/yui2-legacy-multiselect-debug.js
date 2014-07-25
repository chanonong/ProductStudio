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
YUI.add('yui2-legacy-multiselect', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * @module legacy-multiselect
 * @requires legacy-iterator
 * @class <p>The MultiSelect class provides functionality to update a single
 * multi-select list using a more user friendly approach using two multi-select
 * lists - one that contains the conceptually selected items, and the other that
 * contains the conceptually unselected items. This is more user friendly
 * approach to a single multi-select list approach as users do not need to know
 * of the magic CTRL+click combination to select multiple items.</p>
 *
 * <p>For instance, this could be used to show what groups a user belongs to.
 * The selected items select could be called "Member of" and the unselected
 * items select could be called "Not a member of". The actual select when
 * submitted will contain the groups the user is a member of.</p>
 *
 * @param actualSelect the actual HTML select element that will be submitted to
 * the server
 * @param selectedItemsSelect the user visible HTML select element which will
 * conceptually contain the selected elements in the actual list. The
 * information in this list will not be submitted to the server.
 * @param unselectedItemsSelect the user visible HTML select element which will
 * conceptually contain the non-selected elements in the actual list. The
 * information in this list will not be submitted to the server.
 * @constructor
 */
function MultiSelect( actualSelect, selectedItemsSelect, unselectedItemsSelect ) {
	/** @private */
	this.actualSelect = actualSelect;
	/** @private */
	this.selectedItemsSelect = selectedItemsSelect;
	/** @private */
	this.unselectedItemsSelect = unselectedItemsSelect;

	// Add class names to the derived select fields so they are ignored by any
	// page dirty checks made using the Form.js library.
	this.selectedItemsSelect.className += " Derived";
	this.unselectedItemsSelect.className += " Derived";

	/**
	 * @private
	 */
	this.getActualOptions = function() {
		return new Iterator( this.actualSelect );
	};

	/**
	 * @private
	 */
	this.getSelectedItemsOptions = function() {
		return new Iterator( this.selectedItemsSelect );
	};

	/**
	 * Moves the selected items from the unselected item list into the selected
	 * item list. This selects those items in the actual select list.
	 */
	this.selectItems = function() {
		this.resetShowSelected();
		for( var unselectedItemsOptions = new Iterator( this.unselectedItemsSelect ); unselectedItemsOptions.hasNext(); ) {
			var unselectedItemsOption = unselectedItemsOptions.next();
			if( unselectedItemsOption.selected ) {
				for( var actualOptions = this.getActualOptions(); actualOptions.hasNext(); ) {
					var actualOption = actualOptions.next();
					if( actualOption.value == unselectedItemsOption.value ) {
						actualOption.selected = true;
						actualOption.showSelected = true;
						break;
					}
				}
			}
		}
		this.update();
	};

	/**
	 * Moves the selected items from the selected item list into the unselected
	 * item list. This unselects those items from the actual select list.
	 */
	this.unselectItems = function() {
		this.resetShowSelected();
		for( var selectedItemsOptions = this.getSelectedItemsOptions(); selectedItemsOptions.hasNext(); ) {
			var selectedItemsOption = selectedItemsOptions.next();
			if( selectedItemsOption.selected ) {
				for( var actualOptions = this.getActualOptions(); actualOptions.hasNext(); ) {
					var actualOption = actualOptions.next();
					if( actualOption.value == selectedItemsOption.value ) {
						actualOption.selected = false;
						actualOption.showSelected = true;
						break;
					}
				}
			}
		}
		this.update();
	};

	/**
	 * Updates the contents of both the selected and unselected item lists based
	 * on what is selected in the actual list. Retains the selected status of the
	 * items in both the selected and unselected item lists.
	 * @private
	 */
	this.update = function() {
		for( var i = 0; i < this.selectedItemsSelect.length; ) {
			this.selectedItemsSelect.remove( this.selectedItemsSelect[i] );
		}
		for( var i = 0; i < this.unselectedItemsSelect.length; ) {
			this.unselectedItemsSelect.remove( this.unselectedItemsSelect[i] );
		}
		for( var actualOptions = this.getActualOptions(); actualOptions.hasNext(); ) {
			var actualOption = actualOptions.next();
			var clonedOption = actualOption.cloneNode( true );
			if( actualOption.showSelected ) {
				clonedOption.selected = true;
			}
			if( actualOption.selected ) {
				this.selectedItemsSelect.appendChild( clonedOption );
			} else {
				this.unselectedItemsSelect.appendChild( clonedOption );
			}
		}
	};

	/**
	 * Resets the showSelected status of items in the actual list so they are
	 * false. The showSelected property has been defined by us for the purposes of
	 * retaining the selected status of options when they are moved between the
	 * visible selected and unselected item lists.
	 * @private
	 */
	this.resetShowSelected = function() {
		for( var actualOptions = this.getActualOptions(); actualOptions.hasNext(); ) {
			actualOptions.next().showSelected = false;
		}
	};

	// Initializes the selected and unselected item lists.
	this.update();
	// TODO: set the default selected values to work with the change highlighting.
	for( var selectedItemsOptions = this.getSelectedItemsOptions(); selectedItemsOptions.hasNext(); ) {
		selectedItemsOptions.next().defaultSelected = true;
	}
}
window.MultiSelect = MultiSelect;


}, '7.9.0', {"requires": ["yui2-legacy-iterator"]});
