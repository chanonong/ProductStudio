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
YUI.add('ohp-component', function (Y, NAME) {

"use strict";
/**
Provides the OHP.Component extension for creating dynamically loadable UI components.

@module ohp-component
**/

var Lang = Y.Lang,

	EVENT_INITIAL_RENDER_COMPLETE = 'componentInitialRenderComplete';

/**
Extension for declaring a UI component. Provides a mechanism for declaring supported component features via the
[OHP_COMPONENT_FEATURES property](#property_OHP_COMPONENT_FEATURES) and an event for indicating that the initial
render has completed.

@class Component
@namespace OHP
**/
function Component() {
	/**
	Event fired once a component has completed its initial render.

	@event componentInitialRenderComplete
	**/
	this.publish(EVENT_INITIAL_RENDER_COMPLETE, {
		broadcast: 1, // Broadcast to sandbox
		fireOnce: true, // Can only fire once, callbacks subscribed after the event has been thrown will be called immediately
		async: true, // Callbacks invoked immediately due to fireOnce are called asynchronously
		preventable: false
	});
}

/**
Fires the relevant events to indicate rendering has completed. Currently this will only fire the `componentInitialRenderComplete`
event which will only fire once per instance of a Component.

@method fireRenderCompleteEvents
**/
Component.prototype.fireRenderCompleteEvents = function() {
	this.fire(EVENT_INITIAL_RENDER_COMPLETE);
};

/**
Declaration of named features supported by this component. A truthy value implies overall support for a feature. Some features may
have more fine grained support in which case the value for that feature may be an object.

@property OHP_COMPONENT_FEATURES
@type Object
@static
**/
Component.OHP_COMPONENT_FEATURES = {};

// The following code ensures that the static OHP_COMPONENT_FEATURES features is aggregated across the entire class heirarchy for the
// class being created with Y.Base.create(). Read http://yuilibrary.com/yui/docs/api/classes/Base.html#method_create for more info
// on how _buildCfg works and how classes are created using Y.Base.create().

// Utility function used in `_buildCfg` for aggregating static properties from the given supplier to the given receiver ensuring a
// default value for the property of an empty array/object if the receiver does not already declare the property.
function aggregate(propertyName, receiver, supplier) {
	if (!receiver.hasOwnProperty(propertyName) && supplier.hasOwnProperty(propertyName)) {
		receiver[propertyName] = Lang.isArray(supplier[propertyName]) ? [] : {};
	}
	Y.aggregate(receiver, supplier, true, [propertyName]);
}

// Utility function used in `_buildCfg` for aggregating static properties across the given base class, the superclass of that base
// class and the given extension class. This is necessary as the default YUI aggregation strategy does not include the superclass,
// only extensions.
function aggregateIncludingSuperclass(propertyName, baseClass, extension) {
	var superclass = baseClass.superclass && baseClass.superclass.constructor;

	if (!baseClass.hasOwnProperty(propertyName) && superclass && superclass.hasOwnProperty(propertyName)) {
		aggregate(propertyName, baseClass, superclass);
	}

	aggregate(propertyName, baseClass, extension);
}

Component._buildCfg = {
	// ensure declared features are aggregated when mixing multiple classes/extensions that declare features
	custom: {
		OHP_COMPONENT_FEATURES: aggregateIncludingSuperclass
	}
};

Y.namespace('OHP').Component = Component;


}, '7.9.0', {"requires": ["oop", "yui-base"]});
