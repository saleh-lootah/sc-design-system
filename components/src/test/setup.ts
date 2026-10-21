/**
 * Jest setup for every spec and e2e file (stencil.config.ts, testing.setupFilesAfterEnv).
 *
 * Stencil has no testing.testTimeout option, so v1's 90 s setting was silently ignored and
 * Jest kept its 45 s. The first test of a file pays for the browser and dev-server warm-up,
 * so allow 90 s per test here, where Jest honours it.
 */
jest.setTimeout(90_000);
