import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

function inner<T = unknown>(page: E2EPage, selector: string, read: string): Promise<T> {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
      const label = host.shadowRoot!.querySelector('[part="label"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', 'label', `return (${expr});`)(host, control, label);
    },
    selector,
    read,
  ) as Promise<T>;
}

/** A colour token as the browser resolves it at `sel`. */
const token = (page: E2EPage, sel: string, name: string) =>
  page.evaluate(
    (s: string, n: string) => {
      const probe = document.createElement('i');
      probe.style.color = `var(${n})`;
      document.querySelector(s)!.append(probe);
      const v = getComputedStyle(probe).color;
      probe.remove();
      return v;
    },
    sel,
    name,
  );

export const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <p>You need a valid <sc-link href="#insurance">insurance certificate</sc-link> and a passed <sc-link href="#test">vehicle test</sc-link>.</p>
    <p>Read the <sc-link href="https://www.rta.ae" external>RTA fees guide</sc-link> before you pay. Or the <a class="sc-link" href="#guide">guide</a>.</p>
    <sc-link href="#services" standalone>All 412 services</sc-link>
    <sc-link href="https://www.rta.ae" standalone external>RTA website</sc-link>
  </main>`;

describe('sc-link (e2e)', () => {
  it('is underlined 1px at 4px in the channel action colour and inherits the sentence type', async () => {
    const page = await newScPage(`<p style="font-size: 20px">Read the <sc-link href="#x">guide</sc-link></p>`);
    expect(await inner(page, 'sc-link', 'getComputedStyle(label).textDecorationLine')).toBe('underline');
    expect(await inner(page, 'sc-link', 'getComputedStyle(label).textDecorationThickness')).toBe('1px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(label).textUnderlineOffset')).toBe('4px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).fontSize')).toBe('20px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).toBe(await token(page, 'p', '--sc-color-channel-action'));
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(label).textUnderlineOffset')).toBe('5px');
  });

  it('thickens the underline to 2px on hover', async () => {
    const page = await newScPage(`<p>Read the <sc-link href="#x">fees guide</sc-link></p>`);
    await page.hover('sc-link');
    await page.waitForFunction(() => {
      const l = document.querySelector('sc-link')!.shadowRoot!.querySelector('[part="label"]')!;
      return getComputedStyle(l).textDecorationThickness === '2px';
    });
  });

  it('matches the .sc-link class for links in running text', async () => {
    const page = await newScPage(`<p><sc-link href="#a">Guide</sc-link> <a class="sc-link" href="#b">Guide</a></p>`);
    const native = await page.$eval('a.sc-link', (a) => {
      const s = getComputedStyle(a);
      return [s.color, s.textDecorationLine, s.textDecorationThickness, s.textUnderlineOffset];
    });
    const comp = await inner<string[]>(page, 'sc-link', '[getComputedStyle(control).color, ...["textDecorationLine","textDecorationThickness","textUnderlineOffset"].map((k) => getComputedStyle(label)[k])]');
    expect(comp).toEqual(native);
  });

  it('takes --sc-link-color from an ancestor (footer, error summary)', async () => {
    const page = await newScPage(`<footer style="--sc-link-color: var(--sc-color-on-surface)"><sc-link href="#a">Privacy</sc-link></footer>`);
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).toBe(await token(page, 'footer', '--sc-color-on-surface'));
  });

  it('follows the link with Enter, and delegates focus to the inner link with the U1 ring', async () => {
    const page = await newScPage(`<sc-link href="#done">Check your fines</sc-link>`);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-link');
    expect(await inner(page, 'sc-link', 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).outlineWidth')).toBe('3px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).outlineColor')).toBe(await token(page, 'body', '--sc-color-focus-ring'));
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#done');
  });

  it('exposes "(opens in new tab)" in the accessible name of an external link, in the page language', async () => {
    const page = await newScPage(`<sc-link href="https://www.rta.ae" external>RTA website</sc-link>`);
    const name = async () => (await page.accessibility.snapshot({ root: (await page.$('sc-link >>> a'))! }))!.name;
    expect(await name()).toBe('RTA website (opens in new tab)');
    expect(await inner(page, 'sc-link', 'control.target')).toBe('_blank');
    await setPageContext(page, { lang: 'ar' });
    expect(await name()).toBe('RTA website (يفتح في علامة تبويب جديدة)');
  });

  it('gives standalone links label-large Bold, a 44px target and a mirrored arrow', async () => {
    const page = await newScPage(`<sc-link href="#s" standalone>All 412 services</sc-link>`);
    expect(await inner(page, 'sc-link', 'control.getBoundingClientRect().height')).toBeGreaterThanOrEqual(44);
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).fontSize')).toBe('18px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).fontWeight')).toBe('700');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).fontSize')).toBe('20px');
    expect(await inner(page, 'sc-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await inner(page, 'sc-link', 'control.querySelector("svg").getBoundingClientRect().left < label.getBoundingClientRect().left')).toBe(true);
  });

  it('takes its colour from the channel and the theme', async () => {
    const page = await newScPage(`<sc-link href="#a">Guide</sc-link>`, { channel: 'now' });
    const now = await inner(page, 'sc-link', 'getComputedStyle(control).color');
    await setPageContext(page, { channel: 'visit' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).not.toBe(now);
    await setPageContext(page, { channel: 'visit', theme: 'dark' });
    expect(await inner(page, 'sc-link', 'getComputedStyle(control).color')).toBe(await token(page, 'body', '--sc-color-channel-action'));
  });

  describeAxe('sc-link', ALL_STATES);

  it('has no axe violations on every channel, light and dark', async () => {
    const page = await newScPage(ALL_STATES);
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      for (const theme of ['light', 'dark'] as const) {
        await setPageContext(page, { channel, theme });
        await expectNoAxeViolations(page);
      }
    }
  });
});
