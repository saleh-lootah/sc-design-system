import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { CHANNEL_LINKS } from '../../test/chrome';
import { newScPage, setPageContext } from '../../test/page';

const NETWORK = `<div style="padding: 24px"><sc-channel-network links='${CHANNEL_LINKS}'></sc-channel-network></div>`;

const probe = (page: E2EPage, channel: string, prop: string, value: string) =>
  page.evaluate(
    (c: string, p: string, v: string) => {
      const i = document.createElement('i');
      if (c) i.dataset.channel = c;
      i.style.setProperty(p, v);
      document.body.append(i);
      return getComputedStyle(i).getPropertyValue(p);
    },
    channel,
    prop,
    value,
  );

describe('sc-channel-network (e2e)', () => {
  it("gives each tile a 4px top rule in its own channel's action colour (FND-26)", async () => {
    const page = await newScPage(NETWORK);
    const rules = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.sc-channel-network__tile')).map((t) => {
        const s = getComputedStyle(t);
        // The rule is a 4px background band (board FVO-0): the colour is the gradient's.
        return [s.backgroundSize, s.backgroundImage.replace(/^linear-gradient\((.*), \1\)$/, '$1')];
      }),
    );
    expect(rules.every(([size]) => size === '100% 4px')).toBe(true);
    expect(new Set(rules.map(([, c]) => c)).size).toBe(7);
    expect(rules[1][1]).toBe(await probe(page, 'transport', 'color', 'var(--sc-color-channel-action)'));
  });

  it('marks the current tile with its channel-subtle fill, the name in channel-action, and the eyebrow in city indigo', async () => {
    const page = await newScPage(NETWORK, { channel: 'visit' });
    const tile = await page.evaluate(() => {
      const t = document.querySelector('.sc-channel-network__tile.is-current')!;
      return [t.closest('li')!.getAttribute('data-channel'), getComputedStyle(t).backgroundColor, getComputedStyle(t.querySelector('.sc-channel-network__name')!).color];
    });
    expect(tile[0]).toBe('visit');
    expect(tile[1]).toBe(await probe(page, 'visit', 'background-color', 'var(--sc-color-channel-subtle)'));
    expect(tile[2]).toBe(await probe(page, 'visit', 'color', 'var(--sc-color-channel-action)'));
    const eyebrow = await page.evaluate(() => getComputedStyle(document.querySelector('.sc-channel-network__eyebrow')!).color);
    expect(eyebrow).toBe(await probe(page, '', 'color', 'var(--sc-color-primary)'));
  });

  it('upper-cases and tracks the eyebrow in English only', async () => {
    const page = await newScPage(NETWORK);
    const read = () => page.evaluate(() => {
      const s = getComputedStyle(document.querySelector('.sc-channel-network__eyebrow')!);
      return [s.textTransform, s.letterSpacing];
    });
    expect((await read())[0]).toBe('uppercase');
    await setPageContext(page, { lang: 'ar' });
    const [transform, spacing] = await read();
    expect(transform).toBe('none');
    expect(spacing).toMatch(/^(normal|0px)$/);
  });

  it('runs seven tiles in a row on wide screens, two on phones, from the right in Arabic', async () => {
    const page = await newScPage(NETWORK, { lang: 'ar' });
    await page.setViewport({ width: 1440, height: 800 });
    const tops = () => page.evaluate(() => Array.from(document.querySelectorAll('.sc-channel-network__entry')).map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(await tops()).size).toBe(1);
    const lefts = await page.evaluate(() => Array.from(document.querySelectorAll('.sc-channel-network__entry')).map((e) => Math.round(e.getBoundingClientRect().left)));
    expect([...lefts].sort((a, b) => b - a)).toEqual(lefts);
    await page.setViewport({ width: 390, height: 800 });
    expect(new Set(await tops()).size).toBe(4);
  });
});

describeAxe('sc-channel-network', NETWORK);
