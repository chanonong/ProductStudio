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
YUI.add('ohp-showhide', function (Y, NAME) {

function ShowHide(/*config*/) {
	ShowHide.superclass.constructor.apply(this, arguments);

	this.publish('beforeopen', {
		defaultFn: this._beforeOpen,
		bubbles: true,
		broadcast: true,
		preventable: true
	});
	this.publish('beforeclose', {
		defaultFn: this._beforeClose,
		bubbles: false
	});
	this.publish('afteropen', {
		defaultFn: this._afterOpen,
		bubbles: false
	});
	this.publish('afterclose', {
		defaultFn: this._afterClose,
		bubbles: false
	});
}

ShowHide.NAME = 'showhide';

ShowHide.ATTRS = {
	startHidden: {
		value: false
	},
	duration: {
		value: 0.5
	},
	childHeight : {
		value:1
	}
};

var OPEN_CLASS = 'ohp-showhide-toggle-open',
	CLOSED_CLASS = 'ohp-showhide-toggle-closed';

Y.extend(ShowHide, Y.OHP.Widget, {
	initializer: function() {
	},
	bindUI: function() {
		Y.log('bindUI', 'info', 'showhide');
		if(this.getStdModNode(Y.WidgetStdMod.BODY)){
			Y.log('in the body', 'info', 'showhide');
			Y.log(this.getStdModNode(Y.WidgetStdMod.BODY).get('scrollHeight'), 'info', 'showhide');
			Y.log(this.getStdModNode(Y.WidgetStdMod.BODY).get('height'), 'info', 'showhide');
			this.set('childHeight', this.getStdModNode(Y.WidgetStdMod.BODY).get('scrollHeight'));
			this.getStdModNode(Y.WidgetStdMod.BODY).setStyle('zIndex', 1);
			this.getStdModNode(Y.WidgetStdMod.HEADER).setStyle('zIndex', 5);
		} else{
			Y.log('NO BODY', 'info', 'showhide');
		}
		var header = this.getStdModNode(Y.WidgetStdMod.HEADER);
		if(header){
			header.on('click', this.toggle, this);
		}
	},
	syncUI: function() {
		Y.log('syncUI');

		if (this.get('startHidden')) {
			this.getStdModNode(Y.WidgetStdMod.HEADER).simulate('click');
		}
	},
	renderUI: function() {
		//add the toggle image node to the head
		//var toggleNode = Y.Node.create('<span class="ohp-showhide-toggle ' + OPEN_CLASS + '"></span>');

		var head = this.getStdModNode(Y.WidgetStdMod.HEADER);
		if(head){
		//	head.insert(toggleNode);
			head.addClass('evented');
		}
		Y.log(head);
		this.get('contentBox').setStyle('zIndex', '2');
	},
	toggle: function() {
		Y.log('Toggle called', 'info', 'ShowHide');

		var head = this.getStdModNode(Y.WidgetStdMod.HEADER),
			body = this.getStdModNode(Y.WidgetStdMod.BODY),
			duration,
			toHeight,
			content,
			result;

		if (head.hasClass(CLOSED_CLASS)) {
			body.setStyle('display', 'auto');
		}
		duration = this.get('duration');
		toHeight = this.get('childHeight');

		Y.log(toHeight, 'info', 'showhide');
		content = body.plug(Y.Plugin.NodeFX, {
			from: {
				height: '0',
				opacity: 0
			},
			to: {
				height: toHeight,
				opacity: 1
			},
			easing: Y.Easing.easeOut,
			duration: duration
		});
		if (head.hasClass(CLOSED_CLASS)) {
			result = this.fire('beforeopen');
			Y.log(' the result from before open ' + result, 'info', 'ShowHide');
		} else {
			this.fire('beforeclose');
		}

		head.toggleClass(OPEN_CLASS);
		head.toggleClass(CLOSED_CLASS);
		content.fx.set('reverse', !content.fx.get('reverse'));
		content.fx.run();

		if (head.hasClass(CLOSED_CLASS)) {
			this.fire('afterclose');
		} else {
			this.fire('afteropen');
		}
	},
	_beforeOpen: function() {
		Y.log('before open fired');
		this.getStdModNode(Y.WidgetStdMod.BODY).setStyle('display', 'block');
	},
	_beforeClose: function() {
		Y.log('before close fired');
	},
	_afterOpen: function() {
		Y.log('after open fired');
		this.fire('toggle');
	},
	_afterClose: function() {
		Y.log('after close fired');

		this.getStdModNode(Y.WidgetStdMod.BODY).setStyle('display', 'none');
		this.fire('toggle');
	}

});

Y.namespace('OHP').ShowHide = ShowHide;


}, '7.9.0', {
    "requires": [
        "selector",
        "widget-stack",
        "anim",
        "node",
        "ohp-widget",
        "widget-position",
        "widget-stdmod",
        "node-event-simulate",
        "base",
        "widget",
        "widget-anim"
    ]
});
