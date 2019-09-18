const express = require('express');
const router = express.Router();

//LOGIN page
router.get('/login', (req,res) => res.render('login.ejs'));

//REGISTER page
router.get('/register', (req,res) => res.render('register.ejs'));

//Register Handle submit/post request
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body; //what we pass in the form will be in the req.body
    
    res.send('hello');
});



module.exports = router;