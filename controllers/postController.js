
//require model. This will be blueprint for creating post objects
const Post = require('../models/Post')
exports.viewCreateScreen = function(req, res){
    res.render('create-post')
}
exports.create = function(req, res) {
    //store the post of user in db, data management is done in Model
    let post = new Post(req.body, req.session.user._id)        //req.body is blueprint which contains the form data which user submitted
    //set a method create() to return a promise
    post.create().then(function(){
       res.send("Created")
    }).catch(function(errors){
        res.send(errors)

    })          //then() handles if promise resolves and catch() handles if reject
}