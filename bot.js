const express = require('express');
const Twit = require('twit');
const request = require('request');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const twitConfig = require('./config/twit');
const emailConfig = require('./config/email');

module.exports = function bot() {

    let T = new Twit({
        consumer_key: twitConfig.consumerKey,
        consumer_secret: twitConfig.consumerSecret,
        access_token: twitConfig.accessToken,
        access_token_secret: twitConfig.accessSecret
    });

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    });

    let mailOptions = {
        from: 'cyanide6033@gmail.com',
        to: 'luis.alvarez@commithub.com',
        subject: 'Micro.bot has no more posts',
        text: 'Log in to Micro.bot and add a few new posts.'
    };


    //Bring in Models
    let Post = require('./models/post');


    //Schedule Posts

    const regex = /[T + : + -]/g;

    let dailySchedule = schedule.scheduleJob('0 0 * * *', function(){
        schedulePost();
    });

    function schedulePost() {
        Post.find({}).sort('date').exec(function (err, post) {
            if (err) {
                console.log(err);
            }
            if (!post.length) {
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            } else {
                console.log('Post have been rescheduled successfully');

                //Format the DB date string to schedule it
                let date = post[0].date.split(regex);
                let deleted = date.splice(1, date.length);
                let reversed = deleted.reverse();
                let dateString = reversed.join(' ');

                let queuePost = schedule.scheduleJob(dateString + ' *', function () {

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
                    //Makes sure that when we try to run the function again the post is removed completely. It also ensures no spam so win win
                    let wait = setInterval(function() {
                       clearInterval(wait);
                       schedulePost();
                    }, 30000);
                });
            }
        });
    }
    schedulePost();
};