import { newSpecPage } from '@stencil/core/testing';
import { ScStepProgress } from './sc-step-progress';

const states = (el: Element) => Array.from(el.shadowRoot!.querySelectorAll('.segment')).map((s) => s.className.replace('segment segment--', ''));

describe('sc-step-progress (spec)', () => {
  it('renders "Step 2 of 4", the label and a decorative segmented track', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>` });
    const r = page.root!.shadowRoot!;
    expect(r.querySelector('[part="count"]')!.textContent).toBe('Step 2 of 4');
    expect(r.querySelector('[part="label"]')!.textContent).toBe('Plate number');
    expect(r.querySelector('[part="track"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(states(page.root!)).toEqual(['done', 'current', 'upcoming', 'upcoming']);
  });

  it('omits the label when there is none', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="1" total="2"></sc-step-progress>` });
    expect(page.root!.shadowRoot!.querySelector('[part="label"]')).toBeNull();
  });

  it('clamps current to 1..total', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="9" total="3"></sc-step-progress><sc-step-progress current="0" total="3"></sc-step-progress>` });
    const [high, low] = Array.from(page.body.querySelectorAll('sc-step-progress'));
    expect(high.shadowRoot!.querySelector('[part="count"]')!.textContent).toBe('Step 3 of 3');
    expect(states(high)).toEqual(['done', 'done', 'current']);
    expect(low.shadowRoot!.querySelector('[part="count"]')!.textContent).toBe('Step 1 of 3');
  });

  it('writes Arabic with Latin digits, and takes count-text', async () => {
    const page = await newSpecPage({
      components: [ScStepProgress],
      html: `<div lang="ar"><sc-step-progress current="2" total="4"></sc-step-progress></div><sc-step-progress current="3" total="5" count-text="{current} / {total}"></sc-step-progress>`,
    });
    const [ar, custom] = Array.from(page.body.querySelectorAll('sc-step-progress'));
    expect(ar.shadowRoot!.querySelector('[part="count"]')!.textContent).toBe('الخطوة 2 من 4');
    expect(custom.shadowRoot!.querySelector('[part="count"]')!.textContent).toBe('3 / 5');
  });
});
