///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>
define(["require", "exports", "./Module", "./Product"], function(require, exports, Module, Product) {
    var TaxonomyViewModel = (function () {
        function TaxonomyViewModel(pageHeader, products) {
            var _this = this;
            this.selectProduct = function (e) {
                ko.utils.arrayForEach(_this.products(), function (mainItem) {
                    ko.utils.arrayForEach(mainItem.products, function (product) {
                        if (e.name == product.name) {
                            this.selectedProduct(product);
                            console.log("SELECT PRODUCT --> " + this.selectedProduct().name);
                        }
                    });
                });
                _this.selectedModule(_this.defaultModule);
            };
            this.selectModule = function (e) {
                ko.utils.arrayForEach(_this.selectedProduct().modules, function (module) {
                    ko.utils.arrayForEach(module.modules, function (item) {
                        if (e.name == item.name) {
                            this.selectedModule(item);
                            this.selectedModuleGeneratePackage();
                            console.log("SELECT Module --> " + this.selectedModule().name);
                        }
                    });
                });
            };
            this.selectedModuleGeneratePackage = function () {
                if (_this.selectedModule().generatePackage == 'True') {
                    return true;
                }
                return false;
            };
            this.pageHeader = ko.observable(pageHeader);
            this.products = ko.observableArray(products);
            this.defaultProduct = new Product("pID", "jiraKey", [], "Name", "Symbol", "wikiUrl");
            this.defaultModule = new Module("mID", "jiraComponent", "Name", "Symbol", "False");
            this.selectedProduct = ko.observable(this.defaultProduct);
            this.selectedModule = ko.observable(this.defaultModule);
        }
        return TaxonomyViewModel;
    })();

    
    return TaxonomyViewModel;
});
