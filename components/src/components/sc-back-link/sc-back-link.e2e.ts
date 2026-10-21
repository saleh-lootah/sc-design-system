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

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

export const ALL_STATES = `
  <main style="padding: 16px">
    <h1>What is your plate number?</h1>
    <sc-back-link href="#previous"></sc-back-link>
    <sc-back-link id="btn"></sc-back-link>
    <sc-back-link appearance="plain" href="#previous"></sc-back-link>
    <sc-back-link href="#vehicles">Back to my vehicles</sc-back-link>
  </main>`;

describe('sc-back-link (e2e)', () => {
  it('is plain text and a 24px arrow in on-surface, on a 44px target with no fill', async () => {
    const page = await newScPage(`<sc-back-link href="#p"></sc-back-link>`);
    expect(Math.round(await inner(page, 'sc-back-link', 'control.getBoundingClientRect().height'))).toBe(44);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).backgroundColor')).toBe('rgba(0, 0, 0, 0)');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await inner(page, 'sc-back-link', 'control.querySelector("svg").getBoundingClientRect().width')).toBe(24);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).fontSize')).toBe('16px');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).fontWeight')).toBe('500');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(label).textDecorationLine')).toBe('none');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).paddingInlineStart')).toBe('4px');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).paddingInlineEnd')).toBe('6px');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).fontSize')).toBe('18px');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).fontWeight')).toBe('700');
  });

  it('underlines the label on hover', async () => {
    const page = await newScPage(`<sc-back-link href="#p"></sc-back-link>`);
    await page.hover('sc-back-link');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(label).textDecorationLine')).toBe('underline');
  });

  it('follows its href with Enter, with the U1 ring', async () => {
    const page = await newScPage(`<sc-back-link href="#previous"></sc-back-link>`);
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-back-link', 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).outlineWidth')).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#previous');
  });

  it('is a button without href: Enter and Space fire click', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    await page.evaluate(() => {
      (window as unknown as { clicks: number }).clicks = 0;
      document.querySelector('sc-back-link')!.addEventListener('click', () => (window as unknown as { clicks: number }).clicks++);
    });
    expect(await inner(page, 'sc-back-link', 'control.tagName')).toBe('BUTTON');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(2);
  });

  it('is named "Back" / "رجوع" and re-renders when lang changes', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    const name = async () => (await page.accessibility.snapshot({ root: (await page.$('sc-back-link >>> button'))! }))!.name;
    expect(await name()).toBe('Back');
    await setPageContext(page, { lang: 'ar' });
    expect(await name()).toBe('رجوع');
  });

  it('mirrors the arrow in RTL and keeps it at the start', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await inner(page, 'sc-back-link', 'control.querySelector("svg").getBoundingClientRect().left > label.getBoundingClientRect().left')).toBe(true);
  });

  describeAxe('sc-back-link', ALL_STATES);

  it('has no axe violations with focus on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
