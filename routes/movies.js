const express = require('express');
const { Genre } = require('../models/genres.model');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movies.model');

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.post('/', async (req, res) => {
    // verify with joi
    const error = validateMovie(req.body);
    if (error) return res.send(error.details[0].message);
    // find given genre by id
    const genre = await Genre.findById(req.body.genreId);
    // post n return movie
    const movie = new Movie({ 
        title: req.body.title, 
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.body.id);
    if (!movie) res.status(400).send('The movie with give ID wasn\'t found');
    res.send(movie);
});

router.put('/:id',  (req, res) => {
    // do the put logic
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.body.id);
    if (!movie) 
        return res.status(404).send('The movie with give ID wasn\'t found');
    res.send(movie);
});

module.exports = router;
