const express = require('express');
const router = express.Router();

//Welcome page
router.get('/', (req,res) => res.render('welcome.ejs'));

//Dashbard page
router.get('/dashboard', (req,res) => res.render('dashboard.ejs'));


module.exports = router;