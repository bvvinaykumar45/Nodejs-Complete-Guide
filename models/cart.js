const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
	static addProduct(id, productPrice) {
		// Fetc the previous cart
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}
			// Analyze the cart => Find existing product
			const existingProductIndex = cart.products.findIndex(
				(prod) => prod.id === id
			);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty = updatedProduct.qty + 1;
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice += +productPrice;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err, "updating cart data");
			});
		});
		// Add new product/ increase quantity
	}

	static deleteProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}
			const cart = JSON.parse(fileContent);
			const updatedCart = { ...cart };
			const product = updatedCart.products.find((prod) => prod.id === id);
            if(!product) {
                return;
            }
			updatedCart.products = updatedCart.products.filter(
				(prod) => prod.id !== id
			);
			updatedCart.totalPrice -= productPrice * product.qty;
			fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
				console.log(err, "updating cart data");
			});
		});
	}

	static getCart(cb) {
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if (err) {
				cb(null);
			} else {
				cb(cart);
			}
		});
	}
};
