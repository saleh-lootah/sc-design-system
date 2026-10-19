import { newSpecPage } from '@stencil/core/testing';
import { ScAppBar } from './sc-app-bar';

const bar = (root: Element) => root.shadowRoot!.querySelector('[part="bar"]') as HTMLElement;
const part = (root: Element, name: string) => root.shadowRoot!.querySelector(`[part="${name}"]`) as HTMLElement;

describe('sc-app-bar (spec)', () => {
  it('renders the mobile layout by default as a banner', async () => {
    const page = await newSpecPage({
      components: [ScAppBar],
      html: `<sc-app-bar><a slot="start" href="#">Back</a><span slot="title">Dubai Transport</span><a slot="end" href="#">العربية</a></sc-app-bar>`,
    });
    expect(page.root!.getAttribute('role')).toBe('banner');
    expect(bar(page.root!)).toHaveClasses(['bar', 'bar--center', 'bar--bar']);
    expect(part(page.root!, 'title')).toHaveClass('type-title-s');
    expect(part(page.root!, 'start')).not.toHaveClass('empty');
    expect(part(page.root!, 'end')).not.toHaveClass('empty');
    expect(part(page.root!, 'content')).toHaveClass('empty');
    expect(Array.from(bar(page.root!).children).map((c) => c.getAttribute('part'))).toEqual(['start', 'title', 'content', 'end']);
  });

  it('marks empty slots', async () => {
    const page = await newSpecPage({ components: [ScAppBar], html: `<sc-app-bar><span slot="title">Dubai Now</span></sc-app-bar>` });
    expect(part(page.root!, 'start')).toHaveClass('empty');
    expect(part(page.root!, 'end')).toHaveClass('empty');
  });

  it('renders the desktop floating layout with navigation content', async () => {
    const page = await newSpecPage({
      components: [ScAppBar],
      html: `<sc-app-bar align="start" shape="floating" sticky><span slot="title">Dubai Now</span><nav aria-label="Main">…</nav></sc-app-bar>`,
    });
    expect(bar(page.root!)).toHaveClasses(['bar--start', 'bar--floating']);
    expect(part(page.root!, 'content')).not.toHaveClass('empty');
    expect(page.root).toEqualAttributes({ align: 'start', shape: 'floating', sticky: '', role: 'banner' });
  });

  it('drops the landmark role when landmark is false', async () => {
    const page = await newSpecPage({ components: [ScAppBar], html: `<sc-app-bar landmark="false"><span slot="title">Dubai Now</span></sc-app-bar>` });
    expect(page.root!.hasAttribute('role')).toBe(false);
  });
});
