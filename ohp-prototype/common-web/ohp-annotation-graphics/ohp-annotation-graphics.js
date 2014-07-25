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
YUI.add('ohp-annotation-graphics', function (Y, NAME) {

"use strict";
/**
Extension of Y.Graphics module, for creating custom TextShape and RoundedRect shapes
in SVG with VML fallback

@module ohp-annotation-graphics
**/

var doc = Y.config.doc,
	textShapePrototype,
	TextShape,
	RoundedRect;

// prototype functionality of TextShape is different for each Graphic type
if (Y.Graphic === Y.SVGGraphic) {
	textShapePrototype = {
		_type: 'text',

		_draw: function() {
			TextShape.superclass._draw.apply(this, arguments);
			Y.one(this.node).set('text', this.get('text'));
		}
	};
} else if (Y.Graphic === Y.VMLGraphic) {
	textShapePrototype = {
		_type: 'shape',

		_draw: function() {
			var node = this.node,
				text = this.get('text'),
				color = this.get('stroke').color,
				pathNode, fillNode;

			this.clear();

			// draw path to attach text to
			this.moveTo(-3,-4); // magic number approximate half width and height of a character to get it to start in the right place
			this.lineTo(8*text.length,-4); // ditto
			this.end();

			if (!this.textpathNode) {
				// create necessary VML elements to draw text
				// TODO: move common strings to constants
				pathNode = doc.createElement(
					'<path textpathok="true" style="behavior:url(#default#VML);" xmlns="urn:schemas-microsft.com:vml" />');
				fillNode = doc.createElement(
					'<fill color="' + color + '" style="behavior:url(#default#VML);" on="true" xmlns="urn:schemas-microsft.com:vml" />');
				this.textpathNode = doc.createElement(
					'<textpath string="' + text +
					'" style="font-size:14px;behavior:url(#default#VML);" on="true" xmlns="urn:schemas-microsft.com:vml" />');

				node.appendChild(pathNode);
				node.appendChild(fillNode);
				node.appendChild(this.textpathNode);
			}
			// TODO: redraw doesn't work - updating the attributes doesn't do anything, removing and readding does...
			// but for some reason the text disappears a few seconds after
		}
	};
} else if (Y.Graphic === Y.CanvasGraphic) {
	// TODO support canvas; currently not an issue because YUI uses SVG instead of Canvas for all browsers that support Canvas
	textShapePrototype = {};
}

/**
Custom extension of Shape, to create Text Shapes.

@class TextShape
@namespace OHP.Annotation
@constructor
@extends Shape
**/
TextShape = Y.Base.create('ohp-annotation-graphics-text', Y.Shape, [], textShapePrototype, {
	ATTRS: Y.mix({
		text: {
			value: ''
		}
	}, Y.Shape.ATTRS)
});

Y.namespace('OHP.Annotation').TextShape = TextShape;

/**
Custom extension of Shape, to create Rounded Rect Shapes.
Algorithm taken from taken from http://nacho4d-nacho4d.blogspot.co.nz/2011/05/bezier-paths-rounded-corners-rectangles.html

@class RoundedRect
@namespace OHP.Annotation
@constructor
@extends Shape
**/
RoundedRect = Y.Base.create('ohp-annotation-graphics-rounded-rect', Y.Shape, [], {
	_draw: function() {
		var KAPPA = 0.552228474,
			w = this.get('width'),
			h = this.get('height'),
			r = h/2, // ellipse radius
			k = KAPPA * r; // kappa proportion of radius
		this.clear();
		this.moveTo(0, r);
		this.lineTo(0, h - r);
		this.curveTo(0, h - r + k, r - k, h, r, h);
		this.lineTo(w - r, h);
		this.curveTo(w - r + k, h, w, h - r + k, w, h - r);
		this.lineTo(w, r);
		this.curveTo(w, r - k, w - r + k, 0, w - r, 0);
		this.lineTo(r, 0);
		this.curveTo(r - k, 0, 0, r - k, 0, r);
		this.end();
	}
}, {
	ATTRS: Y.Shape.ATTRS
});

Y.namespace('OHP.Annotation').RoundedRect = RoundedRect;


}, '7.9.0', {"requires": ["node", "base", "graphics"]});
