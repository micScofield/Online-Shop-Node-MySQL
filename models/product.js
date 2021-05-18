const db = require('../util/db')
const Cart = require('./cart')

// To prevent SQL Injection in input fields use the ? approach for fields as users can inject sql queries inside fields. Thats a layer of security for us lets say.

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id
		this.title = title
		this.imageUrl = imageUrl
		this.description = description
		this.price = price
	}

	save() {
		const query = 'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)'
		return db.execute(query, [this.title, this.price, this.imageUrl, this.description])
	}

	static deleteById(id) {

	}

	static fetchAll() {
		const query = 'SELECT * FROM products'
		return db.execute(query)
	}

	static findById(id) {
		console.log('id', id)
		// const query = `SELECT * FROM products WHERE products.id = ${id}`
		// return db.execute(query)

		const query = `SELECT * FROM products WHERE id = ?`
		return db.execute(query, [id])
	}
}
