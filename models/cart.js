const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      //should have a cart structure present in the file when beginning: {"products": [],"totalPrice":0}
      let cart
      if (!err) {
        cart = JSON.parse(fileContent)
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)

      // Add new product/ increase quantity
      let updatedProduct

      if (existingProductIndex > -1) {
        const existingProduct = cart.products[existingProductIndex]
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id: id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }

      cart.totalPrice = (+cart.totalPrice + +productPrice).toFixed(2)

      fs.writeFile(p, JSON.stringify(cart), err => console.log(err))
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.error(err)
        return
      }

      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.find(prod => prod.id === id)

      //Check if no product found with that id in the db
      if (!product) {
        console.log('Product no longer available')
        return
      }

      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)

      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty

      fs.writeFile(p, JSON.stringify(updatedCart), err => console.log(err))
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      err ? cb(null) : cb(cart)
    })
  }
}
