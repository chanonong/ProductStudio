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
YUI.add('ohp-constraint', function (Y, NAME) {

/**
Provides a plugin to a widget, with Standard Module content support. Can constrain the inner contets
of a widget by setting the max-height, max-width css properties on browsers that support it
otherwise set's the height and/or width
@class Constraint
@namespace OHP
@extends Plugin.Base
**/
function Constraint(/*config*/) {
	Constraint.superclass.constructor.apply(this, arguments);
}
Constraint.NAME = 'ohp-constraint';
Constraint.NS = 'constraint';
Constraint.ATTRS = {
	maxHeight: {
		value: null
	},
	maxWidth: {
		value: null
	}
};
Y.extend(Constraint, Y.Plugin.Base, {
	initializer: function() {
		Y.log('In the init of plugin');
		this.beforeHostMethod('show', this._beforeHostShowMethod);
		this.afterHostMethod('show', this._afterHostShowMethod);
		this.onHostEvent('render', this._onHostRenderEvent);
		this.afterHostEvent('render', this._afterHostRenderEvent);
		Y.log('at end of init');
	},
	destructor : function() {
	},
	_onHostRenderEvent : function(/*e*/) {
		Y.log('on render event -- plugin');
	},
	_afterHostRenderEvent : function(/*e*/) {
		Y.log('after render event -- plugin');
	},
	_beforeHostShowMethod : function() {

		var host = this.get('host'),
			contentBox = host.get('contentBox'),
			stdBod;

		contentBox.setStyle('maxWidth', '');
		contentBox.setStyle('maxHeight', '');
		contentBox.setStyle('overflow', 'auto');

		stdBod = host.getStdModNode(Y.WidgetStdMod.BODY);

		if (!stdBod) {
			stdBod = contentBox;
			host.set('bodyContent', contentBox.get('innerHTML'));
			stdBod = host.getStdModNode(Y.WidgetStdMod.BODY);
		} else {
			stdBod.setStyle('maxWidth', '');
			stdBod.setStyle('maxHeight', '');
			stdBod.setStyle('overflow', 'auto');
		}

		if ( this.get('maxWidth')) {
			stdBod.setStyle('maxWidth', this.get('maxWidth'));
			if (Y.one('body.ie6') || Y.one('body.ie7')) {
				stdBod.setStyle('width', this.get('maxWidth'));
			}
		}

		if (this.get('maxHeight')) {
			stdBod.setStyle('maxHeight', this.get('maxHeight'));
			stdBod.setStyle('overflow', 'scroll');
			if (Y.one('body.ie6') || Y.one('body.ie7')) {
				stdBod.setStyle('height', this.get('maxHeight'));
			}
		}
	},
	_afterHostShowMethod : function() {

	}
});
Y.namespace('OHP').Constraint = Constraint;



}, '7.9.0', {"requires": ["node", "widget-stdmod", "widget", "plugin"]});
