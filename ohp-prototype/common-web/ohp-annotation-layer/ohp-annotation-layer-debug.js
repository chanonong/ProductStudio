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
YUI.add('ohp-annotation-layer', function (Y, NAME) {

"use strict";
/**
A single Drawing Layer which includes a renderable Graphic object with Shapes
that can be added and removed.

@module ohp-annotation-layer
**/

/**
A single Drawing Layer which includes a renderable Graphic object with Shapes
that can be added and removed.

@class Layer
@namespace OHP.Annotation
@constructor
@extends Base
**/
var Layer = Y.Base.create('ohp-annotation-layer', Y.Base, [], {

	// TODO: do we want this object to even create(so destroy) any nodes or what?
	initializer: function() {
		this._graphic = new Y.Graphic({
			render: false
		});
	},

	render: function() {
		this._graphic.render(this.get('container'));
	},

	clear: function() {
		this._graphic.clear();
	},

	addPath: function() {
		return this.addShape({
			type: 'path'
		});
	},

	addRect: function(x, y, width, height) {
		// Uses Shape of type path instead of directly creating Shape of type rect
		// weird bug with addRect in IE with VML fallback, see COW-2389
		var rectangle = this.addShape({
			type: 'path'
		});
		rectangle.moveTo(x, y);
		rectangle.lineTo(x + width, y);
		rectangle.lineTo(x + width, y + height);
		rectangle.lineTo(x, y + height);
		rectangle.lineTo(x, y);
		rectangle.end();
		return rectangle;
	},

	addShape: function(config) {
		return this._graphic.addShape(Y.merge(config, {
			stroke: this.get('stroke')
		}));
	},

	removeShape: function(shape) {
		this._graphic.removeShape(shape);
	},

	/*
	 * Returns position as point object with x and y attrs
	 */
	getXY: function() {
		var positionXY = this._graphic.getXY();
		return {
			x: positionXY[0],
			y: positionXY[1]
		};
	}
}, {
	ATTRS: {
		container: {},
		width: {},
		height: {},
		stroke: {
			value: {
				linecap: 'round',
				linejoin: 'round'
			},
			setter: function(value) {
				var previousValue = this.get('stroke');
				return Y.merge(previousValue, value);
			}
		}
	}
});

Y.namespace('OHP.Annotation').Layer = Layer;


}, '7.9.0', {"requires": ["yui-base", "base", "graphics"]});
