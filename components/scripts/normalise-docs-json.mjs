#!/usr/bin/env node
/**
 * Makes docs/components.json (Stencil's docs-json output) the same on every machine and in
 * every worktree, so a build that changes no API leaves it untouched in git:
 *
 *   - absolute paths ("/Users/…/components/src/…") become relative to components/ ("src/…");
 *   - when nothing but the timestamp differs from the committed file, the committed timestamp
 *     is kept.
 *
 * Run by `npm run build` (postbuild), before the site build reads the file.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'docs', 'components.json');
const prefix = `${root}/`;

const json = JSON.parse(readFileSync(file, 'utf8'));
const relative = (value) => {
  if (typeof value === 'string') return value.startsWith(prefix) ? value.slice(prefix.length) : value;
  if (Array.isArray(value)) return value.map(relative);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, relative(v)]));
  return value;
};
const docs = relative(json);

let committed;
try {
  committed = JSON.parse(execFileSync('git', ['show', 'HEAD:./docs/components.json'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }));
} catch {
  /* not a git checkout, or the file is new: keep the fresh timestamp */
}
if (committed && JSON.stringify({ ...committed, timestamp: '' }) === JSON.stringify({ ...docs, timestamp: '' })) docs.timestamp = committed.timestamp;

writeFileSync(file, `${JSON.stringify(docs, null, 2)}\n`);
