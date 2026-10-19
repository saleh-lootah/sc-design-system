#!/usr/bin/env node
// Fails if dist/css or dist/tailwind contain a hex colour. Web outputs must stay OKLAB.
// Run after the build: node scripts/check-no-hex.mjs
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIST_DIR, ROOT } from './lib/tokens.mjs';

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;

function files(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

const targets = [...files(join(DIST_DIR, 'css')), ...files(join(DIST_DIR, 'tailwind'))];
if (!targets.length) {
  console.error('check:no-hex: nothing to check. Run the build first.');
  process.exit(1);
}

let hits = 0;
for (const file of targets) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(HEX)) {
      hits++;
      console.error(`FAIL ${relative(ROOT, file)}:${i + 1}: ${m[0]}`);
    }
  });
}

if (hits) {
  console.error(`check:no-hex failed: ${hits} hex colour(s) found`);
  process.exit(1);
}
console.log(`check:no-hex passed (${targets.length} files)`);
