/**
 * Created by Sonny on 4/7/2017.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var movieSchema = new Schema({
    title: {
        type: String
    },
    date: {
        type: String
    },
    genre: {
        type: String
    },
    director: {
        type: String
    },
    summary: {
        type: String
    }
});

module.exports = mongoose.model("Movies",movieSchema);

