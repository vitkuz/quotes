const User = require('../../schemas/User');
const  bcrypt = require('bcryptjs');

exports.loginPage = (req, res, next) => {
    res.render('login');
};

exports.registerPage = (req, res, next) => {
    res.render('register');
};

exports.login = (req, res, next) => {

    console.log(req.body);

    User.findOne({ email: req.body.email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return next(err);
                // return callback(err);
            }
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result === true) {
                    req.session.userId = user._id;
                    return res.redirect('/profile');
                    // return callback(null, user);
                } else {
                    var err = new Error('Password do not match.');
                    err.status = 401;
                    return next(err);
                    // return callback();
                }
            })
        });

};

exports.register = (req, res, next) => {
    console.log(req.body);

    // confirm that user typed same password twice
    // if (req.body.password !== req.body.passwordConf) {
    //     var err = new Error('Passwords do not match.');
    //     err.status = 400;
    //     res.send("passwords dont match");
    //     return next(err);
    // }

    if (req.body.email &&
        req.body.username &&
        req.body.password
        // && req.body.passwordConf
    ) {

        bcrypt.hash(req.body.password, 10, function (err, hash) {


            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: hash,
            };

            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/profile');
                }
            });

        });
    } else {
        var err = new Error('Smth goes wrong with registration');
        err.status = 400;
        next(err);
    }

};

// GET /logout
exports.logout = (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
}