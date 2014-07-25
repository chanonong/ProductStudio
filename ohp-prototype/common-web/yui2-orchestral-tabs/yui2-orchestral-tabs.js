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
YUI.add('yui2-orchestral-tabs', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/
 
/**
 * Standard Orchestral Tab Control.
 * 
 * @module orchestral-tabs
 * @requires yahoo, dom, event, element, tabview, orchestral
 * @optional connection
 * @namespace ORCHESTRAL.widget
 * @title AutoComplete
 */
YAHOO.namespace('ORCHESTRAL.widget');

(function() {
	/**
	 * Standard Orchestral Tab Control.
	 * 
	 * @class TabView
	 * @constructor
	 * @param {HTMLElement | String | Object} element (optional) The html element that represents the TabView, or the attribute object to use. 
	 * An element will be created if none provided.
	 * @param {Object} config (optional) A key map of the tabView's initial attributes.  Ignored if first arg is attributes object. 
	 * @extends YAHOO.widget.TabView
	 */
	ORCHESTRAL.widget.TabView = function(element, config) {
		/**
		 * @config onContentChange
		 * @description Fires when the value for the configuration attribute 'content' changes. 
		 * Provides a convenient alternative to calling <code>on('contentChange', function(e) { ... })</code>.
		 * @param {oldValue: any, newValue: any} event An object containing the previous attribute value and the new value.
		 * @type Function
		 */
		config = config || {};
		
		if (arguments.length == 1 && !YAHOO.lang.isString(element) && !element.nodeName) {
			config = element; // treat first arg as config object
			element = config.element || null;
		}
		
		// Remove text nodes between list items otherwise IE8 will render whitespace between tabs.
		// This has to be done before calling the superclass' constructor to retain event listeners added by YUI.
		var el = YAHOO.util.Dom.getElementsByClassName('yui-nav', 'ul', element)[0];
		
		// el will be undefined if constructing tabs via JavaScript, but when constructing tabs via script, li
		// nodes used for tabs will be added to the document without text nodes being added between nodes.
		// If document.doumentMode == 8 then page is rendered with IE 8 Standards Mode.
		if (el && document.documentMode == 8) {
			el.innerHTML = el.innerHTML.replace(/<\/li>\s+</gi, '</li><');
		}
		
		ORCHESTRAL.widget.TabView.superclass.constructor.call(this, element, config);
		
		var tabs = this.get('tabs');
		
		for (var i = 0; i < tabs.length; i++) {
			var tab = this.getTab(i);
			
			var href = tab.get('href');
			
			if (href.substring(0, 1) != '#') {
				tab.set('dataSrc', href);
				tab.set('cacheData', true);
				if (config.onContentChange) {
					tab.addListener('contentChange', config.onContentChange);
				}
			}
		}
	}
	
	YAHOO.extend(ORCHESTRAL.widget.TabView, YAHOO.widget.TabView);
	
	YAHOO.widget.Tab.prototype.LOADING_CLASSNAME = 'Throbber';
	
	YAHOO.widget.Tab.prototype.ACTIVE_TITLE = '';

	YAHOO.util.Event.onDOMReady(function () {
		YAHOO.util.Dom.getElementsByClassName('OrchestralTabs', 'div', null, function(el) {
			new ORCHESTRAL.widget.TabView(el);
		});
	});

})();

YAHOO.register("orchestral-tabs", ORCHESTRAL.widget.TabView, {version: '7.9', build: '0'});

}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-element", "yui2-tabview", "yui2-orchestral"]});
