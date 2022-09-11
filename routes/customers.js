const express = require('express');
const router = express.Router();
const { Customer, validateCustomer} = require('../models/customer.model');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    // validadate request with Joi
    const error = validateCustomer(req.body);
    if (error) return res.send(error.details[0].message);

    //  post
    const customer = new Customer({ 
        name: req.body.name, 
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    // validate with joi
    const error = validateCustomer(req.body);
    if (error) return res.send(error.details[0].message);
    // update & return cust
    const customer = await Customer
        .findByIdAndUpdate(
            req.params.id, 
            { name: req.body.name }, 
            { new: true }
    );
    if (!customer) res.status(400).send('The customer with give ID wasn\'t found');
    res.send(customer)
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.body.id);
    if (!customer) res.status(400).send('The customer with give ID wasn\'t found');
    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.body.id);
    if (!customer) 
        return res.status(404).send('The customer with give ID wasn\'t found');
    res.send(customer);
});

module.exports = router;
