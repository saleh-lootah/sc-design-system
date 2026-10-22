/*
 * Documentation site enhancements. Every page works without this file.
 *
 * - The side menu and the on-page contents are open on wide screens and closed on narrow
 *   ones (an inline script sets the first state before paint; this keeps it in step on resize).
 * - Old links keep working: on a split document's overview page, an anchor that now lives in a
 *   chapter (standard/#A11Y-04) forwards to it, using that document's anchors.json; on the
 *   requirement index and the earlier single-document page, an anchor forwards to the link in
 *   its row.
 */
const wide = [
  ['.site-menu[data-wide-open]', '(min-width: 1024px)'],
  ['.doc-toc[data-wide-open]', '(min-width: 1280px)'],
];
for (const [selector, query] of wide) {
  const el = document.querySelector(selector);
  if (!el) continue;
  matchMedia(query).addEventListener('change', (e) => {
    el.open = e.matches;
  });
}

async function forward() {
  // The home page's lookup form sends ?id= when it runs without this script's help.
  const asked = new URLSearchParams(location.search).get('id');
  const id = decodeURIComponent(location.hash.slice(1)) || (asked ?? '').trim().toUpperCase();
  if (!id) return;
  const mode = document.body.dataset;
  const target = document.getElementById(id);
  if (mode.forward === 'row' && target) {
    const link = (target.closest('tr') ?? target).querySelector('a[href]:not([href^="#"])');
    if (link) location.replace(link.href);
    return;
  }
  if (mode.anchors && !target) {
    try {
      const map = await (await fetch(mode.anchors)).json();
      const to = map[id];
      if (to !== undefined) location.replace(to.includes('#') ? to : `${to}#${id}`);
    } catch {
      /* Stay on the overview: its contents link to every chapter. */
    }
  }
}
forward();
addEventListener('hashchange', forward);

/*
 * Component pages: the channel switcher above the examples re-themes them in place. Its links
 * carry ?channel= (so without this script they reload the page); here its scChannelChange
 * event sets data-channel on the examples instead, and the URL keeps the choice.
 */
const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];
const preview = document.getElementById('preview');
const switcher = document.querySelector('.examples-bar sc-channel-switcher');
if (preview && switcher) {
  const asked = new URLSearchParams(location.search).get('channel');
  if (CHANNELS.includes(asked)) {
    preview.dataset.channel = asked;
    switcher.setAttribute('value', asked);
  }
  switcher.addEventListener('scChannelChange', (e) => {
    const { channel } = e.detail;
    e.preventDefault();
    preview.dataset.channel = channel;
    history.replaceState(null, '', `?channel=${channel}${location.hash}`);
  });
}

/*
 * Home: the requirement lookup. Without this script the form opens the requirement index;
 * with it, the identifier's definition opens directly (the index forwards #ID to it).
 */
const lookup = document.querySelector('form[data-lookup]');
lookup?.addEventListener('submit', (e) => {
  const id = lookup.elements.id.value.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[A-Z][A-Z0-9]{0,5}-\d{2,3}[A-Z]?$/.test(id)) return;
  e.preventDefault();
  location.href = `${lookup.getAttribute('action')}#${id}`;
});
