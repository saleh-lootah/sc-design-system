#!/usr/bin/env node
/**
 * Fails if component CSS or TSX contains a colour literal or a raw font size.
 *
 * Scans src/components/**\/*.{css,tsx} (comments are ignored) for:
 *   - hex colours            #fff, #1a2b3c, #1a2b3c80
 *   - rgb()/rgba()/hsl()/hsla() colours
 *   - raw font sizes         font-size: 16px | 1rem | 12pt | 1.2em, `font:` shorthands with a size,
 *                            fontSize: 16 / '16px' in style objects
 * Use var(--sc-…) tokens and the type roles (font: var(--sc-type-<role>)) instead.
 * System colour keywords (ButtonText, Highlight, …) for forced-colors are allowed.
 *
 * v2 structure rules (architecture §3.2, §3.6):
 *   - no @import in component CSS: shared helpers come from the adopted sheet / sc.css
 *   - no import of i18n/components/index (it bundles every component's strings)
 *   - no import of the legacy i18n/locale or i18n/strings, except by the v1 components
 *     still listed in V1_PENDING below. Family agents delete their tags from the list when
 *     they rebuild them; the list must be empty by the end of Wave 2b.
 *   - every scoped (light-DOM) component's CSS starts with the full cascade layer order,
 *     `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;` (decision W12):
 *     Stencil can insert a component's styles before sc.css, and without it the base focus
 *     outline outranks component rules
 * src/global/*.css (except the generated files) is checked for literals too.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scanDir = join(root, 'src', 'components');
const globalDir = join(root, 'src', 'global');

/** v1 components not yet rebuilt: allowed the legacy i18n imports and the field.css/choice.css @imports. */
const V1_PENDING = new Set([

]);
const STRUCTURE = [
  { name: '@import in component CSS (use the shared sheet, sc.css or your own rules)', re: /@import\b/g, ext: '.css', legacyOk: true },
  { name: 'import of i18n/components/index (import your own strings file)', re: /from\s+['"][./]*i18n\/components(\/index)?['"]/g, ext: '.tsx' },
  { name: 'legacy i18n import (use i18n/controller and i18n/components/<tag>)', re: /from\s+['"][./]*i18n\/(locale|strings)['"]/g, ext: '.tsx', legacyOk: true },
];
const tagOf = (file) => relative(scanDir, file).split('/')[0];

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

const files = [
  ...walk(scanDir).filter((f) => /\.(css|tsx)$/.test(f)),
  ...walk(globalDir).filter((f) => f.endsWith('.css') && !f.includes('/generated/') && !f.endsWith('fonts.css')),
];
const problems = [];

for (const file of files.filter((f) => f.startsWith(scanDir))) {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  for (const { name, re, ext, legacyOk } of STRUCTURE) {
    if (!file.endsWith(ext) || (legacyOk && V1_PENDING.has(tagOf(file)))) continue;
    lines.forEach((line, i) => {
      re.lastIndex = 0;
      for (const m of line.matchAll(re)) problems.push(`${relative(root, file)}:${i + 1}:${m.index + 1}  ${name}: ${m[0].trim()}`);
    });
  }
}

// W12: a scoped component's stylesheet must declare the full layer order before its first rule.
const LAYER_ORDER = '@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;';
for (const tsx of files.filter((f) => f.endsWith('.tsx'))) {
  const tag = tagOf(tsx);
  if (tsx !== join(scanDir, tag, `${tag}.tsx`) || V1_PENDING.has(tag)) continue;
  if (!/\bscoped\s*:\s*true\b/.test(stripComments(readFileSync(tsx, 'utf8')))) continue;
  const css = join(scanDir, tag, `${tag}.css`);
  const body = stripComments(readFileSync(css, 'utf8')).trim();
  if (!body.startsWith(LAYER_ORDER)) problems.push(`${relative(root, css)}:1:1  missing cascade layer order (W12): start the file with ${LAYER_ORDER}`);
}

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
  console.error(`check-literals: ${problems.length} problem(s). Use var(--sc-…) tokens and type roles; see CONVENTIONS.md.\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-literals: ${files.length} files clean (no colour literals or raw font sizes).`);
