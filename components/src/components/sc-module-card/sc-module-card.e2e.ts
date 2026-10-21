import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

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
});

describeAxe('sc-module-card', MARKUP);
