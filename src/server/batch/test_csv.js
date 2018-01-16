var csv = require('csv');
var Az = require('az');
var fs = require('fs');
var path = require('path');
const { giveMeTopicsIds, giveMeTermsIds, giveMeAuthorId, giveMeVerbsIds, giveMeNounsIds } = require('./utils/utils');

const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');
const Author = require('../schemas/Author');
const Term = require('../schemas/Term');
const Topic = require('../schemas/Topic');
var count = 0;

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb');

    Az.Morph.init('node_modules/az/dicts', function() {

        var data = fs.readFileSync(path.join(__dirname, '../files/006-edison.csv'));
        // var data = fs.readFileSync(path.join(__dirname, '../files/002-goraci.csv'));
        // var data = fs.readFileSync(path.join(__dirname, '../files/005-Дейл-Карнеги.csv'));

        var headers = [];
        var customHeaders = ['uuid', 'questionsText','topicsText','questionsReferenceIds','authorText', 'tagsText', 'quoteText'];
        var collection = [];
        csv.parse(data, function(err, data){
            data.map(function(value, i){
                console.log('------------------');
                var object = {};
                if (i === 0) {
                    headers = value;
                } else {
                    value.forEach((x,j) => {
                        // console.log(customHeaders[j]+': ',x);
                        if (j === 5 || j === 2) {
                            let terms = x.split(',');

                            if (terms.length > 1) {
                                console.log('>1');
                                object[customHeaders[j]] = terms.map( (term) => {
                                    if (term) {
                                        return term.replace(/\s+/, "");
                                    } else {
                                        return [];
                                    }
                                });
                            } else {
                                object[customHeaders[j]] = x;
                            }

                        } else {
                            object[customHeaders[j]] = x;
                        }


                    })
                }
                collection.push(object);
            });

            updateQuotes(collection);
        });
    });

});




function updateQuotes(results) {
    count = results.length;

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




        if (quote.quoteText) {


            giveMeAuthorId(quote.authorText).then(authorId => {

                console.log(`Author: ${authorId}, lets check for terms`);

                giveMeTermsIds(quote.tagsText).then(termsIds => {

                    console.log(`Terms: ${termsIds}, lets check for topics`);

                    giveMeTopicsIds(quote.topicsText).then(topicsIds => {

                        console.log(`Topics: ${topicsIds}, lets check verbs`);


                        giveMeVerbsIds(quote.quoteText).then(verbsIds =>{
                            console.log(`Verbs: ${verbsIds}, lets check for nouns`);


                            giveMeNounsIds(quote.quoteText).then(nounsIds => {

                                console.log(`Nouns: ${nounsIds}, lets create/update quote`);

                                const q = {
                                    howfinder: {
                                        uid: quote.uuid,
                                        questions: quote.questionsReferenceIds,
                                    },
                                    text: quote.quoteText,
                                    termsId: termsIds,
                                    topicsId: topicsIds,
                                    nounsId: nounsIds,
                                    verbsId: verbsIds,
                                    authorId: authorId,
                                };

                                console.log(quote.quoteText);

                                Quote.findOneAndUpdate({text:quote.quoteText}, q, {upsert:true}, (err,result) => {
                                    if (err) console.log(err,result);
                                    console.log(result);
                                    resolve(result);
                                })
                            })



                        })




                    })

                })


            });
        } else {
            resolve();
        }
    })
}