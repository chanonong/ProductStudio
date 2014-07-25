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
YUI.add('ohp-annotation-tool-model-list', function (Y, NAME) {

"use strict";
/**
ModelList of ToolModels. Handles Active Tool.

@module ohp-annotation-tool-model-list
**/

/**
ModelList of ToolModels. Handles Active Tool.

@class ToolModelList
@namespace OHP.Annotation
@constructor
@extends ModelList
**/
var ToolModelList = Y.Base.create('ohp-annotation-tool-model-list', Y.ModelList, [], {
	model: Y.OHP.Annotation.ToolModel,

	/*
	 * Sets activeToolModel by Tool name
	 * Returns activeToolModel set from name
	 */
	setActiveToolName: function (toolName) {
		var matchingToolModel = this.filter(function(toolModel/*, index*/) {
			return (toolName === toolModel.get('tool').get('name'));
		})[0];

		this.set('activeToolModel', matchingToolModel);

		return matchingToolModel;
	},

	/*
	 * Returns Tool name of current
	 */
	getActiveToolName: function() {
		return this.get('activeToolModel').get('tool').get('name');
	}

}, {
	ATTRS: {
		activeToolModel: {
			getter: function() {
				return this.filter(function(toolModel) {
					return toolModel.get('active');
				})[0];
			},
			setter: function(toolModel) {
				var activeToolModel = this.get('activeToolModel');
				if (toolModel !== activeToolModel) {
					if (activeToolModel) {
						activeToolModel.set('active', false);
					}
					toolModel.set('active', true);
				}
			}
		}
	}
});

Y.namespace('OHP.Annotation').ToolModelList = ToolModelList;


}, '7.9.0', {"requires": ["model-list", "ohp-annotation-tool-model", "base"]});
