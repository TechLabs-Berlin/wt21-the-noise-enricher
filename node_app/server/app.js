const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const morgan = require('morgan');
const path = require('path');

const upload = multer({ dest: 'uploads/' })

app.use(express.static(path.join(__dirname, '/../client')));
app.use('/',router);
app.use(morgan('dev'));

app.use(bodyParser.json());

router.route('/')
    .post(upload.single('audio'), (req, res) => {
    console.log(req.file, req.body);
    res.redirect('/');
})

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})