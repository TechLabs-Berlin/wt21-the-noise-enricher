const express = require('express');
const app = express();
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const path = require('path');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(3030, () => {
    console.log("Serving on port 3030")
})