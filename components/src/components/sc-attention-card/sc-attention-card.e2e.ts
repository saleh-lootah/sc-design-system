import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const BULB = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>`;
const status = (words: string, tone = 'warning') => `<sc-status-tag slot="status" tone="${tone}">${words}</sc-status-tag>`;

export const MARKUP = `
  <main>
    <h2>Needs your attention</h2>
    <p>2 things, most urgent first</p>
    <ul style="display:grid;grid-template-columns:repeat(2,300px);gap:16px;list-style:none;padding:0">
      <li><sc-attention-card id="bill" tint="amber">${BULB}${status('Not paid')}Electricity and water bill
        <span slot="fact">Due tomorrow, 21 Oct 2026</span>
        <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr></span>
        <sc-button slot="action" variant="secondary" size="m" full-width href="#pay">Pay <sc-ltr>AED 412.60</sc-ltr></sc-button>
      </sc-attention-card></li>
      <li><sc-attention-card id="doc">${status('Action needed', 'error')}Upload your residence document
        <span slot="fact">Needed in 3 days, by 23 Oct 2026</span>
        <sc-button slot="action" variant="secondary" size="m" full-width href="#upload">Upload document</sc-button>
      </sc-attention-card></li>
    </ul>
  </main>`;

describe('sc-attention-card (e2e)', () => {
  it('is a neutral 12px card with no coloured edge; the icon tile takes the tint, else the status tone', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const card = (id: string) => getComputedStyle(document.querySelector(id)!.shadowRoot!.querySelector('.card')!);
      const tile = (id: string) => getComputedStyle(document.querySelector(id)!.shadowRoot!.querySelector('.icon-tile')!);
      const probe = document.createElement('i');
      document.body.append(probe);
      const resolve = (bg: string, fg: string) => {
        probe.style.backgroundColor = `var(${bg})`;
        probe.style.color = `var(${fg})`;
        return [getComputedStyle(probe).backgroundColor, getComputedStyle(probe).color];
      };
      const amber = resolve('--sc-color-tint-amber', '--sc-color-on-tint-amber');
      const edge = resolve('--sc-color-outline-variant', '--sc-color-on-surface')[0];
      const error = resolve('--sc-color-error-container', '--sc-color-on-error-container');
      probe.remove();
      return {
        bill: [card('#bill').borderTopWidth, card('#bill').borderTopColor === edge, card('#bill').borderTopLeftRadius, card('#bill').paddingTop],
        billTile: [tile('#bill').backgroundColor, tile('#bill').color].join() === amber.join(),
        docTile: [tile('#doc').backgroundColor, tile('#doc').color].join() === error.join(),
      };
    });
    expect(r).toEqual({ bill: ['1px', true, '12px', '20px'], billTile: true, docTile: true });
  });

  it('follows a status tone that changes', async () => {
    const page = await newScPage(MARKUP);
    await page.evaluate(() => document.querySelector('#doc sc-status-tag')!.setAttribute('tone', 'success'));
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('#doc')!.shadowRoot!.querySelector('.card')!.className)).toContain('card--tone-success');
  });

  it('sets the fact in body-medium and the meta in body-small, 4 apart; the action is full width', async () => {
    const page = await newScPage(MARKUP);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#bill')!.shadowRoot!;
      const fact = getComputedStyle(root.querySelector('.fact')!);
      const probe = document.createElement('i');
      probe.style.font = 'var(--sc-type-body-medium)';
      document.body.append(probe);
      const want = getComputedStyle(probe);
      const same = fact.fontSize === want.fontSize && fact.lineHeight === want.lineHeight && fact.fontWeight === want.fontWeight;
      probe.remove();
      const card = root.querySelector('.card')!.getBoundingClientRect();
      const action = document.querySelector('#bill [slot="action"]')!.getBoundingClientRect();
      return { same, gap: getComputedStyle(root.querySelector('.body')!).rowGap, full: Math.round(card.width - action.width) };
    });
    expect(r).toEqual({ same: true, gap: '4px', full: 42 });
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
