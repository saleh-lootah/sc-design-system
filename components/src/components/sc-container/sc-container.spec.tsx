import { newSpecPage } from '@stencil/core/testing';
import { ScContainer } from './sc-container';

describe('sc-container (spec)', () => {
  it('renders an inner wrapper with a slot and reflects width', async () => {
    const page = await newSpecPage({ components: [ScContainer], html: `<sc-container>Content</sc-container>` });
    expect(page.root!.getAttribute('width')).toBe('page');
    expect(page.root!.shadowRoot!.querySelector('[part="inner"] slot')).not.toBeNull();
    const reading = await newSpecPage({ components: [ScContainer], html: `<sc-container width="reading"></sc-container>` });
    expect(reading.root!.getAttribute('width')).toBe('reading');
  });
});
