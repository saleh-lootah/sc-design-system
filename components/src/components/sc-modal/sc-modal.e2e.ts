import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage } from '../../test/page';
import { PRESSED, keyboardPress, pointerPress, transitions } from '../../test/press';

const HTML = `<main><h1>My vehicles</h1>
  <button id="open">Remove vehicle</button>
  <sc-modal id="m" heading="Remove this vehicle?">
    <p>You can add it again later.</p>
    <sc-button slot="actions" variant="destructive" id="confirm">Remove vehicle</sc-button>
    <sc-button slot="actions" variant="secondary">Keep it</sc-button>
  </sc-modal>
  <sc-modal id="t" alert heading="You will be signed out soon">
    <p>We'll keep your answers if you stay signed in.</p>
    <sc-button slot="actions" id="stay">Stay signed in</sc-button>
    <sc-button slot="actions" variant="secondary">Sign out</sc-button>
  </sc-modal>
</main>
<script>document.getElementById('open').addEventListener('click', () => document.getElementById('m').show());</script>`;

/** Where focus is: the deepest active element. */
const focused = (page: E2EPage) =>
  page.evaluate(() => {
    let el: Element | null = document.activeElement;
    const path: string[] = [];
    while (el) {
      path.push(el.id || el.getAttribute('part') || el.localName);
      el = el.shadowRoot?.activeElement ?? null;
    }
    return path.join('>');
  });

const isOpen = (page: E2EPage, id: string) => page.evaluate((i: string) => document.getElementById(i)!.shadowRoot!.querySelector('dialog')!.open, id);

async function openWithClick(page: E2EPage) {
  await page.evaluate(() => document.getElementById('open')!.addEventListener('click', () => (document.getElementById('m') as any).show()));
  await page.click('#open');
  await page.waitForChanges();
}

describe('sc-modal (e2e)', () => {
  it('opens as a modal dialog, focuses its heading and makes the page inert', async () => {
    const page = await newScPage(HTML);
    await openWithClick(page);
    expect(await isOpen(page, 'm')).toBe(true);
    expect(await focused(page)).toMatch(/^m>sc-modal-\d+-heading$/);
    expect(await page.evaluate(() => document.getElementById('m')!.shadowRoot!.querySelector('dialog')!.matches(':modal'))).toBe(true);
    // Tab stays inside: the close button and the actions, never the page behind.
    const visited = new Set<string>();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      visited.add(await focused(page));
    }
    expect([...visited].some((p) => p.startsWith('open'))).toBe(false);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const page = await newScPage(HTML);
    const reasons: string[] = [];
    await page.exposeFunction('onClose', (r: string) => reasons.push(r));
    await page.evaluate(() => document.addEventListener('scClose', (e: any) => (window as any).onClose(e.detail.reason)));
    await openWithClick(page);
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await isOpen(page, 'm')).toBe(false);
    expect(await focused(page)).toBe('open');
    expect(reasons).toEqual(['escape']);
  });

  it('in an alert dialog, Escape means "stay signed in": it closes with reason stay (R7)', async () => {
    const page = await newScPage(HTML);
    const reasons: string[] = [];
    await page.exposeFunction('onClose', (r: string) => reasons.push(r));
    await page.evaluate(() => document.addEventListener('scClose', (e: any) => (window as any).onClose(e.detail.reason)));
    await page.focus('#open');
    await page.$eval('#t', (el: any) => el.show());
    await page.waitForChanges();
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await isOpen(page, 't')).toBe(false);
    expect(await focused(page)).toBe('open');
    expect(reasons).toEqual(['stay']);
  });

  it('an alert dialog is described by its body and countdown (R7)', async () => {
    const page = await newScPage(HTML);
    await page.$eval('#t', (el: any) => {
      el.countdown = 125;
      el.show();
    });
    await page.waitForChanges();
    const handle = await page.evaluateHandle(() => document.getElementById('t')!.shadowRoot!.querySelector('dialog')!);
    const node = await page.accessibility.snapshot({ root: handle as never, interestingOnly: false });
    expect(node!.role).toBe('alertdialog');
    expect(node!.name).toBe('You will be signed out soon');
    expect(node!.description).toContain('Time left: 2:0');
    expect(node!.description).toContain("We'll keep your answers if you stay signed in.");
  });

  it('closes from the close button and from the scrim; an alert dialog ignores the scrim', async () => {
    const page = await newScPage(HTML);
    await openWithClick(page);
    await page.evaluate(() => (document.getElementById('m')!.shadowRoot!.querySelector('[part=close]') as HTMLElement).click());
    await page.waitForChanges();
    expect(await isOpen(page, 'm')).toBe(false);

    await openWithClick(page);
    await page.mouse.click(5, 5);
    await page.waitForChanges();
    expect(await isOpen(page, 'm')).toBe(false);

    await page.$eval('#t', (el: any) => el.show());
    await page.waitForChanges();
    await page.mouse.click(5, 5);
    await page.waitForChanges();
    expect(await isOpen(page, 't')).toBe(true);
    expect(await page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('dialog')!.getAttribute('role'))).toBe('alertdialog');
  });

  it('focuses the first control with initial-focus="first"', async () => {
    const page = await newScPage(HTML);
    await page.$eval('#t', (el: any) => {
      el.initialFocus = 'first';
      el.show();
    });
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.closest('sc-button')?.id)).toBe('stay');
  });

  it('enters over 200ms and exits over 160ms (W21); stays centred', async () => {
    const page = await newScPage(HTML);
    await page.setViewport({ width: 1200, height: 800 });
    await page.$eval('#m', (el: any) => el.show());
    await page.waitForChanges();
    const s = await page.evaluate(() => {
      const d = document.getElementById('m')!.shadowRoot!.querySelector('dialog')!;
      const cs = getComputedStyle(d);
      return { dur: cs.transitionDuration, origin: cs.transformOrigin, centre: Math.round(d.offsetLeft + d.offsetWidth / 2), w: d.offsetWidth, radius: cs.borderTopLeftRadius };
    });
    expect(s.dur.split(', ')[0]).toBe('0.2s');
    expect(s.centre).toBe(600);
    expect(s.w).toBe(560);
    expect(s.radius).toBe('12px');
    await page.$eval('#m', (el: any) => el.close());
    await page.waitForChanges();
    const exit = await page.evaluate(() => getComputedStyle(document.getElementById('m')!.shadowRoot!.querySelector('dialog')!).transitionDuration.split(', ')[0]);
    expect(exit).toBe('0.16s');
  });

  it('matches the board geometry: close in the padded corner, radius 4, actions 16 apart; dark panel surface-container-high (BX7-0)', async () => {
    const geometry = async (theme: 'light' | 'dark') => {
      const page = await newScPage(HTML, { theme });
      await page.setViewport({ width: 1200, height: 800 });
      await page.$eval('#m', (el: any) => el.show());
      await page.waitForChanges();
      return page.evaluate(() => {
        const root = document.getElementById('m')!.shadowRoot!;
        const d = root.querySelector('dialog')!.getBoundingClientRect();
        const close = root.querySelector('[part=close]')!;
        const c = close.getBoundingClientRect();
        const probe = document.createElement('i');
        probe.style.color = 'var(--sc-color-surface-container-high)';
        document.body.append(probe);
        const high = getComputedStyle(probe).color;
        probe.style.color = 'var(--sc-color-surface)';
        const surface = getComputedStyle(probe).color;
        probe.remove();
        const bg = getComputedStyle(root.querySelector('dialog')!).backgroundColor;
        return {
          top: Math.round(c.top - d.top),
          end: Math.round(d.right - c.right),
          size: [Math.round(c.width), Math.round(c.height)],
          radius: getComputedStyle(close).borderTopLeftRadius,
          gap: getComputedStyle(root.querySelector('[part=actions]')!).columnGap,
          bg: bg === high ? 'surface-container-high' : bg === surface ? 'surface' : bg,
        };
      });
    };
    // 1px edge + 32 padding.
    expect(await geometry('light')).toEqual({ top: 33, end: 33, size: [44, 44], radius: '4px', gap: '16px', bg: 'surface' });
    expect((await geometry('dark')).bg).toBe('surface-container-high');
  });

  it('presses the close button to 0.97 from a pointer, not from the keyboard or under reduced motion (MOT-09)', async () => {
    const SEL = '#m >>> .close';
    const page = await newScPage(HTML);
    await openWithClick(page);
    expect(await transitions(page, SEL)).toContain('transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)');
    // Released on the heading, inside the panel: nothing fires (a release on the scrim would close it).
    expect(await pointerPress(page, SEL, '#m >>> .heading')).toBe(PRESSED);
    expect(await isOpen(page, 'm')).toBe(true);
    expect(await keyboardPress(page, SEL)).toBe('none');
    await openWithClick(page);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    expect(await pointerPress(page, SEL, '#m >>> .heading')).toBe('none');
  });

  it('opens instantly from the keyboard (MOT-02)', async () => {
    const page = await newScPage(HTML);
    await page.evaluate(() => document.getElementById('open')!.addEventListener('click', () => (document.getElementById('m') as any).show()));
    await page.focus('#open');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    const dur = await page.evaluate(() => getComputedStyle(document.getElementById('m')!.shadowRoot!.querySelector('dialog')!).transitionDuration.split(', ')[0]);
    expect(dur).toBe('0s');
  });

  it('is a bottom sheet on phones, on the drawer curve, with stacked full-width actions', async () => {
    const page = await newScPage(HTML);
    await page.setViewport({ width: 390, height: 800 });
    await page.waitForChanges();
    await page.$eval('#m', (el: any) => el.show());
    await page.waitForChanges();
    const s = await page.evaluate(() => {
      const d = document.getElementById('m')!.shadowRoot!.querySelector('dialog')!;
      const cs = getComputedStyle(d);
      return { bottom: d.offsetTop + d.offsetHeight, w: d.offsetWidth, ease: cs.transitionTimingFunction.startsWith('cubic-bezier(0.32, 0.72, 0, 1)'), radius: cs.borderTopLeftRadius, bottomRadius: cs.borderBottomLeftRadius, full: document.getElementById('confirm')!.hasAttribute('full-width'), dur: cs.transitionDuration.split(', ')[0] };
    });
    // W21: the sheet keeps duration-slow (280ms) in and 20% faster (224ms) out.
    expect(s).toEqual({ bottom: 800, w: 390, ease: true, radius: '12px', bottomRadius: '0px', full: true, dur: '0.28s' });
    await page.$eval('#m', (el: any) => el.close());
    await page.waitForChanges();
    const exit = await page.evaluate(() => getComputedStyle(document.getElementById('m')!.shadowRoot!.querySelector('dialog')!).transitionDuration.split(', ')[0]);
    expect(exit).toBe('0.224s');
  });

  it('an alert sheet is not dragged or tapped closed; a plain sheet is (R7)', async () => {
    const page = await newScPage(HTML);
    await page.setViewport({ width: 390, height: 800 });
    await page.waitForChanges();
    /** Drags the sheet's top strip 300px down and releases. */
    const drag = async (id: string) => {
      const box = await page.evaluate((i: string) => {
        const r = document.getElementById(i)!.shadowRoot!.querySelector('.top')!.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + 8 };
      }, id);
      await page.mouse.move(box.x, box.y);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(box.x, box.y + i * 30);
      await page.mouse.up();
      await page.waitForChanges();
    };
    await page.$eval('#t', (el: any) => el.show());
    await page.waitForChanges();
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('t')!.shadowRoot!.querySelector('.top')!).touchAction)).toBe('auto');
    await drag('t');
    expect(await isOpen(page, 't')).toBe(true);
    expect(await page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('dialog')!.style.transform)).toBe('');
    await page.mouse.click(195, 5);
    await page.waitForChanges();
    expect(await isOpen(page, 't')).toBe(true);
    await page.$eval('#t', (el: any) => el.close());
    await page.waitForChanges();

    await page.$eval('#m', (el: any) => el.show());
    await page.waitForChanges();
    await drag('m');
    expect(await isOpen(page, 'm')).toBe(false);
  });

  it('opens a sheet instantly from the keyboard too (MOT-02)', async () => {
    const page = await newScPage(HTML);
    await page.setViewport({ width: 390, height: 800 });
    await page.evaluate(() => document.getElementById('open')!.addEventListener('click', () => (document.getElementById('m') as any).show()));
    await page.focus('#open');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    const dur = await page.evaluate(() => getComputedStyle(document.getElementById('m')!.shadowRoot!.querySelector('dialog')!).transitionDuration.split(', ')[0]);
    expect(dur).toBe('0s');
  });

  it('shows the time left and announces it only at checkpoints, never every second', async () => {
    const page = await newScPage(HTML);
    await page.$eval('#t', (el: any) => {
      el.countdown = 62;
      el.show();
    });
    const line = () => page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('[part=countdown]')!.textContent);
    const said = () => page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('[role=status]')!.textContent);
    expect(await line()).toBe('Time left: 1:02');
    await page.waitForFunction(() => document.getElementById('t')!.shadowRoot!.querySelector('[role=status]')!.textContent !== '');
    const first = await said();
    expect(first).toMatch(/^1 minute and 1 second left$|^1 minute left$|^1 minute and 0 seconds left$/);
    await page.waitForFunction(() => document.getElementById('t')!.shadowRoot!.querySelector('[part=countdown]')!.textContent === 'Time left: 0:59', { timeout: 6000 });
    // 61, 60 (whole minute) were checkpoints; 59 is not: the announcement stays put.
    expect(await said()).toBe('1 minute left');
  });

  it('counts down in Arabic with Latin digits and Arabic plurals', async () => {
    const page = await newScPage(HTML, { lang: 'ar' });
    await page.$eval('#t', (el: any) => {
      el.countdown = 121;
      el.show();
    });
    expect(await page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('[part=countdown]')!.textContent)).toBe('الوقت المتبقي: 2:01');
    await page.waitForFunction(() => document.getElementById('t')!.shadowRoot!.querySelector('[role=status]')!.textContent !== '');
    expect(await page.evaluate(() => document.getElementById('t')!.shadowRoot!.querySelector('[role=status]')!.textContent)).toBe('متبقٍ دقيقتان');
  });
});

describe('sc-modal: axe (WCAG 2.2 A and AA)', () => {
  it.each(contexts)('has no violations open, in $lang, $theme', async (ctx) => {
    const page = await newScPage(HTML, ctx);
    await page.$eval('#m', (el: any) => el.show());
    await page.waitForChanges();
    await expectNoAxeViolations(page);
  });
});
