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
YUI.add("ohp-annotation-drawing-model-list",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-drawing-list",e.ModelList,[],{model:e.OHP.Annotation.DrawingModel,clearSelection:function(){this.each(function(e){e.set("highlighted",!1),e.set("selected",!1)})}},{ATTRS:{highlightedCount:{readOnly:!0,getter:function(){return this.filter(function(e){return e.get("highlighted")}).length}}}});e.namespace("OHP.Annotation").DrawingModelList=n},"7.9.0",{requires:["model-list","ohp-annotation-drawing-model","base"]});
