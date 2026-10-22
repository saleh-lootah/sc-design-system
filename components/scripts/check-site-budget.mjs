#!/usr/bin/env node
/**
 * Holds every documentation-site page to the library's page budgets (perf-budgets.json):
 *
 *   npm run build && npm run check:site-budget
 *
 * For each distinct set of sc-* tags a built page uses, measure-bundle.mjs measures the
 * custom-elements modules the page imports (gzip per file, as the browser downloads them) and
 * the components' stylesheets. The site's own site.js (and search.js on the search page) is
 * added to the page's JavaScript; site.css and the page's HTML are held to the "site" budgets.
 *
 * R21 and R22 (perf-budgets.json $siteChromeComment) add the site chrome, the showcase tooling
 * and a page's own component. A component's showcase page necessarily loads the components it demonstrates, so it may
 * exceed the page budgets by their approved allowances: for each, its "components" override
 * above the default componentGzip (sc-page's examples are a whole channel page, with the
 * site header and the footer). Every other page meets the budgets as they are.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
const budgets = JSON.parse(readFileSync(join(root, 'perf-budgets.json'), 'utf8'));
const site = budgets.site;
const gz = (f) => gzipSync(readFileSync(f), { level: 9 }).length;

const pages = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      if (!(d === www && ['build', 'playground', 'assets', 'site'].includes(f))) walk(p);
    } else if (f === 'index.html') pages.push(p);
  }
};
walk(www);

const measured = new Map();
const measure = (tags) => {
  const key = tags.join(',');
  if (!measured.has(key)) {
    const out = execFileSync(process.execPath, [join(root, 'scripts/measure-bundle.mjs'), '--json', '--no-browser', '--page', key], { encoding: 'utf8', maxBuffer: 64 << 20 });
    const p = JSON.parse(out).page;
    measured.set(key, { js: p.ce.js.gzip, css: p.componentCss.gzip, missing: p.missing });
  }
  return measured.get(key);
};

const siteJs = gz(join(www, 'site/site.js'));
const searchJs = gz(join(www, 'site/search.js'));
const siteCss = gz(join(www, 'site/site.css'));
const demoCss = gz(join(www, 'playground/demo.css'));
const failures = [];
const rows = [];
const check = (label, actual, limit) => {
  if (actual > limit) failures.push(`${label}: ${actual} B gzip > budget ${limit} B`);
};
check('site/site.css', siteCss, site.cssGzip);
check('site/site.js', siteJs, site.jsGzip);
check('site/search.js', searchJs, site.searchJsGzip);
check('playground/demo.css', demoCss, site.demoCssGzip);

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const name = relative(www, page).replace(/index\.html$/, '') || '/';
  const tags = [...new Set([...html.matchAll(/import '[^']*\/site\/ce\/(sc-[a-z-]+)\.js'/g)].map((m) => m[1]))].sort();
  const m = measure(tags);
  const js = m.js + siteJs + (html.includes('site/search.js') ? searchJs : 0);
  // A showcase page's allowance: the approved budgets above the default of what it shows.
  const showcase = /(^|\/)components\/sc-[a-z-]+\/$/.test(name);
  const over = (t) => Math.max(0, (budgets.components[t] ?? budgets.componentGzip) - budgets.componentGzip);
  // R17: a showcase page, the approved overrides of what it demonstrates. Site chrome
  // (R21, site.chromeTags): every page, the overrides of the chrome it carries.
  // R22: the channel switcher on a showcase page is tooling (its whole approved budget), and a
  // page's own component (sc-search on /search/) brings its approved override.
  const chrome = tags.filter((t) => site.chromeTags.includes(t) || site.pageComponents[name]?.includes(t));
  const tooling = (t) => (showcase && site.showcaseTooling.includes(t) ? budgets.components[t] ?? budgets.componentGzip : over(t));
  const allowance = (showcase ? tags : chrome).reduce((a, t) => a + tooling(t), 0);
  const htmlGz = gzipSync(html, { level: 9 }).length;
  rows.push({ name, js, css: m.css, html: htmlGz, allowance });
  check(`${name} JavaScript`, js, budgets.pageJsGzip + allowance);
  check(`${name} component CSS`, m.css, budgets.pageComponentCssGzip + allowance);
  check(`${name} HTML`, htmlGz, site.htmlGzip);
}

const max = (k) => rows.reduce((a, r) => (r[k] > a[k] ? r : a), rows[0]);
const kb = (n) => `${(n / 1024).toFixed(1)} KiB`;
console.log(`check-site-budget: ${rows.length} pages, ${measured.size} distinct component sets`);
console.log(`  site.css ${kb(siteCss)}, site.js ${kb(siteJs)}, search.js ${kb(searchJs)}, demo.css ${kb(demoCss)}`);
for (const k of ['js', 'css', 'html']) {
  const r = max(k);
  console.log(`  largest ${k}: ${r.name} ${kb(r[k])}`);
}
const over = rows.filter((r) => r.allowance && (r.js > budgets.pageJsGzip || r.css > budgets.pageComponentCssGzip));
for (const r of over) console.log(`  showcase allowance used: ${r.name} JS ${kb(r.js)}, CSS ${kb(r.css)} (allowance ${kb(r.allowance)})`);
if (failures.length) {
  console.log('Budgets exceeded:');
  for (const f of [...new Set(failures)]) console.log(`  FAIL ${f}`);
  process.exit(1);
}
console.log('  All site budgets met');
