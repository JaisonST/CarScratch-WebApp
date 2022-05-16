// app/routes.js
function routesConfiguration(app, passport) {

    //main home page - todo add signout button 
	app.get('/', isLoggedIn,function(req, res) {
		res.render('index' , {
            user : req.user
        }); // load the index.ejs file
	});

	//login page 
	app.get('/login', isLoggedOut, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login',
        { 
            message: req.flash('loginMessage'), 
            email: req.flash('userEmail'), 
            password: req.flash('userPassword')
        });
	});

	// process the login form
	app.post('/login',  passport.authenticate('local-login', {
            successRedirect : '/',      // redirect to home page
            failureRedirect : '/login', // redirect back to login page 
            failureFlash : true         // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              //set sesssion time 
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        //res.redirect('/login');
    });

	//register page 
	app.get('/register', isLoggedOut, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register', 
        { 
            message: req.flash('signupMessage'),
            email: req.flash('userEmail'), 
            password: req.flash('userPassword'),
            name: req.flash('userName'),
        });
	});

	// process the register form
	app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/',          // redirect to the home page
		failureRedirect : '/register',  // redirect back to the register page 
		failureFlash : true             // allow flash messages
	}));

	
	//log out 
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
};

// route middleware for user state 
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the login page
	res.redirect('/login');
}

// route middleware for user state 
function isLoggedOut(req, res, next) {

	// if user is not authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


module.exports = routesConfiguration 