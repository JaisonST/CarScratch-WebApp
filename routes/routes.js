const loadModel = require('../node_model/load_model');
const getUserRecords = require('../public/js/db');
const path = require('path');


records_list = [1,2,3] 

const getUserRecordsFromDb = async function(req,res,next){
	var recods = await getUserRecords(req.user.id)
	records_list = recods
	next();
}

// app/routes.js
function routesConfiguration(app, passport) {

    //main home page - todo add signout button 
	app.get('/',function(req, res) {
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
            successRedirect : '/home',      // redirect to home page
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
		successRedirect : '/home',          // redirect to the home page
		failureRedirect : '/register',  // redirect back to the register page 
		failureFlash : true             // allow flash messages
	}));

	
	//log out 
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	// ---- Added loading model functionality
	app.get('/home',isLoggedIn, getUserRecordsFromDb, async function(req, res) {	
		//send the records to home 
		res.render('home', {records:records_list});
		loadModel().catch(err => console.log("Error: " + err));
	});

	// ---- Result.html 
	app.get('/result', async(req, res) =>{
		res.sendFile(path.join(__dirname.split('routes')[0] + '/views/result.html'));
		// generatePdf;
	});

	// ---- Sending report info to be rendered dynamically in the result.html
	app.get('/data', (req, res) => {
		recordInfo = {
			user: req.user.name,
			date: "02.06.2022",
		};
		res.json(recordInfo);
	});
};

// route middleware for user state 
function isLoggedIn(req, res, next) {
	// console.log(req.user);
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the landing page
	res.redirect('/');
}

// route middleware for user state 
function isLoggedOut(req, res, next) {
	
	// if user is not authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/home');
}


module.exports = routesConfiguration 