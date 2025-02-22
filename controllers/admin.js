const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, "views", "add-product.html"));
    // pug render
    // res.render('add-product', {docTitle: 'Add Product', path:'/admin/add-product'});
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageUrl, description, price);
    product
        .save()
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, "views", "add-product.html"));
    // pug render
    // res.render('add-product', {docTitle: 'Add Product', path:'/admin/add-product'});
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            product: product,
            docTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            prods: products,
            docTitle: "Admin Products",
            path: "/admin/products",
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products");
};
