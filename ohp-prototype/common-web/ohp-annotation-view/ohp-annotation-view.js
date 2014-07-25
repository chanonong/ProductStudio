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
YUI.add('ohp-annotation-view', function (Y, NAME) {

"use strict";
/**
The overall AnnotationView of the AnnotationModel. It encorporates the DrawingAreaView
that handles rendering, adding and removing drawings, and the ToolboxView that handles
Tool selection and the rendered toolbox.

@module ohp-annotation-view
**/

var DrawingAreaView = Y.OHP.Annotation.DrawingAreaView,
	ToolboxView = Y.OHP.Annotation.ToolboxView,
	AnnotationView;

/**
The overall AnnotationView of the AnnotationModel. It encorporates the DrawingAreaView
and the ToolboxView

@class AnnotationView
@namespace OHP.Annotation
@constructor
@extends View
**/
AnnotationView = Y.Base.create('ohp-annotation-view', Y.View, [], {

	_drawingAreaView: null,

	_toolboxView: null,

	initializer: function() {
		var annotationModel = this.get('annotationModel'),
			width = this.get('width'),
			height = this.get('height');

		// Annotation View creates Drawing Area and Toolbox Views
		this._drawingAreaView = new DrawingAreaView({
			annotationModel: annotationModel,
			container: Y.Node.create('<div/>'),
			width: width,
			height: height - ToolboxView.HEIGHT
		});
		this._toolboxView = new ToolboxView({
			annotationModel: annotationModel,
			container: Y.Node.create('<div/>'),
			width: width
		});
	},

	render: function() {
		var container = this.get('container');

		this._drawingAreaView.render();
		this._toolboxView.render();

		container.appendChild(this._drawingAreaView.get('container'));
		container.appendChild(this._toolboxView.get('container'));

		return this;
	}

}, {
	ATTRS: {
		annotationModel: {
			readOnly: true,
			value: new Y.OHP.Annotation.AnnotationModel()
		},
		width: {
			writeOnce: 'initOnly'
		},
		height: {
			writeOnce: 'initOnly'
		}
	}
});

Y.namespace('OHP.Annotation').AnnotationView = AnnotationView;


}, '7.9.0', {
    "requires": [
        "base",
        "ohp-annotation-model",
        "view",
        "ohp-annotation-toolbox-view",
        "ohp-annotation-drawing-area-view",
        "node-base"
    ]
});
