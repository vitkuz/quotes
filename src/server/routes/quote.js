const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = require('../schemas/Quote');

/* GROUP ALL QUOTES BY AUTHOR */
router.get('/authors', (req, res, next) => {

    Quote.aggregate([
        {
            $group: {
                _id: '$author',  //$author is the column name in collection
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result)
        }
    });

});

/* GET ALL PRODUCTS */
router.get('/', function (req, res, next) {
    Quote.find(function (err, results) {
        if (err) return next(err);
        res.json(results);
    });
});

/* GET SINGLE PRODUCT BY ID */
router.get('/:id', function (req, res, next) {
    Quote.findById(req.params.id, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* SAVE PRODUCT */
router.post('/', function (req, res, next) {
    Quote.create(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* UPDATE PRODUCT */
router.put('/:id', function (req, res, next) {
    Quote.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* DELETE PRODUCT */
router.delete('/:id', function (req, res, next) {
    Quote.findByIdAndRemove(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

//custom

router.get('/authors/:name', (req, res, next) => {
    console.log(req.params);
    const itemsOnThePage = 50;
    const skip = Number(itemsOnThePage * req.skip);
    const query = Quote.find({author: req.params.name}).skip(0).limit(100);

    query.exec((err, result) => {
        if (err) {
            next(err);
        } else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});

router.get('/authors/:name/:skip', (req, res, next) => {
    console.log(req.params);
    const itemsOnThePage = 2;
    const skip = Number(itemsOnThePage * req.params.skip);
    const query = Quote.find({author: req.params.name}).skip(skip).limit(itemsOnThePage);

    query.exec((err, result) => {
        if (err) {
            next(err);
        } else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});

router.get('/nouns/:name', (req, res, next) => {
    console.log(req.params);
    const itemsOnThePage = 50;
    const skip = Number(itemsOnThePage * req.skip);
    const query = Quote.find({nouns: req.params.name}).skip(20).limit(100);

    query.exec((err, result) => {
        if (err) {
            next(err);
        } else {
            console.log(result);
            res.status(200).json(result);
        }
    });

});


module.exports = router;