import { newSpecPage } from '@stencil/core/testing';
import { ScModal } from './sc-modal';

const r = (el: Element) => el.shadowRoot!;

describe('sc-modal (spec)', () => {
  it('renders a dialog labelled by its heading, with a named close button', async () => {
    const page = await newSpecPage({ components: [ScModal], html: `<sc-modal heading="Remove this vehicle?"><p>Body</p><button slot="actions">Remove</button></sc-modal>` });
    const dialog = r(page.root!).querySelector('dialog')!;
    const heading = r(page.root!).querySelector('[part="heading"]')!;
    expect(heading.tagName).toBe('H2');
    expect(heading.getAttribute('tabindex')).toBe('-1');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(dialog.hasAttribute('role')).toBe(false);
    expect(r(page.root!).querySelector('[part="close"]')!.getAttribute('aria-label')).toBe('Close');
    expect(r(page.root!).querySelector('[part="actions"]')).not.toHaveClass('actions--empty');
  });

  it('as an alert it is an alertdialog with no close button', async () => {
    const page = await newSpecPage({ components: [ScModal], html: `<sc-modal alert heading="You will be signed out soon"></sc-modal>` });
    expect(r(page.root!).querySelector('dialog')!.getAttribute('role')).toBe('alertdialog');
    expect(r(page.root!).querySelector('[part="close"]')).toBeNull();
    expect(r(page.root!).querySelector('[part="actions"]')).toHaveClass('actions--empty');
  });

  it('as an alert it is described by its body and countdown, and has no grabber (R7)', async () => {
    const page = await newSpecPage({ components: [ScModal], html: `<sc-modal alert heading="You will be signed out soon"><p>Body</p></sc-modal><sc-modal heading="x"></sc-modal>` });
    const [alert, plain] = Array.from(page.body.querySelectorAll('sc-modal'));
    const body = r(alert).querySelector('.body')!;
    expect(body.id).toMatch(/^sc-modal-\d+-body$/);
    expect(r(alert).querySelector('dialog')!.getAttribute('aria-describedby')).toBe(body.id);
    expect(r(alert).querySelector('.grabber')).toBeNull();
    expect(r(plain).querySelector('dialog')!.hasAttribute('aria-describedby')).toBe(false);
    expect(r(plain).querySelector('.grabber')).not.toBeNull();
  });

  it('names the close button in Arabic, and takes close-label', async () => {
    const page = await newSpecPage({ components: [ScModal], html: `<div lang="ar"><sc-modal heading="x"></sc-modal></div><sc-modal heading="y" close-label="Close the map"></sc-modal>` });
    const [ar, custom] = Array.from(page.body.querySelectorAll('sc-modal'));
    expect(r(ar).querySelector('[part="close"]')!.getAttribute('aria-label')).toBe('إغلاق');
    expect(r(custom).querySelector('[part="close"]')!.getAttribute('aria-label')).toBe('Close the map');
  });
});
