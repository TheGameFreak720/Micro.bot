const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const bodyValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'Body should be between 1 to 200 characters'
    })
];

const articleSchema = mongoose.Schema({
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

const Article = module.exports = mongoose.model('Article', articleSchema);