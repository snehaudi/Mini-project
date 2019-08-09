const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    title: String,
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    avatarurl: String,
    enableflag: Boolean,
    userlevel: Number

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);