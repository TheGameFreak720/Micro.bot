const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
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

//Set Storage Engine
const storage = multer.diskStorage({
    destination: 'public/img',
    filename: function(req, file, cb) {
        cb(null, 'profile.png')
    }
});

//Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

//Check file type
function checkFileType(file, cb) {
    //allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

router.get('/login', function(req, res) {
   res.render('login', {
       title:'Login'
   });
});

router.get('/loginFailed', function(req, res) {
   req.flash('danger', 'Username or password is incorrect');
   res.redirect('/users/login')
});

router.get('/register', ensureAuthenticated, function(req, res) {
    res.render('register', {
        title:'Register'
    });
});

router.get('/profile', ensureAuthenticated, function(req, res) {
    let user = req.user;

    res.render('profile', {
        title:'Profile',
        user: user
    });
});

router.get('/edit-profile', ensureAuthenticated, function(req, res) {
    res.render('edit_profile', {
        title:'Edit Profile'
    });
});

router.get('/change-password', ensureAuthenticated, function(req, res) {
    res.render('change_password', {
        title:'Change Password'
    });
});


router.post('/edit-profile', ensureAuthenticated, function(req, res) {
   upload(req, res, function (err) {
        if (err) {
            req.flash('danger', 'Error uploading file');
            res.redirect('/users/edit-profile');
        } else {
            req.flash('success', 'You have successfully edited the profile');
            res.redirect('/users/profile');
        }
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

    User.findOne({'username': username}, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            req.flash('danger', 'Username already exists!');
            res.redirect('/users/register');
        } else if (errors) {
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
                if (err) {
                    if (err) throw err;
                    console.log(user);
                }
            });

            req.flash('success', 'You are registered and can now login');
            res.redirect('/users/login');
        }
    });
});

//Login

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
           if(err) throw err;
           if (!user) {
               return done(null, false);
           }

           User.comparePassword(password, user.password, function(err, isMatch) {
              if(err) throw err;
              if(isMatch) {
                  return done(null, user);
              } else {
                  return done(null, false);
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

router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/users/loginFailed'}), function(req, res) {
    res.redirect('/dashboard');
});

router.get('/logout', function(req, res) {
   req.logout();
   req.flash('success', 'You are logged out');
   res.redirect('/users/login');
});


module.exports = router;