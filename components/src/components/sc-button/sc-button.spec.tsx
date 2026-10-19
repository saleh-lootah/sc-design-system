import { newSpecPage } from '@stencil/core/testing';
import { ScButton } from './sc-button';

const control = (root: HTMLElement) => root.shadowRoot!.querySelector('[part="control"]') as HTMLElement;

describe('sc-button (spec)', () => {
  it.each(['primary', 'secondary', 'tertiary', 'destructive'])('renders the %s variant', async (variant) => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button variant="${variant}">Continue</sc-button>` });
    const el = control(page.root!);
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveClasses(['control', `control--${variant}`, 'control--l', 'type-title-s', 'focus-ring']);
    expect(el.getAttribute('type')).toBe('button');
    expect(page.root!.shadowRoot!.querySelector('[part="label"] slot')).not.toBeNull();
  });

  it('falls back to primary for an unknown variant', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button variant="loud">Continue</sc-button>` });
    expect(control(page.root!)).toHaveClass('control--primary');
  });

  it('renders size m with the label-m type role', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button size="m">Change</sc-button>` });
    expect(control(page.root!)).toHaveClasses(['control--m', 'type-label-m']);
  });

  it('renders a link when href is set', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button href="/renew">Start now</sc-button>` });
    const el = control(page.root!);
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/renew');
    expect(page.root!.shadowRoot!.querySelector('button')).toBeNull();
  });

  it('disables the inner button', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button disabled>Continue</sc-button>` });
    expect(control(page.root!).hasAttribute('disabled')).toBe(true);
  });

  it('removes href and sets aria-disabled on a disabled link', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button href="/renew" disabled>Start now</sc-button>` });
    const el = control(page.root!);
    expect(el.hasAttribute('href')).toBe(false);
    expect(el.getAttribute('role')).toBe('link');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('shows a spinner, sets aria-busy and announces while loading', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button loading>Pay with Dubai Pay</sc-button>` });
    const root = page.root!.shadowRoot!;
    expect(control(page.root!).getAttribute('aria-busy')).toBe('true');
    expect(control(page.root!)).toHaveClass('is-loading');
    expect(root.querySelector('.spinner svg')).not.toBeNull();
    expect(root.querySelector('[part="control"] .visually-hidden')!.textContent).toBe('Loading');
    expect(root.querySelector('[role="status"]')!.textContent).toBe('Pay with Dubai Pay, Loading');
  });

  it('lets loading-text override the string', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button loading loading-text="Starting payment">Pay</sc-button>` });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('[part="control"] .visually-hidden')!.textContent).toBe('Starting payment');
    expect(root.querySelector('[role="status"]')!.textContent).toBe('Pay, Starting payment');
  });

  it('keeps an empty live region when not loading', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button>Continue</sc-button>` });
    const root = page.root!.shadowRoot!;
    expect(control(page.root!).hasAttribute('aria-busy')).toBe(false);
    expect(root.querySelector('[role="status"]')!.textContent).toBe('');
    expect(root.querySelector('.spinner')).toBeNull();
  });

  it('uses Arabic strings from the closest lang', async () => {
    const page = await newSpecPage({
      components: [ScButton],
      html: `<div lang="ar" dir="rtl"><sc-button loading>متابعة</sc-button></div>`,
    });
    const root = page.body.querySelector('sc-button')!.shadowRoot!;
    expect(root.querySelector('[part="control"] .visually-hidden')!.textContent).toBe('جارٍ التحميل');
    expect(root.querySelector('[role="status"]')!.textContent).toBe('متابعة، جارٍ التحميل');
  });

  it('places the icon at the end by default and at the start on request', async () => {
    const end = await newSpecPage({ components: [ScButton], html: `<sc-button icon="arrow-forward">Continue</sc-button>` });
    const endParts = Array.from(control(end.root!).children).map((c) => c.getAttribute('part'));
    expect(endParts).toEqual(['label', 'icon']);
    expect(control(end.root!).querySelector('svg.icon-directional')).not.toBeNull();

    const start = await newSpecPage({ components: [ScButton], html: `<sc-button icon="search" icon-position="start">Search</sc-button>` });
    const startParts = Array.from(control(start.root!).children).map((c) => c.getAttribute('part'));
    expect(startParts).toEqual(['icon', 'label']);
    expect(control(start.root!).querySelector('svg.icon-directional')).toBeNull();
  });

  it('hides the icon box when there is no icon', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button>Continue</sc-button>` });
    expect(page.root!.shadowRoot!.querySelector('[part="icon"]')).toHaveClass('icon-box--empty');
  });

  it('reflects state attributes for styling', async () => {
    const page = await newSpecPage({ components: [ScButton], html: `<sc-button full-width loading variant="secondary">Save</sc-button>` });
    expect(page.root).toEqualAttributes({ 'full-width': '', 'loading': '', 'variant': 'secondary', 'size': 'l' });
  });
});
