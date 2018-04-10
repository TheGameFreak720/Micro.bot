const Twit = require('twit');
const request = require('request');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const twitConfig = require('./config/twit');
const twitchConfig = require('./config/twitch');
const dbConfig = require('./config/database');

var T = new Twit({
    consumer_key: twitConfig.consumerKey,
    consumer_secret: twitConfig.consumerSecret,
    access_token: twitConfig.accessToken,
    access_token_secret: twitConfig.accessSecret
});

// Setting up a user stream
const stream = T.stream('user');

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

// Anytime someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
    let name = eventMsg.source.name;
    let screenName = eventMsg.source.screen_name;
    T.post('@' + screenName + ' Hey there, thank you for the follow. Check out my website https://commithub.com/ and share your thoughts. Cheers.');
    console.log(screenName + ' has followed me');
}

//Bring in Models
let Video = require('./models/video');
let Article = require('./models/article');


//Schedule Posts

const videoPost = schedule.scheduleJob({hour: 11, minute: 0}, function(){
    Video.find( function (err, video) {
        if (err) {
            console.log(err);
        } else {
            let tweet = {
                status: video[0].body + '\n \n' + video[0].link
            };

            console.log(tweet.status);
            T.post('statuses/update', tweet, function (err, data, response) {
                if(err) {
                    console.log(err);
                }
            });
            video[0].remove();
        }
    });
});

const articlePost = schedule.scheduleJob({hour: 17, minute: 0}, function(){
    Article.find( function (err, article) {
        if (err) {
            console.log(err);
        } else {
            let tweet = {
                status: article[0].body + '\n \n' + article[0].link
            };

            console.log(tweet.status);
            T.post('statuses/update', tweet, function (err, data, response) {
                if(err) {
                    console.log(err);
                }
            });
            article[0].remove();
        }
    });
});


//Get Request to Twitch API
const options = {
    url: 'https://api.twitch.tv/kraken/streams/marshythevamp?client_id=' + twitchConfig.twitchClientId,
    method: 'GET'
};

function postTweetMarshy() {
    let fetchTwitch = setInterval(function () {
        request.get(options, function (error, response, body) {
            let json = JSON.parse(body);

            let tweet = {
                status: json.stream.channel.display_name + ' is playing ' + json.stream.channel.game
                + ' follow him at ' + json.stream.channel.url
            };

            if (json.stream !== null) {
                T.post('statuses/update', tweet, function (err, data, response) {
                    console.log(tweet);
                });
                clearInterval(fetchTwitch);
                let wait = setInterval(function() {
                    clearInterval(wait);
                    postTweetMarshy();
                }, 86400000); // 24 hours
            }
        });
    }, 600000); //10 minutes
}

postTweetMarshy();


console.log('The bot is starting');