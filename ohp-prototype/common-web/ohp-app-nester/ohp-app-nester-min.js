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
YUI.add("ohp-app-nester",function(e,t){"use strict";function n(){}n.prototype={_nestApp:function(t,n,r){var i,s;return i={root:n,linkSelector:null},r&&(i=e.merge(r,i)),i.container||(i.container=this.get("viewContainer")),this.get("html5")||(i.pjaxRootPath=i.root,i.root=this.removeRoot(i.root)),s=new t(i),s.addTarget(this),s.render(),typeof s.dispatch=="function"&&s.dispatch(),s},_uprootApp:function(e){e.removeTarget(this),e.destroy()}},e.namespace("OHP").AppNester=n},"7.9.0",{requires:[]});
