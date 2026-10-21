/**
 * Comment and whitespace removal for component stylesheets, run by the `minify-component-css`
 * plugin in stencil.config.ts before Stencil scopes and bundles each sheet.
 *
 * Why: Stencil minifies component CSS with its own parser, which gives up on any at-rule nested
 * inside a block (`@layer sc.components { @media … { … } }`). When it gives up it ships the
 * sheet with all its indentation (it still strips comments). Every light-DOM component nests
 * its `@media (forced-colors)` and hover rules inside `@layer sc.components` (W12), so 16
 * source sheets went out unminified. This pass is the one in scripts/build-sc-css.mjs, except
 * that string literals are left untouched.
 */
'use strict';

function minifyPlain(css) {
  return css
    .replace(/:\s*;/g, ':\u0000;') // an empty custom property ("--x: ;", a space toggle) keeps its space
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+(?=[^;{}]*;)/g, ':') // "prop: value;" -> "prop:value;" (never matches selectors)
    .replace(/;}/g, '}')
    .replace(/\u0000/g, ' ');
}

/** Minifies `css`, leaving the contents of '…' and "…" strings exactly as written. */
function minifyCss(css) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const parts = noComments.split(/("(?:[^"\\\n]|\\[\s\S])*"|'(?:[^'\\\n]|\\[\s\S])*')/);
  // Odd indexes are strings. Minify the code between them; a separator placeholder keeps the
  // regexes from seeing across a string.
  const strings = [];
  const code = parts.map((p, i) => (i % 2 ? `\u0001${strings.push(p) - 1}\u0001` : p)).join('');
  return minifyPlain(code)
    .replace(/\u0001(\d+)\u0001/g, (_, n) => strings[Number(n)])
    .trim();
}

module.exports = { minifyCss };
