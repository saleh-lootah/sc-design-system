/**
 * Per-instance string overrides for sc-date-range's `strings` property, on top of its own
 * strings (v2: no merged dictionary). The property takes a JSON object (or an object) of
 * string keys, for one language or both:
 *
 *   strings='{"dateRangeFrom": "Check-in"}'
 *   strings='{"en": {"dateRangeFrom": "Check-in"}, "ar": {"dateRangeFrom": "الوصول"}}'
 *
 * Placeholders are filled with the shared `format`, so digits stay Latin.
 */
import { FormatValues, format } from '../../i18n/core';
import type { Lang } from '../../i18n/define';
import dateRangeStrings from '../../i18n/components/sc-date-range';

export type StringsInput = string | Record<string, unknown> | undefined | null;
export type DateRangeKey = keyof typeof dateRangeStrings.en;

/** Parses the `strings` property. Invalid JSON is ignored (the built-in strings are used). */
function parse(input: StringsInput): Record<string, unknown> {
  if (!input) return {};
  if (typeof input === 'object') return input;
  try {
    const parsed = JSON.parse(input);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** A translate function that prefers the overrides for `lang`, then the built-in strings. */
export function translator(lang: Lang, input: StringsInput) {
  const all = parse(input);
  const scoped = (all[lang] && typeof all[lang] === 'object' ? all[lang] : {}) as Record<string, unknown>;
  const builtIn = (dateRangeStrings[lang] ?? dateRangeStrings.en) as Record<string, string>;
  return (key: DateRangeKey, values?: FormatValues): string => {
    const own = typeof scoped[key] === 'string' ? scoped[key] : typeof all[key] === 'string' ? all[key] : undefined;
    const template = (own as string | undefined) ?? builtIn[key] ?? (dateRangeStrings.en as Record<string, string>)[key] ?? key;
    return values ? format(template, values) : template;
  };
}
