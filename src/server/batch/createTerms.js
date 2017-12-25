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

        const terms = {}

        results.forEach( (quote) => {
            quote.terms.forEach( (term) => {
                const innnerTerms = term.split(',');
                if (innnerTerms.length > 1) {
                    innnerTerms.forEach( (term) => {
                        const customTerm = term.replace(/\s+/, "")
                        terms[customTerm] = customTerm;
                    });
                } else {
                    terms[term] = term;
                }

            });
        });

        let allTheTerms = [];

        for (var property in terms) {
            if (terms.hasOwnProperty(property)) {
                allTheTerms.push({name: property});
            }
        }

        Terms.insertMany(allTheTerms).then( (r) => {
            console.log(r);
        });

    });
});


mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

