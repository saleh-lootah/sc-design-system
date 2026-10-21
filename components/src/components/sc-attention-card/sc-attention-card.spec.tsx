import { newSpecPage } from '@stencil/core/testing';
import { ScAttentionCard } from './sc-attention-card';

describe('sc-attention-card (spec)', () => {
  it('renders the title as an h3, the slots in order, and the tint', async () => {
    const page = await newSpecPage({
      components: [ScAttentionCard],
      html: `<sc-attention-card tint="amber"><svg slot="icon"></svg><span slot="status">Not paid</span>Electricity and water bill<span slot="fact">Due tomorrow</span><span slot="meta">AED 412.60</span><button slot="action">Pay AED 412.60</button></sc-attention-card>`,
    });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('h3.title slot:not([name])')).not.toBeNull();
    expect(root.querySelector('.card')).toHaveClass('card--amber');
    expect(root.querySelector('[part="icon"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(Array.from(root.querySelectorAll('slot')).map((s) => s.getAttribute('name') ?? '')).toEqual(['icon', 'status', '', 'fact', 'meta', 'action']);
    expect(root.querySelectorAll('.is-empty').length).toBe(0);
    expect(root.querySelector('a, button')).toBeNull();
  });

  it('hides empty parts and has no tint without one', async () => {
    const page = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card heading-level="2">Upload your residence document</sc-attention-card>` });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('h2')).not.toBeNull();
    expect(root.querySelector('.card')!.className).not.toContain('card--');
    for (const s of ['.top', '.fact', '.meta', '.action']) expect(root.querySelector(s)).toHaveClass('is-empty');
  });

  it('falls back to h3 and ignores an unknown tint', async () => {
    const page = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card heading-level="9" tint="red">x</sc-attention-card>` });
    expect(page.root!.shadowRoot!.querySelector('h3')).not.toBeNull();
    expect(page.root!.shadowRoot!.querySelector('.card')!.className).not.toContain('card--');
  });

  it('takes the status tag tone for the icon tile unless a tint is set', async () => {
    const tag = (tone: string) => `<sc-status-tag slot="status" tone="${tone}">Overdue</sc-status-tag>`;
    const toned = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card>${tag('error')}Traffic fine</sc-attention-card>` });
    expect(toned.root!.shadowRoot!.querySelector('.card')).toHaveClass('card--tone-error');
    const tinted = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card tint="blue">${tag('error')}Traffic fine</sc-attention-card>` });
    expect(tinted.root!.shadowRoot!.querySelector('.card')!.className).not.toContain('card--tone-');
    const neutral = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card><span slot="status"><sc-status-tag tone="neutral">Draft</sc-status-tag></span>x</sc-attention-card>` });
    expect(neutral.root!.shadowRoot!.querySelector('.card')!.className).not.toContain('card--tone-');
    const nested = await newSpecPage({ components: [ScAttentionCard], html: `<sc-attention-card><span slot="status"><sc-status-tag tone="info">New</sc-status-tag></span>x</sc-attention-card>` });
    expect(nested.root!.shadowRoot!.querySelector('.card')).toHaveClass('card--tone-info');
  });
});
