import request from 'supertest';
import { itemModel } from '../src/models/items';
import {app} from "../src/server";

describe('POST /itemsadd', () => {

    it('should create a new item', async () => {
        const itemData = {
            name: 'item 1',
            description: 'item description',
            price: 20,
            countInStock: 10,
        };

        const res = await request(app)
            .post('/itemsadd')
            .field('name', itemData.name)
            .field('description', itemData.description)
            .field('price', itemData.price)
            .field('countInStock', itemData.countInStock)
            .attach('image', './test/test-image.jpg');

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(itemData.name);
        expect(res.body.description).toBe(itemData.description);
        expect(res.body.price).toBe(itemData.price);
        expect(res.body.countInStock).toBe(itemData.countInStock);
        expect(res.body.image).toMatch(/^http:\/\/.+\/public\/uploads\/.+\.jpg$/);
    });

    it('should return 400 when no image file was provided', async () => {
        const res = await request(app)
            .post('/itemsadd')
            .field('name', 'item 1')
            .field('description', 'item description')
            .field('price', 20)
            .field('countInStock', 10);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('No image file was provided');
    });

    it('should return 500 when the item could not be created', async () => {
        // Simulate a failure by returning a rejected promise from the itemModel.save() method
        itemModel.prototype.save = jest.fn(() => Promise.reject(new Error('Database error')));

        const res = await request(app)
            .post('/itemsadd')
            .field('name', 'item 1')
            .field('description', 'item description')
            .field('price', 20)
            .field('countInStock', 10)
            .attach('image', './test/test-image.jpg');

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('The item cannot create');
    });
});
