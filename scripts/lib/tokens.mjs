// Reads tokens/*.json (W3C DTCG) into flat lists. No dependencies.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TOKENS_DIR = join(ROOT, 'tokens');
export const DIST_DIR = join(ROOT, 'dist');

export const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];
export const CHANNEL_ROLES = ['action', 'action-hover', 'action-pressed', 'wash-start', 'wash-end', 'ink', 'subtle', 'link-visited'];

function readJson(name) {
  return JSON.parse(readFileSync(join(TOKENS_DIR, name), 'utf8'));
}

/**
 * Walk a DTCG tree and return [{ path: ['color','ink'], type, value, description, extensions }].
 * $type is inherited from the nearest group that sets it, as the spec says.
 */
export function flatten(tree, path = [], inheritedType) {
  const out = [];
  const type = tree.$type ?? inheritedType;
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || node === null || typeof node !== 'object') continue;
    if ('$value' in node) {
      out.push({
        path: [...path, key],
        type: node.$type ?? type,
        value: node.$value,
        description: node.$description,
        extensions: node.$extensions,
      });
    } else {
      out.push(...flatten(node, [...path, key], type));
    }
  }
  return out;
}

/** Load every token file. Light files are merged into one list; dark colours are kept apart. */
export function loadTokens() {
  const files = readdirSync(TOKENS_DIR).filter((f) => f.endsWith('.json')).sort();
  const light = [];
  let dark = [];
  for (const f of files) {
    const json = readJson(f);
    const tokens = flatten(json);
    if (json.$extensions?.mode === 'dark') dark = dark.concat(tokens);
    else light.push(...tokens);
  }
  const byPath = new Map(light.map((t) => [t.path.join('.'), t]));
  // Resolve "{font.family.bold}" style references against the light set.
  const resolve = (v) => {
    if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) {
      const target = byPath.get(v.slice(1, -1));
      if (!target) throw new Error(`Unresolved reference ${v}`);
      return resolve(target.value);
    }
    if (Array.isArray(v)) return v.map(resolve);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]));
    return v;
  };
  for (const t of [...light, ...dark]) {
    t.ref = t.value; // keep the unresolved form (used to name font families)
    t.value = resolve(t.value);
  }
  return { light, dark, byPath, get: (p) => byPath.get(p) };
}

export const isColor = (t) => t.type === 'color';
export const group = (tokens, first) => tokens.filter((t) => t.path[0] === first);
