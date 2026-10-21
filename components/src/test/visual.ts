/**
 * Screenshot comparison for the EN/AR × light/dark matrix. No dependencies: the pixel diff
 * runs in the test browser on an OffscreenCanvas.
 *
 *   // src/components/<tag>/<tag>.visual.e2e.ts
 *   import { contexts, newScPage } from '../../test/page';
 *   import { describeVisual, expectScreenshot } from '../../test/visual';
 *
 *   describeVisual('sc-thing screenshots', () => {
 *     it.each(contexts)('$lang, $theme', async (ctx) => {
 *       const page = await newScPage(`<div class="shot">…</div>`, ctx);
 *       await expectScreenshot(page, 'sc-thing', `states--${ctx.lang}-${ctx.theme}`, '.shot');
 *     });
 *   });
 *
 * Run: `npm run test:visual` (compare) or `npm run test:visual:update` (rewrite baselines).
 * The suites are skipped in `npm run test:e2e` (describeVisual is describe.skip there).
 *
 * BASELINES are committed at test/visual/<platform>/<tag>/<name>.png, per platform, because
 * font rasterisation differs between macOS (Helium, the reference machine) and Linux
 * (Chromium on CI). A missing baseline is written and the test passes with a note, so the
 * first CI run on a new platform produces its baselines as an artefact (CI uploads
 * test/visual/), which a person reviews and commits. A mismatch writes
 * test/visual/__diff__/<platform>/<tag>/<name>.{actual,diff}.png (git-ignored) and fails.
 * Baselines change only through test:visual:update (SC_UPDATE_SCREENSHOTS=1), reviewed in
 * the PR like code.
 */
import type { E2EPage } from '@stencil/core/testing';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const describeVisual: jest.Describe = process.env.SC_VISUAL ? describe : describe.skip;

/** A pixel differs when any channel moves by more than this (0–255): absorbs antialiasing noise. */
const CHANNEL_TOLERANCE = 40;
/** The share of pixels allowed to differ before the test fails. */
const MAX_DIFF_RATIO = 0.002;

const platform = process.env.SC_VISUAL_PLATFORM || process.platform;
const root = join(process.cwd(), 'test', 'visual');

/** Freezes everything that moves or blinks, and waits for Dubai W23 to load. */
async function stabilise(page: E2EPage): Promise<void> {
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}',
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Fonts load lazily per character: wait for every face the page asked for.
    await Promise.all([...document.fonts].filter((f) => f.status === 'loading').map((f) => f.loaded));
  });
  await page.waitForChanges();
}

export async function expectScreenshot(page: E2EPage, tag: string, name: string, selector = 'body'): Promise<void> {
  await stabilise(page);
  const el = await page.$(selector);
  if (!el) throw new Error(`expectScreenshot: nothing matches ${selector}`);
  const actual = Buffer.from(await el.screenshot({ type: 'png' }));
  const file = join(root, platform, tag, `${name}.png`);

  if (process.env.SC_UPDATE_SCREENSHOTS || !existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, actual);
    if (!process.env.SC_UPDATE_SCREENSHOTS) console.warn(`expectScreenshot: wrote new baseline ${file}`);
    return;
  }

  const baseline = readFileSync(file);
  const result = await page.evaluate(
    async (a: string, b: string, tolerance: number) => {
      const bitmap = async (b64: string) => createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const [x, y] = await Promise.all([bitmap(a), bitmap(b)]);
      if (x.width !== y.width || x.height !== y.height) return { ratio: 1, size: `${x.width}x${x.height} vs ${y.width}x${y.height}`, diff: '' };
      const pixels = (img: ImageBitmap) => {
        const c = new OffscreenCanvas(img.width, img.height).getContext('2d')!;
        c.drawImage(img, 0, 0);
        return c.getImageData(0, 0, img.width, img.height);
      };
      const pa = pixels(x);
      const pb = pixels(y);
      const out = new ImageData(x.width, x.height);
      let differing = 0;
      for (let i = 0; i < pa.data.length; i += 4) {
        const d = Math.max(...[0, 1, 2, 3].map((k) => Math.abs(pa.data[i + k] - pb.data[i + k])));
        const hit = d > tolerance;
        if (hit) differing++;
        out.data.set(hit ? [255, 0, 255, 255] : [pa.data[i], pa.data[i + 1], pa.data[i + 2], 48], i);
      }
      const canvas = new OffscreenCanvas(x.width, x.height);
      canvas.getContext('2d')!.putImageData(out, 0, 0);
      const blob = await canvas.convertToBlob({ type: 'image/png' });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let bin = '';
      for (const byte of bytes) bin += String.fromCharCode(byte);
      return { ratio: differing / (pa.data.length / 4), size: '', diff: btoa(bin) };
    },
    actual.toString('base64'),
    baseline.toString('base64'),
    CHANNEL_TOLERANCE,
  );

  if (result.ratio > MAX_DIFF_RATIO) {
    const out = join(root, '__diff__', platform, tag);
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, `${name}.actual.png`), actual);
    if (result.diff) writeFileSync(join(out, `${name}.diff.png`), Buffer.from(result.diff, 'base64'));
    throw new Error(
      `Screenshot ${tag}/${name} differs from its baseline: ${result.size || `${(result.ratio * 100).toFixed(2)}% of pixels`}. ` +
        `See test/visual/__diff__/${platform}/${tag}/. If the change is intended, run npm run test:visual:update and review the new baseline.`,
    );
  }
}
