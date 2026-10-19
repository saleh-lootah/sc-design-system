import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** Reads from the inner control of the nth sc-button on the page. */
function inner(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', `return (${expr});`)(host, control);
    },
    selector,
    read,
  );
}

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <sc-button variant="primary" icon="arrow-forward">Continue</sc-button>
    <sc-button variant="secondary">Save and finish later</sc-button>
    <sc-button variant="tertiary">Cancel</sc-button>
    <sc-button variant="destructive">Delete draft</sc-button>
    <sc-button size="m">Change</sc-button>
    <sc-button size="m" variant="secondary" icon="search" icon-position="start">Search services</sc-button>
    <sc-button loading>Pay with Dubai Pay</sc-button>
    <sc-button disabled>Continue</sc-button>
    <sc-button href="#start" icon="arrow-forward">Start now</sc-button>
    <sc-button href="#start" disabled>Start now</sc-button>
  </main>`;

describe('sc-button (e2e)', () => {
  it('renders each variant as a native button with its own fill', async () => {
    const page = await newScPage(`
      <sc-button id="p" variant="primary">Continue</sc-button>
      <sc-button id="s" variant="secondary">Continue</sc-button>
      <sc-button id="t" variant="tertiary">Continue</sc-button>
      <sc-button id="d" variant="destructive">Continue</sc-button>`);
    const fills = new Set<string>();
    for (const id of ['p', 's', 't', 'd']) {
      expect(await inner(page, `#${id}`, 'control.tagName')).toBe('BUTTON');
      fills.add(await inner(page, `#${id}`, 'getComputedStyle(control).backgroundColor'));
    }
    expect(fills.size).toBe(4);
    expect(await inner(page, '#p', 'control.getBoundingClientRect().height')).toBeGreaterThanOrEqual(54);
  });

  it('is 54px tall at size l and 44px at size m, and uses the pill radius', async () => {
    const page = await newScPage(`<sc-button id="l">Continue</sc-button><sc-button id="m" size="m">Continue</sc-button>`);
    expect(Math.round(await inner(page, '#l', 'control.getBoundingClientRect().height'))).toBe(54);
    expect(Math.round(await inner(page, '#m', 'control.getBoundingClientRect().height'))).toBe(44);
    expect(await inner(page, '#l', 'getComputedStyle(control).borderTopLeftRadius')).toBe('999px');
  });

  it('stretches to its container with full-width', async () => {
    const page = await newScPage(`<div style="inline-size: 400px"><sc-button full-width>Renew</sc-button><sc-button full-width href="#x">Renew</sc-button></div>`);
    expect(await inner(page, 'sc-button', 'control.getBoundingClientRect().width')).toBe(400);
    expect(await inner(page, 'sc-button[href]', 'control.getBoundingClientRect().width')).toBe(400);
  });

  it('renders a link when href is set, and Enter follows it', async () => {
    const page = await newScPage(`<sc-button href="#done">Start now</sc-button>`);
    expect(await inner(page, 'sc-button', 'control.tagName')).toBe('A');
    expect(await inner(page, 'sc-button', 'control.getAttribute("href")')).toBe('#done');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#done');
  });

  it('submits and resets a native form', async () => {
    const page = await newScPage(`
      <form>
        <label>Plate number <input name="plate" value="A 12345" /></label>
        <sc-button type="submit">Continue</sc-button>
        <sc-button type="reset" variant="tertiary">Clear</sc-button>
        <sc-button variant="secondary">Do nothing</sc-button>
      </form>`);
    await page.evaluate(() => {
      const w = window as unknown as { submits: string[] };
      w.submits = [];
      document.querySelector('form')!.addEventListener('submit', (ev) => {
        ev.preventDefault();
        w.submits.push(String(new FormData(ev.target as HTMLFormElement).get('plate')));
      });
    });
    const submits = () => page.evaluate(() => (window as unknown as { submits: string[] }).submits);

    await page.click('sc-button[type="submit"]');
    expect(await submits()).toEqual(['A 12345']);

    await page.click('sc-button:not([type])');
    expect(await submits()).toEqual(['A 12345']);

    const input = await page.find('input');
    await input.press('End');
    await input.type('6');
    expect(await page.evaluate(() => document.querySelector('input')!.value)).toBe('A 123456');
    await page.click('sc-button[type="reset"]');
    expect(await page.evaluate(() => document.querySelector('input')!.value)).toBe('A 12345');
  });

  it('follows a disabled fieldset', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-button type="submit">Continue</sc-button></fieldset></form>`);
    expect(await inner(page, 'sc-button', 'control.disabled')).toBe(true);
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = false));
    await page.waitForChanges();
    expect(await inner(page, 'sc-button', 'control.disabled')).toBe(false);
  });

  it('works from the keyboard: Tab focuses the inner button, Enter and Space activate it', async () => {
    const page = await newScPage(`<form><sc-button type="submit">Continue</sc-button></form>`);
    await page.evaluate(() => {
      const w = window as unknown as { clicks: number; submits: number };
      w.clicks = 0;
      w.submits = 0;
      document.querySelector('sc-button')!.addEventListener('click', () => w.clicks++);
      document.querySelector('form')!.addEventListener('submit', (ev) => {
        ev.preventDefault();
        w.submits++;
      });
    });
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-button');
    expect(await inner(page, 'sc-button', 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'sc-button', 'control.matches(":focus-visible")')).toBe(true);

    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { clicks: number; submits: number }).clicks)).toBe(2);
    expect(await page.evaluate(() => (window as unknown as { clicks: number; submits: number }).submits)).toBe(2);
  });

  it('focuses the inner control when the host is focused (delegatesFocus)', async () => {
    const page = await newScPage(`<sc-button id="go">Continue</sc-button>`);
    await page.evaluate(() => (document.getElementById('go') as HTMLElement).focus());
    expect(await inner(page, '#go', 'host.shadowRoot.activeElement === control')).toBe(true);
  });

  it('ignores clicks, sets aria-busy and announces while loading, and keeps its width', async () => {
    const page = await newScPage(`<form><sc-button type="submit">Pay with Dubai Pay</sc-button></form>`);
    await page.evaluate(() => {
      const w = window as unknown as { clicks: number; submits: number };
      w.clicks = 0;
      w.submits = 0;
      document.querySelector('sc-button')!.addEventListener('click', () => w.clicks++);
      document.querySelector('form')!.addEventListener('submit', (ev) => {
        ev.preventDefault();
        w.submits++;
      });
    });
    const width = await inner(page, 'sc-button', 'control.getBoundingClientRect().width');
    expect(await inner(page, 'sc-button', 'host.shadowRoot.querySelector("[role=status]").textContent')).toBe('');

    await page.$eval('sc-button', (el) => el.setAttribute('loading', ''));
    await page.waitForChanges();
    expect(await inner(page, 'sc-button', 'control.getAttribute("aria-busy")')).toBe('true');
    expect(await inner(page, 'sc-button', 'host.shadowRoot.querySelector("[role=status]").textContent')).toBe('Pay with Dubai Pay, Loading');
    expect(await inner(page, 'sc-button', 'control.querySelector(".visually-hidden").textContent')).toBe('Loading');
    expect(await inner(page, 'sc-button', 'control.getBoundingClientRect().width')).toBe(width);

    await page.click('sc-button');
    await page.keyboard.press('Enter');
    await page.evaluate(() => (document.querySelector('sc-button') as HTMLElement).click());
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { submits: number }).submits)).toBe(0);

    await page.$eval('sc-button', (el) => el.removeAttribute('loading'));
    await page.waitForChanges();
    await page.click('sc-button');
    expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(1);
  });

  it('re-renders its strings when lang changes on <html>', async () => {
    const page = await newScPage(`<sc-button loading>Continue</sc-button>`, { lang: 'en' });
    expect(await inner(page, 'sc-button', 'control.querySelector(".visually-hidden").textContent')).toBe('Loading');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-button', 'control.querySelector(".visually-hidden").textContent')).toBe('جارٍ التحميل');
  });

  it('mirrors the end arrow in RTL, but not the search icon', async () => {
    const html = `<sc-button id="a" icon="arrow-forward">Continue</sc-button><sc-button id="s" icon="search" icon-position="start">Search</sc-button>`;
    const transform = (id: string) => inner(page, `#${id}`, 'getComputedStyle(control.querySelector("svg")).transform');

    const page = await newScPage(html, { lang: 'en' });
    expect(await transform('a')).toBe('none');
    expect(await inner(page, '#a', '[...control.children].map((c) => c.getAttribute("part")).join()')).toBe('label,icon');

    await setPageContext(page, { lang: 'ar' });
    expect(await transform('a')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await transform('s')).toBe('none');
    // The arrow sits after the label in DOM order, so it is on the left in RTL.
    const arrowLeft = await inner(page, '#a', 'control.querySelector("svg").getBoundingClientRect().left < control.querySelector(".label").getBoundingClientRect().left');
    expect(arrowLeft).toBe(true);
  });

  it('switches to the Arabic type scale under lang="ar"', async () => {
    const page = await newScPage(`<sc-button id="en">Continue</sc-button><sc-button id="ar" lang="ar">متابعة</sc-button>`);
    expect(await inner(page, '#en', 'getComputedStyle(control).fontSize')).toBe('17px');
    expect(await inner(page, '#ar', 'getComputedStyle(control).fontSize')).toBe('19px');
    expect(await inner(page, '#ar', 'getComputedStyle(control).letterSpacing')).toBe('normal');
    expect(await inner(page, '#ar', 'getComputedStyle(control).fontFamily')).toContain('Dubai W23 Bold');
  });

  it('takes its colours from the channel', async () => {
    const page = await newScPage(`<sc-button>Continue</sc-button>`, { channel: 'now' });
    const now = await inner(page, 'sc-button', 'getComputedStyle(control).backgroundColor');
    await setPageContext(page, { channel: 'transport' });
    const transport = await inner(page, 'sc-button', 'getComputedStyle(control).backgroundColor');
    expect(transport).not.toBe(now);
  });

  it('transitions exact properties and scales to 0.97 on a pointer press, not a keyboard press', async () => {
    const page = await newScPage(`<sc-button>Continue</sc-button>`);
    expect(await inner(page, 'sc-button', 'getComputedStyle(control).transitionProperty')).toBe('background-color, color, transform');
    const box = (await (await page.$('sc-button'))!.boundingBox())!;
    const transformDuringPress = async () => {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await new Promise((r) => setTimeout(r, 300)); // longer than the 160ms press transition
      const t = await inner(page, 'sc-button', 'getComputedStyle(control).transform');
      await page.mouse.up();
      return t;
    };
    expect(await transformDuringPress()).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');

    // Space on a keyboard-focused button changes colour instantly and does not scale.
    const kb = await newScPage(`<sc-button>Continue</sc-button>`);
    await kb.keyboard.press('Tab');
    await kb.keyboard.down('Space');
    expect(await inner(kb, 'sc-button', 'getComputedStyle(control).transform')).toBe('none');
    expect(await inner(kb, 'sc-button', 'getComputedStyle(control).transitionDuration')).toBe('0s');
    await kb.keyboard.up('Space');
  });

  it('keeps colour feedback but drops the press scale under reduced motion', async () => {
    const page = await newScPage(`<sc-button>Continue</sc-button>`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    expect(await inner(page, 'sc-button', 'getComputedStyle(control).transitionDuration')).toBe('0.12s, 0.12s, 0.16s');
    const box = (await (await page.$('sc-button'))!.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await new Promise((r) => setTimeout(r, 300));
    expect(await inner(page, 'sc-button', 'getComputedStyle(control).transform')).toBe('matrix(1, 0, 0, 1, 0, 0)');
    await page.mouse.up();
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations with a focused button and on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
