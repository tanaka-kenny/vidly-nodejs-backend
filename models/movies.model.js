const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genres.model');

function validateMovie(movie)  {
    const movieSchema = {
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    };

    const { error } = Joi.validate(movie, movieSchema);
    return error;
}

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    genre: genreSchema,
    numberInStock: {
        type: Number,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0
    }
}));

exports.validateMovie = validateMovie;
exports.Movie = Movie;