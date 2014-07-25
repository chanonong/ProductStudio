///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>
define(["require", "exports", "./Module"], function(require, exports, Module) {
    var Modules = (function () {
        function Modules(modules) {
            this.modules = $.map(modules, function (item) {
                return new Module(item.id, item.jiraComponent, item.name, item.symbol, item.generatePackage);
            });
        }
        return Modules;
    })();

    
    return Modules;
});
