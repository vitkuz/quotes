const Quote = require('../../schemas/Quote');
const Term = require('../../schemas/Term');
const Noun = require('../../schemas/Noun');
const Author = require('../../schemas/Author');

const pageLimit = 30;

exports.getAllQuotes = (req, res, next) => {

    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = req.query.page ? pageLimit * page : 0;

    Promise.all([
        Quote.find({})
            .populate('termsId')
            .populate('authorId')
            .populate('verbsId')
            .populate({path:'nounsId', select:'name'})
            .limit(pageLimit)
            .skip(skip)
            .exec(),
        Quote.count({})
    ]).then((results) => {
        const count = results[1];
        const data = results[0];
        const pages = Math.ceil(count / pageLimit) - 1;
        res.status(200).json({
            count,
            data,
            page,
            pages,
        });
    });

};

exports.updateQuoteById = (req, res, next) => {
    Quote.findByIdAndUpdate(req.params._id, req.body, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
};

exports.getQuoteById = (req, res, next) => {
    Quote.findById(req.params.id, req.body, function (err, article) {
        if (err) return next(err);
        res.json(article);
    });
};

exports.createQuote = (req, res, next) => {
    Quote.create(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.removeQuoteById = (req, res, next) => {
    Quote.findByIdAndRemove(req.params.id, req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.getQuotesByAuthor = (req, res, next) => {

    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = req.query.page ? pageLimit * page : 0;

    console.log(`page ${page}, skip  ${skip}`);

    if (req.params.name && req.params.name.length === 24) {
        Promise.all([
            Quote.find({authorId: req.params.name})
                .populate('termsId')
                .populate('authorId')
                .populate('verbsId')
                .populate({path:'nounsId', select:'name'})
                .limit(pageLimit)
                .skip(skip)
                .exec(),
            Quote.count({authorId: req.params.name})
        ]).then((results) => {
            const count = results[1];
            const data = results[0];
            console.log(data.length);
            const pages = Math.ceil(count / pageLimit) - 1;
            res.status(200).json({
                count,
                data,
                page,
                pages,
            });
        });
    } else {
        Author.findOne({name:req.params.name}).then((author) => {
            Promise.all([
                Quote.find({authorId: author._id})
                    .populate('termsId')
                    .populate('authorId')
                    .populate('verbsId')
                    .populate({path:'nounsId', select:'name'})
                    .limit(pageLimit)
                    .skip(skip)
                    .exec(),
                Quote.count({authorId: author._id})
            ]).then((results) => {
                const count = results[1];
                const data = results[0];
                console.log('else',data.length);
                const pages = Math.ceil(count / pageLimit) - 1;
                res.status(200).json({
                    count,
                    data,
                    page,
                    pages,
                });
            });
        })
    }



};

exports.getQuotesByNoun =  (req, res, next) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = req.query.page ? pageLimit * page : 0;

    if (req.params.name && req.params.name.length === 24) {
        Promise.all([
            Quote.find({nounsId: req.params.name})
                .populate('termsId')
                .populate('authorId')
                .populate('verbsId')
                .populate({path:'nounsId', select:'name'})
                .limit(pageLimit)
                .skip(skip)
                .exec(),
            Quote.count({nounsId: req.params.name})
        ]).then((results) => {
            const count = results[1];
            const data = results[0];
            const pages = Math.ceil(count / pageLimit) - 1;
            res.status(200).json({
                count,
                data,
                page,
                pages,
            });
        });
    } else {
        Noun.findOne({name:req.params.name}).then((noun) => {
            Promise.all([
                Quote.find({nounsId: noun._id})
                    .populate('termsId')
                    .populate('authorId')
                    .populate('verbsId')
                    .populate({path:'nounsId', select:'name'})
                    .limit(pageLimit)
                    .skip(skip)
                    .exec(),
                Quote.count({nounsId: noun._id})
            ]).then((results) => {
                const count = results[1];
                const data = results[0];
                const pages = Math.ceil(count / pageLimit) - 1;
                res.status(200).json({
                    count,
                    data,
                    page,
                    pages,
                });
            });
        })
    }
};

exports.getQuotesByTerm =  (req, res, next) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = req.query.page ? pageLimit * page : 0;

    console.log(req.params.name);

    if (req.params.name && req.params.name.length === 24) {
        Promise.all([
            Quote.find({termsId: req.params.name})
                .populate('termsId')
                .populate('authorId')
                .populate('verbsId')
                .populate({path:'nounsId', select:'name'})
                .limit(pageLimit)
                .skip(skip)
                .exec(),
            Quote.count({termsId: req.params.name})
        ]).then((results) => {
            const count = results[1];
            const data = results[0];
            const pages = Math.ceil(count / pageLimit) - 1;
            res.status(200).json({
                count,
                data,
                page,
                pages,
            });
        });
    } else {
        Term.findOne({name:req.params.name}).then((term) => {
            console.log(term);
            Promise.all([
                Quote.find({termsId: term._id})
                    .populate('termsId')
                    .populate('authorId')
                    .populate('verbsId')
                    .populate({path:'nounsId', select:'name'})
                    .limit(pageLimit)
                    .skip(skip)
                    .exec(),
                Quote.count({termsId: term._id})
            ]).then((results) => {
                const count = results[1];
                const data = results[0];
                const pages = Math.ceil(count / pageLimit) - 1;
                res.status(200).json({
                    count,
                    data,
                    page,
                    pages,
                });
            });
        });
    }




};

exports.aggregateQuotesByAuthor = (req, res, next) => {

    Quote.aggregate([
        {
            $group: {
                _id: '$authorId',  //$author is the column name in collection
                count: {$sum: 0}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result)
        }
    });

};

exports.aggregateQuotesByTerm = (req, res, next) => {

    Quote.aggregate([
        {$unwind:'$termsId'},
        {
            $group: {
                _id: '$termsId',
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
};

exports.aggregateQuotesByNoun = (req, res, next) => {

    Quote.aggregate([
        { $unwind: '$nounsId'},
        {
            $group: {
                _id: '$nounsId',
                count: {$sum: 1},
            },
        },
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result)
        }
    });

};

exports.aggregateQuotesBySimilarText = (req, res, next) => {

    Quote.aggregate([
        { $group: {
            _id: { text: "$text" },   // replace `name` here twice
            uniqueIds: { $addToSet: "$_id" },
            count: { $sum: 1 }
        } },
        { $match: {
            count: { $gte: 2 }
        } },
        { $sort : { count : -1} },
        { $limit : 10 }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result)
        }
    });

};