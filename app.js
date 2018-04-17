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

// Passport init
app.use(passport.initialize());
app.use(passport.session());


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

//Route Files
let articles = require('./routes/articles');
let videos = require('./routes/videos');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/videos', videos);
app.use('/users', users);



//Start Server
app.listen(3000, function(){
    console.log('Server started succesfully in port 3000');
});