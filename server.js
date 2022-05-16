//set up ====================================================
const express = require("express");
require('dotenv').config()
const session = require("express-session")
var cookieParser = require('cookie-parser'); 
const app = express() 
const flash = require("express-flash")
const passport = require('passport')
//============================================================
//configuration 
var port = process.env.PORT || 3000; 
require('./config/passport-config')(passport) 
app.use(cookieParser())
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

//start the server 
app.listen(port)
console.log("Server is running on port: " + port)