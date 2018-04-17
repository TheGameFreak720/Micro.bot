const express = require('express');
const router = express.Router();

router.get('/login', function(req, res) {
   res.render('login', {
       title:'Login'
   });
});

router.get('/register', function(req, res) {
    res.render('register', {
        title:'Register'
    });
});

module.exports = router;