import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from '../config';
import { ensureCacheDir, getCachePath, fileExists } from '../utils/cache';
import { validateQuery } from '../utils/validate';
import { originalExists, listOriginals } from '../utils/file';
import { resize } from '../services/resize.service';

export const getImage = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const v = validateQuery(req.query);
    if (!v.ok) {
      return res.status(v.status).json({ error: v.message });
    }

    const { filename, width, height } = v;
    const baseName = path.parse(filename).name;
    const originalPath = path.resolve(config.ASSETS_FULL, `${baseName}.jpg`);

    if (!(await originalExists(originalPath))) {
      return res
        .status(404)
        .json({ error: `Original image not found: ${baseName}.jpg` });
    }

    await ensureCacheDir();
    const cachePath = getCachePath(baseName, width, height);

    if (!(await fileExists(cachePath))) {
      await resize(originalPath, cachePath, width, height);
    }

    return res.sendFile(cachePath);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ error: message });
  }
};

export const listImages = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const items = await listOriginals();
    const names = items
      .filter((n) => n.toLowerCase().endsWith('.jpg'))
      .map((n) => path.parse(n).name);

    return res.status(200).json({ images: names });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ error: message });
  }
};
