#!/usr/bin/env node
/**
 * Fails if the default build of www/ (what GitHub Pages publishes) contains anything that
 * must not be public (decision R3): the Dubai Design System teal (006A67), the word "teal",
 * a credit to an individual for the motion rules ("Kowalski") anywhere but the Design System
 * reference's bibliography and acknowledgements, where R3 puts it, or the project records,
 * which only an internal build (SC_SITE_INTERNAL=1) includes.
 *
 *   npm run build && npm run check:site-publishable
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const www = join(dirname(fileURLToPath(import.meta.url)), '..', 'www');
const BANNED = /006a67|\bteal\b|kowalski/gi;
/** The one place the motion source is credited (R3). */
const CREDITS = 'reference/bibliography-and-acknowledgements/';
const allowed = (file, word) => /^kowalski$/i.test(word) && file.replace(/^ar\//, '').startsWith(CREDITS);
const found = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js|css|json|txt|xml|md|svg)$/.test(f)) {
      let text = readFileSync(p, 'utf8');
      const file = relative(www, p);
      // The search index holds every page's text: leave out the credits page's own entries.
      if (file === join('site', 'search-index.json')) {
        const ix = JSON.parse(text);
        text = JSON.stringify({ ...ix, entries: ix.entries.filter(([pi]) => ix.pages[pi][0] !== CREDITS) });
      }
      for (const m of text.matchAll(BANNED)) if (!allowed(file, m[0])) found.push(`${relative(www, p)}: “${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}”`);
    }
  }
};
walk(www);
for (const p of ['records', 'ar/records', 'site/search-records.json']) if (existsSync(join(www, p))) found.push(`${p}: the project records are in the build (an internal build is not publishable)`);
console.log(`check-site-publishable: ${found.length ? `${found.length} problems` : 'nothing internal in www/'}`);
for (const f of found.slice(0, 40)) console.log(`  ${f}`);
process.exit(found.length ? 1 : 0);
