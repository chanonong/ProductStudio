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
YUI.add('ohp-tick', function (Y, NAME) {

/**
Provides an event fired every second so only one timer is required
@module ohp-tick
@title Tick
**/

var _counter = 0,
	publisher = new Y.EventTarget();

publisher.name = 'ohp-tick';

publisher.publish('ohp:tick', {
	broadcast:  2,   // global notification
	emitFacade: true // emit a facade so we get the event target
});
publisher.publish('ohp:tick-5', {
	broadcast:  2,   // global notification
	emitFacade: true // emit a facade so we get the event target
});
	publisher.publish('ohp:tick-10', {
	broadcast:  2,   // global notification
	emitFacade: true // emit a facade so we get the event target
});
	publisher.publish('ohp:tick-30', {
	broadcast:  2,   // global notification
	emitFacade: true // emit a facade so we get the event target
});
	publisher.publish('ohp:tick-60', {
	broadcast:  2,   // global notification
	emitFacade: true // emit a facade so we get the event target
});
Y.later(1000 , this , function(){
	Y.log('going to fire tick');
		publisher.fire('ohp:tick');
		if((_counter % 5)===0){
			publisher.fire('ohp:tick-5');
		}
		if((_counter % 10)===0){
			publisher.fire('ohp:tick-10');
		}
		if((_counter % 30)===0){
			publisher.fire('ohp:tick-30');
		}
		if((_counter % 60)===0){
			publisher.fire('ohp:tick-60');
		}
		_counter += 1;
}, {}, true);


}, '7.9.0', {"requires": ["base", "event-custom"]});
