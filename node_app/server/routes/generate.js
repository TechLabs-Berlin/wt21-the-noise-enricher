const express = require('express');
const router = express.Router();
const spectrogram = require('../controllers/spectrogram');
const multer = require('multer');
const path = require("path");

const audioFile = {};

const upload = multer({ dest: path.join(__dirname, '../../client/public/uploads/')});

router.get('/', (req, res) => {
    res.render('generate/index');
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
    }
    else
        res.redirect(302, '/');
});

router.get('/results', (req, res) => {
    res.render('generate/results');
});

module.exports = router;

