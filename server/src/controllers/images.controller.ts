import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from '../config';
import { ensureCacheDir, getCachePath, fileExists } from '../utils/cache';
import { validateQuery } from '../utils/validate';
import { originalExists, listOriginals } from '../utils/file';
import { resize } from '../services/resize.service';

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename, width, height } = validateQuery(req.query);

    const baseName = path.parse(filename).name; 
    const originalPath = path.resolve(config.ASSETS_FULL, `${baseName}.jpg`);

    if (!(await originalExists(originalPath))) {
      const err: any = new Error('Image not found');
      err.status = 404;
      err.details = { filename: baseName };
      throw err;
    }

    await ensureCacheDir();
    const cachePath = getCachePath(baseName, width, height);

    if (!(await fileExists(cachePath))) {
      await resize(originalPath, cachePath, width, height);
    }

    return res.sendFile(cachePath);
  } catch (err) {
    next(err);
  }
};

export const listImages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await listOriginals();
    const names = items
      .filter((n) => n.toLowerCase().endsWith('.jpg'))
      .map((n) => path.parse(n).name);
    res.json({ images: names });
  } catch (err) {
    next(err);
  }
};
