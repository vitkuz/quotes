const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const pug = require('pug');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');

const cookieParser = require('cookie-parser')
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);



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

const create = require('./routes/app/create');

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
const db = mongoose.connection;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}



/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('build'));
app.use(express.static('test'));


app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000);

app.use(cors());



app.use(cookieParser());
//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));



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

app.use('/create', create);

app.use('/profile', requiresLogin, (req,res,next) => {
    res.send('Its ok, you can view this page');
});

/**
 * Error Handler.
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('404', { title: 'Page Not Found'});
    } else {
        res.send(err.message);
    }

});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;