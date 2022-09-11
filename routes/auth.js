const express = require('express');
const router = express.Router();
const { User} = require('../models/user.model');
const _ = require('lodash');
const bcryt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.send(error.details[0].message);

    // check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password ');

    const validPassword = await bcryt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password ');

    const token = user.generateAuthToken();
    res.send(token);  
});

function validate(req) {
    const schema = {
        email: Joi.string().email(),
        password: Joi.string().min(4)
    };

    const { error } = Joi.validate(req, schema);
    return error;
}
module.exports = router;
