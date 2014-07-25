///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>

class Module {
	id: string;
	jiraComponent: string;
	name: string;
	symbol: string;
	generatePackage: string;
	self: any;
	
	constructor(id: string, jiraC: string, name: string, symbol: string, generatePackage: string) {
		this.id = id;
		this.jiraComponent = jiraC;
		this.name = name;
		this.symbol = symbol;
		this.generatePackage = generatePackage;
	}
}

export = Module;