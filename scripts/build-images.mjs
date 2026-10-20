/**
 * Turn originals in images-src/ into responsive AVIF files in public/images/:
 *   images-src/kurt.jpg → public/images/kurt-384.avif, -640, -960, -1280, -1920
 * Only re-encodes when the original is newer than its outputs. Runs before dev/build.
 * The widths here must match WIDTHS in src/lib/imageLoader.ts.
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SRC = join(ROOT, "images-src");
const OUT = join(ROOT, "public/images");
const WIDTHS = [384, 640, 960, 1280, 1920];

if (!existsSync(SRC)) {
  console.log("images: no images-src/ folder — run `npm run placeholders` first");
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

let made = 0;
for (const file of readdirSync(SRC)) {
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"].includes(extname(file).toLowerCase())) continue;
  const key = basename(file, extname(file));
  const src = join(SRC, file);
  const srcTime = statSync(src).mtimeMs;
  for (const w of WIDTHS) {
    const out = join(OUT, `${key}-${w}.avif`);
    if (existsSync(out) && statSync(out).mtimeMs >= srcTime) continue;
    await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).avif({ quality: 52, effort: 4 }).toFile(out);
    made++;
  }
}
console.log(`images: ${made ? `encoded ${made} file(s)` : "up to date"}`);
