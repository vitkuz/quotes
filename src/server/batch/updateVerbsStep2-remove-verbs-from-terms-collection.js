const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Noun = require('../schemas/Noun');
const Terms = require('../schemas/Term');

var count = 0;

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb');

    Quote.find({}, function (err, results) {

        const verbs = {};

        results.forEach( (quote) => {
            quote.verbs.forEach( (verb) => {
                verbs[verb] = verb;
                // verbs[verb] = verb.toLowerCase();
            });
        });

        let allTheVerbs = [];

        for (var property in verbs) {
            if (verbs.hasOwnProperty(property)) {
                allTheVerbs.push({name: property});
            }
        }



        updateQuotes(allTheVerbs).then(result => {
            console.log('all done', results);
        });

    });
});

function updateQuotes(allTheVerbs) {

    count = allTheVerbs.length;

    return new Promise((resolve, reject) => {
        let iterator = 0;


        function updateNextQuote(verb) {
            if (verb) {
                updateQuote(allTheVerbs[iterator]).then( (result) => {
                    iterator++;
                    updateNextQuote(allTheVerbs[iterator]);
                    console.log(iterator / count * 100);
                })
            } else {
                resolve();
            }

        }

        updateNextQuote(allTheVerbs[iterator]);

    })
}

function updateQuote(verb) {

    return new Promise((resolve, reject) => {
        console.log('try to find', verb.name);

        Terms.findOne({name:verb.name}, function (err, doc) {
            console.log('found', doc);

            Terms.findByIdAndRemove(doc._id, function (err, result) {
               resolve(result);
            });
        });
    })
}

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

