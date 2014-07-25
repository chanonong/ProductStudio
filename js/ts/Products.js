///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>
define(["require", "exports", "./Product"], function(require, exports, Product) {
    var Products = (function () {
        function Products(products) {
            this.products = $.map(products.product, function (item) {
                return new Product(item.id, item.jiraKey, item.modules, item.name, item.symbol, item.wikiUrl);
            });
        }
        return Products;
    })();

    
    return Products;
});
