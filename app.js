const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()

//session package
let sessionOptions = session({
    secret: "Javascript is cool",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}

})
//tell express to use session
app.use(sessionOptions)
//use flash
app.use(flash())

const router = require('./router')

app.use(express.urlencoded({extended: false})) //boiler plate code, no need to memorise
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app