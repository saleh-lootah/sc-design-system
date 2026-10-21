import { newSpecPage } from '@stencil/core/testing';
import { ScEmptyState } from './sc-empty-state';

const r = (el: Element) => el.shadowRoot!;

describe('sc-empty-state (spec)', () => {
  it('renders the heading as a paragraph by default, with no icon and no action', async () => {
    const page = await newSpecPage({ components: [ScEmptyState], html: `<sc-empty-state heading="You have no fines">Fines appear here.</sc-empty-state>` });
    const heading = r(page.root!).querySelector('[part="heading"]')!;
    expect(heading.tagName).toBe('P');
    expect(heading.textContent).toBe('You have no fines');
    expect(r(page.root!).querySelector('[part="icon"]')).toBeNull();
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

  it('the success variant shows a check by default', async () => {
    const page = await newSpecPage({ components: [ScEmptyState], html: `<sc-empty-state variant="success" heading="You have no fines to pay"></sc-empty-state>` });
    expect(r(page.root!).querySelector('[part="container"]')).toHaveClass('empty--success');
    expect(r(page.root!).querySelector('[part="icon"] svg')).not.toBeNull();
  });
});
