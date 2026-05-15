import sharp from "sharp";
import fs from "fs";

const INPUT  = "public/liver-cursor.webp";
const OUTPUT = "public/liver-cursor.png";

const img = sharp(INPUT);
const meta = await img.metadata();
console.log(`Input: ${meta.width}x${meta.height}, format=${meta.format}`);

// Get raw pixel data (RGBA)
const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data); // copy

// Background-removal: any pixel close to white -> transparent.
// Use a generous threshold so off-white anti-aliased edges fade smoothly.
const THRESHOLD = 235;   // pixel brightness above this = background
const SOFT      = 215;   // brightness above this = partially transparent

for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    // luminance-ish brightness
    const brightness = (r + g + b) / 3;

    if (brightness >= THRESHOLD) {
        out[i + 3] = 0; // fully transparent
    } else if (brightness >= SOFT) {
        // smooth alpha falloff between SOFT and THRESHOLD
        const t = (brightness - SOFT) / (THRESHOLD - SOFT); // 0..1
        out[i + 3] = Math.round(255 * (1 - t));
    }
}

await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(OUTPUT);

console.log(`Saved transparent PNG: ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB)`);
