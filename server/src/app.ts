import express from 'express';
import cors from 'cors';
import path from 'path';
import imagesRouter from './routes/images';

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
  
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err?.status || 500;
  res.status(status).json({
    error: err?.message || 'Internal Server Error',
    details: err?.details || undefined,
  });
});

export default app;
