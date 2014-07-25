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
YUI.add("ohp-annotation-tool-model-list",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-tool-model-list",e.ModelList,[],{model:e.OHP.Annotation.ToolModel,setActiveToolName:function(e){var t=this.filter(function(t){return e===t.get("tool").get("name")})[0];return this.set("activeToolModel",t),t},getActiveToolName:function(){return this.get("activeToolModel").get("tool").get("name")}},{ATTRS:{activeToolModel:{getter:function(){return this.filter(function(e){return e.get("active")})[0]},setter:function(e){var t=this.get("activeToolModel");e!==t&&(t&&t.set("active",!1),e.set("active",!0))}}}});e.namespace("OHP.Annotation").ToolModelList=n},"7.9.0",{requires:["model-list","ohp-annotation-tool-model","base"]});
