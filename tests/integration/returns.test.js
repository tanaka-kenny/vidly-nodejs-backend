const mongoose = require('mongoose');
const moment = require('moment');
const { Rental } = require('../../models/rentals.model');
const { User } = require('../../models/user.model');
const request = require('supertest');
const { Movie } = require('../../models/movies.model');

let server;
let customerId;
let rental;
let token;
let movie;

describe('api/returns', () => {
    function executeRequest() {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ movieId,customerId }); // send valid object, to make sure that the error is 1
    }

    beforeEach(async() => { 
        /*we need to load the server and populate the db inbetween tests*/ 
        server = require('../../index'); 

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({ // we'll use this to test if the stock has increased
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10 // prop we'll test
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                 _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async() => { 
        await server.close();
        await Rental.remove({}); 
        await Movie.remove({}); 
    });

    it('should return 401 if client is not logged it', async () => {
        token = '';
        const res = await executeRequest();
        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided', async () => {
        // make sure that the user is logged in, but did not provide customerId
        customerId = '';
        const res = await executeRequest();
        expect(res.status).toBe(400); 
    });
    it('should return 400 if movieId is not provided', async () => {
        // make sure that the user is logged in, but did not provide movieId
        movieId = '';
        const res = await executeRequest();
        expect(res.status).toBe(400);
    });
    it('should return 404 if not rental is found for this customer/movie', async () => {

       await Rental.remove({});

       const res = await executeRequest();

        expect(res.status).toBe(404);
    });
    it('should return 400 if returned has already been processed ', async () => {
        rental.dateReturned = new Date();
        await rental.save({});
 
        const res = await executeRequest();
 
         expect(res.status).toBe(400);
     });
     it('should return 200 if valid request', async () => {
        const res = await executeRequest();
 
         expect(res.status).toBe(200);
     });
     it('should set the returnDate if valid request', async () => {
        const res = await executeRequest();
        // we want to examine the rental in the db, not the one defined above
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned;
         expect(diff).toBeLessThan(10 * 1000);
     });
     it('should set the rentalFee if valid request', async () => {
        // since the dateOut property is save to a Now value by mongoose, we need to modify it to give it some days
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        
        const res = await executeRequest();
        // we want to examine the rental in the db, not the one defined above
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14)
     });
     it('should increase the numberInStock if valid request', async () => {
        const res = await executeRequest();
        // we want to examine the rental in the db, not the one defined above
        const movieInDb = await Movie.findById(movie._id)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
     });
     it('should return the rental in the body if valid request', async () => {
        const res = await executeRequest();
        // we want to examine the rental in the db, not the one defined above
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie' ])
        );
     });
});