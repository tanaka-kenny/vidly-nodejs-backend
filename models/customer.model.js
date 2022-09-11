const mongoose = require('mongoose');
const Joi = require('joi');

/** validate function */
validateCustomer = customer => {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(10).max(13)
    };

    const { error } = Joi.validate(customer, schema);
    return error;
}

/** mongoose schema */
const Customer = mongoose.model('Customer', {
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, minlength: 5},
    phone: { type: String, required: true, minlength: 10, maxlength: 13 }
});

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;