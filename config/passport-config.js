const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt') 
require('dotenv').config()

//database 
const mysql = require('mysql'); 
var connection = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER, 
    password:process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_DB, 
})

connection.connect(); 

function initialize(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use('local-register', 
        new localStrategy({
            usernameField: 'email', 
            passwordField: 'password',
            passReqToCallback: true 
            },
            function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log("Registering");
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'), 
                                req.flash('userEmail', email), 
                                req.flash('userPassword', password), 
                                req.flash('userName', req.body.name));
            } else {
                console.log("Creating User");
                // create the user
                var newUserMysql = {
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    name: req.body.name
                };

                var insertQuery = "INSERT INTO users ( email, password, name ) values (?,?,?)";
                connection.query(insertQuery,[newUserMysql.email, newUserMysql.password, newUserMysql.name],function(err, rows) {
                    if(err) return done(null, false, req.flash('signupMessage', '500 error'), req.flash('userEmail', email), req.flash('userPassword', password), req.flash('userName', req.body.name));
                    if(!err){
                        console.log("Inserted User");
                        connection.query("select * from users where email = ?;",[newUserMysql.email],function(err, rows) {
                            newUserMysql.id = rows[0].id;
                            console.log(rows[0].id)
                            return done(null, newUserMysql);
                        })
                    }
                })
            }
        });
    })
    );


    passport.use(
        'local-login',
        new localStrategy({
            //override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 
            //check if user exist 
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'), req.flash('userEmail', email), req.flash('userPassword', password)); 
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Incorrect password.'), req.flash('userEmail', email) , req.flash('userPassword', password)); 

                //return successful user
                return done(null, rows[0]);
            });
        })
    );

}

module.exports = initialize