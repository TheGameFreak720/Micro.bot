const express = require('express');
const router = express.Router();

//Add Route
router.get('/add', function(req, res) {
    res.render('add_post', {
        title: 'Add Post'
    });
});

module.exports = router;