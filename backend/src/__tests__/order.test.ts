import request from 'supertest';
import app from '../app';

const tinyPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
]);

describe('Orders', () => {
  it('creates order from cart items', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      email: 'buyer@test.com',
      password: 'Password123!',
      firstName: 'Buyer',
      lastName: 'User',
      role: 'influencer', // allowed to upload a design for the test flow
    });

    const designRes = await agent
      .post('/api/designs')
      .field('title', 'Order Flow Design')
      .field('description', 'Design for order flow')
      .field('price', '25')
      .field('category', 'tshirt')
      .field('stock', '10')
      .attach('image', tinyPng, { filename: 'test.png', contentType: 'image/png' });

    expect(designRes.status).toBe(201);
    const designId = designRes.body.data._id;
    expect(designId).toBeTruthy();

    const addCartRes = await agent.post('/api/cart').send({
      designId,
      quantity: 1,
      size: 'M',
      color: 'black',
      price: 25,
      image: '/uploads/test.png',
      title: 'Order Flow Design',
    });

    expect(addCartRes.status).toBe(200);
    expect(addCartRes.body.success).toBe(true);

    const orderRes = await agent.post('/api/orders').send({
      shippingAddress: {
        address: 'Test Address',
        city: 'Istanbul',
        postalCode: '34000',
        country: 'TR',
      },
      paymentInfo: { id: 'pi_test', status: 'paid' },
    });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.data.user).toBeTruthy();
  });
});


