import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const MARKUP = `
  <main><h1>Dubai Now</h1></main>
  <sc-footer help-href="#help" accessibility-href="#a11y" privacy-href="#privacy" terms-href="#terms">
    <a href="#cookies">Cookies</a>
  </sc-footer>`;

describe('sc-footer (e2e)', () => {
  it('has no axe violations in English and Arabic, light and dark', async () => {
    const page = await newScPage(MARKUP);
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
  });

  it('is the contentinfo landmark with a list of five links', async () => {
    const page = await newScPage(MARKUP);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
    const json = JSON.stringify(snapshot);
    expect(json).toContain('"role":"contentinfo"');
    const items = await page.evaluate(() => document.querySelector('sc-footer')!.shadowRoot!.querySelectorAll('ul > li').length);
    expect(items).toBe(5);
  });

  it('Tab moves through every link in order, including slotted ones', async () => {
    const page = await newScPage(MARKUP);
    const names: string[] = [];
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      names.push(
        await page.evaluate(() => {
          const a = document.activeElement!;
          return (a.shadowRoot?.activeElement ?? a).textContent!.trim();
        }),
      );
    }
    expect(names).toEqual(['Help and contact', 'Accessibility', 'Privacy', 'Terms', 'Cookies']);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#cookies');
  });

  it('gives links 44px targets and a focus ring', async () => {
    const page = await newScPage(MARKUP);
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const a = document.querySelector('sc-footer')!.shadowRoot!.querySelector('a')!;
      return [a.getBoundingClientRect().height, getComputedStyle(a).outlineWidth];
    });
    expect(r[0]).toBeGreaterThanOrEqual(44);
    expect(r[1]).toBe('3px');
  });

  it('re-renders strings when the language changes, and mirrors', async () => {
    const page = await newScPage(MARKUP);
    const read = () =>
      page.evaluate(() => {
        const root = document.querySelector('sc-footer')!.shadowRoot!;
        return {
          first: root.querySelector('li a')!.textContent,
          meta: root.querySelector('.meta')!.textContent,
          listX: root.querySelector('ul')!.getBoundingClientRect().x,
          metaX: root.querySelector('.meta')!.getBoundingClientRect().x,
        };
      });
    const en = await read();
    expect(en.first).toBe('Help and contact');
    expect(en.meta).toBe('Government of Dubai');
    expect(en.listX).toBeLessThan(en.metaX);
    await setPageContext(page, { lang: 'ar' });
    const ar = await read();
    expect(ar.first).toBe('المساعدة والتواصل');
    expect(ar.meta).toBe('حكومة دبي');
    expect(ar.listX).toBeGreaterThan(ar.metaX);
  });
});
