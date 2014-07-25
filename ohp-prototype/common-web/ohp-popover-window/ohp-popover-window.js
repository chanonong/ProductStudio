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
YUI.add('ohp-popover-window', function (Y, NAME) {

/**
 * Provides a basic Popover that behaves like a lightbox
 * @module ohp-popover-window
 */
function PopoverWindow(config) {
	PopoverWindow.superclass.constructor.apply(this, arguments);
}
PopoverWindow.NAME = 'ohp-popover-window';
PopoverWindow.NS = 'popwindow';     
PopoverWindow.ATTRS = {
	maxHeight: {
		value: null
	},
	maxWidth: {
		value: null
	}
};
Y.extend(PopoverWindow, Y.Plugin.Base, {
	initializer: function() {
		//this.beforeHostMethod("show", this._beforeHostShowMethod);
		//this.beforeHostMethod("_applyBeak", this._prevent);
		this.afterHostMethod("show", this._afterHostShowMethod);
		this.beforeHostMethod('init', this._beforeHostInit);
		this.onHostEvent("render", this._onHostRenderEvent);             
		this.afterHostEvent("render", this._afterHostRenderEvent);
		this.beforeHostMethod('_afterShow', this._prevent);
		 
		this.get('host').set('hasBeak', false);
		this.get('host').BOUNDING_TEMPLATE = '<div class="yui3-popover yui-popover yui3-ohp-popover-window"></div>';
	},
	destructor : function() {
		
	},
	_beforeHostInit : function(){
		this.get('host').setAttrs({showBeak: false});
	},

	_applyCloseButton : function(){
		var widmod = this.get('host');
		if(this.get('host').get('contentBox').one('.icon-close')){
			return;
		}
		var closeNode = Y.Node.create('<span class="icon-close"> </span>')
		closeNode.on('click', function(e){
			Y.OHP.Popover.resume(); 
			this.get('host').hide();
		}, this);
		widmod.setStdModContent(Y.WidgetStdMod.HEADER, closeNode, Y.WidgetStdMod.AFTER);
 
	},
	_afterHostShowMethod: function(){
		this.get('host').set('centered', true);
		/* 
 			this.get('host').set('align', {
			node: 'body',
			points: [Y.WidgetPositionAlign.CC, Y.WidgetPositionAlign.CC]
		});
		*/
		 
		this._applyCloseButton();	
 
		//Now Lock the popovers so they must close the window
		if(!Y.OHP.Popover.isSuspended()){
			Y.OHP.Popover.suspend();
		}
	},
	_onHostRenderEvent : function(e) { 
	},
	_afterHostRenderEvent : function(e) {
	}, 
	_prevent: function(){
		return new Y.Do.Prevent();
	}
});
    Y.namespace("Plugin.OHP").PopoverWindow = PopoverWindow;


}, '7.9.0', {"requires": ["node", "widget-stdmod", "widget", "plugin"]});
