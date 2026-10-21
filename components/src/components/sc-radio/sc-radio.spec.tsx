import { newSpecPage } from '@stencil/core/testing';
import { ScRadio } from './sc-radio';
import { ScRadioGroup } from '../sc-radio-group/sc-radio-group';

describe('sc-radio (spec)', () => {
  it('renders a labelled native radio in light DOM, with its hint', async () => {
    const page = await newSpecPage({ components: [ScRadio, ScRadioGroup], html: `<sc-radio-group name="term" value="2"><sc-radio value="1">1 year</sc-radio><sc-radio value="2" hint="AED 900">2 years</sc-radio></sc-radio-group>` });
    await page.waitForChanges();
    const inputs = Array.from(page.body.querySelectorAll('input'));
    expect(inputs.map((i) => i.getAttribute('type'))).toEqual(['radio', 'radio']);
    expect(inputs.map((i) => i.getAttribute('name'))).toEqual(['term', 'term']);
    expect(inputs[1].getAttribute('aria-describedby')).toBe(page.body.querySelectorAll('.sc-choice__hint')[0].id);
    const labels = Array.from(page.body.querySelectorAll('label'));
    expect(labels.map((l) => l.textContent)).toEqual(['1 year', '2 years']);
    expect(labels[1].getAttribute('for')).toBe(inputs[1].id);
  });
});
