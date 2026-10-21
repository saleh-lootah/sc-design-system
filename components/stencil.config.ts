import { Config } from '@stencil/core';

/**
 * Browser for e2e tests. Helium is Chromium-based; Chrome is not installed on
 * the reference machine. Override with SC_BROWSER=/path/to/chromium on CI.
 */
const browser = process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium';
// Stencil 4.45 ignores testing.browserExecutablePath when it launches Puppeteer; it only reads
// PUPPETEER_EXECUTABLE_PATH / CHROME_PATH. Set it here so `npm test` always uses Helium.
process.env.PUPPETEER_EXECUTABLE_PATH ||= browser;

/** Dubai W23 ships next to the document stylesheet, so `url(assets/fonts/…)` in sc.css resolves. */
const fonts = (dest: string) => ({ src: 'assets/fonts', dest, warn: true });
/** sc.css, the one document stylesheet (scripts/build-sc-css.mjs, run before every build). */
const scCss = (dest: string) => ({ src: 'global/generated/sc.css', dest, warn: true });

/**
 * Lazy-loader bundles: tags that appear together load as one request (architecture §3.6).
 * A tag missing from this list gets its own bundle. Family agents keep it in step.
 */
const bundles = [
  { components: ['sc-page', 'sc-skip-link', 'sc-app-bar', 'sc-language-switch', 'sc-footer', 'sc-back-link', 'sc-link'] },
  { components: ['sc-channel-hero', 'sc-service-card', 'sc-callout', 'sc-status-tag', 'sc-channel-chip', 'sc-card', 'sc-spinner', 'sc-step-progress', 'sc-container', 'sc-grid', 'sc-ltr'] },
  {
    components: [
      'sc-button',
      'sc-search',
      'sc-text-input',
      'sc-textarea',
      'sc-select',
      'sc-date-input',
      'sc-checkbox',
      'sc-checkbox-group',
      'sc-radio-group',
      'sc-radio',
      'sc-error-summary',
    ],
  },
  { components: ['sc-summary-list', 'sc-summary-row'] },
  { components: ['sc-table'] },
  { components: ['sc-date-range'] },
];

export const config: Config = {
  // Stencil requires a namespace of at least 3 characters, so not "sc"; it names the build folder and files.
  namespace: 'sc-components',
  // The shared helpers ONLY (focus ring, visually-hidden, icons, state layers, motion, .sc-link).
  // Stencil adopts this one sheet into every shadow root. Tokens, fonts and base styles are in
  // sc.css, which the page links; they do nothing inside a shadow root.
  globalStyle: 'src/global/shadow.css',
  bundles,
  // Nothing is hidden before hydration: light-DOM content paints at first paint, and sc.css
  // reserves each host's final size with :not(:defined) rules, so CLS stays 0.
  invisiblePrehydration: false,
  sourceMap: true,
  outputTargets: [
    {
      // Lazy-loaded build. Vanilla pages need one <link> (dist/sc-components/sc-components.css) and one <script> (dist/sc-components/sc-components.esm.js).
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [fonts('assets/fonts') /* relative to dist/sc-components/ */, scCss('sc.css')],
    },
    {
      // PRIMARY build, for applications and bundlers: `import '@sc/components/dist/components/sc-button.js'` defines the tag.
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
      copy: [fonts('build/assets/fonts'), scCss('build/sc.css'), { src: 'www', dest: 'playground' }],
    },
  ],
  testing: {
    browserExecutablePath: browser,
    // Stencil only accepts 'shell' or false. Puppeteer then passes plain --headless, which in
    // Chromium 132+ (Helium 0.19 is Chromium 155) is the new headless mode of the full browser.
    browserHeadless: 'shell',
    // GitHub's Ubuntu runners block Chromium's sandbox (AppArmor), so CI runs without it.
    browserArgs: ['--hide-scrollbars', ...(process.env.CI ? ['--no-sandbox'] : [])],
    // Keep the e2e page small and deterministic.
    browserWaitUntil: 'load',
    // Stencil does not pass testing.testTimeout on to Jest (it stayed at 45 s in v1), so the
    // timeout is set in src/test/setup.ts, which Jest runs before every test file.
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  },
  devServer: {
    reloadStrategy: 'pageReload',
    openBrowser: false,
    port: 3333,
  },
};
