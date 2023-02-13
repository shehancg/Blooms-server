import request from 'supertest';
import {app} from "../src/server";

describe('POST /orders', () => {
  it('creates a new order', async () => {
    const order = {
      user: "12345",
      items: [
        {
          item: "item1",
          price: 10,
          quantity: 2
        }
      ],
      totalPrice: 20,
      status: "NEW"
    };

    const response = await request(app)
      .post('/api/orders/create')
      .send(order);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user', order.user);
    expect(response.body).toHaveProperty('items', order.items);
    expect(response.body).toHaveProperty('totalPrice', order.totalPrice);
    expect(response.body).toHaveProperty('status', order.status);
  });
});
