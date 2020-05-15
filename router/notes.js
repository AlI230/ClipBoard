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
        User.findOne({username: req.body.username}, (err, user)=> {
            if(err) return req.flash({error_msg: 'Something went wrong'});
            if(!user) return errors.push({msg: 'Username not registered'});
            if(user) {
                const note = new Note();

                note.title = req.body.title;
                note.text = req.body.text;
                note.username = req.body.username;

                note.save();
                res.redirect('/')
            }
        });
    } else {
        errors.push({msg: 'Please enter all fields'});
    }
});

router.get('/archive', (req, res)=> {
    res.render('archive')
});

module.exports = router;