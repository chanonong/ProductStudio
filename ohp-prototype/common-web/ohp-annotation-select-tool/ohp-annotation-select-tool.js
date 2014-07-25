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
YUI.add('ohp-annotation-select-tool', function (Y, NAME) {

"use strict";
/**
Tool for Selecting annotation Drawings

@module ohp-annotation-select-tool
**/

var Geometry = Y.OHP.Annotation.Geometry,
	SelectTool;

/**
Tool for Selecting annotation Drawings

@class SelectTool
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.Tool
**/
SelectTool = Y.Base.create('ohp-annotation-select-tool', Y.OHP.Annotation.Tool, [], {

	initializer: function() {
		this.set('name', 'select');
		this.set('type', 'select');
	},

	start: function(/*layer, point*/) {
		// TODO: if adding a marquee selection, either add a "click" function
		// or detect that the end is near start and no drag has occurred

		var drawingModelList = this.get('annotationModel').get('drawingModelList'),
			hitSomething = false;

		drawingModelList.each(function (drawingModel) {
			// don't test if the point hit or not, just see if we highlighted it when we were just moving the mouse
			if (drawingModel.get('highlighted')) {
				drawingModel.toggleSelected();
				hitSomething = true;
			}
		});

		if (!hitSomething) {
			drawingModelList.clearSelection();
		}
	},

	move: function(point) {
		// only test every 10 pixels, trying to optimise
		if (!this._prevPoint || Geometry.getDistanceBetweenPoints(point, this._prevPoint) >  10) {
			this._prevPoint = point;
			this.get('annotationModel').get('drawingModelList').each(function (drawingModel) {
				var hit = drawingModel.hit(point);
				if (drawingModel.get('highlighted') !== hit) {
					drawingModel.set('highlighted', hit);
				}
			});
		}
	}
});

Y.namespace('OHP.Annotation').SelectTool = SelectTool;


}, '7.9.0', {"requires": ["ohp-annotation-geometry", "ohp-annotation-tool", "base"]});
