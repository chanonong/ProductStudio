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
YUI.add('yui2-orchestral-effects', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/*!
* Copyright (c) 2007, Dav Glass <dav.glass@yahoo.com>.
* Code licensed under the BSD License:
* http://blog.davglass.com/license.txt
* All rights reserved.
*/

YAHOO.namespace('ORCHESTRAL.util');

/**
 * Provides several built-in effect combinations for YUI.
 *
 * @module orchestral-effects
 * @requires yahoo, dom, animation, orchestral, orchestral-dom
 * @namespace ORCHESTRAL.util
 * @title Effects
 */

(function() {
	var Registry = ORCHESTRAL.util.Registry;

	/**
	 * Provides effect combinations.
	 * 
	 * @class Effects
	 */
	ORCHESTRAL.util.Effects = function() {
		return {
			version: '0.8'
		}
	}();

	/**
	 * Obtain a lock to perform an effect on an object. This is done to prevent multiple animations
	 * being performed on the same element which can result in the elements styling getting permanently
	 * out of whack.
	 * 
	 * @private
	 * @return <code>true</code> if a lock was successfully obtained, otherwise <code>false</code>
	 */
	var obtainLock = function(elem) {
		if (Registry.get('ORCHESTRAL.util.Effects', elem)) {
			return false;
		}
		Registry.put('ORCHESTRAL.util.Effects', elem, true);
		return true;
	};

	/**
	 * Clears the for performing effects on an object.
	 *
	 * @private
	 */
	var clearLock = function(elem) {
		Registry.clear('ORCHESTRAL.util.Effects', elem.id);
		return;
	};

	/**
	 * This effect makes the object dissappear with display: none.
	 * 
	 * @class Effects.Hide
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 */
	ORCHESTRAL.util.Effects.Hide = function(inElm) {
		this.element = YAHOO.util.Dom.get(inElm);
	
		YAHOO.util.Dom.setStyle(this.element, 'display', 'none');
		YAHOO.util.Dom.setStyle(this.element, 'visibility', 'hidden');
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Hide.prototype.toString = function() {
		return 'Effect Hide [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object appear if the display was none otherwise it makes
	 * the object disappear.
	 * 
	 * @class Effects.Toggle
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 */
	ORCHESTRAL.util.Effects.Toggle = function(element) {
		element = YAHOO.util.Dom.get(element);
		var display = YAHOO.util.Dom.getStyle(element, 'display');
		YAHOO.util.Dom.setStyle(element, 'display', display == 'none' ? '' : 'none');
	}
	
	/**
	 * To String.
	 * 
	 * @method toString 
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Toggle.prototype.toString = function() {
		return 'Effect Toggle [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object appear with display: block.
	 * 
	 * @class Effects.Show
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 */
	ORCHESTRAL.util.Effects.Show = function(inElm) {
		this.element = YAHOO.util.Dom.get(inElm);
	
		YAHOO.util.Dom.setStyle(this.element, 'display', '');
		YAHOO.util.Dom.setStyle(this.element, 'visibility', 'visible');
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Show.prototype.toString = function() {
		return 'Effect Show [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object fade & disappear.
	 *
	 * @class Effects.Fade
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Fade = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		var attributes = {
			opacity: { from: 1, to: 0 }
		};

		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			ORCHESTRAL.util.Effects.Hide(this.element);
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}

	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Fade.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Fade.prototype.toString = function() {
		return 'Effect Fade [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object fade & appear.
	 *
	 * @class Effects.Appear 
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 3<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Appear = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		YAHOO.util.Dom.setStyle(this.element, 'opacity', '0');
		ORCHESTRAL.util.Effects.Show(this.element);
		var attributes = {
			opacity: { from: 0, to: 1 }
		};

		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 3);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}

	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Appear.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Appear.prototype.toString = function() {
		return 'Effect Appear [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object act like a window blind and retract.
	 * 
	 * @class Effects.BlindUp
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1<br>
	 *   delay: true (Delays execution)<br>
	 *   bind: (string) bottom<br>
	 *   ghost: (boolean)<br>
	 * )</code><br>
	 * Setting the bind option will make the element "blind up/rise" from the bottom.
	 */
	ORCHESTRAL.util.Effects.BlindUp = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		var ghost = ((opts && opts.ghost) ? opts.ghost : false);
		var height = parseInt(YAHOO.util.Dom.getStyle(inElm, "height"));
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}

		if (isNaN(height)) {
			this._height = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		} else {
			this._height = parseInt(height);
		}
		this._top = parseInt(YAHOO.util.Dom.getStyle(this.element, 'top'));
		if (isNaN(this._top)) {
			this._top = 0;
		}
		
		this._opts = opts;
	
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
		var attributes = {
			height: { to: 0 }
		};
		if (ghost) {
			attributes.opacity = {
				to : 0,
				from: 1
			}
		}
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.bind && (opts.bind == 'bottom')) {
			var attributes = {
				height: { from: 0, to: parseInt(this._height)},
				top: { from: (this._top + parseInt(this._height)), to: this._top }
			};
			if (ghost) {
				attributes.opacity = {
					to : 1,
					from: 0
				}
			}
		}
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this._opts && this._opts.bind && (this._opts.bind == 'bottom')) {
				YAHOO.util.Dom.setStyle(this.element, 'top', this._top + 'px');
			} else {
				ORCHESTRAL.util.Effects.Hide(this.element);
				if (isNaN(height)) {
					YAHOO.util.Dom.setStyle(this.element, 'height', 'auto');
				} else {
					YAHOO.util.Dom.setStyle(this.element, 'height', this._height + 'px');
				}
			}
			// done like this to avoid YUI's setStyle for opacity which expects only numbers
			// needed as IE6 has a bold-text anti-aliasing bug alluded to here which is triggered when opacity is set to 1: http://jszen.blogspot.com/2005/04/ie-bold-text-opacity-problem.html
			this.element.style.opacity = '';
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}

	/**
	 * Preps the style of the element before running the Animation.
	 * 
	 * @method prepStyle
	 */
	ORCHESTRAL.util.Effects.BlindUp.prototype.prepStyle = function() {
		if (this._opts && this._opts.bind && (this._opts.bind == 'bottom')) {
			YAHOO.util.Dom.setStyle(this.element, 'height', '0px');
			YAHOO.util.Dom.setStyle(this.element, 'top', this._height);
		}
		ORCHESTRAL.util.Effects.Show(this.element);
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.BlindUp.prototype.animate = function() {
		this.prepStyle();
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.BlindUp.prototype.toString = function() {
		return 'Effect BlindUp [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object act like a window blind opening.
	 * 
	 * @class Effects.BlindDown
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1<br>
	 *   delay: true (Delays execution)<br>
	 *   bind: (string) bottom<br>
	 *   ghost: (boolean)<br>
	 * )</code><br>
	 * Setting the bind option will make the element "blind down" from top to bottom.
	 */
	ORCHESTRAL.util.Effects.BlindDown = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		var ghost = ((opts && opts.ghost) ? opts.ghost : false);
		var height = parseInt(YAHOO.util.Dom.getStyle(inElm, "height"));
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._opts = opts;
		if (isNaN(height)) {
			this._height = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		} else {
			this._height = height;
		}
		this._top = parseInt(YAHOO.util.Dom.getStyle(this.element, 'top'));
		if (isNaN(this._top)) {
			this._top = 0;
		}
		
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
		var attributes = {
			height: { from: 0, to: this._height }
		};
		if (ghost) {
			attributes.opacity = {
				to : 1,
				from: 0
			}
		}
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.bind && (opts.bind == 'bottom')) {
			var attributes = {
				height: { to: 0, from: parseInt(this._height)},
				top: { to: (this._top + parseInt(this._height)), from: this._top }
			};
			if (ghost) {
				attributes.opacity = {
					to : 0,
					from: 1
				}
			}
		}
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		if (opts && opts.bind && (opts.bind == 'bottom')) {
			
			this.effect.onComplete.subscribe(function() {
				ORCHESTRAL.util.Effects.Hide(this.element);
				YAHOO.util.Dom.setStyle(this.element, 'top', this._top + 'px');
				if (isNaN(height)) {
					YAHOO.util.Dom.setStyle(this.element, 'height', 'auto');
				} else {
					YAHOO.util.Dom.setStyle(this.element, 'height', this._height + 'px');
				}
				this.element.style.opacity = '';
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		} else {
			this.effect.onComplete.subscribe(function() {
				if (isNaN(height)) {
					YAHOO.util.Dom.setStyle(this.element, 'height', 'auto');
				} else {
					YAHOO.util.Dom.setStyle(this.element, 'height', this._height + 'px');
				}
				this.element.style.opacity = '';
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		}
		if (!delay) {
			this.animate();
		}
	}

	/**
	 * Preps the style of the element before running the Animation.
	 * 
	 * @method prepStyle
	 */
	ORCHESTRAL.util.Effects.BlindDown.prototype.prepStyle = function() {
		if (this._opts && this._opts.bind && (this._opts.bind == 'bottom')) {
		} else {
			YAHOO.util.Dom.setStyle(this.element, 'height', '0px');
		}
		ORCHESTRAL.util.Effects.Show(this.element);
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.BlindDown.prototype.animate = function() {
		this.prepStyle();
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.BlindDown.prototype.toString = function() {
		return 'Effect BlindDown [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object slide open from the right.
	 * 
	 * @class Effects.BlindRight
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1<br>
	 *   delay: true (Delays execution)<br>
	 *   bind: (string) right<br>
	 *   ghost: (boolean)<br>
	 * )</code><br>
	 * Setting the bind option will make the element "blind right" from right to left (it will be attached to the right side).
	 */
	ORCHESTRAL.util.Effects.BlindRight = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		var ghost = ((opts && opts.ghost) ? opts.ghost : false);
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._width = parseInt(YAHOO.util.Dom.getStyle(this.element, 'width'));
		this._left = parseInt(YAHOO.util.Dom.getStyle(this.element, 'left'));
		if (isNaN(this._left)) {
			this._left = 0;
		}
		this._opts = opts;
	
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
		
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		var attributes = {
			width: { from: 0, to: this._width }
		};
		if (ghost) {
			attributes.opacity = {
				to : 1,
				from: 0
			}
		}
	
		if (opts && opts.bind && (opts.bind == 'right')) {
			var attributes = {
				width: { to: 0 },
				/*left: { from: parseInt, to: this._width }*/
				left: { to: this._left + parseInt(this._width), from: this._left }
			};
			if (ghost) {
				attributes.opacity = {
					to : 0,
					from: 1
				}
			}
		}
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		if (opts && opts.bind && (opts.bind == 'right')) {
			this.effect.onComplete.subscribe(function() {
				ORCHESTRAL.util.Effects.Hide(this.element);
				YAHOO.util.Dom.setStyle(this.element, 'width', this._width + 'px');
				YAHOO.util.Dom.setStyle(this.element, 'left', this._left + 'px');
				this._width = null;
				this.element.style.opacity = '';
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		} else {
			this.effect.onComplete.subscribe(function() {
				this.element.style.opacity = '';
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		}
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Preps the style of the element before running the Animation.
	 * 
	 * @method prepStyle
	 */
	ORCHESTRAL.util.Effects.BlindRight.prototype.prepStyle = function() {
		if (this._opts && this._opts.bind && (this._opts.bind == 'right')) {
		} else {
			YAHOO.util.Dom.setStyle(this.element, 'width', '0');
		}
	}

	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.BlindRight.prototype.animate = function() {
		this.prepStyle();
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.BlindRight.prototype.toString = function() {
		return 'Effect BlindRight [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object slide closed from the left.
	 * 
	 * @class Effects.BlindLeft
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1<br>
	 *   delay: true (Delays execution)<br>
	 *   bind: (string) right<br>
	 *   ghost: (boolean)<br>
	 * )</code><br>
	 * Setting the bind option will make the element "blind left" from left to right (it will be attached to the right side).
	 */
	ORCHESTRAL.util.Effects.BlindLeft = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		var ghost = ((opts && opts.ghost) ? opts.ghost : false);
		this.ghost = ghost;
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}

		this._width = YAHOO.util.Dom.getStyle(this.element, 'width');
		this._left = parseInt(YAHOO.util.Dom.getStyle(this.element, 'left'));
		if (isNaN(this._left)) {
			this._left = 0;
		}
	
		this._opts = opts;
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
		var attributes = {
			width: { to: 0 }
		};
		if (ghost) {
			attributes.opacity = {
				to : 0,
				from: 1
			}
		}
		
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.bind && (opts.bind == 'right')) {
			var attributes = {
				width: { from: 0, to: parseInt(this._width) },
				left: { from: this._left + parseInt(this._width), to: this._left }
			};
			if (ghost) {
				attributes.opacity = {
					to : 1,
					from: 0
				}
			}
		}
		
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		if (opts && opts.bind && (opts.bind == 'right')) {
			this.effect.onComplete.subscribe(function() {
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		} else {
			this.effect.onComplete.subscribe(function() {
				ORCHESTRAL.util.Effects.Hide(this.element);
				YAHOO.util.Dom.setStyle(this.element, 'width', this._width);
				YAHOO.util.Dom.setStyle(this.element, 'left', this._left + 'px');
				this.element.style.opacity = ''; 
				this._width = null;
				clearLock(this.element);
				this.onEffectComplete.fire();
			}, this, true);
		}
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Preps the style of the element before running the Animation.
	 * 
	 * @method prepStyle
	 */
	ORCHESTRAL.util.Effects.BlindLeft.prototype.prepStyle = function() {
		if (this._opts && this._opts.bind && (this._opts.bind == 'right')) {
			ORCHESTRAL.util.Effects.Hide(this.element);
			YAHOO.util.Dom.setStyle(this.element, 'width', '0px');
			YAHOO.util.Dom.setStyle(this.element, 'left', parseInt(this._width));
			if (this.ghost) {
				YAHOO.util.Dom.setStyle(this.element, 'opacity', 0);
			}
			ORCHESTRAL.util.Effects.Show(this.element);
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.BlindLeft.prototype.animate = function() {
		this.prepStyle();
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.BlindLeft.prototype.toString = function() {
		return 'Effect BlindLeft [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object appear to fold up.
	 * 
	 * @class Effects.Fold
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   to: 5,<br>
	 *   delay: true (Delays execution),<br>
	 *   ghost: (boolean)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Fold = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		this.ghost = ((opts && opts.ghost) ? opts.ghost : false);
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._to = 5;
		if (!delay) {
			ORCHESTRAL.util.Effects.Show(this.element);
		}
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
	
		this.done = false;
	
		this._height = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
	
		this._width = YAHOO.util.Dom.getStyle(this.element, 'width');
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.to) {
			this._to = opts.to;
		}
		
		var attributes = {
			height: { to: this._to }
		};
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				ORCHESTRAL.util.Effects.Hide(this.element);
				YAHOO.util.Dom.setStyle(this.element, 'height', this._height + 'px');
				YAHOO.util.Dom.setStyle(this.element, 'width', this._width);
				clearLock(this.element);
				this.onEffectComplete.fire();
			} else {
				this.done = true;
				this.effect.attributes = { width: { to: 0 }, height: { from: this._to, to: this._to } }
				if (this.ghost) {
					this.effect.attributes.opacity = {
						to : 0, from: 1
					}
				}
				this.animate();
			}
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Fold.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Fold.prototype.toString = function() {
		return 'Effect Fold [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object appear to fold out (opposite of Fold).
	 * 
	 * @class Effects.Unfold
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   to: 5,<br>
	 *   delay: true (Delays execution),<br>
	 *   ghost: (boolean)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.UnFold = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		this.ghost = ((opts && opts.ghost) ? opts.ghost : false);
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}

		this._height = ORCHESTRAL.util.Dom.getHeight(this.element);
		this._width = YAHOO.util.Dom.getStyle(this.element, 'width');
	
		this._to = 5;
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
	
	
		this.done = false;
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.to) {
			this._to = opts.to;
		}
		
		attributes = {
			height: { from: 0, to: this._to },
			width: { from: 0, to: parseInt(this._width) }
		};
		if (this.ghost) {
			attributes.opacity = {
				to : .15, from: 0
			}
		}
		
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				clearLock(this.element);
				this.onEffectComplete.fire();
				this.done = false;
			} else {
				this.done = true;
				this.effect.attributes = { width: { from: parseInt(this._width), to: parseInt(this._width) }, height: { from: this._to, to: parseInt(this._height) } }
				if (this.ghost) {
					this.effect.attributes.opacity = {
						to : 1, from: .15
					}
				}
				this.effect.animate();
			}
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Preps the style of the element before running the Animation.
	 * 
	 * @method prepStyle
	 */
	ORCHESTRAL.util.Effects.UnFold.prototype.prepStyle = function() {
		ORCHESTRAL.util.Effects.Hide(this.element);
		YAHOO.util.Dom.setStyle(this.element, 'height', '0px');
		YAHOO.util.Dom.setStyle(this.element, 'width', '0px');
		this.effect.attributes = attributes;
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.UnFold.prototype.animate = function() {
		this.prepStyle();
		ORCHESTRAL.util.Effects.Show(this.element);
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.UnFold.prototype.toString = function() {
		return 'Effect UnFold [' + this.element.id + ']';
	}
	
	
	/**
	 * This effect makes the object shake from Right to Left.
	 * 
	 * @class Effects.ShakeLR
	 * @constructor 
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: .25,<br>
	 *   delay: true (Delays execution)<br>
	 *   offset: 10,<br>
	 *   maxcount: 5<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.ShakeLR = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._offSet = 10;
		this._maxCount = 5;
		this._counter = 0;
		this._elmPos = YAHOO.util.Dom.getXY(this.element);
		var attributes = {
			left: { to:  ( - this._offSet) }
		};
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		if (opts && opts.offset) {
			this._offSet = opts.offset;
		}
		if (opts && opts.maxcount) {
			this._maxCount = opts.maxcount;
		}
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : .25);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				clearLock(this.element);
				this.onEffectComplete.fire();
			} else {
				if (this._counter < this._maxCount) {
					this._counter++;
					if (this._left) {
						this._left = null;
						this.effect.attributes = { left: { to: ( - this._offSet) } }
					} else {
						this._left = true;
						this.effect.attributes = { left: { to: this._offSet } }
					}
					this.effect.animate();
				} else {
					this.done = true;
					this._left = null;
					this._counter = null;
					this.effect.attributes = { left: { to: 0 } }
					this.effect.animate();
				}
			}
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.ShakeLR.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * To String.
	 * 
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.ShakeLR.prototype.toString = function() {
		return 'Effect ShakeLR [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object shake from Top to Bottom.
	 * 
	 * @class Effects.ShakeTB
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: .25,<br>
	 *   delay: true (Delays execution)<br>
	 *   offset: 10,<br>
	 *   maxcount: 5<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.ShakeTB = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._offSet = 10;
		this._maxCount = 5;
		this._counter = 0;
		this._elmPos = YAHOO.util.Dom.getXY(this.element);
		var attributes = {
			top: { to:  ( - this._offSet) }
		};
	
		if (opts && opts.offset) {
			this._offSet = opts.offset;
		}
		if (opts && opts.maxcount) {
			this._maxCount = opts.maxcount;
		}
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : .25);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				clearLock(this.element);
				this.onEffectComplete.fire();
			} else {
				if (this._counter < this._maxCount) {
					this._counter++;
					if (this._left) {
						this._left = null;
						this.effect.attributes = { top: { to: ( - this._offSet) } }
					} else {
						this._left = true;
						this.effect.attributes = { top: { to: this._offSet } }
					}
					this.effect.animate();
				} else {
					this.done = true;
					this._left = null;
					this._counter = null;
					this.effect.attributes = { top: { to: 0 } }
					this.effect.animate();
				}
			}
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.ShakeTB.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.ShakeTB.prototype.toString = function() {
		return 'Effect ShakeTB [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object drop from sight.
	 * 
	 * @class Effects.Drop
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Drop = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);
	
		if (!obtainLock(this.element)) {
			return;
		}

		this._height = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		this._top = parseInt(YAHOO.util.Dom.getStyle(this.element, 'top'));
		if (isNaN(this._top)) {
			this._top = 0;
		}
	
		var attributes = {
			top: { from: this._top, to: (this._top + this._height) },
			opacity: { from: 1, to: 0 }
		};
		
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeIn);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			ORCHESTRAL.util.Effects.Hide(this.element);
			YAHOO.util.Dom.setStyle(this.element, 'top', this._top + 'px');
			this.element.style.opacity = '';
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Drop.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Drop.prototype.toString = function() {
		return 'Effect Drop [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object flash on and off.
	 * 
	 * @class Effects.Pulse
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: .25,<br>
	 *   delay: true (Delays execution)<br>
	 *   maxcount: 9<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Pulse = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this._counter = 0;
		this._maxCount = 9;
		var attributes = {
			opacity: { from: 1, to: 0 }
		};
	
		if (opts && opts.maxcount) {
			this._maxCount = opts.maxcount;
		}
		
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeIn);
		var secs = ((opts && opts.seconds) ? opts.seconds : .25);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				clearLock(this.element);
				this.onEffectComplete.fire();
			} else {
				if (this._counter < this._maxCount) {
					this._counter++;
					if (this._on) {
						this._on = null;
						this.effect.attributes = { opacity: { to: 0 } }
					} else {
						this._on = true;
						this.effect.attributes = { opacity: { to: 1 } }
					}
					this.effect.animate();
				} else {
					this.done = true;
					this._on = null;
					this._counter = null;
					this.effect.attributes = { opacity: { to: 1 } }
					this.effect.animate();
				}
			}
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Pulse.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Pulse.prototype.toString = function() {
		return 'Effect Pulse [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object shrink from sight.
	 * 
	 * @class Effects.Shrink
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Shrink = function(inElm, opts) {
		this.start_elm = YAHOO.util.Dom.get(inElm);
		this.element = this.start_elm.cloneNode(true);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this.start_elm.parentNode.replaceChild(this.element, this.start_elm);
		ORCHESTRAL.util.Effects.Hide(this.start_elm);
		
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		
		var attributes = {
			width: { to: 0 },
			height: { to: 0 },
			fontSize: { from: 100, to: 0, unit: '%' },
			opacity: { from: 1, to: 0 }
		};
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			this.element.parentNode.replaceChild(this.start_elm, this.element);
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Shrink.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Shrink.prototype.toString = function() {
		return 'Effect Shrink [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object grow.
	 * 
	 * @class Effects.Grow
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Grow = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);
	
		if (!obtainLock(this.element)) {
			return;
		}
		
		var h = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		var w = parseInt(YAHOO.util.Dom.getStyle(this.element, 'width'));
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		
		var attributes = {
			width: { to: w, from: 0 },
			height: { to: h, from: 0 },
			fontSize: { from: 0, to: 100, unit: '%' },
			opacity: { from: 0, to: 1 }
		};
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Grow.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @result {String}
	 */
	ORCHESTRAL.util.Effects.Grow.prototype.toString = function() {
		return 'Effect Grow [' + this.element.id + ']';
	}
	
	/**
	 * This effect makes the object act like an old TV set.
	 * 
	 * @class Effects.TV
	 * @constructor
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   ease: YAHOO.util.Easing.easeOut,<br>
	 *   seconds: 1,<br>
	 *   delay: true (Delays execution)<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.TV = function(inElm, opts) {
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeIn);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var delay = ((opts && opts.delay) ? opts.delay : false);
	
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
	
		this.done = false;
	
		this._height = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		this._width = parseInt(YAHOO.util.Dom.getStyle(this.element, 'width'));
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
	
		var attributes = {
			top: { from: 0, to: (this._height / 2) },
			height: { to: 5 }
		};
		
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			if (this.done) {
				clearLock(this.element);
				this.onEffectComplete.fire();
				ORCHESTRAL.util.Effects.Hide(this.element);
				YAHOO.util.Dom.setStyle(this.element, 'height', this._height + 'px');
				YAHOO.util.Dom.setStyle(this.element, 'width', this._width + 'px');
				YAHOO.util.Dom.setStyle(this.element, 'top', '');
				YAHOO.util.Dom.setStyle(this.element, 'left', '');
				this.element.style.opacity = ''; 
			} else {
				this.done = true;
				this.effect.attributes = { top: { from: (this._height / 2), to: (this._height / 2) }, left: { from: 0, to: (this._width / 2) }, height: { from: 5, to: 5 }, width: { to: 5 }, opacity: { from: 1, to: 0 } };
				this.effect.animate();
			}
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.TV.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.TV.prototype.toString = function() {
		return 'Effect TV [' + this.element.id + ']';
	}
	
	/**
	 * This effect gives the object a drop shadow.
	 * 
	 * @class Effects.Shadow
	 * @constructor 
	 * @param {String/HTMLElement} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> <br>var options = (<br>
	 *   delay: true<br>
	 *   topOffset: 8<br>
	 *   leftOffset: 8<br>
	 *   shadowColor: #ccc<br>
	 *   shadowOpacity: .75<br>
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Shadow = function(inElm, opts) {
		var delay = ((opts && opts.delay) ? opts.delay : false);
		var topOffset = ((opts && opts.top) ? opts.top : 8);
		var leftOffset = ((opts && opts.left) ? opts.left : 8);
		var shadowColor = ((opts && opts.color) ? opts.color : '#ccc');
		var shadowOpacity = ((opts && opts.opacity) ? opts.opacity : .75);
	
		this.element = YAHOO.util.Dom.get(inElm);
	
		if (!obtainLock(this.element)) {
			return;
		}
		
		if (YAHOO.util.Dom.get(this.element.id + '_shadow')) {
			this.shadow = YAHOO.util.Dom.get(this.element.id + '_shadow');
		} else {
			this.shadow = document.createElement('div');
			this.shadow.id = this.element.id + '_shadow';
			this.element.parentNode.appendChild(this.shadow);
		}
	
		var h = parseInt(ORCHESTRAL.util.Dom.getHeight(this.element));
		var w = parseInt(YAHOO.util.Dom.getStyle(this.element, 'width'));
		var z = this.element.style.zIndex;
		if (!z) {
			z = 1;
			this.element.style.zIndex = z;
		}
	
		YAHOO.util.Dom.setStyle(this.element, 'overflow', 'hidden');
		YAHOO.util.Dom.setStyle(this.shadow, 'height', h + 'px');
		YAHOO.util.Dom.setStyle(this.shadow, 'width', w + 'px');
		YAHOO.util.Dom.setStyle(this.shadow, 'background-color', shadowColor);
		YAHOO.util.Dom.setStyle(this.shadow, 'opacity', 0);
		YAHOO.util.Dom.setStyle(this.shadow, 'position', 'absolute');
		this.shadow.style.zIndex = (z - 1);
		var xy = YAHOO.util.Dom.getXY(this.element);
	
		/**
		 * Custom Event fired after the effect completes
		 * @type Object
		 */
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
		
		var attributes = {
			opacity: { from: 0, to: shadowOpacity },
			top: {
				from: xy[1],
				to: (xy[1] + topOffset)
			},
			left: {
				from: xy[0],
				to: (xy[0] + leftOffset)
			}
		};
	
		/**
		 * YUI Animation Object
		 * @type Object
		 */
		this.effect = new YAHOO.util.Anim(this.shadow, attributes);
		this.effect.onComplete.subscribe(function() {
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Shadow.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Shadow.prototype.toString = function() {
		return 'Effect Shadow [' + this.element.id + ']';
	}
		
	/**
	 * This effect makes the object's background fade in out using opacity to give
	 * the feeling of highlighting an element for a period of time.
	 * 
	 * @class Effects.Highlight
	 * @constructor
	 * @param {HTMLElement | String} inElm HTML element to apply the effect to
	 * @param {Object} options Pass in an object of options for this effect, you can choose the Easing and the Duration
	 * <code> var options = (
	 *   seconds: Time for the effect
	 *   startcolor: Defaults to #ffff99, light yellow<br>
	 *   endcolor: Sets the color of the last frame of the highlight. This is best set
	 *   to the background color of the highlighted element. Defaults to #ffffff 
	 *   (white), 
	 *   restorecolor: Sets the background color of the element after the highlight has finished.
	 *   Defaults to the current background-color of the highlighted element,
	 *   ease: YAHOO.util.Easing.easeOut,
	 *   keepBackgroundImage: boolean,
	 *   delay: boolean
	 * )</code>
	 */
	ORCHESTRAL.util.Effects.Highlight = function(inElm, opts) {
		this.element = YAHOO.util.Dom.get(inElm);

		if (!obtainLock(this.element)) {
			return;
		}
		
		var ease = ((opts && opts.ease) ? opts.ease : YAHOO.util.Easing.easeOut);
		var secs = ((opts && opts.seconds) ? opts.seconds : 1);
		var startcolor = ((opts && opts.startcolor) ? opts.startcolor : '#ffff99');
		var endcolor = ((opts && opts.endcolor) ? opts.endcolor : '#ffffff');
		var restorecolor = ((opts && opts.restorecolor) ? opts.restorecolor : YAHOO.util.Dom.getStyle(this.element, 'backgroundColor'));
		var keepBackgroundImage = ((opts && opts.keepBackgroundImage) ? opts.keepBackgroundImage : false);
		var delay = ((opts && opts.delay) ? opts.delay : false);
		
		this.onEffectComplete = new YAHOO.util.CustomEvent('oneffectcomplete', this);
	
		this.oldStyle = {};
		
		if (!keepBackgroundImage) {
		   this.oldStyle.backgroundImage = YAHOO.util.Dom.getStyle(this.element, 'background-image');
		   YAHOO.util.Dom.setStyle(this.element, 'backgroundImage', 'none');
		}
			
		var attributes = {
			backgroundColor: { from: startcolor, to: endcolor }
		}
		
		this.effect = new YAHOO.util.ColorAnim(this.element, attributes, secs, ease);
		this.effect.onComplete.subscribe(function() {
			YAHOO.util.Dom.setStyle(this.element, 'backgroundColor', restorecolor);
			clearLock(this.element);
			this.onEffectComplete.fire();
		}, this, true);
		if (!delay) {
			this.effect.animate();
		}
	}
	
	/**
	 * Fires off the embedded Animation.
	 * 
	 * @method animate
	 */
	ORCHESTRAL.util.Effects.Highlight.prototype.animate = function() {
		this.effect.animate();
	}
	
	/**
	 * @method toString
	 * @return {String}
	 */
	ORCHESTRAL.util.Effects.Highlight.prototype.toString = function() {
		return 'Effect Highlight [' + this.element.id + ']';
	}
	
	/**
	 * Provides some predefined animation transitions that can be applied when an Overlay is shown or hidden.
	 * @class Effects.ContainerEffect
	 */
	ORCHESTRAL.util.Effects.ContainerEffect = function() {
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the bottom.
	 * @method BlindUpDownBinded
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownBinded = function(overlay, dur) {
		var bupdownbinded = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindUp', opts: { bind: 'bottom' } }, duration: dur }, { attributes: { effect: 'BlindDown', opts: { bind: 'bottom' } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdownbinded.init();
		return bupdownbinded;
	}

	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the top.
	 * @method BlindUpDown
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDown = function(overlay, dur) {
		var bupdown = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindDown' }, duration: dur }, { attributes: { effect: 'BlindUp' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdown.init();
		return bupdown;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the right.
	 * @method BlindLeftRightBinded
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightBinded = function(overlay, dur) {
		var bleftrightbinded = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindLeft', opts: { bind: 'right' } }, duration: dur }, { attributes: { effect: 'BlindRight', opts: { bind: 'right' } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftrightbinded.init();
		return bleftrightbinded;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the left.
	 * @method BlindLeftRight
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRight = function(overlay, dur) {
		var bleftright = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindRight' }, duration: dur }, { attributes: { effect: 'BlindLeft' } , duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftright.init();
		return bleftright;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the left and hide it by folding it up.
	 * @method BlindRightFold
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindRightFold = function(overlay, dur) {
		var brightfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindRight' }, duration: dur }, { attributes: { effect: 'Fold' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		brightfold.init();
		return brightfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the right and hide it by folding it up.
	 * @method BlindLeftFold
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftFold = function(overlay, dur) {
		var bleftfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindLeft', opts: { bind: 'right' } }, duration: dur }, { attributes: { effect: 'Fold' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftfold.init();
		return bleftfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show and hide an overlay by unfolding and folding it up.
	 * @method UnFoldFold
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.UnFoldFold = function(overlay, dur) {
		var bunfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'UnFold' }, duration: dur }, { attributes: { effect: 'Fold' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bunfold.init();
		return bunfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the top and hide it by 'dropping' it.
	 * @method BlindDownDrop
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindDownDrop = function(overlay, dur) {
		var bdowndrop = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindDown' }, duration: dur }, { attributes: { effect: 'Drop' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bdowndrop.init();
		return bdowndrop;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by folding it in from the bottom and hide it by 'dropping' it.
	 * @method BlindUpDrop
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDrop = function(overlay, dur) {
		var bupdrop = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindUp', opts: { bind: 'bottom' } }, duration: dur }, { attributes: { effect: 'Drop' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdrop.init();
		return bupdrop;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the bottom. Uses ghosting for the transition animations.
	 * @method BlindUpDownBindedGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownBindedGhost = function(overlay, dur) {
		var bupdownbinded = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindUp', opts: { ghost: true, bind: 'bottom' } }, duration: dur }, { attributes: { effect: 'BlindDown', opts: { ghost: true, bind: 'bottom'} }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdownbinded.init();
		return bupdownbinded;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the top. Uses ghosting for the transition animations.
	 * @method BlindUpDownGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDownGhost = function(overlay, dur) {
		var bupdown = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindDown', opts: { ghost: true } }, duration: dur }, { attributes: { effect: 'BlindUp', opts: { ghost: true } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdown.init();
		return bupdown;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the right. Uses ghosting for the transition animations.
	 * @method BlindLeftRightBindedGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightBindedGhost = function(overlay, dur) {
		var bleftrightbinded = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindLeft', opts: { bind: 'right', ghost: true } }, duration: dur }, { attributes: { effect: 'BlindRight', opts: { bind: 'right', ghost: true } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftrightbinded.init();
		return bleftrightbinded;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used for showing and hiding an overlay with a blind
	 * effect, with the overlay anchored at the left. Uses ghosting for the transition animations.
	 * @method BlindLeftRightGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftRightGhost = function(overlay, dur) {
		var bleftright = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindRight', opts: { ghost: true } }, duration: dur }, { attributes: { effect: 'BlindLeft', opts: { ghost: true } } , duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftright.init();
		return bleftright;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the left and hide it by folding it up.
	 * Uses ghosting for the transition animations.
	 * @method BlindRightFoldGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindRightFoldGhost = function(overlay, dur) {
		var brightfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindRight', opts: { ghost: true } }, duration: dur }, { attributes: { effect: 'Fold', opts: { ghost: true } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		brightfold.init();
		return brightfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the right and hide it by folding it up.
	 * Uses ghosting for the transition animations.
	 * @method BlindLeftFoldGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindLeftFoldGhost = function(overlay, dur) {
		var bleftfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindLeft', opts: { bind: 'right', ghost: true } }, duration: dur }, { attributes: { effect: 'Fold', opts: { ghost: true } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftfold.init();
		return bleftfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show and hide an overlay by unfolding and folding it up.
	 * Uses ghosting for the transition animations.
	 * @method UnFoldFoldGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.UnFoldFoldGhost = function(overlay, dur) {
		var bleftfold = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'UnFold', opts: { ghost: true } }, duration: dur }, { attributes: { effect: 'Fold', opts: { ghost: true } }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bleftfold.init();
		return bleftfold;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by blinding it in from the top and hide it by 'dropping' it.
	 * Uses ghosting for the transition animations.
	 * @method BlindDownDropGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindDownDropGhost = function(overlay, dur) {
		var bdowndrop = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindDown', opts: { ghost: true } }, duration: dur }, { attributes: { effect: 'Drop' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bdowndrop.init();
		return bdowndrop;
	}
	
	/**
	 * A pre-configured ContainerEffect instance that can be used to show an overlay by folding it in from the bottom and hide it by 'dropping' it.
	 * Uses ghosting for the transition animations.
	 * @method BlindUpDropGhost
	 * @static
	 * @param {YAHOO.widget.Overlay} overlay The Overlay object to animate
	 * @param {Number} dur The duration of the animation
	 * @return {YAHOO.widget.ContainerEffect} The configured ContainerEffect object
	 */
	ORCHESTRAL.util.Effects.ContainerEffect.BlindUpDropGhost = function(overlay, dur) {
		var bupdrop = new YAHOO.widget.ContainerEffect(overlay, { attributes: { effect: 'BlindUp', opts: { bind: 'bottom', ghost: true } }, duration: dur }, { attributes: { effect: 'Drop' }, duration: dur }, overlay.element, ORCHESTRAL.util.Effects.Container);
		bupdrop.init();
		return bupdrop;
	}
	
	/**
	 * This is a wrapper function to convert my YAHOO.widget.Effect into a YAHOO.widget.ContainerEffects object
	 * 
	 * @class Effects.Container
	 * @constructor
	 * @param el {HTMLElement | String}
	 * @param attrs {Object}
	 * @param dur {int}
	 */
	ORCHESTRAL.util.Effects.Container = function(el, attrs, dur) {
		var opts = { delay: true };
		if (attrs.opts) {
			for (var i in attrs.opts) {
				opts[i] = attrs.opts[i];
			}
		}
		//var eff = eval('new ORCHESTRAL.util.Effects.' + attrs.effect + '("' + el.id + '", {delay: true' + opts + '})');
		var func = eval('ORCHESTRAL.util.Effects.' + attrs.effect);
		var eff = new func(el, opts);
		
		/*
		 * Empty event handler to make ContainerEffects happy<br>
		 * May try to attach them to my effects later
		 * @type Object
		 */
		//eff.onStart = new YAHOO.util.CustomEvent('onstart', this);
		eff.onStart = eff.effect.onStart;
		/*
		 * Empty event handler to make ContainerEffects happy<br>
		 * May try to attach them to my effects later
		 * @type Object
		 */
		//eff.onTween = new YAHOO.util.CustomEvent('ontween', this);
		eff.onTween = eff.effect.onTween;
		/*
		 * Empty event handler to make ContainerEffects happy<br>
		 * May try to attach them to my effects later
		 * @type Object
		 */
		//eff.onComplete = new YAHOO.util.CustomEvent('oncomplete', this);
		eff.onComplete = eff.onEffectComplete;
		return eff;
	}

})();

YAHOO.register("orchestral-effects", ORCHESTRAL.util.Effects, {version: '7.9', build: '0'});

}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-dom", "yui2-animation", "yui2-orchestral", "yui2-orchestral-dom"]});
