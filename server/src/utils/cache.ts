import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';

export function getCachePath(basename: string, width: number, height: number): string {
  const name = `${basename}_${width}x${height}.jpg`;
  return path.resolve(config.CACHE_DIR, name);
}

export async function ensureCacheDir(): Promise<void> {
  await fs.mkdir(config.CACHE_DIR, { recursive: true });
}

export async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
