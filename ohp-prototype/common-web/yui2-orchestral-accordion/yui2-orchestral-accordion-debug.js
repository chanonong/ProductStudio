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
YUI.add('yui2-orchestral-accordion', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

YAHOO.namespace('ORCHESTRAL.widget');

/**
 * A widget for displaying content in a collapsible set of panels.
 *
 * @module orchestral-accordion
 * @requires yahoo, dom, event, orchestral
 * @namespace ORCHESTRAL.widget
 * @title Accordion
 */
(function() {
	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event;

	/**
	 * A widget for displaying content in a collapsible set of panels.
	 *
	 * @class Accordion
	 * @constructor
	 * @param element {HTMLElement | String} Container element for the accordion.
	 */
	ORCHESTRAL.widget.Accordion = function(element) {
		Dom.addClass(element, 'OrchestralAccordion');
		Event.on(element, 'click', function(e) {
			var target = Event.getTarget(e);
			if (!Dom.hasClass(target, 'AccordionLink')) {
				return;
			}

			var li = target.parentNode,
				isOpen = Dom.hasClass(li, 'selected');

			Dom.removeClass(element.childNodes, 'selected');
			if (!isOpen) {
				Dom.addClass(li, 'selected');
			}

			Event.preventDefault(e);
		});
	};

	Event.onDOMReady(function() {
		Dom.getElementsByClassName('OrchestralAccordion', 'ul', null, function(el) {
			new ORCHESTRAL.widget.Accordion(el);
		});
	});
})();

YAHOO.register('orchestral-accordion', ORCHESTRAL.widget.Accordion, {version: '7.9', build: '0'});


}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-orchestral"]});
