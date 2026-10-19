/** Date helpers for sc-date-input (kept out of the component module, which may only export the class). */

export type DatePart = 'day' | 'month' | 'year';

export const PARTS: readonly DatePart[] = ['day', 'month', 'year'];
export type Parts = Record<DatePart, string>;

/** Parses "2026-03-07" into { day: "7", month: "3", year: "2026" }; empty parts otherwise. */
export function partsFromIso(iso: string | undefined | null): Parts {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!m) return { day: '', month: '', year: '' };
  return { day: String(Number(m[3])), month: String(Number(m[2])), year: m[1] };
}

/** "2026-03-07" when the parts make a real date, else "". */
export function isoFromParts({ day, month, year }: Parts): string {
  if (!/^\d{1,2}$/.test(day.trim()) || !/^\d{1,2}$/.test(month.trim()) || !/^\d{4}$/.test(year.trim())) return '';
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return '';
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

