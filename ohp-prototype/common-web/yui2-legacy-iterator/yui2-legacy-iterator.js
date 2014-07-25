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
YUI.add('yui2-legacy-iterator', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * Constructs an iterator over the given collection.
 * @module legacy-iterator
 * @class An iterator over a collection.
 * @param collection the collection to construct an iteration over
 * @constructor
 */
function Iterator(collection) {
	/** @private */
	this.index = 0;
	if( collection == null || typeof collection == "undefined" ) {
		/** @private */
		this.len = 0;
	} else if( typeof collection.length == "undefined" ) {
		this.len = 1;
		/** @private */
		this.collection = new Array( 1 );
		this.collection[0] = collection;
	} else {
		this.len = collection.length;
		this.collection = collection;
	}

	/**
	 * Returns <code>true</code> if the iteration has more elements.
	 * @return <code>true</code> if the iteration has more elements,
	 * <code>false</code> otherwise.
	 * @type Boolean
	 */
	this.hasNext = function() {
		return this.index < this.len;
	};

	/**
	 * Returns the next element in the iteration.
	 * @return the next element in the iteration
	 */
	this.next = function() {
		return this.collection[this.index++];
	};
}
window.Iterator = Iterator;


}, '7.9.0');
