const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Term = require('../schemas/Term');

var count = 0;

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb');

    Quote.find({}, function (err, results) {
        count = results.length;
        updateQuotes(results).then(result => {
            console.log('all done', results);

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
                    //console.log(iterator / count * 100);
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

        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');
        console.log('===================================================');

        const termsPromises = quote.terms.map((innerTerms) => {
            let terms = innerTerms.split(',');

            if (terms.length > 1) {
                console.log('(terms.length > 1', terms);
                return terms.map( (term) => {
                    let term2 = term.replace(/\s+/, "");
                    console.log('term2',term2);
                    return Term.findOne({name: term2 });
                });
            } else {
                console.log('(terms.length = 1', innerTerms);
                return Term.findOne({name: innerTerms});
            }

        })

        Promise.all(termsPromises).then(terms => {
            console.log('terms',terms);
            const ids = terms.map(term => {
                console.log('term', terms, term.name, term._id);
                console.log('id=',term._id);
               return term._id
            });

            console.log(ids);

            if (ids.length > 0) {
                Quote.findByIdAndUpdate(quote._id, {$set: {termsId: ids}}, function (err, tank) {
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

