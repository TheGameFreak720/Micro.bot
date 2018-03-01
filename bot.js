const Twit = require('twit');
const config = require('./config');

var T = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessSecret
});

// Setting up a user stream
var stream = T.stream('user');

// Anytime someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    postTweet('@' + screenName + ' Thank you for following me');
    console.log(screenName + ' has followed me');
}

//  tweet a hello message from the bot

function postTweet(txt) {

    var tweet = {
        status: txt
    };

    T.post('statuses/update', tweet, function (err, data, response) {
        console.log(data)
    });

}


console.log('The bot is starting');