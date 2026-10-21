import { newSpecPage } from '@stencil/core/testing';
import { ScDateInput } from './sc-date-input';
import { isoFromParts, partsFromIso } from './date';

const render = (html: string) => newSpecPage({ components: [ScDateInput], html });

describe('sc-date-input (spec)', () => {
  it('renders a fieldset with three labelled boxes and the hidden ISO value in light DOM', async () => {
    const page = await render(`<sc-date-input name="start" label="Start date" value="2026-03-07"></sc-date-input>`);
    expect(page.root!.shadowRoot).toBeNull();
    const boxes = Array.from(page.body.querySelectorAll('input:not([type=hidden])')) as HTMLInputElement[];
    expect(boxes.map((b) => b.getAttribute('name'))).toEqual(['start-day', 'start-month', 'start-year']);
    expect(boxes.map((b) => b.getAttribute('value'))).toEqual(['7', '3', '2026']);
    expect(Array.from(page.body.querySelectorAll('.sc-date-input__part-label')).map((l) => l.textContent)).toEqual(['Day', 'Month', 'Year']);
    const hidden = page.body.querySelector('input[type=hidden]')!;
    expect([hidden.getAttribute('name'), hidden.getAttribute('value')]).toEqual(['start', '2026-03-07']);
    expect(page.body.querySelector('legend')!.textContent).toBe('Start date');
  });

  it('marks only the parts named in error-parts', async () => {
    const page = await render(`<sc-date-input label="Start" error="Include a year" error-parts="year"></sc-date-input>`);
    const boxes = Array.from(page.body.querySelectorAll('input'));
    expect(boxes.map((b) => b.getAttribute('aria-invalid'))).toEqual([null, null, 'true']);
  });

  it('uses Arabic part labels and autocomplete parts for a date of birth', async () => {
    const page = await render(`<div lang="ar"><sc-date-input label="تاريخ الميلاد" autocomplete="bday"></sc-date-input></div>`);
    expect(Array.from(page.body.querySelectorAll('.sc-date-input__part-label')).map((l) => l.textContent)).toEqual(['يوم', 'شهر', 'سنة']);
    expect(Array.from(page.body.querySelectorAll('input')).map((b) => b.getAttribute('autocomplete'))).toEqual(['bday-day', 'bday-month', 'bday-year']);
  });

  it('builds ISO dates only from real dates', () => {
    expect(isoFromParts({ day: '29', month: '2', year: '2028' })).toBe('2028-02-29');
    expect(isoFromParts({ day: '29', month: '2', year: '2026' })).toBe('');
    expect(partsFromIso('2026-03-07')).toEqual({ day: '7', month: '3', year: '2026' });
  });
});
