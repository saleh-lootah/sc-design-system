import { newSpecPage } from '@stencil/core/testing';
import { ScTimeline } from './sc-timeline';

const LIST = `<ol>
  <li><sc-status-tag tone="error">Action needed</sc-status-tag><time>20 Oct 2026</time><p>Upload a clearer copy.</p></li>
  <li><sc-status-tag>In review</sc-status-tag><time>18 Oct 2026</time><p>Checking.</p></li>
</ol>`;

describe('sc-timeline (spec)', () => {
  it('keeps the author list in light DOM and marks the newest entry as current, with its tone', async () => {
    const page = await newSpecPage({ components: [ScTimeline], html: `<sc-timeline>${LIST}</sc-timeline>` });
    expect(page.root!.shadowRoot).toBeFalsy();
    const items = Array.from(page.root!.querySelectorAll('li'));
    expect(items.map((li) => li.getAttribute('aria-current'))).toEqual(['step', null]);
    expect(items.map((li) => li.getAttribute('data-tone'))).toEqual(['error', null]);
  });

  it('with order="oldest-first" the last entry is current', async () => {
    const page = await newSpecPage({ components: [ScTimeline], html: `<sc-timeline order="oldest-first">${LIST}</sc-timeline>` });
    const items = Array.from(page.root!.querySelectorAll('li'));
    expect(items.map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step']);
    expect(items[1].getAttribute('data-tone')).toBe('neutral');
  });
});
