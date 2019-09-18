const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')

//Welcome page
router.get('/', (req,res) => res.render('welcome.ejs'));

//Dashbard page - we want it to be a protected page so we bring in auth.js and add the middleware as a second parameter
router.get('/dashboard', ensureAuthenticated, (req,res) => 
    res.render('dashboard', {
        name: req.user.name //pass in an object when we render the dashboard, and set name as the req.user.name.when we are logged in we have access to req.user and any field like name, email etc
    }));


module.exports = router;