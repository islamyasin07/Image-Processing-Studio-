import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import request from 'supertest';
import app from '../app';
import { config } from '../config';

const FIXTURE = 'specfixture'; 

async function ensureFixture() {
  const full = path.resolve(config.ASSETS_FULL, `${FIXTURE}.jpg`);
  try {
    await fs.access(full);
  } catch {
    await fs.mkdir(config.ASSETS_FULL, { recursive: true });
    await sharp({
      create: {
        width: 100,
        height: 60,
        channels: 3,
        background: { r: 40, g: 200, b: 120 },
      },
    })
      .jpeg({ quality: 90 })
      .toFile(full);
  }
}

describe('image resize', () => {
  beforeAll(async () => {
    await ensureFixture();
  });

  it('400 when width is not a pure integer string', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: FIXTURE, width: '500f', height: '300' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      jasmine.objectContaining({ error: jasmine.any(String) })
    );
  });

  it('400 when missing filename', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ width: '200', height: '200' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/missing "filename"/i);
  });

  it('400 when width is 0 or negative', async () => {
    const zero = await request(app)
      .get('/api/images')
      .query({ filename: FIXTURE, width: '0', height: '200' });
    expect(zero.status).toBe(400);

    const negative = await request(app)
      .get('/api/images')
      .query({ filename: FIXTURE, width: '-1', height: '200' });
    expect(negative.status).toBe(400);
  });

  it('400 when filename pattern is invalid (e.g., fjord123)', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: 'fjord123', width: '200', height: '200' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid "filename"/i);
  });

  it('404 when original not found', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: 'doesnotexist', width: '200', height: '200' });
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
