/**
 * Press feedback (MOT-09) helpers: the transform a control has while it is held down.
 *
 *   expect(await pointerPress(page, 'sc-modal >>> .close')).toBe(PRESSED);
 *   expect(await keyboardPress(page, 'sc-modal >>> .close')).toBe('none');
 *
 * The pointer is released away from the control (on `releaseOn`, by default the top-left
 * corner of the page), so the press is cancelled (WCAG 2.5.2) and nothing fires. Transitions
 * are settled before the control is measured and before the read, so neither lands mid-motion.
 * An unscaled control reads 'none' (scale(1), as under reduced motion, is reported as 'none').
 */
import { E2EPage } from '@stencil/core/testing';
import { settleTransitions } from './page';

/** scale(0.97), as getComputedStyle reports it. */
export const PRESSED = 'matrix(0.97, 0, 0, 0.97, 0, 0)';

async function held(page: E2EPage, selector: string, press: () => Promise<void>, release: () => Promise<void>): Promise<string> {
  const el = (await page.$(selector))!;
  await press();
  await settleTransitions(page);
  const transform = await el.evaluate((e) => getComputedStyle(e).transform);
  await release();
  return transform === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : transform;
}

/** Holds the mouse down on the control and returns its transform. */
export async function pointerPress(page: E2EPage, selector: string, releaseOn?: string): Promise<string> {
  await settleTransitions(page);
  const box = (await (await page.$(selector))!.boundingBox())!;
  const off = releaseOn ? (await (await page.$(releaseOn))!.boundingBox())! : { x: 0, y: 0, width: 2, height: 2 };
  return held(
    page,
    selector,
    async () => {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
    },
    async () => {
      await page.mouse.move(off.x + off.width / 2, off.y + off.height / 2);
      await page.mouse.up();
    },
  );
}

/** Focuses the control, holds Space and returns its transform (the release activates it). */
export async function keyboardPress(page: E2EPage, selector: string): Promise<string> {
  await (await page.$(selector))!.evaluate((e) => (e as HTMLElement).focus());
  return held(
    page,
    selector,
    () => page.keyboard.down('Space'),
    () => page.keyboard.up('Space'),
  );
}

/** The control's transition list, as `property duration easing` per entry. */
export function transitions(page: E2EPage, selector: string): Promise<string[]> {
  return page.$eval(selector, (e) => {
    const s = getComputedStyle(e);
    const [p, d, t] = [s.transitionProperty, s.transitionDuration, s.transitionTimingFunction].map((v) => v.split(/,\s*(?![^()]*\))/));
    return p.map((name, i) => `${name} ${d[i % d.length]} ${t[i % t.length]}`);
  });
}
