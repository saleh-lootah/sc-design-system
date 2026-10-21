#!/usr/bin/env node
/**
 * Prints the test paths of the components rebuilt for v2 (perf-budgets.json "enforce"),
 * plus the shared test helpers, for CI's e2e job:
 *
 *   npx stencil test --e2e -- --max-workers=1 $(node scripts/v2-tags.mjs)
 *
 * v1 components are not tested in CI until their family agent rebuilds them (Wave 2b): they
 * are expected to look broken against v2 tokens. `npm run test:e2e` still runs everything.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { enforce = [] } = JSON.parse(readFileSync(join(root, 'perf-budgets.json'), 'utf8'));
console.log([...enforce.map((t) => `src/components/${t}/`), 'src/test/'].join(' '));
