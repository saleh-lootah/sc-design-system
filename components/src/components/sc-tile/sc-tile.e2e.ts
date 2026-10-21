import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const ICON = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11l8-7 8 7v9H4z"/></svg>`;
export const MARKUP = `
  <main>
    <h2>Browse by life event</h2>
    <ul style="display:grid;grid-template-columns:repeat(3,180px);gap:16px;list-style:none;padding:0">
      <li><sc-tile id="moving" href="#moving" tint="orange" count="14">${ICON}Moving home</sc-tile></li>
      <li><sc-tile id="baby" href="#baby" tint="rose" count="1">${ICON}Having a baby</sc-tile></li>
      <li><sc-tile id="fine" href="#fine">${ICON}Pay a traffic fine</sc-tile></li>
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
});

describeAxe('sc-tile', MARKUP);
