import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

function es(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const root = document.querySelector(sel)!.shadowRoot!;
      // eslint-disable-next-line no-new-func
      return new Function('root', `return (${expr});`)(root);
    },
    selector,
    read,
  );
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.color = `var(${n})`;
    document.body.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, name);

const HTML = `<main><h1>Notifications</h1>
  <sc-empty-state id="d" heading="You have no notifications" heading-level="2" icon="inbox">When a service has news for you, it appears here.</sc-empty-state>
  <sc-empty-state id="s" variant="success" heading="You have no fines to pay" heading-level="2">Nothing is due on your vehicles.<sc-button slot="action" variant="secondary">View paid fines</sc-button></sc-empty-state>
</main>`;

describe('sc-empty-state (e2e)', () => {
  it('aligns to the start: a 48px icon in an 80px circle, then the heading and body', async () => {
    const page = await newScPage(HTML);
    expect(await es(page, '#d', 'root.querySelector("[part=icon]").getBoundingClientRect().width')).toBe(80);
    expect(await es(page, '#d', 'root.querySelector("[part=icon] svg").getBoundingClientRect().width')).toBe(48);
    expect(await es(page, '#d', 'root.querySelector("[part=icon]").getBoundingClientRect().left - root.querySelector("[part=container]").getBoundingClientRect().left')).toBe(32);
    expect(await es(page, '#d', 'getComputedStyle(root.querySelector("[part=body]")).color')).toBe(await token(page, '--sc-color-on-surface-variant'));
  });

  it('the all-clear variant uses the success colours, and the words carry the meaning', async () => {
    const page = await newScPage(HTML);
    expect(await es(page, '#s', 'getComputedStyle(root.querySelector("[part=icon]")).backgroundColor')).toBe(await token(page, '--sc-color-success-container'));
    expect(await es(page, '#s', 'getComputedStyle(root.querySelector("[part=icon]")).color')).toBe(await token(page, '--sc-color-success'));
    const text = JSON.stringify(await page.accessibility.snapshot());
    expect(text).toContain('You have no fines to pay');
    expect(text).toContain('View paid fines');
  });

  it('mirrors in Arabic: the icon sits at the right', async () => {
    const page = await newScPage(HTML, { lang: 'ar' });
    expect(await es(page, '#d', 'root.querySelector("[part=container]").getBoundingClientRect().right - root.querySelector("[part=icon]").getBoundingClientRect().right')).toBe(32);
  });
});

describeAxe('sc-empty-state', HTML);
