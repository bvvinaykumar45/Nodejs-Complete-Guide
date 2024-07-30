const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");
const Cart = require("./cart");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromfile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
	}

	save() {
		getProductsFromfile((products) => {
			if (this.id) {
				const existingProductIndex = products.findIndex(prod => prod.id === this.id);
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), err => {
					console.log(err, 'pushing data to file');
				});
			} else {
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), err => {
					console.log(err, 'pushing data to file');
				});
			}
		});
	}

	static fetchAll(cb) {
		getProductsFromfile(cb);
	}

	static findById(id, cb) {
		getProductsFromfile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		})
	}

	static deleteById(id) {
		getProductsFromfile(products => {
			const indexOfProductToBeDeleted = products.findIndex(prod => prod.id === id);
			const product = products[indexOfProductToBeDeleted];
			products.splice(indexOfProductToBeDeleted, 1);
			fs.writeFile(p, JSON.stringify(products), err => {
				if(!err){
					Cart.deleteProduct(id,product.price);
				}
				console.log(err, 'pushing data to file');
			});
		})
	}
};
