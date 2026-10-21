import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { CHANNEL_LINKS } from '../../test/chrome';
import { contexts, newScPage, setPageContext } from '../../test/page';

const SWITCHER = `<div style="display:flex;justify-content:flex-end;padding:16px"><sc-channel-switcher links='${CHANNEL_LINKS}'></sc-channel-switcher></div><p><a id="after" href="#after">After</a></p>`;

const expanded = (page: E2EPage) => page.evaluate(() => document.querySelector('.sc-channel-switcher__trigger')!.getAttribute('aria-expanded'));
const panelShown = (page: E2EPage) => page.evaluate(() => !document.querySelector('.sc-channel-switcher__panel')!.hasAttribute('hidden'));

describe('sc-channel-switcher (e2e)', () => {
  it('opens from the keyboard instantly, Tab moves through the links, Escape closes and returns focus (CHR-03)', async () => {
    const page = await newScPage(SWITCHER);
    await page.setViewport({ width: 1280, height: 800 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await expanded(page)).toBe('true');
    expect(await panelShown(page)).toBe(true);
    expect(await page.evaluate(() => document.querySelector('.sc-channel-switcher__panel')!.getAnimations().length)).toBe(0);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.closest('li')!.getAttribute('data-channel'))).toBe('now');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.closest('li')!.getAttribute('data-channel'))).toBe('transport');
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await expanded(page)).toBe('false');
    expect(await panelShown(page)).toBe(false);
    expect(await page.evaluate(() => document.activeElement!.classList.contains('sc-channel-switcher__trigger'))).toBe(true);
  });

  it('closes when focus leaves the panel', async () => {
    const page = await newScPage(SWITCHER);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('after');
    expect(await expanded(page)).toBe('false');
  });

  it('a pointer opens it with a grow from the corner, and a press outside closes it', async () => {
    const page = await newScPage(SWITCHER);
    await page.click('.sc-channel-switcher__trigger');
    await page.waitForChanges();
    expect(await expanded(page)).toBe('true');
    await page.waitForFunction(() => document.querySelector('.sc-channel-switcher__panel')!.getAnimations().length === 1);
    await page.mouse.click(5, 300);
    await page.waitForChanges();
    expect(await expanded(page)).toBe('false');
    await page.waitForFunction(() => document.querySelector('.sc-channel-switcher__panel')!.hasAttribute('hidden'));
  });

  it("paints each swatch in its own channel's action colour (FND-26)", async () => {
    const page = await newScPage(SWITCHER);
    await page.click('.sc-channel-switcher__trigger');
    await page.waitForChanges();
    const colours = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.sc-channel-switcher__swatch')).map((s) => getComputedStyle(s).backgroundColor),
    );
    expect(new Set(colours).size).toBe(7);
    const own = await page.evaluate(() => {
      const probe = document.createElement('i');
      probe.dataset.channel = 'visit';
      probe.style.color = 'var(--sc-color-channel-action)';
      document.body.append(probe);
      return getComputedStyle(probe).color;
    });
    expect(colours[2]).toBe(own);
  });

  it('is 48px tall with a 1.5px outline edge, aligns the panel to its inline-end edge, and mirrors', async () => {
    const page = await newScPage(SWITCHER);
    await page.setViewport({ width: 1280, height: 800 });
    expect(await page.evaluate(() => Math.round(document.querySelector('.sc-channel-switcher__trigger')!.getBoundingClientRect().height))).toBe(48);
    await page.click('.sc-channel-switcher__trigger');
    await page.waitForChanges();
    const edge = () =>
      page.evaluate(() => {
        const t = document.querySelector('.sc-channel-switcher__trigger')!.getBoundingClientRect();
        const p = document.querySelector('.sc-channel-switcher__panel')!.getBoundingClientRect();
        return [Math.round(t.right - p.right), Math.round(t.left - p.left)];
      });
    expect((await edge())[0]).toBe(0);
    await page.keyboard.press('Escape');
    await setPageContext(page, { lang: 'ar' });
    await page.evaluate(() => (document.querySelector('sc-channel-switcher') as HTMLElement & { open(): Promise<void> }).open());
    await page.waitForChanges();
    expect((await edge())[1]).toBe(0);
  });

  it('shrinks to the logo below 1024px and keeps its accessible name (CHR-04)', async () => {
    const page = await newScPage(SWITCHER);
    await page.setViewport({ width: 390, height: 800 });
    const box = await page.evaluate(() => {
      const r = document.querySelector('.sc-channel-switcher__trigger')!.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    });
    expect(box[0]).toBeLessThan(80);
    expect(box[1]).toBeGreaterThanOrEqual(44);
    const tree = JSON.stringify(await page.accessibility.snapshot());
    expect(tree).toContain('Choose a channel: Dubai Now');
  });

  it('has no axe violations with the panel open', async () => {
    for (const ctx of contexts) {
      const page = await newScPage(SWITCHER, ctx);
      await page.evaluate(() => (document.querySelector('sc-channel-switcher') as HTMLElement & { open(): Promise<void> }).open());
      await page.waitForChanges();
      await expectNoAxeViolations(page);
    }
  });

  it('without a logo shows the 10px swatch (radius 3), with padding 16 at the start and 12 at the end', async () => {
    const page = await newScPage(SWITCHER);
    await page.setViewport({ width: 1280, height: 800 });
    const look = await page.evaluate(() => {
      const mark = getComputedStyle(document.querySelector('.sc-channel-switcher__logo.is-mark')!);
      const t = getComputedStyle(document.querySelector('.sc-channel-switcher__trigger')!);
      return [mark.width, mark.height, mark.borderRadius, t.paddingInlineStart, t.paddingInlineEnd];
    });
    expect(look).toEqual(['10px', '10px', '3px', '16px', '12px']);
  });
});

describeAxe('sc-channel-switcher', SWITCHER);
