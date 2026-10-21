/**
 * e2e helpers shared by the v2 field tests (imported by *.e2e.ts only, never by a component).
 * v2 fields are light DOM, so everything is a plain query under the host.
 */
import type { E2EPage } from '@stencil/core/testing';

/**
 * Evaluates `expr` in the page with `host` (the element matching `selector`), `input` (its
 * first native control) and `q(css)` (querySelector inside the host).
 */
export function inner<T = unknown>(page: E2EPage, selector: string, expr: string): Promise<T> {
  return page.evaluate(
    (sel: string, e: string) => {
      const host = document.querySelector(sel)!;
      const input = host.querySelector('input:not([type=hidden]), textarea, select');
      const q = (css: string) => host.querySelector(css);
      // eslint-disable-next-line no-new-func
      return new Function('host', 'input', 'q', `return (${e});`)(host, input, q);
    },
    selector,
    expr,
  ) as Promise<T>;
}

/** The accessibility-tree node of an element inside `selector` (default: its native control). */
export async function axNode(page: E2EPage, selector: string, inside = 'input:not([type=hidden]), textarea, select') {
  const handle = await page.evaluateHandle((sel: string, q: string) => document.querySelector(sel)!.querySelector(q)!, selector, inside);
  return page.accessibility.snapshot({ root: handle as never, interestingOnly: false });
}

/** A token as the browser resolves it in the context of `selector`. */
export function token(page: E2EPage, selector: string, name: string, prop: 'backgroundColor' | 'outlineColor' = 'backgroundColor'): Promise<string> {
  return page.evaluate(
    (s: string, n: string, p: string) => {
      const probe = document.createElement('i');
      probe.style.setProperty('background-color', `var(${n})`);
      probe.style.setProperty('outline-color', `var(${n})`);
      document.querySelector(s)!.append(probe);
      const v = getComputedStyle(probe)[p as 'backgroundColor'];
      probe.remove();
      return v;
    },
    selector,
    name,
    prop,
  );
}

/** Emulates Windows High Contrast (forced colours) through the DevTools protocol. */
export async function forceColors(page: E2EPage): Promise<void> {
  const cdp = await (page as unknown as { createCDPSession: () => Promise<{ send: (m: string, p: object) => Promise<unknown> }> }).createCDPSession();
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
  await page.waitForChanges();
}

export const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const;
