var csv = require('csv');
var fs = require('fs');
var path = require('path');
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

    var data = fs.readFileSync(path.join(__dirname, '../files/export.csv'));

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
                                return term.replace(/\s+/, "");
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
            console.log(quote);
            Quote.findOne({text:quote.quoteText}, function (err, doc) {
                if (err) throw err;
                if (doc) {
                    console.log(`Duplicate was found. Ignore ${quote.uuid}. Duplicate: ${doc._id}`);
                    resolve(doc);
                } else {
                    console.log('We need to create quote, lets check for author');

                    giveMeAuthorId(quote.authorText).then(authorId => {

                        console.log(`Author found ${authorId}, lets check for terms`);

                        giveMeTermsIds(quote.tagsText).then(termsIds => {

                            console.log(`Tags found ${termsIds}, lets check for topics`);

                            giveMeTopicsIds(quote.topicsText).then(topicsIds => {
                                console.log(`Topics found ${topicsIds}, NO WE CAN CREATE QUOTE`);

                                const q = {
                                    howfinder: {
                                        uid: quote.uuid,
                                        questions: quote.questionsReferenceIds,
                                    },
                                    text: quote.quoteText,
                                    termsId: termsIds,
                                    topicsId: topicsIds,
                                    authorId: authorId,
                                }

                                Quote.create(q).then((result) => {
                                    resolve(result._id);
                                });
                            })

                        })

                    });

                }

            });
        } else {
            resolve();
        }
    })
}

function giveMeAuthorId(name) {
    console.log('looking for "'+name+'" ...');
    return new Promise((resolve, reject) => {
        Author.findOne({name: name}, (err, doc) => {
            if (doc) {
                console.log('Author was found '+doc._id+' , we can proceed');
                resolve(doc._id);
            } else {
                console.log('We need to create author:'+name);

                Author.insert({name:name}, (err, doc) => {
                    resolve(doc._id);
                })
            }
        })
    })
}

function giveMeTermsIds(terms) {
    console.log('looking for "'+terms+'" ...');

    terms = String(terms).split(',');

    if (terms.length > 1) {
        terms = terms.map( (term) => {
            return term.replace(/\s+/, "");
        });
    } else {
        terms = [terms];
    }
    console.log(terms);

    return new Promise((resolve, reject) => {

        const termsPromises = terms.map((term) => {
            return lookForTermIfNotFoundThenCreate(term);
        });

        Promise.all(termsPromises).then(termIds => {
            resolve(termIds);
        })


    });
}

function lookForTermIfNotFoundThenCreate(term) {
    return new Promise((resolve, reject) => {

        Term.findOne({name: term }).then(result => {
            if (result) {
                resolve(result._id)
            } else {
                Term.create({name:term}).then(result => {
                    console.log(`New terms was created`);
                    resolve(result._id)
                })
            }
        });

    })
}


function giveMeTopicsIds(topics) {

    console.log('looking for '+topics+'...');

    topics = topics.split(',');

    if (topics.length > 1) {
        topics = topics.map( (topic) => {
            return topic.replace(/\s+/, "");
        });
    } else {
        topics = [topics];
    }

    return new Promise((resolve, reject) => {

        const topicsPromises = topics.map((topic) => {
            return lookForTopicIfNotFoundThenCreate(topic);
        });

        Promise.all(topicsPromises).then(topicsIds => {
            resolve(topicsIds);
        })


    });
}

function lookForTopicIfNotFoundThenCreate(topic) {
    return new Promise((resolve, reject) => {

        Topic.findOne({name: topic }).then(result => {
            if (result) {
                resolve(result._id)
            } else {
                Topic.create({name:topic}).then(result => {
                    console.log(`New topics was created`);
                    resolve(result._id)
                })
            }
        });

    })
}