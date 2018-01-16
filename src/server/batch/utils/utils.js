var csv = require('csv');
var fs = require('fs');
var Az = require('az');

const natural = require('natural');
const porterStemmer = natural.PorterStemmerRu;
const classifier = new natural.BayesClassifier(porterStemmer);
const tokenizer = new natural.WordTokenizer();
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

const Topic = require('../../schemas/Topic');
const Term = require('../../schemas/Term');
const Verb = require('../../schemas/Verb');
const Author = require('../../schemas/Author');
const Noun = require('../../schemas/Noun');
const chalk = require('chalk');

function giveMeTopicsIds(topics) {

    return new Promise((resolve, reject) => {

        console.log(`Looking for '${topics}' ...`);

        if (topics === '') {
            const a = [];
            return resolve(a);
        }

        if (typeof topics !== 'object') {
            topics = topics.split(',');
        }

        if (topics.length > 1) {
            topics = topics.map( (topic) => {
                return topic.replace(/\s+/, "");
            });
        } else {
            topics = [topics];
        }


        const topicsPromises = topics.map((topic) => {
            return lookForTopicIfNotFoundThenCreate(topic);
        });

        Promise.all(topicsPromises).then(topicsIds => {
            console.log(`Topic ids: ${topicsIds}`);
            if (Array.isArray(topicsIds)) {
                resolve(topicsIds);
            } else {
                resolve([topicsIds]);
            }

        })


    });
}

function lookForTopicIfNotFoundThenCreate(topic) {
    return new Promise((resolve, reject) => {

        Topic.findOne({name: topic }).then(topic => {
            if (topic) {
                console.log('%s TOPIC was found: %s',topic._id, chalk.green('✓'));
                resolve(topic._id)
            } else {
                Topic.create({name:topic}).then(newTopic => {
                    console.log(`New TOPIC was created: ${newTopic._id}`);
                    resolve(newTopic._id)
                })
            }
        });

    })
}

function giveMeTermsIds(terms) {


    return new Promise((resolve, reject) => {

        console.log(`Looking for '${terms}' ...`);

        if (terms === '') {
            const a = [];
            return resolve(a);
        }

        if (typeof topics !== 'object') {
            terms = String(terms).split(',');
        }

        if (terms.length > 1) {
            terms = terms.map( (term) => {
                return term.replace(/\s+/, "");
            });
        } else {
            terms = [terms];
        }
        console.log(terms);

        const termsPromises = terms.map((term) => {
            return lookForTermIfNotFoundThenCreate(term);
        });

        Promise.all(termsPromises).then(termIds => {
            if (Array.isArray(termIds)) {
                resolve(termIds);
            } else {
                resolve([termIds]);
            }
        })


    });
}

function lookForTermIfNotFoundThenCreate(term) {
    return new Promise((resolve, reject) => {

        Term.findOne({name: term }).then(term => {
            if (term) {
                console.log('%s TERM was found: %s',term._id, chalk.green('✓'));
                resolve(term._id)
            } else {
                Term.create({name:term}).then(newTerm => {
                    console.log(`New TERM was created: ${newTerm._id}`);
                    resolve(newTerm._id)
                })
            }
        });

    })
}

function giveMeAuthorId(name) {

    console.log(`Looking for '${name}' ...`);

    return new Promise((resolve, reject) => {
        Author.findOne({name: name}, (err, author) => {
            if (author) {
                console.log('%s AUTHOR was found: %s',author._id, chalk.green('✓'));
                resolve(author._id);
            } else {
                Author.create({name:name}, (err, newAuthor) => {
                    console.log(`New AUTHOR was created: ${newAuthor._id}`);
                    resolve(newAuthor._id);
                })
            }
        })
    })
}

function giveMeVerbsIds(text) {
    return new Promise((resolve, reject) => {

        let tokens = Az.Tokens(text).done();

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

        const verbsPromises = verbs.map((verb) => {
            return lookForVerbIfNotFoundThenCreate(verb);
        });

        Promise.all(verbsPromises).then(verbsIds => {
            if (Array.isArray(verbsIds)) {
                resolve(verbsIds);
            } else {
                resolve([verbsIds]);
            }
        })

    })
}

function lookForVerbIfNotFoundThenCreate(verb) {
    return new Promise((resolve, reject) => {

        Verb.findOne({name: verb }).then(verb => {
            if (verb) {
                console.log('%s %s VERBS was found: %s', verb.name, verb._id, chalk.green('✓'));
                resolve(verb._id)
            } else {
                Verb.create({name:verb}).then(newVerb => {
                    console.log(`New VERBS was created: ${newVerb.name} ${newVerb._id}`);
                    resolve(newVerb._id)
                })
            }
        });

    })
}


function giveMeNounsIds(text) {

    return new Promise((resolve, reject) => {

        let words = tokenizer.tokenize(text);

        words = words.filter((word,i) => {
            return word.length >= 2;
        });

        const nouns = words.map((word) => {
            return Noun.findOne({name: word});
        })

        Promise.all(nouns).then(nouns => {
            nouns = nouns.filter(noun => {
                return noun != null;
            });
            console.log('Filtered nouns:',nouns);
            var nounsIds = nouns.map(noun => {
                console.log('%s %s NOUNS was found: %s', noun.name, noun._id, chalk.green('✓'));
                return noun._id;
            });
            if (Array.isArray(nounsIds)) {
                resolve(nounsIds);
            } else {
                resolve([nounsIds]);
            }
        })


    })
}

module.exports = {
    giveMeTopicsIds,
    lookForTopicIfNotFoundThenCreate,
    giveMeTermsIds,
    lookForTermIfNotFoundThenCreate,
    giveMeAuthorId,
    giveMeVerbsIds,
    giveMeNounsIds,
}