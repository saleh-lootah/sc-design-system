import { newSpecPage } from '@stencil/core/testing';
import { ScServiceCard } from './sc-service-card';

const shadow = (root: HTMLElement) => root.shadowRoot!;

describe('sc-service-card (spec)', () => {
  it('renders an h3 containing the link, the entity as its description and a directional chevron', async () => {
    const page = await newSpecPage({
      components: [ScServiceCard],
      html: `<sc-service-card href="/renew" entity="Roads and Transport Authority">Renew vehicle registration</sc-service-card>`,
    });
    const root = shadow(page.root!);
    const h3 = root.querySelector('h3')!;
    const link = h3.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/renew');
    expect(link.getAttribute('aria-describedby')).toBe('entity');
    expect(root.querySelector('#entity')!.textContent).toBe('Roads and Transport Authority');
    expect(root.querySelector('#entity')).not.toHaveClass('is-empty');
    expect(root.querySelector('.chevron svg')).toHaveClass('icon-directional');
    expect(root.querySelector('.chevron')!.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([2, 4, 6])('uses heading level %i', async (level) => {
    const page = await newSpecPage({ components: [ScServiceCard], html: `<sc-service-card href="#" heading-level="${level}">Pay fines</sc-service-card>` });
    expect(shadow(page.root!).querySelector(`h${level} a`)).not.toBeNull();
  });

  it('falls back to h3 for an invalid level', async () => {
    const page = await newSpecPage({ components: [ScServiceCard], html: `<sc-service-card href="#" heading-level="9">Pay fines</sc-service-card>` });
    expect(shadow(page.root!).querySelector('h3')).not.toBeNull();
  });

  it('hides the entity and chip rows when empty, and shows a slotted chip', async () => {
    const empty = await newSpecPage({ components: [ScServiceCard], html: `<sc-service-card href="#">Pay fines</sc-service-card>` });
    expect(shadow(empty.root!).querySelector('#entity')).toHaveClass('is-empty');
    expect(shadow(empty.root!).querySelector('a')!.hasAttribute('aria-describedby')).toBe(false);
    expect(shadow(empty.root!).querySelector('.chip')).toHaveClass('is-empty');

    const chip = await newSpecPage({ components: [ScServiceCard], html: `<sc-service-card href="#">Pay fines<span slot="chip">Also on Dubai Transport</span><span slot="entity">Dubai Police</span></sc-service-card>` });
    expect(shadow(chip.root!).querySelector('.chip')).not.toHaveClass('is-empty');
    expect(shadow(chip.root!).querySelector('#entity')).not.toHaveClass('is-empty');
  });
});
