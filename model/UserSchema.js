const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    nicNumber: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regDate: {
        type: String,
        required: true
    },
    regTime: {
        type: String,
        required: true
    },
    userState: {
        type: Boolean,
        required: true,
        default: true
    },
});

module.exports = mongoose.model('User', UserSchema);
