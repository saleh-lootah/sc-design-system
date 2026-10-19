import { newSpecPage } from '@stencil/core/testing';
import { ScSkipLink } from './sc-skip-link';

const control = (root: Element) => root.shadowRoot!.querySelector('[part="control"]') as HTMLAnchorElement;

describe('sc-skip-link (spec)', () => {
  it('links to #main-content by default with the English label', async () => {
    const page = await newSpecPage({ components: [ScSkipLink], html: `<sc-skip-link></sc-skip-link>` });
    const a = control(page.root!);
    expect(a.getAttribute('href')).toBe('#main-content');
    expect(a.querySelector('slot')!.textContent).toBe('Skip to main content');
    expect(a).toHaveClasses(['control', 'focus-ring', 'type-label-m']);
  });

  it('uses the Arabic label and a custom href', async () => {
    const page = await newSpecPage({ components: [ScSkipLink], html: `<div lang="ar" dir="rtl"><sc-skip-link href="#content"></sc-skip-link></div>` });
    const a = control(page.body.querySelector('sc-skip-link')!);
    expect(a.getAttribute('href')).toBe('#content');
    expect(a.querySelector('slot')!.textContent).toBe('الانتقال إلى المحتوى الرئيسي');
  });
});
