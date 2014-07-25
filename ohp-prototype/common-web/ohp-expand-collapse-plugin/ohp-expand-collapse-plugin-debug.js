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
YUI.add('ohp-expand-collapse-plugin', function (Y, NAME) {

"use strict";
/**
Plugin enabling a host node to contain expand/collapse details nodes, a summary node that is not collapsed, as well as a trigger node.
Click events on the trigger node will show/hide the details nodes, leaving the summary node showing.
Summary and details nodes are child nodes of the host. The trigger node may or may not be a child node of the host.
The trigger node should not collapse, so therefore is either the summary node; a child of the summary node;
or any node outside the host node (i.e. not a child of the host).

@module ohp-expand-collapse-plugin
**/

/**
@class ExpandCollapsePlugin
@namespace OHP
@extends Plugin.Base
**/
function ExpandCollapsePlugin(/*config*/) {
	ExpandCollapsePlugin.superclass.constructor.apply(this, arguments);
}

ExpandCollapsePlugin.NAME = 'expandCollapse';
ExpandCollapsePlugin.NS = 'details';

ExpandCollapsePlugin.ATTRS = {
	/**
	 * The summary node is the child of the host that is not collapsed/expanded.
	 *
	 * Default value is set to the host child node with ExpandCollapsePlugin.SUMMARY_CLASS set,
	 * otherwise the default value is set to be the first child node of the host.
	 *
	 * @config summary
	 * @type String|Node
	 */
	summary: {
		valueFn: function(){
			return this._getDefaultSummary();
		},
		validator: function(val) {
			return Y.Lang.isString(val) || Y.instanceOf(val, Y.Node);
		},
		setter: function(val) {
			return Y.Lang.isString(val) ? Y.Node.one(val) : val;
		}
	},

	/**
	 * The node that the toggle collapse/expand event is bound to.
	 *
	 * Default value is set to the summary node.
	 *
	 * @config trigger
	 * @type String|Node
	 */
	trigger: {
		valueFn: function() {
			return this._getDefaultTrigger();
		},
		validator: function(val) {
			return Y.Lang.isString(val) || Y.instanceOf(val, Y.Node);
		},
		setter: function(val) {
			return Y.Lang.isString(val) ? Y.Node.one(val) : val;
		}
	},

	/**
	 * Boolean value indicating the current state of the details nodes.
	 * Set to true when expanded/open, and set to false when collapsed/closed.
	 *
	 * This can be set on configuration to specify the state in which
	 * the details nodes are set to initally after render.
	 *
	 * Default initial value is false, so the details nodes are collapsed initially.
	 *
	 * @config open
	 * @type Boolean
	 */
	open: {
		value: false
	}
};

// TODO: use ohp-class-name-manager, see scrollpane.
ExpandCollapsePlugin.CONTAINER_CLASS = 'ohp-expand-collapse';
ExpandCollapsePlugin.OPEN_CLASS = 'ohp-expand-collapse-open';
ExpandCollapsePlugin.CLOSED_CLASS = 'ohp-expand-collapse-closed';
ExpandCollapsePlugin.SUMMARY_CLASS = 'ohp-expand-collapse-summary';
ExpandCollapsePlugin.DETAILS_CLASS = 'ohp-expand-collapse-details';
ExpandCollapsePlugin.TRIGGER_CLASS = 'ohp-expand-collapse-trigger';

Y.extend(ExpandCollapsePlugin, Y.Plugin.Base, {

	// TODO: destructor

	initializer: function(/*config*/) {
		var host = this.get('host'),
			trigger = this.get('trigger');

		host.addClass(ExpandCollapsePlugin.CONTAINER_CLASS);
		// Set the details nodes, as the siblings of the summary node.
		this._updateDetails();

		// Fires when the details nodes are expanded.
		this.publish('expand', {
			defaultFn: this._defExpandFn,
			broadcast: 2,
			emitFacade: true
		});

		// Fires when the details nodes are collapsed.
		this.publish('collapse', {
			defaultFn: this._defCollapseFn,
			broadcast: 2,
			emitFacade: true
		});

		trigger.on('click', function(e) {
			this.toggle();
			e.preventDefault();
		}, this);

		// Set initial state of details nodes.
		if (this.get('open')) {
			this.expand();
		} else {
			this.collapse();
		}

		// Listen to content update events on host, and update details nodes.
		this.afterHostMethod('append', this._updateDetails);
		this.afterHostMethod('appendChild', this._updateDetails);
		this.afterHostMethod('insert', this._updateDetails);
		this.afterHostMethod('replaceChild', this._updateDetails);
		this.afterHostMethod('setContent', this._updateDetails);
	},

	/**
	 * @event collapse
	 * @description Fires when the details nodes are collapsed.
	 * @param e {Event.Facade} An Event Facade object with the following specific property added:
	 *			<dl>
	 *				<dt>node</dt><dd>The host node collapsed.</dd>
	 *			</dl>
	 * @type {Event.Custom}
	 */

	/**
	 * @event expand
	 * @description Fires when the details nodes are expanded.
	 * @param e {Event.Facade} An Event Facade object with the following specific property added:
	 *			<dl>
	 *				<dt>node</dt><dd>The host node expanded.</dd>
	 *			</dl>
	 * @type {Event.Custom}
	 */

	/**
	 * Method that returns the node that should be set as the default summary node.
	 * Will be either the host child node with ExpandCollapsePlugin.SUMMARY_CLASS
	 * or the first child of the host node.
	 *
	 * @method _getDefaultSummary
	 * @return summaryNode {Node} The node that should be set as the default summary
	 * @private
	 */
	_getDefaultSummary: function() {
		var host = this.get('host'),
			summaryNode = host.one('.' + ExpandCollapsePlugin.SUMMARY_CLASS);
		if (!summaryNode) {
			// First child node of host node.
			summaryNode = host.one('*');
			if (!summaryNode) {
				Y.log('host node has no child nodes to set as summary node', 'error');
				return;
			}
		}
		summaryNode.addClass(ExpandCollapsePlugin.SUMMARY_CLASS);
		return summaryNode;
	},

	/**
	 * Method that returns the node that should be set as the default trigger node.
	 * By default the trigger node is set to be the same as the summary node.
	 *
	 * @method _getDefaultTrigger
	 * @return triggerNode {Node} The node that should be set as the default trigger
	 * @private
	 */
	_getDefaultTrigger: function() {
		var triggerNode = this.get('summary');
		triggerNode.addClass(ExpandCollapsePlugin.TRIGGER_CLASS);
		return triggerNode;
	},

	/**
	 * Called when content of host node changes.
	 * Sets siblings of summary node as the details nodes.
	 * Both summary and details nodes are children of the host node.
	 * Sets summary and/or trigger nodes back to default if they are now undefined.
	 *
	 * @method _updateDetails
	 * @private
	 */
	_updateDetails: function() {
		var summary = this.get('summary'),
			trigger = this.get('trigger'),
			details;

		// Sets summary and/or trigger nodes back to default if they are now undefined due to host content change.
		if (!summary) {
			Y.log('summary node is undefined, setting to default.', 'warn');
			summary = this._getDefaultSummary();
			this.set('summary', summary);
		}
		if (!trigger) {
			Y.log('trigger node is undefined, setting to default.', 'warn');
			trigger = this._getDefaultTrigger();
			this.set('trigger', trigger);
		}

		// Set the details nodes, as the siblings of the summary node.
		details = summary.siblings(function(node){
			if (!node.hasClass(ExpandCollapsePlugin.DETAILS_CLASS)) {
				node.addClass(ExpandCollapsePlugin.DETAILS_CLASS);
			}
		});
	},

	/**
	 * Default expand event handler
	 *
	 * @method _defExpandFn
	 * @param event {EventFacade} The Event Object
	 */
	_defExpandFn: function (/*e*/) {
		var host = this.get('host'),
			trigger = this.get('trigger');

		this.set('open', true);
		host.replaceClass(ExpandCollapsePlugin.CLOSED_CLASS, ExpandCollapsePlugin.OPEN_CLASS);
		trigger.replaceClass(ExpandCollapsePlugin.CLOSED_CLASS, ExpandCollapsePlugin.OPEN_CLASS);
	},

	/**
	 * Default collapse event handler
	 *
	 * @method _defCollapseFn
	 * @param event {EventFacade} The Event Object
	 */
	_defCollapseFn: function (/*e*/) {
		var host = this.get('host'),
			trigger = this.get('trigger');

		this.set('open', false);
		host.replaceClass(ExpandCollapsePlugin.OPEN_CLASS, ExpandCollapsePlugin.CLOSED_CLASS);
		trigger.replaceClass(ExpandCollapsePlugin.OPEN_CLASS, ExpandCollapsePlugin.CLOSED_CLASS);
	},

	/**
	 * To expand the details nodes.
	 *
	 * @method expand
	 */
	expand: function() {
		this.fire('expand', { node: this.get('host') });
	},

	/**
	 * To collapse the details nodes.
	 *
	 * @method collapse
	 */
	collapse: function() {
		this.fire('collapse', { node: this.get('host') });
	},

	/**
	 * To toggle expand/collapse the details nodes.
	 *
	 * @method toggle
	 */
	toggle: function() {
		if (this.get('open')) {
			this.fire('collapse', { node: this.get('host') });
		} else {
			this.fire('expand', { node: this.get('host') });
		}
	}
});

Y.namespace('OHP').ExpandCollapsePlugin = ExpandCollapsePlugin;


}, '7.9.0', {
    "requires": [
        "node-core",
        "base-build",
        "event-custom",
        "node-pluginhost",
        "event-base",
        "plugin",
        "node-base"
    ],
    "skinnable": true
});
