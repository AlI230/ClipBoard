const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../middleware/passport')(passport)

router.get('/login', (req, res)=> {
    res.render('login');
});

router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});

router.get('/signup', (req, res)=> {
    res.render('signup');
});

router.post('/signup', (req, res)=> {
    if (req.body.username && req.body.name && req.body.firstname && req.body.email && req.body.password != null) {   
        User.findOne({ email : req.body.email }, (err, user)=> {
            if(err) return req.flash('error', 'something went wrong');
            if(user){
                req.flash('error_msg' ,'email already used');
                res.redirect('/user/signup');
            } else {
                User.findOne({ username : req.body.username }, (err, user)=> {
                    if(err) return req.flash('error', 'Something went wrong');
                    if (user) {
                        req.flash('error_msg', 'username already used');
                        req.redirect('/user/signup');
                    } else  {

                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(req.body.password, salt);

                        var user = new User();

                        user.username = req.body.username;
                        user.lastname = req.body.name;
                        user.firstname = req.body.firstname;
                        user.email = req.body.email;
                        user.password = hash;

                    user.save();
                    req.flash('success_msg', 'Succesfully created account');
                    res.redirect(`/`);
                    }
                });
            }
        });
    } else {
       req.flash('error_msg', 'Please enter all fields');
       res.redirect('/user/signup');
    }
});

module.exports = router