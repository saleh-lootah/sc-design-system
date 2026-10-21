/**
 * Plural forms for counted nouns, with no dictionary in it. Templates separate the forms with
 * `|` in Intl.PluralRules order: English "one|other"; Arabic "zero|one|two|few|many|other"
 * (missing forms fall back to the last one). A template without `|` is used as it is.
 *
 *   plural('{count} service|{count} services', 1, 'en') // "{count} service"
 *
 * Fill `{count}` afterwards with `format` from ./core, which keeps digits Latin.
 */
import type { Lang } from './define';

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
