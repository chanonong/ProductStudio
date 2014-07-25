requirejs.config({
    "baseUrl": "js",
    "paths": {
      jquery : 'jquery-1.11.1'
    }
});

require(["ts/Products","ts/Product","ts/Modules","ts/Module","ts/TaxonomyViewModel","jquery"], function(Products, Product, Modules, Module, TaxonomyViewModel, $) {
    $(document).ready(function(){
        // var vm = function() {
        //     var self = this;
        //     self.pageHeader = ko.observable("Product Studio")
        //     self.products = ko.observableArray([]);
        //     var mappedProduct = $.map(productJson, function(item) {
        //         return new Products(item);
        //     });
        //     self.products(mappedProduct);
        //     //console.log(mappedProduct)

        //     self.logdata = function(e) {
        //        console.log(e);
        //     };

        //     var defaultProduct = new Product("pID", "jiraKey", [], "Name", "Symbol", "wikiUrl");
        //     self.selectedProduct = ko.observable(defaultProduct);


        //     var defaultModule = new Module("mID", "jiraComponent", "Name", "Symbol", "False");
        //     self.selectedModule = ko.observable(defaultModule);

        //     self.selectProduct = function(e) {
        //         ko.utils.arrayForEach(self.products(), function (mainItem) {
        //             ko.utils.arrayForEach(mainItem.products, function(product) {
        //                 if(e.name == product.name) {
        //                     self.selectedProduct(product);
        //                     console.log("SELECT PRODUCT --> " + self.selectedProduct().name);
        //                 }
        //             });
        //         });
        //         self.selectedModule(defaultModule);
        //     };

        //     self.selectedModuleGeneratePackage = function() {
        //         if(self.selectedModule().generatePackage == 'True') {
        //             return true;
        //         }
        //         return false;
        //     }

        //     self.selectModule = function(e) {
        //         ko.utils.arrayForEach(self.selectedProduct().modules, function(module) {
        //             ko.utils.arrayForEach(module.modules, function(item) {
        //                 if(e.name == item.name) {
        //                     self.selectedModule(item);
        //                     self.selectedModuleGeneratePackage()
        //                     console.log("SELECT Module --> " + self.selectedModule().name);
        //                 }
        //             });   
        //         });
        //     }


        // };
        // var test = new vm();
        

        var mappedProduct = $.map(productJson, function(item) {
            return new Products(item);
        });
        var test = new TaxonomyViewModel("Product Studio Taxonomy",mappedProduct);

        console.log(test)
        ko.applyBindings(test);
    });
});