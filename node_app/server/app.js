const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');


app.use(express.static(path.join(__dirname, '/../client')));

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(3030, () => {
    console.log("Serving on port 3030")
})