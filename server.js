//Installed Express
const express = require('express');
const app = express();
//Installed ejs
const ejsLint = require('ejs-lint');
app.set('view engine', 'ejs');
//Installed Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/message_board');
//Installed BodyParts
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
//Installed Moment
const moment = require('moment')
//Set my Paths
const path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
//Creating DB Model
var Schema = mongoose.Schema;
var PostSchema = new mongoose.Schema({
name: {type: String, required: true, minlength: 4},
message: {type: String, required: true},
_comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true });
//Creating my one to Many link from Post Model to Comment Model.
var CommentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    comment: {type: String, required: true},
    _post: {type: Schema.Types.ObjectId, ref:'Post'},
}, {timestamps: true});

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


app.get('/', function(req,res){
    Post.find({}).populate('_comments').exec(function(err, posts){
        if(err){
            console.log(posts)
            console.log(err);
        }
        res.render('index', {posts: posts});
    })
    
});
app.post('/posts', function(req,res){
    var newPost = new Post(req.body)
newPost.save(function(err){
        if(err){
            console.log(newPost.errors)
            res.render('new', {errors: newPost.errors})
        }
        else{
            console.log('message was added successfully')
            res.redirect('/')
        }
    })
});
app.post('/posts/:id', function(req, res) {
    Post.findOne({_id: req.params.id}, function(err, post) {
        var comment = new Comment(req.body);
        comment._post = post._id;
        console.log(post._id);
        Post.update({_id: req.params.id}, {$push: {"_comments": comment}}, function(err) {
        });
        comment.save(function(err){
            if(err){
                console.log('Error');
                res.render('index', {errors: newComment.errors});
            }
            else{
                console.log("comment was added successfully");
                res.redirect('/');
            }
        });
    });
});
app.listen(8000, function () {
    console.log("listening on port 8000");
});

