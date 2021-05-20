const Sequelize = require('sequelize').Sequelize //gives us a constructor lets say
const session = require('express-session')

//below sets us a connection pool. Dialect is saying we are using mysql db and host is localhost. Also first three params are db name, username and password

const sequelize = new Sequelize('node-online-shop', 'root', 'root',
        { dialect: 'mysql', host: 'localhost', storage: './session.mysql' }
    )

module.exports = sequelize

//Below was used before implementing sequelize
// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-online-shop',
//     password: 'root'
// })

// module.exports = pool.promise()