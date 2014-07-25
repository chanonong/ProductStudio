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
YUI.add('ohp-annotation-drawing-view', function (Y, NAME) {

"use strict";
/**
View of DrawingModel. Handles rendered Drawing, Selection Box and Highlighting.

@module ohp-annotation-drawing-view
**/

/**
View of DrawingModel. Handles rendered Drawing, Selection Box and Highlighting.

@class DrawingView
@namespace OHP.Annotation
@constructor
@extends View
**/
var DrawingView = Y.Base.create('ohp-annotation-drawing-view', Y.View, [], {

	initializer: function(/*config*/) {
		var drawingModel = this.get('drawingModel');

		// when the models selected state changes, update the shape to be the selected colour
		// and drawing a box on the selection layer
		drawingModel.after('selectedChange', function(e) {
			var selectionLayer = this.get('selectionLayer'),
				layerWidth = selectionLayer.get('width'),
				layerHeight = selectionLayer.get('height'),
				stroke = this._getStroke(),
				padding = DrawingView.SELECTED_BOX_PADDING,
				margin = DrawingView.SELECTED_BOX_MARGIN,
				bounds, boxLeft, boxTop, boxWidth, boxHeight;

			// first update stroke
			Y.Array.each(this._shapes, function(shape){
				shape.set('stroke', stroke);
			});

			// then draw or remove selected box
			if (e.newVal) {
				bounds = drawingModel.get('bounds');
				boxLeft = Math.max(margin, bounds.left - padding);
				boxTop = Math.max(margin, bounds.top - padding);
				boxWidth = Math.min(layerWidth, bounds.right + padding) - boxLeft - margin;
				boxHeight = Math.min(layerHeight, bounds.bottom + padding) - boxTop - margin;
				this._selectedBox = selectionLayer.addRect(boxLeft, boxTop, boxWidth, boxHeight);
			} else {
				selectionLayer.removeShape(this._selectedBox);
			}
		}, this);

		// when the model is highlighted, update the stroke color
		drawingModel.after('highlightedChange', function(/*e*/) {
			var stroke = this._getStroke();
			Y.Array.each(this._shapes, function(shape){
				shape.set('stroke', stroke);
			});
		}, this);
	},

	_getStroke: function() {
		var drawingModel = this.get('drawingModel'),
			stroke = {};

		if (drawingModel.get('highlighted')) {
			stroke.color = '#63afe1';
		} else if (drawingModel.get('selected')) {
			stroke.color = '#aad3ef';
		} else {
			stroke.color = '#007bce';
		}
		return stroke;
	},

	render: function() {
		var drawingLayer = this.get('drawingLayer');
		drawingLayer.set('stroke', this._getStroke());
		this._shapes = this.get('drawingModel').addShapes(drawingLayer);
		return this;
	}

}, {
	ATTRS: {
		drawingModel: {
			writeOnce: 'initOnly'
		},
		drawingLayer: {
			writeOnce: 'initOnly'
		},
		// selection layer is where the selected drawing marquee is drawn
		selectionLayer: {
			writeOnce: 'initOnly'
		}
	},
	// Offset of select box from drawing.
	SELECTED_BOX_PADDING: 5,
	// Offset of select box from border of drawing area.
	SELECTED_BOX_MARGIN: 1
});

Y.namespace('OHP.Annotation').DrawingView = DrawingView;


}, '7.9.0', {
    "requires": [
        "ohp-annotation-drawing-model",
        "yui-base",
        "base",
        "view",
        "ohp-annotation-layer",
        "event-base"
    ]
});
