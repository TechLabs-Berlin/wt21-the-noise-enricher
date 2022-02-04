const express = require('express');
const bodyParser = require("body-parser");
const ejsMate = require('ejs-mate');
const app = express();
const generateRoutes = require('./routes/generate');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');

const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: true,
        secure: false,
        expires: false
    }
}))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../client/views/'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client')));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('index');
});

//
// To test
//app.get('/generate/spectrogram', (req, res) => {
//    res.render('generate/spectrogram', { filepath: "piano_16000_mono.wav" });
//});
//
app.get('/about', (req, res) => {
    res.render('generate/about');
});


app.use('/generate', generateRoutes);


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});


const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})