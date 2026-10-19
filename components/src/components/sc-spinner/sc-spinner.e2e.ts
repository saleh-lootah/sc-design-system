import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function sp(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const root = document.querySelector(sel)!.shadowRoot!;
      // eslint-disable-next-line no-new-func
      return new Function('root', `return (${expr});`)(root);
    },
    selector,
    read,
  );
}

describe('sc-spinner (e2e)', () => {
  it('is 20px, spins and uses currentColor', async () => {
    const page = await newScPage(`<p style="color: var(--sc-color-error)"><sc-spinner></sc-spinner></p>`);
    // Computed size, not the bounding box: a rotating square's box is up to 1.41 times wider.
    expect(await sp(page, 'sc-spinner', 'getComputedStyle(root.querySelector("svg")).width')).toBe('20px');
    expect(await sp(page, 'sc-spinner', 'getComputedStyle(root.querySelector("svg")).animationName')).toBe('sc-spin');
    const colour = await page.$eval('p', (p) => getComputedStyle(p).color);
    expect(await sp(page, 'sc-spinner', 'getComputedStyle(root.querySelector("svg")).color')).toBe(colour);
  });

  it('keeps the label visually hidden but readable', async () => {
    const page = await newScPage(`<sc-spinner></sc-spinner>`);
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").getBoundingClientRect().width')).toBeLessThanOrEqual(1);
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[role=status]").textContent')).toBe('Loading');
  });

  it('stops spinning and shows its label under reduced motion', async () => {
    const page = await newScPage(`<sc-spinner></sc-spinner>`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    expect(await sp(page, 'sc-spinner', 'getComputedStyle(root.querySelector("svg")).animationName')).toBe('none');
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").getBoundingClientRect().width')).toBeGreaterThan(20);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sc-duration-spin').trim())).toBe('0ms');
  });

  it('re-renders its label when lang changes', async () => {
    const page = await newScPage(`<sc-spinner show-label></sc-spinner>`, { lang: 'en' });
    await setPageContext(page, { lang: 'ar' });
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").textContent')).toBe('جارٍ التحميل');
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(
        `<main><h1>My vehicles</h1><sc-spinner></sc-spinner><sc-spinner show-label label="Checking your plate number"></sc-spinner><p style="color: var(--sc-channel-action)"><sc-spinner show-label></sc-spinner></p></main>`,
        ctx,
      );
      await expectNoAxeViolations(page);
    });
  }
});
