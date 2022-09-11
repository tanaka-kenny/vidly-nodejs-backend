const request = require('supertest');
const { Genre } = require('../../models/genres.model');
const { User } = require('../../models/user.model');

let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async() => { 
        await server.close();
        await Genre.remove({});
     });

    let token;
    function executeRequest(){ 
        // 1st define the happy path, then change a parameter that affects each test, inside the test
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1'})
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async() => {
        token = '';

        const res = await executeRequest();

        expect(res.status).toBe(401);
    });
    it('should return 400 if token is invalid', async() => {
        token = 'a';

        const res = await executeRequest();

        expect(res.status).toBe(400);
    });
    it('should return 200 if token is valid', async() => {

        const res = await executeRequest();

        expect(res.status).toBe(200);
    });
});