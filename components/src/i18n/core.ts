/**
 * Language helpers with no dictionary in them, so importing this file never pulls another
 * component's strings into a bundle. Components import their own strings file
 * (../i18n/components/<tag>) and the controller (../i18n/controller), nothing else.
 */
import type { Lang, Dir } from './define';

export type { Lang, Dir };
export type FormatValues = Record<string, string | number>;

/** The seven channels, in their canonical order. Values match `data-channel`. */
export const channels = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const;
export type Channel = (typeof channels)[number];

/**
 * Fills `{name}` placeholders. Numbers are written with Latin digits in both languages.
 * Unknown placeholders are left as they are, so a missing value is visible rather than silent.
 *
 * @example format('Step {current} of {total}', { current: 2, total: 4 }) // "Step 2 of 4"
 */
export function format(template: string, values: FormatValues = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    if (value === undefined) return match;
    return typeof value === 'number' ? value.toLocaleString('en-US', { useGrouping: false }) : value;
  });
}

/** Normalises any BCP 47 tag ("ar-AE", "en-GB", "") to a supported language. */
export function toLang(tag: string | null | undefined): Lang {
  return tag?.trim().toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function dirFor(lang: Lang): Dir {
  return lang === 'ar' ? 'rtl' : 'ltr';
}
