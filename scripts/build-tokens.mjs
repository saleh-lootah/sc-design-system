#!/usr/bin/env node
// Generates every platform output in dist/ from tokens/*.json.
// Plain Node (ESM), no dependencies. Run: node scripts/build-tokens.mjs
//
// Web naming scheme (see docs/v2/foundations.md, "Token naming"):
//   --sc-color-<role>            colour roles, light and dark in one value via light-dark()
//   --sc-color-channel-<role>    the active channel's roles, rebound by [data-channel]
//   --sc-palette-<name>-<tone>   raw tonal palettes, only in dist/css/palette.css
//   --sc-type-<role>-<prop>      type roles; Arabic values rebound by [lang|="ar"]
//   --sc-space-<n>, --sc-radius-<name>, --sc-size-<name>, --sc-elevation-<n>,
//   --sc-opacity-<name>, --sc-duration-<name>, --sc-easing-<name>, --sc-scale-<name>,
//   --sc-breakpoint-<name>, --sc-grid-<bp>-<prop>, --sc-container-<name>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadTokens, group, CHANNELS, CHANNEL_ROLES, DEFAULT_CHANNEL, DIST_DIR, ROOT } from './lib/tokens.mjs';
import { toSrgb01, inGamut } from './lib/oklab.mjs';

const HEADER = 'Generated — edit tokens/source/*.json or tokens/*.json, then npm run build';
const tokens = loadTokens();
const { light } = tokens;

// Real PostScript names, read from the name tables (nameID 6) of
// ~/Library/Fonts/DubaiW23-*.ttf. Each weight ships as its own family.
const POSTSCRIPT = {
  'Dubai W23 Light': 'DubaiW23-Light',
  'Dubai W23 Regular': 'DubaiW23-Regular',
  'Dubai W23 Medium': 'DubaiW23-Medium',
  'Dubai W23 Bold': 'DubaiW23-Bold',
};

// ---------------------------------------------------------------- token groups

const palette = light.filter((t) => t.path[0] === 'palette');
const roles = light.filter((t) => t.path[0] === 'color' && t.path[1] !== 'channel');
const channelOf = (ch) => light.filter((t) => t.path[0] === 'channel' && t.path[1] === ch);
const darkOf = (t) => tokens.getDark(t.path.join('.')) ?? t;
const space = group(light, 'space');
const radius = group(light, 'radius');
const size = group(light, 'size');
const elevation = group(light, 'elevation');
const opacity = group(light, 'opacity');
const duration = group(light, 'duration');
const easing = group(light, 'easing');
const scale = group(light, 'scale');
const breakpoint = group(light, 'breakpoint');
const grid = group(light, 'grid');
const container = group(light, 'container');
const families = light.filter((t) => t.path[0] === 'font' && t.path[1] === 'family');
const weights = light.filter((t) => t.path[0] === 'font' && t.path[1] === 'weight');
const typeOf = (script) => light.filter((t) => t.path[0] === 'type' && t.path[1] === script);
const en = typeOf('en');
const ar = typeOf('ar');
const arOf = (role) => ar.find((t) => t.path[2] === role);
if (en.length !== ar.length || en.some((t) => !arOf(t.path[2]))) throw new Error('Every English type role needs an Arabic counterpart');

// ---------------------------------------------------------------- helpers

const cssVar = (path) => `--sc-${path.join('-')}`;
const roleVar = (t) => `--sc-color-${t.path.slice(1).join('-')}`;
const dim = (v) => `${v.value}${v.unit}`;
const px = (v) => {
  if (v.unit !== 'px') throw new Error(`Expected px, got ${v.unit}`);
  return v.value;
};

/** oklab(L a b) or oklab(L a b / alpha), numbers exactly as authored. */
function oklab(c) {
  if (c.colorSpace !== 'oklab') throw new Error(`Expected oklab colour, got ${c.colorSpace}`);
  const [L, a, b] = c.components;
  const alpha = c.alpha ?? 1;
  return `oklab(${L} ${a} ${b}${alpha < 1 ? ` / ${alpha}` : ''})`;
}
const same = (a, b) => oklab(a) === oklab(b);
/** One CSS value for both modes. */
const lightDark = (t) => {
  const d = darkOf(t);
  return same(t.value, d.value) ? oklab(t.value) : `light-dark(${oklab(t.value)}, ${oklab(d.value)})`;
};

/** sRGB 0..1 components for native platforms. Out-of-gamut values are clamped (none are expected). */
const clamped = new Set();
function srgb(c) {
  const [L, a, b] = c.components;
  if (!inGamut(L, a, b)) clamped.add(oklab(c));
  return [...toSrgb01(L, a, b).map((x) => Number(x.toFixed(4))), c.alpha ?? 1];
}

const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif']);
const fontStack = (list) => list.map((f) => (GENERIC.has(f) ? f : `"${f}"`)).join(', ');
const shadow = (layers) =>
  layers.length ? layers.map((s) => `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} ${oklab(s.color)}`).join(', ') : 'none';
const cubic = (v) => `cubic-bezier(${v.join(', ')})`;
const pct = (n) => `${Number((n * 100).toFixed(2))}%`;
const familyKey = (t) => t.ref.fontFamily.replace(/^\{font\.family\.(.+)\}$/, '$1');
const weightKey = (t) => t.ref.fontWeight.replace(/^\{font\.weight\.(.+)\}$/, '$1');
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

function write(rel, content) {
  const file = join(DIST_DIR, rel);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, content.replace(/[ \t]+$/gm, ''));
  console.log(`  wrote ${relative(ROOT, file)} (${content.split('\n').length - 1} lines, ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
}

// ---------------------------------------------------------------- CSS

function typeDecls(t, decl) {
  const role = t.path[2];
  decl(`--sc-type-${role}-family`, `var(--sc-font-family-${familyKey(t)})`);
  decl(`--sc-type-${role}-weight`, `var(--sc-font-weight-${weightKey(t)})`);
  decl(`--sc-type-${role}-size`, dim(t.value.fontSize));
  decl(`--sc-type-${role}-leading`, `${t.extensions.lineHeightPx}px`);
  decl(`--sc-type-${role}-tracking`, t.value.letterSpacing.value === 0 ? '0' : dim(t.value.letterSpacing));
}

function buildCss() {
  const L = [];
  const decl = (name, value, comment) => L.push(`  ${name}: ${value};${comment ? ` /* ${comment} */` : ''}`);
  const section = (title) => L.push('', `  /* ${title} */`);

  L.push(`/* ${HEADER} */`, '');
  L.push('/* Light and dark live in one value: light-dark(<light>, <dark>). The scheme follows the');
  L.push('   system, and data-theme="light" or "dark" on any element forces it for that subtree. */');
  L.push(':root {', '  color-scheme: light dark;');

  section('Colour roles');
  for (const t of roles) decl(roleVar(t), lightDark(t), t.description);
  section('State layers: color-mix(in oklab, <content colour> var(--sc-opacity-hover), transparent)');
  for (const t of opacity) decl(cssVar(t.path), pct(t.value), t.description);

  section('Font');
  for (const t of families) decl(cssVar(t.path), fontStack(t.value));
  for (const t of weights) decl(cssVar(t.path), t.value);

  section('Space');
  for (const t of space) decl(cssVar(t.path), dim(t.value));
  section('Radius');
  for (const t of radius) decl(cssVar(t.path), dim(t.value), t.description);
  section('Size');
  for (const t of size) decl(cssVar(t.path), dim(t.value), t.description);
  section('Elevation');
  for (const t of elevation) decl(cssVar(t.path), shadow(t.value), t.description);
  section('Motion');
  for (const t of duration) decl(cssVar(t.path), dim(t.value), t.description);
  for (const t of easing) decl(cssVar(t.path), cubic(t.value), t.description);
  for (const t of scale) decl(cssVar(t.path), t.value, t.description);
  section('Layout (breakpoints cannot be used inside @media; they are here for reference and scripts)');
  for (const t of breakpoint) decl(cssVar(t.path), dim(t.value), t.description);
  for (const t of grid) decl(cssVar(t.path), typeof t.value === 'number' ? t.value : dim(t.value));
  for (const t of container) decl(cssVar(t.path), dim(t.value), t.description);
  L.push('}', '');

  L.push('[data-theme="light"] { color-scheme: light; }', '[data-theme="dark"] { color-scheme: dark; }', '');

  L.push('/* Channel roles. The default channel applies at the root; data-channel on any element');
  L.push('   rebinds the roles for that subtree (a whole page, or one attribution chip). */');
  for (const ch of CHANNELS) {
    L.push(`${ch === DEFAULT_CHANNEL ? ':root, ' : ''}[data-channel="${ch}"] {`);
    for (const t of channelOf(ch)) decl(`--sc-color-channel-${t.path[2]}`, lightDark(t));
    L.push('}');
  }
  L.push('');

  L.push('/* Type roles. English (and any non-Arabic language) by default; elements with lang="ar"');
  L.push('   get the Arabic scale, and lang="en" inside Arabic switches back. Components only ever');
  L.push('   read --sc-type-<role>-*, so they never branch on script. */');
  L.push(':root, [lang]:not([lang|="ar"]) {');
  for (const t of en) typeDecls(t, decl);
  L.push('}', '[lang|="ar"] {');
  for (const t of en) typeDecls(arOf(t.path[2]), decl);
  L.push('}', '');

  // Reduced motion: movement stops, opacity and colour keep their timing.
  L.push('/* Reduced motion: movement stops (spin, scale); opacity and colour transitions keep their durations */');
  L.push('@media (prefers-reduced-motion: reduce) {', '  :root {');
  for (const t of [...duration, ...scale]) {
    const rm = t.extensions?.reducedMotion;
    if (rm === undefined) continue;
    L.push(`    ${cssVar(t.path)}: ${typeof rm === 'object' ? dim(rm) : rm};`);
  }
  L.push('  }', '}', '');

  L.push('/* Type classes for page markup. Script-aware through the variables above. */');
  for (const t of en) {
    const r = t.path[2];
    L.push(`.sc-type-${r} {`);
    L.push(`  font-family: var(--sc-type-${r}-family);`);
    L.push(`  font-weight: var(--sc-type-${r}-weight);`);
    L.push(`  font-size: var(--sc-type-${r}-size);`);
    L.push(`  line-height: var(--sc-type-${r}-leading);`);
    L.push(`  letter-spacing: var(--sc-type-${r}-tracking);`);
    L.push('}');
  }
  return L.join('\n') + '\n';
}

function buildPaletteCss() {
  const L = [`/* ${HEADER} */`, '/* Raw tonal palettes, for documentation and tooling only. Components use the roles in tokens.css. */', ':root {'];
  for (const t of palette) L.push(`  --sc-palette-${t.path[1]}-${t.path[2]}: ${oklab(t.value)};`);
  L.push('}');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- Tailwind v4

function buildTailwind() {
  const L = [];
  const decl = (name, value) => L.push(`  ${name}: ${value};`);
  L.push(`/* ${HEADER} */`);
  L.push('/* Tailwind v4 theme. Values point at the --sc-* custom properties in tokens.css,');
  L.push('   so dark mode, data-channel and Arabic type keep working. "inline" makes utilities');
  L.push('   use var(--sc-*) directly. */');
  L.push('@import "../css/tokens.css";', '');
  L.push('@theme inline {');
  L.push("  /* Only design-system colours: Tailwind's default palette is removed. */");
  decl('--color-*', 'initial');
  for (const t of roles) decl(`--color-${t.path.slice(1).join('-')}`, `var(${roleVar(t)})`);
  for (const role of CHANNEL_ROLES) decl(`--color-channel-${role}`, `var(--sc-color-channel-${role})`);
  L.push('', '  /* Spacing: 1 unit = 1px, so p-16 is 16px, matching --sc-space-16. */');
  decl('--spacing', '1px');
  for (const t of space) decl(`--spacing-${t.path[1]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Radius */');
  decl('--radius-*', 'initial');
  for (const t of radius) decl(`--radius-${t.path[1]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Shadows */');
  decl('--shadow-*', 'initial');
  for (const t of elevation) decl(`--shadow-${t.path[1]}`, t.value.length ? `var(${cssVar(t.path)})` : '0 0 transparent');
  L.push('', '  /* Fonts */');
  decl('--font-sans', 'var(--sc-font-family-regular)');
  for (const t of families) decl(`--font-${t.path[2]}`, `var(${cssVar(t.path)})`);
  for (const t of weights) decl(`--font-weight-${t.path[2]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Type roles: text-<role>. Arabic sizes apply automatically under lang="ar". */');
  decl('--text-*', 'initial');
  for (const t of en) {
    const r = t.path[2];
    decl(`--text-${r}`, `var(--sc-type-${r}-size)`);
    decl(`--text-${r}--line-height`, `var(--sc-type-${r}-leading)`);
    decl(`--text-${r}--letter-spacing`, `var(--sc-type-${r}-tracking)`);
    decl(`--text-${r}--font-weight`, `var(--sc-type-${r}-weight)`);
  }
  L.push('', '  /* Motion */');
  decl('--ease-*', 'initial');
  for (const t of easing) decl(`--ease-${t.path[1]}`, `var(${cssVar(t.path)})`);
  for (const t of duration) decl(`--duration-${t.path[1]}`, `var(${cssVar(t.path)})`);
  decl('--default-transition-duration', 'var(--sc-duration-base)');
  decl('--default-transition-timing-function', 'var(--sc-easing-enter)');
  L.push('', '  /* Containers */');
  for (const t of container) decl(`--container-${t.path[1]}`, `var(${cssVar(t.path)})`);
  L.push('}', '');
  L.push('/* Breakpoints must be literal values: Tailwind uses them inside @media. */');
  L.push('@theme {');
  decl('--breakpoint-*', 'initial');
  for (const t of breakpoint) {
    if (t.value.value === 0) continue; // compact is the mobile-first base, not a breakpoint
    decl(`--breakpoint-${t.path[1]}`, dim(t.value));
  }
  L.push('}', '');
  L.push("/* Tailwind's duration-* utility does not read a theme namespace; this adds");
  L.push('   duration-fast, duration-base, etc. Numeric values (duration-150) still work. */');
  L.push('@utility duration-* {');
  L.push('  --tw-duration: --value(--duration-*);');
  L.push('  transition-duration: --value(--duration-*);');
  L.push('}');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- iOS (SwiftUI)

function buildSwift() {
  const L = [];
  const uic = (c) => {
    const [r, g, b, a] = srgb(c);
    return `rgb(${r}, ${g}, ${b}${a < 1 ? `, ${a}` : ''})`;
  };
  const dynamic = (indent, t) => {
    const d = darkOf(t);
    return [
      'scDynamic(',
      `${indent}    light: ${uic(t.value)}, // ${oklab(t.value)}`,
      `${indent}    dark: ${uic(d.value)} // ${oklab(d.value)}`,
      `${indent})`,
    ].join('\n');
  };

  L.push(`// ${HEADER}`);
  L.push('// Colours are converted from OKLAB to sRGB with the maths in scripts/lib/oklab.mjs.');
  L.push('// The source OKLAB value is in the comment beside each component set.');
  L.push('', 'import SwiftUI', 'import UIKit', '');
  L.push('private func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ a: CGFloat = 1) -> UIColor {');
  L.push('    UIColor(red: r, green: g, blue: b, alpha: a)');
  L.push('}', '');
  L.push('private func scDynamic(light: UIColor, dark: UIColor) -> Color {');
  L.push('    Color(UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })');
  L.push('}', '');

  L.push('// MARK: - Colour roles', '', 'public extension Color {');
  for (const t of roles) {
    if (t.description) L.push(`    /// ${t.description}`);
    L.push(`    static let sc${pascal(t.path.slice(1).join('-'))} = ${dynamic('    ', t)}`);
  }
  L.push('}', '');

  L.push('// MARK: - Channels', '');
  L.push('public struct SCChannel: Sendable {');
  L.push('    public let name: String');
  for (const role of CHANNEL_ROLES) L.push(`    public let ${camel(role)}: Color`);
  L.push('    /// Text and icons on action, the same in every channel.');
  L.push('    public var onAction: Color { .scChannelOnAction }');
  L.push('}', '', 'public extension SCChannel {');
  for (const ch of CHANNELS) {
    L.push(`    static let ${ch} = SCChannel(`, `        name: "${ch}",`);
    const list = channelOf(ch);
    list.forEach((t, i) => L.push(`        ${camel(t.path[2])}: ${dynamic('        ', t)}${i === list.length - 1 ? '' : ','}`));
    L.push('    )');
  }
  L.push(`    static let all: [SCChannel] = [${CHANNELS.map((c) => `.${c}`).join(', ')}]`);
  L.push('}', '');

  const cgEnum = (name, list, key) => {
    L.push(`public enum ${name} {`);
    for (const t of list) {
      if (t.description) L.push(`    /// ${t.description}`);
      L.push(`    public static let ${key(t)}: CGFloat = ${px(t.value)}`);
    }
    L.push('}', '');
  };
  L.push('// MARK: - Space, radius, size (points), opacity', '');
  cgEnum('SCSpace', space, (t) => `s${t.path[1]}`);
  cgEnum('SCRadius', radius, (t) => camel(t.path[1]));
  cgEnum('SCSize', size, (t) => camel(t.path[1]));
  L.push('public enum SCOpacity {');
  for (const t of opacity) L.push(`    /// ${t.description}`, `    public static let ${camel(t.path[1])}: Double = ${t.value}`);
  L.push('}', '');

  L.push('// MARK: - Typography', '');
  L.push('/// A type role. Line height is the authored px value; SwiftUI has no line-height');
  L.push('/// property, so `scTextStyle` approximates it with lineSpacing.');
  L.push('public struct SCTextStyle: Sendable {');
  L.push('    public let postScriptName: String');
  L.push('    public let size: CGFloat');
  L.push('    public let lineHeight: CGFloat');
  L.push('    /// Letter spacing in points (always 0 for Arabic).');
  L.push('    public let tracking: CGFloat');
  L.push('    public let relativeTo: Font.TextStyle', '');
  L.push('    public var font: Font { Font.custom(postScriptName, size: size, relativeTo: relativeTo) }');
  L.push('}', '');
  const relativeTo = (role) =>
    ({ display: '.largeTitle', headline: '.title', title: '.headline', body: '.body', label: '.subheadline' })[role.split('-')[0]] ?? '.body';
  const styleLine = (t) => {
    const v = t.value;
    const ps = POSTSCRIPT[v.fontFamily[0]];
    if (!ps) throw new Error(`No PostScript name for ${v.fontFamily[0]}`);
    const tracking = Number((v.letterSpacing.value * px(v.fontSize)).toFixed(3));
    return `SCTextStyle(postScriptName: "${ps}", size: ${px(v.fontSize)}, lineHeight: ${t.extensions.lineHeightPx}, tracking: ${tracking}, relativeTo: ${relativeTo(t.path[2])})`;
  };
  L.push('public enum SCType {');
  for (const [name, list] of [['En', en], ['Ar', ar]]) {
    L.push(`    public enum ${name} {`);
    for (const t of list) {
      if (t.description) L.push(`        /// ${t.description}`);
      L.push(`        public static let ${camel(t.path[2])} = ${styleLine(t)}`);
    }
    L.push('    }');
  }
  L.push('}', '');
  L.push('public extension View {');
  L.push('    /// Applies font, tracking and an approximation of the authored line height.');
  L.push('    func scTextStyle(_ style: SCTextStyle) -> some View {');
  L.push('        let natural = UIFont(name: style.postScriptName, size: style.size)?.lineHeight ?? style.size');
  L.push('        return self');
  L.push('            .font(style.font)');
  L.push('            .tracking(style.tracking)');
  L.push('            .lineSpacing(max(0, style.lineHeight - natural))');
  L.push('    }');
  L.push('}');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- Android (Compose)

function buildKotlin() {
  const L = [];
  const kc = (c) => {
    const [r, g, b, a] = srgb(c);
    return `Color(red = ${r}f, green = ${g}f, blue = ${b}f, alpha = ${a}f)`;
  };
  L.push(`// ${HEADER}`);
  L.push('// Colours are converted from OKLAB to sRGB with the maths in scripts/lib/oklab.mjs.');
  L.push('// The source OKLAB value is in the comment beside each colour.');
  L.push('', "package sc.designsystem.tokens // TODO: set to your app's package", '');
  for (const imp of [
    'androidx.compose.ui.graphics.Color',
    'androidx.compose.ui.text.TextStyle',
    'androidx.compose.ui.text.font.FontFamily',
    'androidx.compose.ui.text.font.FontWeight',
    'androidx.compose.ui.unit.dp',
    'androidx.compose.ui.unit.em',
    'androidx.compose.ui.unit.sp',
  ]) L.push(`import ${imp}`);
  L.push('');

  const name = (t) => camel(t.path.slice(1).join('-'));
  L.push('// ---- Colour roles', '');
  L.push('data class SCColorScheme(');
  for (const t of roles) L.push(`    val ${name(t)}: Color,${t.description ? ` // ${t.description}` : ''}`);
  L.push(')', '');
  for (const [obj, get] of [['SCLightColors', (t) => t], ['SCDarkColors', darkOf]]) {
    L.push(`val ${obj} = SCColorScheme(`);
    for (const t of roles) L.push(`    ${name(t)} = ${kc(get(t).value)}, // ${oklab(get(t).value)}`);
    L.push(')', '');
  }

  L.push('// ---- Channels (text on action is SCColorScheme.channelOnAction)', '');
  L.push('data class SCChannel(');
  L.push('    val name: String,');
  for (const role of CHANNEL_ROLES) L.push(`    val ${camel(role)}: Color,`);
  L.push(')', '');
  for (const [obj, get] of [['SCLightChannels', (t) => t], ['SCDarkChannels', darkOf]]) {
    L.push(`object ${obj} {`);
    for (const ch of CHANNELS) {
      L.push(`    val ${ch} = SCChannel(`, `        name = "${ch}",`);
      for (const t of channelOf(ch)) L.push(`        ${camel(t.path[2])} = ${kc(get(t).value)}, // ${oklab(get(t).value)}`);
      L.push('    )');
    }
    L.push(`    val all = listOf(${CHANNELS.join(', ')})`);
    L.push('}', '');
  }

  L.push('// ---- Space, radius, size, opacity', '');
  const dpObj = (obj, list, key) => {
    L.push(`object ${obj} {`);
    for (const t of list) L.push(`    val ${key(t)} = ${px(t.value)}.dp${t.description ? ` // ${t.description}` : ''}`);
    L.push('}', '');
  };
  dpObj('SCSpace', space, (t) => `s${t.path[1]}`);
  dpObj('SCRadius', radius, (t) => camel(t.path[1]));
  dpObj('SCSize', size, (t) => camel(t.path[1]));
  L.push('object SCOpacity {');
  for (const t of opacity) L.push(`    const val ${camel(t.path[1])} = ${t.value}f // ${t.description}`);
  L.push('}', '');

  L.push('// ---- Typography', '');
  L.push('// Placeholder. Wire the Dubai W23 files in res/font, for example:');
  L.push('// val DubaiFontFamily = FontFamily(');
  L.push('//     Font(R.font.dubai_w23_regular, FontWeight.Normal),');
  L.push('//     Font(R.font.dubai_w23_medium, FontWeight.Medium),');
  L.push('//     Font(R.font.dubai_w23_bold, FontWeight.Bold),');
  L.push('// )');
  L.push('val DubaiFontFamily: FontFamily = FontFamily.Default', '');
  const em = (n) => (n < 0 ? `(${n}).em` : `${n}.em`);
  for (const [obj, list] of [['SCTypeEn', en], ['SCTypeAr', ar]]) {
    L.push(`object ${obj} {`);
    for (const t of list) {
      const v = t.value;
      if (t.description) L.push(`    // ${t.description}`);
      L.push(`    val ${camel(t.path[2])} = TextStyle(`);
      L.push('        fontFamily = DubaiFontFamily,');
      L.push(`        fontWeight = FontWeight(${v.fontWeight}),`);
      L.push(`        fontSize = ${px(v.fontSize)}.sp,`);
      L.push(`        lineHeight = ${t.extensions.lineHeightPx}.sp,`);
      L.push(`        letterSpacing = ${em(v.letterSpacing.value)},`);
      L.push('    )');
    }
    L.push('}', '');
  }
  return L.join('\n');
}

// ---------------------------------------------------------------- Paper

function buildPaper() {
  const out = [];
  const add = (type, name, value, description) => out.push(description ? { type, name, value, description } : { type, name, value });
  const bySize = (list) => [...list].sort((a, b) => px(a.value) - px(b.value));

  // Paper has no modes or data-channel: light roles keep the web name, dark ones get -dark,
  // and every channel's roles are spelled out as --sc-color-channel-<channel>-<role>.
  for (const t of roles) add('color', roleVar(t), oklab(t.value), t.description);
  for (const t of roles) add('color', `${roleVar(t)}-dark`, oklab(darkOf(t).value));
  for (const ch of CHANNELS) {
    for (const t of channelOf(ch)) {
      add('color', `--sc-color-channel-${ch}-${t.path[2]}`, oklab(t.value), t.description);
      add('color', `--sc-color-channel-${ch}-${t.path[2]}-dark`, oklab(darkOf(t).value));
    }
  }
  for (const t of palette) add('color', `--sc-palette-${t.path[1]}-${t.path[2]}`, oklab(t.value));
  for (const t of opacity) add('opacity', cssVar(t.path), pct(t.value), t.description);

  for (const t of families) add('fontFamily', cssVar(t.path), t.value[0]);
  for (const t of weights) add('fontWeight', cssVar(t.path), t.value);
  // Paper wants size tokens smallest first.
  const typeEntries = { fontSize: [], lineHeight: [], letterSpacing: [] };
  for (const [list, suffix] of [[en, ''], [ar, '-ar']]) {
    for (const t of list) {
      const r = t.path[2];
      typeEntries.fontSize.push([px(t.value.fontSize), `--sc-type-${r}-size${suffix}`, `${px(t.value.fontSize)}px`, t.description]);
      typeEntries.lineHeight.push([t.extensions.lineHeightPx, `--sc-type-${r}-leading${suffix}`, `${t.extensions.lineHeightPx}px`]);
      if (t.value.letterSpacing.value !== 0) typeEntries.letterSpacing.push([t.value.letterSpacing.value, `--sc-type-${r}-tracking${suffix}`, dim(t.value.letterSpacing)]);
    }
  }
  for (const [type, list] of Object.entries(typeEntries)) {
    for (const [, name, value, description] of list.sort((a, b) => a[0] - b[0])) add(type, name, value, description);
  }
  for (const t of bySize(space)) add('spacing', cssVar(t.path), `${px(t.value)}px`);
  for (const t of bySize(size.filter((t) => t.path[1] !== 'measure'))) add('spacing', cssVar(t.path), `${px(t.value)}px`, t.description);
  for (const t of bySize(grid.filter((t) => t.type === 'dimension'))) add('spacing', cssVar(t.path), `${px(t.value)}px`);
  for (const t of bySize(radius)) add('radius', cssVar(t.path), `${px(t.value)}px`, t.description);
  for (const t of bySize(breakpoint)) add('breakpoint', cssVar(t.path), `${px(t.value)}px`, t.description);
  for (const t of bySize([...container, ...size.filter((t) => t.path[1] === 'measure')])) add('container', cssVar(t.path), `${px(t.value)}px`, t.description);
  return JSON.stringify(out, null, 2) + '\n';
}

// ---------------------------------------------------------------- write

console.log('Building tokens');
write('css/tokens.css', buildCss());
write('css/palette.css', buildPaletteCss());
write('tailwind/theme.css', buildTailwind());
write('ios/SCTokens.swift', buildSwift());
write('android/SCTokens.kt', buildKotlin());
write('paper/tokens.paper.json', buildPaper());
if (clamped.size) {
  console.log(`  note: ${clamped.size} colour(s) outside sRGB were clamped for iOS/Android:`);
  for (const c of clamped) console.log(`    ${c}`);
}
