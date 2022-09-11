const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer.model');
const { Movie } = require('../models/movies.model');
const Fawn = require('fawn');
const { Rental, validateRental} = require('../models/rentals.model');
const mongoose = require('mongoose');

Fawn.init(mongoose);

// get all rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    // check for error from client
    const error = validateRental(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    // validate customer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    // validate movie
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    // check if movie is available
    if (movie.numberInStock === 0) return res.status(400).send(' movie not available');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    }
    catch(ex) {
    res.status(500).send('Something failed'); 
    }
});

module.exports = router;