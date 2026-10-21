/**
 * Legacy (v1) wrapper kept for sc-date-range until its family agent rebuilds it: the same
 * helpers as ./strings-override, with the fallback bound to the merged v1 dictionary.
 * sc-table itself imports ./strings-override only, so the v1 dictionary is not in its bundle.
 */
import { FormatValues, Lang, StringKey, translate } from '../../i18n/strings';
import { StringsInput, overrideTranslator, parseStrings, plural } from './strings-override';

export type { StringsInput };
export { parseStrings, plural };

/** A translate function that prefers the overrides for `lang`, then the built-in v1 strings. */
export function translator(lang: Lang, input: StringsInput) {
  return overrideTranslator<StringKey>(lang, input, (key: StringKey, values?: FormatValues) => translate(lang, key, values));
}
