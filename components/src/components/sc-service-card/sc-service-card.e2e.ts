import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

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

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

export const GRID = `
  <main>
    <h1>Dubai Now</h1>
    <h2>Most used services</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 300px); gap: 24px">
      <sc-service-card id="renew" href="#renew" entity="Roads and Transport Authority">Renew vehicle registration
        <span slot="chip" style="background: var(--sc-color-channel-subtle); color: var(--sc-color-channel-on-container)" data-channel="transport">Also on Dubai Transport</span></sc-service-card>
      <sc-service-card id="bills" href="#bills" entity="Dubai Electricity and Water Authority" tint="amber"><svg slot="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>Pay water and electricity bills</sc-service-card>
      <sc-service-card id="tenancy" href="#tenancy" entity="Dubai Land Department">Register a tenancy contract
        <a slot="chip" id="chip-link" href="#build" style="color: var(--sc-color-channel-action)">Also on Build in Dubai</a></sc-service-card>
    </div>
  </main>`;

describe('sc-service-card (e2e)', () => {
  it('is one tab stop per card; Enter follows the link', async () => {
    const page = await newScPage(GRID);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('renew');
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.tagName)).toBe('A');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('bills');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#bills');
  });

  it('shows the focus ring around the title link', async () => {
    const page = await newScPage(GRID);
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.querySelector('#renew')!.shadowRoot!.querySelector('a')!).outlineWidth);
    expect(outline).toBe('3px');
  });

  it('links from the title only, not the whole card; a chip link keeps its own target (CMP-06)', async () => {
    const page = await newScPage(GRID);
    const centre = (sel: string) =>
      page.evaluate((s: string) => {
        const [host, inner] = s.split(' >>> ');
        let el: Element = document.querySelector(host)!;
        if (inner) el = el.shadowRoot!.querySelector(inner)!;
        const r = el.getBoundingClientRect();
        return [r.x + r.width / 2, r.y + r.height / 2];
      }, sel);
    // Bottom-end corner of the card, away from the title: nothing happens.
    const corner = await page.evaluate(() => {
      const r = document.querySelector('#bills')!.getBoundingClientRect();
      return [r.right - 12, r.bottom - 12];
    });
    await page.mouse.click(corner[0], corner[1]);
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('');

    // A plain chip is not a link.
    const chip = await centre('#renew [slot="chip"]');
    await page.mouse.click(chip[0], chip[1]);
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('');

    const title = await centre('#bills >>> .link');
    await page.mouse.click(title[0], title[1]);
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#bills');

    const link = await centre('#chip-link');
    await page.mouse.click(link[0], link[1]);
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#build');
  });

  it('gives the title link a target of at least 44 x 44 px (A11Y-04)', async () => {
    const page = await newScPage(GRID);
    const size = await page.evaluate(() => {
      const a = document.querySelector('#bills')!.shadowRoot!.querySelector('.link')!;
      const r = a.getBoundingClientRect();
      const after = getComputedStyle(a, '::after');
      return {
        position: after.position,
        height: r.height - parseFloat(after.top) - parseFloat(after.bottom),
        width: r.width - parseFloat(after.left) - parseFloat(after.right),
        card: document.querySelector('#bills')!.getBoundingClientRect().height,
      };
    });
    expect(size.position).toBe('absolute');
    expect(size.height).toBeGreaterThanOrEqual(44);
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeLessThan(size.card);
  });

  it('names the link by the title and describes it by the entity', async () => {
    const page = await newScPage(GRID);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
    const links: { name?: string; description?: string }[] = [];
    const walk = (n: { role?: string; name?: string; description?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'link') links.push({ name: n.name, description: n.description });
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snapshot as never);
    expect(links[0].name).toBe('Renew vehicle registration');
    expect(links[0].description).toBe('Roads and Transport Authority');
    // Short names only: the entity and chip text never leak into the card links' names.
    expect(links.map((l) => l.name)).toEqual(['Renew vehicle registration', 'Pay water and electricity bills', 'Register a tenancy contract', 'Also on Build in Dubai']);
  });

  it('is a flat 12px card with a 1px edge, 24px padding and at least 184px tall', async () => {
    const page = await newScPage(GRID);
    const r = await page.evaluate(() => {
      const card = document.querySelector('#bills')!.shadowRoot!.querySelector('.card')!;
      const cs = getComputedStyle(card);
      return [cs.borderTopLeftRadius, cs.borderTopWidth, cs.paddingTop, cs.boxShadow, card.getBoundingClientRect().height >= 184];
    });
    expect(r).toEqual(['12px', '1px', '24px', 'none', true]);
  });

  it('draws a decorative arrow at the top end in the channel colour, mirrored in Arabic', async () => {
    const page = await newScPage(GRID);
    const read = () =>
      page.evaluate(() => {
        const root = document.querySelector('#bills')!.shadowRoot!;
        const arrow = root.querySelector('.arrow')!;
        const a = arrow.getBoundingClientRect();
        const card = root.querySelector('.card')!.getBoundingClientRect();
        const title = root.querySelector('.title')!.getBoundingClientRect();
        return {
          endGap: getComputedStyle(document.documentElement).direction === 'rtl' ? a.left - card.left : card.right - a.right,
          top: Math.abs(a.top + a.height / 2 - (title.top + 14)) < 3,
          size: a.width,
          transform: getComputedStyle(arrow.querySelector('svg')!).transform,
          colour: getComputedStyle(arrow).color,
        };
      });
    const en = await read();
    expect(Math.round(en.endGap)).toBe(25);
    expect(en.size).toBe(24);
    expect(en.transform).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    const ar = await read();
    expect(Math.round(ar.endGap)).toBe(25);
    expect(ar.transform).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });

  it('colours the icon tile with the tint roles', async () => {
    const page = await newScPage(GRID);
    const r = await page.evaluate(() => {
      const tile = document.querySelector('#bills')!.shadowRoot!.querySelector('.icon-tile')!;
      const probe = document.createElement('i');
      probe.style.backgroundColor = 'var(--sc-color-tint-amber)';
      probe.style.color = 'var(--sc-color-on-tint-amber)';
      document.body.append(probe);
      const want = [getComputedStyle(probe).backgroundColor, getComputedStyle(probe).color];
      probe.remove();
      const cs = getComputedStyle(tile);
      return [cs.backgroundColor === want[0], cs.color === want[1], tile.getBoundingClientRect().width];
    });
    expect(r).toEqual([true, true, 40]);
  });

  it('shows the hover state only with a fine pointer', async () => {
    const underlinesOnHover = async (touch: boolean) => {
      const page = await newScPage(GRID);
      // Touch emulation switches Chromium to (hover: none) and (pointer: coarse); its media
      // emulation can't set `pointer` on its own.
      await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 5 });
      const box = await page.evaluate(() => {
        const r = document.querySelector('#bills')!.shadowRoot!.querySelector('.link')!.getBoundingClientRect();
        return [r.x + r.width / 2, r.y + r.height / 2];
      });
      await page.mouse.move(box[0], box[1]);
      // The underline has no transition, so it can be read straight away.
      return page.evaluate(() => getComputedStyle(document.querySelector('#bills')!.shadowRoot!.querySelector('.link')!).textDecorationLine === 'underline');
    };
    expect(await underlinesOnHover(false)).toBe(true);
    expect(await underlinesOnHover(true)).toBe(false);

    // Every :hover rule sits under (hover: hover) and (pointer: fine), so a device that
    // reports hover with a coarse pointer gets no sticky hover either.
    const page = await newScPage(GRID);
    const hoverRules = await page.evaluate(() => {
      const root = document.querySelector('#bills')!.shadowRoot!;
      const sheets = [...root.adoptedStyleSheets, ...Array.from(root.querySelectorAll('style')).map((s) => s.sheet!)];
      const found: { selector: string; media: string | null }[] = [];
      const walk = (rules: CSSRuleList, media: string | null) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSMediaRule) walk(rule.cssRules, rule.conditionText);
          else if (rule instanceof CSSStyleRule && rule.selectorText.includes(':hover')) found.push({ selector: rule.selectorText, media });
        }
      };
      sheets.forEach((sheet) => walk(sheet.cssRules, null));
      return found;
    });
    expect(hoverRules.length).toBeGreaterThan(0);
    for (const rule of hoverRules) expect(rule.media?.replace(/\s+/g, ' ')).toBe('(hover: hover) and (pointer: fine)');
  });

  it('keeps the card edge and link colour in forced colours', async () => {
    const page = await newScPage(GRID);
    // Puppeteer's emulateMediaFeatures doesn't list forced-colors; Chromium's CDP does.
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const border = await page.evaluate(() => getComputedStyle(document.querySelector('#renew')!.shadowRoot!.querySelector('.card')!).borderTopColor);
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('gives visual feedback on press and activates on release only: dragging off cancels (2.5.2)', async () => {
    const page = await newScPage(GRID);
    const r = await pressAndCancel(page, `document.querySelector('#bills').shadowRoot.querySelector('.link')`, 'getComputedStyle(el).color');
    expect(r.pressed).not.toBe(r.rest);
    expect(r.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: r.rest });
    expect(r.clicked).toEqual({ clicks: 1, submits: 0, hashes: 1, hash: '#bills' });
  });
});

describeAxe('sc-service-card', GRID);
