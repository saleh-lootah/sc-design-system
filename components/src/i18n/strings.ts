/**
 * LEGACY (v1): every component's strings merged into one dictionary. v1 components still
 * read it through ./locale.ts; any component that imports it carries every other
 * component's strings. v2 components never import this file: they use ./controller.ts with
 * their own ./components/<tag>.ts (CONVENTIONS.md, "Strings"). Delete this file, ./locale.ts
 * and ./components/index.ts once the last v1 component has migrated (Wave 2b).
 *
 * Every string a component renders by itself, in English and Arabic.
 *
 * Strings live in one file per component under src/i18n/components/ and are merged here,
 * so components built in parallel never edit the same dictionary. To add strings:
 *   1. create src/i18n/components/<tag>.ts with `export default defineStrings({ en, ar })`
 *      (keys prefixed with the component name, e.g. `linkOpensInNewTab`);
 *   2. append one export line to src/i18n/components/index.ts.
 * TypeScript fails the build if an Arabic key is missing; the strings spec test fails on
 * duplicate keys across files.
 *
 * Components read strings through the LocaleController in ./locale.ts (`this.locale.t(key)`).
 * Placeholders use `{name}`. Digits are always Latin (0–9) in both languages.
 */
import * as parts from './components/index';
import { Channel, FormatValues, Lang, format } from './core';
import type { StringPart } from './define';

export { channels, dirFor, format, toLang } from './core';
export type { Channel, Dir, FormatValues, Lang } from './core';

type Parts = typeof parts;
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type EnOf<P> = P extends StringPart<infer E> ? E : never;

/** Every key from every string file. */
export type StringKey = keyof UnionToIntersection<EnOf<Parts[keyof Parts]>> & string;
export type Dictionary = Record<StringKey, string>;

/** Keys defined by more than one file (should always be empty; checked by strings.spec.ts). */
export const duplicateKeys: string[] = [];

function merge(): Record<Lang, Dictionary> {
  const en: Record<string, string> = {};
  const ar: Record<string, string> = {};
  for (const part of Object.values(parts) as StringPart<Record<string, string>>[]) {
    for (const key of Object.keys(part.en)) {
      if (key in en) duplicateKeys.push(key);
      en[key] = part.en[key];
      ar[key] = part.ar[key];
    }
  }
  return { en: en as Dictionary, ar: ar as Dictionary };
}

export const strings: Record<Lang, Dictionary> = merge();


/** The string key holding a channel's display name, e.g. `channelKey('visit')` is `'channelVisit'`. */
export function channelKey(channel: Channel): StringKey {
  return `channel${channel.charAt(0).toUpperCase()}${channel.slice(1)}` as StringKey;
}

/** Looks up a string in a language and fills its placeholders. */
export function translate(lang: Lang, key: StringKey, values?: FormatValues): string {
  const template = strings[lang][key] ?? strings.en[key] ?? key;
  return values ? format(template, values) : template;
}

