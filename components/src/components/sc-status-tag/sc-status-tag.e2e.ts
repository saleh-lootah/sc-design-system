import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

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

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }, name);

const ALL = `
  <main>
    <h1>My applications</h1>
    <sc-status-tag id="n">In review</sc-status-tag>
    <sc-status-tag id="i" tone="info">In review</sc-status-tag>
    <sc-status-tag id="s" tone="success">Paid</sc-status-tag>
    <sc-status-tag id="w" tone="warning">Expires in 15 days</sc-status-tag>
    <sc-status-tag id="e" tone="error">Action needed</sc-status-tag>
    <sc-status-tag id="c" tone="channel">Life event</sc-status-tag>
  </main>`;

async function forceColors(page: E2EPage) {
  const client = await (page as unknown as { createCDPSession(): Promise<{ send(m: string, p: object): Promise<unknown> }> }).createCDPSession();
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}

describe('sc-status-tag (e2e)', () => {
  it('is a 32px chip with a 6px radius and a 16px icon', async () => {
    const page = await newScPage(ALL);
    expect(await tag(page, '#s', 'tag.getBoundingClientRect().height')).toBe(32);
    expect(await tag(page, '#s', 'getComputedStyle(tag).borderTopLeftRadius')).toBe('6px');
    expect(await tag(page, '#s', 'tag.querySelector("svg").getBoundingClientRect().width')).toBe(16);
  });

  it('uses tone-40 text on the tone-95 container', async () => {
    const page = await newScPage(ALL);
    for (const [id, tone] of [['i', 'info'], ['s', 'success'], ['w', 'warning'], ['e', 'error']]) {
      expect(await tag(page, `#${id}`, 'getComputedStyle(tag).color')).toBe(await token(page, `--sc-color-${tone}`));
      expect(await tag(page, `#${id}`, 'getComputedStyle(tag).backgroundColor')).toBe(await token(page, `--sc-color-${tone}-container`));
    }
    expect(await tag(page, '#n', 'getComputedStyle(tag).color')).toBe(await token(page, '--sc-color-on-surface-variant'));
    expect(await tag(page, '#n', 'getComputedStyle(tag).backgroundColor')).toBe(await token(page, '--sc-color-surface-container'));
  });

  it('keeps the semantic tones on every channel; the channel tone follows it (W4)', async () => {
    const page = await newScPage(ALL, { channel: 'now' });
    const before = await tag(page, '#n', 'getComputedStyle(tag).backgroundColor');
    const channelBefore = await tag(page, '#c', 'getComputedStyle(tag).color');
    expect(channelBefore).toBe(await token(page, '--sc-color-channel-action'));
    expect(await tag(page, '#c', 'getComputedStyle(tag).backgroundColor')).toBe(await token(page, '--sc-color-channel-subtle'));
    await page.evaluate(() => (document.documentElement.dataset.channel = 'visit'));
    expect(await tag(page, '#n', 'getComputedStyle(tag).backgroundColor')).toBe(before);
    expect(await tag(page, '#c', 'getComputedStyle(tag).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await tag(page, '#c', 'getComputedStyle(tag).color')).not.toBe(channelBefore);
  });

  it('reads as its words only', async () => {
    const page = await newScPage(ALL);
    expect(await page.$eval('#e', (el) => (el as HTMLElement).innerText.trim())).toBe('Action needed');
    const snapshot = JSON.stringify(await page.accessibility.snapshot());
    expect(snapshot).toContain('Action needed');
  });

  it('uses label-small: Medium 14px in English, Bold 16px in Arabic, with the icon at the start', async () => {
    const page = await newScPage(`<sc-status-tag id="en" tone="success">Paid</sc-status-tag><div lang="ar" dir="rtl"><sc-status-tag id="ar" tone="success">تم الدفع</sc-status-tag></div>`);
    expect(await tag(page, '#en', '[getComputedStyle(tag).fontSize, getComputedStyle(tag).fontWeight]')).toEqual(['14px', '500']);
    expect(await tag(page, '#ar', '[getComputedStyle(tag).fontSize, getComputedStyle(tag).fontWeight]')).toEqual(['16px', '700']);
    expect(await tag(page, '#ar', 'tag.querySelector("svg").getBoundingClientRect().left > tag.querySelector(".label").getBoundingClientRect().left')).toBe(true);
  });

  it('keeps its shape in forced colours', async () => {
    const page = await newScPage(ALL);
    await forceColors(page);
    expect(await tag(page, '#e', 'getComputedStyle(tag).borderTopStyle')).toBe('solid');
    expect(await tag(page, '#e', 'getComputedStyle(tag).borderTopColor')).not.toBe('rgba(0, 0, 0, 0)');
  });
});

describeAxe('sc-status-tag', ALL);
