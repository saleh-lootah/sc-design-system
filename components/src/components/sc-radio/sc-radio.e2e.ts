import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';
import { axNode, inner } from '../sc-text-input/field-test';

const MARKUP = `
  <main style="padding: 24px">
    <h1>Renew for</h1>
    <sc-radio-group name="term" label="How long do you want to renew for?" value="1">
      <sc-radio id="one" value="1" hint="AED 450">1 year</sc-radio>
      <sc-radio id="two" value="2" hint="AED 900">2 years</sc-radio>
    </sc-radio-group>
  </main>`;

describe('sc-radio (e2e)', () => {
  it('renders a native radio in light DOM, named by its content and described by its hint', async () => {
    const page = await newScPage(MARKUP);
    expect(await inner(page, '#two', '[host.shadowRoot, input.type, input.name]')).toEqual([null, 'radio', 'term']);
    const node = await axNode(page, '#two');
    expect(node!.name).toBe('2 years');
    expect(node!.description).toBe('AED 900');
  });

  it('is a 24px circle in a target of at least 44 by 48, with a 12px dot when chosen', async () => {
    const page = await newScPage(MARKUP);
    expect(await inner(page, '#one', '[Math.round(input.getBoundingClientRect().width), getComputedStyle(input).borderTopLeftRadius, getComputedStyle(input).borderTopWidth]')).toEqual([24, '9999px', '2px']);
    expect(await inner(page, '#one', 'Math.round(q(".sc-choice__mark").getBoundingClientRect().width)')).toBe(12);
    expect(await inner<number>(page, '#one', 'q("label").getBoundingClientRect().height')).toBeGreaterThanOrEqual(48);
    // Clicking 8px outside the circle still chooses it.
    const p = await inner<{ x: number; y: number }>(page, '#two', '(({ x, y, height }) => ({ x: x - 8, y: y + height / 2 }))(input.getBoundingClientRect())');
    await page.mouse.click(p.x, p.y);
    expect(await inner(page, '#two', 'input.checked')).toBe(true);
  });

  it('forwards focus() to its radio', async () => {
    const page = await newScPage(MARKUP);
    await page.evaluate(() => (document.getElementById('two') as HTMLElement).focus());
    expect(await inner(page, '#two', 'document.activeElement === input')).toBe(true);
  });
});

describeAxe('sc-radio', MARKUP);
