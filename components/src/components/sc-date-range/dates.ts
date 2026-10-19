/**
 * Date helpers for sc-date-range (kept out of the component module, which may only export
 * the class). Dates are ISO strings ("2026-09-21") and are computed in UTC, so time zones
 * and daylight saving never shift a day. The calendar is Gregorian; weeks start on Monday.
 */

import { toLatinDigits } from '../../i18n/digits';

export interface YearMonth {
  year: number;
  /** 0–11 */
  month: number;
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

export function toIso(date: Date): string {
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** A Date at UTC midnight, or null when `iso` isn't a real date. */
export function fromIso(iso: string | undefined | null): Date | null {
  const m = ISO.exec(iso ?? '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  date.setUTCFullYear(y);
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function isIso(iso: string | undefined | null): iso is string {
  return !!fromIso(iso);
}

export function isoFromParts(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(year);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return toIso(date);
}

/** Today in the browser's time zone, as ISO. */
export function todayIso(): string {
  const now = new Date();
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function addDays(iso: string, days: number): string {
  const date = fromIso(iso)!;
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

/** Adds months, clamping the day to the target month's length (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(iso: string, months: number): string {
  const date = fromIso(iso)!;
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  date.setUTCDate(Math.min(day, daysInMonth(ym(date))));
  return toIso(date);
}

export function ym(date: Date): YearMonth {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

export function ymOf(iso: string): YearMonth {
  return ym(fromIso(iso)!);
}

export function shiftMonth({ year, month }: YearMonth, by: number): YearMonth {
  const total = year * 12 + month + by;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export function compareMonth(a: YearMonth, b: YearMonth): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

export function daysInMonth({ year, month }: YearMonth): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function firstOfMonth({ year, month }: YearMonth): string {
  return `${pad(year, 4)}-${pad(month + 1)}-01`;
}

export function lastOfMonth(m: YearMonth): string {
  return `${pad(m.year, 4)}-${pad(m.month + 1)}-${pad(daysInMonth(m))}`;
}

/** Monday = 0 … Sunday = 6. */
export function weekday(iso: string): number {
  return (fromIso(iso)!.getUTCDay() + 6) % 7;
}

/** Days from a to b, inclusive (a range of one day is 1). */
export function lengthInDays(a: string, b: string): number {
  return Math.round((fromIso(b)!.getTime() - fromIso(a)!.getTime()) / 86400000) + 1;
}

/** 42 cells (6 weeks, Monday first): ISO dates for days in the month, '' for blanks. */
export function monthGrid(m: YearMonth): string[] {
  const first = firstOfMonth(m);
  const lead = weekday(first);
  const days = daysInMonth(m);
  const cells: string[] = [];
  for (let i = 0; i < 42; i++) {
    const day = i - lead + 1;
    cells.push(day >= 1 && day <= days ? `${first.slice(0, 8)}${pad(day)}` : '');
  }
  return cells;
}

export function clampIso(iso: string, min?: string, max?: string): string {
  if (min && isIso(min) && iso < min) return min;
  if (max && isIso(max) && iso > max) return max;
  return iso;
}

/**
 * Parses a typed date: "21/9/2026", "21 9 2026", "21-09-2026", "21.9.2026", and the formatted
 * forms "21 Sep 2026", "21 September 2026", "21 سبتمبر 2026". Day first, as in the UAE.
 * Returns the ISO date, '' for empty text, or null when it isn't a real date.
 */
export function parseTyped(text: string, monthNames: string[][]): string | null {
  const clean = toLatinDigits(text)
    .replace(/[‎‏؜]/g, '')
    .trim();
  if (!clean) return '';
  const parts = clean.split(/[\s/\-.,،]+/).filter(Boolean);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  let month = /^\d{1,2}$/.test(m) ? Number(m) : 0;
  if (!month) {
    const lower = m.toLowerCase();
    for (const names of monthNames) {
      const i = names.findIndex((name) => name.toLowerCase() === lower);
      if (i >= 0) month = i + 1;
    }
  }
  if (!/^\d{1,2}$/.test(d) || !/^\d{4}$/.test(y) || !month) return null;
  return isoFromParts(Number(y), month, Number(d)) || null;
}
