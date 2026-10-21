// Tonal palettes in OKLAB, on a luminance tone scale.
//
// A tone is CIELAB L* (0 black .. 100 white), the scale Material and the
// Dubai Design System use. Two colours' WCAG contrast depends only on their
// relative luminance Y, and Y is a function of tone alone, so every pair of
// tones has a fixed contrast whatever the hue: tone 40 on tone 100 is always
// 6.46:1. Direction E's swatches already sit on this scale (its channel 40s
// measure tone 39.6 to 40.3), which is why the generator uses it.
//
// For each tone we solve for the OKLAB lightness that gives exactly that
// luminance at the palette's hue and requested chroma, reducing chroma at
// constant hue where the colour would leave sRGB.
import { inGamut, luminance } from './oklab.mjs';

/** CIELAB L* to relative luminance Y (D65, Y of white = 1). */
export function toneToY(t) {
  return t > 8 ? ((t + 16) / 116) ** 3 : t / 903.2962962;
}

/** Relative luminance Y to CIELAB L*. */
export function yToTone(y) {
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (y * 24389) / 27;
}

/** WCAG contrast of two tones. */
export function toneContrast(t1, t2) {
  const [hi, lo] = [toneToY(Math.max(t1, t2)), toneToY(Math.min(t1, t2))];
  return (hi + 0.05) / (lo + 0.05);
}

const rad = (h) => (h * Math.PI) / 180;
const lab = (L, C, h) => [L, C * Math.cos(rad(h)), C * Math.sin(rad(h))];

/** Largest chroma at OKLAB lightness L and hue h that stays inside sRGB. */
export function maxChroma(L, h) {
  let lo = 0, hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(...lab(L, mid, h), 0)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * The OKLAB colour of a given tone at hue h, with chroma C (reduced if out of gamut).
 * Returns { L, a, b, C, clamped }.
 */
export function solveTone(tone, h, C) {
  if (tone >= 100) return { L: 1, a: 0, b: 0, C: 0, clamped: false };
  if (tone <= 0) return { L: 0, a: 0, b: 0, C: 0, clamped: false };
  const target = toneToY(tone);
  let lo = 0, hi = 1, best;
  for (let i = 0; i < 60; i++) {
    const L = (lo + hi) / 2;
    const c = Math.min(C, maxChroma(L, h));
    const y = luminance(...lab(L, c, h));
    best = { L, c };
    if (y < target) lo = L;
    else hi = L;
  }
  const [L, a, b] = lab(best.L, best.c, h);
  return { L, a, b, C: best.c, clamped: best.c < C - 1e-6 };
}

/** Round an OKLAB triple for the token files and keep it inside sRGB. */
export function roundLab({ L, a, b }, digits = 4) {
  const r = (x) => Number(x.toFixed(digits));
  let out = [r(L), r(a), r(b)];
  // Rounding can push a colour on the gamut edge a hair outside; pull chroma in until it fits.
  for (let k = 0; k < 20 && !inGamut(...out, 0); k++) {
    const s = 1 - 0.002 * (k + 1);
    out = [r(L), r(a * s), r(b * s)];
  }
  return out.map((x) => (Object.is(x, -0) ? 0 : x));
}
