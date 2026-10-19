import * as parts from './components/index';
import { duplicateKeys, format, strings, toLang, translate } from './strings';

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
});
