/**
 * Minimal WOFF2 encoder for TrueType fonts. No dependencies (Node's zlib has Brotli).
 *
 * It writes every table with the null transform (glyf and loca as transform version 3,
 * every other table as version 0), which the WOFF2 spec allows and every browser decodes.
 * The glyf/loca transform would save another 5-10%; it is not worth a dependency here.
 *
 *   import { sfntToWoff2 } from './lib/woff2.mjs';
 *   writeFileSync('font.woff2', sfntToWoff2(readFileSync('font.ttf')));
 *
 * Spec: https://www.w3.org/TR/WOFF2/
 */
import { brotliCompressSync, constants as Z } from 'node:zlib';

/** UIntBase128 as defined by WOFF2 section 4.1. */
function base128(n) {
  const bytes = [];
  do {
    bytes.unshift(n & 0x7f);
    n >>>= 7;
  } while (n > 0);
  for (let i = 0; i < bytes.length - 1; i++) bytes[i] |= 0x80;
  return Buffer.from(bytes);
}

/** Reads the table directory of an sfnt (TrueType) file. */
function readSfnt(buf) {
  const flavor = buf.readUInt32BE(0);
  if (flavor !== 0x00010000 && flavor !== 0x74727565) throw new Error('Not a TrueType sfnt');
  const numTables = buf.readUInt16BE(4);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = buf.toString('latin1', o, o + 4);
    const offset = buf.readUInt32BE(o + 8);
    const length = buf.readUInt32BE(o + 12);
    tables.push({ tag, data: buf.subarray(offset, offset + length) });
  }
  return { flavor, tables };
}

export function sfntToWoff2(ttf) {
  const { flavor, tables } = readSfnt(ttf);
  // Directory order is the order of data in the stream. Sort by tag, as the sfnt does, and
  // keep loca right after glyf (the spec requires it when glyf is present).
  tables.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  const gi = tables.findIndex((t) => t.tag === 'glyf');
  const li = tables.findIndex((t) => t.tag === 'loca');
  if (gi >= 0 && li >= 0 && li !== gi + 1) {
    const [loca] = tables.splice(li, 1);
    tables.splice(tables.findIndex((t) => t.tag === 'glyf') + 1, 0, loca);
  }

  const dir = [];
  for (const t of tables) {
    // 63 = "arbitrary tag follows". Transform version: 3 (null) for glyf/loca, 0 (null) otherwise.
    const version = t.tag === 'glyf' || t.tag === 'loca' ? 3 : 0;
    dir.push(Buffer.from([(version << 6) | 63]), Buffer.from(t.tag, 'latin1'), base128(t.data.length));
  }
  const directory = Buffer.concat(dir);
  const stream = Buffer.concat(tables.map((t) => t.data));
  const compressed = brotliCompressSync(stream, {
    params: {
      [Z.BROTLI_PARAM_MODE]: Z.BROTLI_MODE_FONT,
      [Z.BROTLI_PARAM_QUALITY]: 11,
      [Z.BROTLI_PARAM_LGWIN]: 24,
      [Z.BROTLI_PARAM_SIZE_HINT]: stream.length,
    },
  });

  // The decoded sfnt: 12-byte header, 16 bytes per table, each table padded to 4 bytes.
  const totalSfntSize = 12 + 16 * tables.length + tables.reduce((n, t) => n + ((t.data.length + 3) & ~3), 0);
  const headerSize = 48;
  const unpadded = headerSize + directory.length + compressed.length;
  const length = (unpadded + 3) & ~3;

  const header = Buffer.alloc(headerSize);
  header.write('wOF2', 0, 'latin1');
  header.writeUInt32BE(flavor === 0x74727565 ? 0x00010000 : flavor, 4);
  header.writeUInt32BE(length, 8);
  header.writeUInt16BE(tables.length, 12);
  header.writeUInt16BE(0, 14); // reserved
  header.writeUInt32BE(totalSfntSize, 16);
  header.writeUInt32BE(compressed.length, 20);
  header.writeUInt16BE(1, 24); // majorVersion (font version, informational)
  header.writeUInt16BE(0, 26);
  // metaOffset, metaLength, metaOrigLength, privOffset, privLength: all 0.

  return Buffer.concat([header, directory, compressed, Buffer.alloc(length - unpadded)]);
}
