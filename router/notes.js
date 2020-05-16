const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Note = require('../models/notes');
const Archive = require('../models/archive');

router.get('/write', (req, res)=> {
    res.render('write', {user: req.user});
});

router.post('/write', (req, res)=> {
    if(req.body.title && req.body.text && req.body.username != null ) {
        if(req.user.username === req.body.username) {
            Note.findOne({title: req.body.title}, (err, note)=> {
                if(err) return req.flash('error_msg', 'Someting went wrong');
                if(note) {
                    req.flash('error_msg', 'Title already exist');
                    res.redirect('/notes/write');
                } else {
                    const note = new Note()

                    note.title = req.body.title;
                    note.text = req.body.text;
                    note.username = req.body.username;

                    note.save();
                    req.flash('success_msg', 'Succesfully created a note');
                    res.redirect('/');
                }
            });
        } else {
            req.flash('error_msg', 'You cannot use an other username');
            res.redirect('/notes/write');
        }
    } else {
        req.flash('error_msg' ,'Please enter all fields');
        res.redirect('/notes/write');
    }
});

router.get('/archive', (req, res)=> {
    Archive.find({userSave: req.user.username}, (err, notes)=> {
        if(err) return req.flash('error_msg', 'Something went wrong');
        if(notes) {
            res.render('archive', {notes: notes});
        } else {
            res.render('archive', {notes: false});
        }
    });
});

router.post('/archive/:username/:title', (req, res)=> {
    Note.findOne({username: req.params.username, title: req.params.title}, (err, note)=> {
        if(err) req.flash('error_msg', 'Something went wrong');
        if(note) {
            Archive.findOne({userSave: req.user.username}, (err, archive)=> {
                if(err) req.flash('error_msg', 'Something went wrong');
                if(archive) {
                    if(archive.note.title === req.params.title) {
                        req.flash('error_msg', 'Note already saved');
                        res.redirect('/');
                    } else {
                        const archive = new Archive();

                        archive.userSave = req.user.username;
                        archive.note.title = note.title;
                        archive.note.text = note.text;
                        archive.note.username = note.username;
    
                        archive.save();
                        req.flash('success_msg', 'Note saved in Archive');
                        res.redirect('/');
                    }
                } else {
                    const archive = new Archive();

                    archive.userSave = req.user.username;
                    archive.note.title = note.title;
                    archive.note.text = note.text;
                    archive.note.username = note.username;

                    archive.save();
                    req.flash('success_msg', 'Note saved in Archive');
                    res.redirect('/');
                }
                   
            });
        }
    })
});

router.post('/delete/:title', (req, res)=> {
    Note.findOne({username: req.user.username}, (err, user)=> {
        if(err) return req.flash('error_msg', 'Something went wrong'); 
        if(user) {
            Note.findOneAndRemove({title: req.params.title}, (err, note)=> {
                if(err) return req.flash('error_msg', 'Deleting failed');
                req.flash('success_msg', 'Note deleted')
                res.redirect('/');
            });
        } 
        if(!user) {
            req.flash('error_msg', 'You cannot delete others notes');
            res.redirect('/');
        }
    });
});

router.get('/usernotes', (req, res)=> {
    Note.find({username: req.user.username}, (err, notes)=> {
        if(err) return req.flash('error_msg', 'Sometinh went wrong');
        if(!notes || notes.length === 0) {
            res.render('usernotes', {notes: false});
        } else {
            res.render('usernotes', {notes: notes});
        }
    });
});

router.post('/usernotes/delete/:title', (req, res)=> {
    Note.findOne({username: req.user.username}, (err, user)=> {
        if(err) return req.flash('error_msg', 'Something went wrong'); 
        if(user) {
            Note.findOneAndRemove({title: req.params.title}, (err, note)=> {
                if(err) return req.flash('error_msg', 'Deleting failed');
                req.flash('success_msg', 'Note deleted')
                res.redirect('/notes/usernotes');
            });
        } 
        if(!user) {
            req.flash('error_msg', 'You cannot delete others notes');
            res.redirect('/notes/usernotes');
        }
    });
});

module.exports = router;