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
YUI.add('ohp-annotation-drawing-area-view', function (Y, NAME) {

"use strict";
/**
The DrawingAreaView is one piece of the overall AnnotationView. It encompasses a collection of Layers
and a collection of DrawingViews, and translates DOM events into user interactions for drawing.

@module ohp-annotation-drawing-area-view
**/

var DrawingView = Y.OHP.Annotation.DrawingView,
	Layer = Y.OHP.Annotation.Layer,
	getClassName = Y.OHP.AnnotationClassNameManager.getClassName,
	DrawingAreaView;

/**
The DrawingAreaView is one piece of the overall AnnotationView. It encompasses a collection of Layers
and a collection of DrawingViews, and translates DOM events into user interactions for drawing.

@class DrawingAreaView
@namespace OHP.Annotation
@constructor
@extends View
**/
DrawingAreaView = Y.Base.create('ohp-annotation-drawing-area-view', Y.View, [], {
	events: {
		'.ohp-annotation-drawing-area': {
			mousedown: '_mouseDownHandler',
			mousemove: '_mouseMoveHandler',
			mouseup: '_mouseUpHandler'
		}
	},

	_mouseDown: false,

	initializer: function() {
		var annotationModel = this.get('annotationModel'),
			toolModelList = annotationModel.get('toolModelList'),
			drawingModelList = annotationModel.get('drawingModelList');

		// Adds and removes classes on drawing area container related to which tool is currently active
		toolModelList.on('activeToolModelChange', this._activeToolModelChangeHandler, this);

		// Setup initially active tool after binding activeToolChange event handler
		// TODO: maybe change the above so instead initial active tool class set in render by calling the same function
		// TODO: maybe let function accept either an index or a tool?
		toolModelList.set('activeToolModel', toolModelList.item(0));

		// Every time a new DrawingModel is added, create a new DrawingView to display it
		drawingModelList.after('add', function(e) {
			var drawingView = new DrawingView({
				drawingModel: e.model,
				drawingLayer: this.get('drawingLayer'),
				selectionLayer: this.get('selectionLayer')
			});
			drawingView.render();
		}, this);

		// Adds and removes classes on drawing area container related to whether a drawing is selectable
		drawingModelList.after('*:highlightedChange', this._highlightedDrawingChangeHandler, this);

		// Also end drawing if mouseup outside drawing area container
		Y.on('mouseupoutside', this._mouseUpHandler, '.ohp-annotation-drawing-area', this);

		// Also end drawing if mouse leaves body (window area)
		Y.on('mouseleave', this._mouseUpHandler, 'body', this);

		// Prevents IE7 & IE8 bug, where shapes highlight on select/drag
		// http://groups.google.com/group/google-excanvas/browse_thread/thread/997525f2234c2609?pli=1
		Y.on('selectstart', function(e) {
			e.preventDefault();
		}, '.ohp-annotation-drawing-area');
	},

	/*
	 * Adds and removes classes on drawing area container related to which tool is currently active
	 */
	_activeToolModelChangeHandler: function(e) {
		var container = this.get('container'),
			prevActiveToolModel = e.prevVal,
			prevActiveTool,
			activeTool;

		//TODO: even better class name management?

		if (prevActiveToolModel) {
			prevActiveTool = prevActiveToolModel.get('tool');
			container.removeClass(getClassName('active', 'tool', prevActiveTool.get('name')));
			container.removeClass(getClassName('active', 'tool', 'type', prevActiveTool.get('type')));
		}

		activeTool = e.newVal.get('tool');
		container.addClass(getClassName('active', 'tool', activeTool.get('name')));
		container.addClass(getClassName('active', 'tool', 'type', activeTool.get('type')));
	},

	/*
	 * Adds and removes classes on drawing area container related to whether a drawing is selectable
	 */
	_highlightedDrawingChangeHandler: function(e) {
		var container = this.get('container'),
			selectableClass = getClassName('selectable'),
			drawingModelList = this.get('annotationModel').get('drawingModelList');

		if (e.newVal) {
			// if drawing becomes highlighted, add class
			container.addClass(selectableClass);
		} else if (drawingModelList.get('highlightedCount') === 0) {
			// otherwise if no others are still highlighted, remove class
			container.removeClass(selectableClass);
		}
	},

	// TODO: should we enforce render to be called once?
	render: function() {
		var container = this.get('container'),
			drawingLayer,
			selectionLayer,
			toolLayer;

		container.addClass(getClassName('drawing', 'area'));

		container.setStyle('width', this.get('width'));
		container.setStyle('height', this.get('height'));

		drawingLayer = this.get('drawingLayer');
		selectionLayer = this.get('selectionLayer');
		toolLayer = this.get('toolLayer');

		drawingLayer.set('container', container);
		selectionLayer.set('container', container);
		toolLayer.set('container', container);

		drawingLayer.render();
		selectionLayer.render();
		toolLayer.render();

		return this;
	},

	/*
	 * Works out mouse position on drawing Layer from mouse position on screen and position of layer on screen.
	 * Returns null if the event occurred outside the container.
	 */
	_getEventPoint: function(event) {
		var pageOffset = this.get('drawingLayer').getXY(),
			x = event.pageX - pageOffset.x,
			y = event.pageY - pageOffset.y;

		if (x <= 0 || x >= this.get('width') || y <= 0 || y >= this.get('height')) {
			return null;
		} else {
			return {
				x: x,
				y: y
			};
		}
	},

	// TODO: think more about interaction with the model here, how DOM events translate into tool actions..

	/*
	 * Reference to body element, to add and remove classes when user interaction in-progress
	 */
	_getBodyElement: function() {
		// Ensures only get body element once
		if (!this._bodyEl) {
			this._bodyEl = this.get('container').ancestor('body');
		}
		return this._bodyEl;
	},

	/*
	 * Mouse down handler.
	 * Starts the active Tool, and adds user interaction in progress flags.
	 */
	_mouseDownHandler: function(e) {
		var point;
		// If didn't detect mouseUp, _mouseDown will still be true, so just continue.
		// Can only use primary mouse button to draw, see http://yuilibrary.com/yui/docs/api/classes/DOMEventFacade.html#property_button
		if (!this._mouseDown && e.button === 1) {
			point = this._getEventPoint(e);
			if (point) {
				this._mouseDown = true;
				this.get('annotationModel').get('toolModelList').get('activeToolModel').get('tool').start(this.get('toolLayer'), point);
				// Adds class to body element, to indicate active tool action is in progress
				this._getBodyElement().addClass(getClassName('user-interaction', 'in-progress'));
			}
		}
	},

	/*
	 * Mouse move/drag handler.
	 * Calls drag on active Tool if interaction is in progress.
	 * Otherwise calls move on active Tool.
	 */
	_mouseMoveHandler: function(e) {
		var point = this._getEventPoint(e),
			tool;

		if (point) {
			tool = this.get('annotationModel').get('toolModelList').get('activeToolModel').get('tool');
			if (this._mouseDown) {
				tool.drag(point);
			} else {
				tool.move(point);
			}
		}
	},

	/*
	 * Mouse up handler.
	 * Ends the active Tool, and removes user interaction in progress flags.
	 */
	_mouseUpHandler: function(e) {
		var point;
		// The 'mouseupoutside' event is getting fired even for mouseup inside the drawing area
		// so this ensures end is not called twice.
		if (this._mouseDown) {
			point = this._getEventPoint(e);
			this._mouseDown = false;
			this.get('annotationModel').get('toolModelList').get('activeToolModel').get('tool').end(point);
			this._getBodyElement().removeClass(getClassName('user-interaction', 'in-progress'));
		}
	}

}, {
	ATTRS: {
		annotationModel: {
			writeOnce: 'initOnly'
		},
		width: {
			writeOnce: 'initOnly'
		},
		height: {
			writeOnce: 'initOnly'
		},
		drawingLayer: {
			readOnly: true,
			valueFn: function() {
				return new Layer({
					width: this.get('width'),
					height: this.get('height')
				});
			}
		},
		selectionLayer: {
			readOnly: true,
			valueFn: function() {
				return new Layer({
					width: this.get('width'),
					height: this.get('height'),
					stroke: {
						color: '#AEB2B6',
						weight: 1,
						dashstyle: [3, 3]
					}
				});
			}
		},
		toolLayer: {
			readOnly: true,
			valueFn: function() {
				return new Layer({
					width: this.get('width'),
					height: this.get('height')
				});
			}
		}
	}
});

Y.namespace('OHP.Annotation').DrawingAreaView = DrawingAreaView;


}, '7.9.0', {
    "requires": [
        "ohp-annotation-drawing-view",
        "node-core",
        "ohp-annotation-class-name-manager",
        "node-style",
        "yui-base",
        "base",
        "view",
        "ohp-annotation-layer",
        "event-mouseenter",
        "event-base",
        "event-outside",
        "node-base"
    ]
});
