const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const express = require('express');
const { Genre, validateGenre } = require('../models/genres.model');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.post('/', auth, async (req, res) => {
    // 1st check if genre is valid
    const error  = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    /** create new genre */
    const  genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    // validate given genre from request
    const error  = validateGenre(req.body);
    if (error) return res.send(error.details[0].message);

    /**use update first approach to update */
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) 
        res.status(404).send('The genre with give ID wasn\'t found');

    res.send(genre);
});

router.delete('/:id', [auth, admin],async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) 
        return res.status(404).send('The genre with give ID wasn\'t found');
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if (!genre) 
        return res.status(404).send('The genre with give ID wasn\'t found');
    res.send(genre);
});

module.exports = router;