#!/usr/bin/env node
// Recomputes WCAG 2 contrast for the pairs the colours were authored against,
// in light and dark, for the semantic colours and every channel.
// Exits non-zero if any pair fails. Run: node scripts/check-contrast.mjs
import { loadTokens, CHANNELS } from './lib/tokens.mjs';
import { contrast } from './lib/oklab.mjs';

const TEXT = 4.5; // body text
const UI = 3; // control boundaries and large UI marks

const { light, dark } = loadTokens();

/** Colour lookup for one mode: dark falls back to light for anything not overridden. */
function palette(mode) {
  const map = new Map();
  for (const t of light) if (t.type === 'color') map.set(t.path.join('.'), t.value);
  if (mode === 'dark') for (const t of dark) if (t.type === 'color') map.set(t.path.join('.'), t.value);
  return (path) => {
    const c = map.get(path);
    if (!c) throw new Error(`Unknown colour ${path}`);
    return [...c.components, c.alpha ?? 1];
  };
}

function pairs() {
  const list = [];
  for (const fg of ['ink', 'muted', 'control']) {
    for (const bg of ['surface', 'canvas', 'grouped']) {
      list.push([`color.${fg}`, `color.${bg}`, fg === 'control' ? UI : TEXT]);
    }
  }
  for (const s of ['error', 'success', 'warning']) {
    list.push([`color.${s}`, `color.${s}-surface`, TEXT]);
    list.push([`color.${s}`, 'color.surface', TEXT]);
  }
  for (const v of ['error', 'error-hover', 'error-pressed']) list.push(['color.on-error', `color.${v}`, TEXT]);
  for (const ch of CHANNELS) {
    const c = (role) => `channel.${ch}.${role}`;
    list.push(['color.on-action', c('action'), TEXT]);
    list.push(['color.on-action', c('action-pressed'), TEXT]);
    list.push(['color.on-action', c('action-hover'), TEXT]);
    // The focus ring (A11Y-05): 3px of action, separated from the control by a 2px gap painted
    // in surface, drawn on any page background. Action against surface covers the gap side; the
    // other backgrounds cover the outside of the ring.
    for (const bg of ['surface', 'canvas', 'grouped']) list.push([c('action'), `color.${bg}`, UI]);
    list.push([c('ink'), c('wash-end'), TEXT]);
    for (const bg of ['surface', 'canvas', 'grouped']) list.push([c('link-visited'), `color.${bg}`, TEXT]);
    list.push([c('action'), c('subtle'), TEXT]);
  }
  return list;
}

let failures = 0;
let checked = 0;
for (const mode of ['light', 'dark']) {
  const col = palette(mode);
  let lowest = Infinity;
  for (const [fg, bg, min] of pairs()) {
    const ratio = contrast(col(fg), col(bg));
    checked++;
    lowest = Math.min(lowest, ratio / min);
    if (ratio < min) {
      failures++;
      console.error(`FAIL ${mode}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs ${min}:1)`);
    }
  }
  console.log(`${mode}: ${pairs().length} pairs checked, tightest margin ${lowest.toFixed(3)}x the minimum`);
}

if (failures) {
  console.error(`check:contrast failed: ${failures} of ${checked} pairs below threshold`);
  process.exit(1);
}
console.log(`check:contrast passed (${checked} pairs)`);
