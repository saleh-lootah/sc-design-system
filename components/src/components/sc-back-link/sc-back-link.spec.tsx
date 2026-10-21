import { newSpecPage } from '@stencil/core/testing';
import { ScBackLink } from './sc-back-link';

const control = (root: HTMLElement) => root.shadowRoot!.querySelector('[part="control"]') as HTMLElement;

describe('sc-back-link (spec)', () => {
  it('renders a link with href', async () => {
    const page = await newSpecPage({ components: [ScBackLink], html: `<sc-back-link href="/renew/vehicle"></sc-back-link>` });
    const el = control(page.root!);
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/renew/vehicle');
    expect(el).toHaveClasses(['control', 'focus-ring']);
  });

  it('renders a button without href', async () => {
    const page = await newSpecPage({ components: [ScBackLink], html: `<sc-back-link></sc-back-link>` });
    const el = control(page.root!);
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('type')).toBe('button');
  });

  it('defaults its label to "Back", with a directional arrow before it', async () => {
    const page = await newSpecPage({ components: [ScBackLink], html: `<sc-back-link></sc-back-link>` });
    const el = control(page.root!);
    expect(el.querySelector('[part="label"] slot')!.textContent).toBe('Back');
    expect(Array.from(el.children).map((c) => c.getAttribute('part'))).toEqual(['icon', 'label']);
    expect(el.querySelector('svg.icon-directional')).not.toBeNull();
  });

  it('uses the Arabic label from the closest lang', async () => {
    const page = await newSpecPage({ components: [ScBackLink], html: `<div lang="ar" dir="rtl"><sc-back-link></sc-back-link></div>` });
    expect(control(page.body.querySelector('sc-back-link')!).querySelector('slot')!.textContent).toBe('رجوع');
  });

  it('still renders v1 markup with appearance, which v2 ignores', async () => {
    const page = await newSpecPage({ components: [ScBackLink], html: `<sc-back-link appearance="glass" href="/p"></sc-back-link>` });
    expect(control(page.root!).className).toBe('control focus-ring');
  });
});
