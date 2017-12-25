const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Noun = require('./Noun')

const Schema = mongoose.Schema({
    text: String,
    author: String,
    terms: Array,
    nouns: Array,
    verbs: Array,
    topic: Array,
    name: String,
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    rating: Number,
    nounsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Noun'
    }],
    termsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term'
    }],
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    verbsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Verb'
    }],
    questionId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
Schema.plugin(timestamps);

module.exports = mongoose.model('Quote', Schema);