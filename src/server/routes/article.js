const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../schemas/Article.js');

/* GET ALL PRODUCTS */
router.get('/', function(req, res, next) {
    Article.find(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* GET SINGLE PRODUCT BY ID */
router.get('/:id', function(req, res, next) {
    Article.findById(req.params.id, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
});

/* SAVE PRODUCT */
router.post('/', function(req, res, next) {
    Article.create(req.body, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
});

/* UPDATE PRODUCT */
router.put('/:id', function(req, res, next) {
    Article.findByIdAndUpdate(req.params.id, req.body, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
});

/* DELETE PRODUCT */
router.delete('/:id', function(req, res, next) {
    Article.findByIdAndRemove(req.params.id, req.body, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
});

module.exports = router;