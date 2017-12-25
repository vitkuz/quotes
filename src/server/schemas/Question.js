const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema({
    name: String,
});
Schema.plugin(timestamps);

module.exports = mongoose.model('Question', Schema);