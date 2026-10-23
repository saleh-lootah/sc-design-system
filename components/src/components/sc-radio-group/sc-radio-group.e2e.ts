import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext, settleTransitions } from '../../test/page';
import { CHANNELS, axNode, forceColors, inner, token } from '../sc-text-input/field-test';

const radio = (page: E2EPage, sel: string, i: number, expr: string) => inner(page, sel, `((r) => ${expr})(host.querySelectorAll('input[type=radio]')[${i}])`);
const focused = (page: E2EPage, sel: string) => inner<number>(page, sel, '[...host.querySelectorAll("input")].indexOf(document.activeElement)');

const GROUP = `
  <form novalidate>
    <sc-radio-group id="issuer" name="issuer" label="Who issued the plate?" hint="It's shown on the plate">
      <sc-radio value="dubai">Dubai</sc-radio>
      <sc-radio value="abu-dhabi" hint="Including Al Ain">Abu Dhabi</sc-radio>
      <sc-radio value="other">Another emirate</sc-radio>
    </sc-radio-group>
    <button type="button" id="after">After</button>
  </form>`;

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    ${GROUP}
    <sc-radio-group label="Is the vehicle insured?" inline value="yes"><sc-radio value="yes">Yes</sc-radio><sc-radio value="no">No</sc-radio></sc-radio-group>
    <sc-radio-group label="Who issued the plate?" error="Select who issued the plate"><sc-radio value="dubai">Dubai</sc-radio><sc-radio value="other">Another emirate</sc-radio></sc-radio-group>
    <sc-radio-group label="Preferred language for SMS" optional><sc-radio value="ar">Arabic</sc-radio><sc-radio value="ur" disabled hint="Coming soon">Urdu</sc-radio></sc-radio-group>
    <sc-radio-group label="Do you want to renew for 1 or 2 years?" heading-level="2" value="1"><sc-radio value="1">1 year</sc-radio><sc-radio value="2">2 years</sc-radio></sc-radio-group>
    <sc-radio-group label="Delivery" disabled><sc-radio value="a">Courier</sc-radio></sc-radio-group>
  </main>`;

describe('sc-radio-group (e2e)', () => {
  it('exposes a radiogroup named by the legend, with native radios named by their sc-radio content', async () => {
    const page = await newScPage(GROUP);
    expect(await inner(page, '#issuer', '[host.shadowRoot, host.querySelectorAll("fieldset input[type=radio]").length]')).toEqual([null, 3]);
    const group = await axNode(page, '#issuer', 'fieldset');
    expect(group!.role).toBe('radiogroup');
    expect(group!.name).toBe('Who issued the plate?');
    expect(group!.description).toBe("It's shown on the plate");
    const radios = (group!.children ?? []).flatMap(function walk(n): { role: string; name?: string; description?: string }[] {
      return n.role === 'radio' ? [n] : (n.children ?? []).flatMap(walk);
    });
    expect(radios.map((r) => r.name)).toEqual(['Dubai', 'Abu Dhabi', 'Another emirate']);
    expect(radios[1].description).toBe('Including Al Ain');
    expect(await radio(page, '#issuer', 1, 'r.name')).toBe('issuer');
  });

  it('is one Tab stop; arrow keys move and select; Tab leaves the group', async () => {
    const page = await newScPage(GROUP);
    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      const el = document.getElementById('issuer')!;
      el.addEventListener('scChange', (e) => w.events.push(`scChange:${(e as CustomEvent).detail.value}`));
      el.addEventListener('change', () => w.events.push('change'));
    });
    const data = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('issuer'));
    await page.keyboard.press('Tab');
    expect(await focused(page, '#issuer')).toBe(0);
    expect(await data()).toBeNull();
    await page.keyboard.press('ArrowDown');
    expect(await focused(page, '#issuer')).toBe(1);
    expect(await data()).toBe('abu-dhabi');
    await page.keyboard.press('ArrowDown');
    expect(await data()).toBe('other');
    await page.keyboard.press('ArrowUp');
    await page.waitForChanges();
    expect(await data()).toBe('abu-dhabi');
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('abu-dhabi');
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual(['scChange:abu-dhabi', 'change', 'scChange:other', 'change', 'scChange:abu-dhabi', 'change']);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('after');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    expect(await focused(page, '#issuer')).toBe(1);
  });

  it('selects with Space and by clicking the option text; the dot is the channel colour', async () => {
    const page = await newScPage(GROUP);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('dubai');
    await page.click('sc-radio[value="other"] label');
    await page.waitForChanges();
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('other');
    expect(await radio(page, '#issuer', 2, 'r.checked')).toBe(true);
    expect(await inner(page, 'sc-radio[value="other"]', 'getComputedStyle(q(".sc-choice__mark")).backgroundColor')).toBe(await token(page, 'body', '--sc-color-channel-action'));
  });

  it('moves with the arrow keys in Arabic too, and mirrors the layout', async () => {
    const page = await newScPage(`<sc-radio-group id="g" label="من أصدر اللوحة؟" error="يُرجى اختيار جهة إصدار اللوحة"><sc-radio value="dubai">دبي</sc-radio><sc-radio value="other">إمارة أخرى</sc-radio></sc-radio-group>`, { lang: 'ar' });
    expect(await inner(page, '#g', 'getComputedStyle(q("fieldset")).borderRightWidth')).toBe('4px');
    expect(await radio(page, '#g', 0, 'r.getBoundingClientRect().left > host.querySelector("sc-radio label").getBoundingClientRect().left')).toBe(true);
    expect(await inner(page, '#g', 'q(".sc-field__error .visually-hidden").textContent')).toBe('خطأ: ');
    // The box's border fades to the error colour (120ms) once the group renders its error.
    await settleTransitions(page);
    expect(await radio(page, '#g', 0, 'getComputedStyle(r).borderTopColor')).toBe(await token(page, 'body', '--sc-color-error'));
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await page.$eval('#g', (el) => (el as HTMLElement & { value: string }).value)).toBe('other');
  });

  it('submits, resets to the initial choice and reports a missing required choice natively', async () => {
    const page = await newScPage(`<form><sc-radio-group name="term" label="Renew for" value="1"><sc-radio value="1">1 year</sc-radio><sc-radio value="2">2 years</sc-radio></sc-radio-group><sc-radio-group id="req" name="issuer" label="Issuer" required><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group></form>`);
    const data = () => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));
    expect(await data()).toEqual({ term: '1' });
    expect(await radio(page, '#req', 0, 'r.validity.valueMissing')).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await radio(page, '#req', 0, 'document.activeElement === r')).toBe(true);
    await page.keyboard.press('Space');
    await page.click('sc-radio[value="2"] label');
    await page.waitForChanges();
    expect(await data()).toEqual({ term: '2', issuer: 'dubai' });
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await data()).toEqual({ term: '1' });
    expect(await page.$eval('sc-radio-group', (el) => (el as HTMLElement & { value: string }).value)).toBe('1');
  });

  it('takes options added later, disables through the fieldset, and focuses from the host', async () => {
    const page = await newScPage(`<form><fieldset><sc-radio-group id="g" label="Issuer" value="dubai"><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group></fieldset></form>`);
    await page.evaluate(() => {
      const r = document.createElement('sc-radio');
      r.setAttribute('value', 'sharjah');
      r.textContent = 'Sharjah';
      document.querySelector('sc-radio-group')!.append(r);
    });
    await page.waitForFunction(() => document.querySelectorAll('sc-radio-group input[type=radio]').length === 2);
    const node = await axNode(page, 'sc-radio[value="sharjah"]', 'input');
    expect(node!.name).toBe('Sharjah');
    expect(await radio(page, '#g', 1, 'r.name')).toBe(await radio(page, '#g', 0, 'r.name'));
    await page.evaluate(() => (document.getElementById('g') as HTMLElement).focus());
    expect(await radio(page, '#g', 0, 'document.activeElement === r')).toBe(true);
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = true));
    expect(await radio(page, '#g', 0, 'r.matches(":disabled")')).toBe(true);
  });

  it('scales the dot in from 0.5 with the pointer, never from 0, and shows it at once from the keyboard', async () => {
    const page = await newScPage(GROUP);
    expect(await inner(page, 'sc-radio[value="dubai"]', 'getComputedStyle(q(".sc-choice__mark")).transform')).toBe('matrix(0.5, 0, 0, 0.5, 0, 0)');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    expect(await inner(page, 'sc-radio[value="dubai"]', 'getComputedStyle(q(".sc-choice__mark")).transitionDuration')).toBe('0s');
  });

  it('grows the dot in on the strong ease-out over 120ms from a pointer; under reduced motion it only fades (MOT-04, MOT-15)', async () => {
    const page = await newScPage(GROUP);
    const enter = 'cubic-bezier(0.23, 1, 0.32, 1)';
    const mark = (prop: string) => inner<string>(page, 'sc-radio[value="dubai"]', `getComputedStyle(q(".sc-choice__mark")).${prop}`);
    expect(await mark('transitionProperty')).toBe('opacity, transform, stroke-dashoffset');
    expect(await mark('transitionDuration')).toBe('0.12s, 0.12s, 0.12s');
    expect(await mark('transitionTimingFunction')).toBe(`${enter}, ${enter}, ${enter}`);
    await page.click('sc-radio[value="dubai"] label');
    expect(await inner(page, 'sc-radio[value="dubai"]', 'q(".sc-choice__mark").getAnimations().map(a => a.transitionProperty).sort().join()')).toBe('opacity,transform');
    await settleTransitions(page);
    expect(await mark('transform')).toBe('none');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await settleTransitions(page); // the switch itself transitions the resting dot from 0.5 to 1
    expect(await inner(page, 'sc-radio[value="abu-dhabi"]', 'getComputedStyle(q(".sc-choice__mark")).transform')).toBe('none');
    await page.click('sc-radio[value="abu-dhabi"] label');
    expect(await inner(page, 'sc-radio[value="abu-dhabi"]', 'q(".sc-choice__mark").getAnimations().map(a => a.transitionProperty).join()')).toBe('opacity');
  });

  it('stays visible in forced colours', async () => {
    const page = await newScPage(`<sc-radio-group label="R" value="a"><sc-radio value="a">A</sc-radio></sc-radio-group>`);
    await forceColors(page);
    const highlight = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'Highlight';
      document.body.append(probe);
      return getComputedStyle(probe).backgroundColor;
    });
    expect(await inner(page, 'sc-radio', 'getComputedStyle(q(".sc-choice__mark")).backgroundColor')).toBe(highlight);
    expect(await inner(page, 'sc-radio', 'getComputedStyle(q(".sc-choice__mark")).opacity')).toBe('1');
  });

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});

describeAxe('sc-radio-group', ALL_STATES);
