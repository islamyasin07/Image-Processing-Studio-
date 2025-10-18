import fs from 'fs/promises';
import { Dirent } from 'fs';
import { config } from '../config';

export async function originalExists(fullPath: string): Promise<boolean> {
  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

export async function listOriginals(): Promise<string[]> {
  try {
    const dirents: Dirent[] = await fs.readdir(config.ASSETS_FULL, {
      withFileTypes: true,
    });
    return dirents.filter((d) => d.isFile()).map((d) => d.name);
  } catch {
    return [];
  }
}
