const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//LOGIN page
router.get('/login', (req,res) => res.render('login.ejs'));

//REGISTER page
router.get('/register', (req,res) => res.render('register.ejs'));

//Register Handle submit/post request
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body; //what we pass in the form will be in the req.body
    let errors = [];

    //check for required fields
    if ( !name || !email || !password || !password2 ) {
        errors.push({ msg : 'Please fill in all fields'});
    }
    //check passwords match
    if (password !== password2){
        errors.push({ msg : 'passwords do not match'});
    }
    //check password length
    if(password.length < 6 ){
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    if (errors.length > 0){
        //if there is an issue, we want to re render the registration form, and pass in some values/variables
        //we dont want the form to completely clear when we submit it and it´s not valid
        //so we pass in the variables
        res.render('register.ejs', {
            errors,
            name,
            email,
            password,
            password2
        });

    }else{
        //validation pass
        //before we submit the user, must make sure it doesnt exist
        User.findOne({email: email})
            .then(user => {
                if(user) {
                    //User exists
                    errors.push({ msg: 'Email is already registered'});
                    res.render('register.ejs', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser = new User({ //this creates an instance of the new user but does not save into db
                        name,
                        email,
                        password,
                    })
                    // console.log(newUser);
                    // res.send('hello');

                    //Hash password- we need to generate a SALT so that we can create a hash
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hashed
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash(//this creates the flash message
                                        'success_msg', 
                                        'You are now registered and can log in'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))

                }
            })
    }
});


//LOGIN Handle
// Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to employ
// Upon successful authentication, the user will be redirected to the home page. If authentication fails, the user will be redirected back to the login page for another attempt.
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true 
    })(req, res, next);
});
// Setting the failureFlash option to true instructs Passport to flash an error message using the message given by the strategy's verify callback, if any(in passport.js). This is often the best approach, because the verify callback can make the most accurate determination of why authentication failed.


//LOGOUT Handle
router.get('/logout', (req,res)=> {
    req.logout();//the passport middleware gives us the logout() method
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;