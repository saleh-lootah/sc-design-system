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

const CAR = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 16h14v-4l-2-5H7l-2 5zM7 19v-3M17 19v-3"/></svg>`;
export const MARKUP = `
  <main>
    <h2>At a glance</h2>
    <div style="display:grid;grid-template-columns:repeat(2,360px);gap:16px">
      <sc-module-card id="fines" heading="Traffic fines" action-href="#fines" action-text="View fines" tint="amber" divided>${CAR}
        <div><p style="margin:0">To pay</p><p style="margin:0;font:var(--sc-type-headline-medium)"><sc-ltr>AED 600.00</sc-ltr></p></div>
        <p>F-2026-118204 · Speeding, 14 Oct 2026</p>
        <sc-button slot="footer" variant="secondary" size="m" full-width href="#pay">Pay all fines</sc-button>
      </sc-module-card>
      <sc-module-card id="apps" heading="Applications" action-href="#apps" action-text="View all">
        <p>Ejari tenancy renewal, step 2 of 4</p>
      </sc-module-card>
    </div>
  </main>`;

describe('sc-module-card (e2e)', () => {
  it('names each header link by its text and the module title', async () => {
    const page = await newScPage(MARKUP);
    const snap = await page.accessibility.snapshot();
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; level?: number; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'heading' && n.level === 3) found.push(`h3:${n.name}`);
      if (n.role === 'link') found.push(`link:${n.name!.replace(" ,", ",")}`);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snap as never);
    expect(found).toEqual(['h3:Traffic fines', 'link:View fines, Traffic fines', 'link:Pay all fines', 'h3:Applications', 'link:View all, Applications']);
  });

  it('is a 12px card with 24px padding; the link sits at the end of the header, 44px tall, underlined', async () => {
    const page = await newScPage(MARKUP);
    const read = () =>
      page.evaluate(() => {
        const root = document.querySelector('#fines')!.shadowRoot!;
        const card = root.querySelector('.card')!;
        const link = root.querySelector('.link')!;
        const c = card.getBoundingClientRect();
        const l = link.getBoundingClientRect();
        return { radius: getComputedStyle(card).borderTopLeftRadius, pad: getComputedStyle(card).paddingTop, h: l.height, ul: getComputedStyle(link).textDecorationLine, endGap: Math.round(document.documentElement.dir === 'rtl' ? l.left - c.left : c.right - l.right) };
      });
    expect(await read()).toEqual({ radius: '12px', pad: '24px', h: 44, ul: 'underline', endGap: 25 });
    await setPageContext(page, { lang: 'ar' });
    expect((await read()).endGap).toBe(25);
  });

  it('separates content blocks with rules when divided', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const kids = document.querySelectorAll('#fines > :not([slot])');
      return [getComputedStyle(kids[0]).borderTopWidth, getComputedStyle(kids[1]).borderTopWidth];
    });
    expect(r).toEqual(['0px', '1px']);
  });

  it('pushes the footer action to the bottom, below a 1px rule 20 from it; no footer without the slot', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const root = (id: string) => document.querySelector(id)!.shadowRoot!;
      const footer = root('#fines').querySelector('.footer')!;
      const card = root('#fines').querySelector('.card')!.getBoundingClientRect();
      const btn = document.querySelector('#fines [slot="footer"]')!.getBoundingClientRect();
      return {
        rule: getComputedStyle(footer).borderTopWidth,
        pad: getComputedStyle(footer).paddingTop,
        bottom: Math.round(card.bottom - btn.bottom),
        full: Math.round(card.width - btn.width),
        none: getComputedStyle(root('#apps').querySelector('.footer')!).display,
      };
    });
    expect(r).toEqual({ rule: '1px', pad: '20px', bottom: 25, full: 50, none: 'none' });
  });

  it('gives visual feedback on press and activates on release only: dragging off cancels (2.5.2)', async () => {
    const page = await newScPage(MARKUP);
    const r = await pressAndCancel(page, `document.querySelector('#apps').shadowRoot.querySelector('.link')`, 'getComputedStyle(el).color');
    expect(r.pressed).not.toBe(r.rest);
    expect(r.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: r.rest });
    expect(r.clicked).toEqual({ clicks: 1, submits: 0, hashes: 1, hash: '#apps' });
  });
});

describeAxe('sc-module-card', MARKUP);
