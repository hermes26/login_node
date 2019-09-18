module.exports = {
    ensureAuthenticated: function(req, res, next) {
        //from passport, we have a method attached to the req object called isAuthenticated(), so we want to check for that
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    }
}

//we can require this file in any other file, and add ensureAuthenticated as middleware to any route that we want to be protected