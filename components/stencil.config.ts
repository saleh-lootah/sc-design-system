import { Config } from '@stencil/core';

/**
 * Browser for e2e tests. Helium is Chromium-based; Chrome is not installed on
 * the reference machine. Override with SC_BROWSER=/path/to/chromium on CI.
 */
const browser = process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium';
// Stencil 4.45 ignores testing.browserExecutablePath when it launches Puppeteer; it only reads
// PUPPETEER_EXECUTABLE_PATH / CHROME_PATH. Set it here so `npm test` always uses Helium.
process.env.PUPPETEER_EXECUTABLE_PATH ||= browser;

/** Dubai W23 is shipped next to the global stylesheet, so `url(assets/fonts/…)` in sc.css resolves. */
const fonts = (dest: string) => ({ src: 'assets/fonts', dest, warn: true });

export const config: Config = {
  // Stencil requires a namespace of at least 3 characters, so not "sc"; it names the build folder and files.
  namespace: 'sc-components',
  // Tokens (../../dist/css/tokens.css is inlined via @import), @font-face and base body styles.
  globalStyle: 'src/global/sc.css',
  sourceMap: true,
  outputTargets: [
    {
      // Lazy-loaded build. Vanilla pages need one <link> (dist/sc-components/sc-components.css) and one <script> (dist/sc-components/sc-components.esm.js).
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [fonts('assets/fonts') /* relative to dist/sc-components/ */],
    },
    {
      // Tree-shakable build for bundlers: `import '@sc/components/dist/components/sc-button.js'` defines the tag.
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    {
      type: 'docs-readme',
      footer: '',
    },
    {
      type: 'docs-json',
      file: 'docs/components.json',
    },
    {
      // Playground: src/index.html + src/www (registry, pages, shell CSS/JS).
      type: 'www',
      serviceWorker: null,
      copy: [fonts('build/assets/fonts'), { src: 'www', dest: 'playground' }],
    },
  ],
  testing: {
    browserExecutablePath: browser,
    // Stencil only accepts 'shell' or false. Puppeteer then passes plain --headless, which in
    // Chromium 132+ (Helium 0.19 is Chromium 155) is the new headless mode of the full browser.
    browserHeadless: 'shell',
    browserArgs: ['--hide-scrollbars'],
    // Keep the e2e page small and deterministic.
    browserWaitUntil: 'load',
    // The first test in a suite pays for the browser and dev-server warm-up. Under load that can
    // exceed the default, so allow 90 s per test and cap parallel workers (see the npm scripts).
    testTimeout: 90000,
  },
  devServer: {
    reloadStrategy: 'pageReload',
    openBrowser: false,
    port: 3333,
  },
};
