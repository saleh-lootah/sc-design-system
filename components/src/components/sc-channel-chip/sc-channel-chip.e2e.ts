import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

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

const ALL = `<main><h1>Renew vehicle registration</h1>
  ${CHANNELS.map((c) => `<sc-channel-chip id="s-${c}" channel="${c}"></sc-channel-chip>`).join('')}
  ${CHANNELS.map((c) => `<sc-channel-chip id="l-${c}" channel="${c}" href="#${c}"></sc-channel-chip>`).join('')}
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

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL, ctx);
      await page.keyboard.press('Tab');
      await expectNoAxeViolations(page);
    });
  }
});
