const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quote = require('../../schemas/Quote');
const controller = require('../../controllers/app/quotes');

/* GROUP ALL QUOTES BY AUTHOR */
router.get('/aggregate/author', controller.aggregateQuotesByAuthor);
router.get('/aggregate/term', controller.aggregateQuotesByTerm);
router.get('/aggregate/noun', controller.aggregateQuotesByNoun);
router.get('/aggregate/noun', controller.aggregateQuotesByNoun);
router.get('/aggregate/duplicates', controller.aggregateQuotesBySimilarText);

/* GET ALL QUOTES */
router.get('/', controller.getAllQuotes);
// router.get('/:page', controller.getAllQuotes);

/* GET SINGLE QUOTES BY ID */
router.get('/:id', controller.getQuoteById);

/* SAVE QUOTE */
router.post('/', controller.createQuote);

/* UPDATE QUOTE */
router.put('/:id', controller.updateQuoteById);

/* DELETE QUOTE */
router.delete('/:id', controller.removeQuoteById);

//custom

router.get('/authors/', controller.aggregateQuotesByAuthor);
router.get('/authors/:name', controller.getQuotesByAuthor);

router.get('/nouns/:name', controller.getQuotesByNoun);

router.get('/terms/:name', controller.getQuotesByTerm);


module.exports = router;