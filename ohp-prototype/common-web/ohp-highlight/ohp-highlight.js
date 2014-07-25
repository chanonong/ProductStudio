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
YUI.add('ohp-highlight', function (Y, NAME) {

/**
Provides a plugin to a Node that allows a node to animate the background to yellow by default and then
fade back to the original background colour
@module ohp-highlight
**/

/**
A basic Node plugin, which allows a node to animate the background to yellow by default and then
fade back to the original background colour

@class Highlight
@namespace OHP
@constructor
@extends Plugin.Base
@param {Object} object The user configuration for the instance.
**/
function Highlight(/*config*/) {
	Highlight.superclass.constructor.apply(this, arguments);
}

Highlight.NAME = 'ohp-highlight';
Highlight.NS = 'highlight';
Highlight.ATTRS = {
	color: {
		value: '#FFFDC7'
	},
	duration: {
		value: 1.5
	},
	removeContent : {
		value: false
	}
};

Y.extend(Highlight, Y.Plugin.Base, {
	initializer: function() {
	},
	destructor : function() {
	},
	_getBG:function(node){
		var background = node.getStyle('backgroundColor');
		if (background === 'transparent') {
			background = node.get('parentNode').getStyle('backgroundColor');
			if (background === 'transparent') {
				background = '#FFFFFF';
			}
		}
		return background;
	},
	run : function() {
		var node = this.get('host'),
			background = this._getBG(node),
			toColour,
			anim,
			hideMe,
			removeContent;

		if (background === 'transparent') {
			background = '#FFFFFF';
		}

		toColour = this.get('color');
		anim = new Y.Anim({
			node: node,
			from: {
				backgroundColor:'#FFFFFF'
			},
			to: {
				backgroundColor:toColour
			},
			duration:0.5
		});
		anim.run();

		removeContent = this.get('removeContent');
		hideMe = function(){
			if (removeContent===true) {
				node.hide('fadeOut', null, function(/*e*/) {
					node.set('innerHTML', '&nbsp;');
					node.show(true);
				});

			/*
			node.transition({
				duration: 0.75,
				easing: 'ease-out',
				opacity: {
					delay: 1.5,
					duration: 1.25,
					value: 0
				}
			});
			*/
			}
		};
		Y.later(1500, this, function() {
			anim.set('reverse', true);
			anim.run();
			Y.later(2500, this, function() {
				hideMe();
			}, null, false);
		}, null, false);
	}
});
Y.namespace('OHP').Highlight = Highlight;


}, '7.9.0', {"requires": ["anim", "node", "transition", "plugin"]});
