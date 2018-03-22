const Twit = require('twit');
const request = require('request');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const twit = require('./config/twit');
const twitch = require('./config/twitch');
const config = require('./config/database');

var T = new Twit({
    consumer_key: twit.consumerKey,
    consumer_secret: twit.consumerSecret,
    access_token: twit.accessToken,
    access_token_secret: twit.accessSecret
});

// Setting up a user stream
const stream = T.stream('user');

mongoose.connect(config.database);
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
    postTweet('@' + screenName + ' Hey there, thank you for the follow. Check out my website https://commithub.com/ and share your thoughts. Cheers.');
    console.log(screenName + ' has followed me');
}

//  tweet a hello message from the bot

function postTweet(txt) {

    let tweet = {
        status: txt
    };

    T.post('statuses/update', tweet, function (err, data, response) {
        console.log(data)
    });

}

//Bring in Models
let Video = require('./models/video');

Video.find( function (err, video) {
    if (err) {
        console.log(err);
    } else {
        console.log(video);
    }
});


//Schedule Posts
const youtubeRule = new schedule.RecurrenceRule();
const articleRule = new schedule.RecurrenceRule();

youtubeRule.hour = 11;
articleRule.hour =  17; //5:00 PM


const youtubePost = schedule.scheduleJob(youtubeRule, function(){
    console.log('The answer to life, the universe, and everything!');
});

const articlePost = schedule.scheduleJob(articleRule, function(){
    console.log('The answer to life, the universe, and everything!');
});


//Get Request to Twitch API
const options = {
    url: 'https://api.twitch.tv/kraken/streams/marshythevamp?client_id=' + twitch.twitchClientId,
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
                    console.log(data)
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