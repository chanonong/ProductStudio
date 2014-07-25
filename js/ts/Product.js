///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>
define(["require", "exports", "./Modules"], function(require, exports, Modules) {
    var Product = (function () {
        function Product(id, jiraKey, modules, name, symbol, wikiUrl) {
            this.id = id;
            this.jiraKey = jiraKey;
            if (modules != null) {
                this.modules = $.map(modules, function (item) {
                    return new Modules(item);
                });
            } else {
                this.modules = new Array();
            }
            this.name = name;
            this.symbol = symbol;
            this.wikiUrl = wikiUrl;
        }
        return Product;
    })();

    
    return Product;
});
