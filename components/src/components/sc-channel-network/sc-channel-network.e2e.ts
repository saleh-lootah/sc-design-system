import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { CHANNEL_LINKS } from '../../test/chrome';
import { loadFonts, newScPage, noScriptPage, setPageContext } from '../../test/page';

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

  it('has no current tile and no current fill with channel="none"', async () => {
    const page = await newScPage(NETWORK.replace('<sc-channel-network ', '<sc-channel-network channel="none" '), { channel: 'visit' });
    const state = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll('.sc-channel-network__tile'));
      return {
        current: document.querySelectorAll('.is-current, [aria-current]').length,
        links: tiles.filter((t) => t.localName === 'a').length,
        fills: new Set(tiles.map((t) => getComputedStyle(t).backgroundColor)).size,
      };
    });
    expect(state).toEqual({ current: 0, links: 7, fills: 1 });
  });

  it('sets the eyebrow as written, never forced to capitals (CNT-07)', async () => {
    const page = await newScPage(NETWORK);
    const read = () => page.evaluate(() => getComputedStyle(document.querySelector('.sc-channel-network__eyebrow')!).textTransform);
    expect(await read()).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await read()).toBe('none');
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

describe('sc-channel-network before it upgrades (PERF-04, CLS)', () => {
  const FALLBACK = `<nav slot="fallback" aria-label="Government of Dubai channels"><ul><li><a href="#now">Dubai Now</a></li><li><a href="#transport">Dubai Transport</a></li><li><a href="#visit">Visit Dubai</a></li><li><a href="#justice">Dubai Justice</a></li><li><a href="#build">Build in Dubai</a></li><li><a href="#invest">Invest in Dubai</a></li><li><a href="#trade">Dubai Trade</a></li></ul></nav>`;

  it.each([
    [375, 'en'],
    [700, 'en'],
    [1280, 'en'],
    [375, 'ar'],
    [1280, 'ar'],
  ] as const)('at %ipx (%s) reserves about its final height, and hides the fallback once rendered', async (width, lang) => {
    const html = `<div style="padding-inline: 20px"><sc-channel-network channel="none">${FALLBACK}</sc-channel-network></div>`;
    const page = await newScPage(html, { lang });
    await page.setViewport({ width, height: 900 });
    await loadFonts(page);
    const final = await page.evaluate(() => document.querySelector('sc-channel-network')!.getBoundingClientRect().height);
    expect(await page.evaluate(() => document.querySelector('sc-channel-network > nav[slot]')!.getClientRects().length)).toBe(0);
    // Without the hydrated class the pre-upgrade rules apply again: read the reservation.
    const reserved = await page.evaluate(() => {
      const el = document.querySelector('sc-channel-network')!;
      el.classList.remove('hydrated');
      const h = parseFloat(getComputedStyle(el, '::before').blockSize);
      el.classList.add('hydrated');
      return h;
    });
    // Never short (that would push the page down); at most a little over within a width band.
    expect(reserved).toBeGreaterThanOrEqual(final - 1);
    expect(reserved - final).toBeLessThanOrEqual(48);
  });

  it('without JavaScript shows the fallback links, 44px tall, and reserves nothing', async () => {
    const page = await noScriptPage(`<sc-channel-network channel="none">${FALLBACK}</sc-channel-network>`);
    const r = await page.evaluate(() => [
      Array.from(document.querySelectorAll('sc-channel-network a')).map((a) => Math.round(a.getBoundingClientRect().height)),
      getComputedStyle(document.querySelector('sc-channel-network')!, '::before').content,
    ]);
    expect(r[0]).toEqual(Array(7).fill(44));
    expect(r[1]).toBe('none');
    await page.close();
  });
});

describeAxe('sc-channel-network', NETWORK);
describeAxe('sc-channel-network, no current channel', NETWORK.replace('<sc-channel-network ', '<sc-channel-network channel="none" '));
