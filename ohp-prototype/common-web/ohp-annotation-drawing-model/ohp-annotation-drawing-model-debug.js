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
YUI.add('ohp-annotation-drawing-model', function (Y, NAME) {

"use strict";
/**
DrawingModel Base class. All DrawingModels will extend.
DrawingModels handle adding shapes to make up a Drawing, selection status of the Drawing,
and whether the Drawing is hit by a given point.

@module ohp-annotation-drawing-model
**/

/**
DrawingModel Base class. All Tool DrawingModels will extend.
DrawingModels handle adding shapes to make up a Drawing, selection status of the Drawing,
and whether the Drawing is hit by a given point.

@class DrawingModel
@namespace OHP.Annotation
@constructor
@extends Model
**/
var DrawingModel = Y.Base.create('ohp-annotation-drawing-model', Y.Model, [], {

	/*
	 * Adds shapes to draw the drawing to the given layer and returns an array of the added shapes
	 */
	addShapes: function(/*layer*/) {
	},

	/*
	 * returns true if the given point hits this drawing
	 */
	hit: function(/*point*/) {
	},

	toggleSelected: function() {
		this.set('selected', !this.get('selected'));
	}

}, {
	ATTRS: {
		bounds: {},

		selected: {
			value: false
		},

		highlighted: {
			value: false
		}
	}
});

Y.namespace('OHP.Annotation').DrawingModel = DrawingModel;


}, '7.9.0', {"requires": ["model", "base", "ohp-annotation-layer"]});
