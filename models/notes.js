const mongoose = require('mongoose');

const notes = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    username: {
        type: String
    },
    date: {
        type: mongoose.Schema.Types.Date
    }
});

notes.set('toJSON', { virtuals: true });

module.exports = mongoose.model('note', notes);