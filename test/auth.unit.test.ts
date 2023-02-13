import request from 'supertest';
import { userModel } from '../src/models/users'
import {app} from "../src/server";

describe('GET /', () => {


    it('should return all users', async () => {
        const userData = [ 
            { name: 'User 1' },            
            { name: 'User 2' },            
            { name: 'User 3' },        
        ];

        await userModel.create(userData);

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body.map((u: any) => u.name)).toEqual(
            expect.arrayContaining(userData.map((u: any) => u.name))
        );
    });

    it('should return 500 when no users found', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
