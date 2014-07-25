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
YUI.add("ohp-annotation-model",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-model",e.Model,[],{initializer:function(){var t=this.get("toolModelList");t.add(new e.OHP.Annotation.ToolModel({tool:new e.OHP.Annotation.FreehandTool({annotationModel:this})})),t.add(new e.OHP.Annotation.ToolModel({tool:new e.OHP.Annotation.FootnoteTool({annotationModel:this})})),t.add(new e.OHP.Annotation.ToolModel({tool:new e.OHP.Annotation.SelectTool({annotationModel:this})})),t.add(new e.OHP.Annotation.ToolModel({tool:new e.OHP.Annotation.BrowserTestTool({annotationModel:this})}))}},{ATTRS:{toolModelList:{readOnly:!0,value:new e.OHP.Annotation.ToolModelList},drawingModelList:{readOnly:!0,value:new e.OHP.Annotation.DrawingModelList}}});e.namespace("OHP.Annotation").AnnotationModel=n},"7.9.0",{requires:["ohp-annotation-select-tool","ohp-annotation-browser-test-tool","ohp-annotation-drawing-model-list","model","ohp-annotation-tool-model","ohp-annotation-freehand-tool","base","ohp-annotation-footnote-tool","ohp-annotation-tool-model-list"]});
