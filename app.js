const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const errorController = require('./controllers/error')
const sequelize = require('./util/db')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express()

app.set('view engine', 'ejs')
//app.set('views', 'views') //use this to set up views path if not in root

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

//Setup session middleware
app.use(session({ 
    secret: 'My Secret Key', 
    resave: false, 
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
}))
//using resave:false, session will thus change only if something is changed in session and not for every request.
//saveuninitialized will tell dont save session for each request unless its required
//maxAge is also available and so does expires, see docs for ref

//Setup a middleware to set user on the request parameter so that we know user details
app.use((req, res, next) => {
    User.findOne({ where: { email: 'a@a.com' } })
        .then(user => {
            req.user = user //user is a sequelized object with helper methods as well btw incase required
            // console.log(req.user)
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', require('./routes/admin'))
app.use(require('./routes/shop'))
app.use(require('./routes/auth'))
app.use(errorController.get404)

//Set up associations

// A product belongs to an user ie. created by user (One to One)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) //on deleting user, delete his created products as well for eg.
//One to Many
User.hasMany(Product)

//An user has one cart, we are defining two directional association here which is not mandatory
User.hasOne(Cart)
Cart.belongsTo(User) //this is optional

//many products can be in cart ie. many to many. We need a in between table to connect these two. For eg below CartItem is the place where the connection will be stored
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

//One to one
Order.belongsTo(User)
//One to Many
User.hasMany(Order)
//many to Many
Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem }) //optional

//ensure all models are converted to tables if not exist
//sync tables to appropriate models we defined using sequelize.define
const PORT = process.env.PORT || 5000
sequelize.sync()
    .then(res => {
        //creating a dummy user
        return User.findOne({ where: { email: 'a@a.com' } })
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Sanyam', email: 'a@a.com', password: 'a@a.com' })
        }
        return Promise.resolve(user) //because next then also expects a promise resolved, return user will also work because its understood by JS that all the time a promise will be resolved no matter what
    })
    // .then(user => {
    //     // Create a dummy cart for development 
    //     return user.createCart()
    // })
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on ${PORT}`))
    })
    .catch(err => console.log(err))

//if you want to reflect new changes to models / table schema while in development mode ofcourse, use { force: true } option in sync()