#!/usr/bin/env node
// Generates every platform output in dist/ from tokens/*.json.
// Plain Node (ESM), no dependencies. Run: node scripts/build-tokens.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadTokens, group, CHANNELS, CHANNEL_ROLES, DIST_DIR, ROOT } from './lib/tokens.mjs';
import { toSrgb01, inGamut } from './lib/oklab.mjs';

const HEADER = 'Generated — edit tokens/*.json';
const tokens = loadTokens();
const { light, dark } = tokens;

// Real PostScript names, read from the name tables (nameID 6) of
// ~/Library/Fonts/DubaiW23-*.ttf. Each weight ships as its own family.
const POSTSCRIPT = {
  'Dubai W23 Light': 'DubaiW23-Light',
  'Dubai W23 Regular': 'DubaiW23-Regular',
  'Dubai W23 Medium': 'DubaiW23-Medium',
  'Dubai W23 Bold': 'DubaiW23-Bold',
};

// ---------------------------------------------------------------- helpers

const colors = light.filter((t) => t.path[0] === 'color');
const channelTokens = light.filter((t) => t.path[0] === 'channel');
const darkColors = dark.filter((t) => t.path[0] === 'color');
const darkChannels = dark.filter((t) => t.path[0] === 'channel');
const darkByPath = new Map(dark.map((t) => [t.path.join('.'), t]));
const space = group(light, 'space');
const radius = group(light, 'radius');
const size = group(light, 'size');
const elevation = group(light, 'elevation');
const duration = group(light, 'duration');
const easing = group(light, 'easing');
const scale = group(light, 'scale');
const breakpoint = group(light, 'breakpoint');
const grid = group(light, 'grid');
const container = group(light, 'container');
const families = light.filter((t) => t.path[0] === 'font' && t.path[1] === 'family');
const weights = light.filter((t) => t.path[0] === 'font' && t.path[1] === 'weight');
const typeRoles = (script) => light.filter((t) => t.path[0] === 'type' && t.path[1] === script);
const latin = typeRoles('latin');
const arabic = typeRoles('arabic');

const cssVar = (path) => `--sc-${path.join('-')}`;
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

/**
 * sRGB 0..1 components for native platforms, via the same maths as oklab.py.
 * A few light tints sit a hair outside sRGB; like oklab.py we clamp them, and
 * the contrast checks already use the clamped values.
 */
const clamped = new Set();
function srgb(c) {
  const [L, a, b] = c.components;
  if (!inGamut(L, a, b)) clamped.add(oklab(c));
  return [...toSrgb01(L, a, b).map((x) => Number(x.toFixed(4))), c.alpha ?? 1];
}

const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif']);
const fontStack = (list) => list.map((f) => (GENERIC.has(f) ? f : `"${f}"`)).join(', ');

function shadow(layers) {
  if (!layers.length) return 'none';
  return layers
    .map((s) => `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} ${oklab(s.color)}`)
    .join(', ');
}

const cubic = (v) => `cubic-bezier(${v.join(', ')})`;
const familyKey = (t) => t.ref.fontFamily.replace(/^\{font\.family\.(.+)\}$/, '$1');
const weightKey = (t) => t.ref.fontWeight.replace(/^\{font\.weight\.(.+)\}$/, '$1');
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

function write(rel, content) {
  const file = join(DIST_DIR, rel);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, content.replace(/[ \t]+$/gm, ''));
  console.log(`  wrote ${relative(ROOT, file)} (${content.split('\n').length - 1} lines)`);
}

// ---------------------------------------------------------------- CSS

function buildCss() {
  const L = [];
  const decl = (name, value, comment) => L.push(`  ${name}: ${value};${comment ? ` /* ${comment} */` : ''}`);
  const section = (title) => L.push('', `  /* ${title} */`);

  L.push(`/* ${HEADER} */`, '', ':root {', '  color-scheme: light;');

  section('Colour');
  for (const t of colors) decl(cssVar(t.path), oklab(t.value), t.description);

  section('Channel signatures');
  for (const t of channelTokens) decl(cssVar(t.path), oklab(t.value));

  section('Active channel (default: now). Set data-channel on any element to switch.');
  for (const role of CHANNEL_ROLES) decl(`--sc-channel-${role}`, `var(--sc-channel-now-${role})`);

  section('Font');
  for (const t of families) decl(cssVar(t.path), fontStack(t.value));
  for (const t of weights) decl(cssVar(t.path), t.value);

  section('Type scale: size, line height (px), letter spacing');
  for (const t of [...latin, ...arabic]) {
    const [, script, role] = t.path;
    decl(`--sc-text-${script}-${role}`, dim(t.value.fontSize));
    decl(`--sc-leading-${script}-${role}`, `${t.extensions.lineHeightPx}px`);
    if (script === 'latin') decl(`--sc-tracking-${script}-${role}`, dim(t.value.letterSpacing));
  }

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

  L.push('/* Channel theming layer */');
  for (const ch of CHANNELS) {
    L.push(`[data-channel="${ch}"] {`);
    for (const role of CHANNEL_ROLES) decl(`--sc-channel-${role}`, `var(--sc-channel-${ch}-${role})`);
    L.push('}');
  }
  L.push('');

  // Dark mode: only the tokens color.dark.json overrides. The channel aliases
  // above are var() references, so they pick up these values automatically.
  const darkBody = (indent) => {
    const out = [`${indent}color-scheme: dark;`];
    for (const t of [...darkColors, ...darkChannels]) out.push(`${indent}${cssVar(t.path)}: ${oklab(t.value)};`);
    return out;
  };
  L.push('/* Dark mode: follows the system unless data-theme="light" is set */');
  L.push('@media (prefers-color-scheme: dark) {', '  :root:not([data-theme="light"]) {', ...darkBody('    '), '  }', '}', '');
  L.push('/* Dark mode: forced */', ':root[data-theme="dark"] {', ...darkBody('  '), '}', '');

  // Reduced motion: movement stops, opacity and colour keep their timing. Only tokens with
  // $extensions.reducedMotion change (spin, scale); see tokens/motion.json.
  L.push('/* Reduced motion: movement stops (spin, scale); opacity and colour transitions keep their durations */');
  L.push('@media (prefers-reduced-motion: reduce) {', '  :root {');
  for (const t of [...duration, ...scale]) {
    const rm = t.extensions?.reducedMotion;
    if (rm === undefined) continue;
    L.push(`    ${cssVar(t.path)}: ${typeof rm === 'object' ? dim(rm) : rm};`);
  }
  L.push('  }', '}', '');

  // Typography classes. Line height uses the authored px value ($extensions.lineHeightPx).
  const typeRule = (selectors, t, script) => {
    const [, , role] = t.path;
    L.push(`${selectors.join(',\n')} {`);
    L.push(`  font-family: var(--sc-font-family-${familyKey(t)});`);
    L.push(`  font-weight: var(--sc-font-weight-${weightKey(t)});`);
    L.push(`  font-size: var(--sc-text-${script}-${role});`);
    L.push(`  line-height: var(--sc-leading-${script}-${role});`);
    L.push(`  letter-spacing: ${script === 'latin' ? `var(--sc-tracking-latin-${role})` : '0'};`);
    L.push('}');
  };
  L.push('/* Typography: Latin */');
  for (const t of latin) typeRule([`.sc-type-${t.path[2]}`], t, 'latin');
  L.push('', '/* Typography: Arabic. Applies to elements whose own language is Arabic (so lang="en" inside an Arabic page keeps the Latin scale), or with the explicit .sc-type-ar-* class. */');
  for (const t of arabic) {
    const r = t.path[2];
    typeRule([`.sc-type-${r}:lang(ar)`, `.sc-type-ar-${r}`], t, 'arabic');
  }
  L.push('', '/* Arabic is never letter-spaced, including Latin-only roles used on Arabic text. */');
  L.push('[class*="sc-type-"]:lang(ar),', '[class*="sc-type-ar-"] {', '  letter-spacing: 0;', '}');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- Tailwind v4

function buildTailwind() {
  const L = [];
  const decl = (name, value) => L.push(`  ${name}: ${value};`);
  L.push(`/* ${HEADER} */`);
  L.push('/* Tailwind v4 theme. Values point at the --sc-* custom properties in tokens.css,');
  L.push('   so dark mode and data-channel switching keep working. "inline" makes utilities');
  L.push('   use var(--sc-*) directly, so a data-channel on any element is respected. */');
  L.push('@import "../css/tokens.css";', '');
  L.push('@theme inline {');
  L.push('  /* Only design-system colours: Tailwind\'s default palette is removed. */');
  decl('--color-*', 'initial');
  for (const t of colors) decl(`--color-${t.path[1]}`, `var(${cssVar(t.path)})`);
  for (const t of channelTokens) decl(`--color-channel-${t.path[1]}-${t.path[2]}`, `var(${cssVar(t.path)})`);
  for (const role of CHANNEL_ROLES) decl(`--color-channel-${role}`, `var(--sc-channel-${role})`);
  L.push('', '  /* Spacing: 1 unit = 1px, so p-16 is 16px, matching --sc-space-16. */');
  decl('--spacing', '1px');
  for (const t of space) decl(`--spacing-${t.path[1]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Radius */');
  decl('--radius-*', 'initial');
  for (const t of radius) decl(`--radius-${t.path[1]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Shadows */');
  decl('--shadow-*', 'initial');
  for (const t of elevation) {
    // Tailwind joins shadows into one comma list, where "none" is invalid; use an empty shadow.
    decl(`--shadow-${t.path[1]}`, t.value.length ? `var(${cssVar(t.path)})` : '0 0 transparent');
  }
  L.push('', '  /* Fonts */');
  decl('--font-sans', 'var(--sc-font-family-regular)');
  for (const t of families) decl(`--font-${t.path[2]}`, `var(${cssVar(t.path)})`);
  for (const t of weights) decl(`--font-weight-${t.path[2]}`, `var(${cssVar(t.path)})`);
  L.push('', '  /* Text sizes with line-height pairs. Latin: text-<role>. Arabic: text-ar-<role>. */');
  decl('--text-*', 'initial');
  for (const t of [...latin, ...arabic]) {
    const [, script, role] = t.path;
    const name = script === 'latin' ? `--text-${role}` : `--text-ar-${role}`;
    decl(name, `var(--sc-text-${script}-${role})`);
    decl(`${name}--line-height`, `var(--sc-leading-${script}-${role})`);
    decl(`${name}--letter-spacing`, script === 'latin' ? `var(--sc-tracking-latin-${role})` : '0');
    decl(`${name}--font-weight`, `var(--sc-font-weight-${weightKey(t)})`);
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
  L.push('/* Tailwind\'s duration-* utility does not read a theme namespace; this adds');
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
  const dynamic = (indent, lightTok, darkTok) => [
    `scDynamic(`,
    `${indent}    light: ${uic(lightTok.value)}, // ${oklab(lightTok.value)}`,
    `${indent}    dark: ${uic((darkTok ?? lightTok).value)} // ${oklab((darkTok ?? lightTok).value)}`,
    `${indent})`,
  ].join('\n');

  L.push(`// ${HEADER}`);
  L.push('// Colours are converted from OKLAB to sRGB with the maths in scripts/oklab.py.');
  L.push('// The source OKLAB value is in the comment beside each component set.');
  L.push('', 'import SwiftUI', 'import UIKit', '');
  L.push('private func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ a: CGFloat = 1) -> UIColor {');
  L.push('    UIColor(red: r, green: g, blue: b, alpha: a)');
  L.push('}', '');
  L.push('private func scDynamic(light: UIColor, dark: UIColor) -> Color {');
  L.push('    Color(UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })');
  L.push('}', '');

  L.push('// MARK: - Colour', '', 'public extension Color {');
  for (const t of colors) {
    if (t.description) L.push(`    /// ${t.description}`);
    L.push(`    static let sc${pascal(t.path[1])} = ${dynamic('    ', t, darkByPath.get(t.path.join('.')))}`);
  }
  L.push('}', '');

  L.push('// MARK: - Channels', '');
  L.push('public struct SCChannel: Sendable {');
  L.push('    public let name: String');
  for (const role of CHANNEL_ROLES) L.push(`    public let ${camel(role)}: Color`);
  L.push('}', '', 'public extension SCChannel {');
  for (const ch of CHANNELS) {
    L.push(`    static let ${ch} = SCChannel(`, `        name: "${ch}",`);
    CHANNEL_ROLES.forEach((role, i) => {
      const p = `channel.${ch}.${role}`;
      const sep = i === CHANNEL_ROLES.length - 1 ? '' : ',';
      L.push(`        ${camel(role)}: ${dynamic('        ', tokens.get(p), darkByPath.get(p))}${sep}`);
    });
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
  L.push('// MARK: - Space, radius, size (points)', '');
  cgEnum('SCSpace', space, (t) => `s${t.path[1]}`);
  cgEnum('SCRadius', radius, (t) => camel(t.path[1]));
  cgEnum('SCSize', size, (t) => camel(t.path[1]));

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
  const relative = (role) =>
    ({ display: '.largeTitle', heading: '.title', numeral: '.title', title: '.headline', body: '.body', value: '.body', label: '.subheadline', error: '.footnote' })[role.split('-')[0]] ?? '.caption';
  const styleLine = (t, script) => {
    const v = t.value;
    const ps = POSTSCRIPT[v.fontFamily[0]];
    if (!ps) throw new Error(`No PostScript name for ${v.fontFamily[0]}`);
    const tracking = script === 'latin' ? Number((v.letterSpacing.value * px(v.fontSize)).toFixed(3)) : 0;
    return `SCTextStyle(postScriptName: "${ps}", size: ${px(v.fontSize)}, lineHeight: ${t.extensions.lineHeightPx}, tracking: ${tracking}, relativeTo: ${relative(t.path[2])})`;
  };
  L.push('public enum SCType {');
  for (const [name, list, script] of [['Latin', latin, 'latin'], ['Arabic', arabic, 'arabic']]) {
    L.push(`    public enum ${name} {`);
    for (const t of list) {
      if (t.description) L.push(`        /// ${t.description}`);
      L.push(`        public static let ${camel(t.path[2])} = ${styleLine(t, script)}`);
    }
    L.push('    }');
  }
  L.push('}', '');
  L.push('public extension Font {');
  for (const t of latin) L.push(`    static let sc${pascal(t.path[2])} = SCType.Latin.${camel(t.path[2])}.font`);
  for (const t of arabic) L.push(`    static let scAr${pascal(t.path[2])} = SCType.Arabic.${camel(t.path[2])}.font`);
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
  L.push('// Colours are converted from OKLAB to sRGB with the maths in scripts/oklab.py.');
  L.push('// The source OKLAB value is in the comment beside each colour.');
  L.push('', 'package sc.designsystem.tokens // TODO: set to your app\'s package', '');
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

  L.push('// ---- Colour', '');
  L.push('data class SCColorScheme(');
  for (const t of colors) L.push(`    val ${camel(t.path[1])}: Color,${t.description ? ` // ${t.description}` : ''}`);
  L.push(')', '');
  for (const [name, getTok] of [['SCLightColors', (t) => t], ['SCDarkColors', (t) => darkByPath.get(t.path.join('.')) ?? t]]) {
    L.push(`val ${name} = SCColorScheme(`);
    for (const t of colors) L.push(`    ${camel(t.path[1])} = ${kc(getTok(t).value)}, // ${oklab(getTok(t).value)}`);
    L.push(')', '');
  }

  L.push('// ---- Channels', '');
  L.push('data class SCChannel(');
  L.push('    val name: String,');
  for (const role of CHANNEL_ROLES) L.push(`    val ${camel(role)}: Color,`);
  L.push(')', '');
  for (const [obj, mode] of [['SCLightChannels', 'light'], ['SCDarkChannels', 'dark']]) {
    L.push(`object ${obj} {`);
    for (const ch of CHANNELS) {
      L.push(`    val ${ch} = SCChannel(`, `        name = "${ch}",`);
      for (const role of CHANNEL_ROLES) {
        const p = `channel.${ch}.${role}`;
        const tok = mode === 'dark' ? darkByPath.get(p) ?? tokens.get(p) : tokens.get(p);
        L.push(`        ${camel(role)} = ${kc(tok.value)}, // ${oklab(tok.value)}`);
      }
      L.push('    )');
    }
    L.push(`    val all = listOf(${CHANNELS.join(', ')})`);
    L.push('}', '');
  }

  L.push('// ---- Space, radius, size', '');
  const dpObj = (name, list, key) => {
    L.push(`object ${name} {`);
    for (const t of list) L.push(`    val ${key(t)} = ${px(t.value)}.dp${t.description ? ` // ${t.description}` : ''}`);
    L.push('}', '');
  };
  dpObj('SCSpace', space, (t) => `s${t.path[1]}`);
  dpObj('SCRadius', radius, (t) => camel(t.path[1]));
  dpObj('SCSize', size, (t) => camel(t.path[1]));

  L.push('// ---- Typography', '');
  L.push('// Placeholder. Wire the Dubai W23 files in res/font, for example:');
  L.push('// val DubaiFontFamily = FontFamily(');
  L.push('//     Font(R.font.dubai_w23_light, FontWeight.Light),');
  L.push('//     Font(R.font.dubai_w23_regular, FontWeight.Normal),');
  L.push('//     Font(R.font.dubai_w23_medium, FontWeight.Medium),');
  L.push('//     Font(R.font.dubai_w23_bold, FontWeight.Bold),');
  L.push('// )');
  L.push('val DubaiFontFamily: FontFamily = FontFamily.Default', '');
  const em = (n) => (n < 0 ? `(${n}).em` : `${n}.em`);
  for (const [obj, list, script] of [['SCTypeLatin', latin, 'latin'], ['SCTypeArabic', arabic, 'arabic']]) {
    L.push(`object ${obj} {`);
    for (const t of list) {
      const v = t.value;
      const ls = script === 'latin' ? em(v.letterSpacing.value) : '0.em';
      if (t.description) L.push(`    // ${t.description}`);
      L.push(`    val ${camel(t.path[2])} = TextStyle(`);
      L.push('        fontFamily = DubaiFontFamily,');
      L.push(`        fontWeight = FontWeight(${v.fontWeight}),`);
      L.push(`        fontSize = ${px(v.fontSize)}.sp,`);
      L.push(`        lineHeight = ${t.extensions.lineHeightPx}.sp,`);
      L.push(`        letterSpacing = ${ls},`);
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

  for (const t of colors) add('color', cssVar(t.path), oklab(t.value), t.description);
  for (const t of channelTokens) add('color', cssVar(t.path), oklab(t.value));
  for (const t of darkColors) add('color', `${cssVar(t.path)}-dark`, oklab(t.value), t.description);
  for (const t of darkChannels) add('color', `${cssVar(t.path)}-dark`, oklab(t.value));

  for (const t of families) add('fontFamily', cssVar(t.path), t.value[0]);
  for (const t of weights) add('fontWeight', cssVar(t.path), t.value);
  for (const t of [...latin, ...arabic]) {
    const [, script, role] = t.path;
    add('fontSize', `--sc-text-${script}-${role}`, `${px(t.value.fontSize)}px`, t.description);
    add('lineHeight', `--sc-leading-${script}-${role}`, `${t.extensions.lineHeightPx}px`);
    if (script === 'latin' && t.value.letterSpacing.value !== 0) {
      add('letterSpacing', `--sc-tracking-${script}-${role}`, dim(t.value.letterSpacing));
    }
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
write('tailwind/theme.css', buildTailwind());
write('ios/SCTokens.swift', buildSwift());
write('android/SCTokens.kt', buildKotlin());
write('paper/tokens.paper.json', buildPaper());
if (clamped.size) {
  console.log(`  note: ${clamped.size} colour(s) slightly outside sRGB were clamped for iOS/Android (as oklab.py does):`);
  for (const c of clamped) console.log(`    ${c}`);
}
