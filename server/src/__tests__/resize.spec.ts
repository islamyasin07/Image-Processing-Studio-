import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import request from 'supertest';
import app from '../app';
import { config } from '../config';

const FIXTURE = 'spec-fixture';

async function ensureFixture() {
  const full = path.resolve(config.ASSETS_FULL, `${FIXTURE}.jpg`);
  try { await fs.access(full); }
  catch {
    await fs.mkdir(config.ASSETS_FULL, { recursive: true });
    await sharp({ create: { width: 100, height: 60, channels: 3, background: { r: 40, g: 200, b: 120 } } })
      .jpeg({ quality: 90 })
      .toFile(full);
  }
}

describe('image resize', () => {
  beforeAll(async () => { await ensureFixture(); });

  it('returns resized image', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: FIXTURE, width: 200, height: 150 });

    expect(res.status).toBe(200);
    expect(String(res.headers['content-type'] || '')).toMatch(/image\/jpeg|image\/jpg/);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('400 on invalid params', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: FIXTURE, width: 0, height: 100 });
    expect(res.status).toBe(400);
  });

  it('404 on missing original', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: 'does-not-exist', width: 100, height: 100 });
    expect(res.status).toBe(404);
  });
});
