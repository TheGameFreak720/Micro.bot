const Twit = require('twit');
var request = require('request');
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
    postTweet('@' + screenName + ' Hey there, thank you for the follow. Check out my website https://commithub.com/ and share your thoughts. Cheers.');
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


//Get Request to Twitch API
const options = {
    url: 'https://api.twitch.tv/kraken/streams/marshythevamp?client_id=' + config.twitchClientId,
    method: 'GET'
};

function postTweetMarshy() {
    let fetchTwitch = setInterval(function () {
        request.get(options, function (error, response, body) {
            let json = JSON.parse(body);
            if (json.stream !== null) {
                console.log(json.stream.channel.display_name + ' is playing ' + json.stream.channel.game
                    + ' follow him at ' + json.stream.channel.url);
                clearInterval(fetchTwitch);
                let wait = setInterval(function() {
                    clearInterval(wait);
                    postTweetMarshy();
                }, 86400000); // 24 hours
            }
        });
    }, 1800000); //30 minutes

    // 1s = 1000ms and 1m = 60s, so 60 * 1000 = 60000ms
    // 60s * 30 = 1,800s so 1,800 * 1000 = 1,800,000ms
    // 60s * 60 = 3,600 * 24 hr = 86,400 so 86,400 * 1000 = 86,400,000ms
}

postTweetMarshy();


console.log('The bot is starting');