const express = require('express');
const Twit = require('twit');
const request = require('request');
const schedule = require('node-schedule');
const twitConfig = require('./config/twit');

module.exports = function bot() {

    var T = new Twit({
        consumer_key: twitConfig.consumerKey,
        consumer_secret: twitConfig.consumerSecret,
        access_token: twitConfig.accessToken,
        access_token_secret: twitConfig.accessSecret
    });

    //Bring in Models
    let Post = require('./models/post');


    //Schedule Posts

    const regex = /[T + : + -]/g;

    function schedulePost() {
        Post.find(function (err, post) {
            if (err) {
                console.log(err);
            } else {
                const date = post[0].date.split(regex);
                const deleted = date.splice(1, date.length);
                const reversed = deleted.reverse();
                const dateString = reversed.join(' ');

                const Post = schedule.scheduleJob(dateString + ' *', function () {

                    let tweet = {
                        status: post[0].body + '\n \n' + post[0].url
                    };

                    T.post('statuses/update', tweet, function (err, data, response) {

                        console.log(tweet);
                        if (err) {
                            console.log(err);
                        }
                    });
                    post[0].remove();
                    schedulePost();
                });
            }
        });
    }
    schedulePost();

    console.log('The bot is starting');
};