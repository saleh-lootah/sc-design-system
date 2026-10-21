#!/usr/bin/env node
// Recomputes WCAG 2 contrast for every role pair defined in docs/v2/foundations.md,
// in light and dark, for the system roles and every channel. Exits non-zero if any
// pair fails. Run: node scripts/check-contrast.mjs
//   --markdown   print the results as the tables used in docs/v2/foundations.md
//   --verbose    print every pair
//
// A background written "base+state:content" is the base colour with a state layer of
// the content colour on top (color-mix(in oklab, content <opacity>, transparent)),
// composited in sRGB as browsers do.
import { loadTokens, CHANNELS } from './lib/tokens.mjs';
import { toSrgb01 } from './lib/oklab.mjs';

const TEXT = 4.5; // WCAG 1.4.3: text and images of text
const UI = 3; // WCAG 1.4.11: control boundaries, focus indicators, meaningful graphics

const args = new Set(process.argv.slice(2));
const { light, dark, byPath, darkByPath } = loadTokens();
const opacity = Object.fromEntries(light.filter((t) => t.path[0] === 'opacity').map((t) => [t.path[1], t.value]));

// ---------------------------------------------------------------- colour maths

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lumOf = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const rgbOf = (c) => toSrgb01(...c.components);
const ratio = (y1, y2) => (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);

/** Colour lookup for one mode, as gamma sRGB 0..1 (translucent colours composited later). */
function lookup(mode) {
  const map = mode === 'dark' ? darkByPath : byPath;
  return (name) => {
    const t = map.get(name.includes('.') ? name : `color.${name}`);
    if (!t || t.type !== 'color') throw new Error(`Unknown colour ${name}`);
    return { rgb: rgbOf(t.value), alpha: t.value.alpha ?? 1 };
  };
}

/** Resolve a background spec, including "base+hover:content" state layers. */
function background(spec, col) {
  const m = /^(.+)\+(hover|pressed):(.+)$/.exec(spec);
  if (!m) return col(spec).rgb;
  const [, base, state, content] = m;
  const b = col(base).rgb, c = col(content).rgb, a = opacity[state];
  return b.map((x, i) => x * (1 - a) + c[i] * a);
}

// ---------------------------------------------------------------- pairs

const SURFACES = ['surface', 'surface-card', 'surface-container', 'surface-container-high'];
const STATUSES = ['error', 'success', 'warning', 'info'];
const TINTS = ['blue', 'violet', 'rose', 'orange', 'amber', 'green'];

/** [group, foreground, background, minimum, use] */
function systemPairs() {
  const P = [];
  const add = (g, fg, bgs, min, use) => [].concat(bgs).forEach((bg) => P.push([g, fg, bg, min, use]));
  add('Text', 'on-surface', [...SURFACES, 'primary-subtle', 'primary-container'], TEXT, 'Primary text');
  add('Text', 'on-surface-variant', [...SURFACES, 'primary-subtle'], TEXT, 'Secondary text');
  add('Text', 'inverse-on-surface', 'inverse-surface', TEXT, 'Tooltip and toast text');
  add('State layers', 'on-surface', ['surface+hover:on-surface', 'surface+pressed:on-surface', 'surface-container+pressed:on-surface'], TEXT, 'Text on a hovered or pressed quiet control');
  add('Boundaries', 'outline', [...SURFACES, 'primary-subtle'], UI, 'Control edge (1.5px)');
  add('Boundaries', 'on-disabled', 'disabled-container', UI, 'Disabled control (exempt in WCAG; held to 3:1 anyway)');
  add('Focus', 'focus-ring', [...SURFACES, 'primary-subtle', ...STATUSES.map((s) => `${s}-container`)], UI, 'Focus ring against what surrounds it');
  add('Primary', 'on-primary', ['primary', 'primary-hover', 'primary-pressed'], TEXT, 'Text on city indigo fills');
  add('Primary', 'on-primary-container', 'primary-container', TEXT, 'Text on indigo container');
  add('Primary', 'primary', [...SURFACES.slice(0, 3), 'primary-subtle'], TEXT, 'Indigo text and links');
  for (const s of STATUSES) {
    add('Status', s, [`${s}-container`, ...SURFACES.slice(0, 3)], TEXT, `${s} text and icon`);
    add('Status', `on-${s}`, s, TEXT, `Text on a ${s} fill`);
    add('Status', `on-${s}-container`, `${s}-container`, TEXT, `Strong text in a ${s} callout`);
    add('Status', 'on-surface', `${s}-container`, TEXT, `Body text in a ${s} callout`);
  }
  add('Status', 'on-error', ['error-hover', 'error-pressed'], TEXT, 'Destructive button states');
  add('Status', 'error', 'surface-card+hover:error', TEXT, 'Error text on a hovered destructive outlined button');
  for (const t of TINTS) add('Decorative tints', `on-tint-${t}`, `tint-${t}`, TEXT, 'Icon and short text on a topic tile');
  return P;
}

function channelPairs(ch) {
  const P = [];
  const c = (role) => `channel.${ch}.${role}`;
  const add = (g, fg, bgs, min, use) => [].concat(bgs).forEach((bg) => P.push([g, fg, bg, min, use]));
  add('Action', 'channel-on-action', [c('action'), c('action-hover'), c('action-pressed')], TEXT, 'Text on filled buttons');
  add('Action', c('action'), [...SURFACES.slice(0, 3), c('subtle'), c('container')], TEXT, 'Links, outlined and text buttons, selected text');
  add('Action', c('action'), [`surface-card+hover:${c('action')}`, `surface-card+pressed:${c('action')}`], TEXT, 'Outlined button hovered and pressed');
  add('Container', c('on-container'), c('container'), TEXT, 'Text on channel container');
  add('Container', 'on-surface', [c('subtle'), c('container')], TEXT, 'Body text on a channel band or container');
  add('Container', 'on-surface-variant', c('subtle'), TEXT, 'Secondary text on a channel band');
  add('Boundaries', 'outline', c('subtle'), UI, 'A field on a channel band (the hero search)');
  add('Focus', 'focus-ring', c('subtle'), UI, 'Focus ring on a channel band');
  add('Boundaries', c('action'), 'surface', UI, 'Selected marker, current step, progress against the page');
  return P;
}

// ---------------------------------------------------------------- run

const results = [];
for (const mode of ['light', 'dark']) {
  const col = lookup(mode);
  const measure = ([g, fg, bg, min, use], scope) => {
    const r = ratio(lumOf(col(fg).rgb), lumOf(background(bg, col)));
    results.push({ mode, scope, group: g, fg, bg, min, use, ratio: r, pass: r >= min });
  };
  for (const p of systemPairs()) measure(p, 'system');
  for (const ch of CHANNELS) for (const p of channelPairs(ch)) measure(p, ch);
}

const failures = results.filter((r) => !r.pass);
const short = (n) => n.replace(/^channel\.[a-z]+\./, 'channel-').replace(/^color\./, '');

if (args.has('--markdown')) {
  // System pairs: one row per pair, light and dark side by side.
  const key = (r) => `${r.scope}|${r.fg}|${r.bg}`;
  const darkMap = new Map(results.filter((r) => r.mode === 'dark').map((r) => [key(r), r]));
  const fmt = (r) => `${r.ratio.toFixed(2)}:1`;
  console.log('| Group | Foreground | Background | Min | Light | Dark | Use |');
  console.log('| --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results.filter((r) => r.mode === 'light' && r.scope === 'system')) {
    console.log(`| ${r.group} | \`${short(r.fg)}\` | \`${short(r.bg)}\` | ${r.min}:1 | ${fmt(r)} | ${fmt(darkMap.get(key(r)))} | ${r.use} |`);
  }
  console.log('\nChannels (light / dark):\n');
  const chPairs = channelPairs(CHANNELS[0]).map(([, fg, bg, min, use]) => [short(fg), short(bg).replace(/:channel\.[a-z]+\./, ':channel-'), min, use]);
  console.log(`| Foreground | Background | Min | ${CHANNELS.join(' | ')} |`);
  console.log(`| --- | --- | --- | ${CHANNELS.map(() => '---').join(' | ')} |`);
  chPairs.forEach(([fg, bg, min], i) => {
    const cells = CHANNELS.map((ch) => {
      const lp = results.filter((r) => r.scope === ch && r.mode === 'light')[i];
      const dp = results.filter((r) => r.scope === ch && r.mode === 'dark')[i];
      return `${lp.ratio.toFixed(2)} / ${dp.ratio.toFixed(2)}`;
    });
    console.log(`| \`${fg}\` | \`${bg}\` | ${min}:1 | ${cells.join(' | ')} |`);
  });
} else {
  for (const mode of ['light', 'dark']) {
    const list = results.filter((r) => r.mode === mode);
    const tightest = list.reduce((a, b) => (b.ratio / b.min < a.ratio / a.min ? b : a));
    console.log(`${mode}: ${list.length} pairs, tightest ${short(tightest.fg)} on ${short(tightest.bg)} (${tightest.scope}) ${tightest.ratio.toFixed(2)}:1 against ${tightest.min}:1`);
    if (args.has('--verbose')) for (const r of list) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.scope.padEnd(9)} ${short(r.fg)} on ${short(r.bg)} = ${r.ratio.toFixed(2)}:1 (${r.min}:1)`);
  }
}

for (const r of failures) console.error(`FAIL ${r.mode} ${r.scope}: ${short(r.fg)} on ${short(r.bg)} = ${r.ratio.toFixed(2)}:1 (needs ${r.min}:1)`);
if (failures.length) {
  console.error(`check:contrast failed: ${failures.length} of ${results.length} pairs below threshold`);
  process.exit(1);
}
if (!args.has('--markdown')) console.log(`check:contrast passed (${results.length} pairs, ${CHANNELS.length} channels, light and dark)`);
