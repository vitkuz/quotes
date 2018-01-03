const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});
Schema.plugin(timestamps);

module.exports = mongoose.model('User', Schema);