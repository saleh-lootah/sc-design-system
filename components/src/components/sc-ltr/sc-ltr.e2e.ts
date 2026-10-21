import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const MARKUP = `<main><p id="p" lang="ar" dir="rtl">رقم اللوحة <sc-ltr id="v">Dubai A 12345</sc-ltr> مسجل باسمك.</p></main>`;

describe('sc-ltr (e2e, CSS only)', () => {
  it('isolates its value left to right, like <bdi dir="ltr">, with no JS', async () => {
    const page = await newScPage(MARKUP, { lang: 'ar' });
    const r = await page.evaluate(() => {
      const el = document.querySelector('#v')!;
      const cs = getComputedStyle(el);
      return [customElements.get('sc-ltr') === undefined, cs.direction, cs.unicodeBidi, cs.display];
    });
    expect(r).toEqual([true, 'ltr', 'isolate', 'inline']);
  });

  it('keeps the Latin value in reading order inside Arabic text', async () => {
    const page = await newScPage(MARKUP, { lang: 'ar' });
    // "Dubai" is drawn to the left of "12345": the run reads left to right.
    const order = await page.evaluate(() => {
      const t = document.querySelector('#v')!.firstChild!;
      const range = document.createRange();
      range.setStart(t, 0);
      range.setEnd(t, 5);
      const dubai = range.getBoundingClientRect().left;
      range.setStart(t, 8);
      range.setEnd(t, 13);
      return dubai < range.getBoundingClientRect().left;
    });
    expect(order).toBe(true);
  });
});

describeAxe('sc-ltr', MARKUP);
