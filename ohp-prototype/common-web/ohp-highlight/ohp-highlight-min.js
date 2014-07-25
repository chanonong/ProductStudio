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
YUI.add("ohp-highlight",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="ohp-highlight",n.NS="highlight",n.ATTRS={color:{value:"#FFFDC7"},duration:{value:1.5},removeContent:{value:!1}},e.extend(n,e.Plugin.Base,{initializer:function(){},destructor:function(){},_getBG:function(e){var t=e.getStyle("backgroundColor");return t==="transparent"&&(t=e.get("parentNode").getStyle("backgroundColor"),t==="transparent"&&(t="#FFFFFF")),t},run:function(){var t=this.get("host"),n=this._getBG(t),r,i,s,o;n==="transparent"&&(n="#FFFFFF"),r=this.get("color"),i=new e.Anim({node:t,from:{backgroundColor:"#FFFFFF"},to:{backgroundColor:r},duration:.5}),i.run(),o=this.get("removeContent"),s=function(){o===!0&&t.hide("fadeOut",null,function(){t.set("innerHTML","&nbsp;"),t.show(!0)})},e.later(1500,this,function(){i.set("reverse",!0),i.run(),e.later(2500,this,function(){s()},null,!1)},null,!1)}}),e.namespace("OHP").Highlight=n},"7.9.0",{requires:["anim","node","transition","plugin"]});
