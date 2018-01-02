const Az = require('az');
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

    Az.Morph.init('node_modules/az/dicts', function() {

        Quote.find({}, function (err, results) {
            count = results.length;
            updateQuotes(results).then(result => {
                console.log('all done', results);

            });

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

        let tokens = Az.Tokens(quote.text).done();

        const words = [];

        tokens.forEach(token => {
            if ((token.type === Az.Tokens.WORD) && (token.subType === Az.Tokens.CYRIL)) {
                words.push(token.source.slice(token.st, token.st+token.length));
            }
        });

        const verbs = [];

        words.forEach((w) => {
            var parses = Az.Morph(w);

            if (!parses[0]) {
                console.log('!',w);

            } else {
                if (parses[0].tag.POST == 'VERB') {
                    verbs.push(w);
                }
            }

        });

        console.log(verbs);

        Quote.findByIdAndUpdate(quote._id, {$set: {verbs: verbs}}, function (err, tank) {
            if (err) throw err;
            resolve(tank);
        });


    })
}

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from mongodb');
});

