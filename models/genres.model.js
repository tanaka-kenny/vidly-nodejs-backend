const mongoose = require('mongoose');
const Joi = require('joi');

/** compile schema to create class */
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

validateGenre = genre => {

    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    const { error } = Joi.validate(genre, schema);
    return error;
};

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validateGenre = validateGenre;
