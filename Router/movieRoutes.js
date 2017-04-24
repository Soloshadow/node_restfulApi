/**
 * Created by Sonny on 4/7/2017.
 */
var express = require('express');


var routes = function (Movie) {
    var movieRouter = express.Router();

    var movieController = require('../Controller/movieController.js')(Movie);
    movieRouter.route('/')
        .post(movieController.post)
        .get(movieController.get)
        .options(movieController.options);


    movieRouter.use('/:movieId', function (req, res, next) {
        var exclude = {__v: 0};
        Movie.findById(req.params.movieId, exclude, function (err, movie) {
            if (err) {
                res.status(500).send(err);
            } else if (movie) {
                req.movie = movie;
                next();
            }
            else {
                res.status(404).send('no movie found');
            }
        });
    });

    movieRouter.route('/:movieId')
        .get(movieController.getSingleMovie)
        .options(movieController.singleMovieOptions)
        .put(movieController.putMovie)
        .patch(movieController.patchMovie)
        .delete(movieController.deleteMovie);
    return movieRouter;
};

module.exports = routes;