import { newSpecPage } from '@stencil/core/testing';
import { ScStatusTag } from './sc-status-tag';

describe('sc-status-tag (spec)', () => {
  it.each(['neutral', 'success', 'warning', 'error', 'channel'])('renders the %s tone with a dot and the label-s role', async (tone) => {
    const page = await newSpecPage({ components: [ScStatusTag], html: `<sc-status-tag tone="${tone}">Paid</sc-status-tag>` });
    const tag = page.root!.shadowRoot!.querySelector('[part="tag"]')!;
    expect(tag).toHaveClasses(['tag', `tag--${tone}`, 'type-label-s']);
    expect(tag.querySelector('[part="dot"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(tag.querySelector('slot')).not.toBeNull();
  });

  it('defaults to neutral and falls back to it for an unknown tone', async () => {
    const page = await newSpecPage({ components: [ScStatusTag], html: `<sc-status-tag>In review</sc-status-tag><sc-status-tag tone="loud">In review</sc-status-tag>` });
    for (const el of Array.from(page.body.querySelectorAll('sc-status-tag'))) {
      expect(el.shadowRoot!.querySelector('[part="tag"]')).toHaveClass('tag--neutral');
    }
    expect(page.body.querySelector('sc-status-tag')!.getAttribute('tone')).toBe('neutral');
  });
});
