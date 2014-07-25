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
YAHOO.namespace("ORCHESTRAL.widget"),function(){var e=YAHOO.util.Dom,t=YAHOO.util.Event;ORCHESTRAL.widget.Accordion=function(n){e.addClass(n,"OrchestralAccordion"),t.on(n,"click",function(r){var i=t.getTarget(r);if(!e.hasClass(i,"AccordionLink"))return;var s=i.parentNode,o=e.hasClass(s,"selected");e.removeClass(n.childNodes,"selected"),o||e.addClass(s,"selected"),t.preventDefault(r)})},t.onDOMReady(function(){e.getElementsByClassName("OrchestralAccordion","ul",null,function(e){new ORCHESTRAL.widget.Accordion(e)})})}(),YAHOO.register("orchestral-accordion",ORCHESTRAL.widget.Accordion,{version:"7.9",build:"0"});
