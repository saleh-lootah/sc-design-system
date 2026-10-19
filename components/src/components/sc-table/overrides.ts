/**
 * Per-instance string overrides for components with a `strings` property (sc-table,
 * sc-date-range). The property takes a JSON object (or an object) of string keys, for
 * one language or both:
 *
 *   strings='{"tableSelectRow": "Select fine {row}"}'
 *   strings='{"en": {"tableSelectRow": "Select fine {row}"}, "ar": {"tableSelectRow": "تحديد المخالفة {row}"}}'
 *
 * Placeholders are filled with the shared `format`, so digits stay Latin.
 */
import { FormatValues, Lang, StringKey, format, translate } from '../../i18n/strings';

export type StringsInput = string | Record<string, unknown> | undefined | null;

/** Parses the `strings` property. Invalid JSON is ignored (the built-in strings are used). */
export function parseStrings(input: StringsInput): Record<string, unknown> {
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
  const all = parseStrings(input);
  const scoped = (all[lang] && typeof all[lang] === 'object' ? all[lang] : {}) as Record<string, unknown>;
  return (key: StringKey, values?: FormatValues): string => {
    const own = typeof scoped[key] === 'string' ? scoped[key] : typeof all[key] === 'string' ? all[key] : undefined;
    if (own === undefined) return translate(lang, key, values);
    return values ? format(own as string, values) : (own as string);
  };
}

/**
 * Picks a plural form from a `|`-separated template with Intl.PluralRules.
 * English: "one|other". Arabic: "zero|one|two|few|many|other" (missing forms fall back to the last).
 * A template without `|` is returned as it is.
 */
export function plural(template: string, count: number, lang: Lang): string {
  if (!template.includes('|')) return template;
  const forms = template.split('|');
  const order = lang === 'ar' ? ['zero', 'one', 'two', 'few', 'many', 'other'] : ['one', 'other'];
  let category = 'other';
  try {
    category = new Intl.PluralRules(lang).select(count);
  } catch {
    /* keep "other" */
  }
  const index = order.indexOf(category);
  return (forms[index] ?? forms[forms.length - 1]).trim();
}
