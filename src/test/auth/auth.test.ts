import { app } from '../../index';
import request from 'supertest';
describe('Authentication Route', () => {
 test('Create a user account', async () => {
 const response = await request(app)
    .post("/api/v1/auth/register").send({
        firstName: "john",
        lastName: "smith",
        email: "johnsmith1@gmail.com",
        password: "!Password123@"
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User has been created successfully");
 });
});
