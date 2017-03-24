var jwt = require('jsonwebtoken');
var User = require(process.cwd()+'/model/user');

module.exports = function(app, passport) {

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        res.end();
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/search', // redirect to the secure profile section
        failureRedirect : '/failure', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        console.log('signup called from get.');
        res.end();
    });

    app.post('/sign',function(req,res){
        console.log('sign method called');
        console.log(req.body);
        res.json('done');
    })

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/success', // redirect to the secure profile section
        failureRedirect : '/failure' // redirect back to the signup page if there is an error
    }));


    app.post('/authenticate', function(req, res) {  
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
            res.send({ success: false, message: 'Authentication failed. User not found.' });
            } else {
            // Check if password matches
            if (user.validPassword(req.body.password)) {
                if (isMatch && !err) {
                // Create token if the password matched and no error was thrown
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 10080 // in seconds
                });
                res.json({ success: true, token: 'JWT ' + token });
                } else {
                res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
                }
            };
            }
        });
    });

    //Common Method -----------------------------------------

    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.send('success');
    });

    app.get('/success', function(req, res) {
            console.log('success request: '+req.user);
            res.send(req.user);
            // res.redirect('/user/mail/'+req.user._id);
            //res.send({token : token, role:req.user.role, id:req.user._id});
        }
    );

    app.get('/failure', function(req, res) {
            console.log('failure request: ');
            res.send("EXIST");
        }
    );


    app.get('/loginStatus',
        isLoggedIn,
        function(req, res) {
            console.log(req.user);
            if(req.user)
                res.send({role:req.user.role, id:req.user._id});
            else
                res.redirect('/');
        }
    );
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
