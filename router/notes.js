const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Note = require('../models/notes')

router.get('/write', (req, res)=> {
    res.render('write');
});

router.post('/write', (req, res)=> {
    let errors = [];
    if(req.body.title || req.body.text || req.body.username != null ) {
        if(req.user.username === req.body.username) {
            const note = new Note()

            note.title = req.body.title;
            note.text = req.body.text;
            note.username = req.body.username;

            note.save();
            res.redirect('/')
        } else {
            req.flash('error_msg', 'You cannot use an other username')
        }
    } else {
        errors.push({msg: 'Please enter all fields'});
    }
});

router.get('/archive', (req, res)=> {
    res.render('archive')
});

router.post('/delete/:title', (req, res)=> {
    Note.findOne({username: req.user.username}, (err, user)=> {
        if(err) return req.flash('error_msg', 'Something went wrong'); 
        if(user) {
            Note.findOneAndRemove({title: req.params.title}, (err, note)=> {
                if(err) return req.flash('error_msg', 'Deleting failed');
                res.redirect('/')
            });
        } else {
            req.flash('error_msg', 'You cannot delete others notes');
        }
    });
});

router.get('/usernotes', (req, res)=> {
    Note.find({username: req.user.username}, (err, notes)=> {
        if(err) return req.flash('error_msg', 'Sometinh went wrong');
        if(notes) {
            res.render('usernotes', {notes: notes});
        } else {
            res.render('usernotes', {notes: false});
        }
    });
});

module.exports = router;