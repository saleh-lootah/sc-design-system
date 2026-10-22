import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const BAR = (attrs = 'dismissible') => `
  <sc-announcement-bar ${attrs} link-href="#status" link-text="See affected services">Planned maintenance on Saturday 25 October. Payment services will be unavailable from 2am to 6am (Dubai time).</sc-announcement-bar>
  <header><a id="next" href="#home">Home</a></header>`;

const style = (page: E2EPage, expr: string) =>
  page.evaluate((e: string) => {
    const root = document.querySelector('sc-announcement-bar')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr);

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.backgroundColor = `var(${n})`;
    document.body.append(i);
    return getComputedStyle(i).backgroundColor;
  }, name);

describe('sc-announcement-bar (e2e)', () => {
  it('uses the tone container, the tone icon colour and on-surface text, with a 44px dismiss button', async () => {
    const page = await newScPage(`${BAR()}<sc-announcement-bar id="info" tone="info">Info</sc-announcement-bar>`);
    expect(await style(page, 'getComputedStyle(root.querySelector("section")).backgroundColor')).toBe(await token(page, '--sc-color-warning-container'));
    expect(await style(page, 'getComputedStyle(root.querySelector(".tone-icon")).color')).toBe(await token(page, '--sc-color-warning'));
    expect(await style(page, 'getComputedStyle(root.querySelector(".message")).color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await style(page, 'Math.round(root.querySelector(".dismiss").getBoundingClientRect().height)')).toBe(44);
    const info = await page.evaluate(() => getComputedStyle(document.querySelector('#info')!.shadowRoot!.querySelector('section')!).backgroundColor);
    expect(info).toBe(await token(page, '--sc-color-info-container'));
  });

  it('dismissing from the keyboard hides it at once and moves focus to the next focusable element', async () => {
    const page = await newScPage(BAR());
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('sc-announcement-bar')!.hidden)).toBe(true);
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('next');
  });

  it('remembers a dismissal by announcement-id', async () => {
    const page = await newScPage(BAR('dismissible announcement-id="maintenance-25-oct"'));
    await page.evaluate(() => (document.querySelector('sc-announcement-bar') as HTMLElement & { dismiss(): Promise<void> }).dismiss());
    await page.waitForChanges();
    await page.evaluate((m: string) => {
      document.querySelector('sc-announcement-bar')!.remove();
      document.body.insertAdjacentHTML('afterbegin', m);
    }, BAR('dismissible announcement-id="maintenance-25-oct"'));
    await page.waitForChanges();
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-announcement-bar')!).display)).toBe('none');
    await page.evaluate(() => sessionStorage.clear());
  });

  it('remembers a dismissal in sessionStorage only, never localStorage (R8, PRV-12)', async () => {
    const page = await newScPage(BAR('dismissible announcement-id="outage-1"'));
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.evaluate(() => (document.querySelector('sc-announcement-bar') as HTMLElement & { dismiss(): Promise<void> }).dismiss());
    await page.waitForChanges();
    const stored = await page.evaluate(() => [sessionStorage.getItem('sc-announcement-dismissed:outage-1'), localStorage.length]);
    expect(stored).toEqual(['1', 0]);
    // A dismissal left in localStorage (by v2.0) is ignored: the bar shows.
    await page.evaluate((m: string) => {
      sessionStorage.clear();
      localStorage.setItem('sc-announcement-dismissed:outage-1', '1');
      document.querySelector('sc-announcement-bar')!.remove();
      document.body.insertAdjacentHTML('afterbegin', m);
    }, BAR('dismissible announcement-id="outage-1"'));
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('sc-announcement-bar')!.hidden)).toBe(false);
    await page.evaluate(() => localStorage.clear());
  });

  it('underlines a link written in the message (running text, R6)', async () => {
    const page = await newScPage(`<sc-announcement-bar>Planned maintenance. <a href="#s">See affected services</a>.</sc-announcement-bar>`);
    const look = await page.evaluate(() => {
      const s = getComputedStyle(document.querySelector('sc-announcement-bar a')!);
      return [s.textDecorationLine, s.textUnderlineOffset, s.color];
    });
    expect(look).toEqual(['underline', '4px', await token(page, '--sc-color-on-surface')]);
  });

  it('a pointer dismissal fades out without animating height', async () => {
    const page = await newScPage(BAR());
    await page.click('sc-announcement-bar >>> .dismiss');
    const anims = await style(page, 'root.querySelector("section").getAnimations().map((a) => Object.keys(a.effect.getKeyframes()[0]).filter((k) => !["offset","easing","composite","computedOffset"].includes(k)))');
    expect(anims).toEqual([['opacity']]);
    await page.waitForFunction(() => document.querySelector('sc-announcement-bar')!.hidden);
  });

  it('mirrors in Arabic: icon at the right, dismiss at the left', async () => {
    const page = await newScPage(BAR(), { lang: 'ar' });
    const [icon, dismiss] = (await style(page, '[".tone-icon", ".dismiss"].map((s) => root.querySelector(s).getBoundingClientRect().left)')) as number[];
    expect(icon).toBeGreaterThan(dismiss);
    await setPageContext(page, { lang: 'en' });
    const [i2, d2] = (await style(page, '[".tone-icon", ".dismiss"].map((s) => root.querySelector(s).getBoundingClientRect().left)')) as number[];
    expect(i2).toBeLessThan(d2);
  });

  it('is 48 tall on one line (plus its 1px rule), with the link in the message type, 12 after it', async () => {
    const page = await newScPage(`<sc-announcement-bar dismissible link-href="#s" link-text="Read more">Planned maintenance.</sc-announcement-bar>`);
    await page.setViewport({ width: 1280, height: 800 });
    const look = await style(page, '(() => { const m = root.querySelector(".message"); const l = root.querySelector(".link"); const ms = getComputedStyle(m); const ls = getComputedStyle(l); return [Math.round(root.querySelector("section").getBoundingClientRect().height), ls.fontWeight === ms.fontWeight, ls.fontSize === ms.fontSize, Math.round(l.getBoundingClientRect().left - m.getBoundingClientRect().right)]; })()');
    expect(look).toEqual([49, true, true, 12]);
  });
});

describeAxe('sc-announcement-bar', `${BAR()}<sc-announcement-bar tone="info">A new way to renew your licence is live.</sc-announcement-bar><sc-announcement-bar tone="error">Payments are not working at the moment.</sc-announcement-bar>`);
