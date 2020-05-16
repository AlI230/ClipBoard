const mongoose = require('mongoose');

const archive = new mongoose.Schema({
    userSave: String,
    note: {
        title: {type: String, ref:'notes'},
        text: {type: String, ref:'notes'},
        username: {type: String, ref:'notes'}
    }
});

archive.set('toJSON', { virtuals: true });

module.exports = mongoose.model('archive', archive);