const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema({
    name: String,
    description: String,
    type: Array,
    wiki: String,
});
Schema.plugin(timestamps);

module.exports = mongoose.model('Author', Schema);