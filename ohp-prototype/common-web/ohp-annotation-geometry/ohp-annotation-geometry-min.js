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
YUI.add("ohp-annotation-geometry",function(e,t){"use strict";var n={getDistanceBetweenPoints:function(e,t){var n=t.x-e.x,r=t.y-e.y;return Math.sqrt(n*n+r*r)},distanceFromLine:function(e,t,r){var i=n.getDistanceBetweenPoints(e,r),s,o,u,a,f,l;return e.x===t.x&&e.y===t.y?i:(s=n.getDistanceBetweenPoints(t,r),o=n.getDistanceBetweenPoints(e,t),u=i*i,a=s*s,f=o*o,a>=u+f?i:u>a+f?s:(l=(i+s+o)/2,2/o*Math.sqrt(l*(l-i)*(l-s)*(l-o))))}};e.namespace("OHP.Annotation").Geometry=n},"7.9.0");
