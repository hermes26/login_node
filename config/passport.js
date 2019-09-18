//Passport's sole purpose is to authenticate requests, which it does through an extensible set of plugins known as strategies.
// The API is simple: you provide Passport a request to authenticate, and Passport provides hooks for controlling what occurs when authentication succeeds or fails.
// Passport uses the concept of strategies to authenticate requests. Strategies can range from verifying username and password credentials, delegated authentication using OAuth (for example, via Facebook or Twitter), or federated authentication using OpenID.
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');//loggin in, so need to see if email, password etc matches de db
const bcrypt = require('bcryptjs') //compare the hash to the plain text password

//load user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy( {usernameField: 'email'}, (email, password, done) => {
            //Match user
            User.findOne({email: email})
                .then((user)=> {
                    if(!user) {
                        return done(null, false, { message: 'Email is not registered'});
                    }

                    //match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, { message: 'Password incorrect'});
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )

    //In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

    // Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

    // Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made.

    // Passport does not impose any restrictions on how your user records are stored. Instead, you provide functions to Passport which implements the necessary serialization and deserialization logic. In a typical application, this will be as simple as serializing the user ID, and finding the user by ID when deserializing.

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
        done(err, user);
        });
    });
    // only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
}