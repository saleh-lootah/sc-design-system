import { newSpecPage } from '@stencil/core/testing';
import { ScErrorSummary } from './sc-error-summary';

const root = (page: { root?: HTMLElement }) => page.root!.shadowRoot!;

describe('sc-error-summary (spec)', () => {
  it('renders the heading from strings and one list item per slotted link', async () => {
    const page = await newSpecPage({
      components: [ScErrorSummary],
      html: `<sc-error-summary no-autofocus><a href="#plate-number">Enter the plate number</a><a href="#plate-code">Enter the plate code</a></sc-error-summary>`,
    });
    const r = root(page);
    expect(r.querySelector('h2')!.textContent).toBe('There is a problem');
    const links = Array.from(r.querySelectorAll('ul li a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#plate-number', '#plate-code']);
    expect(links.map((a) => a.textContent)).toEqual(['Enter the plate number', 'Enter the plate code']);
  });

  it('reads links nested in a slotted list, and ignores the description slot', async () => {
    const page = await newSpecPage({
      components: [ScErrorSummary],
      html: `<sc-error-summary no-autofocus><p slot="description">Check <a href="#help">help</a></p><ul><li><a href="#plate-number">Enter the plate number</a></li></ul></sc-error-summary>`,
    });
    const links = Array.from(root(page).querySelectorAll('ul a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#plate-number']);
    expect(root(page).querySelector('.description')).not.toHaveClass('description--empty');
  });

  it('is focusable by script, labelled by its heading, and not a live region', async () => {
    const page = await newSpecPage({ components: [ScErrorSummary], html: `<sc-error-summary no-autofocus><a href="#x">Error</a></sc-error-summary>` });
    const box = root(page).querySelector('[part="container"]')!;
    expect(box.getAttribute('tabindex')).toBe('-1');
    expect(box.getAttribute('role')).toBe('group');
    expect(box.hasAttribute('aria-live')).toBe(false);
    expect(box.getAttribute('aria-labelledby')).toBe('heading');
    expect(root(page).getElementById('heading')).not.toBeNull();
  });

  it('uses the errors property instead of slotted links', async () => {
    const page = await newSpecPage({ components: [ScErrorSummary], html: `<sc-error-summary no-autofocus><a href="#slotted">Slotted</a></sc-error-summary>` });
    page.root!.errors = [{ href: '#plate-number', text: 'Enter the plate number' }];
    await page.waitForChanges();
    const links = Array.from(root(page).querySelectorAll('ul a'));
    expect(links.map((a) => a.textContent)).toEqual(['Enter the plate number']);
  });

  it('hides itself when there are no errors', async () => {
    const page = await newSpecPage({ components: [ScErrorSummary], html: `<sc-error-summary no-autofocus></sc-error-summary>` });
    expect(page.root).toHaveClass('is-empty');
  });

  it('takes a custom heading and heading level', async () => {
    const page = await newSpecPage({
      components: [ScErrorSummary],
      html: `<sc-error-summary no-autofocus heading="Check your vehicle details" heading-level="3"><a href="#x">Error</a></sc-error-summary>`,
    });
    expect(root(page).querySelector('h3')!.textContent).toBe('Check your vehicle details');
    expect(root(page).querySelector('h2')).toBeNull();
  });

  it('uses the Arabic heading from the closest lang', async () => {
    const page = await newSpecPage({ components: [ScErrorSummary], html: `<div lang="ar" dir="rtl"><sc-error-summary no-autofocus><a href="#x">خطأ</a></sc-error-summary></div>` });
    expect(page.body.querySelector('sc-error-summary')!.shadowRoot!.querySelector('h2')!.textContent).toBe('توجد مشكلة');
  });
});
