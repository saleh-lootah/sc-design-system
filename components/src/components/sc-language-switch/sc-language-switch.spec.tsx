import { newSpecPage } from '@stencil/core/testing';
import { ScLanguageSwitch } from './sc-language-switch';

const control = (root: Element) => root.shadowRoot!.querySelector('[part="control"]') as HTMLElement;

describe('sc-language-switch (spec)', () => {
  it('on an English page, links to Arabic named in Arabic', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<div lang="en"><sc-language-switch href="/ar/renew"></sc-language-switch></div>` });
    const el = control(page.body.querySelector('sc-language-switch')!);
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/ar/renew');
    expect(el.getAttribute('hreflang')).toBe('ar');
    expect(el.getAttribute('lang')).toBe('ar');
    const label = el.querySelector('[part="label"]')!;
    expect(label.textContent).toBe('العربية');
    expect(label.getAttribute('lang')).toBe('ar');
    expect(label.getAttribute('dir')).toBe('rtl');
  });

  it('on an Arabic page, links to English named in English', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<div lang="ar" dir="rtl"><sc-language-switch href="/en/renew"></sc-language-switch></div>` });
    const el = control(page.body.querySelector('sc-language-switch')!);
    expect(el.getAttribute('hreflang')).toBe('en');
    const label = el.querySelector('[part="label"]')!;
    expect(label.textContent).toBe('English');
    expect(label.getAttribute('lang')).toBe('en');
    expect(label.getAttribute('dir')).toBe('ltr');
  });

  it('renders a button without href and emits scSwitch on click', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<sc-language-switch></sc-language-switch>` });
    const el = control(page.root!);
    expect(el.tagName).toBe('BUTTON');
    expect(el.hasAttribute('hreflang')).toBe(false);
    const spy = jest.fn();
    page.root!.addEventListener('scSwitch', (e) => spy((e as CustomEvent).detail));
    el.click();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith({ lang: 'ar' });
  });

  it('supports the plain appearance', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<sc-language-switch appearance="plain"></sc-language-switch>` });
    expect(control(page.root!)).toHaveClass('control--plain');
  });
});
