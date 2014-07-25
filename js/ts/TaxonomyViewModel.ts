///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>

import Module = require("./Module");
import Modules = require("./Modules");
import Product = require("./Product");
import Products = require("./Products");

class TaxonomyViewModel {
	pageHeader: KnockoutObservable<String>;
	products: KnockoutObservableArray<any>;
	defaultProduct: Product;
	defaultModule: Module;
	selectedProduct: KnockoutObservable<Product>;
	selectedModule: KnockoutObservable<Module>;

	constructor(pageHeader: string, products :any) {
		this.pageHeader = ko.observable(pageHeader);
		this.products = ko.observableArray(products);
		this.defaultProduct = new Product("pID", "jiraKey", [], "Name", "Symbol", "wikiUrl");
		this.defaultModule = new Module("mID", "jiraComponent", "Name", "Symbol", "False");
		this.selectedProduct = ko.observable(this.defaultProduct);
		this.selectedModule = ko.observable(this.defaultModule);
	}

	public selectProduct = (e: any) => {
		ko.utils.arrayForEach(this.products(), function (mainItem) {
            ko.utils.arrayForEach(mainItem.products, function(product) {
                if(e.name == product.name) {
                    this.selectedProduct(product);
                    console.log("SELECT PRODUCT --> " + this.selectedProduct().name);
                }
            });
        });
        this.selectedModule(this.defaultModule);
	}


	public selectModule = (e: any) => {
		ko.utils.arrayForEach(this.selectedProduct().modules, function(module) {
            ko.utils.arrayForEach(module.modules, function(item) {
                if(e.name == item.name) {
                    this.selectedModule(item);
                    this.selectedModuleGeneratePackage()
                    console.log("SELECT Module --> " + this.selectedModule().name);
                }
            });   
        });
	}

	public selectedModuleGeneratePackage = () => {
        if(this.selectedModule().generatePackage == 'True') {
            return true;
        }
        return false;
	}

}

export = TaxonomyViewModel