const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Noun = require('./Noun');
const Verb = require('./Verb');
const Topic = require('./Topic');

const Schema = mongoose.Schema({
    howfinder: {
        uid: String,
        questions: Array,
    },
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
    upvote: Number,
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    nounsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Noun'
    }],
    termsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term'
    }],
    topicsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
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