import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext, settleTransitions } from '../../test/page';
import { axNode, inner, token } from '../sc-text-input/field-test';

const ALONE = `
  <main style="padding: 24px">
    <h1>Check your answers</h1>
    <form>
      <sc-checkbox id="c" name="confirm" value="yes" hint="We will send the registration card to this address">I confirm the vehicle details are correct</sc-checkbox>
      <sc-checkbox id="e" name="terms" error="Confirm that you accept the terms">I accept the terms</sc-checkbox>
      <sc-checkbox name="d" checked disabled>Registration card</sc-checkbox>
    </form>
  </main>`;

describe('sc-checkbox on its own (e2e)', () => {
  it('is a native checkbox in light DOM, named by its content and described by its hint', async () => {
    const page = await newScPage(ALONE);
    expect(await inner(page, '#c', '[host.shadowRoot, input.type]')).toEqual([null, 'checkbox']);
    const node = await axNode(page, '#c');
    expect(node!.role).toBe('checkbox');
    expect(node!.name).toBe('I confirm the vehicle details are correct');
    expect(node!.description).toBe('We will send the registration card to this address');
  });

  it('shows its own error with the bar and marks the box invalid', async () => {
    const page = await newScPage(ALONE);
    const node = await axNode(page, '#e');
    expect(node!.invalid).toBe('true');
    expect(node!.description).toBe('Error: Confirm that you accept the terms');
    expect(await inner(page, '#e', 'getComputedStyle(q(".sc-field")).borderLeftWidth')).toBe('4px');
    expect(await inner(page, '#e', 'getComputedStyle(input).borderTopColor')).toBe(await token(page, 'body', '--sc-color-error'));
  });

  it('toggles by clicking the label or the target around the box, and on Space', async () => {
    const page = await newScPage(ALONE);
    await page.click('#c label');
    expect(await page.$eval('#c', (el) => (el as HTMLElement & { checked: boolean }).checked)).toBe(true);
    // 8px outside the box, inside the 44px target.
    const p = await inner<{ x: number; y: number }>(page, '#c', '(({ x, y, height }) => ({ x: x - 8, y: y + height / 2 }))(input.getBoundingClientRect())');
    await page.mouse.click(p.x, p.y);
    expect(await inner(page, '#c', 'input.checked')).toBe(false);
    await page.keyboard.press('Space');
    expect(await inner(page, '#c', 'input.checked')).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('confirm'))).toBe('yes');
  });

  it('draws the check from the pointer but shows it at once from the keyboard (MOT-02)', async () => {
    const page = await newScPage(ALONE);
    await page.focus('#c input');
    await page.keyboard.press('Space');
    expect(await inner(page, '#c', 'getComputedStyle(q(".sc-check__path")).transitionDuration')).toBe('0s');
    expect(await inner(page, '#c', 'getComputedStyle(q(".sc-choice__mark")).opacity')).toBe('1');
  });

  it('draws the check in on the strong ease-out over 120ms; the fill and edge change on ease (MOT-04)', async () => {
    const page = await newScPage(ALONE);
    const enter = 'cubic-bezier(0.23, 1, 0.32, 1)';
    const hover = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
    const style = (sel: string) => inner<string[]>(page, '#c', `(s => [s.transitionProperty, s.transitionDuration, s.transitionTimingFunction])(getComputedStyle(q("${sel}")))`);
    expect(await style('.sc-check__path')).toEqual(['stroke-dashoffset', '0.12s', enter]);
    expect(await style('.sc-choice__mark')).toEqual(['opacity, transform, stroke-dashoffset', '0.12s, 0.12s, 0.12s', `${enter}, ${enter}, ${enter}`]);
    expect(await style('.sc-choice__box')).toEqual(['background-color, border-color', '0.12s, 0.12s', `${hover}, ${hover}`]);
    await page.click('#c label');
    expect(await inner(page, '#c', 'q(".sc-check__path").getAnimations().length')).toBe(1);
    await settleTransitions(page);
    expect(await inner(page, '#c', 'getComputedStyle(q(".sc-check__path")).strokeDashoffset')).toBe('0px');
  });

  it('follows lang for its error prefix', async () => {
    const page = await newScPage(ALONE);
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, '#e', 'q(".sc-field__error .visually-hidden").textContent')).toBe('خطأ: ');
  });

  it('shows the indeterminate state as a filled box with a bar, exposed as mixed, until toggled', async () => {
    const page = await newScPage(`<main style="padding:24px"><sc-checkbox id="all">All channels</sc-checkbox></main>`);
    await page.$eval('#all', (el) => ((el as HTMLElement & { indeterminate: boolean }).indeterminate = true));
    await page.waitForChanges();
    await settleTransitions(page);
    expect((await axNode(page, '#all'))!.checked).toBe('mixed');
    expect(await inner(page, '#all', 'getComputedStyle(q(".sc-choice__mark--mixed")).opacity')).toBe('1');
    expect(await inner(page, '#all', 'getComputedStyle(input).backgroundColor')).toBe(await token(page, 'body', '--sc-color-channel-action'));
    await page.click('#all label');
    expect(await inner(page, '#all', '[input.indeterminate, input.checked, host.indeterminate]')).toEqual([false, true, false]);
  });

});

describeAxe('sc-checkbox', ALONE);
