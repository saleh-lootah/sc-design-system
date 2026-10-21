import { newSpecPage } from '@stencil/core/testing';
import { ScStatusTag } from './sc-status-tag';

const tagOf = (el: Element) => el.shadowRoot!.querySelector('[part="tag"]')!;

describe('sc-status-tag (spec)', () => {
  it.each(['neutral', 'info', 'success', 'warning', 'error'])('renders the %s tone with a decorative icon and the words', async (tone) => {
    const page = await newSpecPage({ components: [ScStatusTag], html: `<sc-status-tag tone="${tone}">Paid</sc-status-tag>` });
    const tag = tagOf(page.root!);
    expect(tag).toHaveClasses(['tag', `tag--${tone}`]);
    expect(tag.querySelector('[part="icon"] svg[aria-hidden="true"]')).not.toBeNull();
    expect(tag.querySelector('slot')).not.toBeNull();
  });

  it('gives each tone its own icon', async () => {
    const shapes = new Set<string>();
    for (const tone of ['neutral', 'info', 'success', 'warning', 'error']) {
      const page = await newSpecPage({ components: [ScStatusTag], html: `<sc-status-tag tone="${tone}">x</sc-status-tag>` });
      shapes.add(tagOf(page.root!).querySelector('svg')!.innerHTML);
    }
    expect(shapes.size).toBe(5);
  });

  it('defaults to neutral, and renders unknown tones (including v1 channel) as neutral', async () => {
    const page = await newSpecPage({
      components: [ScStatusTag],
      html: `<sc-status-tag>In review</sc-status-tag><sc-status-tag tone="channel">New</sc-status-tag><sc-status-tag tone="loud">x</sc-status-tag>`,
    });
    for (const el of Array.from(page.body.querySelectorAll('sc-status-tag'))) expect(tagOf(el)).toHaveClass('tag--neutral');
    expect(page.body.querySelector('sc-status-tag')!.getAttribute('tone')).toBe('neutral');
  });
});
