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
YUI.add('ohp-annotation-footnote-tool', function (Y, NAME) {

"use strict";
/**
Tool for creating Footnotes

@module ohp-annotation-footnote-tool
**/

var FootnoteModel = Y.OHP.Annotation.FootnoteModel,
	FootnoteTool;

/**
Tool for creating Footnotes

@class FootnoteTool
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.Tool
**/
FootnoteTool = Y.Base.create('ohp-annotation-footnote-tool', Y.OHP.Annotation.Tool, [], {

	initializer: function() {
		this.set('name', 'footnote');
		this.set('type', 'drawing');
	},

	start: function(layer, point) {
		this.get('annotationModel').get('drawingModelList').add(new FootnoteModel({
			point: point
		}));
	}
});

Y.namespace('OHP.Annotation').FootnoteTool = FootnoteTool;


}, '7.9.0', {"requires": ["ohp-annotation-tool", "ohp-annotation-footnote-model", "base"]});
