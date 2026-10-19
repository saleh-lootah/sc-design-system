/*
 * Playground shell. State lives in the URL so any view can be linked or screenshotted:
 *   ?page=sc-button&lang=ar&theme=dark&channel=transport
 *
 * - lang  sets lang + dir on the preview root (#preview); the shell chrome stays English.
 * - theme sets data-theme on <html> (omit it to follow the system setting).
 * - channel sets data-channel on the preview root.
 *
 * Page bodies are fragments in pages/<id>.html, listed in registry.js. Inside a page:
 * - data-ar="…" on a text-only element swaps its text when the preview is Arabic;
 * - <script> tags run after the fragment is inserted (scope your code in a block);
 * - data-demo-focus on an element focuses it once the page has rendered.
 */
const GROUPS = ['Foundations', 'Actions and navigation', 'Form fields', 'Feedback and status', 'Content and layout'];
const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];

const pages = (window.scPlaygroundPages || []).slice();
const preview = document.getElementById('preview');
const nav = document.getElementById('pg-nav');
const channelSelect = document.getElementById('pg-channel');

function readState() {
  const q = new URLSearchParams(location.search);
  const page = pages.some((p) => p.id === q.get('page')) ? q.get('page') : pages[0]?.id;
  return {
    page,
    lang: q.get('lang') === 'ar' ? 'ar' : 'en',
    theme: ['light', 'dark'].includes(q.get('theme')) ? q.get('theme') : null,
    channel: CHANNELS.includes(q.get('channel')) ? q.get('channel') : 'now',
  };
}

let state = readState();

function writeState(next) {
  state = { ...state, ...next };
  const q = new URLSearchParams();
  q.set('page', state.page);
  if (state.lang !== 'en') q.set('lang', state.lang);
  if (state.theme) q.set('theme', state.theme);
  if (state.channel !== 'now') q.set('channel', state.channel);
  history.replaceState(null, '', `?${q}`);
}

function effectiveTheme() {
  return state.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyLang() {
  preview.lang = state.lang;
  preview.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  for (const el of preview.querySelectorAll('[data-ar]')) {
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent.trim());
    el.textContent = state.lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  }
}

function applyChrome() {
  if (state.theme) document.documentElement.dataset.theme = state.theme;
  else delete document.documentElement.dataset.theme;
  preview.dataset.channel = state.channel;
  channelSelect.value = state.channel;
  const theme = effectiveTheme();
  for (const b of document.querySelectorAll('[data-set]')) {
    const current = b.dataset.set === 'lang' ? state.lang : theme;
    b.setAttribute('aria-pressed', String(b.dataset.value === current));
  }
  for (const a of nav.querySelectorAll('a')) {
    if (a.dataset.page === state.page) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

function hrefFor(id) {
  const q = new URLSearchParams(location.search);
  q.set('page', id);
  return `?${q}`;
}

function renderNav() {
  const groups = [...new Set([...GROUPS, ...pages.map((p) => p.group)])];
  nav.innerHTML = '';
  for (const group of groups) {
    const items = pages.filter((p) => p.group === group).sort((a, b) => a.title.localeCompare(b.title));
    if (!items.length) continue;
    const h = document.createElement('h2');
    h.className = 'pg-nav__group';
    h.textContent = group;
    const ul = document.createElement('ul');
    for (const p of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = hrefFor(p.id);
      a.dataset.page = p.id;
      a.textContent = p.title;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        writeState({ page: p.id });
        loadPage();
      });
      li.append(a);
      ul.append(li);
    }
    nav.append(h, ul);
  }
}

async function loadPage() {
  applyChrome();
  const page = pages.find((p) => p.id === state.page);
  if (!page) {
    preview.innerHTML = '<p class="pg-note">No pages registered.</p>';
    return;
  }
  document.title = `${page.title} · Shared Channels components`;
  try {
    const res = await fetch(`playground/pages/${page.id}.html`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    preview.innerHTML = await res.text();
  } catch (err) {
    preview.innerHTML = `<p class="pg-note">Couldn't load pages/${page.id}.html (${err.message}).</p>`;
    return;
  }
  // Scripts inserted with innerHTML don't run; re-create them so they do.
  for (const old of preview.querySelectorAll('script')) {
    const s = document.createElement('script');
    for (const attr of old.attributes) s.setAttribute(attr.name, attr.value);
    s.textContent = old.textContent;
    old.replaceWith(s);
  }
  applyLang();
  const focusTarget = preview.querySelector('[data-demo-focus]');
  if (focusTarget) {
    await customElements.whenDefined(focusTarget.localName).catch(() => {});
    await focusTarget.componentOnReady?.();
    focusTarget.focus();
  }
}

for (const b of document.querySelectorAll('[data-set]')) {
  b.addEventListener('click', () => {
    writeState({ [b.dataset.set]: b.dataset.value });
    applyChrome();
    if (b.dataset.set === 'lang') applyLang();
  });
}
channelSelect.addEventListener('change', () => {
  writeState({ channel: channelSelect.value });
  applyChrome();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyChrome);

writeState({});
renderNav();
loadPage();
