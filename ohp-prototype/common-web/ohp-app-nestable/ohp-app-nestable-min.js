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
YUI.add("ohp-app-nestable",function(e,t){"use strict";function n(){}n.ATTRS={pjaxRootPath:{valueFn:"_initAttrPjaxRootPath"}},n.prototype={_initAttrPjaxRootPath:function(){return this.get("root")},getFullPathForPjax:function(e){var t=this.get("pjaxRootPath"),n=e?t+"/"+e:t;return this._normalizePath(n)}},e.namespace("OHP").AppNestable=n},"7.9.0",{requires:[]});
