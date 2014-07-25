YUI_config = {
	"filter": "RAW",
	"skin": {
		"defaultSkin": "hive"
	},
	"groups": {
		"com.orchestral.commonweb": {
			"base": "/common-web/",
			"filter": "DEBUG",
			"modules": {
				
"cow-activity-syncer": {
	"name": "cow-activity-syncer",
	"requires": ["json-stringify", "json-parse"]
},
"ohp-activity-status": {
	"name": "ohp-activity-status",
	"skinnable": true,
	"requires": ["template", "ohp-locale-translations", "ohp-locale-base", "node-style", "transition", "node-event-delegate", "widget", "node-base"]
},
"ohp-activity-timeout-detector": {
	"name": "ohp-activity-timeout-detector",
	"requires": ["base", "node-base", "event-base", "event-custom", "yui-later", "array-invoke", "ohp-activity-tracker", "json-parse", "cow-activity-syncer"]
},
"ohp-activity-timeout-warning-panel": {
	"name": "ohp-activity-timeout-warning-panel",
	"skinnable": true,
	"requires": ["base", "node-base", "event-base", "event-custom", "event-resize", "panel", "ohp-locale-translations", "ohp-locale-base", "ohp-ohp-class-name-manager"]
},
"ohp-activity-timeout": {
	"name": "ohp-activity-timeout",
	"requires": ["base", "node-base", "event-base", "event-custom", "yui-later", "array-invoke", "io-base", "ohp-activity-timeout-detector", "ohp-activity-timeout-warning-panel", "ohp-activity-tracker", "cow-activity-syncer"]
},
"ohp-activity-tracker": {
	"name": "ohp-activity-tracker",
	"requires": ["base", "node-base", "event-base", "event-custom", "event-touch", "event-mousewheel", "yui-throttle", "json-stringify", "array-invoke", "cow-activity-syncer"]
},
"ohp-annotation-browser-test-tool": {
	"name": "ohp-annotation-browser-test-tool",
	"requires": ["ohp-annotation-tool", "base", "ohp-annotation-freehand-model"]
},
"ohp-annotation-class-name-manager": {
	"name": "ohp-annotation-class-name-manager",
	"requires": ["ohp-class-name-manager"]
},
"ohp-annotation-drawing-area-view": {
	"name": "ohp-annotation-drawing-area-view",
	"requires": ["ohp-annotation-drawing-view", "node-core", "ohp-annotation-class-name-manager", "node-style", "yui-base", "base", "view", "ohp-annotation-layer", "event-mouseenter", "event-base", "event-outside", "node-base"]
},
"ohp-annotation-drawing-model-list": {
	"name": "ohp-annotation-drawing-model-list",
	"requires": ["model-list", "ohp-annotation-drawing-model", "base"]
},
"ohp-annotation-drawing-model": {
	"name": "ohp-annotation-drawing-model",
	"requires": ["model", "base", "ohp-annotation-layer"]
},
"ohp-annotation-drawing-view": {
	"name": "ohp-annotation-drawing-view",
	"requires": ["ohp-annotation-drawing-model", "yui-base", "base", "view", "ohp-annotation-layer", "event-base"]
},
"ohp-annotation-footnote-model": {
	"name": "ohp-annotation-footnote-model",
	"requires": ["model", "ohp-annotation-drawing-model", "base", "ohp-annotation-layer", "ohp-annotation-graphics"]
},
"ohp-annotation-footnote-tool": {
	"name": "ohp-annotation-footnote-tool",
	"requires": ["ohp-annotation-tool", "ohp-annotation-footnote-model", "base"]
},
"ohp-annotation-freehand-model": {
	"name": "ohp-annotation-freehand-model",
	"requires": ["ohp-annotation-geometry", "model", "ohp-annotation-drawing-model", "base", "ohp-annotation-layer"]
},
"ohp-annotation-freehand-tool": {
	"name": "ohp-annotation-freehand-tool",
	"requires": ["ohp-annotation-tool", "base", "ohp-annotation-freehand-model", "ohp-annotation-layer"]
},
"ohp-annotation-geometry": {
	"name": "ohp-annotation-geometry"
},
"ohp-annotation-graphics": {
	"name": "ohp-annotation-graphics",
	"requires": ["node", "base", "graphics"]
},
"ohp-annotation-layer": {
	"name": "ohp-annotation-layer",
	"requires": ["yui-base", "base", "graphics"]
},
"ohp-annotation-model": {
	"name": "ohp-annotation-model",
	"requires": ["ohp-annotation-select-tool", "ohp-annotation-browser-test-tool", "ohp-annotation-drawing-model-list", "model", "ohp-annotation-tool-model", "ohp-annotation-freehand-tool", "base", "ohp-annotation-footnote-tool", "ohp-annotation-tool-model-list"]
},
"ohp-annotation-select-tool": {
	"name": "ohp-annotation-select-tool",
	"requires": ["ohp-annotation-geometry", "ohp-annotation-tool", "base"]
},
"ohp-annotation-tool-model-list": {
	"name": "ohp-annotation-tool-model-list",
	"requires": ["model-list", "ohp-annotation-tool-model", "base"]
},
"ohp-annotation-tool-model": {
	"name": "ohp-annotation-tool-model",
	"requires": ["model", "base"]
},
"ohp-annotation-tool": {
	"name": "ohp-annotation-tool",
	"requires": ["base"]
},
"ohp-annotation-toolbox-view": {
	"name": "ohp-annotation-toolbox-view",
	"requires": ["ohp-annotation-tool", "ohp-annotation-class-name-manager", "node-style", "handlebars", "yui-base", "base", "view", "event-base", "node-base"]
},
"ohp-annotation-view": {
	"name": "ohp-annotation-view",
	"requires": ["base", "ohp-annotation-model", "view", "ohp-annotation-toolbox-view", "ohp-annotation-drawing-area-view", "node-base"]
},
"ohp-annotation": {
	"name": "ohp-annotation",
	"skinnable": true,
	"requires": ["ohp-annotation-view", "ohp-annotation-class-name-manager", "base", "widget"]
},
"ohp-app-nestable": {
	"name": "ohp-app-nestable",
	"requires": []
},
"ohp-app-nester": {
	"name": "ohp-app-nester",
	"requires": []
},
"ohp-autocomplete-force-selection-plugin": {
	"name": "ohp-autocomplete-force-selection-plugin",
	"requires": ["base", "handlebars", "plugin", "ohp-locale-translations", "ohp-locale-base", "ohp-ohp-class-name-manager"]
},
"ohp-breadcrumb": {
	"name": "ohp-breadcrumb",
	"requires": ["history", "ohp-locale-translations", "widget-stack", "node", "ohp-locale-base", "event-resize", "widget-stdmod", "widget-child", "substitute", "widget", "event-base", "widget-parent", "ohp-widget-resize-ie"]
},
"ohp-change-exclude-item-plugin": {
	"name": "ohp-change-exclude-item-plugin",
	"requires": ["ohp-locale-translations", "ohp-locale-base", "arraylist", "substitute", "event-custom", "node-event-delegate", "event-base", "plugin", "oop", "yui-later", "node-base"]
},
"ohp-class-name-manager": {
	"name": "ohp-class-name-manager",
	"requires": ["classnamemanager"]
},
"ohp-commentindicator": {
	"name": "ohp-commentindicator",
	"requires": ["event", "ohp-popover", "widget", "ohp-constraint"]
},
"ohp-component": {
	"name": "ohp-component",
	"requires": ["oop", "yui-base"]
},
"ohp-constraint": {
	"name": "ohp-constraint",
	"requires": ["node", "widget-stdmod", "widget", "plugin"]
},
"ohp-docmagic-templates": {
	"name": "ohp-docmagic-templates",
	"requires": ["template-base", "handlebars-base"]
},
"ohp-docmagic": {
	"name": "ohp-docmagic",
	"skinnable": true,
	"requires": ["array-extras", "node-base", "template-base", "ohp-docmagic-templates", "ohp-ohp-class-name-manager"]
},
"ohp-dropdown-menu-templates": {
	"name": "ohp-dropdown-menu-templates",
	"requires": ["template-base", "handlebars-base"]
},
"ohp-dropdown-menu": {
	"name": "ohp-dropdown-menu",
	"skinnable": true,
	"requires": ["array-invoke", "base", "event-key", "event-mouseenter", "event-outside", "event-resize", "event-touch", "node-base", "node-event-delegate", "node-focusmanager", "template-base", "widget", "widget-position", "widget-position-align", "widget-position-constrain", "widget-stack", "ohp-locale-base", "ohp-locale-translations", "ohp-ohp-class-name-manager", "ohp-dropdown-menu-templates"]
},
"ohp-editable": {
	"name": "ohp-editable",
	"requires": ["plugin"]
},
"ohp-eventbus": {
	"name": "ohp-eventbus",
	"requires": ["base", "event-custom"]
},
"ohp-expand-collapse-plugin": {
	"name": "ohp-expand-collapse-plugin",
	"skinnable": true,
	"requires": ["node-core", "base-build", "event-custom", "node-pluginhost", "event-base", "plugin", "node-base"]
},
"ohp-highlight": {
	"name": "ohp-highlight",
	"requires": ["anim", "node", "transition", "plugin"]
},
"ohp-listbuilder": {
	"name": "ohp-listbuilder",
	"skinnable": true,
	"requires": ["node", "dom", "selector-css3", "event", "recordset", "substitute", "widget"]
},
"ohp-locale-base": {
	"name": "ohp-locale-base",
	"requires": ["yui-base", "substitute"]
},
"ohp-mandatory-item-plugin": {
	"name": "ohp-mandatory-item-plugin",
	"requires": ["ohp-locale-translations", "ohp-locale-base", "arraylist", "substitute", "plugin", "node-base"]
},
"ohp-modernize": {
	"name": "ohp-modernize",
	"requires": ["node", "base-build", "plugin"]
},
"ohp-ohp-class-name-manager": {
	"name": "ohp-ohp-class-name-manager",
	"requires": ["ohp-class-name-manager"]
},
"ohp-placeholder": {
	"name": "ohp-placeholder",
	"requires": ["base-build", "node-style", "plugin", "event-base", "node-base"]
},
"ohp-popover-window": {
	"name": "ohp-popover-window",
	"requires": ["node", "widget-stdmod", "widget", "plugin"]
},
"ohp-popover": {
	"name": "ohp-popover",
	"requires": ["ohp-editable", "overlay", "event-touch", "event-hover", "event-mouseenter", "widget-anim", "yui-later", "event-outside"]
},
"ohp-repeating-list": {
	"name": "ohp-repeating-list",
	"skinnable": true,
	"requires": ["ohp-locale-base", "node-style", "substitute", "node-event-delegate", "escape", "event-base", "node-base", "ohp-locale-translations", "widget-stdmod", "base", "widget-child", "arraylist", "widget", "widget-parent", "oop"]
},
"ohp-scrollpane": {
	"name": "ohp-scrollpane",
	"requires": ["ohp-locale-translations", "node", "ohp-locale-base", "ohp-ohp-class-name-manager", "event", "widget-stdmod", "substitute", "widget", "dd-constrain", "yui-later"]
},
"ohp-sha1": {
	"name": "ohp-sha1",
	"requires": ["ohp-utf8"]
},
"ohp-showhide": {
	"name": "ohp-showhide",
	"requires": ["selector", "widget-stack", "anim", "node", "ohp-widget", "widget-position", "widget-stdmod", "node-event-simulate", "base", "widget", "widget-anim"]
},
"ohp-tag": {
	"name": "ohp-tag",
	"requires": ["ohp-locale-translations", "ohp-locale-base", "arraylist", "widget-child", "base", "substitute", "node-event-delegate", "widget", "event-base", "oop", "node-base", "widget-parent"]
},
"ohp-thumbgrip": {
	"name": "ohp-thumbgrip",
	"requires": ["substitute", "widget"]
},
"ohp-tick": {
	"name": "ohp-tick",
	"requires": ["base", "event-custom"]
},
"ohp-utf8": {
	"name": "ohp-utf8"
},
"ohp-widget-resize-ie": {
	"name": "ohp-widget-resize-ie",
	"requires": ["widget-stdmod", "widget", "plugin"]
},
"ohp-widget": {
	"name": "ohp-widget",
	"requires": ["widget-stdmod", "base", "widget"]
},
"yui2-legacy-connector": {
	"name": "yui2-legacy-connector"
},
"yui2-legacy-corehttp": {
	"name": "yui2-legacy-corehttp"
},
"yui2-legacy-eventmanager": {
	"name": "yui2-legacy-eventmanager"
},
"yui2-legacy-form": {
	"name": "yui2-legacy-form"
},
"yui2-legacy-httpresource": {
	"name": "yui2-legacy-httpresource"
},
"yui2-legacy-iterator": {
	"name": "yui2-legacy-iterator"
},
"yui2-legacy-mod11": {
	"name": "yui2-legacy-mod11"
},
"yui2-legacy-multiselect": {
	"name": "yui2-legacy-multiselect",
	"requires": ["yui2-legacy-iterator"]
},
"yui2-legacy-stringbuffer": {
	"name": "yui2-legacy-stringbuffer"
},
"yui2-legacy-urlencoder": {
	"name": "yui2-legacy-urlencoder",
	"requires": ["yui2-legacy-stringbuffer"]
},
"yui2-legacy-window": {
	"name": "yui2-legacy-window"
},
"yui2-orchestral-accordion": {
	"name": "yui2-orchestral-accordion",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-orchestral"]
},
"yui2-orchestral-autocomplete": {
	"name": "yui2-orchestral-autocomplete",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-autocomplete", "yui2-connection", "yui2-json", "yui2-orchestral", "ohp-locale-translations"]
},
"yui2-orchestral-autorefresh": {
	"name": "yui2-orchestral-autorefresh",
	"requires": ["yui2-yahoo", "yui2-element", "yui2-orchestral", "ohp-locale-translations", "yui2-orchestral-datetime"]
},
"yui2-orchestral-base": {
	"name": "yui2-orchestral-base"
},
"yui2-orchestral-button-aria": {
	"name": "yui2-orchestral-button-aria",
	"requires": ["yui2-yahoo", "yui2-button", "yui2-orchestral", "yui2-orchestral-button-core"]
},
"yui2-orchestral-button-core": {
	"name": "yui2-orchestral-button-core",
	"requires": ["yui2-yahoo", "yui2-button", "yui2-orchestral", "yui2-dom", "yui2-orchestral-dom", "yui2-logger"]
},
"yui2-orchestral-button": {
	"name": "yui2-orchestral-button",
	"requires": ["yui2-yahoo", "yui2-orchestral-button-core", "yui2-orchestral-button-aria"]
},
"yui2-orchestral-datatable": {
	"name": "yui2-orchestral-datatable",
	"requires": ["yui2-yahoo", "yui-base", "yui2-element", "yui2-datasource", "yui2-paginator", "yui2-event-mouseenter", "yui2-datatable", "yui2-orchestral", "yui2-orchestral-autorefresh", "yui2-orchestral-dom", "ohp-locale-translations", "yui2-orchestral-button", "yui2-orchestral-form", "yui2-animation"]
},
"yui2-orchestral-datetime": {
	"name": "yui2-orchestral-datetime",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-calendar", "yui2-orchestral", "ohp-locale-translations", "yui2-legacy-window", "yui2-logger"]
},
"yui2-orchestral-dom": {
	"name": "yui2-orchestral-dom",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-orchestral"]
},
"yui2-orchestral-effects": {
	"name": "yui2-orchestral-effects",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-animation", "yui2-orchestral", "yui2-orchestral-dom"]
},
"yui2-orchestral-form": {
	"name": "yui2-orchestral-form",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-selector", "yui2-orchestral"]
},
"yui2-orchestral-input": {
	"name": "yui2-orchestral-input",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-element", "yui2-container", "yui2-menu", "yui2-orchestral", "ohp-locale-translations"]
},
"yui2-orchestral-lightbox": {
	"name": "yui2-orchestral-lightbox",
	"requires": ["yui2-yahoo", "yui2-orchestral", "yui2-container"]
},
"yui2-orchestral-tabs": {
	"name": "yui2-orchestral-tabs",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-element", "yui2-tabview", "yui2-orchestral"]
},
"yui2-orchestral-template": {
	"name": "yui2-orchestral-template",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-element", "yui2-orchestral"]
},
"yui2-orchestral": {
	"name": "yui2-orchestral",
	"requires": ["yui2-yahoo", "yui2-dom", "yui2-event"]
}

			}
		},
		// hard code the web support dynamic modules since they can't be generated here
		"com.orchestral.core.web.support-dynamic-modules": {
			"base": "/web/",
			"combine": false,
			"modules": {
				"ohp-locale-translations": {
					"name": "ohp-locale-translations",
					"path": "locale.js",
					"requires": [],
					"skinnable": false
				}
			},
			"uncachedBase": "/web/"
		}
	}
};