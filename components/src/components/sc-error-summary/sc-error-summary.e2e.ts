import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';


const FORM = `
  <main>
    <h1>What is your plate number?</h1>
    <sc-error-summary>
      <a href="#plate-code">Enter the plate code</a>
      <a href="#plate-number">Enter the plate number using numbers only, like 12345</a>
    </sc-error-summary>
    <form>
      <label for="plate-code">Plate code</label>
      <input id="plate-code" name="code" />
      <div style="block-size: 1500px"></div>
      <demo-field id="plate-number"></demo-field>
    </form>
  </main>`;

async function addDemoField(page: E2EPage) {
  await page.evaluate(() => {
    if (customElements.get('demo-field')) return;
    customElements.define(
      'demo-field',
      class extends HTMLElement {
        static formAssociated = true;
        constructor() {
          super();
          this.attachInternals();
          this.attachShadow({ mode: 'open', delegatesFocus: true }).innerHTML = '<label>Plate number <input id="inner"></label>';
        }
      },
    );
  });
}

/** Where focus is: the deepest active element, described as host>inner. */
function focusPath(page: E2EPage) {
  return page.evaluate(() => {
    const path: string[] = [];
    let el: Element | null = document.activeElement;
    while (el) {
      path.push(el.id ? `${el.localName}#${el.id}` : el.getAttribute('part') ? `${el.localName}[${el.getAttribute('part')}]` : el.localName);
      el = el.shadowRoot?.activeElement ?? null;
    }
    return path.join('>');
  });
}

function clickItem(page: E2EPage, index: number) {
  return page.evaluate((i: number) => {
    const a = document.querySelector('sc-error-summary')!.shadowRoot!.querySelectorAll('ul a')[i] as HTMLElement;
    a.click();
  }, index);
}

describe('sc-error-summary (e2e)', () => {
  it('moves focus to itself on load without also being an alert', async () => {
    const page = await newScPage(FORM);
    expect(await focusPath(page)).toBe('sc-error-summary>div[container]');
    const role = await page.evaluate(() => document.querySelector('sc-error-summary')!.shadowRoot!.querySelector('[part=container]')!.getAttribute('role'));
    expect(role).not.toBe('alert');
    expect(role).toBe('group');
  });

  it('does not move focus with no-autofocus, and setFocus() moves it', async () => {
    const page = await newScPage(`<sc-error-summary no-autofocus><a href="#x">Enter the plate number</a></sc-error-summary><input id="x">`);
    expect(await focusPath(page)).toBe('body');
    await page.$eval('sc-error-summary', (el: any) => el.setFocus());
    expect(await focusPath(page)).toBe('sc-error-summary>div[container]');
  });

  it('focuses a plain input when its item is clicked', async () => {
    const page = await newScPage(FORM);
    await addDemoField(page);
    await clickItem(page, 0);
    expect(await focusPath(page)).toBe('input#plate-code');
    expect(await page.evaluate(() => location.hash)).toBe('');
  });

  it('focuses the inner control of a host that delegates focus, and scrolls it into view', async () => {
    const page = await newScPage(FORM);
    await addDemoField(page);
    await clickItem(page, 1);
    expect(await focusPath(page)).toBe('demo-field#plate-number>input#inner');
    const visible = await page.evaluate(() => {
      const r = document.getElementById('plate-number')!.getBoundingClientRect();
      // The field ends the document, so it can only scroll to the bottom edge (allow sub-pixel rounding).
      return r.top >= 0 && r.bottom <= innerHeight + 1;
    });
    expect(visible).toBe(true);
  });

  it('works from the keyboard: Tab reaches each link, Enter moves focus to the field', async () => {
    const page = await newScPage(FORM);
    await addDemoField(page);
    await page.keyboard.press('Tab');
    expect(await focusPath(page)).toBe('sc-error-summary>a');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await focusPath(page)).toBe('demo-field#plate-number>input#inner');
  });

  it('finds targets inside the same shadow root as the summary', async () => {
    const page = await newScPage(`<div id="host"></div>`);
    await page.evaluate(() => {
      const root = document.getElementById('host')!.attachShadow({ mode: 'open' });
      root.innerHTML = `<sc-error-summary no-autofocus><a href="#code">Enter the plate code</a></sc-error-summary><input id="code">`;
    });
    await page.waitForChanges();
    await page.evaluate(() => {
      const summary = document.getElementById('host')!.shadowRoot!.querySelector('sc-error-summary')!;
      (summary.shadowRoot!.querySelector('ul a') as HTMLElement).click();
    });
    const active = await page.evaluate(() => document.getElementById('host')!.shadowRoot!.activeElement?.id);
    expect(active).toBe('code');
  });

  it('shows and focuses itself when the errors property is set after load', async () => {
    const page = await newScPage(`<sc-error-summary></sc-error-summary><input id="plate-code">`);
    expect(await page.$eval('sc-error-summary', (el) => getComputedStyle(el).display)).toBe('none');
    expect(await focusPath(page)).toBe('body');
    await page.$eval('sc-error-summary', (el: any) => (el.errors = [{ href: '#plate-code', text: 'Enter the plate code' }]));
    await page.waitForChanges();
    expect(await page.$eval('sc-error-summary', (el) => getComputedStyle(el).display)).toBe('block');
    expect(await focusPath(page)).toBe('sc-error-summary>div[container]');
  });

  it('updates the list when slotted links change', async () => {
    const page = await newScPage(`<sc-error-summary no-autofocus><a href="#a">First</a></sc-error-summary>`);
    await page.$eval('sc-error-summary', (el) => el.insertAdjacentHTML('beforeend', '<a href="#b">Second</a>'));
    await page.waitForChanges();
    const texts = await page.evaluate(() => [...document.querySelector('sc-error-summary')!.shadowRoot!.querySelectorAll('ul a')].map((a) => a.textContent));
    expect(texts).toEqual(['First', 'Second']);
  });

  it('re-renders its heading when lang changes ("توجد مشكلة", W1) and aligns to the right in Arabic', async () => {
    const page = await newScPage(`<sc-error-summary no-autofocus><a href="#x">Error</a></sc-error-summary>`, { lang: 'en' });
    const heading = () => page.evaluate(() => document.querySelector('sc-error-summary')!.shadowRoot!.querySelector('h2')!.textContent);
    expect(await heading()).toBe('There is a problem');
    await setPageContext(page, { lang: 'ar' });
    expect(await heading()).toBe('توجد مشكلة');
    const rightAligned = await page.evaluate(() => {
      const r = document.querySelector('sc-error-summary')!.shadowRoot!;
      const box = r.querySelector('[part=container]')!.getBoundingClientRect();
      return box.right - r.querySelector('h2')!.getBoundingClientRect().right < 24;
    });
    expect(rightAligned).toBe(true);
  });

  it('is an error-container box with a 2px error border and an 8px radius; links are error, Bold, at least 44px', async () => {
    const page = await newScPage(`<sc-error-summary no-autofocus><a href="#x">Enter the plate number</a></sc-error-summary>`);
    const token = (n: string) =>
      page.evaluate((name: string) => {
        const i = document.createElement('i');
        i.style.color = `var(${name})`;
        document.body.append(i);
        const c = getComputedStyle(i).color;
        i.remove();
        return c;
      }, n);
    const box = await page.evaluate(() => {
      const r = document.querySelector('sc-error-summary')!.shadowRoot!;
      const s = getComputedStyle(r.querySelector('[part=container]')!);
      const a = r.querySelector('ul a')!;
      const as = getComputedStyle(a);
      return { bg: s.backgroundColor, border: s.borderTopColor, width: s.borderTopWidth, radius: s.borderTopLeftRadius, pad: [s.paddingTop, s.paddingInlineStart], link: as.color, weight: as.fontWeight, size: as.fontSize, h: a.getBoundingClientRect().height, role: r.querySelector('[part=container]')!.getAttribute('role') };
    });
    expect(box.bg).toBe(await token('--sc-color-error-container'));
    expect(box.border).toBe(await token('--sc-color-error'));
    expect(box.width).toBe('2px');
    expect(box.radius).toBe('8px');
    expect(box.link).toBe(await token('--sc-color-error'));
    expect(box.weight).toBe('700');
    // body-medium Bold (A16 and the board), padding 18 block and 16 inline.
    expect(box.size).toBe('16px');
    expect(box.pad).toEqual(['18px', '16px']);
    expect(box.h).toBeGreaterThanOrEqual(44);
    expect(box.role).toBe('group');
  });

  it('shows the neutral U1 focus ring, the same on every channel', async () => {
    const page = await newScPage(`<sc-error-summary no-autofocus><a href="#x">Error</a></sc-error-summary>`, { channel: 'now' });
    await page.keyboard.press('Tab');
    const ring = () => page.evaluate(() => {
      const s = getComputedStyle(document.querySelector('sc-error-summary')!.shadowRoot!.querySelector('ul a')!);
      return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset];
    });
    const now = await ring();
    expect(now.slice(0, 2)).toEqual(['solid', '3px']);
    expect(now[3]).toBe('2px');
    await setPageContext(page, { channel: 'transport' });
    expect(await ring()).toEqual(now);
  });
});

describeAxe(
  'sc-error-summary',
  `<main><h1>Plate number</h1>
    <sc-error-summary><a href="#plate-code">Enter the plate code</a><a href="#plate-number">Enter the plate number</a></sc-error-summary>
    <sc-error-summary no-autofocus heading="Check your vehicle details"><p slot="description">We couldn't find a vehicle with these details.</p><a href="#plate-number">Check the plate number</a></sc-error-summary>
    <label for="plate-code">Plate code</label><input id="plate-code"><label for="plate-number">Plate number</label><input id="plate-number"></main>`,
);
