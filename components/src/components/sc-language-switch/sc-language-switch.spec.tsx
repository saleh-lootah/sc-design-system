import { newSpecPage } from '@stencil/core/testing';
import { ScLanguageSwitch } from './sc-language-switch';

const control = (root: Element) => root.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
/** The light-DOM <span lang> the component writes and shows through its slot. */
const name = (root: Element) => Array.from(root.children).find((c) => c.hasAttribute('data-sc-language-name'))!;

describe('sc-language-switch (spec)', () => {
  it('on an English page, links to Arabic named in Arabic', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<div lang="en"><sc-language-switch href="/ar/renew"></sc-language-switch></div>` });
    const host = page.body.querySelector('sc-language-switch')!;
    const el = control(host);
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/ar/renew');
    expect(el.getAttribute('hreflang')).toBe('ar');
    expect(el.getAttribute('lang')).toBe('ar');
    expect(el.querySelector('[part="label"] slot')).not.toBeNull();
    expect(name(host).textContent).toBe('العربية');
    expect(name(host).getAttribute('lang')).toBe('ar');
    expect(name(host).getAttribute('dir')).toBe('rtl');
  });

  it('on an Arabic page, links to English named in English', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<div lang="ar" dir="rtl"><sc-language-switch href="/en/renew"></sc-language-switch></div>` });
    const host = page.body.querySelector('sc-language-switch')!;
    expect(control(host).getAttribute('hreflang')).toBe('en');
    expect(name(host).textContent).toBe('English');
    expect(name(host).getAttribute('lang')).toBe('en');
    expect(name(host).getAttribute('dir')).toBe('ltr');
  });

  it('writes exactly one name child, however often it renders', async () => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<sc-language-switch href="/ar"></sc-language-switch>` });
    page.root!.setAttribute('href', '/ar/x');
    await page.waitForChanges();
    expect(page.root!.children.length).toBe(1);
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

  it.each([
    ['inline', false],
    ['glass', false],
    ['header', true],
    ['plain', true],
  ])('appearance %s renders the header style: %s', async (appearance, header) => {
    const page = await newSpecPage({ components: [ScLanguageSwitch], html: `<sc-language-switch href="/ar" appearance="${appearance}"></sc-language-switch>` });
    expect(control(page.root!).classList.contains('control--header')).toBe(header);
    expect(!!control(page.root!).querySelector('[part="icon"] svg')).toBe(header);
  });
});

describe('sc-language-switch name font', () => {
  // sc.css gives the name span only "Dubai W23 Name" (scripts/subset-fonts.mjs, NAMES), which
  // holds just the letters of the two endonyms. A letter outside it would render in the
  // fallback font, so the strings and the face must stay in step.
  it('has every letter of both language names in the "Dubai W23 Name" face', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const { default: strings } = await import('../../i18n/components/sc-language-switch');
    const css = readFileSync(join(__dirname, '../../global/fonts.css'), 'utf8');
    const ranges = [...css.matchAll(/font-family: 'Dubai W23 Name';[^}]*unicode-range: ([^;]+);/g)].flatMap((m) => m[1].split(','));
    const covered = new Set(ranges.map((r) => parseInt(r.trim().replace('U+', ''), 16)));
    for (const dict of [strings.en, strings.ar]) {
      for (const text of [dict.languageSwitchNameEn, dict.languageSwitchNameAr]) {
        expect([text, [...text].filter((c) => !covered.has(c.codePointAt(0)!))]).toEqual([text, []]);
      }
    }
  });
});
