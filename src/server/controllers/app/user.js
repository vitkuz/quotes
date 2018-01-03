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

    User.find({
        username: req.body.email,
    }, (err, user) => {
        if (err) throw err;
        if(!user) res.redirect('/users/login');
        if (user) {
            console.log('User found!', user);

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    console.log('Hash', hash);
                    bcrypt.compare(user.password, hash, function(err, res) {
                        // if (err) throw err;
                        if (res) {
                            console.log('User passwords match!', res);
                            //res.redirect('/quotes');
                        } else {
                            console.log('User passwords NOT match!', res);
                            //res.redirect('/users/login');
                        }

                    });

                });

            })


        }

    });



    res.send('Login')
};

exports.register = (req, res, next) => {
    console.log(req.body);

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            console.log('password hashed:',hash);

            User.create({
                username: req.body.email,
                password: hash,
            }, (err, doc) => {
                if (err) throw err;
                res.redirect('/users/login');
            });

        });
    });


};