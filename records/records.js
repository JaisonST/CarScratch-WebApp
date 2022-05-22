function recordController(app, passport){
    app.post('/record/upload', function(req, res) {
        var user = req.user 
        console.log(user.id);
        console.log("hi");
        res.redirect('/home');
    });
}

module.exports = recordController