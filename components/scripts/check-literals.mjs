#!/usr/bin/env node
/**
 * Fails if component CSS or TSX contains a colour literal or a raw font size.
 *
 * Scans src/components/**\/*.{css,tsx} (comments are ignored) for:
 *   - hex colours            #fff, #1a2b3c, #1a2b3c80
 *   - rgb()/rgba()/hsl()/hsla() colours
 *   - raw font sizes         font-size: 16px | 1rem | 12pt | 1.2em, `font:` shorthands with a size,
 *                            fontSize: 16 / '16px' in style objects
 * Use var(--sc-…) tokens or the type roles in src/styles/type/ instead.
 * System colour keywords (ButtonText, Highlight, …) for forced-colors are allowed.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scanDir = join(root, 'src', 'components');

const RULES = [
  { name: 'hex colour', re: /(?<![\w&$-])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi },
  { name: 'rgb()/hsl() colour', re: /\b(?:rgba?|hsla?)\s*\(/gi },
  { name: 'raw font-size', re: /font-size\s*:\s*-?[\d.]+(?:px|rem|em|pt)\b/gi },
  { name: 'raw font shorthand size', re: /\bfont\s*:[^;{}]*?\b[\d.]+(?:px|rem|pt)\b/gi },
  { name: 'raw fontSize', re: /\bfontSize\s*:\s*['"`]?-?[\d.]+(?:px|rem|em|pt)?['"`]?/g },
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Blanks out comments but keeps line numbers. */
function stripComments(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, pre) => pre + blank(m.slice(pre.length)));
}

const files = walk(scanDir).filter((f) => /\.(css|tsx)$/.test(f));
const problems = [];

for (const file of files) {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    for (const { name, re } of RULES) {
      re.lastIndex = 0;
      for (const m of line.matchAll(re)) {
        problems.push(`${relative(root, file)}:${i + 1}:${m.index + 1}  ${name}: ${m[0].trim()}`);
      }
    }
  });
}

if (problems.length) {
  console.error(`check-literals: ${problems.length} problem(s). Use var(--sc-…) tokens or src/styles/type/ roles.\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-literals: ${files.length} files clean (no colour literals or raw font sizes).`);
