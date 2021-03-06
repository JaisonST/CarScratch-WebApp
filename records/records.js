var multer  = require('multer')
var fs = require('fs');
const dbModule = require('../public/js/db');
var callModel = require('../node_model/model_handler.js');

//database 
const mysql = require('mysql'); 
const generatePDF = require('../public/js/pdf.js');
var connection = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER, 
    password:process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_DB, 
})

connection.connect(); 

//global variable to track record name 
var record_id = "";
var images_list = []; 
// const setRecordID = function (req, res, next) {
//   console.log(req.body)
//   console.log("user id: " + req.user.id.toString())
//   console.log("number plate: " + req.body.numberPlate)
//   console.log("dateTime: " + Date.now().toString() + "\n\n")
//   return next();
// }

const createRecord = function (req, res, next) {
  //call mysql function to create record. id + numberplate + datetime  
  var nb = req.user.id.toString() + req.body.numberPlate.toString() +  Date.now().toString(); 
  record_id = nb; 
  var insertQuery = "INSERT INTO records ( id, number_plate, user_id ) values (?,?,?)";
                connection.query(insertQuery,[nb, req.body.numberPlate, req.user.id],function(err, rows) {
                    if(err) console.log("ERROR TO BE HANDLED" + err.toString()); 
                    if(!err){
                        console.log("Created Record");
                    }
                });
  next();
}


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
      const fname = user.toString()+nb.toString()+dt.toString() +file.originalname; 
      //todo: store the value below in db. 
      images_list.push(fname)
      cb(null, fname)
    }
})
var upload = multer({ storage: storage });


function recordController(app, passport) {
  
    app.post('/record/delete', async function(req,res) {
      if(req.body.id){
        await dbModule.deleteRecord(req.body.id);
      }
      res.redirect("/home"); 
    })

    app.post('/record/upload',  upload.array('images', 12), createRecord ,async function(req, res) {
      
      //this returns the number plate
      //console.log(req.body.numberPlate);
      
      var dir = __dirname.split('/Desktop')[0] + '/Desktop/images/'+req.user.id;
    
      console.log('Why is it loading repeated' + images_list);
      // Steps 
      // 1) upload images to server done in upload.array() 
      // 2) call python function to detect image. 
      pred = await callModel(images_list, dir).catch(err => console.log("Error: " + err));
      // 3) store results on the server. (or do that on in the python function)
      
      // 4) redirect to home after adding new record   
      // res.redirect('/home');
      url = '/result?record_id='+record_id+'&record_list='+images_list.toString()+"&number_plate=" +req.body.numberPlate + "&user_id=" + req.user.id + "&user_name=" + req.user.name;
      res.redirect(url);

      // await delay(2000); 
      
      generatePDF(url, record_id);

      images_list = []; 
    });
}

module.exports = recordController