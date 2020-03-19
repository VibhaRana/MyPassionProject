let Post = function(data){          //when postController uses this conctructor fnctn, remember we are passing along req.body which is going to be the form data user just submitted
    //receive data as parameter in function() and store data within property on our object, data here is incoming request of body data
     this.data = data
}

//lets create a method that any object created using Post blueprint will have access to
Post.prototype.cleanUp = function(){
    
}

Post.prototype.validate = function(){
    
}


Post.prototype.create = function(){
    //store document in db here

}

module.exports = Post