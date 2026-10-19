// OKLAB helpers: conversion to sRGB, WCAG 2 contrast and OKLCH.
// A line-for-line port of scripts/oklab.py so the checks and the native
// outputs use exactly the same maths as the source was authored against.

export function oklabToLinearSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

export function inGamut(L, a, b, eps = 1e-4) {
  return oklabToLinearSrgb(L, a, b).every((c) => c >= -eps && c <= 1 + eps);
}

function enc(c) {
  c = Math.min(1, Math.max(0, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

/** Gamma-encoded sRGB components in 0..1 (clamped), as to_srgb01 in oklab.py. */
export function toSrgb01(L, a, b) {
  return oklabToLinearSrgb(L, a, b).map(enc);
}

export function luminance(L, a, b) {
  const [r, g, bl] = oklabToLinearSrgb(L, a, b).map((c) => Math.min(1, Math.max(0, c)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

export function contrast(c1, c2) {
  const y1 = luminance(...c1.slice(0, 3));
  const y2 = luminance(...c2.slice(0, 3));
  const hi = Math.max(y1, y2), lo = Math.min(y1, y2);
  return (hi + 0.05) / (lo + 0.05);
}

/** [L, C, h] with h in degrees 0..360. */
export function lch(L, a, b) {
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}
