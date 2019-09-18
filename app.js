const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
//The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.

// Have to use the flash msg because we are redirecting, so we are  storing it in the session
const flash = require('connect-flash');
const session = require('express-session');

const PORT = process.env.PORT || 5000;

const app = express();

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser: that way we can get data from our form with req.body
app.use(express.urlencoded({ extended: false }));

//Express session middleware
// Create a session middleware with the given options.Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

//connect flash
app.use(flash());

//custom middleware that has some global variables
app.use((req, res, next) => {
    //to set global variables: res.locals.var_name
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))



app.listen(PORT, console.log(`Server started on port ${PORT}`));