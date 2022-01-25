const fs = require("fs");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");

// To run python script
const {spawn} = require('child_process');

const audioFile = {};

// const limits = { fileSize: 1024 * 1024 * 1024 }
const upload = multer({
    dest: path.join(__dirname, '../../client/public/uploads/'),
    // limits: limits
});

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', upload.single('audio'), async (req, res) => {
    if (req.file) {
        audioFile.file = req.file;
        res.redirect(302, 'generate/spectrogram');
    }
    else
        res.redirect(302, '/');
});

router.get('/spectrogram', async (req, res) => {
    if (audioFile.file) {
        res.render('generate/spectrogram', {filepath: audioFile.file.filename});
        // TODO: make link to results active after results are generated
        // await new Promise(resolve => setTimeout(resolve, 5000));
    }
    else
        res.redirect(302, '/');
});

router.get('/results', (req, res) => {
    if(audioFile.file) {
        fs.unlink(path.join(__dirname, '../../client/public/uploads/' + audioFile.file.filename), (err) => {
            if (err) throw err;
        });
    }

    //
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

    // await new Promise(resolve => setTimeout(resolve, 3000));

    const generated_file = "http://jplayer.org/audio/mp3/RioMez-01-Sleep_together.mp3"

    if (generated_file) { // && python_response_code === 0
        res.render('generate/results', {
            image: '../../public/uploads/test.png',
            filepath: generated_file,});
    } else
        res.redirect(302, '/');
});

module.exports = router;

