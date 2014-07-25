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
YUI.add("ohp-annotation",function(e,t){"use strict";var n=e.OHP.AnnotationClassNameManager.getClassName,r;r=e.Base.create("ohp-annotation",e.Widget,[],{BOUNDING_TEMPLATE:"<div />",CONTENT_TEMPLATE:null,initializer:function(){this.annotationView=new e.OHP.Annotation.AnnotationView({container:this.get("contentBox"),width:this.get("width"),height:this.get("height")})},renderUI:function(){this.annotationView.render()}},{CSS_PREFIX:n(),ATTRS:{width:{value:500,writeOnce:"initOnly"},height:{value:500,writeOnce:"initOnly"}}}),e.namespace("OHP").Annotation=e.mix(r,e.namespace("OHP").Annotation)},"7.9.0",{requires:["ohp-annotation-view","ohp-annotation-class-name-manager","base","widget"],skinnable:!0});
