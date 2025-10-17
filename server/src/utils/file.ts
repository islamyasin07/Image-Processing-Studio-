import fs from 'fs/promises';
import { config } from '../config';

export async function originalExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function listOriginals(): Promise<string[]> {
  try {
    const items = await fs.readdir(config.ASSETS_FULL);
    return items; 
  } catch (e: any) {
    if (e?.code === 'ENOENT') return [];
    throw e;
  }
}
