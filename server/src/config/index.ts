import path from 'path';

export const config = {
  PORT: Number(process.env.PORT) || 3000,
  ASSETS_FULL: path.resolve(process.cwd(), 'assets', 'full'),
  CACHE_DIR: path.resolve(process.cwd(), 'cache'),
};
