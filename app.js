/**
 * Created by Sonny on 4/7/2017.
 */
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://localhost/movieApi');

var Movie = require('./models/movieModel');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

movieRouter = require("./Router/movieRoutes")(Movie);

app.use('/api/movies', movieRouter);


app.get('/', function (req, res) {
    res.send('Movie API');
});

app.listen(port, function (req, res) {
    console.log('running on Port:' + port);
});