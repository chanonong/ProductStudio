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
YUI.add('ohp-ohp-class-name-manager', function (Y, NAME) {

"use strict";
/**
Class name manager based on Y.ClassNameManager that creates class names suitable for OHP Web (e.g. ohp-<classname>).
@module ohp-ohp-class-name-manager
**/

/**
Class name manager based on Y.ClassNameManager that creates class names suitable for OHP Web (e.g. ohp-<classname>).

@class OhpClassNameManager
@namespace OHP
**/
Y.namespace('OHP').OhpClassNameManager = Y.OHP.ClassNameManager.create('ohp');


}, '7.9.0', {"requires": ["ohp-class-name-manager"]});
