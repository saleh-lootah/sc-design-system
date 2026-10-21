import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

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
  it('is 20px (24px at size l), uses currentColor and turns once per 600ms, linear', async () => {
    const page = await newScPage(`<p style="color: var(--sc-color-error)"><sc-spinner id="m"></sc-spinner><sc-spinner id="l" size="l"></sc-spinner></p>`);
    // Computed size, not the bounding box: a rotating square's box is up to 1.41 times wider.
    expect(await sp(page, '#m', 'getComputedStyle(root.querySelector("svg")).width')).toBe('20px');
    expect(await sp(page, '#l', 'getComputedStyle(root.querySelector("svg")).width')).toBe('24px');
    const anim = await sp(page, '#m', '(() => { const s = getComputedStyle(root.querySelector("svg")); return [s.animationName, s.animationDuration, s.animationTimingFunction]; })()');
    expect(anim).toEqual(['sc-spin', '0.6s', 'linear']);
    const colour = await page.$eval('p', (p) => getComputedStyle(p).color);
    expect(await sp(page, '#m', 'getComputedStyle(root.querySelector("svg")).color')).toBe(colour);
  });

  it('keeps the label visually hidden but readable', async () => {
    const page = await newScPage(`<sc-spinner></sc-spinner>`);
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").getBoundingClientRect().width')).toBeLessThanOrEqual(1);
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[role=status]").textContent')).toBe('Loading');
  });

  it('stops turning and shows its label under reduced motion', async () => {
    const page = await newScPage(`<sc-spinner></sc-spinner>`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    expect(await sp(page, 'sc-spinner', 'getComputedStyle(root.querySelector("svg")).animationName')).toBe('none');
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").getBoundingClientRect().width')).toBeGreaterThan(20);
  });

  it('does not mirror in Arabic, and re-renders its label when lang changes', async () => {
    const page = await newScPage(`<sc-spinner show-label></sc-spinner>`, { lang: 'en' });
    await setPageContext(page, { lang: 'ar' });
    expect(await sp(page, 'sc-spinner', 'root.querySelector("[part=label]").textContent')).toBe('جارٍ التحميل');
    expect(await sp(page, 'sc-spinner', 'root.querySelector("svg").classList.contains("icon-directional")')).toBe(false);
  });
});

describeAxe(
  'sc-spinner',
  `<main><h1>My vehicles</h1><sc-spinner></sc-spinner><sc-spinner show-label label="Checking your plate number"></sc-spinner><p style="color: var(--sc-color-channel-action)"><sc-spinner show-label size="l"></sc-spinner></p></main>`,
);
