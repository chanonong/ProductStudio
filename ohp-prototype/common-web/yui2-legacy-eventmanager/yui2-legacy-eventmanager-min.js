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
YUI.add("yui2-legacy-eventmanager",function(Y,NAME){
/*!
 * EventManager.js
 * by Keith Gaughan
 *
 * This allows event handlers to be registered unobtrusively, and cleans
 * them up on unload to prevent memory leaks.
 *
 * Copyright (c) Keith Gaughan, 2005.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Common Public License v1.0
 * (CPL) which accompanies this distribution, and is available at
 * http://www.opensource.org/licenses/cpl.php
 *
 * This software is covered by a modified version of the Common Public License
 * (CPL), where Keith Gaughan is the Agreement Steward, and the licensing
 * agreement is covered by the laws of the Republic of Ireland.
 *
 * This software has been modified and extended by Orchestral Developments
 * Limited.
 */
var YAHOO=Y.YUI2,ORCHESTRAL=YAHOO.ORCHESTRAL;window.EventManager={eventHandlers:null,init:function(){this.eventHandlers==null&&(this.eventHandlers=[],EventManager.addEventHandler(window,"unload",this.cleanup))},addEventHandler:function(e,t,n){return this.init(),e.addEventListener?(this.eventHandlers.push({obj:e,type:t,fn:n}),e.addEventListener(t,n,!1),!0):e.attachEvent&&e.attachEvent("on"+t,n)?(this.eventHandlers[this.eventHandlers.length]={obj:e,type:t,fn:n},!0):!1},cleanup:function(){for(var i=0;i<EventManager.eventHandlers.length;i++)with(EventManager.eventHandlers[i])obj.removeEventListener?obj.removeEventListener(type,fn,!1):obj.detachEvent&&obj.detachEvent("on"+type,fn);EventManager.eventHandlers=null},getEventTarget:function(e){return e=e||window.event,e.target||e.srcElement},isEnterKeyPress:function(e){return e=e||window.event,e.keyCode==13},isEscapeKeyPress:function(e){return e=e||window.event,e.keyCode==27},cancelBubble:function(e){e=e||window.event,e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()},cancelDefaultAction:function(e){e=e||window.event,e.returnValue=!1,e.preventDefault&&e.preventDefault()}}},"7.9.0");
