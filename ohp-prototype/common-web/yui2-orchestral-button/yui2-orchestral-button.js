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
YUI.add('yui2-orchestral-button', function (Y, NAME) {

var YAHOO = Y.YUI2,
	ORCHESTRAL = YAHOO.ORCHESTRAL;
/*!(C) ORCHESTRAL*/

/**
 * Rollup module that adds ARIA support to the core button widget.
 *
 * @module orchestral-button
 * @requires yahoo, orchestral-button-core, orchestral-button-aria
 */
YAHOO.register('orchestral-button', ORCHESTRAL.widget.Button, {version: '7.9', build: '0'});

}, '7.9.0', {"requires": ["yui2-yahoo", "yui2-orchestral-button-core", "yui2-orchestral-button-aria"]});
