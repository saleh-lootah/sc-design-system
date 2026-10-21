import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const HTML = `<main><h1>Moving home</h1><h2>Steps</h2>
<sc-step-list><ol>
  <li><a href="#a">Register your tenancy contract</a><span>Dubai Land Department</span></li>
  <li><a href="#b">Connect water and electricity</a><span>DEWA</span></li>
  <li data-channel="transport"><a href="#c">Update the address on your vehicle</a><span>RTA</span></li>
  <li data-channel="transport"><a href="#d">Apply for a parking permit</a><span>RTA</span></li>
  <li><a href="#e">Find a school nearby</a><span>KHDA</span></li>
</ol></sc-step-list></main>`;

const item = (page: E2EPage, i: number, read: string) =>
  page.evaluate(
    (n: number, expr: string) => {
      const li = document.querySelectorAll('sc-step-list li')[n] as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('li', `return (${expr});`)(li);
    },
    i,
    read,
  );

/** A role colour as computed on an element (so a data-channel on the element applies). */
const tokenOn = (page: E2EPage, i: number, name: string) => item(page, i, `(() => { const p = document.createElement('i'); p.style.color = 'var(${name})'; li.append(p); const c = getComputedStyle(p).color; p.remove(); return c; })()`);

describe('sc-step-list (e2e)', () => {
  it('draws 32px markers: outlined in the page channel, filled in another channel', async () => {
    const page = await newScPage(HTML, { channel: 'now' });
    expect(await item(page, 0, 'li.querySelector(".sc-step-list__marker").getBoundingClientRect().width')).toBe(32);
    expect(await item(page, 0, 'getComputedStyle(li.querySelector(".sc-step-list__marker")).borderTopColor')).toBe(await tokenOn(page, 0, '--sc-color-channel-action'));
    const transportAction = await tokenOn(page, 2, '--sc-color-channel-action');
    expect(transportAction).not.toBe(await tokenOn(page, 0, '--sc-color-channel-action'));
    expect(await item(page, 2, 'getComputedStyle(li.querySelector(".sc-step-list__marker")).backgroundColor')).toBe(transportAction);
    expect(await item(page, 2, 'getComputedStyle(li).backgroundColor')).toBe(await tokenOn(page, 2, '--sc-color-channel-subtle'));
    expect(await item(page, 0, 'getComputedStyle(li).backgroundColor')).toBe('rgba(0, 0, 0, 0)');
  });

  it('sets the entity in body-medium on-surface-variant (board 7JB-0)', async () => {
    const page = await newScPage(HTML, { channel: 'now' });
    const span = 'getComputedStyle(li.querySelector("span:not([class])"))';
    expect(await item(page, 0, `${span}.color`)).toBe(await tokenOn(page, 0, '--sc-color-on-surface-variant'));
    expect(await item(page, 0, `${span}.fontSize`)).toBe('16px');
    expect(await item(page, 0, `${span}.lineHeight`)).toBe('24px');
    expect(await item(page, 0, 'li.getBoundingClientRect().height')).toBe(90);
  });

  it('joins rows of the same other channel in that channel colour', async () => {
    const page = await newScPage(HTML, { channel: 'now' });
    const transportAction = await tokenOn(page, 2, '--sc-color-channel-action');
    expect(await item(page, 2, 'getComputedStyle(li, "::after").backgroundColor')).toBe(transportAction);
    expect(await item(page, 3, 'getComputedStyle(li, "::before").backgroundColor')).toBe(transportAction);
    expect(await item(page, 1, 'getComputedStyle(li, "::after").backgroundColor')).toBe(await tokenOn(page, 1, '--sc-color-outline-variant'));
  });

  it('reads as a list of links with the entity and the attribution chip; numbers are not repeated', async () => {
    const page = await newScPage(HTML);
    const text = JSON.stringify(await page.accessibility.snapshot());
    expect(text).toContain('Update the address on your vehicle');
    expect(text).toContain('On Dubai Transport');
    expect(await page.evaluate(() => (document.querySelector('sc-step-list li') as HTMLElement).innerText.trim().startsWith('1'))).toBe(true); // visible marker
    expect(await item(page, 0, 'li.querySelector(".sc-step-list__marker").getAttribute("aria-hidden")')).toBe('true');
  });

  it('gives each title link a 44px target and reaches them with Tab', async () => {
    const page = await newScPage(HTML);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('href'))).toBe('#a');
    const target = await item(page, 0, 'getComputedStyle(li.querySelector("a"), "::after").height');
    expect(parseFloat(target)).toBeGreaterThanOrEqual(44);
  });

  it('moves the marker to the right and points the chevron left in Arabic', async () => {
    const page = await newScPage(HTML, { lang: 'ar' });
    expect(await item(page, 0, 'li.querySelector(".sc-step-list__marker").getBoundingClientRect().left > li.querySelector("a").getBoundingClientRect().right')).toBe(true);
    expect(await item(page, 0, 'getComputedStyle(li.querySelector(".sc-step-list__chevron svg")).transform')).toContain('matrix(-1');
    expect(await item(page, 2, 'li.querySelector(".sc-step-list__chip").textContent')).toBe('على مواصلات دبي');
  });
});

describeAxe('sc-step-list', HTML);
