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

export const MARKUP = `
  <main>
    <h1>Dubai Now</h1>
    <sc-card id="plain"><p>Seven services from five government entities.</p></sc-card>
    <sc-card id="region" landmark="section"><h2>My tasks</h2><p>Your vehicle registration expires in 15 days.</p></sc-card>
    <sc-card id="article" landmark="article" padding="m"><h2>Changes to parking fees</h2><p>New fees start on 1 January 2027.</p></sc-card>
    <sc-card id="filled" variant="filled"><p>Total <sc-ltr>AED 420.00</sc-ltr></p></sc-card>
  </main>`;

const style = (page: import('@stencil/core/testing').E2EPage, sel: string) =>
  page.evaluate((s: string) => {
    const cs = getComputedStyle(document.querySelector(s)!);
    return { radius: cs.borderTopLeftRadius, padding: cs.paddingTop, shadow: cs.boxShadow, border: cs.borderTopWidth, edge: cs.borderTopColor, fill: cs.backgroundColor };
  }, sel);

const token = (page: import('@stencil/core/testing').E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.backgroundColor = `var(${n})`;
    document.querySelector('main')!.append(probe);
    const v = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return v;
  }, name);

describe('sc-card (e2e)', () => {
  it('renders in light DOM: content stays a direct child of the host', async () => {
    const page = await newScPage(MARKUP);
    expect(await page.evaluate(() => [!!document.querySelector('#plain')!.shadowRoot, document.querySelector('#plain > p') !== null])).toEqual([false, true]);
  });

  it('exposes named region and article landmarks', async () => {
    const page = await newScPage(MARKUP);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'region' || n.role === 'article') found.push(`${n.role}:${n.name}`);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snapshot as never);
    expect(found).toEqual(['region:My tasks', 'article:Changes to parking fees']);
  });

  it('is flat and outline-first: 12px radius, 1px outline-variant edge, no shadow, 24 or 16px padding', async () => {
    const page = await newScPage(MARKUP);
    const plain = await style(page, '#plain');
    expect([plain.radius, plain.padding, plain.shadow, plain.border]).toEqual(['12px', '24px', 'none', '1px']);
    expect(plain.edge).toBe(await token(page, '--sc-color-outline-variant'));
    expect(plain.fill).toBe(await token(page, '--sc-color-surface-card'));
    expect((await style(page, '#article')).padding).toBe('16px');
  });

  it('fills the filled variant with surface-container and hides its edge', async () => {
    const page = await newScPage(MARKUP);
    const filled = await style(page, '#filled');
    expect(filled.fill).toBe(await token(page, '--sc-color-surface-container'));
    expect(filled.edge).toBe('rgba(0, 0, 0, 0)');
  });

  it('follows the theme: the surface changes in dark mode', async () => {
    const page = await newScPage(MARKUP);
    const light = (await style(page, '#plain')).fill;
    await setPageContext(page, { theme: 'dark' });
    const dark = (await style(page, '#plain')).fill;
    expect(dark).not.toBe(light);
    expect(dark).toBe(await token(page, '--sc-color-surface-card'));
    // A filled card steps up to surface-container-high in dark mode (board 09.02).
    expect((await style(page, '#filled')).fill).toBe(await token(page, '--sc-color-surface-container-high'));
  });

  it('removes the outer margins of its first and last children', async () => {
    const page = await newScPage(MARKUP);
    const m = await page.evaluate(() => {
      const p = document.querySelector('#plain > p')!;
      return [getComputedStyle(p).marginTop, getComputedStyle(p).marginBottom];
    });
    expect(m).toEqual(['0px', '0px']);
  });

  it('names a landmark added later from its heading', async () => {
    const page = await newScPage(`<sc-card id="c"><p>x</p></sc-card>`);
    await page.evaluate(() => {
      const c = document.querySelector('#c')!;
      c.insertAdjacentHTML('afterbegin', '<h2 id="late">Vehicles</h2>');
      c.setAttribute('landmark', 'section');
    });
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('#c')!.getAttribute('aria-labelledby'))).toBe('late');
  });

  it('keeps a visible edge in forced colours, also on the filled variant', async () => {
    const page = await newScPage(MARKUP);
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const border = await page.evaluate(() => ['#plain', '#filled'].map((s) => getComputedStyle(document.querySelector(s)!).borderTopColor));
    for (const b of border) expect(b).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('adds no press behaviour: a control inside activates on release only, dragging off cancels (2.5.2)', async () => {
    const page = await newScPage(`<main><sc-card id="tasks" landmark="section"><h2>My tasks</h2><p><a id="more" href="#more">See all tasks</a></p></sc-card></main>`);
    const look = `(c => [c.transform, c.backgroundColor, c.borderTopColor])(getComputedStyle(document.querySelector('#tasks')))`;
    const r = await pressAndCancel(page, `document.querySelector('#more')`, look);
    expect(r.pressed).toEqual(r.rest);
    expect(r.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: r.rest });
    expect(r.clicked).toEqual({ clicks: 1, submits: 0, hashes: 1, hash: '#more' });
  });
});

describeAxe('sc-card', MARKUP);
