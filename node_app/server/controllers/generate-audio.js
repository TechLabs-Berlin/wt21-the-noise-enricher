const runPython = require("./run-python");
const path = require("path");
const fs = require("fs");

const audioFile = {};
let generationDone = false;

module.exports.fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
        res.redirect(302, 'generate')
    } else {
        next()
    }
};


module.exports.index = (req, res) => {
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
};


module.exports.showSpectrogram = async (req, res) => {
    if (audioFile.file) {
        res.render('generate/spectrogram', {filepath: audioFile.file.filename});

        const code = await runPython.runNoiseEnricher(audioFile.file.path, audioFile.file.filename);

        if (code === 0) {
            generationDone = true;
        }
    }
    else
        res.redirect(302, 'generate');

};



module.exports.checkResultsStatus = async (req, res) => {
    if(audioFile.file && generationDone) {
        res.send({status: 'done'});
    }
    else
        res.send({status: 'not_done'});
};

module.exports.computeResults = async (req, res) => {
    if(audioFile.file && generationDone) {
        const generated_file = '../../public/uploads/reconstructed_' + audioFile.file.filename + ".wav";

        res.render('generate/results', {filepath: generated_file});
        generationDone = false;
    } else {
        res.redirect(302, 'generate');
    }
};


module.exports.uploadForm = async (req, res) => {
    if (req.file) {
        audioFile.file = req.file;
        res.redirect(302, 'generate/spectrogram');
    }
    else
        res.redirect(302, 'generate');
}
