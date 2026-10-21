import { newSpecPage } from '@stencil/core/testing';
import { ScStepProgress } from './sc-step-progress';

const r = (el: Element) => el.shadowRoot!;
const trackStates = (el: Element) => Array.from(r(el).querySelectorAll('.track .marker')).map((m) => m.className.replace('marker marker--', ''));

describe('sc-step-progress (spec)', () => {
  it('renders the compact stepper: "Step 2 of 4", the label and a decorative marker row', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>` });
    expect(r(page.root!).querySelector('[part="count"]')!.textContent).toBe('Step 2 of 4');
    expect(r(page.root!).querySelector('[part="label"]')!.textContent).toBe('Plate number');
    expect(r(page.root!).querySelector('[part="track"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(trackStates(page.root!)).toEqual(['done', 'current', 'upcoming', 'upcoming']);
    expect(r(page.root!).querySelectorAll('.track .connector').length).toBe(3);
    expect(r(page.root!).querySelector('.marker--done svg')).not.toBeNull();
    expect(r(page.root!).querySelector('[part="list"]')).toBeNull();
  });

  it('clamps current to 1..total', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="9" total="3"></sc-step-progress><sc-step-progress current="0" total="3"></sc-step-progress>` });
    const [high, low] = Array.from(page.body.querySelectorAll('sc-step-progress'));
    expect(r(high).querySelector('[part="count"]')!.textContent).toBe('Step 3 of 3');
    expect(trackStates(high)).toEqual(['done', 'done', 'current']);
    expect(r(low).querySelector('[part="count"]')!.textContent).toBe('Step 1 of 3');
  });

  it('reads step names from child elements and renders the full list with aria-current and states in words', async () => {
    const page = await newSpecPage({
      components: [ScStepProgress],
      html: `<sc-step-progress current="2"><span>Vehicle</span><span>Plate number</span><span>Check answers</span><span>Pay</span></sc-step-progress>`,
    });
    const list = r(page.root!).querySelector('[part="list"]')!;
    expect(list.tagName).toBe('OL');
    const items = Array.from(list.querySelectorAll('li'));
    expect(items.length).toBe(4);
    expect(items.map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null, null]);
    expect(items[0].textContent).toBe('Step 1 · DoneVehicle');
    expect(items[1].textContent).toBe('Step 2 · CurrentPlate number');
    expect(items[2].querySelector('.visually-hidden')!.textContent).toBe(' · Not started');
    expect(r(page.root!).querySelector('[part="count"]')!.textContent).toBe('Step 2 of 4');
    expect(r(page.root!).querySelector('[part="label"]')!.textContent).toBe('Plate number');
  });

  it('takes the steps property, and layout forces one form', async () => {
    const page = await newSpecPage({ components: [ScStepProgress], html: `<sc-step-progress current="1" layout="full"></sc-step-progress><sc-step-progress layout="compact"><span>A</span><span>B</span></sc-step-progress>` });
    const [full, compact] = Array.from(page.body.querySelectorAll('sc-step-progress')) as HTMLScStepProgressElement[];
    full.steps = ['Vehicle', 'Plate number'];
    await page.waitForChanges();
    expect(r(full).querySelectorAll('li').length).toBe(2);
    expect(r(full).querySelector('.compact')).toBeNull();
    expect(r(compact).querySelector('[part="list"]')).toBeNull();
  });

  it('writes Arabic with Latin digits, and takes count-text', async () => {
    const page = await newSpecPage({
      components: [ScStepProgress],
      html: `<div lang="ar"><sc-step-progress current="2" total="4"></sc-step-progress></div><sc-step-progress current="3" total="5" count-text="{current} / {total}"></sc-step-progress>`,
    });
    const [ar, custom] = Array.from(page.body.querySelectorAll('sc-step-progress'));
    expect(r(ar).querySelector('[part="count"]')!.textContent).toBe('الخطوة 2 من 4');
    expect(r(custom).querySelector('[part="count"]')!.textContent).toBe('3 / 5');
  });
});
