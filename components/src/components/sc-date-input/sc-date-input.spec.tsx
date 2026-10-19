import { newSpecPage } from '@stencil/core/testing';
import { isoFromParts, partsFromIso } from './date';
import { ScDateInput } from './sc-date-input';

const root = (el: Element) => el.shadowRoot!;

describe('sc-date-input (spec)', () => {
  it('parses and builds ISO dates, rejecting dates that do not exist', () => {
    expect(partsFromIso('2026-03-07')).toEqual({ day: '7', month: '3', year: '2026' });
    expect(partsFromIso('7/3/2026')).toEqual({ day: '', month: '', year: '' });
    expect(isoFromParts({ day: '7', month: '3', year: '2026' })).toBe('2026-03-07');
    expect(isoFromParts({ day: '29', month: '2', year: '2028' })).toBe('2028-02-29');
    expect(isoFromParts({ day: '29', month: '2', year: '2026' })).toBe('');
    expect(isoFromParts({ day: '31', month: '4', year: '2026' })).toBe('');
    expect(isoFromParts({ day: '7', month: '3', year: '26' })).toBe('');
    expect(isoFromParts({ day: 'a', month: '3', year: '2026' })).toBe('');
  });

  it('renders a fieldset with legend and three labelled numeric inputs, Day first', async () => {
    const page = await newSpecPage({ components: [ScDateInput], html: `<sc-date-input label="Date of birth" hint="For example, 27 3 1990" value="1990-03-27"></sc-date-input>` });
    const r = root(page.root!);
    const fieldset = r.querySelector('fieldset')!;
    expect(fieldset.getAttribute('role')).toBe('group');
    expect(fieldset.getAttribute('aria-describedby')).toBe('hint');
    expect(fieldset.querySelector('legend')!.textContent).toBe('Date of birth');
    const inputs = Array.from(r.querySelectorAll('input'));
    expect(inputs.map((i) => i.id)).toEqual(['day', 'month', 'year']);
    expect(inputs.map((i) => i.getAttribute('inputmode'))).toEqual(['numeric', 'numeric', 'numeric']);
    expect(inputs.map((i) => i.getAttribute('value'))).toEqual(['27', '3', '1990']);
    expect(Array.from(r.querySelectorAll('label')).map((l) => [l.getAttribute('for'), l.textContent])).toEqual([
      ['day', 'Day'],
      ['month', 'Month'],
      ['year', 'Year'],
    ]);
  });

  it('labels the parts يوم / شهر / سنة in Arabic', async () => {
    const page = await newSpecPage({ components: [ScDateInput], html: `<div lang="ar" dir="rtl"><sc-date-input label="تاريخ الميلاد"></sc-date-input></div>` });
    const r = root(page.body.querySelector('sc-date-input')!);
    expect(Array.from(r.querySelectorAll('label')).map((l) => l.textContent)).toEqual(['يوم', 'شهر', 'سنة']);
  });

  it('highlights only the parts named in error-parts', async () => {
    const page = await newSpecPage({ components: [ScDateInput], html: `<sc-date-input label="Start date" error="The date must include a year" error-parts="year"></sc-date-input>` });
    const r = root(page.root!);
    expect(r.querySelector('fieldset')).toHaveClass('field--error');
    expect(Array.from(r.querySelectorAll('input')).map((i) => i.getAttribute('aria-invalid'))).toEqual([null, null, 'true']);
    expect(Array.from(r.querySelectorAll('.frame')).map((f) => f.classList.contains('frame--error'))).toEqual([false, false, true]);
  });

  it('highlights every part when the error does not name one', async () => {
    const page = await newSpecPage({ components: [ScDateInput], html: `<sc-date-input label="Date of birth" error="Enter your date of birth"></sc-date-input>` });
    expect(Array.from(root(page.root!).querySelectorAll('input')).map((i) => i.getAttribute('aria-invalid'))).toEqual(['true', 'true', 'true']);
  });

  it('turns on bday autofill per part', async () => {
    const page = await newSpecPage({ components: [ScDateInput], html: `<sc-date-input label="Date of birth" autocomplete="bday"></sc-date-input>` });
    expect(Array.from(root(page.root!).querySelectorAll('input')).map((i) => i.getAttribute('autocomplete'))).toEqual(['bday-day', 'bday-month', 'bday-year']);
  });
});
