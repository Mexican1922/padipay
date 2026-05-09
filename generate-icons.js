import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public', 'padipay-icon.svg');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. icon-512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public', 'icon-512.png'));
  console.log('Generated icon-512.png');

  // 2. icon-192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public', 'icon-192.png'));
  console.log('Generated icon-192.png');

  // 3. favicon.png (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public', 'favicon.png'));
  console.log('Generated favicon.png');

  // Copy padipay-icon.svg to favicon.svg
  fs.copyFileSync(svgPath, path.resolve('public', 'favicon.svg'));
  console.log('Copied padipay-icon.svg to favicon.svg');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
