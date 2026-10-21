import { newSpecPage } from '@stencil/core/testing';
import { ScStepList } from './sc-step-list';

const HTML = (lang = 'en') => `<div lang="${lang}" data-channel="now"><sc-step-list><ol>
  <li><a href="/a">Register your tenancy contract</a><span>Dubai Land Department</span></li>
  <li data-channel="transport"><a href="/b">Update the address on your vehicle</a><span>RTA</span></li>
  <li data-channel="transport"><a href="/c">Apply for a parking permit</a><span>RTA</span></li>
  <li data-channel="now"><a href="/d">Find a school nearby</a><span>KHDA</span></li>
</ol></sc-step-list></div>`;

describe('sc-step-list (spec)', () => {
  it('adds a hidden number marker and a decorative chevron to each row', async () => {
    const page = await newSpecPage({ components: [ScStepList], html: HTML() });
    const items = Array.from(page.body.querySelectorAll('li'));
    expect(items.map((li) => li.querySelector('.sc-step-list__marker')!.textContent)).toEqual(['1', '2', '3', '4']);
    expect(items.every((li) => li.querySelector('.sc-step-list__marker')!.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(items.every((li) => li.querySelector('.sc-step-list__chevron[aria-hidden="true"] svg') !== null)).toBe(true);
  });

  it('marks rows of another channel, joins neighbours of the same channel and adds the attribution chip', async () => {
    const page = await newSpecPage({ components: [ScStepList], html: HTML() });
    const items = Array.from(page.body.querySelectorAll('li'));
    expect(items.map((li) => li.classList.contains('sc-step-list__is-other'))).toEqual([false, true, true, false]);
    expect(items.map((li) => li.classList.contains('sc-step-list__is-joined-next'))).toEqual([false, true, false, false]);
    expect(items.map((li) => li.classList.contains('sc-step-list__is-joined-prev'))).toEqual([false, false, true, false]);
    expect(items[1].querySelector('.sc-step-list__chip')!.textContent).toBe('On Dubai Transport');
    expect(items[0].querySelector('.sc-step-list__chip')).toBeNull();
    // Same channel as the page: not attribution.
    expect(items[3].querySelector('.sc-step-list__chip')).toBeNull();
  });

  it('writes the chip in Arabic', async () => {
    const page = await newSpecPage({ components: [ScStepList], html: HTML('ar') });
    expect(page.body.querySelector('.sc-step-list__chip')!.textContent).toBe('على مواصلات دبي');
  });
});
