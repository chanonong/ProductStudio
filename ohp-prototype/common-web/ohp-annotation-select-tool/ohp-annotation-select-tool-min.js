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
YUI.add("ohp-annotation-select-tool",function(e,t){"use strict";var n=e.OHP.Annotation.Geometry,r;r=e.Base.create("ohp-annotation-select-tool",e.OHP.Annotation.Tool,[],{initializer:function(){this.set("name","select"),this.set("type","select")},start:function(){var e=this.get("annotationModel").get("drawingModelList"),t=!1;e.each(function(e){e.get("highlighted")&&(e.toggleSelected(),t=!0)}),t||e.clearSelection()},move:function(e){if(!this._prevPoint||n.getDistanceBetweenPoints(e,this._prevPoint)>10)this._prevPoint=e,this.get("annotationModel").get("drawingModelList").each(function(t){var n=t.hit(e);t.get("highlighted")!==n&&t.set("highlighted",n)})}}),e.namespace("OHP.Annotation").SelectTool=r},"7.9.0",{requires:["ohp-annotation-geometry","ohp-annotation-tool","base"]});
