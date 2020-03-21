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

//we are telling express to use this function at every request.
    //before we are using this just before router, means this function will run first
app.use(function(req, res, next){
    //make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    //make current user id available on the req object
    if(req.session.user){
        req.visitorId = req.session.user._id
    }else{
        req.visitorId = 0
    }
    //we are now working with an object that will be available within ejs. thats y use locals. 
    //make user session data available from within view templates
    res.locals.user = req.session.user
    //we are calling next, so express will move on to run actual function for particular route
    next()
})
const router = require('./router')

app.use(express.urlencoded({extended: false})) //boiler plate code, no need to memorise
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app