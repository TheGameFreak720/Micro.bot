const express = require('express');
const router = express.Router();

//Bring in Article Model
let Article = require('../models/article');

///Article Routes
router.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('articles', {
                title:'Articles',
                articles:articles
            });
        }
    });
});

//Get single Article
router.get('/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        });
    });
});

//Load Edit Form
router.get('/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Add Route
router.get('/add', function(req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res) {
    req.checkBody('body', 'Body is required!').notEmpty();
    req.checkBody('link', 'Link is required!').notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title:'Add Article',
            errors:errors
        });
    } else {
        let article = new Article();
        article.body = req.body.body;
        article.link = req.body.link;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/articles');
            }
        });
    }
});

//Update Submit Post Route
router.post('/edit/:id', function(req, res) {
    req.checkBody('body', 'Body is required!').notEmpty();
    req.checkBody('link', 'Link is required!').notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        Article.findById(req.params.id, function(err, article) {
            res.render('edit_article', {
                title: 'Edit Article',
                article: article,
                errors: errors
            });
        });
    } else {
        let article = {};
        article.body = req.body.body;
        article.link = req.body.link;

        let query = {_id: req.params.id};

        Article.update(query, article, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Updated');
                res.redirect('/articles');
            }
        });
    }
});

router.delete('/:id', function(req,res) {

    let query = {_id:req.params.id};

    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});

module.exports = router;
