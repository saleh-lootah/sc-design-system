#!/usr/bin/env node
// Fails if any colour, light or dark, sits in OKLCH hue 160-215 with chroma above 0.015.
// Covers semantic, channel and shadow colours. Run: node scripts/check-teal.mjs
import { loadTokens } from './lib/tokens.mjs';
import { lch } from './lib/oklab.mjs';

const HUE_MIN = 160, HUE_MAX = 215, CHROMA_MAX = 0.015;
const { light, dark } = loadTokens();

/** Every DTCG colour object in a token value, including inside shadow composites. */
function colorsIn(value) {
  if (Array.isArray(value)) return value.flatMap(colorsIn);
  if (value && typeof value === 'object') {
    if (value.colorSpace) return [value];
    return Object.values(value).flatMap(colorsIn);
  }
  return [];
}

let checked = 0;
const bad = [];
for (const [mode, list] of [['light', light], ['dark', dark]]) {
  for (const t of list) {
    for (const c of colorsIn(t.value)) {
      checked++;
      if (c.colorSpace !== 'oklab') bad.push(`${mode} ${t.path.join('.')}: not oklab (${c.colorSpace})`);
      const [, C, h] = lch(...c.components);
      if (C > CHROMA_MAX && h >= HUE_MIN && h <= HUE_MAX) {
        bad.push(`${mode} ${t.path.join('.')}: hue ${h.toFixed(1)}, chroma ${C.toFixed(3)}`);
      }
    }
  }
}

if (bad.length) {
  for (const b of bad) console.error(`FAIL ${b}`);
  console.error(`check:teal failed: ${bad.length} colour(s) in the teal band`);
  process.exit(1);
}
console.log(`check:teal passed (${checked} colours, none in hue ${HUE_MIN}-${HUE_MAX} above chroma ${CHROMA_MAX})`);
