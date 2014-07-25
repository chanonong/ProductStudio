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
YUI.add('ohp-editable', function (Y, NAME) {

/**
Provides a basic plugin functionality for handling a popover with form elements
@module ohp-editable
**/

/**
A plugin to the Popover Widget that allows the popover instance to be locked into a visible state during editing
of a form
@class Editable
@namespace OHP
@constructor
@extends Plugin
**/
function Editable(/*config*/) {
	Editable.superclass.constructor.apply(this, arguments);
}

Editable.NAME = 'ohp-editable';
Editable.NS = 'editable';

Y.extend(Editable, Y.Plugin.Base, {
	initializer: function() {
		this.afterHostEvent('render', this._setupPopoverLocking);
		this.afterHostMethod('set', function(attr, value) {
			if (attr === 'content' && value) {
				this._setupPopoverLocking();
			}
		});
	},

	_setupPopoverLocking : function() {
		var host = this.get('host');

		host.get('contentBox').all('input,textarea').each(function(node){
			node.addClass('evented');
			node.on('keypress',function(){
				host.lock();
			});
		});
		host.get('contentBox').all('input,textarea,select').on('change', function(/*e*/){
			host.lock();
		});
	}
});
Y.namespace('Plugin.OHP').Editable = Editable;


}, '7.9.0', {"requires": ["plugin"]});
