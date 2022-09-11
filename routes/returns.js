const Joi = require('joi');
const express = require('express');
const moment = require('moment');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { Movie } = require('../models/movies.model');
const { Rental } = require('../models/rentals.model');
const router = express.Router();

// this module uses the Test Driven Development approach
router.post('/', [authMiddleware, validate(validateReturn)], async (req, res) => {
   
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Rental was not found');

    if (rental.dateReturned) return res.status(400).send('Returned already processed');

    rental.return();
    await rental.save();
    
    await Movie.update({ _id: rental.movie._id }, { 
        $inc: { numberInStock: 1 }
    });
    
    return res.send(rental);
});

function validateReturn(movieReturn) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    } 
    const { error } = Joi.validate(movieReturn, schema);
    return error;
}

module.exports = router;