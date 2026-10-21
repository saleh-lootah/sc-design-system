import { newSpecPage } from '@stencil/core/testing';
import { ScAccordion } from './sc-accordion';

const FAQ = `
  <details><summary>How long does renewal take?</summary><p>Usually 10 minutes.</p></details>
  <details><summary>What do I need?</summary><p>A valid insurance policy.</p></details>`;

describe('sc-accordion (spec)', () => {
  it('renders in light DOM and keeps the native details', async () => {
    const page = await newSpecPage({ components: [ScAccordion], html: `<sc-accordion>${FAQ}</sc-accordion>` });
    expect(page.root!.shadowRoot).toBeNull();
    expect(page.root).toHaveClass('sc-accordion');
    expect(page.root!.querySelectorAll('details').length).toBe(2);
    expect(page.root!.querySelector('button')).toBeNull();
  });

  it('adds the show-all toggle, which opens and closes every section', async () => {
    const page = await newSpecPage({ components: [ScAccordion], html: `<sc-accordion show-all>${FAQ}</sc-accordion>` });
    const button = page.root!.querySelector('button.sc-accordion__toggle')!;
    expect(button.textContent).toBe('Show all sections');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    (button as HTMLButtonElement).click();
    await page.waitForChanges();
    expect(Array.from(page.root!.querySelectorAll('details')).every((d) => (d as HTMLDetailsElement).open || d.hasAttribute('open'))).toBe(true);
    expect(button.textContent).toBe('Hide all sections');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('writes the toggle in Arabic', async () => {
    const page = await newSpecPage({ components: [ScAccordion], html: `<div lang="ar"><sc-accordion show-all>${FAQ}</sc-accordion></div>` });
    expect(page.body.querySelector('button')!.textContent).toBe('إظهار كل الأقسام');
  });
});
