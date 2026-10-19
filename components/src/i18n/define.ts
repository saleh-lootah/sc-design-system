/**
 * Helper for per-component string files in src/i18n/components/.
 *
 * `defineStrings` checks at compile time that the Arabic dictionary has exactly the
 * English keys, so a missing translation fails the build.
 */
export type Lang = 'en' | 'ar';
export type Dir = 'ltr' | 'rtl';

export interface StringPart<E extends Record<string, string>> {
  en: E;
  ar: { [K in keyof E]: string };
}

export function defineStrings<E extends Record<string, string>>(part: StringPart<E>): StringPart<E> {
  return part;
}
