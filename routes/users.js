const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../models/user');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger','You need to sign in for access to this page');
        res.redirect('/users/login');
    }
}

router.get('/login', ensureAuthenticated, function(req, res) {
   res.render('login', {
       title:'Login'
   });
});

router.get('/register', function(req, res) {
    res.render('register', {
        title:'Register'
    });
});

//Register new users

router.post('/register', function(req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title:'Register',
            errors:errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser,  function(err, user) {
           if (err) throw err;
           console.log(user);
        });

        req.flash('success', 'You are registered and can now login');
        res.redirect('/users/login');
    }
});

//Login

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
           if(err) throw err;
           if (!user) {
               return done(null, false, {message: 'User doesn\'t exist'});
           }

           User.comparePassword(password, user.password, function(err, isMatch) {
              if(err) throw err;
              if(isMatch) {
                  return done(null, user);
              } else {
                  return done(null, false, {message: 'Invalid Password'});
              }
           });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
   req.logout();
   req.flash('success', 'You are logged out');
   res.redirect('/users/login');
});


module.exports = router;