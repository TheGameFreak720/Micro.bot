const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const dbConfig = require('./config/database');
const bot = require('./bot');

mongoose.connect(dbConfig.database);
let db = mongoose.connection;

//Check for DB Connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

//init app
const app = express();

//Bring in models
let Video = require('./models/video');
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

///Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }));
//parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param:formParam,
            msg:msg,
            value:value
        };
    }
}));

//Load bot
bot();

//Home Route
app.get('/', function(req, res) {
    res.render('index', {
        title:'Home'
    });
});

///Article Routes
app.get('/articles', function(req, res) {
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
app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        });
    });
});

//Load Edit Form
app.get('/article/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Add Route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
       title: 'Add Article'
    });
});

//Add Submit Post Route
app.post('/articles/add', function(req, res) {
    let article = new Article();
    article.body = req.body.body;
    article.link = req.body.link;

    article.save(function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Added');
            res.redirect('/articles');
        }
    });
});

//Update Submit Post Route
app.post('/articles/edit/:id', function(req, res) {
    let article = {};
    article.body = req.body.body;
    article.link = req.body.link;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/articles');
        }
    });
});

app.delete('/article/:id', function(req,res) {

    let query = {_id:req.params.id};

    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});

///Video Routes
app.get('/videos', function(req, res) {
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

//Get single Video
app.get('/video/:id', function(req, res) {
    Video.findById(req.params.id, function(err, video) {
        res.render('video', {
            video: video
        });
    });
});

//Load Edit Form
app.get('/video/edit/:id', function(req, res) {
    Video.findById(req.params.id, function(err, video) {
        res.render('edit_video', {
            title: 'Edit Video',
            video: video
        });
    });
});

//Add Route
app.get('/videos/add', function(req, res) {
    res.render('add_video', {
        title: 'Add Video'
    });
});

//Add Submit Post Route
app.post('/videos/add', function(req, res) {
    let video = new Video();
    video.body = req.body.body;
    video.link = req.body.link;

    video.save(function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Video Added');
            res.redirect('/videos');
        }
    });
});

//Update Submit Post Route
app.post('/videos/edit/:id', function(req, res) {
    let video = {};
    video.body = req.body.body;
    video.link = req.body.link;

    let query = {_id:req.params.id};

    Video.update(query, video, function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Video Updated');
            res.redirect('/videos');
        }
    });
});

app.delete('/video/:id', function(req,res) {

    let query = {_id:req.params.id};

    Video.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});




//Start Server
app.listen(3000, function(){
    console.log('Server started succesfully in port 3000');
});