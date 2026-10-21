import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.color = `var(${n})`;
    document.body.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, name);

const HTML = `<main><h1>Application A-2026-0412</h1><h2>History</h2>
<sc-timeline><ol>
  <li><sc-status-tag tone="error">Action needed</sc-status-tag><time datetime="2026-10-20T09:40">20 Oct 2026, 09:40</time><p>Upload a clearer copy of your Emirates ID.</p></li>
  <li><sc-status-tag>In review</sc-status-tag><time datetime="2026-10-18T14:05">18 Oct 2026, 14:05</time><p>RTA is checking your documents.</p></li>
  <li><sc-status-tag>Received</sc-status-tag><time datetime="2026-10-17T11:12">17 Oct 2026, 11:12</time><p>We received your application.</p></li>
</ol></sc-timeline></main>`;

const dot = (page: E2EPage, i: number, prop: string) =>
  page.evaluate((n: number, p: string) => (getComputedStyle(document.querySelectorAll('sc-timeline li')[n], '::before') as any)[p], i, prop);

describe('sc-timeline (e2e)', () => {
  it('draws a 12px dot per entry: the newest in its status tone, earlier ones in outline', async () => {
    const page = await newScPage(HTML);
    expect(await dot(page, 0, 'width')).toBe('12px');
    expect(await dot(page, 0, 'backgroundColor')).toBe(await token(page, '--sc-color-error'));
    expect(await dot(page, 1, 'backgroundColor')).toBe(await token(page, '--sc-color-outline'));
  });

  it('updates the current dot when the status tag tone changes', async () => {
    const page = await newScPage(HTML);
    await page.$eval('sc-timeline li sc-status-tag', (el) => el.setAttribute('tone', 'success'));
    await page.waitForChanges();
    expect(await dot(page, 0, 'backgroundColor')).toBe(await token(page, '--sc-color-success'));
  });

  it('joins entries with a 2px outline-variant connector', async () => {
    const page = await newScPage(HTML);
    const after = await page.evaluate(() => {
      const s = getComputedStyle(document.querySelector('sc-timeline li')!, '::after');
      return [s.width, s.backgroundColor];
    });
    expect(after).toEqual(['2px', await token(page, '--sc-color-outline-variant')]);
  });

  it('marks the latest entry as the current step for assistive tech', async () => {
    const page = await newScPage(HTML);
    expect(await page.$eval('sc-timeline li', (li) => li.getAttribute('aria-current'))).toBe('step');
  });

  it('puts the marker column on the right in Arabic', async () => {
    const page = await newScPage(HTML, { lang: 'ar' });
    const r = await page.evaluate(() => {
      const li = document.querySelector('sc-timeline li')!;
      const box = li.getBoundingClientRect();
      const tag = li.querySelector('sc-status-tag')!.getBoundingClientRect();
      return { start: parseFloat(getComputedStyle(li).paddingRight), tagRight: tag.right, liRight: box.right };
    });
    expect(r.start).toBe(36);
    expect(Math.round(r.liRight - r.tagRight)).toBe(36);
  });
});

describeAxe('sc-timeline', HTML);
