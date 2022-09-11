const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

function validateUser(user) {
    const userSchema = {
        name: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string().min(4)
    };

    const { error } = Joi.validate(user, userSchema);
    return error;
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    password: {
        type: String,
        minlength: 4,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);

exports.validateUser = validateUser;
exports.User = User;