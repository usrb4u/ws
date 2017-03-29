// load all the things we need

var LocalStrategy   = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt; 

// process.chdir('../')

var User = require(process.cwd()+'/model/user');

var config = require('./config.js');  

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     User.findById(id).lean().exec(function(err, user) {
    //         done(err, user);
    //     });
    // });

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
        });
    }));

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            nameField : 'name',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }).lean().exec( function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false);
                } else {


                    var newUser            = new User();

                    // set the user's local credentials
                    newUser.email    = email;
                    newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
                    newUser.name = req.body.name;
                    newUser.role=0;
                    newUser.profileImage='/fonts/male.png';
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email

            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false ); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false); // create the loginMessage and save it to session as flashdata

                // return successful user
                return done(null, user);
            });

        }));



};
