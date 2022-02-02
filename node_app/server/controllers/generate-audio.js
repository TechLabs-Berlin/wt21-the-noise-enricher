const runPython = require("./run-python");
const utils = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

let nUsersStartedAudioGeneration = 0;


module.exports.upload = multer({
    dest: path.join(__dirname, '../../client/public/uploads/'),
    limits: { fileSize: 1000*1000*20 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /wav/; // /jpg|png|gif/
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        return cb(new Error('file is not allowed'));
    }
}).single('audio');

module.exports.checkAudioFile = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        req.flash('error', 'File is too big! Try to upload a smaller file.');
        res.redirect(302, '/')
    } else if (err.message === 'file is not allowed') {
        req.flash('error', 'File is not a correct audio file! Try to upload a .wav file.');
        res.redirect(302, '/');
    } else if (err){
        req.flash('error', 'Fail uploading failed!');
        res.redirect(302, '/');
    } else {
        next();
    }
};

module.exports.index = async (req, res) => {
    res.render('index');
};


module.exports.showSpectrogram = async (req, res) => {
    if (fs.existsSync(req.session.audioFilePath)) {
        try {
            await sleepUntil(() => nUsersStartedAudioGeneration === 0, 60 * 1000);
            nUsersStartedAudioGeneration++;
            res.render('generate/spectrogram', {filepath: `${req.session.workingDirName}/${req.session.audioFileName}`});

            await runPython.runNoiseEnricher(
                req.session.audioFilePath, req.session.audioFileName, req.session.workingDirName,
                req.session.style);

            req.session.generationDone = true;
            req.session.save();

        } catch (err) {
            console.error(err);
            res.redirect(302, '/');
        }

    } else res.redirect(302, '/');
};

module.exports.checkResultsStatus = async (req, res) => {
    if (req.session.audioFilePath && req.session.generationDone) {
        try {
            req.session.generatedAudioFilePath = path.join(
                req.session.workingDir, 'reconstructed_' + req.session.audioFileName) + ".wav";
            res.send({
                status: 'done',
                filepath: `${req.session.workingDirName}/reconstructed_${req.session.audioFileName}.wav`
            });

            req.session.generationDone = false;
            req.session.save();
        } catch (err) {
            console.error(err);
            res.redirect(302, '/');
        }
    } else res.send({status: 'not_done'});
};

module.exports.uploadForm = async (req, res) => {
    await createWorkingDir(req, res);
    if (req.file) {
        const {style = 'blues'} = req.body
        req.session.style = style;
        const newPath = path.join(req.session.workingDir, req.file.filename);

        fs.rename(req.file.path, newPath, function (err) {
            if (err) {
                console.log(err);
                res.redirect(302, '/');
            }
        })
        req.session.audioFilePath = newPath;
        req.session.audioFileName = req.file.filename;
        res.redirect(302, 'generate/spectrogram');


    } else res.redirect(302, '/');
}


createWorkingDir = async (req, res) => {
    req.session.workingDirName = req.session.id;
    req.session.workingDir = path.join(__dirname, '../../client/public/uploads/', req.session.workingDirName, '/');


    // clean and/or create a folder
    if(fs.existsSync(req.session.workingDir)) {
        await utils.cleanDirectory(req.session.workingDir);
    }
    fs.mkdirSync(req.session.workingDir);

    req.session.save();
};


// Wait for previous users to finish generation or timeout
async function sleepUntil(f, timeoutMs) {
    return new Promise((resolve, reject) => {
        let timeWas = new Date();
        let wait = setInterval(function() {
            if (f()) {
                console.log("resolved after", new Date() - timeWas, "ms");
                clearInterval(wait);
                resolve();
            }
            else if (timeoutMs !== 0 && new Date() - timeWas > timeoutMs) { // Timeout
                console.log("rejected after", new Date() - timeWas, "ms");
                clearInterval(wait);
                reject();
            }
        }, 20);
    });
}

