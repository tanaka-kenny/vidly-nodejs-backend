const mongoose =  require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    /** connect to mongodb */
    const db = config.get('db')
    mongoose.connect(db) // dynamically read the db based on the enviroment that we are in
        .then(() => winston.info(`Connected to db ${db}`));
}