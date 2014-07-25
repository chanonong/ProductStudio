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
YUI.add('ohp-annotation-browser-test-tool', function (Y, NAME) {

"use strict";
/**
This is a Tool for temporary use. It is used to show a certain consistent
drawing which can then be used to test across browsers.

@module ohp-annotation-browser-test-tool
**/

var FreehandModel = Y.OHP.Annotation.FreehandModel,
	BrowserTestTool;

/**
This is a Tool for temporary use. It is used to show a certain consistent
drawing which can then be used to test across browsers.

@class BrowserTestTool
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.Tool
**/
BrowserTestTool = Y.Base.create('ohp-annotation-browser-test-tool', Y.OHP.Annotation.Tool, [], {

	initializer: function() {
		this.set('name', 'test');
		this.set('type', 'drawing');
	},

	start: function(/*config*/) {
		// just a test tool, relax jshint
		/*jshint maxstatements:35*/

		var drawingModelList = this.get('annotationModel').get('drawingModelList'),
			freehandModel;

		// Dot test.
		// VML doesn't draw a dot.
		freehandModel = new FreehandModel();
		freehandModel.addPoint({ x: 150, y: 150 });
		//freehandModel.addPoint({ x: 150, y: 150 });
		freehandModel.end({ x: 150, y: 150 });
		drawingModelList.add(freehandModel);


		freehandModel = new FreehandModel();
		freehandModel.addPoint({ x: 20, y: 20 });
		freehandModel.addPoint({ x: 260, y: 256 });
		freehandModel.addPoint({ x: 333, y: 98 });
		freehandModel.end({ x: 400, y: 249 });
		drawingModelList.add(freehandModel);

		freehandModel = new FreehandModel();
		freehandModel.addPoint({ x: 200, y: 20 });
		freehandModel.addPoint({ x: 250, y: 20 });
		freehandModel.addPoint({ x: 250, y: 70 });
		freehandModel.addPoint({ x: 200, y: 70 });
		freehandModel.end({ x: 200, y: 20 });
		drawingModelList.add(freehandModel);

		freehandModel = new FreehandModel();
		freehandModel.addPoint({ x: 450, y: 50 });
		freehandModel.addPoint({ x: 550, y: 50 });
		freehandModel.addPoint({ x: 550, y: 250 });
		freehandModel.addPoint({ x: 450, y: 250 });
		freehandModel.end({ x: 450, y: 50 });
		drawingModelList.add(freehandModel);

		freehandModel = new FreehandModel();
		freehandModel.addPoint({ x: 50, y: 550 });
		freehandModel.addPoint({ x: 550, y: 550 });
		freehandModel.addPoint({ x: 550, y: 350 });
		freehandModel.end({ x: 50, y: 550 });
		drawingModelList.add(freehandModel);
	}
});

Y.namespace('OHP.Annotation').BrowserTestTool = BrowserTestTool;


}, '7.9.0', {"requires": ["ohp-annotation-tool", "base", "ohp-annotation-freehand-model"]});
