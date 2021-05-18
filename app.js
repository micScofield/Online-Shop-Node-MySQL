const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/db')

const app = express()

app.set('view engine', 'ejs')
//app.set('views', 'views') //use this to set up views path if not in root

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', require('./routes/admin'))
app.use(require('./routes/shop'))
app.use(errorController.get404)

const PORT = process.env.PORT || 5000

//ensure all models are converted to tables if not exist
//sync tables to appropriate models we defined using sequelize.define
sequelize.sync()
    .then(res => app.listen(PORT, () => console.log(`Server started on ${PORT}`)))
    .catch(err => console.log(err))
