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
YUI.add("ohp-mandatory-item-plugin",function(e,t){"use strict";function r(){r.superclass.constructor.apply(this,arguments)}var n=e.OHP.Locale;r.NAME="mandatoryListItemPlugin",r.NS="mandatoryItem",e.extend(r,e.Plugin.Base,{initializer:function(){this._missingRequiredErrorNode=e.Node.create('<div class="error"></div>'),this.afterHostMethod("render",this._checkMandatory),this.afterHostEvent("addChild",this._checkMandatory),this.afterHostEvent("removeChild",this._checkMandatory),this.afterHostEvent("itemIncluded",this._checkMandatory),this.afterHostEvent("itemExcluded",this._checkMandatory),this._checkMandatory()},_checkMandatory:function(){var e=this.get("host"),t=e.get("boundingBox"),r=t.ancestor(".field"),i=e.size(),s=e.getClassName("item-excluded"),o,u;if(!t.inDoc())return;e.each(function(e){e.get("srcNode").hasClass(s)&&(i-=1)}),i===0?(t.addClass(e.getClassName("error")),o=n.get("widget.repeatingList.error.atLeastOneItem")+" "+n.get("widget.repeatingList.error.isRequired"),this._missingRequiredErrorNode.set("text",o),r?r.appendChild(this._missingRequiredErrorNode):(u=e.get("contentBox"),u.appendChild(this._missingRequiredErrorNode))):(t.removeClass(e.getClassName("error")),this._missingRequiredErrorNode.remove())}}),e.namespace("OHP").MandatoryListItemPlugin=r,e.namespace("OHP").MandatoryItemPlugin=r},"7.9.0",{requires:["ohp-locale-translations","ohp-locale-base","arraylist","substitute","plugin","node-base"]});
