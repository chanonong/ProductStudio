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
YUI.add('ohp-annotation-freehand-tool', function (Y, NAME) {

"use strict";
/**
Tool for creating Freehand Drawings

@module ohp-annotation-freehand-tool
**/

var FreehandModel = Y.OHP.Annotation.FreehandModel,
	FreehandTool;

/**
Tool for creating Freehand Drawings

@class FreehandTool
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.Tool
**/
FreehandTool = Y.Base.create('ohp-annotation-freehand-tool', Y.OHP.Annotation.Tool, [], {

	initializer: function() {
		this.set('name', 'freehand');
		this.set('type', 'drawing');
	},

	start: function(layer, point) {
		layer.clear();
		layer.set('stroke', {
			color:'#61C0FF',
			weight: 3
		});

		this._path = layer.addPath();
		this._path.moveTo(point.x, point.y);

		this._currentFreehandModel = new FreehandModel();
		this._currentFreehandModel.addPoint(point);

		this._layer = layer;
	},

	drag: function(point) {
		if (this._currentFreehandModel.addPoint(point)) {
			// only draw the point if it was added to the model
			this._path.lineTo(point.x, point.y);
			this._path.end();
		}
	},

	end: function(point) {
		this._currentFreehandModel.end(point);
		// Add new drawing once complete, to the Annotation Model
		this.get('annotationModel').get('drawingModelList').add(this._currentFreehandModel);
		// Clear tool layer once tool has completed 'in progress' drawing
		// new drawing will be drawn to drawing layer
		this._layer.clear();
		this._currentFreehandModel = null;
	}
});

Y.namespace('OHP.Annotation').FreehandTool = FreehandTool;


}, '7.9.0', {"requires": ["ohp-annotation-tool", "base", "ohp-annotation-freehand-model", "ohp-annotation-layer"]});
