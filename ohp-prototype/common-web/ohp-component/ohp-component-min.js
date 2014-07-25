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
YUI.add("ohp-component",function(e,t){"use strict";function i(){this.publish(r,{broadcast:1,fireOnce:!0,async:!0,preventable:!1})}function s(t,r,i){!r.hasOwnProperty(t)&&i.hasOwnProperty(t)&&(r[t]=n.isArray(i[t])?[]:{}),e.aggregate(r,i,!0,[t])}function o(e,t,n){var r=t.superclass&&t.superclass.constructor;!t.hasOwnProperty(e)&&r&&r.hasOwnProperty(e)&&s(e,t,r),s(e,t,n)}var n=e.Lang,r="componentInitialRenderComplete";i.prototype.fireRenderCompleteEvents=function(){this.fire(r)},i.OHP_COMPONENT_FEATURES={},i._buildCfg={custom:{OHP_COMPONENT_FEATURES:o}},e.namespace("OHP").Component=i},"7.9.0",{requires:["oop","yui-base"]});
