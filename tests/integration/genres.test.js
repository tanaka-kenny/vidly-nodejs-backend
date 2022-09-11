const request = require('supertest');
const { Genre } = require('../../models/genres.model');
const { User } = require('../../models/user.model');

let server; // we need to load & close the server inbetween test, to avoid errors using beforeEach & afterEach

describe('api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async() => { 
        await server.close();
        await Genre.remove({}); // clean-up the collection
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            // pre-poluate DB with genres to assert if genres are being returned from the GET request
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ]);
            // simulate a GET request
            const res = await request(server).get('/api/genres');
            
            expect(res.status).toBe(200); 
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe(' GET /:id', () => {
        it('should return an error if ID wasn\'t provided', () => {
            
        });
        it('should return an 404 error if invalid ID was provided', async () => {

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
        it('should return a single genre valid ID was provided', async () => {
            // pre-populate the DB with a genre to return
            const genre = new Genre({ name: 'genre1'});
            await genre.save();

            // call a GET/:id to the endpoint
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name)
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const executeRequest = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name }); // we need to send something when doing a POST request
        }

        beforeEach(() => {
            name = 'genre1';
            token = new User().generateAuthToken();
        });

        it('should return a 401 if client is not logged in', async () => {
            token = '';

            const res = await executeRequest();
            
            expect(res.status).toBe(401);
        });
        it('should return a 400 if genre is less than 5 characters', async () => {
            name = ''
            const res = await executeRequest()
            
            expect(res.status).toBe(400);
        });
        it('should return a 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await executeRequest()
            
            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid', async () => {
            await executeRequest();

            const genre = await Genre.find({ name: 'genre'})
            
            expect(genre).not.toBeNull();
        });
        it('should retrun the genre if it is valid', async () => {
            
            const res =  await executeRequest();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    
});