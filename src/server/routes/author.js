const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = require('../schemas/Author');

/* GET ALL PRODUCTS */
router.get('/', function(req, res, next) {
    Author.find(function (err, results) {
        if (err) return next(err);
        res.json(results);
    });
});

/* GET SINGLE PRODUCT BY ID */
router.get('/:id', function(req, res, next) {
    Author.findById(req.params.id, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* SAVE PRODUCT */
router.post('/', function(req, res, next) {
    Author.create(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* UPDATE PRODUCT */
router.put('/:id', function(req, res, next) {
    Author.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* DELETE PRODUCT */
router.delete('/:id', function(req, res, next) {
    Author.findByIdAndRemove(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

module.exports = router;