import { newSpecPage } from '@stencil/core/testing';
import { ScFilterChips } from './sc-filter-chips';

const render = (html: string) => newSpecPage({ components: [ScFilterChips], html });

describe('sc-filter-chips (spec)', () => {
  it('renders one native button per filter from JSON, and "Clear all" from two filters', async () => {
    const page = await render(`<sc-filter-chips filters='[{"value":"a","label":"Housing"},{"value":"b","label":"Health"},{"value":"","x":1}]'></sc-filter-chips>`);
    expect(page.root!.shadowRoot).toBeNull();
    const chips = Array.from(page.body.querySelectorAll('.sc-filter-chips__chip'));
    expect(chips.map((c) => c.getAttribute('aria-label'))).toEqual(['Remove filter: Housing', 'Remove filter: Health']);
    expect(chips.every((c) => c.getAttribute('type') === 'button')).toBe(true);
    expect(page.body.querySelector('.sc-filter-chips__clear')!.textContent).toBe('Clear all filters');
  });

  it('hides the group when empty and drops "Clear all" for one filter or with no-clear', async () => {
    const empty = await render(`<sc-filter-chips></sc-filter-chips>`);
    expect(empty.body.querySelector('.sc-filter-chips')!.hasAttribute('hidden')).toBe(true);
    const one = await render(`<sc-filter-chips filters='[{"value":"a","label":"Housing"}]'></sc-filter-chips>`);
    expect(one.body.querySelector('.sc-filter-chips__clear')).toBeNull();
    const none = await render(`<sc-filter-chips no-clear filters='[{"value":"a","label":"A"},{"value":"b","label":"B"}]'></sc-filter-chips>`);
    expect(none.body.querySelector('.sc-filter-chips__clear')).toBeNull();
  });

  it('names the group, in Arabic too, and keeps a polite live region', async () => {
    const page = await render(`<div lang="ar"><sc-filter-chips filters='[{"value":"a","label":"السكن"}]'></sc-filter-chips></div>`);
    expect(page.body.querySelector('.sc-filter-chips')!.getAttribute('aria-label')).toBe('عوامل التصفية المطبّقة');
    expect(page.body.querySelector('.sc-filter-chips__chip')!.getAttribute('aria-label')).toBe('إزالة عامل التصفية: السكن');
    const live = page.body.querySelector('[aria-live]')!;
    expect([live.getAttribute('aria-live'), live.getAttribute('aria-atomic')]).toEqual(['polite', 'true']);
  });
});
