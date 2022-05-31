const {spawn} = require("child_process");

// Python model handler 
function callModel(files, target_folder){
 return new Promise((success, error) => {
        const py = spawn('python', ['./model_files/model.py', files, target_folder]);
        var prediction;

        // Execute python code, listen to stdout for prediction
        py.stdout.on('data', (data) => {
            console.log(data.toString());
            prediction = data.toString();
        });
       
        py.stderr.on('data', (data) => {
            console.log(data.toString());
        })

        // Return prediction on completion of python code 
        py.on('close', (code) => {
            console.log(`Exited with code: ${code}`);
            if(code == 1){
                error("Something went wrong");
            }
            else{
                success(prediction);
            }
        });
    });
}

module.exports = callModel;
