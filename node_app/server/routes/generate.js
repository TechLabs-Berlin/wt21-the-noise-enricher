const express = require('express');
const router = express.Router();
const audioGenerate = require("../controllers/generate-audio")
const catchAsync = require('../utils/catchAsync');


router.get('/', audioGenerate.index);

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', audioGenerate.upload, audioGenerate.checkAudioFile, audioGenerate.uploadForm);

router.get('/spectrogram', audioGenerate.showSpectrogram);

router.post('/check-results', audioGenerate.checkResultsStatus);

router.get('/results', audioGenerate.computeResults);

module.exports = router;

