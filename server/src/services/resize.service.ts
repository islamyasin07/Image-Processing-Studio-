import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';


export async function resize(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> {
  if (!inputPath || !outputPath) {
    throw new Error('Invalid input or output path.');
  }
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive numbers.');
  }


  try {
    await fs.access(inputPath);
  } catch {
    throw new Error('Input image not found.');
  }


  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  try {
    await sharp(inputPath)
      .resize(width, height, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
  } catch (err) {
    throw new Error(`Failed to resize image: ${(err as Error).message}`);
  }
}
