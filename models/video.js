const mongoose = require('mongoose');
var validate = require('mongoose-validator');

var bodyValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'Body should be between 1 to 200 characters'
    })
];

//Video Schema
const videoSchema = mongoose.Schema({
    body:{
        type: String,
        required: true,
        validate: bodyValidator
    },
    link:{
        type: String,
        required: true
    }
});

const Video = module.exports = mongoose.model('Video', videoSchema);