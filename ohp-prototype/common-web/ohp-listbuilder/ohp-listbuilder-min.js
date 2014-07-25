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
YUI.add("ohp-listbuilder",function(e,t){function a(){a.superclass.constructor.apply(this,arguments)}var n=e.Lang,r=".selected-list",i=".options-list",s=".add-item",o=".remove-item",u=".selected-options-list";a.NAME="ohp-listbuilder",a.ATTRS={recordset:{value:null,setter:function(e){return n.type(e)==="Recordset"?e:e}},maxSelect:{value:-1,setter:function(e){return parseInt(e,10)},getter:function(e){return parseInt(e,10)}},optionTitle:{value:""},selectedTitle:{value:""},isRequired:{value:!1},selected:{value:null,getter:function(){var e=this.get("contentBox").one(u),t=[];return e.all("option").each(function(e){t.push({id:e.get("value"),name:e.getContent()})}),t}}},a.HTML_PARSER={recordset:function(t){if(t.one("select")){var n=t.one("select").getDOMNode(),r,i;if(n.tagName==="SELECT")return r=[],t.all("option").each(function(e){r.push({id:e.get("value"),name:e.getContent()})}),i=new e.Recordset({data:r}),i}}},a.LISTBUILDER_TEMPLATE='<div id="wrapper" class="ohp-listbuilder"><div class="ohp-listbuilder-content">	<span class="main-list">		<span class="label">{optionTitle}</span> <br />		<select class="options-list" multiple="multiple">		</select>	</span>	<span class="ohp-listbuilder-actions">		<span class="actions-container">			<a class="add-item" href="#"> </a>			<a class="remove-item" href="#"> </a>		</span>	</span>	<span class="selected-options">		<span class="label">{selectedTitle} {required}</span> <br />		<select class="selected-list" multiple="multiple">		</select>	</span>	<select class="selected-options-list" id="{id}-selected" name="{id}-selected">	</select></div>',e.extend(a,e.Widget,{_mynode:null,initializer:function(){},destructor:function(){},renderUI:function(){this._hasSelect()&&this._removeSelect();var t=e.substitute(a.LISTBUILDER_TEMPLATE,{optionTitle:this.get("optionTitle"),selectedTitle:this.get("selectedTitle"),required:this.get("isRequired")?"<em>*</em>":"",id:this.get("srcNode").get("id")});this._mynode=e.Node.create(t),this.get("recordset").each(function(t){this._mynode.one(i).insert(e.Node.create('<option value="'+t.get("data").id+'">'+t.get("data").name+"</option>"))},this),this.get("contentBox").insert(this._mynode)},bindUI:function(){var e=this.get("contentBox");e.one(s).on("click",this._addSelectedOptions,this),e.one(o).on("click",this._removeSelectedOptions,this),e.one(i).on("dblclick",this._addSelectedOptions,this),e.one(r).on("dblclick",this._removeSelectedOptions,this)},syncUI:function(){},addAll:function(){var e=this.get("contentBox");e.one(i).all("option").each(function(t){this._isSelectionAvailable(e)&&(e.one(r).insert(t),t.set("selected",!1),e.one(u).insert(t.cloneNode(!0)))},this)},removeAll:function(){var e=this.get("contentBox");e.one(r).all("option").each(function(t){e.one(i).insert(t),t.set("selected",!1),e.all(u+" option").each(function(e){e.remove(!0)})})},_addSelectedOptions:function(e){var t=this.get("contentBox");t.one(i).all("option").each(function(e){e.get("selected")&&this._isSelectionAvailable(t)&&(t.one(r).insert(e),e.set("selected",!1),t.one(u).insert(e.cloneNode(!0)))},this),e.preventDefault()},_removeSelectedOptions:function(e){var t=this.get("contentBox");t.one(r).all("option").each(function(e){e.get("selected")&&(t.one(i).insert(e),e.set("selected",!1),t.one(u).one('option[value="'+e.get("value")+'"]').remove(!0))}),e.preventDefault()},_isSelectionAvailable:function(){var e=parseInt(this.get("maxSelect"),10),t;return e===-1?!0:(t=this.get("contentBox"),t.one(r).all("option").size()<e)},_hasSelect:function(){var e=this.get("contentBox").one("select");return e?!0:!1},_removeSelect:function(){this.get("contentBox").one("select").remove()}}),e.namespace("OHP").ListBuilder=a},"7.9.0",{requires:["node","dom","selector-css3","event","recordset","substitute","widget"],skinnable:!0});
