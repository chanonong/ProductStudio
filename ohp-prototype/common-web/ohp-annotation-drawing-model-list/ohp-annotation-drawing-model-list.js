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
YUI.add('ohp-annotation-drawing-model-list', function (Y, NAME) {

"use strict";
/**
ModelList of DrawingModels

@module ohp-annotation-drawing-model-list
**/

/**
ModelList of DrawingModels

@class DrawingModelList
@namespace OHP.Annotation
@constructor
@extends ModelList
**/
var DrawingModelList = Y.Base.create('ohp-annotation-drawing-list', Y.ModelList, [], {
	model: Y.OHP.Annotation.DrawingModel,

	clearSelection: function() {
		this.each(function (drawingModel) {
			// TODO: also add mouse out detection to 'unhighlight', so this wouldn't be so neccessary.
			drawingModel.set('highlighted', false);
			drawingModel.set('selected', false);
		});
	}
}, {
	ATTRS: {
		highlightedCount: {
			readOnly: true,
			getter: function() {
				return this.filter(function(drawingModel) {
					return drawingModel.get('highlighted');
				}).length;
			}
		}
	}
});

Y.namespace('OHP.Annotation').DrawingModelList = DrawingModelList;


}, '7.9.0', {"requires": ["model-list", "ohp-annotation-drawing-model", "base"]});
