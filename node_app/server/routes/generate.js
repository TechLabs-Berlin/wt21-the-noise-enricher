const fs = require("fs");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const runPython = require("../controllers/run-python")



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
        // res.render('generate/spectrogram', {filepath: audioFile.file.filename});

        await runPython.runNoiseEnricher(audioFile.file.path, audioFile.file.filename);

        res.redirect(302, 'results');
    }
    else
        res.redirect(302, '/');
});

router.get('/results', async (req, res) => {
    let generated_file = "http://jplayer.org/audio/mp3/RioMez-01-Sleep_together.mp3"
    if(audioFile.file) {
        generated_file = '../../public/uploads/reconstructed_' + audioFile.file.filename + "_0.wav";
        fs.unlink(path.join(__dirname, '../../client/public/uploads/' + audioFile.file.filename), (err) => {
            if (err) throw err;
        });
    } else {
        res.redirect(302, '/');
    }

    await runPython.drawPythonPlot();

    if (generated_file) { // && python_response_code === 0
        res.render('generate/results', {
            image: '../../public/uploads/test.png',
            filepath: generated_file,});
    } else
        res.redirect(302, '/');
});

module.exports = router;

