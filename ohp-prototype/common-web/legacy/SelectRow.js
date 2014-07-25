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
window.SelectRow={initialised:!1,init:function(){if(SelectRow.initialised)return;SelectRow.initialised=!0;var e=document.getElementsByTagName("TR");for(var t=0;t<e.length;t++)e[t].className!="Grouping"&&typeof e[t].onselect!="undefined"&&(e[t].originalStyle=e[t].className,EventManager.addEventHandler(e[t],"blur",SelectRow.blur),EventManager.addEventHandler(e[t],"mouseout",SelectRow.blur),EventManager.addEventHandler(e[t],"focus",SelectRow.focus),EventManager.addEventHandler(e[t],"mouseover",SelectRow.focus),EventManager.addEventHandler(e[t],"click",SelectRow.click),EventManager.addEventHandler(e[t],"keypress",SelectRow.keypress))},getRow:function(e){var t=EventManager.getEventTarget(e);while(t.tagName!="TR")t=t.parentNode;return t},blur:function(e){with(SelectRow.getRow(e))typeof normalClassName=="undefined"?className=originalStyle:className=normalClassName},click:function(e){var row=SelectRow.getRow(e);SelectRow.getRow(e).attributes.onselect?eval(row.attributes.onselect.nodeValue):eval(row.onselect)},focus:function(e){with(SelectRow.getRow(e))typeof normalClassName=="undefined"?className="Hover "+originalStyle:className="Hover "+normalClassName},keypress:function(e){EventManager.isEnterKeyPress(e)&&SelectRow.click(e)}},EventManager.addEventHandler(window,"load",SelectRow.init);
