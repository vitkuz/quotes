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

        Quote.findByIdAndUpdate(quote._id, {$set: {userId: '5a400fed97e77d7f1b054263'}}, function (err, tank) {
            if (err) throw err;
            resolve(tank);
        });

    })
}

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

