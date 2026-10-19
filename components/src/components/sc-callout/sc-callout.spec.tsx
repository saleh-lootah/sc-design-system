import { newSpecPage } from '@stencil/core/testing';
import { ScCallout } from './sc-callout';

const box = (el: HTMLElement) => el.shadowRoot!.querySelector('[part="container"]')!;

describe('sc-callout (spec)', () => {
  it.each([
    ['info', 'Information:'],
    ['success', 'Success:'],
    ['warning', 'Warning:'],
    ['error', 'Error:'],
  ])('renders the %s tone with an icon and a hidden tone word', async (tone, word) => {
    const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout tone="${tone}">If your payment is interrupted, don't pay again.</sc-callout>` });
    expect(box(page.root!)).toHaveClass(`callout--${tone}`);
    expect(page.root!.shadowRoot!.querySelector('[part="icon"] svg[aria-hidden="true"]')).not.toBeNull();
    expect(page.root!.shadowRoot!.querySelector('[part="content"] .visually-hidden')!.textContent!.trim()).toBe(word);
  });

  it('uses a different icon per tone', async () => {
    const paths = new Set<string>();
    for (const tone of ['info', 'success', 'warning', 'error']) {
      const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout tone="${tone}">Text</sc-callout>` });
      paths.add(page.root!.shadowRoot!.querySelector('[part="icon"] svg')!.innerHTML);
    }
    expect(paths.size).toBe(4);
  });

  it('falls back to info for an unknown tone', async () => {
    const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout tone="loud">Text</sc-callout>` });
    expect(box(page.root!)).toHaveClass('callout--info');
  });

  it('hides the heading when there is none', async () => {
    const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout>Text</sc-callout>` });
    expect(page.root!.shadowRoot!.querySelector('[part="heading"]')).toHaveClass('heading--empty');
    expect(page.root!.shadowRoot!.querySelector('[part="heading"]')!.tagName).toBe('P');
  });

  it('puts the tone word in the heading when there is one, at the requested level', async () => {
    const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout tone="success" heading="Registration renewed" heading-level="2">Valid until 18 October 2027.</sc-callout>` });
    const heading = page.root!.shadowRoot!.querySelector('[part="heading"]')!;
    expect(heading.tagName).toBe('H2');
    expect(heading.textContent).toBe('Success: Registration renewed');
    expect(page.root!.shadowRoot!.querySelector('[part="content"] .visually-hidden')).toBeNull();
  });

  it('lets tone-label override the string, and speaks Arabic', async () => {
    const page = await newSpecPage({ components: [ScCallout], html: `<sc-callout tone="warning" tone-label="Important:">Text</sc-callout><div lang="ar"><sc-callout tone="warning">نص</sc-callout></div>` });
    const [en, ar] = Array.from(page.body.querySelectorAll('sc-callout'));
    expect(en.shadowRoot!.querySelector('.visually-hidden')!.textContent!.trim()).toBe('Important:');
    expect(ar.shadowRoot!.querySelector('.visually-hidden')!.textContent!.trim()).toBe('تنبيه:');
  });
});
