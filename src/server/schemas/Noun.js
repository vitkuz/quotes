const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema({
    name: String,
    variants: Array
});
Schema.plugin(timestamps);

module.exports = mongoose.model('Noun', Schema);