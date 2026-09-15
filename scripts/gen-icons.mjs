#!/usr/bin/env node
// Generates the PWA icons + favicon.ico with no dependencies: a solid lacquer-green square
// (#0E5A45) with a porcelain (#F7F4EF) pixel "P", written as PNG via zlib. Run `npm run icons`.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const GREEN = [0x0e, 0x5a, 0x45];
const PORCELAIN = [0xf7, 0xf4, 0xef];
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// 5x7 pixel "P"
const GLYPH = ['11110', '10001', '10001', '11110', '10000', '10000', '10000'];

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png(size) {
  const rows = [];
  const cell = Math.max(1, Math.floor((size * 0.5) / GLYPH.length));
  const gw = cell * GLYPH[0].length;
  const gh = cell * GLYPH.length;
  const ox = Math.floor((size - gw) / 2);
  const oy = Math.floor((size - gh) / 2);
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x - ox) / cell);
      const gy = Math.floor((y - oy) / cell);
      const on =
        gx >= 0 && gy >= 0 && gy < GLYPH.length && gx < GLYPH[0].length && GLYPH[gy][gx] === '1';
      const [r, g, b] = on ? PORCELAIN : GREEN;
      const i = 1 + x * 4;
      row[i] = r;
      row[i + 1] = g;
      row[i + 2] = b;
      row[i + 3] = 255;
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ICO wrapping a single 32x32 PNG (valid since Vista; every modern browser).
function ico(size) {
  const image = png(size);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = size;
  entry[1] = size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, image]);
}

const out = join(process.cwd(), 'public');
mkdirSync(join(out, 'icons'), { recursive: true });
for (const s of SIZES) writeFileSync(join(out, 'icons', `icon-${s}x${s}.png`), png(s));
writeFileSync(join(out, 'favicon.ico'), ico(32));
console.log(`gen-icons — wrote ${SIZES.length} PNGs to public/icons and public/favicon.ico`);
