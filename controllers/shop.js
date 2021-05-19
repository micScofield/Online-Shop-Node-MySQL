const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => console.error(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    // Product.findAll({ where: { id: prodId } }).then().catch() //this will also work and will return an array

    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Product',
                path: '/products'
            })
        })
        .catch(err => console.error(err))
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch(err => console.error(err))
}

exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            //get cart products because of many to many relationship
            return cart.getProducts()
        })
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
            })
        })
        .catch(err => console.log(err))

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

    /* 
        steps: 1. get cart
        2. get products inside that cart if present already
        3. if present already simply increase the quantity using the cartItem in between table
        4. if not, fetch product data from Product table using prodId and set quantity to 1.
        5. redirect to /cart
    */

    const prodId = req.body.productId
    let fetchedCart
    let newQuantity = 1

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }

            if (product) {
                newQuantity = product.cartItem.quantity + 1 //we get access to this cartItem because we specified an in between table where connection will be stored using { through }
                return product
            }

            return Product.findByPk(prodId)
        })
        .then((product) => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } }) //another magic method due to association
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err))

    // Product.findById(prodId, product => {
    //     Cart.addProduct(prodId, product.price)
    // })
    // res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    /*
        Idea is to remove the item from cartItem table
        Step 1. getCart
        2. getProducts using that prodId, we will get an array of 1 element
        3. use product.cartItem.destroy()
        4. redirect to /cart  
    */

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err))

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
