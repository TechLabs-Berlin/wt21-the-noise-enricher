const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', (req, res) => {
    res.render('generate/index');
});

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', upload.single('audio'), (req, res) => {
    console.log(req.file, req.body);
    res.redirect(303, 'generate/spectrogram');
});

router.get('/spectrogram', (req, res) => {
    res.render('generate/spectrogram');
});

router.get('/results', (req, res) => {
    res.render('generate/results');
});

module.exports = router;

