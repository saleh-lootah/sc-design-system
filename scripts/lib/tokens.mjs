// Reads tokens/*.json (W3C DTCG) into flat lists. No dependencies.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TOKENS_DIR = join(ROOT, 'tokens');
export const DIST_DIR = join(ROOT, 'dist');

const COLOR_SOURCE = JSON.parse(readFileSync(join(TOKENS_DIR, 'source', 'color.source.json'), 'utf8'));
const own = (o) => Object.keys(o).filter((k) => !k.startsWith('$'));
/** Channel names and per-channel roles, from tokens/source/color.source.json. */
export const CHANNELS = own(COLOR_SOURCE.channels);
export const CHANNEL_ROLES = own(COLOR_SOURCE.channelRoles);
export const DEFAULT_CHANNEL = COLOR_SOURCE.defaultChannel;

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
  // Dark aliases resolve against the dark value where one exists, so
  // {channel.now.action} in color.dark.json means the dark channel colour.
  const darkByPath = new Map([...byPath, ...dark.map((t) => [t.path.join('.'), t])]);
  // Resolve "{font.family.bold}" style references.
  const resolver = (map) => {
    const resolve = (v) => {
      if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) {
        const target = map.get(v.slice(1, -1));
        if (!target) throw new Error(`Unresolved reference ${v}`);
        return resolve(target.ref ?? target.value);
      }
      if (Array.isArray(v)) return v.map(resolve);
      if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]));
      return v;
    };
    return resolve;
  };
  const resolveLight = resolver(byPath);
  const resolveDark = resolver(darkByPath);
  for (const t of light) t.ref = t.value; // keep the unresolved form (aliases, font family names)
  for (const t of dark) t.ref = t.value;
  for (const t of light) t.value = resolveLight(t.ref);
  for (const t of dark) t.value = resolveDark(t.ref);
  return { light, dark, byPath, darkByPath, get: (p) => byPath.get(p), getDark: (p) => darkByPath.get(p) };
}

export const isColor = (t) => t.type === 'color';
export const group = (tokens, first) => tokens.filter((t) => t.path[0] === first);
