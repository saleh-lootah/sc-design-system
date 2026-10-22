#!/usr/bin/env node
/**
 * Builds the documentation site into www/, next to the Stencil build and the playground:
 * the design system (foundations, every component with its live examples, specification and
 * API), the Service Standard, the Design System reference, the Assurance handbook, the change
 * log and the project records, in English (/) and Arabic (/ar/).
 *
 *   npm run build            # Stencil build, then this (postbuild)
 *   npm run build:site       # this alone, after a build
 *
 * The repository's Markdown is the only source: nothing is copied by hand. Long documents are
 * split into one page per `##` chapter. Every heading and requirement identifier keeps a
 * linkable id; links between documents are rewritten to the chapter that holds the anchor.
 * Output is static HTML that works without JavaScript; site.js and search.js only enhance it.
 * All URLs are relative, so the site works under any path (GitHub Pages serves it from
 * /sc-design-system/).
 *
 * The project records (docs/v2/*, the review reports, the motion audit) are internal working
 * notes: they are built only with SC_SITE_INTERNAL=1 (`npm run build:site:internal`), never in
 * the default build, which is what GitHub Pages publishes (decision R3).
 *
 * The playground (src/index.html, built by Stencil as www/index.html) moves to
 * www/playground.html; the site's home page takes www/index.html.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { parseDoc, renderChunk, chunkHeadings, searchSections, escapeHtml as esc, inlineText, md } from './site/markdown.mjs';
import { STRINGS, NAMES, BLURBS } from './site/strings.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const COMPONENTS = join(here, '..');
const REPO = join(COMPONENTS, '..');
const WWW = join(COMPONENTS, 'www');
const LANGS = ['en', 'ar'];
/** Where links to repository files that are not pages go. Switch to main when v2 is merged. */
const BLOB = 'https://github.com/saleh-lootah/sc-design-system/blob/main/';
const TREE = 'https://github.com/saleh-lootah/sc-design-system/tree/v2/';

const INTERNAL = process.env.SC_SITE_INTERNAL === '1';
const warnings = [];
const warn = (m) => warnings.push(m);
const read = (f) => readFileSync(join(REPO, f), 'utf8');

if (!existsSync(join(WWW, 'build', 'sc.css')) || !existsSync(join(COMPONENTS, 'dist', 'components', 'index.js'))) {
  console.error('build-site: no Stencil build. Run `npm run build` in components/ first.');
  process.exit(1);
}

/* Documents --------------------------------------------------------------------------- */
/**
 * Every Markdown document on the site. `base` is its URL; `split` cuts it into chapters;
 * `own` makes its chapters the section's top-level navigation.
 */
const DOCS = [
  { key: 'docs/standard/service-standard.md', section: 'standard', base: 'standard/', split: true, own: true },
  { key: 'docs/ux-standard-changes.md', section: 'standard', base: 'standard/changes/', group: 'About the standard', title: { en: 'Changes from 1.0 to 2.0', ar: 'التغييرات من الإصدار 1.0 إلى 2.0' } },
  { key: 'docs/shared-channels-ux-standard.md', section: 'standard', base: 'ux-standard/', hidden: true, forward: true },
  { key: 'docs/standard/design-system-reference.md', section: 'reference', base: 'reference/', split: true, own: true },
  { key: 'docs/standard/assurance-handbook.md', section: 'assurance', base: 'assurance/', split: true, own: true },
  { key: 'README.md', section: 'design-system', base: 'design-system/tokens/', group: 'Get started', title: { en: 'Tokens and build', ar: 'الرموز التصميمية والبناء' } },
  { key: 'MOBILE.md', section: 'design-system', base: 'design-system/mobile/', group: 'Get started', title: { en: 'Building for mobile', ar: 'البناء للأجهزة المحمولة' } },
  { key: 'docs/library-conformance.md', section: 'design-system', base: 'design-system/conformance/', group: 'Get started', title: { en: 'Library conformance', ar: 'توافق المكتبة مع المعيار' } },
  { key: 'components/CONTRIBUTING.md', section: 'design-system', base: 'design-system/contributing/', group: 'Build and contribute', title: { en: 'Contributing', ar: 'المساهمة' } },
  { key: 'components/CONVENTIONS.md', section: 'design-system', base: 'design-system/conventions/', group: 'Build and contribute', title: { en: 'Library conventions', ar: 'اصطلاحات المكتبة' } },
  { key: 'docs/v2/decisions.md', section: 'records', base: 'records/decisions/', group: 'Decisions', internal: true },
  { key: 'docs/v2/plan.md', section: 'records', base: 'records/plan/', group: 'Decisions', internal: true },
  { key: 'docs/v2/migration.md', section: 'records', base: 'records/migration/', group: 'Decisions', internal: true },
  { key: 'docs/v2/wave-2b-brief.md', section: 'records', base: 'records/wave-2b-brief/', group: 'Decisions', internal: true },
  { key: 'docs/v2/architecture.md', section: 'records', base: 'records/architecture/', group: 'Specifications', internal: true, split: true },
  { key: 'docs/v2/foundations.md', section: 'records', base: 'records/foundations/', group: 'Specifications', internal: true, split: true },
  { key: 'docs/v2/component-language.md', section: 'records', base: 'records/component-language/', group: 'Specifications', internal: true, split: true, splitParts: /^Part [A-Z]\b/ },
  { key: 'components/COMPONENTS.md', section: 'records', base: 'records/component-status/', group: 'Specifications', internal: true },
  { key: 'docs/v2/alignment-report.md', section: 'records', base: 'records/alignment-report/', group: 'Reviews', internal: true },
  { key: 'docs/ux-standard-review.md', section: 'records', base: 'records/standard-review/', group: 'Reviews', internal: true },
  { key: 'docs/motion-audit.md', section: 'records', base: 'records/motion-audit/', group: 'Reviews', internal: true },
];
/** A chapter heading: numbered, or an appendix. Unnumbered `##` before the first stay on the overview. */
const CHAPTER = /^(\d+\.|[A-Z]\.|Appendix\b|Part\b)/;
const SECTION_ORDER = ['design-system', 'standard', 'reference', 'assurance', ...(INTERNAL ? ['records'] : [])];
const SECTION_HOME = { 'design-system': 'design-system/', standard: 'standard/', reference: 'reference/', assurance: 'assurance/', records: 'records/' };

/* Component pages: the playground registry, the demo fragments, the specs ------------------ */
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(COMPONENTS, 'src/www/registry.js'), 'utf8'), sandbox);
const registry = sandbox.window.scPlaygroundPages;
const COMPONENT_GROUPS = ['Actions and navigation', 'Form fields', 'Feedback and status', 'Content and layout'];
/** Specs with no playground page of their own. */
const SPEC_ONLY = {
  'sc-checkbox': { group: 'Form fields', en: 'Checkbox', ar: 'مربع الاختيار' },
  'sc-radio': { group: 'Form fields', en: 'Radio', ar: 'زر الاختيار' },
  'sc-summary-row': { group: 'Content and layout', en: 'Summary row', ar: 'صف الملخص' },
};
const api = JSON.parse(readFileSync(join(COMPONENTS, 'docs/components.json'), 'utf8')).components;
const fragmentOf = (id) => {
  const f = join(COMPONENTS, 'src/www/pages', `${id}.html`);
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};
/** The data-ar text of the fragment's first element with this class, or its text. */
const fragmentText = (html, cls, lang) => {
  const m = html?.match(new RegExp(`<([a-z0-9]+)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`));
  if (!m) return '';
  const ar = m[0].match(/data-ar="([^"]*)"/);
  return lang === 'ar' && ar ? ar[1] : m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
};

/* Pages --------------------------------------------------------------------------------- */
/**
 * A page: { path, section, group, title: {en, ar}, kind, … }. path is relative to the site
 * root with a trailing slash ('' for home); the Arabic copy lives at 'ar/' + path.
 */
const pages = [];
const addPage = (p) => (pages.push(p), p);

const docs = new Map(); // repo file -> { cfg, parsed, ar?, pages[] }
const reqs = new Map(); // ID -> { id, title, page, doc }

for (const cfg of DOCS) {
  if (cfg.internal && !INTERNAL) continue;
  const src = read(cfg.key);
  const parsed = parseDoc(src, { split: !!cfg.split, splitAt: CHAPTER, splitParts: cfg.splitParts });
  const arFile = cfg.key.replace(/\.md$/, '.ar.md');
  const ar = existsSync(join(REPO, arFile)) ? parseDoc(read(arFile), { split: !!cfg.split, splitAt: CHAPTER, splitParts: cfg.splitParts }) : null;
  if (ar && ar.chunks.length !== parsed.chunks.length) warn(`${arFile}: ${ar.chunks.length} chapters, the English has ${parsed.chunks.length}; Arabic ignored`);
  const doc = { cfg, parsed, ar: ar && ar.chunks.length === parsed.chunks.length ? ar : null, pages: [] };
  docs.set(cfg.key, doc);
  const title = cfg.title ?? { en: parsed.title, ar: doc.ar?.title || parsed.title };
  const used = new Set();
  parsed.chunks.forEach((chunk, i) => {
    const isOverview = i === 0;
    let path = cfg.base;
    if (!isOverview) {
      let slug = chunk.heading.text
        .toLowerCase()
        .replace(/^(\d+(\.\d+)*\.?\s+)/, '')
        .replace(/['’]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '');
      if (slug.length > 48) slug = slug.slice(0, 49).replace(/-[^-]*$/, '');
      while (used.has(slug)) slug += '-2';
      used.add(slug);
      path = `${cfg.base}${slug}/`;
    }
    const chTitle = isOverview ? title : { en: chunk.heading.text, ar: doc.ar?.chunks[i].heading?.text || chunk.heading.text };
    const navTitle = isOverview && cfg.own ? { en: STRINGS.en.overview, ar: STRINGS.ar.overview } : chTitle;
    const group = cfg.own ? (isOverview ? null : /^appendix/i.test(chunk.heading.text) ? 'Appendices' : 'Chapters') : cfg.group;
    doc.pages.push(
      addPage({
        kind: 'doc',
        path,
        section: cfg.section,
        group,
        title: chTitle,
        navTitle,
        doc,
        chunk: i,
        parent: isOverview ? null : cfg.own ? null : doc,
        hidden: cfg.hidden,
        internal: cfg.internal,
      }),
    );
  });
}
// Requirement identifiers: the first definition wins; a second one is reported.
for (const pass of [false, true]) for (const doc of docs.values()) {
  for (const r of doc.parsed.reqs) {
    if (!!r.table !== pass) continue; // a definition in a list wins over an ID alone in a table row
    if (!doc.cfg.own) continue; // other documents quote identifiers; only the three standard documents define them
    if (reqs.has(r.id)) {
      if (reqs.get(r.id).doc !== doc && !r.table) warn(`${r.id} defined in ${reqs.get(r.id).doc.cfg.key} and ${doc.cfg.key}`);
      continue;
    }
    reqs.set(r.id, { ...r, page: doc.pages[r.chunk], doc });
  }
}

// Design system: overview, foundations, components.
const dsHome = addPage({ kind: 'ds-home', path: 'design-system/', section: 'design-system', group: null, title: NAMES['design-system'], navTitle: { en: STRINGS.en.overview, ar: STRINGS.ar.overview } });
pages.splice(pages.indexOf(dsHome), 1);
pages.unshift(dsHome);
const foundations = addPage({ kind: 'component', id: 'foundations', path: 'design-system/foundations/', section: 'design-system', group: 'Foundations', title: { en: 'Foundations', ar: fragmentText(fragmentOf('foundations'), 'pg-title', 'ar') || 'الأسس' } });
const specTags = readdirSync(join(COMPONENTS, 'specs')).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
const componentPages = [];
for (const tag of new Set([...registry.filter((r) => r.id.startsWith('sc-')).map((r) => r.id), ...specTags])) {
  const reg = registry.find((r) => r.id === tag);
  const frag = fragmentOf(tag);
  const extra = SPEC_ONLY[tag];
  const group = reg?.group ?? extra?.group ?? 'Content and layout';
  const title = { en: reg?.title ?? extra?.en ?? tag, ar: fragmentText(frag, 'pg-title', 'ar') || extra?.ar || reg?.title || tag };
  componentPages.push({ kind: 'component', id: tag, path: `components/${tag}/`, section: 'design-system', group, title, frag, hasSpec: specTags.includes(tag) });
}
componentPages.sort((a, b) => COMPONENT_GROUPS.indexOf(a.group) - COMPONENT_GROUPS.indexOf(b.group) || a.title.en.localeCompare(b.title.en));
for (const p of componentPages) addPage(p);
// Specs are documents too: links to components/specs/<tag>.md land on the component page.
for (const p of componentPages) {
  if (!p.hasSpec) continue;
  const key = `components/specs/${p.id}.md`;
  const parsed = parseDoc(read(key));
  const doc = { cfg: { key, section: 'design-system' }, parsed, pages: [p] };
  docs.set(key, doc);
  p.doc = doc;
}

const reqPage = addPage({ kind: 'requirements', path: 'requirements/', section: 'standard', group: 'About the standard', title: { en: STRINGS.en.requirements, ar: STRINGS.ar.requirements } });
const recordsHome = INTERNAL && addPage({ kind: 'records-home', path: 'records/', section: 'records', group: null, title: NAMES.records, navTitle: { en: STRINGS.en.overview, ar: STRINGS.ar.overview }, internal: true });
if (recordsHome) {
  pages.splice(pages.indexOf(recordsHome), 1);
  pages.splice(pages.findIndex((p) => p.section === 'records'), 0, recordsHome);
}
const searchPage = addPage({ kind: 'search', path: 'search/', section: null, title: { en: STRINGS.en.search, ar: STRINGS.ar.search }, hidden: true });
const home = addPage({ kind: 'home', path: '', section: null, title: { en: 'Shared Channels design system', ar: STRINGS.ar.titleSuffix }, hidden: true });

/* Order within each section: overview, then groups in a fixed order, then the page order above. */
const GROUP_ORDER = [null, 'Get started', 'Foundations', ...COMPONENT_GROUPS, 'Build and contribute', 'Chapters', 'Appendices', 'About the standard', 'Decisions', 'Specifications', 'Reviews'];
const sectionPages = (s) => {
  const list = pages.filter((p) => p.section === s && !p.hidden);
  return list.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || list.indexOf(a) - list.indexOf(b));
};
// A stable reading order, for previous and next.
const ORDER = new Map();
for (const s of SECTION_ORDER) {
  const list = sectionPages(s);
  // Chapters of a records document follow their overview.
  const flat = [];
  for (const p of list) {
    if (p.parent) continue;
    flat.push(p);
    if (p.doc?.pages?.[0] === p && !p.doc.cfg.own) flat.push(...p.doc.pages.slice(1));
  }
  ORDER.set(s, flat);
}

/* URLs ---------------------------------------------------------------------------------- */
const langPath = (lang, path) => (lang === 'ar' ? `ar/${path}` : path);
/** Relative URL from one site path (a directory, '' for the root) to another. */
const rel = (from, to) => {
  const depth = from.split('/').filter(Boolean).length;
  const out = '../'.repeat(depth) + to;
  return out || './';
};

/** Resolves a link written in a document to a site URL, from the page being rendered. */
function makeResolver(srcKey, lang, from) {
  const local = (page, frag) => (langPath(lang, page.path) === from ? `#${frag || 'main-content'}` : rel(from, langPath(lang, page.path)) + (frag ? `#${frag}` : ''));
  return (href) => {
    if (!href) return { href: '#' };
    if (href.startsWith('req:')) {
      const r = reqs.get(href.slice(4));
      return { href: local(r.page, r.id) };
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return { href, external: /^https?:/i.test(href) };
    const hash = href.indexOf('#');
    const file = hash >= 0 ? href.slice(0, hash) : href;
    const frag = hash >= 0 ? decodeURIComponent(href.slice(hash + 1)) : '';
    const target = file ? posix.normalize(posix.join(posix.dirname(srcKey), decodeURIComponent(file))) : srcKey;
    const doc = docs.get(target);
    if (doc) {
      if (!frag) return { href: local(doc.pages[0], '') };
      const id = doc.parsed.aliases.get(frag) ?? frag;
      const ci = doc.parsed.anchors.get(frag);
      if (ci === undefined && !(doc.pages[0].kind === 'component' && fragmentHas(doc.pages[0], frag))) warn(`${srcKey}: broken anchor ${href}`);
      const page = doc.pages[ci ?? 0];
      const isPageHeading = page.chunk > 0 && doc.parsed.chunks[page.chunk].heading?.id === id;
      return { href: local(page, isPageHeading ? '' : id) };
    }
    if (target === srcKey && frag) return { href: `#${frag}` };
    if (target.startsWith('..')) {
      warn(`${srcKey}: link outside the repository ${href}`);
      return { href: '#' };
    }
    const abs = join(REPO, target);
    if (existsSync(abs)) return { href: (statSync(abs).isDirectory() ? TREE : BLOB) + target + (frag ? `#${frag}` : ''), external: true };
    warn(`${srcKey}: missing file ${href}`);
    return { href: BLOB + target, external: true };
  };
}
const fragmentHas = (page, id) => !!page.frag && page.frag.includes(`id="${id}"`);

/* Icons (Material Symbols paths from the library's own icon set) -------------------------- */
const ICONS = JSON.parse(readFileSync(join(COMPONENTS, 'src/icons/icons.json'), 'utf8')).icons;
const icon = (name, cls = '') =>
  `<svg class="site-icon${ICONS[name].mirror ? ' site-icon--mirror' : ''}${cls ? ` ${cls}` : ''}" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="${ICONS[name].d}"/></svg>`;

/* Components: the custom-elements build, only the tags each page uses ------------------- */
/**
 * Site pages load dist/components (the primary build: one module per tag that defines it on
 * import), copied to site/ce/. The lazy loader groups tags into bundles for channel pages,
 * so a page with breadcrumbs and a footer would pull in the whole page-shell and navigation
 * bundles (37 KiB gzip); importing just the tags it uses costs about half that. Each page
 * gets modulepreload hints for the whole import closure, so there is no waterfall.
 */
const CE = join(COMPONENTS, 'dist', 'components');
const ceImports = new Map();
const importsOf = (f) => {
  if (!ceImports.has(f)) ceImports.set(f, [...new Set([...readFileSync(join(CE, f), 'utf8').matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)].map((m) => m[1]))]);
  return ceImports.get(f);
};
function componentModules(html, from) {
  const tags = [...new Set([...html.matchAll(/<(sc-[a-z-]+)[\s>]/g)].map((m) => m[1]))].filter((t) => existsSync(join(CE, `${t}.js`)));
  const closure = new Set();
  const walk = (f) => {
    if (closure.has(f)) return;
    closure.add(f);
    for (const d of importsOf(f)) walk(d);
  };
  for (const t of tags) walk(`${t}.js`);
  // A module specifier must start with ./ or ../ (the home page's would not).
  const base = rel(from, 'site/ce/').replace(/^(?!\.)/, './');
  return [
    ...[...closure].map((f) => `<link rel="modulepreload" href="${base}${f}">`),
    `<script type="module">${tags.map((t) => `import '${base}${t}.js';`).join('')}</script>`,
  ].join('\n');
}

/* Layout -------------------------------------------------------------------------------- */
/**
 * The regular and bold faces every page sets text in, preloaded so they are there at first
 * paint: with font-display: swap, a late font reflows the header and the first lines (CLS).
 */
const FONT_PRELOAD = {
  // The language switch sets "العربية" / "English" in the name subsets.
  en: ['dubai-w23-400-latin.woff2', 'dubai-w23-500-latin.woff2', 'dubai-w23-700-latin.woff2', 'dubai-w23-700-name-ar.woff2'],
  // Arabic text quotes Latin names (WCAG, UAE PASS), set in the Latin regular face.
  ar: ['dubai-w23-400-arabic.woff2', 'dubai-w23-700-arabic.woff2', 'dubai-w23-500-name-en.woff2', 'dubai-w23-400-latin.woff2'],
  // An Arabic page around an English document also sets Latin headings and labels.
  arWithEnglish: ['dubai-w23-500-latin.woff2', 'dubai-w23-700-latin.woff2'],
  // The home headline is set in both scripts.
  homeHeadline: { en: ['dubai-w23-700-arabic.woff2'], ar: ['dubai-w23-700-latin.woff2'] },
};
/** On an Arabic page, English text (a document's own title) is marked as English. */
const ARABIC = /[\u0600-\u06FF]/;
const en = (text, lang) => (lang === 'ar' && !ARABIC.test(text) ? ' lang="en" dir="ltr"' : '');

function crumbsFor(page) {
  const out = [{ title: { en: STRINGS.en.home, ar: STRINGS.ar.home }, path: '' }];
  if (page.section && SECTION_HOME[page.section] !== page.path) {
    const sh = pages.find((p) => p.path === SECTION_HOME[page.section]);
    out.push({ title: NAMES[page.section], path: sh.path });
  }
  if (page.parent && page.parent.pages[0] !== page) out.push({ title: page.parent.pages[0].title, path: page.parent.pages[0].path });
  return out;
}

function sideNav(page, lang) {
  if (!page.section) return '';
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const link = (p) => {
    const cur = p === page;
    const inDoc = page.parent && page.parent === p.doc && p.doc.pages[0] === p;
    const text = (p.navTitle ?? p.title)[lang];
    return `<a href="${rel(from, langPath(lang, p.path))}"${cur ? ' aria-current="page"' : ''}${inDoc ? ' class="is-ancestor"' : ''}${en(text, lang)}>${esc(text)}</a>`;
  };
  const item = (p) => {
    let kids = '';
    const isDocHead = p.doc?.pages?.[0] === p && !p.doc.cfg.own && p.doc.pages.length > 1;
    if (isDocHead && (page.doc === p.doc)) kids = `<ul>${p.doc.pages.slice(1).map((c) => `<li>${link(c)}</li>`).join('')}</ul>`;
    return `<li>${link(p)}${kids}</li>`;
  };
  const list = sectionPages(page.section).filter((p) => !p.parent);
  const groups = [];
  for (const p of list) {
    const g = groups.find((x) => x.name === p.group) ?? (groups.push({ name: p.group, items: [] }), groups[groups.length - 1]);
    g.items.push(p);
  }
  const extra =
    page.section === 'design-system'
      ? `<li><a href="${rel(from, 'playground.html')}${lang === 'ar' ? '?lang=ar' : ''}">${esc(t.playground)}</a></li>`
      : '';
  const body = groups
    .map((g, gi) => {
      const items = g.items.map(item).join('') + (g.name === 'Build and contribute' ? extra : '');
      if (!g.name) return `<ul class="site-nav__top">${items}</ul>`;
      const open = g.items.some((p) => p === page || p.doc === page.doc && page.doc) || g.name === 'Chapters' || page.kind === 'ds-home' || page.kind === 'records-home' || g.items.length < 6;
      return `<details class="site-nav__group"${open ? ' open' : ''}><summary>${esc(NAMES[g.name]?.[lang] ?? g.name)}</summary><ul>${items}</ul></details>`;
    })
    .join('');
  return `<details class="site-menu" data-wide-open>
  <summary>${icon('Menu')}<span>${esc(t.menu)}</span>${icon('ExpandMore', 'site-disclosure')}</summary>
  <div class="site-menu__panel">
    <nav class="site-nav" aria-label="${esc(t.sectionNav)}"><p class="site-nav__title">${esc(NAMES[page.section][lang])}</p>${body}</nav>
  </div>
</details>
<script>document.currentScript.previousElementSibling.open = matchMedia('(min-width: 1024px)').matches;</script>`;
}

function pager(page, lang) {
  const order = ORDER.get(page.section);
  if (!order) return '';
  const i = order.indexOf(page);
  if (i < 0) return '';
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const a = (p, rel_, label, ic) =>
    p
      ? `<a class="site-pager__link site-pager__link--${rel_}" rel="${rel_}" href="${rel(from, langPath(lang, p.path))}"><span><span class="site-pager__label">${esc(label)}</span><span class="site-pager__title"${en(p.title[lang], lang)}>${esc(p.title[lang])}</span></span></a>`
      : '<span></span>';
  return `<nav class="site-pager" aria-label="${esc(t.pager)}">${a(order[i - 1], 'prev', t.previous)}${a(order[i + 1], 'next', t.next)}</nav>`;
}

function toc(headings, lang) {
  const items = headings.filter((h) => h.level === 2);
  if (items.length < 2) return '';
  const t = STRINGS[lang];
  return `<details class="doc-toc" data-wide-open>
  <summary>${esc(t.onThisPage)}${icon('ExpandMore', 'site-disclosure')}</summary>
  <p class="doc-toc__title" aria-hidden="true">${esc(t.onThisPage)}</p>
  <nav aria-label="${esc(t.onThisPage)}"><ul>${items.map((h) => `<li><a href="#${esc(h.id)}"${en(h.text, lang)}>${esc(h.text)}</a></li>`).join('')}</ul></nav>
</details>
<script>document.currentScript.previousElementSibling.open = matchMedia('(min-width: 1280px)').matches;</script>`;
}

function layout(page, lang, { head = '', body, headings = [], bodyLang, extraHead = '', bodyAttrs = '' }) {
  const t = STRINGS[lang];
  const other = lang === 'en' ? 'ar' : 'en';
  const from = langPath(lang, page.path);
  const R = rel(from, '');
  const root = R === './' ? '' : R;
  const title = page.kind === 'home' ? page.title[lang] : `${page.title[lang]} – ${t.titleSuffix}`;
  const otherHref = rel(from, langPath(other, page.path));
  const crumbs = page.kind === 'home' ? '' : crumbsFor(page);
  const crumbHtml = crumbs
    ? `<sc-breadcrumbs>${crumbs.map((c) => `<a href="${rel(from, langPath(lang, c.path))}"${en(c.title[lang], lang)}>${esc(c.title[lang])}</a>`).join('')}<span${en(page.title[lang], lang)}>${esc(page.title[lang])}</span></sc-breadcrumbs>`
    : '';
  // The header's main navigation: home and the four sections (sc-site-header takes four or five).
  const current = (path) => (page.path === path ? ' aria-current="page"' : page.section && SECTION_HOME[page.section] === path ? ' aria-current="true"' : '');
  const navLinks = [`<a slot="nav" href="${rel(from, langPath(lang, ''))}"${current('')}>${esc(t.homeNav)}</a>`]
    .concat(SECTION_ORDER.filter((s) => s !== 'records').map((s) => `<a slot="nav" href="${rel(from, langPath(lang, SECTION_HOME[s]))}"${current(SECTION_HOME[s])}>${esc(NAMES[s][lang])}</a>`))
    .join('\n  ');
  const notice = bodyLang && bodyLang !== lang && t.englishOnly ? `<sc-callout class="site-callout"><span>${esc(t.englishOnly)}</span></sc-callout>` : '';
  const internal = page.internal ? `<sc-callout class="site-callout" tone="warning"><span slot="heading">${esc(t.internalHeading)}</span><span>${esc(t.internalBanner)}</span></sc-callout>` : '';
  const footerLinks = [
    [rel(from, langPath(lang, 'requirements/')), t.requirements],
    [`${rel(from, 'playground.html')}${lang === 'ar' ? '?lang=ar' : ''}`, t.playground],
    [rel(from, langPath(lang, 'standard/changes/')), t.changes],
  ];
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description?.[lang] ?? (page.section ? `${NAMES[page.section][lang]}: ${page.title[lang]}` : t.titleSuffix))}">
<link rel="alternate" hreflang="${other}" href="${otherHref}">
${[...FONT_PRELOAD[lang], ...(lang === 'ar' && (bodyLang === 'en' || page.kind === 'component' || page.kind === 'requirements') ? FONT_PRELOAD.arWithEnglish : []), ...(page.kind === 'home' ? FONT_PRELOAD.homeHeadline[lang] : [])].map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${root}build/assets/fonts/${f}">`).join('\n')}
<link rel="stylesheet" href="${root}build/sc.css">
<link rel="stylesheet" href="${root}site/site.css">
${extraHead}<!--sc-modules-->
<script type="module" src="${root}site/site.js"></script>
${head}</head>
<body${bodyAttrs}>
<sc-skip-link href="#main-content"></sc-skip-link>
<noscript><a class="site-skip" href="#main-content">${esc(t.skip)}</a></noscript>
<sc-site-header search-href="${rel(from, langPath(lang, 'search/'))}">
  ${navLinks}
  <sc-language-switch slot="language" appearance="plain" href="${otherHref}"><a slot="fallback" href="${otherHref}" hreflang="${other}" lang="${other}">${esc(t.langOther)}</a></sc-language-switch>
</sc-site-header>
<div class="site-body${page.section ? '' : ' site-body--full'}">
${sideNav(page, lang)}
<main id="main-content" tabindex="-1" class="site-main">
${crumbHtml}
${internal}${notice}${body}
${page.kind === 'home' || page.kind === 'search' ? '' : pager(page, lang)}
</main>
</div>
<sc-footer variant="simple">
  ${footerLinks.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join('\n  ')}
  <span slot="meta">${esc(t.footerMeta)}</span>
  <nav slot="fallback" aria-label="${esc(t.footerNav)}"><ul>${footerLinks.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul><p>${esc(t.footerMeta)}</p></nav>
</sc-footer>
</body>
</html>
`;
}

/** The article: h1 and a lead block, then the on-page contents, then the body. */
const article = ({ titleHtml, lead = '', tocHtml = '', body, bodyLang, lang, cls = '' }) =>
  `<div class="doc-layout${tocHtml ? ' has-toc' : ''}">
<div class="doc-head">${titleHtml}${lead}</div>
${tocHtml ? `<div class="doc-aside">${tocHtml}</div>` : ''}
<div class="${cls || 'doc'}"${bodyLang && bodyLang !== lang ? ` lang="${bodyLang}" dir="${bodyLang === 'ar' ? 'rtl' : 'ltr'}"` : ''}>
${body}
</div>
</div>`;

const sourceLink = (key, lang) =>
  `<p class="doc-source">${esc(STRINGS[lang].editSource)}: <a class="is-external" href="${BLOB}${key}"><code dir="ltr">${esc(key)}</code></a></p>`;

/* Renderers by kind --------------------------------------------------------------------- */
function renderDocPage(page, lang) {
  const doc = page.doc;
  const parsed = lang === 'ar' && doc.ar ? doc.ar : doc.parsed;
  const bodyLang = lang === 'ar' && doc.ar ? 'ar' : 'en';
  const chunk = parsed.chunks[page.chunk];
  const shift = page.chunk > 0 ? 1 : 0;
  const from = langPath(lang, page.path);
  const t = STRINGS[lang];
  // The page's own heading (the document's `#`, or the chapter's `##` or part's `###`) is the
  // article's h1; drop it from the body.
  const tokens = chunk.tokens;
  const h1 = chunk.heading ? tokens.indexOf(tokens.find((tk) => tk.type === 'heading_open')) : tokens.findIndex((tk) => tk.type === 'heading_open' && tk.meta.level === 1);
  const titleText = h1 >= 0 ? tokens[h1].meta.text : page.title[lang];
  const titleId = h1 >= 0 ? tokens[h1].meta.id : 'top';
  const rest = h1 >= 0 ? { tokens: tokens.filter((_, i) => i < h1 || i > h1 + 2) } : chunk;
  const html = renderChunk(rest, { shift, resolve: makeResolver(doc.cfg.key, lang, from), isReq: (id) => reqs.has(id), t });
  const headings = chunkHeadings(rest, shift);
  const titleHtml = `<h1 id="${esc(titleId)}"${bodyLang !== lang ? ` lang="${bodyLang}" dir="ltr"` : ''}>${esc(titleText)}</h1>`;
  const forward = doc.cfg.forward ? ' data-forward="row"' : page.chunk === 0 && doc.cfg.split ? ` data-anchors="anchors.json"` : '';
  return layout(page, lang, {
    bodyLang,
    bodyAttrs: forward,
    body: article({ titleHtml, lead: statusTag(page, lang), tocHtml: toc(headings, lang), body: html + sourceLink(doc.cfg.key, lang), bodyLang, lang }),
  });
}

/** The Service Standard's status, on each of its pages: a draft until it is adopted. */
const statusTag = (page, lang) =>
  page.doc?.cfg.key === 'docs/standard/service-standard.md' ? `<p class="doc-status"><sc-status-tag>${esc(STRINGS[lang].statusDraft)}</sc-status-tag></p>` : '';

/** Applies data-ar text at build time, so the Arabic examples read correctly before any script runs. */
function arabicFragment(html) {
  return html.replace(/<([a-z0-9-]+)((?:\s[^>]*?)?)\sdata-ar="([^"]*)"([^>]*)>([^<]*)<\/\1>/g, (all, tag, a, ar, b) => `<${tag}${a} data-ar="${ar}"${b}>${ar}</${tag}>`);
}

function apiTables(tag, lang) {
  const c = api.find((x) => x.tag === tag);
  if (!c) return '';
  const t = STRINGS[lang];
  const md1 = (s) => md.renderInline(s ?? '');
  const table = (caption, cols, rows) =>
    rows.length
      ? `<h3 id="api-${caption.id}">${esc(caption.text)}</h3><div class="doc-scroll" role="region" tabindex="0" aria-label="${esc(caption.text)}"><table><thead><tr>${cols.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      : '';
  const code = (s) => (s ? `<code dir="ltr">${esc(s)}</code>` : '');
  const en = lang === 'ar' ? ' lang="en" dir="ltr"' : '';
  const d = (s) => `<div${en}>${md1(s)}</div>`;
  return [
    table({ id: 'properties', text: t.properties }, [t.colProperty, t.colAttribute, t.colDescription, t.colType, t.colDefault], c.props.map((p) => [code(p.name), code(p.attr), d(p.docs), code(p.type), code(p.default)])),
    table({ id: 'events', text: t.events }, [t.colName, t.colDescription, t.colType], c.events.map((e) => [code(e.event), d(e.docs), code(e.detail)])),
    table({ id: 'methods', text: t.methods }, [t.colName, t.colDescription], c.methods.map((m) => [code(m.signature), d(m.docs)])),
    table({ id: 'slots', text: t.slots }, [t.colName, t.colDescription], c.slots.map((s) => [s.name ? code(s.name) : esc(t.defaultSlot), d(s.docs)])),
    table({ id: 'parts', text: t.parts }, [t.colName, t.colDescription], c.parts.map((p) => [code(p.name), d(p.docs)])),
  ].join('');
}

function renderComponentPage(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const headings = [];
  let demo = '';
  let titleHtml = `<h1 id="top">${esc(page.title[lang])}</h1>`;
  let lead = '';
  if (page.frag) {
    let frag = lang === 'ar' ? arabicFragment(page.frag) : page.frag;
    frag = frag.replace(/\sdata-demo-focus(="[^"]*")?/g, '');
    // The fragment's h1 and lede become the page's.
    const h1 = frag.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*/);
    if (h1) {
      titleHtml = h1[0].replace(/<h1/, '<h1 id="top"').replace(/\sclass="[^"]*"/, '');
      frag = frag.replace(h1[0], '');
    }
    const lede = frag.match(/^\s*<p class="pg-lede[^"]*"[^>]*>[\s\S]*?<\/p>\s*/);
    if (lede) {
      lead = lede[0].replace(/class="[^"]*"/, 'class="doc-lede"');
      frag = frag.replace(lede[0], '');
    }
    // Scripts run after the whole fragment, as they did in the playground.
    const scripts = [];
    frag = frag.replace(/<script>([\s\S]*?)<\/script>/g, (all, js) => (scripts.push(js), ''));
    for (const m of frag.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) headings.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '').trim(), level: 2 });
    // The channel switcher re-themes the examples: its links reload the page with ?channel=,
    // and site.js applies the channel in place without the reload.
    const links = JSON.stringify(Object.fromEntries(CHANNELS.map((c) => [c, `?channel=${c}#examples`])));
    const bar = `<div class="examples-bar" id="examples"><p class="examples-bar__label">${esc(t.examplesIn)}</p><sc-channel-switcher channel="now" links='${links}'></sc-channel-switcher></div>`;
    demo = `${bar}<div id="preview" class="demo" data-channel="now">${frag}${scripts.map((s) => `<script>${s}</script>`).join('')}</div>`;
  }
  let spec = '';
  if (page.hasSpec) {
    const parsed = page.doc.parsed;
    const tokens = parsed.chunks[0].tokens;
    const h1 = tokens.findIndex((tk) => tk.type === 'heading_open' && tk.meta.level === 1);
    const rest = { tokens: tokens.filter((_, i) => h1 < 0 || i < h1 || i > h1 + 2) };
    spec = `<section class="doc-part" aria-labelledby="specification"><div class="doc-heading"><h2 id="specification">${esc(t.specification)}</h2></div>
<div class="doc"${lang === 'ar' ? ' lang="en" dir="ltr"' : ''}>${renderChunk(rest, { shift: -1, resolve: makeResolver(page.doc.cfg.key, lang, from), isReq: (id) => reqs.has(id), t })}${sourceLink(page.doc.cfg.key, lang)}</div></section>`;
    headings.push({ id: 'specification', text: t.specification, level: 2 });
  }
  // Foundations: the examples are drawn by script; the reference's chapters are the text.
  if (page.id === 'foundations') {
    const ref = docs.get('docs/standard/design-system-reference.md').pages.slice(1, 10);
    const label = lang === 'ar' ? 'في مرجع نظام التصميم' : 'In the Design System reference';
    spec = `<section class="doc-part" aria-labelledby="in-reference"><div class="doc-heading"><h2 id="in-reference">${esc(label)}</h2></div>${cards(ref, lang, from)}</section>`;
    headings.push({ id: 'in-reference', text: label, level: 2 });
  }
  const apiHtml = page.id.startsWith('sc-') ? apiTables(page.id, lang) : '';
  if (apiHtml) headings.push({ id: 'api', text: t.api, level: 2 });
  const playground = `<p class="doc-actions"><a class="doc-action" href="${rel(from, 'playground.html')}?page=${page.id}${lang === 'ar' ? '&amp;lang=ar' : ''}">${esc(t.openPlayground)}</a></p>`;
  const body = `${demo}${spec}${apiHtml ? `<section class="doc-part" aria-labelledby="api"><div class="doc-heading"><h2 id="api">${esc(t.api)}</h2></div>${apiHtml}</section>` : ''}`;
  return layout(page, lang, {
    extraHead: `<link rel="stylesheet" href="${rel(from, 'playground/demo.css')}">\n`,
    // Not .doc: the examples keep the library's own look, without the site's text styles.
    body: article({ titleHtml, lead: lead + playground, tocHtml: toc(headings, lang), body, lang, cls: 'doc-body' }),
  });
}

function cards(items, lang, from) {
  return `<ul class="site-index">${items
    .map(
      (p) =>
        `<li><a href="${rel(from, langPath(lang, p.path))}"${en(p.title[lang], lang)}>${esc(p.title[lang])}</a>${p.blurb ? `<p${en(p.blurb, lang)}>${esc(p.blurb)}</p>` : ''}</li>`,
    )
    .join('')}</ul>`;
}

const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];
/** The official channel names (R12), from the library's own strings, for the no-JavaScript list. */
const CHANNEL_NAMES = (() => {
  const src = readFileSync(join(COMPONENTS, 'src/i18n/components/channel-names.ts'), 'utf8');
  const block = (lang) => [...src.slice(src.indexOf(`${lang}: {`)).split('}')[0].matchAll(/channel\w+: '([^']+)'/g)].map((m) => m[1]);
  return { en: block('en'), ar: block('ar') };
})();

/** A 24px icon for an sc-tile's icon slot, from the library's icon set. */
const tileIcon = (name) => `<svg slot="icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path fill="currentColor" d="${ICONS[name].d}"/></svg>`;

function renderHome(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, '');
  const href = (p) => rel(from, langPath(lang, p));
  // The headline in both scripts at the same role, the page's own language first.
  const heads = [
    ['en', 'ltr', t.heroEn],
    ['ar', 'rtl', t.heroAr],
  ];
  if (lang === 'ar') heads.reverse();
  const tile = (path, icon, text) => `<li><sc-tile href="${href(path)}">${tileIcon(icon)}${esc(text)}</sc-tile><a class="route__fallback" href="${href(path)}">${esc(text)}</a></li>`;
  const route = (id, title, text, tiles, lead) =>
    `<section class="route${lead ? ' route--lead' : ''}" aria-labelledby="${id}"><h3 id="${id}">${esc(title)}</h3><p>${esc(text)}</p><ul class="route__tiles">${tiles.join('')}</ul></section>`;
  const body = `<div class="home-hero">
<h1 id="top" class="home-title">${heads.map(([l, d, x]) => `<span lang="${l}" dir="${d}">${esc(x)}</span>`).join(' ')}</h1>
<p class="home-lede">${esc(t.heroLede)}</p>
<sc-callout class="home-draft"><span slot="heading">${esc(t.draftHeading)}</span><span>${esc(t.draftText)}</span></sc-callout>
<sc-channel-network class="home-network" channel="none" eyebrow="${esc(t.networkEyebrow)}"></sc-channel-network>
<noscript><ul class="home-network-fallback" aria-label="${esc(t.networkEyebrow)}">${CHANNEL_NAMES[lang].map((n) => `<li>${esc(n)}</li>`).join('')}</ul></noscript>
</div>
<h2 id="routes" class="home-h2">${esc(t.routesHeading)}</h2>
<div class="routes">
${route('route-service', t.routeServiceTitle, t.routeServiceText, [tile('standard/appendix-c-must-pass-list/', 'CheckCircle', t.tileMustPass), tile('standard/', 'Description', t.tileStandard)], true)}
${route('route-design', t.routeDesignTitle, t.routeDesignText, [tile('design-system/', 'Apps', t.tileComponents), tile('design-system/foundations/', 'Tune', t.tileFoundations)])}
${route('route-assess', t.routeAssessTitle, t.routeAssessText, [tile('assurance/', 'Receipt', t.tileAssurance)])}
</div>
<section class="home-lookup" aria-labelledby="lookup">
<h2 id="lookup" class="home-h2">${esc(t.lookupHeading)}</h2>
<form class="lookup" action="${href('requirements/')}" method="get" data-lookup>
<label class="lookup__label" for="lookup-id">${esc(t.lookupLabel)}</label>
<p class="lookup__hint" id="lookup-hint">${esc(t.lookupHint)}</p>
<div class="lookup__row"><input class="lookup__input" id="lookup-id" name="id" type="text" dir="ltr" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="lookup-hint"><button class="lookup__button" type="submit">${esc(t.lookupButton)}</button></div>
</form>
</section>
${lang === 'en' ? `<script>{const s=new URLSearchParams(location.search),q=s.get('page');if(q&&/^[a-z0-9-]+$/.test(q))location.replace((s.get('lang')==='ar'?'ar/':'')+(q==='foundations'?'design-system/foundations/':'components/'+q+'/')+location.hash);}</script>` : ''}`;
  // The old playground's links (?page=sc-button&lang=ar) open the component's page (script above).
  return layout(page, lang, { body });
}

function renderDsHome(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const intro = {
    en: 'The Shared Channels design system: design tokens in OKLAB, the Dubai W23 type roles, and the sc- component library. Every component works in Arabic and English, in light and dark themes, in each channel’s colours, and meets WCAG 2.2 AA.',
    ar: 'نظام تصميم القنوات المشتركة: رموز تصميمية بألوان OKLAB، وأدوار الخطوط بخط دبي W23، ومكتبة مكونات sc-‎. يعمل كل مكون بالعربية والإنجليزية، وبالمظهرين الفاتح والداكن، وبألوان كل قناة، ويستوفي WCAG 2.2 AA.',
  };
  const lede = (p) => fragmentText(p.frag, 'pg-lede', lang);
  const start = sectionPages('design-system').filter((p) => p.group === 'Get started' || p.group === 'Foundations' || p.group === 'Build and contribute');
  let body = `<h2 id="get-started">${esc(t.getStarted)}</h2>${cards(start, lang, from)}`;
  for (const g of COMPONENT_GROUPS) {
    const items = componentPages.filter((p) => p.group === g).map((p) => ({ ...p, blurb: lede(p) }));
    body += `<h2 id="${g.toLowerCase().replace(/\W+/g, '-')}">${esc(NAMES[g][lang])}</h2>${cards(items, lang, from)}`;
  }
  const headings = [{ id: 'get-started', text: t.getStarted, level: 2 }, ...COMPONENT_GROUPS.map((g) => ({ id: g.toLowerCase().replace(/\W+/g, '-'), text: NAMES[g][lang], level: 2 }))];
  return layout(page, lang, {
    body: article({ titleHtml: `<h1 id="top">${esc(page.title[lang])}</h1>`, lead: `<p class="doc-lede">${esc(intro[lang])}</p>`, tocHtml: toc(headings, lang), body, lang }),
  });
}

function renderRecordsHome(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  let body = '';
  const headings = [];
  for (const g of ['Decisions', 'Specifications', 'Reviews']) {
    const items = sectionPages('records').filter((p) => p.group === g && !p.parent);
    const id = g.toLowerCase();
    headings.push({ id, text: NAMES[g][lang], level: 2 });
    body += `<h2 id="${id}">${esc(NAMES[g][lang])}</h2>${cards(items.map((p) => ({ ...p, blurb: firstParagraph(p.doc) })), lang, from)}`;
  }
  return layout(page, lang, {
    body: article({ titleHtml: `<h1 id="top">${esc(page.title[lang])}</h1>`, lead: `<p class="doc-lede">${esc(BLURBS.records[lang])}</p>`, tocHtml: toc(headings, lang), body, lang }),
  });
}
function firstParagraph(doc) {
  const tk = doc.parsed.chunks[0].tokens;
  const i = tk.findIndex((x) => x.type === 'paragraph_open');
  const s = i >= 0 ? inlineText(tk[i + 1]) : '';
  return s.length > 220 ? `${s.slice(0, 217).replace(/\s+\S*$/, '')}…` : s;
}

function renderRequirements(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const list = [...reqs.values()].sort((a, b) => {
    const [pa, na] = a.id.split('-');
    const [pb, nb] = b.id.split('-');
    return pa.localeCompare(pb) || parseInt(na, 10) - parseInt(nb, 10) || na.localeCompare(nb);
  });
  const prefixes = [...new Set(list.map((r) => r.id.split('-')[0]))];
  const rows = list
    .map(
      (r) =>
        `<tr id="${r.id}"><th scope="row"><a href="${rel(from, langPath(lang, r.page.path))}#${r.id}">${r.id}</a></th><td${lang === 'ar' ? ' lang="en" dir="ltr"' : ''}>${esc(r.title)}</td><td><a href="${rel(from, langPath(lang, r.page.path))}"${en(r.page.title[lang], lang)}>${esc(r.page.title[lang])}</a><span class="req-doc">${esc(NAMES[r.page.section][lang])}</span></td></tr>`,
    )
    .join('');
  const jump = `<nav class="req-jump" aria-label="${lang === 'ar' ? 'الانتقال إلى البادئة' : 'Jump to a prefix'}"><ul>${prefixes.map((p) => `<li><a href="#${list.find((r) => r.id.startsWith(`${p}-`)).id}">${p}</a></li>`).join('')}</ul></nav>`;
  const body = `${jump}<div class="doc-scroll" role="region" tabindex="0" aria-label="${esc(t.requirements)}"><table class="req-table"><thead><tr><th scope="col">${esc(t.reqId)}</th><th scope="col">${esc(t.reqTitle)}</th><th scope="col">${esc(t.reqWhere)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  return layout(page, lang, {
    bodyAttrs: ' data-forward="row"',
    body: article({ titleHtml: `<h1 id="top">${esc(page.title[lang])}</h1>`, lead: `<p class="doc-lede">${esc(t.requirementsLede)} (${list.length})</p>`, body, lang }),
  });
}

function renderSearch(page, lang) {
  const t = STRINGS[lang];
  const from = langPath(lang, page.path);
  const bySection = SECTION_ORDER.map((s) => {
    const items = ORDER.get(s);
    return `<h3 id="all-${s}">${esc(NAMES[s][lang])}</h3><ul class="search-all">${items.map((p) => `<li><a href="${rel(from, langPath(lang, p.path))}"${en(p.title[lang], lang)}>${esc(p.title[lang])}</a></li>`).join('')}</ul>`;
  }).join('');
  const body = `<div class="search-form">
<sc-search label="${esc(t.searchLabel)}" placeholder="${esc(t.searchPlaceholder)}" name="q" action="./"></sc-search>
${INTERNAL ? `<label class="search-scope"><input type="checkbox" id="search-records"> <span>${esc(t.searchIncludeRecords)}</span></label>` : ''}
</div>
<noscript><p class="site-notice">${esc(t.searchNoScript)}</p></noscript>
<script>if (/[?&]q=[^&]/.test(location.search)) document.body.classList.add('is-searching');</script>
<p class="search-status" role="status" id="search-status"></p>
<ol class="search-results" id="search-results"></ol>
<div id="search-all"><h2 id="all-pages">${esc(t.allPages)}</h2>${bySection}<p><a href="${rel(from, langPath(lang, 'requirements/'))}">${esc(t.requirements)}</a></p></div>`;
  return layout(page, lang, {
    head: `<noscript><style>.search-form{display:none}</style></noscript>\n<script type="module" src="${rel(from, 'site/search.js')}"></script>\n`,
    bodyAttrs: ` data-search-root="${rel(from, '')}" data-lang-root="${rel(from, langPath(lang, ''))}"`,
    body: article({ titleHtml: `<h1 id="top">${esc(t.search)}</h1>`, body, lang }),
  });
}

/* Search index -------------------------------------------------------------------------- */
function buildIndex() {
  const pageIds = new Map();
  const index = { pages: [], entries: [], reqs: [] };
  const records = { pages: [], entries: [] };
  const pageRef = (target, p) => {
    const key = `${target === records ? 'r' : 'm'}:${p.path}`;
    if (!pageIds.has(key)) {
      pageIds.set(key, target.pages.length);
      target.pages.push([p.path, p.title.en, p.title.ar, p.section ?? '']);
    }
    return pageIds.get(key);
  };
  const clip = (s) => (s.length > 1200 ? s.slice(0, 1200) : s);
  for (const p of pages) {
    if (p.kind === 'home' || p.kind === 'search') continue;
    const target = p.section === 'records' ? records : index;
    const pi = pageRef(target, p);
    if (p.kind === 'doc') {
      const chunk = p.doc.parsed.chunks[p.chunk];
      for (const s of searchSections(chunk)) if (s.title || s.text) target.entries.push([pi, s.id && s.id !== chunk.heading?.id ? s.id : '', s.title ?? '', clip(s.text)]);
    } else if (p.kind === 'component') {
      target.entries.push([pi, '', '', [p.id, fragmentText(p.frag, 'pg-lede', 'en'), fragmentText(p.frag, 'pg-lede', 'ar')].join(' ')]);
      if (p.hasSpec) for (const s of searchSections(p.doc.parsed.chunks[0])) target.entries.push([pi, s.id ?? '', s.title ?? '', clip(s.text)]);
    } else {
      target.entries.push([pi, '', '', '']);
    }
  }
  for (const r of reqs.values()) index.reqs.push([r.id, r.title, pageRef(index, r.page)]);
  writeFileSync(join(WWW, 'site', 'search-index.json'), JSON.stringify(index));
  if (INTERNAL) writeFileSync(join(WWW, 'site', 'search-records.json'), JSON.stringify(records));
}

/* Write --------------------------------------------------------------------------------- */
const out = (path, html) => {
  html = html.replace('<!--sc-modules-->', componentModules(html.slice(html.indexOf('<body')), path));
  const dir = join(WWW, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
};

// The playground moves aside; its relative paths stay valid at the same depth.
const stencilIndex = join(WWW, 'index.html');
if (existsSync(stencilIndex) && readFileSync(stencilIndex, 'utf8').includes('playground/playground.js')) {
  cpSync(stencilIndex, join(WWW, 'playground.html'));
}
for (const d of ['ar', 'site', 'records', ...SECTION_ORDER, 'components', 'requirements', 'search', 'ux-standard']) rmSync(join(WWW, d), { recursive: true, force: true });
mkdirSync(join(WWW, 'site', 'ce'), { recursive: true });
for (const f of readdirSync(CE)) if (f.endsWith('.js')) cpSync(join(CE, f), join(WWW, 'site', 'ce', f));
// The site's own CSS and scripts ship minified, as the library's stylesheets do: comments and
// indentation go (the CSS through the library's own minifier).
const { minifyCss } = createRequire(import.meta.url)('./lib/minify-css.cjs');
const minifyJs = (js) => js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\n\s+/g, '\n').replace(/\n{2,}/g, '\n').trim();
for (const f of readdirSync(join(COMPONENTS, 'src/site'))) {
  const src = readFileSync(join(COMPONENTS, 'src/site', f), 'utf8');
  writeFileSync(join(WWW, 'site', f), f.endsWith('.css') ? minifyCss(src) : f.endsWith('.js') ? minifyJs(src) : src);
}

const RENDER = { doc: renderDocPage, component: renderComponentPage, home: renderHome, 'ds-home': renderDsHome, 'records-home': renderRecordsHome, requirements: renderRequirements, search: renderSearch };
let count = 0;
for (const p of pages) {
  for (const lang of LANGS) {
    out(langPath(lang, p.path), RENDER[p.kind](p, lang));
    count++;
  }
}
// Anchor maps for split documents: an old single-page link (standard/#A11Y-04) finds its chapter.
for (const doc of docs.values()) {
  if (!doc.cfg.split) continue;
  const map = {};
  for (const [id, ci] of doc.parsed.anchors) if (ci > 0) map[id] = doc.pages[ci].path.slice(doc.cfg.base.length);
  for (const [alias, id] of doc.parsed.aliases) {
    const ci = doc.parsed.anchors.get(alias);
    if (map[alias] !== undefined && doc.parsed.chunks[ci]?.heading?.id !== id) map[alias] = `${map[alias]}#${id}`;
  }
  for (const lang of LANGS) writeFileSync(join(WWW, langPath(lang, doc.cfg.base), 'anchors.json'), JSON.stringify(map));
}
buildIndex();

const uniq = [...new Set(warnings)];
console.log(`build-site: ${INTERNAL ? 'INTERNAL build with the project records (do not publish), ' : ''}${count} pages (${pages.length} in English and Arabic), ${reqs.size} requirement IDs${uniq.length ? `, ${uniq.length} warnings` : ''}`);
if (uniq.length) for (const w of uniq.slice(0, process.argv.includes('--verbose') ? 1000 : 25)) console.log(`  ${w}`);
if (uniq.length > 25 && !process.argv.includes('--verbose')) console.log(`  … ${uniq.length - 25} more (--verbose)`);
