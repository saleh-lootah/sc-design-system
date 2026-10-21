#!/usr/bin/env node
/**
 * Measures size-adjust for the "Dubai W23 Fallback" faces: the ratio of the width of real UI
 * text set in Dubai W23 to the same text in the local fallback font, in headless Helium.
 *
 *   node scripts/measure-font-fallback.mjs
 *
 * Copy the printed values into FALLBACK in scripts/subset-fonts.mjs and run `npm run fonts`.
 * SC_BROWSER overrides the browser path.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => readFileSync(join(root, 'src', 'assets', 'fonts', f)).toString('base64');

const SAMPLES = {
  latin: [
    'Renew your vehicle registration',
    'Continue',
    'Pay with Dubai Pay',
    'Save and finish later',
    'Enter the plate number as it appears on your registration card, for example Dubai A 12345.',
    'There is a problem. Enter a valid Emirates ID number, like 784-1990-1234567-1.',
  ],
  arabic: [
    'تجديد تسجيل المركبة',
    'متابعة',
    'الدفع عبر دبي للدفع',
    'احفظ وأكمل لاحقًا',
    'أدخل رقم اللوحة كما يظهر في بطاقة التسجيل، مثل دبي أ 12345.',
    'توجد مشكلة. أدخل رقم هوية إماراتية صحيحًا.',
  ],
};
const LOCAL = { latin: { 400: 'Arial', 700: 'Arial' }, arabic: { 400: 'Tahoma', 700: 'Tahoma' } };

const browser = await puppeteer.launch({
  executablePath: process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium',
  headless: true,
});
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
const result = await page.evaluate(
  async (files, samples, local) => {
    const faces = [];
    for (const [weight, script, data] of files) {
      const buf = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const f = new FontFace(`DW-${script}`, buf, { weight: String(weight) });
      await f.load();
      document.fonts.add(f);
      faces.push([weight, script]);
    }
    const ctx = document.createElement('canvas').getContext('2d');
    const width = (family, weight, text) => {
      ctx.font = `${weight} 100px ${family}`;
      return ctx.measureText(text).width;
    };
    const out = {};
    for (const [weight, script] of faces) {
      let dubai = 0;
      let fallback = 0;
      for (const t of samples[script]) {
        dubai += width(`"DW-${script}"`, weight, t);
        fallback += width(`"${local[script][weight]}"`, weight, t);
      }
      out[`${script} ${weight}`] = Number((dubai / fallback).toFixed(4));
    }
    return out;
  },
  [
    [400, 'latin', font('dubai-w23-400-latin.woff2')],
    [700, 'latin', font('dubai-w23-700-latin.woff2')],
    [400, 'arabic', font('dubai-w23-400-arabic.woff2')],
    [700, 'arabic', font('dubai-w23-700-arabic.woff2')],
  ],
  SAMPLES,
  LOCAL,
);
await browser.close();
console.log('size-adjust (Dubai W23 width / local font width):');
for (const [k, v] of Object.entries(result)) console.log(`  ${k}: ${v}`);
