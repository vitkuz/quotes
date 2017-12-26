const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');

const conf = require('./config');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('%s Connected to mongodb', chalk.green('✗'));
});
mongoose.connection.on('disconnected', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

const articles = require('./routes/article');
const nouns = require('./routes/noun');
const questions = require('./routes/question');
const quotes = require('./routes/quote');
const terms = require('./routes/term');
const users = require('./routes/user');
const authors = require('./routes/author');

const User = require('./schemas/User');

function checkAuth(req,res,next) {
    console.log('TODO:protect admin routs')
    next()
}

app.use((req, res, next) => {
    console.log('NODE_ENV',conf.env);
    next();
});

app.use(cors());
app.use(express.static('build'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/articles', (req,res,next) => {
    res.sendFile(__dirname+'/html/articles.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/nouns', (req,res,next) => {
    res.sendFile(__dirname+'/html/nouns.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/questions', (req,res,next) => {
    res.sendFile(__dirname+'/html/questions.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/quotes', (req,res,next) => {
    res.sendFile(__dirname+'/html/quotes.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/terms', (req,res,next) => {
    res.sendFile(__dirname+'/html/terms.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/users', (req,res,next) => {
    res.sendFile(__dirname+'/html/users.html', (err) => {
        res.status(500).send(err);
    });
});

app.get('/test', checkAuth, (req,res,next) => {
    const pageTitle = 'Page title';

    const renderRows = (rows) => {
        let result = ``;

        rows.forEach(row => {
            result += `<div>${row._id} - ${row.name}</div>`
        })

        return result;
    };

    User.find(function (err, results) {
        if (err) return next(err);
        res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>${pageTitle}</title>
                </head>
                <body>
                <h1>${pageTitle}</h1>
                ${renderRows(results)}
                </body>
                </html>
        `);
    });


});

app.use('/api/articles', articles);
app.use('/api/nouns', nouns);
app.use('/api/questions', questions);
app.use('/api/quotes', quotes);
app.use('/api/authors', authors);
app.use('/api/terms', terms);
app.use('/api/users', users);

app.use( (err,req,res,next) => {
    if (err) {
        console.log(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});