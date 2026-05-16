// Image compression script using sharp
// Run: npm install sharp && node compress.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images_compressed');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const files = fs.readdirSync(IMAGES_DIR);

(async () => {
    let totalBefore = 0, totalAfter = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const src = path.join(IMAGES_DIR, file);
        const stat = fs.statSync(src);
        totalBefore += stat.size;

        // Skip videos - just copy them
        if (['.mov', '.mp4', '.m4v'].includes(ext)) {
            fs.copyFileSync(src, path.join(OUTPUT_DIR, file));
            totalAfter += stat.size;
            console.log(`[COPY] ${file} (video)`);
            continue;
        }

        // Skip non-image files
        if (!['.png', '.jpg', '.jpeg', '.webp', '.heic'].includes(ext)) {
            fs.copyFileSync(src, path.join(OUTPUT_DIR, file));
            totalAfter += stat.size;
            continue;
        }

        // Compress: convert all to .jpg, resize to max 1200px wide
        const outName = file.replace(/\.(png|PNG|jpeg|JPEG|webp|WEBP|heic|HEIC)$/i, '.jpg');
        const outPath = path.join(OUTPUT_DIR, outName);

        try {
            await sharp(src)
                .resize(1200, null, { withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(outPath);

            const newStat = fs.statSync(outPath);
            totalAfter += newStat.size;
            const ratio = ((1 - newStat.size / stat.size) * 100).toFixed(1);
            console.log(`[OK] ${file} → ${outName} (${(stat.size/1024/1024).toFixed(1)}MB → ${(newStat.size/1024/1024).toFixed(1)}MB, -${ratio}%)`);
        } catch (e) {
            // If compression fails, copy original
            fs.copyFileSync(src, path.join(OUTPUT_DIR, file));
            totalAfter += stat.size;
            console.log(`[SKIP] ${file} - ${e.message}`);
        }
    }

    console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB`);
    console.log(`\nDone! Now:`);
    console.log(`1. Rename 'images' to 'images_original'`);
    console.log(`2. Rename 'images_compressed' to 'images'`);
    console.log(`3. Update HTML: change .PNG/.png extensions to .jpg where needed`);
})();

