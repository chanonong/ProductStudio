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
YUI.add('ohp-activity-status', function (Y, NAME) {

"use strict";
/**
Activity status indicator.

@module ohp-activity-status
**/
var SUCCESS_MESSAGE_CLASS = 'ohp-message-success',
	FAILURE_MESSAGE_CLASS = 'ohp-message-failure',

	Locale = Y.OHP.Locale,
	Lang = Y.Lang,
	Template = Y.Template,

	renderWidgetContents,
	renderCancelLink,
	templateEngine = new Template(Template.Micro);

renderWidgetContents = templateEngine.compile(
	'<span class="<%=this.activityClass%>">' +
		'<span class="throbber">&nbsp;</span>' +
	'</span>' +
	'<span class="<%=this.messageClass%>"><%=this.message%></span>');
renderCancelLink = templateEngine.compile('<a href="#" class="<%=this.cancelClass%>"><%=this.cancelLabel%></a>');

/**
 * @class ActivityStatus
 * @namespace OHP
 * @extends Widget
 */
function ActivityStatus(/*config*/) {
	ActivityStatus.superclass.constructor.apply(this, arguments);
}

ActivityStatus.NAME = 'activityStatus';

ActivityStatus.CSS_PREFIX = 'ohp-activity-status';

ActivityStatus.ATTRS = {
	/**
	 * Boolean indicating if the Activity Status can be cancelled.
	 *
	 * @config cancelable
	 * @default false
	 * @type boolean
	 */
	cancelable: {
		value: false,
		validator: Lang.isBoolean
	},

	/**
	 * Status message.
	 *
	 * @config message
	 * @type String
	 */
	message: {
		value: '',
		validator: Lang.isString
	},

	/**
	 * Boolean indicating if the Activity Status is an "in progress" status.
	 *
	 * @config inProgress
	 * @default false
	 * @readOnly
	 * @type boolean
	 */
	inProgress: {
		value: false,
		validator: Lang.isBoolean,
		readOnly: true
	}
};

ActivityStatus.HTML_PARSER = {
	message: function(srcNode) {
		var node = srcNode.one(this.getClassName('message'));

		if (node) {
			return node.getHTML();
		}
	}
};

Y.extend(ActivityStatus, Y.Widget, {
	BOUNDING_TEMPLATE: '<span></span>',
	CONTENT_TEMPLATE: null,

	initializer: function(/*config*/) {
		this._activityNode = null;
		this._messageNode = null;

		// Cancel is the only event we publish because this control is largely informational and other state
		// changes should be driven by other events. Only cancel may be triggered by this control.

		/**
		 * @event cancel
		 * @description Progress has been cancelled.
		 * @param {Event.Facade} event An Event Facade object with the following specific property added:
		 * <dl>
		 *   <dt>message</dt><dd>Status message to display.</dd>
		 * </dl>
		 * @type {Event.Custom}
		 */
		this.publish('cancel', {
			emitFacade: true,
			defaultFn: this._defCancelFn
		});
	},

	renderUI: function() {
		var contentBox = this.get('contentBox'),
			activityClass = this.getClassName('indicator'),
			messageClass = this.getClassName('message'),
			data = {
				message: this.get('message'),
				activityClass: activityClass,
				messageClass: messageClass
			};

		contentBox.append(renderWidgetContents(data));

		this._activityNode = contentBox.one('.' + activityClass);
		this._messageNode = contentBox.one('.' + messageClass);

		if (this.get('cancelable')) {
			this._activityNode.append(renderCancelLink({
				cancelLabel: Locale.get('widget.activityStatus.cancel'),
				cancelClass: this.getClassName('cancel')
			}));
		}

		this._activityNode[this.get('inProgress') ? 'show' : 'hide']();
	},

	bindUI: function() {
		var contentBox = this.get('contentBox');

		this.on('messageChange', function(e) {
			var messageNode = this._messageNode;

			if (messageNode) {
				// TODO: Should this be get/set 'text'? Is anyone using it as HTML?
				messageNode.setHTML(e.newVal);
				messageNode.setStyle('opacity', '0');
				messageNode.transition({
					opacity: 1
				});
			}
		});

		this.after('inProgressChange', function(e) {
			this._activityNode[e.newVal ? 'show' : 'hide'](e.newVal);
		}, this);

		contentBox.delegate('click', function(e) {
			e.preventDefault();
			this.cancel();
		}, '.' + this.getClassName('cancel'), this);
	},

	/**
	 * Update the activity status to indicate that the activity has started.
	 *
	 * @method start
	 */
	start: function() {
		this._set('inProgress', true);
		this.set('message', '');

		this._messageNode.removeClass(SUCCESS_MESSAGE_CLASS);
		this._messageNode.removeClass(FAILURE_MESSAGE_CLASS);
	},

	/**
	 * Update the activity status to indicate that the activity has succeded.
	 *
	 * @method success
	 * @param message
	 */
	success: function(message) {
		if (Lang.isUndefined(message)) {
			message = Locale.get('widget.activityStatus.success');
		}

		this._set('inProgress', false);
		this.set('message', message);

		this._messageNode.addClass(SUCCESS_MESSAGE_CLASS);
		this._messageNode.removeClass(FAILURE_MESSAGE_CLASS);
	},

	/**
	 * Update the activity status to indicate that the activity has failed.
	 *
	 * @method failure
	 * @param message {String} (optional)
	 */
	failure: function(message) {
		if (Lang.isUndefined(message)) {
			message = Locale.get('widget.activityStatus.failure');
		}

		this._set('inProgress', false);
		this.set('message', message);

		this._messageNode.addClass(FAILURE_MESSAGE_CLASS);
		this._messageNode.removeClass(SUCCESS_MESSAGE_CLASS);
	},

	/**
	 * Update the activity status to indicate that the activity has been cancelled.
	 *
	 * @method cancel
	 * @param message {String} (optional)
	 */
	cancel: function(message) {
		if (this.get('cancelable')) {
			this.fire('cancel', { message: message });
		}
	},

	_defCancelFn: function(e) {
		if (this.get('cancelable')) {
			this._set('inProgress', false);
			this.set('message', e.message || '');
			this._messageNode.removeClass(SUCCESS_MESSAGE_CLASS);
			this._messageNode.removeClass(FAILURE_MESSAGE_CLASS);
		}
	}

});

Y.namespace('OHP').ActivityStatus = ActivityStatus;


}, '7.9.0', {
    "requires": [
        "template",
        "ohp-locale-translations",
        "ohp-locale-base",
        "node-style",
        "transition",
        "node-event-delegate",
        "widget",
        "node-base"
    ],
    "skinnable": true
});
