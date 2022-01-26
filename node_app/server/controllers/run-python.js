const path = require("path");

// To run python script
const {spawn} = require('child_process');

module.exports.drawPythonPlot = async () => {
    let python_response_code = 2;
    const image_file = path.join(__dirname, '../../client/public/uploads/test.png');

    // spawn new child process to call the python script
    const python = spawn('python3', [path.join(__dirname,'../../../python_app/test_heroku.py'), image_file]);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log(`Pipe data from python script ...${data}`);
    });

    python.stderr.on('data', function (data) {
        console.log(`Pipe data from python script ...${data}`);
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        python_response_code = code;
        // send data to browser
        //res.send(dataToSend)
    });

}
