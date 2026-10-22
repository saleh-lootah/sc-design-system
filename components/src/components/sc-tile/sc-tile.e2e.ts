import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { loadFonts, newScPage, noScriptPage, setPageContext } from '../../test/page';

/**
 * WCAG 2.5.2 (MOT-09): press gives visual feedback only; activation is the native click on
 * release. Presses `control` (a page expression), drags off to the far corner of the viewport and releases
 * there, then clicks normally. Returns what was seen at each step; `look` reads the press visual.
 */
async function pressAndCancel(page: E2EPage, control: string, look: string) {
  const run = (expr: string) =>
    page.evaluate(
      (c: string, e: string) => {
        // eslint-disable-next-line no-new-func
        const el = new Function(`return (${c});`)() as HTMLElement;
        // eslint-disable-next-line no-new-func
        return new Function('el', 'w', `return (${e});`)(el, window);
      },
      control,
      expr,
    );
  await run(`(w.pressLog = { clicks: 0, submits: 0, hashes: 0 },
    el.addEventListener('click', () => w.pressLog.clicks++),
    w.pressHooked || ((w.pressHooked = true),
      w.addEventListener('hashchange', () => w.pressLog.hashes++),
      document.addEventListener('submit', (ev) => { ev.preventDefault(); w.pressLog.submits++; }, true)), 0)`);
  const at = (await run(`(({ x, y, width, height }) => [x + width / 2, y + height / 2])(el.getBoundingClientRect())`)) as number[];
  const off = (await run('[w.innerWidth - 2, w.innerHeight - 2]')) as number[];
  const settle = () => new Promise((r) => setTimeout(r, 400));
  const log = () => run('({ ...w.pressLog, hash: location.hash })');
  const rest = await run(look);
  await page.mouse.move(at[0], at[1]);
  await page.mouse.down();
  await settle();
  const pressed = await run(look);
  await page.mouse.move(off[0], off[1], { steps: 5 });
  await page.mouse.up();
  await settle();
  const cancelled = { log: await log(), look: await run(look) };
  await page.mouse.click(at[0], at[1]);
  await settle();
  return { rest, pressed, cancelled, clicked: await log() };
}

const ICON = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11l8-7 8 7v9H4z"/></svg>`;
export const MARKUP = `
  <main>
    <h2>Browse by life event</h2>
    <ul style="display:grid;grid-template-columns:repeat(3,180px);gap:16px;list-style:none;padding:0">
      <li><sc-tile id="moving" href="#moving" tint="orange" count="14">${ICON}Moving home</sc-tile></li>
      <li><sc-tile id="baby" href="#baby" tint="rose" count="1">${ICON}Having a baby</sc-tile></li>
      <li><sc-tile id="fine">${ICON}<a href="#fine">Pay a traffic fine</a></sc-tile></li>
    </ul>
  </main>`;

describe('sc-tile (e2e)', () => {
  it('is one link named by its title and count; Tab and Enter follow it', async () => {
    const page = await newScPage(MARKUP);
    const snapshot = await page.accessibility.snapshot();
    const links: string[] = [];
    const walk = (n: { role?: string; name?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'link') links.push(n.name!);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snapshot as never);
    expect(links).toEqual(['Moving home , 14 services', 'Having a baby , 1 service', 'Pay a traffic fine']);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#moving');
  });

  it('is a 12px tile at least 112px tall with a 40px tinted icon tile', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#moving')!.shadowRoot!;
      const tile = root.querySelector('.tile')!;
      const icon = root.querySelector('.icon-tile')!;
      const probe = document.createElement('i');
      probe.style.backgroundColor = 'var(--sc-color-tint-orange)';
      probe.style.color = 'var(--sc-color-on-tint-orange)';
      document.body.append(probe);
      const want = [getComputedStyle(probe).backgroundColor, getComputedStyle(probe).color];
      probe.remove();
      return {
        radius: getComputedStyle(tile).borderTopLeftRadius,
        tall: tile.getBoundingClientRect().height >= 112,
        icon: icon.getBoundingClientRect().width,
        tint: getComputedStyle(icon).backgroundColor === want[0] && getComputedStyle(icon).color === want[1],
      };
    });
    expect(r).toEqual({ radius: '12px', tall: true, icon: 40, tint: true });
  });

  it('shows the U1 ring around the tile from the keyboard, and scales on pointer press only', async () => {
    const page = await newScPage(MARKUP);
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => getComputedStyle(document.querySelector('#moving')!.shadowRoot!.querySelector('.tile')!).outlineWidth);
    expect(ring).toBe('3px');
    const box = await page.evaluate(() => {
      const r = document.querySelector('#baby')!.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2];
    });
    await page.mouse.move(box[0], box[1]);
    await page.mouse.down();
    await page.evaluate(() => document.querySelector('#baby')!.shadowRoot!.getAnimations().forEach((a) => a.finish()));
    const pressed = await page.evaluate(() => {
      const tile = getComputedStyle(document.querySelector('#baby')!.shadowRoot!.querySelector('.tile')!);
      return [tile.transform, tile.backgroundImage.startsWith('linear-gradient')];
    });
    expect(pressed).toEqual(['matrix(0.97, 0, 0, 0.97, 0, 0)', true]);
    await page.mouse.up();
  });

  it('sets the title 16 below the icon tile, not pushed to the bottom of a taller tile', async () => {
    const page = await newScPage(MARKUP.replace('Moving home', 'Moving home to a new emirate with your family'));
    const gaps = await page.evaluate(() =>
      ['#moving', '#fine'].map((id) => {
        const root = document.querySelector(id)!.shadowRoot!;
        return Math.round(root.querySelector('.title')!.getBoundingClientRect().top - root.querySelector('.icon-tile')!.getBoundingClientRect().bottom);
      }),
    );
    expect(gaps).toEqual([16, 16]);
  });

  it('re-renders the count in Arabic with Latin digits', async () => {
    const page = await newScPage(MARKUP);
    await setPageContext(page, { lang: 'ar' });
    const count = await page.evaluate(() => document.querySelector('#moving')!.shadowRoot!.querySelector('.count')!.textContent);
    expect(count).toBe(', 14 خدمة');
  });

  it('gives visual feedback on press and activates on release only: dragging off cancels (2.5.2)', async () => {
    const page = await newScPage(MARKUP);
    const r = await pressAndCancel(page, `document.querySelector('#baby').shadowRoot.querySelector('.tile')`, '[getComputedStyle(el).transform, getComputedStyle(el).backgroundImage]');
    expect(r.rest).toEqual(['none', 'none']);
    expect(r.pressed[0]).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
    expect(r.pressed[1]).toMatch(/^linear-gradient/);
    expect(r.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: r.rest });
    expect(r.clicked).toEqual({ clicks: 1, submits: 0, hashes: 1, hash: '#baby' });
  });
});

describe('sc-tile before it upgrades and without JavaScript (PERF-04)', () => {
  it.each(['en', 'ar'] as const)('the light-DOM link is the tile: the whole box follows it, at the final size (%s)', async (lang) => {
    const page = await noScriptPage(`<div style="inline-size:180px">${MARKUP.match(/<sc-tile id="fine">[\s\S]*?<\/sc-tile>/)![0]}</div>`, lang);
    const r = await page.evaluate(() => {
      const tile = document.querySelector('sc-tile')!.getBoundingClientRect();
      const corner = document.elementFromPoint(tile.left + 4, tile.bottom - 4);
      const icon = document.querySelector('sc-tile > svg')!.getBoundingClientRect();
      return { h: Math.round(tile.height), w: Math.round(tile.width), corner: corner?.closest('a')?.getAttribute('href'), icon: Math.round(icon.height) };
    });
    // The 24px icon in its 40px tile, and the height the upgraded tile has.
    const up = await newScPage(`<div style="inline-size:180px">${MARKUP.match(/<sc-tile id="fine">[\s\S]*?<\/sc-tile>/)![0]}</div>`, { lang });
    await loadFonts(up);
    const h = await up.evaluate(() => Math.round(document.querySelector('sc-tile')!.getBoundingClientRect().height));
    expect(r).toEqual({ h, w: 180, corner: '#fine', icon: 40 });
    expect(h).toBeGreaterThanOrEqual(112);
    await page.close();
  });

  it('once upgraded keeps the same size and leaves the light-DOM link unrendered', async () => {
    const page = await newScPage(`<div style="inline-size:180px">${MARKUP.match(/<sc-tile id="fine">[\s\S]*?<\/sc-tile>/)![0]}</div>`);
    const r = await page.evaluate(() => [Math.round(document.querySelector('sc-tile')!.getBoundingClientRect().height), document.querySelector('sc-tile > a')!.getClientRects().length]);
    expect(r).toEqual([112, 0]);
  });
});

describeAxe('sc-tile', MARKUP);
