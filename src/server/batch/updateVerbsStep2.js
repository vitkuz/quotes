const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Noun = require('../schemas/Noun');
const Verbs = require('../schemas/Verb');

var count = 0;

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb');

    Quote.find({}, function (err, results) {

        const verbs = {};

        results.forEach( (quote) => {
            quote.verbs.forEach( (verb) => {
                // verbs[verb] = verb();
                verbs[verb] = verb.toLowerCase();
            });
        });

        let allTheVerbs = [];

        for (var property in verbs) {
            if (verbs.hasOwnProperty(property)) {
                allTheVerbs.push({name: property});
            }
        }

        Verbs.insertMany(allTheVerbs).then( (r) => {
            console.log(r);
        });

    });
});

function updateQuotes(results) {

    return new Promise((resolve, reject) => {
        let iterator = 0;

        function updateNextQuote(quote) {
            if (quote) {
                updateQuote(results[iterator]).then( (result) => {
                    iterator++;
                    updateNextQuote(results[iterator]);
                    console.log(iterator / count * 100);
                })
            } else {
                resolve();
            }

        }

        updateNextQuote(results[iterator]);

    })
}

function updateQuote(quote) {

    return new Promise((resolve, reject) => {

        const verbsPromises = quote.verbs.map((innerTerms) => {
            return Term.findOne({name: innerTerms});
        });

        Promise.all(verbsPromises).then(verbs => {
            console.log('terms',verbs);
            const ids = verbs.map(verb => {
                console.log('term', verbs, verb.name, verb._id);
                console.log('id=',term._id);
                return term._id
            });

            console.log(ids);

            if (ids.length > 0) {
                Quote.findByIdAndUpdate(quote._id, {$set: {verbsId: ids}}, function (err, tank) {
                    if (err) throw err;
                    resolve(tank);
                });
            } else {
                resolve();
            }



        })


    })
}

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

