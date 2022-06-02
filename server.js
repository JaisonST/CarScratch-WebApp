//set up ====================================================
const express = require("express");
require('dotenv').config()
const session = require("express-session")
var cookieParser = require('cookie-parser'); 
const app = express() 
const flash = require("express-flash")
const passport = require('passport')
var path = require('path')
//============================================================
//configuration 
var port = process.env.PORT || 3000; 
require('./config/passport-config')(passport) 
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/records', express.static(path.join(__dirname, 'records')));
app.use('/reports', express.static(path.join(__dirname, 'reports')));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_SESSION || "randomChars", 
    resave: true, 
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//=============================================================

//routes ======================================================= 
require('./routes/routes.js')(app, passport);
require('./records/records.js')(app, passport);

//start the server 
app.listen(port)
console.log("Server is running on port: " + port)