import { newSpecPage } from '@stencil/core/testing';
import { ScGrid } from './sc-grid';

const spans = (el: HTMLElement) => ['compact', 'medium', 'expanded'].map((bp) => el.style.getPropertyValue(`--_span-${bp}`));

describe('sc-grid (spec)', () => {
  it('spans the full width by default', async () => {
    const page = await newSpecPage({ components: [ScGrid], html: `<sc-grid><div>1</div></sc-grid>` });
    expect(spans(page.root!)).toEqual(['12', '12', '12']);
    expect(page.root!.shadowRoot!.querySelector('[part="grid"] slot')).not.toBeNull();
  });

  it('falls back from expanded to medium to compact', async () => {
    const page = await newSpecPage({ components: [ScGrid], html: `<sc-grid span-medium="4"></sc-grid>` });
    expect(spans(page.root!)).toEqual(['12', '4', '4']);
    const all = await newSpecPage({ components: [ScGrid], html: `<sc-grid span="2" span-medium="4" span-expanded="3"></sc-grid>` });
    expect(spans(all.root!)).toEqual(['2', '4', '3']);
  });

  it('ignores invalid spans and caps at 12', async () => {
    const page = await newSpecPage({ components: [ScGrid], html: `<sc-grid span="zero" span-expanded="20"></sc-grid>` });
    expect(spans(page.root!)).toEqual(['12', '12', '12']);
  });
});
