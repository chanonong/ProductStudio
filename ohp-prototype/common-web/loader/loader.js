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
(function(){"use strict";var e=new YAHOO.util.YUILoader({allowRollup:!0,base:ORCHESTRAL.YUI_2_CONTEXT+"/"});e.addModule({name:"dom",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/dom/dom.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"connection",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/connection/connection.js",type:"js",requires:["event","yuiloader"]}),e.addModule({name:"element",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/element/element.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"autocomplete",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/autocomplete/autocomplete.js",type:"js",requires:["dom","event","datasource","yuiloader"]}),e.addModule({name:"cookie",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/cookie/cookie.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"resize",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/resize/resize.js",type:"js",requires:["dragdrop","element","dom","event","yuiloader"]}),e.addModule({name:"charts",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/charts/charts-experimental.js",type:"js",requires:["dom","event","datasource","yuiloader"]}),e.addModule({name:"containercore",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/container/container_core.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"uploader",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/uploader/uploader-experimental.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"orchestral-template",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/template/template.js",type:"js",requires:["element","dom","event","orchestral","yuiloader"]}),e.addModule({name:"orchestral-datatable",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/datatable/datatable.js",type:"js",requires:["paginator","orchestral-dom","orchestral-button","element","orchestral-form","orchestral-locale","datasource","orchestral","yuiloader","datatable"]}),e.addModule({name:"orchestral-autocomplete",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/autocomplete/autocomplete.js",type:"js",requires:["connection","dom","json","orchestral-locale","autocomplete","orchestral","yuiloader"]}),e.addModule({name:"imageloader",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/imageloader/imageloader.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"datatable",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/datatable/datatable.js",type:"js",requires:["element","dom","event","datasource","yuiloader"]}),e.addModule({name:"menu",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/menu/menu.js",type:"js",requires:["dom","event","container","yuiloader"]}),e.addModule({name:"orchestral-form",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/form/form.js",type:"js",requires:["selector","dom","orchestral","yuiloader"]}),e.addModule({name:"editor",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/editor/editor.js",type:"js",requires:["element","toolbarbutton","toolbar","dom","button","event","menu","container_core","simpleeditor","yuiloader"]}),e.addModule({name:"treeview",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/treeview/treeview.js",type:"js",requires:["event","yuiloader"]}),e.addModule({name:"profiler",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/profiler/profiler.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"calendar",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/calendar/calendar.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"legacy-window",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/legacy/Window.js",type:"js",requires:[]}),e.addModule({name:"event",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/event/event.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"paginator",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/paginator/paginator.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"orchestral",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/orchestral/orchestral.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"modernizr",fullpath:"/web/s/1.7.2-41924/modernizr/modernizr.js",type:"js",requires:[]}),e.addModule({name:"datasource",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/datasource/datasource.js",type:"js",requires:["event","yuiloader"]}),e.addModule({name:"dragdrop",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/dragdrop/dragdrop.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"orchestral-lightbox",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/lightbox/lightbox.js",type:"js",requires:["container","orchestral","yuiloader"]}),e.addModule({name:"layout",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/layout/layout.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"hive-skin",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/assets/skins/hive/skin.css",type:"css",requires:["modernizr","orchestral"]}),e.addModule({name:"ohp-popover-window",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/popover/popover-window.js",type:"js",requires:['"plugin"',"node","widget-stdmod","widget"]}),e.addModule({name:"selector",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/selector/selector.js",type:"js",requires:["dom","yuiloader"]}),e.addModule({name:"orchestral-input",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/input/input.js",type:"js",requires:["element","animation","dom","orchestral-locale","event","container","menu","orchestral","yuiloader"]}),e.addModule({name:"colorpicker",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/colorpicker/colorpicker.js",type:"js",requires:["slider","element","dom","event","yuiloader"]}),e.addModule({name:"slider",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/slider/slider.js",type:"js",requires:["dragdrop","dom","event","yuiloader"]}),e.addModule({name:"animation",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/animation/animation.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"carousel",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/carousel/carousel.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"orchestral-effects",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/effects/effects.js",type:"js",requires:["orchestral-dom","animation","dom","orchestral","yuiloader"]}),e.addModule({name:"imagecropper",fullpath:ORCHESTRAL.
YUI_2_CONTEXT+"/imagecropper/imagecropper.js",type:"js",requires:["dragdrop","element","dom","event","resize","yuiloader"]}),e.addModule({name:"logger",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/logger/logger.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"history",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/history/history.js",type:"js",requires:["event","yuiloader"]}),e.addModule({name:"orchestral-accordion",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/accordion/accordion.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"profilerviewer",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/profilerviewer/profilerviewer.js",type:"js",requires:["element","yuiloader","dom","event","profiler","yuiloader"]}),e.addModule({name:"orchestral-tabs",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/tabs/tabs.js",type:"js",requires:["element","dom","event","tabview","orchestral","yuiloader"]}),e.addModule({name:"json",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/json/json.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"get",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/get/get.js",type:"js",requires:["yuiloader"]}),e.addModule({name:"yui-config",fullpath:"/yui-3.3/yui_config.js",type:"js",requires:[]}),e.addModule({name:"orchestral-datetime",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/datetime/datetime.js",type:"js",requires:["legacy-window","dom","orchestral-locale","event","yuiloader","calendar"]}),e.addModule({name:"button",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/button/button.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"orchestral-dom",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/dom/dom.js",type:"js",requires:["dom","orchestral","yuiloader"]}),e.addModule({name:"orchestral-skin",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/assets/skins/orchestral/skin.css",type:"css",requires:["orchestral"]}),e.addModule({name:"orchestral-button-core",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/button/button.js",type:"js",requires:["button","orchestral","yuiloader"]}),e.addModule({name:"orchestral-button-aria",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/button/button-aria.js",type:"js",requires:["orchestral-button-core","orchestral","yuiloader","button"]}),e.addModule({name:"orchestral-button",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/button/button-rollup.js",type:"js",requires:["orchestral-button-core","orchestral-button-aria"]}),e.addModule({name:"orchestral-autorefresh",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/autorefresh/autorefresh.js",type:"js",requires:["element","orchestral-locale","orchestral-datetime","yuiloader"]}),e.addModule({name:"orchestral-locale",fullpath:"/web/locale.js",type:"js",requires:["orchestral"]}),e.addModule({name:"container",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/container/container.js",type:"js",requires:["dom","event","yuiloader"]}),e.addModule({name:"tabview",fullpath:ORCHESTRAL.YUI_2_CONTEXT+"/tabview/tabview.js",type:"js",requires:["element","dom","event","yuiloader"]}),e.addModule({name:"orchestral-logger",fullpath:ORCHESTRAL.COMMON_WEB_CONTEXT+"/example/test_assets/orchestral-logger.js",type:"js",requires:["logger","dom","dragdrop"]}),YAHOO.namespace("ORCHESTRAL","ORCHESTRAL.util"),ORCHESTRAL.util.Loader=function(){},ORCHESTRAL.util.Loader.load=function(t,n){e.require(t),e.insert({onSuccess:n})},ORCHESTRAL.use=ORCHESTRAL.util.Loader.load,YAHOO.register("orchestral-loader",ORCHESTRAL.util.Loader,{version:"7.9",build:"0"})})();
