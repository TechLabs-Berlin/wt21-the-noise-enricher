const fs = require("fs");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const audioGenerate = require("../controllers/generate-audio")
const catchAsync = require('../utils/catchAsync');


const upload = multer({
    dest: path.join(__dirname, '../../client/public/uploads/'),
    limits: { fileSize: 1000*1000*20 }
});

router.get('/', audioGenerate.index);

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', upload.single('audio'), audioGenerate.fileSizeLimitErrorHandler, audioGenerate.uploadForm);

router.get('/spectrogram', audioGenerate.showSpectrogram);

router.post('/check-results', audioGenerate.checkResultsStatus);

router.get('/results', audioGenerate.computeResults);



module.exports = router;

