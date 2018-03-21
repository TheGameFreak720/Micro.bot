const Twit = require('twit');
const request = require('request');
const schedule = require('node-schedule');
const config = require('./config');

var T = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessSecret
});

// Setting up a user stream
const stream = T.stream('user');

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

    var tweet = {
        status: txt
    };

    T.post('statuses/update', tweet, function (err, data, response) {
        console.log(data)
    });

}
//Schedule Posts
const rule = new schedule.RecurrenceRule();
rule.hour = 11;

const j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});


//Get Request to Twitch API
const options = {
    url: 'https://api.twitch.tv/kraken/streams/marshythevamp?client_id=' + config.twitchClientId,
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

//postTweetMarshy();


console.log('The bot is starting');