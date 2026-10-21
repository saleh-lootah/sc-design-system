#!/usr/bin/env node
/**
 * Loads the typical page (test/perf/typical-page.html) in headless Helium and measures what the
 * components cost at runtime: time to hydrate, layout shift, long tasks, style sheets in shadow
 * roots, requests and fonts. Cold cache per run (a fresh browser context), median of N runs.
 *
 *   npm run build && node scripts/measure-runtime.mjs                 # 5 runs, every variant
 *   node scripts/measure-runtime.mjs --runs 9 --cpu 4 --net slow4g     # throttled
 *   node scripts/measure-runtime.mjs --json
 *
 * Variants: lazy loader (dist/sc-components) and custom elements (dist/components, plain ESM
 * imports, no bundler) × English and Arabic.
 *
 * The browser is Helium (Chromium); never Chrome. Override with SC_BROWSER=/path/to/chromium.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { serveTypicalPage } from './lib/typical-page.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const RUNS = Number(opt('--runs', 5));
const CPU = Number(opt('--cpu', 1));
const NET = opt('--net', 'none');
const JSON_OUT = args.includes('--json');
const ONLY = opt('--variant');
const browserPath = process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium';

const NETWORKS = {
  // Lighthouse's "Slow 4G" simulation values.
  slow4g: { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
  fast3g: { offline: false, latency: 562.5, downloadThroughput: (1.44 * 1024 * 1024) / 8, uploadThroughput: (675 * 1024) / 8 },
};

/* Static server with gzip, plus the generated page (scripts/lib/typical-page.mjs) ---------- */
const { origin, close: closeServer } = await serveTypicalPage(root);

/* In-page probes, installed before any script runs ----------------------------------------- */
const PROBE = () => {
  const m = (window.__perf = { shifts: [], longtasks: [], lcp: 0, fcp: 0 });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (!e.hadRecentInput)
        m.shifts.push({ value: e.value, t: e.startTime, sources: (e.sources || []).map((s) => (s.node ? (s.node.nodeName + (s.node.id ? '#' + s.node.id : '')).toLowerCase() : '?')) });
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) m.longtasks.push({ t: e.startTime, d: e.duration });
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) m.lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') m.fcp = e.startTime;
  }).observe({ type: 'paint', buffered: true });
  // Ready = every sc- element in the document and in shadow roots is defined and has rendered.
  const all = () => {
    const out = [];
    const walk = (rootNode) => {
      for (const el of rootNode.querySelectorAll('*')) {
        if (el.localName.startsWith('sc-')) out.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    walk(document);
    return out;
  };
  document.addEventListener('DOMContentLoaded', async () => {
    const wait = async () => {
      // CSS-only tags (sc-container, sc-grid, sc-ltr) are never defined: skip them.
      const els = all().filter((el) => !['sc-container', 'sc-grid', 'sc-ltr'].includes(el.localName));
      await Promise.all(els.map((el) => customElements.whenDefined(el.localName).then(() => (el.componentOnReady ? el.componentOnReady() : null))));
      // Children rendered inside shadow roots may have appeared meanwhile.
      if (all().filter((el) => !['sc-container', 'sc-grid', 'sc-ltr'].includes(el.localName)).length !== els.length) return wait();
      return els;
    };
    const els = await wait();
    m.readyAt = performance.now();
    m.elements = els.length;
  });
};

const collect = () => {
  const m = window.__perf;
  const nav = performance.getEntriesByType('navigation')[0];
  const res = performance.getEntriesByType('resource');
  const sheets = new Set();
  let adoptions = 0, shadowRoots = 0, rules = 0, dupAdoptions = 0;
  const walk = (r) => {
    for (const el of r.querySelectorAll('*')) {
      if (el.shadowRoot) {
        shadowRoots++;
        const own = el.shadowRoot.adoptedStyleSheets;
        if (new Set(own).size !== own.length) dupAdoptions += own.length - new Set(own).size;
        for (const s of own) {
          adoptions++;
          if (!sheets.has(s)) {
            sheets.add(s);
            rules += s.cssRules.length;
          }
        }
        for (const st of el.shadowRoot.querySelectorAll('style')) rules += st.sheet ? st.sheet.cssRules.length : 0;
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  let docRules = 0;
  for (const s of document.styleSheets) try { docRules += s.cssRules.length; } catch {}
  const byType = {};
  for (const r of res) {
    const k = r.initiatorType === 'css' || /woff2$/.test(r.name) ? (/woff2$/.test(r.name) ? 'font' : 'css') : r.initiatorType;
    byType[k] ??= { n: 0, transfer: 0, decoded: 0 };
    byType[k].n++;
    byType[k].transfer += r.transferSize;
    byType[k].decoded += r.decodedBodySize;
  }
  const lastRes = Math.max(0, ...res.map((r) => r.responseEnd));
  const cls = m.shifts.reduce((n, s) => n + s.value, 0);
  const tbt = m.longtasks.reduce((n, t) => n + Math.max(0, t.d - 50), 0);
  return {
    dcl: nav.domContentLoadedEventEnd,
    load: nav.loadEventEnd,
    fcp: m.fcp,
    lcp: m.lcp,
    readyAt: m.readyAt,
    lastResponse: lastRes,
    elements: m.elements,
    shadowRoots,
    adoptions,
    dupAdoptions,
    uniqueSheets: sheets.size,
    shadowRules: rules,
    documentRules: docRules,
    cls,
    shifts: m.shifts,
    tbt,
    longest: Math.max(0, ...m.longtasks.map((t) => t.d)),
    requests: res.length,
    byType,
    fontFiles: res.filter((r) => /\.woff2(\?|$)/.test(r.name)).map((r) => `${r.name.split('/').pop()} ${r.decodedBodySize} B`),
    fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')),
  };
};

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--hide-scrollbars', '--no-first-run', ...(process.env.CI ? ['--no-sandbox'] : [])] });
const variants = [
  ['lazy', 'en'],
  ['lazy', 'ar'],
  ['ce', 'en'],
  ['ce', 'ar'],
].filter(([b, l]) => !ONLY || ONLY === `${b}-${l}`);
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : 0;
};
const results = {};
for (const [build, lang] of variants) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 1 });
    const cdp = await page.createCDPSession();
    await cdp.send('Network.enable');
    await cdp.send('Performance.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    if (NETWORKS[NET]) await cdp.send('Network.emulateNetworkConditions', NETWORKS[NET]);
    await page.evaluateOnNewDocument(PROBE);
    await page.goto(`${origin}/perf?lang=${lang}&build=${build}`, { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction(() => window.__perf && window.__perf.readyAt, { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 600)); // let late shifts and LCP settle
    const perf = await page.evaluate(collect);
    const { metrics } = await cdp.send('Performance.getMetrics').catch(() => ({ metrics: [] }));
    perf.cdp = Object.fromEntries((metrics || []).filter((x) => /Duration|JSHeapUsedSize|Nodes/.test(x.name)).map((x) => [x.name, x.value]));
    runs.push(perf);
    await ctx.close();
  }
  const pick = (k) => median(runs.map((r) => r[k]));
  results[`${build}-${lang}`] = {
    runs: runs.length,
    fcp: pick('fcp'),
    lcp: pick('lcp'),
    readyAt: pick('readyAt'),
    dcl: pick('dcl'),
    load: pick('load'),
    cls: pick('cls'),
    clsMax: Math.max(...runs.map((r) => r.cls)),
    tbt: pick('tbt'),
    longest: pick('longest'),
    requests: pick('requests'),
    elements: runs[0].elements,
    shadowRoots: runs[0].shadowRoots,
    adoptions: runs[0].adoptions,
    dupAdoptions: runs[0].dupAdoptions,
    uniqueSheets: runs[0].uniqueSheets,
    shadowRules: runs[0].shadowRules,
    documentRules: runs[0].documentRules,
    byType: runs[0].byType,
    fonts: runs[0].fonts,
    fontFiles: runs[0].fontFiles,
    shiftSources: [...new Set(runs.flatMap((r) => r.shifts.flatMap((s) => s.sources)))],
    scriptMs: median(runs.map((r) => (r.cdp.ScriptDuration || 0) * 1000)),
    layoutMs: median(runs.map((r) => (r.cdp.LayoutDuration || 0) * 1000)),
    styleMs: median(runs.map((r) => (r.cdp.RecalcStyleDuration || 0) * 1000)),
    heapKiB: median(runs.map((r) => (r.cdp.JSHeapUsedSize || 0) / 1024)),
  };
}
await browser.close();
closeServer();

const out = { generated: new Date().toISOString(), browser: browserPath, runs: RUNS, cpu: CPU, net: NET, viewport: '412x915', results };
if (JSON_OUT) console.log(JSON.stringify(out, null, 2));
else {
  const ms = (n) => `${Math.round(n)} ms`;
  const L = [`# Runtime measurement (${out.generated})`, '', `Helium headless, ${RUNS} cold runs per variant (median), CPU ×${CPU}, network ${NET}, viewport 412×915.`, ''];
  L.push('| Variant | FCP | LCP | All sc- ready | Load | CLS (max) | TBT | Longest task | Script | Style | Layout | Requests |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const [k, r] of Object.entries(results))
    L.push(`| ${k} | ${ms(r.fcp)} | ${ms(r.lcp)} | ${ms(r.readyAt)} | ${ms(r.load)} | ${r.cls.toFixed(3)} (${r.clsMax.toFixed(3)}) | ${ms(r.tbt)} | ${ms(r.longest)} | ${ms(r.scriptMs)} | ${ms(r.styleMs)} | ${ms(r.layoutMs)} | ${r.requests} |`);
  L.push('', '| Variant | sc- elements | Shadow roots | Sheet adoptions (same sheet twice in one root) | Unique sheets | Rules in shadow sheets | Rules in document | Fonts loaded | Shift sources |', '|---|---|---|---|---|---|---|---|---|');
  for (const [k, r] of Object.entries(results)) L.push(`| ${k} | ${r.elements} | ${r.shadowRoots} | ${r.adoptions} (${r.dupAdoptions}) | ${r.uniqueSheets} | ${r.shadowRules} | ${r.documentRules} | ${r.fonts.join(', ')} | ${r.shiftSources.join(', ') || 'none'} |`);
  L.push('', 'Font files downloaded (first run):', '');
  for (const [k, r] of Object.entries(results)) L.push(`- ${k}: ${r.fontFiles.join(', ') || 'none'}`);
  L.push('', 'Requests by type (first run):', '');
  for (const [k, r] of Object.entries(results)) L.push(`- ${k}: ${Object.entries(r.byType).map(([t, v]) => `${t} ${v.n} (${(v.transfer / 1024).toFixed(1)} KiB transferred)`).join(', ')}`);
  console.log(L.join('\n'));
}
