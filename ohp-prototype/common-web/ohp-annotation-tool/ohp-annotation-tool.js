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
YUI.add('ohp-annotation-tool', function (Y, NAME) {

"use strict";
/**
Tool Base class. All Tools will extend

@module ohp-annotation-tool
**/

/**
Tool Base class. All Tools will extend

@class Tool
@namespace OHP.Annotation
@constructor
@extends Base
**/
var Tool = Y.Base.create('ohp-annotation-tool', Y.Base, [], {

	start: function(/*layer, point*/) {
	},

	drag: function(/*point*/) {
	},

	move: function(/*point*/) {
	},

	end: function(/*point*/) {
	}

}, {
	ATTRS: {
		name: {},
		type: {},
		annotationModel: {}
	}
});

Y.namespace('OHP.Annotation').Tool = Tool;


}, '7.9.0', {"requires": ["base"]});
