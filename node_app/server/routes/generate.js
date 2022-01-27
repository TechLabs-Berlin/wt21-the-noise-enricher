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

    // clean upload folder
   const directory = path.join(__dirname, '../../client/public/uploads/');
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
});

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', upload.single('audio'), async (req, res) => {
    if (req.file) {
        audioFile.file = req.file;
        res.redirect(302, 'generate/results');
    }
    else
        res.redirect(302, 'generate');
});

router.get('/spectrogram', async (req, res) => {
    if (audioFile.file) {
        res.render('generate/spectrogram', {filepath: audioFile.file.filename});

    }
    else
        res.redirect(302, 'generate');
});

router.get('/results', async (req, res) => {
    if(audioFile.file) {
        const code = await runPython.runNoiseEnricher(audioFile.file.path, audioFile.file.filename);

        if (code !== 0) {
            res.redirect(302, 'generate');
        }

        const generated_file = '../../public/uploads/reconstructed_' + audioFile.file.filename + "_0.wav";


        res.render('generate/results', { filepath: generated_file});
    } else {
        res.redirect(302, 'generate');
    }

});

module.exports = router;

