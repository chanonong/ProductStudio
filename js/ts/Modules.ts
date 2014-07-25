///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>

import Module = require("./Module");

class Modules {
	modules: Array<Module>;

	constructor(modules: Array<Module>) {
		this.modules = $.map(modules, function(item) {
			return new Module(item.id, item.jiraComponent, item.name, item.symbol, item.generatePackage);
		})
	} 
}

export = Modules;