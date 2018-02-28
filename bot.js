const Twit = require('twit');
const config = require('./config');

var T = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessSecret
});

//  search twitter for all tweets containing the word 'coding'

T.get('search/tweets', { q: 'coding', count: 2 }, function(err, data, response) {
    let tweets = data.statuses;

    for (let i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
    }
});

//  tweet a hello message from the bot

T.post('statuses/update', { status: 'hello earthlings this is microbot! (testing a bot using twitter api with node)' }, function(err, data, response) {
    console.log(data)
});

console.log('The bot is starting');