import { runAxe } from './axe';
import { newScPage } from './page';

describe('test helpers', () => {
  it('axe reports real violations, including text inside a component', async () => {
    const page = await newScPage(`<img src="plate.png"><sc-button><span style="color: var(--sc-color-channel-on-action); opacity: 0.4">Low contrast</span></sc-button>`);
    const ids = (await runAxe(page)).map((v) => v.id);
    expect(ids).toContain('image-alt');
    expect(ids).toContain('color-contrast');
  });

  it('applies lang, dir, theme and channel to <html>', async () => {
    const page = await newScPage('<p>Hello</p>', { lang: 'ar', theme: 'dark', channel: 'visit' });
    const attrs = await page.evaluate(() => {
      const h = document.documentElement;
      return [h.lang, h.dir, h.dataset.theme, h.dataset.channel, getComputedStyle(document.body).backgroundColor];
    });
    expect(attrs.slice(0, 4)).toEqual(['ar', 'rtl', 'dark', 'visit']);
    // sc.css is loaded: the dark surface token (neutral-10) is applied to <body>.
    expect(attrs[4]).toContain('oklab(0.2242');
  });
});
