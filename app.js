const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbConfig = require('./config/database');
const bot = require('./bot');

//Set connection parameters
const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500 // Reconnect every 500ms
};

mongoose.connect(dbConfig.database, options);
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
let Post = require('./models/post');

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

// Passport init
app.use(passport.initialize());
app.use(passport.session());


//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.user = req.user || null;
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

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger','You need to sign in for access to this page');
        res.redirect('/users/login');
    }
}

//Home Route
app.get('/', function(req, res) {
    res.render('index', {
        title:'Home'
    });
});

app.get('/dashboard', ensureAuthenticated, function(req, res) {
    Post.find({}).sort('date').exec(function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('dashboard', {
                title: 'Dashboard',
                posts: posts
            });
        }
    });
});

//Route Files
let posts = require('./routes/posts');
let users = require('./routes/users');
app.use('/posts', posts);
app.use('/users', users);



//Start Server
app.listen(3000, function(){
    console.log('Server started succesfully in port 3000');
});