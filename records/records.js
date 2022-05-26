var multer  = require('multer')
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = __dirname.split('/Desktop')[0] + '/Desktop/images/'+req.user.id+ '/pre';
      if (!fs.existsSync(dir)){
        var dir2 = __dirname.split('/Desktop')[0] + '/Desktop/images/'+req.user.id+ '/post';
        fs.mkdirSync(dir, { recursive: true });
        fs.mkdirSync(dir2, { recursive: true });
      }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      const user = req.user.id 
      const nb = req.body.numberPlate 
      const dt = Date.now()
      //todo: store the value below in db. 
      cb(null, user.toString()+nb.toString()+dt.toString())
    }
})
var upload = multer({ storage: storage })
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function recordController(app, passport) {
    app.post('/record/upload', upload.array('images', 12), async function(req, res) {
      console.log("upload file req subbmitted");
      
      //this returns the number plate
      //console.log(req.body.numberPlate);
      var user = req.user 
      
      // Steps 
      // 1) upload images to server.
      // done in the upload() function above 
      // 2) call python function to detect image. 
      console.log('Emulated python function delay');
      await delay(5000);
      // 3) store results on the server. (or do that on in the python function)
      console.log("storing results")
      // 4) redirect to home after adding new record   
      res.redirect('/home');
    });
}

module.exports = recordController