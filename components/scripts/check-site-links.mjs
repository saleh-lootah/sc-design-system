#!/usr/bin/env node
/**
 * Checks every link in the built documentation site (www/, after `npm run build`): each
 * relative URL must name a file that exists, and each #fragment an id on that page.
 * External links, the playground and the component examples (whose links are placeholders)
 * are not checked. Exit 1 on any broken link.
 *
 *   npm run check:site
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const www = join(dirname(fileURLToPath(import.meta.url)), '..', 'www');
const pages = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      if (!['build', 'playground', 'assets', 'site'].includes(f) || d !== www) walk(p);
    } else if (f === 'index.html' && !(d === www)) pages.push(p);
  }
};
walk(www);
pages.push(join(www, 'index.html'));
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))));
  return ids.get(file);
};
const broken = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8').replace(/<div id="preview" class="demo"[\s\S]*?(?=<section class="doc-part"|<\/main>)/, '');
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('playground.html') || href.includes('playground.html')) continue;
    const [path, frag] = href.split('#');
    let target = path ? join(dirname(page), path.split('?')[0]) : page;
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) {
      broken.push(`${relative(www, page)}: ${href} (no file)`);
      continue;
    }
    if (frag && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(frag))) broken.push(`${relative(www, page)}: ${href} (no #${frag})`);
  }
}
const uniq = [...new Set(broken)];
console.log(`check-site-links: ${pages.length} pages, ${uniq.length} broken links`);
for (const b of uniq.slice(0, 60)) console.log(`  ${b}`);
process.exit(uniq.length ? 1 : 0);
