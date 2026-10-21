import { Config } from '@stencil/core';

/**
 * Browser for e2e tests. Helium is Chromium-based; Chrome is not installed on
 * the reference machine. Override with SC_BROWSER=/path/to/chromium on CI.
 */
const browser = process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium';
// Stencil 4.45 ignores testing.browserExecutablePath when it launches Puppeteer; it only reads
// PUPPETEER_EXECUTABLE_PATH / CHROME_PATH. Set it here so `npm test` always uses Helium.
process.env.PUPPETEER_EXECUTABLE_PATH ||= browser;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { minifyCss } = require('./scripts/lib/minify-css.cjs') as { minifyCss: (css: string) => string };

/**
 * Minifies every component stylesheet before Stencil scopes it. Stencil's own CSS minifier
 * bails out on at-rules nested in a block (`@layer sc.components { @media … }`) and then ships
 * the sheet as written: 16 source sheets, among them every light-DOM one (scripts/lib/minify-css.cjs).
 */
const minifyComponentCss = {
  name: 'minify-component-css',
  // A pluginType marks it as a Stencil plugin, which sees each stylesheet; without one Stencil
  // hands it to Rollup, which only sees the JS.
  pluginType: 'css',
  transform(code: string, id: string) {
    return id.endsWith('.css') && id.includes('/src/components/') ? { code: minifyCss(code) } : null;
  },
};

/**
 * Lazy loader: show a shadow component's light-DOM content until its code has arrived.
 *
 * The lazy loader defines every tag as soon as the runtime runs, and the defined element
 * attaches its (empty) shadow root in its constructor, long before its bundle arrives. An
 * empty shadow root renders nothing, so the hero, the service cards and every other shadow
 * component collapsed to zero height for one network round trip and then grew back: CLS 0.10
 * to 0.12 on the typical page even with every size reserved. The custom-elements build defines
 * a tag only when its code is there, so it never had this state.
 *
 * This patches Stencil's runtime (pinned at 4.45.2) as Rollup bundles it: the lazy host's
 * constructor puts placeholder `<slot>`s in the new shadow root (one per slot name its children
 * use, and the default slot), so the content renders as it did before the tag was defined, and
 * the first render removes them before Stencil patches the shadow root. After the first
 * render the DOM is exactly what it was. The build fails if either anchor is missing, which
 * flags a Stencil upgrade.
 */
/** One placeholder slot per slot name the host's children use, in order of appearance, plus the default slot. */
const placeholderSlots =
  'for (const n of Array.from(self.children, (c) => c.getAttribute("slot") || "").concat("").filter((n, i, a) => a.indexOf(n) === i)) ' +
  'self.shadowRoot.append(Object.assign(document.createElement("slot"), n ? { name: n, __scPlaceholder: true } : { __scPlaceholder: true }));';

const lazyShadowPlaceholder = {
  name: 'lazy-shadow-placeholder',
  transform(code: string, id: string) {
    if (!/@stencil[\\/]core[\\/]internal[\\/]client[\\/]index\.js(\?|$)/.test(id)) return null;
    const ctor = /(if \(!self\.shadowRoot\) \{\s*createShadowRoot\.call\(self, cmpMeta\);)/;
    const render = /(rootVnode\.\$elm\$ = oldVNode\.\$elm\$ = [^;]+;)/;
    if (!ctor.test(code) || !render.test(code)) {
      throw new Error('lazy-shadow-placeholder: Stencil runtime anchors not found. Re-check the patch in stencil.config.ts after a Stencil upgrade.');
    }
    // Same line as the anchor, so the runtime's line numbers don't move.
    const patched = code
      .replace(ctor, `$1 ${placeholderSlots}`)
      .replace(render, '$1 if (hostElm.shadowRoot) for (const n of Array.from(hostElm.shadowRoot.children)) if (n.__scPlaceholder) n.remove();');
    return { code: patched, map: null };
  },
};

/** Dubai W23 ships next to the document stylesheet, so `url(assets/fonts/…)` in sc.css resolves. */
const fonts = (dest: string) => ({ src: 'assets/fonts', dest, warn: true });
/** sc.css, the one document stylesheet (scripts/build-sc-css.mjs, run before every build). */
const scCss = (dest: string) => ({ src: 'global/generated/sc.css', dest, warn: true });

/**
 * Lazy-loader bundles: tags that appear together load as one request (architecture §3.6).
 * A tag missing from this list gets its own bundle. Family agents keep it in step.
 *
 * The first bundle is the page shell plus what a channel home or hub page shows above the
 * fold: the typical page (test/perf/typical-page.html) needs this bundle and nothing else, and
 * sc-button rides in it because nearly every page has one (sc-search renders one). One file
 * instead of two saves 1.2 KiB gzip of repeated chunk overhead on that page, and the chrome
 * and the hero hydrate in the same frame. A form page also loads the fields bundle, which no
 * longer duplicates sc-button. scripts/build-preload.mjs lists this bundle for modulepreload.
 */
const bundles = [
  { components: ['sc-page', 'sc-skip-link', 'sc-app-bar', 'sc-language-switch', 'sc-footer', 'sc-button', 'sc-channel-hero', 'sc-service-card', 'sc-search'] },
  { components: ['sc-back-link', 'sc-link', 'sc-callout', 'sc-status-tag', 'sc-channel-chip', 'sc-card', 'sc-spinner', 'sc-step-progress', 'sc-tile', 'sc-attention-card', 'sc-module-card'] },
  { components: ['sc-site-header', 'sc-channel-switcher', 'sc-account-menu', 'sc-announcement-bar', 'sc-utility-bar', 'sc-channel-network'] },
  { components: ['sc-text-input', 'sc-textarea', 'sc-select', 'sc-date-input', 'sc-checkbox', 'sc-checkbox-group', 'sc-radio-group', 'sc-radio', 'sc-error-summary'] },
  { components: ['sc-summary-list', 'sc-summary-row', 'sc-accordion'] },
  { components: ['sc-table'] },
  { components: ['sc-date-range'] },
  { components: ['sc-breadcrumbs', 'sc-pagination', 'sc-account-nav', 'sc-bottom-nav'] },
];

export const config: Config = {
  // Stencil requires a namespace of at least 3 characters, so not "sc"; it names the build folder and files.
  namespace: 'sc-components',
  // The shared helpers ONLY (focus ring, visually-hidden, icons, state layers, motion, .sc-link).
  // Stencil adopts this one sheet into every shadow root. Tokens, fonts and base styles are in
  // sc.css, which the page links; they do nothing inside a shadow root.
  globalStyle: 'src/global/shadow.css',
  bundles,
  plugins: [minifyComponentCss, lazyShadowPlaceholder],
  // Nothing is hidden before hydration: light-DOM content paints at first paint, and sc.css
  // reserves each host's final size with :not(:defined) rules (emitted to hold until .hydrated, see
  // scripts/build-sc-css.mjs), so CLS stays 0.
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
