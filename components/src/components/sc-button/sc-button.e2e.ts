import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

type Win = Window & { submits: string[]; clicks: number };

/** Evaluates `expr` with `host` (the sc-button) and `control` (its native button or link). */
function read<T = unknown>(page: E2EPage, selector: string, expr: string): Promise<T> {
  return page.evaluate(
    (sel: string, e: string) => {
      const host = document.querySelector(sel)!;
      const control = host.querySelector('.sc-button') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', `return (${e});`)(host, control);
    },
    selector,
    expr,
  ) as Promise<T>;
}

const style = (page: E2EPage, sel: string, prop: string) => read<string>(page, sel, `getComputedStyle(control).${prop}`);
/** A token as the browser resolves it, through a probe element in the same context. */
const token = (page: E2EPage, sel: string, name: string, prop = 'backgroundColor') =>
  page.evaluate(
    (s: string, n: string, p: string) => {
      const probe = document.createElement('i');
      probe.style.setProperty('background-color', `var(${n})`);
      probe.style.setProperty('outline-color', `var(${n})`);
      document.querySelector(s)!.append(probe);
      const v = getComputedStyle(probe)[p as 'backgroundColor'];
      probe.remove();
      return v;
    },
    sel,
    name,
    prop,
  );

/**
 * WCAG 2.5.2 (MOT-09): press gives visual feedback only; activation is the native click on
 * release. Presses `control` (a page expression), drags off to the far corner of the viewport and releases
 * there, then clicks normally. Returns what was seen at each step; `look` reads the press visual.
 */
async function pressAndCancel(page: E2EPage, control: string, look: string) {
  const run = (expr: string) =>
    page.evaluate(
      (c: string, e: string) => {
        // eslint-disable-next-line no-new-func
        const el = new Function(`return (${c});`)() as HTMLElement;
        // eslint-disable-next-line no-new-func
        return new Function('el', 'w', `return (${e});`)(el, window);
      },
      control,
      expr,
    );
  await run(`(w.pressLog = { clicks: 0, submits: 0, hashes: 0 },
    el.addEventListener('click', () => w.pressLog.clicks++),
    w.pressHooked || ((w.pressHooked = true),
      w.addEventListener('hashchange', () => w.pressLog.hashes++),
      document.addEventListener('submit', (ev) => { ev.preventDefault(); w.pressLog.submits++; }, true)), 0)`);
  const at = (await run(`(({ x, y, width, height }) => [x + width / 2, y + height / 2])(el.getBoundingClientRect())`)) as number[];
  const off = (await run('[w.innerWidth - 2, w.innerHeight - 2]')) as number[];
  const settle = () => new Promise((r) => setTimeout(r, 400));
  const log = () => run('({ ...w.pressLog, hash: location.hash })');
  const rest = await run(look);
  await page.mouse.move(at[0], at[1]);
  await page.mouse.down();
  await settle();
  const pressed = await run(look);
  await page.mouse.move(off[0], off[1], { steps: 5 });
  await page.mouse.up();
  await settle();
  const cancelled = { log: await log(), look: await run(look) };
  await page.mouse.click(at[0], at[1]);
  await settle();
  return { rest, pressed, cancelled, clicked: await log() };
}

async function trackForm(page: E2EPage) {
  await page.evaluate(() => {
    const w = window as unknown as Win;
    w.submits = [];
    w.clicks = 0;
    document.querySelector('form')!.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const submitter = (ev as SubmitEvent).submitter as HTMLButtonElement | null;
      w.submits.push(`${submitter?.name ?? ''}=${submitter?.value ?? ''}`);
    });
    document.querySelector('sc-button')!.addEventListener('click', () => w.clicks++);
  });
  return {
    submits: () => page.evaluate(() => (window as unknown as Win).submits),
    clicks: () => page.evaluate(() => (window as unknown as Win).clicks),
  };
}

export const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <form>
      <sc-button variant="primary" icon="arrow-forward" type="submit">Continue</sc-button>
      <sc-button variant="secondary">Save and finish later</sc-button>
      <sc-button variant="tertiary">Cancel</sc-button>
      <sc-button variant="destructive">Delete draft</sc-button>
      <sc-button variant="handoff">Pay with Dubai Pay</sc-button>
      <sc-button size="m">Change</sc-button>
      <sc-button size="xl" icon="search" icon-position="start">Search services</sc-button>
      <sc-button loading>Pay with Dubai Pay</sc-button>
      <sc-button disabled>Continue</sc-button>
      <sc-button variant="secondary" disabled>Save and finish later</sc-button>
      <sc-button href="#start" icon="arrow-forward">Start now</sc-button>
      <sc-button href="#start" disabled>Start now</sc-button>
    </form>
  </main>`;

describe('sc-button (e2e)', () => {
  it('renders a native control in light DOM, with the variant heights and 4px corners', async () => {
    const page = await newScPage(`
      <sc-button id="p">Continue</sc-button>
      <sc-button id="s" variant="secondary">Save</sc-button>
      <sc-button id="t" variant="tertiary">Cancel</sc-button>
      <sc-button id="m" size="m">Change</sc-button>
      <sc-button id="xl" size="xl">Search</sc-button>
      <sc-button id="sl" variant="secondary" size="l">Save</sc-button>`);
    expect(await read(page, '#p', 'host.shadowRoot')).toBeNull();
    expect(await read(page, '#p', 'control.tagName')).toBe('BUTTON');
    const h = (id: string) => read<number>(page, id, 'Math.round(control.getBoundingClientRect().height)');
    expect(await h('#p')).toBe(56);
    expect(await h('#s')).toBe(48);
    expect(await h('#t')).toBe(48);
    expect(await h('#m')).toBe(48);
    expect(await h('#xl')).toBe(64);
    expect(await h('#sl')).toBe(56);
    expect(await style(page, '#p', 'borderTopLeftRadius')).toBe('4px');
    // The edge is the control border token (1.5px; Chromium snaps it to whole device pixels).
    const edge = await page.evaluate(() => {
      const probe = document.createElement('i');
      probe.style.cssText = 'display:block;border-top:var(--sc-size-border-control) solid';
      document.body.append(probe);
      return getComputedStyle(probe).borderTopWidth;
    });
    expect(await style(page, '#s', 'borderTopWidth')).toBe(edge);
    expect(await style(page, '#s', 'borderTopStyle')).toBe('solid');
  });

  it('uses the channel action colours, and city indigo for hand-offs on every channel', async () => {
    const page = await newScPage(`<sc-button id="p">Continue</sc-button><sc-button id="h" variant="handoff">Pay with Dubai Pay</sc-button><sc-button id="s" variant="secondary">Save</sc-button>`);
    expect(await style(page, '#p', 'backgroundColor')).toBe(await token(page, 'body', '--sc-color-channel-action'));
    expect(await style(page, '#p', 'color')).toBe(await token(page, 'body', '--sc-color-channel-on-action'));
    expect(await style(page, '#s', 'borderTopColor')).toBe(await token(page, 'body', '--sc-color-channel-action'));
    expect(await style(page, '#s', 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');
    const indigo = await token(page, 'body', '--sc-color-primary');
    expect(await style(page, '#h', 'backgroundColor')).toBe(indigo);

    const nowAction = await style(page, '#p', 'backgroundColor');
    await setPageContext(page, { channel: 'visit' });
    expect(await style(page, '#p', 'backgroundColor')).not.toBe(nowAction);
    expect(await style(page, '#h', 'backgroundColor')).toBe(indigo);
  });

  it('switches to the dark roles under data-theme="dark"', async () => {
    const page = await newScPage(`<sc-button id="p">Continue</sc-button>`);
    const light = await style(page, '#p', 'backgroundColor');
    await setPageContext(page, { theme: 'dark' });
    const dark = await style(page, '#p', 'backgroundColor');
    expect(dark).not.toBe(light);
    expect(dark).toBe(await token(page, 'body', '--sc-color-channel-action'));
  });

  it('sets the label in Dubai W23 with the label-large role in English and Arabic', async () => {
    const page = await newScPage(`<sc-button id="p">Continue</sc-button><sc-button id="m" variant="secondary">Save</sc-button>`);
    expect(await style(page, '#p', 'fontSize')).toBe('18px');
    expect(await style(page, '#p', 'lineHeight')).toBe('22px');
    expect(await style(page, '#p', 'fontWeight')).toBe('700');
    expect(await style(page, '#m', 'fontSize')).toBe('16px');
    expect(await style(page, '#m', 'fontWeight')).toBe('500');
    expect(await style(page, '#p', 'fontFamily')).toMatch(/^"Dubai W23"/);
    await setPageContext(page, { lang: 'ar' });
    expect(await style(page, '#p', 'fontSize')).toBe('20px');
    expect(await style(page, '#p', 'lineHeight')).toBe('28px');
    expect(await style(page, '#m', 'fontWeight')).toBe('700');
    expect(await style(page, '#p', 'letterSpacing')).toMatch(/^(normal|0px)$/);
    expect(await style(page, '#p', 'fontFamily')).toMatch(/^"Dubai W23 Arabic"/);
  });

  it('loads the Dubai W23 subsets it needs, and only those', async () => {
    const page = await newScPage(`<sc-button>Continue</sc-button>`);
    await page.evaluate(() => document.fonts.ready);
    const files = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((r) => r.name.split('/').pop()!)
        .filter((n) => n.endsWith('.woff2')),
    );
    expect(files).toContain('dubai-w23-700-latin.woff2');
    expect(files.filter((f) => f.includes('arabic'))).toEqual([]);
    // Only the downloaded Dubai W23 faces must load. The "Dubai W23 Fallback" faces are local()
    // Arial and Tahoma, which error where those are not installed (Linux CI); the stack then
    // moves on to system-ui, by design.
    expect(await page.evaluate(() => [...document.fonts].some((f) => f.status === 'error' && f.family !== 'Dubai W23 Fallback'))).toBe(false);
    expect(await page.evaluate(() => document.fonts.check('700 18px "Dubai W23"', 'Continue'))).toBe(true);
  });

  it('stretches to its container with full-width', async () => {
    const page = await newScPage(`<div style="inline-size: 400px"><sc-button full-width>Renew</sc-button><sc-button full-width href="#x">Renew</sc-button></div>`);
    expect(await read(page, 'sc-button', 'control.getBoundingClientRect().width')).toBe(400);
    expect(await read(page, 'sc-button[href]', 'control.getBoundingClientRect().width')).toBe(400);
  });

  it('renders a link when href is set, and Enter follows it', async () => {
    const page = await newScPage(`<sc-button href="#done">Start now</sc-button>`);
    expect(await read(page, 'sc-button', 'control.tagName')).toBe('A');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#done');
  });

  it('is the form default button: Enter in a field submits through it (A2)', async () => {
    const page = await newScPage(`
      <form>
        <label>Plate number <input id="plate" name="plate" /></label>
        <label>Plate code <input id="code" name="code" /></label>
        <sc-button variant="secondary" type="button">Check</sc-button>
        <sc-button type="submit" name="action" value="continue">Continue</sc-button>
      </form>`);
    const form = await trackForm(page);
    await page.focus('#code');
    await page.keyboard.type('A');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await form.submits()).toEqual(['action=continue']);
  });

  it('submits and resets a native form, and submits a form named by form=', async () => {
    const page = await newScPage(`
      <form id="renewal">
        <label>Plate number <input name="plate" value="A 12345" /></label>
        <sc-button type="submit">Continue</sc-button>
        <sc-button type="reset" variant="tertiary">Clear</sc-button>
        <sc-button variant="secondary">Do nothing</sc-button>
      </form>
      <sc-button id="outside" type="submit" form="renewal" name="action" value="later">Save and finish later</sc-button>`);
    const form = await trackForm(page);
    await page.click('sc-button[type="submit"]:not([form])');
    await page.click('sc-button:not([type])');
    await page.click('#outside');
    expect(await form.submits()).toEqual(['=', 'action=later']);

    await page.focus('input');
    await page.keyboard.press('End');
    await page.keyboard.type('6');
    await page.click('sc-button[type="reset"]');
    expect(await page.evaluate(() => document.querySelector('input')!.value)).toBe('A 12345');
  });

  it('follows a disabled fieldset natively', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-button type="submit">Continue</sc-button></fieldset></form>`);
    expect(await read(page, 'sc-button', 'control.matches(":disabled")')).toBe(true);
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = false));
    expect(await read(page, 'sc-button', 'control.matches(":disabled")')).toBe(false);
  });

  it('works from the keyboard: Tab focuses it with the U1 ring, Enter and Space activate it', async () => {
    const page = await newScPage(`<form><sc-button type="submit">Continue</sc-button></form>`);
    const form = await trackForm(page);
    await page.keyboard.press('Tab');
    expect(await read(page, 'sc-button', 'document.activeElement === control')).toBe(true);
    expect(await read(page, 'sc-button', 'control.matches(":focus-visible")')).toBe(true);
    expect(await style(page, 'sc-button', 'outlineWidth')).toBe('3px');
    expect(await style(page, 'sc-button', 'outlineOffset')).toBe('2px');
    expect(await style(page, 'sc-button', 'outlineColor')).toBe(await token(page, 'body', '--sc-color-focus-ring', 'outlineColor'));

    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await form.clicks()).toBe(2);
    expect((await form.submits()).length).toBe(2);
  });

  it('takes the "on" colour for its focus ring inside a filled area (U1)', async () => {
    const page = await newScPage(`<div id="strip" style="background: var(--sc-color-primary); --sc-color-focus-ring: var(--sc-color-on-primary); padding: 8px"><sc-button>Sign in</sc-button></div>`);
    await page.keyboard.press('Tab');
    expect(await style(page, 'sc-button', 'outlineColor')).toBe(await token(page, '#strip', '--sc-color-on-primary', 'outlineColor'));
  });

  it('scales on pointer press but not on a keyboard press (MOT-02, MOT-09)', async () => {
    const page = await newScPage(`<sc-button>Continue</sc-button>`);
    const box = await read<{ x: number; y: number }>(page, 'sc-button', '(({x, y, width, height}) => ({ x: x + width / 2, y: y + height / 2 }))(control.getBoundingClientRect())');
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise((r) => setTimeout(r, 400));
    expect(await style(page, 'sc-button', 'transform')).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
    await page.mouse.up();

    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    await page.keyboard.press('Tab');
    await page.keyboard.down('Space');
    await new Promise((r) => setTimeout(r, 400));
    expect(await style(page, 'sc-button', 'transform')).toBe('none');
    await page.keyboard.up('Space');
  });

  it('forwards focus() and click() on the host to the native control', async () => {
    const page = await newScPage(`<form><sc-button id="go" type="submit">Continue</sc-button></form>`);
    const form = await trackForm(page);
    await page.evaluate(() => (document.getElementById('go') as HTMLElement).focus());
    expect(await read(page, '#go', 'document.activeElement === control')).toBe(true);
    await page.evaluate(() => (document.getElementById('go') as HTMLElement).click());
    expect((await form.submits()).length).toBe(1);
  });

  it('ignores activation while loading, keeps its width and focus, and announces', async () => {
    const page = await newScPage(`<form><input name="plate" /><sc-button type="submit">Pay with Dubai Pay</sc-button></form>`);
    const form = await trackForm(page);
    const width = await read<number>(page, 'sc-button', 'control.getBoundingClientRect().width');
    await page.$eval('sc-button', (el) => ((el as HTMLElement & { loading: boolean }).loading = true));
    await page.waitForChanges();

    await page.click('sc-button');
    await page.focus('input');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await form.clicks()).toBe(0);
    expect(await form.submits()).toEqual([]);
    expect(await read(page, 'sc-button', 'control.getAttribute("aria-busy")')).toBe('true');
    expect(await read(page, 'sc-button', 'control.getBoundingClientRect().width')).toBe(width);
    expect(await read(page, 'sc-button', 'host.querySelector("[role=status]").textContent')).toBe('Pay with Dubai Pay, Loading');

    await page.$eval('sc-button', (el) => ((el as HTMLElement & { loading: boolean }).loading = false));
    await page.waitForChanges();
    await page.click('sc-button');
    expect((await form.submits()).length).toBe(1);
  });

  it('exposes its name and state to assistive technology', async () => {
    const page = await newScPage(`<sc-button id="b" loading>Pay with Dubai Pay</sc-button><sc-button id="d" disabled>Continue</sc-button><sc-button id="l" href="#x" disabled>Start now</sc-button>`);
    const b = await page.accessibility.snapshot({ root: (await page.$('#b .sc-button'))! });
    expect(b).toMatchObject({ role: 'button', name: 'Pay with Dubai Pay Loading' });
    const d = await page.accessibility.snapshot({ root: (await page.$('#d .sc-button'))! });
    expect(d).toMatchObject({ role: 'button', name: 'Continue', disabled: true });
    const l = await page.accessibility.snapshot({ root: (await page.$('#l .sc-button'))!, interestingOnly: false });
    expect(l).toMatchObject({ role: 'link', name: 'Start now', disabled: true });
  });

  it('mirrors a directional icon in Arabic and keeps it at the inline end', async () => {
    const page = await newScPage(`<sc-button icon="arrow-forward">متابعة</sc-button>`, { lang: 'ar' });
    expect(await read(page, 'sc-button', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    const order = await read<number[]>(page, 'sc-button', '[control.querySelector(".sc-button__icon").getBoundingClientRect().x, control.querySelector(".sc-button__label").getBoundingClientRect().x]');
    expect(order[0]).toBeLessThan(order[1]);
    await setPageContext(page, { lang: 'en' });
    expect(await read(page, 'sc-button', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
  });

  it('reserves its height before it upgrades and is never hidden for hydration (CLS 0)', async () => {
    const page = await newScPage(`<p>Text</p>`);
    const rules = await page.evaluate(() => {
      const text = [...document.styleSheets, ...document.adoptedStyleSheets]
        .map((s) => {
          try {
            return [...s.cssRules].map((r) => r.cssText).join('');
          } catch {
            return '';
          }
        })
        .join('');
      return { reserves: text.includes('sc-button:not(:defined)'), hides: /sc-button[^{]*\{\s*visibility:\s*hidden/.test(text) };
    });
    expect(rules).toEqual({ reserves: true, hides: false });
  });

  it('gives visual feedback on press and activates on release only: dragging off cancels (2.5.2)', async () => {
    const page = await newScPage(`<form><sc-button id="send" type="submit">Send</sc-button></form><sc-button id="next" href="#next">Next</sc-button>`);
    const look = 'getComputedStyle(el).transform';
    const send = await pressAndCancel(page, `document.querySelector('#send .sc-button')`, look);
    expect(send.pressed).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
    expect(send.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: send.rest });
    expect(send.clicked).toEqual({ clicks: 1, submits: 1, hashes: 0, hash: '' });

    const next = await pressAndCancel(page, `document.querySelector('#next .sc-button')`, look);
    expect(next.pressed).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
    expect(next.cancelled).toEqual({ log: { clicks: 0, submits: 0, hashes: 0, hash: '' }, look: 'none' });
    expect(next.clicked).toEqual({ clicks: 1, submits: 0, hashes: 1, hash: '#next' });
  });
});

describeAxe('sc-button', ALL_STATES);
