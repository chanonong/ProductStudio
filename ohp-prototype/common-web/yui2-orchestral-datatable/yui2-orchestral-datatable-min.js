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
YUI.add("yui2-orchestral-datatable",function(e,t){
/*!(C) ORCHESTRAL*/
var n=e.YUI2,r=n.ORCHESTRAL;n.namespace("ORCHESTRAL.widget"),function(){var e=n.lang,t=n.util.Dom,i=n.util.Event,s=r.util.Locale,o=n.widget.Paginator,u="selected",a;a=function(){function r(e){var r=e.one(e.config.doc.body),i;n=new e.OHP.Popover({trigger:{delegate:{el:r,filter:".ohp-comment"},handler:function(e){this.set("bodyContent",e.one(".value").getContent())}},zIndex:4}),n.plug(e.OHP.Constraint,{maxWidth:"300px",maxHeight:"200px"}),n.set("bodyContent",""),n.render(),Modernizr.touch&&r.delegate("touchend",function(e){var t=e.currentTarget,r=t.one(".ohp-comment");r&&(n.setAttrs({bodyContent:r.one(".value").getContent()}),n.delayedShow({triggerNode:r}))},"td.ohp-dt-col-type-comments",self);while(i=t.pop())i(n)}var e=!1,t=[],n;return function(i){n?i(n):(t.push(i),e||(YUI().use("node-base","event-delegate","ohp-popover","ohp-constraint",r),e=!0))}}();var f=function(e){return new n.util.XHRDataSource(e,{connMethodPost:!0,connTimeout:45e3,connXhrMode:"ignoreStaleResponses",responseType:n.util.DataSource.TYPE_JSON,responseSchema:{resultsList:"data",metaFields:{totalRecords:"totalRecords"}}})},l=function(o,a,f,c){if(!t.get(o)){n.log("No element passed to DataTable constructor","warn");return}c=e.merge({MSG_EMPTY:s.get("widget.datatable.empty.message"),MSG_SORTASC:s.get("widget.datatable.sort.ascending"),MSG_SORTDESC:s.get("widget.datatable.sort.descending"),naturalwidth:t.hasClass(o,"natural-content-width")},c||{}),a=n.widget.DataTable._cloneObject(a),t[c.naturalwidth?"addClass":"removeClass"](o,"natural-content-width"),c.multiRowSelection&&(a=[{key:u,label:'<input type="checkbox">',formatter:function(e,t,n,r){e.innerHTML='<input type="checkbox"'+(this.isSelected(t)?" checked":"")+"/>"}}].concat(a),t.addClass(o,"dt-row-selection-enabled"));if(c.dynamicData)this.handleDataReturnPayload=function(e,t,n){try{n.totalRecords=t.meta.totalRecords}catch(r){}return n};else{var p=c.sortedBy||null;this.handleDataReturnPayload=function(e,t,n){var r=this.get("sortedBy")||p;return r&&this.sortColumn(this.getColumn(r.key),r.dir),n}}c.paginatorConfig&&(c.paginator=new h(c.paginatorConfig.initialRecordCount,c.paginatorConfig.recordsPerPage));var d=document.createElement("div");o=t.get(o),o.parentNode.insertBefore(d,o),d.appendChild(o),l.superclass.constructor.call(this,o,a,f,c),!c.dynamicData&&c.stickyState&&this.subscribe("columnSortEvent",this._saveSort),this.subscribe("theadCellMouseoverEvent",this._onEventHighlightTheadCell),this.subscribe("theadCellMouseoutEvent",this._onEventUnhighlightTheadCell),r.env.ua.ie===8&&this.subscribe("postRenderEvent",function(){t.removeClass(this.getContainerEl(),"yui-dt"),t.addClass(this.getContainerEl(),"yui-dt")},null,this),this.subscribe("cellClickEvent",function(e){var n=e.target,r=i.getTarget(e.event);if(t.hasClass(r,"show-more"))return t.setStyle(n,"width",n.offsetWidth+"px"),t.addClass(n,"showing-more"),this.fireEvent("postRenderEvent"),i.preventDefault(e.event),!1;if(t.hasClass(r,"show-less"))return t.removeClass(n,"showing-more"),t.setStyle(n,"width",null),this.fireEvent("postRenderEvent"),i.preventDefault(e.event),!1}),c.footerEditor&&this.subscribe("postRenderEvent",function(e){this._initFooterEditor(c.editorAdd)},null,this);if(c.multiRowSelection){this.subscribe("theadCellClickEvent",function(e){return!this._handleRowSelection(e,function(e){var t=this.getRecordSet().getLength(),n;for(n=0;n<t;n++)this.getTrEl(this.getRecord(n))&&(this[(e?"":"un")+"selectRow"](n),this.updateCell(this.getRecord(n),0))})}),this.subscribe("cellClickEvent",function(e){return!this._handleRowSelection(e,function(t){this[(t?"":"un")+"selectRow"](e.target)})}),this.subscribe("unselectAllRowsEvent",function(e){var n;for(n=0;n<e.records.length;++n)this.updateCell(e.records[n],0);t.getElementsByClassName("yui-dt-col-selected","th",this.getTheadEl(),function(e){e.getElementsByTagName("input")[0].checked=!1})}),this.subscribe("renderEvent",function(){var e=this.getRecordSet().getLength(),n=0,r;for(r=0;r<e;r++)this.getTrEl(this.getRecord(r))&&n++;t.getElementsByClassName("yui-dt-col-selected","th",this.getTheadEl(),function(e){t[n?"removeClass":"addClass"](e.getElementsByTagName("input")[0],"dt-select-all-hidden")})});if(e.isObject(c.multiRowSelection)&&c.multiRowSelection.toolbar){var v=this.get("paginator"),m=c.multiRowSelection.toolbar,g=this;v&&!v.get("rendered")?v.subscribe("render",function(){g._initToolbar.call(g,m)}):this._initToolbar(m)}}this.subscribe("rowMouseoverEvent",this.onEventHighlightRow),this.subscribe("rowMouseoutEvent",this.onEventUnhighlightRow),this.subscribe("rowAddEvent",this._onRowAddOrUpdate),this.subscribe("rowUpdateEvent",this._onRowAddOrUpdate)};e.extend(l,n.widget.DataTable,{_autoRefresh:null,_addItemEl:null,_autoRefreshEl:null,_filterFormEl:null,_filterParams:{},_filterToggleEl:null,_lastSortedBy:null,_numberSelectedEl:null,_quickSearchEl:null,_toolbarButtons:[],_toolbarEl:null,_destroyContainerEl:function(e){t.removeClass(e,"filter-open"),l.superclass._destroyContainerEl.call(this,e)},_initContainerEl:function(e){var o=t.getFirstChildBy(e,function(e){return t.hasClass(e,"dt-filter")});this._filterFormEl=o,o&&e.removeChild(o),l.superclass._initContainerEl.call(this,e);if(o){var u=this,a=t.getElementsBy(function(e){return t.hasClass(e,"yui-primary-button")},"span",o)[0],f=t.getElementsByClassName("yui-buttongroup",null,o);a||(a=t.getElementsBy(function(e){return e.type==="submit"},"input",o)[0],a||(a=t.getElementsBy(function(e){return e.type==="submit"},"button",o)[0]));if(a){new r.widget.PrimaryButton(a);var c=function(e){u.performFilter(),i.preventDefault(e)};i.on(o,"submit",c,null,this),t.getElementsBy(function(e){return t.hasClass(e,"reset-filter")},"a",o,function(e){i.on(e,"click",function(e){u._filterFormEl.reset(),c(e)})})}else f.length>0&&t.batch(f,function(e){(new n.widget.ButtonGroup(e)).on("valueChange",this
.performFilter,null,this)},this,!0);t.addClass(e,"filter-open")}var h=document.createElement("div");h.className="dt-tools",this._addItemEl=document.createElement("a"),this._addItemEl.className="add",this._addItemEl.href="#",this._filterToggleEl=document.createElement("a"),this._filterToggleEl.className="filter-toggle",this._filterToggleEl.href="#",this._filterToggleEl.title=s.get("widget.datatable.search.button"),this._autoRefreshEl=document.createElement("span"),this._quickSearchEl=document.createElement("span"),this._initQuickSearch(),h.appendChild(this._addItemEl),h.appendChild(this._filterToggleEl),h.appendChild(this._autoRefreshEl),h.appendChild(this._quickSearchEl),t.addClass(h.childNodes,"dt-tool"),t.addClass(h.childNodes,"dt-tool-disabled"),e.appendChild(h),o&&(t.addClass(o,"filter"),e.appendChild(o),n.widget.Button.addHiddenFieldsToForm(o),r.util.Form.deserialize(o,this.get("filterState")),this._filterParams=r.util.Form.serialize(o)),this.set("initialRequest",this.get("generateRequest")(this.getState(),this)),i.on(this._addItemEl,"click",function(e){this.fireEvent("addItemEvent"),i.preventDefault(e)},null,this),i.on(this._filterToggleEl,"click",function(n){var r=!t.hasClass(e,"filter-open"),s;t[r?"addClass":"removeClass"](e,"filter-open"),r?o.getElementsByTagName("input")[0].focus():s.value!==""&&(s.value="",this.fireEvent("searchEvent",{query:""})),i.preventDefault(n)},null,this),this.get("addItem")&&(r.util.Dom.setText(this._addItemEl,this.get("addItem").label),t.addClass(this._addItemEl,"dt-tool-enabled")),this.get("searchHandler")&&t.addClass(this._quickSearchEl,"dt-tool-enabled"),this.get("autoRefreshInterval")&&this._initAutoRefresh()},_initTableEl:function(e){l.superclass._initTableEl.call(this,e),t.addClass(this._elTable,"data")},_initAutoRefresh:function(){if(!this.get("autoRefreshInterval"))return;this._autoRefresh=new r.widget.AutoRefresh(this._autoRefreshEl,this.get("element"),this.get("autoRefreshInterval"),this._requestData,this);var e=this.handleDataReturnPayload;t.addClass(this._autoRefreshEl,"dt-tool-enabled"),this.handleDataReturnPayload=function(t,n,r){return this._autoRefresh.updateMessage(),e.call(this,t,n,r)}},pauseAutoRefresh:function(){this._autoRefresh&&this._autoRefresh.pause()},unpauseAutoRefresh:function(){this._autoRefresh&&this._autoRefresh.unpause()},_initQuickSearch:function(){var e=this._quickSearchEl;t.addClass(e,"dt-quick-search");var i=document.createElement("input");i.type="text",t.addClass(i,"short"),e.appendChild(i),(new n.util.KeyListener(i,{keys:n.util.KeyListener.KEY.ENTER},{fn:function(){this.fireEvent("searchEvent",{query:i.value})},scope:this,correctScope:!0})).enable();var s=new r.widget.IconButton({label:"&nbsp",type:"quick-search",icon:"icon-search",container:e,onclick:{fn:function(){this.fireEvent("searchEvent",{query:i.value})},scope:this}})},_initToolbar:function(n){var i,s=n.buttons,o,u,a;this._toolbarEl=t.getElementsByClassName("dt-toolbar","div",this.getContainerEl())[0],this._toolbarEl?t.removeClass(this._toolbarEl,"dt-toolbar-loading"):(this._toolbarEl=document.createElement("div"),t.addClass(this._toolbarEl,"dt-toolbar"),t.insertAfter(this._toolbarEl,this.getTableEl()));if(s&&s.length>0){this._toolbarButtons=[],o=document.createElement("span"),t.addClass(o,"dt-toolbar-buttons");for(a=0;a<s.length;++a)i=s[a],u=new r.widget[i.isDefault?"PrimaryButton":"SecondaryButton"]({label:i.text,id:i.id}),u.appendTo(o),e.isFunction(i.handler)?u.set("onclick",{fn:i.handler,obj:this,scope:this}):e.isObject(i.handler)&&e.isFunction(i.handler.fn)&&u.set("onclick",{fn:i.handler.fn,obj:e.isUndefined(i.handler.obj)?this:i.handler.obj,scope:i.handler.scope||this}),this._toolbarButtons.push(u);this._toolbarEl.appendChild(o)}this._numberSelectedEl=document.createElement("span"),t.addClass(this._numberSelectedEl,"dt-num-selected"),this._toolbarEl.appendChild(this._numberSelectedEl),this.subscribe("rowSelectEvent",this._updateToolbarState,null,this),this.subscribe("rowUnselectEvent",this._updateToolbarState,null,this),this.subscribe("unselectAllRowsEvent",this._updateToolbarState,null,this),this._updateToolbarState(),this.setAttributeConfig("toolbarRendered",{value:!0}),this.fireEvent("toolbarRender",{toolbar:this._toolbarEl})},_updateToolbarState:function(){var n=this.getSelectedRecords().length,r,i;if(this._toolbarEl){if(this._numberSelectedEl){switch(n){case 0:r=this.get("MSG_NONE_SELECTED");break;case 1:r=this.get("MSG_ONE_SELECTED");break;default:r=e.substitute(this.get("MSG_NUM_SELECTED"),[n])}this._numberSelectedEl.innerHTML=r}for(i=0;i<this._toolbarButtons.length;++i)this._toolbarButtons[i].set("disabled",n===0);n>0?(t.addClass(this._toolbarEl,"dt-toolbar-enabled"),t.removeClass(this._toolbarEl,"dt-toolbar-disabled"),this.fireEvent("toolbarEnabled",{toolbar:this._toolbarEl})):(t.removeClass(this._toolbarEl,"dt-toolbar-enabled"),t.addClass(this._toolbarEl,"dt-toolbar-disabled"),this.fireEvent("toolbarDisabled",{toolbar:this._toolbarEl}))}},_defaultPaginatorContainers:function(e){var n=this._sId+"-paginator",r=t.get(n);return e&&!r&&(r=document.createElement("div"),r.id=n,this._elContainer.appendChild(r)),r},_handleRowSelection:function(e,n){if(!t.hasClass(e.target,"yui-dt-col-"+u))return!1;var r=i.getTarget(e.event);return r.tagName!=="INPUT"&&(r=e.target.getElementsByTagName("input")[0],r.checked=!r.checked),n.call(this,r.checked),!0},_initFooterEditor:function(e){var r=this.getColumnSet(),s=this._elTbody,o=t.getElementsByClassName("yui-dt-footer-editor",null,s),u,a,f,l,c,h,p,d,v,m;if(o.length>0||!r)return;u=s.getElementsByTagName("tr"),a=t.getElementsByClassName("yui-dt-last","tr",s),f=document.createElement("tr"),t.removeClass(a,"yui-dt-last"),t.addClass(f,"yui-dt-footer-editor"),t.addClass(f,"yui-dt-last"),t.addClass(f,u.length%2===0?"yui-dt-even":"yui-dt-odd");for(m=0;m<r.keys.length;m++)l=r.keys[m].editor,p=document.createElement("td"),l?(d=document.createElement("div"),c=l._elContainer,t.setStyle(c,"display",""),t.addClass(d,"yui-dt-liner"
),h=c.getElementsByTagName("input")[0],h.setAttribute("tabindex",0),i.removeListener(h,"keypress"),i.addListener(h,"keypress",function(e){e.keyCode===13&&n.util.Event.preventDefault(e)}),c.removeAttribute("tabindex"),d.appendChild(c),p.appendChild(d),t.addClass(p,m===0?"yui-dt-first":"yui-dt-edit")):r.keys[m].formatter[0]==="action"?(v=document.createElement("a"),d=document.createElement("div"),t.addClass(p,"yui-dt-last"),t.addClass(d,"yui-dt-liner"),t.addClass(v,"icon-add"),v.setAttribute("href","#"),d.appendChild(v),p.appendChild(d)):(p.innerHTML=" - ",m===0&&t.addClass(p,"yui-dt-first")),f.appendChild(p);i.addListener(f.getElementsByTagName("a"),"click",function(t){var n={},s=f.getElementsByTagName("input"),o;i.preventDefault(t);for(o=0;o<s.length;o++)n[r.keys[o].key]=s[o].value,s[o].value="";e(n)},f,this),this._elTbody.appendChild(f)},_requestData:function(e){var t=this.getState(),n=e?e.animate:!0;this.getDataSource().sendRequest(this.get("generateRequest")(t,this),{success:this._onDataReturnReplaceRows,failure:this._onDataReturnReplaceRows,argument:{state:t,animate:n},scope:this})},_onDataReturnReplaceRows:function(e,t,n){this.onDataReturnReplaceRows(e,t,n.state,n.animate)},onDataReturnReplaceRows:function(e,n,r,i){var s=this._elTbody.children.length,o=[],u,a;for(a=0;a<s;a++)o.push(this._elTbody.children[a]);s!==0&&(u=this._elTbody.children[0].children.length),l.superclass.onDataReturnReplaceRows.call(this,e,n,r);var f=this._elTbody.children.length,c=0,h=0,p=0,d=0,v,m,g,y,b=/\bid=("\S[^>\s]+"|\S[^>\s]+)/g,w=/\s/g,E=!0,S=!1,x=this.getState();x.selectedRows.length!==0&&(S=!0,this.unselectAllRows());if(!u&&f===0)return;for(c=0;c<s;c++){v=o[c];for(h=p;h<f;h++){m=this._elTbody.children[h];for(d=0;d<u;d++){if(t.hasClass(v.children[d],"yui-dt-col-selected")){d++;if(d>=u)break}g=v.children[d].innerHTML.replace(b,"").replace(w,""),y=m.children[d].innerHTML.replace(b,"").replace(w,"");if(g!==y){E=!1;break}}if(E){S&&t.hasClass(v,"yui-dt-selected")&&this.selectRow(this._elTbody.children[h]);if(i&&h>p)for(a=p;a<h;a++)this.fireEvent("rowAddEvent",{record:this.getRecord(this._elTbody.children[a])});p=h+1;break}E=!0}}S&&t.batch(this.getSelectedRows(),function(e){t.getElementsBy(function(e){return e.getAttribute("type")==="checkbox"},"input",e,function(e){e.setAttribute("checked","checked")})}),x=this.getState();if(i&&!(x.pagination&&x.pagination.rowsPerPage<x.pagination.totalRecords))for(a=p;a<f;a++)this.fireEvent("rowAddEvent",{record:this.getRecord(this._elTbody.children[a])})},sortColumn:function(e,t){if(e&&e instanceof n.widget.Column){var r=this.get("sortedBy")||{},i=r.key===e.key?!0:!1;i&&(t=t||this.getColumnSortDir(e)),this.set("sortedBy",null),l.superclass.sortColumn.call(this,e,t)}},onEventSortColumn:function(e){var r=this.getThEl(e.target);l.superclass.onEventSortColumn.call(this,e);if(r&&t.hasClass(r,n.widget.DataTable.CLASS_SORTABLE)){var i=function(){r.getElementsByTagName("a")[0].focus()};if(this.get("dynamicData")){var s=function(){i(),this.removeListener("postRenderEvent",s)};this.addListener("postRenderEvent",s)}else i()}},_saveSort:function(){var e=this.getState(),t=e.sortedBy;if(!this._lastSortedBy){this._lastSortedBy=t;return}if(this._lastSortedBy.key===t.key&&this._lastSortedBy.dir===t.dir)return;this.getDataSource().sendRequest(this._getQuery(this._getSortParams(e))),this._lastSortedBy=t},_getSortParams:function(e){return{dir:e.sortedBy&&e.sortedBy.dir===n.widget.DataTable.CLASS_DESC?"desc":"asc",sort:e.sortedBy?e.sortedBy.key:this.getColumnSet().keys[0].getKey()}},_getQuery:function(e){var t={},n;for(n in e)e.hasOwnProperty(n)&&(t[this.get("dataRequestPrefix")+"."+n]=e[n]);return r.util.Form.toQueryString(t)},_onEventHighlightTheadCell:function(e){var r=this.getThEl(e.target);r&&t.addClass(r,n.widget.DataTable.CLASS_HIGHLIGHTED)},_onEventUnhighlightTheadCell:function(e){var r=this.getThEl(e.target);r&&t.removeClass(r,n.widget.DataTable.CLASS_HIGHLIGHTED)},_onRowAddOrUpdate:function(e){var r=e.record,i=t.get(r._sId),s=t.getStyle(i,"backgroundColor"),o;o=new n.util.ColorAnim(i,{backgroundColor:{from:"#aad3eF",to:"white"===s?"#fff":s}}),o.onComplete.subscribe(function(){t.setStyle(i,"backgroundColor","")}),o.animate()},performFilter:function(){if(!this._filterFormEl)return;n.widget.Button.addHiddenFieldsToForm(this._filterFormEl),this._filterParams=r.util.Form.serialize(this._filterFormEl),this._requestData({animate:!1})},deleteRow:function(e){var r=n.lang.isNumber(e)?this.getRecordSet().getRecord(e):t.get(e);r&&this.unselectRow(r),l.superclass.deleteRow.call(this,e)},formatCell:function(e,t,r){t=t||this.getRecord(e),r=r||this.getColumn(e.parentNode.cellIndex);if(t&&r){var i=r.field,s=!0,o=!0,u;if(r.formatter){var a,f;r.formatter=n.lang.isArray(r.formatter)?r.formatter:[r.formatter];for(f=0;f<r.formatter.length;++f){a=r.formatter[f],u=n.lang.isFunction(a)?a:n.widget.DataTable.Formatter[a]||n.widget.DataTable.Formatter.defaultFormatter;if(u){var l=u.call(this,e,t,r,t.getData(i)),c=!1;l?(o=l.preventDefault?!1:o,s=l.preventEmptyCellFormatting?!1:s,c=l.stopFormatting?!0:c):c=!0;if(c){o=!1,s=!1;break}}else e.innerHTML=t.getData(i)}}o&&(u=n.widget.DataTable.Formatter.defaultFormatter,u.call(this,e,t,r,t.getData(i))),s&&(u=n.widget.DataTable.Formatter.emptyCellFormatter,u.call(this,e,t,r,t.getData(i))),this.fireEvent("cellFormatEvent",{record:t,column:r,key:r.key,el:e})}},formatTheadCell:function(e,r,i){var o=t.getAncestorByClassName(e,"icon")!==null,u=r.label,a=this.getThEl(r);o&&(r.label=""),a.setAttribute("aria-busy","true"),l.superclass.formatTheadCell.call(this,e,r,i),t.getElementsByClassName(n.widget.DataTable.CLASS_SORTABLE,"a",e,function(e){var a=(r.sortOptions||{}).defaultDir,f;t.addClass(e,"default-sort-"+(a===n.widget.DataTable.CLASS_DESC||a==="desc"?"desc":"asc")),o&&(e.title=u+" - "+e.title),f="",i&&i.key===r.key&&(f=(i.dir===n.widget.DataTable.CLASS_DESC||i.dir==="desc"?s.get("cow.datatable.tooltip.screenReader.sortedDescending"):s.get("cow.datatable.tooltip.screenReader.sortedAscending"
))+". "),e.innerHTML+='<span class="ohp-dt-header-icon"></span>',e.innerHTML+='<span class="ohp-dt-sort-icon"></span>',e.innerHTML+='<span class="ohp-screen-reader-only">. '+f+e.title+".</span>"}),o&&e.childNodes.length===0&&(e.title=u),r.sortable||(e.innerHTML+='<span class="ohp-dt-header-icon"></span>'),r.label=u,a.setAttribute("aria-busy","false")},getSelectedRecords:function(){var e=[],t,n;for(t=0,n=this.getSelectedRows();t<n.length;t++)e.push(this.getRecord(n[t]));return e},getToolbarEl:function(){return this._toolbarEl},isToolbarEnabled:function(){return this._toolbarEl&&t.hasClass(this._toolbarEl,"dt-toolbar-enabled")},getFilterForm:function(){return this._filterFormEl},beginWait:function(){n.log("If you see this message in your log, please contact the Common-Web team.","warn")},endWait:function(){n.log("If you see this message in your log, please contact the Common-Web team.","warn")},initAttributes:function(o){l.superclass.initAttributes.call(this,o),this.setAttributeConfig("MSG_NONE_SELECTED",{value:s.get("widget.datatable.noneSelected.message"),validator:e.isString}),this.setAttributeConfig("MSG_NUM_SELECTED",{value:s.get("widget.datatable.numberSelected.message"),validator:e.isString});var u=this;this.setAttributeConfig("MSG_ONE_SELECTED",{value:e.substitute(u.get("MSG_NUM_SELECTED"),[1]),validator:e.isString}),this.setAttributeConfig("toolbarRendered",{readOnly:!0,value:!1}),this.setAttributeConfig("autoRefreshInterval",{validator:e.isNumber,method:function(e){this._autoRefreshEl&&this._initAutoRefresh()}}),this.setAttributeConfig("dataRequestPrefix",{validator:e.isString,method:function(t){this.set("generateRequest",function(t,n){var r=n._filterParams;return n.get("dynamicData")&&(r=e.merge(r,n._getSortParams(t),{results:t.pagination?t.pagination.rowsPerPage:"",startIndex:t.pagination?t.pagination.recordOffset:0})),n._getQuery(r)})}}),this.setAttributeConfig("fallbackSortOptions",{method:function(e){var t=this.getColumnSet().flat,r;for(r=0;r<t.length;r++){var i=t[r].sortOptions||{};i.field=i.field||t[r].field,t[r].sortOptions={defaultDir:i.defaultDir||n.widget.DataTable.CLASS_ASC,sortFunction:l.getSortFunction(i,e,{sortFunction:l._compareRecordCounts})}}}}),this.setAttributeConfig("filterState",{value:{}}),this.setAttributeConfig("rowClickHandler",{writeOnce:!0,validator:e.isFunction,method:function(e){this.subscribe("rowClickEvent",r.util.Event.debounce(function(t){var n=this.getRecord(t.target);n&&e.call(this,n)})),this.subscribe("rowHighlightEvent",function(e){t.addClass(e.el,"yui-dt-clickable-highlighted"),this.isSelected(e.record)&&t.addClass(e.el,"yui-dt-selected-highlighted")}),this.subscribe("rowUnhighlightEvent",function(e){t.removeClass(e.el,"yui-dt-clickable-highlighted"),t.removeClass(e.el,"yui-dt-selected-highlighted")}),this.subscribe("rowSelectEvent",function(e){t.hasClass(e.el,"yui-dt-highlighted")&&t.addClass(e.el,"yui-dt-selected-highlighted")}),this.subscribe("rowUnselectEvent",function(e){t.removeClass(e.el,"yui-dt-selected-highlighted")})}}),this.setAttributeConfig("searchHandler",{writeOnce:!0,validator:e.isFunction,method:function(e){this.subscribe("searchEvent",function(t){e.call(this,t.query)}),t.addClass(this._filterToggleEl,"dt-tool-enabled")}}),this.setAttributeConfig("toggleHandlers",{writeOnce:!0,method:function(e){this.subscribe("cellClickEvent",function(r){var o=r.target,u=this.getColumn(o),a,f,l;if(!u)return!0;a=this.getTdLinerEl(o),f=e[u.key],l=a.parentNode;if(!f)return!0;if(t.hasClass(l,"toggle-working"))return!1;var c=this.getRecord(o),h=!c.getData(u.key),p=this;t.removeClass(l,"toggle-failed"),l.title="",t.addClass(l,"toggle-working"),t.hasClass(a,"off")?t.replaceClass(a,"off","on-working"):t.hasClass(a,"on")&&t.replaceClass(a,"on","off-working");var d=n.lang.later(1e3,{},function(){t.hasClass(a,"off-working")?t.replaceClass(a,"off-working","off-throbber"):t.hasClass(a,"on-working")&&t.replaceClass(a,"on-working","on-throbber")}),v=function(e){if(e===!1){t.addClass(l,"toggle-failed"),l.title=s.get("widget.toggle.problemChanging");var n=function(){t.removeClass(l,"toggle-failed"),l.title="",i.removeListener(l,"mouseenter",n)};i.addListener(l,"mouseenter",n)}else p.updateCell(c,u,h);t.hasClass(a,"off-working")?t.replaceClass(a,"off-working",e===!1?"on":"off"):t.hasClass(a,"on-working")?t.replaceClass(a,"on-working",e===!1?"off":"on"):t.hasClass(a,"on-throbber")?t.replaceClass(a,"on-throbber",e===!1?"off":"on"):t.hasClass(a,"off-throbber")&&t.replaceClass(a,"off-throbber",e===!1?"on":"off"),t.removeClass(l,"toggle-working"),d.cancel()};return f.call(this,c,v),!1})}}),this.setAttributeConfig("priorityHandler",{writeOnce:!0,method:function(e){var r={},i={};this.subscribe("cellClickEvent",function(s){var o=s.target,u=this.getColumn(o),a,f;if(!u)return!0;a=this.getTdLinerEl(o),f=e[u.key];if(!f)return!0;if(t.hasClass(a.parentNode,"priority-view"))return n.log('Priority formatter is in read-only state with class "priority-view" so should not toggle',"warn"),!1;var l=this,c=this.getRecord(o),h=c.getId(),p=h+u.key,d=c.getData(u.key),v="priority-"+d,m,g,y,b;if(t.hasClass(a.parentNode,"priority-change-failed"))return t.removeClass(o,"priority-change-failed"),l.updateCell(c,u,d),!1;if(t.hasClass(a.parentNode,"priority-working"))return t.hasClass(a,"priority-throbber")||t.addClass(a,"priority-throbber"),!1;for(b=0;b<4;b++)t.hasClass(a,"priority-"+b)&&(m=(b+1)%4,y="priority-"+b);return g="priority-"+m,t.replaceClass(a,y,g),i[p]&&i[p].cancel(),i[p]=n.lang.later(750,{},function(){if(g===v)return;l.fireEvent("priorityChangeEvent",{recordId:h}),t.addClass(a.parentNode,"priority-working"),r[p]&&r[p].cancel(),r[p]=n.lang.later(750,{},function(){t.hasClass(a.parentNode,"priority-working")&&t.addClass(a,"priority-throbber")}),f.call(this,c,m,function(e){e?l.updateCell(c,u,m):(t.replaceClass(a,g,v),t.addClass(a.parentNode,"priority-change-failed"),l.updateCell(c,u,d)),t.removeClass(a.parentNode,"priority-working"),t.removeClass(a,"priority-throbber"),r[p].cancel(
),i[p].cancel(),delete r[p],delete i[p]})}),!1})}}),this.setAttributeConfig("addItem",{writeOnce:!0,validator:function(t){return e.isFunction(t.fn)&&e.isString(t.label)},method:function(e){this.subscribe("addItemEvent",e.fn),this._addItemEl&&(r.util.Dom.setText(this._addItemEl,e.label),t.addClass(this._addItemEl,"dt-tool-enabled"))}}),this.setAttributeConfig("removeActionHandler",{validator:e.isFunction})},showTableMessage:function(e,n){l.superclass.showTableMessage.call(this,e,n),(!this._elMsgTbody.parentNode||this._elMsgTbody.parentNode.nodeType===11)&&t.insertBefore(this._elMsgTbody,this.getTbodyEl())},hideTableMessage:function(){this._elMsgTbody.parentNode&&this._elMsgTbody.parentNode.nodeType!==11&&(this._elMsgTbody.parentNode.removeChild(this._elMsgTbody),this.fireEvent("tableMsgHideEvent"))}}),l.prototype._initTheadEl=function(e){e=e||this.getTableEl(),l.superclass._initTheadEl.call(this,e);var n=this.getColumnSet(),r,i,s,o,u,a;if(!n)return;r=n.keys.length,i=t.getElementsByClassName("yui-dt-tbody-min-width","thead",e)[0],i?t.getElementsByClassName("min-width","th",i,function(e){e.colSpan=r}):(s=document.createElement("tbody"),t.addClass(s,"yui-dt-tbody-min-width"),o=document.createElement("tr"),u=document.createElement("th"),t.addClass(u,"min-width"),u.colSpan=r,o.appendChild(u),s.appendChild(o),a=this.getTheadEl(),t.insertAfter(s,a))},l.prototype._initCommentPopover=function(){if(this._commentPopoverInitialized)return;var e=this;a(function(t){t.on("show",e.pauseAutoRefresh,e),t.on("hide",e.unpauseAutoRefresh,e)}),this.subscribe("cellClickEvent",function(e){var n=e.target,r=this.getColumn(n),i;if(r){i=this.getTdLinerEl(n);if(t.hasClass(t.getChildren(i)[0],"ohp-comment"))return!1}}),this._commentPopoverInitialized=!0},e.augmentObject(l,{UNREAD_ROW_FORMATTER:function(e,n){return t[n.getData("unread")?"addClass":"removeClass"](e,"unread"),!0},_compareRecordCounts:function(e,t,r){return n.util.Sort.compare(e.getCount(),t.getCount(),r)},formatBoolean:function(r,i,s,o){var u=e.isBoolean(o)&&o;return r.className=n.widget.DataTable.CLASS_LINER,t.addClass(r,u?"on":"off"),{preventDefault:!0,preventEmptyCellFormatting:!0}},formatDefault:function(e,t,r,i){var s=t.getData(r.key+"Display");return i=s===undefined?i:s,e.innerHTML!==i&&n.widget.DataTable.formatDefault(e,t,r,i),e.title=t.getData(r.key+"Tooltip")||"",{}},formatEmptyCell:function(e,t,r,i){if(n.lang.trim(e.innerHTML)==="&nbsp;"||n.lang.trim(e.innerHTML)==="")e.innerHTML="&ndash;";return{}},formatMoreLess:function(t,n,r,i){var o=function(t,n){return e.substitute('<span class="less">{lessValue} <a href="#" class="show-more">{moreLink}</a></span><span class="more">{moreValue} <a href="#" class="show-less">{lessLink}</a></span>',{lessValue:t,moreValue:n,lessLink:s.get("widget.datatable.less.action"),moreLink:s.get("widget.datatable.more.action")})},u=null,a=n.getData(r.key+"More");if(a)u=o(i,a);else{if(!i)return{};if(i.length<=75)u=i;else{var f=50,l;for(l=f;l<f+10;l++){if(i.charAt(l)==="&")break;if(i.charAt(l)===";"){f=l+1;break}}u=o(i.substring(0,f)+"&hellip;",i)}}return t.innerHTML=u,{preventDefault:!0}},formatState:function(e,r,i,s){return e.className=n.widget.DataTable.CLASS_LINER,t.addClass(e,i.key+"-"+s),{preventDefault:!0,preventEmptyCellFormatting:!0}},formatComment:function(e,r,i,s){this._initCommentPopover(),t.addClass(t.getAncestorByTagName(e,"td"),"ohp-dt-col-type-comments");var o=r.getData(i.key+"Display"),u=o;o===undefined&&(n.lang.trim(e.innerHTML)!=="&nbsp;"&&n.lang.trim(e.innerHTML)!==""?u="<span>"+e.innerHTML+"</span>":u=s);if(n.lang.trim(u)!=="&nbsp"&&n.lang.trim(u)!==""){var a='<span class="ohp-comment"><span class="value ohp-comment-content ohp-comment-value">'+u+"</span></span>";n.widget.DataTable.formatDefault(e,r,i,a),e.title=r.getData(i.key+"Tooltip")||""}return{preventDefault:!0}},formatPriority:function(r,i,o,u){var a=e.isNumber(u)&&u<4?u:0,f,l;return r.className=n.widget.DataTable.CLASS_LINER,t.addClass(r,"priority-"+a),f=t.hasClass(r.parentNode,"priority-change-failed")?s.get("cow.datatable.tooltip.priority.changeFailed"):a===0?s.get("widget.priority.priorityNone"):a===1?s.get("widget.priority.priorityLow"):a===2?s.get("widget.priority.priorityMedium"):a===3?s.get("widget.priority.priorityHigh"):"",l=i.getData(o.key+"Tooltip"),l=l===undefined?"":", "+l,r.title=f+l,{preventDefault:!0,preventEmptyCellFormatting:!0}},formatAction:function(e,t,n,r){var s={preventDefault:!0,preventEmptyCellFormatting:!0};e.className="dt-delete";var o=t.getData();if(this.getAttributeConfig("removeActionHandler").value===null)return s;var u=this.getAttributeConfig("removeActionHandler").value;if(t.getData()!==null){e.innerHTML='<div class="yui-dt-liner"><a href="#" class="icon-remove"> </a></div>';var a=e.firstChild,r=t.getData(),f=t.getId();i.addListener(a,"click",function(e,t){i.preventDefault(e),u(r,f)},null,this)}return s},formatThrobber:function(e,t,r,i){var s=t.getData();e.className=n.widget.DataTable.CLASS_LINER;var o,u;return{preventDefault:!0,preventEmptyCellFormatting:!0}},getSortFunction:function(){var e=Array.prototype.slice.apply(arguments);return function(t,r,i){var s=0,o;for(o=0;s===0&&o<e.length;o++){var u=e[o];s=u.sortFunction?u.sortFunction(t,r,i):n.util.Sort.compare(t.getData(u.field),r.getData(u.field),i)}return s}}}),e.augmentObject(n.widget.DataTable.Formatter,{"boolean":l.formatBoolean,priority:l.formatPriority,moreless:l.formatMoreLess,state:l.formatState,comment:l.formatComment,titlecase:l.formatTitleCase,defaultFormatter:l.formatDefault,emptyCellFormatter:l.formatEmptyCell,action:l.formatAction},!0);var c=function(){};c.prototype={render:function(){var e=document.createElement("div");return t.addClass(e,"dt-toolbar"),t.addClass(e,"dt-toolbar-loading"),e}};var h=function(t,n){return new o({rowsPerPage:t,template:"{ShowMoreLink} {DataTableToolbar} {MinimalCurrentPageReport}",pageReportTemplate:e.substitute(s.get("widget.datatable.showingXofY.message"),["{endRecord}","{totalRecords}"]),showMoreRows:n})},p=function(
e){p.superclass.constructor.call(this,e)};e.extend(p,o.ui.CurrentPageReport,{update:function(e){if(e&&e.prevValue===e.newValue)return;var t=this.paginator.get("pageReportValueGenerator")(this.paginator);t.totalRecords>0?this.span.innerHTML=o.ui.CurrentPageReport.sprintf(this.paginator.get("pageReportTemplate"),t):this.span.innerHTML=""}});var d=function(e){this.paginator=e,e.subscribe("rowsPerPageChange",this.update,this,!0),e.subscribe("totalRecordsChange",this.update,this,!0),e.subscribe("rowsPerPageChange",this.loadingComplete,this,!0),e.subscribe("totalRecordsChange",this.loadingComplete,this,!0),e.subscribe("destroy",this.destroy,this,!0)};d.init=function(t){t.setAttributeConfig("showMoreRows",{validator:e.isNumber})},d.prototype={render:function(){this.showMore=document.createElement("div"),this.showMore.className="yui-pg-show-more";var e=document.createElement("span");return e.className="yui-dt-loading",this.showMore.appendChild(e),this.link=document.createElement("a"),this.link.href="#",this.link.innerHTML=s.get("widget.datatable.showMore.action"),this.showMore.appendChild(this.link),this.update(),i.on(this.link,"click",this.onClick,this,!0),this.showMore},_getContainer:function(){return this.container||(this.container=t.getAncestorByClassName(this.showMore,"yui-dt")),this.container},update:function(){t[this.paginator.getTotalRecords()===o.VALUE_UNLIMITED||this.paginator.getTotalRecords()>this.paginator.getRowsPerPage()?"addClass":"removeClass"](this.showMore,"yui-pg-more-to-show")},loading:function(){t.addClass(this._getContainer(),"yui-pg-loading")},loadingComplete:function(){t.removeClass(this._getContainer(),"yui-pg-loading")},destroy:function(){i.purgeElement(this.link),this.showMore.parentNode.removeChild(this.showMore),this.link=null,this.showMore=null},onClick:function(e){var t=this.paginator,n=t.getRowsPerPage()+t.get("showMoreRows");t.getTotalRecords()!==o.VALUE_UNLIMITED&&n+t.get("showMoreRows")>t.getTotalRecords()&&(n=t.getTotalRecords()),this.loading(),t.setRowsPerPage(n),i.stopEvent(e)}},r.widget.DataTable=l,r.widget.DataTable.XHRDataSource=f,r.widget.DataTablePaginator=h,o.ui.DataTableToolbar=c,o.ui.ShowMoreLink=d,o.ui.MinimalCurrentPageReport=p}(),n.register("orchestral-datatable",r.widget.DataTable,{version:"7.9",build:"0"})},"7.9.0",{requires:["yui2-yahoo","yui-base","yui2-element","yui2-datasource","yui2-paginator","yui2-event-mouseenter","yui2-datatable","yui2-orchestral","yui2-orchestral-autorefresh","yui2-orchestral-dom","ohp-locale-translations","yui2-orchestral-button","yui2-orchestral-form","yui2-animation"]});