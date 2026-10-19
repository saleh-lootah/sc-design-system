import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const;

function tag(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const t = document.querySelector(sel)!.shadowRoot!.querySelector('[part="tag"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('tag', `return (${expr});`)(t);
    },
    selector,
    read,
  );
}

const ALL = `
  <main>
    <h1>My tasks</h1>
    <sc-status-tag id="n">In review</sc-status-tag>
    <sc-status-tag id="s" tone="success">Paid</sc-status-tag>
    <sc-status-tag id="w" tone="warning">Expires in 15 days</sc-status-tag>
    <sc-status-tag id="e" tone="error">Action needed</sc-status-tag>
    <sc-status-tag id="c" tone="channel">New</sc-status-tag>
  </main>`;

/** Emulates Windows High Contrast. Puppeteer's emulateMediaFeatures rejects forced-colors, so use CDP. */
async function forceColors(page: E2EPage) {
  const client = await (page as unknown as { createCDPSession(): Promise<{ send(m: string, p: object): Promise<unknown> }> }).createCDPSession();
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}

describe('sc-status-tag (e2e)', () => {
  it('is a pill with a dot, and each tone has its own colours', async () => {
    const page = await newScPage(ALL);
    const looks = new Set<string>();
    for (const id of ['n', 's', 'w', 'e', 'c']) {
      looks.add(await tag(page, `#${id}`, 'getComputedStyle(tag).backgroundColor + getComputedStyle(tag).color'));
      expect(await tag(page, `#${id}`, 'getComputedStyle(tag).borderTopLeftRadius')).toBe('999px');
      expect(await tag(page, `#${id}`, 'tag.querySelector("[part=dot]").getBoundingClientRect().width')).toBe(8);
    }
    expect(looks.size).toBe(5);
  });

  it('reads as its words only (the dot is hidden)', async () => {
    const page = await newScPage(ALL);
    expect(await page.$eval('#e', (el) => (el as HTMLElement).innerText.trim())).toBe('Action needed');
    expect(await tag(page, '#e', 'tag.querySelector("[part=dot]").getAttribute("aria-hidden")')).toBe('true');
  });

  it('takes the channel tone from the page channel', async () => {
    const page = await newScPage(ALL, { channel: 'now' });
    const now = await tag(page, '#c', 'getComputedStyle(tag).backgroundColor');
    await setPageContext(page, { channel: 'visit' });
    expect(await tag(page, '#c', 'getComputedStyle(tag).backgroundColor')).not.toBe(now);
  });

  it('puts the dot at the start: on the right in Arabic', async () => {
    const page = await newScPage(ALL, { lang: 'ar' });
    expect(await tag(page, '#s', 'tag.querySelector("[part=dot]").getBoundingClientRect().left > tag.querySelector(".label").getBoundingClientRect().left')).toBe(true);
    expect(await tag(page, '#s', 'getComputedStyle(tag).fontFamily')).toContain('Dubai W23 Bold');
  });

  it('keeps its shape and dot in forced colours', async () => {
    const page = await newScPage(ALL);
    await forceColors(page);
    expect(await tag(page, '#e', 'getComputedStyle(tag).borderTopStyle')).toBe('solid');
    expect(await tag(page, '#e', 'getComputedStyle(tag).borderTopColor')).not.toBe('rgba(0, 0, 0, 0)');
    expect(await tag(page, '#e', 'getComputedStyle(tag.querySelector("[part=dot]")).backgroundColor')).not.toBe('rgba(0, 0, 0, 0)');
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations for the channel tone on every channel, light and dark', async () => {
    const page = await newScPage(ALL);
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
