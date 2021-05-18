const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => console.error(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId

    Product.findById(prodId)
        .then(([product]) => {
            res.render('shop/product-detail', {
                product: product[0], //because we get an array of 1 element and we need to pass a single object
                pageTitle: 'Product', //can show title as well
                path: '/products'
            })
        })
        .catch(err => console.error(err))
}

exports.getIndex = (req, res, next) => {
    //we get array with two elements here, first being our data and second is the meta data lets say. So destructure them
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch(err => console.error(err))
}

exports.getCart = (req, res, next) => {
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = []

    //         for (product of products) {
    //             const cartProductData = cart.products.find(
    //                 prod => prod.id === product.id
    //             )
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty })
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts,
    //         })
    //     })
    // })
}

exports.postCart = (req, res, next) => {
    // const prodId = req.body.productId
    // Product.findById(prodId, product => {
    //     Cart.addProduct(prodId, product.price)
    // })
    // res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
    // const prodId = req.body.productId
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price)
    //     res.redirect('/cart')
    // })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}
