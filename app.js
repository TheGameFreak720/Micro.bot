const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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


//Load bot
bot();


//Home Route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title:'Articles',
                articles:articles
            });
        }
    });
});

//Add Route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
       title: 'Add Article'
    });
});

//Start Server
app.listen(3000, function(){
    console.log('Server started succesfully in port 3000');
});