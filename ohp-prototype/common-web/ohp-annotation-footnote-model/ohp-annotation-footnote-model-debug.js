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
YUI.add('ohp-annotation-footnote-model', function (Y, NAME) {

"use strict";
/**
Extension of DrawingModel for creating Footnote Drawings

@module ohp-annotation-footnote-model
**/

var TextShape = Y.OHP.Annotation.TextShape,
	RoundedRect = Y.OHP.Annotation.RoundedRect,
	FootnoteModel,

	// TODO remove this when get externally set number
	n = 1;

/**
Extension of DrawingModel for creating Footnote Drawings

@class FootnoteModel
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.DrawingModel
**/
FootnoteModel = Y.Base.create('ohp-annotation-footnote-model', Y.OHP.Annotation.DrawingModel, [], {

	addShapes: function(layer) {
		// TODO drive these off font size?
		var charWidth = 8, // magic number, characters are about 8 px wide
			charHeight = 10,  // magic number, characters are about 10 px high
			boxVerticalPadding = 3, // magic number, just a bit of padding
			point = this.get('point'),
			number = String(this.get('number')),
			numberWidth = charWidth * number.length,
			numberHeight = charHeight,
			boxHeight = numberHeight + boxVerticalPadding * 2,
			boxWidth = numberWidth + (boxHeight - charWidth),
			boxX = point.x - boxWidth / 2,
			boxY = point.y - boxHeight / 2,
			layerWidth = layer.get('width'),
			layerHeight = layer.get('height'),
			xOffset = 0,
			yOffset = 0,
			numberShape,
			boxShape;

		if (boxX < 0) {
			xOffset = -boxX;
		} else if (boxX + boxWidth > layerWidth) {
			xOffset = layerWidth - boxX - boxWidth;
		}

		if (boxY < 0) {
			yOffset = -boxY;
		} else if (boxY + boxHeight > layerHeight) {
			yOffset = layerHeight - boxY - boxHeight;
		}

		layer.set('stroke', {weight: 1});
		numberShape = layer.addShape({
			type: TextShape,
			// center the number on the point, 0,0 is bottom left, so shift left and down
			x: point.x + xOffset - numberWidth / 2 + 1, // magic number +1px to get it to look right
			y: point.y + yOffset + numberHeight / 2,
			width: numberWidth,
			height: numberHeight,
			text: number
		});

		layer.set('stroke', {weight: 2});
		boxShape = layer.addShape({
			type: RoundedRect,
			x: boxX + xOffset,
			y: boxY + yOffset,
			width: boxWidth,
			height: boxHeight
		});

		this.set('bounds', {
			left: boxX + xOffset,
			top: boxY + yOffset,
			right: boxX + xOffset + boxWidth,
			bottom: boxY + yOffset + boxHeight
		});

		return [numberShape, boxShape];
	},

	hit: function(point) {
		var bounds = this.get('bounds');
		return (point.x > bounds.left - 10 && point.x < bounds.right + 10 &&
				point.y > bounds.top - 10 && point.y < bounds.bottom + 10);
	}

}, {
	ATTRS: {
		point: {},

		number: {
			// TODO remove all of this and rely on external setting of number
			getter: function() {
				return n += 1;
			}
		},

		text: {}
	}
});

Y.namespace('OHP.Annotation').FootnoteModel = FootnoteModel;


}, '7.9.0', {
    "requires": [
        "model",
        "ohp-annotation-drawing-model",
        "base",
        "ohp-annotation-layer",
        "ohp-annotation-graphics"
    ]
});
