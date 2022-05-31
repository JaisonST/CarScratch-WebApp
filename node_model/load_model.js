const {spawn} = require("child_process");

// Python model loader 
function loadModel(){
    return new Promise((success, error) => {
           const py = spawn('python', ['./model_files/load.py']);
   
           // Return prediction on completion of python code 
           py.on('close', (code) => {
               console.log(`Exited with code: ${code}`);
               if(code > 0){
                   error("Something went wrong");
               }
               else{
                   success("Done!");
               }
           });
       });
   }
   
   module.exports = loadModel;