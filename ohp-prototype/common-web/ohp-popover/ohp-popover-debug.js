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
YUI.add('ohp-popover', function (Y, NAME) {

/*global Y,Modernizr */

/**
 * Provides a basic Popover widget, with Standard Module content support as well as the PopoverAlignment class. The Popover widget
 * provides delayed showing and hiding as well as associating with a trigger element for alignment.
 *
 * @module ohp-popover
 */
/**
 * A module for alignment options.
 *
 * @class PopoverAlignment
 * @namespace OHP
 */
function PopoverAlignment() {
}
/**
 * Alignment Top to be used to set Popover Alignment above the trigger
 * @property top
 * @type string
 * 
 */
PopoverAlignment.top = "top";
/**
 * Alignment Bottom to be used to set Popover Alignment below the trigger
 * @property bottom
 * @type string
 */
PopoverAlignment.bottom = "bottom";
/**
 * Alignment Left to be used to set Popover Alignment to the left of the trigger
 * @property left
 * @type string 
 */
PopoverAlignment.left = "left";
/**
 * Alignment Right to be used to set Popover Alignment to the right of the trigger
 * @property right
 * @type string
 */
PopoverAlignment.right = "right";

// function to test if two arrays are the same
var areSame = function(a, b) {
	a = a || [];
	b = b || [];
	
	var n = a.length,
		m = b.length,
		i;
		
	if (n !== m) {
		return false;
	}
	
	for (i = 0; i < n; i++) {
		if (a[i] !== b) {
			return false;
		}
	}
	
	return true;
};

var _animPlugin = { 
	fn:Y.Plugin.WidgetAnim, 
	cfg: {
		duration: 0.25
	}
};

var MAX_MOVE_COUNT = 40;

var _hasAnimations = function() {
	var result =  !(Y.UA.ie === 6 || Y.UA.ie === 7 || Y.UA.ie === 8 ||Y.UA.ipad > 0);
	return result;
};

/*
 * static InstanceManager
 * Is Aware of every Popover added to a page
 */
var _manager = (function() {
	var _instances = [];
	return {
		count: function() {
			return _instances.length;
		},	
		add: function(overlay) {
			_instances.push(overlay);
		},
		hide: function(animate) {
			var i;
			for (i = _instances.length - 1; i >= 0; i--) {
				if (!animate) {
					_instances[i].unplug(Y.Plugin.WidgetAnim);
				}
				_instances[i].hide();
				_instances[i].set('visible', false);
				if (!animate) {
					if (_hasAnimations()) {
						_instances[i].plug(_animPlugin);
					}
					
				}
			}
		}
	};
}());

/**
 * A basic Popover Widget, which can be positioned based on on the location of a trigger element or
 * Page XY co-ordinates and is stackable (z-index support).
 * It also uses a standard module format for it's content, with header,
 * body and footer section support.
 *
 * @class Popover
 * @namespace OHP
 * @constructor
 * @extends Overlay
 * @param {Object} object The user configuration for the instance.
 */
function Popover(config) {
	var plugins = [];
	if (_hasAnimations()) {
		plugins.push(_animPlugin);	
	}
	if (config.asWindow) {
		var windowPlugin = { fn: Y.Plugin.OHP.PopoverWindow };
		plugins.push(windowPlugin); 
	}
	if (config.isEditable) {
		var editPlugin = {fn:Y.Plugin.OHP.Editable};
		plugins.push(editPlugin); 
	}
	config.constrain = false;
	config.preventOverlap = true; 
	if (config.plugins === null && plugins.length > 0) {
		config.plugins = plugins;
	}
	_manager.add(this);
	
	Popover.superclass.constructor.apply(this, arguments);
	
	Y.Do.after(this._afterShow, this, "show");
	Y.Do.before(this._beforeShow, this, "show");
	Y.Do.after(this._afterRender, this, "render"); 
	Y.Do.before(this._beforeHide, this, "hide");
	Y.Do.after(this._afterHide, this, "hide");
}

/** 
 * When the popover shows the show event is fired
 * @event show
 */

/** 
 * When the popover hides the hide event is fired
 * @event hide
 */

/** 
 * When the popover is rendered the render event is fired
 * @event render
 */

/** 
 * When the popover displays and doesn't have enough room to be shown completly the notinview event is fired
 * @event notinview
 */

/**
 * Function to hide any visible Popover.
 * @param config {object} config object 
 *  option animate boolean flag to 
 */
Popover.hideAll = function(config) {
	var animate = true;
	if (config && config.animate !== null) {
		animate = config.animate;
	}
	_manager.hide(animate);
};

var _preventShowingOfPopovers = false;

/**
 * Function to suspend popovers from showing or hiding. If popover is shown
 * it will not hide, if hidden, it will not show
 */
Popover.suspend = function() {
	_preventShowingOfPopovers = true;
};

/**
 * Function to resume the normal show/hide behavior of popovers
 */
Popover.resume = function() {
	_preventShowingOfPopovers = false;
};

/** 
 * Function that returns true if the popover show/hide functionality is currently suspended
 */
Popover.isSuspended = function() { 
	return _preventShowingOfPopovers;
};

var _timer;

var _getElementScreenLocation = function(node) {
	var top = node.get('offsetTop'),
		left = node.get('offsetLeft'),
		width = node.get('offsetWidth'),
		height = node.get('offsetHeight'),
		el = node;
	while (el.get('offsetParent')) {
		el = el.get('offsetParent');
		top += el.get('offsetTop');
		left += el.get('offsetLeft');
	}
	return {
		top: top,
		left: left,
		width: width,
		height: height
	};
}; 

var _isElementInViewport = function(node) {
	var domNode =  Y.Node.getDOMNode(node),
		result = Y.DOM.inViewportRegion(Y.Node.getDOMNode(node), true);
	return result;
};

var _getElementBoundryChecks = function(node) {
	var loc = _getElementScreenLocation(node),
		h = node.get('winHeight'),
		w = node.get('winWidth'),
		isNodeTopGreaterThanScreenHeight = loc.top >= h,
		isNodeLeftGreaterThanScreenWidth = loc.left >= w,
		isNodeBottomGreaterThanScreenHeight = (loc.top + loc.height) >= (h),
		isNodeRightGreaterThanScreenRight = (loc.left +loc.width) >= w;
		isNodeTopGreaterThanNodeHeight = loc.top > loc.height;
	return {
		offRight: isNodeRightGreaterThanScreenRight, 
		offBottom: isNodeBottomGreaterThanScreenHeight,
		offTop: isNodeTopGreaterThanScreenHeight,
		offLeft: isNodeLeftGreaterThanScreenWidth,
		spaceAbove: isNodeTopGreaterThanNodeHeight
	};
};

Popover.NAME = 'ohp-popover';

Popover.ATTRS = {
	
	/**
	 * delay in milliseconds for hiding popover when delayedHide called
	 */
	hideDelay: {
		value: 750,
		readOnly: true
	},
	
	/**
	 * delay in milliseconds for show popover when delayedShow called
	 */
	showDelay: {
		value: 500,
		readOnly: true
	},
	
	/**
	 * element the popover should be anchored to
	 *
	 * @config triggerNode
	 * @type String|Node
	 */
	triggerNode: {
		validator: function(val) {
			return Y.Lang.isString(val) || Y.instanceOf(val, Y.Node);
		},
		setter: function(val) {
			return Y.Lang.isString(val) ? Y.Node.one(val): val;
		}
	},
	
	/**
	 * XY coordinates the popover should be anchored to 
	 * @attribute triggerXY
	 * @default null
	 * @type {Array}
	 */
	triggerXY: {
		validator: function(val) {
			return Y.Lang.isArray(val);
		},
		setter: function(val) {
			//create new node, setXY and set as trigger
			var xyNode = Y.Node.one('#' + this.get('id') + '-xy-triger');
			if (!xyNode) {
				xyNode = Y.Node.create('<a href="#" id="' + this.get('id') + '-xy-triger" class="x-y-trigger" style="display:block;height: px;width:1px;position:absolute;"></a>');
				Y.one('body').append(xyNode);
			}
			xyNode.setXY(val);
			this.set('triggerNode', 'a#' + this.get('id') + '-xy-triger');
			return val;
		} 
	},
	
	/**
	 * //TODO: update description.
	 *
	 * @attribute trigger
	 * @default null
	 * @type {Object}
	 */
	trigger: {
		validator: function(val) {
			if (Y.Lang.isString(val) || Y.instanceOf(val, Y.Node) || Y.instanceOf(val, Y.NodeList)) {
				return true;
			} else if (Y.Lang.isObject(val)) {
				if (Y.Object.hasKey(val, 'handler') && !Y.Lang.isFunction(val.handler)) {
					return false;
				}
				if (Y.Object.hasKey(val, 'delegate')) {
					if (!(Y.Object.hasKey(val.delegate, 'el') && Y.Object.hasKey(val.delegate, 'filter'))) {
						return false;
					}
					if (!(Y.Lang.isString(val.delegate.el) || Y.instanceOf(val.delegate.el, Y.Node))) {
						return false;
					}
					if (!Y.Lang.isString(val.delegate.filter)) {
						return false;
					}
				}
				return true;
			}
		},
		setter: function(val) {
			var result = val;
			
			if (Y.Lang.isString(val)) {
				return { node: Y.one(val) };
			}
			
			if (Y.Lang.isObject(val)) {
				result = Y.merge({
					handler: function(triggerNode) {
						var srcNode = this.get('srcNode');
						
						//TODO: check if srcNode uses StdMod
						if (srcNode) {
							this.set('bodyContent', srcNode.getContent());
						}
					}
				}, val);
			}
			return result;	
		}
	},
	
	onShow: {
		validator: function(val) {
			return Y.Lang.isFunction(val);
		}
	},
	
	onHide: {
		validator: function(val) {
			return Y.Lang.isFunction(val);
		}
	},
	
	/**
	 * Specify placement of Popover in relation to trigger
	 */
	alignment: {
		value: PopoverAlignment.bottom
	},
	
	/**
	 * Event of the trigger element that the popover can be bound to
	 * values include click (Default) and hover
	 */
	triggerEvent:{
		value: false,
		setter: function(val) {
			return val;
		}
	},
	
	/**
	 * Content of Popover, can be text, or html. If html passed as it can conform to WidgetStdMod
	 * for header, body, and footer
	 */ 
	content: {
		value: " ",
		setter: function(value) {
			var hd,
				bd,
				ft,
				contentNode;
			if (value === " ") {
				return value;
			}
			if (this.get('contentBox').hasClass('loading')) {
				this.get('contentBox').removeClass('loading');
			}
			contentNode = Y.Node.create(value);
			if (contentNode === null) {
				return '';
			}
			
			if (contentNode.hasChildNodes()) {
				hd = contentNode.one('.yui3-widget-hd');
				bd = contentNode.one('.yui3-widget-bd');
				ft = contentNode.one('.yui3-widget-ft');
			} else {
				this.setStdModContent(Y.WidgetStdMod.BODY, value);
				return value;
			}
			if (hd !== null) {
				this.setStdModContent(Y.WidgetStdMod.HEADER, hd.get('innerHTML'));
			} else {
				if (this.getStdModNode(Y.WidgetStdMod.HEADER)) {
					this.getStdModNode(Y.WidgetStdMod.HEADER).destroy();
				}
			}
			if (bd !== null) {
				this.setStdModContent(Y.WidgetStdMod.BODY, bd.get('innerHTML'));
			} else {
				this.setStdModContent(Y.WidgetStdMod.BODY, contentNode.get('innerHTML'));
			}
			if (ft !== null) {
				this.setStdModContent(Y.WidgetStdMod.FOOTER, ft.get('innerHTML'));
			} else {
				if (this.getStdModNode(Y.WidgetStdMod.FOOTER)) {
					this.getStdModNode(Y.WidgetStdMod.FOOTER).destroy();
				}
			}
			if (bd) {
				return bd.get('innerHTML');
			}
			return "No Content Set";
		}
	},

	/**
	 * Boolean to render popover as a modal
	 */
	asWindow: {
		value: false
	},
	
	/**
	 * Boolean to include check popover contents and if contains form elements allow the popover to
	 * "Lock" in place when elements are dirty.
	 */
	isEditable: {
		value: false
	},
	
	hasBeak: {
		value: true
	},
	
	maxHeight: {
		value: null
	},
	
	maxWidth: {
		value: null
	},
	
	zIndex: {
		value: 2
	},
	
	visible:{
		value: false
	},
	
	render:{
		value:true
	}
};

Y.extend(Popover, Y.Overlay, {
	
	BOUNDING_TEMPLATE: '<div class="yui3-popover yui-popover"><div class="beak-item"></div></div>',
	
	CONTENT_TEMPLATE: '<div class="yui3-popover-content yui-popover-content"></div>',
	
	initializer:function() {
		this.set('constrain', false);
		this.set('preventOverlap', true );
		var tester = this.get('content');
	},
	
	bindUI: function() {
		var triggerObj = this.get('trigger'),
			trigNode = triggerObj ? (triggerObj.node || this.get('triggerNode')) : this.get('triggerNode'),
			trigHandler,
			handlerFunction;
		
		if (triggerObj && triggerObj.delegate) {
			// Trigger Object. Used for event delegation.
			this._bindDelegates(triggerObj);
			
			if (triggerObj.handler) {
				trigHandler = Y.bind(triggerObj.handler, this);
				
				// TODO: double function wrapper??
				handlerFunction = function(e) {
					trigHandler(this.get('triggerNode'));
				};
				
				this.subscribe('show', handlerFunction);
			}
		} else if (trigNode) {
			// Original single 'triggerNode' config.
			this.bindToNode(trigNode);
		}
		
		this.on(['mouseleave', 'mouseout'], function(e) {
			this.delayedHide();
		});
		
		this.on(['mouseenter', 'mouseover'], function(e) { 
			if (_timer) {
				_timer.cancel();
			} 
		});
		
		// Publish Hide and Show Events.
		this.on('show', function(e) {
			this.publish('show', { broadcast: true });
		});
		this.on('hide', function(e) {
			this.publish('hide', { broadcast: true });
		});
		
		// For iPad support. 
		if (Modernizr.touch) {

			// Hide popover on touch of Header.
			// TODO: when header is set dynamically after initialisation, this event is not bound.
			var header = this.getStdModNode(Y.WidgetStdMod.HEADER);
			// header may be null for some popovers, e.g. comments
			if (header) {
				header.on('touchend', function(e) {
					this.hide();
				}, this);
			}

			// A touch outside the popover should hide the popover if it's visible.
			// This event can be fired even when touching the triggerNode which
			// interferes with toggling, so we also check for this.
			Y.Event.defineOutside('touchstart');
			this.get('contentBox').on('touchstartoutside', function(e) {
				if (this.get('visible') && (e.target !== this.get('triggerNode'))) {
					this.hide();
				}
			}, this);
		}

		// Call show on resize of window.
		Y.on('windowresize', function(e) {
			if (this.get('visible') === true) {
				this.show();
			}
		}, this, null);
	},
	
	renderUI: function() {
		this._wrapNode(this.get('contentBox'));
	},
	
	_bindDelegates: function(triggerObj) {

		var containerEl = triggerObj.delegate.el,
			filter = triggerObj.delegate.filter,
			triggerEvent = this.get('triggerEvent'),
			trigNode,
			prevTrigNode,
			onClickFunction,
			onMouseOverFunction,
			onMouseOutFunction;

		// TODO: move these outside as their own functions..?
		onClickFunction = function(e) {
			trigNode = e.target;
			prevTrigNode = this.get('triggerNode');
			this.setAttrs({ triggerNode: trigNode });
			if (prevTrigNode === trigNode) {
				// same node so toggle.
				this.toggle(e);
			} else {
				// diff node so show.
				this.show();
			}
			e.preventDefault();
		};
		onMouseOverFunction = function(e) {
			trigNode = e.target;
			this.setAttrs({ triggerNode: trigNode });
			if (_timer) {
				_timer.cancel();
			}
			this.delayedShow();
			e.preventDefault();
		};
		onMouseOutFunction = function(e) {
			trigNode = e.target;
			this.setAttrs({ triggerNode: trigNode });
			this.delayedHide();
			e.preventDefault();
		};
		
		if (triggerEvent !== 'click') {
			Y.delegate(['mouseover', 'mouseenter'], onMouseOverFunction, containerEl, filter, this);
		}
		
		// TODO: add touch event aswell as click here?
		Y.delegate('click', onClickFunction, containerEl, filter, this);
		Y.delegate(['mouseout', 'mouseleave'], onMouseOutFunction, containerEl, filter, this);
	},
	
	// Used with original 'triggerNode' config.
	bindToNode: function(trigNode, onShow) {
		trigNode.addClass('evented');
		var triggerEvent = this.get('triggerEvent'),
			triggerDelay,
			toggleSet;
			
		triggerDelay = function() {
			this.delayedShow({ triggerNode: trigNode });
		};
		toggleSet = function(e) {
			this.setAttrs({ triggerNode: trigNode });
			this.toggle(e);
		};
		if (onShow) {
			// TODO: Same repeated code here as handler function above..?
			var handlerFunction = function() {
				var triggerFunction = Y.bind(onShow, this);
				triggerFunction(trigNode);
			};
			this.subscribe('show', handlerFunction);
		}
		if (triggerEvent === 'hover' && !(Y.UA.ipad)) {
			trigNode.on({
				mouseenter: Y.bind(triggerDelay, this), 
				mouseleave: Y.bind(this.delayedHide, this)
			});
		} else if (triggerEvent === 'click') {
			trigNode.on({
				click: Y.bind(toggleSet, this),
				mouseleave: Y.bind(this.delayedHide, this)
			});
		} else {
			trigNode.on({
				mouseenter: Y.bind(triggerDelay, this), 
				mouseleave: Y.bind(this.delayedHide, this), 
				click: Y.bind(toggleSet, this)
			});
		}
	},
	
	/**
	 * hides the popover instance.
	 *
	 */
	hide: function() {
		if (Popover.isSuspended()) {
			return;
		}
		if (_timer) {
			_timer.cancel();
		}
		Popover.superclass.hide.apply(this, arguments);
		this.fire('hide');
	},
	
	/**
	 * shows popover.
	 *
	 */
	show: function(config) {
		if (Popover.isSuspended()) {
			return;
		}
		_manager.hide(true);
		if (_timer) {
			try {
				_timer.cancel();
			} catch (e) {
				Y.log(e, 'info', 'ohp-popover');
			}
		}
		if (config) {
			this.setAttrs(config);
		}
		try {
			if (!this.getStdModNode(Y.WidgetStdMod.BODY)) {
				this.get('contentBox').addClass('loading');
			}
		} catch (ev) {
			Y.log(ev, 'info', 'ohp-popover');
		}
		
		Popover.superclass.show.apply(this, arguments);	
		this.fire('show', true);
	},
	
	/**
	 * Shows the popover if it is not already visible. Otherwise hides the popover.
	 *
	 */
	toggle: function(e) {
		if (this.get('visible')) {
			this.hide();
		} else {
			this.show();
		}
		if (e) {
			e.preventDefault();
		}
	},
	
	set: function(key, value) {
		if (Popover.isSuspended()) {
			return;
		}
		Popover.superclass.set.apply(this, arguments);	
	},
	
	_afterShow: function() {
		var adjusted = this._alignThis(); 
		if (this.get('hasBeak')) {
			this._applyBeak(adjusted);
		}
		this.fire('showcomplete', true );
	},
	
	_alignThis: function() { 
		var trigNode = this.get('triggerNode'),
			alignment = this.get('alignment'),
			adjusted = false; 
		if (alignment === PopoverAlignment.bottom) { 
			adjusted = this._alignForBottom(trigNode);
		} else if (alignment === PopoverAlignment.right) {
			this._alignForRight(trigNode);
		} else if (alignment === PopoverAlignment.left) {
			this._alignForLeft(trigNode);
		} else if (alignment === PopoverAlignment.top) {
			this._alignForTop(trigNode);
		} else { 
			adjusted = this._alignForBottom(trigNode);
		}
		if (!_isElementInViewport(this.get('boundingBox'))){
			this.fire('notinview');
		}
		return adjusted;
	},
	
	_beforeShow: function() { 
		if (_preventShowingOfPopovers) {
			 return new Y.Do.Prevent();
		}
		return true;
	},
	
	_beforeHide: function() {
		if (_preventShowingOfPopovers) {
			 return new Y.Do.Prevent();
		}
		return true;
	},	
	
	_afterHide: function() {
		var bod = this.getStdModNode(Y.WidgetStdMod.BODY);
		if (bod) {
			bod.setStyle('overflow', 'auto');
		}
	},
	
	_afterRender: function() {
		this.register();
	},
	
	/**
	 * Function to clear the contents of the header, footer, and body
	 */
	clear: function() {
		this.setStdModContent(Y.WidgetStdMod.BODY, null);
		this.setStdModContent(Y.WidgetStdMod.HEADER, null);
		this.setStdModContent(Y.WidgetStdMod.FOOTER, null);
	},
	
	_applyBeak: function(positionInversed) {
		var trigger = this.get('triggerNode'),
			triggerLocation = _getElementScreenLocation(trigger),
			config = { trigger: trigger, triggerLocation: triggerLocation, isInversed: positionInversed};
		if (this.get('alignment') === PopoverAlignment.right) { 
			this._beakForRight(config);
		} else if (this.get('alignment') === PopoverAlignment.left) { 
			this._beakForLeft(config);
		} else if (this.get('alignment') === PopoverAlignment.top) {
			this._beakForTop(config);
		} else if (this.get('alignment') === PopoverAlignment.bottom) {
			this._beakForBottom(config);
		} else {
			this._beakForBottom(config);
		}
	},
	
	_wrapNode: function(node) {
		var oneNode = Y.Node.create('<div class="level-1"></div>'),
			twoNode = Y.Node.create('<div class="level-2"></div>'),
			threeNode = Y.Node.create('<div class="level-3"></div>');
		threeNode.insert(node);
		twoNode.insert(threeNode);
		oneNode.insert(twoNode);
		var boundingBox = this.get('boundingBox');
		boundingBox.insert(oneNode);
	},
	
	/**
	 * Registers instance of Popover
	 */
	register: function() {
		_manager.add(this);
	},
	
	/**
	 * Locks all instances of popover - if currently hidden cannot be opened until a call to unlock
	 * If currently shown cannot be hidden until unlock is called
	 */
	lock: function() {
		Popover.suspend();
	},
	
	/**
	 * Unlocks all instances of popover - returns popover behaivior to normal
	 */
	unlock: function() {
		Popover.resume();
	},
	
	/**
	 * Sets the popover to show after delay 
	 */
	delayedShow: function(config) {
		if (Popover.isSuspended()) {
			return;
		}
		
		var showDelay = this.get('showDelay');
		
		if (_timer) {
			_timer.cancel();
		}
		
		// Unless called from _bindDelegates method, hide popover before shown at new trigger
		// as content of popover may have already changed in reference to a new trigger so
		// shouldn't remain pointing to this trigger (The delegate approach changes content
		// on show not before show, so this is not an issue).
		var trigger = this.get('trigger');
		if (!(trigger && trigger.delegate)) {
			_manager.hide(true);
		}
		
		_timer = Y.later(showDelay, this, this.show, config, false);
	},
	
	/**
	 * Sets the popover to hide after delay 
	 */
	delayedHide: function() {
		if (Popover.isSuspended()) {
			return;
		}
		var delay = this.get('hideDelay');
		if (_timer) {
			_timer.cancel();
		}
		_timer = Y.later(delay, this, _manager.hide, true, false);
	},
	
	_alignForBottom: function(trigNode) {
		var elementBoundaryChecks;
		this.set('align', {
			node: trigNode,
			points: [Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]
		});
		var details = Y.DOM.intersect(trigNode, this.get('boundingBox'));
		
		if (this.get('boundingBox').getStyle('left').indexOf('-') === 0 ) {
			//popover is off the screen, however due to padding/margin
			// total diff is 35px but moving only by 33 to provide 2 px padding
			this.get('boundingBox').setStyle('left', '-33px');
		}
		
		if (!_isElementInViewport(this.get('boundingBox'))) {
			elementBoundaryChecks = _getElementBoundryChecks(this.get('boundingBox'));
			if (elementBoundaryChecks.offBottom && elementBoundaryChecks.spaceAbove) {
				// if the popover extends beyond the bottom of the viewport AND there is enough space above
				// alight it above (if not enough space, just keep below, so it scrolls)
				this.set('align', {
					node: trigNode,
					points: [Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC]
				});
				if (this.get('boundingBox').getStyle('left').indexOf('-') === 0 ) {
					this.get('boundingBox').setStyle('left', '-33px');
				}
				return true;
			}
			if (elementBoundaryChecks.offRight) {
				var checker = 0,
					currentXY;
				while (!_isElementInViewport(this.get('boundingBox'))) {
					if (checker > MAX_MOVE_COUNT) { break; }
					currentXY = this.get('xy');
					this.move(currentXY[0]- 5, currentXY[1] ); 
					checker++;
				}
			}
		}
		return false;
	},
	
	_alignForRight: function(trigNode) {
		this.set('align', {
			node: trigNode,
			points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]
		});
		var currentXY = this.get('xy');
		this.move(currentXY[0], currentXY[1] - 35);
		if (!_isElementInViewport(this.get('contentBox'))) {
			var checker = 0;
			while (!_isElementInViewport(this.get('contentBox'))) {
				if (checker > MAX_MOVE_COUNT) { break; }
				currentXY = this.get('xy');
				this.move(currentXY[0], currentXY[1] - 5); 
				checker++;
			}
		}
	},
	
	_alignForTop: function(trigNode) {
		this.set('align', {
			node: trigNode,
			points: [Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC]
		});
		var currentXY = this.get('xy');
		
		this.move(currentXY[0] + 5, currentXY[1] );
		
		if (!_isElementInViewport(this.get('boundingBox'))) {
			if (_getElementBoundryChecks(this.get('boundingBox')).offBottom) {
				this.set('align', {
					node: trigNode,
					points: [Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]
				});
				if (this.get('boundingBox').getStyle('left').indexOf('-') === 0 ) {
					this.get('boundingBox').setStyle('left', '-33px');
				}
				this.set('alignment', PopoverAlignment.bottom);
				return true;
			}
			if (_getElementBoundryChecks(this.get('boundingBox')).offRight) {
				var checker = 0;
				while (!_isElementInViewport(this.get('boundingBox'))) {
					if (checker > MAX_MOVE_COUNT) { break; }
					currentXY = this.get('xy');
					this.move(currentXY[0]- 5, currentXY[1]);
					checker++;
				}
			}
		}
		return true;
	},
	
	_alignForLeft: function(trigNode) {
		this.set('align', {
			node: trigNode,
			points: [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.TL]
		});
		var currentXY = this.get('xy');
		
		this.move(currentXY[0] - 12, currentXY[1] - 38);
		if (!_isElementInViewport(this.get('contentBox'))) {
			var checker = 0;
			while (!_isElementInViewport(this.get('contentBox'))) {
				if (checker > MAX_MOVE_COUNT) { break; }
				currentXY = this.get('xy');
				this.move(currentXY[0], currentXY[1] - 5); 
				checker++;
			}
		}
	},
	
	_beakForTop: function(config) {
		var linkWidth = config.trigger.get('offsetWidth'),
			overlayNode = this.get('boundingBox'),
			popLoc = _getElementScreenLocation(overlayNode),
			width = (popLoc.left - (config.triggerLocation.left  + linkWidth/2)),
			halfOfOverlay = overlayNode.get('offsetWidth') / 2,
			beakNode;
		if (width < 0) {
			width = parseInt(width, 10) * -1;
		}
		if (width < 25 ) { 
			width = 25;
		}
		if (width > overlayNode.get('offsetWidth')) {
			width = halfOfOverlay;
		}
		beakNode = overlayNode.one('.beak-item');
		beakNode.set('className','');
		beakNode.addClass('beak-item');
		// TODO: what is this supposed to do? seems as if it will always be true?
		beakNode.addClass('beak-over');
		beakNode.setStyle('left', (width-10) + "px");
	},
	
	_beakForBottom: function(config) {
		var linkWidth = config.trigger.get('offsetWidth'),
			overlayNode = this.get('boundingBox'),
			popLoc = _getElementScreenLocation(overlayNode),
			width = (popLoc.left - (config.triggerLocation.left  + linkWidth/2)),
			halfOfOverlay = overlayNode.get('offsetWidth') / 2,
			beakNode;
		if (width < 0) {
			width = parseInt(width, 10) * -1;
		}
		if (width < 25) {
			width = 25;
		}
		if (width > overlayNode.get('offsetWidth')) {
			width = halfOfOverlay;
		}
		beakNode = overlayNode.one('.beak-item');
		beakNode.set('className','');
		beakNode.addClass('beak-item');
		beakNode.addClass(config.isInversed ? 'beak-over' : 'beak');
		beakNode.setStyle('left', (width-10) + "px");
	},
	
	_beakForLeft: function(config) {
		var overlayNode = this.get('boundingBox'),
			popLoc = _getElementScreenLocation(overlayNode),
			height = popLoc.top - config.triggerLocation.top,
			adjustment = 4,
			beakNode; 
		if (this.get('triggerXY')) {
			adjustment = 8;
		} 
		if (height < 0) {
			height = parseInt(height , 10) * -1;
		}
		if (height < 25) {
			height = 26;
		}
		if (height > overlayNode.get('height')) {
			height = overlayNode.get('height') - 15;
		}
		beakNode = overlayNode.one('.beak-item');
		beakNode.set('className','');
		beakNode.addClass('beak-item');
		// TODO: what is this supposed to do? seems as if it will always be true?
		beakNode.addClass('beak-left');
		beakNode.setStyle('top', height - adjustment  + "px");
		beakNode.setStyle('right', '-22px');
	},
	
	_beakForRight: function(config) {
		var overlayNode = this.get('boundingBox'),
			popLoc = _getElementScreenLocation(overlayNode),
			height = popLoc.top - config.triggerLocation.top,
			adjustment = 4,
			beakNode;
		if (this.get('triggerXY')) {
			adjustment = 8;
		}
		if (height < 0) {
			height = parseInt(height, 10) * -1;
		}
		if (height < 25) {
			height = 26;
		}
		if (height > overlayNode.get('height') ) {
			height = overlayNode.get('height') -15;
		}
		beakNode = overlayNode.one('.beak-item');
		beakNode.set('className','');
		beakNode.addClass('beak-item');
		beakNode.addClass(config.isInversed ?  'beak-left' :'beak-right' );
		beakNode.setStyle('top', height - adjustment + "px");
	},
	
	/** 
	 * Deprecated function to set the alignment and show a popover
	 * @deprecated Method depracated
	 */
	trigger: function(triggerNode, isRight) {
		if (!this.get('_activeTrigger')) {
			this.set('_activeTrigger', triggerNode);
		}
		if (this.get('_activeTrigger').get('id') !== triggerNode.get('id')) {
			if (_timer) {
				_timer.cancel();
			}
		}
		this.set('triggerNode', triggerNode);
		this.set('alignment', isRight ? 'right' : 'bottom');
		this.show();
	},
	
	/**
	 * Deprecated function to show and position the popover
	 * @deprecated Method depracated
	 */
	triggerShow: function(triggerNode, isRight) {
		this.set('triggerNode', triggerNode);
		this.set('alignment', isRight ? 'right' : 'bottom');
		this.show();
		//_showAndPositionOverlay(this, triggerNode, isRight);
	},
	
	/**
	 * Deprecated function to show after a brief delay
	 * @deprecated Method depracated
	 */
	triggerDelayedShow: function(triggerNode, isRight) {
		var showDelay = this.get('showDelay');
		if (_timer) {
			_timer.cancel();
		}
		_timer = Y.later(showDelay, this, this.triggerShow, [triggerNode, isRight], false);
	},
	
	/**
	 * Deprecated function to hide after a delay
	 * @deprecated Method depracated
	 */
	triggerHide: function() {
		this.delayedHide();
	},
	
	/**
	 * Deprecated.
	 * @deprecated Method depracated
	 */
	triggerOver: function() {
		if (_timer) {
			_timer.cancel();
		}
	},
	
	/**
	 * Deprecated function to show and allows options to be set before showing
	 * @deprecated Method depracated
	 */
	showWithDetails: function(config) {
		if (config) {
			this.setAttrs(config);
		}
		this.show();
	}
});

Y.namespace("ORCHESTRAL").Popover = Popover; 
Y.namespace("OHP").Popover = Popover; 
Y.namespace("OHP").PopoverAlignment = PopoverAlignment;

 


}, '7.9.0', {
    "requires": [
        "ohp-editable",
        "overlay",
        "event-touch",
        "event-hover",
        "event-mouseenter",
        "widget-anim",
        "yui-later",
        "event-outside"
    ]
});
