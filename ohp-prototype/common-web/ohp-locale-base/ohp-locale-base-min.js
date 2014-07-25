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
YUI.add("ohp-locale-base",function(e,t){"use strict";var n=e.Lang,r;r=function(){var t={};return{put:function(e,n){t[e]=n},putAll:function(n){t=e.merge(t,n)},get:function(r){var i=t[r],s=e.config.win.ORCHESTRAL_LOCALISATIONS;return n.isUndefined(i)&&!n.isUndefined(s)&&(i=s[r]),n.isUndefined(i)?"???"+r+"???":arguments.length===1?i:e.substitute(i,e.Array(arguments,1,!0))}}}(),e.namespace("OHP").Locale=r},"7.9.0",{requires:["yui-base","substitute"]});
