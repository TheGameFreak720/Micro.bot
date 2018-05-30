const express = require('express');
const router = express.Router();

//Bring in Article Model
let Post = require('../models/post');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger','You need to sign in for access to this page');
        res.redirect('/users/login');
    }
}

///Post Routes
router.get('/', ensureAuthenticated, function(req, res) {
    Post.find({}).sort('date').exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts', {
                title:'Posts',
                posts: posts
            });
        }
    });
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        res.render('edit_post', {
            title: 'Edit Post',
            post: post
        });
    });
});

//Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
    res.render('add_post', {
        title: 'Add Post'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res) {
    req.checkBody('body', 'Body is required!').notEmpty();
    req.checkBody('url', 'URL is required!').notEmpty();
    req.checkBody('date', 'Date is required!').notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_post', {
            title:'Add Post',
            errors:errors
        });
    } else {
        let post = new Post();
        post.body = req.body.body;
        post.url = req.body.url;
        post.date = req.body.date;

        post.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Post Added');
                res.redirect('/posts');
            }
        });
    }
});

//Update Submit Post Route
router.post('/edit/:id', function(req, res) {
    req.checkBody('body', 'Body is required!').notEmpty();
    req.checkBody('url', 'URL is required!').notEmpty();
    req.checkBody('date', 'Date is required!').notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        Post.findById(req.params.id, function(err, post) {
            res.render('edit_post', {
                title: 'Edit Post',
                post: post,
                errors: errors
            });
        });
    } else {
        let post = {};
        post.body = req.body.body;
        post.url = req.body.url;
        post.date = req.body.date;

        let query = {_id: req.params.id};

        Post.update(query, post, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Post Updated');
                res.redirect('/posts');
            }
        });
    }
});

router.delete('/:id', function(req,res) {

    let query = {_id:req.params.id};

    Post.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});

//Get single Article
router.get('/:id', ensureAuthenticated, function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        res.render('post', {
            post: post
        });
    });
});


module.exports = router;