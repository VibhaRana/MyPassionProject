const User = require('../models/User')
//Note- when we need persistent memory of previous request we can leverage sessions
//Note- Flash pkg help us add and remove data from our session

exports.login = function(req, res) {
  let user = new User(req.body)

  //login will return the promise(), also this is where we want to leaverage sessions
  user.login().then(function(result) {

    //req obj now has a session object which is unique per browser visitor, user is the property
    req.session.user = {avatar: user.avatar, username: user.data.username}

   //redirect to home page, however worry about timings of events, when we say req.session.user, session pkg recognise that we
   //are changing the data and in response it will automatically update the database in mongodb, it will tak time so we dont want to run
   //res.redirect right here, because there is no guarantee that db has acually been updated before redirect runs. so manually tell session to save data.
   req.session.save(function(){
     res.redirect('/')
   }
   
  )
  }).catch(function(e) {
    //leaveage flash pkg. it will add a flash obj onto the request object. In function, 1st argument will be name of collection 
    //or array that we want to start building. we can call it anything,lets call it errors. 2nd argument is what you will include actual msg. It could be a string.
    //but instead of that lets just write e, because thats the value our promise is gonna reject with, so that will get passed into that function.
    //so e is just string of text that just say invalid username or password
     req.flash('errors', e)
     //manually tells data to save as it may take time
     req.session.save(function(){
       res.redirect('/')
     })
    
  })
}

exports.logout = function(req, res) { 
  //if the current incoming request from the browser has a cookie with a valid or matching session id, this line of code will
  //find that in database and will destroy that
  req.session.destroy(function(){

    //it will redirect to home page as user clicks sign out
     res.redirect('/')
  })
  //send back response
  
}

exports.register = function(req, res) {
  let user = new User(req.body)
  user.register().then(() => {
    req.session.user = {username: user.data.username, avatar: user.avatar}
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch((regErrors) => {
    regErrors.forEach(function(error) {
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/')
    })
  })
}
//    //if there are errors, use flash pkg to display errors, and then redirect to home pg 
//   if (user.errors.length) {
//     user.errors.forEach(function(error){
//       //'regErrors is an array of msgs and error is the item you want to push int the array'
//       req.flash('regErrors', error)
//     })
//     //manually tells db to save as we dont know how much it will take, and then redirect to home pg
//     req.session.save(function() {
//       res.redirect('/')    //after redirecting, go adjust home functn to use that data. add regerrors parameter there
//     })
//   } else {
//     res.send("Congrats, there are no errors.")
//   }
// }

exports.home = function(req, res) {
 if(req.session.user){
 res.render('home-dashboard', {username: req.session.user.username})
 }else{
  res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
 }
}

//if the user is not logged in, its gonna render home-guest. Lets give above a 2nd argument. Remember this is how we can pass data 
//into a template. Give an obj in 2nd argument and imagine we want to have a propert name errors, and for values we would just want errors array from session data.
//we could access that manually by request.session.flash.errors. But we also want to del data from session we have accessed because we only want to show this msg to user once.
//so with flash pkg as soon as you access it, its also gonna del it for u from the session.
//so req.flash('name of array we intrested in)
//leverage this data from home-guest template