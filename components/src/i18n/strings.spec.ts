import * as parts from './components/index';
import { duplicateKeys, format, strings, toLang, translate } from './strings';
import { toLatinDigits } from './digits';

describe('strings', () => {
  it('has no key defined in two files', () => {
    expect(duplicateKeys).toEqual([]);
  });

  it('has a non-empty Arabic string for every English key', () => {
    for (const key of Object.keys(strings.en)) {
      expect([key, typeof strings.ar[key as keyof typeof strings.ar]]).toEqual([key, 'string']);
      expect(strings.ar[key as keyof typeof strings.ar].trim()).not.toBe('');
    }
  });

  it('uses the same placeholders in both languages', () => {
    const names = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(strings.en) as (keyof typeof strings.en)[]) {
      expect([key, names(strings.ar[key])]).toEqual([key, names(strings.en[key])]);
    }
  });

  it('merges every file listed in components/index.ts', () => {
    for (const part of Object.values(parts)) {
      for (const key of Object.keys(part.en)) expect(key in strings.en).toBe(true);
    }
  });

  it('fills placeholders with Latin digits', () => {
    expect(format('Step {current} of {total}', { current: 2, total: 4 })).toBe('Step 2 of 4');
    expect(translate('ar', 'step', { current: 2, total: 4 })).toBe('الخطوة 2 من 4');
    expect(format('{missing} stays', {})).toBe('{missing} stays');
  });

  it('normalises language tags', () => {
    expect(toLang('ar-AE')).toBe('ar');
    expect(toLang('en-GB')).toBe('en');
    expect(toLang('')).toBe('en');
    expect(toLang(null)).toBe('en');
  });
  // CNT-11: Arabic interface text uses verbal nouns and "يُرجى", never an imperative or a
  // second-person verb marked for gender. Channel names are proper names and exempt.
  it('has no Arabic imperative or gender-marked second-person verb', () => {
    const forbidden = /(^|[^\u0621-\u064A])(أدخل|اختر|حدّد|حدد|انتقل|ابدأ|تابع|ادفع|أرسل|اضغط|انقر|راجع|تريد|تحتاج|حاول)(?=[^\u0621-\u064A]|$)/;
    const channelNames = /^channel[A-Z]/;
    for (const [key, value] of Object.entries(strings.ar)) {
      if (channelNames.test(key)) continue;
      expect([key, forbidden.test(value)]).toEqual([key, false]);
    }
  });

  // LANG-20: no Arabic-Indic digits in any string.
  it('has only Latin digits', () => {
    for (const [key, value] of Object.entries(strings.ar)) expect([key, /[\u0660-\u0669\u06f0-\u06f9]/.test(value)]).toEqual([key, false]);
  });

  // LANG-22A: a range of numbers is written with a word in Arabic, not a dash.
  it('writes the date range summary with words in Arabic', () => {
    expect(translate('en', 'dateRangeSummary', { start: '1', end: '31 Oct 2026' })).toBe('1 – 31 Oct 2026');
    expect(translate('ar', 'dateRangeSummary', { start: '1', end: '31 أكتوبر 2026' })).toBe('من 1 إلى 31 أكتوبر 2026');
    for (const [key, value] of Object.entries(strings.ar)) expect([key, /[\d}]\s*[–—-]\s*[\d{]/.test(value)]).toEqual([key, false]);
  });
});

describe('toLatinDigits', () => {
  it('turns Arabic-Indic and Eastern Arabic-Indic digits into Latin digits (LANG-21)', () => {
    expect(toLatinDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    expect(toLatinDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789');
  });

  it('changes no other character', () => {
    expect(toLatinDigits('784-١٩٩٠-1234567-١')).toBe('784-1990-1234567-1');
    expect(toLatinDigits('Dubai A ١٢٣٤٥')).toBe('Dubai A 12345');
    expect(toLatinDigits('١٬٢٥٠٫٠٠ درهم')).toBe('1٬250٫00 درهم');
    expect(toLatinDigits('شارع ٢ب')).toBe('شارع 2ب');
  });
});

