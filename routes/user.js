const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const { validateUser, User} = require('../models/user.model');
const _ = require('lodash');
const bcryt = require('bcrypt');
const authorisation = require('../middleware/auth.middleware');

router.get('/me', authorisation, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const error = validateUser(req.body);
    if (error) return res.send(error.details[0].message);

    // check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.send('User with this email already exists ');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // }); OR  
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcryt.genSalt(10);
    user.password = await bcryt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));

    /** look into joi password complexity to give a proper password */
});

module.exports = router;
