import { newSpecPage } from '@stencil/core/testing';
import { addDays, addMonths, fromIso, lengthInDays, monthGrid, parseTyped, weekday } from './dates';
import { ScDateRange } from './sc-date-range';

const root = (el: Element) => el.shadowRoot!;
const NAMES = [
  'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
  'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر'.split(','),
];

describe('date helpers', () => {
  it('parses typed dates day first, in every accepted form', () => {
    for (const text of ['21/9/2026', '21 9 2026', '21-09-2026', '21.9.2026', '21 Sep 2026', '21 September 2026', '21 سبتمبر 2026', '٢١/٩/٢٠٢٦']) {
      expect([text, parseTyped(text, NAMES)]).toEqual([text, '2026-09-21']);
    }
    expect(parseTyped('', NAMES)).toBe('');
    expect(parseTyped('31/2/2026', NAMES)).toBeNull();
    expect(parseTyped('29/2/2028', NAMES)).toBe('2028-02-29');
    expect(parseTyped('21/9/26', NAMES)).toBeNull();
    expect(parseTyped('tomorrow', NAMES)).toBeNull();
  });

  it('does UTC date arithmetic, Monday first', () => {
    expect(addDays('2026-12-28', 6)).toBe('2027-01-03');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-03-15', -12)).toBe('2025-03-15');
    expect(weekday('2026-09-21')).toBe(0); // Monday
    expect(weekday('2026-08-01')).toBe(5); // Saturday
    expect(lengthInDays('2026-09-21', '2026-10-09')).toBe(19);
    expect(lengthInDays('2026-10-09', '2026-10-09')).toBe(1);
    expect(lengthInDays('2026-01-01', '2026-12-31')).toBe(365);
    expect(fromIso('2026-02-30')).toBeNull();
  });

  it('always lays out 6 weeks, with blanks outside the month', () => {
    const august = monthGrid({ year: 2026, month: 7 });
    expect(august.length).toBe(42);
    expect(august.slice(0, 6)).toEqual(['', '', '', '', '', '2026-08-01']);
    expect(august[35]).toBe('2026-08-31');
    expect(august.slice(36)).toEqual(['', '', '', '', '', '']);
    expect(monthGrid({ year: 2026, month: 1 }).length).toBe(42);
  });
});

describe('sc-date-range (spec)', () => {
  it('renders a fieldset with a legend, two labelled numeric segments and a calendar button', async () => {
    const page = await newSpecPage({
      components: [ScDateRange],
      html: `<sc-date-range label="Show payments between" hint="For example, 21 9 2026" start="2026-09-21" end="2026-10-09"></sc-date-range>`,
    });
    const r = root(page.root!);
    expect(r.querySelector('legend')!.textContent).toBe('Show payments between');
    const inputs = Array.from(r.querySelectorAll('input'));
    expect(inputs.map((i) => [i.id, i.getAttribute('aria-label'), i.getAttribute('inputmode'), i.getAttribute('aria-describedby'), i.getAttribute('value')])).toEqual([
      ['start', 'Start date', 'numeric', 'hint', '21 Sep 2026'],
      ['end', 'End date', 'numeric', 'hint', '9 Oct 2026'],
    ]);
    expect(Array.from(r.querySelectorAll('.segment-label')).map((l) => l.textContent)).toEqual(['From', 'To']);
    const button = r.querySelector('.calendar-button')!;
    expect(button.getAttribute('aria-label')).toBe('Choose dates, 21 September to 9 October 2026');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('names everything in Arabic, with Latin digits', async () => {
    const page = await newSpecPage({
      components: [ScDateRange],
      html: `<div lang="ar" dir="rtl"><sc-date-range label="عرض المدفوعات بين" start="2026-09-21" end="2026-10-09"></sc-date-range></div>`,
    });
    const r = root(page.body.querySelector('sc-date-range')!);
    expect(Array.from(r.querySelectorAll('.segment-label')).map((l) => l.textContent)).toEqual(['من', 'إلى']);
    expect(Array.from(r.querySelectorAll('input')).map((i) => i.getAttribute('value'))).toEqual(['21 سبتمبر 2026', '9 أكتوبر 2026']);
    expect(r.querySelector('.calendar-button')!.getAttribute('aria-label')).toBe('اختر التاريخين، من 21 سبتمبر إلى 9 أكتوبر 2026');
  });

  it('marks only the segment named by error-parts', async () => {
    const page = await newSpecPage({
      components: [ScDateRange],
      html: `<sc-date-range label="Dates" error="The end date must be the same as or after the start date" error-parts="end"></sc-date-range>`,
    });
    const r = root(page.root!);
    expect(Array.from(r.querySelectorAll('input')).map((i) => i.getAttribute('aria-invalid'))).toEqual([null, 'true']);
    expect(r.querySelector('fieldset')!.classList.contains('field--error')).toBe(true);
    expect(r.querySelector('.error')!.textContent).toContain('Error: The end date must be the same as or after the start date');
    expect(r.querySelector('.frame')!.classList.contains('frame--error')).toBe(false);
  });

  it('ignores a start or end that is not a real ISO date', async () => {
    const page = await newSpecPage({ components: [ScDateRange], html: `<sc-date-range label="Dates" start="2026-02-30" end="21/9/2026"></sc-date-range>` });
    expect(page.root!.getAttribute('start')).toBe('');
    expect((page.root as HTMLElement & { start: string }).start).toBe('');
    expect(Array.from(root(page.root!).querySelectorAll('input')).map((i) => i.getAttribute('placeholder'))).toEqual(['Start date', 'End date']);
  });

  it('shows "(optional)" and disables both segments and the button', async () => {
    const page = await newSpecPage({ components: [ScDateRange], html: `<sc-date-range label="Permit dates" optional disabled></sc-date-range>` });
    const r = root(page.root!);
    expect(r.querySelector('.optional')!.textContent).toBe(' (optional)');
    expect(r.querySelector('fieldset')!.hasAttribute('disabled')).toBe(true);
  });
});
