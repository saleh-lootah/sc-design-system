/**
 * axe-core for Stencil e2e tests.
 *
 *   import { expectNoAxeViolations } from '../../test/axe';
 *   await expectNoAxeViolations(page);
 *
 *   // One test per context (EN/AR x light/dark), so a slow context cannot time out the rest:
 *   describeAxe('sc-button', ALL_STATES);
 *
 * Injects axe-core into the page and runs the WCAG 2.0/2.1/2.2 A and AA rules on the
 * whole document (axe looks inside open shadow roots). Fails with one readable line
 * per violation and affected node.
 */
import type { E2EPage } from '@stencil/core/testing';
import { contexts, newScPage, PageContext } from './page';
import { source as axeSource } from 'axe-core';
import type { AxeResults, Result } from 'axe-core';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export async function runAxe(page: E2EPage, context: string = 'body'): Promise<Result[]> {
  const hasAxe = await page.evaluate(() => 'axe' in window);
  if (!hasAxe) await page.addScriptTag({ content: axeSource });
  const results = (await page.evaluate(
    (ctx: string, tags: string[]) =>
      (window as unknown as { axe: { run: (c: string, o: object) => Promise<AxeResults> } }).axe.run(ctx, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations'],
      }),
    context,
    WCAG_TAGS,
  )) as AxeResults;
  return results.violations;
}

export function formatViolations(violations: Result[]): string {
  return violations
    .flatMap((v) => v.nodes.map((n) => `${v.id} (${v.impact}): ${v.help} -> ${JSON.stringify(n.target)} ${n.failureSummary ?? ''}`))
    .join('\n');
}

/** Fails the test if axe finds any WCAG A/AA violation. */
export async function expectNoAxeViolations(page: E2EPage, context?: string): Promise<void> {
  const violations = await runAxe(page, context);
  if (violations.length) throw new Error(`axe found ${violations.length} violation(s):\n${formatViolations(violations)}`);
}

/**
 * Registers one axe test per context (English and Arabic, light and dark) for a fragment of
 * markup. Call it inside a component's e2e file, at the top level or inside its describe().
 */
export function describeAxe(name: string, html: string, extra: Omit<PageContext, 'lang' | 'theme'> = {}): void {
  describe(`${name}: axe (WCAG 2.2 A and AA)`, () => {
    it.each(contexts)('has no violations in $lang, $theme', async (ctx) => {
      const page = await newScPage(html, { ...extra, ...ctx });
      await expectNoAxeViolations(page);
    });
  });
}
