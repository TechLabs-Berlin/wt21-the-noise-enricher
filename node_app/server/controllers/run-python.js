const path = require("path");

// To run python script
const {spawn} = require('child_process');

const pythonPath = process.env.PYTHONNAME || "/opt/anaconda3/envs/wt21-the-noise-enricher/bin/python"

module.exports.drawPythonPlot = async () => {

    let python_response_code = 2;
    const image_file = path.join(__dirname, '../../client/public/uploads/test.png');

    // spawn new child process to call the python script
    const python = spawn(pythonPath, [path.join(__dirname,'../../../python_app/test_heroku.py'), image_file]);
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

module.exports.runNoiseEnricher = async (filepath, filename, dirname, genre = 'blues') => {
    const python = spawn(pythonPath, [
        path.join(__dirname,'../../../python_app/call_generate_audio.py'),
        filepath,
        path.join(__dirname, '../../client/public/uploads/', dirname, '/'),
        filename,
        genre
    ]);

    let error = "";
    for await (const chunk of python.stderr) {
        // console.error('stderr chunk: '+chunk);
        error += chunk;
    }

    const code = await new Promise((resolve, reject) => {
        python.on('close', resolve);
    });

    if (code !== 0) {
        console.log(error);
    }

}
