const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = require('../../schemas/Author');

const pageLimit = 100;

/* GET ALL PRODUCTS */
router.get('/', function(req, res, next) {

    const base = req.path;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = req.query.page ? pageLimit * page : 0;

    Promise.all([
        Author.find({})
        // .sort({date:-1})
        .limit(pageLimit)
        .skip(skip)
        .exec(),
        Author.count({})
    ]).then((results) => {
        const authors = results[0];
        const count = results[1];
        const pages = Math.floor(count / pageLimit);

        let paginator = [];

        for (var i = 1; i <= pages; i++) {

            let classes = '';

            if (i === 1) {
                classes += 'first '
            }

            if (i === page) {
                classes += 'active '
            }

            if (i === pages) {
                classes += 'last '
            }


            paginator.push({
                id: i,
                classes
            })
        }

        console.log(paginator);

        res.render('authors', {page:{
            authors,
            paginator
        }});
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