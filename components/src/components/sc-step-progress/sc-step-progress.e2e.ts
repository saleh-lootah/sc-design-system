import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

function sp(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const root = document.querySelector(sel)!.shadowRoot!;
      // eslint-disable-next-line no-new-func
      return new Function('root', `return (${expr});`)(root);
    },
    selector,
    read,
  );
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.color = `var(${n})`;
    document.body.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, name);

const NAMES = '<span>Vehicle</span><span>Plate number</span><span>Check answers</span><span>Pay</span>';
const FULL = `<div style="inline-size: 900px"><sc-step-progress id="full" current="2">${NAMES}</sc-step-progress></div>`;
const NARROW = `<div style="inline-size: 360px"><sc-step-progress id="narrow" current="2">${NAMES}</sc-step-progress></div>`;

async function forceColors(page: E2EPage) {
  const client = await (page as unknown as { createCDPSession(): Promise<{ send(m: string, p: object): Promise<unknown> }> }).createCDPSession();
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}

describe('sc-step-progress (e2e)', () => {
  it('shows the full stepper from 600px and the compact one below (container query)', async () => {
    const page = await newScPage(FULL + NARROW);
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector("[part=list]")).display')).toBe('flex');
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".compact")).display')).toBe('none');
    expect(await sp(page, '#narrow', 'getComputedStyle(root.querySelector("[part=list]")).display')).toBe('none');
    expect(await sp(page, '#narrow', 'getComputedStyle(root.querySelector(".compact")).display')).toBe('flex');
  });

  it('draws 28px markers (24px compact); done and current in the channel action colour, never green (U2)', async () => {
    const page = await newScPage(FULL + NARROW);
    expect(await sp(page, '#full', 'root.querySelector(".full .marker").getBoundingClientRect().width')).toBe(28);
    expect(await sp(page, '#narrow', 'root.querySelector(".track .marker").getBoundingClientRect().width')).toBe(24);
    const action = await token(page, '--sc-color-channel-action');
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--done")).backgroundColor')).toBe(action);
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--current")).backgroundColor')).toBe(action);
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--done")).backgroundColor')).not.toBe(await token(page, '--sc-color-success'));
    expect(await sp(page, '#full', '!!root.querySelector(".full .marker--done svg")')).toBe(true);
    // The halo: 5px of channel-subtle on desktop.
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--current")).boxShadow')).toContain('5px');
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--upcoming")).borderTopColor')).toBe(await token(page, '--sc-color-outline'));
  });

  it('joins done steps with a solid connector and upcoming ones with a dashed connector', async () => {
    const page = await newScPage(FULL);
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .connector--done")).borderTopStyle')).toBe('solid');
    expect(await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .connector--current")).borderTopStyle')).toBe('dashed');
  });

  it('exposes a list with the current step and every state in words; the compact markers are hidden', async () => {
    const page = await newScPage(FULL + NARROW);
    const text = JSON.stringify(await page.accessibility.snapshot({ interestingOnly: false }));
    expect(text).toContain('Step 1 · Done');
    expect(text).toContain('Not started');
    expect(await sp(page, '#full', 'root.querySelector("[aria-current=step]").textContent')).toContain('Plate number');
    expect(await sp(page, '#narrow', 'root.querySelector("[part=track]").getAttribute("aria-hidden")')).toBe('true');
  });

  it('runs from the right in Arabic', async () => {
    const page = await newScPage(FULL, { lang: 'ar' });
    expect(await sp(page, '#full', 'root.querySelector(".full .marker--done").getBoundingClientRect().left > root.querySelector(".full .marker--current").getBoundingClientRect().left')).toBe(true);
    expect(await sp(page, '#full', 'root.querySelector("li .state").textContent')).toBe('الخطوة 1 · مكتملة');
  });

  it('takes the action colour from the channel', async () => {
    const page = await newScPage(FULL, { channel: 'now' });
    const read = () => sp(page, '#full', 'getComputedStyle(root.querySelector(".marker--done")).backgroundColor');
    const now = await read();
    await setPageContext(page, { channel: 'invest' });
    expect(await read()).not.toBe(now);
  });

  it('re-renders when current changes', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4"></sc-step-progress>`);
    await page.$eval('sc-step-progress', (el) => el.setAttribute('current', '3'));
    await page.waitForChanges();
    expect(await sp(page, 'sc-step-progress', 'root.querySelector("[part=count]").textContent')).toBe('Step 3 of 4');
    expect(await sp(page, 'sc-step-progress', 'root.querySelectorAll(".track .marker--done").length')).toBe(2);
  });

  it('keeps done, current and upcoming apart in forced colours', async () => {
    const page = await newScPage(FULL);
    await forceColors(page);
    const done = await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--done")).backgroundColor');
    const upcoming = await sp(page, '#full', 'getComputedStyle(root.querySelector(".full .marker--upcoming")).backgroundColor');
    expect(done).not.toBe(upcoming);
  });
});

describeAxe('sc-step-progress', `<main><h1>Plate number</h1>${FULL}${NARROW}<sc-step-progress current="4" total="4"></sc-step-progress></main>`);
