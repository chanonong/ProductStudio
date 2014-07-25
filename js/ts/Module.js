///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>
define(["require", "exports"], function(require, exports) {
    var Module = (function () {
        function Module(id, jiraC, name, symbol, generatePackage) {
            this.id = id;
            this.jiraComponent = jiraC;
            this.name = name;
            this.symbol = symbol;
            this.generatePackage = generatePackage;
        }
        return Module;
    })();

    
    return Module;
});
