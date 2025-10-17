import request from 'supertest';
import app from '../app';

describe('API basic endpoints', () => {
  it('GET /health returns ok:true', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBeTrue();
  });

  it('GET /api/images/list returns an array', async () => {
    const res = await request(app).get('/api/images/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.images)).toBeTrue();
  });
});
