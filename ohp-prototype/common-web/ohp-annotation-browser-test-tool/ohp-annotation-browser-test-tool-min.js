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
YUI.add("ohp-annotation-browser-test-tool",function(e,t){"use strict";var n=e.OHP.Annotation.FreehandModel,r;r=e.Base.create("ohp-annotation-browser-test-tool",e.OHP.Annotation.Tool,[],{initializer:function(){this.set("name","test"),this.set("type","drawing")},start:function(){var e=this.get("annotationModel").get("drawingModelList"),t;t=new n,t.addPoint({x:150,y:150}),t.end({x:150,y:150}),e.add(t),t=new n,t.addPoint({x:20,y:20}),t.addPoint({x:260,y:256}),t.addPoint({x:333,y:98}),t.end({x:400,y:249}),e.add(t),t=new n,t.addPoint({x:200,y:20}),t.addPoint({x:250,y:20}),t.addPoint({x:250,y:70}),t.addPoint({x:200,y:70}),t.end({x:200,y:20}),e.add(t),t=new n,t.addPoint({x:450,y:50}),t.addPoint({x:550,y:50}),t.addPoint({x:550,y:250}),t.addPoint({x:450,y:250}),t.end({x:450,y:50}),e.add(t),t=new n,t.addPoint({x:50,y:550}),t.addPoint({x:550,y:550}),t.addPoint({x:550,y:350}),t.end({x:50,y:550}),e.add(t)}}),e.namespace("OHP.Annotation").BrowserTestTool=r},"7.9.0",{requires:["ohp-annotation-tool","base","ohp-annotation-freehand-model"]});
