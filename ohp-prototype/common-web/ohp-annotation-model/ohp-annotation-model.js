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
YUI.add('ohp-annotation-model', function (Y, NAME) {

"use strict";
/**
Holds ToolModelList and DrawingModelList which make up an Annotation,
rendered by an AnnotationView.

@module ohp-annotation-model
**/

/**
Holds ToolModelList and DrawingModelList which make up an Annotation,
rendered by an AnnotationView.

@class AnnotationModel
@namespace OHP.Annotation
@constructor
@extends Model
**/
var AnnotationModel = Y.Base.create('ohp-annotation-model', Y.Model, [], {

	initializer: function() {
		// TODO: Set up getting Tools from Tool Registry

		var toolModelList = this.get('toolModelList');

		// Add available tools as ToolModels
		// TODO: make sure naming throughout modules is consistent when referring to toolList, toolModel and tool to prevent confusion here
		toolModelList.add(new Y.OHP.Annotation.ToolModel({
			tool: new Y.OHP.Annotation.FreehandTool({
				annotationModel: this
			})
		}));

		toolModelList.add(new Y.OHP.Annotation.ToolModel({
			tool: new Y.OHP.Annotation.FootnoteTool({
				annotationModel: this
			})
		}));

		toolModelList.add(new Y.OHP.Annotation.ToolModel({
			tool: new Y.OHP.Annotation.SelectTool({
				annotationModel: this
			})
		}));

		// This is a temporary tool
		// Used as a hook into showing a certain drawing that can be tested across browsers
		toolModelList.add(new Y.OHP.Annotation.ToolModel({
			tool: new Y.OHP.Annotation.BrowserTestTool({
				annotationModel: this
			})
		}));
	}

}, {

	ATTRS: {
		toolModelList: {
			readOnly: true,
			value: new Y.OHP.Annotation.ToolModelList()
		},
		drawingModelList: {
			readOnly: true,
			value: new Y.OHP.Annotation.DrawingModelList()
		}
	}
});

Y.namespace('OHP.Annotation').AnnotationModel = AnnotationModel;


}, '7.9.0', {
    "requires": [
        "ohp-annotation-select-tool",
        "ohp-annotation-browser-test-tool",
        "ohp-annotation-drawing-model-list",
        "model",
        "ohp-annotation-tool-model",
        "ohp-annotation-freehand-tool",
        "base",
        "ohp-annotation-footnote-tool",
        "ohp-annotation-tool-model-list"
    ]
});
