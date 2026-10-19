import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

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

const fillEdges = `(() => {
  const seg = root.querySelector('.segment--current');
  const s = seg.getBoundingClientRect();
  const f = getComputedStyle(seg, '::before');
  return { segLeft: s.left, segWidth: s.width, fillLeft: parseFloat(f.left), fillWidth: parseFloat(f.width) };
})()`;

/** Emulates Windows High Contrast. Puppeteer's emulateMediaFeatures rejects forced-colors, so use CDP. */
async function forceColors(page: E2EPage) {
  const client = await (page as unknown as { createCDPSession(): Promise<{ send(m: string, p: object): Promise<unknown> }> }).createCDPSession();
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}

describe('sc-step-progress (e2e)', () => {
  it('draws an 8px segmented track: done and current in channel action, upcoming in control', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>`);
    expect(await sp(page, 'sc-step-progress', 'root.querySelector("[part=track]").getBoundingClientRect().height')).toBe(8);
    const done = await sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--done")).backgroundColor');
    const upcoming = await sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--upcoming")).backgroundColor');
    const fill = await sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--current"), "::before").backgroundColor');
    expect(done).not.toBe(upcoming);
    expect(fill).toBe(done);
  });

  it('hides the track from assistive tech and keeps the text', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>`);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
    const text = JSON.stringify(snapshot);
    expect(text).toContain('Step 2 of 4');
    expect(text).toContain('Plate number');
  });

  it('fills the current segment from the left in English and from the right in Arabic', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4"></sc-step-progress>`, { lang: 'en' });
    let e = await sp(page, 'sc-step-progress', fillEdges);
    expect(e.fillLeft).toBe(0);
    expect(e.fillWidth).toBeCloseTo(e.segWidth / 2, 0);
    const firstDoneLeftEn = await sp(page, 'sc-step-progress', 'root.querySelector(".segment--done").getBoundingClientRect().left < root.querySelector(".segment--current").getBoundingClientRect().left');
    expect(firstDoneLeftEn).toBe(true);

    await setPageContext(page, { lang: 'ar' });
    e = await sp(page, 'sc-step-progress', fillEdges);
    expect(e.fillLeft).toBeCloseTo(e.segWidth / 2, 0);
    const doneOnRight = await sp(page, 'sc-step-progress', 'root.querySelector(".segment--done").getBoundingClientRect().left > root.querySelector(".segment--current").getBoundingClientRect().left');
    expect(doneOnRight).toBe(true);
    expect(await sp(page, 'sc-step-progress', 'root.querySelector("[part=count]").textContent')).toBe('الخطوة 2 من 4');
  });

  it('takes the action colour from the channel', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4"></sc-step-progress>`, { channel: 'now' });
    const read = () => sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--done")).backgroundColor');
    const now = await read();
    await setPageContext(page, { channel: 'invest' });
    expect(await read()).not.toBe(now);
  });

  it('re-renders when current changes', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4"></sc-step-progress>`);
    await page.$eval('sc-step-progress', (el) => el.setAttribute('current', '3'));
    await page.waitForChanges();
    expect(await sp(page, 'sc-step-progress', 'root.querySelector("[part=count]").textContent')).toBe('Step 3 of 4');
    expect(await sp(page, 'sc-step-progress', 'root.querySelectorAll(".segment--done").length')).toBe(2);
  });

  it('keeps done and upcoming segments apart in forced colours', async () => {
    const page = await newScPage(`<sc-step-progress current="2" total="4"></sc-step-progress>`);
    await forceColors(page);
    const done = await sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--done")).backgroundColor');
    const upcoming = await sp(page, 'sc-step-progress', 'getComputedStyle(root.querySelector(".segment--upcoming")).backgroundColor');
    expect(done).not.toBe(upcoming);
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(
        `<main><h1>Plate number</h1><sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress><sc-step-progress current="4" total="4"></sc-step-progress></main>`,
        ctx,
      );
      await expectNoAxeViolations(page);
    });
  }
});
