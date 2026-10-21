#!/usr/bin/env node
/**
 * Builds the Dubai W23 web fonts: Latin and Arabic subsets of Regular, Medium and Bold
 * (Light is dropped, decision A3), and src/global/fonts.css with their @font-face rules.
 *
 *   npm run fonts                       # reads ~/Library/Fonts/DubaiW23-*.ttf
 *   SC_FONT_SRC=/path/to/ttfs npm run fonts
 *
 * Needs HarfBuzz's hb-subset on PATH (brew install harfbuzz; apt install libharfbuzz-bin).
 * The WOFF2 encoder is scripts/lib/woff2.mjs (Node's own Brotli), so nothing else is needed.
 * The outputs are committed, so `npm run build` and CI never need hb-subset or the TTFs.
 *
 * Licence: Dubai Font is "Copyright © 2017 Dubai Executive Council. All rights reserved."
 * (name ID 0 of the TTFs, kept in every subset with the other name records). The desktop
 * TTFs are not committed; only the web subsets are, as the v1 WOFF2 files were. The input
 * files are checked against the SHA-256 sums below, so a different font version cannot
 * slip in unnoticed.
 *
 * Exact command per file (what this script runs):
 *   hb-subset DubaiW23-Regular.ttf --output-file=out.ttf --unicodes=<ranges> \
 *     --layout-features=<FEATURES below> --drop-tables+=kern,VDMX --name-IDs+=13,14
 * then sfntToWoff2(out.ttf).
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sfntToWoff2 } from './lib/woff2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'fonts');
const cssFile = join(root, 'src', 'global', 'fonts.css');
const src = process.env.SC_FONT_SRC || join(homedir(), 'Library', 'Fonts');

/** Source files (Dubai W23 1.10, build 2) and their SHA-256. */
const WEIGHTS = [
  { weight: 400, file: 'DubaiW23-Regular.ttf', sha256: '082515f8bfc555cf857e5e973f09608e00111a431001ec4f958ee7723a57d396' },
  { weight: 500, file: 'DubaiW23-Medium.ttf', sha256: 'c921aa9d408b9a1b0e70a0b777de5a3ed99a1262029644e16231e3224c3c3bcc' },
  { weight: 700, file: 'DubaiW23-Bold.ttf', sha256: 'c576ddf6db7072d012f19627ee7a0d83164768a498cf4065b5ee3a9f29c7c3a1' },
];

/** Latin letters and the punctuation, symbols and spaces English text uses (architecture §3.5). */
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
/** Arabic script, joiners and the bidi controls. */
const ARABIC = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200F,U+2010-2011,U+204F,U+2066-2069,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
/**
 * What Arabic text also uses from the Latin block: spaces, digits (always Latin, LANG-20),
 * ASCII punctuation, guillemets, the multiplication and division signs, dashes, quotes and
 * the minus sign. These glyphs go into the Arabic file too, and the "Dubai W23 Arabic" face
 * claims them, so an Arabic page needs only the Arabic file.
 */
const ARABIC_COMMON = 'U+0020-0040,U+005B-0060,U+007B-007E,U+00A0,U+00AB,U+00BB,U+00D7,U+00F7,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2212';

/**
 * Metric-matched fallback faces, so the swap from the local font to Dubai W23 does not move
 * text (CLS 0). size-adjust is the ratio of Dubai W23's average advance to the local font's
 * over a sample of real UI text, measured in Helium by scripts/measure-font-fallback.mjs.
 * The overrides are Dubai's hhea metrics (ascender 1129, descender 559, line gap 0 on a
 * 1000 UPM em) divided by size-adjust, because browsers scale overrides by size-adjust.
 */
const FALLBACK = {
  // Measured 21 October 2026, Helium 0.19 on macOS.
  latin: { local: { 400: ['Arial', 'ArialMT'], 700: ['Arial Bold', 'Arial-BoldMT'] }, sizeAdjust: { 400: 0.914, 700: 0.8952 } },
  arabic: { local: { 400: ['Tahoma', 'Geeza Pro'], 700: ['Tahoma Bold', 'Tahoma-Bold', 'Geeza Pro Bold'] }, sizeAdjust: { 400: 0.8661, 700: 0.7901 } },
};
const ASCENT = 1129;
const DESCENT = 559;
const UPM = 1000;

const pct = (n) => `${Number((n * 100).toFixed(2))}%`;
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const fileName = (weight, subset) => `dubai-w23-${weight}-${subset}.woff2`;

/**
 * OpenType features kept: what Arabic shaping and Latin text need. Dropped: aalt, dlig, frac,
 * numr, dnom, sups, ordn, onum, pnum. Digits stay the font's default tabular lining figures
 * (TYP-08), and dropping the alternates' glyphs keeps each file under the 32 KiB budget.
 * Hinting is kept for Windows. The legacy kern table is dropped: GPOS carries kern.
 */
const FEATURES = 'ccmp,locl,init,medi,fina,isol,rlig,liga,calt,rclt,curs,kern,mark,mkmk,case';

function subset(ttf, unicodes, out) {
  execFileSync('hb-subset', [ttf, `--output-file=${out}`, `--unicodes=${unicodes}`, `--layout-features=${FEATURES}`, '--drop-tables+=kern,VDMX', '--name-IDs+=13,14'], { stdio: 'inherit' });
}

function build() {
  const tmp = mkdtempSync(join(tmpdir(), 'sc-fonts-'));
  for (const f of readdirSync(outDir)) if (f.endsWith('.woff2')) unlinkSync(join(outDir, f));
  const sizes = [];
  try {
    for (const { weight, file, sha256 } of WEIGHTS) {
      const ttf = join(src, file);
      if (!existsSync(ttf)) throw new Error(`Missing ${ttf}. Set SC_FONT_SRC to the folder with the Dubai W23 TTFs.`);
      const got = sha(readFileSync(ttf));
      if (got !== sha256) throw new Error(`${file}: SHA-256 ${got} does not match the expected Dubai W23 1.10 file`);
      for (const [name, ranges] of [['latin', LATIN], ['arabic', `${ARABIC},${ARABIC_COMMON}`]]) {
        const out = join(tmp, `${weight}-${name}.ttf`);
        subset(ttf, ranges, out);
        const woff2 = sfntToWoff2(readFileSync(out));
        writeFileSync(join(outDir, fileName(weight, name)), woff2);
        sizes.push(`${fileName(weight, name)}  ${woff2.length} B (${(woff2.length / 1024).toFixed(1)} KiB)`);
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  writeFileSync(cssFile, fontsCss());
  console.log(`subset-fonts: wrote ${sizes.length} files to src/assets/fonts and src/global/fonts.css\n  ${sizes.join('\n  ')}`);
}

function face(family, weight, file, range) {
  return `@font-face {
  font-family: '${family}';
  src: url('assets/fonts/${file}') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
  unicode-range: ${range};
}`;
}

function fallbackFace(script, weight, range) {
  const f = FALLBACK[script];
  const adjust = f.sizeAdjust[weight];
  return `@font-face {
  font-family: 'Dubai W23 Fallback';
  src: ${f.local[weight].map((n) => `local('${n}')`).join(', ')};
  font-weight: ${weight === 700 ? '600 900' : '100 599'};
  size-adjust: ${pct(adjust)};
  ascent-override: ${pct(ASCENT / UPM / adjust)};
  descent-override: ${pct(DESCENT / UPM / adjust)};
  line-gap-override: 0%;
  unicode-range: ${range};
}`;
}

function fontsCss() {
  const L = [
    '/* Generated by scripts/subset-fonts.mjs. Do not edit; run `npm run fonts`. */',
    '/*',
    ' * Dubai W23 (Dubai Font). Copyright © 2017 Dubai Executive Council. All rights reserved.',
    ' *',
    ' * One family, "Dubai W23", with real weights (400, 500, 700): the Latin file for Latin',
    ' * text, the Arabic file for Arabic letters. "Dubai W23 Arabic" is the same Arabic files',
    ' * claiming spaces, digits and punctuation as well; --sc-font-family puts it first under',
    ' * lang="ar", so an Arabic page downloads only the Arabic files (and the Latin file only',
    ' * where Latin letters appear). Fonts load only for the characters and weights a page uses.',
    ' *',
    ' * Preload the Regular file of the page language (one file only; see CONVENTIONS.md):',
    " *   <link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin href=\".../assets/fonts/dubai-w23-400-latin.woff2\">",
    ' */',
  ];
  for (const { weight } of WEIGHTS) L.push(face('Dubai W23', weight, fileName(weight, 'latin'), LATIN));
  for (const { weight } of WEIGHTS) L.push(face('Dubai W23', weight, fileName(weight, 'arabic'), ARABIC));
  for (const { weight } of WEIGHTS) L.push(face('Dubai W23 Arabic', weight, fileName(weight, 'arabic'), `${ARABIC},${ARABIC_COMMON}`));
  L.push('/* Metric-matched local fallbacks: the text keeps its size and lines while Dubai W23 loads. */');
  for (const w of [400, 700]) L.push(fallbackFace('latin', w, LATIN));
  for (const w of [400, 700]) L.push(fallbackFace('arabic', w, ARABIC));
  return L.join('\n') + '\n';
}

if (process.argv.includes('--css-only')) {
  writeFileSync(cssFile, fontsCss());
  console.log('subset-fonts: wrote src/global/fonts.css');
} else {
  build();
}
