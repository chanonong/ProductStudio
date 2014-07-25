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
YUI.add('ohp-annotation-class-name-manager', function (Y, NAME) {

"use strict";
/**
Class name manager based on Y.ClassNameManager that creates class names suitable for OHP Web (e.g. ohp-<classname>).
@module ohp-ohp-class-name-manager
**/

/**
Creates class names suitable for OHP Web Annotation Widget (e.g. ohp-annotation-<classname>).

@class AnnotationClassNameManager
@namespace OHP
**/
Y.namespace('OHP').AnnotationClassNameManager = Y.OHP.ClassNameManager.create('ohp', 'annotation');


}, '7.9.0', {"requires": ["ohp-class-name-manager"]});
