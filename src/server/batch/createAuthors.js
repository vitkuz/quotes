const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Noun = require('../schemas/Noun');
const Author = require('../schemas/Author');

var count = 0;

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb');

    Quote.find({}, function (err, results) {

        const authors = {}

        results.forEach( (item) => {
            authors[item.author] = item.author;
        });

        let allTheAuthors = [];

        for (var property in authors) {
            if (authors.hasOwnProperty(property)) {
                allTheAuthors.push({name: property});
            }
        }

        Author.insertMany(allTheAuthors).then( (r) => {
            console.log(r);
        });

    });
});


mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

