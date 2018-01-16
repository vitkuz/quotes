const express = require('express');
const router = express.Router();;

const controller = require('../../controllers/app/quotes');

router.get('/quote', controller.renderQuoteAddForm);
router.post('/quote', controller.createQuote);


module.exports = router;