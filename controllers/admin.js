const Product = require('../models/product')

//Because of the association, sequelize adds special helper methods which we are using by req.user.

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    req.user.createProduct({
        title,
        imageUrl,
        price,
        description
    })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))

    // Product.create({
    //     title,
    //     imageUrl,
    //     price,
    //     description
    // })
    //     .then(() => res.redirect('/admin/products'))
    //     .catch(err => console.error(err))
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    req.user.getProducts({ where: { id: prodId } })
        .then(product => {
            if (!product[0]) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product[0],
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.error(err))
    // Product.findByPk(prodId)
    //     .then(product => {
    //         if (!product) {
    //             return res.redirect('/')
    //         }
    //         res.render('admin/edit-product', {
    //             pageTitle: 'Edit Product',
    //             path: '/admin/edit-product',
    //             editing: editMode,
    //             product: product
    //         })
    //     })
    //     .catch(err => console.error(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description
    //no need to use req.user here because we are here only because we are past the edit router where the user is already and we know that product will be there 
    Product.update({
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDesc
    },
        { where: { id: prodId } })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.error(err))

    // Product.findAll()
    //     .then(products => {
    //         res.render('admin/products', {
    //             prods: products,
    //             pageTitle: 'Admin Products',
    //             path: '/admin/products'
    //         })
    //     })
    //     .catch(err => console.error(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    // can also use req.user but this is fine as well
    Product.destroy({ where: { id: prodId } })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err))
}
