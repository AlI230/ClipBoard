const mongoose = require('mongoose');

const users = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    username: {
        type: String,
        required: true

    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

users.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', users);