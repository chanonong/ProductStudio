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
YUI.add('ohp-annotation-tool-model', function (Y, NAME) {

"use strict";
/**
Tool Model, contains Tool and active status.

@module ohp-annotation-tool-model
**/

/**
Tool Model, contains Tool and active status.

@class ToolModel
@namespace OHP.Annotation
@constructor
@extends Model
**/
var ToolModel = Y.Base.create('ohp-annotation-tool', Y.Model, [], {}, {
	ATTRS: {
		active: {
			value: false
		},
		tool: {
			writeOnce: 'initOnly'
		}
	}
});

Y.namespace('OHP.Annotation').ToolModel = ToolModel;


}, '7.9.0', {"requires": ["model", "base"]});
