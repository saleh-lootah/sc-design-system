import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const BULB = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>`;
/** A stand-in status tag (the real sc-status-tag is rebuilt by another family): icon and words. */
const status = (words: string) => `<span slot="status" style="color:var(--sc-color-warning)">● ${words}</span>`;

export const MARKUP = `
  <main>
    <h2>Needs your attention</h2>
    <p>2 things, most urgent first</p>
    <ul style="display:grid;grid-template-columns:repeat(2,300px);gap:16px;list-style:none;padding:0">
      <li><sc-attention-card id="bill" tint="amber">${BULB}${status('Not paid')}Electricity and water bill
        <span slot="fact">Due tomorrow, 21 Oct 2026</span>
        <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr></span>
        <sc-button slot="action" variant="secondary" size="m" href="#pay">Pay <sc-ltr>AED 412.60</sc-ltr></sc-button>
      </sc-attention-card></li>
      <li><sc-attention-card id="doc">${status('Action needed')}Upload your residence document
        <span slot="fact">Needed in 3 days, by 23 Oct 2026</span>
        <sc-button slot="action" variant="secondary" size="m" href="#upload">Upload document</sc-button>
      </sc-attention-card></li>
    </ul>
  </main>`;

describe('sc-attention-card (e2e)', () => {
  it('is a neutral 12px card with a 4px top strip in the topic ink only when tinted', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const card = (id: string) => getComputedStyle(document.querySelector(id)!.shadowRoot!.querySelector('.card')!);
      const probe = document.createElement('i');
      probe.style.color = 'var(--sc-color-on-tint-amber)';
      document.body.append(probe);
      const ink = getComputedStyle(probe).color;
      probe.remove();
      return {
        bill: [card('#bill').borderTopWidth, card('#bill').borderTopColor === ink, card('#bill').borderTopLeftRadius, card('#bill').backgroundColor],
        doc: card('#doc').borderTopWidth,
        page: getComputedStyle(document.body).backgroundColor,
      };
    });
    expect(r.bill.slice(0, 3)).toEqual(['4px', true, '12px']);
    expect(r.doc).toBe('1px');
  });

  it('exposes the title as a heading and one action named for the action and item', async () => {
    const page = await newScPage(MARKUP);
    const snap = await page.accessibility.snapshot();
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; level?: number; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'heading' && n.level === 3) found.push(`h3:${n.name}`);
      if (n.role === 'link') found.push(`link:${n.name}`);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snap as never);
    expect(found).toEqual(['h3:Electricity and water bill', 'link:Pay AED 412.60', 'h3:Upload your residence document', 'link:Upload document']);
  });

  it('lines actions up at the bottom of cards in a row', async () => {
    const page = await newScPage(MARKUP);
    const tops = await page.evaluate(() => ['#bill', '#doc'].map((id) => Math.round(document.querySelector(`${id} [slot="action"]`)!.getBoundingClientRect().bottom)));
    expect(tops[0]).toBe(tops[1]);
  });

  it('mirrors in Arabic: icon tile at the right, status at the left', async () => {
    const page = await newScPage(MARKUP);
    await setPageContext(page, { lang: 'ar' });
    const r = await page.evaluate(() => {
      const root = document.querySelector('#bill')!.shadowRoot!;
      return [root.querySelector('.icon-tile')!.getBoundingClientRect().x, document.querySelector('#bill [slot="status"]')!.getBoundingClientRect().x];
    });
    expect(r[0]).toBeGreaterThan(r[1]);
  });
});

describeAxe('sc-attention-card', MARKUP);
