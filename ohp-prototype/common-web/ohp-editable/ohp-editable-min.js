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
YUI.add("ohp-editable",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="ohp-editable",n.NS="editable",e.extend(n,e.Plugin.Base,{initializer:function(){this.afterHostEvent("render",this._setupPopoverLocking),this.afterHostMethod("set",function(e,t){e==="content"&&t&&this._setupPopoverLocking()})},_setupPopoverLocking:function(){var e=this.get("host");e.get("contentBox").all("input,textarea").each(function(t){t.addClass("evented"),t.on("keypress",function(){e.lock()})}),e.get("contentBox").all("input,textarea,select").on("change",function(){e.lock()})}}),e.namespace("Plugin.OHP").Editable=n},"7.9.0",{requires:["plugin"]});
