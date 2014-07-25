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
YUI.add("ohp-annotation-drawing-model",function(e,t){"use strict";var n=e.Base.create("ohp-annotation-drawing-model",e.Model,[],{addShapes:function(){},hit:function(){},toggleSelected:function(){this.set("selected",!this.get("selected"))}},{ATTRS:{bounds:{},selected:{value:!1},highlighted:{value:!1}}});e.namespace("OHP.Annotation").DrawingModel=n},"7.9.0",{requires:["model","base","ohp-annotation-layer"]});
