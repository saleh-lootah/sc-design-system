import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

const MARKUP = `
  <main>
    <h1>Dubai Now</h1>
    <sc-card id="plain"><p>Seven services from five government entities.</p></sc-card>
    <sc-card id="region" landmark="section"><h2>My tasks</h2><p>Your vehicle registration expires in 15 days.</p></sc-card>
    <sc-card id="article" landmark="article" padding="m"><h2>Changes to parking fees</h2><p>New fees start on 1 January 2027.</p></sc-card>
  </main>`;

describe('sc-card (e2e)', () => {
  it('has no axe violations in English and Arabic, light and dark', async () => {
    const page = await newScPage(MARKUP);
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
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

  it('uses the card radius, surface fill and the two paddings', async () => {
    const page = await newScPage(MARKUP);
    const styles = await page.evaluate(() =>
      ['#plain', '#article'].map((s) => {
        const cs = getComputedStyle(document.querySelector(s)!.shadowRoot!.querySelector('.surface')!);
        return [cs.borderTopLeftRadius, cs.paddingTop, cs.boxShadow !== 'none'];
      }),
    );
    expect(styles).toEqual([
      ['20px', '24px', true],
      ['20px', '16px', true],
    ]);
  });

  it('follows the theme: the surface changes in dark mode', async () => {
    const page = await newScPage(MARKUP);
    const fill = () => page.evaluate(() => getComputedStyle(document.querySelector('#plain')!.shadowRoot!.querySelector('.surface')!).backgroundColor);
    const light = await fill();
    await setPageContext(page, { theme: 'dark' });
    expect(await fill()).not.toBe(light);
  });

  it('keeps a visible edge in forced colours', async () => {
    const page = await newScPage(MARKUP);
    // Puppeteer's emulateMediaFeatures doesn't list forced-colors; Chromium's CDP does.
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const border = await page.evaluate(() => getComputedStyle(document.querySelector('#plain')!.shadowRoot!.querySelector('.surface')!).borderTopColor);
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  });
});
