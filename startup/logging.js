const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    /**
 * handling uncaught exceptions
 * process.on('uncaughtException', (ex) => {
    console.log('We got an uncaughtException');
    winston.error(ex.message, ex);
});
 */
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true}), 
        new winston.transports.File({ filename: 'uncaughtExceptiond.log '})
        );
    process.on('unhandledRejection', ex => {
        throw ex;
    });

    winston.add(winston.transports.File, { filename: 'logfile.log'});
    // winston.add(winston.transports.MongoDB, { 
    //     db: 'mongodb://localhost/vidly',
    //     level: 'error'
    // });
}