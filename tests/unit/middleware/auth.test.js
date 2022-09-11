const { User } = require('../../../models/user.model');
const auth = require('../../../middleware/auth.middleware');
const mongoose = require('mongoose');

// since the SUPERTEST package doesn't have access to the REQ property, we can't perform an integration test
// of this type of a test, thus we must resort to unit tests
describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = { 
            _id: mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next); // this is the func we're testing

        expect(req.user).toMatchObject(user);
    });
});