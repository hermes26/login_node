const express = require('express');
const router = express.Router();

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
        res.send('pass');
    }
});



module.exports = router;