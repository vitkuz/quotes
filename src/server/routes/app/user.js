const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../schemas/User');

const controller = require('../../controllers/app/user');

router.post('/login', controller.login);
router.get('/login', controller.loginPage);
router.post('/register', controller.register);
router.get('/register', controller.registerPage);
router.get('/logout', controller.logout);

/* GET ALL PRODUCTS */
router.get('/', function(req, res, next) {
    User.find(function (err, results) {
        if (err) return next(err);
        res.json(results);
    });
});

/* GET SINGLE PRODUCT BY ID */
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* SAVE PRODUCT */
router.post('/', function(req, res, next) {
    User.create(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* UPDATE PRODUCT */
router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

/* DELETE PRODUCT */
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});



module.exports = router;