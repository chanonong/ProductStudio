///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>

// libs
// Product Studio
import Modules = require("./Modules");

class Product { 
	id: string;
	jiraKey: string;
	symbol: string;
	wikiUrl: string;
	name : string;
	modules : Array<Modules>;

	constructor(id: string, jiraKey: string, modules: Array<Modules>, name: string, symbol: string, wikiUrl: string) {
		this.id = id;
		this.jiraKey = jiraKey;
		if(modules != null) {
            this.modules = $.map(modules, function(item) {
                    return new Modules(item);
            });
        } else {
            this.modules = new Array();
        }
        this.name = name;
        this.symbol = symbol;
        this.wikiUrl = wikiUrl;
	}
}

export = Product;