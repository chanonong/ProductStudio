$(function () {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });
});

$(document).ready(function(){
    //createProduct();

    $(".toggler").click(function(){
      $(".toggler").toggleClass('active, inactive');
    });
    $('label.tree-toggler').click(function () {
        $(this).parent().children('ul.tree').toggle(300);
    });
});


function createProduct() {

    function Products(products) {
        var self = this;
        self.products = ko.observableArray([]);
        self.products = $.map(products.product, function(item) {
            return new Product(item.id, item.jiraKey, item.modules, item.name, item.symbol, item.wikiUrl);
        });
    }

    function Product(id, jiraKey, modules, name, symbol, wikiUrl) {
        var self = this;
        self.id = id;
        self.jiraKey = jiraKey;
        self.modules = ko.observableArray([]);
        if(modules != null) {
            self.modules = $.map(modules, function(item) {
                    return new Modules(item);
            });
        } else {
            self.modules = new Modules([]);
        }
        self.name = name;
        self.symbol = symbol;
        self.wikiUrl = wikiUrl;
    }

    function Modules(modules) {
        var self = this;
        self.modules = ko.observableArray([]);
        self.modules = $.map(modules, function (item) {
            return new Module(item.id, item.jiraComponent, item.name, item.symbol, item.generatePackage);
        });
    }

    function Module(id, jiraComponent, name, symbol, generatePackage) {
        var self = this;
        self.id = id;
        self.jiraComponent = jiraComponent;
        self.name = name;
        self.symbol = symbol
        self.generatePackage = generatePackage;
    }

    var vm = function() {
        var self = this;

        self.products = ko.observableArray([]);

        var mappedProduct = $.map(productJson, function(item) {
            return new Products(item);
        });
        self.products(mappedProduct);

        self.logdata = function(e) {
           console.log(e);
        };

        var defaultProduct = new Product("PID", "jiraKey", [], "Name", "Symbol", "wikiUrl");
        self.selectedProduct = ko.observable(defaultProduct);

        var defaultModule = new Module("MID", "jiraComponent", "Name", "Symbol", "GeneratePackage");
        self.selectedModule = ko.observable(defaultModule);

        self.selectProduct = function(e) {
            ko.utils.arrayForEach(self.products(), function (mainItem) {
                ko.utils.arrayForEach(mainItem.products, function(product) {
                    if(e.name == product.name) {
                        self.selectedProduct(product);
                        console.log("SELECT PRODUCT --> " + self.selectedProduct().name);
                    }
                });
            });
            self.selectedModule(defaultModule);
        };

        self.selectModule = function(e) {
            ko.utils.arrayForEach(self.selectedProduct().modules, function(module) {
                ko.utils.arrayForEach(module.modules, function(item) {
                    if(e.name == item.name) {
                        self.selectedModule(item);
                        console.log("SELECT Module --> " + self.selectedModule().name);
                    }
                });   
            });
        }


    };



    var test = new vm();

    ko.applyBindings(test);
    
};





