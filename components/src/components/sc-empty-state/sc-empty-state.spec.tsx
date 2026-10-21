import { newSpecPage } from '@stencil/core/testing';
import { ScEmptyState } from './sc-empty-state';

const r = (el: Element) => el.shadowRoot!;

describe('sc-empty-state (spec)', () => {
  it('renders the heading as a paragraph by default, with no icon and no action', async () => {
    const page = await newSpecPage({ components: [ScEmptyState], html: `<sc-empty-state heading="You have no fines">Fines appear here.</sc-empty-state>` });
    const heading = r(page.root!).querySelector('[part="heading"]')!;
    expect(heading.tagName).toBe('P');
    expect(heading.textContent).toBe('You have no fines');
    expect(r(page.root!).querySelector('[part="icon"]')).toHaveClass('icon-box--empty');
    expect(r(page.root!).querySelector('[part="icon"] svg')).toBeNull();
    expect(r(page.root!).querySelector('[part="action"]')).toHaveClass('action--empty');
  });

  it('takes a heading level, an icon and an action', async () => {
    const page = await newSpecPage({
      components: [ScEmptyState],
      html: `<sc-empty-state heading="You have no notifications" heading-level="2" icon="inbox">Text<button slot="action">Refresh</button></sc-empty-state>`,
    });
    expect(r(page.root!).querySelector('[part="heading"]')!.tagName).toBe('H2');
    expect(r(page.root!).querySelector('[part="icon"] svg[aria-hidden="true"]')).not.toBeNull();
    expect(r(page.root!).querySelector('[part="action"]')).not.toHaveClass('action--empty');
  });

  it('takes its own icon in slot="icon" and heading levels up to 6 (board 07 Code)', async () => {
    const page = await newSpecPage({
      components: [ScEmptyState],
      html: `<sc-empty-state heading="You have no saved vehicles" heading-level="5" icon="inbox"><svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"></svg>Text</sc-empty-state>`,
    });
    expect(r(page.root!).querySelector('[part="heading"]')!.tagName).toBe('H5');
    expect(r(page.root!).querySelector('[part="icon"]')).not.toHaveClass('icon-box--empty');
    // The slotted icon replaces the library one.
    expect(r(page.root!).querySelector('[part="icon"] svg')).toBeNull();
  });

  it('the success variant shows a check by default', async () => {
    const page = await newSpecPage({ components: [ScEmptyState], html: `<sc-empty-state variant="success" heading="You have no fines to pay"></sc-empty-state>` });
    expect(r(page.root!).querySelector('[part="container"]')).toHaveClass('empty--success');
    expect(r(page.root!).querySelector('[part="icon"] svg')).not.toBeNull();
  });
});
