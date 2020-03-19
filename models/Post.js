const postsCollection = require('../db').db().collection("posts")    //reusable file which stores db
const ObjectID = require('mongodb').ObjectID
let Post = function(data, userid){          //when postController uses this conctructor fnctn, remember we are passing along req.body which is going to be the form data user just submitted
    //receive data as parameter in function() and store data within property on our object, data here is incoming request of body data
     this.data = data
     this.errors = []
     this.userid = userid
}

//lets create a method that any object created using Post blueprint will have access to
Post.prototype.cleanUp = function(){
   if(typeof(this.data.title) !="string") {
         this.data.title = ""
   }
   if(typeof(this.data.body) !="string") {
    this.data.body = ""
}
//get rid of any bogus properties

//manually write which properties you want in your data
this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: this.userid

}

}

Post.prototype.validate = function(){
    if(this.data.title == ""){
        this.errors.push("You must provide a title")
    }
    if(this.data.body == ""){
        this.errors.push("You must provide content")
    }
    
}


Post.prototype.create = function(){
    //store document in db here. We have to return a promise here coj we need to leaverage this from post controller
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        //if error array is empty
        if(!this.errors.length){
            //save post into db
            postsCollection.insertOne(this.data).then(() => {
                resolve()

            }).catch(() => {
                this.errors.push("please try again later")
                reject(this.errors)
            })
            

        }else{
            reject(this.errors)
        }

    })

}

module.exports = Post