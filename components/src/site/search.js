/*
 * Site search: a static index built by scripts/build-site.mjs (site/search-index.json, and
 * site/search-records.json for the project records in an internal build), fetched when the search page opens.
 * The query lives in the URL (?q=…&records=1), so a search can be linked. Without JavaScript
 * the page lists every page instead.
 *
 * Ranking: an exact requirement identifier first, then matches in page titles, headings and
 * text. Every word of the query must match.
 */
const body = document.body;
const root = body.dataset.searchRoot;
const langRoot = body.dataset.langRoot;
const ar = document.documentElement.lang === 'ar';
const field = document.querySelector('sc-search');
const records = document.getElementById('search-records');
const status = document.getElementById('search-status');
const list = document.getElementById('search-results');
const all = document.getElementById('search-all');

const T = ar
  ? {
      loading: 'جارٍ تحميل فهرس البحث…',
      failed: 'تعذّر تحميل فهرس البحث. جميع الصفحات مدرجة أدناه.',
      results: (n, q) => (n === 1 ? `نتيجة واحدة لـ«${q}»` : n === 2 ? `نتيجتان لـ«${q}»` : n <= 10 ? `${n} نتائج لـ«${q}»` : `${n} نتيجة لـ«${q}»`),
      none: (q) => `لا توجد نتائج لـ«${q}». يُرجى التحقق من الإملاء، أو البحث برمز متطلب مثل CMP-08.`,
      more: (n) => `تُعرض أول ${n} نتيجة.`,
      requirement: 'متطلب',
    }
  : {
      loading: 'Loading the search index…',
      failed: 'The search index could not be loaded. Every page is listed below.',
      results: (n, q) => (n === 1 ? `1 result for “${q}”` : `${n} results for “${q}”`),
      none: (q) => `No results for “${q}”. Check the spelling, or search for a requirement identifier such as CMP-08.`,
      more: (n) => `Showing the first ${n}.`,
      requirement: 'Requirement',
    };
const SECTIONS = ar
  ? { 'design-system': 'نظام التصميم', standard: 'معيار الخدمات', reference: 'مرجع نظام التصميم', assurance: 'دليل الضمان', records: 'سجلات المشروع' }
  : { 'design-system': 'Design system', standard: 'Service Standard', reference: 'Design System reference', assurance: 'Assurance handbook', records: 'Project records' };
const LIMIT = 50;

const cache = new Map();
const load = (file) => {
  if (!cache.has(file)) cache.set(file, fetch(`${root}site/${file}`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status)))));
  return cache.get(file);
};

/** Lowercase, without Arabic diacritics, with the hamza forms of alif folded. */
const norm = (s) => s.toLowerCase().replace(/[ً-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا');
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const REQ = /^[a-z][a-z0-9]{0,5}-\d{2,3}[a-z]?$/i;

function snippet(text, terms) {
  if (!text) return '';
  const low = norm(text);
  let at = -1;
  for (const t of terms) {
    const i = low.indexOf(t);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  const start = Math.max(0, at - 60);
  let s = escapeHtml((start ? '…' : '') + text.slice(start, start + 200) + (text.length > start + 200 ? '…' : ''));
  for (const t of terms) if (t.length > 1) s = s.replace(new RegExp(`(${escapeRe(escapeHtml(t))})`, 'gi'), '<mark>$1</mark>');
  return s;
}

function search(index, q) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits = [];
  const seen = new Set();
  if (index.reqs && REQ.test(q.trim())) {
    for (const [id, title, pi] of index.reqs) {
      if (id.toLowerCase() !== q.trim().toLowerCase()) continue;
      const url = `${index.pages[pi][0]}#${id}`;
      seen.add(url);
      hits.push({ score: 1e6, url, title: `${id}. ${title}`, where: [T.requirement, index.pages[pi][ar ? 2 : 1]], text: '' });
    }
  }
  for (const [pi, anchor, heading, text] of index.entries) {
    const [path, en, arTitle, section] = index.pages[pi];
    const title = norm(`${en} ${arTitle}`);
    const head = norm(heading);
    const low = norm(text);
    let score = 0;
    for (const t of terms) {
      const s = (title.includes(t) ? 20 : 0) + (head.includes(t) ? 8 : 0) + (low.includes(t) ? Math.min(5, low.split(t).length - 1) : 0);
      if (!s) {
        score = 0;
        break;
      }
      score += s;
    }
    if (!score) continue;
    const url = anchor ? `${path}#${anchor}` : path;
    if (seen.has(url)) continue;
    seen.add(url);
    const pageTitle = ar ? arTitle : en;
    const sub = heading && heading !== en;
    hits.push({ score: score + (anchor ? 0 : 3), url, title: sub ? heading : pageTitle, where: [SECTIONS[section] ?? '', sub ? pageTitle : ''].filter(Boolean), text: snippet(text, terms) });
  }
  return hits;
}

async function run(write = true) {
  const q = (field.value ?? '').trim();
  if (write) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (records?.checked) params.set('records', '1');
    history.replaceState(null, '', params.size ? `?${params}` : location.pathname);
  }
  list.replaceChildren();
  all.hidden = !!q;
  if (!q) {
    status.textContent = '';
    return;
  }
  status.textContent = T.loading;
  let hits;
  try {
    const indexes = [await load('search-index.json')];
    if (records?.checked) indexes.push(await load('search-records.json'));
    hits = indexes.flatMap((ix) => search(ix, q)).sort((a, b) => b.score - a.score);
  } catch {
    status.textContent = T.failed;
    all.hidden = false;
    return;
  }
  status.textContent = hits.length ? T.results(hits.length, q) + (hits.length > LIMIT ? ` ${T.more(LIMIT)}` : '') : T.none(q);
  // Titles and snippets are the documents' English text.
  const en = ar ? ' lang="en" dir="ltr"' : '';
  list.innerHTML = hits
    .slice(0, LIMIT)
    .map(
      (h) =>
        `<li><a href="${langRoot}${h.url}"${/[\u0600-\u06FF]/.test(h.title) ? '' : en}>${escapeHtml(h.title)}</a><p class="search-where">${escapeHtml(h.where.join(' · '))}</p>` +
        (h.text ? `<p class="search-snippet"${en}>${h.text}</p>` : '') +
        '</li>',
    )
    .join('');
}

const params = new URLSearchParams(location.search);
if (records) records.checked = params.get('records') === '1';
await customElements.whenDefined('sc-search');
field.value = params.get('q') ?? '';
field.addEventListener('scSearch', (e) => {
  e.preventDefault();
  run();
});
records?.addEventListener('change', () => run());
run(false);
