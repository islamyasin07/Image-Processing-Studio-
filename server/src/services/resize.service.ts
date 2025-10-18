import sharp from 'sharp';

export async function resize(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> {
  await sharp(inputPath)
    .resize(width, height, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}
