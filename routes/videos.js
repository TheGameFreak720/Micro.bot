const express = require('express');
const router = express.Router();

//Bring in Video model
let Video = require('../models/video');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger','You need to sign in for access to this page');
        res.redirect('/users/login');
    }
}

router.get('/', ensureAuthenticated, function(req, res) {
    Video.find({}, function(err, videos) {
        if (err) {
            console.log(err);
        } else {
            res.render('videos', {
                title:'Videos',
                videos:videos
            });
        }
    });
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Video.findById(req.params.id, function(err, video) {
        res.render('edit_video', {
            title: 'Edit Video',
            video: video
        });
    });
});

//Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
    res.render('add_video', {
        title: 'Add Video'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res) {
    req.checkBody('body', 'Body is required!').notEmpty();
    req.checkBody('link', 'Link is required!').notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_video', {
            title:'Add Video',
            errors:errors
        });
    } else {
        let video = new Video();
        video.body = req.body.body;
        video.link = req.body.link;

        video.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Video Added');
                res.redirect('/videos');
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
        Video.findById(req.params.id, function(err, video) {
            res.render('edit_video', {
                title: 'Edit Article',
                video: video,
                errors: errors
            });
        });
    } else {
        let video = {};
        video.body = req.body.body;
        video.link = req.body.link;

        let query = {_id: req.params.id};

        Video.update(query, video, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Video Updated');
                res.redirect('/videos');
            }
        });
    }
});

router.delete('/:id', function(req,res) {

    let query = {_id:req.params.id};

    Video.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});

//Get single Video
router.get('/:id', ensureAuthenticated, function(req, res) {
    Video.findById(req.params.id, function(err, video) {
        res.render('video', {
            video: video
        });
    });
});

module.exports = router;