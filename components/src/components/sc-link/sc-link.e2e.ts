import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function inner(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', `return (${expr});`)(host, control);
    },
    selector,
    read,
  );
}

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <p>You need a valid <sc-link href="#insurance">insurance certificate</sc-link> and a passed <sc-link href="#test">vehicle test</sc-link>.</p>
    <p>Read the <sc-link href="https://www.rta.ae" external>RTA fees guide</sc-link> before you pay.</p>
    <sc-link href="#services" standalone>View all services</sc-link>
    <sc-link href="https://www.rta.ae" standalone external>RTA website</sc-link>
  </main>`;

describe('sc-link (e2e)', () => {
  it('is underlined in the channel action colour and inherits the sentence type', async () => {
    const page = await newScPage(`<p style="font-size: 20px">Read the <sc-link href="#x">guide</sc-link></p>`);
    expect(await inner(page, 'sc-link', 'getComputedStyle(control.querySelector(".label")).textDecorationLine')).toBe('underline');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).fontSize')).toBe('20px');
    const action = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--sc-channel-action)';
      document.body.append(probe);
      return getComputedStyle(probe).color;
    });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).toBe(action);
  });

  it('follows the link with Enter, and delegates focus to the inner link', async () => {
    const page = await newScPage(`<sc-link href="#done">Check your fines</sc-link>`);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-link');
    expect(await inner(page, 'sc-link', 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'sc-link', 'control.matches(":focus-visible")')).toBe(true);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#done');
  });

  it('exposes "(opens in new tab)" in the accessible name of an external link', async () => {
    const page = await newScPage(`<sc-link href="https://www.rta.ae" external>RTA website</sc-link>`);
    const snap = await page.accessibility.snapshot({ root: (await page.$('sc-link >>> a'))! });
    expect(snap!.name).toBe('RTA website (opens in new tab)');
    expect(await inner(page, 'sc-link', 'control.target')).toBe('_blank');
  });

  it('re-renders the external text when lang changes', async () => {
    const page = await newScPage(`<sc-link href="https://www.rta.ae" external>RTA</sc-link>`);
    expect(await inner(page, 'sc-link', 'control.querySelector(".visually-hidden").textContent.trim()')).toBe('(opens in new tab)');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-link', 'control.querySelector(".visually-hidden").textContent.trim()')).toBe('(يفتح في علامة تبويب جديدة)');
  });

  it('gives standalone links a 44px target and mirrors the chevron in RTL', async () => {
    const page = await newScPage(`<sc-link href="#s" standalone>View all services</sc-link>`);
    expect(await inner(page, 'sc-link', 'control.getBoundingClientRect().height')).toBeGreaterThanOrEqual(44);
    expect(await inner(page, 'sc-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    const chevronLeft = await inner(page, 'sc-link', 'control.querySelector("svg").getBoundingClientRect().left < control.querySelector(".label").getBoundingClientRect().left');
    expect(chevronLeft).toBe(true);
  });

  it('takes its colour from the channel', async () => {
    const page = await newScPage(`<sc-link href="#a">Guide</sc-link>`, { channel: 'now' });
    const now = await inner(page, 'sc-link', 'getComputedStyle(control).color');
    await setPageContext(page, { channel: 'visit' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).not.toBe(now);
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      for (const theme of ['light', 'dark'] as const) {
        await setPageContext(page, { channel, theme });
        await expectNoAxeViolations(page);
      }
    }
  });
});
