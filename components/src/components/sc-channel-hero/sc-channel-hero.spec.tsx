import { newSpecPage } from '@stencil/core/testing';
import { ScChannelHero } from './sc-channel-hero';

describe('sc-channel-hero (spec)', () => {
  it('renders the band, the content column and the slots, hiding empty ones', async () => {
    const page = await newSpecPage({
      components: [ScChannelHero],
      html: `<sc-channel-hero><p slot="eyebrow">Government services</p><h1 slot="heading">What do you need to do?</h1><div>search</div></sc-channel-hero>`,
    });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('[part="band"] [part="content"]')).not.toBeNull();
    expect(root.querySelector('sc-container')).toBeNull();
    expect(root.querySelector('slot[name="heading"]')!.parentElement).not.toHaveClass('is-empty');
    expect(root.querySelector('slot[name="lede"]')!.parentElement).toHaveClass('is-empty');
    expect(root.querySelector('slot[name="breadcrumbs"]')!.parentElement).toHaveClass('is-empty');
    expect(root.querySelector('slot[name="popular"]')!.parentElement).toHaveClass('is-empty');
    expect(root.querySelector('.search slot:not([name])')!.parentElement).not.toHaveClass('is-empty');
  });

  it('labels the popular row in the page language, or with popular-label', async () => {
    const en = await newSpecPage({ components: [ScChannelHero], html: `<sc-channel-hero><a slot="popular" href="#">Pay fines</a></sc-channel-hero>` });
    const row = en.root!.shadowRoot!.querySelector('[part="popular"]')!;
    expect(row).not.toHaveClass('is-empty');
    expect(row.getAttribute('role')).toBe('group');
    expect(row.getAttribute('aria-labelledby')).toBe('popular-label');
    expect(row.querySelector('#popular-label')!.textContent).toBe('Popular now');
    const ar = await newSpecPage({ components: [ScChannelHero], html: `<div lang="ar"><sc-channel-hero><a slot="popular" href="#">دفع المخالفات</a></sc-channel-hero></div>` });
    expect(ar.body.querySelector('sc-channel-hero')!.shadowRoot!.querySelector('#popular-label')!.textContent).toBe('الأكثر طلبًا الآن');
    const own = await newSpecPage({ components: [ScChannelHero], html: `<sc-channel-hero popular-label="Try"><a slot="popular" href="#">x</a></sc-channel-hero>` });
    expect(own.root!.shadowRoot!.querySelector('#popular-label')!.textContent).toBe('Try');
  });

  it('reflects the size', async () => {
    const page = await newSpecPage({ components: [ScChannelHero], html: `<sc-channel-hero size="medium"></sc-channel-hero>` });
    expect(page.root!.getAttribute('size')).toBe('medium');
  });
});
