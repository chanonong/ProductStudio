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
YUI.add("ohp-annotation-footnote-tool",function(e,t){"use strict";var n=e.OHP.Annotation.FootnoteModel,r;r=e.Base.create("ohp-annotation-footnote-tool",e.OHP.Annotation.Tool,[],{initializer:function(){this.set("name","footnote"),this.set("type","drawing")},start:function(e,t){this.get("annotationModel").get("drawingModelList").add(new n({point:t}))}}),e.namespace("OHP.Annotation").FootnoteTool=r},"7.9.0",{requires:["ohp-annotation-tool","ohp-annotation-footnote-model","base"]});
