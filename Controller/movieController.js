require('mongoose-pagination');
var movieController = function (Movie) {
    var newPageNext, newPagePrev, lastPage = 0;

    var post = function (req, res) {
        var nmovie = new Movie(req.body);

        if (!req.body.title) {
            res.status(400);
            res.send('Title is required');
        }
        else if (!req.body.date) {
            res.status(400);
            res.send('Release year is required');
        }

        else if (!req.body.genre) {
            res.status(400);
            res.send('Genre is required');
        }

        else if (!req.body.director) {
            res.status(400);
            res.send('Director is required');
        }

        else if (!req.body.summary) {
            res.status(400);
            res.send('Summary is required');
        }
        else {
            nmovie.save();
            console.log(nmovie);
            res.status(201).send(nmovie);
        }

    };

    var options = function (req, res) {
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Allow', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };
    var get = function (req, res, next) {
        var page = parseInt(req.query.start) || 1;
        Movie.find().exec((err, countData) => {
            if (err) return next(err);
            var countItems = countData.length;
            // pagination
            var limit = parseInt(req.query.limit) || countItems;


            var movies = {};

            var exclude = {__v: 0};
            Movie.find({}, exclude)
                .paginate(page, limit)
                .exec((err, data) => {
                    if (err) {
                        return next(err)
                    } else {
                        if (limit > countItems)
                            limit = countItems;

                        var totalPages = Math.ceil(countItems / limit);

                    }

                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (!req.accepts('json')) {
                            res.status(404).send(err)
                        } else {


                            if (totalPages <= 1) {
                                newPagePrev = 1;
                                newPageNext = 1;
                            }

                            if (countItems < 1) {
                                newPagePrev = 1;
                                newPageNext = 1;
                                totalPages = 1;
                            }

                            if (page < totalPages) {
                                newPageNext = page + 1;
                            }


                            if (page > 1) {
                                newPagePrev = page - 1;
                            }


                            var items = movies.items = [];

                            var links = movies._links = {};
                            links.self = {};
                            links.self.href = 'http://' + req.headers.host + '/api/movies/';
                            var pagination = movies.pagination = {};
                            pagination.currentPage = page;
                            pagination.currentItems = limit;
                            pagination.totalPages = totalPages;
                            pagination.totalItems = countItems;
                            var paginationLinks = pagination._links = {};
                            paginationLinks.first = {};
                            paginationLinks.first.page = 1;
                            paginationLinks.first.href = 'http://' + req.headers.host + '/api/movies/?' + 'start=' + 1 + '&limit=' + limit;
                            paginationLinks.last = {};
                            paginationLinks.last.page = totalPages;
                            paginationLinks.last.href = 'http://' + req.headers.host + '/api/movies/?' + 'start=' + totalPages + '&limit=' + limit;
                            paginationLinks.previous = {};
                            paginationLinks.previous.page = newPagePrev;
                            paginationLinks.previous.href = 'http://' + req.headers.host + '/api/movies/?' + 'start=' + newPagePrev + '&limit=' + limit;
                            paginationLinks.next = {};
                            paginationLinks.next.page = newPageNext;
                            paginationLinks.next.href = 'http://' + req.headers.host + '/api/movies/?' + 'start=' + newPageNext + '&limit=' + limit;


                            data.forEach(function (element, index, array) {
                                var newMovie = element.toJSON();
                                var linksMovie = newMovie._links = {};
                                linksMovie.self = {};
                                linksMovie.collection = {};
                                linksMovie.self.href = 'http://' + req.headers.host + '/api/movies/' + newMovie._id;
                                linksMovie.collection.href = 'http://' + req.headers.host + '/api/movies/';
                                items.push(newMovie);
                            });
                            res.json(movies);
                        }
                    }
                });
        });
    };


    var getSingleMovie = function (req, res) {
        var returnMovie = req.movie.toJSON();
        returnMovie._links = {};
        returnMovie._links.self = {};
        returnMovie._links.self.href = 'http://' + req.headers.host + '/api/movies/' + returnMovie._id;
        returnMovie._links.collection = {};
        returnMovie._links.collection.href = 'http://' + req.headers.host + '/api/movies/';
        res.json(returnMovie);

    };

    var singleMovieOptions = function (req, res) {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
        res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
        res.end();
    };

    var putMovie = function (req, res) {
        req.movie.title = req.body.title;
        req.movie.date = req.body.date;
        req.movie.genre = req.body.genre;
        req.movie.director = req.body.director;
        req.movie.summary = req.body.summary;

        if (!req.body.title) {
            res.status(400);
            res.send('Title is required');
        }
        else if (!req.body.date) {
            res.status(400);
            res.send('Release year is required');
        }

        else if (!req.body.genre) {
            res.status(400);
            res.send('Genre is required');
        }

        else if (!req.body.director) {
            res.status(400);
            res.send('Director is required');
        }

        else if (!req.body.summary) {
            res.status(400);
            res.send('Summary is required');
        }
        else {
            req.movie.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.movie);
                }
            });
        }
    };

    var patchMovie = function (req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        for (var p in req.body) {
            req.movie[p] = req.body[p];
        }

        req.movie.save(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.movie);
            }
        });
    };

    var deleteMovie = function (req, res) {
        req.movie.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Removed');
            }
        });
    };

    return {
        post: post,
        get: get,
        options: options,
        getSingleMovie: getSingleMovie,
        singleMovieOptions: singleMovieOptions,
        putMovie: putMovie,
        patchMovie: patchMovie,
        deleteMovie: deleteMovie
    }
};

module.exports = movieController;