import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/**
 * Evaluates `expr` with `host` and `root`. v2 is light DOM, so `root` is the host itself; the
 * picker (popover or sheet) is a child of the host too.
 */
function inner<T = unknown>(page: E2EPage, expr: string, selector = '#d'): Promise<T> {
  return page.evaluate(
    (sel: string, e: string) => {
      const host = document.querySelector(sel)!;
      const root = Object.assign(Object.create(host), {
        getElementById: (id: string) => host.querySelector(`[id$="-${id}"]`),
        get activeElement() {
          const a = document.activeElement;
          return a && host.contains(a) ? a : null;
        },
      });
      root.querySelector = (q: string) => host.querySelector(q);
      root.querySelectorAll = (q: string) => host.querySelectorAll(q);
      // eslint-disable-next-line no-new-func
      return new Function('host', 'root', `return (${e});`)(host, root);
    },
    selector,
    expr,
  ) as Promise<T>;
}

const focused = (page: E2EPage) => inner<string | null>(page, `root.activeElement && (root.activeElement.dataset.date || root.activeElement.getAttribute('aria-label') || root.activeElement.id)`);

const field = (attrs = '', lang: 'en' | 'ar' = 'en') =>
  `<main><h1>${lang === 'en' ? 'Payments' : 'المدفوعات'}</h1><form><sc-date-range id="d" name="payments" label="${lang === 'en' ? 'Show payments between' : 'عرض المدفوعات بين'}" hint="${lang === 'en' ? 'For example, 21 9 2026' : 'مثلًا، 21 9 2026'}" today="2026-10-19" ${attrs}></sc-date-range></form></main>`;

const formData = (page: E2EPage) => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));

async function openWithKeyboard(page: E2EPage) {
  await inner(page, `root.querySelector('.sc-date-range__calendar-button').focus()`);
  await page.keyboard.press('Enter');
  await page.waitForChanges();
  await page.waitForFunction(() => {
    const host = document.querySelector('#d')!;
    return host.contains(document.activeElement) && document.activeElement!.classList.contains('sc-date-range__day-button');
  });
}

describe('sc-date-range (e2e)', () => {
  it('exposes a named group with two named, described segments and a dialog button', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    const group = await page.accessibility.snapshot({ root: (await page.evaluateHandle(() => document.querySelector('#d')!.querySelector('fieldset'))) as never, interestingOnly: false });
    expect(group!.role).toBe('group');
    expect(group!.name).toBe('Show payments between');
    const node = async (q: string) => page.accessibility.snapshot({ root: (await page.evaluateHandle((s: string) => document.querySelector('#d')!.querySelector(s), q)) as never, interestingOnly: false });
    const start = await node('[id$="-start"]');
    expect([start!.name, start!.description, start!.value]).toEqual(['Start date', 'For example, 21 9 2026', '21 Sep 2026']);
    const end = await node('[id$="-end"]');
    expect([end!.name, end!.value]).toEqual(['End date', '9 Oct 2026']);
    const button = await node('.sc-date-range__calendar-button');
    expect(button!.name).toBe('Choose dates, 21 September to 9 October 2026');
    expect(button!.haspopup).toBe('dialog');
    expect(button!.expanded).toBe(false);
  });

  it('submits name-start and name-end as ISO dates, commits typed dates on blur and resets', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-21', 'payments-end': '2026-10-09' });
    const change = await page.spyOnEvent('scChange');
    await page.keyboard.press('Tab');
    await inner(page, `(root.getElementById('start').select(), true)`);
    await page.keyboard.type('1/9/2026');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ start: '2026-09-01', end: '2026-10-09' });
    expect(await inner(page, `root.getElementById('start').value`)).toBe('1 Sep 2026');
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-01', 'payments-end': '2026-10-09' });
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await inner(page, `root.getElementById('start').value`)).toBe('21 Sep 2026');
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-21', 'payments-end': '2026-10-09' });
  });

  it('shows "end before start" on blur without swapping, and reports validity', async () => {
    const page = await newScPage(field('required'));
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('.sc-field__error').textContent`)).toBe('Error: Enter a start date');
    expect(await focused(page)).toBe('Start date');
    await page.keyboard.type('9-10-2026');
    await page.keyboard.press('Tab');
    await page.keyboard.type('21 9 2026');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('.sc-field__error').textContent`)).toBe('Error: The end date must be the same as or after the start date');
    expect(await inner(page, `[root.getElementById('start').getAttribute('aria-invalid'), root.getElementById('end').getAttribute('aria-invalid')]`)).toEqual([null, 'true']);
    expect(await inner(page, `[root.getElementById('start').value, root.getElementById('end').value]`)).toEqual(['9 Oct 2026', '21 Sep 2026']);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    expect(await formData(page)).toEqual({ 'payments-start': '2026-10-09', 'payments-end': '2026-09-21' });
    await inner(page, `(root.getElementById('start').focus(), root.getElementById('start').select(), true)`);
    await page.keyboard.type('31/2/2026');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('.sc-field__error').textContent`)).toBe('Error: The start date must be a real date');
    expect(await formData(page)).toEqual({ 'payments-start': '', 'payments-end': '2026-09-21' });
  });

  it('opens on Enter, focuses the start date, and moves by day, week, month and year from the keyboard', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09" months="2"'));
    const open = await page.spyOnEvent('scOpen');
    await openWithKeyboard(page);
    expect(open).toHaveReceivedEventTimes(1);
    expect(await inner(page, `root.querySelector('.sc-date-range__calendar-button').getAttribute('aria-expanded')`)).toBe('true');
    expect(await inner(page, `root.querySelector('.sc-date-range__picker--popover').matches(':popover-open')`)).toBe(true);
    expect(await focused(page)).toBe('2026-09-21');
    const steps: [string, string][] = [
      ['ArrowRight', '2026-09-22'],
      ['ArrowLeft', '2026-09-21'],
      ['ArrowDown', '2026-09-28'],
      ['ArrowUp', '2026-09-21'],
      ['End', '2026-09-27'],
      ['Home', '2026-09-21'],
      ['PageDown', '2026-10-21'],
      ['PageUp', '2026-09-21'],
    ];
    for (const [key, date] of steps) {
      await page.keyboard.press(key as never);
      await page.waitForChanges();
      expect([key, await focused(page)]).toEqual([key, date]);
    }
    await page.keyboard.down('Shift');
    await page.keyboard.press('PageDown');
    await page.keyboard.up('Shift');
    await page.waitForChanges();
    expect(await focused(page)).toBe('2027-09-21');
    // Keyboard month changes are instant: nothing animates.
    expect(await inner(page, `root.querySelector('.sc-date-range__months').getAnimations().length`)).toBe(0);
    // Moving past the last visible month brings it in as the last month.
    expect(await inner(page, `[...root.querySelectorAll('.sc-date-range__month-title')].map((h) => h.textContent)`)).toEqual(['August 2027', 'September 2027']);
  });

  it('moves visually in right to left: Left is the next day, Monday is the rightmost column', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"', 'ar'), { lang: 'ar' });
    await openWithKeyboard(page);
    await page.keyboard.press('ArrowLeft');
    await page.waitForChanges();
    expect(await focused(page)).toBe('2026-09-22');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForChanges();
    expect(await focused(page)).toBe('2026-09-20');
    const x = (date: string) => inner<number>(page, `root.querySelector('[data-date="${date}"]').getBoundingClientRect().left`);
    // 21 Sep 2026 is a Monday; 27 Sep is the Sunday of that week.
    expect(await x('2026-09-21')).toBeGreaterThan(await x('2026-09-27'));
    const heads = await inner<string[]>(page, `[...root.querySelector('.sc-date-range__grid thead tr').children].map((th) => th.getAttribute('abbr'))`);
    expect(heads[0]).toBe('الاثنين');
    const weekdayX = await inner<number[]>(page, `[...root.querySelector('.sc-date-range__grid thead tr').children].map((th) => th.getBoundingClientRect().left)`);
    expect(weekdayX[0]).toBe(Math.max(...weekdayX));
    // The previous-month button is on the right, the next on the left; chevrons and the segment arrow mirror.
    const prev = await inner<number>(page, `root.querySelector('.sc-date-range__nav--prev').getBoundingClientRect().left`);
    const next = await inner<number>(page, `root.querySelector('.sc-date-range__nav--next').getBoundingClientRect().left`);
    expect(prev).toBeGreaterThan(next);
    expect(await inner(page, `getComputedStyle(root.querySelector('.sc-date-range__nav--prev svg')).transform`)).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await inner(page, `getComputedStyle(root.querySelector('.sc-date-range__range-arrow')).transform`)).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await inner(page, `root.querySelector('[data-date="2026-09-21"]').getAttribute('aria-label')`)).toBe('الاثنين 21 سبتمبر 2026');
    // The start segment is on the right of the end segment, the calendar button on the left.
    const startX = await inner<number>(page, `root.getElementById('start').getBoundingClientRect().left`);
    const endX = await inner<number>(page, `root.getElementById('end').getBoundingClientRect().left`);
    const buttonX = await inner<number>(page, `root.querySelector('.sc-date-range__calendar-button').getBoundingClientRect().left`);
    expect(startX).toBeGreaterThan(endX);
    expect(endX).toBeGreaterThan(buttonX);
  });

  it('chooses a range with Enter, announces it, and applies it to the field', async () => {
    const page = await newScPage(field('max="2026-10-19"'));
    const change = await page.spyOnEvent('scChange');
    await openWithKeyboard(page);
    expect(await focused(page)).toBe('2026-10-19');
    expect(await inner(page, `root.querySelector('[data-date="2026-10-19"]').getAttribute('aria-label')`)).toBe('Monday 19 October 2026, today');
    expect(await inner(page, `root.querySelector('[data-date="2026-10-19"]').getAttribute('aria-current')`)).toBe('date');
    expect(await inner(page, `root.querySelector('[data-date="2026-10-20"]').getAttribute('aria-disabled')`)).toBe('true');
    expect(await inner(page, `root.querySelector('.sc-date-range__nav--next').disabled`)).toBe(true);
    expect(await inner(page, `root.querySelector('.sc-date-range__foot-actions sc-button[variant="primary"]').textContent`)).toBe('Choose a start date');
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowUp');
    await page.waitForChanges();
    expect(await focused(page)).toBe('2026-09-21');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('[aria-live]').textContent`)).toBe('Start date 21 September 2026. Now choose an end date.');
    expect(await inner(page, `root.querySelector('.sc-date-range__foot-actions sc-button[variant="primary"]').textContent`)).toBe('Choose an end date');
    for (let i = 0; i < 18; i++) await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toBe('2026-10-09');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('[aria-live]').textContent`)).toBe('21 September to 9 October 2026, 19 days.');
    expect(await inner(page, `root.querySelector('.sc-date-range__summary').textContent`)).toBe('21 Sep – 9 Oct 2026 · 19 days');
    expect(await inner(page, `[...root.querySelectorAll('td[aria-selected="true"] button')].length`)).toBe(19);
    await inner(page, `root.querySelector('.sc-date-range__foot-actions sc-button[variant="primary"]').click()`);
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ start: '2026-09-21', end: '2026-10-09' });
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-21', 'payments-end': '2026-10-09' });
    expect(await focused(page)).toBe('Choose dates, 21 September to 9 October 2026');
    expect(await inner(page, `root.querySelector('.sc-date-range__picker--popover').matches(':popover-open')`)).toBe(false);
  });

  it('closes on Escape without changing the field, returning focus to the calendar button', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    const close = await page.spyOnEvent('scClose');
    await openWithKeyboard(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(close).toHaveReceivedEventTimes(1);
    expect(await focused(page)).toBe('Choose dates, 21 September to 9 October 2026');
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-21', 'payments-end': '2026-10-09' });
  });

  it('picks with the pointer: a day before the start restarts, presets apply at once, max-days disables days', async () => {
    const page = await newScPage(field('months="2" presets max-days="10" max="2026-10-19"'));
    await inner(page, `root.querySelector('.sc-date-range__calendar-button').click()`);
    await page.waitForChanges();
    await page.waitForFunction(() => document.querySelector('#d')!.querySelector('.sc-date-range__picker--popover:popover-open'));
    const click = async (date: string) => {
      await inner(page, `root.querySelector('[data-date="${date}"]').click()`);
      await page.waitForChanges();
    };
    const pending = () => inner<string[]>(page, `[...root.querySelectorAll('.sc-date-range__day-button--end')].map((b) => b.dataset.date)`);
    await click('2026-10-10');
    await click('2026-10-05');
    expect(await pending()).toEqual(['2026-10-05']);
    expect(await inner(page, `root.querySelector('[data-date="2026-10-15"]').getAttribute('aria-disabled')`)).toBe('true');
    expect(await inner(page, `root.querySelector('.sc-date-range__summary').textContent`)).toBe('You can choose up to 10 days');
    await click('2026-10-14');
    expect(await pending()).toEqual(['2026-10-05', '2026-10-14']);
    await click('2026-10-01');
    expect(await pending()).toEqual(['2026-10-01']);
    const presets = await inner<string[]>(page, `[...root.querySelectorAll('.sc-date-range__preset')].map((b) => b.textContent)`);
    expect(presets).toEqual(['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Last month', 'This year']);
    await inner(page, `root.querySelectorAll('.sc-date-range__preset')[1].click()`);
    await page.waitForChanges();
    expect(await pending()).toEqual(['2026-10-13', '2026-10-19']);
    expect(await inner(page, `root.querySelectorAll('.sc-date-range__preset')[1].getAttribute('aria-pressed')`)).toBe('true');
    expect(await inner(page, `root.querySelector('.sc-date-range__picker--popover').matches(':popover-open')`)).toBe(true);
    expect(await inner(page, `[...root.querySelectorAll('.sc-date-range__month-title')].map((h) => h.textContent)`)).toEqual(['September 2026', 'October 2026']);
    // Pointer month change crossfades with a shift in the direction of travel (WAAPI, so a
    // second click retargets the running animation instead of stacking or restarting it).
    await page.evaluate(() => {
      const w = window as unknown as { slides: string[] };
      w.slides = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (this: Element, frames: Keyframe[], options?: number | KeyframeAnimationOptions) {
        if (this.classList.contains('sc-date-range__months')) w.slides.push(String(frames[0].transform));
        return animate.call(this, frames, options);
      };
    });
    await inner(page, `root.querySelector('.sc-date-range__nav--prev').click()`);
    await page.waitForChanges();
    await inner(page, `root.querySelector('.sc-date-range__nav--next').click()`);
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { slides: string[] }).slides)).toEqual(['translateX(-12px)', 'translateX(12px)']);
    expect(await inner(page, `root.querySelector('.sc-date-range__months').getAnimations().length`)).toBeLessThanOrEqual(1);
    // A click outside closes it without changing the field.
    await page.mouse.click(5, 5);
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('.sc-date-range__picker--popover').matches(':popover-open')`)).toBe(false);
    expect(await formData(page)).toEqual({ 'payments-start': '', 'payments-end': '' });
  });

  it('opens as a modal bottom sheet below 600px', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    await page.setViewport({ width: 375, height: 812 });
    await openWithKeyboard(page);
    const sheet = await inner<[boolean, boolean, string]>(page, `(() => { const d = root.querySelector('dialog'); return [d.open, d.matches(':modal'), root.querySelector('.sc-date-range__sheet-title').textContent]; })()`);
    expect(sheet).toEqual([true, true, 'Choose dates']);
    expect(await focused(page)).toBe('2026-09-21');
    // The "To" chip says the next tap sets the end.
    await inner(page, `root.querySelectorAll('.sc-date-range__chip')[1].click()`);
    await page.waitForChanges();
    await inner(page, `root.querySelector('[data-date="2026-10-12"]').click()`);
    await page.waitForChanges();
    expect(await inner(page, `[...root.querySelectorAll('.sc-date-range__chip-value')].map((c) => c.textContent)`)).toEqual(['21 Sep', '12 Oct']);
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await inner(page, `root.querySelector('dialog').open`)).toBe(false);
    expect(await formData(page)).toEqual({ 'payments-start': '2026-09-21', 'payments-end': '2026-10-09' });
  });

  it('re-renders its strings when the language changes', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    await setPageContext(page, { lang: 'ar' });
    await page.waitForChanges();
    expect(await inner(page, `[...root.querySelectorAll('.sc-date-range__segment-label')].map((l) => l.textContent)`)).toEqual(['من', 'إلى']);
    expect(await inner(page, `root.querySelector('.sc-date-range__calendar-button').getAttribute('aria-label')`)).toBe('اختيار التاريخين، من 21 سبتمبر إلى 9 أكتوبر 2026');
  });

  for (const ctx of contexts) {
    it(`has no axe violations, closed and open (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(
        `${field('start="2026-09-21" end="2026-10-09" max="2026-10-19" presets', ctx.lang)}
        <sc-date-range label="Dates" error="Choose a range of 90 days or fewer" start="2026-01-01" end="2026-10-19"></sc-date-range>
        <sc-date-range label="Dates" optional disabled></sc-date-range>`,
        ctx,
      );
      await expectNoAxeViolations(page);
      await openWithKeyboard(page);
      await expectNoAxeViolations(page);
    });
  }

  it('is light DOM with a 56px field frame, hidden ISO inputs and one change per committed range', async () => {
    const page = await newScPage(field('start="2026-09-21" end="2026-10-09"'));
    expect(await inner(page, `host.shadowRoot`)).toBeNull();
    expect(await inner(page, `Math.round(root.querySelector('.sc-date-range__frame').getBoundingClientRect().height)`)).toBe(56);
    expect(await inner(page, `[...host.querySelectorAll('input[type=hidden]')].map((i) => i.name + '=' + i.value)`)).toEqual(['payments-start=2026-09-21', 'payments-end=2026-10-09']);
    await page.evaluate(() => {
      const w = window as unknown as { changes: number };
      w.changes = 0;
      document.getElementById('d')!.addEventListener('change', () => w.changes++);
    });
    await page.evaluate(() => (document.getElementById('d') as HTMLElement).focus());
    expect(await focused(page)).toBe('Start date');
    await inner(page, `(root.getElementById('start').select(), true)`);
    await page.keyboard.type('1/9/2026');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(1);
  });

  it('slides the sheet up on the drawer easing and fades the scrim', async () => {
    const page = await newScPage(field());
    await page.setViewport({ width: 375, height: 812 });
    await openWithKeyboard(page);
    const motion = await inner<string[]>(page, `((s) => [s.transitionTimingFunction.match(/^(cubic-bezier\\([^)]*\\)|[\\w-]+)/)[0], s.transitionDuration.split(', ')[0]])(getComputedStyle(root.querySelector('dialog')))`);
    const drawer = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sc-easing-drawer').trim());
    expect(motion[0].replace(/\s/g, '')).toBe(drawer.replace(/\s/g, ''));
    expect(motion[1]).toBe('0.28s');
  });

  it('marks applied preset chips with a check, 40px tall', async () => {
    const page = await newScPage(field('presets max="2026-10-19"'));
    await openWithKeyboard(page);
    await inner(page, `root.querySelectorAll('.sc-date-range__preset')[1].click()`);
    await page.waitForChanges();
    expect(await inner(page, `[...root.querySelectorAll('.sc-date-range__preset')].map((p) => !!p.querySelector('svg'))`)).toEqual([false, true, false, false, false, false]);
    expect(await inner(page, `Math.round(root.querySelector('.sc-date-range__preset').getBoundingClientRect().height)`)).toBe(40);
  });
});

describeAxe(
  'sc-date-range',
  `<main><h1>Payments</h1><form>
    <sc-date-range name="payments" label="Show payments between" hint="For example, 21 9 2026" start="2026-09-21" end="2026-10-09" today="2026-10-19"></sc-date-range>
    <sc-date-range label="Dates" error="Choose a range of 90 days or fewer" error-parts="end" start="2026-01-01" end="2026-10-19" today="2026-10-19"></sc-date-range>
    <sc-date-range label="Dates" optional disabled today="2026-10-19"></sc-date-range>
  </form></main>`,
);
