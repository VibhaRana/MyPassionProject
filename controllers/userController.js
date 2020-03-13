const User = require('../models/User')

exports.login = function(req, res) {
  let user = new User(req.body)
  //login will return the promise(), also this is where we want to leaverage sessions
  user.login().then(function(result) {
    //req obj now has a session object which is unique per browser visitor, user is the property
    req.session.user = {favColor: "red", username: user.data.username}
    res.send(result)
  }).catch(function(e) {
       res.send(e)
  })
}

exports.logout = function() {
  
}

exports.register = function(req, res) {
  let user = new User(req.body)
  user.register()
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Congrats, there are no errors.")
  }
}

exports.home = function(req, res) {
 if(req.session.user){
   res.send("Welcome to actual Application")
 }else{
  res.render('home-guest')
 }
}