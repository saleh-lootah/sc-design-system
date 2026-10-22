#!/usr/bin/env node
/**
 * Checks representative documentation-site pages in Helium (the e2e browser; SC_BROWSER
 * overrides it), in English and Arabic, light and dark, at desktop and phone widths:
 *
 *   npm run build && npm run check:site-a11y
 *
 * - axe-core, WCAG 2.0 to 2.2 A and AA rules, on the whole page;
 * - every site control (header, menus, contents, pager, footer, heading links) at least
 *   44 × 44 CSS px (A11Y-04; links in running text are exempt);
 * - CLS 0 from load until the components have hydrated;
 * - the font bytes each page downloads, against pageFontsEnBytes / pageFontsArBytes;
 * - no horizontal scrolling at 320 CSS px (WCAG 1.4.10);
 * - without JavaScript: the heading, the main text and the navigation are there.
 * Exit 1 on any failure. --screenshots <dir> also saves a screenshot of each page.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { serveSite } from './serve-site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const budgets = JSON.parse(readFileSync(join(root, 'perf-budgets.json'), 'utf8'));
const shotsAt = process.argv.indexOf('--screenshots');
const shots = shotsAt > 0 ? process.argv[shotsAt + 1] : null;
if (shots) mkdirSync(shots, { recursive: true });

const PAGES = [
  '',
  'design-system/',
  'design-system/foundations/',
  'components/sc-button/',
  'components/sc-table/',
  'components/sc-date-range/',
  'standard/',
  'standard/accessibility/',
  'standard/appendix-d-requirement-index/',
  'reference/motion/',
  'assurance/how-we-check-test-scripts/',
  'requirements/',
  'search/?q=focus+ring',
  'records/',
  'records/decisions/',
  'ux-standard/',
];
const MODES = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'phone', width: 375, height: 812, mobile: true },
];
const SCHEMES = ['light', 'dark'];

const server = await serveSite(0);
const base = `http://localhost:${server.address().port}/`;
const browser = await puppeteer.launch({
  executablePath: process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium',
  headless: true,
  args: ['--hide-scrollbars', ...(process.env.CI ? ['--no-sandbox'] : [])],
});
// Helium aborts and repeats the first navigation to a new origin; take it before measuring.
{
  const warm = await browser.newPage();
  await warm.goto(base, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await warm.close();
}
const notes = [];
const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);
let runs = 0;

const CONTROLS = [
  '.site-brand',
  '.site-sections a',
  '.site-tool',
  '.site-menu > summary',
  '.site-nav a',
  '.site-nav__group > summary',
  '.site-menu__sections a',
  '.doc-toc > summary',
  '.doc-toc a',
  '.doc-heading__link',
  '.site-pager a',
  '.site-footer a',
  '.site-card__link',
  '.req-jump a',
  '.doc-action',
  '.home-quick a',
  '.search-scope',
];

async function check(path, lang, mode, scheme) {
  const url = `${base}${lang === 'ar' ? 'ar/' : ''}${path}`;
  const where = `${lang === 'ar' ? 'ar/' : ''}${path || '/'} ${mode.name} ${scheme}`;
  if (process.env.DEBUG) console.error(where);
  const page = await browser.newPage();
  // isMobile and hasTouch only when set: passing them, even false, can make Puppeteer reload the page.
  await page.setViewport(mode.mobile ? { width: mode.width, height: mode.height, isMobile: true, hasTouch: true } : { width: mode.width, height: mode.height });
  // Through CDP: page.emulateMediaFeatures() makes Helium repeat the navigation.
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  let fontBytes = 0;
  page.on('response', async (r) => {
    if (r.url().endsWith('.woff2')) fontBytes += Number(r.headers()['content-length']) || (await r.buffer().catch(() => Buffer.alloc(0))).length;
  });
  // Shifts inside the component examples (#preview) are the components' own pre-hydration
  // sizing; they are reported, not counted against the site.
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    window.__demoShifts = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        const nodes = e.sources.map((s) => s.node).filter(Boolean);
        const inDemo = nodes.length && nodes.every((n) => (n.nodeType === 1 ? n : n.parentElement)?.closest('#preview'));
        if (inDemo) window.__demoShifts.push(`${e.value.toFixed(4)} ${nodes.map((n) => n.localName || '#text').join(',')}`);
        else window.__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.bringToFront();
  if (process.env.DEBUG) console.error('  loaded');
  const undefinedTags = await page.evaluate(async () => {
    await document.fonts.ready;
    // The tags the page imports (sc-ltr, for one, is CSS only).
    const tags = [...(document.querySelector('script[type="module"]:not([src])')?.textContent ?? '').matchAll(/\/(sc-[a-z-]+)\.js/g)].map((m) => m[1]);
    const late = (n) => Promise.race([customElements.whenDefined(n).then(() => null), new Promise((r) => setTimeout(() => r(n), 5000))]);
    return (await Promise.all(tags.map(late))).filter(Boolean);
  });
  await new Promise((r) => setTimeout(r, 300));
  for (const t of undefinedTags) fail(where, `${t} never defined`);
  for (const e of errors) fail(where, `script error: ${e}`);
  if (path.startsWith('search/')) await page.waitForFunction(() => document.querySelector('#search-results li'), { timeout: 5000 }).catch(() => fail(where, 'search returned no results'));

  const { cls, demo } = await page.evaluate(() => ({ cls: window.__cls, demo: window.__demoShifts }));
  if (cls > 0) fail(where, `CLS ${cls.toFixed(5)}`);
  for (const d of demo) notes.push(`${where}: shift inside the examples ${d}`);

  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  });
  for (const v of axe) fail(where, `axe ${v}`);

  const small = await page.evaluate((sel) => {
    const out = [];
    for (const el of document.querySelectorAll(sel.join(','))) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue; // not rendered (a closed disclosure)
      if (r.width < 43.5 || r.height < 43.5) out.push(`${el.className || el.localName} “${el.textContent.trim().slice(0, 30)}” ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, CONTROLS);
  for (const s of small.slice(0, 5)) fail(where, `target under 44px: ${s}`);

  // A page that sets text in both scripts (an Arabic page around an English document, an
  // English page with Arabic examples) is held to the site's mixed-script budget.
  const mixed = await page.evaluate((ar) => [...document.querySelectorAll(ar ? '[lang="en"]' : '[lang="ar"]')].some((e) => !e.closest('sc-language-switch') && e.textContent.trim().length > 40), lang === 'ar');
  const fontsBudget = mixed ? budgets.site.pageFontsMixedBytes : lang === 'ar' ? budgets.pageFontsArBytes : budgets.pageFontsEnBytes;
  if (fontBytes > fontsBudget) fail(where, `fonts ${fontBytes} B > budget ${fontsBudget} B`);

  if (mode.mobile && scheme === 'light') {
    await page.setViewport({ width: 320, height: 640, isMobile: true, hasTouch: true });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) fail(where, `scrolls sideways by ${over}px at 320px`);
    await page.setViewport({ width: mode.width, height: mode.height, isMobile: true, hasTouch: true });
  }
  if (shots) await page.screenshot({ path: join(shots, `${where.replace(/[/?=+ ]+/g, '_').replace(/^_|_$/g, '')}.png`) });
  await page.close();
  runs++;
}

async function checkNoScript(path, lang) {
  const where = `${lang === 'ar' ? 'ar/' : ''}${path || '/'} without JavaScript`;
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${base}${lang === 'ar' ? 'ar/' : ''}${path}`, { waitUntil: 'load' });
  const html = await page.content();
  const text = (await page.$eval('main', (m) => m.innerText).catch(() => '')).trim();
  if (!/<h1[\s>]/.test(html)) fail(where, 'no h1');
  if (text.length < 200) fail(where, `main has only ${text.length} characters`);
  if (!/class="site-menu"/.test(html) && path) fail(where, 'no section navigation');
  if (shots) await page.screenshot({ path: join(shots, `${where.replace(/[/?=+ ]+/g, '_').replace(/^_|_$/g, '')}.png`) });
  await page.close();
}

try {
  for (const path of PAGES) {
    for (const lang of ['en', 'ar']) {
      for (const mode of MODES) for (const scheme of SCHEMES) await check(path, lang, mode, scheme);
      if (!path.includes('?')) await checkNoScript(path, lang);
    }
  }
} finally {
  await browser.close();
  server.close();
}
for (const n of [...new Set(notes)].slice(0, 40)) console.log(`  note ${n}`);
const uniq = [...new Set(failures)];
console.log(`check-site-a11y: ${runs} page views (${PAGES.length} pages × EN/AR × light/dark × desktop/phone), ${uniq.length} failures`);
for (const f of uniq.slice(0, 80)) console.log(`  ${f}`);
process.exit(uniq.length ? 1 : 0);
