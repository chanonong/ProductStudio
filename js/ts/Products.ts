///<reference path='jquery.d.ts'/>
///<reference path='knockout.d.ts'/>

// libs
import Product = require("./Product")

class Products {
	products: any;
	constructor(products: any) {
		this.products = $.map(products.product, function(item) {
            return new Product(item.id, item.jiraKey, item.modules, item.name, item.symbol, item.wikiUrl);
        });
	}
}

export = Products;
