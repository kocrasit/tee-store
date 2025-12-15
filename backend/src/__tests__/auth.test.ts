import request from 'supertest';
import app from '../app';

describe('Auth', () => {
  it('register -> refresh -> logout', async () => {
    const agent = request.agent(app);

    const registerRes = await agent.post('/api/auth/register').send({
      email: 'influencer@test.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'influencer',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.email).toBe('influencer@test.com');
    expect(registerRes.body.data.accessToken).toBeTruthy();
    expect(registerRes.headers['set-cookie']).toBeDefined();

    const refreshRes = await agent.post('/api/auth/refresh').send({});
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.accessToken).toBeTruthy();

    const logoutRes = await agent.post('/api/auth/logout').send({});
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);
  });

  it('rejects invalid login payload (validation)', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});



