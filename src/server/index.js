const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const pug = require('pug');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');

//API
const apiArticles = require('./routes/api/article');
const apiNouns = require('./routes/api/noun');
const apiQuestions = require('./routes/api/question');
const apiQuotes = require('./routes/api/quote');
const apiTerms = require('./routes/api/term');
const apiUsers = require('./routes/api/user');
const apiAuthors = require('./routes/api/author');

//APP
const articles = require('./routes/app/article');
const nouns = require('./routes/app/noun');
const questions = require('./routes/app/question');
const quotes = require('./routes/app/quote');
const terms = require('./routes/app/term');
const users = require('./routes/app/user');
const authors = require('./routes/app/author');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://localhost/nouns', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log('%s Connected to mongodb', chalk.green('✓'));
});
mongoose.connection.on('disconnected', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

const app = express();

function checkAuth(req,res,next) {
    console.log('TODO:protect admin routs')
    next()
}

/**
 * Express configuration.
 */
// app.use(express.static(path.join(__dirname, 'build'), { maxAge: 31557600000 }));
app.use(express.static('build'));
app.use((req, res, next) => {
    next();
});

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000);

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/articles', apiArticles);
app.use('/api/nouns', apiNouns);
app.use('/api/questions', apiQuestions);
app.use('/api/quotes', apiQuotes);
app.use('/api/authors', apiAuthors);
app.use('/api/terms', apiTerms);
app.use('/api/users', apiUsers);

app.use('/articles', articles);
app.use('/nouns', nouns);
app.use('/questions', questions);
app.use('/quotes', quotes);
app.use('/authors', authors);
app.use('/terms', terms);
app.use('/users', users);

app.use( (err,req,res,next) => {
    if (err) {
        console.log(err);
    }
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;