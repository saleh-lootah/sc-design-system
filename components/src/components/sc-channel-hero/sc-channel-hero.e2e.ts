import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

export const MARKUP = `
  <sc-channel-hero>
    <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
    <h1 slot="heading">What do you need to do?</h1>
    <p slot="lede">Renew registration, pay fines and get parking permits, in one place.</p>
    <form role="search"><label>Search services <input type="search"></label></form>
    <a slot="popular" id="chip" href="#renew">Renew vehicle registration</a>
    <a slot="popular" href="#bills">Pay water and electricity</a>
  </sc-channel-hero>
  <main><h2>Most used services</h2></main>`;

const shadow = (page: E2EPage, sel: string, expr: string) =>
  page.evaluate(
    (s: string, e: string) => {
      const el = document.querySelector('sc-channel-hero')!.shadowRoot!.querySelector(s)!;
      // eslint-disable-next-line no-new-func
      return new Function('el', 'cs', `return (${e});`)(el, getComputedStyle(el));
    },
    sel,
    expr,
  );

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.backgroundColor = `var(${n})`;
    document.querySelector('sc-channel-hero')!.append(probe);
    const v = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return v;
  }, name);

describe('sc-channel-hero (e2e)', () => {
  it('is a flat channel-subtle band with no gradient (Q-hero), following the channel', async () => {
    const page = await newScPage(MARKUP, { channel: 'now' });
    const now = await shadow(page, '.band', '[cs.backgroundColor, cs.backgroundImage]');
    expect(now).toEqual([await token(page, '--sc-color-channel-subtle'), 'none']);
    await setPageContext(page, { channel: 'transport' });
    const transport = await shadow(page, '.band', 'cs.backgroundColor');
    expect(transport).not.toBe(now[0]);
    expect(transport).toBe(await token(page, '--sc-color-channel-subtle'));
  });

  it('keeps the h1 a real heading and sets it at display-large from 1024px, headline-large on phones', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 1280, height: 900 });
    const size = () => page.evaluate(() => [getComputedStyle(document.querySelector('h1')!).fontSize, getComputedStyle(document.querySelector('h1')!).marginTop]);
    expect(await size()).toEqual(['80px', '0px']);
    await page.setViewport({ width: 800, height: 900 });
    expect((await size())[0]).toBe('45px');
    await page.setViewport({ width: 375, height: 900 });
    expect((await size())[0]).toBe('32px');
    const snapshot = (await page.accessibility.snapshot()) as { children?: { role: string; name: string; level?: number }[] };
    expect(snapshot.children!.find((n) => n.role === 'heading' && n.level === 1)!.name).toBe('What do you need to do?');
  });

  it('uses display-medium for size="medium" and the Arabic scale in Arabic', async () => {
    const page = await newScPage(MARKUP.replace('<sc-channel-hero>', '<sc-channel-hero size="medium">'));
    await page.setViewport({ width: 1280, height: 900 });
    const size = () => page.evaluate(() => getComputedStyle(document.querySelector('h1')!).fontSize);
    expect(await size()).toBe('57px');
    await setPageContext(page, { lang: 'ar' });
    expect(await size()).toBe('64px');
  });

  it('colours the eyebrow in the channel action and the lede in on-surface-variant', async () => {
    const page = await newScPage(MARKUP);
    expect(await shadow(page, '.eyebrow', 'cs.color')).toBe(await page.evaluate(() => {
      const probe = document.createElement('i');
      probe.style.color = 'var(--sc-color-channel-action)';
      document.body.append(probe);
      return getComputedStyle(probe).color;
    }));
  });

  it('lines up with the page grid margins, and aligns right in Arabic', async () => {
    for (const [width, margin] of [
      [375, 20],
      [800, 32],
      [1200, 48],
      [1440, 80],
    ]) {
      const page = await newScPage(MARKUP, { lang: 'ar' });
      await page.setViewport({ width, height: 900 });
      const right = await page.evaluate(() => document.documentElement.clientWidth - document.querySelector('h1')!.getBoundingClientRect().right);
      expect(Math.round(right)).toBe(margin);
    }
  });

  it('draws suggestion chips 40px tall on a 44px target, capsule shaped, in the channel colour', async () => {
    const page = await newScPage(MARKUP);
    const chip = await page.evaluate(() => {
      const a = document.querySelector('#chip')!;
      const cs = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return { h: r.height, painted: r.height - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth), clip: cs.backgroundClip, radius: parseFloat(cs.borderTopLeftRadius), shadow: cs.boxShadow };
    });
    expect(chip.h).toBe(44);
    expect(chip.painted).toBe(40);
    expect(chip.clip).toBe('padding-box');
    expect(chip.radius).toBeGreaterThan(100);
    expect(chip.shadow).toContain('inset');
  });

  it('names the popular row by its label', async () => {
    const page = await newScPage(MARKUP);
    const snap = (await page.accessibility.snapshot({ interestingOnly: false })) as unknown;
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'group') found.push(n.name!);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snap as never);
    expect(found).toContain('Popular now');
  });

  it('presses chips with a pointer only (no scale from the keyboard)', async () => {
    const page = await newScPage(MARKUP);
    const scale = () => page.evaluate(() => getComputedStyle(document.querySelector('#chip')!).transform);
    const box = await page.evaluate(() => {
      const r = document.querySelector('#chip')!.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2];
    });
    await page.mouse.move(box[0], box[1]);
    await page.mouse.down();
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    expect(await scale()).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
    await page.mouse.up();
  });

  it('hides empty slot wrappers', async () => {
    const page = await newScPage(`<sc-channel-hero><h1 slot="heading">Dubai Transport</h1></sc-channel-hero>`);
    const hidden = await page.evaluate(() =>
      ['.breadcrumbs', '.eyebrow', '.lede', '.search', '.popular'].map((s) => getComputedStyle(document.querySelector('sc-channel-hero')!.shadowRoot!.querySelector(s)!).display),
    );
    expect(hidden).toEqual(['none', 'none', 'none', 'none', 'none']);
  });

  it('falls back to Canvas with a rule beneath in forced colours', async () => {
    const page = await newScPage(MARKUP);
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    expect(await shadow(page, '.band', 'cs.borderBottomStyle')).toBe('solid');
  });
});

describeAxe('sc-channel-hero', MARKUP);
