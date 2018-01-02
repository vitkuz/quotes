const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Verb = require('../schemas/Verb');

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

        const verbsPromises = quote.verbs.map((verb) => {
            return Verb.findOne({name: verb});
        });

        Promise.all(verbsPromises).then(verbs => {
            console.log('verbs',verbs);
            const ids = verbs.map(verb => {
                console.log('verb', verbs, verb.name, verb._id);
                console.log('id=',verb._id);
                return verb._id
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

