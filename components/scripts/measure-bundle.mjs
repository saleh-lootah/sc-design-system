#!/usr/bin/env node
/**
 * Measures what the component library costs a page, from the build output on disk.
 *
 *   npm run build && node scripts/measure-bundle.mjs            # Markdown report on stdout
 *   node scripts/measure-bundle.mjs --json > bundle.json        # machine-readable
 *   node scripts/measure-bundle.mjs --budget budgets.json       # exit 1 if a budget is exceeded
 *   node scripts/measure-bundle.mjs --page sc-app-bar,sc-button # a different "typical page"
 *
 * It reports, with raw, gzip (level 9) and brotli (quality 11) sizes:
 *   1. the lazy build (dist/sc-components): loader, runtime core, and per component the entry
 *      chunk plus every chunk it statically imports (excluding the core, which is shared);
 *   2. the custom-elements build (dist/components): per tag file plus its import closure;
 *   3. CSS: the stylesheet text each component carries in its JS, how much of it is shared
 *      helpers duplicated in every component (shared.css, type roles, field.css), the global
 *      stylesheet and tokens.css;
 *   4. fonts: every .woff2 with glyph count and how many code points are Latin or Arabic;
 *   5. a typical page (default: page shell, skip link, app bar, hero, search, grid,
 *      6 service cards, footer) in both builds: total first-load bytes, and the font files
 *      Helium actually downloads for test/perf/typical-page.html in English and Arabic
 *      (SC_BROWSER overrides the Helium path; --no-browser skips it).
 *
 * No dependencies beyond Node 20 and, for the fonts, the puppeteer devDependency. Wave 4 (Q3) and CI re-run this against the budgets in
 * docs/v2/architecture.md.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, brotliDecompressSync, constants as Z } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const repo = join(root, '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const LAZY = join(root, 'dist', 'sc-components');
const CE = join(root, 'dist', 'components');
const WWW = join(root, 'www', 'build');
const DEFAULT_PAGE = [
  'sc-page',
  'sc-skip-link',
  'sc-app-bar',
  'sc-language-switch',
  'sc-channel-hero',
  'sc-search',
  'sc-container',
  'sc-grid',
  ...Array(6).fill('sc-service-card'),
  'sc-footer',
];
const PAGE = (opt('--page')?.split(',') ?? DEFAULT_PAGE).map((s) => s.trim()).filter(Boolean);

if (!existsSync(LAZY) || !existsSync(CE)) {
  console.error('No build output. Run `npm run build` in components/ first.');
  process.exit(2);
}

/* Sizes --------------------------------------------------------------------------------- */
const size = (buf) => {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf;
  return {
    raw: b.length,
    gzip: gzipSync(b, { level: 9 }).length,
    br: brotliCompressSync(b, { params: { [Z.BROTLI_PARAM_QUALITY]: 11, [Z.BROTLI_PARAM_SIZE_HINT]: b.length } }).length,
  };
};
const add = (a, b) => ({ raw: a.raw + b.raw, gzip: a.gzip + b.gzip, br: a.br + b.br });
const ZERO = { raw: 0, gzip: 0, br: 0 };
const kb = (n) => (n / 1024).toFixed(1);
const fmt = (s) => `${kb(s.raw)} / ${kb(s.gzip)} / ${kb(s.br)}`;

/* Module graph --------------------------------------------------------------------------- */
const read = (f) => readFileSync(f, 'utf8');
const staticImports = (src) => {
  const out = new Set();
  for (const m of src.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) out.add(m[1]);
  return [...out];
};
const closure = (dir, start, exclude = new Set()) => {
  const seen = new Set();
  const walk = (f) => {
    if (seen.has(f) || exclude.has(f)) return;
    seen.add(f);
    for (const d of staticImports(read(join(dir, f)))) walk(d);
  };
  walk(start);
  return seen;
};
const filesSize = (dir, files) => {
  // Compress each file separately: that is what the browser downloads.
  let s = ZERO;
  for (const f of files) s = add(s, size(readFileSync(join(dir, f))));
  return s;
};

/* CSS carried in JS ---------------------------------------------------------------------- */
/** Template literals that look like stylesheets (Stencil emits component CSS as `...`). */
const cssLiterals = (src) => {
  const out = [];
  let i = 0;
  while ((i = src.indexOf('`', i)) >= 0) {
    let j = i + 1;
    while (j < src.length && src[j] !== '`') j += src[j] === '\\' ? 2 : 1;
    const body = src.slice(i + 1, j);
    if (/[{}]/.test(body) && /(:host|@keyframes|@media|\.focus-ring|--sc-)/.test(body) && !body.includes('${') && !/^\s*</.test(body)) out.push(body);
    i = j + 1;
  }
  return out;
};

/* 1. Lazy build ------------------------------------------------------------------------- */
const loaderFile = 'sc-components.esm.js';
const loaderSrc = read(join(LAZY, loaderFile));
const coreFile = staticImports(loaderSrc)[0];
if (!coreFile) {
  console.error('dist/ is not a production build (`stencil test` overwrites it with a dev build). Run `npm run build` first.');
  process.exit(2);
}
/** bundle id -> tags, parsed from the bootstrapLazy() table in the loader. */
const lazyBundles = {};
// Each bundle starts with ["p-<hash>",[[flags,"sc-tag",…; a bundle may hold several tags.
const bundleStarts = [...loaderSrc.matchAll(/\["(p-[A-Za-z0-9_-]+)",\[\[/g)];
bundleStarts.forEach((m, i) => {
  const body = loaderSrc.slice(m.index, bundleStarts[i + 1]?.index ?? loaderSrc.length);
  lazyBundles[m[1]] = [...body.matchAll(/\[\d+,"(sc-[a-z-]+)"/g)].map((t) => t[1]);
});
const tagToEntry = {};
for (const [id, tags] of Object.entries(lazyBundles)) for (const t of tags) tagToEntry[t] = `${id}.entry.js`;
const allTags = Object.keys(tagToEntry).sort();
const coreSet = new Set([coreFile]);
const lazy = {
  loader: size(readFileSync(join(LAZY, loaderFile))),
  core: filesSize(LAZY, closure(LAZY, coreFile)),
  // v2: sc.css is the document stylesheet (tokens, fonts, base, light-DOM component styles,
  // helpers); sc-components.css is Stencil's globalStyle, the helper sheet that shadow roots
  // adopt (it also ships inside the runtime JS).
  globalCss: size(readFileSync(join(LAZY, existsSync(join(LAZY, 'sc.css')) ? 'sc.css' : 'sc-components.css'))),
  shadowCss: size(readFileSync(join(LAZY, 'sc-components.css'))),
  components: {},
};
for (const tag of allTags) {
  const files = closure(LAZY, tagToEntry[tag], coreSet);
  const entrySrc = read(join(LAZY, tagToEntry[tag]));
  lazy.components[tag] = {
    entry: tagToEntry[tag],
    sharedWith: lazyBundles[tagToEntry[tag].replace('.entry.js', '')].filter((t) => t !== tag),
    files: [...files],
    js: filesSize(LAZY, files),
    cssInEntry: size(cssLiterals(entrySrc).join('')),
  };
}

/* 2. Custom-elements build -------------------------------------------------------------- */
const ce = { runtime: filesSize(CE, closure(CE, 'index.js')), components: {} };
const ceRuntime = new Set(['index.js']);
for (const tag of allTags) {
  const file = `${tag}.js`;
  if (!existsSync(join(CE, file))) continue;
  const files = closure(CE, file, ceRuntime);
  // A tag that another tag renders (sc-button inside sc-search) lives in a shared chunk, so
  // collect the stylesheet text from the whole closure.
  const css = [...files].flatMap((f) => cssLiterals(read(join(CE, f))));
  ce.components[tag] = { files: [...files], js: filesSize(CE, files), css: size(css.join('')), cssRaw: css.join('') };
}

/* 3. CSS duplication -------------------------------------------------------------------- */
/** Resolve @import chains in the source CSS, the way Stencil inlines them. */
const SRC = join(root, 'src');
const cssSourceTree = (file, seen = new Set()) => {
  if (seen.has(file)) return [];
  seen.add(file);
  const src = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
  const parts = [];
  for (const m of src.matchAll(/@import\s+'([^']+)';/g)) parts.push(...cssSourceTree(join(dirname(file), m[1]), seen));
  parts.push({ file: file.replace(SRC + '/', ''), bytes: Buffer.byteLength(src.replace(/@import\s+'[^']+';/g, '')) });
  return parts;
};
const sharedKind = (f) => (f === 'styles/shared.css' ? 'shared.css' : f.startsWith('styles/type/') ? 'type roles' : /sc-text-input\/(field|choice)\.css$/.test(f) ? 'field.css/choice.css' : 'own');
const cssSource = {};
for (const tag of allTags) {
  const f = join(SRC, 'components', tag, `${tag}.css`);
  if (!existsSync(f)) continue;
  const tree = cssSourceTree(f);
  const by = {};
  for (const p of tree) by[sharedKind(p.file)] = (by[sharedKind(p.file)] ?? 0) + p.bytes;
  cssSource[tag] = { total: tree.reduce((n, p) => n + p.bytes, 0), by, files: tree.map((p) => p.file) };
}
/** Minified shared.css as built: the prefix every component that imports it starts with. */
const sharedMin = (() => {
  const card = ce.components['sc-card']?.cssRaw ?? '';
  const end = card.indexOf('@media (prefers-reduced-motion');
  const m = card.match(/^[\s\S]*?\.spin\{[^}]*\}(@media[^{]*\{\.spin\{[^}]*\}\})?/);
  return m ? m[0] : card.slice(0, end > 0 ? end : 0);
})();
const builtDup = { sharedCssMin: Buffer.byteLength(sharedMin), componentsWithShared: 0, typeRoleBlocks: 0, typeRoleBytes: 0 };
const ceFiles = readdirSync(CE).filter((f) => f.endsWith('.js'));
const ceSheets = ceFiles.flatMap((f) => cssLiterals(read(join(CE, f))));
const allCss = ceSheets.join('');
builtDup.sheets = ceSheets.length;
for (const sheet of ceSheets) {
  const c = { cssRaw: sheet };
  if (sharedMin && c.cssRaw.includes(sharedMin.slice(0, 200))) builtDup.componentsWithShared++;
  for (const m of c.cssRaw.matchAll(/:host\{--type-[a-z0-9-]+-family:[^}]*\}:host\(:lang\(ar\)\)\{[^}]*\}\.type-[a-z0-9-]+\{[^}]*\}/g)) {
    builtDup.typeRoleBlocks++;
    builtDup.typeRoleBytes += Buffer.byteLength(m[0]);
  }
}
builtDup.allComponentCss = size(allCss);
const tokensFile = join(repo, 'dist', 'css', 'tokens.css');
const tokens = existsSync(tokensFile) ? size(readFileSync(tokensFile)) : null;
const tokensSrc = existsSync(tokensFile) ? read(tokensFile) : '';
const tokenCount = (tokensSrc.match(/--sc-[a-z0-9-]+\s*:/g) ?? []).length;

/* 4. Fonts ------------------------------------------------------------------------------ */
const base128 = (buf, o) => {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[o.p++];
    v = (v << 7) | (b & 0x7f);
    if (!(b & 0x80)) return v >>> 0;
  }
  return v >>> 0;
};
const KNOWN = 'cmap head hhea hmtx maxp name OS/2 post cvt fpgm glyf loca prep CFF VORG EBDT EBLC gasp hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR CPAL SVG sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx opbd prop trak Zapf Silf Glat Gloc Feat Sill'.split(' ').map((t) => t.padEnd(4, ' '));
const woff2Info = (file) => {
  const buf = readFileSync(file);
  const numTables = buf.readUInt16BE(12);
  const totalCompressed = buf.readUInt32BE(20);
  const o = { p: 48 };
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[o.p++];
    const tag = (flags & 0x3f) === 0x3f ? buf.toString('latin1', o.p, (o.p += 4)) : KNOWN[flags & 0x3f];
    const version = flags >> 6;
    const origLength = base128(buf, o);
    const transformed = (tag === 'glyf' || tag === 'loca') ? version === 0 : version !== 0;
    const length = transformed ? base128(buf, o) : origLength;
    tables.push({ tag, length });
  }
  const data = brotliDecompressSync(buf.subarray(o.p, o.p + totalCompressed));
  let off = 0;
  const t = {};
  for (const tb of tables) {
    t[tb.tag] = data.subarray(off, off + tb.length);
    off += tb.length;
  }
  const numGlyphs = t.maxp ? t.maxp.readUInt16BE(4) : null;
  // cmap: collect code points from format 4 and 12 subtables.
  const cps = new Set();
  const cm = t.cmap;
  if (cm) {
    const n = cm.readUInt16BE(2);
    for (let i = 0; i < n; i++) {
      const sub = cm.readUInt32BE(4 + i * 8 + 4);
      const format = cm.readUInt16BE(sub);
      if (format === 4) {
        const segX2 = cm.readUInt16BE(sub + 6);
        const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
        for (let s = 0; s < segX2 / 2; s++) {
          const end = cm.readUInt16BE(ends + s * 2), start = cm.readUInt16BE(starts + s * 2);
          if (start === 0xffff) continue;
          for (let c = start; c <= end; c++) cps.add(c);
        }
      } else if (format === 12) {
        const groups = cm.readUInt32BE(sub + 12);
        for (let g = 0; g < groups; g++) {
          const s = cm.readUInt32BE(sub + 16 + g * 12), e = cm.readUInt32BE(sub + 20 + g * 12);
          for (let c = s; c <= e; c++) cps.add(c);
        }
      }
    }
  }
  // Vertical metrics, for a metric-matched fallback (@font-face ascent-override etc.).
  const upm = t.head ? t.head.readUInt16BE(18) : 1000;
  const os2 = t['OS/2'];
  const metrics = {
    unitsPerEm: upm,
    hheaAscender: t.hhea?.readInt16BE(4),
    hheaDescender: t.hhea?.readInt16BE(6),
    hheaLineGap: t.hhea?.readInt16BE(8),
    winAscent: os2?.readUInt16BE(74),
    winDescent: os2?.readUInt16BE(76),
    xAvgCharWidth: os2?.readInt16BE(2),
  };
  const inRange = (lo, hi) => [...cps].filter((c) => c >= lo && c <= hi).length;
  return {
    file: basename(file),
    bytes: buf.length,
    numGlyphs,
    codePoints: cps.size,
    latin: inRange(0x0000, 0x024f) + inRange(0x2000, 0x206f) + inRange(0x20a0, 0x20cf),
    arabic: inRange(0x0600, 0x06ff) + inRange(0x0750, 0x077f) + inRange(0x08a0, 0x08ff) + inRange(0xfb50, 0xfdff) + inRange(0xfe70, 0xfeff),
    gsub: t.GSUB?.length ?? 0,
    gpos: t.GPOS?.length ?? 0,
    glyf: t.glyf?.length ?? 0,
    metrics,
  };
};
const fontDir = join(root, 'src', 'assets', 'fonts');
const fonts = existsSync(fontDir) ? readdirSync(fontDir).filter((f) => f.endsWith('.woff2')).map((f) => woff2Info(join(fontDir, f))) : [];
/**
 * What the typical page really downloads, per language: it is loaded in headless Helium
 * (scripts/lib/typical-page.mjs) and the woff2 requests are counted, so a stray script file
 * (an Arabic word on an English page, a Latin label on an Arabic one) shows up. Skipped with
 * --no-browser or a custom --page; with --budget, a page that cannot be measured fails.
 */
let pageFonts = { en: null, ar: null, files: { en: [], ar: [] }, error: null };
if (flag('--no-browser') || opt('--page')) pageFonts.error = flag('--no-browser') ? 'skipped (--no-browser)' : 'skipped (custom --page)';
else {
  try {
    const { typicalPageFonts } = await import('./lib/typical-page.mjs');
    const got = await typicalPageFonts(root, process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium');
    pageFonts = { en: got.en.bytes, ar: got.ar.bytes, files: { en: got.en.files, ar: got.ar.files }, error: null };
  } catch (e) {
    pageFonts.error = `not measured: ${e.message.split('\n')[0]}`;
  }
}
const globalSrc = read(join(LAZY, existsSync(join(LAZY, 'sc.css')) ? 'sc.css' : 'sc-components.css'));
const fontFace = {
  count: (globalSrc.match(/@font-face/g) ?? []).length,
  display: [...new Set([...globalSrc.matchAll(/font-display:\s*([a-z]+)/g)].map((m) => m[1]))],
  unicodeRange: /unicode-range/.test(globalSrc),
};

/* 5. Typical page ----------------------------------------------------------------------- */
const uniqueTags = [...new Set(PAGE)];
const missing = uniqueTags.filter((t) => !tagToEntry[t]);
const lazyPageFiles = new Set([loaderFile, ...closure(LAZY, coreFile)]);
for (const t of uniqueTags) if (tagToEntry[t]) for (const f of closure(LAZY, tagToEntry[t])) lazyPageFiles.add(f);
const cePageFiles = new Set();
for (const t of uniqueTags) if (ce.components[t]) for (const f of closure(CE, `${t}.js`)) cePageFiles.add(f);
// What a bundler would emit: one concatenated chunk (approximation, before minifier dedupe).
const ceConcat = [...cePageFiles].map((f) => read(join(CE, f))).join('\n');
const fontsUsed = fonts.length ? fonts : [];
const page = {
  tags: PAGE,
  instances: PAGE.length,
  uniqueTags: uniqueTags.length,
  missing,
  lazy: { requests: lazyPageFiles.size + 1, js: filesSize(LAZY, lazyPageFiles), css: lazy.globalCss },
  ce: { modules: cePageFiles.size, js: filesSize(CE, cePageFiles), jsBundled: size(ceConcat), css: lazy.globalCss },
  componentCss: size(uniqueTags.map((t) => ce.components[t]?.cssRaw ?? '').join('')),
  fonts: pageFonts.en ?? 0,
  fontsAr: pageFonts.ar ?? 0,
  fontFiles: pageFonts.files,
};
page.lazy.total = add(add(page.lazy.js, page.lazy.css), { raw: page.fonts, gzip: page.fonts, br: page.fonts });
page.ce.total = add(add(page.ce.jsBundled, page.ce.css), { raw: page.fonts, gzip: page.fonts, br: page.fonts });

/* www playground ------------------------------------------------------------------------ */
const dirSize = (d, filter = () => true) => {
  let s = ZERO, n = 0;
  if (!existsSync(d)) return { size: s, files: 0 };
  const walk = (p) => {
    for (const e of readdirSync(p)) {
      const q = join(p, e);
      if (statSync(q).isDirectory()) walk(q);
      else if (filter(q)) {
        s = add(s, size(readFileSync(q)));
        n++;
      }
    }
  };
  walk(d);
  return { size: s, files: n };
};
const www = {
  js: dirSize(WWW, (f) => f.endsWith('.js')),
  css: dirSize(WWW, (f) => f.endsWith('.css')),
  playground: dirSize(join(root, 'www', 'playground'), (f) => /\.(js|css|html)$/.test(f)),
};
const lazyAll = dirSize(LAZY, (f) => f.endsWith('.js'));
const ceAll = dirSize(CE, (f) => f.endsWith('.js'));

const report = { generated: new Date().toISOString(), lazy, ce: { runtime: ce.runtime, components: Object.fromEntries(Object.entries(ce.components).map(([k, v]) => [k, { files: v.files, js: v.js, css: v.css }])) }, cssSource, builtDup, tokens: tokens && { ...tokens, customProperties: tokenCount }, fonts, fontFace, page, www, totals: { lazy: lazyAll, ce: ceAll } };

/* Budgets ------------------------------------------------------------------------------- */
let failures = [];
const budgetFile = opt('--budget');
if (budgetFile) {
  const b = JSON.parse(read(budgetFile));
  const check = (label, actual, limit) => {
    if (typeof limit === 'string') return;
    if (limit != null && actual > limit) failures.push(`${label}: ${actual} B gzip > budget ${limit} B`);
  };
  // Components are checked in the custom-elements build (the primary build): the tag's
  // module plus its import closure, excluding the runtime. With lazy bundles a lazy entry
  // holds a whole group, so it is reported, not budgeted. Only tags listed in "enforce"
  // (rebuilt for v2) fail the check; v1 tags are reported as pending until Wave 2b.
  const enforce = new Set(b.enforce ?? Object.keys(ce.components));
  const pending = [];
  check('runtime core (lazy)', lazy.core.gzip, b.coreGzip);
  check('document stylesheet sc.css', lazy.globalCss.gzip, b.globalCssGzip);
  check('shadow helper sheet', lazy.shadowCss.gzip, b.shadowCssGzip);
  for (const [tag, c] of Object.entries(ce.components)) {
    const limit = b.components?.[tag] ?? b.componentGzip;
    if (enforce.has(tag)) check(`${tag} (custom element JS incl. CSS and strings, excl. runtime)`, c.js.gzip, limit);
    else if (c.js.gzip > limit) pending.push(`${tag}: ${c.js.gzip} B > ${limit} B (v1, not yet rebuilt)`);
  }
  if (uniqueTags.every((t) => enforce.has(t))) {
    check('typical page JS (lazy)', page.lazy.js.gzip, b.pageJsGzip);
    check('typical page component CSS', page.componentCss.gzip, b.pageComponentCssGzip);
  } else {
    pending.push(`typical page: ${page.lazy.js.gzip} B JS, ${page.componentCss.gzip} B component CSS (enforced once every tag on it is rebuilt)`);
  }
  if (pageFonts.error && !flag('--no-browser') && !opt('--page')) failures.push(`fonts on the typical page: ${pageFonts.error}`);
  const list = (l) => pageFonts.files[l].map((f) => `${f.file} ${f.bytes}`).join(', ');
  if (b.pageFontsEnBytes != null && pageFonts.en > b.pageFontsEnBytes) failures.push(`fonts on an English page: ${pageFonts.en} B > budget ${b.pageFontsEnBytes} B (${list('en')})`);
  if (b.pageFontsArBytes != null && pageFonts.ar > b.pageFontsArBytes) failures.push(`fonts on an Arabic page: ${pageFonts.ar} B > budget ${b.pageFontsArBytes} B (${list('ar')})`);
  report.budgetPending = pending;
  for (const f of fonts) if (b.fontFileBytes != null && f.bytes > b.fontFileBytes) failures.push(`${f.file}: ${f.bytes} B > budget ${b.fontFileBytes} B per font file`);
}

/* Output -------------------------------------------------------------------------------- */
if (flag('--json')) {
  console.log(JSON.stringify({ ...report, budgetFailures: failures }, null, 2));
} else {
  const L = [];
  L.push(`# Bundle measurement (${report.generated})`, '', 'Sizes in KiB: raw / gzip / brotli. Each file compressed on its own.', '');
  L.push('## Lazy build (dist/sc-components)', '');
  L.push(`- Loader \`${loaderFile}\`: ${fmt(lazy.loader)}`, `- Runtime core and its imports: ${fmt(lazy.core)}`, `- Document stylesheet sc.css (tokens, @font-face, base, light-DOM styles, helpers): ${fmt(lazy.globalCss)}`, `- Shadow helper sheet (globalStyle, adopted by every shadow root): ${fmt(lazy.shadowCss)}`, `- All JS in the folder: ${fmt(lazyAll.size)} in ${lazyAll.files} files`, '');
  L.push('| Component | Entry (shared with) | JS incl. CSS, excl. core | CSS in entry |', '|---|---|---|---|');
  for (const [tag, c] of Object.entries(lazy.components)) L.push(`| ${tag} | ${c.entry}${c.sharedWith.length ? ` (${c.sharedWith.join(', ')})` : ''} | ${fmt(c.js)} | ${fmt(c.cssInEntry)} |`);
  L.push('', '## Custom-elements build (dist/components)', '', `- Runtime (index.js closure): ${fmt(ce.runtime)}`, `- All JS: ${fmt(ceAll.size)} in ${ceAll.files} files`, '');
  L.push('| Component | JS incl. CSS, excl. runtime | Component CSS |', '|---|---|---|');
  for (const [tag, c] of Object.entries(ce.components)) L.push(`| ${tag} | ${fmt(c.js)} | ${fmt(c.css)} |`);
  L.push('', '## CSS duplication', '');
  L.push(`- Minified shared.css: ${builtDup.sharedCssMin} B, found in ${builtDup.componentsWithShared} of ${builtDup.sheets} component stylesheets (${kb(builtDup.sharedCssMin * builtDup.componentsWithShared)} KiB of copies)`);
  L.push(`- Type-role blocks: ${builtDup.typeRoleBlocks} copies, ${kb(builtDup.typeRoleBytes)} KiB raw in total`);
  L.push(`- All component CSS together: ${fmt(builtDup.allComponentCss)}`);
  if (tokens) L.push(`- tokens.css: ${fmt(tokens)}, ${tokenCount} custom-property declarations (inlined into the global stylesheet)`);
  L.push('', '| Component | Source CSS bytes | own | shared.css | type roles | field.css/choice.css | share not own |', '|---|---|---|---|---|---|---|');
  for (const [tag, c] of Object.entries(cssSource)) {
    const own = c.by.own ?? 0;
    L.push(`| ${tag} | ${c.total} | ${own} | ${c.by['shared.css'] ?? 0} | ${c.by['type roles'] ?? 0} | ${c.by['field.css/choice.css'] ?? 0} | ${c.total ? Math.round((100 * (c.total - own)) / c.total) : 0}% |`);
  }
  L.push('', '## Fonts', '', `@font-face rules: ${fontFace.count}; font-display: ${fontFace.display.join(', ') || 'none'}; unicode-range: ${fontFace.unicodeRange ? 'yes' : 'no'}`, '');
  L.push('| File | Bytes | Glyphs | Code points | Latin | Arabic | glyf | GSUB | GPOS |', '|---|---|---|---|---|---|---|---|---|');
  for (const f of fonts) L.push(`| ${f.file} | ${f.bytes} | ${f.numGlyphs} | ${f.codePoints} | ${f.latin} | ${f.arabic} | ${f.glyf} | ${f.gsub} | ${f.gpos} |`);
  if (fonts[0]) {
    const m = fonts[0].metrics;
    L.push('', `Vertical metrics (${fonts[0].file}): unitsPerEm ${m.unitsPerEm}, hhea ascender ${m.hheaAscender} / descender ${m.hheaDescender} / lineGap ${m.hheaLineGap}, OS/2 winAscent ${m.winAscent} / winDescent ${m.winDescent}, xAvgCharWidth ${m.xAvgCharWidth}.`);
  }
  L.push('', '## Typical page', '', `Tags (${page.instances} instances, ${page.uniqueTags} unique): ${PAGE.join(', ')}${missing.length ? `. Missing: ${missing.join(', ')}` : ''}`, '');
  L.push(`- Lazy: ${page.lazy.requests} requests (incl. stylesheet); JS ${fmt(page.lazy.js)}; global CSS ${fmt(page.lazy.css)}`);
  L.push(`- Custom elements: ${page.ce.modules} modules; JS per module ${fmt(page.ce.js)}; as one bundle ${fmt(page.ce.jsBundled)}`);
  L.push(`- Component CSS parsed (once per tag): ${fmt(page.componentCss)}`);
  if (pageFonts.error) L.push(`- Fonts the page downloads: ${pageFonts.error}`);
  else for (const l of ['en', 'ar']) L.push(`- Fonts Helium downloads, ${l === 'en' ? 'English' : 'Arabic'}: ${kb(pageFonts[l])} KiB (${pageFonts.files[l].map((f) => `${f.file} ${kb(f.bytes)}`).join(', ')})`);
  L.push(`- First-load total, lazy, gzip: ${kb(page.lazy.total.gzip)} KiB; brotli: ${kb(page.lazy.total.br)} KiB`);
  L.push('', '## www playground', '', `- build JS: ${fmt(www.js.size)} (${www.js.files} files); build CSS: ${fmt(www.css.size)}; playground shell: ${fmt(www.playground.size)} (${www.playground.files} files)`);
  if (budgetFile) {
    L.push('', '## Budgets', '', failures.length ? failures.map((f) => `- FAIL ${f}`).join('\n') : '- All enforced budgets met');
    if (report.budgetPending?.length) L.push('', 'Pending (reported, not enforced):', ...report.budgetPending.map((p) => `- ${p}`));
  }
  console.log(L.join('\n'));
}
if (failures.length) process.exit(1);
