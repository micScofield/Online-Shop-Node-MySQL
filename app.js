const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/db')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express()

app.set('view engine', 'ejs')
//app.set('views', 'views') //use this to set up views path if not in root

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

//Setup a middleware to set user on the request parameter so that we know user details

app.use('/admin', require('./routes/admin'))
app.use(require('./routes/shop'))
app.use(errorController.get404)

//Set up associations

// A product belongs to an user ie. created by user (One to One)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) //on deleting user, delete his created products as well for eg.
//One to Many
User.hasMany(Product)

//An user has one cart, we are defining two directional association here which is not mandatory
User.hasOne(Cart)
Cart.belongsTo(User) //this is optional

//many products can be in cart
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

//ensure all models are converted to tables if not exist
//sync tables to appropriate models we defined using sequelize.define
const PORT = process.env.PORT || 5000
sequelize.sync()
    .then(res => app.listen(PORT, () => console.log(`Server started on ${PORT}`)))
    .catch(err => console.log(err))

//if you want to reflect new changes to models / table schema while in development mode ofcourse, use { force: true } option in sync()