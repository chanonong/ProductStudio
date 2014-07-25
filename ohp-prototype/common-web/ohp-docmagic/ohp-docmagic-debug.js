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
YUI.add('ohp-docmagic', function (Y, NAME) {

"use strict";
/**
Docmagic utility

@module ohp-docmagic
**/
var Node = Y.Node,
	getClassName = Y.OHP.OhpClassNameManager.create('docmagic').getClassName,

	CLASS_NAMES = {
		api: {
			//Top Level APIs
			docMagic: getClassName(),

			//Content Level APIs
			doc: getClassName('doc'),
			noDoc: getClassName('nodoc')
		},
		output: {
			container: getClassName('output', 'container'),
			doc: getClassName('output', 'doc'),
			html: {
				display: getClassName('output', 'doc', 'html'),
				language: 'language-markup'
			},
			script: {
				executable: getClassName('output', 'executable', 'script'),
				display: getClassName('output', 'doc', 'script'),
				language: 'language-javascript'
			},
			style: {
				effective: getClassName('output', 'effective', 'style'),
				display: getClassName('output', 'doc', 'style'),
				language: 'language-css'
			}
		}
	},

	YUI3_MODULE_NAME_DATA_FIELD_NAME = 'yui3-module-name',
	YUI3_MODULES_DATA_FIELD_NAME = 'yui3-modules',
	YUI2_MODULES_DATA_FIELD_NAME = 'yui2-modules',
	YUI2IN3_DISABLED_DATA_FIELD_NAME = 'yui2in3-disabled',

	moduleNames = [],

	_renderExecutableScript = Y.Template.get('ohp-docmagic-script-template');

function _cleanupTabs(input, indentLevel) {
	var clean,
		currentIndent,
		i;

	clean = Y.Lang.isArray(input) ? input.join('') : input;

	clean = clean.replace(/ {4}/g, '\t');
	clean = clean.replace(/^\n/mg, '');
	clean = clean.replace(/\s*$/mg, '');

	currentIndent = clean.match(/^(\t)*/)[0].length;

	for (i = 0; i < currentIndent - (indentLevel || 0); i += 1) {
		clean = clean.replace(/^\t/mg, '');
	}

	//Replace all tab charators with 4 spaces.
	clean = clean.replace(/\t/g, '    ');

	return clean;
}

function _getModuleDependencies(scriptDocNode) {
	var yui3Modules = scriptDocNode.getData(YUI3_MODULES_DATA_FIELD_NAME),
		yui2Modules = scriptDocNode.getData(YUI2_MODULES_DATA_FIELD_NAME),
		yui2in3Enabled = !scriptDocNode.getData(YUI2IN3_DISABLED_DATA_FIELD_NAME),
		modules;

	modules = yui3Modules ? yui3Modules.split(/,\s*/) : [];

	if (yui2in3Enabled) {
		yui2Modules = yui2Modules ? yui2Modules.split(/,\s*/) : [];

		modules = modules.concat(Y.Array.map(yui2Modules, function(yui2Module) {
			return 'yui2-' + yui2Module;
		}));
	}

	return Y.Array.map(modules, function(module) {
		return '\'' + module + '\'';
	});
}

function _getExecutableScriptElement(scriptDocNode) {
	var scriptElement,
		moduleName;

	scriptElement = document.createElement('script');
	scriptElement.type = 'text/javascript';
	moduleName = scriptDocNode.getData(YUI3_MODULE_NAME_DATA_FIELD_NAME) || Y.guid();
	moduleNames.push(moduleName);

	scriptElement.text = _renderExecutableScript({
		moduleName: moduleName,
		scriptContent: _cleanupTabs(scriptDocNode.getDOMNode().text, 1),
		modules: _getModuleDependencies(scriptDocNode),
		initializeGlobals: scriptDocNode.getData(YUI2_MODULES_DATA_FIELD_NAME) && !scriptDocNode.getData(YUI2IN3_DISABLED_DATA_FIELD_NAME)
	});

	return scriptElement;
}

function _getEffectiveStyleElement(styleDocNode) {
	var styleContent,
		styleElement;

	styleContent = _cleanupTabs(styleDocNode.getDOMNode().innerHTML, 1);
	styleElement = document.createElement('style');
	styleElement.type = 'text/css';
	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = styleContent;
	} else {
		styleElement.innerHTML = styleContent;
	}

	return styleElement;
}

function _processStyle(docMagicNode) {
	var styleDocNodes = docMagicNode.all('style[type="ohp-docmagic"]'),
		outputContainerNode = docMagicNode.one('.' + CLASS_NAMES.output.container);

	styleDocNodes.each(function(styleDocNode) {
		if (!styleDocNode.hasClass(CLASS_NAMES.api.noDoc)) {
			var outputDocStyleNode = Node.create('<pre class="' +
				CLASS_NAMES.output.doc +
				' ' + CLASS_NAMES.output.style.display +
				' ' + styleDocNode.getDOMNode().className + '">' +
				'<code class="'+ CLASS_NAMES.output.style.language +'"></code>' +
				'</pre>');
			outputDocStyleNode.one('code').set('text', _cleanupTabs(styleDocNode.getHTML()));
			outputContainerNode.append(outputDocStyleNode);
		}

		var outputEffectiveStyleNode = Node.create('<div class="' + CLASS_NAMES.output.style.effective + '"></div>');
		outputEffectiveStyleNode.append(_getEffectiveStyleElement(styleDocNode));

		outputContainerNode.append(outputEffectiveStyleNode);
		styleDocNode.remove(true);
	});
}

function _processScript(docMagicNode) {
	var scriptDocNodes = docMagicNode.all('script[type="ohp-docmagic"]'),
		outputContainerNode = docMagicNode.one('.' + CLASS_NAMES.output.container);

	scriptDocNodes.each(function(scriptDocNode) {
		if (!scriptDocNode.hasClass(CLASS_NAMES.api.noDoc)) {
			var outputDocScriptNode = Node.create('<pre class="' +
				CLASS_NAMES.output.doc +
				' ' + CLASS_NAMES.output.script.display +
				' ' + scriptDocNode.getDOMNode().className + '">' +
				'<code class="'+ CLASS_NAMES.output.script.language +'"></code>' +
				'</pre>');
			// TODO display full script content? including YUI.add/use/IIFE etc?
			outputDocScriptNode.one('code').set('text', _cleanupTabs(scriptDocNode.getHTML()));
			outputContainerNode.append(outputDocScriptNode);
		}

		var outputExecutableScriptNode = Node.create('<div class="' + CLASS_NAMES.output.script.executable + '"></div>');
		outputExecutableScriptNode.append(_getExecutableScriptElement(scriptDocNode));

		outputContainerNode.append(outputExecutableScriptNode);
		scriptDocNode.remove(true);
	});
}

function _processHtml(docMagicNode) {
	var htmlDocNodes = docMagicNode.all('.' + CLASS_NAMES.api.doc),
		outputContainerNode = docMagicNode.one('.' + CLASS_NAMES.output.container),
		outputDocHtmlNode;

	htmlDocNodes.each(function(htmlDocNode) {
		outputDocHtmlNode = Node.create('<pre class="' + CLASS_NAMES.output.doc + ' ' + CLASS_NAMES.output.html.display + '">' +
			'<code class="'+ CLASS_NAMES.output.html.language +'"></code>' +
			'</pre>');
		outputDocHtmlNode.one('code').set('text', _cleanupTabs(htmlDocNode.getHTML()));
		outputContainerNode.append(outputDocHtmlNode);
	});
}

Y.all('.' + CLASS_NAMES.api.docMagic).each(function(docMagicNode) {
	docMagicNode.append('<div class="' + CLASS_NAMES.output.container + '"></div>');

	_processStyle(docMagicNode);
	_processHtml(docMagicNode);
	_processScript(docMagicNode);
});

Y.use(moduleNames);


}, '7.9.0', {
    "requires": [
        "array-extras",
        "node-base",
        "template-base",
        "ohp-docmagic-templates",
        "ohp-ohp-class-name-manager"
    ],
    "skinnable": true
});
