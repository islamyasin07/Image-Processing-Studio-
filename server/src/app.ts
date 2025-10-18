import express from 'express';
import cors from 'cors';
import path from 'path';
import imagesRouter from './routes/images';
import type { Request, Response, NextFunction } from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/cache', express.static(path.resolve(process.cwd(), 'cache')));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'image-processing', version: '1.0.0' });
});

app.use('/api/images', imagesRouter);

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Image Processing API</title>
<style>body{font-family:system-ui;padding:24px;line-height:1.5}</style></head>
<body>
  <h1>Image Processing API</h1>
  <ul>
    <li><a href="/health">/health</a></li>
    <li><a href="/api/images/list">/api/images/list</a></li>
    <li>GET /api/images?filename=<b>NAME</b>&width=<b>W</b>&height=<b>H</b></li>
  </ul>
</body></html>`);
});


app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  type ErrShape = { status?: unknown; message?: unknown; details?: unknown };

  const e = err as ErrShape;

  const status = typeof e.status === 'number' ? (e.status as number) : 500;

  const message =
    typeof e.message === 'string'
      ? (e.message as string)
      : err instanceof Error
        ? err.message
        : 'Internal Server Error';

  const body: { error: string; details?: unknown } = { error: message };
  if (typeof e.details !== 'undefined') body.details = e.details;

  res.status(status).json(body);
});

export default app;
