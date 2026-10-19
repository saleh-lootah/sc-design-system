import { newSpecPage } from '@stencil/core/testing';
import { ScChannelHero } from './sc-channel-hero';

describe('sc-channel-hero (spec)', () => {
  it('renders the wash, a container and the four slots, hiding empty ones', async () => {
    const page = await newSpecPage({
      components: [ScChannelHero],
      html: `<sc-channel-hero><p slot="eyebrow">Government services</p><h1 slot="heading">What do you need to do?</h1><div>search</div></sc-channel-hero>`,
    });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('[part="wash"] sc-container [part="content"]')).not.toBeNull();
    expect(root.querySelector('slot[name="eyebrow"]')).not.toBeNull();
    expect(root.querySelector('slot[name="heading"]')).not.toBeNull();
    expect(root.querySelector('slot[name="lede"]')!.parentElement).toHaveClass('is-empty');
    expect(root.querySelector('slot[name="heading"]')!.parentElement).not.toHaveClass('is-empty');
    expect(root.querySelector('.search slot:not([name])')!.parentElement).not.toHaveClass('is-empty');
  });
});
