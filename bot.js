const Twit = require('twit');
const config = require('./config');

var T = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessSecret
});

console.log('The bot is starting');