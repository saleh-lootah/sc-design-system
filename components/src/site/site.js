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
  const id = decodeURIComponent(location.hash.slice(1));
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
