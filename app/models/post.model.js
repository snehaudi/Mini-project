const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    categoryID: String,
    remarks: String,
    publish: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);