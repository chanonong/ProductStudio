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
YUI.add('ohp-annotation', function (Y, NAME) {

"use strict";
/**
Creates an Annotation Widget by implementing the AnnotationView.

@module ohp-annotation
**/

var getClassName = Y.OHP.AnnotationClassNameManager.getClassName,
	Annotation;

/**
Creates an Annotation Widget by implementing the AnnotationView.

@class Annotation
@namespace OHP
@constructor
@extends Widget
**/
Annotation = Y.Base.create('ohp-annotation', Y.Widget, [], {

	BOUNDING_TEMPLATE: '<div />',
	// When null, content and bounding boxes are the same.
	CONTENT_TEMPLATE: null,

	initializer: function() {
		this.annotationView = new Y.OHP.Annotation.AnnotationView({
			container: this.get('contentBox'),
			width: this.get('width'),
			height: this.get('height')
		});
	},

	renderUI: function() {
		this.annotationView.render();
	}

}, {
	CSS_PREFIX: getClassName(),
	ATTRS: {
		width: {
			value: 500,
			writeOnce: 'initOnly'
		},
		height: {
			value: 500,
			writeOnce: 'initOnly'
		}
	}
});

// Annotation classes are "namespaced" onto Y.OHP.Annotation, so we need to mix in all existing static
// Y.OHP.Annotation.Xxx classes to the new Annotation object
Y.namespace('OHP').Annotation = Y.mix(Annotation, Y.namespace('OHP').Annotation);


}, '7.9.0', {
    "requires": [
        "ohp-annotation-view",
        "ohp-annotation-class-name-manager",
        "base",
        "widget"
    ],
    "skinnable": true
});
