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
YUI.add("ohp-thumbgrip",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="Thumbgrip",n.ATTRS={srcNode:{value:".yui3-dd-draggable"},selector:{value:".yui3-dd-draggable"}},e.extend(n,e.Widget,{initializer:function(){},destructor:function(){},renderUI:function(){e.all(this.get("selector")).each(function(t){var n=t.get("innerHTML"),r=e.Node.create('<span style="float:left;"></span>');r.set("innerHTML",n),t.set("innerHTML",""),t.appendChild(r),t.append(e.Node.create('<span class="ohp-thumbgrip">&nbsp;</span>'))})},bindUI:function(){},syncUI:function(){}}),e.namespace("OHP").Thumbgrip=n},"7.9.0",{requires:["substitute","widget"]});
