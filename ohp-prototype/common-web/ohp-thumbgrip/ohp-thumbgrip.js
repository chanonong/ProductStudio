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
YUI.add('ohp-thumbgrip', function (Y, NAME) {

/**
Provides a basic Thumbgrip widget. A thumbgrip only symbolizes a component is draggable does not handle making
an element draggable at all.
@module ohp-thumbgrip
**/

function Thumbgrip(/*config*/) {
	Thumbgrip.superclass.constructor.apply(this, arguments);
}

Thumbgrip.NAME = 'Thumbgrip';
Thumbgrip.ATTRS = {
	srcNode : {
		value: '.yui3-dd-draggable'
	},
	selector : {
		value : '.yui3-dd-draggable'
	}
};
Y.extend(Thumbgrip, Y.Widget, {
	initializer: function() { },
	destructor: function() { },
	renderUI: function() {
		Y.all(this.get('selector')).each(function(node) {
			var innerHTML = node.get('innerHTML'),
				wrapper = Y.Node.create('<span style="float:left;"></span>');
			wrapper.set('innerHTML', innerHTML);

			node.set('innerHTML', '');
			node.appendChild(wrapper);
			node.append(Y.Node.create('<span class="ohp-thumbgrip">&nbsp;</span>'));
		});
	},
	bindUI: function() {
		// this.after('attrAChange', this._afterAttrAChange);
	},
	syncUI: function() {
	}
});
Y.namespace('OHP').Thumbgrip = Thumbgrip;


}, '7.9.0', {"requires": ["substitute", "widget"]});
