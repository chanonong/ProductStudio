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
YUI.add('ohp-annotation-toolbox-view', function (Y, NAME) {

"use strict";
/**
ToolboxView is one piece of the overall AnnotationView. It handles Tool selection and the rendered Toolbox.

@module ohp-annotation-toolbox-view
*/

var Handlebars = Y.Handlebars,
	getClassName = Y.OHP.AnnotationClassNameManager.getClassName,
	ToolboxView;

// TODO: make sure naming throughout modules is consistent when referring to toolList, toolModel and tool to prevent confusion here

/**
ToolboxView is one piece of the overall AnnotationView. It handles Tool selection and the rendered Toolbox.

@class ToolboxView
@namespace OHP.Annotation
@constructor
@extends View
**/
ToolboxView = Y.Base.create('ohp-annotation-toolbox-view', Y.View, [], {
	events: {
		// TODO: possible to use class name manager in this situation?
		'.ohp-annotation-tool-button': {
			click: '_handleClickToSelectTool'
		}
	},

	_buttonTemplate: Handlebars.compile(
		'&nbsp;<label>' +
		'<input type="radio" name="ohp-annotation-tool-buttons" class="{{className}}" value={{value}} {{active}} />&nbsp;{{label}}' +
		'</label>'),

	_renderTool: function(toolModel) {
		var toolName = toolModel.get('tool').get('name'),
			toolButton = this._buttonTemplate({
			// TODO label should be a translation from the name, not the name itself
			label: toolName,
			value: toolName,
			active: (toolModel.get('active') ? 'checked' : ''),
			className: getClassName('tool', 'button')
		});

		this.get('container').appendChild(toolButton);
	},

	render: function() {
		var annotationModel = this.get('annotationModel'),
			toolModelList = annotationModel.get('toolModelList'),
			container = this.get('container');

		container.addClass('ohp-annotation-toolbox');

		container.setStyle('width', this.get('width'));
		container.setStyle('height', ToolboxView.HEIGHT);

		toolModelList.each(this._renderTool, this);

		return this;
	},

	_handleClickToSelectTool: function(e) {
		// Because we've rendered our Tool buttons with the 'name' as the
		// 'value' attribute for each tool button node, we can use the value to
		// retreive the Tool instance from the Array
		var annotationModel = this.get('annotationModel'),
			toolModelList = annotationModel.get('toolModelList'),
			selectedType = e.currentTarget.get('value');

		if (selectedType !== toolModelList.getActiveToolName()) {
			toolModelList.setActiveToolName(selectedType);
			// TODO: should the toolbox view be clearing selection?
			annotationModel.get('drawingModelList').clearSelection();
		}
	}
}, {
	ATTRS: {
		width: {
			writeOnce: 'initOnly'
		}
	},
	HEIGHT: 30
});

Y.namespace('OHP.Annotation').ToolboxView = ToolboxView;


}, '7.9.0', {
    "requires": [
        "ohp-annotation-tool",
        "ohp-annotation-class-name-manager",
        "node-style",
        "handlebars",
        "yui-base",
        "base",
        "view",
        "event-base",
        "node-base"
    ]
});
