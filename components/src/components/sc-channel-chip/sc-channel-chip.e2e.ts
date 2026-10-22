import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const;

function chip(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const c = host.shadowRoot!.querySelector('[part="chip"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'chip', `return (${expr});`)(host, c);
    },
    selector,
    read,
  );
}

/** A colour token as the browser resolves it inside `sel` (so data-channel applies). */
const token = (page: E2EPage, sel: string, name: string, prop = 'color') =>
  page.evaluate(
    (s: string, n: string, p: string) => {
      const probe = document.createElement('i');
      probe.style.setProperty(p === 'color' ? 'color' : 'background-color', `var(${n})`);
      document.querySelector(s)!.append(probe);
      const v = getComputedStyle(probe)[p === 'color' ? 'color' : 'backgroundColor'];
      probe.remove();
      return v;
    },
    sel,
    name,
    prop,
  );

export const ALL = `<main><h1>Renew vehicle registration</h1>
  ${CHANNELS.map((c) => `<sc-channel-chip id="s-${c}" channel="${c}"></sc-channel-chip>`).join('')}
  ${CHANNELS.map((c) => `<sc-channel-chip id="l-${c}" channel="${c}" href="#${c}"></sc-channel-chip>`).join('')}
  <div style="background: var(--sc-color-channel-subtle); padding: 8px" data-channel="visit">
    ${CHANNELS.map((c) => `<sc-channel-chip id="o-${c}" channel="${c}" variant="outlined" href="#${c}"></sc-channel-chip>`).join('')}
  </div>
</main>`;

describe('sc-channel-chip (e2e)', () => {
  it("shows each named channel's colours, whatever the page channel", async () => {
    const page = await newScPage(ALL, { channel: 'now' });
    const fills = new Map<string, string>();
    for (const c of CHANNELS) fills.set(c, await chip(page, `#s-${c}`, 'getComputedStyle(chip).backgroundColor'));
    expect(new Set(fills.values()).size).toBe(7);
    await setPageContext(page, { channel: 'trade' });
    for (const c of CHANNELS) expect(await chip(page, `#s-${c}`, 'getComputedStyle(chip).backgroundColor')).toBe(fills.get(c));
    expect(await page.$eval('#s-visit', (el) => el.getAttribute('data-channel'))).toBe('visit');
  });

  it('is 32px tall with 6px corners, label-small, and reads the named channel roles', async () => {
    const page = await newScPage(ALL);
    expect(await chip(page, '#s-transport', 'Math.round(chip.getBoundingClientRect().height)')).toBe(32);
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).borderTopLeftRadius')).toBe('6px');
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).fontSize')).toBe('14px');
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).fontWeight')).toBe('500');
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).backgroundColor')).toBe(await token(page, '#s-transport', '--sc-color-channel-subtle', 'bg'));
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).color')).toBe(await token(page, '#s-transport', '--sc-color-channel-action'));
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip.querySelector(".dot")).backgroundColor')).toBe(await token(page, '#s-transport', '--sc-color-channel-action', 'bg'));
    await setPageContext(page, { lang: 'ar' });
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).fontSize')).toBe('16px');
  });

  it('outlined: surface fill, a 1px channel outline and a Bold label', async () => {
    const page = await newScPage(ALL);
    expect(await chip(page, '#o-transport', 'getComputedStyle(chip).backgroundColor')).toBe(await token(page, '#o-transport', '--sc-color-surface', 'bg'));
    expect(await chip(page, '#o-transport', 'getComputedStyle(chip).borderTopColor')).toBe(await token(page, '#o-transport', '--sc-color-channel-outline'));
    expect(await chip(page, '#o-transport', 'getComputedStyle(chip).borderTopWidth')).toBe('1px');
    expect(await chip(page, '#o-transport', 'getComputedStyle(chip).fontWeight')).toBe('700');
  });

  it('follows the theme', async () => {
    const page = await newScPage(ALL, { theme: 'light' });
    const light = await chip(page, '#s-transport', 'getComputedStyle(chip).backgroundColor');
    await setPageContext(page, { theme: 'dark' });
    expect(await chip(page, '#s-transport', 'getComputedStyle(chip).backgroundColor')).not.toBe(light);
  });

  it('as a link: Tab focuses it with a ring, Enter follows it, and the hit area is 44px', async () => {
    const page = await newScPage(`<sc-channel-chip channel="transport" href="#transport"></sc-channel-chip>`);
    await page.keyboard.press('Tab');
    expect(await chip(page, 'sc-channel-chip', 'host.shadowRoot.activeElement === chip')).toBe(true);
    expect(await chip(page, 'sc-channel-chip', 'getComputedStyle(chip).outlineStyle')).toBe('solid');
    expect(await chip(page, 'sc-channel-chip', 'Math.round(parseFloat(getComputedStyle(chip, "::after").height))')).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#transport');
  });

  it('is not focusable without href', async () => {
    const page = await newScPage(`<sc-channel-chip channel="visit"></sc-channel-chip><button>After</button>`);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('button');
    expect(await chip(page, 'sc-channel-chip', 'getComputedStyle(chip.querySelector(".label")).textDecorationLine')).toBe('none');
    expect(await chip(page, 'sc-channel-chip', 'chip.querySelector("svg")')).toBe(null);
  });

  it('re-renders in Arabic and mirrors the link chevron', async () => {
    const page = await newScPage(`<sc-channel-chip channel="transport" href="#t"></sc-channel-chip>`, { lang: 'en' });
    expect(await chip(page, 'sc-channel-chip', 'chip.textContent')).toBe('Also on Dubai Transport');
    expect(await chip(page, 'sc-channel-chip', 'getComputedStyle(chip.querySelector("svg")).transform')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await chip(page, 'sc-channel-chip', 'chip.textContent')).toBe('متوفر أيضًا في مواصلات دبي');
    expect(await chip(page, 'sc-channel-chip', 'getComputedStyle(chip.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });

  it('is a navigation link: no underline at rest, underlined on hover, identified by its chevron (R6, CMP-08)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(`<sc-channel-chip channel="transport" href="#transport"></sc-channel-chip><sc-channel-chip id="plain" channel="visit"></sc-channel-chip>`, { lang });
      const deco = () => chip(page, 'sc-channel-chip', 'getComputedStyle(chip.querySelector(".label")).textDecorationLine');
      expect(await deco()).toBe('none');
      // The cue that it is a link without the underline: the end chevron.
      expect(await chip(page, 'sc-channel-chip', 'chip.querySelector("[part=icon] svg").getBoundingClientRect().width')).toBe(16);
      await page.hover('sc-channel-chip');
      expect(await deco()).toBe('underline');
      // A chip without href is not a link: no chevron and no hover underline.
      await page.hover('#plain');
      expect(await chip(page, '#plain', 'chip.querySelector("[part=icon]")')).toBeNull();
      expect(await chip(page, '#plain', 'getComputedStyle(chip.querySelector(".label")).textDecorationLine')).toBe('none');
    }
  });

  it('follows the link on release only: pressing, sliding off and releasing does nothing (WCAG 2.5.2)', async () => {
    const page = await newScPage(`<sc-channel-chip channel="transport" href="#transport"></sc-channel-chip><div style="block-size: 400px"></div>`);
    const box = (await (await page.$('sc-channel-chip'))!.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, 300, { steps: 4 });
    await page.mouse.up();
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('');
    await page.click('sc-channel-chip');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#transport');
  });

  describeAxe('sc-channel-chip', ALL);
});
