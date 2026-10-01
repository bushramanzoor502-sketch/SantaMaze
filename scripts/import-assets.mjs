// Imports and optimizes art from the game project into public/assets.
// The game folder is only ever READ: every output is written under public/.
//
//   GAME_DIR="E:/Android Projects/Maze" npm run assets

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const GAME = process.env.GAME_DIR ?? 'E:/Android Projects/Maze';
const OUT = path.resolve('public/assets');

const shipped = (p) => path.join(GAME, 'app/src/main/assets', p);
const archive = (p) => path.join(GAME, 'art_src/removed_2026-09-28', p);

const WORLDS = [
  { id: 'snowy-village', loading: 'img_loading_snowy.png', playground: 'playground_snowy_village.png', globe: 'globe_snowy_village.webp' },
  { id: 'winter-forest', loading: 'img_loading_winter.png', playground: 'playground_winter_forest.png', globe: 'globe_winter_forest.webp' },
  { id: 'ice-castle', loading: 'img_loading_ice.png', playground: 'playground_ice_castle.png', globe: 'globe_ice_castle.webp' },
  { id: 'workshop', loading: 'img_loading_workshop.png', playground: 'playground_workshop.png', globe: 'globe_workshop.webp' },
];
const SANTAS = ['red', 'blue', 'green', 'black'];

let written = 0;

async function out(rel) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  return file;
}

/** Writes a webp at each requested width as name-<w>.webp (never upscales). */
async function widths(src, rel, list, quality = 78) {
  const meta = await sharp(src).metadata();
  for (const w of list) {
    const width = Math.min(w, meta.width);
    await sharp(src).resize({ width }).webp({ quality, effort: 5 }).toFile(await out(`${rel}-${w}.webp`));
    written++;
  }
}

async function single(src, rel, opts = {}) {
  let img = sharp(src);
  if (opts.width) img = img.resize({ width: opts.width, withoutEnlargement: true });
  await img.webp({ quality: opts.quality ?? 80, effort: 5, alphaQuality: 90 }).toFile(await out(rel));
  written++;
}

async function main() {
  await fs.access(GAME).catch(() => {
    throw new Error(`Game project not found at ${GAME}. Set GAME_DIR.`);
  });

  // Brand
  await widths(shipped('art/ui/logo.webp'), 'brand/logo', [1143, 640], 85);
  await widths(shipped('art/ui/santa_walk.webp'), 'brand/santa-walk', [834, 420], 82);
  await widths(shipped('art/ui/island_splash.webp'), 'brand/island-splash', [1070, 640], 80);
  await widths(shipped('art/ui/island_dash.webp'), 'brand/island-dash', [1056, 640], 80);

  // Scenes / backgrounds
  await widths(archive('bg_dashboard.png'), 'scenes/night-village', [1949, 1280, 768], 74);
  await widths(shipped('art/ui/bg_outdoor.webp'), 'scenes/sunset', [1672, 960], 74);
  await widths(shipped('art/ui/bg_characters.webp'), 'scenes/fireside', [1672, 960], 74);
  await single(shipped('art/bg_gameplay.webp'), 'scenes/gameplay-hud.webp', { quality: 88 });
  await single(shipped('art/bg_dialog.webp'), 'ui/dialog-frame.webp', { width: 1000, quality: 82 });

  // Worlds
  for (const w of WORLDS) {
    await widths(archive(`png_originals/${w.loading}`), `worlds/${w.id}`, [1672, 960, 640], 76);
    await widths(archive(`png_originals/${w.playground}`), `maps/${w.id}`, [1672, 960], 76);
    await single(shipped(`art/ui/${w.globe}`), `globes/${w.id}.webp`, { width: 420, quality: 82 });
  }

  // Characters: sheets are 8 frames x 4 directions (rows: up, right, down, left).
  for (const c of SANTAS) {
    const dir = shipped(`art/characters/santa_${c}`);
    // Display sheets at 192px frames (1536x768) for the character select.
    await single(path.join(dir, 'idle.webp'), `characters/${c}/idle.webp`, { width: 1536, quality: 80 });
    await single(path.join(dir, 'walk.webp'), `characters/${c}/walk.webp`, { width: 1536, quality: 80 });
    // Front-facing still: idle, row 2 (down), frame 0.
    const idle = sharp(path.join(dir, 'idle.webp'));
    const m = await idle.metadata();
    const fw = m.width / 8;
    const fh = m.height / 4;
    await sharp(path.join(dir, 'idle.webp'))
      .extract({ left: 0, top: Math.round(fh * 2), width: Math.round(fw), height: Math.round(fh) })
      .resize({ width: 256 })
      .webp({ quality: 85, alphaQuality: 90 })
      .toFile(await out(`characters/${c}/still.webp`));
    written++;
  }
  // Small walk sheet (128px frames) used as the 3D billboard texture.
  await single(shipped('art/characters/santa_red/walk.webp'), 'three/santa-walk.webp', { width: 1024, quality: 82 });

  // Objects (props used as stickers and 3D billboards)
  const village = archive('objects/snowy_village/objects');
  for (const name of ['gift_red', 'gift_green', 'christmas_tree_large', 'festive_lamp', 'snowy_pine', 'village_gate', 'cottage']) {
    await single(path.join(village, `${name}.png`), `objects/${name.replace(/_/g, '-')}.webp`, { width: 256, quality: 84 });
  }
  await single(archive('objects/snowy_village/additional_objects/snowman.png'), 'objects/snowman.webp', { width: 256, quality: 84 });

  // Favicon + touch icon from the red gift
  const gift = path.join(village, 'gift_red.png');
  await sharp(gift).trim().resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.resolve('public/favicon.png'));
  await sharp(gift).trim().resize(150, 150, { fit: 'contain', background: '#061A38' })
    .extend({ top: 15, bottom: 15, left: 15, right: 15, background: '#061A38' })
    .png().toFile(path.resolve('public/apple-touch-icon.png'));
  written += 2;

  // Open Graph image: night village + logo
  const logo = await sharp(shipped('art/ui/logo.webp')).resize({ width: 640 }).toBuffer();
  await sharp(archive('bg_dashboard.png'))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([{ input: logo, gravity: 'centre' }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.resolve('public/og-image.jpg'));
  written++;

  console.log(`Wrote ${written} files to ${OUT} (game folder untouched).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
