import request from 'supertest';
import app from '../app';

const tinyPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
]);

describe('Designs', () => {
  it('creates design with image upload (secure multer + validation)', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      email: 'designer@test.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Designer',
      role: 'designer',
    });

    const createRes = await agent
      .post('/api/designs')
      .field('title', 'Test Design')
      .field('description', 'Test description')
      .field('price', '19.99')
      .field('category', 'tshirt')
      .field('stock', '3')
      .attach('image', tinyPng, { filename: 'test.png', contentType: 'image/png' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.title).toBe('Test Design');
  });
});



