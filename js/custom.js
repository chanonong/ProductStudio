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

    function ProductCategory(header,products) {
        this.header = header;
        this.products = ko.observableArray([]);
        this.products = $.map(products, function(item) {
            return new Product(item.productName,item.productSymbol,item.productJiraKey,item.productWikiUrl,item.modules)
        });
    }

    function Product(name,symbol,jira,wiki,module) {
        this.productName = name;
        this.productSymbol = symbol;
        this.productJiraKey = jira;
        this.productWikiUrl = wiki;
        this.modules = ko.observableArray([]);
        this.modules = $.map(module, function(item) {
            return new Module(item.moduleName);
        });
    }

    function Module(name) {
        this.moduleName = name;
    }

    var x = function() {
        var self = this;
        self.productCategories = ko.observableArray([])
        
        var mappedProduct = $.map(productArray, function (item) {
           return new ProductCategory(item.header,item.products);
        });

        self.productCategories(mappedProduct);

        var defaultProduct = new Product("Product Name","","","",[])
        self.selectedProduct = ko.observable(defaultProduct);

        var defaultModule = new Module("Module Name");
        self.selectedModule = ko.observable(defaultModule);

        self.productCategoriesHeader = ko.observableArray();
        ko.utils.arrayForEach(self.productCategories(), function(e) {
            self.productCategoriesHeader.push(e.header);
        });

        self.selectProduct = function(e) {
            console.log(e);
            ko.utils.arrayForEach(self.productCategories(), function (mainItem) {
                ko.utils.arrayForEach(mainItem.products, function(product) {
                    if(e.productName == product.productName) {
                        self.selectedProduct(product);
                        console.log(self.selectedProduct().productName + " : Selected");
                    }
                });
            });
            self.selectedModule(defaultModule);
        };

        self.selectModule = function(e) {
            ko.utils.arrayForEach(self.selectedProduct().modules, function(module) {
                console.log(e);
                if(e.moduleName == module.moduleName) {
                    self.selectedModule(module);
                    console.log(self.selectedModule(module));
                }
            });
        }
        console.log(self.productCategories())
    };
    
    ko.applyBindings(new x());;
    
};

